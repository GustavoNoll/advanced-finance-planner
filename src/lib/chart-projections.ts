import { WithdrawalStrategy, calculateMonthlyWithdrawal } from './withdrawal-strategies';
import { yearlyReturnRateToMonthlyReturnRate } from './financial-math';
import { FinancialRecord, Goal } from '@/types/financial';

interface InvestmentPlan {
  initial_amount: number;
  monthly_deposit: number;
  expected_return: number;
  inflation: number;
  initial_age: number;
  final_age: number;
  desired_income: number;
  adjust_contribution_for_inflation: boolean;
  plan_type: string;
  limit_age?: number;
}

interface ChartDataPoint {
  age: string;
  actualValue?: number | null;
  projectedValue?: number;
  goalAchievedProjected?: boolean;
  goalAchievedActual?: boolean;
}

export function generateChartProjections(
  profile: { birth_date: string },
  investmentPlan: InvestmentPlan,
  financialRecordsByYear: FinancialRecord[],
  withdrawalStrategy: WithdrawalStrategy,
  goals?: Goal[]
): ChartDataPoint[] {
  const getEndAge = () => {
    if ((investmentPlan.plan_type === "1" || investmentPlan.plan_type === "2") && investmentPlan.limit_age) {
      return investmentPlan.limit_age;
    }
    return 120;
  };

  const endAge = getEndAge();
  const yearsUntilEnd = endAge - investmentPlan.initial_age;
  const allAges = Array.from(
    { length: yearsUntilEnd + 1 }, 
    (_, i) => investmentPlan.initial_age + i
  );

  const projectedValues = generateProjectedPortfolioValues(investmentPlan, allAges, endAge, withdrawalStrategy, goals);
  const actualValues = generateHistoricalPortfolioValues(
    profile,
    investmentPlan,
    financialRecordsByYear,
    allAges,
    endAge,
    withdrawalStrategy,
    goals
  );

  return allAges.map(age => ({
    age: age.toString(),
    actualValue: actualValues.find(v => v.age === age)?.actualValue,
    projectedValue: projectedValues.find(v => v.age === age)?.projectedValue,
    goalAchievedProjected: projectedValues.find(v => v.age === age)?.goalAchieved,
    goalAchievedActual: actualValues.find(v => v.age === age)?.goalAchieved
  }));
}

function generateProjectedPortfolioValues(
  investmentPlan: InvestmentPlan,
  allAges: number[],
  endAge: number,
  withdrawalStrategy: WithdrawalStrategy,
  goals?: Goal[]
) {
  const monthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(
    investmentPlan.expected_return/100 + investmentPlan.inflation/100
  );
  const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);

  let currentBalance = investmentPlan.initial_amount;
  let currentMonthlyDeposit = investmentPlan.monthly_deposit;
  let currentMonthlyWithdrawal = investmentPlan.desired_income;
  
  // Sort goals by priority (lower number = higher priority)
  const pendingGoals = goals 
    ? [...goals].sort((a, b) => a.priority - b.priority)
    : [];

  return allAges.map(age => {
    let goalAchievedThisYear = false;
    
    for (let month = 0; month < 12; month++) {
      if (investmentPlan.adjust_contribution_for_inflation) {
        currentMonthlyDeposit *= (1 + monthlyInflationRate);
      }
      currentMonthlyWithdrawal *= (1 + monthlyInflationRate);

      if (pendingGoals.length > 0) {
        const highestPriorityGoal = pendingGoals[0];
        if (currentBalance >= highestPriorityGoal.target_amount) {
          currentBalance -= highestPriorityGoal.target_amount;
          pendingGoals.shift();
          goalAchievedThisYear = true;
        }
      }

      const isRetirementAge = age >= investmentPlan.final_age;
      
      if (isRetirementAge) {
        const monthsUntilEnd = (endAge - age) * 12 - month;
        const withdrawal = calculateMonthlyWithdrawal(
          withdrawalStrategy,
          {
            currentBalance,
            monthlyReturnRate,
            monthlyInflationRate,
            currentAge: age,
            monthsUntilEnd,
            currentMonth: month,
            desiredIncome: currentMonthlyWithdrawal
          }
        );
        
        currentBalance = (currentBalance - withdrawal) * (1 + monthlyReturnRate);
      } else {
        currentBalance = (currentBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
      }
    }
    
    return {
      age,
      projectedValue: Math.round(Math.max(0, currentBalance)),
      goalAchieved: goalAchievedThisYear
    };
  });
}

function generateHistoricalPortfolioValues(
  profile: { birth_date: string },
  investmentPlan: InvestmentPlan,
  financialRecordsByYear: FinancialRecord[],
  allAges: number[],
  endAge: number,
  withdrawalStrategy: WithdrawalStrategy,
  goals?: Goal[]
) {
  const birthYear = new Date(profile.birth_date).getFullYear();

  if (financialRecordsByYear.length === 0) {
    return generateProjectedPortfolioValues(
      investmentPlan,
      allAges,
      endAge,
      withdrawalStrategy,
      goals
    );
  }

  let beforeFirstRecord = true;
  let lastBalance = 0;
  let currentMonthlyDeposit = investmentPlan.monthly_deposit;
  let currentMonthlyWithdrawal = investmentPlan.desired_income;

  // Sort goals by priority (lower number = higher priority)
  const pendingGoals = goals 
    ? [...goals].sort((a, b) => a.priority - b.priority)
    : [];

  return allAges.map(age => {
    let goalAchievedThisYear = false;
    const year = birthYear + age;
    const record = financialRecordsByYear.find(record => record.record_year === year);
    
    if (record) {
      beforeFirstRecord = false;
      lastBalance = record.ending_balance;

      if (pendingGoals.length > 0) {
        const highestPriorityGoal = pendingGoals[0];
        if (lastBalance >= highestPriorityGoal.target_amount) {
          lastBalance -= highestPriorityGoal.target_amount;
          pendingGoals.shift();
          goalAchievedThisYear = true;
        }
      }

      return { age, actualValue: lastBalance, goalAchieved: goalAchievedThisYear };
    }

    if (beforeFirstRecord) {
      return { age, actualValue: 0 };
    }

    const monthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(
      investmentPlan.expected_return/100 + investmentPlan.inflation/100
    );
    const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
    const isRetirementAge = age >= investmentPlan.final_age;

    for (let month = 0; month < 12; month++) {
      if (investmentPlan.adjust_contribution_for_inflation) {
        currentMonthlyDeposit *= (1 + monthlyInflationRate);
      }
      currentMonthlyWithdrawal *= (1 + monthlyInflationRate);

      if (pendingGoals.length > 0) {
        const highestPriorityGoal = pendingGoals[0];
        if (lastBalance >= highestPriorityGoal.target_amount) {
          lastBalance -= highestPriorityGoal.target_amount;
          pendingGoals.shift();
          goalAchievedThisYear = true;
        }
      }

      if (isRetirementAge) {
        const monthsUntilEnd = (endAge - age) * 12 - month;
        const withdrawal = calculateMonthlyWithdrawal(
          withdrawalStrategy,
          {
            currentBalance: lastBalance,
            monthlyReturnRate,
            monthlyInflationRate,
            currentAge: age,
            monthsUntilEnd,
            currentMonth: month,
            desiredIncome: currentMonthlyWithdrawal
          }
        );
        
        lastBalance = (lastBalance - withdrawal) * (1 + monthlyReturnRate);
      } else {
        lastBalance = (lastBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
      }
    }

    return { 
      age, 
      actualValue: Math.max(0, lastBalance),
      goalAchieved: goalAchievedThisYear 
    };
  });
} 