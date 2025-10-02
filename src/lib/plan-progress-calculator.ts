import { FinancialRecord, InvestmentPlan, MicroInvestmentPlan, Goal, ProjectedEvent } from "@/types/financial";
import { calculateCompoundedRates, nper, yearlyReturnRateToMonthlyReturnRate, pmt, vp } from "@/lib/financial-math";
import { processItem, IGNORE_FINANCIAL_LINKS, CONSIDER_FINANCIAL_LINKS } from './financial-goals-processor';
import { createDateWithoutTimezone, createDateFromYearMonth } from '@/utils/dateUtils';
import { HistoricalDataInfo } from "@/services/projection.service";
import { MonthlyProjectionData } from "./chart-projections";
import { createCPIRatesMapByCurrency } from './inflation-utils';
import { calculateMicroPlanFutureValues } from '@/utils/investmentPlanCalculations';
import { getActiveMicroPlanForDate } from '@/utils/microPlanUtils';

/**
 * Utility functions
 */
export const utils = {
  /**
   * Calculates the number of months between two dates
   */
  calculateMonthsBetweenDates: (startDate: Date, endDate: Date): number => {
    if (startDate == undefined || endDate == undefined) {
      return null;
    }
    
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
  },

  /**
   * Creates a date at a specific age based on birth date
   */
  createDateAtAge: (birthDate: Date, targetAge: number): Date => {
    const targetDate = createDateWithoutTimezone(birthDate);
    targetDate.setFullYear(birthDate.getFullYear() + targetAge);
    return targetDate;
  },

  /**
   * Adds months to a date
   */
  addMonthsToDate: (baseDate: Date, monthsToAdd: number): Date => {
    const newDate = createDateWithoutTimezone(baseDate);
    newDate.setMonth(baseDate.getMonth() + monthsToAdd + 1);
    return newDate;
  },

  /**
   * Computes weighted-average monthly contribution between reference and plan end,
   * handling multiple micro plan segments and currency-aware real CPI where available.
   */
  computeAverageMonthlyContribution: (
    params: {
      referenceDate: Date,
      planEndDate: Date,
      microPlans: MicroInvestmentPlan[],
      activeMicroPlan: MicroInvestmentPlan | null,
      adjustForInflation: boolean,
      planCurrency: 'BRL' | 'USD' | 'EUR',
      cpiRatesMap?: Map<string, number>
    }
  ): number => {
    const { referenceDate, planEndDate, microPlans, activeMicroPlan, adjustForInflation, planCurrency, cpiRatesMap } = params;
    const totalMonths = utils.calculateMonthsBetweenDates(referenceDate, planEndDate) + 1 || 0;
    if (totalMonths <= 0) return 0;

    // CPI map per currency for [referenceDate - 1 month, planEndDate]
    const adjustedReference = new Date(referenceDate);
    adjustedReference.setMonth(adjustedReference.getMonth() - 1);
    const localCpiRatesMap = cpiRatesMap || createCPIRatesMapByCurrency(adjustedReference, planEndDate, planCurrency);

    const sorted = [...(microPlans || [])]
      .filter(mp => mp && mp.effective_date)
      .sort((a, b) => new Date(a.effective_date).getTime() - new Date(b.effective_date).getTime());

    const activeIdx = sorted
      .map((mp, idx) => ({ idx, date: createDateWithoutTimezone(mp.effective_date) }))
      .filter(({ date }) => date.getTime() <= referenceDate.getTime())
      .map(({ idx }) => idx)
      .pop();

    const segments: Array<{ start: Date; end: Date; deposit: number; inflationMonthlyRate: number }> = [];

    let currentDeposit = activeIdx !== undefined ? (sorted[activeIdx].monthly_deposit || 0) : (activeMicroPlan?.monthly_deposit || 0);
    let currentInflationMonthlyRate = (() => {
      const baseInfl = activeIdx !== undefined ? (sorted[activeIdx].inflation || 0) : (activeMicroPlan?.inflation || 0);
      return yearlyReturnRateToMonthlyReturnRate((baseInfl || 0)/100);
    })();
    let currentStart = referenceDate;

    const futureChanges = sorted.filter(mp => createDateWithoutTimezone(mp.effective_date).getTime() > referenceDate.getTime());
    for (const mp of futureChanges) {
      const changeDate = createDateWithoutTimezone(mp.effective_date);
      // Se a mudança ocorre no ou após o fim do plano, não criamos segmento agora; saímos e deixamos o push final cuidar
      if (changeDate.getTime() >= planEndDate.getTime()) break;
      // Segmento atual vai até a data de mudança
      if (changeDate.getTime() > currentStart.getTime()) {
        segments.push({ start: currentStart, end: changeDate, deposit: currentDeposit, inflationMonthlyRate: currentInflationMonthlyRate });
      }
      // Abrir novo segmento a partir da data de mudança
      currentStart = changeDate;
      currentDeposit = mp.monthly_deposit || 0;
      currentInflationMonthlyRate = yearlyReturnRateToMonthlyReturnRate(((mp.inflation || 0)/100));
    }

    if (planEndDate.getTime() > currentStart.getTime()) {
      // Evitar duplicar se já houver um segmento terminando exatamente em planEndDate
      const last = segments[segments.length - 1];
      const alreadyCovered = last && last.end && last.end.getTime() === planEndDate.getTime();
      if (!alreadyCovered) {
        segments.push({ start: currentStart, end: planEndDate, deposit: currentDeposit, inflationMonthlyRate: currentInflationMonthlyRate });
      }
    }

    let weightedSum = 0;
    for (const seg of segments) {
      const monthsInSegment = utils.calculateMonthsBetweenDates(seg.start, seg.end) + 1 || 0;
      if (monthsInSegment <= 0) continue;
      let effectiveDeposit = seg.deposit || 0;
      if (adjustForInflation) {
        const monthsFromRefToSeg = Math.max(0, utils.calculateMonthsBetweenDates(referenceDate, seg.start) + 1 || 0);
        let cumulativeInflation = 1;
        if (monthsFromRefToSeg > 1) {
          const iterDate = new Date(referenceDate);
          for (let i = 0; i < monthsFromRefToSeg; i++) {
            const year = iterDate.getFullYear();
            const month = iterDate.getMonth() + 1;
            const key = `${year}-${month}`;
            const realMonthlyInflation = localCpiRatesMap.get(key);
            const rateForMonth = realMonthlyInflation !== undefined ? realMonthlyInflation : seg.inflationMonthlyRate;
            cumulativeInflation *= (1 + rateForMonth);
            iterDate.setMonth(iterDate.getMonth() + 1);
          }
        }
        effectiveDeposit = cumulativeInflation > 0 ? (effectiveDeposit / cumulativeInflation) : effectiveDeposit;
      }
      weightedSum += effectiveDeposit * monthsInSegment;
    }

    const average = weightedSum / totalMonths;
    return average;
  },

  /**
   * Computes cumulative inflation factor from startDate (inclusive) to endDate (exclusive),
   * using CPI by currency where available and falling back to a provided monthly rate.
   * Uses calculateCompoundedRates for precise rate composition.
   */
  computeInflationFactor: (
    params: {
      startDate: Date,
      endDate: Date,
      currency: 'BRL' | 'USD' | 'EUR',
      microPlans: MicroInvestmentPlan[]
    }
  ): number => {
    const { startDate, endDate, currency, microPlans } = params;
    const months = utils.calculateMonthsBetweenDates(startDate, endDate) + 1 || 0;
    if (months <= 0) return 1;

    const adjustedStart = new Date(startDate);
    adjustedStart.setMonth(adjustedStart.getMonth() - 1);
    const cpiMap = createCPIRatesMapByCurrency(adjustedStart, endDate, currency);

    // Collect all monthly inflation rates for the period using helper function
    const monthlyInflationRates = utils.iterateMonthlyValues({
      startDate,
      endDate,
      collector: (iterDate) => {
        const key = `${iterDate.getFullYear()}-${iterDate.getMonth() + 1}`;
        const realMonthlyInflation = cpiMap.get(key);
        // Fallback: inflação do micro plano ativo no mês
        let rateForMonth = realMonthlyInflation;
        if (rateForMonth === undefined) {
          const activeMp = getActiveMicroPlanForDate(microPlans, iterDate);
          const mpMonthly = yearlyReturnRateToMonthlyReturnRate(((activeMp?.inflation || 0) / 100));
          rateForMonth = mpMonthly;
        }
        return rateForMonth;
      }
    });

    // Use calculateCompoundedRates to get the total compounded inflation rate
    const totalCompoundedRate = calculateCompoundedRates(monthlyInflationRates);
    
    // Convert back to inflation factor
    return 1 + totalCompoundedRate;
  },

  /**
   * Computes an effective monthly expected return rate across a period,
   * using only the expected_return of the active micro plan for each month.
   * Uses calculateCompoundedRates for precise rate composition.
   */
  computeEffectiveMonthlyReturnRate: (
    params: {
      startDate: Date,
      endDate: Date,
      microPlans: MicroInvestmentPlan[]
    }
  ): number => {
    const { startDate, endDate, microPlans } = params;
    const months = utils.calculateMonthsBetweenDates(startDate, endDate) + 1 || 0;
    if (months <= 0) return 0;

    // Collect all monthly return rates for the period using helper function
    const monthlyReturnRates = utils.iterateMonthlyValues({
      startDate,
      endDate,
      collector: (iterDate) => {
        const activeMp = getActiveMicroPlanForDate(microPlans, iterDate);
        const expectedMonthly = yearlyReturnRateToMonthlyReturnRate(((activeMp?.expected_return || 0) / 100));
        return expectedMonthly;
      }
    });

    // Use calculateCompoundedRates to get the total compounded return rate
    const totalCompoundedRate = calculateCompoundedRates(monthlyReturnRates);
    
    // Convert back to effective monthly rate
    const effectiveMonthly = Math.pow(1 + totalCompoundedRate, 1 / months) - 1;
    return effectiveMonthly;
  },

  /**
   * Helper function to iterate through months and collect monthly values
   * Reusable pattern for inflation, return rates, and other monthly calculations
   */
  iterateMonthlyValues: <T>(
    params: {
      startDate: Date,
      endDate: Date,
      collector: (date: Date, monthIndex: number) => T
    }
  ): T[] => {
    const { startDate, endDate, collector } = params;
    const months = utils.calculateMonthsBetweenDates(startDate, endDate) + 1 || 0;
    if (months <= 0) return [];

    const monthlyValues: T[] = [];
    const iterDate = new Date(startDate);
    for (let i = 0; i < months; i++) {
      monthlyValues.push(collector(iterDate, i));
      iterDate.setMonth(iterDate.getMonth() + 1);
    }
    return monthlyValues;
  }
};

