import { FinancialRecord, InvestmentPlan, MicroInvestmentPlan, Goal, ProjectedEvent } from "@/types/financial";
import { calculateCompoundedRates, nper, yearlyReturnRateToMonthlyReturnRate, pmt, vp } from "@/lib/financial-math";
import { processItem } from './financial-goals-processor';
import { createDateWithoutTimezone, createDateFromYearMonth } from '@/utils/dateUtils';
import { HistoricalDataInfo } from "@/services/projection.service";
import { MonthlyProjectionData } from "./chart-projections";
import { calculateMicroPlanFutureValues } from '@/utils/investmentPlanCalculations';

/**
 * Constants for date calculations
 */
const DAYS_PER_MONTH = 30.44;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

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
    return Math.floor((endDate.getTime() - startDate.getTime()) / (DAYS_PER_MONTH * MILLISECONDS_PER_DAY)) + 1;
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
  processGoals: (goals: Goal[], referenceDate: Date) => {
    return goals.flatMap(goal => processItem(goal, 'goal'));
  },

  /**
   * Processes events for financial calculations
   */
  processEvents: (events: ProjectedEvent[], referenceDate: Date) => {
    return events.flatMap(event => processItem(event, 'event'));
  },

  /**
   * Creates a hash of monthly values for financial calculations
   */
  createMonthlyValuesHash: (
    monthlyInflationRate: number,
    monthlyExpectedReturnRate: number,
    goals: ProcessedGoalEvent[],
    events: ProcessedGoalEvent[],
    isPreRetirement: boolean,
    monthsToRetirement: number
  ): Record<number, MonthlyValues> => {
    const relevantMonths = Array.from(new Set([
      ...goals.map(goal => goal.month),
      ...events.map(event => event.month)
    ])).sort((a, b) => a - b);

    const monthlyValuesHash: Record<number, MonthlyValues> = {};
    let currentMonth = 0;
    let cumulativeInflationFactor = 1;
    const monthlyReturnRate = calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);

    for (const targetMonth of relevantMonths) {
      while (currentMonth <= targetMonth) {
        cumulativeInflationFactor *= (1 + monthlyInflationRate);
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
        const timeAdjustmentFactor = (1 + monthlyReturnRate) ** (isPreRetirement ? targetMonth : targetMonth - monthsToRetirement);
        
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
   */
  generatePreCalculationHash: (
    monthlyExpectedReturnRate: number,
    monthlyInflationRate: number,
    goals: Goal[],
    events: ProjectedEvent[],
    monthsToRetirement: number,
    referenceDate: Date
  ) => {
    const processedGoals = financialCalculations.processGoals(goals, referenceDate);
    const processedEvents = financialCalculations.processEvents(events, referenceDate);

    // Separate into pre and post retirement
    const preRetirementGoals = processedGoals.filter(goal => goal.month <= monthsToRetirement);
    const postRetirementGoals = processedGoals.filter(goal => goal.month > monthsToRetirement);
    const preRetirementEvents = processedEvents.filter(event => event.month <= monthsToRetirement);
    const postRetirementEvents = processedEvents.filter(event => event.month > monthsToRetirement);

    // Create separate hashes for pre and post retirement
    const preRetirementHash = financialCalculations.createMonthlyValuesHash(
      monthlyInflationRate,
      monthlyExpectedReturnRate,
      preRetirementGoals,
      preRetirementEvents,
      true,
      monthsToRetirement
    );

    const postRetirementHash = financialCalculations.createMonthlyValuesHash(
      monthlyInflationRate,
      monthlyExpectedReturnRate,
      postRetirementGoals,
      postRetirementEvents,
      false,
      monthsToRetirement
    );

    return { preRetirementHash, postRetirementHash };
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
    activeMicroPlan: MicroInvestmentPlan | null,
    birthDate: Date,
    goals: Goal[],
    events: ProjectedEvent[],
    plannedFuturePresentValue: number,
    projectedFuturePresentValue: number,
    monthlyProjectionData: MonthlyProjectionData | null
  ): ProjectionResult => {
    const lastFinancialRecord = allFinancialRecords[0];
    const currentMonth = lastFinancialRecord?.record_month || 0;
    const currentYear = lastFinancialRecord?.record_year || 0;

    const expectedReturn = activeMicroPlan?.expected_return || 0;
    const inflation = activeMicroPlan?.inflation || 0;
    const monthlyExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(expectedReturn/100);
    const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(inflation/100);
    
    // Calculate reference date and months to retirement
    let remainingMonthsToRetirement;
    let referenceDate;
    
    const planStartDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
    const planEndDate = createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date);
    const finalAgeDate = planEndDate;
    const totalPlannedMonths = utils.calculateMonthsBetweenDates(planStartDate, planEndDate);
    remainingMonthsToRetirement = totalPlannedMonths;
    const plannedMonths = totalPlannedMonths;
    if (currentMonth === 0 && currentYear === 0) {
      referenceDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
    } else {
      referenceDate = createDateFromYearMonth(currentYear, currentMonth);
      // Calculate difference in months
      remainingMonthsToRetirement = utils.calculateMonthsBetweenDates(referenceDate, planEndDate)
    }

    const { preRetirementHash, postRetirementHash } = financialCalculations.generatePreCalculationHash(
      monthlyExpectedReturnRate,
      monthlyInflationRate,
      goals,
      events,
      remainingMonthsToRetirement,
      referenceDate
    );

    // Sum of pre/post retirement goals
    const preRetirementGoalsTotal = Object.values(preRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
    
    const postRetirementGoalsTotal = Object.values(postRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
    
    // Get plan parameters
    const shouldAdjustContributionForInflation = investmentPlan.adjust_contribution_for_inflation;
    // PEGAR PLANNED CONTRIBUTION DO ULTIMO MES DA PROJEÇÃO
    const monthlyDeposit = activeMicroPlan?.monthly_deposit || 0;
    const monthlyContribution = monthlyProjectionData ? monthlyProjectionData.planned_contribution : monthlyDeposit;
    
    const maximumAgeDate = utils.createDateAtAge(birthDate, investmentPlan.limit_age || 100);
    const monthsInRetirement = utils.calculateMonthsBetweenDates(planEndDate, maximumAgeDate);
    
    // Calculate effective rate based on inflation adjustment setting
    const effectiveMonthlyRate = shouldAdjustContributionForInflation ? monthlyExpectedReturnRate : calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);
    
    // Calculate adjusted present and future values
    const currentBalanceWithGoals = (lastFinancialRecord?.ending_balance + preRetirementGoalsTotal) || 0;
    const initialAmountWithGoals = (investmentPlan.initial_amount + preRetirementGoalsTotal);
    const inflationFactorAtRetirement = (1 + monthlyInflationRate) ** remainingMonthsToRetirement;
    const projectedPresentValue = projectedFuturePresentValue / inflationFactorAtRetirement;
    // Calcular valores usando o micro plano ativo
    const calculations = calculateMicroPlanFutureValues(investmentPlan, activeMicroPlan, allFinancialRecords, birthDate);
    
    const goalProjectedPresentValue = calculations.presentFutureValue * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement);
    const adjustedGoalProjectedFutureValue = (goalProjectedPresentValue - postRetirementGoalsTotal * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement));
    const plannedPresentValue = plannedFuturePresentValue / inflationFactorAtRetirement;
    const goalPlannedPresentValue = calculations.presentFutureValue * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement);
    const adjustedGoalPlannedFutureValue = (goalPlannedPresentValue - postRetirementGoalsTotal * (shouldAdjustContributionForInflation ? 1 : inflationFactorAtRetirement));

    // Calculate projections

    // PROJECTIONS 
    console.log('balanceVPAdjustedParams', monthlyExpectedReturnRate, totalPlannedMonths - remainingMonthsToRetirement, -monthlyContribution, -currentBalanceWithGoals)
    const balancePresentValueAdjusted = vp(monthlyExpectedReturnRate, totalPlannedMonths - remainingMonthsToRetirement, -monthlyContribution, -currentBalanceWithGoals);
    console.log('balanceVPAdjusted', balancePresentValueAdjusted)
    console.log('projectedMonthsToRetirement', effectiveMonthlyRate, -monthlyContribution, balancePresentValueAdjusted, adjustedGoalProjectedFutureValue)
    const projectedMonthsToRetirement = nper(
      effectiveMonthlyRate,
      -monthlyContribution,
      -currentBalanceWithGoals,
      adjustedGoalProjectedFutureValue
    );
    console.log('projectedMonthsToRetirement', projectedMonthsToRetirement)

    const projectedContribution = -pmt(
      effectiveMonthlyRate,
      remainingMonthsToRetirement,
      -currentBalanceWithGoals,
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
    if (monthlyProjectionData) {
      // se tiver registros financeiros, usar os dados da projeção
      const plannedBalanceWithGoals = (monthlyProjectionData.planned_balance + preRetirementGoalsTotal)
      console.log('plannedVPBalanceParams', monthlyExpectedReturnRate, totalPlannedMonths - remainingMonthsToRetirement, -monthlyContribution, -plannedBalanceWithGoals)
      const plannedBalancePresentValue = vp(monthlyExpectedReturnRate, totalPlannedMonths - remainingMonthsToRetirement, -monthlyContribution, -plannedBalanceWithGoals)
      console.log('plannedVPBalance', plannedBalancePresentValue)
      console.log('plannedMonthsToRetirementParams', effectiveMonthlyRate, -monthlyContribution, plannedBalancePresentValue, adjustedGoalPlannedFutureValue)
      plannedMonthsToRetirement = nper(
        effectiveMonthlyRate,
        -monthlyContribution,
        -plannedBalanceWithGoals,
        adjustedGoalPlannedFutureValue
      );
      console.log('plannedMonthsToRetirement', plannedMonthsToRetirement)
      plannedContribution = -pmt(
        effectiveMonthlyRate,
        remainingMonthsToRetirement,
        -plannedBalanceWithGoals,
        adjustedGoalPlannedFutureValue
      )
    }else{
      plannedMonthsToRetirement = nper(
        effectiveMonthlyRate,
        -monthlyContribution,
        initialAmountWithGoals,
        adjustedGoalPlannedFutureValue
      );
  
      plannedContribution = -pmt(
        effectiveMonthlyRate,
        totalPlannedMonths,
        initialAmountWithGoals,
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
    const projectedRetirementDate = utils.addMonthsToDate(referenceDate, projectedMonthsToRetirement);
    const plannedRetirementDate = utils.addMonthsToDate(referenceDate, plannedMonthsToRetirement);
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
  const projections = financialCalculations.calculateProjections(
    allFinancialRecords, 
    investmentPlan, 
    activeMicroPlan,
    birthDate, 
    goals.filter(goal => goal.status === 'pending'), 
    events.filter(event => event.status === 'pending'),
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