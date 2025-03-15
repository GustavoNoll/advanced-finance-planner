import { useTranslation } from "react-i18next";
import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent } from "@/types/financial";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { calculateCompoundedRates, nper, yearlyReturnRateToMonthlyReturnRate, pmt } from "@/lib/financial-math";

/**
 * Props for the PlanProgress component
 */
interface PlanProgressProps {
  /** List of all financial records */
  allFinancialRecords: FinancialRecord[];
  /** Investment plan details */
  investmentPlan: InvestmentPlan;
  /** User profile information */
  profile: {
    birth_date?: string;
  };
  /** Financial goals */
  goals: Goal[];
  /** Projected financial events */
  events: ProjectedEvent[];
}

/**
 * Result of financial projections calculation
 */
interface ProjectionResult {
  /** Projected number of months until retirement */
  projectedMonthsToRetirement: number;
  /** Projected monthly contribution amount */
  projectedContribution: number;
  /** Projected monthly income during retirement */
  projectedMonthlyIncome: number;
  /** Difference in months between projected and planned retirement */
  monthsDifference: number;
  /** Planned months until retirement */
  plannedMonths: number;
  /** Reference date for calculations */
  referenceDate: Date;
  /** Projected retirement date */
  projectedRetirementDate: Date;
  /** Final age date */
  finalAgeDate: Date;
}

/**
 * Monthly financial values for calculations
 */
type MonthlyValues = {
  /** Month number */
  month: number;
  /** Original financial values before adjustments */
  originalValues: {
    /** Financial goals for the month */
    goals: Array<{ amount: number; description?: string }>;
    /** Financial events for the month */
    events: Array<{ amount: number; name: string }>;
  };
  /** Inflation factor for the month */
  inflationFactor: number;
  /** Values adjusted for inflation and returns */
  adjustedValues: {
    /** Adjusted financial goals */
    goals: Array<{ amount: number; description?: string }>;
    /** Adjusted financial events */
    events: Array<{ amount: number; name: string }>;
    /** Total adjusted value */
    total: number;
  };
};

/**
 * Constants for date calculations
 */
const DAYS_PER_MONTH = 30.44;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Calculates the number of months between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of months between the dates
 */
function calculateMonthsBetweenDates(date1: Date, date2: Date): number {
  return Math.floor((date2.getTime() - date1.getTime()) / (DAYS_PER_MONTH * MS_PER_DAY));
}

/**
 * Formats a currency value in BRL format
 * @param value - The value to format
 * @returns Formatted currency string
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Generates pre-calculation hash for financial projections
 * @param monthlyExpectedReturn - Monthly expected return rate
 * @param monthlyInflation - Monthly inflation rate
 * @param goals - List of financial goals
 * @param events - List of projected events
 * @param monthsToR - Months to retirement
 * @param referenceDate - Reference date for calculations
 * @returns Object containing pre and post retirement hashes
 */
