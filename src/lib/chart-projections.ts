import { yearlyReturnRateToMonthlyReturnRate, calculateCompoundedRates } from './financial-math';
import { ChartDataPoint, FinancialRecord, Goal, InvestmentPlan, MonthNumber, ProjectedEvent } from '@/types/financial';
import { createIPCARatesMap } from './inflation-utils';
import { processGoalsForChart, processEventsForChart, ProcessedGoalEvent } from '@/lib/financial-goals-processor';

interface DataPoint {
  age: string;
  month: MonthNumber;
  year: number;
}

interface MonthlyProjectionData {
  month: number;
  contribution: number;
  withdrawal: number;
  isHistorical: boolean;
  balance: number;
  projected_lifetime_withdrawal: number;
  planned_lifetime_withdrawal: number;
  old_portfolio_balance: number | null;
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
  projected_lifetime_withdrawal: number;
  planned_balance: number;
  planned_lifetime_withdrawal: number;
  old_portfolio_balance: number | null;
  months?: MonthlyProjectionData[];
  isRetirementTransitionYear?: boolean;
  hasHistoricalData: boolean;
  returns: number;
  difference_from_planned_balance: number;
  goalsEventsImpact?: number;
  ipcaRate: number;
  effectiveRate: number;
}

export interface ChartOptions {
  changeMonthlyDeposit?: {
    value: number;
    date: string; // formato: 'YYYY-MM-DD'
  };
  changeMontlhyWithdraw?: {
    value: number;
    date: string; // formato: 'YYYY-MM-DD'
  };
}

interface ProjectionContext {
  investmentPlan: InvestmentPlan;
  profile: { birth_date: string };
  initialRecords: FinancialRecord[];
  goals?: Goal[];
  events?: ProjectedEvent[];
  chartOptions?: ChartOptions;
  birthDate: Date;
  birthYear: number;
  planStartDate: Date;
  initialAge: number;
  endAge: number;
  yearsUntilEnd: number;
  startYear: number;
  startMonth: number;
  endDate: Date;
  oldPortfolioProfitability: number | null;
  defaultMonthlyInflationRate: number;
  monthlyExpectedReturnRate: number;
  monthlyOldPortfolioExpectedReturnRate: number;
  ipcaRatesMap: Map<string, number>;
  historicalRecordsMap: Map<string, FinancialRecord>;
  changeDepositDate: Date | null;
  changeWithdrawDate: Date | null;
  limitAgeDate: Date | null;
}

function createProjectionContext(
  investmentPlan: InvestmentPlan,
  profile: { birth_date: string },
  initialRecords: FinancialRecord[],
  goals?: Goal[],
  events?: ProjectedEvent[],
  chartOptions?: ChartOptions
): ProjectionContext | null {
  if (!profile?.birth_date || !investmentPlan) {
    return null;
  }

  const birthDate = new Date(profile.birth_date);
  const birthYear = birthDate.getFullYear();
  const planStartDate = new Date(investmentPlan.plan_initial_date);
  const initialAge = planStartDate.getFullYear() - birthYear;
  const endAge = getEndAge(investmentPlan);
  const yearsUntilEnd = endAge - initialAge;
  const startYear = planStartDate.getFullYear();
  const startMonth = planStartDate.getMonth() + 1;
  const endDate = new Date(investmentPlan.plan_end_accumulation_date);
  const limitAgeDate = new Date(birthDate);
  limitAgeDate.setFullYear(birthDate.getFullYear() + endAge);
  
  const oldPortfolioProfitability = investmentPlan.old_portfolio_profitability;
  const defaultMonthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation / 100);
  const monthlyExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return / 100);
  const monthlyOldPortfolioExpectedReturnRate = oldPortfolioProfitability 
    ? yearlyReturnRateToMonthlyReturnRate(oldPortfolioProfitability / 100) 
    : 0;

  // Create IPCA rates map
  const adjustedPlanStartDate = new Date(planStartDate);
  adjustedPlanStartDate.setMonth(adjustedPlanStartDate.getMonth() - 1);
  const ipcaRatesMap = createIPCARatesMap(adjustedPlanStartDate, endDate);

  // Create historical records map
  const historicalRecordsMap = new Map(
    initialRecords.map(record => [
      `${record.record_year}-${record.record_month}`,
      record
    ])
  );

  // Parse chart options dates
  const changeDepositDate = chartOptions?.changeMonthlyDeposit?.date 
    ? new Date(chartOptions.changeMonthlyDeposit.date) 
    : null;
  const changeWithdrawDate = chartOptions?.changeMontlhyWithdraw?.date 
    ? new Date(chartOptions.changeMontlhyWithdraw.date) 
    : null;

  return {
    investmentPlan,
    profile,
    initialRecords,
    goals,
    events,
    chartOptions,
    birthDate,
    birthYear,
    planStartDate,
    initialAge,
    endAge,
    yearsUntilEnd,
    startYear,
    startMonth,
    endDate,
    oldPortfolioProfitability,
    defaultMonthlyInflationRate,
    monthlyExpectedReturnRate,
    monthlyOldPortfolioExpectedReturnRate,
    ipcaRatesMap,
    historicalRecordsMap,
    changeDepositDate,
    changeWithdrawDate,
    limitAgeDate
  };
}

