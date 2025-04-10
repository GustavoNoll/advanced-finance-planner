import { useTranslation } from "react-i18next";
import { ChartDataPoint, FinancialRecord, Goal, ProjectedEvent, MonthNumber, InvestmentPlan } from '@/types/financial';
import { generateChartProjections, YearlyProjectionData } from '@/lib/chart-projections';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from '@/lib/financial-math';
import { ChartPointDialog } from "@/components/chart/ChartPointDialog";
import { Title, Text, Flex, NumberInput, AreaChart } from "@tremor/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { chartColors } from "@/lib/chartColors";

interface Profile {
  birth_date: string;
}

interface ChartPoint {
  age: string;
  year: number;
  month: number;
  actualValue: number;
  projectedValue: number;
  realDataPoint: boolean;
}

interface ExpenseChartProps {
  investmentPlan: InvestmentPlan;
  clientId: string;
  allFinancialRecords: FinancialRecord[];
  profile: Profile;
  projectionData?: YearlyProjectionData[];
  onProjectionDataChange?: () => void;
}

// Update the zoom level type to include custom
type ZoomLevel = '1y' | '5y' | '10y' | 'all' | 'custom';

interface GoalFormValues {
  icon: string;
  asset_value: string;
  goal_month: string;
  goal_year: string;
  installment_project: boolean;
  installment_count?: string;
}

interface EventFormValues {
  name: string;
  amount: string;
  month: string;
  year: string;
}

