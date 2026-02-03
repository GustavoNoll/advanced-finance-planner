// 1. Imports externos
import { Link } from 'react-router-dom'
import { History, TrendingUp, Target, Calendar } from 'lucide-react'

// 2. Imports internos (shared)
import { Button } from '@/shared/components/ui/button'

// 3. Imports internos (feature)
import { Goal, ProjectedEvent } from '@/types/financial'

interface DashboardNavigationProps {
  clientId: string
  investmentPlanId: string
  currency: string
  goalsByStatus: {
    pending: Goal[]
    completed: Goal[]
  }
  eventsByStatus: {
    pending: ProjectedEvent[]
    completed: ProjectedEvent[]
  }
  t: (key: string) => string
}

export function DashboardNavigation({ 
  clientId, 
  investmentPlanId, 
  currency, 
  goalsByStatus,
  eventsByStatus,
  t 
}: DashboardNavigationProps) {
  // Calcula totais para goals e events
  const goalsTotal = goalsByStatus.pending.length + goalsByStatus.completed.length
  const eventsTotal = eventsByStatus.pending.length + eventsByStatus.completed.length

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
              <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {t('dashboard.buttons.financialGoals')}
              </span>
              {goalsTotal > 0 && (
                <div className={`text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-sm ${
                  goalsByStatus.completed.length === goalsTotal 
                    ? 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-700' 
                    : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700'
                }`}>
                  <span className="text-[10px] font-medium">
                    {goalsByStatus.completed.length}/{goalsTotal}
                  </span>
                </div>
              )}
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
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {t('dashboard.buttons.events')}
              </span>
              {eventsTotal > 0 && (
                <div className={`text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-sm ${
                  eventsByStatus.completed.length === eventsTotal 
                    ? 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-700' 
                    : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700'
                }`}>
                  <span className="text-[10px] font-medium">
                    {eventsByStatus.completed.length}/{eventsTotal}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </Link>
      </div>
    </div>
  )
}
