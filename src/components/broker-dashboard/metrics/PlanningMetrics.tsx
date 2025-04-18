import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DashboardMetrics } from '@/types/broker-dashboard';
import { DonutChart, Metric, Text, CustomTooltipProps } from '@tremor/react';
import { AvailableChartColorsKeys } from '@/lib/chartColors';
import { t } from 'i18next';
import { Avatar } from '@/components/ui/avatar-initial';
interface PlanningMetricsProps {
  metrics: DashboardMetrics;
}

// Custom Tooltip Component
const customTooltip = (props: CustomTooltipProps) => {
  const { payload, active, label } = props;
  if (!active || !payload) return null;

  const categoryPayload = payload?.[0];
  if (!categoryPayload) return null;

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        <p className="text-sm text-gray-600">
          {t('brokerDashboard.metrics.actions.clients')}: {' '} 
          <span className="font-semibold">{categoryPayload.value}</span>
        </p>
      </div>
    </div>
  );
};

/**
 * Helper function to handle NaN values
 * @param value - The value to check
 * @returns The value if it's a number, 0 if it's NaN
 */
const handleNaN = (value: number): number => {
  return isNaN(value) ? 0 : value;
};

/**
 * Displays planning metrics including average age, retirement age, and plan types using Tremor
 * @param metrics - The dashboard metrics data
 */
export const PlanningMetrics = ({ metrics }: PlanningMetricsProps) => {
  const { t } = useTranslation();

  const planTypesData = [
    {
      name: t('brokerDashboard.metrics.planning.planTypes.endAt120'),
      value: metrics.planning.planTypes.type1,
      color: 'sky' as AvailableChartColorsKeys
    },
    {
      name: t('brokerDashboard.metrics.planning.planTypes.leave1M'),
      value: metrics.planning.planTypes.type2,
      color: 'fuchsia' as AvailableChartColorsKeys
    },
    {
      name: t('brokerDashboard.metrics.planning.planTypes.keepPrincipal'),
      value: metrics.planning.planTypes.type3,
      color: 'orange' as AvailableChartColorsKeys
    }
  ];

  const donutColors = planTypesData.map(item => item.color);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Avatar 
            icon={Target} 
            size="md" 
            variant="square"
            iconClassName="h-5 w-5"
            color="purple"
        />
          {t('brokerDashboard.metrics.planning.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="space-y-2">
              <Text className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.planning.averageAge')}</Text>
              <Metric className="text-3xl font-bold text-gray-900 tracking-tight">
                {handleNaN(metrics.planning.averageAge).toFixed(1)}
                <span className="text-sm text-gray-500 ml-2">anos</span>
              </Metric>
            </div>
            <div className="space-y-2">
              <Text className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.planning.averageDesiredIncome')}</Text>
              <Metric className="text-3xl font-bold text-gray-900 tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(handleNaN(metrics.planning.averageDesiredIncome))}
              </Metric>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <Text className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.planning.averageRetirementAge')}</Text>
              <Metric className="text-3xl font-bold text-gray-900 tracking-tight">
                {handleNaN(metrics.planning.averageRetirementAge).toFixed(1)}
                <span className="text-sm text-gray-500 ml-2">anos</span>
              </Metric>
            </div>
            <div className="space-y-4">
              <Text className="text-sm font-medium text-gray-500">{t('brokerDashboard.metrics.planning.planTypes.title')}</Text>
              <div className="h-[200px]">
                <DonutChart
                  variant="donut"
                  className="h-full"
                  data={planTypesData}
                  category="value"
                  index="name"
                  colors={donutColors}
                  valueFormatter={(value) => `${value} clientes`}
                  showLabel={true}
                  showAnimation={true}
                  customTooltip={customTooltip}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 