import { yearlyReturnRateToMonthlyReturnRate, calculateCompoundedRates } from './financial-math';
import { ChartDataPoint, FinancialRecord, Goal, InvestmentPlan, MonthNumber, ProjectedEvent } from '@/types/financial';
import { createIPCARatesMap } from './inflation-utils';

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
  retirement: boolean;
  planned_balance: number;
  returns?: number;
  goalsEventsImpact?: number;
  difference_from_planned_balance: number;
  ipcaRate: number;
  effectiveRate: number;
  accumulatedInflation: number;
}

export interface YearlyProjectionData {
  age: number;
  year: number;
  contribution: number;
  withdrawal: number;
  balance: number;
  planned_balance: number;
  months?: MonthlyProjectionData[];
  isRetirementTransitionYear?: boolean;
  hasHistoricalData: boolean;
  returns: number;
  difference_from_planned_balance: number;
  goalsEventsImpact?: number;
  ipcaRate: number;
  effectiveRate: number;
}

interface ProjectedEventForChart extends ProjectedEvent {
  value: number;
  isInstallment?: boolean;
  installmentNumber?: number;
}

export function generateProjectionData(
  investmentPlan: InvestmentPlan,
  profile: { birth_date: string },
  initialRecords: FinancialRecord[],
  goals?: Goal[],
  events?: ProjectedEvent[]
): YearlyProjectionData[] {
  const projectionData: YearlyProjectionData[] = [];
  
  if (!profile?.birth_date || !investmentPlan) {
    return [];
  }

  const endAge = getEndAge(investmentPlan);
  const goalsForChart = processGoals(goals);
  const eventsForChart = processEvents(events);
  console.log(goalsForChart);
  console.log(eventsForChart);
  const birthDate = new Date(profile.birth_date);
  const birthYear = birthDate.getFullYear();
  
  // Calculate initial age from plan_initial_date and birth_date
  const planStartDate = new Date(investmentPlan.plan_initial_date);
  const initialAge = planStartDate.getFullYear() - birthYear;
  const yearsUntilEnd = endAge - initialAge;
  const currentDate = new Date();
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startYear = planStartDate.getFullYear();
  const startMonth = planStartDate.getMonth() + 1;
  
  let currentBalance = initialRecords[0]?.ending_balance || investmentPlan.initial_amount;
  let projectedBalance = investmentPlan.initial_amount;
  let currentMonthlyDeposit = investmentPlan.monthly_deposit;
  let currentMonthlyWithdrawal = investmentPlan.desired_income;
  
  // Default to the estimated inflation rate if no IPCA data is available
  const defaultMonthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
  const monthlyExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
  let accumulatedInflation = 1;
  
  // Create a map of IPCA rates by year and month for easy lookup
  const endDate = new Date(investmentPlan.plan_end_accumulation_date);
  const adjustedPlanStartDate = new Date(planStartDate);
  adjustedPlanStartDate.setMonth(adjustedPlanStartDate.getMonth() - 1);
  const ipcaRatesMap = createIPCARatesMap(adjustedPlanStartDate, endDate);
  
  let lastHistoricalRecord = null;

  const historicalRecordsMap = new Map(
    initialRecords.map(record => [
      `${record.record_year}-${record.record_month}`,
      record
    ])
  );
  
  for (let i = 0; i <= yearsUntilEnd; i++) {
    const age = initialAge + i;
    const year = startYear + i;
    
    const monthlyData = Array.from({ length: 12 }, (_, month) => {
      const currentMonthNumber = month + 1;
      // Skip months before the plan start month in the first year
      if (i === 0 && currentMonthNumber < startMonth) {
        return null;
      }

      const isRetirementAge = year > endDate.getFullYear() ||
        (year === endDate.getFullYear() && currentMonthNumber >= endDate.getMonth() + 2);

      // Get the IPCA rate for this month if available, otherwise use the default
      const ipcaKey = `${year}-${currentMonthNumber}`;
      const monthlyInflationRate = ipcaRatesMap.has(ipcaKey) 
        ? ipcaRatesMap.get(ipcaKey)! 
        : defaultMonthlyInflationRate;
      accumulatedInflation = calculateCompoundedRates([accumulatedInflation, monthlyInflationRate]);
      
      // Calculate the monthly return rate based on the expected return and inflation
      const monthlyReturnRate = calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);

      if (investmentPlan.adjust_contribution_for_inflation && !isRetirementAge) {
        currentMonthlyDeposit *= (1 + monthlyInflationRate);
      }
      if (investmentPlan.adjust_income_for_inflation) {
        currentMonthlyWithdrawal *= (1 + monthlyInflationRate);
      }
      
      const historicalKey = `${year}-${currentMonthNumber}`;
      const historicalRecord = historicalRecordsMap.get(historicalKey);
      const isInPast = lastHistoricalRecord ? lastHistoricalRecord > new Date(year, month) : new Date(year, month) < nextMonth;
        
      if (historicalRecord) {
        lastHistoricalRecord = new Date(year, month + 1);
        projectedBalance = (projectedBalance) * (1 + monthlyReturnRate) + (currentMonthlyDeposit);
        return {
          month: currentMonthNumber,
          contribution: historicalRecord.monthly_contribution,
          withdrawal: 0,
          balance: historicalRecord.ending_balance,
          planned_balance: projectedBalance,
          goalsEventsImpact: historicalRecord.events_balance,
          isHistorical: true,
          retirement: isRetirementAge,
          difference_from_planned_balance: historicalRecord.ending_balance - projectedBalance,
          effectiveRate: monthlyReturnRate,
          ipcaRate: monthlyInflationRate,
          accumulatedInflation: accumulatedInflation
        };
      }

      if (isInPast) {
        projectedBalance = (projectedBalance) * (1 + monthlyReturnRate) + (currentMonthlyDeposit);
        return {
          month: currentMonthNumber,
          contribution: 0,
          withdrawal: 0,
          balance: 0,
          retirement: false,
          planned_balance: projectedBalance,
          goalsEventsImpact: 0,
          isHistorical: false,
          effectiveRate: monthlyReturnRate,
          difference_from_planned_balance: projectedBalance - currentBalance,
          ipcaRate: monthlyInflationRate,
          accumulatedInflation: accumulatedInflation
        };
      }

      const previousBalance = currentBalance;
      currentBalance = handleMonthlyGoalsAndEvents(
        currentBalance,
        year,
        currentMonthNumber - 1,
        accumulatedInflation,
        goalsForChart,
        eventsForChart,
      );
      const goalsEventsImpact = currentBalance - previousBalance;


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
          planned_balance: projectedBalance,
          returns: monthlyReturn,
          isHistorical: false,
          difference_from_planned_balance: currentBalance - projectedBalance,
          goalsEventsImpact,
          retirement: isRetirementAge,
          effectiveRate: monthlyReturnRate,
          ipcaRate: monthlyInflationRate,
          accumulatedInflation: accumulatedInflation
        };
      }

      currentBalance = (currentBalance) * (1 + monthlyReturnRate) + (currentMonthlyDeposit);
      projectedBalance = (projectedBalance) * (1 + monthlyReturnRate) + (currentMonthlyDeposit);
      return {
        month: currentMonthNumber,
        contribution: currentMonthlyDeposit,
        withdrawal: 0,
        balance: currentBalance,
        planned_balance: projectedBalance,
        isHistorical: false,
        difference_from_planned_balance: currentBalance - projectedBalance,
        goalsEventsImpact,
        retirement: false,
        monthlyReturnRate,
        ipcaRate: monthlyInflationRate,
        effectiveRate: monthlyReturnRate,
        accumulatedInflation: accumulatedInflation
      };
    }).filter(Boolean) as MonthlyProjectionData[];

    if (monthlyData.length > 0) {
      const yearlyContribution = monthlyData.reduce((sum, month) => sum + month.contribution, 0);
      const yearlyWithdrawal = monthlyData.reduce((sum, month) => sum + month.withdrawal, 0);
      const lastMonth = monthlyData[monthlyData.length - 1];
      const yearlyReturns = monthlyData.reduce((sum, month) => {
        const monthReturn = month.balance - (month.balance / (1 + monthlyExpectedReturnRate)) - month.contribution + month.withdrawal;
        return sum + monthReturn;
      }, 0);
      const yearlyGoalsEventsImpact = monthlyData.reduce((sum, month) => sum + (month.goalsEventsImpact || 0), 0);

      projectionData.push({
        age,
        year,
        contribution: yearlyContribution,
        withdrawal: yearlyWithdrawal,
        balance: lastMonth.balance,
        planned_balance: lastMonth.planned_balance,
        months: monthlyData,
        isRetirementTransitionYear: age === investmentPlan.final_age,
        hasHistoricalData: monthlyData.some(month => month.isHistorical),
        returns: yearlyReturns,
        difference_from_planned_balance: lastMonth.difference_from_planned_balance,
        goalsEventsImpact: yearlyGoalsEventsImpact,
        ipcaRate: calculateCompoundedRates(monthlyData.map(month => month.ipcaRate || 0)),
        effectiveRate: calculateCompoundedRates(monthlyData.map(month => month.effectiveRate))
      });
    }
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
      projectedValue: monthData.planned_balance,
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

