import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DashboardMetrics } from '@/types/broker-dashboard';

interface TrendMetricsProps {
  metrics: DashboardMetrics;
}

/**
 * Displays trend metrics including new clients, growth, and inactive clients
 * @param metrics - The dashboard metrics data
 */
export const TrendMetrics = ({ metrics }: TrendMetricsProps) => {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center ring-2 ring-blue-100">
            <LineChart className="h-5 w-5 text-blue-600" />
          </div>
          {t('brokerDashboard.metrics.trends.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.trends.newClientsThisMonth')}</p>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{metrics.trends.newClientsThisMonth}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.trends.totalGrowthThisMonth')}</p>
                <p className="text-2xl font-bold text-blue-600 tracking-tight">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.trends.totalGrowthThisMonth)}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.trends.averageMonthlyGrowth')}</p>
                <p className="text-2xl font-bold text-green-600 tracking-tight">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.trends.averageMonthlyGrowth)}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.trends.inactiveClients')}</p>
                <p className="text-2xl font-bold text-red-600 tracking-tight">{metrics.trends.inactiveClients}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 