import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';
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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-primary" />
          {t('brokerDashboard.metrics.trends.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t('brokerDashboard.metrics.trends.newClientsThisMonth')}</p>
            <p className="text-2xl font-bold">{metrics.trends.newClientsThisMonth}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t('brokerDashboard.metrics.trends.totalGrowthThisMonth')}</p>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.trends.totalGrowthThisMonth)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t('brokerDashboard.metrics.trends.averageMonthlyGrowth')}</p>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.trends.averageMonthlyGrowth)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t('brokerDashboard.metrics.trends.inactiveClients')}</p>
            <p className="text-2xl font-bold text-red-600">{metrics.trends.inactiveClients}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 