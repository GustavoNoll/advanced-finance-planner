import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatCurrency } from "@/utils/currency";
import { CurrencyCode } from "@/utils/currency";

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
                {t('investmentPlan.details.title')}
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
          <DashboardCard title={t('investmentPlan.details.clientInfo.title')}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.clientInfo.name')}</p>
                <p className="font-medium">{plan.profiles?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.form.planInitialDate')}</p>
                <p className="font-medium">
                  {plan.plan_initial_date 
                    ? new Date(plan.plan_initial_date).toLocaleDateString('pt-BR')
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.form.planEndAccumulationDate')}</p>
                <p className="font-medium">
                  {plan.plan_end_accumulation_date
                    ? new Date(plan.plan_end_accumulation_date).toLocaleDateString('pt-BR')
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.clientInfo.finalAge')}</p>
                <p className="font-medium">{plan.final_age} {t('investmentPlan.details.clientInfo.years')}</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title={t('investmentPlan.details.planOverview.title')}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.planOverview.initialAmount')}</p>
                <p className="font-medium">
                  {formatCurrency(plan.initial_amount, plan.currency as CurrencyCode)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.planOverview.monthlyDeposit')}</p>
                <p className="font-medium">
                  {formatCurrency(plan.monthly_deposit, plan.currency as CurrencyCode)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.planOverview.adjustContributionForInflation')}</p>
                <p className="font-medium">
                  {plan.adjust_contribution_for_inflation ? t('common.yes') : t('common.no')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.planOverview.adjustIncomeForInflation')}</p>
                <p className="font-medium">
                  {plan.adjust_income_for_inflation ? t('common.yes') : t('common.no')}
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title={t('investmentPlan.details.financialGoals.title')}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.financialGoals.desiredMonthlyIncome')}</p>
                <p className="font-medium">
                  {formatCurrency(plan.desired_income, plan.currency as CurrencyCode)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.financialGoals.inflationAdjustedIncome')}</p>
                <p className="font-medium">
                  {formatCurrency(plan.inflation_adjusted_income, plan.currency as CurrencyCode)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.financialGoals.presentFutureValue')}</p>
                <p className="font-medium">
                  {formatCurrency(plan.present_future_value, plan.currency as CurrencyCode)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.financialGoals.futureValue')}</p>
                <p className="font-medium">
                  {formatCurrency(plan.future_value, plan.currency as CurrencyCode)}
                </p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title={t('investmentPlan.details.investmentParams.title')}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.investmentParams.expectedReturn')}</p>
                <p className="font-medium">
                  {(() => {
                    const profiles = RISK_PROFILES[plan.currency];
                    const profile = profiles.find(p => parseInt(p.return) === parseInt(plan.expected_return));
                    return profile 
                      ? `${profile.label} (${plan.currency === 'BRL' ? 'IPCA' : 'CPI'}+${plan.expected_return}%)`
                      : `${plan.currency === 'BRL' ? 'IPCA' : 'CPI'}+${plan.expected_return}%`;
                  })()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.investmentParams.inflationRate')}</p>
                <p className="font-medium">{plan.inflation}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('investmentPlan.details.investmentParams.planType')}</p>
                <p className="font-medium">{t(`investmentPlan.details.investmentParams.types.${plan.plan_type}`)}</p>
              </div>

              {plan.plan_type === "1" && plan.limit_age && (
                <div>
                  <p className="text-sm text-gray-500">{t('investmentPlan.form.endAge')}</p>
                  <p className="font-medium">{plan.limit_age} {t('investmentPlan.details.clientInfo.years')}</p>
                </div>
              )}

              {plan.plan_type === "2" && (
                <>
                  {plan.limit_age && (
                    <div>
                      <p className="text-sm text-gray-500">{t('investmentPlan.form.legacyAge')}</p>
                      <p className="font-medium">{plan.limit_age} {t('investmentPlan.details.clientInfo.years')}</p>
                    </div>
                  )}
                  {plan.legacy_amount && (
                    <div>
                      <p className="text-sm text-gray-500">{t('investmentPlan.form.legacyAmount')}</p>
                      <p className="font-medium">
                        {formatCurrency(plan.legacy_amount, plan.currency as CurrencyCode)}
                      </p>
                    </div>
                  )}
                </>
              )}

              {plan.plan_type === "3" && (
                <div>
                  <p className="text-sm text-gray-500">{t('investmentPlan.form.keepAge')}</p>
                  <p className="font-medium">{plan.limit_age} {t('investmentPlan.details.clientInfo.years')}</p>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};
