import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { 
  calculateFutureValues, 
  isCalculationReady, 
  type FormData as InvestmentFormData,
  FormData
} from '@/utils/investmentPlanCalculations';
import { useTranslation } from "react-i18next";
import CurrencyInput from 'react-currency-input-field';
import { CurrencyCode, getCurrencySymbol } from "@/utils/currency";
import { roundUpToNextMonth, calculateAge, calculateEndDate, calculateFinalAge } from '@/utils/dateUtils';
import { handleAgeDateSync, handleFormChange } from '@/utils/formUtils';

export const EditPlan = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState<FormData>({
    initialAmount: "",
    plan_initial_date: new Date().toISOString().split('T')[0],
    finalAge: "",
    planEndAccumulationDate: "",
    monthlyDeposit: "",
    desiredIncome: "",
    expectedReturn: RISK_PROFILES.BRL[1].return,
    inflation: "6.0",
    planType: "3",
    adjustContributionForInflation: false,
    adjustIncomeForInflation: false,
    limitAge: "100",
    legacyAmount: "1000000",
    currency: "BRL",
  });

  const { t } = useTranslation();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [updateSource, setUpdateSource] = useState<'age' | 'date' | null>(null);

  // Memoize calculations to prevent unnecessary recalculations
  const calculations = useMemo(() => {
    if (isCalculationReady(formData) && birthDate) {
      return calculateFutureValues(formData, birthDate);
    }
    return null;
  }, [formData, birthDate]);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;
      setIsLoadingData(true);

      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch investment plan",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('broker_id, is_broker, birth_date')
        .eq('id', data.user_id)
        .single();

      if (profileError) {
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setBirthDate(profile.birth_date ? new Date(profile.birth_date) : null);

      const { data: actualUser, error: actualUserError } = await supabase.auth.getUser();

      if (actualUserError) {
        toast({
          title: "Error",
          description: "Failed to fetch user",
        });
      }

      const { data: actualUserProfile, error: actualUserProfileError } = await supabase
        .from('profiles')
        .select('broker_id, is_broker')
        .eq('id', actualUser.user.id)
        .single();

      if (actualUserProfile.is_broker && profile.broker_id !== actualUser.user.id) {
        toast({
          title: "Error",
          description: "You don't have permission to edit this plan",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (error) throw error;

      // Adjust the date to show the correct date when editing
      const planDate = new Date(data.plan_initial_date);
      planDate.setDate(planDate.getDate() - 1);

      // Find the matching risk profile for the plan's currency
      const profiles = RISK_PROFILES[data.currency || "BRL"];
      const matchingProfile = profiles.find(p => parseFloat(p.return) === parseFloat(data.expected_return));
      const defaultProfile = profiles[1]; // Use moderate as default

      setFormData({
        initialAmount: data.initial_amount.toString(),
        plan_initial_date: planDate.toISOString().split('T')[0],
        finalAge: data.final_age.toString(),
        planEndAccumulationDate: data.plan_end_accumulation_date,
        monthlyDeposit: data.monthly_deposit.toString(),
        desiredIncome: data.desired_income.toString(),
        expectedReturn: matchingProfile?.return || defaultProfile.return,
        inflation: data.inflation.toString(),
        planType: data.plan_type,
        adjustContributionForInflation: data.adjust_contribution_for_inflation,
        adjustIncomeForInflation: data.adjust_income_for_inflation,
        limitAge: data.limit_age?.toString() || "",
        legacyAmount: data.legacy_amount?.toString() || "1000000",
        currency: data.currency || "BRL",
      });
    };

    fetchPlan();
  }, [id, user, navigate, toast]);

  useEffect(() => {
    if (formData.initialAmount) {
      setIsLoadingData(false);
    }
    if (isCalculationReady(formData) && birthDate) {
      // Calculations are now handled by useMemo
    }
  }, [formData, birthDate]);

  // Update the handleAgeDateChange function
  const handleAgeDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!birthDate || isSyncing) return;

    const result = handleAgeDateSync(name, value, birthDate, isSyncing, updateSource);
    if (result) {
      setIsSyncing(true);
      setUpdateSource(name === 'finalAge' ? 'age' : 'date');
      
      setFormData(prev => ({
        ...prev,
        ...result
      }));

      setTimeout(() => {
        setIsSyncing(false);
        setUpdateSource(null);
      }, 100);
    }
  }, [birthDate, isSyncing, updateSource]);

  // Update the handleChange function
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const newFormData = handleFormChange(name, value, checked, formData.currency, RISK_PROFILES);
    setFormData(prev => ({
      ...prev,
      ...newFormData
    }));
  }, [formData.currency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      toast({
        title: "Error",
        description: "Birth date is required",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      const calculations = calculateFutureValues(formData, birthDate);
      
      // Adjust the date to prevent UTC offset
      const adjustedDate = new Date(formData.plan_initial_date);
      adjustedDate.setDate(adjustedDate.getDate() + 1);

      const adjustedEndDate = new Date(formData.planEndAccumulationDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      
      const { error } = await supabase
        .from("investment_plans")
        .update({
          initial_amount: parseFloat(formData.initialAmount.replace(',', '.')),
          plan_initial_date: adjustedDate.toISOString().split('T')[0],
          plan_end_accumulation_date: adjustedEndDate.toISOString().split('T')[0],
          final_age: parseInt(formData.finalAge),
          monthly_deposit: parseFloat(formData.monthlyDeposit.replace(',', '.')),
          desired_income: parseFloat(formData.desiredIncome.replace(',', '.')),
          expected_return: parseFloat(formData.expectedReturn.replace(',', '.')),
          inflation: parseFloat(formData.inflation.replace(',', '.')),
          plan_type: formData.planType,
          future_value: calculations.futureValue,
          present_future_value: calculations.presentFutureValue,
          inflation_adjusted_income: calculations.inflationAdjustedIncome,
          required_monthly_deposit: calculations.requiredMonthlyDeposit,
          adjust_contribution_for_inflation: formData.adjustContributionForInflation,
          adjust_income_for_inflation: formData.adjustIncomeForInflation,
          limit_age: formData.limitAge ? parseInt(formData.limitAge) : null,
          legacy_amount: formData.planType === "2" ? parseFloat(formData.legacyAmount.replace(',', '.')) : null,
          currency: formData.currency,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment plan updated successfully",
      });

      navigate(`/investment-plan/${id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const prefix = getCurrencySymbol(formData.currency as CurrencyCode);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl font-semibold">{t('investmentPlan.edit.title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingData ? (
              <Spinner 
                size="lg" 
                className="border-t-primary/80"
              />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t('investmentPlan.form.planInitialDate')}
                    </label>
                    <Input
                      type="date"
                      name="plan_initial_date"
                      value={formData.plan_initial_date}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className="h-10"
                    />
                  </div>

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
                    <div className="flex gap-2">
                      <select
                        name="finalAge"
                        value={formData.finalAge}
                        onChange={handleAgeDateChange}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">{t('investmentPlan.form.selectAge')}</option>
                        {birthDate && Array.from({ length: 121 - (new Date().getFullYear() - new Date(birthDate).getFullYear()) }, (_, i) => {
                          const currentAge = new Date().getFullYear() - new Date(birthDate).getFullYear();
                          const monthDiff = new Date().getMonth() - new Date(birthDate).getMonth();
                          const adjustedCurrentAge = monthDiff < 0 ? currentAge - 1 : currentAge;
                          const age = adjustedCurrentAge + i;
                          return (
                            <option key={age} value={age}>
                              {age} {t('investmentPlan.form.years')}
                            </option>
                          );
                        })}
                      </select>
                      <div className="flex gap-2">
                        <select
                          name="month"
                          value={new Date(formData.planEndAccumulationDate).getMonth()}
                          onChange={(e) => {
                            const newDate = new Date(formData.planEndAccumulationDate);
                            newDate.setMonth(parseInt(e.target.value));
                            newDate.setDate(1); // Always set to first day of month
                            handleAgeDateChange({
                              target: {
                                name: 'planEndAccumulationDate',
                                value: newDate.toISOString().split('T')[0]
                              }
                            } as React.ChangeEvent<HTMLInputElement>);
                          }}
                          className="h-10 w-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                            newDate.setDate(1); // Always set to first day of month
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
                      {t('investmentPlan.form.riskProfile')}
                    </label>
                    <select
                      name="expectedReturn"
                      value={formData.expectedReturn}
                      onChange={handleChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      {RISK_PROFILES[formData.currency].map((profile) => (
                        <option
                          key={profile.value}
                          value={profile.return}
                          className={`${profile.bgColor} ${profile.textColor}`}
                        >
                          {profile.label} ({formData.currency === 'BRL' ? 'IPCA' : 'CPI'}+{profile.return}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t('investmentPlan.form.inflationRate')}
                    </label>
                    <Input
                      type="number"
                      name="inflation"
                      value={formData.inflation}
                      onChange={handleChange}
                      placeholder="6.0"
                      step="0.1"
                      required
                      className="h-10"
                    />
                  </div>
                </div>

                {formData.planType !== "3" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {formData.planType === "1" 
                        ? t('investmentPlan.form.endAge') 
                        : t('investmentPlan.form.legacyAge')}
                    </label>
                    <Input
                      type="number"
                      name="limitAge"
                      value={formData.limitAge}
                      onChange={handleChange}
                      placeholder={formData.planType === "1" ? "120" : "85"}
                      required
                      min={formData.finalAge}
                      max="120"
                      step="1"
                      className="h-10"
                      onKeyDown={(e) => {
                        if (e.key === "." || e.key === ",") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                )}

                {formData.planType === "2" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t('investmentPlan.form.legacyAmount')}
                    </label>
                    <CurrencyInput
                      name="legacyAmount"
                      value={formData.legacyAmount}
                      onValueChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          legacyAmount: value || ''
                        }))
                      }}
                      placeholder="1000000"
                      prefix={prefix}
                      decimalsLimit={2}
                      decimalSeparator=","
                      groupSeparator="."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('investmentPlan.form.advancedSettings')}</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t('investmentPlan.form.currency')}
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="BRL">{t('investmentPlan.form.currencies.BRL')}</option>
                        <option value="USD">{t('investmentPlan.form.currencies.USD')}</option>
                        <option value="EUR">{t('investmentPlan.form.currencies.EUR')}</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="adjust_contribution_for_inflation"
                        name="adjust_contribution_for_inflation"
                        checked={formData.adjustContributionForInflation}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="adjust_contribution_for_inflation" className="text-sm font-medium text-gray-700">
                        {t('investmentPlan.form.adjustContributionForInflation')}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="adjust_income_for_inflation"
                        name="adjust_income_for_inflation"
                        checked={formData.adjustIncomeForInflation}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="adjust_income_for_inflation" className="text-sm font-medium text-gray-700">
                        {t('investmentPlan.form.adjustIncomeForInflation')}
                      </label>
                    </div>
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
            )}
          </CardContent>

          {!isLoadingData && (
            <div className="mt-8 p-6 bg-gray-50 border-t">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                {t('investmentPlan.create.calculations.title')}
              </h3>
              {isCalculationReady(formData) ? (
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{t('investmentPlan.create.calculations.inflationAdjustedIncome')}:</span>
                    </div>
                    <span className="font-medium">{prefix} {calculations?.inflationAdjustedIncome.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}/mês</span>
                  </div>
                  
                  <div className="flex justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{t('investmentPlan.create.calculations.requiredFutureValue')}:</span>
                    </div>
                    <span className="font-medium">
                      {prefix} {calculations?.futureValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}
                    </span>
                  </div>

                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div 
                      className="flex justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedRow(expandedRow === 'return' ? null : 'return')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{t('investmentPlan.create.calculations.totalMonthlyReturn')}:</span>
                      </div>
                      <span className="font-medium">{prefix} {calculations?.totalMonthlyReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                    </div>
                    {expandedRow === 'return' && (
                      <div className="px-3 pb-3 space-y-2 border-t">
                        <div className="flex justify-between pt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{t('investmentPlan.create.calculations.monthlyRealReturn')}:</span>
                          </div>
                          <span className="font-medium">{prefix} {calculations?.realReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{t('investmentPlan.create.calculations.monthlyInflationReturn')}:</span>
                          </div>
                          <span className="font-medium">{prefix} {calculations?.inflationReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{t('investmentPlan.create.calculations.requiredMonthlyDeposit')}:</span>
                    </div>
                    <span className="font-medium">
                      {prefix} {calculations?.requiredMonthlyDeposit.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  {t('investmentPlan.create.calculations.fillRequired')}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
