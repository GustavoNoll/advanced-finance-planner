// 1. Imports externos
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Activity, Target, Zap, Shield, HelpCircle } from 'lucide-react'

// 2. Imports internos (shared)
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

// 3. Imports internos (feature)
import { EnhancedDashboardMetrics } from '@/types/broker-dashboard'

interface PerformanceMetricsProps {
  metrics: EnhancedDashboardMetrics;
}

/**
 * Advanced performance metrics component with futuristic design
 */
export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const { t } = useTranslation();

  const formatPercentage = (value: number) => 
    `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);

  const getPerformanceColor = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value > 0 ? 'text-green-500' : 'text-red-500';
    }
    return value < 0.5 ? 'text-red-500' : value < 1 ? 'text-yellow-500' : 'text-green-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Average Return */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('brokerDashboard.metrics.averageReturn')}
              <div className="relative inline-block group">
                <HelpCircle className="h-3 w-3 text-blue-500 hover:text-blue-600 cursor-help" />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] w-64 text-center whitespace-normal">
                  {t('brokerDashboard.metrics.helpers.averageReturn')}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <p className={`text-3xl font-bold ${getPerformanceColor(metrics.averageReturn)}`}>
              {formatPercentage(metrics.averageReturn)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {t('brokerDashboard.metrics.monthlyAverage')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total Growth */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t('brokerDashboard.metrics.totalGrowth')}
              <div className="relative inline-block group">
                <HelpCircle className="h-3 w-3 text-green-500 hover:text-green-600 cursor-help" />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] w-64 text-center whitespace-normal">
                  {t('brokerDashboard.metrics.helpers.totalGrowth')}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(metrics.totalGrowth)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {t('brokerDashboard.metrics.portfolioGrowth')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Average Volatility */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t('brokerDashboard.metrics.averageVolatility')}
              <div className="relative inline-block group">
                <HelpCircle className="h-3 w-3 text-orange-500 hover:text-orange-600 cursor-help" />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] w-64 text-center whitespace-normal">
                  {t('brokerDashboard.metrics.helpers.averageVolatility')}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <p className={`text-3xl font-bold ${getPerformanceColor(metrics.averageVolatility, false)}`}>
              {formatPercentage(metrics.averageVolatility)}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {t('brokerDashboard.metrics.riskLevel')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sharpe Ratio */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t('brokerDashboard.metrics.sharpeRatio')}
              <div className="relative inline-block group">
                <HelpCircle className="h-3 w-3 text-purple-500 hover:text-purple-600 cursor-help" />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] w-64 text-center whitespace-normal">
                  {t('brokerDashboard.metrics.helpers.sharpeRatio')}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <p className={`text-3xl font-bold ${getPerformanceColor(metrics.averageSharpeRatio, false)}`}>
              {metrics.averageSharpeRatio.toFixed(2)}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {t('brokerDashboard.metrics.riskAdjustedReturn')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Score */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-950/20 dark:to-teal-950/20 border-cyan-200 dark:border-cyan-800 hover:shadow-xl transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t('brokerDashboard.metrics.engagementScore')}
              <div className="relative inline-block group">
                <HelpCircle className="h-3 w-3 text-cyan-500 hover:text-cyan-600 cursor-help" />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] w-64 text-center whitespace-normal">
                  {t('brokerDashboard.metrics.helpers.engagementScore')}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <p className={`text-3xl font-bold ${getPerformanceColor(metrics.averageEngagementScore / 100, false)}`}>
              {Math.round(metrics.averageEngagementScore)}/100
            </p>
            <p className="text-xs text-cyan-600 dark:text-cyan-400">
              {t('brokerDashboard.metrics.clientEngagement')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Activity Distribution */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t('brokerDashboard.metrics.activityDistribution')}
              <div className="relative inline-block group">
                <HelpCircle className="h-3 w-3 text-purple-500 hover:text-purple-600 cursor-help" />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] w-64 text-center whitespace-normal">
                  {t('brokerDashboard.metrics.helpers.activityDistribution')}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-600 dark:text-purple-400">Ativos</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                {metrics.activityDistribution.active}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-600 dark:text-purple-400">Desatualizados</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                {metrics.activityDistribution.stale}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-600 dark:text-purple-400">Em Risco</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                {metrics.activityDistribution.atRisk}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-600 dark:text-purple-400">Inativos</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                {metrics.activityDistribution.inactive}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-600 dark:text-purple-400">Sem Registros</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                {metrics.activityDistribution.noRecords}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
