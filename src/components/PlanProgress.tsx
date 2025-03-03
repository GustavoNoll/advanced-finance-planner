import { useTranslation } from "react-i18next";
import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent } from "@/types/financial";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math";


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
  currentAge: number,
  monthlyInflation: number,
  goals: Goal[],
  events: ProjectedEvent[]
): Record<number, MonthlyValues> {
  // Process goals and create installments if needed
  const processedGoals = goals.flatMap(goal => {
    const goalMonth = Math.floor(new Date(goal.year, goal.month - 1).getTime() / (30.44 * 24 * 60 * 60 * 1000));
    
    if (goal.installment_project && goal.installment_count) {
      // Create monthly installments
      const monthlyAmount = goal.asset_value / goal.installment_count;
      return Array.from({ length: goal.installment_count }, (_, index) => ({
        amount: monthlyAmount,
        month: goalMonth + index,
        description: `${goal.description} (${index + 1}/${goal.installment_count})`
      }));
    } else {
      // Single payment goal
      return [{
        amount: goal.asset_value,
        month: goalMonth,
        description: goal.description
      }];
    }
  });

  // Process events
  const processedEvents = events.map(event => ({
    amount: event.amount,
    month: Math.floor(new Date(event.year, event.month - 1).getTime() / (30.44 * 24 * 60 * 60 * 1000)),
    name: event.name
  }));
  console.log(processedEvents);
  console.log(processedGoals);

  // Get all relevant months
  const relevantMonths = new Set([
    ...processedGoals.map(g => g.month),
    ...processedEvents.map(e => e.month)
  ].sort((a, b) => a - b));

  console.log(relevantMonths);

  const preCalculationHash: Record<number, MonthlyValues> = {};
  let currentMonth = currentAge;
  let inflationFactor = 1;

  for (const month of relevantMonths) {
    // Update inflation factor for all months up to this point
    while (currentMonth <= month) {
      inflationFactor *= (1 + monthlyInflation);
      currentMonth++;
    }

    // Get goals for this month
    const monthlyGoals = processedGoals
      .filter(goal => goal.month === month)
      .map(goal => ({
        amount: goal.amount,
        description: goal.description
      }));

    // Get events for this month
    const monthlyEvents = processedEvents
      .filter(event => event.month === month)
      .map(event => ({
        amount: event.amount,
        name: event.name
      }));

    // Only create hash entry if there are goals or events
    if (monthlyGoals.length > 0 || monthlyEvents.length > 0) {
      const adjustedGoals = monthlyGoals.map(goal => ({
        amount: goal.amount * inflationFactor,
        description: goal.description
      }));
      
      const adjustedEvents = monthlyEvents.map(event => ({
        amount: event.amount * inflationFactor,
        name: event.name
      }));

      preCalculationHash[month] = {
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
            ...adjustedGoals.map(g => g.amount),
            ...adjustedEvents.map(e => e.amount)
          ].reduce((sum, val) => sum + val, 0)
        }
      };
    }
  }

  return preCalculationHash;
}

function calculateProjections(
  currentBalance: number,
  allFinancialRecords: FinancialRecord[],
  investmentPlan: InvestmentPlan,
  currentAge: number,
  goals: Goal[],
  events: ProjectedEvent[]
): ProjectionResult {
  const monthlyExpectedReturn = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
  const monthlyInflation = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);

  // Generate pre-calculation hash
  const preCalculationHash = generatePreCalculationHash(
    currentAge,
    monthlyInflation,
    goals,
    events
  );

  console.log(preCalculationHash);

  // Calculate average contribution from records
  const projectedContribution = 0;

  // Calculate projected retirement age
  const projectedMonthsToRetirement = 51 * 12;
  // G13 Retorno Esperado Mês (IPCA+) monthlyExpectedReturn
  // G16 Ajusta aporte pela inflação? adjustContributionForInflation
  // G11 inflação monthlyInflation
  // G18 deposito acordado monthlyDeposit
  // G17 valor inicial initialAmount
  // d6 + d13 soma objetivos pre aposentadoria (multiplicado cada um pela inflação)
  // G25 VALOR PRESENTE NECESSARIO presentFutureValue
  // d14 + d20 soma objetivos pós aposentadoria (multiplicado cada um pela inflação)
  const adjustContributionForInflation = investmentPlan.adjust_contribution_for_inflation;
  const contribution = adjustContributionForInflation ? monthlyInflation : 0;
  const initialAmount = investmentPlan.initial_amount;
  const presentFutureValue = investmentPlan.present_future_value;

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

  
  const currentBalance = allFinancialRecords[0]?.ending_balance || 0;
  
  const {
    projectedMonthsToRetirement,
    projectedContribution,
    projectedMonthlyIncome
  } = calculateProjections(currentBalance, allFinancialRecords, investmentPlan, currentAgeMonths, goals, events);

  // Calculate months remaining and retirement status
  const monthsToRetirement = Math.max(0, projectedMonthsToRetirement - currentAgeMonths);
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