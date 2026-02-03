import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, CheckCircle } from 'lucide-react';

interface ContributionTrendData {
  month: string;
  totalClients: number;
  adequateContributors: number;
  percentage: number;
}

interface ContributionTrendChartProps {
  data: ContributionTrendData[];
}

/**
 * Chart showing contribution adequacy trends over the last 6 months
 */
export function ContributionTrendChart({ data }: ContributionTrendChartProps) {
  const { t } = useTranslation();

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: Record<string, number | string> }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('brokerDashboard.charts.adequateContributors')}: {data.adequateContributors}/{data.totalClients}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('brokerDashboard.charts.adequacyRate')}: {formatPercentage(Number(data.percentage))}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const averageAdequacy = data.length > 0 
    ? data.reduce((sum, item) => sum + item.percentage, 0) / data.length 
    : 0;

  const averageAdequateContributors = data.length > 0 
    ? Math.round(data.reduce((sum, item) => sum + item.adequateContributors, 0) / data.length)
    : 0;

  const totalAdequateContributors = data[data.length - 1]?.adequateContributors || 0;
  const totalClients = data[data.length - 1]?.totalClients || 0;

  // Determine color scheme based on performance
  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return { 
      color: '#10B981', // green
      gradient: { from: '#10B981', to: '#059669' },
      bg: 'from-emerald-50 to-green-100',
      border: 'border-emerald-200',
      text: 'text-emerald-600'
    };
    if (percentage >= 60) return { 
      color: '#F59E0B', // yellow
      gradient: { from: '#F59E0B', to: '#D97706' },
      bg: 'from-yellow-50 to-amber-100',
      border: 'border-yellow-200',
      text: 'text-yellow-600'
    };
    return { 
      color: '#EF4444', // red
      gradient: { from: '#EF4444', to: '#DC2626' },
      bg: 'from-red-50 to-rose-100',
      border: 'border-red-200',
      text: 'text-red-600'
    };
  };

  const performanceColor = getPerformanceColor(averageAdequacy);

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${performanceColor.bg} dark:from-gray-900/20 dark:to-gray-800/20 ${performanceColor.border} dark:border-gray-700`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${performanceColor.color}/5 to-transparent opacity-50`} />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`text-lg font-semibold ${performanceColor.text} dark:text-gray-100 flex items-center gap-2`}>
              <TrendingUp className={`h-5 w-5 ${performanceColor.text}`} />
              {t('brokerDashboard.charts.contributionTrends')}
            </CardTitle>
            <p className={`text-sm ${performanceColor.text} dark:text-gray-400 mt-1`}>
              {t('brokerDashboard.charts.contributionTrendsDescription')}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${performanceColor.text} dark:text-gray-300`}>
              {formatPercentage(averageAdequacy)}
            </p>
            <p className={`text-xs ${performanceColor.text} dark:text-gray-400`}>
              {t('brokerDashboard.charts.averageAdequacy')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorAdequacy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={performanceColor.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={performanceColor.color} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                  domain={[0, 100]}
                  tickFormatter={formatPercentage}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke={performanceColor.color}
                  strokeWidth={3}
                  fill="url(#colorAdequacy)"
                  dot={{ fill: performanceColor.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: performanceColor.color, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t ${performanceColor.border} dark:border-gray-700`}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className={`h-4 w-4 ${performanceColor.text}`} />
                <span className={`text-sm font-medium ${performanceColor.text} dark:text-gray-400`}>
                  {t('brokerDashboard.charts.adequateContributors')}
                </span>
              </div>
              <p className={`text-2xl font-bold ${performanceColor.text} dark:text-gray-100`}>
                {totalAdequateContributors}
              </p>
              <p className={`text-xs ${performanceColor.text} dark:text-gray-400`}>
                {t('brokerDashboard.charts.ofTotal')} {totalClients}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className={`h-4 w-4 ${performanceColor.text}`} />
                <span className={`text-sm font-medium ${performanceColor.text} dark:text-gray-400`}>
                  {t('brokerDashboard.charts.averageContributors')}
                </span>
              </div>
              <p className={`text-2xl font-bold ${performanceColor.text} dark:text-gray-100`}>
                {averageAdequateContributors}
              </p>
              <p className={`text-xs ${performanceColor.text} dark:text-gray-400`}>
                {t('brokerDashboard.charts.averageContributorsDescription')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className={`h-4 w-4 ${performanceColor.text}`} />
                <span className={`text-sm font-medium ${performanceColor.text} dark:text-gray-400`}>
                  {t('brokerDashboard.charts.adequacyRate')}
                </span>
              </div>
              <p className={`text-2xl font-bold ${performanceColor.text} dark:text-gray-100`}>
                {formatPercentage(averageAdequacy)}
              </p>
              <p className={`text-xs ${performanceColor.text} dark:text-gray-400`}>
                {t('brokerDashboard.charts.averageAdequacy')}
              </p>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="space-y-3">
            <h4 className={`text-sm font-medium ${performanceColor.text} dark:text-gray-300`}>
              {t('brokerDashboard.charts.trendAnalysis')}
            </h4>
            <div className="space-y-2">
              {data.map((item, index) => {
                const isImproving = index > 0 && item.percentage > data[index - 1].percentage;
                const isDeclining = index > 0 && item.percentage < data[index - 1].percentage;
                
                return (
                  <div key={item.month} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${performanceColor.text} dark:text-gray-400`}>
                        {item.month}
                      </span>
                      {isImproving && <div className="h-2 w-2 rounded-full bg-green-500" />}
                      {isDeclining && <div className="h-2 w-2 rounded-full bg-red-500" />}
                      {!isImproving && !isDeclining && <div className="h-2 w-2 rounded-full bg-gray-400" />}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${performanceColor.text} dark:text-gray-100`}>
                        {formatPercentage(item.percentage)}
                      </span>
                      <span className={`text-sm ${performanceColor.text} dark:text-gray-400`}>
                        {item.adequateContributors}/{item.totalClients}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