function shouldApplyContribution(
  year: number, 
  month: number, 
  startYear: number, 
  startMonth: number
): boolean {
  // No primeiro mês do plano, não aplicar contribuição
  if (year === startYear && month === startMonth) {
    return false;
  }
  return true;
}

function calculateMonthlyRates(
  year: number,
  month: number,
  ipcaRatesMap: Map<string, number>,
  defaultMonthlyInflationRate: number,
  monthlyExpectedReturnRate: number,
  monthlyOldPortfolioExpectedReturnRate: number
): { monthlyInflationRate: number; monthlyReturnRate: number; monthlyOldPortfolioReturnRate: number } {
  const ipcaKey = `${year}-${month}`;
  const monthlyInflationRate = ipcaRatesMap.has(ipcaKey) 
    ? ipcaRatesMap.get(ipcaKey)! 
    : defaultMonthlyInflationRate;

  const monthlyReturnRate = calculateCompoundedRates([
    monthlyExpectedReturnRate, 
    monthlyInflationRate
  ]);

  const monthlyOldPortfolioReturnRate = calculateCompoundedRates([
    monthlyOldPortfolioExpectedReturnRate, 
    monthlyInflationRate
  ]);

  return { monthlyInflationRate, monthlyReturnRate, monthlyOldPortfolioReturnRate };
}

function createHistoricalMonthData(
  historicalRecord: FinancialRecord,
  month: number,
  year: number,
  plannedBalance: number,
  oldPortfolioBalance: number | null,
  isRetirementAge: boolean,
  monthlyReturnRate: number,
  monthlyOldPortfolioReturnRate: number,
  monthlyInflationRate: number,
  accumulatedInflation: number,
  expectedReturn: number
): MonthlyProjectionData {
  const contribution = historicalRecord.monthly_contribution > 0 ? historicalRecord.monthly_contribution : 0;
  const withdrawal = historicalRecord.monthly_contribution < 0 ? Math.abs(historicalRecord.monthly_contribution) : 0;

  return {
    month,
    contribution,
    withdrawal,
    balance: historicalRecord.ending_balance,
    planned_balance: plannedBalance,
    goalsEventsImpact: historicalRecord.events_balance || 0,
    isHistorical: true,
    retirement: isRetirementAge,
    difference_from_planned_balance: historicalRecord.ending_balance - plannedBalance,
    projected_lifetime_withdrawal: historicalRecord.ending_balance / (expectedReturn / 100),
    planned_lifetime_withdrawal: plannedBalance / (expectedReturn / 100),
    effectiveRate: monthlyReturnRate,
    ipcaRate: monthlyInflationRate,
    accumulatedInflation,
    old_portfolio_balance: oldPortfolioBalance
  };
}

function createPastMonthData(
  month: number,
  plannedBalance: number,
  projectedBalance: number,
  oldPortfolioBalance: number | null,
  monthlyReturnRate: number,
  monthlyInflationRate: number,
  accumulatedInflation: number,
  expectedReturn: number
): MonthlyProjectionData {
  return {
    month,
    contribution: 0,
    withdrawal: 0,
    balance: 0,
    retirement: false,
    planned_balance: plannedBalance,
    projected_lifetime_withdrawal: projectedBalance / (expectedReturn / 100),
    planned_lifetime_withdrawal: plannedBalance / (expectedReturn / 100),
    goalsEventsImpact: 0,
    isHistorical: false,
    effectiveRate: monthlyReturnRate,
    difference_from_planned_balance: plannedBalance - projectedBalance,
    ipcaRate: monthlyInflationRate,
    accumulatedInflation,
    old_portfolio_balance: oldPortfolioBalance
  };
}