export const ExpenseChart = ({ 
  profile, 
  investmentPlan, 
  clientId, 
  allFinancialRecords,
  projectionData,
  onProjectionDataChange
}: ExpenseChartProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('all');
  const [showRealValues, setShowRealValues] = useState<boolean>(false);
  const [customRange, setCustomRange] = useState<{ past: number, future: number }>({ past: 1, future: 1 });
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'goal' | 'event' | null>(null);
  
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

  // Add mutations for creating goals and events
  const createGoal = useMutation({
    mutationFn: async (values: GoalFormValues) => {
      const { data, error } = await supabase.from("financial_goals").insert([
        {
          profile_id: clientId,
          icon: values.icon,
          asset_value: parseFloat(values.asset_value.replace(/[^\d.,]/g, '').replace(',', '.')),
          month: parseInt(values.goal_month),
          year: parseInt(values.goal_year),
          installment_project: values.installment_project,
          installment_count: values.installment_project ? parseInt(values.installment_count || "0") : null,
          status: 'pending',
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
      setShowDialog(false);
      setSelectedPoint(null);
      onProjectionDataChange?.();
    },
  });

  const createEvent = useMutation({
    mutationFn: async (values: EventFormValues) => {
      const cleanAmount = values.amount
        .replace(/[R$\s]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

      const amount = parseFloat(cleanAmount);

      const { data, error } = await supabase.from("events").insert([
        {
          profile_id: clientId,
          name: values.name,
          amount: amount,
          month: parseInt(values.month),
          year: parseInt(values.year),
          status: 'projected'
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowDialog(false);
      setSelectedPoint(null);
      onProjectionDataChange?.();
    },
  });

  const handleChartClick = (data: ChartPoint) => {
    setSelectedPoint(data);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setSelectedPoint(null);
    setDialogType(null);
  };

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
    
    const monthName = new Date(0, point.month - 1).toLocaleString('default', { month: 'long' });
    return `${Math.floor(Number(point.age))}/${t(`monthlyView.table.months.${monthName}`)}`;
  };

  // Adicione esta função auxiliar
  const reduceDataPoints = (data: ChartDataPoint[], maxPoints: number = 30) => {
    if (data.length <= maxPoints) return data;
    
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, index) => index % step === 0);
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

      const yearlyPoints = Object.entries(yearlyData).map(([year, points]) => {
        const sortedPoints = [...points].sort((a, b) => b.month - a.month);
        const lastMonthPoint = sortedPoints[0];

        return {
          ...lastMonthPoint,
          age: Math.floor(Number(lastMonthPoint.age)).toString()
        };
      });

      return reduceDataPoints(yearlyPoints);
    }
    
    // Get current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Find the current point in data
    const currentPoint = data.find(point => 
      point.year === currentYear && 
      point.month === currentMonth
    ) || data[0];

    if (!currentPoint) return data;

    const currentAge = Number(currentPoint.age);
    
    // Define time ranges based on zoom level
    const timeRanges = {
      '1y': { past: 0.5, future: 0.5 }, // 6 months back, 6 months forward
      '5y': { past: 1, future: 4 },     // 1 year back, 4 years forward
      '10y': { past: 2, future: 8 },    // 2 years back, 8 years forward
      'custom': customRange,             // Use custom range values
    }[zoomLevel];

    const filteredData = data.filter(point => {
      const pointAge = Number(point.age);
      return pointAge >= (currentAge - timeRanges.past) && 
             pointAge <= (currentAge + timeRanges.future);
    });

    // For 10y view, group by year as in 'all' mode
    if (zoomLevel === '10y') {
      const yearlyData = filteredData.reduce((acc: { [key: string]: ChartDataPoint[] }, point) => {
        const year = point.year.toString();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(point);
        return acc;
      }, {});

      const yearlyPoints = Object.entries(yearlyData).map(([year, points]) => {
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

      return reduceDataPoints(yearlyPoints);
    }

    // Reduz os pontos para visualizações mensais também
    return reduceDataPoints(filteredData);
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

  // Update the rawChartData generation to use projectionData if available
  const rawChartData = projectionData?.flatMap(yearData => 
    yearData.months?.map(monthData => ({
      age: yearData.age.toString(),
      year: yearData.year,
      month: monthData.month as MonthNumber,
      actualValue: monthData.balance,
      projectedValue: monthData.planned_balance,
      realDataPoint: monthData.isHistorical
    })) || []
  ) || generateChartProjections(
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

  // Define category names dynamically to ensure uniqueness
  const projectedName = showRealValues ? t('expenseChart.projectedValueReal') : t('expenseChart.projectedValue');
  const actualRealBaseName = showRealValues ? t('expenseChart.actualValueReal') : t('expenseChart.actualValue');
  const actualProjectedName = actualRealBaseName + ' (Projetado)';
  const actualRealName = actualRealBaseName;

  const colorOffset = () => {
    // Encontrar o ponto mais antigo com dados reais
    const oldestRealDataPoint = chartData.find(point => point.realDataPoint);
    if (!oldestRealDataPoint) return 0; // Se não houver pontos reais, tudo é projeção
    
    // Encontrar o ponto mais recente com dados reais
    const latestRealDataPoint = [...chartData].reverse().find(point => point.realDataPoint);
    if (!latestRealDataPoint) return 0;

    // Calcular o índice do último ponto real
    const lastRealIndex = chartData.findIndex(point => 
      point.year === latestRealDataPoint.year && 
      point.month === latestRealDataPoint.month
    );

    // Se não encontrou o índice (não deveria acontecer), retorna 0
    if (lastRealIndex === -1) return 0;
    
    // Calcular offset baseado na posição do último ponto real
    return (lastRealIndex + 1) / chartData.length;
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
      <div className="overflow-visible p-4">
        <Flex justifyContent="between" alignItems="center" className="mb-4">
          <div>
            <Title>{t('dashboard.charts.portfolioPerformance')}</Title>
            <Text>{showRealValues ? t('expenseChart.realValues') : t('expenseChart.nominalValues')}</Text>
          </div>
          
          <Flex className="gap-4">
            <ToggleGroup
              type="single"
              value={showRealValues ? "real" : "nominal"}
              onValueChange={(value) => setShowRealValues(value === "real")}
              className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-1"
            >
              <ToggleGroupItem 
                value="nominal" 
                aria-label={t('expenseChart.nominalValues')}
                className="px-3 py-1.5 text-sm font-medium data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900 rounded-md transition-colors"
              >
                {t('expenseChart.nominalValues')}
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="real" 
                aria-label={t('expenseChart.realValues')}
                className="px-3 py-1.5 text-sm font-medium data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900 rounded-md transition-colors"
              >
                {t('expenseChart.realValues')}
              </ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              type="single"
              value={zoomLevel}
              onValueChange={(value) => {
                // Only update if the value is valid and different from the current state
                if (value && value !== zoomLevel) {
                  setZoomLevel(value as ZoomLevel);
                }
              }}
              className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-1"
            >
              <ToggleGroupItem 
                value="1y" 
                aria-label={t('common.last1YearS')}
                className="px-3 py-1.5 text-sm font-medium data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900 rounded-md transition-colors"
              >
                {t('common.last1YearS')}
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="5y" 
                aria-label={t('common.last5YearsS')}
                className="px-3 py-1.5 text-sm font-medium data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900 rounded-md transition-colors"
              >
                {t('common.last5YearsS')}
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="10y" 
                aria-label={t('common.last10YearsS')}
                className="px-3 py-1.5 text-sm font-medium data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900 rounded-md transition-colors"
              >
                {t('common.last10YearsS')}
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="all" 
                aria-label={t('common.all')}
                className="px-3 py-1.5 text-sm font-medium data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900 rounded-md transition-colors"
              >
                {t('common.all')}
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="custom" 
                aria-label={t('common.custom')}
                className="px-3 py-1.5 text-sm font-medium data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900 rounded-md transition-colors"
              >
                {t('common.custom')}
              </ToggleGroupItem>
            </ToggleGroup>

            {zoomLevel === 'custom' && (
              <Flex className="items-center w-50 space-x-4">
                <div className="flex items-center">
                  <Text className="text-sm text-gray-600 shrink-0">{t('expenseChart.pastYears')}:</Text>
                  <NumberInput
                    className="w-20"
                    value={customRange.past}
                    onValueChange={(value) => {
                      const numValue = value ?? 0;
                      setCustomRange(prev => ({ ...prev, past: Math.max(0, numValue) }));
                    }}
                    min={0}
                    max={100}
                    step={0.5}
                    enableStepper={false}
                  />
                </div>
                <div className="flex items-center">
                  <Text className="text-sm text-gray-600 shrink-0">{t('expenseChart.futureYears')}:</Text>
                  <NumberInput
                    className="w-20"
                    value={customRange.future}
                    onValueChange={(value) => {
                      const numValue = value ?? 0;
                      setCustomRange(prev => ({ ...prev, future: Math.max(0, numValue) }));
                    }}
                    min={0}
                    max={100}
                    step={0.5}
                    enableStepper={false}
                  />
                </div>
              </Flex>
            )}
          </Flex>
        </Flex>

        <div className="relative">
          <AreaChart
            className="h-52"
            data={chartData.map((point, index, array) => {
              const nextPoint = index < array.length - 1 ? array[index + 1] : null;
              // Check if this point has goals or events
              const hasGoals = goals?.some(goal => 
                goal.year === point.year && (zoomLevel === 'all' || zoomLevel === '10y' ? true : goal.month === point.month)
              );
              const hasEvents = events?.some(event => 
                event.year === point.year && (zoomLevel === 'all' || zoomLevel === '10y' ? true : event.month === point.month)
              );
              
              return {
                xAxisLabel: point.xAxisLabel,
                [actualRealName]: point.realDataPoint ? Math.max(point.actualValue,0) : null, // Blue
                [projectedName]: Math.max(point.projectedValue,0), // Orange
                [actualProjectedName]: !nextPoint?.realDataPoint ? (Math.max(point?.actualValue,0)) : null, // sky
                hasGoals,
                hasEvents
              };
            })}
            index="xAxisLabel"
            categories={[
              actualRealName, // Blue
              projectedName, // Orange
              actualProjectedName, // Sky
            ]}
            minValue={0}
            colors={["blue", "orange", "sky"]}
            allowDecimals={true}
            valueFormatter={(value) => {
              if(value === 0) return '0 R$';
              if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}m`;
              return value.toString();
            }}
            showLegend
            showGridLines
            showTooltip
            connectNulls
            onValueChange={(value) => {
              if (value && value.xAxisLabel) {
                const point = chartData.find(p => p.xAxisLabel === value.xAxisLabel);
                if (point) {
                  handleChartClick(point as ChartPoint);
                }
              }
            }}
            customTooltip={({ payload, active }) => {
              if (!active || !payload || !payload.length) return null;
              
              const firstPayload = payload[0];
              if (!firstPayload || !firstPayload.payload) return null;
              
              const dataPoint = chartData.find(p => p.xAxisLabel === firstPayload.payload.xAxisLabel);
              if (!dataPoint) return null;

              // Find goals and events for this point
              const pointGoals = goals?.filter(goal => 
                goal.year === dataPoint.year && (zoomLevel === 'all' || zoomLevel === '10y' ? true : goal.month === dataPoint.month)
              );
              const pointEvents = events?.filter(event => 
                event.year === dataPoint.year && (zoomLevel === 'all' || zoomLevel === '10y' ? true : event.month === dataPoint.month)
              );

              return (
                <div className="bg-white p-2 border rounded shadow">
                  <p className="text-sm font-medium">
                    {zoomLevel === 'all' 
                      ? `${Math.floor(Number(dataPoint.age))} ${t('expenseChart.years')} (${dataPoint.year})`
                      : `${Math.floor(Number(dataPoint.age))} ${t('expenseChart.years')} (${t('monthlyView.table.months.' + new Date(0, dataPoint.month - 1).toLocaleString('default', { month: 'long' }))} ${dataPoint.year})`
                    }
                  </p>
                  {payload.map((entry, idx) => {
                    if (!entry || entry.value === undefined) return null;
                    return (
                      <p key={idx} className={`text-sm ${chartColors[entry.color as keyof typeof chartColors].text}`}>
                        {entry.name}: {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(entry.value as number)}
                      </p>
                    );
                  })}
                  {pointGoals && pointGoals.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm font-medium text-gray-700">{t('financialGoals.title')}:</p>
                      {pointGoals.map((goal, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {t('financialGoals.icons.' + goal.icon)}: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(goal.asset_value)}
                        </p>
                      ))}
                    </div>
                  )}
                  {pointEvents && pointEvents.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm font-medium text-gray-700">{t('events.title')}:</p>
                      {pointEvents.map((event, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {event.name}: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(event.amount)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>

      <ChartPointDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        selectedPoint={selectedPoint}
        dialogType={dialogType}
        onDialogTypeChange={setDialogType}
        onSubmitGoal={createGoal.mutate}
        onSubmitEvent={createEvent.mutate}
        onCancel={handleDialogClose}
      />
    </div>
  );
};
