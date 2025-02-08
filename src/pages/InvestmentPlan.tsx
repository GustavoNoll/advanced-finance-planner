import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { ptBR } from "@/locales/pt-BR";
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/auth/AuthProvider";

export const InvestmentPlanShow = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: plan, isLoading } = useQuery({
    queryKey: ['investmentPlan', id],
    queryFn: async () => {
      if (!id) return null;

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
        .select('name, broker_id')
        .eq('id', investmentPlan.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // terceira consulta: buscar o broker relacionado
      const { data: actualUser, error: actualUserError } = await supabase.auth.getUser();

      if (actualUserError) {
        console.error('Error fetching broker:', actualUserError);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('investmentPlan.messages.notFound.title')}
          </h2>
          <p className="text-gray-500">
            {t('investmentPlan.messages.notFound.description')}
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')} 
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={`/client/${plan?.user_id}`}>
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

      {user?.id && plan?.profiles?.broker_id === user.id && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link to={`/edit-plan/${plan.id}`}>
              <Button 
                variant="ghost"
                className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{t('dashboard.buttons.editPlan')}</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      )}

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
                <p className="font-medium">{plan.initial_age} {ptBR.investmentPlan.details.clientInfo.years}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{ptBR.investmentPlan.details.clientInfo.finalAge}</p>
                <p className="font-medium">{plan.final_age} {ptBR.investmentPlan.details.clientInfo.years}</p>
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