/**
 * Processes a single event into one or more chart events based on installment settings
 * @param event - The event to process
 * @returns An array of processed events for the chart
 */
function processSingleEvent(event: ProjectedEvent): ProjectedEventForChart[] {
  const baseEvent = {
    ...event,
    year: event.year,
    month: event.month as MonthNumber,
    value: event.asset_value
  };

  if (!event.installment_project || !event.installment_count) {
    return [baseEvent];
  }

  return Array.from({ length: event.installment_count }, (_, index) => {
    const monthOffset = event.month + index;
    const yearOffset = Math.floor((monthOffset - 1) / 12);
    const month = ((monthOffset - 1) % 12) + 1;
    
    return {
      ...baseEvent,
      value: event.asset_value / event.installment_count,
      isInstallment: true,
      installmentNumber: index + 1,
      month: month as MonthNumber,
      year: event.year + yearOffset
    };
  });
}

/**
 * Processes a single goal into one or more chart goals based on installment settings
 * @param goal - The goal to process
 * @returns An array of processed goals for the chart
 */
function processSingleGoal(goal: Goal): GoalForChart[] {
  const baseGoal = {
    ...goal,
    year: goal.year,
    month: goal.month as MonthNumber,
    value: goal.asset_value
  };

  if (!goal.installment_project || !goal.installment_count) {
    return [baseGoal];
  }

  return Array.from({ length: goal.installment_count }, (_, index) => {
    const monthOffset = goal.month + index;
    const yearOffset = Math.floor((monthOffset - 1) / 12);
    const month = ((monthOffset - 1) % 12) + 1;
    
    return {
      ...baseGoal,
      month: month as MonthNumber,
      year: goal.year + yearOffset,
      value: goal.asset_value / goal.installment_count,
      isInstallment: true,
      installmentNumber: index + 1
    };
  });
}

