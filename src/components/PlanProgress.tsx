import { useTranslation } from "react-i18next";
import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent } from "@/types/financial";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { calculateCompoundedRates, nper, yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math";


interface PlanProgressProps {
  allFinancialRecords: FinancialRecord[];
  investmentPlan: InvestmentPlan;
  profile: {
    birth_date?: string;
  };
  goals: Goal[];
  events: ProjectedEvent[];
}

interface ProjectionResult {
  projectedMonthsToRetirement: number;
  projectedContribution: number;
  projectedMonthlyIncome: number;
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

function generatePreCalculationHash(
  monthlyExpectedReturn: number,
  monthlyInflation: number,
  goals: Goal[],
  events: ProjectedEvent[],
  finalAgeMonths: number,
  referenceDate: Date
): {
  preRetirementHash: Record<number, MonthlyValues>;
  postRetirementHash: Record<number, MonthlyValues>;
} {

  // Process goals and events relative to the reference date
  const processedGoals = goals.flatMap(goal => {
    const goalDate = new Date(goal.year, goal.month - 1);
    const monthsSinceReference = Math.floor((goalDate.getTime() - referenceDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000));
    
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
    const monthsSinceReference = Math.floor((eventDate.getTime() - referenceDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000));
    return {
      amount: event.amount,
      month: monthsSinceReference,
      name: event.name
    };
  });

  // Separate into pre and post retirement
  const preRetirementGoals = processedGoals.filter(g => g.month <= finalAgeMonths);
  const postRetirementGoals = processedGoals.filter(g => g.month > finalAgeMonths);
  const preRetirementEvents = processedEvents.filter(e => e.month <= finalAgeMonths);
  const postRetirementEvents = processedEvents.filter(e => e.month > finalAgeMonths);

  // Create separate hashes for pre and post retirement
  const preRetirementHash = createMonthlyValuesHash(
    monthlyInflation,
    monthlyExpectedReturn,
    preRetirementGoals,
    preRetirementEvents,
    true,
    finalAgeMonths
  );

  const postRetirementHash = createMonthlyValuesHash(
    monthlyInflation,
    monthlyExpectedReturn,
    postRetirementGoals,
    postRetirementEvents,
    false,
    finalAgeMonths
  );

  return { preRetirementHash, postRetirementHash };
}

// Helper function to create hash for a set of goals and events
function createMonthlyValuesHash(
  monthlyInflation: number,
  monthlyExpectedReturn: number,
  goals: Array<{ amount: number; month: number; description?: string }>,
  events: Array<{ amount: number; month: number; name: string }>,
  preRetirement: boolean,
  finalAgeMonths: number
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
        amount: goal.amount/((1 + monthlyReturn)**(preRetirement ? month : month - finalAgeMonths)),
        description: goal.description
      }));
      
      const adjustedEvents = monthlyEvents.map(event => ({
        amount: event.amount/((1 + monthlyReturn)**(preRetirement ? month : month - finalAgeMonths)),
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
  let finalAgeMonths;
  let currentDate;
  if (actualMonth === 0 && actualYear === 0) {
    finalAgeMonths = (investmentPlan.final_age - investmentPlan.initial_age) * 12;
    currentDate = new Date(birthDate);
    currentDate.setFullYear(currentDate.getFullYear() + investmentPlan.initial_age);
  } else {
    currentDate = new Date(actualYear, actualMonth - 1);
    const finalAgeDate = new Date(birthDate);
    finalAgeDate.setFullYear(birthDate.getFullYear() + investmentPlan.final_age);
    // Ajuste para manter o mesmo dia do mês
    finalAgeDate.setDate(birthDate.getDate());
    
    // Calcula a diferença em meses
    const yearDiff = finalAgeDate.getFullYear() - currentDate.getFullYear();
    const monthDiff = finalAgeDate.getMonth() - currentDate.getMonth();
    finalAgeMonths = (yearDiff * 12) + monthDiff;
    
    // Ajuste para dias parciais do mês
    if (finalAgeDate.getDate() < currentDate.getDate()) {
      finalAgeMonths--;
    }
  }

  const { preRetirementHash, postRetirementHash } = generatePreCalculationHash(
    monthlyExpectedReturn,
    monthlyInflation,
    goals,
    events,
    finalAgeMonths,
    currentDate
  );

  // Calculate average contribution from records
  const projectedContribution = 0;
  const initialAmount = currentBalance;
  
  // G13 Retorno Esperado Mês (IPCA+) monthlyExpectedReturn
  // G16 Ajusta aporte pela inflação? adjustContributionForInflation
  // G11 inflação monthlyInflation
  // G18 deposito acordado monthlyDeposit
  // G17 valor inicial initialAmount
  // d6 + d13 soma objetivos pre aposentadoria (multiplicado cada um pela inflação)
  const preRetirementGoals = Object.values(preRetirementHash).reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
  const postRetirementGoals = Object.values(postRetirementHash).reduce((sum, monthlyValues) => sum + monthlyValues.adjustedValues.total, 0);
  // G25 VALOR PRESENTE NECESSARIO presentFutureValue
  // d14 + d20 soma objetivos pós aposentadoria (multiplicado cada um pela inflação)
  const adjustContributionForInflation = investmentPlan.adjust_contribution_for_inflation;
  const contribution = investmentPlan.monthly_deposit;
  const presentFutureValue = investmentPlan.present_future_value;

  // Calculate projected retirement months
  const projectedMonthsToRetirement = nper(
    monthlyExpectedReturn * (adjustContributionForInflation ? 1 : monthlyInflation),
    -contribution,
    -(initialAmount + preRetirementGoals),
    (presentFutureValue - postRetirementGoals) * (1) // TO DO: Verify se p7
  );

  // Calculate projected monthly income
  const projectedMonthlyIncome = 0;

  return {
    projectedMonthsToRetirement,
    projectedContribution,
    projectedMonthlyIncome
  };
}

export const PlanProgress = ({ allFinancialRecords, investmentPlan, profile, goals, events }: PlanProgressProps) => {
  const { t } = useTranslation();

  if (!investmentPlan || !profile.birth_date) return null;

  // Calculate current age in months
  const birthDate = new Date(profile.birth_date);
  const currentDate = new Date();
  const currentAgeMonths = Math.floor(
    (currentDate.getTime() - birthDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000)
  );
  const currentAge = Math.floor((currentDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  const currentBalance = allFinancialRecords[allFinancialRecords.length - 1]?.ending_balance || investmentPlan.initial_amount;
  
  const {
    projectedMonthsToRetirement,
    projectedContribution,
    projectedMonthlyIncome
  } = calculateProjections(
    currentBalance, 
    allFinancialRecords, 
    investmentPlan, 
    currentAgeMonths, 
    goals, 
    events,
    birthDate
  );

  // Calculate months remaining and retirement status
  const monthsToRetirement = Math.max(0, projectedMonthsToRetirement).toFixed(0);
  const isOnTrack = projectedMonthsToRetirement <= (investmentPlan.final_age * 12);
  
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
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">{t('dashboard.planProgress.currentAge')}</p>
              <p className="text-xl font-semibold text-gray-900">
                {currentAge} {t('common.years')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{t('dashboard.planProgress.monthsToRetirement')}</p>
              <p className="text-xl font-semibold text-gray-900">
                {monthsToRetirement} {t('common.months')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOnTrack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnTrack 
                ? t('dashboard.planProgress.onTrack') 
                : t('dashboard.planProgress.needsAttention')}
            </div>
            {!isOnTrack && (
              <span className="text-sm text-gray-600">
                ({Math.abs((investmentPlan.final_age * 12) - projectedMonthsToRetirement)} {t('common.months')} {t('dashboard.planProgress.behind')})
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {t('dashboard.planProgress.monthlyContribution')}
            </h3>
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.planProgress.planned')}:</p>
                <p className="text-lg font-semibold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(investmentPlan.monthly_deposit)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{t('dashboard.planProgress.projected')}:</p>
                <p className={`text-lg font-semibold ${
                  projectedContribution <= investmentPlan.monthly_deposit 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(projectedContribution)}
                  <span className="text-xs ml-1">
                    ({projectedContribution <= investmentPlan.monthly_deposit ? '-' : '+'}
                    {Math.round(Math.abs(projectedContribution - investmentPlan.monthly_deposit) * 100) / 100})
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {t('dashboard.planProgress.monthlyWithdrawal')}
            </h3>
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.planProgress.planned')}:</p>
                <p className="text-lg font-semibold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(investmentPlan.desired_income)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{t('dashboard.planProgress.projected')}:</p>
                <p className={`text-lg font-semibold ${
                  projectedMonthlyIncome >= investmentPlan.desired_income 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(projectedMonthlyIncome)}
                  <span className="text-xs ml-1">
                    ({projectedMonthlyIncome >= investmentPlan.desired_income ? '+' : ''}
                    {Math.round((projectedMonthlyIncome - investmentPlan.desired_income) * 100) / 100})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};