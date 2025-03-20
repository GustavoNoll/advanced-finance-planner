import { Card, CardContent } from '@/components/ui/card';
import { Users, Wallet, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DashboardMetrics } from '@/types/broker-dashboard';

interface SummaryMetricsProps {
  metrics: DashboardMetrics;
}

/**
 * Displays summary metrics cards for the broker dashboard
 * @param metrics - The dashboard metrics data
 */
export const SummaryMetrics = ({ metrics }: SummaryMetricsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.totalClients')}</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalClients}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm text-gray-600">{t('brokerDashboard.metrics.withPlan')}</p>
              </div>
              <p className="text-lg font-semibold text-primary">{metrics.clientsWithPlan}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.totalBalance')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalBalance)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-sm text-gray-600">Patrimônio Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.activeRecords')}</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.clientsWithActiveRecords}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <p className="text-sm text-gray-600">{t('brokerDashboard.metrics.outdatedRecords')}</p>
              </div>
              <p className="text-lg font-semibold text-red-600">{metrics.clientsWithOutdatedRecords}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 