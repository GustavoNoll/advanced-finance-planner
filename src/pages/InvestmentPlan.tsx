import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { ptBR } from "@/locales/pt-BR";
import { RISK_PROFILES } from '@/constants/riskProfiles';

export const InvestmentPlanShow = () => {
  const { id } = useParams();

  const { data: plan, isLoading } = useQuery({
    queryKey: ['investmentPlan', id],
    queryFn: async () => {
      // Primeira consulta: buscar o investment plan
      const { data: investmentPlan, error: planError } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (planError) {
        console.error('Error fetching investment plan:', planError);
        return null;
      }

      // Segunda consulta: buscar o profile relacionado
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', investmentPlan.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Combinar os resultados
      return {
        ...investmentPlan,
        profiles: profile
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!plan) {
    return <div>Investment plan not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={`/client/${plan.user_id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {ptBR.investmentPlan.details.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DashboardCard title={ptBR.investmentPlan.details.clientInfo.title}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.clientInfo.name}</p>
                <p className="font-medium">{plan.profiles?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.clientInfo.initialAge}</p>
                <p className="font-medium">{plan.initial_age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.clientInfo.finalAge}</p>
                <p className="font-medium">{plan.final_age} years</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title={ptBR.investmentPlan.details.planOverview.title}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.planOverview.initialAmount}</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(plan.initial_amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.planOverview.monthlyDeposit}</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(plan.monthly_deposit)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.planOverview.requiredMonthlyDeposit}</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(plan.required_monthly_deposit)}
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title={ptBR.investmentPlan.details.financialGoals.title}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.financialGoals.desiredMonthlyIncome}</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(plan.desired_income)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.financialGoals.inflationAdjustedIncome}</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(plan.inflation_adjusted_income)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.financialGoals.futureValue}</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(plan.future_value)}
                </p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title={ptBR.investmentPlan.details.investmentParams.title}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.investmentParams.expectedReturn}</p>
                <p className="font-medium">
                  {(() => {
                    const profile = RISK_PROFILES.find(p => parseInt(p.return) === parseInt(plan.expected_return));
                    return profile 
                      ? `${profile.label} (IPCA+${plan.expected_return}%)`                      : `IPCA+${plan.expected_return}%`;
                  })()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.investmentParams.inflationRate}</p>
                <p className="font-medium">{plan.inflation}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.investmentParams.planType}</p>
                <p className="font-medium">{ptBR.investmentPlan.details.investmentParams.types[plan.plan_type]}</p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};
