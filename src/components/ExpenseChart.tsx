import { useTranslation } from "react-i18next";
import { ChartDataPoint, FinancialRecord, Goal, ProjectedEvent, MonthNumber, InvestmentPlan, Profile, FinancialItemFormValues } from '@/types/financial';
import { generateChartProjections, YearlyProjectionData } from '@/lib/chart-projections';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from '@/lib/financial-math';
import { ChartPointDialog } from "@/components/chart/ChartPointDialog";
import { TrendingUp, HelpCircle } from "lucide-react";
import type { ViewBox } from 'recharts/types/util/types';
import { CurrencyCode } from "@/utils/currency";
import { Switch } from "@/components/ui/switch";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { EditFinancialItemDialog } from "@/components/chart/EditFinancialItemDialog";
import PatrimonialProjectionChart from "./monthlyData"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"

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
  type: 'goal';
  name: string;
  icon: string;
  asset_value: string;
  month: string;
  year: string;
  payment_mode: 'none' | 'installment' | 'repeat';
  installment_count?: string;
  installment_interval?: string;
}

interface EventFormValues {
  type: 'event';
  name: string;
  icon: string;
  asset_value: string;
  month: string;
  year: string;
  payment_mode: 'none' | 'installment' | 'repeat';
  installment_count?: string;
  installment_interval?: string;
}

interface IconProps {
  viewBox?: ViewBox;
}

/**
 * Obtém os dados brutos do gráfico, usando projeções se disponíveis ou gerando-as.
 * @param projectionData Projeções anuais, se disponíveis
 * @param profile Perfil do usuário
 * @param investmentPlan Plano de investimento
 * @param allFinancialRecords Todos os registros financeiros
 * @param goals Metas financeiras
 * @param events Eventos projetados
 * @returns Array de ChartDataPoint
 */
function getRawChartData({
  projectionData,
  profile,
  investmentPlan,
  allFinancialRecords,
  goals,
  events
}: {
  projectionData?: YearlyProjectionData[]
  profile: Profile
  investmentPlan: InvestmentPlan
  allFinancialRecords: FinancialRecord[]
  goals?: Goal[]
  events?: ProjectedEvent[]
}): ChartDataPoint[] {
  if (projectionData) {
    return projectionData.flatMap(yearData =>
      yearData.months?.map(monthData => ({
        age: yearData.age.toString(),
        year: yearData.year,
        month: monthData.month as MonthNumber,
        actualValue: monthData.balance,
        projectedValue: monthData.planned_balance,
        realDataPoint: monthData.isHistorical
      })) || []
    )
  }
  return generateChartProjections(
    profile,
    investmentPlan,
    allFinancialRecords,
    goals,
    events
  )
}

/**
 * Ajusta os valores do gráfico para inflação e negativos, conforme as opções do usuário.
 * @param data Dados brutos do gráfico
 * @param showRealValues Se deve ajustar para valores reais (inflação)
 * @param showNegativeValues Se deve mostrar valores negativos
 * @param baseYear Ano base para ajuste
 * @param baseMonth Mês base para ajuste
 * @param investmentPlan Plano de investimento
 * @param allFinancialRecords Todos os registros financeiros
 * @returns Array ajustado de ChartDataPoint
 */
