import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { History, TrendingUp, Target, Calendar } from "lucide-react"

interface DashboardNavigationProps {
  clientId: string
  investmentPlanId: string
  currency: string
  counters: {
    goals: number
    events: number
  }
  t: (key: string) => string
}

export function DashboardNavigation({ 
  clientId, 
  investmentPlanId, 
  currency, 
  counters, 
  t 
}: DashboardNavigationProps) {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <Link 
          to={`/financial-records${clientId ? `/${clientId}` : ''}`} 
          state={{ records: [] }} // Será preenchido pelo componente pai
        >
          <Button 
            variant="outline"
            size="lg"
            className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm hover:from-blue-50/95 dark:hover:from-gray-800 hover:via-blue-100/90 dark:hover:via-gray-800 hover:to-blue-200/80 dark:hover:to-slate-700 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 dark:border-gray-800 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {t('dashboard.buttons.financialRecords')}
              </span>
            </div>
          </Button>
        </Link>

        <Link to={`/investment-plan/${investmentPlanId}`}>
          <Button 
            variant="outline"
            size="lg"
            className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm hover:from-blue-50/95 dark:hover:from-gray-800 hover:via-blue-100/90 dark:hover:via-gray-800 hover:to-blue-200/80 dark:hover:to-slate-700 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 dark:border-gray-800 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {t('dashboard.buttons.investmentPlan')}
              </span>
            </div>
          </Button>
        </Link>

        <Link 
          to={`/financial-goals${clientId ? `/${clientId}` : ''}`}
          state={{ currency }}
        >
          <Button 
            variant="outline"
            size="lg"
            className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm hover:from-blue-50/95 dark:hover:from-gray-800 hover:via-blue-100/90 dark:hover:via-gray-800 hover:to-blue-200/80 dark:hover:to-slate-700 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 dark:border-gray-800 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {counters.goals > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
                    {counters.goals}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {t('dashboard.buttons.financialGoals')}
              </span>
            </div>
          </Button>
        </Link>

        <Link 
          to={`/events${clientId ? `/${clientId}` : ''}`}
          state={{ currency }}
        >
          <Button 
            variant="outline"
            size="lg"
            className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm hover:from-blue-50/95 dark:hover:from-gray-800 hover:via-blue-100/90 dark:hover:via-gray-800 hover:to-blue-200/80 dark:hover:to-slate-700 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 dark:border-gray-800 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {counters.events > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
                    {counters.events}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {t('dashboard.buttons.events')}
              </span>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  )
}
