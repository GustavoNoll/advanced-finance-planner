import { yearlyReturnRateToMonthlyReturnRate, calculateCompoundedRates } from './financial-math';
import { ChartDataPoint, FinancialRecord, Goal, InvestmentPlan, MicroInvestmentPlan, MonthNumber, ProjectedEvent } from '@/types/financial';
import { createIPCARatesMap } from './inflation-utils';
import { processGoalsForChart, processEventsForChart, ProcessedGoalEvent, IGNORE_FINANCIAL_LINKS, CONSIDER_FINANCIAL_LINKS } from '@/lib/financial-goals-processor';
import { createDateWithoutTimezone, createDateFromYearMonth } from '@/utils/dateUtils';
import { getActiveMicroPlanForDate } from '@/utils/microPlanUtils';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface DataPoint {
  age: string;
  month: MonthNumber;
  year: number;
}

export interface MonthlyProjectionData {
  month: MonthNumber;
  year: number;
  contribution: number;
  planned_contribution: number;
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
  planned_contribution: number;
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
    enabled?: boolean;
    value: number;
    date: string; // formato: 'YYYY-MM' ou 'YYYY-MM-DD'
  };
  changeMonthlyWithdraw?: {
    enabled?: boolean;
    value: number;
    date: string; // formato: 'YYYY-MM' ou 'YYYY-MM-DD'
  };
  showRealValues?: boolean;
  showNegativeValues?: boolean;
  showOldPortfolio?: boolean;
  showProjectedLine?: boolean;
  showPlannedLine?: boolean;
}

interface ProjectionContext {
  investmentPlan: InvestmentPlan;
  profile: { birth_date: string };
  initialRecords: FinancialRecord[];
  goals?: Goal[];
  events?: ProjectedEvent[];
  chartOptions?: ChartOptions;
  microPlans: MicroInvestmentPlan[];
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
  firstHistoricalRecordDate: Date | null;
  changeDepositDate: Date | null;
  changeWithdrawDate: Date | null;
  limitAgeDate: Date | null;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Adjusts monetary values for real values display by dividing by accumulated inflation
 * @param nominalValue The nominal value to adjust
 * @param accumulatedInflation The accumulated inflation factor
 * @param showRealValues Whether to show real values (divide by inflation)
 * @returns Adjusted value (real if showRealValues is true, nominal otherwise)
 */
function adjustValueForRealDisplay(
  nominalValue: number, 
  accumulatedInflation: number, 
  showRealValues: boolean
): number {
  return showRealValues ? nominalValue / accumulatedInflation : nominalValue;
}

/**
 * Verifica se é o momento de mudar para um novo micro plano ativo
 * @param microPlans Array de micro planos
 * @param currentDate Data atual da iteração
 * @param previousDate Data anterior da iteração (para detectar mudanças)
 * @returns true se for o mês exato de vigência de um novo micro plano
 */
function isTimeForChangeActivePlan(microPlans: MicroInvestmentPlan[], currentDate: Date, previousDate?: Date): boolean {
  if (!microPlans || microPlans.length === 0) {
    return false;
  }

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Verificar se algum micro plano tem vigência exatamente neste mês
  for (const microPlan of microPlans) {
    const effectiveDate = createDateWithoutTimezone(microPlan.effective_date);
    const effectiveYear = effectiveDate.getFullYear();
    const effectiveMonth = effectiveDate.getMonth();

    // Se a data de vigência for exatamente este mês, é hora de mudar
    if (effectiveYear === currentYear && effectiveMonth === currentMonth) {
      return true;
    }
  }

  return false;
}

// ============================================================================
// CONTEXT AND CONFIGURATION FUNCTIONS
// ============================================================================

/**
 * Creates the projection context with all necessary data and configurations
 * @param investmentPlan The investment plan configuration
 * @param profile User profile with birth date
 * @param initialRecords Historical financial records
 * @param goals Optional goals array
 * @param events Optional events array
 * @param chartOptions Optional chart display options
 * @param microPlans Array of micro investment plans
 * @returns ProjectionContext or null if invalid data
 */
function createProjectionContext(
  investmentPlan: InvestmentPlan,
  profile: { birth_date: string },
  initialRecords: FinancialRecord[],
  goals?: Goal[],
  events?: ProjectedEvent[],
  chartOptions?: ChartOptions,
  microPlans: MicroInvestmentPlan[] = []
): ProjectionContext | null {

  if (!profile?.birth_date || !investmentPlan || !microPlans || microPlans.length === 0) {
    return null;
  }

  if (!profile.birth_date) {
    return null;
  }
  
  const birthDate = createDateWithoutTimezone(profile.birth_date);
  const birthYear = birthDate.getFullYear();
  if (!investmentPlan.plan_initial_date) {
    return null;
  }
  const planStartDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
  const initialAge = planStartDate.getFullYear() - birthYear;
  const endAge = getEndAge(investmentPlan);
  const yearsUntilEnd = endAge - initialAge;
  const startYear = planStartDate.getFullYear();
  const startMonth = planStartDate.getMonth() + 1;
  if (!investmentPlan.plan_end_accumulation_date) {
    return null;
  }
  const endDate = createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date);
  const limitAgeDate = new Date(birthDate);
  limitAgeDate.setFullYear(birthDate.getFullYear() + endAge);
  // Adicionar +1 mês para incluir o mês do limite + 1
  limitAgeDate.setMonth(limitAgeDate.getMonth() + 1);
  // Definir como último dia do mês para incluir o mês completo
  limitAgeDate.setDate(new Date(limitAgeDate.getFullYear(), limitAgeDate.getMonth() + 1, 0).getDate());
  
