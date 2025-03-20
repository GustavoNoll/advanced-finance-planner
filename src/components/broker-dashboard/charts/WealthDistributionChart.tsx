import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { DashboardMetrics } from '@/types/broker-dashboard';

interface WealthDistributionChartProps {
  metrics: DashboardMetrics;
}

/**
 * Displays a bar chart showing the distribution of client wealth
 * @param metrics - The dashboard metrics data
 */
export const WealthDistributionChart = ({ metrics }: WealthDistributionChartProps) => {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          {t('brokerDashboard.metrics.wealthDistribution.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={metrics.wealthDistribution}
              margin={{ top: 20, right: 30, bottom: 70, left: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="range" 
                tickFormatter={(value) => {
                  const ranges: { [key: string]: string } = {
                    '0 - 500k': 'R$ 0 - 500k',
                    '500k - 10M': 'R$ 500k - 10M',
                    '10M - 50M': 'R$ 10M - 50M',
                    '50M+': 'R$ 50M+'
                  };
                  return ranges[value] || value;
                }}
                height={80}
                tick={{ 
                  fill: '#6B7280', 
                  fontSize: 12,
                  textAnchor: 'end',
                  dy: 8
                }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                interval={0}
                angle={-45}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                label={{ 
                  value: t('brokerDashboard.metrics.wealthDistribution.clientCount'),
                  angle: -90,
                  position: 'insideLeft',
                  offset: -35,
                  style: { fill: '#6B7280', fontSize: 12 }
                }}
              />
              <RechartsTooltip 
                formatter={(value: number, name: string) => [
                  `${value} clientes`,
                  'Quantidade de Clientes'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  padding: '8px'
                }}
                labelStyle={{ color: '#6B7280' }}
              />
              <Bar 
                dataKey="count" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="Quantidade de Clientes"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 