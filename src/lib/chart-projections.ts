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

interface MonthlyProjectionData {
  month: number;
  contribution: number;
  withdrawal: number;
  isHistorical: boolean;
  balance: number;
  projected_balance: number;
  returns?: number;
  goalsEventsImpact?: number;
  difference_from_projected_balance: number;
}

interface YearlyProjectionData {
  age: number;
  year: number;
  contribution: number;
  withdrawal: number;
  balance: number;
  projected_balance: number;
  months?: MonthlyProjectionData[];
  isRetirementTransitionYear?: boolean;
  hasHistoricalData: boolean;
  returns: number;
  difference_from_projected_balance: number;
  goalsEventsImpact?: number;
}

export function generateProjectionData(
  investmentPlan: InvestmentPlan,
  profile: { birth_date: string },
  initialRecords: FinancialRecord[],
  goals?: Goal[],
  events?: ProjectedEvent[]
): YearlyProjectionData[] {
  const projectionData: YearlyProjectionData[] = [];
  
  if (!profile?.birth_date || !investmentPlan || !initialRecords.length) {
    return [];
  }

  const endAge = getEndAge(investmentPlan);
  const goalsForChart = processGoals(goals);
  const birthDate = new Date(profile.birth_date);
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth() + 1;
  const yearsUntilEnd = endAge - investmentPlan.initial_age;
  const currentDate = new Date();
  const startYear = birthYear + investmentPlan.initial_age;
  
  let currentBalance = initialRecords[0]?.ending_balance || 0;
  let projectedBalance = investmentPlan.initial_amount;
  let currentMonthlyDeposit = investmentPlan.monthly_deposit;
  let currentMonthlyWithdrawal = investmentPlan.desired_income;
  const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
  const monthlyExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
  const monthlyReturnRate = calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);

  const historicalRecordsMap = new Map(
    initialRecords.map(record => [
      `${record.record_year}-${record.record_month}`,
      record
    ])
  );
  
  for (let i = 0; i <= yearsUntilEnd; i++) {
    const age = investmentPlan.initial_age + i;
    const year = startYear + i;
    
    const monthlyData = Array.from({ length: 12 }, (_, month) => {
      const currentMonthNumber = month + 1;
      const historicalKey = `${year}-${currentMonthNumber}`;
      const historicalRecord = historicalRecordsMap.get(historicalKey);
      const isInPast = new Date(year, month) < currentDate;
        
      if (historicalRecord) {
        projectedBalance = (projectedBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
        return {
          month: currentMonthNumber,
          contribution: historicalRecord.monthly_contribution,
          withdrawal: 0,
          balance: historicalRecord.ending_balance,
          projected_balance: projectedBalance,
          isHistorical: true,
          difference_from_projected_balance: historicalRecord.ending_balance - projectedBalance
        };
      }

      if (isInPast) {
        projectedBalance = (projectedBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
        return {
          month: currentMonthNumber,
          contribution: 0,
          withdrawal: 0,
          balance: 0,
          projected_balance: projectedBalance,
          isHistorical: false,
          difference_from_projected_balance: projectedBalance - currentBalance
        };
      }

      const previousBalance = currentBalance;
      currentBalance = handleMonthlyGoalsAndEvents(
        currentBalance,
        year,
        currentMonthNumber - 1,
        goalsForChart,
        events
      );
      const goalsEventsImpact = currentBalance - previousBalance;

      const isRetirementAge = age > investmentPlan.final_age || 
        (age === investmentPlan.final_age && currentMonthNumber >= birthMonth);

      if (investmentPlan.adjust_contribution_for_inflation && !isRetirementAge) {
        currentMonthlyDeposit *= (1 + monthlyInflationRate);
      }
      currentMonthlyWithdrawal *= (1 + monthlyInflationRate);

      if (isRetirementAge) {
        const monthlyReturn = currentBalance * monthlyReturnRate;
        const withdrawal = currentMonthlyWithdrawal;
        
        currentBalance = (currentBalance - withdrawal) * (1 + monthlyReturnRate);
        projectedBalance = (projectedBalance - withdrawal) * (1 + monthlyReturnRate);

        return {
          month: currentMonthNumber,
          contribution: 0,
          withdrawal,
          balance: currentBalance,
          projected_balance: projectedBalance,
          returns: monthlyReturn,
          isHistorical: false,
          difference_from_projected_balance: projectedBalance - currentBalance,
          goalsEventsImpact: goalsEventsImpact
        };
      } else {
        const monthlyReturn = currentBalance * monthlyReturnRate;
        currentBalance = (currentBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
        projectedBalance = (projectedBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
        
        return {
          month: currentMonthNumber,
          contribution: currentMonthlyDeposit,
          withdrawal: 0,
          balance: currentBalance,
          projected_balance: projectedBalance,
          returns: monthlyReturn,
          isHistorical: false,
          difference_from_projected_balance: projectedBalance - currentBalance,
          goalsEventsImpact: goalsEventsImpact
        };
      }
    });

    const hasRetirementTransition = age === investmentPlan.final_age;
    const yearlyContribution = monthlyData.reduce((sum, month) => sum + month.contribution, 0);
    const yearlyWithdrawal = monthlyData.reduce((sum, month) => sum + month.withdrawal, 0);

    projectionData.push({
      age,
      year,
      contribution: yearlyContribution,
      withdrawal: yearlyWithdrawal,
      balance: monthlyData[11].balance,
      projected_balance: monthlyData[11].projected_balance,
      months: monthlyData,
      isRetirementTransitionYear: hasRetirementTransition,
      hasHistoricalData: monthlyData.some(m => m.isHistorical),
      returns: monthlyData[11].returns || 0,
      goalsEventsImpact: monthlyData.reduce((sum, month) => sum + (month.goalsEventsImpact || 0), 0),
      difference_from_projected_balance: monthlyData[11].projected_balance - monthlyData[11].balance
    });
  }

  return projectionData;
}

export function generateChartProjections(
  profile: { birth_date: string },
  investmentPlan: InvestmentPlan,
  financialRecordsByYear: FinancialRecord[],
  goals?: Goal[],
  events?: ProjectedEvent[],
): ChartDataPoint[] {
  const projectionData = generateProjectionData(
    investmentPlan,
    profile,
    financialRecordsByYear,
    goals,
    events
  );

  return projectionData.flatMap(yearData => 
    yearData.months?.map(monthData => ({
      age: yearData.age.toString(),
      year: yearData.year,
      month: monthData.month as MonthNumber,
      actualValue: monthData.balance,
      projectedValue: monthData.projected_balance,
      realDataPoint: monthData.isHistorical
    })) || []
  );
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