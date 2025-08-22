import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { MonthlyView } from "@/components/MonthlyView";
import { Trophy } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { Calculator } from "@/components/Calculator";
import { InvestmentPlanDetails } from "@/components/InvestmentPlanDetails";
import { EditPlanModal } from "@/components/EditPlanModal";
import { ChartAdvancedOptionsModal } from "@/components/chart/ChartAdvancedOptionsModal";
import { useIPCASync } from "@/hooks/useIPCASync";
import { useChartOptions } from "@/hooks/useChartOptions";
import { Profile, InvestmentPlan } from "@/types/financial";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardHighlights } from "@/components/dashboard/DashboardHighlights";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { useFinancialRecords, useGoalsAndEvents } from "@/hooks/useFinancialData";
import { useProjectionData } from "@/hooks/useProjectionData";
import { PlanProgressData } from "@/lib/plan-progress";
import { ChartOptions } from "@/lib/chart-projections";

type TimePeriod = 'all' | '6m' | '12m' | '24m';

interface FinancesProps {
  clientId: string;
  clientProfile: Profile;
  brokerProfile: Profile;
  investmentPlan: InvestmentPlan;
  onLogout: () => void;
  onShareClient: () => void;
}

const Finances = ({
  clientId,
  clientProfile,
  brokerProfile,
  investmentPlan,
  onLogout,
  onShareClient
}: FinancesProps) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const [contributionPeriod, setContributionPeriod] = useState<TimePeriod>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showRealValues, setShowRealValues] = useState<boolean>(false);
  const [showNegativeValues, setShowNegativeValues] = useState<boolean>(false);
  const [showOldPortfolio, setShowOldPortfolio] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Hooks para dados financeiros
  const { allFinancialRecords, processedRecords, isLoading: isFinancialRecordsLoading } = useFinancialRecords(clientId);
  const { goalsAndEvents, counters, isLoading: isGoalsLoading } = useGoalsAndEvents(clientId);

  // Hook para opções de gráfico
  const chartOptionsHook = useChartOptions({
    investmentPlan,
    clientProfile,
    allFinancialRecords,
    goals: goalsAndEvents.goals,
    events: goalsAndEvents.events
  });

  // Hook para dados de projeção
  const chartOptions: ChartOptions = {
    showRealValues: showRealValues || false,
    showNegativeValues: showNegativeValues || false,
    showOldPortfolio: showOldPortfolio || false,
    ...chartOptionsHook.chartOptions
  }

  const projectionDataHook = useProjectionData(
    investmentPlan,
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
  const { syncIPCA, isSyncing } = useIPCASync(clientId, allFinancialRecords, investmentPlan);

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
  if (!investmentPlan || !clientProfile || !allFinancialRecords || isGoalsLoading) {
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
        counters={counters}
        t={t}
      />

      {/* Highlights */}
      <DashboardHighlights
        clientId={clientId}
        investmentPlan={investmentPlan}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Métricas */}
        <DashboardMetrics
          clientId={clientId}
          investmentPlan={investmentPlan}
          selectedPeriod={selectedPeriod}
          contributionPeriod={contributionPeriod}
          onSelectedPeriodChange={setSelectedPeriod}
          onContributionPeriodChange={setContributionPeriod}
          t={t}
          retirementBalanceData={projectionDataHook.retirementBalanceData || undefined}
        />

        {/* Gráfico de Projeção */}
        <div className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
          {/* Gráfico de Projeção com Opções, varia conforme as opções do gráfico */}
          {projectionDataWithOptions ? (
            <ExpenseChart 
              profile={clientProfile}
              investmentPlan={investmentPlan}
              clientId={clientId}
              allFinancialRecords={allFinancialRecords}
              projectionData={projectionDataWithOptions}
              onProjectionDataChange={handleProjectionDataChange}
              showRealValues={showRealValues}
              showNegativeValues={showNegativeValues}
              showOldPortfolio={showOldPortfolio}
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
            />
          )}
          
          {investmentPlan?.present_future_value > 0 && (
            <SavingsGoal 
              allFinancialRecords={allFinancialRecords}
              investmentPlan={investmentPlan}
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
              birthDate={clientProfile?.birth_date}
              onPlanUpdated={handlePlanUpdated}
              onEditClick={() => setIsEditModalOpen(true)}
              isBroker={brokerProfile !== undefined}
              financialRecords={allFinancialRecords}
              projectionData={projectionDataWithoutOptions}
              chartOptions={chartOptions}
            />
          </DashboardCard>
        </div>

        {/* Visualização Mensal */}
        <section className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
          {projectionDataWithOptions ? (
            <MonthlyView 
              userId={clientId} 
              initialRecords={processedRecords.financialRecords} 
              allFinancialRecords={allFinancialRecords}
              investmentPlan={investmentPlan}
              profile={clientProfile}
              projectionData={projectionDataWithOptions}
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
        showRealValues={showRealValues}
        setShowRealValues={setShowRealValues}
        showNegativeValues={showNegativeValues}
        setShowNegativeValues={setShowNegativeValues}
        showOldPortfolio={showOldPortfolio}
        setShowOldPortfolio={setShowOldPortfolio}
        changeMonthlyDeposit={chartOptionsHook.changeMonthlyDeposit}
        setChangeMonthlyDeposit={chartOptionsHook.setChangeMonthlyDeposit}
        changeMonthlyWithdraw={chartOptionsHook.changeMonthlyWithdraw}
        setChangeMonthlyWithdraw={chartOptionsHook.setChangeMonthlyWithdraw}
      />
    </>
  );
};

export default Finances; 