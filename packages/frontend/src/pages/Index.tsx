import { Spinner } from "@/shared/components/ui/spinner"
import Finances from '@/features/financial-records/pages/Finances'
import InvestmentPolicy from '@/features/investment-policy/pages/InvestmentPolicy'
import PortfolioPerformance from '@/features/portfolio-performance/pages/PortfolioPerformance'
import { useDashboard } from '@/shared/hooks/useDashboard'
import { DashboardHeader } from '@/shared/components/dashboard/DashboardHeader'

const Index = () => {
  const {
    clientId,
    clientProfile,
    brokerProfile,
    investmentPlan,
    microPlans,
    activeMicroPlan,
    hasFinancialRecordForActivePlan,
    activeView,
    setActiveView,
    isLoading,
    handleLogout,
    handleShareClient,
    refreshMicroPlans,
  } = useDashboard()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <DashboardHeader
        clientProfile={clientProfile}
        brokerProfile={brokerProfile}
        clientId={clientId}
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        onShareClient={handleShareClient}
      />

      <div className="pt-24">
        {activeView === 'finances' && (
          <Finances
            clientId={clientId}
            clientProfile={clientProfile}
            brokerProfile={brokerProfile}
            investmentPlan={investmentPlan}
            activeMicroPlan={activeMicroPlan}
            microPlans={microPlans}
            hasFinancialRecordForActivePlan={hasFinancialRecordForActivePlan}
            onLogout={handleLogout}
            onShareClient={handleShareClient}
            onRefreshMicroPlans={refreshMicroPlans}
          />
        )}

        {activeView === 'policies' && (
          <InvestmentPolicy
            clientId={clientId}
            clientProfile={clientProfile}
            brokerProfile={brokerProfile}
            investmentPlan={investmentPlan}
          />
        )}

        {activeView === 'portfolio-performance' && (
          <PortfolioPerformance
            clientId={clientId}
            profile={clientProfile}
            broker={brokerProfile}
            investmentPlan={investmentPlan}
            activeMicroPlan={activeMicroPlan || null}
            onLogout={handleLogout}
            onShareClient={handleShareClient}
          />
        )}
      </div>
    </div>
  )
}

export default Index
