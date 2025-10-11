import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  InvestmentPlanHeader, 
  MicroPlansTimeline,
  InvestmentPlanParamsCard,
  MicroPlanCalculationsCard
} from "@/components/investment-plan";
import { useInvestmentPlan } from "@/hooks/useInvestmentPlan";
import { useMicroInvestmentPlans } from "@/hooks/useMicroInvestmentPlans";
import { useFinancialRecordsForMicroPlan } from "@/hooks/useFinancialRecordsForMicroPlan";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const InvestmentPlanShow = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  // Hook para dados do plano
  const { plan, isLoading, hasAccess } = useInvestmentPlan(id || '');
  
  // Hook para micro planos
  const {
    microPlans,
    activeMicroPlan,
    isLoading: isLoadingMicroPlans,
    createMicroPlan,
    updateMicroPlan,
    deleteMicroPlan,
    hasFinancialRecordForActivePlan
  } = useMicroInvestmentPlans(id || '');

  // Memoize birthDate to prevent unnecessary re-renders
  const birthDate = useMemo(() => {
    return plan?.profiles?.birth_date ? new Date(plan.profiles.birth_date) : new Date();
  }, [plan?.profiles?.birth_date]);

  // Hook para cálculos baseados no micro plano ativo
  const { calculations, isLoading: isLoadingCalculations } = useFinancialRecordsForMicroPlan({
    planId: id || '',
    activeMicroPlan,
    plan,
    birthDate
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!plan || !hasAccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {t('investmentPlan.messages.notFound.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('investmentPlan.messages.notFound.description')}
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')} 
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <InvestmentPlanHeader 
        plan={plan} 
        userId={user?.id} 
        t={t} 
      />


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Investment Plan Parameters and Timeline - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Plan Parameters */}
          <div className="order-2 lg:order-1">
            <InvestmentPlanParamsCard
              plan={plan}
              t={t}
              canEdit={user?.id && plan?.profiles?.broker_id === user.id}
            />
          </div>

          {/* Micro Plans Timeline */}
          <div className="order-1 lg:order-2">
            <MicroPlansTimeline
              microPlans={microPlans}
              activeMicroPlan={activeMicroPlan}
              currency={plan.currency}
              planId={plan.id}
              planInitialDate={plan.plan_initial_date}
              planLimitAge={plan.limit_age}
              onCreateMicroPlan={createMicroPlan}
              onUpdateMicroPlan={updateMicroPlan}
              onDeleteMicroPlan={deleteMicroPlan}
            />
          </div>
        </div>

        {/* Micro Plan Calculations */}
        <MicroPlanCalculationsCard
          plan={plan}
          activeMicroPlan={activeMicroPlan}
          calculations={calculations}
          t={t}
        />
      </main>
    </div>
  );
};