  const oldPortfolioProfitability = investmentPlan.old_portfolio_profitability;
  
  // Obter o micro plano ativo na data inicial do plano
  const initialMicroPlan = getActiveMicroPlanForDate(microPlans, planStartDate);
  
  // Usar valores do micro plano ativo (sem fallback para investment plan)
  const defaultMonthlyInflationRate = initialMicroPlan 
    ? yearlyReturnRateToMonthlyReturnRate(initialMicroPlan.inflation / 100)
    : yearlyReturnRateToMonthlyReturnRate(6 / 100); // Default 6% se não houver micro plano
  
  const monthlyExpectedReturnRate = initialMicroPlan
    ? yearlyReturnRateToMonthlyReturnRate(initialMicroPlan.expected_return / 100)
    : yearlyReturnRateToMonthlyReturnRate(8 / 100); // Default 8% se não houver micro plano
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
    ? createDateWithoutTimezone(chartOptions.changeMonthlyDeposit.date) 
    : null;
  const changeWithdrawDate = chartOptions?.changeMonthlyWithdraw?.date 
    ? createDateWithoutTimezone(chartOptions.changeMonthlyWithdraw.date) 
    : null;

  const firstHistoricalRecordDate = initialRecords.sort((a, b) => a.record_year - b.record_year || a.record_month - b.record_month)[0] ? createDateFromYearMonth(initialRecords.sort((a, b) => a.record_year - b.record_year || a.record_month - b.record_month)[0].record_year, initialRecords.sort((a, b) => a.record_year - b.record_year || a.record_month - b.record_month)[0].record_month) : null;
  return {
    investmentPlan,
    profile,
    initialRecords,
    goals,
    events,
    chartOptions,
    microPlans,
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
    firstHistoricalRecordDate,
    changeDepositDate,
    changeWithdrawDate,
    limitAgeDate
  };
}
// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates monthly rates for inflation, returns, and old portfolio returns
 * @param year Current year
 * @param month Current month
 * @param ipcaRatesMap Map of historical IPCA rates
 * @param defaultMonthlyInflationRate Default inflation rate
 * @param monthlyExpectedReturnRate Expected return rate
 * @param monthlyOldPortfolioExpectedReturnRate Old portfolio return rate
 * @param showRealValues Whether to show real values (no inflation adjustment)
 * @returns Object with calculated monthly rates
 */
