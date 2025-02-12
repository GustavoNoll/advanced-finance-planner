import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { ptBR } from "@/locales/pt-BR";
import { RISK_PROFILES, type RiskProfile } from '@/constants/riskProfiles';
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { calculateFutureValues, isCalculationReady, type FormData, type Calculations } from '@/utils/investmentPlanCalculations';

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
    initialAge: "25",
    finalAge: "50",
    monthlyDeposit: "5000",
    desiredIncome: "10000",
    expectedReturn: RISK_PROFILES[1].return,
    inflation: "6.0",
    planType: "3",
    adjust_contribution_for_inflation: false,
  });

  // Add new state for calculations
  const [calculations, setCalculations] = useState<{
    futureValue: number;
    inflationAdjustedIncome: number;
    realReturn: number;
    inflationReturn: number;
    totalMonthlyReturn: number;
    requiredMonthlyDeposit: number;
  } | null>(null);

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
  }, [clientId, toast]);

  // Modify handleChange to update calculations when form values change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newFormData = { ...prev };
      
      if (name === 'expectedReturn') {
        const profile = RISK_PROFILES.find(p => p.return === value);
        if (profile) {
          newFormData.expectedReturn = profile.return;
        }
      } else {
        newFormData[name] = value;
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
          status: "active",
          adjust_contribution_for_inflation: formData.adjust_contribution_for_inflation,
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
                <Input
                  type="number"
                  name="initialAmount"
                  value={formData.initialAmount}
                  onChange={handleChange}
                  placeholder="100000"
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
                <Input
                  type="number"
                  name="monthlyDeposit"
                  value={formData.monthlyDeposit}
                  onChange={handleChange}
                  placeholder="1000"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('investmentPlan.form.desiredIncome')}
                </label>
                <Input
                  type="number"
                  name="desiredIncome"
                  value={formData.desiredIncome}
                  onChange={handleChange}
                  placeholder="5000"
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
                  <option value="1">Encerrar aos 100 anos</option>
                  <option value="2">Deixar 1M de herança</option>
                  <option value="3">Não tocar no principal</option>
                </select>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">{t('investmentPlan.form.advancedSettings')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="adjust_contribution_for_inflation"
                      name="adjust_contribution_for_inflation"
                      checked={formData.adjust_contribution_for_inflation}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        adjust_contribution_for_inflation: e.target.checked
                      }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="adjust_contribution_for_inflation" className="text-sm font-medium text-gray-700">
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
                <div className="flex justify-between">
                  <span>{t('investmentPlan.create.calculations.inflationAdjustedIncome')}:</span>
                  <span>R$ {calculations?.inflationAdjustedIncome.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}/ano</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('investmentPlan.create.calculations.requiredFutureValue')}:</span>
                  <span>R$ {calculations?.futureValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('investmentPlan.create.calculations.monthlyRealReturn')}:</span>
                  <span>R$ {calculations?.realReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('investmentPlan.create.calculations.monthlyInflationReturn')}:</span>
                  <span>R$ {calculations?.inflationReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('investmentPlan.create.calculations.totalMonthlyReturn')}:</span>
                  <span>R$ {calculations?.totalMonthlyReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('investmentPlan.create.calculations.requiredMonthlyDeposit')}:</span>
                  <span>R$ {calculations?.requiredMonthlyDeposit.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
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
