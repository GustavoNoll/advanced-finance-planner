import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FinancialRecord } from "@/types/financial";
import { useMemo } from "react";

interface InvestmentPlan {
  future_value: number;
  monthly_deposit: number;
  inflation: number;
  expected_return: number;
  final_age: number;
}

interface Profile {
  birth_date: string;
}

interface SavingsGoalProps {
  allFinancialRecords: FinancialRecord[];
  investmentPlan?: {
    future_value: number;
    monthly_deposit: number;
    inflation: number;
    expected_return: number;
    final_age: number;
  };
  profile?: {
    birth_date: string;
  };
}

export const SavingsGoal = ({ allFinancialRecords, investmentPlan, profile }: SavingsGoalProps) => {
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
  const investmentGoal = investmentPlan?.future_value ?? 0;
  const monthlyDeposit = investmentPlan?.monthly_deposit ?? 0;
  const returnRate = (investmentPlan?.inflation ?? 0) + (investmentPlan?.expected_return ?? 0);
  const finalAge = investmentPlan?.final_age ?? 0;
  const birthDate = profile?.birth_date;

  const calculateProjectedAge = () => {
    if (!birthDate) return null;

    const monthlyRate = returnRate / 12 / 100;
    let months = 0;
    let accumulated = currentInvestment;

    while (accumulated < investmentGoal && months < 600) {
      accumulated = accumulated * (1 + monthlyRate) + monthlyDeposit;
      months++;
    }

    const birthDateObj = new Date(birthDate);
    const projectedDate = new Date(Date.now() + months * 30.44 * 24 * 60 * 60 * 1000);
    
    const projectedAge = projectedDate.getFullYear() - birthDateObj.getFullYear();
    const projectedMonth = projectedDate.getMonth() - birthDateObj.getMonth();

    const isAheadOfSchedule = projectedAge < finalAge;
    const ageDifference = Math.abs(projectedAge - finalAge);

    return { 
      years: projectedAge, 
      months: projectedMonth,
      isAheadOfSchedule,
      ageDifference
    };
  };

  const projectedAge = calculateProjectedAge();
  const percentage = (currentInvestment / investmentGoal) * 100;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

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
                {t('savingsGoal.currentValue', { value: currentInvestment.toLocaleString() })}
              </span>
              <span className="text-600 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" />
                {t('savingsGoal.returnRate', { value: returnRate })}
              </span>
              <span className={`flex items-center gap-2 mt-1 ${
                projectedAge?.isAheadOfSchedule ? 'text-green-600' : 'text-red-600'
              }`}>
                <Clock className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {projectedAge ? (
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
                          {projectedAge.isAheadOfSchedule
                            ? t('savingsGoal.projectedAge.aheadOfSchedule', { years: projectedAge.ageDifference })
                            : t('savingsGoal.projectedAge.behindSchedule', { years: projectedAge.ageDifference })}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">
                        {t('savingsGoal.ageNotAvailable')}
                      </span>
                    )}
                  </span>
                </div>
              </span>
            </div>
            <div className="text-right">
              <span className="block text-lg font-semibold text-muted-foreground">
                {t('savingsGoal.goal.label', { value: investmentGoal.toLocaleString() })}
              </span>
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