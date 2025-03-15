import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent } from "@/types/financial";
import { calculateCompoundedRates, nper, yearlyReturnRateToMonthlyReturnRate, pmt } from "@/lib/financial-math";

/**
 * Constants for date calculations
 */
const DAYS_PER_MONTH = 30.44;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Utility functions
 */
const utils = {
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
  projectedMonthsToRetirement: number;
  projectedContribution: number;
  projectedMonthlyIncome: number;
  monthsDifference: number;
  plannedMonths: number;
  referenceDate: Date;
  projectedRetirementDate: Date;
  finalAgeDate: Date;
}

export interface PlanProgressData {
  plannedMonths: number;
  projectedMonths: number;
  monthsDifference: number;
  plannedContribution: number;
  projectedContribution: number;
  plannedIncome: number;
  projectedMonthlyIncome: number;
  projectedRetirementDate: Date;
  finalAgeDate: Date;
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

  /**
   * Calculates financial projections based on current state and plan
   */
  calculateProjections: (
    currentBalance: number,
    allFinancialRecords: FinancialRecord[],
    investmentPlan: InvestmentPlan,
    birthDate: Date,
    goals: Goal[],
    events: ProjectedEvent[]
  ): ProjectionResult => {
    const lastRecord = allFinancialRecords[0];
    const actualMonth = lastRecord?.record_month || 0;
    const actualYear = lastRecord?.record_year || 0;

    const monthlyExpectedReturn = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
    const monthlyInflation = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
    
    // Calculate reference date and months to retirement
    let monthsToRetirement;
    let referenceDate;
    
    if (actualMonth === 0 && actualYear === 0) {
      monthsToRetirement = (investmentPlan.final_age - investmentPlan.initial_age) * 12;
      referenceDate = utils.createDateAtAge(birthDate, investmentPlan.initial_age);
    } else {
      referenceDate = new Date(actualYear, actualMonth - 1);
      const finalAgeDate = utils.createDateAtAge(birthDate, investmentPlan.final_age);
      finalAgeDate.setDate(birthDate.getDate());
      
      // Calculate difference in months
      const yearDiff = finalAgeDate.getFullYear() - referenceDate.getFullYear();
      const monthDiff = finalAgeDate.getMonth() - referenceDate.getMonth();
      monthsToRetirement = (yearDiff * 12) + monthDiff;
      
      // Adjust for partial days of month
      if (finalAgeDate.getDate() < referenceDate.getDate()) {
        monthsToRetirement--;
      }
    }

    // Calculate planned months (from initial to final age)
    const plannedMonths = (investmentPlan.final_age - investmentPlan.initial_age) * 12;

    const { preRetirementHash, postRetirementHash } = financialCalculations.generatePreCalculationHash(
      monthlyExpectedReturn,
      monthlyInflation,
      goals,
      events,
      monthsToRetirement,
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
    const presentFutureValue = investmentPlan.present_future_value;
    const monthsRetired = (investmentPlan.limit_age - investmentPlan.final_age) * 12;
    
    // Calculate effective rate based on inflation adjustment setting
    const effectiveRate = monthlyExpectedReturn * (adjustContributionForInflation ? 1 : monthlyInflation);
    
    // Calculate adjusted present and future values
    const adjustedPresentValue = -(currentBalance + preRetirementGoals);
    const adjustedFutureValue = (presentFutureValue - postRetirementGoals);

    // Calculate projections
    const projectedMonthsToRetirement = nper(
      effectiveRate,
      -contribution,
      adjustedPresentValue,
      adjustedFutureValue
    );

    const projectedContribution = -pmt(
      effectiveRate,
      monthsToRetirement,
      adjustedPresentValue,
      adjustedFutureValue
    );

    const projectedMonthlyIncome = -pmt(
      effectiveRate,
      monthsRetired,
      presentFutureValue,
      0
    );
    
    // Calculate dates and differences
    console.log(projectedMonthsToRetirement);
    const projectedRetirementDate = utils.addMonthsToDate(referenceDate, projectedMonthsToRetirement);
    const finalAgeDate = utils.createDateAtAge(birthDate, investmentPlan.final_age);
    const monthsDifference = utils.calculateMonthsBetweenDates(projectedRetirementDate, finalAgeDate);

    return {
      projectedMonthsToRetirement,
      projectedContribution,
      projectedMonthlyIncome,
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
  events: ProjectedEvent[]
): PlanProgressData | null {
  if (!investmentPlan || !profile.birth_date) return null;

  const birthDate = new Date(profile.birth_date);
  const lastRecord = allFinancialRecords[0];
  console.log(lastRecord);
  const currentBalance = lastRecord?.ending_balance || investmentPlan.initial_amount;
  
  // Calculate projections
  const projections = financialCalculations.calculateProjections(
    currentBalance, 
    allFinancialRecords, 
    investmentPlan, 
    birthDate, 
    goals, 
    events
  );

  return {
    plannedMonths: projections.plannedMonths,
    projectedMonths: projections.plannedMonths - projections.monthsDifference,
    monthsDifference: projections.monthsDifference,
    plannedContribution: investmentPlan.monthly_deposit,
    projectedContribution: projections.projectedContribution,
    plannedIncome: investmentPlan.desired_income,
    projectedMonthlyIncome: projections.projectedMonthlyIncome,
    projectedRetirementDate: projections.projectedRetirementDate,
    finalAgeDate: projections.finalAgeDate
  };
} 