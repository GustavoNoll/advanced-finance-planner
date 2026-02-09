import { FinancialRecord, InvestmentPlan, MicroInvestmentPlan, Goal, ProjectedEvent } from "@/types/financial";
import { calculateCompoundedRates, nper, yearlyReturnRateToMonthlyReturnRate, pmt, vp } from "@/lib/financial-math";
import { processItem, IGNORE_FINANCIAL_LINKS, CONSIDER_FINANCIAL_LINKS } from './financial-goals-processor';
import { createDateWithoutTimezone, createDateFromYearMonth } from '@/utils/dateUtils';
import { createCPIRatesMapByCurrency } from './inflation-utils';
import { calculateMicroPlanFutureValues, Calculations } from '@/utils/investmentPlanCalculations';
import { getActiveMicroPlanForDate } from '@/utils/microPlanUtils';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Collection of utility functions for date and financial calculations
 */
export const utils = {
  /**
   * Calculates the number of months between two dates (inclusive)
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Number of months between dates, or null if dates are invalid
   */
  calculateMonthsBetweenDates: (startDate: Date, endDate: Date): number | null => {
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
   * @param birthDate - Birth date
   * @param targetAge - Target age in years
   * @returns Date when the person will reach the target age
   */
  createDateAtAge: (birthDate: Date, targetAge: number): Date => {
    const targetDate = createDateWithoutTimezone(birthDate);
    targetDate.setFullYear(birthDate.getFullYear() + targetAge);
    return targetDate;
  },

  /**
   * Adds months to a date
   * @param baseDate - Base date to add months to
   * @param monthsToAdd - Number of months to add
   * @returns New date with months added
   */
  addMonthsToDate: (baseDate: Date, monthsToAdd: number): Date => {
    const newDate = createDateWithoutTimezone(baseDate);
    newDate.setMonth(baseDate.getMonth() + monthsToAdd + 1);
    return newDate;
  },

  /**
   * Computes weighted-average monthly contribution between reference date and plan end date.
   * Handles multiple micro plan segments and currency-aware real CPI where available.
   * 
   * This function:
   * - Splits the period into segments based on micro plan changes
   * - Applies inflation adjustments if requested
   * - Calculates a weighted average contribution across all segments
   * 
   * @param params - Parameters object
   * @param params.referenceDate - Reference date for calculations
   * @param params.planEndDate - End date of the investment plan
   * @param params.microPlans - Array of micro investment plans
   * @param params.activeMicroPlan - Currently active micro plan
   * @param params.adjustForInflation - Whether to adjust contributions for inflation
   * @param params.planCurrency - Currency of the plan (BRL, USD, or EUR)
   * @param params.cpiRatesMap - Optional pre-computed CPI rates map
   * @returns Weighted average monthly contribution
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
    const adjustedReferenceDate = new Date(referenceDate);
    adjustedReferenceDate.setMonth(adjustedReferenceDate.getMonth() - 1);
    const cpiRatesMapForPeriod = cpiRatesMap || createCPIRatesMapByCurrency(adjustedReferenceDate, planEndDate, planCurrency);

    // Sort micro plans by effective date
    const sortedMicroPlans = [...(microPlans || [])]
      .filter(mp => mp && mp.effective_date)
      .sort((a, b) => new Date(a.effective_date).getTime() - new Date(b.effective_date).getTime());

    // Find the active micro plan index at reference date
    const activeMicroPlanIndex = sortedMicroPlans
      .map((mp, idx) => ({ idx, date: createDateWithoutTimezone(mp.effective_date) }))
      .filter(({ date }) => date.getTime() <= referenceDate.getTime())
      .map(({ idx }) => idx)
      .pop();

    // Build segments array for each period with different contribution rates
    const contributionSegments: Array<{ start: Date; end: Date; deposit: number; inflationMonthlyRate: number }> = [];

    let currentDepositAmount = activeMicroPlanIndex !== undefined 
      ? (sortedMicroPlans[activeMicroPlanIndex].monthly_deposit || 0) 
      : (activeMicroPlan?.monthly_deposit || 0);
    
    let currentInflationMonthlyRate = (() => {
      const baseInflation = activeMicroPlanIndex !== undefined 
        ? (sortedMicroPlans[activeMicroPlanIndex].inflation || 0) 
        : (activeMicroPlan?.inflation || 0);
      return yearlyReturnRateToMonthlyReturnRate((baseInflation || 0) / 100);
    })();
    
    let currentSegmentStartDate = referenceDate;

    // Process future micro plan changes
    const futureMicroPlanChanges = sortedMicroPlans.filter(
      mp => createDateWithoutTimezone(mp.effective_date).getTime() > referenceDate.getTime()
    );
    
    for (const microPlan of futureMicroPlanChanges) {
      const changeDate = createDateWithoutTimezone(microPlan.effective_date);
      // If change occurs at or after plan end, break and let final segment handle it
      if (changeDate.getTime() >= planEndDate.getTime()) break;
      
      // Create segment from current start to change date
      if (changeDate.getTime() > currentSegmentStartDate.getTime()) {
        contributionSegments.push({ 
          start: currentSegmentStartDate, 
          end: changeDate, 
          deposit: currentDepositAmount, 
          inflationMonthlyRate: currentInflationMonthlyRate 
        });
      }
      
      // Start new segment from change date
      currentSegmentStartDate = changeDate;
      currentDepositAmount = microPlan.monthly_deposit || 0;
      currentInflationMonthlyRate = yearlyReturnRateToMonthlyReturnRate(((microPlan.inflation || 0) / 100));
    }

    // Add final segment if needed
    if (planEndDate.getTime() > currentSegmentStartDate.getTime()) {
      // Avoid duplicating if there's already a segment ending exactly at planEndDate
      const lastSegment = contributionSegments[contributionSegments.length - 1];
      const alreadyCovered = lastSegment && lastSegment.end && lastSegment.end.getTime() === planEndDate.getTime();
      if (!alreadyCovered) {
        contributionSegments.push({ 
          start: currentSegmentStartDate, 
          end: planEndDate, 
          deposit: currentDepositAmount, 
          inflationMonthlyRate: currentInflationMonthlyRate 
        });
      }
    }

    // Calculate weighted sum of contributions
    let weightedContributionSum = 0;
    for (const segment of contributionSegments) {
      const monthsInSegment = utils.calculateMonthsBetweenDates(segment.start, segment.end) + 1 || 0;
      if (monthsInSegment <= 0) continue;
      
      let effectiveDepositAmount = segment.deposit || 0;
      
      if (adjustForInflation) {
        const monthsFromReferenceToSegment = Math.max(0, utils.calculateMonthsBetweenDates(referenceDate, segment.start) + 1 || 0);
        let cumulativeInflationFactor = 1;
        
        if (monthsFromReferenceToSegment > 1) {
          const iterationDate = new Date(referenceDate);
          for (let i = 0; i < monthsFromReferenceToSegment; i++) {
            const year = iterationDate.getFullYear();
            const month = iterationDate.getMonth() + 1;
            const cpiKey = `${year}-${month}`;
            const realMonthlyInflationRate = cpiRatesMapForPeriod.get(cpiKey);
            const inflationRateForMonth = realMonthlyInflationRate !== undefined 
              ? realMonthlyInflationRate 
              : segment.inflationMonthlyRate;
            cumulativeInflationFactor *= (1 + inflationRateForMonth);
            iterationDate.setMonth(iterationDate.getMonth() + 1);
          }
        }
        
        effectiveDepositAmount = cumulativeInflationFactor > 0 
          ? (effectiveDepositAmount / cumulativeInflationFactor) 
          : effectiveDepositAmount;
      }
      
      weightedContributionSum += effectiveDepositAmount * monthsInSegment;
    }

    const averageMonthlyContribution = weightedContributionSum / totalMonths;
    return averageMonthlyContribution;
  },

  /**
   * Computes cumulative inflation factor from startDate (inclusive) to endDate (exclusive).
   * Uses CPI by currency where available and falls back to micro plan inflation rates.
   * Uses calculateCompoundedRates for precise rate composition.
   * 
   * @param params - Parameters object
   * @param params.startDate - Start date for inflation calculation
   * @param params.endDate - End date for inflation calculation
   * @param params.currency - Currency code (BRL, USD, or EUR)
   * @param params.microPlans - Array of micro investment plans
   * @returns Cumulative inflation factor (1.0 = no inflation, >1.0 = inflation occurred)
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
    const totalMonths = utils.calculateMonthsBetweenDates(startDate, endDate) + 1 || 0;
    if (totalMonths <= 0) return 1;

    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setMonth(adjustedStartDate.getMonth() - 1);
    const cpiRatesMap = createCPIRatesMapByCurrency(adjustedStartDate, endDate, currency);

    // Collect all monthly inflation rates for the period
    const monthlyInflationRates = utils.iterateMonthlyValues({
      startDate,
      endDate,
      collector: (iterationDate) => {
        const cpiKey = `${iterationDate.getFullYear()}-${iterationDate.getMonth() + 1}`;
        const realMonthlyInflationRate = cpiRatesMap.get(cpiKey);
        
        // Fallback: use inflation from active micro plan for the month
        let inflationRateForMonth = realMonthlyInflationRate;
        if (inflationRateForMonth === undefined) {
          const activeMicroPlanForDate = getActiveMicroPlanForDate(microPlans, iterationDate);
          const microPlanMonthlyInflation = yearlyReturnRateToMonthlyReturnRate(
            ((activeMicroPlanForDate?.inflation || 0) / 100)
          );
          inflationRateForMonth = microPlanMonthlyInflation;
        }
        return inflationRateForMonth;
      }
    });

    // Use calculateCompoundedRates to get the total compounded inflation rate
    const totalCompoundedInflationRate = calculateCompoundedRates(monthlyInflationRates);
    
    // Convert back to inflation factor
    return 1 + totalCompoundedInflationRate;
  },

  /**
   * Computes an effective monthly expected return rate across a period.
   * Uses only the expected_return of the active micro plan for each month.
   * Uses calculateCompoundedRates for precise rate composition.
   * 
   * @param params - Parameters object
   * @param params.startDate - Start date for return rate calculation
   * @param params.endDate - End date for return rate calculation
   * @param params.microPlans - Array of micro investment plans
   * @returns Effective monthly return rate (as decimal, e.g., 0.01 = 1%)
   */
  computeEffectiveMonthlyReturnRate: (
    params: {
      startDate: Date,
      endDate: Date,
      microPlans: MicroInvestmentPlan[]
    }
  ): number => {
    const { startDate, endDate, microPlans } = params;
    const totalMonths = utils.calculateMonthsBetweenDates(startDate, endDate) + 1 || 0;
    if (totalMonths <= 0) return 0;

    // Collect all monthly return rates for the period
    const monthlyReturnRates = utils.iterateMonthlyValues({
      startDate,
      endDate,
      collector: (iterationDate) => {
        const activeMicroPlanForDate = getActiveMicroPlanForDate(microPlans, iterationDate);
        const expectedMonthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(
          ((activeMicroPlanForDate?.expected_return || 0) / 100)
        );
        return expectedMonthlyReturnRate;
      }
    });

    // Use calculateCompoundedRates to get the total compounded return rate
    const totalCompoundedReturnRate = calculateCompoundedRates(monthlyReturnRates);
    
    // Convert back to effective monthly rate
    const effectiveMonthlyReturnRate = Math.pow(1 + totalCompoundedReturnRate, 1 / totalMonths) - 1;
    return effectiveMonthlyReturnRate;
  },

  /**
   * Helper function to iterate through months and collect monthly values.
   * Reusable pattern for inflation, return rates, and other monthly calculations.
   * 
   * @template T - Type of value to collect
   * @param params - Parameters object
   * @param params.startDate - Start date for iteration
   * @param params.endDate - End date for iteration
   * @param params.collector - Function to collect value for each month
   * @returns Array of collected values, one per month
   */
  iterateMonthlyValues: <T>(
    params: {
      startDate: Date,
      endDate: Date,
      collector: (date: Date, monthIndex: number) => T
    }
  ): T[] => {
    const { startDate, endDate, collector } = params;
    const totalMonths = utils.calculateMonthsBetweenDates(startDate, endDate) + 1 || 0;
    if (totalMonths <= 0) return [];

    const monthlyValues: T[] = [];
    const iterationDate = new Date(startDate);
    for (let monthIndex = 0; monthIndex < totalMonths; monthIndex++) {
      monthlyValues.push(collector(iterationDate, monthIndex));
      iterationDate.setMonth(iterationDate.getMonth() + 1);
    }
    return monthlyValues;
  }
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Processed goal or event with date information
 */
interface ProcessedGoalEvent {
  amount: number;
  month: number;
  year: number;
  description?: string;
  name?: string;
  adjust_for_inflation: boolean;
}

/**
 * Monthly aggregated values for goals and events
 */
type MonthlyValues = {
  month: number;
  year: number;
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

/**
 * Totals for retirement goals, separated by planned vs projected and pre vs post retirement
 */
interface RetirementGoalsTotals {
  plannedPreRetirementGoalsTotal: number;
  plannedPostRetirementGoalsTotal: number;
  projectedPreRetirementGoalsTotal: number;
  projectedPostRetirementGoalsTotal: number;
}

/**
 * Result of financial projection calculations
 */
interface ProjectionResult {
  projectedPresentValue: number;
  plannedPresentValue: number;
  projectedGoalFutureValue: number;
  plannedGoalFutureValue: number;
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
  actualDate: Date;
}

/**
 * Complete plan progress data for display in UI
 */
export interface PlanProgressData {
  projectedPresentValue: number;
  plannedPresentValue: number;
  projectedGoalFutureValue: number;
  plannedGoalFutureValue: number;
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
  actualDate: Date;
  investmentPlanMonthsToRetirement: number;
}

// ============================================================================
// FINANCIAL CALCULATION FUNCTIONS
// ============================================================================

/**
 * Collection of financial calculation functions for plan progress
 */
const financialCalculations = {
  /**
   * Processes goals for financial calculations
   * @param goals - Array of goals to process
   * @param ignoreFinancialLinks - Whether to ignore financial links when processing
   * @returns Array of processed goal events
   */
  processGoals: (goals: Goal[], ignoreFinancialLinks: boolean = false): ProcessedGoalEvent[] => {
    return goals.flatMap(goal => processItem(goal, 'goal', ignoreFinancialLinks));
  },

  /**
   * Processes events for financial calculations
   * @param events - Array of events to process
   * @param ignoreFinancialLinks - Whether to ignore financial links when processing
   * @returns Array of processed events
   */
  processEvents: (events: ProjectedEvent[], ignoreFinancialLinks: boolean = false): ProcessedGoalEvent[] => {
    return events.flatMap(event => processItem(event, 'event', ignoreFinancialLinks));
  },

  /**
   * Creates a hash of monthly values for financial calculations.
   * Uses actual monthly rates for precise calculations.
   * 
   * This function aggregates goals and events by month, applies inflation adjustments,
   * and calculates time-adjusted values based on return rates.
   * 
   * @param params - Parameters object
   * @param params.monthlyInflationRates - Array of monthly inflation rates
   * @param params.monthlyReturnRates - Array of monthly return rates
   * @param params.goals - Processed goals
   * @param params.events - Processed events
   * @param params.isPreRetirement - Whether this is pre-retirement period
   * @param params.monthsToRetirement - Number of months until retirement
   * @param params.startDate - Start date for calculations
   * @param params.actualDate - Current actual date
   * @returns Hash map of monthly values keyed by "year-month"
   */
  createMonthlyValuesHash: (
    params: {
      monthlyInflationRates: number[],
      monthlyReturnRates: number[],
      goals: ProcessedGoalEvent[],
      events: ProcessedGoalEvent[],
      isPreRetirement: boolean,
      monthsToRetirement: number,
      startDate: Date,
      actualDate: Date
    }
  ): Record<string, MonthlyValues> => {
    const { 
      monthlyInflationRates, 
      monthlyReturnRates, 
      goals, 
      events, 
      isPreRetirement, 
      monthsToRetirement, 
      startDate, 
      actualDate 
    } = params;
    
    // Create unique date keys (year-month) for all goals and events
    const relevantDateKeys = Array.from(new Set([
      ...goals.map(goal => `${goal.year}-${goal.month}`),
      ...events.map(event => `${event.year}-${event.month}`)
    ])).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return yearA === yearB ? monthA - monthB : yearA - yearB;
    });

    const monthlyValuesHash: Record<string, MonthlyValues> = {};
    let currentMonthIndex = 0;
    let cumulativeInflationFactor = 1;
    
    for (const dateKey of relevantDateKeys) {
      const [targetYear, targetMonth] = dateKey.split('-').map(Number);
      const targetDate = createDateFromYearMonth(targetYear, targetMonth);
      
      // Check if target date is in the future compared to actual date (only year/month comparison)
      const isFutureDate = targetYear > actualDate.getFullYear() || 
        (targetYear === actualDate.getFullYear() && targetMonth > actualDate.getMonth() + 1);
      
      // Calculate months from start date to target date
      const monthsFromStart = utils.calculateMonthsBetweenDates(startDate, targetDate);
      
      // Always calculate cumulative inflation factor up to target month using actual monthly rates
      // Needed for all dates: past dates use it for time adjustment, future dates use it for
      // goals/events that don't adjust for inflation (their real value decreases over time)
      while (currentMonthIndex <= monthsFromStart) {
        if (currentMonthIndex < monthlyInflationRates.length) {
          cumulativeInflationFactor *= (1 + monthlyInflationRates[currentMonthIndex]);
        }
        currentMonthIndex++;
      }

      const monthlyGoals = goals
        .filter(goal => goal.year === targetYear && goal.month === targetMonth)
        .map(goal => ({
          amount: goal.amount,
          description: goal.description,
          adjust_for_inflation: goal.adjust_for_inflation
        }));

      const monthlyEvents = events
        .filter(event => event.year === targetYear && event.month === targetMonth)
        .map(event => ({
          amount: event.amount,
          name: event.name,
          adjust_for_inflation: event.adjust_for_inflation
        }));

      if (monthlyGoals.length > 0 || monthlyEvents.length > 0) {
        // Calculate time adjustment factor using actual monthly return rates
        let timeAdjustmentFactor = 1;
        const monthsToCalculate = isPreRetirement 
          ? monthsFromStart 
          : monthsFromStart - monthsToRetirement;
        
        if (monthsToCalculate > 0) {
          const returnRatesForPeriod = monthlyReturnRates.slice(
            0, 
            Math.min(monthsToCalculate, monthlyReturnRates.length)
          );
          timeAdjustmentFactor = 1 + calculateCompoundedRates(returnRatesForPeriod);
        }
        
        // adjust_for_inflation true (default): value grows with inflation
        //   - future: amount as-is (already in current terms)
        //   - past: amount / timeAdjustmentFactor (discount by real returns)
        // adjust_for_inflation false: value is fixed nominally, real value decreases
        //   - future: amount / cumulativeInflationFactor (discount by future inflation)
        //   - past: amount / (timeAdjustmentFactor * cumulativeInflationFactor)
        const inflationAdjustedGoals = monthlyGoals.map(goal => {
          const adjustForInflation = goal.adjust_for_inflation !== false;
          let adjustedAmount: number;
          if (adjustForInflation) {
            adjustedAmount = isFutureDate ? goal.amount : goal.amount / timeAdjustmentFactor;
          } else {
            adjustedAmount = isFutureDate
              ? goal.amount / cumulativeInflationFactor
              : goal.amount / (timeAdjustmentFactor * cumulativeInflationFactor);
          }
          return { amount: adjustedAmount, description: goal.description };
        });
        
        const inflationAdjustedEvents = monthlyEvents.map(event => {
          const adjustForInflation = event.adjust_for_inflation !== false;
          let adjustedAmount: number;
          if (adjustForInflation) {
            adjustedAmount = isFutureDate ? event.amount : event.amount / timeAdjustmentFactor;
          } else {
            adjustedAmount = isFutureDate
              ? event.amount / cumulativeInflationFactor
              : event.amount / (timeAdjustmentFactor * cumulativeInflationFactor);
          }
          return { amount: adjustedAmount, name: event.name };
        });

        monthlyValuesHash[dateKey] = {
          month: targetMonth,
          year: targetYear,
          originalValues: {
            goals: monthlyGoals.map(g => ({ amount: g.amount, description: g.description })),
            events: monthlyEvents.map(e => ({ amount: e.amount, name: e.name })),
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
   * Generates pre-calculation hash for financial projections.
   * Uses monthly values with fallback to micro plans, following the same pattern as computeInflationFactor.
   * 
   * Separates goals and events into pre-retirement and post-retirement periods,
   * then creates monthly value hashes for each period.
   * 
   * @param params - Parameters object
   * @param params.startDate - Start date for calculations
   * @param params.endDate - End date for calculations
   * @param params.goals - Array of goals
   * @param params.events - Array of events
   * @param params.monthsToRetirement - Number of months until retirement
   * @param params.currency - Currency code
   * @param params.microPlans - Array of micro investment plans
   * @param params.ignoreFinancialLinks - Whether to ignore financial links
   * @param params.actualDate - Current actual date
   * @returns Object with preRetirementHash and postRetirementHash
   */
  generatePreCalculationHash: (
    params: {
      startDate: Date,
      endDate: Date,
      goals: Goal[],
      events: ProjectedEvent[],
      monthsToRetirement: number,
      currency: 'BRL' | 'USD' | 'EUR',
      microPlans: MicroInvestmentPlan[],
      ignoreFinancialLinks?: boolean,
      actualDate: Date
    }
  ) => {
    const { 
      startDate, 
      endDate, 
      goals, 
      events, 
      monthsToRetirement, 
      currency, 
      microPlans, 
      ignoreFinancialLinks = false, 
      actualDate 
    } = params;

    const processedGoals = financialCalculations.processGoals(goals, ignoreFinancialLinks);
    const processedEvents = financialCalculations.processEvents(events, ignoreFinancialLinks);
    
    // Calculate retirement date
    const retirementDate = utils.addMonthsToDate(startDate, monthsToRetirement);
    
    // Separate into pre and post retirement
    const preRetirementGoals = processedGoals.filter(goal => {
      const goalDate = createDateFromYearMonth(goal.year, goal.month);
      return goalDate < retirementDate;
    });
    
    const postRetirementGoals = processedGoals.filter(goal => {
      const goalDate = createDateFromYearMonth(goal.year, goal.month);
      return goalDate >= retirementDate;
    });
    
    const preRetirementEvents = processedEvents.filter(event => {
      const eventDate = createDateFromYearMonth(event.year, event.month);
      return eventDate < retirementDate;
    });
    
    const postRetirementEvents = processedEvents.filter(event => {
      const eventDate = createDateFromYearMonth(event.year, event.month);
      return eventDate >= retirementDate;
    });

    // Calculate monthly inflation and return rates for the period
    // Create CPI map once for efficiency
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setMonth(adjustedStartDate.getMonth() - 1);
    const cpiRatesMap = createCPIRatesMapByCurrency(adjustedStartDate, endDate, currency);
    
    const monthlyInflationRates = utils.iterateMonthlyValues({
      startDate,
      endDate,
      collector: (iterationDate) => {
        const cpiKey = `${iterationDate.getFullYear()}-${iterationDate.getMonth() + 1}`;
        const realMonthlyInflationRate = cpiRatesMap.get(cpiKey);
        
        // Fallback: use inflation from active micro plan for the month
        let inflationRateForMonth = realMonthlyInflationRate;
        if (inflationRateForMonth === undefined) {
          const activeMicroPlanForDate = getActiveMicroPlanForDate(microPlans, iterationDate);
          const microPlanMonthlyInflation = yearlyReturnRateToMonthlyReturnRate(
            ((activeMicroPlanForDate?.inflation || 0) / 100)
          );
          inflationRateForMonth = microPlanMonthlyInflation;
        }
        return inflationRateForMonth;
      }
    });

    const monthlyReturnRates = utils.iterateMonthlyValues({
      startDate,
      endDate,
      collector: (iterationDate) => {
        const activeMicroPlanForDate = getActiveMicroPlanForDate(microPlans, iterationDate);
        const expectedMonthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(
          ((activeMicroPlanForDate?.expected_return || 0) / 100)
        );
        return expectedMonthlyReturnRate;
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
      startDate,
      actualDate
    });

    const postRetirementHash = financialCalculations.createMonthlyValuesHash({
      monthlyInflationRates,
      monthlyReturnRates,
      goals: postRetirementGoals,
      events: postRetirementEvents,
      isPreRetirement: false,
      monthsToRetirement,
      startDate,
      actualDate
    });

    return { preRetirementHash, postRetirementHash };
  },

  /**
   * Calculates planned and projected retirement goals totals.
   * 
   * Planned considers all goals/events (ignoring financial links).
   * Projected only considers pending ones (goals/events without financial links).
   * 
   * @param params - Parameters object
   * @param params.startDate - Start date for calculations
   * @param params.endDate - End date for calculations
   * @param params.allGoals - All goals
   * @param params.allEvents - All events
   * @param params.monthsToRetirement - Number of months until retirement
   * @param params.currency - Currency code
   * @param params.microPlans - Array of micro investment plans
   * @param params.actualDate - Current actual date
   * @returns Object with totals for planned and projected, pre and post retirement
   */
  calculateRetirementGoalsTotals: (
    params: {
      startDate: Date,
      endDate: Date,
      allGoals: Goal[],
      allEvents: ProjectedEvent[],
      monthsToRetirement: number,
      currency: 'BRL' | 'USD' | 'EUR',
      microPlans: MicroInvestmentPlan[],
      actualDate: Date
    }
  ): RetirementGoalsTotals => {
    const { startDate, endDate, allGoals, allEvents, monthsToRetirement, currency, microPlans, actualDate } = params;

    // Filter pending goals/events (those without financial links)
    const pendingGoals = allGoals.filter(goal => goal.financial_links.length === 0);
    const pendingEvents = allEvents.filter(event => event.financial_links.length === 0);

    // Generate hash for planned calculations (all goals/events, ignoring financial_links)
    const { 
      preRetirementHash: plannedPreRetirementHash, 
      postRetirementHash: plannedPostRetirementHash 
    } = financialCalculations.generatePreCalculationHash({
      startDate,
      endDate,
      goals: allGoals,
      events: allEvents,
      monthsToRetirement,
      currency,
      microPlans,
      ignoreFinancialLinks: IGNORE_FINANCIAL_LINKS,
      actualDate
    });

    // Generate hash for projected calculations (only pending goals/events, considering financial_links)
    const { 
      preRetirementHash: projectedPreRetirementHash, 
      postRetirementHash: projectedPostRetirementHash 
    } = financialCalculations.generatePreCalculationHash({
      startDate,
      endDate,
      goals: pendingGoals,
      events: pendingEvents,
      monthsToRetirement,
      currency,
      microPlans,
      ignoreFinancialLinks: CONSIDER_FINANCIAL_LINKS,
      actualDate
    });

    // Sum totals from hashes
    const projectedPreRetirementGoalsTotal = Object.values(projectedPreRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);

    const projectedPostRetirementGoalsTotal = Object.values(projectedPostRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);

    const plannedPreRetirementGoalsTotal = Object.values(plannedPreRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
    
    const plannedPostRetirementGoalsTotal = Object.values(plannedPostRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);

    return {
      plannedPreRetirementGoalsTotal,
      plannedPostRetirementGoalsTotal,
      projectedPreRetirementGoalsTotal,
      projectedPostRetirementGoalsTotal
    };
  },

  /**
   * Calculates projected monthly income based on plan type.
   * 
   * Plan types:
   * - "1": Encerrar (exhaust funds by end) - no money left at end
   * - "2": Herança (inheritance) - leave legacy amount at end
   * - "3": Legado (legacy) - perpetual income based on return rate
   * 
   * @param planType - Plan type code ("1", "2", or "3")
   * @param effectiveMonthlyRate - Effective monthly return rate
   * @param monthsInRetirement - Number of months in retirement period
   * @param presentValueAtRetirement - Present value at retirement date
   * @param shouldAdjustIncomeForInflation - Whether to adjust income for inflation
   * @param monthlyInflationRate - Monthly inflation rate
   * @param inflationFactorAtRetirement - Cumulative inflation factor at retirement
   * @param legacyAmount - Legacy amount to leave (for type "2")
   * @param realReturnRate - Real return rate (for type "3")
   * @returns Projected monthly income amount
   */
  calculateProjectedMonthlyIncome: (
    planType: string,
    effectiveMonthlyRate: number,
    monthsInRetirement: number,
    presentValueAtRetirement: number,
    shouldAdjustIncomeForInflation: boolean,
    monthlyInflationRate: number,
    inflationFactorAtRetirement: number,
    legacyAmount: number,
    realReturnRate: number
  ): number => {
    const adjustedPresentValue = presentValueAtRetirement * 
      (shouldAdjustIncomeForInflation ? 1 : inflationFactorAtRetirement);

    switch (planType) {
      // Type 1: Encerrar - não deve sobrar dinheiro ao final
      case "1":
        return -pmt(
          effectiveMonthlyRate,
          monthsInRetirement,
          adjustedPresentValue,
          0
        );
      
      // Type 2: Herança - leave legacy amount
      case "2":
        return -pmt(
          effectiveMonthlyRate,
          monthsInRetirement,
          adjustedPresentValue,
          -legacyAmount
        );
      
      // Type 3: Legado - perpetual income
      case "3": {
        const inflationAdjustedRate = shouldAdjustIncomeForInflation 
          ? 1 
          : monthlyInflationRate + 1;
        return adjustedPresentValue * (((realReturnRate + 1) * inflationAdjustedRate) - 1);
      }
      
      default:
        return 0;
    }
  },

  /**
   * Calculates financial projections based on current state and plan.
   * 
   * This is the main calculation function that:
   * 1. Determines current state (actual date, balance, etc.)
   * 2. Calculates planned projections (based on original plan)
   * 3. Calculates projected projections (based on current performance)
   * 4. Returns comparison data
   * 
   * @param params - Parameters object
   * @param params.allFinancialRecords - All financial records
   * @param params.investmentPlan - Investment plan details
   * @param params.microPlans - Array of micro investment plans
   * @param params.activeMicroPlan - Currently active micro plan
   * @param params.birthDate - User's birth date
   * @param params.allGoals - All financial goals
   * @param params.allEvents - All projected events
   * @param params.plannedGoalFutureValue - Planned goal future value
   * @param params.projectedGoalFutureValue - Projected goal future value
   * @param params.calculations - Pre-calculated micro plan values
   * @returns Projection result with planned and projected values
   */
  calculateProjections: (
    params: {
      allFinancialRecords: FinancialRecord[],
      investmentPlan: InvestmentPlan,
      microPlans: MicroInvestmentPlan[],
      activeMicroPlan: MicroInvestmentPlan | null,
      birthDate: Date,
      allGoals: Goal[],
      allEvents: ProjectedEvent[],
      plannedGoalFutureValue: number,
      projectedGoalFutureValue: number,
      calculations: Calculations
    }
  ): ProjectionResult => {
    const {
      allFinancialRecords,
      investmentPlan,
      microPlans,
      activeMicroPlan,
      birthDate,
      allGoals,
      allEvents,
      plannedGoalFutureValue,
      projectedGoalFutureValue,
      calculations
    } = params;

    // ========================================================================
    // STEP 1: Determine current state
    // ========================================================================
    console.group('📊 [Plan Progress] Step 1: Determining Current State');
    
    const sortedFinancialRecords = allFinancialRecords.sort(
      (a, b) => b.record_year - a.record_year || b.record_month - a.record_month
    );
    const lastFinancialRecord = sortedFinancialRecords[0];
    const currentMonth = lastFinancialRecord?.record_month || 0;
    const currentYear = lastFinancialRecord?.record_year || 0;
    
    const planStartDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
    const planEndDate = createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date);
    const finalAgeDate = planEndDate;
    const initialDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
    
    // Determine actual date (current month/year or plan start if no records)
    const actualDate = (currentMonth !== 0 && currentYear !== 0)
      ? createDateFromYearMonth(currentYear, currentMonth)
      : initialDate;
    
    const totalPlannedMonths = utils.calculateMonthsBetweenDates(planStartDate, planEndDate) + 1;
    const totalMonthsToRetirement = Math.max(0, utils.calculateMonthsBetweenDates(initialDate, planEndDate) || 0);
    const monthsElapsed = Math.max(0, utils.calculateMonthsBetweenDates(planStartDate, actualDate) + 1 || 1);
    
    console.log('Plan Start Date:', planStartDate.toISOString());
    console.log('Plan End Date:', planEndDate.toISOString());
    console.log('Actual Date:', actualDate.toISOString());
    console.log('Total Planned Months:', totalPlannedMonths);
    console.log('Months Elapsed:', monthsElapsed);
    console.log('Total Months to Retirement:', totalMonthsToRetirement);
    console.groupEnd();

    // ========================================================================
    // STEP 2: Calculate inflation and return rates
    // ========================================================================
    console.group('📈 [Plan Progress] Step 2: Calculating Rates');
    
    const inflationFactorAtRetirement = utils.computeInflationFactor({
      startDate: initialDate,
      endDate: planEndDate,
      currency: investmentPlan.currency,
      microPlans
    });
    
    const monthlyInflationRate = Math.pow(inflationFactorAtRetirement, 1 / totalPlannedMonths) - 1;
    const monthlyExpectedReturnRate = utils.computeEffectiveMonthlyReturnRate({
      startDate: initialDate,
      endDate: planEndDate,
      microPlans
    });
    
    const shouldAdjustContributionForInflation = investmentPlan.adjust_contribution_for_inflation;
    const effectiveMonthlyRate = shouldAdjustContributionForInflation
      ? monthlyExpectedReturnRate
      : calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);
    
    console.log('Inflation Factor at Retirement:', inflationFactorAtRetirement.toFixed(6));
    console.log('Monthly Inflation Rate:', (monthlyInflationRate * 100).toFixed(4) + '%');
    console.log('Monthly Expected Return Rate:', (monthlyExpectedReturnRate * 100).toFixed(4) + '%');
    console.log('Effective Monthly Rate:', (effectiveMonthlyRate * 100).toFixed(4) + '%');
    console.log('Adjust Contribution for Inflation:', shouldAdjustContributionForInflation);
    console.groupEnd();

    // ========================================================================
    // STEP 3: Calculate retirement goals totals
    // ========================================================================
    console.group('🎯 [Plan Progress] Step 3: Calculating Retirement Goals Totals');
    
    const retirementGoalsTotals = financialCalculations.calculateRetirementGoalsTotals({
      startDate: initialDate,
      endDate: planEndDate,
      allGoals,
      allEvents,
      monthsToRetirement: totalMonthsToRetirement,
      currency: investmentPlan.currency,
      actualDate,
      microPlans
    });
    
    const {
      plannedPreRetirementGoalsTotal,
      plannedPostRetirementGoalsTotal,
      projectedPreRetirementGoalsTotal,
      projectedPostRetirementGoalsTotal
    } = retirementGoalsTotals;
    
    console.log('Planned Pre-Retirement Goals Total:', plannedPreRetirementGoalsTotal.toFixed(2));
    console.log('Planned Post-Retirement Goals Total:', plannedPostRetirementGoalsTotal.toFixed(2));
    console.log('Projected Pre-Retirement Goals Total:', projectedPreRetirementGoalsTotal.toFixed(2));
    console.log('Projected Post-Retirement Goals Total:', projectedPostRetirementGoalsTotal.toFixed(2));
    console.groupEnd();

    // ========================================================================
    // STEP 4: Calculate average monthly contribution
    // ========================================================================
    console.group('💰 [Plan Progress] Step 4: Calculating Monthly Contribution');
    
    const averageMonthlyContribution = utils.computeAverageMonthlyContribution({
      referenceDate: initialDate,
      planEndDate,
      microPlans,
      activeMicroPlan,
      adjustForInflation: shouldAdjustContributionForInflation,
      planCurrency: investmentPlan.currency
    });
    
    console.log('Average Monthly Contribution:', averageMonthlyContribution.toFixed(2));
    console.groupEnd();

    // ========================================================================
    // STEP 5: Calculate present and future values
    // ========================================================================
    console.group('💵 [Plan Progress] Step 5: Calculating Present and Future Values');
    
    const currentBalance = (lastFinancialRecord?.ending_balance || investmentPlan.initial_amount) || 0;
    const initialAmountWithPlannedGoals = investmentPlan.initial_amount + plannedPreRetirementGoalsTotal;
    
    const plannedPresentValue = plannedGoalFutureValue / inflationFactorAtRetirement;
    const projectedPresentValue = projectedGoalFutureValue / inflationFactorAtRetirement;
    
    const investmentGoalPresentValue = calculations.presentFutureValue * 
      (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement);
    
    const adjustedGoalProjectedFutureValue = investmentGoalPresentValue - 
      (projectedPostRetirementGoalsTotal * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement));
    
    const adjustedGoalPlannedFutureValue = investmentGoalPresentValue - 
      (plannedPostRetirementGoalsTotal * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement));
    
    console.log('Current Balance:', currentBalance.toFixed(2));
    console.log('Initial Amount with Planned Goals:', initialAmountWithPlannedGoals.toFixed(2));
    console.log('Investment Goal Present Value:', investmentGoalPresentValue.toFixed(2));
    console.log('Adjusted Goal Projected Future Value:', adjustedGoalProjectedFutureValue.toFixed(2));
    console.log('Adjusted Goal Planned Future Value:', adjustedGoalPlannedFutureValue.toFixed(2));
    console.groupEnd();

    // ========================================================================
    // STEP 6: Calculate projected values (based on current performance)
    // ========================================================================
    console.group('📉 [Plan Progress] Step 6: Calculating Projected Values');
    
    // Calculate contribution and rates until reference date
    const monthlyContributionUntilReference = utils.computeAverageMonthlyContribution({
      referenceDate: planStartDate,
      planEndDate: actualDate,
      microPlans,
      activeMicroPlan,
      adjustForInflation: shouldAdjustContributionForInflation,
      planCurrency: investmentPlan.currency
    });
    
    const inflationFactorUntilReference = utils.computeInflationFactor({
      startDate: planStartDate,
      endDate: actualDate,
      currency: investmentPlan.currency,
      microPlans
    });
    
    const monthlyInflationRateUntilReference = Math.pow(inflationFactorUntilReference, 1 / monthsElapsed) - 1;
    const monthlyReturnRateUntilReference = utils.computeEffectiveMonthlyReturnRate({
      startDate: planStartDate,
      endDate: actualDate,
      microPlans
    });
    
    const monthlyExpectedReturnRateUntilReference = shouldAdjustContributionForInflation
      ? monthlyReturnRateUntilReference
      : calculateCompoundedRates([monthlyReturnRateUntilReference, monthlyInflationRateUntilReference]);
    
    console.log('Monthly Contribution Until Reference:', monthlyContributionUntilReference.toFixed(2));
    console.log('Inflation Factor Until Reference:', inflationFactorUntilReference.toFixed(6));
    console.log('Monthly Inflation Rate Until Reference:', (monthlyInflationRateUntilReference * 100).toFixed(4) + '%');
    console.log('Monthly Return Rate Until Reference:', (monthlyReturnRateUntilReference * 100).toFixed(4) + '%');
    console.log('Monthly Expected Return Rate Until Reference:', (monthlyExpectedReturnRateUntilReference * 100).toFixed(4) + '%');
    
    // Adjust current balance for inflation
    const currentBalanceAdjustedByInflation = currentBalance / inflationFactorUntilReference;
    const currentBalanceWithProjectedGoals = currentBalanceAdjustedByInflation + projectedPreRetirementGoalsTotal;
    
    console.log('Current Balance Adjusted by Inflation:', currentBalanceAdjustedByInflation.toFixed(2));
    console.log('Current Balance with Projected Goals:', currentBalanceWithProjectedGoals.toFixed(2));
    
    // Calculate present value adjusted
    const balancePresentValueAdjusted = -vp(
      monthlyExpectedReturnRateUntilReference,
      monthsElapsed,
      -monthlyContributionUntilReference,
      -currentBalanceWithProjectedGoals
    );
    
    console.log('Balance Present Value Adjusted:', balancePresentValueAdjusted.toFixed(2));
    console.log('VP Calculation:', {
      rate: monthlyExpectedReturnRateUntilReference,
      nper: monthsElapsed,
      pmt: -monthlyContributionUntilReference,
      fv: -currentBalanceWithProjectedGoals
    });
    
    // Calculate projected months to retirement
    const projectedMonthsToRetirement = Math.max(0, Math.ceil(
      nper(
        effectiveMonthlyRate,
        -averageMonthlyContribution,
        -balancePresentValueAdjusted,
        adjustedGoalProjectedFutureValue
      ) - monthsElapsed
    ));
    
    console.log('NPER Calculation for Projected Months:', {
      rate: effectiveMonthlyRate,
      pmt: -averageMonthlyContribution,
      pv: -balancePresentValueAdjusted,
      fv: adjustedGoalProjectedFutureValue
    });
    console.log('Projected Months to Retirement:', projectedMonthsToRetirement);
    
    // Calculate projected contribution
    const projectedContribution = -pmt(
      effectiveMonthlyRate,
      totalMonthsToRetirement,
      -currentBalanceWithProjectedGoals,
      adjustedGoalProjectedFutureValue
    );
    
    console.log('Projected Contribution:', projectedContribution.toFixed(2));
    console.groupEnd();

    // ========================================================================
    // STEP 7: Calculate planned values (based on original plan)
    // ========================================================================
    console.group('📊 [Plan Progress] Step 7: Calculating Planned Values');
    
    const plannedMonthsToRetirement = Math.max(0, Math.ceil(
      nper(
        effectiveMonthlyRate,
        -averageMonthlyContribution,
        -initialAmountWithPlannedGoals,
        adjustedGoalPlannedFutureValue
      ) - monthsElapsed
    ));
    
    console.log('NPER Calculation for Planned Months:', {
      rate: effectiveMonthlyRate,
      pmt: -averageMonthlyContribution,
      pv: -initialAmountWithPlannedGoals,
      fv: adjustedGoalPlannedFutureValue
    });
    console.log('Planned Months to Retirement:', plannedMonthsToRetirement);
    
    const plannedContribution = -pmt(
      effectiveMonthlyRate,
      totalPlannedMonths,
      -initialAmountWithPlannedGoals,
      adjustedGoalPlannedFutureValue
    );
    
    console.log('Planned Contribution:', plannedContribution.toFixed(2));
    console.groupEnd();

    // ========================================================================
    // STEP 8: Calculate monthly income
    // ========================================================================
    console.group('💸 [Plan Progress] Step 8: Calculating Monthly Income');
    
    const maximumAgeDate = utils.createDateAtAge(birthDate, investmentPlan.limit_age || 100);
    const monthsInRetirement = utils.calculateMonthsBetweenDates(planEndDate, maximumAgeDate);
    
    const projectedMonthlyIncome = financialCalculations.calculateProjectedMonthlyIncome(
      investmentPlan.plan_type,
      effectiveMonthlyRate,
      monthsInRetirement,
      projectedPresentValue,
      investmentPlan.adjust_income_for_inflation,
      monthlyInflationRate,
      inflationFactorAtRetirement,
      investmentPlan.legacy_amount,
      monthlyExpectedReturnRate
    );
    
    const plannedMonthlyIncome = financialCalculations.calculateProjectedMonthlyIncome(
      investmentPlan.plan_type,
      effectiveMonthlyRate,
      monthsInRetirement,
      plannedPresentValue,
      investmentPlan.adjust_income_for_inflation,
      monthlyInflationRate,
      inflationFactorAtRetirement,
      investmentPlan.legacy_amount,
      monthlyExpectedReturnRate
    );
    
    console.log('Months in Retirement:', monthsInRetirement);
    console.log('Projected Monthly Income:', projectedMonthlyIncome.toFixed(2));
    console.log('Planned Monthly Income:', plannedMonthlyIncome.toFixed(2));
    console.groupEnd();

    // ========================================================================
    // STEP 9: Calculate dates and differences
    // ========================================================================
    console.group('📅 [Plan Progress] Step 9: Calculating Dates and Differences');
    
    const projectedRetirementDate = utils.addMonthsToDate(actualDate, projectedMonthsToRetirement);
    const plannedRetirementDate = utils.addMonthsToDate(actualDate, plannedMonthsToRetirement);
    const monthsDifference = utils.calculateMonthsBetweenDates(projectedRetirementDate, plannedRetirementDate);
    
    console.log('Projected Retirement Date:', projectedRetirementDate.toISOString());
    console.log('Planned Retirement Date:', plannedRetirementDate.toISOString());
    console.log('Months Difference:', monthsDifference);
    console.groupEnd();

    return {
      projectedPresentValue,
      plannedPresentValue,
      projectedGoalFutureValue,
      plannedGoalFutureValue,
      projectedMonthsToRetirement,
      projectedContribution,
      projectedMonthlyIncome,
      plannedMonthsToRetirement,
      plannedContribution,
      plannedMonthlyIncome,
      monthsDifference,
      plannedMonths: totalPlannedMonths,
      referenceDate: initialDate,
      projectedRetirementDate,
      plannedRetirementDate,
      finalAgeDate,
      actualDate
    };
  }
};

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Processes all data needed for the PlanProgress component.
 * 
 * This is the main entry point that:
 * 1. Validates input data
 * 2. Calculates micro plan future values
 * 3. Calculates financial projections
 * 4. Computes age information
 * 5. Returns formatted data for UI display
 * 
 * @param allFinancialRecords - List of all financial records (sorted by date, most recent first)
 * @param investmentPlan - Investment plan details
 * @param microPlans - Array of micro investment plans
 * @param activeMicroPlan - Currently active micro plan
 * @param profile - User profile with birth date
 * @param goals - Financial goals
 * @param events - Projected events
 * @param plannedGoalFutureValue - Planned goal future value
 * @param projectedGoalFutureValue - Projected goal future value
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
  plannedGoalFutureValue: number,
  projectedGoalFutureValue: number,
): PlanProgressData | null {
  // Validate required data
  if (!investmentPlan || !profile.birth_date) {
    console.warn('[Plan Progress] Missing required data: investmentPlan or birth_date');
    return null;
  }

  console.group('🚀 [Plan Progress] Starting Data Processing');
  
  const birthDate = createDateWithoutTimezone(profile.birth_date);
  const lastFinancialRecord = allFinancialRecords[0];
  const currentBalance = lastFinancialRecord?.ending_balance || investmentPlan.initial_amount;
  
  // Calculate micro plan future values
  console.log('Calculating micro plan future values...');
  const microPlanCalculations = calculateMicroPlanFutureValues(
    investmentPlan, 
    activeMicroPlan, 
    allFinancialRecords, 
    birthDate
  );
  
  const investmentGoal = microPlanCalculations.futureValue || 0;
  const currentProgress = (currentBalance / investmentGoal) * 100;
  
  console.log('Current Balance:', currentBalance);
  console.log('Investment Goal:', investmentGoal);
  console.log('Current Progress:', currentProgress.toFixed(2) + '%');
  
  // Calculate projections
  console.log('Calculating financial projections...');
  const projections = financialCalculations.calculateProjections({
    allFinancialRecords,
    investmentPlan,
    microPlans,
    activeMicroPlan,
    birthDate,
    allGoals: goals,
    allEvents: events,
    plannedGoalFutureValue,
    projectedGoalFutureValue,
    calculations: microPlanCalculations
  });

  // Calculate projected and planned ages
  const projectedRetirementDate = projections.projectedRetirementDate;
  let projectedAgeYears = projectedRetirementDate.getFullYear() - birthDate.getFullYear();
  let projectedAgeMonths = projectedRetirementDate.getMonth() - birthDate.getMonth();
  
  const plannedRetirementDate = projections.plannedRetirementDate;
  let plannedAgeYears = plannedRetirementDate.getFullYear() - birthDate.getFullYear();
  let plannedAgeMonths = plannedRetirementDate.getMonth() - birthDate.getMonth();
  
  // Adjust months if negative
  if (projectedAgeMonths < 0) {
    projectedAgeYears--;
    projectedAgeMonths += 12;
  }
  if (plannedAgeMonths < 0) {
    plannedAgeYears--;
    plannedAgeMonths += 12;
  }

  // Calculate investment plan months to retirement
  const planEndDate = createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date);
  const nextMonthFromActualDate = createDateWithoutTimezone(projections.actualDate);
  nextMonthFromActualDate.setMonth(nextMonthFromActualDate.getMonth() + 1);
  const investmentPlanMonthsToRetirement = Math.max(
    0, 
    utils.calculateMonthsBetweenDates(nextMonthFromActualDate, planEndDate) || 0
  );

  console.log('Processing complete!');
  console.groupEnd();

  return {
    investmentPlanMonthsToRetirement,
    projectedPresentValue: projections.projectedPresentValue,
    plannedPresentValue: projections.plannedPresentValue,
    plannedGoalFutureValue: projections.plannedGoalFutureValue,
    projectedGoalFutureValue: projections.projectedGoalFutureValue,
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
    isAheadOfSchedule: projections.monthsDifference > 0,
    actualDate: projections.actualDate
  };
}