function calculateMonthlyRates(
  year: number,
  month: number,
  ipcaRatesMap: Map<string, number>,
  defaultMonthlyInflationRate: number,
  monthlyExpectedReturnRate: number,
  monthlyOldPortfolioExpectedReturnRate: number,
): { monthlyInflationRate: number; monthlyReturnRate: number; monthlyOldPortfolioReturnRate: number } {
  const ipcaKey = `${year}-${month}`;
  // temporary showRealValues
  if (ipcaRatesMap.has(ipcaKey)) {
    const monthlyInflationRate = ipcaRatesMap.get(ipcaKey)!;
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

  const monthlyInflationRate = defaultMonthlyInflationRate;

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

// ============================================================================
// DATA CREATION FUNCTIONS
// ============================================================================

/**
 * Creates monthly projection data for historical records
 * @param historicalRecord The historical financial record
 * @param month Current month
 * @param year Current year
 * @param plannedBalance Planned balance for this month
 * @param oldPortfolioBalance Old portfolio balance
 * @param isRetirementAge Whether this is retirement age
 * @param monthlyReturnRate Monthly return rate
 * @param monthlyOldPortfolioReturnRate Monthly old portfolio return rate
 * @param monthlyInflationRate Monthly inflation rate
 * @param accumulatedInflation Accumulated inflation factor
 * @param planned_contribution Planned contribution amount
 * @param expectedReturn Expected return rate
 * @param birthYear Birth year
 * @returns MonthlyProjectionData for historical month
 */
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
  planned_contribution: number,
  expectedReturn: number,
  birthYear: number,
  showRealValues: boolean = false
): MonthlyProjectionData {
  // Calcular valores nominais primeiro
  const nominalContribution = historicalRecord.monthly_contribution > 0 ? historicalRecord.monthly_contribution : 0;
  const nominalWithdrawal = historicalRecord.monthly_contribution < 0 ? Math.abs(historicalRecord.monthly_contribution) : 0;

  // Calcular impacto dos goals/events considerando financial_links (valores nominais)
  const nominalGoalsEventsImpact = historicalRecord.links?.reduce((acc, link) => {
    // Para goals (gastos), os links são negativos
    // Para events, os links podem ser positivos ou negativos
    return acc + link.allocated_amount;
  }, 0) || 0;

  // Aplicar ajuste para valores reais se necessário
  const contribution = adjustValueForRealDisplay(nominalContribution, accumulatedInflation, showRealValues);
  const withdrawal = adjustValueForRealDisplay(nominalWithdrawal, accumulatedInflation, showRealValues);
  const goalsEventsImpact = adjustValueForRealDisplay(nominalGoalsEventsImpact, accumulatedInflation, showRealValues);
  const adjustedEndingBalance = adjustValueForRealDisplay(historicalRecord.ending_balance, accumulatedInflation, showRealValues);

  return {
    month: month as MonthNumber,
    year,
    contribution,
    planned_contribution,
    withdrawal,
    isHistorical: true,
    balance: adjustedEndingBalance,
    planned_balance: plannedBalance,
    retirement: isRetirementAge,
    goalsEventsImpact,
    difference_from_planned_balance: adjustedEndingBalance - plannedBalance,
    projected_lifetime_withdrawal: adjustedEndingBalance / (expectedReturn / 100),
    planned_lifetime_withdrawal: plannedBalance / (expectedReturn / 100),
    effectiveRate: monthlyReturnRate,
    ipcaRate: monthlyInflationRate,
    accumulatedInflation,
    old_portfolio_balance: oldPortfolioBalance
  };
}

/**
 * Creates monthly projection data for past months (no historical record)
 * @param month Current month
 * @param year Current year
 * @param plannedBalance Planned balance for this month
 * @param projectedBalance Projected balance for this month
 * @param oldPortfolioBalance Old portfolio balance
 * @param monthlyReturnRate Monthly return rate
 * @param monthlyInflationRate Monthly inflation rate
 * @param accumulatedInflation Accumulated inflation factor
 * @param expectedReturn Expected return rate
 * @param planned_contribution Planned contribution amount
 * @param birthYear Birth year
 * @returns MonthlyProjectionData for past month
 */
function createPastMonthData(
  month: number,
  year: number,
  plannedBalance: number,
  projectedBalance: number,
  oldPortfolioBalance: number | null,
  monthlyReturnRate: number,
  monthlyInflationRate: number,
  accumulatedInflation: number,
  expectedReturn: number,
  planned_contribution: number,
): MonthlyProjectionData {
  return {
    month: month as MonthNumber,
    year,
    contribution: 0,
    planned_contribution,
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

/**
 * Creates monthly projection data for retirement months
 * @param month Current month
 * @param year Current year
 * @param projectedBalance Projected balance for this month
 * @param plannedBalance Planned balance for this month
 * @param oldPortfolioBalance Old portfolio balance
 * @param monthlyReturnRate Monthly return rate
 * @param monthlyOldPortfolioReturnRate Monthly old portfolio return rate
 * @param monthlyInflationRate Monthly inflation rate
 * @param accumulatedInflation Accumulated inflation factor
 * @param monthlyWithdrawal Monthly withdrawal amount
 * @param goalsEventsImpact Impact from goals and events
 * @param expectedReturn Expected return rate
 * @param birthYear Birth year
 * @returns MonthlyProjectionData for retirement month
 */
function createRetirementMonthData(
  month: number,
  year: number,
  projectedBalance: number,
  plannedBalance: number,
  oldPortfolioBalance: number | null,
  monthlyReturnRate: number,
  monthlyOldPortfolioReturnRate: number,
  monthlyInflationRate: number,
  accumulatedInflation: number,
  monthlyWithdrawal: number,
  goalsEventsImpact: number,
  expectedReturn: number,
  birthYear: number
): MonthlyProjectionData {
  const monthlyReturn = projectedBalance * monthlyReturnRate;

  return {
    month: month as MonthNumber,
    year,
    contribution: 0,
    planned_contribution: 0,
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

/**
 * Creates monthly projection data for future months (accumulation phase)
 * @param month Current month
 * @param year Current year
 * @param projectedBalance Projected balance for this month
 * @param plannedBalance Planned balance for this month
 * @param oldPortfolioBalance Old portfolio balance
 * @param monthlyReturnRate Monthly return rate
 * @param monthlyInflationRate Monthly inflation rate
 * @param accumulatedInflation Accumulated inflation factor
 * @param goalsEventsImpact Impact from goals and events
 * @param monthlyDeposit Monthly deposit amount
 * @param expectedReturn Expected return rate
 * @param birthYear Birth year
 * @returns MonthlyProjectionData for future month
 */
function createFutureMonthData(
  month: number,
  year: number,
  projectedBalance: number,
  plannedBalance: number,
  oldPortfolioBalance: number | null,
  monthlyReturnRate: number,
  monthlyInflationRate: number,
  accumulatedInflation: number,
  goalsEventsImpact: number,
  monthlyDeposit: number,
  expectedReturn: number,
  birthYear: number
): MonthlyProjectionData {
  return {
    month: month as MonthNumber,
    year,
    contribution: monthlyDeposit,
    planned_contribution: monthlyDeposit,
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

// ============================================================================
// MAIN PROJECTION FUNCTION
// ============================================================================

/**
 * Main function to generate comprehensive projection data for investment plans
 * This is the primary function that orchestrates the entire projection calculation process
 * 
 * @param investmentPlan The investment plan configuration
 * @param profile User profile with birth date
 * @param initialRecords Historical financial records
 * @param microPlans Array of micro investment plans
 * @param goals Optional goals array
 * @param events Optional events array
 * @param chartOptions Optional chart display options
 * @returns Array of yearly projection data
 */
export function generateProjectionData(
  investmentPlan: InvestmentPlan,
  profile: { birth_date: string },
  initialRecords: FinancialRecord[],
  microPlans: MicroInvestmentPlan[],
  goals?: Goal[],
  events?: ProjectedEvent[],
  chartOptions?: ChartOptions,
): YearlyProjectionData[] {
  const context = createProjectionContext(
    investmentPlan, 
    profile, 
    initialRecords, 
    goals, 
    events, 
    chartOptions,
    microPlans
  );
  
  if (!context) return [];

  const projectionData: YearlyProjectionData[] = [];
  
  
  // Para planned: ignora financial_links (cenário ideal)
  const allGoalsForChart = processGoals(context.goals, IGNORE_FINANCIAL_LINKS);
  const allEventsForChart = processEvents(context.events, IGNORE_FINANCIAL_LINKS);
  
  // Para projected: considera financial_links (realidade atual)
  const pendingGoalsForChart = processGoals(context.goals?.filter(goal => goal.status === 'pending'), CONSIDER_FINANCIAL_LINKS);
  const pendingEventsForChart = processEvents(context.events?.filter(event => event.status === 'pending'), CONSIDER_FINANCIAL_LINKS);
  let oldPortfolioBalance = context.oldPortfolioProfitability ? investmentPlan.initial_amount : null;
  let projectedBalance = initialRecords[0]?.ending_balance || investmentPlan.initial_amount;
  let plannedBalance = investmentPlan.initial_amount;
  
  // Obter o micro plano ativo na data inicial
  const initialMicroPlan = getActiveMicroPlanForDate(context.microPlans, context.planStartDate);
  let currentNominalMonthlyDeposit = initialMicroPlan?.monthly_deposit || 0; // Default 0 se não houver micro plano
  let currentRealMonthlyDeposit = initialMicroPlan?.monthly_deposit || 0;
  let currentNominalMonthlyWithdrawal = initialMicroPlan?.desired_income || 0; // Default 0 se não houver micro plano
  let currentRealMonthlyWithdrawal = initialMicroPlan?.desired_income || 0;
  let accumulatedInflation = 1;

  // Inicializar data atual como a data de início do plano
  const startDate = new Date(context.planStartDate);
  const endDate = context.limitAgeDate || (context.birthDate ? createDateWithoutTimezone(context.birthDate) : null);
  if (!endDate) {
    return [];
  }
  endDate.setFullYear(context.birthDate.getFullYear() + context.endAge);
  // Definir como último dia do mês para incluir o mês completo
  endDate.setDate(new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate());

  // Agrupar dados por ano
  const yearlyDataMap = new Map<number, MonthlyProjectionData[]>();

  // eslint-disable-next-line prefer-const
  let currentDate = new Date(startDate);
  // Definir como primeiro dia do mês para começar no início do mês
  currentDate.setDate(1);
  let previousDate: Date | undefined;
  
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
  
    // Verificar se é o momento de mudar para um novo micro plano ativo
    if (isTimeForChangeActivePlan(context.microPlans, currentDate, previousDate)) {
      const activeMicroPlanForDate = getActiveMicroPlanForDate(context.microPlans, currentDate);
      if (activeMicroPlanForDate) {
        // Aplicar ajuste de inflação acumulada se os campos estiverem como true
        if (activeMicroPlanForDate.adjust_contribution_for_accumulated_inflation) {
          currentNominalMonthlyDeposit = activeMicroPlanForDate.monthly_deposit * accumulatedInflation;
        } else {
          currentNominalMonthlyDeposit = activeMicroPlanForDate.monthly_deposit;
        }
        
        if (activeMicroPlanForDate.adjust_income_for_accumulated_inflation) {
          currentNominalMonthlyWithdrawal = activeMicroPlanForDate.desired_income * accumulatedInflation;
        } else {
          currentNominalMonthlyWithdrawal = activeMicroPlanForDate.desired_income;
        }
      }
    }

    // Check for deposit/withdrawal changes (chart options override micro plan values)
    if (context.changeDepositDate && 
        context.changeDepositDate.getFullYear() === year && 
        context.changeDepositDate.getMonth() + 1 === month) {
      currentNominalMonthlyDeposit = chartOptions!.changeMonthlyDeposit!.value;
    }
    
    if (context.changeWithdrawDate && 
        context.changeWithdrawDate.getFullYear() === year && 
        context.changeWithdrawDate.getMonth() + 1 === month) {
      currentNominalMonthlyWithdrawal = chartOptions!.changeMonthlyWithdraw!.value;
    }

    const isRetirementAge = year > context.endDate.getFullYear() ||
      (year === context.endDate.getFullYear() && month >= context.endDate.getMonth() + 2);

    // Calculate rates using active micro plan values
    const activeMicroPlanForRates = getActiveMicroPlanForDate(context.microPlans, currentDate);
    const monthlyInflationRateForDate = activeMicroPlanForRates
      ? yearlyReturnRateToMonthlyReturnRate(activeMicroPlanForRates.inflation / 100)
      : yearlyReturnRateToMonthlyReturnRate(6 / 100); // Default 6% se não houver micro plano
    
    const monthlyExpectedReturnRateForDate = activeMicroPlanForRates
      ? yearlyReturnRateToMonthlyReturnRate(activeMicroPlanForRates.expected_return / 100)
      : yearlyReturnRateToMonthlyReturnRate(8 / 100); // Default 8% se não houver micro plano
    
    const rates = 
      calculateMonthlyRates(
        year, 
        month, 
        context.ipcaRatesMap, 
        monthlyInflationRateForDate,
        monthlyExpectedReturnRateForDate,
        context.monthlyOldPortfolioExpectedReturnRate,
      );
    let monthlyInflationRate = rates.monthlyInflationRate;
    let monthlyReturnRate = rates.monthlyReturnRate;
    let monthlyOldPortfolioReturnRate = rates.monthlyOldPortfolioReturnRate;

    accumulatedInflation *= (1 + monthlyInflationRate);

    // Adjust for inflation
    if (investmentPlan.adjust_contribution_for_inflation  && !isRetirementAge) {
      currentNominalMonthlyDeposit *= (1 + monthlyInflationRate);
    }
    if (investmentPlan.adjust_income_for_inflation) {
      currentNominalMonthlyWithdrawal *= (1 + monthlyInflationRate);
    }
    // If showRealValues is true, we need to discount accumulated inflation
    if (chartOptions?.showRealValues) {
      // Descontar a inflação acumulada dos valores para mostrar valores reais
      // Dividir pelo fator de inflação acumulada para obter valores reais
      currentRealMonthlyDeposit = currentNominalMonthlyDeposit / accumulatedInflation;
      currentRealMonthlyWithdrawal = currentNominalMonthlyWithdrawal / accumulatedInflation;
      monthlyInflationRate = 0;
      // Usar valores desconsiderando a inflação
      monthlyReturnRate = monthlyExpectedReturnRateForDate;
      monthlyOldPortfolioReturnRate = context.monthlyOldPortfolioExpectedReturnRate;
    }

    // Check for historical record
    const historicalKey = `${year}-${month}`;
    const historicalRecord = context.historicalRecordsMap.get(historicalKey);
    const isInPast = context.firstHistoricalRecordDate ? context.firstHistoricalRecordDate > createDateFromYearMonth(year, month) : false;
    let monthlyData: MonthlyProjectionData;

    if (historicalRecord) {
      // Apply returns and contribution (if applicable)
      const contribution = chartOptions?.showRealValues ? currentRealMonthlyDeposit : currentNominalMonthlyDeposit;
      
      plannedBalance = plannedBalance * (1 + monthlyReturnRate) + contribution;
      if (context.oldPortfolioProfitability) {
        oldPortfolioBalance = oldPortfolioBalance! * (1 + monthlyOldPortfolioReturnRate) + contribution;
      }
      
      // Handle goals and events for planned balance AFTER returns and contribution (use all goals/events)
      const { plannedBalance: updatedPlannedBalance, oldPortfolioBalance: updatedOldPortfolioBalance } = 
        handleBalancesGoalsAndEvents(
          plannedBalance,
          oldPortfolioBalance,
          null, // No projectedBalance for historical records
          year,
          month,
          accumulatedInflation,
          allGoalsForChart,
          allEventsForChart,
          undefined, // No separate projected goals/events
          undefined,
          chartOptions?.showRealValues || false,
          !!context.oldPortfolioProfitability
        );
      plannedBalance = updatedPlannedBalance;
      oldPortfolioBalance = updatedOldPortfolioBalance;

      monthlyData = createHistoricalMonthData(
        historicalRecord,
        month,
        year,
        plannedBalance,
        oldPortfolioBalance,
        isRetirementAge,
        monthlyReturnRate,
        monthlyOldPortfolioReturnRate,
        monthlyInflationRate,
        accumulatedInflation,
        contribution,
        activeMicroPlanForRates?.expected_return || 8, // Default 8% se não houver micro plano
        context.birthYear,
        chartOptions?.showRealValues || false
      );
      projectedBalance = monthlyData.balance;
    } else if (isInPast) {
      const contribution = chartOptions?.showRealValues ? currentRealMonthlyDeposit : currentNominalMonthlyDeposit;
      
      plannedBalance = plannedBalance * (1 + monthlyReturnRate) + contribution;
      if (context.oldPortfolioProfitability) {
        oldPortfolioBalance = oldPortfolioBalance! * (1 + monthlyOldPortfolioReturnRate) + contribution;
      }
      
      // Handle goals and events for planned balance AFTER returns and contribution (use all goals/events)
      const { plannedBalance: updatedPlannedBalance, oldPortfolioBalance: updatedOldPortfolioBalance } = 
        handleBalancesGoalsAndEvents(
          plannedBalance,
          oldPortfolioBalance,
          null, // No projectedBalance for past months
          year,
          month,
          accumulatedInflation,
          allGoalsForChart,
          allEventsForChart,
          undefined, // No separate projected goals/events
          undefined,
          chartOptions?.showRealValues || false,
          !!context.oldPortfolioProfitability
        );
      plannedBalance = updatedPlannedBalance;
      oldPortfolioBalance = updatedOldPortfolioBalance;
      monthlyData = createPastMonthData(
        month,
        year,
        plannedBalance,
        projectedBalance,
        oldPortfolioBalance,
        monthlyReturnRate,
        monthlyInflationRate,
        accumulatedInflation,
        activeMicroPlanForRates?.expected_return || 8, // Default 8% se não houver micro plano
        contribution,
      );
    } else if (isRetirementAge) {
      const withdrawal = chartOptions?.showRealValues ? currentRealMonthlyWithdrawal : currentNominalMonthlyWithdrawal;
      
      projectedBalance = (projectedBalance * (1 + monthlyReturnRate)) - withdrawal;
      plannedBalance = (plannedBalance * (1 + monthlyReturnRate)) - withdrawal;
      if (context.oldPortfolioProfitability) {
        oldPortfolioBalance = (oldPortfolioBalance! * (1 + monthlyOldPortfolioReturnRate)) - withdrawal;
      }
      
      // Apply goals/events after returns and withdrawals
      const balanceBeforeGoalsEvents = projectedBalance;
      
      // Handle goals and events for all balances AFTER returns and withdrawals
      const { 
        plannedBalance: updatedPlannedBalance, 
        oldPortfolioBalance: updatedOldPortfolioBalance,
        projectedBalance: updatedProjectedBalance
      } = handleBalancesGoalsAndEvents(
        plannedBalance,
        oldPortfolioBalance,
        projectedBalance,
        year,
        month,
        accumulatedInflation,
        allGoalsForChart,
        allEventsForChart,
        pendingGoalsForChart, // Different goals/events for projected
        pendingEventsForChart,
        chartOptions?.showRealValues || false,
        !!context.oldPortfolioProfitability
      );
      plannedBalance = updatedPlannedBalance;
      oldPortfolioBalance = updatedOldPortfolioBalance;
      projectedBalance = updatedProjectedBalance!;
      
      const goalsEventsImpact = projectedBalance - balanceBeforeGoalsEvents;
      
      monthlyData = createRetirementMonthData(
        month,
        year,
        projectedBalance,
        plannedBalance,
        oldPortfolioBalance,
        monthlyReturnRate,
        monthlyOldPortfolioReturnRate,
        monthlyInflationRate,
        accumulatedInflation,
        withdrawal,
        goalsEventsImpact,
        activeMicroPlanForRates?.expected_return || 8, // Default 8% se não houver micro plano
        context.birthYear
      );
    } else {
      // Regular future month
      const contribution = chartOptions?.showRealValues ? currentRealMonthlyDeposit : currentNominalMonthlyDeposit;
      
      // Apply returns and contributions first
      projectedBalance = projectedBalance * (1 + monthlyReturnRate) + contribution;
      const balanceAfterReturnsAndContribution = projectedBalance;
      
      plannedBalance = plannedBalance * (1 + monthlyReturnRate) + contribution;
      if (context.oldPortfolioProfitability) {
        oldPortfolioBalance = oldPortfolioBalance! * (1 + monthlyOldPortfolioReturnRate) + contribution;
      }
      
      // Apply goals/events AFTER returns and contributions
      const balanceBeforeGoalsEvents = projectedBalance;
      
      // Handle goals and events for all balances AFTER returns and contributions
      const { 
        plannedBalance: updatedPlannedBalance, 
        oldPortfolioBalance: updatedOldPortfolioBalance,
        projectedBalance: updatedProjectedBalance
      } = handleBalancesGoalsAndEvents(
        plannedBalance,
        oldPortfolioBalance,
        projectedBalance,
        year,
        month,
        accumulatedInflation,
        allGoalsForChart,
        allEventsForChart,
        pendingGoalsForChart, // Different goals/events for projected
        pendingEventsForChart,
        chartOptions?.showRealValues || false,
        !!context.oldPortfolioProfitability
      );
      plannedBalance = updatedPlannedBalance;
      oldPortfolioBalance = updatedOldPortfolioBalance;
      projectedBalance = updatedProjectedBalance!;
      
      const goalsEventsImpact = projectedBalance - balanceBeforeGoalsEvents;
      monthlyData = createFutureMonthData(
        month,
        year,
        projectedBalance,
        plannedBalance,
        oldPortfolioBalance,
        monthlyReturnRate,
        monthlyInflationRate,
        accumulatedInflation,
        goalsEventsImpact,
        contribution,
        activeMicroPlanForRates?.expected_return || 6, // Default 6% se não houver micro plano
        context.birthYear
      );
    }

    // Adicionar dados mensais ao mapa do ano
    if (!yearlyDataMap.has(year)) {
      yearlyDataMap.set(year, []);
    }
    yearlyDataMap.get(year)!.push(monthlyData);

    // Atualizar data anterior antes de avançar
    previousDate = new Date(currentDate);
    
    // Avançar para o próximo mês
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Converter mapa em array de dados anuais
  for (const [year, monthlyData] of yearlyDataMap) {
    const age = year - context.birthYear;
    
    if (monthlyData.length > 0) {
      const yearlyContribution = monthlyData.reduce((sum, month) => sum + month.contribution, 0);
      const yearlyPlannedContribution = monthlyData.reduce((sum, month) => sum + month.planned_contribution, 0);
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
        planned_contribution: yearlyPlannedContribution,
        withdrawal: yearlyWithdrawal,
        balance: lastMonth.balance,
        planned_balance: lastMonth.planned_balance,
        projected_lifetime_withdrawal: lastMonth.balance / ((getActiveMicroPlanForDate(context.microPlans, new Date(year, 11, 31))?.expected_return || 8) / 100), // Default 8% se não houver micro plano
        planned_lifetime_withdrawal: lastMonth.planned_balance / ((getActiveMicroPlanForDate(context.microPlans, new Date(year, 11, 31))?.expected_return || 8) / 100), // Default 8% se não houver micro plano
        months: monthlyData,
        isRetirementTransitionYear: monthlyData.some(month => month.retirement),
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

// ============================================================================
// EXPORTED UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates chart projections for visualization
 * @param profile User profile with birth date
 * @param investmentPlan The investment plan configuration
 * @param financialRecordsByYear Historical financial records
 * @param goals Optional goals array
 * @param events Optional events array
 * @param chartOptions Optional chart display options
 * @param microPlans Array of micro investment plans
 * @returns Array of chart data points
 */
export function generateChartProjections(
  profile: { birth_date: string },
  investmentPlan: InvestmentPlan,
  financialRecordsByYear: FinancialRecord[],
  goals?: Goal[],
  events?: ProjectedEvent[],
  chartOptions?: ChartOptions,
  microPlans: MicroInvestmentPlan[] = []
): ChartDataPoint[] {
  const projectionData = generateProjectionData(
    investmentPlan,
    profile,
    financialRecordsByYear,
    microPlans,
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

/**
 * Gets the end age for an investment plan
 * @param investmentPlan The investment plan
 * @returns End age (default 100 if not specified)
 */
export function getEndAge(investmentPlan: InvestmentPlan): number {
  if (investmentPlan.limit_age) {
    return investmentPlan.limit_age;
  }
  return 100;
}

/**
 * Processes an array of events into chart events, handling installments
 * @param events Optional array of events to process
 * @param ignoreFinancialLinks Whether to ignore financial_links (for planned calculations)
 * @returns Array of processed events for the chart
 */
export function processEvents(events?: ProjectedEvent[], ignoreFinancialLinks: boolean = false): ProcessedGoalEvent[] {
  if (!events) return [];
  return processEventsForChart(events, ignoreFinancialLinks);
}

/**
 * Processes an array of goals into chart goals, handling installments
 * @param goals Optional array of goals to process
 * @param ignoreFinancialLinks Whether to ignore financial_links (for planned calculations)
 * @returns Array of processed goals for the chart
 */
export function processGoals(goals?: Goal[], ignoreFinancialLinks: boolean = false): ProcessedGoalEvent[] {
  if (!goals) return [];
  return processGoalsForChart(goals, ignoreFinancialLinks);
}

/**
 * Generates data points for chart visualization
 * @param investmentPlan The investment plan configuration
 * @param yearsUntilEnd Number of years until plan end
 * @param birthYear Birth year
 * @returns Array of data points
 */
export function generateDataPoints(
  investmentPlan: InvestmentPlan,
  yearsUntilEnd: number,
  birthYear: number
): DataPoint[] {
  const planStartDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
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

/**
 * Handles monthly goals and events impact on balance
 * @param balance Current balance
 * @param year Current year
 * @param month Current month (0-based)
 * @param accumulatedInflation Accumulated inflation factor
 * @param goals Optional processed goals
 * @param events Optional processed events
 * @param showRealValues Whether to show real values (no inflation adjustment)
 * @returns Updated balance after goals and events impact
 */
export function handleMonthlyGoalsAndEvents(
  balance: number,
  year: number,
  month: number,
  accumulatedInflation: number,
  goals?: ProcessedGoalEvent[],
  events?: ProcessedGoalEvent[],
  showRealValues: boolean = false
): number {
  let updatedBalance = balance;
  
  // Handle goals (gastos - reduzem o saldo)
  const currentGoals = goals?.filter(goal => 
    goal.year === year && goal.month === (month)
  );
  if (currentGoals?.length) {
    const totalGoalWithdrawal = currentGoals.reduce((sum, goal) => {
      // adjust_for_inflation true (default): nominal = amount * inflation, real = amount
      // adjust_for_inflation false: nominal = amount (fixed), real = amount / inflation
      const adjustForInflation = goal.adjust_for_inflation !== false;
      let adjustedAmount: number;
      if (adjustForInflation) {
        adjustedAmount = showRealValues ? goal.amount : goal.amount * accumulatedInflation;
      } else {
        adjustedAmount = showRealValues ? goal.amount / accumulatedInflation : goal.amount;
      }
      return sum + adjustedAmount;
    }, 0);
    updatedBalance -= totalGoalWithdrawal;
  }

  // Handle events (podem ser receitas ou despesas)
  const currentEvents = events?.filter(event => 
    event.year === year && event.month === (month)
  );

  if (currentEvents?.length) {
    const totalEventImpact = currentEvents.reduce((sum, event) => {
      // adjust_for_inflation true (default): nominal = amount * inflation, real = amount
      // adjust_for_inflation false: nominal = amount (fixed), real = amount / inflation
      const adjustForInflation = event.adjust_for_inflation !== false;
      let adjustedAmount: number;
      if (adjustForInflation) {
        adjustedAmount = showRealValues ? event.amount : event.amount * accumulatedInflation;
      } else {
        adjustedAmount = showRealValues ? event.amount / accumulatedInflation : event.amount;
      }
      return sum + adjustedAmount;
    }, 0);
    updatedBalance += totalEventImpact;
  }

  return updatedBalance;
}

/**
 * Handles monthly goals and events for balances (planned, old portfolio, and optionally projected)
 * @param plannedBalance Current planned balance
 * @param oldPortfolioBalance Current old portfolio balance (can be null)
 * @param projectedBalance Optional projected balance to process
 * @param year Current year
 * @param month Current month
 * @param accumulatedInflation Accumulated inflation factor
 * @param goals Processed goals for planned/old portfolio
 * @param events Processed events for planned/old portfolio
 * @param projectedGoals Optional processed goals for projected balance (if different)
 * @param projectedEvents Optional processed events for projected balance (if different)
 * @param showRealValues Whether to show real values (no inflation adjustment)
 * @param hasOldPortfolio Whether old portfolio profitability is enabled
 * @returns Object with updated balances
 */
function handleBalancesGoalsAndEvents(
  plannedBalance: number,
  oldPortfolioBalance: number | null,
  projectedBalance: number | null,
  year: number,
  month: number,
  accumulatedInflation: number,
  goals: ProcessedGoalEvent[],
  events: ProcessedGoalEvent[],
  projectedGoals: ProcessedGoalEvent[] | undefined,
  projectedEvents: ProcessedGoalEvent[] | undefined,
  showRealValues: boolean,
  hasOldPortfolio: boolean
): { 
  plannedBalance: number; 
  oldPortfolioBalance: number | null;
  projectedBalance: number | null;
} {
  plannedBalance = handleMonthlyGoalsAndEvents(
    plannedBalance,
    year,
    month,
    accumulatedInflation,
    goals,
    events,
    showRealValues
  );

  if (hasOldPortfolio && oldPortfolioBalance !== null) {
    oldPortfolioBalance = handleMonthlyGoalsAndEvents(
      oldPortfolioBalance,
      year,
      month,
      accumulatedInflation,
      goals,
      events,
      showRealValues
    );
  }

  if (projectedBalance !== null) {
    const goalsToUse = projectedGoals ?? goals;
    const eventsToUse = projectedEvents ?? events;
    projectedBalance = handleMonthlyGoalsAndEvents(
      projectedBalance,
      year,
      month,
      accumulatedInflation,
      goalsToUse,
      eventsToUse,
      showRealValues
    );
  }

  return { plannedBalance, oldPortfolioBalance, projectedBalance };
}