import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PlanProgressData } from "@/lib/plan-progress";

/**
 * Props for the PlanProgress component
 */
interface PlanProgressProps {
  /** Processed plan progress data */
  data: PlanProgressData;
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
 * Component to display comparison between planned and projected values
 */
interface ComparisonRowProps {
  title: string;
  planned: number;
  projected: number;
  isCurrency?: boolean;
  isHigherBetter?: boolean;
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
              ? formatCurrency(planned)
              : `${planned.toFixed(0)} ${t('common.months')}`
            }
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-gray-500">{t('dashboard.planProgress.projected')}:</p>
          <p className={`text-lg font-semibold ${isGood ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isCurrency 
              ? formatCurrency(projected)
              : `${Math.round(projected)} ${t('common.months')}`
            }
            <span className={`text-xs ml-1.5 px-1.5 py-0.5 rounded-full ${isGood ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              {isPositive ? '+' : '-'}
              {isCurrency 
                ? formatCurrency(Math.abs(difference))
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
export const Calculator = ({ data }: PlanProgressProps) => {
  const { t } = useTranslation();

  return (
    <div className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl bg-gradient-to-br from-white via-slate-50 to-blue-50/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100/50 hover:border-blue-100/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
          {t('dashboard.planProgress.title')}
        </h2>
        <HoverCard>
          <HoverCardTrigger>
            <Info className="h-5 w-5 text-gray-400 cursor-help hover:text-blue-600 transition-colors" />
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p className="text-sm text-gray-600 leading-relaxed">
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
            planned={data.plannedMonthlyIncome}
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