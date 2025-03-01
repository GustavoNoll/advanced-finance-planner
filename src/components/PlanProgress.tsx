import { useTranslation } from "react-i18next";
import { FinancialRecord, InvestmentPlan } from "@/types/financial";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";


interface PlanProgressProps {
  allFinancialRecords: FinancialRecord[];
  investmentPlan: InvestmentPlan;
  profile: {
    birth_date?: string;
  };
}

interface ProjectionResult {
  projectedRetirementAge: number;
  projectedContribution: number;
  projectedMonthlyIncome: number;
}

function calculateProjections(
  currentBalance: number,
  allFinancialRecords: FinancialRecord[],
  investmentPlan: InvestmentPlan,
  currentAge: number
): ProjectionResult {
  // Calculate average contribution from records
  const projectedContribution = investmentPlan.required_monthly_deposit;

  // Calculate projected retirement age
  const projectedRetirementAge = 51;

  // Calculate projected monthly income
  const projectedMonthlyIncome = 0;

  return {
    projectedRetirementAge,
    projectedContribution,
    projectedMonthlyIncome
  };
}

export const PlanProgress = ({ allFinancialRecords, investmentPlan, profile }: PlanProgressProps) => {
  const { t } = useTranslation();

  if (!investmentPlan || !profile.birth_date) return null;

  // Calculate current age
  const birthDate = new Date(profile.birth_date);
  const currentDate = new Date();
  const currentAge = Math.floor((currentDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  
  const currentBalance = allFinancialRecords[0]?.ending_balance || 0;
  
  const {
    projectedRetirementAge,
    projectedContribution,
    projectedMonthlyIncome
  } = calculateProjections(currentBalance, allFinancialRecords, investmentPlan, currentAge);

  // Calculate years remaining and retirement status
  const yearsToRetirement = Math.max(0, projectedRetirementAge - currentAge);
  const isOnTrack = projectedRetirementAge <= investmentPlan.final_age;
  
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
              <p className="text-xl font-semibold text-gray-900">{currentAge} {t('common.years')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{t('dashboard.planProgress.yearsToRetirement')}</p>
              <p className="text-xl font-semibold text-gray-900">{yearsToRetirement} {t('common.years')}</p>
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
                ({Math.abs(investmentPlan.final_age - projectedRetirementAge)} {t('common.years')} {t('dashboard.planProgress.behind')})
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