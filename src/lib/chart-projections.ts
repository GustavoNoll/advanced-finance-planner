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

interface DataPoint {
  age: string;
  month: MonthNumber;
  year: number;
}

interface GoalForChart extends Goal {
  year: number;
  month: MonthNumber;
  value: number;
  isInstallment?: boolean;
  installmentNumber?: number;
}

export function generateChartProjections(
  profile: { birth_date: string },
  investmentPlan: InvestmentPlan,
  financialRecordsByYear: FinancialRecord[],
  goals?: Goal[],
  events?: ProjectedEvent[],
): ChartDataPoint[] {
  const birthYear = new Date(profile.birth_date).getFullYear();
  const endAge = getEndAge(investmentPlan);
  const yearsUntilEnd = endAge - investmentPlan.initial_age;
  const goalsForChart = processGoals(goals);
  
  // Generate monthly data points
  const allDataPoints = generateDataPoints(investmentPlan, yearsUntilEnd, birthYear);

  const projectedValues = generateProjectedPortfolioValues(
    investmentPlan,
    allDataPoints,
    endAge,
    goalsForChart,
    events
  );

  const actualValues = generateHistoricalPortfolioValues(
    investmentPlan,
    financialRecordsByYear,
    allDataPoints,
    endAge,
    goalsForChart,
    events
  );

  return allDataPoints.map(point => ({
    age: point.age,
    year: point.year,
    month: point.month,
    actualValue: actualValues.find(v => v.age === point.age && v.month === point.month)?.actualValue,
    projectedValue: projectedValues.find(v => v.age === point.age && v.month === point.month)?.projectedValue,
    realDataPoint: actualValues.find(v => v.age === point.age && v.month === point.month)?.realDataPoint
  }));
}

export function getEndAge(investmentPlan: InvestmentPlan): number {
  if (investmentPlan.limit_age) {
    return investmentPlan.limit_age;
  }
  return 100;
}

export function processGoals(goals?: Goal[]): GoalForChart[] {
  if (!goals) return [];
  
  return goals.flatMap(goal => {
    const baseGoal = {
      ...goal,
      year: goal.year,
      month: goal.month as MonthNumber,
      value: goal.asset_value
    };

    if (!goal.installment_project || !goal.installment_count) {
      return [baseGoal];
    }

    return Array.from({ length: goal.installment_count }, (_, index) => ({
      ...baseGoal,
      month: (((goal.month - 1 + index) % 12) + 1) as MonthNumber,
      year: goal.year + Math.floor((goal.month - 1 + index) / 12),
      value: goal.asset_value / goal.installment_count,
      isInstallment: true,
      installmentNumber: index + 1
    }));
  });
}

export function generateDataPoints(
  investmentPlan: InvestmentPlan,
  yearsUntilEnd: number,
  birthYear: number
): DataPoint[] {
  return Array.from(
    { length: (yearsUntilEnd) * 12 + 1 }, 
    (_, i) => {
      const monthsFromStart = i;
      const age = investmentPlan.initial_age + (monthsFromStart / 12);
      return {
        age: age.toFixed(1),
        month: ((monthsFromStart % 12) + 1) as MonthNumber,
        year: birthYear + Math.floor(age)
      };
    }
  );
}

