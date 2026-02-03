import { ExpenseChart } from "@/features/financial-records/components/ExpenseChart";
import { SavingsGoal } from "@/features/goals-events/components/SavingsGoal";
import { MonthlyView } from "@/shared/components/monthly-view/MonthlyView";
import { Trophy } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/shared/components/ui/spinner";
import { Calculator } from "@/features/investment-plans/components/Calculator";
import { InvestmentPlanDetails } from "@/features/investment-plans/components/InvestmentPlanDetails";
import { EditPlanModal } from "@/features/investment-plans/components/EditPlanModal";
import { ChartAdvancedOptionsModal } from "@/shared/components/chart/ChartAdvancedOptionsModal";
import { useIPCASync } from "@/hooks/useIPCASync"
import { useChartOptions } from "@/hooks/useChartOptions"
import { Profile } from "@/types/financial"
import { InvestmentPlan, MicroInvestmentPlan } from "@/types/financial/investment-plans"
import { DashboardCard } from '@/shared/components/dashboard/dashboard-card'
import { DashboardNavigation } from "@/shared/components/dashboard/DashboardNavigation"
import { DashboardHighlights } from "@/shared/components/dashboard/DashboardHighlights"
import { DashboardMetrics } from "@/shared/components/dashboard/DashboardMetrics";
import { useFinancialRecords as useFinancialRecordsWithLinks } from "@/hooks/useFinancialRecordsManagement";
import { useGoalsAndEvents } from "@/hooks/useFinancialData";
import { useProjectionData } from "@/hooks/useProjectionData";
import { PlanProgressData } from "@/lib/plan-progress-calculator";
import { ChartOptions } from "@/lib/chart-projections";
import { calculateMicroPlanFutureValues } from '@/utils/investmentPlanCalculations';
import { createDateWithoutTimezone } from '@/utils/dateUtils';
import { gradientCard } from '@/lib/gradient-classes';

type TimePeriod = 'all' | '6m' | '12m' | '24m';

interface FinancesProps {
  clientId: string;
  clientProfile: Profile;
  brokerProfile: Profile;
  investmentPlan: InvestmentPlan;
  activeMicroPlan: MicroInvestmentPlan | null;
  microPlans: MicroInvestmentPlan[];
  hasFinancialRecordForActivePlan: boolean;
  onLogout: () => void;
  onShareClient: () => void;
  onRefreshMicroPlans: () => Promise<void>;
}

