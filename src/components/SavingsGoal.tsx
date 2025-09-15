import { Progress } from "@/components/ui/progress";
import { DashboardCard } from "./DashboardCard";
import { ArrowUpRight, Clock, Target, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FinancialRecord, InvestmentPlan, MicroInvestmentPlan, MicroPlanCalculations } from "@/types/financial";
import { useMemo } from "react";
import { PlanProgressData, utils } from "@/lib/plan-progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CurrencyCode, formatCurrency } from "@/utils/currency";
import { createDateWithoutTimezone } from '@/utils/dateUtils';

interface SavingsGoalProps {
  allFinancialRecords: FinancialRecord[];
  investmentPlan?: InvestmentPlan;
  activeMicroPlan?: MicroInvestmentPlan | null;
  microPlanCalculations?: MicroPlanCalculations | null;
  profile?: {
    birth_date: string;
  };
  planProgressData?: PlanProgressData;
}

interface ProjectedAgeResult {
  years: number;
  months: number;
  isAheadOfSchedule: boolean;
  monthsDifference: number;
}

export const SavingsGoal = ({ allFinancialRecords, investmentPlan, activeMicroPlan, microPlanCalculations, profile, planProgressData }: SavingsGoalProps) => {
  const { t } = useTranslation();

  const lastFinancialRecord = useMemo(() => {
    if (!allFinancialRecords.length) return null;
    
    return allFinancialRecords.sort((a, b) => {
      if (b.record_year !== a.record_year) {
        return b.record_year - a.record_year;
      }
      return b.record_month - a.record_month;
    })[0];
  }, [allFinancialRecords]);

  const currentInvestment = lastFinancialRecord?.ending_balance ?? 0;
  
  // Usar cálculos centralizados do componente pai
  const presentFutureValue = microPlanCalculations?.presentFutureValue ?? 0;
  const investmentGoal = microPlanCalculations?.futureValue ?? 0;
  const returnRate = microPlanCalculations?.returnRate ?? 0;
  const birthDate = profile?.birth_date;

  const calculateProjectedAge = (): ProjectedAgeResult | 'ageNotAvailable' | 'metaNotAchieved' => {
    if (planProgressData) {
      const birthDateObj = birthDate ? createDateWithoutTimezone(birthDate) : null;
      const finalAgeDate = investmentPlan?.plan_end_accumulation_date ? createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date) : null;
      if (!birthDateObj || !finalAgeDate) return 'ageNotAvailable';
      const monthsDifference = utils.calculateMonthsBetweenDates(planProgressData.projectedRetirementDate, finalAgeDate);
      const isAheadOfSchedule = monthsDifference > 0;
      
      return {
        years: planProgressData.projectedAgeYears || 0,
        months: planProgressData.projectedAgeMonths || 0,
        isAheadOfSchedule,
        monthsDifference
      };
    }
    
    if (!birthDate || !investmentPlan) return 'ageNotAvailable';
    return 'ageNotAvailable';
  };

  const projectedAge = calculateProjectedAge();
  const percentage = planProgressData?.currentProgress !== undefined 
    ? planProgressData.currentProgress 
    : (currentInvestment / investmentGoal) * 100;

  return (
    <DashboardCard
      title={
        <div className="flex items-center gap-2">
          <span>{t('savingsGoal.title')}</span>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-help hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white dark:bg-gray-900">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('savingsGoal.tooltip')}
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      }
      icon={Target}
      className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
    >
      <div className="space-y-6">
        <div className="relative">
          <Progress 
            value={percentage} 
            className="w-full h-3 bg-gray-100/50 dark:bg-gray-800 rounded-full overflow-hidden"
          />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium bg-white/90 dark:bg-gray-900/80 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-gray-100/50 dark:border-gray-800">
            {Math.round(percentage)}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="block text-xl font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 dark:from-blue-400 dark:via-indigo-400 dark:to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
                {t('savingsGoal.currentValue', { 
                  value: formatCurrency(currentInvestment, investmentPlan?.currency as CurrencyCode)
                })}
              </span>
              {lastFinancialRecord && (
                <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('savingsGoal.currentPeriod', { 
                    month: lastFinancialRecord.record_month.toString().padStart(2, '0'),
                    year: lastFinancialRecord.record_year
                  })}
                </span>
              )}
              <span className="text-gray-500 dark:text-gray-300 flex items-center gap-1.5 mt-1">
                <ArrowUpRight className="h-4 w-4" />
                {t('savingsGoal.returnRate', { value: returnRate })}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`flex items-start gap-2 ${
              typeof projectedAge !== 'string' && projectedAge.isAheadOfSchedule ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              <Clock className="h-4 w-4 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-medium">
                  {typeof projectedAge !== 'string' ? (
                    <>
                      {t('savingsGoal.projectedAge.label')}
                      <span className="ml-1.5 font-semibold">
                        {projectedAge.years}{t('savingsGoal.projectedAge.years')}
                        {projectedAge.months > 0 && (
                          <span className="ml-1">
                            {projectedAge.months}{t('savingsGoal.projectedAge.months')}
                          </span>
                        )}
                      </span>
                      <span className="block text-sm mt-1">
                        {typeof projectedAge !== 'string' && (
                          <>
                            {projectedAge.isAheadOfSchedule
                              ? (
                                projectedAge.monthsDifference >= 12
                                  ? t('savingsGoal.projectedAge.aheadOfSchedule', { years: Math.floor(projectedAge.monthsDifference / 12), months: projectedAge.monthsDifference % 12 })
                                  : t('savingsGoal.projectedAge.aheadOfScheduleMonths', { months: Math.abs(projectedAge.monthsDifference) })
                              )
                              : (
                                projectedAge.monthsDifference >= 12
                                  ? t('savingsGoal.projectedAge.behindSchedule', { years: Math.floor(projectedAge.monthsDifference / 12), months: projectedAge.monthsDifference % 12 })
                                  : t('savingsGoal.projectedAge.behindScheduleMonths', { months: Math.abs(projectedAge.monthsDifference) })
                              )
                            }
                          </>
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground italic">
                      {t(`savingsGoal.${projectedAge}`)}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/50 dark:bg-gray-900/40 rounded-lg p-3 transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-900/60 hover:shadow-md">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300">{t('savingsGoal.goal.goalPresentValue')}</h3>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  {formatCurrency(presentFutureValue, investmentPlan?.currency as CurrencyCode)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('savingsGoal.goal.goalFutureValue')}</span>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {formatCurrency(investmentGoal, investmentPlan?.currency as CurrencyCode)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-900/40 rounded-lg p-3 transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-900/60 hover:shadow-md">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300">{t('savingsGoal.goal.planned')}</h3>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  {formatCurrency(planProgressData?.plannedPresentValue ?? 0, investmentPlan?.currency as CurrencyCode)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('savingsGoal.goal.plannedFutureValue')}</span>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {formatCurrency(planProgressData?.plannedFuturePresentValue ?? 0, investmentPlan?.currency as CurrencyCode)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-900/40 rounded-lg p-3 transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-900/60 hover:shadow-md">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300">{t('savingsGoal.goal.projected')}</h3>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  {formatCurrency(planProgressData?.projectedPresentValue ?? 0, investmentPlan?.currency as CurrencyCode)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('savingsGoal.goal.projectedFutureValue')}</span>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {formatCurrency(planProgressData?.projectedFuturePresentValue ?? 0, investmentPlan?.currency as CurrencyCode)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};