/**
 * Types and interfaces
 */
interface ProcessedGoalEvent {
  amount: number;
  month: number;
  description?: string;
  name?: string;
}

type MonthlyValues = {
  month: number;
  originalValues: {
    goals: Array<{ amount: number; description?: string }>;
    events: Array<{ amount: number; name: string }>;
  };
  inflationFactor: number;
  adjustedValues: {
    goals: Array<{ amount: number; description?: string }>;
    events: Array<{ amount: number; name: string }>;
    total: number;
  };
};

interface RetirementGoalsTotals {
  plannedPreRetirementGoalsTotal: number;
  plannedPostRetirementGoalsTotal: number;
  projectedPreRetirementGoalsTotal: number;
  projectedPostRetirementGoalsTotal: number;
}

interface ProjectionResult {
  projectedPresentValue: number;
  plannedPresentValue: number;
  projectedFuturePresentValue: number;
  plannedFuturePresentValue: number;
  projectedMonthsToRetirement: number;
  projectedContribution: number;
  projectedMonthlyIncome: number;
  plannedMonthsToRetirement: number;
  plannedContribution: number;
  plannedMonthlyIncome: number;
  monthsDifference: number;
  plannedMonths: number;
  referenceDate: Date;
  projectedRetirementDate: Date;
  plannedRetirementDate: Date;
  finalAgeDate: Date;
}

