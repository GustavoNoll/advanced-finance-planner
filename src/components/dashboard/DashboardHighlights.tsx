import { Target, Trophy, Calendar, TrendingUp, LineChart, PiggyBank } from 'lucide-react'
import { useFinancialHighlights } from '@/hooks/useFinancialData'
import { InvestmentPlan, MicroInvestmentPlan } from '@/types/financial'
import { useTranslation } from 'react-i18next'

interface DashboardHighlightsProps {
  clientId: string
  investmentPlan: InvestmentPlan
  activeMicroPlan: MicroInvestmentPlan | null
}

const iconMap = {
  Target,
  Trophy,
  Calendar,
  TrendingUp,
  LineChart,
  PiggyBank
}

export function DashboardHighlights({ clientId, investmentPlan, activeMicroPlan }: DashboardHighlightsProps) {
  const { t } = useTranslation()
  const highlights = useFinancialHighlights(clientId, investmentPlan, activeMicroPlan, t)

  function getHighlightBgClasses(i: number): string {
    if (i === 0) return 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/70 dark:from-emerald-900/60 dark:via-emerald-800/40 dark:to-emerald-700/40 border border-emerald-100/60 dark:border-emerald-700/60'
    if (i === 1) return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100/70 dark:from-blue-900/60 dark:via-indigo-800/40 dark:to-blue-700/40 border border-blue-100/60 dark:border-blue-700/60'
    return 'bg-gradient-to-br from-rose-50 via-red-50 to-rose-100/70 dark:from-rose-900/60 dark:via-rose-800/40 dark:to-rose-700/40 border border-rose-100/60 dark:border-rose-700/60'
  }

  if (!highlights.length) {
    return null
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {highlights.map((highlight, index) => {
          const IconComponent = iconMap[highlight.icon as keyof typeof iconMap] || Target
          
          return (
            <div 
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${getHighlightBgClasses(index)}`}
            >
              <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/80">
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-100 truncate">
                  {highlight.message}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
