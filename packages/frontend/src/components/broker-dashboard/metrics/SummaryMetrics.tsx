// 1. Imports externos
import { useTranslation } from 'react-i18next'
import { Users, Wallet, CheckCircle2, HelpCircle } from 'lucide-react'

// 2. Imports internos (shared)
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar-initial'

// 3. Imports internos (feature)
import { DashboardMetrics } from '@/types/broker-dashboard'

interface SummaryMetricsProps {
  metrics: DashboardMetrics;
}

/**
 * Displays summary metrics cards for the broker dashboard
 * @param metrics - The dashboard metrics data
 */
export function SummaryMetrics({ metrics }: SummaryMetricsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-all duration-200 border-gray-100 dark:border-gray-800 bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <Avatar 
                icon={Users} 
                size="lg" 
                variant="square"
                iconClassName="h-6 w-6"
                color="gray"
              />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('brokerDashboard.metrics.totalClients')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{metrics.totalClients}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('brokerDashboard.metrics.withPlan')}</p>
              </div>
              <p className="text-lg font-semibold text-primary">{metrics.clientsWithPlan}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-200 border-gray-100 dark:border-gray-800 bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <Avatar 
                icon={Wallet} 
                size="lg" 
                variant="square"
                iconClassName="h-6 w-6"
                color="green"
              />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('brokerDashboard.metrics.totalBalance')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalBalance)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('brokerDashboard.metrics.totalPatrimony')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-200 border-gray-100 dark:border-gray-800 bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <Avatar 
                icon={CheckCircle2} 
                size="lg" 
                variant="square"
                iconClassName="h-6 w-6"
                color="blue"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('brokerDashboard.metrics.activeRecords')}</p>
                  <div className="relative inline-block group">
                    <HelpCircle className="h-3 w-3 text-gray-400 hover:text-blue-500 cursor-help" />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] w-64 text-center whitespace-normal">
                      {t('brokerDashboard.metrics.helpers.activeRecords')}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{metrics.clientsWithActiveRecords}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('brokerDashboard.metrics.outdatedRecords')}</p>
                  <div className="relative inline-block group">
                    <HelpCircle className="h-3 w-3 text-gray-400 hover:text-red-500 cursor-help" />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] w-64 text-center whitespace-normal">
                      {t('brokerDashboard.metrics.helpers.outdatedRecords')}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p className={`text-lg font-semibold ${
                metrics.clientsWithOutdatedRecords > 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>{metrics.clientsWithOutdatedRecords}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 