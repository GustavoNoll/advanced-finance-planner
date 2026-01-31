import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DashboardMetrics } from '@/types/broker-dashboard';
import { Metric, Text } from '@tremor/react';
import { AvailableChartColorsKeys, getColorClassName } from '@/lib/chartColors';
import { Avatar } from '@/components/ui/avatar-initial';
interface TrendMetricsProps {
  metrics: DashboardMetrics;
}

/**
 * Displays trend metrics including new clients, growth, and inactive clients using Tremor
 * @param metrics - The dashboard metrics data
 */
export const TrendMetrics = ({ metrics }: TrendMetricsProps) => {
  const { t } = useTranslation();

  // Mock data for the area chart - in a real app, this would come from your API
  const newClientsLabel = t('brokerDashboard.metrics.trends.chartLabels.newClients');
  const totalGrowthLabel = t('brokerDashboard.metrics.trends.chartLabels.totalGrowth');
  const averageGrowthLabel = t('brokerDashboard.metrics.trends.chartLabels.averageGrowth');
  const inactiveClientsLabel = t('brokerDashboard.metrics.trends.chartLabels.inactiveClients');

  const trendData = [
    {
      date: 'Jan',
      [newClientsLabel]: metrics.trends.newClientsThisMonth,
      [totalGrowthLabel]: metrics.trends.totalGrowthThisMonth,
      [averageGrowthLabel]: metrics.trends.averageMonthlyGrowth,
      [inactiveClientsLabel]: metrics.trends.inactiveClients
    }
  ];

  const trendCategories = [newClientsLabel, totalGrowthLabel, averageGrowthLabel, inactiveClientsLabel];
  const trendColors: AvailableChartColorsKeys[] = ['emerald', 'blue', 'lime', 'orange'];

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-100 dark:border-gray-800 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Avatar 
            icon={LineChart} 
            size="md" 
            variant="square"
            iconClassName="h-5 w-5"
            color="blue"
          />
          {t('brokerDashboard.metrics.trends.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg ${getColorClassName('emerald', 'bg')} bg-opacity-10 flex items-center justify-center`}>
                <Users className={`h-4 w-4 ${getColorClassName('emerald', 'text')}`} />
              </div>
              <div>
                <Text className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.trends.newClientsThisMonth')}</Text>
                <Metric className="text-2xl font-bold text-gray-900 tracking-tight">{metrics.trends.newClientsThisMonth}</Metric>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg ${getColorClassName('blue', 'bg')} bg-opacity-10 flex items-center justify-center`}>
                <TrendingUp className={`h-4 w-4 ${getColorClassName('blue', 'text')}`} />
              </div>
              <div>
                <Text className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.trends.totalGrowthThisMonth')}</Text>
                <Metric className={`text-2xl font-bold ${getColorClassName('blue', 'text')} tracking-tight`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.trends.totalGrowthThisMonth)}
                </Metric>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg ${getColorClassName('lime', 'bg')} bg-opacity-10 flex items-center justify-center`}>
                <TrendingUp className={`h-4 w-4 ${getColorClassName('lime', 'text')}`} />
              </div>
              <div>
                <Text className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.trends.averageMonthlyGrowth')}</Text>
                <Metric className={`text-2xl font-bold ${getColorClassName('lime', 'text')} tracking-tight`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.trends.averageMonthlyGrowth)}
                </Metric>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg ${getColorClassName('orange', 'bg')} bg-opacity-10 flex items-center justify-center`}>
                <AlertCircle className={`h-4 w-4 ${getColorClassName('orange', 'text')}`} />
              </div>
              <div>
                <Text className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.trends.inactiveClients')}</Text>
                <Metric className={`text-2xl font-bold ${getColorClassName('orange', 'text')} tracking-tight`}>{metrics.trends.inactiveClients}</Metric>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 