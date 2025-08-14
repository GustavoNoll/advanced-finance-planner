import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { ptBR } from "@/locales/pt-BR";
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { calculateFutureValues, isCalculationReady, type FormData, type Calculations } from '@/utils/investmentPlanCalculations';
import CurrencyInput from 'react-currency-input-field';
import { formatCurrency, CurrencyCode, getCurrencySymbol } from "@/utils/currency";
import { calculateAge, calculateEndDate, calculateFinalAge } from '@/utils/dateUtils';
import { handleAgeDateSync, handleFormChange } from '@/utils/formUtils';

export const CreatePlan = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client_id') || user?.id;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [planCreated, setPlanCreated] = useState(false);
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
    oldPortfolioProfitability: null,
    hasOldPortfolio: false,
  });

  const [calculations, setCalculations] = useState<Calculations | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [updateSource, setUpdateSource] = useState<'age' | 'date' | null>(null);

  useEffect(() => {
    if (isCalculationReady(formData) && birthDate) {
      setCalculations(calculateFutureValues(formData, birthDate));
    }
  }, [formData, birthDate]);

  useEffect(() => {
    const checkExistingPlan = async () => {
      if (!clientId || loading || planCreated) return;

      try {
        const { data, error } = await supabase
          .from('investment_plans')
          .select('*')
          .eq('user_id', clientId);

        if (error) throw error;

        if (data && data.length > 0) {
          toast({
            title: "Plan already exists",
            description: "This client already has an investment plan. Redirecting to edit page...",
          });
          navigate(`/edit-plan/${data[0].id}`);
        }
      } catch (error: unknown) {
        console.error('Error checking existing plan:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
      }
    };

    checkExistingPlan();
  }, [clientId, toast, loading, planCreated]);

  useEffect(() => {
    const fetchProfileAndSetDate = async () => {
      if (!clientId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('birth_date')
          .eq('id', clientId)
          .single();

        if (error) throw error;

        if (data?.birth_date) {
          const birthDate = new Date(data.birth_date);
          setBirthDate(birthDate);
          
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          setFormData((prev) => ({
            ...prev,
            plan_initial_date: today.toISOString().split('T')[0],
            finalAge: (age + 30).toString(),
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to fetch client's data",
          variant: "destructive",
        });
      }
    };

    fetchProfileAndSetDate();
  }, [clientId, toast]);

  const handleAgeDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const newFormData = handleFormChange(name, value, checked, formData.currency, RISK_PROFILES);
    setFormData(prev => ({
      ...prev,
      ...newFormData
    }));
  };

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
      
      const adjustedDate = new Date(formData.plan_initial_date);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      const adjustedEndDate = new Date(formData.planEndAccumulationDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      
      const { error } = await supabase.from("investment_plans").insert([
        {
          user_id: clientId,
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
          inflation_adjusted_income: calculations.inflationAdjustedIncome,
          required_monthly_deposit: calculations.requiredMonthlyDeposit,
          present_future_value: calculations.presentFutureValue,
          status: "active",
          adjust_contribution_for_inflation: formData.adjustContributionForInflation,
          adjust_income_for_inflation: formData.adjustIncomeForInflation,
          limit_age: formData.limitAge,
          legacy_amount: formData.planType === "2" ? parseFloat(formData.legacyAmount.replace(',', '.')) : null,
          currency: formData.currency,
          old_portfolio_profitability: formData.hasOldPortfolio && formData.oldPortfolioProfitability 
            ? parseInt(formData.oldPortfolioProfitability) 
            : null,
        },
      ]);

      if (error) throw error;

      setPlanCreated(true);
      
      toast({
        title: "Success",
        description: t('investmentPlan.create.success'),
      });

      if (searchParams.get('client_id')) {
        navigate(`/client/${clientId}`);
      } else {
        navigate("/");
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const prefix = getCurrencySymbol(formData.currency as CurrencyCode);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-card text-card-foreground border border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center space-x-4">
              <Link to="/broker-dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <CardTitle>{ptBR.investmentPlan.create.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
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
                  <label className="text-sm font-medium text-muted-foreground">
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
                  <label className="text-sm font-medium text-muted-foreground">
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
                  <label className="text-sm font-medium text-muted-foreground">
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
                  <label className="text-sm font-medium text-muted-foreground">
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
                  <label className="text-sm font-medium text-muted-foreground">
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
                  <label className="text-sm font-medium text-muted-foreground">
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
                  <label className="text-sm font-medium text-muted-foreground">
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

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="hasOldPortfolio"
                      name="hasOldPortfolio"
                      checked={formData.hasOldPortfolio}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          hasOldPortfolio: e.target.checked,
                          oldPortfolioProfitability: e.target.checked ? prev.oldPortfolioProfitability : null
                        }))
                      }}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                    <label htmlFor="hasOldPortfolio" className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.hasOldPortfolio')}
                    </label>
                  </div>
                  {formData.hasOldPortfolio && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {t('investmentPlan.form.oldPortfolioProfitability')}
                      </label>
                      <select
                        name="oldPortfolioProfitability"
                        value={formData.oldPortfolioProfitability || ""}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            oldPortfolioProfitability: e.target.value || null
                          }))
                        }}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required={formData.hasOldPortfolio}
                      >
                        <option value="">{t('investmentPlan.form.selectProfitability')}</option>
                        <option value="0">IPCA + 0%</option>
                        <option value="1">IPCA + 1%</option>
                        <option value="2">IPCA + 2%</option>
                        <option value="3">IPCA + 3%</option>
                        <option value="4">IPCA + 4%</option>
                        <option value="5">IPCA + 5%</option>
                        <option value="6">IPCA + 6%</option>
                        <option value="7">IPCA + 7%</option>
                        <option value="8">IPCA + 8%</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('investmentPlan.form.advancedSettings')}
                </label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
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
                      id="adjustContributionForInflation"
                      name="adjust_contribution_for_inflation"
                      checked={formData.adjustContributionForInflation}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                    <label htmlFor="adjustContributionForInflation" className="text-sm font-medium text-muted-foreground">
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
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                    <label htmlFor="adjust_income_for_inflation" className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.adjustIncomeForInflation')}
                    </label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? t('common.saving') : t('common.save')}
              </Button>
            </form>
          </CardContent>
          
          <div className="mt-8 p-4 bg-muted rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {t('investmentPlan.create.calculations.title')}
            </h3>
            {isCalculationReady(formData) ? (
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.inflationAdjustedIncome')}:</span>
                  </div>
                  <span className="font-medium">{formatCurrency(calculations?.inflationAdjustedIncome || 0, formData.currency)}/mês</span>
                </div>
                
                <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.requiredFutureValue')}:</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(calculations?.futureValue || 0, formData.currency)}
                  </span>
                </div>

                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div 
                    className="flex justify-between p-3 cursor-pointer hover:bg-accent"
                    onClick={() => setExpandedRow(expandedRow === 'return' ? null : 'return')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.totalMonthlyReturn')}:</span>
                    </div>
                    <span className="font-medium">{formatCurrency(calculations?.totalMonthlyReturn || 0, formData.currency)}</span>
                  </div>
                  {expandedRow === 'return' && (
                    <div className="px-3 pb-3 space-y-2 border-t border-border">
                      <div className="flex justify-between pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.monthlyRealReturn')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations?.realReturn || 0, formData.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.monthlyInflationReturn')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations?.inflationReturn || 0, formData.currency)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.requiredMonthlyDeposit')}:</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(calculations?.requiredMonthlyDeposit || 0, formData.currency)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                {t('investmentPlan.create.calculations.fillRequired')}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
