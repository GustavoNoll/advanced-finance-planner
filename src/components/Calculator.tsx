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
  currency,
  t
}: ComparisonRowProps) => {
  const difference = Math.round(projected) - Math.round(planned);
  const isPositive = difference >= 0;
  const isGood = isHigherBetter ? isPositive : !isPositive;
  
  return (
    <div className="bg-white/50 rounded-lg p-4 transition-all duration-200 hover:bg-white/80 hover:shadow-md">
      <h3 className="text-sm font-medium text-gray-800 mb-3">{title}</h3>
      <div className="flex justify-between items-baseline">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">{t('dashboard.planProgress.planned')}:</p>
          <p className="text-lg font-semibold text-blue-700">
            {isCurrency 
              ? formatCurrency(planned, currency as CurrencyCode)
              : `${planned.toFixed(0)} ${t('common.months')}`
            }
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-gray-500">{t('dashboard.planProgress.projected')}:</p>
          <p className={`text-lg font-semibold ${isGood ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isCurrency 
              ? formatCurrency(projected, currency as CurrencyCode)
              : `${Math.round(projected)} ${t('common.months')}`
            }
            <span className={`text-xs ml-1.5 px-1.5 py-0.5 rounded-full ${isGood ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              {isPositive ? '+' : '-'}
              {isCurrency 
                ? formatCurrency(Math.abs(difference), currency as CurrencyCode)
                : Math.abs(difference)
              }
              {!isCurrency && ` ${t('common.months')}`}
            </span>
          </p>
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
      <div className="space-y-6">
        <ComparisonRow
          title={t('dashboard.planProgress.timeToRetirement')}
          planned={data.plannedMonths}
          projected={data.projectedMonths}
          isCurrency={false}
          isHigherBetter={false}
          t={t}
          currency={investmentPlan.currency}
        />

        <div className="space-y-4">
          <ComparisonRow
            title={t('dashboard.planProgress.monthlyContribution')}
            planned={data.plannedContribution}
            projected={data.projectedContribution}
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
    </DashboardCard>
  );
};