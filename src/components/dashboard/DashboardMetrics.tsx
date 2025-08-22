import { DashboardCard } from "@/components/DashboardCard"
import { Briefcase, LineChart, PiggyBank, Scale, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { formatCurrency, CurrencyCode } from "@/utils/currency"
import { useFinancialMetrics } from "@/hooks/useFinancialData"
import { useProjectionData } from "@/hooks/useProjectionData"
import { FinancialRecord, Profile, InvestmentPlan, Goal, ProjectedEvent } from "@/types/financial"
import { ChartOptions } from "@/lib/chart-projections"

type TimePeriod = 'all' | '6m' | '12m' | '24m'

interface DashboardMetricsProps {
  clientId: string
  investmentPlan: InvestmentPlan
  selectedPeriod: TimePeriod
  contributionPeriod: TimePeriod
  onSelectedPeriodChange: (period: TimePeriod) => void
  onContributionPeriodChange: (period: TimePeriod) => void
  t: (key: string) => string
  allFinancialRecords: FinancialRecord[]
  goalsAndEvents: { goals: Goal[]; events: ProjectedEvent[] }
  clientProfile: Profile
  chartOptions: ChartOptions
}

export function DashboardMetrics({
  clientId,
  investmentPlan,
  selectedPeriod,
  contributionPeriod,
  onSelectedPeriodChange,
  onContributionPeriodChange,
  t,
  allFinancialRecords,
  goalsAndEvents,
  clientProfile,
  chartOptions
}: DashboardMetricsProps) {
  const { totalReturns, totalContribution, processedRecords } = useFinancialMetrics(
    clientId,
    selectedPeriod,
    contributionPeriod,
    investmentPlan
  )

  // Hook para dados de projeção para calcular diferença da carteira antiga
  const projectionDataHook = useProjectionData(
    investmentPlan,
    clientProfile,
    allFinancialRecords,
    goalsAndEvents.goals,
    goalsAndEvents.events,
    chartOptions
  )

  const portfolioValue = processedRecords.latestRecord?.ending_balance || 0
  const portfolioIncreaseRate = processedRecords.latestRecord?.starting_balance 
    ? ((portfolioValue - processedRecords.latestRecord.starting_balance) / processedRecords.latestRecord.starting_balance) * 100 
    : null

  return (
    <div className={`grid gap-6 ${
      investmentPlan?.old_portfolio_profitability 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
        : 'grid-cols-1 md:grid-cols-3'
    }`}>
      {/* Portfolio Value Card */}
      <DashboardCard 
        className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
        title={
          <div className="flex items-center gap-2">
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {t('dashboard.cards.portfolioValue.title')}
            </span>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-help hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('dashboard.cards.portfolioValue.tooltip')}
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        }
        icon={Briefcase}
      >
        <div className="space-y-3">
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 dark:from-blue-400 dark:via-indigo-400 dark:to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
            {formatCurrency(portfolioValue, investmentPlan?.currency as CurrencyCode)}
          </p>
          {portfolioIncreaseRate && (
            <div className={`flex items-center gap-2 ${
              portfolioIncreaseRate >= 0 ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/50 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-emerald-900/10' : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-100/50 dark:from-rose-900/30 dark:via-rose-900/20 dark:to-rose-900/10'
            } rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur-sm border border-white/50 dark:border-gray-800`}>
              <LineChart className={`h-4 w-4 ${
                portfolioIncreaseRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`} />
              <p className={`text-sm font-medium ${
                portfolioIncreaseRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {portfolioIncreaseRate.toFixed(2)}% {t('dashboard.cards.portfolioValue.monthlyReturn')}
              </p>
            </div>
          )}
        </div>
      </DashboardCard>
      
      {/* Contributions Card */}
      <DashboardCard 
        className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
                {t('dashboard.cards.contributions.title')}
              </span>
              <HoverCard>
                <HoverCardTrigger>
                  <Info className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-help hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('dashboard.cards.contributions.tooltip')}
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Select value={contributionPeriod} onValueChange={(value) => onContributionPeriodChange(value as TimePeriod)}>
              <SelectTrigger className="w-[120px] h-8 text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 bg-white/90 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 dark:hover:border-gray-600 transition-colors ml-auto">
                <SelectValue placeholder={t('common.selectPeriod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allTime')}</SelectItem>
                <SelectItem value="6m">{t('common.last6Months')}</SelectItem>
                <SelectItem value="12m">{t('common.last12Months')}</SelectItem>
                <SelectItem value="24m">{t('common.last24Months')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        icon={PiggyBank}
      >
        <div className="space-y-3">
          <p className={`text-2xl font-bold drop-shadow-sm ${
            investmentPlan?.required_monthly_deposit && 
            totalContribution >= investmentPlan.required_monthly_deposit 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(totalContribution, investmentPlan?.currency as CurrencyCode)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium break-words">
            {t('dashboard.cards.contributions.total')}
          </p>
        </div>
      </DashboardCard>
      
      {/* Total Returns Card */}
      <DashboardCard 
        className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
                {t('dashboard.cards.totalReturns.title')}
              </span>
              <HoverCard>
                <HoverCardTrigger>
                  <Info className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-help hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('dashboard.cards.totalReturns.tooltip')}
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Select value={selectedPeriod} onValueChange={(value) => onSelectedPeriodChange(value as TimePeriod)}>
              <SelectTrigger className="w-[120px] h-8 text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 bg-white/90 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 dark:hover:border-gray-600 transition-colors ml-auto">
                <SelectValue placeholder={t('common.selectPeriod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allTime')}</SelectItem>
                <SelectItem value="6m">{t('common.last6Months')}</SelectItem>
                <SelectItem value="12m">{t('common.last12Months')}</SelectItem>
                <SelectItem value="24m">{t('common.last24Months')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        icon={LineChart}
      >
        <div className="space-y-2">
          <p className={`text-2xl font-bold drop-shadow-sm ${
            totalReturns.totalAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(totalReturns.totalAmount, investmentPlan?.currency as CurrencyCode)}
          </p>
          
          <div className={`flex items-center gap-2 ${
            Number(totalReturns.percentageReturn) >= 0 ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/50 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-emerald-900/10' : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-100/50 dark:from-rose-900/30 dark:via-rose-900/20 dark:to-rose-900/10'
          } rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur-sm border border-white/50 dark:border-gray-800`}>
            <LineChart className={`h-4 w-4 ${
              Number(totalReturns.percentageReturn) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`} />
            <p className={`text-sm flex items-center gap-1 ${
              Number(totalReturns.percentageReturn) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {totalReturns.percentageReturn}%
            </p>
          </div>
        </div>
      </DashboardCard>
      
      {/* Retirement Balance Card - 4º card da carteira antiga */}
      {investmentPlan?.old_portfolio_profitability !== null && investmentPlan?.old_portfolio_profitability !== undefined && (
        <DashboardCard 
          className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
          title={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {t('dashboard.cards.retirementBalance.title')}
                </span>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-help hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('dashboard.cards.retirementBalance.tooltip')}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          }
          icon={Scale}
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <p className={`text-2xl font-bold drop-shadow-sm ${
                projectionDataHook.retirementBalanceData.nominalDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(projectionDataHook.retirementBalanceData.nominalDifference, investmentPlan?.currency as CurrencyCode)}
              </p>
            </div>
            
            <div className={`flex items-center gap-2 ${
              projectionDataHook.retirementBalanceData.percentageDifference >= 0 ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/50 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-emerald-900/10' : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-100/50 dark:from-rose-900/30 dark:via-rose-900/20 dark:to-rose-900/10'
            } rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur-sm border border-white/50 dark:border-gray-800`}>
              <LineChart className={`h-4 w-4 ${
                projectionDataHook.retirementBalanceData.percentageDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`} />
              <p className={`text-sm font-medium ${
                projectionDataHook.retirementBalanceData.percentageDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {projectionDataHook.retirementBalanceData.percentageDifference >= 0 ? '+' : ''}{projectionDataHook.retirementBalanceData.percentageDifference.toFixed(2)}%
              </p>
            </div>
          </div>
        </DashboardCard>
      )}
    </div>
  )
}
