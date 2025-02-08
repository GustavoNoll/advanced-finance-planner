import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { ptBR } from '@/locales/pt-BR';
import { ArrowLeft } from "lucide-react";
import { 
  calculateFutureValues, 
  isCalculationReady, 
  type FormData, 
  type Calculations 
} from '@/utils/investmentPlanCalculations';
import { useTranslation } from "react-i18next";

type Calculations = {
  futureValue: number;
  inflationAdjustedIncome: number;
  realReturn: number;
  inflationReturn: number;
  totalMonthlyReturn: number;
  requiredMonthlyDeposit: number;
};

export const EditPlan = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    initialAmount: "",
    initialAge: "",
    finalAge: "",
    monthlyDeposit: "",
    desiredIncome: "",
    expectedReturn: RISK_PROFILES[1].return,
    inflation: "6.0",
    planType: "3",
  });

  const [calculations, setCalculations] = useState<Calculations | null>(null);
  const { t } = useTranslation();

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

      setFormData({
        initialAmount: data.initial_amount.toString(),
        initialAge: data.initial_age.toString(),
        finalAge: data.final_age.toString(),
        monthlyDeposit: data.monthly_deposit.toString(),
        desiredIncome: data.desired_income.toString(),
        expectedReturn: data.expected_return.toString(),
        inflation: data.inflation.toString(),
        planType: data.plan_type,
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
    
    setFormData((prev) => {
      const newFormData = { ...prev };
      
      if (name === 'expectedReturn') {
        const profile = RISK_PROFILES.find(p => p.return === value);
        if (profile) {
          newFormData.expectedReturn = profile.return;
        }
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
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment plan updated successfully",
      });

      navigate(`/investment-plan/${id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
                  <Input
                    type="number"
                    name="initialAmount"
                    value={formData.initialAmount}
                    onChange={handleChange}
                    placeholder="1000"
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
                    {t('investmentPlan.form.planType')}
                  </label>
                  <select
                    name="planType"
                    value={formData.planType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="1">{t('investmentPlan.planTypes.endAt100')}</option>
                    <option value="2">{t('investmentPlan.planTypes.leave1M')}</option>
                    <option value="3">{t('investmentPlan.planTypes.keepPrincipal')}</option>
                  </select>
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
          }
        </Card>
      </div>
    </div>
  );
};
