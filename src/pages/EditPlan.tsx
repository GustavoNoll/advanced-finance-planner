import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { ArrowLeft } from "lucide-react";
import { 
  calculateFutureValues, 
  isCalculationReady, 
  type FormData as InvestmentFormData,
  type Calculations as InvestmentCalculations
} from '@/utils/investmentPlanCalculations';
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight } from "lucide-react";
import CurrencyInput from 'react-currency-input-field';

export const EditPlan = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState<InvestmentFormData>({
    initialAmount: "",
    initialAge: "",
    finalAge: "",
    monthlyDeposit: "",
    desiredIncome: "",
    expectedReturn: RISK_PROFILES[1].return,
    inflation: "6.0",
    planType: "3",
    adjustContributionForInflation: false,
    limitAge: "",
    legacyAmount: "1000000",
  });

  const [calculations, setCalculations] = useState<InvestmentCalculations | null>(null);
  const { t } = useTranslation();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const location = useLocation();

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
        .select('broker_id, is_broker')
        .eq('id', data.user_id)
        .single();

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

      console.log(data);
      setFormData({
        initialAmount: data.initial_amount.toString(),
        initialAge: data.initial_age.toString(),
        finalAge: data.final_age.toString(),
        monthlyDeposit: data.monthly_deposit.toString(),
        desiredIncome: data.desired_income.toString(),
        expectedReturn: data.expected_return.toFixed(1),
        inflation: data.inflation.toString(),
        planType: data.plan_type,
        adjustContributionForInflation: data.adjust_contribution_for_inflation,
        limitAge: data.limit_age?.toString() || "",
        legacyAmount: data.legacy_amount?.toString() || "1000000",
      });
    };

    fetchPlan();
  }, [id, user, navigate, toast]);

  useEffect(() => {
    if (formData.initialAmount) {
      setIsLoadingData(false);
    }
    if (isCalculationReady(formData)) {
      setCalculations(calculateFutureValues(formData));
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => {
      const newFormData = { ...prev };
      
      if (name === 'expectedReturn') {
        const profile = RISK_PROFILES.find(p => p.return === value);
        if (profile) {
          newFormData.expectedReturn = profile.return;
        }
      } else if (e.target.type === 'checkbox') {
        newFormData.adjustContributionForInflation = checked;
      } else {
        newFormData[name as keyof FormData] = value;
      }
      
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const calculations = calculateFutureValues(formData);
      
      const { error } = await supabase
        .from("investment_plans")
        .update({
          initial_amount: parseFloat(formData.initialAmount.replace(',', '.')),
          initial_age: parseInt(formData.initialAge),
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
          limit_age: formData.limitAge ? parseInt(formData.limitAge) : null,
          legacy_amount: formData.planType === "2" ? parseFloat(formData.legacyAmount.replace(',', '.')) : null,
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>{t('investmentPlan.edit.title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex justify-center items-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
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
                    prefix="R$ "
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('investmentPlan.form.initialAge')}
                  </label>
                  <Input
                    type="number"
                    name="initialAge"
                    value={formData.initialAge}
                    onChange={handleChange}
                    placeholder="30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('investmentPlan.form.finalAge')}
                  </label>
                  <Input
                    type="number"
                    name="finalAge"
                    value={formData.finalAge}
                    onChange={handleChange}
                    placeholder="65"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
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
                    prefix="R$ "
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
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
                    prefix="R$ "
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('investmentPlan.form.riskProfile')}
                  </label>
                  <select
                    name="expectedReturn"
                    value={formData.expectedReturn}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-white"
                    required
                  >
                    {RISK_PROFILES.map((profile) => (
                      <option
                        key={profile.value}
                        value={profile.return}
                        className={`${profile.bgColor} ${profile.textColor}`}
                      >
                        {profile.label} (IPCA+{profile.return}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                <label className="text-sm font-medium">
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
                />
              </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('investmentPlan.form.planType')}
                  </label>
                  <select
                    name="planType"
                    value={formData.planType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="1">{t('investmentPlan.planTypes.endAt120')}</option>
                    <option value="2">{t('investmentPlan.planTypes.leave1M')}</option>
                    <option value="3">{t('investmentPlan.planTypes.keepPrincipal')}</option>
                  </select>
                </div>

                {(formData.planType === "1" || formData.planType === "2") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
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
                    <label className="text-sm font-medium">
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
                      prefix="R$ "
                      decimalsLimit={2}
                      decimalSeparator=","
                      groupSeparator="."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>
                )}

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">{t('investmentPlan.form.advancedSettings')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="adjust_contribution_for_inflation"
                        name="adjust_contribution_for_inflation"
                        checked={formData.adjustContributionForInflation}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="adjust_contribution_for_inflation" className="text-sm font-medium text-gray-700">
                        {t('investmentPlan.form.adjustContributionForInflation')}
                      </label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('common.saving') : t('common.save')}
                </Button>
              </form>
            )}
          </CardContent>

          { !isLoadingData && <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {t('investmentPlan.create.calculations.title')}
            </h3>
            {isCalculationReady(formData) ? (
              <div className="space-y-2">
                <div 
                  className="flex justify-between p-2 hover:bg-gray-100 cursor-pointer rounded"
                >
                  <div className="flex items-center gap-2 w-3/4">
                    <span>{t('investmentPlan.create.calculations.inflationAdjustedIncome')}:</span>
                  </div>
                  <span>R$ {calculations?.inflationAdjustedIncome.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}/ano</span>
                </div>
                
                <div 
                  className="flex justify-between p-2 hover:bg-gray-100 cursor-pointer rounded"
                >
                  <div className="flex items-center gap-2 w-3/4">
                    <span>{t('investmentPlan.create.calculations.requiredFutureValue')}:</span>
                  </div>
                  <span>
                    R$ {calculations?.futureValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}
                  </span>
                </div>

                <div>
                  <div 
                    className="flex justify-between p-2 hover:bg-gray-100 cursor-pointer rounded"
                    onClick={() => setExpandedRow(expandedRow === 'return' ? null : 'return')}
                  >
                    <div className="flex items-center gap-2 w-3/4">
                      <span>{t('investmentPlan.create.calculations.totalMonthlyReturn')}:</span>
                    </div>
                    <span>R$ {calculations?.totalMonthlyReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                  </div>
                  {expandedRow === 'return' && (
                    <div className="pl-4 space-y-2 border-l-2 border-gray-200 mt-2 bg-gray-50 p-2 rounded">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2 w-3/4">
                          <span>{t('investmentPlan.create.calculations.monthlyRealReturn')}:</span>
                        </div>
                        <span>R$ {calculations?.realReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2 w-3/4">
                          <span>{t('investmentPlan.create.calculations.monthlyInflationReturn')}:</span>
                        </div>
                        <span>R$ {calculations?.inflationReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div 
                    className="flex justify-between p-2 hover:bg-gray-100 cursor-pointer rounded"
                    onClick={() => setExpandedRow(expandedRow === 'deposit' ? null : 'deposit')}
                  >
                    <div className="flex items-center gap-2 w-3/4">
                      <span>{t('investmentPlan.create.calculations.requiredMonthlyDeposit')}:</span>
                    </div>
                    <span>
                      R$ {calculations?.requiredMonthlyDeposit.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                {t('investmentPlan.create.calculations.fillRequired')}
              </div>
            )}
          </div>
          }
        </Card>
      </div>
    </div>
  );
};
