import { Progress } from "@/components/ui/progress";
import { DashboardCard } from "./DashboardCard";
import { ArrowUpRight, Clock, Target, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FinancialRecord, InvestmentPlan } from "@/types/financial";
import { useMemo } from "react";
import { PlanProgressData, utils } from "@/lib/plan-progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CurrencyCode, formatCurrency } from "@/utils/currency";
interface SavingsGoalProps {
  allFinancialRecords: FinancialRecord[];
  investmentPlan?: InvestmentPlan;
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

export const SavingsGoal = ({ allFinancialRecords, investmentPlan, profile, planProgressData }: SavingsGoalProps) => {
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
  const presentFutureValue = investmentPlan?.present_future_value ?? 0;
  const investmentGoal = investmentPlan?.future_value ?? 0;
  const returnRate = (investmentPlan?.inflation ?? 0) + (investmentPlan?.expected_return ?? 0);
  const finalAge = investmentPlan?.final_age ?? 0;
  const birthDate = profile?.birth_date;

  const calculateProjectedAge = (): ProjectedAgeResult | 'ageNotAvailable' | 'metaNotAchieved' => {
    if (planProgressData) {
      const birthDateObj = birthDate ? new Date(birthDate) : null;
      const finalAgeDate = utils.addMonthsToDate(birthDateObj, finalAge * 12);
      if (!birthDateObj) return 'ageNotAvailable';
      
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
              <Info className="h-4 w-4 text-gray-400 cursor-help hover:text-blue-600 transition-colors" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm text-gray-600">
                {t('savingsGoal.tooltip')}
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      }
      icon={Target}
      className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-lg hover:border-blue-100/50"
    >
      <div className="space-y-6">
        <div className="relative">
          <Progress 
            value={percentage} 
            className="w-full h-3 bg-gray-100/50 rounded-full overflow-hidden"
          />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium bg-white/90 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-gray-100/50">
            {Math.round(percentage)}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="block text-xl font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 bg-clip-text text-transparent drop-shadow-sm">
                {t('savingsGoal.currentValue', { 
                  value: formatCurrency(currentInvestment, investmentPlan?.currency as CurrencyCode)
                })}
              </span>
              <span className="text-gray-500 flex items-center gap-1.5 mt-1">
                <ArrowUpRight className="h-4 w-4" />
                {t('savingsGoal.returnRate', { value: returnRate })}
              </span>
            </div>

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

          <div className="space-y-4">
            <div>
              <span className="block text-xl font-semibold text-gray-800">
                {t('savingsGoal.goal.goalPresentValue', { 
                  value: formatCurrency(presentFutureValue, investmentPlan?.currency as CurrencyCode)
                })}
              </span>
              <span className="text-sm text-gray-500">
                {t('savingsGoal.goal.goalFutureValue', { 
                  value: formatCurrency(investmentGoal, investmentPlan?.currency as CurrencyCode)
                })}
              </span>
            </div>

            <div className="bg-gray-50/50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700">
                {t('savingsGoal.goal.projectedValue', { 
                  value: formatCurrency(planProgressData?.projectedFuturePresentValue ?? 0, investmentPlan?.currency as CurrencyCode)
                })}
              </p>
              <span className="text-sm text-gray-500">
                {t('savingsGoal.goal.targetAge', { age: finalAge })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};