/**
 * Processes an array of events into chart events, handling installments
 * @param events - Optional array of events to process
 * @returns Array of processed events for the chart
 */
export function processEvents(events?: ProjectedEvent[]): ProjectedEventForChart[] {
  if (!events) return [];
  return events.flatMap(processSingleEvent);
}

/**
 * Processes an array of goals into chart goals, handling installments
 * @param goals - Optional array of goals to process
 * @returns Array of processed goals for the chart
 */
export function processGoals(goals?: Goal[]): GoalForChart[] {
  if (!goals) return [];
  return goals.flatMap(processSingleGoal);
}

export function generateDataPoints(
  investmentPlan: InvestmentPlan,
  yearsUntilEnd: number,
  birthYear: number
): DataPoint[] {
  const planStartDate = new Date(investmentPlan.plan_initial_date);
  const startYear = planStartDate.getFullYear();
  const startMonth = planStartDate.getMonth() + 1;
  const initialAge = startYear - birthYear;

  return Array.from(
    { length: (yearsUntilEnd) * 12 + (12 - startMonth + 1) }, 
    (_, i) => {
      const monthsFromStart = i;
      const age = initialAge + (monthsFromStart / 12);
      const month = ((startMonth - 1 + monthsFromStart) % 12) + 1;
      const year = startYear + Math.floor((startMonth - 1 + monthsFromStart) / 12);
      
      return {
        age: age.toFixed(1),
        month: month as MonthNumber,
        year
      };
    }
  );
}

export function handleMonthlyGoalsAndEvents(
  balance: number,
  year: number,
  month: number,
  accumulatedInflation: number,
  goals?: GoalForChart[],
  events?: ProjectedEventForChart[]
): number {
  let updatedBalance = balance;
  
  // Handle goals
  const currentGoals = goals?.filter(goal => 
    goal.year === year && goal.month === (month + 1)
  );

  if (currentGoals?.length) {
    const totalGoalWithdrawal = currentGoals.reduce((sum, goal) => sum + goal.value, 0);
    updatedBalance -= totalGoalWithdrawal * accumulatedInflation;
  }

  // Handle events
  const currentEvents = events?.filter(event => 
    event.year === year && event.month === (month + 1)
  );

  if (currentEvents?.length) {
    const totalEventWithdrawal = currentEvents.reduce((sum, event) => sum + event.value, 0);
    updatedBalance += totalEventWithdrawal * accumulatedInflation;
  }

  return updatedBalance;
}