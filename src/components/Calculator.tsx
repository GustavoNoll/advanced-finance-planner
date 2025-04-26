import { useTranslation } from "react-i18next";
import { Info, Calculator as CalculatorIcon } from "lucide-react";
import { PlanProgressData } from "@/lib/plan-progress";
import { DashboardCard } from "./DashboardCard";
import { InvestmentPlan } from "@/types/financial";
import { formatCurrency, CurrencyCode} from '@/utils/currency';

/**
 * Props for the PlanProgress component
 */
interface PlanProgressProps {
  /** Processed plan progress data */
  data: PlanProgressData;
  /** Investment plan data */
  investmentPlan: InvestmentPlan;
}


/**
 * Component to display comparison between planned and projected values
 */
interface ComparisonRowProps {
  title: string;
  planned: number;
  projected: number;
  isCurrency?: boolean;
  isHigherBetter?: boolean;
  t: (key: string) => string;
  currency: string;
  plannedAgeYears?: number;
  plannedAgeMonths?: number;
  projectedAgeYears?: number;
  projectedAgeMonths?: number;
}

/**
 * Formats months into years and months string with client's age
 */
const formatMonthsToYearsAndMonths = (months: number, t: (key: string) => string, currentAge?: number): string => {
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  
  if (months < 12) return '';

  let result = '';
  if (remainingMonths === 0) {
    result = `(${years} ${t('common.years')})`;
  } else {
    result = `(${years} ${t('common.years')} ${t('common.and')} ${remainingMonths} ${t('common.months')})`;
  }

  if (currentAge !== undefined) {
    result += `\n${t('dashboard.planProgress.ageAtRetirement')}: ${currentAge} ${t('common.years')}`;
  }

  return result;
};

/**
 * Formats retirement tooltip
 */
const formatRetirementTooltip = (years?: number, months?: number, t?: (key: string) => string): string => {
  if (years === undefined || months === undefined || !t) return '';
  let result = '';
  if (years > 0 && months > 0) result = `${years} ${t('common.years')} e ${months} ${t('common.months')}`;
  else if (years > 0) result = `${years} ${t('common.years')}`;
  else if (months > 0) result = `${months} ${t('common.months')}`;
  return `Aposentadoria em ${result}`;
};

/**
 * Renders a comparison row between planned and projected values
 */
const ComparisonRow = ({ 
  title, 
  planned, 
  projected, 
  isCurrency = true, 
  isHigherBetter = false,
  currency,
  t,
  plannedAgeYears,
  plannedAgeMonths,
  projectedAgeYears,
  projectedAgeMonths
}: ComparisonRowProps) => {
  const difference = Math.round(projected) - Math.round(planned);
  const isEqual = difference === 0;
  const isPositive = difference >= 0;
  const isGood = isHigherBetter ? isPositive : !isPositive;
  
  return (
    <div className="bg-white/50 rounded-lg p-4 transition-all duration-200 hover:bg-white/80 hover:shadow-md">
      <h3 className="text-sm font-medium text-gray-800 mb-3">{title}</h3>
      <div className="flex justify-between items-baseline">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">{t('dashboard.planProgress.planned')}:</p>
          <div>
            <p className="text-lg font-semibold text-blue-700">
              {isCurrency 
                ? formatCurrency(planned, currency as CurrencyCode)
                : `${planned.toFixed(0)} ${t('common.months')}`
              }
            </p>
            {!isCurrency && planned >= 12 && (
              <span className="block text-xs text-gray-500">
                {formatMonthsToYearsAndMonths(planned, t)}
              </span>
            )}
            {!isCurrency && planned >= 12 && plannedAgeYears !== undefined && (
              <div className="text-xs text-gray-500 mt-0.5">
                <span className="block">
                  <span className="relative group cursor-pointer">
                    <span>
                      {t('dashboard.planProgress.retirement')}: {plannedAgeYears} {t('common.years')}
                    </span>
                    <span className="absolute left-1/2 z-10 hidden group-hover:flex -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                      {plannedAgeYears > 0 && plannedAgeMonths > 0
                        ? formatRetirementTooltip(plannedAgeYears, plannedAgeMonths, t)
                        : plannedAgeYears > 0
                          ? formatRetirementTooltip(plannedAgeYears, undefined, t)
                          : formatRetirementTooltip(undefined, plannedAgeMonths, t)
                      }
                    </span>
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-gray-500">{t('dashboard.planProgress.projected')}:</p>
          <div>
            <p className={`text-lg font-semibold ${isEqual ? 'text-gray-900' : isGood ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isCurrency 
                ? formatCurrency(projected, currency as CurrencyCode)
                : `${Math.round(projected)} ${t('common.months')}`
              }
              {!isEqual && (
                <span className={`text-xs ml-1.5 px-1.5 py-0.5 rounded-full ${isGood ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  {isPositive ? '+' : '-'}
                  {isCurrency 
                    ? formatCurrency(Math.abs(difference), currency as CurrencyCode)
                    : `${Math.abs(difference)} ${t('common.months')}`
                  }
                </span>
              )}
            </p>
            {!isCurrency && projected >= 12 && (
              <span className="block text-xs text-gray-500">
                {formatMonthsToYearsAndMonths(Math.round(projected), t)}
              </span>
            )}
            {!isCurrency && projected >= 12 && projectedAgeYears !== undefined && (
              <div className="text-xs text-gray-500 mt-0.5">
                <span className="block">
                  <span className="relative group cursor-pointer">
                    <span>
                      {t('dashboard.planProgress.retirement')}: {projectedAgeYears} {t('common.years')}
                    </span>
                    <span className="absolute left-1/2 z-10 hidden group-hover:flex -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                      {projectedAgeYears > 0 && projectedAgeMonths > 0
                        ? formatRetirementTooltip(projectedAgeYears, projectedAgeMonths, t)
                        : projectedAgeYears > 0
                          ? formatRetirementTooltip(projectedAgeYears, undefined, t)
                          : formatRetirementTooltip(undefined, projectedAgeMonths, t)
                      }
                    </span>
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Component that displays the progress of a financial plan
 */
export const Calculator = ({ data, investmentPlan }: PlanProgressProps) => {
  const { t } = useTranslation();
  
  return (
    <DashboardCard
      title={t('dashboard.planProgress.title')}
      icon={CalculatorIcon}
    >
      {data && (
        <div className="space-y-6">
          <ComparisonRow
            title={t('dashboard.planProgress.timeToRetirement')}
            planned={data.plannedMonths}
            projected={data.projectedMonths}
            isCurrency={false}
            isHigherBetter={false}
            t={t}
            currency={investmentPlan.currency}
            plannedAgeYears={data.plannedAgeYears}
            plannedAgeMonths={data.plannedAgeMonths}
            projectedAgeYears={data.projectedAgeYears}
            projectedAgeMonths={data.projectedAgeMonths}
          />

          <div className="space-y-4">
            <ComparisonRow
              title={t('dashboard.planProgress.monthlyContribution')}
              planned={Math.max(data.plannedContribution, 0)}
              projected={Math.max(data.projectedContribution, 0)}
              isCurrency={true}
              isHigherBetter={false}
              t={t}
              currency={investmentPlan.currency}
            />

            <ComparisonRow
              title={t('dashboard.planProgress.monthlyWithdrawal')}
              planned={data.plannedMonthlyIncome}
              projected={data.projectedMonthlyIncome}
              isCurrency={true}
              isHigherBetter={true}
              t={t}
              currency={investmentPlan.currency}
            />
          </div>
        </div>
      )}
    </DashboardCard>
  );
};