function createRetirementMonthData(
  month: number,
  projectedBalance: number,
  plannedBalance: number,
  oldPortfolioBalance: number | null,
  monthlyReturnRate: number,
  monthlyOldPortfolioReturnRate: number,
  monthlyInflationRate: number,
  accumulatedInflation: number,
  monthlyWithdrawal: number,
  goalsEventsImpact: number,
  expectedReturn: number
): MonthlyProjectionData {
  const monthlyReturn = projectedBalance * monthlyReturnRate;

  return {
    month,
    contribution: 0,
    withdrawal: monthlyWithdrawal,
    balance: projectedBalance,
    planned_balance: plannedBalance,
    projected_lifetime_withdrawal: projectedBalance / (expectedReturn / 100),
    planned_lifetime_withdrawal: plannedBalance / (expectedReturn / 100),
    returns: monthlyReturn,
    isHistorical: false,
    difference_from_planned_balance: projectedBalance - plannedBalance,
    goalsEventsImpact,
    retirement: true,
    effectiveRate: monthlyReturnRate,
    ipcaRate: monthlyInflationRate,
    accumulatedInflation,
    old_portfolio_balance: oldPortfolioBalance
  };
}

function createFutureMonthData(
  month: number,
  projectedBalance: number,
  plannedBalance: number,
  oldPortfolioBalance: number | null,
  monthlyReturnRate: number,
  monthlyInflationRate: number,
  accumulatedInflation: number,
  goalsEventsImpact: number,
  monthlyDeposit: number,
  expectedReturn: number
): MonthlyProjectionData {
  return {
    month,
    contribution: monthlyDeposit,
    withdrawal: 0,
    balance: projectedBalance,
    planned_balance: plannedBalance,
    isHistorical: false,
    projected_lifetime_withdrawal: projectedBalance / (expectedReturn / 100),
    planned_lifetime_withdrawal: plannedBalance / (expectedReturn / 100),
    difference_from_planned_balance: projectedBalance - plannedBalance,
    goalsEventsImpact,
    retirement: false,
    ipcaRate: monthlyInflationRate,
    effectiveRate: monthlyReturnRate,
    accumulatedInflation,
    old_portfolio_balance: oldPortfolioBalance
  };
}