function adjustChartData({
  data,
  showRealValues,
  showNegativeValues,
  baseYear,
  baseMonth,
  investmentPlan,
  allFinancialRecords
}: {
  data: ChartDataPoint[]
  showRealValues: boolean
  showNegativeValues: boolean
  baseYear: number
  baseMonth: number
  investmentPlan: InvestmentPlan
  allFinancialRecords: FinancialRecord[]
}): ChartDataPoint[] {
  function calculateInflationAdjustedValue(
    value: number | null | undefined,
    baseYear: number,
    baseMonth: number,
    targetYear: number,
    targetMonth: number,
    monthlyInflationRate: number
  ): number | null | undefined {
    if (value === null || value === undefined) return value;
    const monthsDiff = (targetYear - baseYear) * 12 + (targetMonth - baseMonth);
    if (monthsDiff <= 0) {
      const recordsBetween = allFinancialRecords.filter(record => {
        const recordToTargetMonthDiff = (record.record_year - targetYear) * 12 + (record.record_month - targetMonth);
        return recordToTargetMonthDiff < 0;
      });
      const inflationFactor = 1 + (calculateCompoundedRates(recordsBetween.map(record => record.target_rentability/100)) || 1);
      if (inflationFactor !== 1) return value / inflationFactor;
      return value;
    }
    return value / Math.pow(1 + monthlyInflationRate, monthsDiff);
  }
  const monthlyInflation = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
  return data.map(point => {
    if (!showRealValues) {
      return {
        ...point,
        actualValue: showNegativeValues ? point.actualValue : Math.max(0, point.actualValue),
        projectedValue: showNegativeValues ? point.projectedValue : Math.max(0, point.projectedValue),
      }
    }
    const adjustedActualValue = point.realDataPoint
      ? point.actualValue
      : calculateInflationAdjustedValue(
          point.actualValue,
          baseYear,
          baseMonth,
          point.year,
          point.month,
          monthlyInflation
        );
    const adjustedProjectedValue = calculateInflationAdjustedValue(
      point.projectedValue,
      baseYear,
      baseMonth,
      point.year,
      point.month,
      monthlyInflation
    );
    return {
      ...point,
      actualValue: showNegativeValues ? adjustedActualValue : Math.max(0, adjustedActualValue),
      projectedValue: showNegativeValues ? adjustedProjectedValue : Math.max(0, adjustedProjectedValue),
    }
  })
}

/**
 * Reduz o número de pontos do gráfico para evitar sobrecarga visual.
 * @param data Array de ChartDataPoint
 * @param maxPoints Número máximo de pontos
 * @returns Array reduzido de ChartDataPoint
 */
function reduceDataPoints(data: ChartDataPoint[], maxPoints: number = 30) {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
}

/**
 * Aplica o zoom (recorte temporal) nos dados do gráfico, agrupando por ano se necessário.
 * @param data Dados ajustados do gráfico
 * @param zoomLevel Nível de zoom selecionado
 * @param customRange Range customizado (se aplicável)
 * @returns Array de ChartDataPoint filtrado
 */
