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

export const CreatePlan = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client_id') || user?.id;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    initialAmount: "100000",
    initialAge: "",
    finalAge: "",
    monthlyDeposit: "5000",
    desiredIncome: "10000",
    expectedReturn: RISK_PROFILES[1].return,
    inflation: "6.0",
    planType: "3",
    adjustContributionForInflation: false,
    limitAge: "100",
    legacyAmount: "1000000",
  });

  // Update the calculations type to remove necessary values
  const [calculations, setCalculations] = useState<{
    futureValue: number;
    inflationAdjustedIncome: number;
    realReturn: number;
    inflationReturn: number;
    totalMonthlyReturn: number;
    requiredMonthlyDeposit: number;
  } | null>(null);

  // Add new state for tracking which row is expanded
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Add useEffect to calculate values on mount
  useEffect(() => {
    if (isCalculationReady(formData)) {
      setCalculations(calculateFutureValues(formData));
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const checkExistingPlan = async () => {
      if (!clientId) return;

      try {
        const { data, error } = await supabase
          .from('investment_plans')
          .select('*')
          .eq('user_id', clientId);

        if (error) throw error;

        // Only redirect if not in the process of submitting a new plan
        if (data && data.length > 0 && !loading) {
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
  }, [clientId, toast, loading]); // Add loading to dependencies

  // Add useEffect to fetch profile data and calculate age
  useEffect(() => {
    const fetchProfileAndSetAge = async () => {
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
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          setFormData((prev) => {
            const newFormData = {...prev,
              initialAge: age.toString(),
              finalAge: (age + 30).toString()  // Set final age as current age + 30
            }

            if (isCalculationReady(newFormData)) {
              setCalculations(calculateFutureValues(newFormData));
            } else {
              setCalculations(null);
            }
            
            return newFormData
          });
          
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to fetch client's age",
          variant: "destructive",
        });
      }
    };

    fetchProfileAndSetAge();
  }, [clientId, toast]);

  // Modify handleChange to update calculations when form values change
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
      } else if (name === 'adjustContributionForInflation') {
        newFormData.adjustContributionForInflation = checked;
      } else if (name in prev) {
        (newFormData as any)[name] = value;
      }
      
      if (isCalculationReady(newFormData)) {
        setCalculations(calculateFutureValues(newFormData));
      } else {
        setCalculations(null);
      }
      
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const calculations = calculateFutureValues(formData);
      
      const { error } = await supabase.from("investment_plans").insert([
        {
          user_id: clientId,
          initial_amount: parseFloat(formData.initialAmount),
          initial_age: parseInt(formData.initialAge),
          final_age: parseInt(formData.finalAge),
          monthly_deposit: parseFloat(formData.monthlyDeposit),
          desired_income: parseFloat(formData.desiredIncome),
          expected_return: parseFloat(formData.expectedReturn),
          inflation: parseFloat(formData.inflation),
          plan_type: formData.planType,
          future_value: calculations.futureValue,
          inflation_adjusted_income: calculations.inflationAdjustedIncome,
          required_monthly_deposit: calculations.requiredMonthlyDeposit,
          present_future_value: calculations.presentFutureValue,
          status: "active",
          adjust_contribution_for_inflation: formData.adjustContributionForInflation,
          limit_age: formData.limitAge,
          legacy_amount: formData.planType === "2" ? parseFloat(formData.legacyAmount.replace(',', '.')) : null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment plan created successfully",
      });

      // If broker created plan for client, redirect to client's profile
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
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
                  prefix="R$ "
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  placeholder="R$ 100.000,00"
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
                  required
                  min="0"
                  step="1"
                  onKeyDown={(e) => {
                    if (e.key === "." || e.key === ",") {
                      e.preventDefault();
                    }
                  }}
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
                  min="0"
                  step="1"
                  onKeyDown={(e) => {
                    if (e.key === "." || e.key === ",") {
                      e.preventDefault();
                    }
                  }}
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
                  prefix="R$ "
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  placeholder="R$ 5.000,00"
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
                  prefix="R$ "
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  placeholder="R$ 10.000,00"
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

              {(
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                      {formData.planType === "1" 
                        ? t('investmentPlan.form.endAge') 
                        : (formData.planType === "2" ? t('investmentPlan.form.legacyAge') : t('investmentPlan.form.keepAge'))}
                    </label>
                  <Input
                    type="number"
                    name="limitAge"
                    value={formData.limitAge}
                    onChange={handleChange}
                    placeholder={"100"}
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
                      id="adjustContributionForInflation"
                      name="adjustContributionForInflation"
                      checked={formData.adjustContributionForInflation}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="adjustContributionForInflation" className="text-sm font-medium text-gray-700">
                      {t('investmentPlan.form.adjustContributionForInflation')}
                    </label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando..." : "Criar Plano"}
              </Button>
            </form>
          </CardContent>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
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
        </Card>
      </div>
    </div>
  );
};