export interface PlanProgressData {
  projectedPresentValue: number;
  plannedPresentValue: number;
  projectedFuturePresentValue: number;
  plannedFuturePresentValue: number;
  plannedMonths: number;
  projectedMonths: number;
  monthsDifference: number;
  plannedContribution: number;
  projectedContribution: number;
  projectedMonthlyIncome: number;
  plannedMonthlyIncome: number;
  projectedRetirementDate: Date;
  finalAgeDate: Date;
  currentProgress: number;
  plannedAgeYears: number;
  plannedAgeMonths: number;
  projectedAgeYears: number;
  projectedAgeMonths: number;
  projectedAge: number;
  isAheadOfSchedule: boolean;
}

/**
 * Financial calculation functions
 */
const financialCalculations = {
  /**
   * Processes goals for financial calculations
   */
  processGoals: (goals: Goal[], referenceDate: Date, ignoreFinancialLinks: boolean = false) => {
    return goals.flatMap(goal => processItem(goal, 'goal', ignoreFinancialLinks));
  },

  /**
   * Processes events for financial calculations
   */
  processEvents: (events: ProjectedEvent[], referenceDate: Date, ignoreFinancialLinks: boolean = false) => {
    return events.flatMap(event => processItem(event, 'event', ignoreFinancialLinks));
  },

  /**
   * Creates a hash of monthly values for financial calculations
   * Uses actual monthly rates for precise calculations
   */
  createMonthlyValuesHash: (
    params: {
      monthlyInflationRates: number[],
      monthlyReturnRates: number[],
      goals: ProcessedGoalEvent[],
      events: ProcessedGoalEvent[],
      isPreRetirement: boolean,
      monthsToRetirement: number,
      startDate: Date
    }
  ): Record<number, MonthlyValues> => {
    const { monthlyInflationRates, monthlyReturnRates, goals, events, isPreRetirement, monthsToRetirement, startDate } = params;
    
    const relevantMonths = Array.from(new Set([
      ...goals.map(goal => goal.month),
      ...events.map(event => event.month)
    ])).sort((a, b) => a - b);

    const monthlyValuesHash: Record<number, MonthlyValues> = {};
    let currentMonth = 0;
    let cumulativeInflationFactor = 1;
    
    for (const targetMonth of relevantMonths) {
      // Calculate cumulative inflation factor up to target month using actual monthly rates
      while (currentMonth <= targetMonth) {
        if (currentMonth < monthlyInflationRates.length) {
          cumulativeInflationFactor *= (1 + monthlyInflationRates[currentMonth]);
        }
        currentMonth++;
      }

      const monthlyGoals = goals
        .filter(goal => goal.month === targetMonth)
        .map(goal => ({
          amount: goal.amount,
          description: goal.description
        }));

      const monthlyEvents = events
        .filter(event => event.month === targetMonth)
        .map(event => ({
          amount: event.amount,
          name: event.name
        }));

      if (monthlyGoals.length > 0 || monthlyEvents.length > 0) {
        // Calculate time adjustment factor using actual monthly return rates
        let timeAdjustmentFactor = 1;
        const monthsToCalculate = isPreRetirement ? targetMonth : targetMonth - monthsToRetirement;
        
        if (monthsToCalculate > 0) {
          const ratesForPeriod = monthlyReturnRates.slice(0, Math.min(monthsToCalculate, monthlyReturnRates.length));
          timeAdjustmentFactor = 1 + calculateCompoundedRates(ratesForPeriod);
        }
        
        const inflationAdjustedGoals = monthlyGoals.map(goal => ({
          amount: goal.amount / timeAdjustmentFactor,
          description: goal.description
        }));
        
        const inflationAdjustedEvents = monthlyEvents.map(event => ({
          amount: event.amount / timeAdjustmentFactor,
          name: event.name
        }));

        monthlyValuesHash[targetMonth] = {
          month: targetMonth,
          originalValues: {
            goals: monthlyGoals,
            events: monthlyEvents,
          },
          inflationFactor: cumulativeInflationFactor,
          adjustedValues: {
            goals: inflationAdjustedGoals,
            events: inflationAdjustedEvents,
            total: [
              ...inflationAdjustedGoals.map(goal => -goal.amount),
              ...inflationAdjustedEvents.map(event => event.amount)
            ].reduce((sum, value) => sum + value, 0)
          }
        };
      }
    }

    return monthlyValuesHash;
  },

  /**
   * Generates pre-calculation hash for financial projections
   * Uses monthly values with fallback to micro plans, following the same pattern as computeInflationFactor
   */
  generatePreCalculationHash: (
    params: {
      startDate: Date,
      endDate: Date,
      goals: Goal[],
      events: ProjectedEvent[],
      monthsToRetirement: number,
      referenceDate: Date,
      currency: 'BRL' | 'USD' | 'EUR',
      microPlans: MicroInvestmentPlan[],
      ignoreFinancialLinks?: boolean
    }
  ) => {
    const { startDate, endDate, goals, events, monthsToRetirement, referenceDate, currency, microPlans, ignoreFinancialLinks = false } = params;
    
    const processedGoals = financialCalculations.processGoals(goals, referenceDate, ignoreFinancialLinks);
    const processedEvents = financialCalculations.processEvents(events, referenceDate, ignoreFinancialLinks);

    // Separate into pre and post retirement
    const preRetirementGoals = processedGoals.filter(goal => goal.month <= monthsToRetirement);
    const postRetirementGoals = processedGoals.filter(goal => goal.month > monthsToRetirement);
    const preRetirementEvents = processedEvents.filter(event => event.month <= monthsToRetirement);
    const postRetirementEvents = processedEvents.filter(event => event.month > monthsToRetirement);

    // Calculate monthly inflation and return rates for the period using the same pattern
    // Create CPI map once for efficiency
    const adjustedStart = new Date(startDate);
    adjustedStart.setMonth(adjustedStart.getMonth() - 1);
    const cpiMap = createCPIRatesMapByCurrency(adjustedStart, endDate, currency);
    
    const monthlyInflationRates = utils.iterateMonthlyValues({
      startDate,
      endDate,
      collector: (iterDate) => {
        const key = `${iterDate.getFullYear()}-${iterDate.getMonth() + 1}`;
        const realMonthlyInflation = cpiMap.get(key);
        // Fallback: inflação do micro plano ativo no mês
        let rateForMonth = realMonthlyInflation;
        if (rateForMonth === undefined) {
          const activeMp = getActiveMicroPlanForDate(microPlans, iterDate);
          const mpMonthly = yearlyReturnRateToMonthlyReturnRate(((activeMp?.inflation || 0) / 100));
          rateForMonth = mpMonthly;
        }
        return rateForMonth;
      }
    });

    const monthlyReturnRates = utils.iterateMonthlyValues({
      startDate,
      endDate,
      collector: (iterDate) => {
        const activeMp = getActiveMicroPlanForDate(microPlans, iterDate);
        const expectedMonthly = yearlyReturnRateToMonthlyReturnRate(((activeMp?.expected_return || 0) / 100));
        return expectedMonthly;
      }
    });

    // Create separate hashes for pre and post retirement using actual monthly rates
    const preRetirementHash = financialCalculations.createMonthlyValuesHash({
      monthlyInflationRates,
      monthlyReturnRates,
      goals: preRetirementGoals,
      events: preRetirementEvents,
      isPreRetirement: true,
      monthsToRetirement,
      startDate
    });

    const postRetirementHash = financialCalculations.createMonthlyValuesHash({
      monthlyInflationRates,
      monthlyReturnRates,
      goals: postRetirementGoals,
      events: postRetirementEvents,
      isPreRetirement: false,
      monthsToRetirement,
      startDate
    });

    return { preRetirementHash, postRetirementHash };
  },

  /**
   * Calculates planned and projected retirement goals totals
   * Planned considers all goals/events, projected only considers pending ones
   */
  calculateRetirementGoalsTotals: (
    params: {
      startDate: Date,
      endDate: Date,
      allGoals: Goal[],
      allEvents: ProjectedEvent[],
      monthsToRetirement: number,
      referenceDate: Date,
      currency: 'BRL' | 'USD' | 'EUR',
      microPlans: MicroInvestmentPlan[]
    }
  ): RetirementGoalsTotals => {
    const { startDate, endDate, allGoals, allEvents, monthsToRetirement, referenceDate, currency, microPlans } = params;
    
    // Separate goals and events for planned vs projected calculations
    const pendingGoals = allGoals.filter(goal => goal.status === 'pending');
    const pendingEvents = allEvents.filter(event => event.status === 'pending');

    // Usar constantes importadas para controle de processamento

    // Generate hash for planned calculations (all goals/events, ignoring financial_links)
    const { preRetirementHash: plannedPreRetirementHash, postRetirementHash: plannedPostRetirementHash } = financialCalculations.generatePreCalculationHash({
      startDate,
      endDate,
      goals: allGoals,
      events: allEvents,
      monthsToRetirement,
      referenceDate,
      currency,
      microPlans,
      ignoreFinancialLinks: IGNORE_FINANCIAL_LINKS // Para planned: ignora financial_links
    });

    // Generate hash for projected calculations (only pending goals/events, considering financial_links)
    const { preRetirementHash: projectedPreRetirementHash, postRetirementHash: projectedPostRetirementHash } = financialCalculations.generatePreCalculationHash({
      startDate,
      endDate,
      goals: pendingGoals,
      events: pendingEvents,
      monthsToRetirement,
      referenceDate,
      currency,
      microPlans,
      ignoreFinancialLinks: CONSIDER_FINANCIAL_LINKS // Para projected: considera financial_links
    });

    // Sum of pre/post retirement goals for planned calculations (all goals/events)
    const plannedPreRetirementGoalsTotal = Object.values(plannedPreRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
    
    const plannedPostRetirementGoalsTotal = Object.values(plannedPostRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);

    // Sum of pre/post retirement goals for projected calculations (only pending goals/events)
    const projectedPreRetirementGoalsTotal = Object.values(projectedPreRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
    
    const projectedPostRetirementGoalsTotal = Object.values(projectedPostRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);

    return {
      plannedPreRetirementGoalsTotal,
      plannedPostRetirementGoalsTotal,
      projectedPreRetirementGoalsTotal,
      projectedPostRetirementGoalsTotal
    };
  },

  projectedMonthlyIncome: (
    planType: string,
    effectiveMonthlyRate: number,
    monthsInRetirement: number,
    presentValueAtRetirement: number,
    shouldAdjustIncomeForInflation: boolean,
    monthlyInflationRate: number,
    inflationFactorAtRetirement: number,
    legacyAmount: number,
    realReturnRate: number
  ): number =>
  {
    switch (planType) {
      // encerrar - não deve sobrar dinheiro ao final
      case "1":
        return -pmt(
          effectiveMonthlyRate,
          monthsInRetirement,
          presentValueAtRetirement * (shouldAdjustIncomeForInflation ? 1 : inflationFactorAtRetirement),
          0
        );
      // herança
      case "2":
        return -pmt(
          effectiveMonthlyRate,
          monthsInRetirement,
          presentValueAtRetirement * (shouldAdjustIncomeForInflation ? 1 : inflationFactorAtRetirement),
          -legacyAmount
        );
      // legado
      case "3":
        return ((presentValueAtRetirement * (shouldAdjustIncomeForInflation ? 1 : inflationFactorAtRetirement)) * (((realReturnRate + 1) *  (shouldAdjustIncomeForInflation ? 1 : monthlyInflationRate + 1 )) -1 ))
    }
  },
  /**
   * Calculates financial projections based on current state and plan
   */
  calculateProjections: (
    allFinancialRecords: FinancialRecord[],
    investmentPlan: InvestmentPlan,
    microPlans: MicroInvestmentPlan[],
    activeMicroPlan: MicroInvestmentPlan | null,
    birthDate: Date,
    allGoals: Goal[],
    allEvents: ProjectedEvent[],
    plannedFuturePresentValue: number,
    projectedFuturePresentValue: number,
    monthlyProjectionData: MonthlyProjectionData | null
  ): ProjectionResult => {
    const lastFinancialRecord = allFinancialRecords[0];
    const currentMonth = lastFinancialRecord?.record_month || 0;
    const currentYear = lastFinancialRecord?.record_year || 0;
    // Effective monthly expected return rate from actualDate to planEnd will be computed below using records + micro plans
    
    // Calculate reference date and months to retirement
    let actualDate;
    
    const planStartDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
    const planEndDate = createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date);
    const finalAgeDate = planEndDate;
    const totalPlannedMonths = utils.calculateMonthsBetweenDates(planStartDate, planEndDate) + 1;
    const plannedMonths = totalPlannedMonths;
    // if (currentMonth === 0 && currentYear === 0) {
    const referenceDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
    const inflationFactorAtRetirement = utils.computeInflationFactor({
      startDate: referenceDate,
      endDate: planEndDate,
      currency: investmentPlan.currency,
      microPlans
    });
    const monthlyInflationRate = Math.pow(inflationFactorAtRetirement, 1/totalPlannedMonths) - 1;
    if (currentMonth !== 0 && currentYear !== 0) {
      actualDate = createDateFromYearMonth(currentYear, currentMonth);
    }else {
      actualDate = referenceDate;
    }

    // Meses restantes até a aposentadoria a partir da actualDate
    const totalMonthsToRetirement = Math.max(0, utils.calculateMonthsBetweenDates(referenceDate, planEndDate) || 0);

    // Compute effective monthly expected return using micro plans
    const monthlyExpectedReturnRate = utils.computeEffectiveMonthlyReturnRate({
      startDate: referenceDate,
      endDate: planEndDate,
      microPlans
    });


    // Calculate planned and projected retirement goals totals
    const {
      plannedPreRetirementGoalsTotal,
      plannedPostRetirementGoalsTotal,
      projectedPreRetirementGoalsTotal,
      projectedPostRetirementGoalsTotal
    } = financialCalculations.calculateRetirementGoalsTotals({
      startDate: referenceDate,
      endDate: planEndDate,
      allGoals,
      allEvents,
      monthsToRetirement: totalMonthsToRetirement,
      referenceDate,
      currency: investmentPlan.currency,
      microPlans
    });
    
    // Get plan parameters
    const shouldAdjustContributionForInflation = investmentPlan.adjust_contribution_for_inflation;
    // Calcular contribuição média ponderada considerando mudanças de micro planos e (opcionalmente) inflação

    const monthlyContribution = utils.computeAverageMonthlyContribution({
      referenceDate,
      planEndDate,
      microPlans,
      activeMicroPlan,
      adjustForInflation: shouldAdjustContributionForInflation,
      planCurrency: investmentPlan.currency
    });

    console.log('START PARAMS ================================================')
    console.log('monthlyContribution', monthlyContribution)
    console.log('monthlyExpectedReturnRate', monthlyExpectedReturnRate)
    console.log('monthlyInflationRate', monthlyInflationRate)
    console.log('END PARAMS ================================================')
    const maximumAgeDate = utils.createDateAtAge(birthDate, investmentPlan.limit_age || 100);
    const monthsInRetirement = utils.calculateMonthsBetweenDates(planEndDate, maximumAgeDate);

    // Calculate effective rate based on inflation adjustment setting
    const effectiveMonthlyRate = shouldAdjustContributionForInflation ? monthlyExpectedReturnRate : calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);
    
    // Calculate adjusted present and future values
    const currentBalanceWithProjectedGoals = ((lastFinancialRecord?.ending_balance || investmentPlan.initial_amount) + projectedPreRetirementGoalsTotal) || 0;
    const initialAmountWithPlannedGoals = (investmentPlan.initial_amount + plannedPreRetirementGoalsTotal);
    // Fator de inflação até a aposentadoria usando util de CPI por moeda
    const projectedPresentValue = projectedFuturePresentValue / inflationFactorAtRetirement;
    // Calcular valores usando o micro plano ativo
    const calculations = calculateMicroPlanFutureValues(investmentPlan, activeMicroPlan, allFinancialRecords, birthDate);
    
    const goalProjectedPresentValue = calculations.presentFutureValue * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement);
    const adjustedGoalProjectedFutureValue = (goalProjectedPresentValue - projectedPostRetirementGoalsTotal * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement));
    const plannedPresentValue = plannedFuturePresentValue / inflationFactorAtRetirement;
    const goalPlannedPresentValue = calculations.presentFutureValue * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement);
    const adjustedGoalPlannedFutureValue = (goalPlannedPresentValue - plannedPostRetirementGoalsTotal * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement));
    const monthsElapsed = Math.max(0, utils.calculateMonthsBetweenDates(planStartDate, actualDate) + 1 || 1);
    // Calculate projections

    // PROJECTIONS 
    // Calcular a contribuição média até a data de referência (planStartDate -> actualDate)
    const monthlyContributionUntilReference = utils.computeAverageMonthlyContribution({
      referenceDate: planStartDate,
      planEndDate: actualDate,
      microPlans,
      activeMicroPlan,
      adjustForInflation: shouldAdjustContributionForInflation,
      planCurrency: investmentPlan.currency
    });

    const actualInflationUntilReference = utils.computeInflationFactor({
      startDate: planStartDate,
      endDate: actualDate,
      currency: investmentPlan.currency,
      microPlans
    });
    const monthlyInflationRateUntilReference = Math.pow(actualInflationUntilReference, 1/monthsElapsed) - 1;
    console.log('monthlyInflationRateUntilReference', monthlyInflationRateUntilReference)
    const monthlydReturnRateUntilReference = utils.computeEffectiveMonthlyReturnRate({
      startDate: planStartDate,
      endDate: actualDate,
      microPlans
    });
    console.log('monthlydReturnRateUntilReference', monthlydReturnRateUntilReference)
    const monthlyExpectedReturnRateUntilReference = shouldAdjustContributionForInflation ? monthlydReturnRateUntilReference : calculateCompoundedRates([monthlydReturnRateUntilReference, monthlyInflationRateUntilReference]);
    console.log('monthlyExpectedReturnRateUntilReference', monthlyExpectedReturnRateUntilReference)
    console.log('PROJECTED PARAMS ================================================')
    console.log('balancePresentValueAdjusted = -vp(', monthlyExpectedReturnRateUntilReference, monthsElapsed, -monthlyContributionUntilReference, -currentBalanceWithProjectedGoals, ')')
    const balancePresentValueAdjusted = -vp(
      monthlyExpectedReturnRateUntilReference,
      monthsElapsed,
      -monthlyContributionUntilReference,
      -currentBalanceWithProjectedGoals
    );
    console.log('projectedMonthsToRetirementParams = nper(', effectiveMonthlyRate, -monthlyContribution, -balancePresentValueAdjusted, adjustedGoalProjectedFutureValue, ')')
    const projectedMonthsToRetirement = Math.max(0, Math.ceil(nper(
      effectiveMonthlyRate,
      -monthlyContribution,
      -balancePresentValueAdjusted,
      adjustedGoalProjectedFutureValue
    ) - monthsElapsed));
    console.log('projectedMonthsToRetirement = ', projectedMonthsToRetirement)

    const projectedContribution = -pmt(
      effectiveMonthlyRate,
      totalMonthsToRetirement,
      -currentBalanceWithProjectedGoals,
      adjustedGoalProjectedFutureValue
    );

    const projectedMonthlyIncome = financialCalculations.projectedMonthlyIncome(
      investmentPlan.plan_type,
      effectiveMonthlyRate,
      monthsInRetirement,
      projectedPresentValue,
      investmentPlan.adjust_income_for_inflation,
      monthlyInflationRate,
      inflationFactorAtRetirement,
      investmentPlan.legacy_amount,
      monthlyExpectedReturnRate
    )

    // PLANNED DATA
    let plannedMonthsToRetirement = 0;
    let plannedContribution = 0;
    console.log('PLANNED PARAMS ================================================')
    if (monthlyProjectionData) {
      // se tiver registros financeiros, usar os dados da projeção
      const plannedBalanceWithGoals = (monthlyProjectionData.planned_balance + plannedPreRetirementGoalsTotal)
      console.log('monthlyExpectedReturnRateUntilReference', monthlyExpectedReturnRateUntilReference)
      const plannedBalancePresentValue = -vp(monthlyExpectedReturnRateUntilReference, monthsElapsed, -monthlyContributionUntilReference, -plannedBalanceWithGoals)
      console.log('plannedMonthsToRetirementParams = nper(', effectiveMonthlyRate, -monthlyContribution, -plannedBalanceWithGoals, adjustedGoalPlannedFutureValue, ')')
      plannedMonthsToRetirement = Math.max(0, Math.ceil(nper(
        effectiveMonthlyRate,
        -monthlyContribution,
        -plannedBalancePresentValue,
        adjustedGoalPlannedFutureValue
      ) - monthsElapsed));
      console.log('plannedMonthsToRetirement = ', plannedMonthsToRetirement)
      plannedContribution = -pmt(
        effectiveMonthlyRate,
        totalMonthsToRetirement,
        -plannedBalanceWithGoals,
        adjustedGoalPlannedFutureValue
      )
    }else{
      console.log('plannedMonthsToRetirementParams = nper(', effectiveMonthlyRate, -monthlyContribution, -initialAmountWithPlannedGoals, adjustedGoalPlannedFutureValue, ')')
      plannedMonthsToRetirement = Math.max(0, Math.ceil(nper(
        effectiveMonthlyRate,
        -monthlyContribution,
        -initialAmountWithPlannedGoals,
        adjustedGoalPlannedFutureValue
      ) - monthsElapsed));
      console.log('plannedMonthsToRetirement = ', plannedMonthsToRetirement)
  
      plannedContribution = -pmt(
        effectiveMonthlyRate,
        totalPlannedMonths,
        -initialAmountWithPlannedGoals,
        adjustedGoalPlannedFutureValue
      );
    }


    const plannedMonthlyIncome = financialCalculations.projectedMonthlyIncome(
      investmentPlan.plan_type,
      effectiveMonthlyRate,
      monthsInRetirement,
      plannedPresentValue,
      investmentPlan.adjust_income_for_inflation,
      monthlyInflationRate,
      inflationFactorAtRetirement,
      investmentPlan.legacy_amount,
      monthlyExpectedReturnRate
    )
    
    // Calculate dates and differences
    const projectedRetirementDate = utils.addMonthsToDate(actualDate, projectedMonthsToRetirement);
    const plannedRetirementDate = utils.addMonthsToDate(actualDate, plannedMonthsToRetirement);
    const monthsDifference = utils.calculateMonthsBetweenDates(projectedRetirementDate, plannedRetirementDate);
    return {
      projectedPresentValue,
      plannedPresentValue,
      projectedFuturePresentValue,
      plannedFuturePresentValue,
      projectedMonthsToRetirement,
      projectedContribution,
      projectedMonthlyIncome,
      plannedMonthsToRetirement,
      plannedContribution,
      plannedMonthlyIncome,
      monthsDifference,
      plannedMonths,
      referenceDate,
      projectedRetirementDate,
      plannedRetirementDate,
      finalAgeDate
    };
  }
};