function getZoomedChartData({
  data,
  zoomLevel,
  customRange
}: {
  data: ChartDataPoint[]
  zoomLevel: ZoomLevel
  customRange: { past: number, future: number }
}): ChartDataPoint[] {
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
  const [showNegativeValues, setShowNegativeValues] = useState<boolean>(false);
  const [customRange, setCustomRange] = useState<{ past: number, future: number }>({ past: 1, future: 1 });
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Goal | ProjectedEvent | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Add query for financial goals
  const { data: goals } = useQuery<Goal[]>({
    queryKey: ["financial-goals", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("profile_id", clientId)
        .order("year", { ascending: true })
        .order("month", { ascending: true });

      if (error) throw error;
      // add type to each goal
      return data.map(goal => ({ ...goal, type: 'goal' }));
    },
  });

  const { data: events } = useQuery<ProjectedEvent[]>({
    queryKey: ["events", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("profile_id", clientId)

      if (error) throw error;
      // add type to each event
      return data.map(event => ({ ...event, type: 'event' }));
    },
  });

  // Add mutations for creating goals and events
  const createGoal = useMutation({
    mutationFn: async (values: GoalFormValues) => {
      const { data, error } = await supabase.from("financial_goals").insert([
        {
          profile_id: clientId,
          icon: values.icon,
          name: values.name,
          asset_value: parseFloat(values.asset_value.replace(/[^\d.,]/g, '').replace(',', '.')),
          month: parseInt(values.month),
          year: parseInt(values.year),
          payment_mode: values.payment_mode,
          installment_count: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_count || "0") : null,
          installment_interval: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_interval || "1") : null,
          status: 'pending',
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
      queryClient.invalidateQueries({ queryKey: ["counters"] });
      setShowDialog(false);
      setSelectedPoint(null);
      onProjectionDataChange?.();
    },
  });

  const createEvent = useMutation({
    mutationFn: async (values: EventFormValues) => {
      const cleanAmount = values.asset_value
        .replace(/[R$\s]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

      const amount = parseFloat(cleanAmount);

      const { data, error } = await supabase.from("events").insert([
        {
          profile_id: clientId,
          name: values.name,
          icon: values.icon,
          asset_value: amount,
          month: parseInt(values.month),
          year: parseInt(values.year),
          payment_mode: values.payment_mode,
          installment_count: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_count || "0") : null,
          installment_interval: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_interval || "1") : null,
          status: 'pending'
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["counters"] });
      setShowDialog(false);
      setSelectedPoint(null);
      onProjectionDataChange?.();
    },
  });

  // Add mutation for updating goals
  const updateGoal = useMutation({
    mutationFn: async (values: FinancialItemFormValues) => {
      const { data, error } = await supabase
        .from("financial_goals")
        .update({
          name: values.name,
          icon: values.icon,
          asset_value: parseFloat(values.asset_value.replace(/[^\d.,]/g, '').replace(',', '.')),
          month: parseInt(values.month),
          year: parseInt(values.year),
          payment_mode: values.payment_mode,
          installment_count: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_count || "0") : null,
          installment_interval: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_interval || "1") : null,
        })
        .eq('id', selectedItem?.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
      queryClient.invalidateQueries({ queryKey: ["counters"] });
      setShowEditDialog(false);
      setSelectedItem(null);
      onProjectionDataChange?.();
    },
  });

  // Add mutation for updating events
  const updateEvent = useMutation({
    mutationFn: async (values: FinancialItemFormValues) => {
      const cleanAmount = values.asset_value
        .replace(/[R$\s]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

      const amount = parseFloat(cleanAmount);

      const { data, error } = await supabase
        .from("events")
        .update({
          name: values.name,
          icon: values.icon,
          asset_value: amount,
          month: parseInt(values.month),
          year: parseInt(values.year),
          payment_mode: values.payment_mode,
          installment_count: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_count || "0") : null,
          installment_interval: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_interval || "1") : null,
        })
        .eq('id', selectedItem?.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["counters"] });
      setShowEditDialog(false);
      setSelectedItem(null);
      onProjectionDataChange?.();
    },
  });

  const handleDialogClose = () => {
    setShowDialog(false);
    setSelectedPoint(null);
  };

  const handleEditItem = (item: Goal | ProjectedEvent) => {
    setSelectedItem(item);
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (values: FinancialItemFormValues) => {
    if (!selectedItem) return;

    if (selectedItem.type === 'goal') {
      await updateGoal.mutateAsync(values);
    } else if (selectedItem.type === 'event') {
      await updateEvent.mutateAsync(values);
    }
    console.log('error on update', values);
  };

  if (!profile || !investmentPlan || !clientId || !allFinancialRecords) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  const formatXAxisLabel = (point: ChartDataPoint) => {
    if (zoomLevel === 'all' || zoomLevel === '10y') {
      return Math.floor(Number(point.age)).toString();
    }
    
    const monthName = new Date(0, point.month - 1).toLocaleString('default', { month: 'short' });
    return `${Math.floor(Number(point.age))}/${monthName}`;
  };

  // --- PREPARAÇÃO DOS DADOS DO GRÁFICO ---
  // 1. Obtenha os dados brutos
  const rawChartData = getRawChartData({
    projectionData,
    profile,
    investmentPlan,
    allFinancialRecords,
    goals,
    events
  })

  // 2. Ajuste para inflação/negativos
  const adjustedChartData = adjustChartData({
    data: rawChartData,
    showRealValues,
    showNegativeValues,
    baseYear: 2024,
    baseMonth: 1,
    investmentPlan,
    allFinancialRecords
  })

  // 3. Aplique o zoom
  const chartData = getZoomedChartData({
    data: adjustedChartData,
    zoomLevel,
    customRange
  }).map(point => ({
    ...point,
    xAxisLabel: formatXAxisLabel(point)
  }))

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          {t('dashboard.charts.portfolioPerformance')}
        </h2>
        
        <div className="flex flex-wrap items-center gap-4">
          <Dialog open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('expenseChart.advancedOptions')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-2">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('expenseChart.valueType')}</div>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1} type="button">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="max-w-xs">
                        <p className="text-sm text-gray-600">
                          {t('expenseChart.advancedOptionsHelp')}
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{showRealValues ? t('expenseChart.realValues') : t('expenseChart.nominalValues')}</span>
                    <Switch
                      checked={showRealValues}
                      onCheckedChange={setShowRealValues}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{t('expenseChart.display')}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{t('expenseChart.noNegativeValues')}</span>
                    <Switch
                      checked={!showNegativeValues}
                      onCheckedChange={v => setShowNegativeValues(!v)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium" type="button">{t('common.cancel')}</button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
            <button
              onClick={() => setZoomLevel('custom')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === 'custom' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('common.custom')}
            </button>
            {zoomLevel === 'custom' && (
              <div className="flex items-center gap-2 ml-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">{t('expenseChart.pastYears')}:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customRange.past.toString()}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setCustomRange(prev => ({ 
                        ...prev, 
                        past: value 
                      }));
                    }}
                    step="any"
                    className="w-20 px-2 py-1 text-sm border rounded-md"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">{t('expenseChart.futureYears')}:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customRange.future.toString()}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setCustomRange(prev => ({ 
                        ...prev, 
                        future: value 
                      }));
                    }}
                    step="any"
                    className="w-20 px-2 py-1 text-sm border rounded-md"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="ml-4 pl-4 border-l border-gray-200">
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(true)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                showAdvancedOptions
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('expenseChart.advancedOptions')}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PatrimonialProjectionChart
          monthlyData={chartData.map((d) => ({
            age: d.age,
            year: d.year,
            month: d.month,
            actualValue: d.actualValue,
            projectedValue: d.projectedValue,
            realDataPoint: d.realDataPoint,
          }))}
          objectives={[
            ...(goals?.map(goal => ({
              asset_value: goal.asset_value,
              name: goal.name,
              created_at: new Date(goal.year, goal.month - 1, 1).toISOString(),
              icon: goal.icon,
              id: goal.id,
              installment_count: goal.installment_count ?? 1,
              installment_interval: goal.installment_interval ?? 1,
              payment_mode: goal.payment_mode ?? 'none',
              type: 'goal' as const,
            })) || []),
            ...(events?.map(event => ({
              asset_value: event.asset_value,
              name: event.name,
              created_at: new Date(event.year, event.month - 1, 1).toISOString(),
              icon: event.icon,
              id: event.id,
              installment_count: event.installment_count ?? 1,
              installment_interval: event.installment_interval ?? 1,
              payment_mode: event.payment_mode ?? 'none',
              type: 'event' as const,
            })) || []),
          ]}
          selectedYears={Array.from(new Set(chartData.map(d => d.year)))}
          showNominalValues={!showRealValues}
          hideNegativeValues={!showNegativeValues}
          handleEditItem={(item) => {
            // Try to find the matching goal or event by id
            const foundGoal = goals?.find(g => g.id === item.id)
            if (foundGoal) return handleEditItem(foundGoal)
            const foundEvent = events?.find(e => e.id === item.id)
            if (foundEvent) return handleEditItem(foundEvent)
          }}
          onSubmitGoal={createGoal.mutateAsync}
          onSubmitEvent={createEvent.mutateAsync}
          currency={investmentPlan.currency}
          birthDate={profile.birth_date}
          zoomLevel={zoomLevel}
          width="100%"
          height={500}
        />
      </div>

      <ChartPointDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        selectedPoint={selectedPoint}
        currency={investmentPlan?.currency as CurrencyCode}
        onSubmitGoal={createGoal.mutateAsync}
        onSubmitEvent={createEvent.mutateAsync}
        onCancel={handleDialogClose}
        type={'goal'}
      />

      <EditFinancialItemDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        item={selectedItem}
        currency={investmentPlan?.currency as CurrencyCode}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};
