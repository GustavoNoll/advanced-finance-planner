import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { X, Lock } from "lucide-react";
import { 
  calculateFutureValues, 
  isCalculationReady, 
  type FormData,
  type Calculations as InvestmentCalculations
} from '@/utils/investmentPlanCalculations';
import { useTranslation } from "react-i18next";
import CurrencyInput from 'react-currency-input-field';
import { CurrencyCode, getCurrencySymbol } from "@/utils/currency";
import { InvestmentPlan, FinancialRecord } from "@/types/financial";
import { calculateAge, calculateEndDate, calculateFinalAge } from '@/utils/dateUtils';
import { handleAgeDateSync, handleFormChange, type Currency } from '@/utils/formUtils';
import { RISK_PROFILES } from '@/constants/riskProfiles';

interface EditPlanModalProps {
  investmentPlan: InvestmentPlan;
  birthDate: string;
  financialRecords?: FinancialRecord[];
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPlanModal({ investmentPlan, birthDate, financialRecords = [], onClose, onSuccess }: EditPlanModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Verificar se existem registros financeiros para bloquear a edição do valor inicial
  const hasFinancialRecords = financialRecords.length > 0;
  
  const [formData, setFormData] = useState<FormData>({
    initialAmount: investmentPlan.initial_amount.toString(),
    plan_initial_date: new Date(investmentPlan.plan_initial_date).toISOString().split('T')[0],
    finalAge: investmentPlan.final_age.toString(),
    planEndAccumulationDate: investmentPlan.plan_end_accumulation_date
      ? new Date(investmentPlan.plan_end_accumulation_date).toISOString().split('T')[0]
      : (() => {
          const birth = new Date(birthDate);
          const finalAge = parseInt(investmentPlan.final_age.toString());
          birth.setFullYear(birth.getFullYear() + finalAge);
          // Round up to next month if not first day
          if (birth.getDate() > 1) {
            birth.setMonth(birth.getMonth() + 1);
          }
          birth.setDate(1); // Always use first day of month
          return birth.toISOString().split('T')[0];
        })(),
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
    oldPortfolioProfitability: investmentPlan.old_portfolio_profitability?.toString() || null,
    hasOldPortfolio: investmentPlan.old_portfolio_profitability !== null,
  });

  const [calculations, setCalculations] = useState<InvestmentCalculations | null>(null);
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [updateSource, setUpdateSource] = useState<'age' | 'date' | null>(null);

  useEffect(() => {
    if (isCalculationReady(formData) && birthDate) {
      setCalculations(calculateFutureValues(formData, new Date(birthDate)));
    }
  }, [formData, birthDate]);

  // Helper to get current age
  const getCurrentAge = () => {
    return calculateAge(new Date(birthDate), new Date(formData.plan_initial_date));
  };

  // Sync age <-> date
  useEffect(() => {
    if (!birthDate || isSyncing) return;
    if (updateSource === 'age') {
      setIsSyncing(true);
      const result = handleAgeDateSync('finalAge', formData.finalAge || '', new Date(birthDate), isSyncing, updateSource);
      if (result) {
        setFormData(prev => ({ ...prev, ...result }));
      }
      setTimeout(() => {
        setIsSyncing(false);
        setUpdateSource(null);
      }, 0);
    } else if (updateSource === 'date') {
      setIsSyncing(true);
      const result = handleAgeDateSync('planEndAccumulationDate', formData.planEndAccumulationDate || '', new Date(birthDate), isSyncing, updateSource);
      if (result) {
        setFormData(prev => ({ ...prev, ...result }));
      }
      setTimeout(() => {
        setIsSyncing(false);
        setUpdateSource(null);
      }, 0);
    }
  }, [formData.finalAge, formData.planEndAccumulationDate, birthDate, updateSource, isSyncing]);

  // Handler for age/date change
  function handleAgeDateChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (!birthDate || isSyncing) return;

    const result = handleAgeDateSync(name, value, new Date(birthDate), isSyncing, updateSource);
    if (result) {
      setUpdateSource(name === 'finalAge' ? 'age' : 'date');
      setFormData(prev => ({ ...prev, ...result }));
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const newFormData = handleFormChange(name, value, checked, formData.currency as Currency, RISK_PROFILES);
    setFormData(prev => ({ ...prev, ...newFormData }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const calculations = calculateFutureValues(formData, new Date(birthDate));
      
      const adjustedEndDate = new Date(formData.planEndAccumulationDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      const { error } = await supabase
        .from("investment_plans")
        .update({
          initial_amount: parseFloat(formData.initialAmount.replace(',', '.')),
          final_age: parseInt(formData.finalAge),
          plan_end_accumulation_date: adjustedEndDate.toISOString().split('T')[0],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        <Card className="w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50/95 to-blue-50/90 dark:from-slate-900 dark:via-slate-900/80 dark:to-blue-950/20 border border-blue-100/50 dark:border-slate-800 shadow-2xl rounded-xl">
          <CardHeader className="sticky top-0 z-[99999] border-b bg-gradient-to-r from-white/80 via-slate-50/80 to-blue-50/80 dark:from-slate-900/80 dark:via-slate-900/80 dark:to-blue-950/20 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('investmentPlan.edit.title')}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100/50 dark:hover:bg-slate-800/60"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    {t('investmentPlan.form.initialAmount')}
                    {hasFinancialRecords && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
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
                    disabled={hasFinancialRecords}
                  />
                  {hasFinancialRecords && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      {t('investmentPlan.form.initialAmountLockedMessage')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('investmentPlan.form.finalAge')}
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="finalAge"
                      value={formData.finalAge}
                      onChange={handleAgeDateChange}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">{t('investmentPlan.form.selectAge')}</option>
                      {(() => {
                        const currentAge = getCurrentAge();
                        return Array.from({ length: 121 - currentAge }, (_, i) => {
                          const age = currentAge + i;
                          return (
                            <option key={age} value={age}>
                              {age} {t('investmentPlan.form.years')}
                            </option>
                          );
                        });
                      })()}
                    </select>
                    <div className="flex gap-2">
                      <select
                        name="month"
                        value={new Date(formData.planEndAccumulationDate).getMonth()}
                        onChange={(e) => {
                          const newDate = new Date(formData.planEndAccumulationDate);
                          newDate.setMonth(parseInt(e.target.value));
                          handleAgeDateChange({
                            target: {
                              name: 'planEndAccumulationDate',
                              value: newDate.toISOString().split('T')[0]
                            }
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        className="h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="0">{t('date.months.january')}</option>
                        <option value="1">{t('date.months.february')}</option>
                        <option value="2">{t('date.months.march')}</option>
                        <option value="3">{t('date.months.april')}</option>
                        <option value="4">{t('date.months.may')}</option>
                        <option value="5">{t('date.months.june')}</option>
                        <option value="6">{t('date.months.july')}</option>
                        <option value="7">{t('date.months.august')}</option>
                        <option value="8">{t('date.months.september')}</option>
                        <option value="9">{t('date.months.october')}</option>
                        <option value="10">{t('date.months.november')}</option>
                        <option value="11">{t('date.months.december')}</option>
                      </select>
                      <select
                        name="year"
                        value={new Date(formData.planEndAccumulationDate).getFullYear()}
                        onChange={(e) => {
                          const newDate = new Date(formData.planEndAccumulationDate);
                          newDate.setFullYear(parseInt(e.target.value));
                          handleAgeDateChange({
                            target: {
                              name: 'planEndAccumulationDate',
                              value: newDate.toISOString().split('T')[0]
                            }
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        className="h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {(() => {
                          const currentYear = new Date().getFullYear();
                          const years = [];
                          for (let i = currentYear; i <= currentYear + 100; i++) {
                            years.push(
                              <option key={i} value={i}>
                                {i}
                              </option>
                            );
                          }
                          return years;
                        })()}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-500" 
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