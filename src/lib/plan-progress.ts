import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent } from "@/types/financial";
import { calculateCompoundedRates, nper, yearlyReturnRateToMonthlyReturnRate, pmt, calculateFutureValue, vp } from "@/lib/financial-math";
import { calculateAccumulatedInflation, calculatePlanAccumulatedInflation } from "./inflation-utils";
import { processItem } from './financial-goals-processor';

/**
 * Constants for date calculations
 */
const DAYS_PER_MONTH = 30.44;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Utility functions
 */
export const utils = {
  /**
   * Calculates the number of months between two dates
   */
  calculateMonthsBetweenDates: (date1: Date, date2: Date): number => {
    if (date1 == undefined || date2 == undefined) {
      return null;
    }
    return Math.floor((date2.getTime() - date1.getTime()) / (DAYS_PER_MONTH * MS_PER_DAY)) + 1;
  },

  /**
   * Creates a date at a specific age based on birth date
   */
  createDateAtAge: (birthDate: Date, age: number): Date => {
    const date = new Date(birthDate);
    date.setFullYear(birthDate.getFullYear() + age);
    return date;
  },

  /**
   * Adds months to a date
   */
  addMonthsToDate: (date: Date, months: number): Date => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + months + 1);
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
    monthlyInflation: number,
    monthlyExpectedReturn: number,
    goals: ProcessedGoalEvent[],
    events: ProcessedGoalEvent[],
    preRetirement: boolean,
    monthsToR: number
  ): Record<number, MonthlyValues> => {
    const relevantMonths = Array.from(new Set([
      ...goals.map(g => g.month),
      ...events.map(e => e.month)
    ])).sort((a, b) => a - b);

    const hash: Record<number, MonthlyValues> = {};
    let currentMonth = 0;
    let inflationFactor = 1;
    const monthlyReturn = calculateCompoundedRates([monthlyExpectedReturn, monthlyInflation]);

    for (const month of relevantMonths) {
      while (currentMonth <= month) {
        inflationFactor *= (1 + monthlyInflation);
        currentMonth++;
      }

      const monthlyGoals = goals
        .filter(goal => goal.month === month)
        .map(goal => ({
          amount: goal.amount,
          description: goal.description
        }));

      const monthlyEvents = events
        .filter(event => event.month === month)
        .map(event => ({
          amount: event.amount,
          name: event.name
        }));

      if (monthlyGoals.length > 0 || monthlyEvents.length > 0) {
        const adjustmentFactor = (1 + monthlyReturn) ** (preRetirement ? month : month - monthsToR);
        
        const adjustedGoals = monthlyGoals.map(goal => ({
          amount: goal.amount / adjustmentFactor,
          description: goal.description
        }));
        
        const adjustedEvents = monthlyEvents.map(event => ({
          amount: event.amount / adjustmentFactor,
          name: event.name
        }));

        hash[month] = {
          month,
          originalValues: {
            goals: monthlyGoals,
            events: monthlyEvents,
          },
          inflationFactor,
          adjustedValues: {
            goals: adjustedGoals,
            events: adjustedEvents,
            total: [
              ...adjustedGoals.map(g => -g.amount),
              ...adjustedEvents.map(e => e.amount)
            ].reduce((sum, val) => sum + val, 0)
          }
        };
      }
    }

    return hash;
  },

  /**
   * Generates pre-calculation hash for financial projections
   */
  generatePreCalculationHash: (
    monthlyExpectedReturn: number,
    monthlyInflation: number,
    goals: Goal[],
    events: ProjectedEvent[],
    monthsToR: number,
    referenceDate: Date
  ) => {
    const processedGoals = financialCalculations.processGoals(goals, referenceDate);
    const processedEvents = financialCalculations.processEvents(events, referenceDate);

    // Separate into pre and post retirement
    const preRetirementGoals = processedGoals.filter(g => g.month <= monthsToR);
    const postRetirementGoals = processedGoals.filter(g => g.month > monthsToR);
    const preRetirementEvents = processedEvents.filter(e => e.month <= monthsToR);
    const postRetirementEvents = processedEvents.filter(e => e.month > monthsToR);

    // Create separate hashes for pre and post retirement
    const preRetirementHash = financialCalculations.createMonthlyValuesHash(
      monthlyInflation,
      monthlyExpectedReturn,
      preRetirementGoals,
      preRetirementEvents,
      true,
      monthsToR
    );

    const postRetirementHash = financialCalculations.createMonthlyValuesHash(
      monthlyInflation,
      monthlyExpectedReturn,
      postRetirementGoals,
      postRetirementEvents,
      false,
      monthsToR
    );

    return { preRetirementHash, postRetirementHash };
  },

  projectedMonthlyIncome: (
    planType: string,
    effectiveRate: number,
    monthsRetired: number,
    presentFutureValue: number,
    incomeAdjustedByInflation: boolean,
    inflation: number,
    inflationInRetirementYear: number,
    finalMoney: number,
    realReturnRate: number
  ): number =>
  {
    switch (planType) {
      // encerrar
      case "1":
        return -pmt(
          effectiveRate,
          monthsRetired,
          presentFutureValue * (incomeAdjustedByInflation ? 1 : inflation),
          0
        );
      // herança
      case "2":
        return -pmt(
          effectiveRate,
          monthsRetired,
          presentFutureValue * (incomeAdjustedByInflation ? 1 : inflation),
          -finalMoney
        );
      // legado
      case "3":
        return ((presentFutureValue * (incomeAdjustedByInflation ? 1 : inflationInRetirementYear)) * (((realReturnRate + 1) *  (incomeAdjustedByInflation ? 1 : inflation + 1 )) -1 ))
    }
  },
  /**
   * Calculates financial projections based on current state and plan
   */
  calculateProjections: (
    currentBalance: number,
    allFinancialRecords: FinancialRecord[],
    investmentPlan: InvestmentPlan,
    birthDate: Date,
    goals: Goal[],
    events: ProjectedEvent[],
    plannedFuturePresentValue: number,
    projectedFuturePresentValue: number,
    realMonthlyInflation: number
  ): ProjectionResult => {
    const lastRecord = allFinancialRecords[0];
    const actualMonth = lastRecord?.record_month || 0;
    const actualYear = lastRecord?.record_year || 0;

    const monthlyExpectedReturn = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
    const monthlyInflation = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
    
    // Calculate reference date and months to retirement
    let monthsToRetirementSinceNow;
    let referenceDate;
    
    const planStartDate = new Date(investmentPlan.plan_initial_date);
    const planEndDate = new Date(investmentPlan.plan_end_accumulation_date);
    const finalAgeDate = planEndDate;
    const monthsToRetirementSinceStart = utils.calculateMonthsBetweenDates(planStartDate, planEndDate);
    monthsToRetirementSinceNow = monthsToRetirementSinceStart;
    const plannedMonths = monthsToRetirementSinceStart;
    if (actualMonth === 0 && actualYear === 0) {
      referenceDate = new Date(investmentPlan.plan_initial_date);
    } else {
      referenceDate = new Date(actualYear, actualMonth - 1);
      // Calculate difference in months
      monthsToRetirementSinceNow = utils.calculateMonthsBetweenDates(referenceDate, planEndDate)
    }

    const { preRetirementHash, postRetirementHash } = financialCalculations.generatePreCalculationHash(
      monthlyExpectedReturn,
      realMonthlyInflation,
      goals,
      events,
      monthsToRetirementSinceNow,
      referenceDate
    );

    // Sum of pre/post retirement goals
    const preRetirementGoals = Object.values(preRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
    
    const postRetirementGoals = Object.values(postRetirementHash)
      .reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
    
    // Get plan parameters
    const adjustContributionForInflation = investmentPlan.adjust_contribution_for_inflation;
    const contribution = -investmentPlan.monthly_deposit;
    
    const limitAgeDate = utils.createDateAtAge(birthDate, investmentPlan.limit_age || 100);
    const monthsRetired = utils.calculateMonthsBetweenDates(planEndDate, limitAgeDate);
    
    // Calculate effective rate based on inflation adjustment setting
    const effectiveRate = adjustContributionForInflation ? monthlyExpectedReturn : calculateCompoundedRates([monthlyExpectedReturn, realMonthlyInflation]);
    
    // Calculate adjusted present and future values
    const balanceWithGoals = -(currentBalance + preRetirementGoals);
    const initialWithGoals = -(investmentPlan.initial_amount + preRetirementGoals);
    const inflationInRetirementYear = (1 + realMonthlyInflation) ** monthsToRetirementSinceStart;
    const projectedPresentValue = projectedFuturePresentValue / inflationInRetirementYear;
    const goalProjectedPresentValue = investmentPlan.present_future_value * (adjustContributionForInflation ? 1 : inflationInRetirementYear);
    const adjustedGoalProjectedFutureValue = (goalProjectedPresentValue - postRetirementGoals * (adjustContributionForInflation ? 1 : inflationInRetirementYear));
    const plannedPresentValue = plannedFuturePresentValue / inflationInRetirementYear;
    const goalPlannedPresentValue = investmentPlan.present_future_value * (adjustContributionForInflation ? 1 : inflationInRetirementYear);
    const adjustedGoalPlannedFutureValue = (goalPlannedPresentValue - postRetirementGoals * (adjustContributionForInflation ? 1 : inflationInRetirementYear));

    // Calculate projections

    // PROJECTIONS 
    const balanceVPAdjusted = vp(monthlyExpectedReturn, monthsToRetirementSinceStart - monthsToRetirementSinceNow, contribution, balanceWithGoals);
    const projectedMonthsToRetirement = nper(
      effectiveRate,
      contribution,
      balanceVPAdjusted,
      adjustedGoalProjectedFutureValue
    );

    const projectedContribution = -pmt(
      effectiveRate,
      monthsToRetirementSinceNow,
      balanceWithGoals,
      adjustedGoalProjectedFutureValue
    );

    const projectedMonthlyIncome = financialCalculations.projectedMonthlyIncome(
      investmentPlan.plan_type,
      effectiveRate,
      monthsRetired,
      projectedPresentValue,
      investmentPlan.adjust_income_for_inflation,
      realMonthlyInflation,
      inflationInRetirementYear,
      investmentPlan.legacy_amount,
      monthlyExpectedReturn
    )

    // PLANNED DATA
    const plannedMonthsToRetirement = nper(
      effectiveRate,
      contribution,
      initialWithGoals,
      adjustedGoalPlannedFutureValue
    );

    const plannedContribution = -pmt(
      effectiveRate,
      monthsToRetirementSinceStart,
      initialWithGoals,
      adjustedGoalPlannedFutureValue
    );

    const plannedMonthlyIncome = financialCalculations.projectedMonthlyIncome(
      investmentPlan.plan_type,
      effectiveRate,
      monthsRetired,
      plannedPresentValue,
      investmentPlan.adjust_income_for_inflation,
      realMonthlyInflation,
      inflationInRetirementYear,
      investmentPlan.legacy_amount,
      monthlyExpectedReturn
    )
    
    // Calculate dates and differences
    const projectedRetirementDate = utils.addMonthsToDate(planStartDate, projectedMonthsToRetirement);
    const plannedRetirementDate = utils.addMonthsToDate(planStartDate, plannedMonthsToRetirement);
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
  profile: { birth_date?: string },
  goals: Goal[],
  events: ProjectedEvent[],
  plannedFuturePresentValue: number,
  projectedFuturePresentValue: number
): PlanProgressData | null {
  if (!investmentPlan || !profile.birth_date) return null;

  const birthDate = new Date(profile.birth_date);
  const lastRecord = allFinancialRecords[0];

  const currentBalance = lastRecord?.ending_balance || investmentPlan.initial_amount;
  const investmentGoal = investmentPlan.future_value || 0;
  const currentProgress = (currentBalance / investmentGoal) * 100;
  
  // Calculate accumulated inflation from plan start to last record
  const planStartDate = new Date(investmentPlan.plan_initial_date);
  const yearDiff = planStartDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = planStartDate.getMonth() - birthDate.getMonth();
  const initialAge = yearDiff + (monthDiff / 12);
  const monthsToEnd = ((investmentPlan.limit_age || 100) - initialAge) * 12;
  const planEndDate = utils.createDateAtAge(birthDate, investmentPlan.limit_age || 100);
  const lastRecordDate = lastRecord ? new Date(lastRecord.record_year, lastRecord.record_month - 1) : new Date();
  const accumulatedInflationInBalance = lastRecord?.ending_balance 
    ? calculateAccumulatedInflation(planStartDate, lastRecordDate) 
    : 1;

  const accumulatedPlanInflationInContribution = calculatePlanAccumulatedInflation(planStartDate, planEndDate, investmentPlan.inflation) 
  const realMonthlyInflation = accumulatedPlanInflationInContribution ** (1/monthsToEnd) - 1
  // Calculate projections
  const projections = financialCalculations.calculateProjections(
    currentBalance / accumulatedInflationInBalance,
    allFinancialRecords, 
    investmentPlan, 
    birthDate, 
    goals, 
    events,
    plannedFuturePresentValue,
    projectedFuturePresentValue,
    realMonthlyInflation
  );

  console.log('Debug projections:', projections);

  // Calcular a idade projetada em anos e meses
  const projectedDate = projections.projectedRetirementDate;
  let projectedAgeYears = projectedDate.getFullYear() - birthDate.getFullYear();
  let projectedAgeMonths = projectedDate.getMonth() - birthDate.getMonth();
  
  const plannedDate = projections.plannedRetirementDate;
  let plannedAgeYears = plannedDate.getFullYear() - birthDate.getFullYear();
  let plannedAgeMonths = plannedDate.getMonth() - birthDate.getMonth();
  
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