export function handleMonthlyGoalsAndEvents(
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

export function generateProjectedPortfolioValues(
  investmentPlan: InvestmentPlan,
  allDataPoints: DataPoint[],
  endAge: number,
  goals?: GoalForChart[],
  events?: ProjectedEvent[],
  includeEvents: boolean = false
) {
  const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
  const monthlyExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
  const monthlyReturnRate = calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);

  let currentBalance = investmentPlan.initial_amount;
  let currentMonthlyDeposit = investmentPlan.monthly_deposit;
  let currentMonthlyWithdrawal = investmentPlan.desired_income;

  return allDataPoints.map(point => {
    const age = parseFloat(point.age);
    
    if (includeEvents) {
      currentBalance = handleMonthlyGoalsAndEvents(
        currentBalance,
        point.year,
        point.month - 1,
        goals,
        events
      );
    }

    if (investmentPlan.adjust_contribution_for_inflation) {
      currentMonthlyDeposit *= (1 + monthlyInflationRate);
    }
    currentMonthlyWithdrawal *= (1 + monthlyInflationRate);

    const isRetirementAge = age >= investmentPlan.final_age;
    
    if (isRetirementAge) {
      const withdrawal = currentMonthlyWithdrawal
      
      currentBalance = (currentBalance - withdrawal) * (1 + monthlyReturnRate);
    } else {
      currentBalance = (currentBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
    }
    
    return {
      age: point.age,
      year: point.year,
      month: point.month,
      projectedValue: Math.round(Math.max(0, currentBalance)),
      actualValue: null,
      realDataPoint: false
    };
  });
}

export function generateHistoricalPortfolioValues(
  investmentPlan: InvestmentPlan,
  allFinancialRecords: FinancialRecord[],
  allDataPoints: DataPoint[],
  endAge: number,
  goals?: GoalForChart[],
  events?: ProjectedEvent[]
) {
  if (allFinancialRecords.length === 0) {
    const projectedValues = generateProjectedPortfolioValues(
      investmentPlan,
      allDataPoints,
      endAge,
      goals,
      events,
      true
    );
    
      return projectedValues.map(value => ({
        ...value,
        actualValue: value.projectedValue,
        projectedValue: null
      }));
  }

  // Sort records chronologically
  const sortedRecords = allFinancialRecords.sort((a, b) => {
    if (a.record_year !== b.record_year) {
      return a.record_year - b.record_year;
    }
    return a.record_month - b.record_month;
  });

  const firstRecord = sortedRecords[0];
  const lastRecord = sortedRecords[sortedRecords.length - 1];

  // Initialize projection variables
  const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
  const monthlyExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
  const monthlyReturnRate = calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);
  
  let currentBalance = lastRecord.ending_balance;
  let currentMonthlyDeposit = investmentPlan.monthly_deposit;
  let currentMonthlyWithdrawal = investmentPlan.desired_income;

  return allDataPoints.map(point => {
    // Check if this point is before our first historical record
    if (
      point.year < firstRecord.record_year || 
      (point.year === firstRecord.record_year && point.month < firstRecord.record_month)
    ) {
      return {
        age: point.age,
        year: point.year,
        month: point.month,
        actualValue: 0,
        projectedValue: null,
        realDataPoint: false
      };
    }

    // Apply inflation adjustments
    if (investmentPlan.adjust_contribution_for_inflation) {
      currentMonthlyDeposit *= (1 + monthlyInflationRate);
    }
    currentMonthlyWithdrawal *= (1 + monthlyInflationRate);

    // Check if we have actual data for this point
    const record = allFinancialRecords.find(record => 
      record.record_year === point.year && 
      record.record_month === point.month
    );
    
    if (record) {
      currentBalance = record.ending_balance; // Update balance for future projections
      return {
        age: point.age,
        year: point.year,
        month: point.month,
        actualValue: record.ending_balance,
        projectedValue: null,
        realDataPoint: true
      };
    }

    // If this point is after our last historical record, project values
    if (
      point.year > lastRecord.record_year || 
      (point.year === lastRecord.record_year && point.month > lastRecord.record_month)
    ) {
      const age = parseFloat(point.age);
      
      // Handle monthly goals and events
      currentBalance = handleMonthlyGoalsAndEvents(
        currentBalance,
        point.year,
        point.month - 1,
        goals,
        events
      );

      // Calculate balance changes based on retirement status
      const isRetirementAge = age >= investmentPlan.final_age;
      
      if (isRetirementAge) {
        const withdrawal = currentMonthlyWithdrawal
        
        currentBalance = (currentBalance - withdrawal) * (1 + monthlyReturnRate);
      } else {
        currentBalance = (currentBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
      }

      return {
        age: point.age,
        year: point.year,
        month: point.month,
        actualValue: Math.round(Math.max(0, currentBalance)),
        projectedValue: null,
        realDataPoint: false
      };
    }

    // For gaps in historical data
    return {
      age: point.age,
      year: point.year,
      month: point.month,
      actualValue: null,
      projectedValue: null,
      realDataPoint: false
    };
  });
} 