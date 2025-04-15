import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { X } from "lucide-react";
import { 
  calculateFutureValues, 
  isCalculationReady, 
  type FormData as InvestmentFormData,
  type Calculations as InvestmentCalculations
} from '@/utils/investmentPlanCalculations';
import { useTranslation } from "react-i18next";
import CurrencyInput from 'react-currency-input-field';
import { CurrencyCode, getCurrencySymbol } from "@/utils/currency";
import { InvestmentPlan } from "@/types/financial";

interface EditPlanModalProps {
  investmentPlan: InvestmentPlan;
  birthDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPlanModal({ investmentPlan, birthDate, onClose, onSuccess }: EditPlanModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InvestmentFormData>({
    initialAmount: investmentPlan.initial_amount.toString(),
    plan_initial_date: new Date(investmentPlan.plan_initial_date).toISOString().split('T')[0],
    finalAge: investmentPlan.final_age.toString(),
    monthlyDeposit: investmentPlan.monthly_deposit.toString(),
    desiredIncome: investmentPlan.desired_income.toString(),
    expectedReturn: investmentPlan.expected_return.toFixed(1),
    inflation: investmentPlan.inflation.toString(),
    planType: investmentPlan.plan_type,
    adjustContributionForInflation: investmentPlan.adjust_contribution_for_inflation,
    adjustIncomeForInflation: investmentPlan.adjust_income_for_inflation,
    limitAge: investmentPlan.limit_age?.toString() || "85",
    legacyAmount: investmentPlan.legacy_amount?.toString() || "1000000",
    currency: investmentPlan.currency || "BRL",
  });

  const [calculations, setCalculations] = useState<InvestmentCalculations | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isCalculationReady(formData) && birthDate) {
      setCalculations(calculateFutureValues(formData, new Date(birthDate)));
    }
  }, [formData, birthDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const calculations = calculateFutureValues(formData, new Date(birthDate));
      
      const { error } = await supabase
        .from("investment_plans")
        .update({
          initial_amount: parseFloat(formData.initialAmount.replace(',', '.')),
          final_age: parseInt(formData.finalAge),
          monthly_deposit: parseFloat(formData.monthlyDeposit.replace(',', '.')),
          desired_income: parseFloat(formData.desiredIncome.replace(',', '.')),
          plan_type: formData.planType,
          future_value: calculations.futureValue,
          present_future_value: calculations.presentFutureValue,
          inflation_adjusted_income: calculations.inflationAdjustedIncome,
          required_monthly_deposit: calculations.requiredMonthlyDeposit,
        })
        .eq('id', investmentPlan.id);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('investmentPlan.edit.success'),
      });

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const prefix = getCurrencySymbol(formData.currency as CurrencyCode);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-full max-w-2xl mx-4">
        <Card className="w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50/95 to-blue-50/90 border border-blue-100/50 shadow-2xl rounded-xl">
          <CardHeader className="sticky top-0 z-[99999] border-b bg-gradient-to-r from-white/80 via-slate-50/80 to-blue-50/80 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">{t('investmentPlan.edit.title')}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('investmentPlan.form.planType')}
                  </label>
                  <select
                    name="planType"
                    value={formData.planType}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="1">{t('investmentPlan.planTypes.endAt120')}</option>
                    <option value="2">{t('investmentPlan.planTypes.leave1M')}</option>
                    <option value="3">{t('investmentPlan.planTypes.keepPrincipal')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('investmentPlan.form.initialAmount')}
                  </label>
                  <CurrencyInput
                    name="initialAmount"
                    value={formData.initialAmount}
                    onValueChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        initialAmount: value || ''
                      }))
                    }}
                    placeholder="1000"
                    prefix={prefix}
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('investmentPlan.form.finalAge')}
                  </label>
                  <Input
                    type="number"
                    name="finalAge"
                    value={formData.finalAge}
                    onChange={handleChange}
                    placeholder="65"
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('investmentPlan.form.monthlyDeposit')}
                  </label>
                  <CurrencyInput
                    name="monthlyDeposit"
                    value={formData.monthlyDeposit}
                    onValueChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        monthlyDeposit: value || ''
                      }))
                    }}
                    placeholder="1000"
                    prefix={prefix}
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('investmentPlan.form.desiredIncome')}
                  </label>
                  <CurrencyInput
                    name="desiredIncome"
                    value={formData.desiredIncome}
                    onValueChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        desiredIncome: value || ''
                      }))
                    }}
                    placeholder="5000"
                    prefix={prefix}
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('investmentPlan.form.lifeExpectancy')}
                  </label>
                  <Input
                    type="number"
                    name="limitAge"
                    value={formData.limitAge}
                    onChange={handleChange}
                    placeholder="85"
                    min="60"
                    max="120"
                    required
                    className="h-10"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200" 
                disabled={loading}
              >
                {loading ? t('common.saving') : t('common.save')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 