export function generateProjectionData(
  investmentPlan: InvestmentPlan,
  profile: { birth_date: string },
  initialRecords: FinancialRecord[],
  goals?: Goal[],
  events?: ProjectedEvent[],
  chartOptions?: ChartOptions
): YearlyProjectionData[] {
  const context = createProjectionContext(
    investmentPlan, 
    profile, 
    initialRecords, 
    goals, 
    events, 
    chartOptions
  );
  
  if (!context) return [];

  const projectionData: YearlyProjectionData[] = [];
  const goalsForChart = processGoals(goals);
  const eventsForChart = processEvents(events);

  let oldPortfolioBalance = context.oldPortfolioProfitability ? investmentPlan.initial_amount : null;
  let projectedBalance = initialRecords[0]?.ending_balance || investmentPlan.initial_amount;
  let plannedBalance = investmentPlan.initial_amount;
  let currentMonthlyDeposit = investmentPlan.monthly_deposit;
  let currentMonthlyWithdrawal = investmentPlan.desired_income;
  let accumulatedInflation = 1;
  let lastHistoricalRecord: Date | null = null;

  for (let i = 0; i <= context.yearsUntilEnd; i++) {
    const age = context.initialAge + i;
    const year = context.startYear + i;
    
    const monthlyData = Array.from({ length: 12 }, (_, month) => {
      const currentMonthNumber = month + 1;
      
      // Skip months before the plan start month in the first year
      if (i === 0 && currentMonthNumber < context.startMonth) {
        return null;
      }

      // Skip months after the limit age date
      if (context.limitAgeDate && year > context.limitAgeDate.getFullYear() ||
        (year === context.limitAgeDate.getFullYear() && currentMonthNumber > context.limitAgeDate.getMonth() + 1)) {
        return null;
      }

      // Check for deposit/withdrawal changes
      if (context.changeDepositDate && 
          context.changeDepositDate.getFullYear() === year && 
          context.changeDepositDate.getMonth() + 1 === currentMonthNumber) {
        currentMonthlyDeposit = chartOptions!.changeMonthlyDeposit!.value;
      }
      
      if (context.changeWithdrawDate && 
          context.changeWithdrawDate.getFullYear() === year && 
          context.changeWithdrawDate.getMonth() + 1 === currentMonthNumber) {
        currentMonthlyWithdrawal = chartOptions!.changeMontlhyWithdraw!.value;
      }

      const isRetirementAge = year > context.endDate.getFullYear() ||
        (year === context.endDate.getFullYear() && currentMonthNumber >= context.endDate.getMonth() + 2);

      // Calculate rates
      const { monthlyInflationRate, monthlyReturnRate, monthlyOldPortfolioReturnRate } = 
        calculateMonthlyRates(
          year, 
          currentMonthNumber, 
          context.ipcaRatesMap, 
          context.defaultMonthlyInflationRate,
          context.monthlyExpectedReturnRate,
          context.monthlyOldPortfolioExpectedReturnRate
        );
      
      accumulatedInflation *= (1 + monthlyInflationRate);

      // Adjust for inflation
      if (investmentPlan.adjust_contribution_for_inflation && !isRetirementAge) {
        currentMonthlyDeposit *= (1 + monthlyInflationRate);
      }
      if (investmentPlan.adjust_income_for_inflation) {
        currentMonthlyWithdrawal *= (1 + monthlyInflationRate);
      }
      
      // Handle goals and events for planned balance
      plannedBalance = handleMonthlyGoalsAndEvents(
        plannedBalance,
        year,
        currentMonthNumber - 1,
        accumulatedInflation,
        goalsForChart,
        eventsForChart,
      );

      if (context.oldPortfolioProfitability) {
        oldPortfolioBalance = handleMonthlyGoalsAndEvents(
          oldPortfolioBalance!,
          year,
          currentMonthNumber - 1,
          accumulatedInflation,
          goalsForChart,
          eventsForChart,
        );
      }

      // Check for historical record
      const historicalKey = `${year}-${currentMonthNumber}`;
      const historicalRecord = context.historicalRecordsMap.get(historicalKey);
      const isInPast = lastHistoricalRecord 
        ? lastHistoricalRecord > new Date(year, month) 
        : new Date(year, month) < new Date();

      if (historicalRecord) {
        lastHistoricalRecord = new Date(year, month + 1);
        
        // Apply returns and contribution (if applicable)
        const shouldContribute = shouldApplyContribution(year, currentMonthNumber, context.startYear, context.startMonth);
        const contribution = shouldContribute ? currentMonthlyDeposit : 0;
        
        plannedBalance = plannedBalance * (1 + monthlyReturnRate) + contribution;
        if (context.oldPortfolioProfitability) {
          oldPortfolioBalance = oldPortfolioBalance! * (1 + monthlyOldPortfolioReturnRate) + contribution;
        }

        return createHistoricalMonthData(
          historicalRecord,
          currentMonthNumber,
          year,
          plannedBalance,
          oldPortfolioBalance,
          isRetirementAge,
          monthlyReturnRate,
          monthlyOldPortfolioReturnRate,
          monthlyInflationRate,
          accumulatedInflation,
          investmentPlan.expected_return
        );
      }

      if (isInPast) {
        const shouldContribute = shouldApplyContribution(year, currentMonthNumber, context.startYear, context.startMonth);
        const contribution = shouldContribute ? currentMonthlyDeposit : 0;
        
        plannedBalance = plannedBalance * (1 + monthlyReturnRate) + contribution;
        if (context.oldPortfolioProfitability) {
          oldPortfolioBalance = oldPortfolioBalance! * (1 + monthlyOldPortfolioReturnRate) + contribution;
        }

        return createPastMonthData(
          currentMonthNumber,
          plannedBalance,
          projectedBalance,
          oldPortfolioBalance,
          monthlyReturnRate,
          monthlyInflationRate,
          accumulatedInflation,
          investmentPlan.expected_return
        );
      }

      // Future month
      const previousBalance = projectedBalance;
      projectedBalance = handleMonthlyGoalsAndEvents(
        projectedBalance,
        year,
        currentMonthNumber - 1,
        accumulatedInflation,
        goalsForChart,
        eventsForChart,
      );
      const goalsEventsImpact = projectedBalance - previousBalance;

      if (isRetirementAge) {
        const monthlyReturn = projectedBalance * monthlyReturnRate;
        const withdrawal = currentMonthlyWithdrawal;
        
        projectedBalance = (projectedBalance - withdrawal) * (1 + monthlyReturnRate);
        plannedBalance = (plannedBalance - withdrawal) * (1 + monthlyReturnRate);
        if (context.oldPortfolioProfitability) {
          oldPortfolioBalance = (oldPortfolioBalance! - withdrawal) * (1 + monthlyOldPortfolioReturnRate);
        }

        return createRetirementMonthData(
          currentMonthNumber,
          projectedBalance,
          plannedBalance,
          oldPortfolioBalance,
          monthlyReturnRate,
          monthlyOldPortfolioReturnRate,
          monthlyInflationRate,
          accumulatedInflation,
          withdrawal,
          goalsEventsImpact,
          investmentPlan.expected_return
        );
      }

      // Regular future month
      const shouldContribute = shouldApplyContribution(year, currentMonthNumber, context.startYear, context.startMonth);
      const contribution = shouldContribute ? currentMonthlyDeposit : 0;
      
      projectedBalance = projectedBalance * (1 + monthlyReturnRate) + contribution;
      plannedBalance = plannedBalance * (1 + monthlyReturnRate) + contribution;
      if (context.oldPortfolioProfitability) {
        oldPortfolioBalance = oldPortfolioBalance! * (1 + monthlyOldPortfolioReturnRate) + contribution;
      }

      return createFutureMonthData(
        currentMonthNumber,
        projectedBalance,
        plannedBalance,
        oldPortfolioBalance,
        monthlyReturnRate,
        monthlyInflationRate,
        accumulatedInflation,
        goalsEventsImpact,
        contribution,
        investmentPlan.expected_return
      );
    }).filter(Boolean) as MonthlyProjectionData[];

    if (monthlyData.length > 0) {
      const yearlyContribution = monthlyData.reduce((sum, month) => sum + month.contribution, 0);
      const yearlyWithdrawal = monthlyData.reduce((sum, month) => sum + month.withdrawal, 0);
      const lastMonth = monthlyData[monthlyData.length - 1];
      const yearlyReturns = monthlyData.reduce((sum, month) => {
        const monthReturn = month.balance - (month.balance / (1 + context.monthlyExpectedReturnRate)) - month.contribution + month.withdrawal;
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
        projected_lifetime_withdrawal: lastMonth.balance / (investmentPlan.expected_return / 100),
        planned_lifetime_withdrawal: lastMonth.planned_balance / (investmentPlan.expected_return / 100),
        months: monthlyData,
        isRetirementTransitionYear: age === investmentPlan.final_age,
        hasHistoricalData: monthlyData.some(month => month.isHistorical),
        returns: yearlyReturns,
        difference_from_planned_balance: lastMonth.difference_from_planned_balance,
        goalsEventsImpact: yearlyGoalsEventsImpact,
        ipcaRate: calculateCompoundedRates(monthlyData.map(month => month.ipcaRate || 0)),
        effectiveRate: calculateCompoundedRates(monthlyData.map(month => month.effectiveRate)),
        old_portfolio_balance: lastMonth.old_portfolio_balance || null
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
  chartOptions?: ChartOptions
): ChartDataPoint[] {
  const projectionData = generateProjectionData(
    investmentPlan,
    profile,
    financialRecordsByYear,
    goals,
    events,
    chartOptions
  );

  return projectionData.flatMap(yearData => 
    yearData.months?.map(monthData => ({
      age: yearData.age.toString(),
      year: yearData.year,
      month: monthData.month as MonthNumber,
      actualValue: monthData.balance,
      projectedValue: monthData.planned_balance,
      oldPortfolioValue: monthData.old_portfolio_balance,
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
 * Processes an array of events into chart events, handling installments
 * @param events - Optional array of events to process
 * @returns Array of processed events for the chart
 */
export function processEvents(events?: ProjectedEvent[]): ProcessedGoalEvent[] {
  if (!events) return [];
  return processEventsForChart(events);
}

/**
 * Processes an array of goals into chart goals, handling installments
 * @param goals - Optional array of goals to process
 * @returns Array of processed goals for the chart
 */
export function processGoals(goals?: Goal[]): ProcessedGoalEvent[] {
  if (!goals) return [];
  return processGoalsForChart(goals);
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
  goals?: ProcessedGoalEvent[],
  events?: ProcessedGoalEvent[]
): number {
  let updatedBalance = balance;
  
  // Handle goals
  const currentGoals = goals?.filter(goal => 
    goal.year === year && goal.month === (month + 1)
  );

  if (currentGoals?.length) {
    const totalGoalWithdrawal = currentGoals.reduce((sum, goal) => sum + goal.amount, 0);
    updatedBalance -= totalGoalWithdrawal * accumulatedInflation;
  }

  // Handle events
  const currentEvents = events?.filter(event => 
    event.year === year && event.month === (month + 1)
  );

  if (currentEvents?.length) {
    const totalEventWithdrawal = currentEvents.reduce((sum, event) => sum + event.amount, 0);
    updatedBalance += totalEventWithdrawal * accumulatedInflation;
  }

  return updatedBalance;
}