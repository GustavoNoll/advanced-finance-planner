import { TrendingUp, Building2, Coins, Scale, ChartLine, CalendarDays, UserCog, HeartPulse, WalletCards, Pencil } from "lucide-react";
import { InvestmentPlan, MicroInvestmentPlan, MicroPlanCalculations, FinancialRecord } from "@/types/financial";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { formatCurrency } from '@/utils/currency';
import { Button } from './ui/button';
import { createDateWithoutTimezone, createDateFromYearMonth } from '@/utils/dateUtils';
import { ChartOptions, YearlyProjectionData } from "@/lib/chart-projections";
import { ProjectionService } from "@/services/projection.service";
import { utils } from "@/lib/plan-progress";

interface InvestmentPlanDetailsProps {
  investmentPlan: InvestmentPlan | null;
  activeMicroPlan: MicroInvestmentPlan | null;
  microPlanCalculations?: MicroPlanCalculations | null;
  microPlans: MicroInvestmentPlan[];
  hasFinancialRecordForActivePlan: boolean;
  birthDate: string | null;
  onPlanUpdated?: () => void;
  onEditClick: () => void;
  onRefreshMicroPlans: () => Promise<void>;
  isBroker?: boolean;
  financialRecords?: FinancialRecord[];
  projectionData?: YearlyProjectionData[];
  chartOptions: ChartOptions;
}

interface PlanMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  duration?: string;
}

function PlanMetric({ icon, label, value, color, duration }: PlanMetricProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 py-1">
      <div className={`p-1.5 rounded-lg ${color} bg-opacity-10 dark:bg-white/5`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
      {duration && (
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.investmentPlan.duration')}</p>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">
            {duration}
          </p>
        </div>
      )}
    </div>
  );
}

