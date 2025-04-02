import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent } from "@/types/financial";
import { calculateCompoundedRates, nper, yearlyReturnRateToMonthlyReturnRate, pmt } from "@/lib/financial-math";
import { YearlyProjectionData } from "./chart-projections";

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
    return Math.floor((date2.getTime() - date1.getTime()) / (DAYS_PER_MONTH * MS_PER_DAY));
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
    newDate.setMonth(date.getMonth() + months);
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
  finalAgeDate: Date;
}

export interface PlanProgressData {
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
  projectedAgeYears: number;
  projectedAgeMonths: number;
  isAheadOfSchedule: boolean;
}

/**
 * Financial calculation functions
 */
const financialCalculations = {
  /**
   * Processes goals for financial calculations
   */
  processGoals: (goals: Goal[], referenceDate: Date): ProcessedGoalEvent[] => {
    return goals.flatMap(goal => {
      const goalDate = new Date(goal.year, goal.month - 1);
      const monthsSinceReference = utils.calculateMonthsBetweenDates(referenceDate, goalDate);
      
      if (goal.installment_project && goal.installment_count) {
        const monthlyAmount = goal.asset_value / goal.installment_count;
        return Array.from({ length: goal.installment_count }, (_, index) => ({
          amount: monthlyAmount,
          month: monthsSinceReference + index,
          description: `${goal.icon} (${index + 1}/${goal.installment_count})`
        }));
      } else {
        return [{
          amount: goal.asset_value,
          month: monthsSinceReference,
          description: goal.icon
        }];
      }
    });
  },

  /**
   * Processes events for financial calculations
   */
  processEvents: (events: ProjectedEvent[], referenceDate: Date): ProcessedGoalEvent[] => {
    return events.map(event => {
      const eventDate = new Date(event.year, event.month - 1);
      const monthsSinceReference = utils.calculateMonthsBetweenDates(referenceDate, eventDate);
      return {
        amount: event.amount,
        month: monthsSinceReference,
        name: event.name
      };
    });
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
    projectedFuturePresentValue: number
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
    const yearDiff = planStartDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = planStartDate.getMonth() - birthDate.getMonth();
    const initialAge = yearDiff + (monthDiff / 12);
    const monthsToRetirementSinceStart = (investmentPlan.final_age - initialAge) * 12;
    monthsToRetirementSinceNow = monthsToRetirementSinceStart;
    const plannedMonths = monthsToRetirementSinceStart;
    if (actualMonth === 0 && actualYear === 0) {
      referenceDate = new Date(investmentPlan.plan_initial_date);
    } else {
      referenceDate = new Date(actualYear, actualMonth - 1);
      const finalAgeDate = utils.createDateAtAge(birthDate, investmentPlan.final_age);
      finalAgeDate.setDate(birthDate.getDate());
      
      // Calculate difference in months
      const yearDiff = finalAgeDate.getFullYear() - referenceDate.getFullYear();
      const monthDiff = finalAgeDate.getMonth() - referenceDate.getMonth();
      monthsToRetirementSinceNow = (yearDiff * 12) + monthDiff;
      
      // Adjust for partial days of month
      if (finalAgeDate.getDate() < referenceDate.getDate()) {
        monthsToRetirementSinceNow--;
      }
    }

    const { preRetirementHash, postRetirementHash } = financialCalculations.generatePreCalculationHash(
      monthlyExpectedReturn,
      monthlyInflation,
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
    const contribution = investmentPlan.monthly_deposit;
    const monthsRetired = (investmentPlan.limit_age - investmentPlan.final_age) * 12;
    
    // Calculate effective rate based on inflation adjustment setting
    const effectiveRate = monthlyExpectedReturn * (adjustContributionForInflation ? 1 : monthlyInflation);
    
    // Calculate adjusted present and future values
    const balanceWithGoals = -(currentBalance + preRetirementGoals);
    const initialWithGoals = -(investmentPlan.initial_amount + preRetirementGoals);
    const inflationInRetirementYear = (1 + monthlyInflation) ** monthsToRetirementSinceStart;
    const projectedPresentValue = projectedFuturePresentValue / inflationInRetirementYear;
    const adjustedProjectedFutureValue = (projectedPresentValue - postRetirementGoals * (adjustContributionForInflation ? 1 : inflationInRetirementYear));
    const plannedPresentValue = plannedFuturePresentValue / inflationInRetirementYear;
    const adjustedPlannedFutureValue = (plannedPresentValue - postRetirementGoals * (adjustContributionForInflation ? 1 : inflationInRetirementYear));
    // Calculate projections


    // PROJECTIONS 
    const projectedMonthsToRetirement = nper(
      effectiveRate,
      -contribution,
      balanceWithGoals,
      adjustedProjectedFutureValue
    );

    const projectedContribution = -pmt(
      effectiveRate,
      monthsToRetirementSinceNow,
      balanceWithGoals,
      adjustedProjectedFutureValue
    );

    const projectedMonthlyIncome = financialCalculations.projectedMonthlyIncome(
      investmentPlan.plan_type,
      effectiveRate,
      monthsRetired,
      projectedPresentValue,
      investmentPlan.adjust_income_for_inflation,
      monthlyInflation,
      inflationInRetirementYear,
      investmentPlan.legacy_amount,
      monthlyExpectedReturn
    )

    // PLANNED DATA
    const plannedMonthsToRetirement = nper(
      effectiveRate,
      -contribution,
      initialWithGoals,
      adjustedPlannedFutureValue
    ) - (monthsToRetirementSinceStart - monthsToRetirementSinceNow);

    const plannedContribution = -pmt(
      effectiveRate,
      monthsToRetirementSinceStart,
      initialWithGoals,
      adjustedPlannedFutureValue
    );

    const plannedMonthlyIncome = financialCalculations.projectedMonthlyIncome(
      investmentPlan.plan_type,
      effectiveRate,
      monthsRetired,
      plannedPresentValue,
      investmentPlan.adjust_income_for_inflation,
      monthlyInflation,
      inflationInRetirementYear,
      investmentPlan.legacy_amount,
      monthlyExpectedReturn
    )
    
    // Calculate dates and differences
    const projectedRetirementDate = utils.addMonthsToDate(referenceDate, projectedMonthsToRetirement);
    const plannedRetirementDate = utils.addMonthsToDate(referenceDate, plannedMonthsToRetirement);
    const finalAgeDate = utils.createDateAtAge(birthDate, investmentPlan.final_age);
    const monthsDifference = utils.calculateMonthsBetweenDates(projectedRetirementDate, plannedRetirementDate);
    return {
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
  
  // Calculate projections
  const projections = financialCalculations.calculateProjections(
    currentBalance, 
    allFinancialRecords, 
    investmentPlan, 
    birthDate, 
    goals, 
    events,
    plannedFuturePresentValue,
    projectedFuturePresentValue
  );

  // Calcular a idade projetada em anos e meses
  const projectedDate = projections.projectedRetirementDate;
  let projectedAgeYears = projectedDate.getFullYear() - birthDate.getFullYear();
  let projectedAgeMonths = projectedDate.getMonth() - birthDate.getMonth();
  
  // Ajustar meses se negativo
  if (projectedAgeMonths < 0) {
    projectedAgeYears--;
    projectedAgeMonths += 12;
  }

  return {
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
    isAheadOfSchedule: projections.monthsDifference > 0
  };
} 