function generatePreCalculationHash(
  monthlyExpectedReturn: number,
  monthlyInflation: number,
  goals: Goal[],
  events: ProjectedEvent[],
  monthsToR: number,
  referenceDate: Date
): {
  preRetirementHash: Record<number, MonthlyValues>;
  postRetirementHash: Record<number, MonthlyValues>;
} {

  // Process goals and events relative to the reference date
  const processedGoals = goals.flatMap(goal => {
    const goalDate = new Date(goal.year, goal.month - 1);
    const monthsSinceReference = calculateMonthsBetweenDates(referenceDate, goalDate);
    
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

  const processedEvents = events.map(event => {
    const eventDate = new Date(event.year, event.month - 1);
    const monthsSinceReference = calculateMonthsBetweenDates(referenceDate, eventDate);
    return {
      amount: event.amount,
      month: monthsSinceReference,
      name: event.name
    };
  });

  // Separate into pre and post retirement
  const preRetirementGoals = processedGoals.filter(g => g.month <= monthsToR);
  const postRetirementGoals = processedGoals.filter(g => g.month > monthsToR);
  const preRetirementEvents = processedEvents.filter(e => e.month <= monthsToR);
  const postRetirementEvents = processedEvents.filter(e => e.month > monthsToR);

  // Create separate hashes for pre and post retirement
  const preRetirementHash = createMonthlyValuesHash(
    monthlyInflation,
    monthlyExpectedReturn,
    preRetirementGoals,
    preRetirementEvents,
    true,
    monthsToR
  );

  const postRetirementHash = createMonthlyValuesHash(
    monthlyInflation,
    monthlyExpectedReturn,
    postRetirementGoals,
    postRetirementEvents,
    false,
    monthsToR
  );

  return { preRetirementHash, postRetirementHash };
}

/**
 * Creates a hash of monthly values for financial calculations
 * @param monthlyInflation - Monthly inflation rate
 * @param monthlyExpectedReturn - Monthly expected return rate
 * @param goals - List of processed goals
 * @param events - List of processed events
 * @param preRetirement - Whether this is for pre-retirement period
 * @param monthsToR - Months to retirement
 * @returns Record of monthly values indexed by month
 */
function createMonthlyValuesHash(
  monthlyInflation: number,
  monthlyExpectedReturn: number,
  goals: Array<{ amount: number; month: number; description?: string }>,
  events: Array<{ amount: number; month: number; name: string }>,
  preRetirement: boolean,
  monthsToR: number
): Record<number, MonthlyValues> {
  const relevantMonths = new Set([
    ...goals.map(g => g.month),
    ...events.map(e => e.month)
  ].sort((a, b) => a - b));

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
      const adjustedGoals = monthlyGoals.map(goal => ({
        amount: goal.amount/((1 + monthlyReturn)**(preRetirement ? month : month - monthsToR)),
        description: goal.description
      }));
      
      const adjustedEvents = monthlyEvents.map(event => ({
        amount: event.amount/((1 + monthlyReturn)**(preRetirement ? month : month - monthsToR)),
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
}

/**
 * Calculates financial projections based on current state and plan
 * @param currentBalance - Current financial balance
 * @param allFinancialRecords - All financial records
 * @param investmentPlan - Investment plan details
 * @param currentAge - Current age in months
 * @param goals - Financial goals
 * @param events - Projected events
 * @param birthDate - User's birth date
 * @returns Projection results
 */
function calculateProjections(
  currentBalance: number,
  allFinancialRecords: FinancialRecord[],
  investmentPlan: InvestmentPlan,
  currentAge: number,
  goals: Goal[],
  events: ProjectedEvent[],
  birthDate: Date
): ProjectionResult {
  const lastRecord = allFinancialRecords[allFinancialRecords.length - 1];
  const actualMonth = lastRecord?.record_month || 0;
  const actualYear = lastRecord?.record_year || 0;

  const monthlyExpectedReturn = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
  const monthlyInflation = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
  
  // Calculate months until retirement based on current age
  let monthsToRetirement;
  let referenceDate;
  
  if (actualMonth === 0 && actualYear === 0) {
    monthsToRetirement = (investmentPlan.final_age - investmentPlan.initial_age) * 12;
    referenceDate = new Date(birthDate);
    referenceDate.setFullYear(referenceDate.getFullYear() + investmentPlan.initial_age);
  } else {
    referenceDate = new Date(actualYear, actualMonth - 1);
    const finalAgeDate = new Date(birthDate);
    finalAgeDate.setFullYear(birthDate.getFullYear() + investmentPlan.final_age);
    // Adjust to keep the same day of month
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

  const { preRetirementHash, postRetirementHash } = generatePreCalculationHash(
    monthlyExpectedReturn,
    monthlyInflation,
    goals,
    events,
    monthsToRetirement,
    referenceDate
  );

  const initialAmount = currentBalance;
  
  // Sum of pre-retirement goals (each multiplied by inflation)
  const preRetirementGoals = Object.values(preRetirementHash).reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
  const postRetirementGoals = Object.values(postRetirementHash).reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
  
  const adjustContributionForInflation = investmentPlan.adjust_contribution_for_inflation;
  const contribution = investmentPlan.monthly_deposit;
  const presentFutureValue = investmentPlan.present_future_value;
  const monthsRetired = (investmentPlan.limit_age - investmentPlan.final_age) * 12;

  // Calculate effective rate based on inflation adjustment setting
  const effectiveRate = monthlyExpectedReturn * (adjustContributionForInflation ? 1 : monthlyInflation);

  // Calculate projected retirement months
  const projectedMonthsToRetirement = nper(
    effectiveRate,
    -contribution,
    -(initialAmount + preRetirementGoals),
    (presentFutureValue - postRetirementGoals)
  );

  // Calculate average contribution from records
  const projectedContribution = -pmt(
    effectiveRate,
    monthsToRetirement,
    -(initialAmount + preRetirementGoals),
    (presentFutureValue - postRetirementGoals)
  );

  // Calculate projected monthly income
  const projectedMonthlyIncome = -pmt(
    effectiveRate,
    monthsRetired,
    presentFutureValue,
    0
  );

  // Calculate planned months (from initial to final age)
  const plannedMonths = (investmentPlan.final_age - investmentPlan.initial_age) * 12;
  
  // Calculate projected retirement date
  const projectedRetirementDate = new Date(referenceDate);
  projectedRetirementDate.setMonth(projectedRetirementDate.getMonth() + projectedMonthsToRetirement);

  // Calculate final age date
  const finalAgeDate = new Date(birthDate);
  finalAgeDate.setFullYear(birthDate.getFullYear() + investmentPlan.final_age);

  // Calculate months difference between dates
  const monthsDifference = calculateMonthsBetweenDates(projectedRetirementDate, finalAgeDate);

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

/**
 * Component to display comparison between planned and projected values
 */
interface ComparisonRowProps {
  /** Title of the comparison */
  title: string;
  /** Planned value */
  planned: number;
  /** Projected value */
  projected: number;
  /** Whether the comparison is for currency values */
  isCurrency?: boolean;
  /** Whether a higher projected value is better */
  isHigherBetter?: boolean;
  /** Translation function */
  t: (key: string) => string;
}

/**
 * Renders a comparison row between planned and projected values
 */
const ComparisonRow = ({ 
  title, 
  planned, 
  projected, 
  isCurrency = true, 
  isHigherBetter = false,
  t
}: ComparisonRowProps) => {
  const difference = projected - planned;
  const isPositive = difference >= 0;
  const isGood = isHigherBetter ? isPositive : !isPositive;
  
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="flex justify-between items-baseline">
        <div>
          <p className="text-sm text-gray-600">{t('dashboard.planProgress.planned')}:</p>
          <p className="text-lg font-semibold text-blue-600">
            {isCurrency 
              ? formatCurrency(planned)
              : `${planned} ${t('common.months')}`
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{t('dashboard.planProgress.projected')}:</p>
          <p className={`text-lg font-semibold ${isGood ? 'text-green-600' : 'text-red-600'}`}>
            {isCurrency 
              ? formatCurrency(projected)
              : `${Math.round(projected)} ${t('common.months')}`
            }
            <span className="text-xs ml-1">
              ({isPositive ? '+' : '-'}
              {isCurrency 
                ? Math.round(Math.abs(difference) * 100) / 100
                : Math.abs(difference)
              }
              {!isCurrency && ` ${t('common.months')}`})
            </span>
          </p>
        </div>
      </div>
    </div>
  );
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
function processPlanProgressData(
  allFinancialRecords: FinancialRecord[],
  investmentPlan: InvestmentPlan,
  profile: { birth_date?: string },
  goals: Goal[],
  events: ProjectedEvent[]
) {
  if (!investmentPlan || !profile.birth_date) return null;

  // Get birth date and current date
  const birthDate = new Date(profile.birth_date);
  const currentDate = new Date();
  const currentAgeMonths = calculateMonthsBetweenDates(birthDate, currentDate);

  // Get current balance from records
  const lastRecord = allFinancialRecords[allFinancialRecords.length - 1];
  const currentBalance = lastRecord?.ending_balance || investmentPlan.initial_amount;
  
  // Calculate projections
  const projections = calculateProjections(
    currentBalance, 
    allFinancialRecords, 
    investmentPlan, 
    currentAgeMonths, 
    goals, 
    events,
    birthDate
  );

  // Return all processed data needed for rendering
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

/**
 * Component that displays the progress of a financial plan
 * Compares planned values with projected values based on current progress
 */
export const PlanProgress = ({ allFinancialRecords, investmentPlan, profile, goals, events }: PlanProgressProps) => {
  const { t } = useTranslation();

  // Process all data in a single function
  const data = processPlanProgressData(allFinancialRecords, investmentPlan, profile, goals, events);
  
  // Return early if data is missing
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('dashboard.planProgress.title')}
        </h2>
        <HoverCard>
          <HoverCardTrigger>
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm text-gray-600">
              {t('dashboard.planProgress.tooltip')}
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="space-y-6">
        <ComparisonRow
          title={t('dashboard.planProgress.timeToRetirement')}
          planned={data.plannedMonths}
          projected={data.projectedMonths}
          isCurrency={false}
          isHigherBetter={false}
          t={t}
        />

        <div className="space-y-4">
          <ComparisonRow
            title={t('dashboard.planProgress.monthlyContribution')}
            planned={data.plannedContribution}
            projected={data.projectedContribution}
            isCurrency={true}
            isHigherBetter={false}
            t={t}
          />

          <ComparisonRow
            title={t('dashboard.planProgress.monthlyWithdrawal')}
            planned={data.plannedIncome}
            projected={data.projectedMonthlyIncome}
            isCurrency={true}
            isHigherBetter={true}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};