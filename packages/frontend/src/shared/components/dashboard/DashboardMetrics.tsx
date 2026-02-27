// 1. Imports externos
import { useState } from 'react'
import { Briefcase, ChevronsUpDown, LineChart, PiggyBank, Scale, Info } from 'lucide-react'

// 2. Imports internos (shared)
import { DashboardCard } from '@/shared/components/dashboard/dashboard-card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/components/ui/hover-card'
import { formatCurrency, CurrencyCode } from '@/utils/currency'
import { useFinancialMetrics } from '@/hooks/useFinancialData'
import { TimePeriod } from '@/features/financial-records/services/financial-records.service'

// 3. Imports internos (feature)
import { InvestmentPlan, MicroInvestmentPlan } from '@/types/financial'
import { ProjectionData } from '@/features/investment-plans/services/projection.service'

interface DashboardMetricsProps {
  clientId: string
  investmentPlan: InvestmentPlan
  activeMicroPlan: MicroInvestmentPlan | null
  selectedPeriod: TimePeriod
  contributionPeriod: TimePeriod
  onSelectedPeriodChange: (period: TimePeriod) => void
  onContributionPeriodChange: (period: TimePeriod) => void
  t: (key: string, params?: Record<string, string | number>) => string
  retirementBalanceData?: {
    nominalDifference: number
    percentageDifference: number
    currentBalance: number
    oldPortfolioBalance: number
  }
}

function getPeriodLabel(period: TimePeriod, t: (key: string, params?: Record<string, string | number>) => string): string {
  if (period === 'all') return t('common.allTime')
  if (period === '6m') return t('common.last6Months')
  if (period === '12m') return t('common.last12Months')
  if (period === '24m') return t('common.last24Months')
  if (/^\d{4}$/.test(String(period))) return t('common.fullYear', { year: period })
  return t('common.selectPeriod')
}

function PeriodSelect({
  value,
  onValueChange,
  availableYears,
  t
}: {
  value: TimePeriod
  onValueChange: (v: TimePeriod) => void
  availableYears: number[]
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="min-w-[140px] h-9 flex items-center justify-between gap-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 bg-white/90 dark:bg-gray-900/80 hover:bg-gray-50 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
        >
          <span className="truncate">{getPeriodLabel(value, t)}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="end">
        <Command>
          <CommandInput placeholder={t('common.searchYearOrPeriod')} />
          <CommandList>
            <CommandEmpty>{t('common.noYearFound')}</CommandEmpty>
            <CommandGroup>
              <CommandItem value="all" onSelect={() => { onValueChange('all'); setOpen(false) }}>
                {t('common.allTime')}
              </CommandItem>
              <CommandItem value="6m" onSelect={() => { onValueChange('6m'); setOpen(false) }}>
                {t('common.last6Months')}
              </CommandItem>
              <CommandItem value="12m" onSelect={() => { onValueChange('12m'); setOpen(false) }}>
                {t('common.last12Months')}
              </CommandItem>
              <CommandItem value="24m" onSelect={() => { onValueChange('24m'); setOpen(false) }}>
                {t('common.last24Months')}
              </CommandItem>
            </CommandGroup>
            {availableYears.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={t('common.fullYearLabel')}>
                  {availableYears.map((year) => (
                    <CommandItem
                      key={year}
                      value={String(year)}
                      onSelect={() => { onValueChange(String(year)); setOpen(false) }}
                    >
                      {t('common.fullYear', { year })}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function DashboardMetrics({
  clientId,
  investmentPlan,
  activeMicroPlan,
  selectedPeriod,
  contributionPeriod,
  onSelectedPeriodChange,
  onContributionPeriodChange,
  t,
  retirementBalanceData
}: DashboardMetricsProps) {
  const { totalReturns, totalContribution, processedRecords, availableYears } = useFinancialMetrics(
    clientId,
    selectedPeriod,
    contributionPeriod,
    investmentPlan
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
          {portfolioIncreaseRate !== null && (
            <div className={`flex items-center gap-2 ${
              portfolioIncreaseRate >= 0 ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/50 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-emerald-900/10' : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-100/50 dark:from-rose-900/30 dark:via-rose-900/20 dark:to-rose-900/10'
            } rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur-sm border border-white/50 dark:border-gray-800`}>
              <LineChart className={`h-4 w-4 ${
                portfolioIncreaseRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`} />
              <p className={`text-sm font-medium ${
                portfolioIncreaseRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {portfolioIncreaseRate >= 0 ? '+' : ''}{portfolioIncreaseRate.toFixed(2)}% {t('dashboard.cards.portfolioValue.monthlyReturn')}
              </p>
            </div>
          )}
        </div>
      </DashboardCard>
      
      {/* Contributions Card */}
      <DashboardCard 
        className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
        title={
          <div className="flex items-center gap-2 min-w-0">
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
        }
        headerActions={<PeriodSelect value={contributionPeriod} onValueChange={onContributionPeriodChange} availableYears={availableYears} t={t} />}
        icon={PiggyBank}
      >
        <div className="space-y-3">
          <p className={`text-2xl font-bold drop-shadow-sm ${
            activeMicroPlan?.monthly_deposit && 
            totalContribution >= activeMicroPlan.monthly_deposit 
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
          <div className="flex items-center gap-2 min-w-0">
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
        }
        headerActions={<PeriodSelect value={selectedPeriod} onValueChange={onSelectedPeriodChange} availableYears={availableYears} t={t} />}
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
                retirementBalanceData.nominalDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(retirementBalanceData.nominalDifference, investmentPlan?.currency as CurrencyCode)}
              </p>
            </div>
            
            <div className={`flex items-center gap-2 ${
              retirementBalanceData.percentageDifference >= 0 ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/50 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-emerald-900/10' : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-100/50 dark:from-rose-900/30 dark:via-rose-900/20 dark:to-rose-900/10'
            } rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur-sm border border-white/50 dark:border-gray-800`}>
              <LineChart className={`h-4 w-4 ${
                retirementBalanceData.percentageDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`} />
              <p className={`text-sm font-medium ${
                retirementBalanceData.percentageDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {retirementBalanceData.percentageDifference >= 0 ? '+' : ''}{retirementBalanceData.percentageDifference.toFixed(2)}%
              </p>
            </div>
          </div>
        </DashboardCard>
      )}
    </div>
  )
}
