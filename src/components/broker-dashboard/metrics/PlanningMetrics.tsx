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
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center ring-2 ring-purple-100">
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          {t('brokerDashboard.metrics.planning.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8 h-[300px]">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.planning.averageAge')}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{metrics.planning.averageAge.toFixed(1)}</p>
                <span className="text-sm text-gray-500">anos</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.planning.averageDesiredIncome')}</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.planning.averageDesiredIncome)}
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.planning.averageRetirementAge')}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{metrics.planning.averageRetirementAge.toFixed(1)}</p>
                <span className="text-sm text-gray-500">anos</span>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.planning.planTypes.title')}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <p className="text-sm text-gray-600">{t('brokerDashboard.metrics.planning.planTypes.endAt120')}</p>
                  </div>
                  <p className="text-lg font-semibold text-purple-600">{metrics.planning.planTypes.type1}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-gray-600">{t('brokerDashboard.metrics.planning.planTypes.leave1M')}</p>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">{metrics.planning.planTypes.type2}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm text-gray-600">{t('brokerDashboard.metrics.planning.planTypes.keepPrincipal')}</p>
                  </div>
                  <p className="text-lg font-semibold text-green-600">{metrics.planning.planTypes.type3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 