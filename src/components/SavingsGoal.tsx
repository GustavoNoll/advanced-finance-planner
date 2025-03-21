import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FinancialRecord, InvestmentPlan } from "@/types/financial";
import { useMemo } from "react";
import { PlanProgressData } from "@/lib/plan-progress";

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
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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
      const projectedDate = planProgressData.projectedRetirementDate;
      const birthDateObj = birthDate ? new Date(birthDate) : null;
      
      if (!birthDateObj) return 'ageNotAvailable';
      
      const monthsDifference = planProgressData.monthsDifference;
      const isAheadOfSchedule = planProgressData.monthsDifference > 0;
      
      return {
        years: planProgressData.projectedAgeYears || 0,
        months: planProgressData.projectedAgeMonths || 0,
        isAheadOfSchedule,
        monthsDifference
      };
    }
    
    if (!birthDate || !investmentPlan) return 'ageNotAvailable';
  };

  const projectedAge = calculateProjectedAge();
  const percentage = planProgressData?.currentProgress !== undefined 
    ? planProgressData.currentProgress 
    : (currentInvestment / investmentGoal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('savingsGoal.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Progress 
              value={percentage} 
              className="w-full"
            />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium">
              {Math.round(percentage)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <span className="block text-lg font-semibold">
                {t('savingsGoal.currentValue', { 
                  value: formatCurrency(currentInvestment)
                })}
              </span>
              <span className="text-600 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" />
                {t('savingsGoal.returnRate', { value: returnRate })}
              </span>
              <span className={`flex items-center gap-2 mt-1 ${
                typeof projectedAge !== 'string' && projectedAge.isAheadOfSchedule ? 'text-green-600' : 'text-red-600'
              }`}>
                <Clock className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {typeof projectedAge !== 'string' ? (
                      <>
                        {t('savingsGoal.projectedAge.label')}
                        <span className="ml-1 font-semibold">
                          {projectedAge.years}{t('savingsGoal.projectedAge.years')}
                          {projectedAge.months > 0 && (
                            <span className="ml-1">
                              {projectedAge.months}{t('savingsGoal.projectedAge.months')}
                            </span>
                          )}
                        </span>
                        <span className="block text-sm">
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
              </span>
            </div>
            <div className="text-right">
              <span className="block text-lg font-semibold text-muted-foreground">
                {t('savingsGoal.goal.presentFutureValue', { 
                  value: formatCurrency(presentFutureValue)
                })}
              </span>
              <span className="text-sm text-muted-foreground">
                {t('savingsGoal.goal.label', { 
                  value: formatCurrency(investmentGoal)
                })}
              </span>
              <p></p>
              <span className="text-sm text-muted-foreground">
                {t('savingsGoal.goal.targetAge', { age: finalAge })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};