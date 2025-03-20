import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DashboardMetrics } from '@/types/broker-dashboard';

interface PlanningMetricsProps {
  metrics: DashboardMetrics;
}

/**
 * Displays planning metrics including average age, retirement age, and plan types
 * @param metrics - The dashboard metrics data
 */
export const PlanningMetrics = ({ metrics }: PlanningMetricsProps) => {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {t('brokerDashboard.metrics.planning.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8 h-[300px]">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">{t('brokerDashboard.metrics.planning.averageAge')}</p>
              <p className="text-3xl font-bold">{metrics.planning.averageAge.toFixed(1)} anos</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">{t('brokerDashboard.metrics.planning.averageDesiredIncome')}</p>
              <p className="text-3xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.planning.averageDesiredIncome)}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">{t('brokerDashboard.metrics.planning.averageRetirementAge')}</p>
              <p className="text-3xl font-bold">{metrics.planning.averageRetirementAge.toFixed(1)} anos</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">{t('brokerDashboard.metrics.planning.planTypes.title')}</p>
              <div className="flex flex-col gap-3">
                <span className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg">
                  {t('brokerDashboard.metrics.planning.planTypes.endAt120')}: {metrics.planning.planTypes.type1}
                </span>
                <span className="px-3 py-2 text-sm bg-green-100 text-green-800 rounded-lg">
                  {t('brokerDashboard.metrics.planning.planTypes.leave1M')}: {metrics.planning.planTypes.type2}
                </span>
                <span className="px-3 py-2 text-sm bg-purple-100 text-purple-800 rounded-lg">
                  {t('brokerDashboard.metrics.planning.planTypes.keepPrincipal')}: {metrics.planning.planTypes.type3}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 