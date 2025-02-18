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
  financialRecordsByYear: FinancialRecord[];
  profile: Profile;
  withdrawalStrategy?: WithdrawalStrategy;
}

export const ExpenseChart = ({ 
  profile, 
  investmentPlan, 
  clientId, 
  financialRecordsByYear, 
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

  if (!profile || !investmentPlan || !clientId || !financialRecordsByYear) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  const getZoomedData = (data: ChartDataPoint[]) => {
    if (zoomLevel === 'all') return data;
    
    const currentAge = Number(data[0]?.age);
    const yearsToShow = {
      '1y': 1,
      '5y': 5,
      '10y': 10,
    }[zoomLevel];

    return data.filter(point => 
      Number(point.age) >= currentAge && 
      Number(point.age) <= currentAge + yearsToShow
    );
  };

  const chartData = getZoomedData(generateChartProjections(
    profile,
    investmentPlan,
    financialRecordsByYear,
    withdrawalStrategy,
    goals,
    events
  ));

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


  console.log(chartData);

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
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
              <stop offset={offset} stopColor="#2563eb" /> {/* blue-600 */}
              <stop offset={offset} stopColor="#93c5fd" /> {/* blue-300 */}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="age"
            tickFormatter={(value) => `${value} ${t('expenseChart.years')}`}
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
              const dataPoint = chartData.find(point => point.age === label);
              return `${label} ${t('expenseChart.years')} (${dataPoint?.year})`;
            }}
          />
          <Legend />

          {/* Update reference lines for goals */}
          {goals
            ?.sort((a, b) => a.year - b.year)
            .reduce((acc: React.ReactNode[], goal, index, sortedGoals) => {
              const achievementPoint = chartData.find(
                point => point.year === goal.year
              );
              
              const age = achievementPoint?.age;
              if (
                achievementPoint && 
                goal.status === 'pending'
              ) {
                acc.push(
                  <ReferenceLine
                    key={`${goal.id}-actual`}
                    x={String(age)}
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
              const achievementPoint = chartData.find(
                point => point.year === event.year
              );

              const age = achievementPoint?.age;
              if (
                achievementPoint && 
                event.status === 'projected'
              ) {
                acc.push(
                  <ReferenceLine
                    key={event.id}
                    x={String(age)}
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
