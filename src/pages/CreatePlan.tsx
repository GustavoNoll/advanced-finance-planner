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

export const CreatePlan = () => {
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
    expectedReturn: RISK_PROFILES[1].return, // Default to Moderate profile
    inflation: "6.0",
    planType: "3",
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
      } catch (error: any) {
        console.error('Error checking existing plan:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    checkExistingPlan();
  }, [clientId, navigate, toast]);

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

  // Helper function to check if we can perform calculations
  const isCalculationReady = (data: typeof formData) => {
    return Boolean(
      data.initialAmount &&
      data.initialAge &&
      data.finalAge &&
      data.desiredIncome &&
      data.expectedReturn &&
      data.inflation
    );
  };

  const calculateFutureValues = (data: typeof formData) => {
    const initialAmount = parseFloat(data.initialAmount) || 0;
    const initialAge = parseFloat(data.initialAge) || 0;
    const finalAge = parseFloat(data.finalAge) || 0;
    const desiredIncome = parseFloat(data.desiredIncome) || 0;
    const expectedReturn = parseFloat(data.expectedReturn) / 100;
    const inflation = parseFloat(data.inflation) / 100;
    const planType = data.planType;
    
    const years = finalAge - initialAge;
    const inflationAdjustedIncome = desiredIncome * Math.pow(1 + inflation, years);
    
    let futureValue;
    
    switch (planType) {
      case "1": // End at 100
        // Calculate how much is needed to deplete the principal by age 100
        const yearsTo100 = 100 - finalAge;
        const monthlyWithdrawal = inflationAdjustedIncome / 12;
        const rate = expectedReturn / 12; // Monthly rate
        
        // Fórmula de anuidade (valor presente de uma série de pagamentos mensais)
        futureValue = monthlyWithdrawal * ((1 - Math.pow(1 + rate, -yearsTo100 * 12)) / rate);
        break;
        
      case "2": // Leave 1M
        // Calculate how much is needed to maintain income and leave 1M
        const targetLegacy = 1000000;
        
        // Fórmula para calcular o valor presente necessário para gerar a renda mensal
        const monthlyIncomeRequired = inflationAdjustedIncome / 12;
        const incomePresentValue = monthlyIncomeRequired / expectedReturn;
        
        // Valor futuro é o valor necessário para gerar a renda mensal mais o valor de herança
        futureValue = Math.max(incomePresentValue + targetLegacy, targetLegacy);
        break;
        
      case "3": // Don't touch principal
        // Calculate how much principal is needed to generate income from returns only
        futureValue = inflationAdjustedIncome / (expectedReturn / 12);
        break;
        
      default:
        futureValue = 0;
    }
    
    // Calculate monthly returns
    const realReturn = (futureValue * expectedReturn) / 12;
    const inflationReturn = (futureValue * inflation) / 12;
    const totalMonthlyReturn = realReturn + inflationReturn;
    
    // Updated calculation for required monthly deposit
    // Using the total rate (expected return + inflation)
    const totalRate = expectedReturn + inflation;
    const annualRate = totalRate; // This is already in decimal form (e.g., 0.11 for 11%)

    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    const months = years * 12; // Total number of months

    // Calculate required monthly deposit using the PMT function
    const pmt = (rate: number, nper: number, pv: number, fv: number = 0) => {
      if (rate === 0) {
        return -(fv + pv) / nper;
      } else {
        return (rate * (fv + pv * Math.pow(1 + rate, nper))) / (Math.pow(1 + rate, nper) - 1);
      }
    };

    // Calculate required monthly deposit
    const requiredMonthlyDeposit = -pmt(
      monthlyRate,
      months,
      initialAmount,
      -futureValue // Note: negative because we want to accumulate this amount
    );

    return {
      futureValue,
      inflationAdjustedIncome,
      realReturn,
      inflationReturn,
      totalMonthlyReturn,
      requiredMonthlyDeposit,
    };
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
                  {ptBR.investmentPlan.create.form.initialAmount}
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
                  {ptBR.investmentPlan.create.form.initialAge}
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
                  {ptBR.investmentPlan.create.form.finalAge}
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
                  {ptBR.investmentPlan.create.form.monthlyDeposit}
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
                  {ptBR.investmentPlan.create.form.desiredIncome}
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
                  {ptBR.investmentPlan.create.form.riskProfile}
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
                  {ptBR.investmentPlan.create.form.inflationRate}
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
                  {ptBR.investmentPlan.create.form.planType}
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando..." : "Criar Plano"}
              </Button>
            </form>
          </CardContent>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {ptBR.investmentPlan.create.calculations.title}
            </h3>
            {isCalculationReady(formData) ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{ptBR.investmentPlan.create.calculations.inflationAdjustedIncome}:</span>
                  <span>R$ {calculations?.inflationAdjustedIncome.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}/ano</span>
                </div>
                <div className="flex justify-between">
                  <span>{ptBR.investmentPlan.create.calculations.requiredFutureValue}:</span>
                  <span>R$ {calculations?.futureValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{ptBR.investmentPlan.create.calculations.monthlyRealReturn}:</span>
                  <span>R$ {calculations?.realReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{ptBR.investmentPlan.create.calculations.monthlyInflationReturn}:</span>
                  <span>R$ {calculations?.inflationReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{ptBR.investmentPlan.create.calculations.totalMonthlyReturn}:</span>
                  <span>R$ {calculations?.totalMonthlyReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{ptBR.investmentPlan.create.calculations.requiredMonthlyDeposit}:</span>
                  <span>R$ {calculations?.requiredMonthlyDeposit.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                {ptBR.investmentPlan.create.calculations.fillRequired}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
