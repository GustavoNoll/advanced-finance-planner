import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useParams } from "react-router-dom";

interface FinancialRecord {
  ending_balance: number;
}

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

const useInvestmentData = (userId: string) => {
  const { data: profile } = useQuery<Profile>({
    queryKey: ['profileSavingsGoal', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('birth_date')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: financialRecord } = useQuery<FinancialRecord>({
    queryKey: ['financialRecordsSavingsGoal', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_financial_records')
        .select('ending_balance')
        .eq('user_id', userId)
        .order('record_year', { ascending: false })
        .order('record_month', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: investmentPlan } = useQuery<InvestmentPlan>({
    queryKey: ['investmentPlanSavingsGoal', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('future_value, monthly_deposit, inflation, expected_return, final_age')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  return {
    currentInvestment: financialRecord?.ending_balance ?? 0,
    investmentGoal: investmentPlan?.future_value ?? 0,
    monthlyDeposit: investmentPlan?.monthly_deposit ?? 0,
    returnRate: (investmentPlan?.inflation ?? 0) + (investmentPlan?.expected_return ?? 0),
    finalAge: investmentPlan?.final_age ?? 0,
    birthDate: profile?.birth_date
  };
};

export const SavingsGoal = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const params = useParams();
  const clientId = params.id || user?.id;
  
  const { currentInvestment, investmentGoal, monthlyDeposit, returnRate, finalAge, birthDate } = useInvestmentData(clientId);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('savingsGoal.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={percentage} className="h-2" />
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