/**
 * Processes all data needed for the PlanProgress component
 * @param allFinancialRecords - List of all financial records
 * @param investmentPlan - Investment plan details
 * @param profile - User profile with birth date
 * @param goals - Financial goals
 * @param events - Projected events
 * @returns Processed data for rendering or null if required data is missing
 */
export function processPlanProgressData(
  allFinancialRecords: FinancialRecord[],
  investmentPlan: InvestmentPlan,
  microPlans: MicroInvestmentPlan[],
  activeMicroPlan: MicroInvestmentPlan | null,
  profile: { birth_date?: string },
  goals: Goal[],
  events: ProjectedEvent[],
  plannedFuturePresentValue: number,
  projectedFuturePresentValue: number,
  lastHistoricalDataInfo: HistoricalDataInfo
): PlanProgressData | null {
  if (!investmentPlan || !profile.birth_date) return null;

  const birthDate = createDateWithoutTimezone(profile.birth_date);
  const lastFinancialRecord = allFinancialRecords[0];

  const currentBalance = lastFinancialRecord?.ending_balance || investmentPlan.initial_amount;
  // Calcular valores usando o micro plano ativo
  const calculations = calculateMicroPlanFutureValues(investmentPlan, activeMicroPlan, allFinancialRecords, birthDate);
  const investmentGoal = calculations.futureValue || 0;
  const currentProgress = (currentBalance / investmentGoal) * 100;
  
  // Calculate projections
  // Pass all goals/events - planned considers all, projected only considers pending
  const projections = financialCalculations.calculateProjections(
    allFinancialRecords, 
    investmentPlan, 
    microPlans,
    activeMicroPlan,
    birthDate, 
    goals, 
    events,
    plannedFuturePresentValue,
    projectedFuturePresentValue,
    lastHistoricalDataInfo.lastHistoricalMonth
  );

  // Calcular a idade projetada em anos e meses
  const projectedRetirementDate = projections.projectedRetirementDate;
  let projectedAgeYears = projectedRetirementDate.getFullYear() - birthDate.getFullYear();
  let projectedAgeMonths = projectedRetirementDate.getMonth() - birthDate.getMonth();
  
  const plannedRetirementDate = projections.plannedRetirementDate;
  let plannedAgeYears = plannedRetirementDate.getFullYear() - birthDate.getFullYear();
  let plannedAgeMonths = plannedRetirementDate.getMonth() - birthDate.getMonth();
  
  // Ajustar meses se negativo
  if (projectedAgeMonths < 0) {
    projectedAgeYears--;
    projectedAgeMonths += 12;
  }
  if (plannedAgeMonths < 0) {
    plannedAgeYears--;
    plannedAgeMonths += 12;
  }

  return {
    projectedPresentValue: projections.projectedPresentValue,
    plannedPresentValue: projections.plannedPresentValue,
    plannedFuturePresentValue: projections.plannedFuturePresentValue,
    projectedFuturePresentValue: projections.projectedFuturePresentValue,
    plannedMonths: projections.plannedMonthsToRetirement,
    projectedMonths: projections.projectedMonthsToRetirement,
    monthsDifference: projections.monthsDifference,
    plannedContribution: projections.plannedContribution,
    projectedContribution: projections.projectedContribution,
    projectedMonthlyIncome: projections.projectedMonthlyIncome,
    plannedMonthlyIncome: projections.plannedMonthlyIncome,
    projectedRetirementDate: projections.projectedRetirementDate,
    finalAgeDate: projections.finalAgeDate,
    currentProgress,
    projectedAgeYears,
    projectedAgeMonths,
    plannedAgeYears,
    plannedAgeMonths,
    projectedAge: projectedAgeYears + projectedAgeMonths / 12,
    isAheadOfSchedule: projections.monthsDifference > 0
  };
} 