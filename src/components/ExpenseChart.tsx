import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useTranslation } from "react-i18next";
import { ChartDataPoint, FinancialRecord, Goal, ProjectedEvent } from '@/types/financial';
import { WithdrawalStrategy } from '@/lib/withdrawal-strategies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateChartProjections } from '@/lib/chart-projections';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { goalIcons } from '@/constants/goals';

interface Profile {
  birth_date: string;
}

interface InvestmentPlan {
  created_at: string;
  monthly_deposit: number;
  expected_return: number;
  inflation: number;
  initial_amount: number;
  initial_age: number;
  final_age: number;
  desired_income: number;
  adjust_contribution_for_inflation: boolean;
  plan_type: string;
  limit_age?: number;
}

interface ExpenseChartProps {
  investmentPlan: InvestmentPlan;
  clientId: string;
  allFinancialRecords: FinancialRecord[];
  profile: Profile;
  withdrawalStrategy?: WithdrawalStrategy;
}

export const ExpenseChart = ({ 
  profile, 
  investmentPlan, 
  clientId, 
  allFinancialRecords, 
  withdrawalStrategy = { type: 'fixed' },
  onWithdrawalStrategyChange
}: ExpenseChartProps & {
  onWithdrawalStrategyChange?: (strategy: WithdrawalStrategy) => void;
}) => {
  const { t } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState<'1y' | '5y' | '10y' | 'all'>('all');
  
  // Add query for financial goals
  const { data: goals } = useQuery<Goal[]>({
    queryKey: ["financial-goals", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("profile_id", clientId)
        .eq("status", "pending")
        .order("year", { ascending: true })
        .order("month", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: events } = useQuery<ProjectedEvent[]>({
    queryKey: ["events", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("profile_id", clientId)
        .eq("status", "projected"); 

      if (error) throw error;
      return data;
    },
  });

  if (!profile || !investmentPlan || !clientId || !allFinancialRecords) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  const formatXAxisLabel = (point: ChartDataPoint) => {
    if (zoomLevel === 'all' || zoomLevel === '10y') {
      return point.year.toString();
    }
    
    const monthName = new Date(0, point.month - 1).toLocaleString('default', { month: 'short' });
    const shortYear = String(point.year).slice(-2);
    return `${monthName}/${shortYear}`;
  };

  const getZoomedData = (data: ChartDataPoint[]) => {
    if (zoomLevel === 'all') {
      // Group by year and calculate last value for each year
      const yearlyData = data.reduce((acc: { [key: string]: ChartDataPoint[] }, point) => {
        const year = point.year.toString();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(point);
        return acc;
      }, {});

      return Object.entries(yearlyData).map(([year, points]) => {
        // Sort points by month (descending) to get the last month
        const sortedPoints = [...points].sort((a, b) => b.month - a.month);
        const lastMonthPoint = sortedPoints[0];

        return {
          ...lastMonthPoint,
          age: Math.floor(Number(lastMonthPoint.age)).toString() // Remove decimal part
        };
      });
    }
    
    // Get current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Find the starting point (current month/year)
    const startPoint = data.find(point => 
      point.year === currentYear && 
      point.month === currentMonth
    ) || data[0];

    if (!startPoint) return data;

    const startAge = Number(startPoint.age);
    const yearsToShow = {
      '1y': 1,
      '5y': 5,
      '10y': 10,
    }[zoomLevel];

    const filteredData = data.filter(point => {
      const pointAge = Number(point.age);
      return pointAge >= startAge && pointAge <= startAge + yearsToShow;
    });

    // Para 10 anos, agrupar por ano como no modo 'all'
    if (zoomLevel === '10y') {
      const yearlyData = filteredData.reduce((acc: { [key: string]: ChartDataPoint[] }, point) => {
        const year = point.year.toString();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(point);
        return acc;
      }, {});

      return Object.entries(yearlyData).map(([year, points]) => {
        const lastRealPoint = points.reverse().find(p => p.realDataPoint);
        
        if (lastRealPoint) {
          return {
            ...lastRealPoint,
            age: Math.floor(Number(lastRealPoint.age)).toString()
          };
        }

        const lastPoint = points[0];
        return {
          ...lastPoint,
          actualValue: lastPoint.actualValue,
          age: Math.floor(Number(lastPoint.age)).toString()
        };
      });
    }
    return filteredData;
  };

  // Adicionar o label formatado aos dados do gráfico
  const chartData = getZoomedData(generateChartProjections(
    profile,
    investmentPlan,
    allFinancialRecords,
    withdrawalStrategy,
    goals,
    events
  )).map(point => ({
    ...point,
    xAxisLabel: formatXAxisLabel(point)
  }));


  const colorOffset = () => {
    // Find the last real data point index
    const lastRealIndex = chartData.findIndex(point => !point.realDataPoint);
    
    // If no projection points found, return 1 (all blue)
    if (lastRealIndex === -1) return 1;
    
    // If no real points found, return 0 (all red)
    if (lastRealIndex === 0) return 0;
    
    // Calculate offset based on the position of the last real point
    return lastRealIndex / chartData.length;
  };

  const offset = colorOffset();


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold">{t('dashboard.charts.portfolioPerformance')}</h2>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center rounded-md border border-gray-200 p-1 bg-gray-50">
            <button
              onClick={() => setZoomLevel('1y')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === '1y' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('common.last1YearS')}
            </button>
            <button
              onClick={() => setZoomLevel('5y')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === '5y' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('common.last5YearsS')}
            </button>
            <button
              onClick={() => setZoomLevel('10y')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === '10y' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('common.last10YearsS')}
            </button>
            <button
              onClick={() => setZoomLevel('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === 'all' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('common.all')}
            </button>
          </div>

          <Select
            value={withdrawalStrategy.type}
            onValueChange={(value) => {
              onWithdrawalStrategyChange?.({
                type: value as WithdrawalStrategy['type'],
                monthlyAmount: value === 'fixed' ? investmentPlan?.desired_income : undefined,
                targetLegacy: value === 'legacy' ? 1000000 : undefined
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('expenseChart.selectStrategy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">{t('monthlyView.futureProjection.strategies.fixed')}</SelectItem>
              <SelectItem value="preservation">{t('monthlyView.futureProjection.strategies.preservation')}</SelectItem>
              <SelectItem value="spend-all">{t('monthlyView.futureProjection.strategies.spendAll')}</SelectItem>
              <SelectItem value="legacy">{t('monthlyView.futureProjection.strategies.legacy')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ResponsiveContainer 
        width="100%" 
        height={300}
        key={JSON.stringify(chartData)}
      >
        <LineChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
              <stop offset={offset} stopColor="#2563eb" /> {/* blue-600 */}
              <stop offset={offset} stopColor="#93c5fd" /> {/* blue-300 */}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="xAxisLabel"
            interval={zoomLevel === 'all' || zoomLevel === '10y' ? 'preserveStartEnd' : 3}
          />
          <YAxis 
            tickFormatter={(value) => 
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value)
            }
          />
          <Tooltip 
            formatter={(value: number) => 
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value)
            }
            labelFormatter={(label) => {
              const dataPoint = chartData.find(point => point.xAxisLabel === label);
              if (!dataPoint) return '';

              if (zoomLevel === 'all') {
                return `${Math.floor(Number(dataPoint.age))} ${t('expenseChart.years')} (${dataPoint.year})`;
              }

              const monthName = new Date(0, dataPoint.month - 1).toLocaleString('default', { month: 'long' });
              const wholeAge = Math.floor(Number(dataPoint.age));
              
              return `${wholeAge} ${t('expenseChart.years')} (${t('monthlyView.table.months.' + monthName)} ${dataPoint.year})`;
            }}
          />
          <Legend />

          {/* Update reference lines for goals */}
          {goals?.sort((a, b) => a.year - b.year)
            .reduce((acc: React.ReactNode[], goal) => {
              const achievementPoint = chartData.find(point => {
                if (zoomLevel === 'all' || zoomLevel === '10y') {
                  return point.year === goal.year;
                }
                return point.year === goal.year && point.month === goal.month;
              });
              
              if (achievementPoint && goal.status === 'pending') {
                acc.push(
                  <ReferenceLine
                    key={`${goal.id}-actual`}
                    x={achievementPoint.xAxisLabel}
                    stroke="black"
                    strokeDasharray="3 3"
                    ifOverflow="extendDomain"
                    label={{
                      value: `${goalIcons[goal.icon]}`,
                      position: 'top',
                      fill: 'blue',
                      fontSize: 14,
                      dy: 0,
                      className: "font-medium"
                    }}
                  />
                );
              }
              return acc;
            }, [])}

          {events?.sort((a, b) => a.year - b.year)
            .reduce((acc: React.ReactNode[], event, index, sortedEvents) => {
              const achievementPoint = chartData.find(point => {
                if (zoomLevel === 'all' || zoomLevel === '10y') {
                  return point.year === event.year;
                }
                return point.year === event.year && point.month === event.month;
              });

              if (
                achievementPoint && 
                event.status === 'projected'
              ) {
                acc.push(
                  <ReferenceLine
                    key={event.id}
                    x={achievementPoint.xAxisLabel}
                    stroke="black"
                    strokeDasharray="3 3"
                    ifOverflow="extendDomain"
                    label={{
                      value: `📅`,
                      position: 'top',
                    }}
                  />
                );
              }
              return acc;
            }, [])}

          {/* Line for actual values (solid) */}
          <Line 
            type="natural"
            dataKey="actualValue"
            stroke="url(#colorUv)"
            name={t('expenseChart.actualValue')}
            strokeWidth={2.5}
            connectNulls
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
            //data={chartData.filter(point => point.realDataPoint)}
          />
        
          <Line 
            type="natural"
            dataKey="projectedValue" 
            stroke="#f97316"
            name={t('expenseChart.projectedValue')}
            strokeWidth={2.5}
            strokeDasharray="8 8"
            connectNulls
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