export function InvestmentPlanDetails(
  { investmentPlan,
    activeMicroPlan,
    microPlanCalculations,
    microPlans,
    hasFinancialRecordForActivePlan,
    birthDate,
    onPlanUpdated,
    onEditClick,
    onRefreshMicroPlans,
    isBroker = false,
    financialRecords = [],
    projectionData,
    chartOptions }: InvestmentPlanDetailsProps) {
  const { t } = useTranslation();
  
  if (!investmentPlan || !birthDate) {
    return null;
  }

  // Helper function to parse date strings as local dates without timezone conversion
  const parseLocalDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return null;
    }
    return createDateWithoutTimezone(dateString);
  };

  const retirementDataInfo = ProjectionService.findFirstRetirementMonth(projectionData);
  const retirementMonth = retirementDataInfo?.retirementMonth;
  const firstRetirementWithdrawal = retirementMonth?.withdrawal;
  const calculateDate = (age: number) => {
    const birthDateObj = createDateWithoutTimezone(birthDate);
    if (!isValid(birthDateObj)) {
      return null;
    }
    // Create a local date without timezone conversion
    const targetDate = createDateWithoutTimezone({
      year: birthDateObj.getFullYear() + age,
      month: birthDateObj.getMonth() + 1,
      day: birthDateObj.getDate()
    });
    return targetDate;
  };

  const calculatePlanDuration = () => {
    // Se não há registros financeiros, calcula do início ao fim do plano
    if (!financialRecords || financialRecords.length === 0) {
      const planStartDate = parseLocalDate(investmentPlan.plan_initial_date);
      const planEndDate = parseLocalDate(investmentPlan.plan_end_accumulation_date);
      
      if (!planStartDate || !planEndDate || !isValid(planStartDate) || !isValid(planEndDate)) {
        return 0;
      }

      return utils.calculateMonthsBetweenDates(planStartDate, planEndDate);
    }

    // Se há registros, calcula do último registro até o fim do plano
    const sortedRecords = [...financialRecords].sort((a, b) => {
      if (a.record_year !== b.record_year) {
        return b.record_year - a.record_year;
      }
      return b.record_month - a.record_month;
    });

    const latestRecord = sortedRecords[0];
    const planEndDate = parseLocalDate(investmentPlan.plan_end_accumulation_date);
    
    if (!planEndDate || !isValid(planEndDate)) {
      return 0;
    }

    // Cria uma data para o último registro (último dia do mês)
    const lastRecordDate = createDateFromYearMonth(latestRecord.record_year, latestRecord.record_month);
    
    return utils.calculateMonthsBetweenDates(lastRecordDate, planEndDate);
  };

  const formatDate = (date: Date | null) => {
    if (!date || !isValid(date)) {
      return '';
    }
    // Ensure the date is treated as local date without timezone conversion
    const localDate = createDateWithoutTimezone(date);
    return format(localDate, "MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatShortDate = (date: Date | null) => {
    if (!date || !isValid(date)) {
      return '';
    }
    // Ensure the date is treated as local date without timezone conversion
    const localDate = createDateWithoutTimezone(date);
    return format(localDate, "dd/MM/yyyy");
  };

  // Parse birthDate as local date to avoid timezone issues
  const birthDateObj = createDateWithoutTimezone(birthDate);
  const currentAge = isValid(birthDateObj) 
    ? createDateWithoutTimezone(new Date()).getFullYear() - birthDateObj.getFullYear() 
    : 0;

  // Parse dates once to avoid multiple calls
  const planStartDate = parseLocalDate(investmentPlan.plan_initial_date);
  const planEndDate = parseLocalDate(investmentPlan.plan_end_accumulation_date);

  const timelineMetrics: PlanMetricProps[] = [
    {
      icon: <UserCog className="h-4 w-4 text-emerald-600" />,
      label: t('dashboard.investmentPlan.currentAge'),
      value: `${currentAge} ${t('dashboard.investmentPlan.years')} (${formatShortDate(birthDateObj)})`,
      color: "text-emerald-600"
    },
    {
      icon: <CalendarDays className="h-4 w-4 text-blue-600" />,
      label: t('dashboard.investmentPlan.planStart'),
      value: formatDate(planStartDate) ? formatDate(planStartDate)!.charAt(0).toUpperCase() + formatDate(planStartDate)!.slice(1) : '',
      color: "text-blue-600",
      duration: `${calculatePlanDuration()} ${t('dashboard.investmentPlan.months')}`
    },
    {
      icon: <CalendarDays className="h-4 w-4 text-blue-600" />,
      label: t('dashboard.investmentPlan.finalAge'),
      value: `${investmentPlan.final_age} ${t('dashboard.investmentPlan.years')} (${formatDate(planEndDate) || ''})`,
      color: "text-blue-600"
    },
    {
      icon: <HeartPulse className="h-4 w-4 text-violet-600" />,
      label: t('dashboard.investmentPlan.lifeExpectancy'),
      value: `${investmentPlan.limit_age} ${t('dashboard.investmentPlan.years')} (${formatDate(calculateDate(investmentPlan.limit_age))})`,
      color: "text-violet-600"
    }
  ];

  const financialMetrics: PlanMetricProps[] = [
    {
      icon: <Building2 className="h-4 w-4 text-amber-600" />,
      label: t('dashboard.investmentPlan.initialCapital'),
      value: formatCurrency(investmentPlan.initial_amount, investmentPlan.currency),
      color: "text-amber-600"
    },
    {
      icon: <WalletCards className="h-4 w-4 text-cyan-600" />,
      label: t('dashboard.investmentPlan.desiredWithdrawal'),
      value: formatCurrency(investmentPlan.desired_income, investmentPlan.currency),
      color: "text-cyan-600"
    }
  ];

  const monthlyAndWithdrawalMetrics: PlanMetricProps[] = [
    {
      icon: <TrendingUp className="h-4 w-4 text-rose-600" />,
      label: t('dashboard.investmentPlan.monthlyContribution'),
      value: formatCurrency(investmentPlan.monthly_deposit, investmentPlan.currency),
      color: "text-rose-600"
    },
    {
      icon: <Scale className="h-4 w-4 text-indigo-600" />,
      label: t('dashboard.investmentPlan.adjustedWithdrawal'),
      value: formatCurrency(
        chartOptions?.showRealValues ? microPlanCalculations?.inflationAdjustedIncome || 0 : firstRetirementWithdrawal || microPlanCalculations?.inflationAdjustedIncome || 0,
        investmentPlan.currency
      ),
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          {t('dashboard.investmentPlan.timeline')}
        </h3>
        {isBroker && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditClick}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Timeline Section */}
      <div className="space-y-3">
        <div className="space-y-2">
          {timelineMetrics.map((metric, index) => (
            <PlanMetric key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Financial Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <ChartLine className="h-4 w-4 text-amber-600" />
          {t('dashboard.investmentPlan.financial')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {financialMetrics.map((metric, index) => (
            <PlanMetric key={index} {...metric} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {monthlyAndWithdrawalMetrics.map((metric, index) => (
            <PlanMetric key={index} {...metric} />
          ))}
        </div>
      </div>
    </div>
  );
} 