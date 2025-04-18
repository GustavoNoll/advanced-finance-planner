import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BarChart, Text, CustomTooltipProps } from '@tremor/react';
import { DashboardMetrics } from '@/types/broker-dashboard';
import { Avatar } from '@/components/ui/avatar-initial';

interface WealthDistributionChartProps {
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
          {categoryPayload.dataKey}: {' '} 
          <span className="font-semibold">{categoryPayload.value}</span>
        </p>
      </div>
    </div>
  );
};

/**
 * Displays a bar chart showing the distribution of client wealth using Tremor
 * @param metrics - The dashboard metrics data
 */
export const WealthDistributionChart = ({ metrics }: WealthDistributionChartProps) => {
  const { t } = useTranslation();

  const ranges = {
    '0 - 500k': 'R$ 0+',
    '500k - 10M': 'R$ 500k+',
    '10M - 50M': 'R$ 10M+',
    '50M+': 'R$ 50M+'
  };

  const data = metrics.wealthDistribution.map(item => ({
    range: ranges[item.range as keyof typeof ranges] || item.range,
    'Quantidade de Clientes': item.count
  }));

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Avatar 
            icon={Wallet} 
            size="md" 
            variant="square"
            iconClassName="h-5 w-5"
            color="green"
          />
          {t('brokerDashboard.metrics.wealthDistribution.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text className="text-center text-sm text-gray-500 mb-2">
          {t('brokerDashboard.metrics.wealthDistribution.clientCount')}
        </Text>
        <div className="h-[300px]">
          <BarChart
            className="h-full"
            data={data}
            index="range"
            categories={['Quantidade de Clientes']}
            colors={['blue']}
            valueFormatter={(value) => String(value)}
            yAxisWidth={60}
            showLegend={false}
            showGridLines={true}
            showXAxis={true}
            showYAxis={true}
            showTooltip={true}
            customTooltip={customTooltip}
            rotateLabelX={{ angle: -45, verticalShift: 35, xAxisHeight: 80 }}
          />
        </div>
      </CardContent>
    </Card>
  );
}; 