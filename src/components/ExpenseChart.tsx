import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Label } from 'recharts';
import { useTranslation } from "react-i18next";
import { ChartDataPoint, FinancialRecord, Goal, ProjectedEvent } from '@/types/financial';
import { generateChartProjections } from '@/lib/chart-projections';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from '@/lib/financial-math';

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
}

export const ExpenseChart = ({ 
  profile, 
  investmentPlan, 
  clientId, 
  allFinancialRecords, 
}: ExpenseChartProps) => {
  const { t } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState<'1y' | '5y' | '10y' | 'all'>('all');
  const [showRealValues, setShowRealValues] = useState<boolean>(false);
  
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

  // Function to calculate inflation-adjusted values
  const calculateInflationAdjustedValue = (
    value: number | null | undefined,
    baseYear: number,
    baseMonth: number,
    targetYear: number,
    targetMonth: number,
    monthlyInflationRate: number
  ): number | null | undefined => {
    if (value === null || value === undefined) return value;
    
    // Calculate total months between the dates
    const monthsDiff = 
      (targetYear - baseYear) * 12 + (targetMonth - baseMonth);
    
    // If the target date is before or equal to the base date, use historical inflation data
    if (monthsDiff <= 0) {
      // For historical values, use accumulated target_rentability from financial records
      // Find all records between target date and base date
      const recordsBetween = allFinancialRecords.filter(record => {
        // Calculate if this record is older than target date (before target date)
        const recordToTargetMonthDiff = 
          (record.record_year - targetYear) * 12 + (record.record_month - targetMonth);
        
        return recordToTargetMonthDiff < 0; // Record is BEFORE target date (negative diff means older)
      });
      // Calculate accumulated inflation factor using target_rentability

      const inflationFactor = 1 + (calculateCompoundedRates(recordsBetween.map(record => record.target_rentability/100)) || 1);
      
      // If we have inflation data, apply the adjustment
      if (inflationFactor !== 1) {
        return value / inflationFactor;
      }
      
      // If no historical inflation data, return original value
      return value;
    }
    // Discount the value by the accumulated inflation
    return value / Math.pow(1 + monthlyInflationRate, monthsDiff);
  };

  const formatXAxisLabel = (point: ChartDataPoint) => {
    if (zoomLevel === 'all' || zoomLevel === '10y') {
      return Math.floor(Number(point.age)).toString();
    }
    
    const monthName = new Date(0, point.month - 1).toLocaleString('default', { month: 'short' });
    return `${Math.floor(Number(point.age))}/${monthName}`;
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

  // Get base date (today) for inflation adjustment
  const currentDate = new Date();
  const sortedRecords = [...allFinancialRecords].sort((a, b) => {
    if (a.record_year !== b.record_year) {
      return b.record_year - a.record_year; // Descending by year
    }
    return b.record_month - a.record_month; // Descending by month
  });
  
  const lastRecord = sortedRecords[0];
  const baseYear = lastRecord ? lastRecord.record_year : currentDate.getFullYear();
  const baseMonth = lastRecord ? lastRecord.record_month : currentDate.getMonth() + 1;

  // Generate chart projections
  const rawChartData = generateChartProjections(
    profile,
    investmentPlan,
    allFinancialRecords,
    goals,
    events
  );

  // Apply adjustments based on showRealValues setting
  // aplicar dado do bc se tem
  // se assumir inflação 
  const adjustedChartData = showRealValues 
    ? rawChartData.map(point => ({
        ...point,
        actualValue: point.realDataPoint 
          ? point.actualValue // Keep real data points as is
          : calculateInflationAdjustedValue(
              point.actualValue, 
              baseYear, 
              baseMonth, 
              point.year, 
              point.month, 
              yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100)
            ),
        projectedValue: calculateInflationAdjustedValue(
          point.projectedValue, 
          baseYear, 
          baseMonth, 
          point.year, 
          point.month, 
          yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100)
        ),
      }))
    : rawChartData;

  // Get final data with zoom applied
  const chartData = getZoomedData(adjustedChartData).map(point => ({
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderContent = (props: any, goal?: Goal, event?: ProjectedEvent) => {
    if (!props.viewBox?.x || !props.viewBox?.y || (!goal && !event)) return null;
    
    const { viewBox: { x, y } } = props;
    const icon = goal ? goal.icon === 'car' ? '🚗' : 
                 goal.icon === 'house' ? '🏠' : 
                 goal.icon === 'travel' ? '✈️' : 
                 goal.icon === 'education' ? '🎓' :
                 goal.icon === 'retirement' ? '👴' :
                 goal.icon === 'emergency' ? '🚨' : '🎯' :
                 event ? '📅' : null;
    
    // Format currency for goal/event amount
    const formattedAmount = (goal?.asset_value || event?.amount) 
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(goal?.asset_value || event?.amount || 0)
      : '';

    return (
      <g transform={`translate(${x - 7}, ${y - 7})`}>
        <title>
          {goal 
            ? `${t('financialGoals.icons.' + goal.icon)}\n` +
              `${t('financialGoals.labels.assetValue')}: ${formattedAmount}\n` +
              `${t('financialGoals.form.goalMonth')}: ${t('monthlyView.table.months.' + new Date(0, goal.month - 1).toLocaleString('default', { month: 'long' }))}\n` +
              `${t('financialGoals.form.goalYear')}: ${goal.year}\n` +
              (goal.description ? `${t('financialGoals.description')}: ${goal.description}\n` : '') +
              (goal.installment_project ? `${t('financialGoals.form.isInstallment')}: ${t('common.yes')}\n` : '') +
              (goal.installment_count ? `${t('financialGoals.form.installmentCount')}: ${goal.installment_count}` : '')
            : event
              ? `${t('events.form.name')}: ${event.name}\n` +
                `${t('events.form.amount')}: ${formattedAmount}\n` +
                `${t('events.form.month')}: ${t('monthlyView.table.months.' + new Date(0, event.month - 1).toLocaleString('default', { month: 'long' }))}\n` +
                `${t('events.form.year')}: ${event.year}`
              : ''
          }
        </title>
        <text 
          x="0" 
          y="0" 
          fontSize="14" 
          fill="#374151"
          style={{ cursor: 'help' }}
        >
          {`${icon}`}
        </text>
      </g>
    );
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold">{t('dashboard.charts.portfolioPerformance')}</h2>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Inflation adjustment toggle */}
          <div className="inline-flex items-center">
            <button
              onClick={() => setShowRealValues(!showRealValues)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
                showRealValues 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {showRealValues ? (
                <>
                  <span>{t('expenseChart.realValues')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <span>{t('expenseChart.nominalValues')}</span>
              )}
            </button>
          </div>
          
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
        </div>
      </div>

      <ResponsiveContainer 
        width="100%" 
        height={300}
        key={`${JSON.stringify(chartData)}-${showRealValues}`}
      >
        <LineChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 50, bottom: 25 }}
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
            label={{ 
              value: t('expenseChart.years'), 
              position: 'bottom', 
              offset: 0 
            }}
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
                return `${Math.floor(Number(dataPoint.age))} ${t('expenseChart.years')} (${dataPoint.year})${
                  showRealValues ? ` - ${t('expenseChart.realValues')}` : ''
                }`;
              }

              const monthName = new Date(0, dataPoint.month - 1).toLocaleString('default', { month: 'long' });
              const wholeAge = Math.floor(Number(dataPoint.age));
              
              return `${wholeAge} ${t('expenseChart.years')} (${t('monthlyView.table.months.' + monthName)} ${dataPoint.year})${
                showRealValues ? ` - ${t('expenseChart.realValues')}` : ''
              }`;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ 
              paddingTop: '20px',
              bottom: 0
            }}
          />

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
                      position: 'top',
                      content: (props) => renderContent(props, goal)
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
                      position: 'top',
                      content: (props) => renderContent(props, null, event)
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
            name={showRealValues ? t('expenseChart.actualValueReal') : t('expenseChart.actualValue')}
            strokeWidth={2.5}
            connectNulls
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        
          <Line 
            type="natural"
            dataKey="projectedValue" 
            stroke="#f97316"
            name={showRealValues ? t('expenseChart.projectedValueReal') : t('expenseChart.projectedValue')}
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
