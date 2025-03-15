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
 * Component that displays the progress of a financial plan
 */
export const Calculator = ({ data }: PlanProgressProps) => {
  const { t } = useTranslation();
  console.log(data);
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