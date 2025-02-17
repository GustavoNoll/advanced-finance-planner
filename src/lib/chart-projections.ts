import { WithdrawalStrategy, calculateMonthlyWithdrawal } from './withdrawal-strategies';
import { yearlyReturnRateToMonthlyReturnRate } from './financial-math';
import { FinancialRecord, Goal, MonthNumber } from '@/types/financial';

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
  year: number;
  actualValue?: number | null;
  projectedValue?: number;
  realDataPoint?: boolean;
}

interface GoalForChart extends Goal {
  year: number;
  month: MonthNumber;
  value: number;
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

  // Convert goals to GoalForChart
  const goalsForChart = goals?.flatMap(goal => {
    const baseGoal = {
      ...goal,
      year: goal.year,
      month: goal.month as MonthNumber,
      value: goal.asset_value
    };

    if (!goal.installment_project || !goal.installment_count) {
      return [baseGoal];
    }

    // Create installments
    return Array.from({ length: goal.installment_count }, (_, index) => ({
      ...baseGoal,
      month: (((goal.month - 1 + index) % 12) + 1) as MonthNumber,
      year: goal.year + Math.floor((goal.month - 1 + index) / 12),
      value: goal.asset_value / goal.installment_count,
      isInstallment: true,
      installmentNumber: index + 1
    }));
  });

  const endAge = getEndAge();
  const yearsUntilEnd = endAge - investmentPlan.initial_age;
  const allAges = Array.from(
    { length: yearsUntilEnd + 1 }, 
    (_, i) => investmentPlan.initial_age + i
  );

  const projectedValues = generateProjectedPortfolioValues(investmentPlan, allAges, endAge, withdrawalStrategy, goalsForChart);
  const actualValues = generateHistoricalPortfolioValues(
    profile,
    investmentPlan,
    financialRecordsByYear,
    allAges,
    endAge,
    withdrawalStrategy,
    goalsForChart
  );


  const birthYear = new Date().getFullYear() - investmentPlan.initial_age;

  return allAges.map(age => ({
    age: age.toString(),
    year: birthYear + age,
    actualValue: actualValues.find(v => v.age === age)?.actualValue,
    projectedValue: projectedValues.find(v => v.age === age)?.projectedValue,
    realDataPoint: actualValues.find(v => v.age === age)?.realDataPoint
  }));
}

function generateProjectedPortfolioValues(
  investmentPlan: InvestmentPlan,
  allAges: number[],
  endAge: number,
  withdrawalStrategy: WithdrawalStrategy,
  goals?: GoalForChart[]
) {
  const monthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(
    investmentPlan.expected_return/100 + investmentPlan.inflation/100
  );
  const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);

  let currentBalance = investmentPlan.initial_amount;
  let currentMonthlyDeposit = investmentPlan.monthly_deposit;
  let currentMonthlyWithdrawal = investmentPlan.desired_income;
  const birthYear = new Date().getFullYear() - investmentPlan.initial_age;

  return allAges.map(age => {
    const currentYear = birthYear + age;
    
    for (let month = 0; month < 12; month++) {
      // Handle goals for current month/year
      const currentGoals = goals?.filter(goal => 
        goal.year === currentYear && goal.month === (month + 1)
      );
      
      if (currentGoals?.length) {
        const totalGoalWithdrawal = currentGoals.reduce((sum, goal) => sum + goal.value, 0);
        currentBalance -= totalGoalWithdrawal;
      }

      if (investmentPlan.adjust_contribution_for_inflation) {
        currentMonthlyDeposit *= (1 + monthlyInflationRate);
      }
      currentMonthlyWithdrawal *= (1 + monthlyInflationRate);

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
      year: currentYear,
      projectedValue: Math.round(Math.max(0, currentBalance)),
      actualValue: null,
      realDataPoint: false
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
  goals?: GoalForChart[]
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

  return allAges.map(age => {
    const year = birthYear + age;
    const record = financialRecordsByYear.find(record => record.record_year === year);
    if (record) {
      beforeFirstRecord = false;
      lastBalance = record.ending_balance;
      return { age, year, actualValue: lastBalance, projectedValue: null, realDataPoint: true };
    }

    if (beforeFirstRecord) {
      return { age, year, actualValue: 0, projectedValue: null, realDataPoint: false };
    }

    const monthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(
      investmentPlan.expected_return/100 + investmentPlan.inflation/100
    );
    const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
    const isRetirementAge = age >= investmentPlan.final_age;

    for (let month = 0; month < 12; month++) {
      // Handle goals for current month/year
      const currentGoals = goals?.filter(goal => 
        goal.year === year && goal.month === (month + 1)
      );
      
      if (currentGoals?.length) {
        const totalGoalWithdrawal = currentGoals.reduce((sum, goal) => sum + goal.value, 0);
        lastBalance -= totalGoalWithdrawal;
      }

      if (investmentPlan.adjust_contribution_for_inflation) {
        currentMonthlyDeposit *= (1 + monthlyInflationRate);
      }
      currentMonthlyWithdrawal *= (1 + monthlyInflationRate);

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
      year,
      actualValue: Math.round(Math.max(0, lastBalance)),
      realDataPoint: false,
      projectedValue: null
    };
  });
} 