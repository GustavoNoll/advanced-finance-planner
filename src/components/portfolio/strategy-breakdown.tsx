import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { PerformanceData } from "@/types/financial";
import { CurrencyCode } from "@/utils/currency";
import { formatCurrency } from "@/utils/currency";
import { useTranslation } from "react-i18next";

const COLORS = [
  'hsl(210 16% 82%)', // Light blue-gray
  'hsl(32 25% 72%)',  // Light beige
  'hsl(45 20% 85%)',  // Very light beige
  'hsl(210 11% 71%)', // Medium gray
  'hsl(210 16% 58%)', // Darker gray
  'hsl(207 26% 50%)', // Blue-gray
  'hsl(158 64% 25%)', // Dark forest green
  'hsl(159 61% 33%)', // Medium forest green
  'hsl(210 29% 24%)', // Dark blue-gray
  'hsl(25 28% 53%)',  // Medium brown
  'hsl(40 23% 77%)',  // Light tan
  'hsl(210 14% 53%)', // Medium blue-gray
  'hsl(35 31% 65%)',  // Warm beige
  'hsl(210 24% 40%)', // Darker blue-gray
];

interface StrategyBreakdownProps {
  performanceData: PerformanceData[];
  currency?: CurrencyCode;
}

function toDate(competencia?: string | null) {
  if (!competencia) return new Date(0);
  const [m, y] = competencia.split('/');
  return new Date(parseInt(y), parseInt(m) - 1);
}

export function StrategyBreakdown({ performanceData, currency = 'BRL' }: StrategyBreakdownProps) {
  const { t } = useTranslation();

  // Get unique periods and find the most recent
  const uniquePeriods = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])];
  const sortedPeriods = uniquePeriods.sort((a, b) => toDate(a).getTime() - toDate(b).getTime());
  const mostRecentPeriod = [...sortedPeriods].sort((a, b) => toDate(b).getTime() - toDate(a).getTime())[0];

  // Filter to get only the most recent period data
  const filteredData = performanceData.filter(
    item => item.period === mostRecentPeriod && item.position && item.position > 0
  );

  if (filteredData.length === 0) {
    return null;
  }

  // Group investments by asset class and calculate totals
  const strategyData = filteredData.reduce((acc, investment) => {
    const assetClass = investment.asset_class || "Outros";
    
    if (!acc[assetClass]) {
      acc[assetClass] = { 
        name: assetClass, 
        value: 0, 
        count: 0,
        totalReturn: 0
      };
    }
    const position = Number(investment.position || 0);
    const yieldValue = Number(investment.yield || 0);
    acc[assetClass].value += position;
    acc[assetClass].totalReturn += yieldValue * position;
    acc[assetClass].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number; totalReturn: number }>);

  const totalPatrimonio = Object.values(strategyData).reduce((sum, item) => sum + item.value, 0);

  const chartData = Object.values(strategyData)
    .map((item, index) => {
      return {
        ...item,
        percentage: (item.value / totalPatrimonio) * 100,
        avgReturn: item.value > 0 ? (item.totalReturn / item.value) * 100 : 0,
        color: COLORS[index % COLORS.length]
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        value: number;
        percentage: number;
        color: string;
      };
      fill?: string;
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const fillColor = payload[0].fill || data.color;
      
      return (
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg p-4 min-w-[180px]">
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: fillColor }}
            />
            <p className="text-foreground font-semibold text-sm">{data.name}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-foreground font-bold text-base">
                {formatCurrency(data.value, currency)}
              </span>
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              {data.percentage.toFixed(2)}% {t('portfolioPerformance.kpi.strategyBreakdown.ofPatrimony')}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
      <CardHeader>
        <CardTitle className="text-foreground text-lg">{t('portfolioPerformance.kpi.strategyBreakdown.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Table */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground border-b border-border/30 pb-2">
              <div>{t('portfolioPerformance.kpi.strategyBreakdown.name')}</div>
              <div className="text-center">{t('portfolioPerformance.kpi.strategyBreakdown.allocation')}</div>
              <div className="text-right">{t('portfolioPerformance.kpi.strategyBreakdown.grossBalance')}</div>
            </div>
            
            {chartData.map((item) => (
              <div key={item.name} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-border/10 hover:bg-muted/30 transition-colors rounded-sm px-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-1 h-4 rounded-sm shadow-sm" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
                <div className="text-center text-foreground font-medium">
                  {item.percentage.toFixed(2)}%
                </div>
                <div className="text-right text-foreground">
                  {formatCurrency(item.value, currency)}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Donut Chart */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width="100%" height={400} minWidth={350}>
                <PieChart width={400} height={400}>
                  <defs>
                    {chartData.map((item, index) => (
                      <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={item.color} stopOpacity={1}/>
                        <stop offset="100%" stopColor={item.color} stopOpacity={0.8}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={120}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Content with backdrop */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-card/80 backdrop-blur-sm rounded-full px-4 py-3 border border-border/30 shadow-elegant-sm">
                  <div className="text-xs text-muted-foreground mb-1 text-center font-medium">
                    {t('portfolioPerformance.kpi.strategyBreakdown.grossPatrimony')}
                  </div>
                  <div className="text-lg font-bold text-foreground text-center">
                    {formatCurrency(totalPatrimonio, currency)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