const Finances = ({
  clientId,
  clientProfile,
  brokerProfile,
  investmentPlan,
  activeMicroPlan,
  microPlans,
  hasFinancialRecordForActivePlan,
  onLogout,
  onShareClient,
  onRefreshMicroPlans
}: FinancesProps) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const [contributionPeriod, setContributionPeriod] = useState<TimePeriod>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showRealValues, setShowRealValues] = useState<boolean>(false);
  const [showNegativeValues, setShowNegativeValues] = useState<boolean>(false);
  const [showOldPortfolio, setShowOldPortfolio] = useState<boolean>(true);
  const [showProjectedLine, setShowProjectedLine] = useState<boolean>(true);
  const [showPlannedLine, setShowPlannedLine] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Hooks para dados financeiros
  const { records: allFinancialRecords, stats, isLoading: isFinancialRecordsLoading } = useFinancialRecordsWithLinks(clientId);

  
  const { goalsAndEvents, isLoading: isGoalsLoading, goalsByStatus, eventsByStatus } = useGoalsAndEvents(clientId);

  // Hook para opções de gráfico
  const chartOptionsHook = useChartOptions({
    investmentPlan,
    activeMicroPlan,
    microPlans,
    clientProfile,
    allFinancialRecords,
    goals: goalsAndEvents.goals,
    events: goalsAndEvents.events
  });

  // Cálculos centralizados usando o micro plano ativo
  const microPlanCalculations = useMemo(() => {
    if (!activeMicroPlan || !investmentPlan || !clientProfile?.birth_date) {
      return null;
    }

    const birthDate = createDateWithoutTimezone(clientProfile.birth_date);
    const calculations = calculateMicroPlanFutureValues(investmentPlan, activeMicroPlan, allFinancialRecords, birthDate);

    return {
      futureValue: calculations.futureValue,
      presentFutureValue: calculations.presentFutureValue,
      inflationAdjustedIncome: calculations.inflationAdjustedIncome,
      requiredMonthlyDeposit: calculations.requiredMonthlyDeposit,
      monthlyDeposit: activeMicroPlan.monthly_deposit,
      desiredIncome: activeMicroPlan.desired_income,
      expectedReturn: activeMicroPlan.expected_return,
      inflation: activeMicroPlan.inflation,
      returnRate: activeMicroPlan.inflation + activeMicroPlan.expected_return
    };
  }, [activeMicroPlan, investmentPlan, clientProfile?.birth_date, allFinancialRecords]);

  // Hook para dados de projeção
  const chartOptions: ChartOptions = {
    showRealValues: showRealValues || false,
    showNegativeValues: showNegativeValues || false,
    showOldPortfolio: showOldPortfolio || false,
    ...chartOptionsHook.chartOptions
  }

  // Hook para dados de projeção - deve ser chamado antes de qualquer return
  const projectionDataHook = useProjectionData(
    investmentPlan,
    activeMicroPlan,
    microPlans,
    clientProfile,
    allFinancialRecords,
    goalsAndEvents.goals,
    goalsAndEvents.events,
    chartOptions
  );

  // Dados de projeção sem opções avançadas: Usado para componentes que não devem varias com as opções do gráfico
  const projectionDataWithoutOptions = projectionDataHook.originalProjectionData

  // Dados de projeção com opções avançadas: Usado para componentes que devem variar com as opções do gráfico
  const projectionDataWithOptions = projectionDataHook.projectionDataWithOptions

  // Sincronização IPCA
  const { syncIPCA, isSyncing } = useIPCASync(clientId, allFinancialRecords, investmentPlan, microPlans);

  // Efeito para sincronizar IPCA
  useEffect(() => {
    if (allFinancialRecords?.length && investmentPlan) {
      syncIPCA();
    }
  }, [allFinancialRecords, investmentPlan, syncIPCA]);

  // Handlers
  const handleProjectionDataChange = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
    queryClient.invalidateQueries({ queryKey: ["goalsAndEvents"] });
  }, [queryClient]);

  const handlePlanUpdated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['investmentPlan', clientId] });
    queryClient.invalidateQueries({ queryKey: ['allFinancialRecords', clientId] });
    queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', clientId] });
  }, [queryClient, clientId]);

  // Loading state
  if (!investmentPlan || !clientProfile || isFinancialRecordsLoading || isGoalsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Navegação */}
      <DashboardNavigation
        clientId={clientId}
        investmentPlanId={investmentPlan.id}
        currency={investmentPlan.currency}
        goalsByStatus={goalsByStatus}
        eventsByStatus={eventsByStatus}
        t={t}
      />

      {/* Highlights */}
      <DashboardHighlights
        clientId={clientId}
        investmentPlan={investmentPlan}
        activeMicroPlan={activeMicroPlan}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Métricas */}
        <DashboardMetrics
          clientId={clientId}
          investmentPlan={investmentPlan}
          activeMicroPlan={activeMicroPlan}
          selectedPeriod={selectedPeriod}
          contributionPeriod={contributionPeriod}
          onSelectedPeriodChange={setSelectedPeriod}
          onContributionPeriodChange={setContributionPeriod}
          t={t}
          retirementBalanceData={projectionDataHook.retirementBalanceData || undefined}
        />

        {/* Gráfico de Projeção */}
        <div className={`transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${gradientCard} p-6`}>
          {/* Gráfico de Projeção com Opções, varia conforme as opções do gráfico */}
          {projectionDataWithOptions ? (
            <ExpenseChart 
              profile={clientProfile}
              investmentPlan={investmentPlan}
              activeMicroPlan={activeMicroPlan}
              microPlans={microPlans}
              clientId={clientId}
              allFinancialRecords={allFinancialRecords}
              projectionData={projectionDataWithOptions}
              onProjectionDataChange={handleProjectionDataChange}
              showRealValues={showRealValues}
              showNegativeValues={showNegativeValues}
              showOldPortfolio={showOldPortfolio}
              showProjectedLine={showProjectedLine}
              showPlannedLine={showPlannedLine}
              onOpenAdvancedOptions={() => setShowAdvancedOptions(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <Spinner size="lg" />
            </div>
          )}
        </div>

        {/* Cards de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projectionDataHook.planProgressData && (
            <Calculator 
              data={projectionDataHook.planProgressData as PlanProgressData} 
              investmentPlan={investmentPlan}
              activeMicroPlan={activeMicroPlan}
              onRefreshMicroPlans={onRefreshMicroPlans}
              clientProfile={clientProfile}
              clientId={clientId}
              onPlanUpdated={handlePlanUpdated}
            />
          )}
          
          {microPlanCalculations?.presentFutureValue > 0 && (
            <SavingsGoal 
              allFinancialRecords={allFinancialRecords}
              investmentPlan={investmentPlan}
              activeMicroPlan={activeMicroPlan}
              microPlanCalculations={microPlanCalculations}
              profile={{
                birth_date: clientProfile?.birth_date
              }}
              planProgressData={projectionDataHook.planProgressData as PlanProgressData}
            />
          )}
          
          <DashboardCard 
            title={
              <span className="text-gray-900 font-medium dark:text-gray-100">
                {t('dashboard.investmentPlan.title')}
              </span>
            }
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-card backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
            icon={Trophy}
          >
            <InvestmentPlanDetails 
              investmentPlan={investmentPlan}
              activeMicroPlan={activeMicroPlan}
              microPlanCalculations={microPlanCalculations}
              microPlans={microPlans}
              hasFinancialRecordForActivePlan={hasFinancialRecordForActivePlan}
              birthDate={clientProfile?.birth_date}
              onPlanUpdated={handlePlanUpdated}
              onEditClick={() => setIsEditModalOpen(true)}
              onRefreshMicroPlans={onRefreshMicroPlans}
              isBroker={brokerProfile !== undefined}
              financialRecords={allFinancialRecords}
              projectionData={projectionDataWithoutOptions}
              chartOptions={chartOptions}
              planProgressData={projectionDataHook.planProgressData as PlanProgressData}
            />
          </DashboardCard>
        </div>

        {/* Visualização Mensal */}
        <section className={`transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${gradientCard}`}>
          {projectionDataWithOptions ? (
            <MonthlyView 
              userId={clientId} 
              allFinancialRecords={allFinancialRecords}
              investmentPlan={investmentPlan}
              activeMicroPlan={activeMicroPlan}
              profile={clientProfile}
              projectionData={projectionDataWithOptions}
              goals={goalsAndEvents.goals}
              events={goalsAndEvents.events}
              microPlans={microPlans}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <Spinner size="lg" />
            </div>
          )}
        </section>
      </main>

      {/* Modais */}
      {isEditModalOpen && investmentPlan && clientProfile?.birth_date && (
        <EditPlanModal
          investmentPlan={investmentPlan}
          activeMicroPlan={activeMicroPlan}
          microPlans={microPlans}
          onRefreshMicroPlans={onRefreshMicroPlans}
          birthDate={clientProfile.birth_date}
          financialRecords={allFinancialRecords}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            handlePlanUpdated();
          }}
        />
      )}
      
      <ChartAdvancedOptionsModal
        open={showAdvancedOptions}
        onOpenChange={setShowAdvancedOptions}
        investmentPlan={investmentPlan}
        activeMicroPlan={activeMicroPlan}
        showRealValues={showRealValues}
        setShowRealValues={setShowRealValues}
        showNegativeValues={showNegativeValues}
        setShowNegativeValues={setShowNegativeValues}
        showOldPortfolio={showOldPortfolio}
        setShowOldPortfolio={setShowOldPortfolio}
        showProjectedLine={showProjectedLine}
        setShowProjectedLine={setShowProjectedLine}
        showPlannedLine={showPlannedLine}
        setShowPlannedLine={setShowPlannedLine}
        changeMonthlyDeposit={chartOptionsHook.changeMonthlyDeposit}
        setChangeMonthlyDeposit={chartOptionsHook.setChangeMonthlyDeposit}
        changeMonthlyWithdraw={chartOptionsHook.changeMonthlyWithdraw}
        setChangeMonthlyWithdraw={chartOptionsHook.setChangeMonthlyWithdraw}
      />
    </>
  );
};

export default Finances; 