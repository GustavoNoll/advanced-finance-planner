import { WithdrawalStrategy, calculateMonthlyWithdrawal } from './withdrawal-strategies';
import { yearlyReturnRateToMonthlyReturnRate, calculateCompoundedRates } from './financial-math';
import { ChartDataPoint, FinancialRecord, Goal, MonthNumber, ProjectedEvent } from '@/types/financial';

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
  goals?: Goal[],
  events?: ProjectedEvent[]
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

  const birthYear = new Date(profile.birth_date).getFullYear();
  const projectedValues = generateProjectedPortfolioValues(birthYear, investmentPlan, allAges, endAge, withdrawalStrategy, goalsForChart, events);
  const actualValues = generateHistoricalPortfolioValues(
    birthYear,
    investmentPlan,
    financialRecordsByYear,
    allAges,
    endAge,
    withdrawalStrategy,
    goalsForChart,
    events
  );

  return allAges.map(age => ({
    age: age.toString(),
    year: birthYear + age,
    actualValue: actualValues.find(v => v.age === age)?.actualValue,
    projectedValue: projectedValues.find(v => v.age === age)?.projectedValue,
    realDataPoint: actualValues.find(v => v.age === age)?.realDataPoint
  }));
}

function handleMonthlyGoalsAndEvents(
  balance: number,
  year: number,
  month: number,
  goals?: GoalForChart[],
  events?: ProjectedEvent[]
): number {
  let updatedBalance = balance;

  // Handle goals
  const currentGoals = goals?.filter(goal => 
    goal.year === year && goal.month === (month + 1)
  );

  if (currentGoals?.length) {
    const totalGoalWithdrawal = currentGoals.reduce((sum, goal) => sum + goal.value, 0);
    updatedBalance -= totalGoalWithdrawal;
  }

  // Handle events
  const currentEvents = events?.filter(event => 
    event.year === year && event.month === (month + 1)
  );

  if (currentEvents?.length) {
    const totalEventWithdrawal = currentEvents.reduce((sum, event) => sum + event.amount, 0);
    updatedBalance += totalEventWithdrawal;
  }

  return updatedBalance;
}

function generateProjectedPortfolioValues(
  birthYear: number,
  investmentPlan: InvestmentPlan,
  allAges: number[],
  endAge: number,
  withdrawalStrategy: WithdrawalStrategy,
  goals?: GoalForChart[],
  events?: ProjectedEvent[]
) {
  const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
  const monthlyExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
  const monthlyReturnRate = calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);

  let currentBalance = investmentPlan.initial_amount;
  let currentMonthlyDeposit = investmentPlan.monthly_deposit;
  let currentMonthlyWithdrawal = investmentPlan.desired_income;

  return allAges.map(age => {
    const currentYear = birthYear + age;
    
    for (let month = 0; month < 12; month++) {
      // Replace goals handling with new function
      currentBalance = handleMonthlyGoalsAndEvents(
        currentBalance,
        currentYear,
        month,
        goals,
        events
      );

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
  birthYear: number,
  investmentPlan: InvestmentPlan,
  financialRecordsByYear: FinancialRecord[],
  allAges: number[],
  endAge: number,
  withdrawalStrategy: WithdrawalStrategy,
  goals?: GoalForChart[],
  events?: ProjectedEvent[]
) {

  if (financialRecordsByYear.length === 0) {
    return generateProjectedPortfolioValues(
      birthYear,
      investmentPlan,
      allAges,
      endAge,
      withdrawalStrategy,
      goals,
      events
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

    const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
    const monthlyExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
    const monthlyReturnRate = calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);
    const isRetirementAge = age >= investmentPlan.final_age;

    for (let month = 0; month < 12; month++) {
      // Replace goals and events handling with new function
      lastBalance = handleMonthlyGoalsAndEvents(
        lastBalance,
        year,
        month,
        goals,
        events
      );

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