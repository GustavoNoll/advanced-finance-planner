import { useTranslation } from "react-i18next"
import { MonthNumber, Profile } from '@/types/financial'
import { InvestmentPlan, MicroInvestmentPlan } from '@/types/financial/investment-plans'
import { FinancialItemFormValues, Goal } from '@/types/financial/goals-events'
import { ProjectedEvent } from '@/types/financial/goals-events'
import { ChartDataPoint, FinancialRecord }  from '@/types/financial/financial-records'
import { generateChartProjections, YearlyProjectionData } from '@/lib/chart-projections'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { GoalsEventsService } from "@/features/goals-events/services/goals-events.service"
import { useState } from "react";
import { ChartPointDialog } from "@/shared/components/chart/ChartPointDialog";
import { TrendingUp } from "lucide-react";
import type { ViewBox } from 'recharts/types/util/types';
import { CurrencyCode } from "@/utils/currency";
import { EditFinancialItemDialog } from "@/shared/components/chart/EditFinancialItemDialog";
import PatrimonialProjectionChart from "@/shared/components/chart/PatrimonialProjectionChart"
import { toast } from '@/shared/components/ui/use-toast'
import { buttonSelectedGreen } from '@/lib/gradient-classes'

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
  activeMicroPlan: MicroInvestmentPlan | null;
  microPlans: MicroInvestmentPlan[];
  clientId: string;
  allFinancialRecords: FinancialRecord[];
  profile: Profile;
  projectionData?: YearlyProjectionData[];
  onProjectionDataChange?: () => void;
  showRealValues?: boolean;
  showNegativeValues?: boolean;
  showOldPortfolio?: boolean;
  showProjectedLine?: boolean;
  showPlannedLine?: boolean;
  onOpenAdvancedOptions?: () => void;
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
  adjust_for_inflation: boolean;
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
  adjust_for_inflation: boolean;
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
  activeMicroPlan,
  microPlans,
  allFinancialRecords,
  goals,
  events
}: {
  projectionData?: YearlyProjectionData[]
  profile: Profile
  investmentPlan: InvestmentPlan
  activeMicroPlan: MicroInvestmentPlan | null
  microPlans: MicroInvestmentPlan[]
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
        oldPortfolioValue: monthData.old_portfolio_balance,
        realDataPoint: monthData.isHistorical
      })) || []
    )
  }
  
  // Criar um plano combinado com dados do micro plano ativo
  const combinedPlan = activeMicroPlan ? {
    ...investmentPlan,
    monthly_deposit: activeMicroPlan.monthly_deposit,
    desired_income: activeMicroPlan.desired_income,
    expected_return: activeMicroPlan.expected_return,
    inflation: activeMicroPlan.inflation
  } : investmentPlan

  return generateChartProjections(
    profile,
    combinedPlan,
    allFinancialRecords,
    goals,
    events,
    undefined, // chartOptions
    microPlans
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
  showNegativeValues,
}: {
  data: ChartDataPoint[]
  showNegativeValues: boolean
}): ChartDataPoint[] {
  return data.map(point => {
    return {
      ...point,
      actualValue: showNegativeValues ? point.actualValue : Math.max(0, point.actualValue),
      projectedValue: showNegativeValues ? point.projectedValue : Math.max(0, point.projectedValue),
      oldPortfolioValue: point.oldPortfolioValue ? (showNegativeValues ? point.oldPortfolioValue : Math.max(0, point.oldPortfolioValue)) : null,
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

export function ExpenseChart({ 
  profile, 
  investmentPlan, 
  activeMicroPlan,
  microPlans,
  clientId, 
  allFinancialRecords,
  projectionData,
  onProjectionDataChange,
  showRealValues = false,
  showNegativeValues = false,
  showOldPortfolio = false,
  showProjectedLine = true,
  showPlannedLine = true,
  onOpenAdvancedOptions
}: ExpenseChartProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('all');
  

  const [customRange, setCustomRange] = useState<{ past: number, future: number }>({ past: 1, future: 1 });
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Goal | ProjectedEvent | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  
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
      const amount = parseFloat(values.asset_value.replace(/[^\d.,]/g, '').replace(',', '.'))
      const created = await GoalsEventsService.createItem('goal', {
        profile_id: clientId,
        icon: values.icon,
        name: values.name,
        asset_value: amount,
        month: parseInt(values.month),
        year: parseInt(values.year),
        payment_mode: values.payment_mode,
        installment_count: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_count || '0') : null,
        installment_interval: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_interval || '1') : null,
        adjust_for_inflation: values.adjust_for_inflation ?? true,
      })
      return created
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
      queryClient.invalidateQueries({ queryKey: ["counters"] });
      setShowDialog(false);
      setSelectedPoint(null);
      onProjectionDataChange?.();
      toast({ title: t('financialGoals.messages.createSuccess') })
    },
    onError: () => {
      toast({ title: t('financialGoals.messages.createError'), variant: 'destructive' })
    }
  });

  const createEvent = useMutation({
    mutationFn: async (values: EventFormValues) => {
      const amount = parseFloat(values.asset_value.replace(/[^\d.,]/g, '').replace(',', '.'))
      const created = await GoalsEventsService.createItem('event', {
        profile_id: clientId,
        name: values.name,
        icon: values.icon,
        asset_value: amount,
        month: parseInt(values.month),
        year: parseInt(values.year),
        payment_mode: values.payment_mode,
        installment_count: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_count || '0') : null,
        installment_interval: values.payment_mode === 'installment' || values.payment_mode === 'repeat' ? parseInt(values.installment_interval || '1') : null,
        adjust_for_inflation: values.adjust_for_inflation ?? true,
      })
      return created
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["counters"] });
      setShowDialog(false);
      setSelectedPoint(null);
      onProjectionDataChange?.();
      toast({ title: t('events.messages.createSuccess') })
    },
    onError: () => {
      toast({ title: t('events.messages.createError'), variant: 'destructive' })
    }
  });

  // Add mutation for deleting events
  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["counters"] });
      setShowEditDialog(false);
      setSelectedItem(null);
      toast({ title: t('events.messages.deleteSuccess') })
    },
    onError: () => {
      toast({ title: t('events.messages.deleteError'), variant: 'destructive' })
    }
  });

  // Add mutation for deleting goals
  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from("financial_goals")
        .delete()
        .eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
      queryClient.invalidateQueries({ queryKey: ["counters"] });
      setShowEditDialog(false);
      setSelectedItem(null);
      toast({ title: t('financialGoals.messages.deleteSuccess') })
    },
    onError: () => {
      toast({ title: t('financialGoals.messages.deleteError'), variant: 'destructive' })
    }
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
          adjust_for_inflation: values.adjust_for_inflation ?? true,
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
          adjust_for_inflation: values.adjust_for_inflation ?? true,
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
    activeMicroPlan,
    microPlans,
    allFinancialRecords,
    goals,
    events
  })

  const adjustedChartData = adjustChartData({
    data: rawChartData,
    showNegativeValues,
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
          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          {t('dashboard.charts.portfolioPerformance')}
        </h2>
        
        <div className="flex flex-wrap items-center gap-4">

          <div className="inline-flex items-center rounded-md border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-900/80">
            <button
              onClick={() => setZoomLevel('1y')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                zoomLevel === '1y' 
                  ? buttonSelectedGreen
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.last1YearS')}
            </button>
            <button
              onClick={() => setZoomLevel('5y')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                zoomLevel === '5y' 
                  ? buttonSelectedGreen
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.last5YearsS')}
            </button>
            <button
              onClick={() => setZoomLevel('10y')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                zoomLevel === '10y' 
                  ? buttonSelectedGreen
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.last10YearsS')}
            </button>
            <button
              onClick={() => setZoomLevel('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                zoomLevel === 'all' 
                  ? buttonSelectedGreen
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.all')}
            </button>
            <button
              onClick={() => setZoomLevel('custom')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                zoomLevel === 'custom' 
                  ? buttonSelectedGreen
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.custom')}
            </button>
            {zoomLevel === 'custom' && (
              <div className="flex items-center gap-2 ml-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-300">{t('expenseChart.pastYears')}:</label>
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
                    className="w-20 px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-300">{t('expenseChart.futureYears')}:</label>
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
                    className="w-20 px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
            )}
          </div>
          {onOpenAdvancedOptions && (
            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onOpenAdvancedOptions}
                className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {t('expenseChart.advancedOptions')}
              </button>
            </div>
          )}
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
            oldPortfolioValue: d.oldPortfolioValue,
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
          showOldPortfolio={showOldPortfolio}
          showProjectedLine={showProjectedLine}
          showPlannedLine={showPlannedLine}
          investmentPlan={investmentPlan}
          activeMicroPlan={activeMicroPlan}
          handleEditItem={(item) => {
            // Try to find the matching goal or event by id
            const foundGoal = goals?.find(g => g.id === item.id)
            if (foundGoal) return handleEditItem(foundGoal)
            const foundEvent = events?.find(e => e.id === item.id)
            if (foundEvent) return handleEditItem(foundEvent)
          }}
          onSubmitGoal={async (values) => {
            await createGoal.mutateAsync(values);
          }}
          onSubmitEvent={async (values) => {
            await createEvent.mutateAsync(values);
          }}
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
        onSubmitGoal={async (values) => {
          await createGoal.mutateAsync(values);
        }}
        onSubmitEvent={async (values) => {
          await createEvent.mutateAsync(values);
        }}
        onCancel={handleDialogClose}
        type={'goal'}
        planInitialDate={investmentPlan?.plan_initial_date}
        limitAge={investmentPlan?.limit_age}
        birthDate={profile?.birth_date}
      />

      <EditFinancialItemDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        item={selectedItem}
        currency={investmentPlan?.currency as CurrencyCode}
        onSubmit={handleEditSubmit}
        planInitialDate={investmentPlan?.plan_initial_date}
        limitAge={investmentPlan?.limit_age}
        birthDate={profile?.birth_date}
        onDelete={selectedItem ? async () => {
          if (!selectedItem) return;
          if (selectedItem.type === 'goal') {
            await deleteGoal.mutateAsync(selectedItem.id as string)
          } else if (selectedItem.type === 'event') {
            await deleteEvent.mutateAsync(selectedItem.id as string)
          }
        } : undefined}
      />
    </div>
  )
}
