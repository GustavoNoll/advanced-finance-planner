import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Label } from 'recharts';
import { useTranslation } from "react-i18next";
import { ChartDataPoint, FinancialRecord, Goal, ProjectedEvent, MonthNumber, InvestmentPlan, Profile, FinancialItemFormValues } from '@/types/financial';
import { generateChartProjections, YearlyProjectionData } from '@/lib/chart-projections';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from '@/lib/financial-math';
import { ChartPointDialog } from "@/components/chart/ChartPointDialog";
import { TrendingUp, Car, Home, Plane, GraduationCap, User, AlertCircle, Calendar, Users, Laptop, BookOpen, Briefcase, Heart, Target, Banknote, Info, HelpCircle } from "lucide-react";
import type { ViewBox } from 'recharts/types/util/types';
import { CurrencyCode, formatCurrency, getCurrencySymbol } from "@/utils/currency";
import { Switch } from "@/components/ui/switch";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { EditFinancialItemDialog } from "@/components/chart/EditFinancialItemDialog";

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

const isCartesianViewBox = (viewBox: ViewBox | undefined): viewBox is { x: number; y: number } => {
  return (
    viewBox !== undefined &&
    'x' in viewBox &&
    'y' in viewBox &&
    typeof viewBox.x === 'number' &&
    typeof viewBox.y === 'number'
  );
};

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

  const handleChartClick = (data: ChartPoint) => {
    setSelectedPoint(data);
    setShowDialog(true);
  };

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

  // Apply adjustments based on showRealValues and showNegativeValues settings
  const adjustedChartData = showRealValues 
    ? rawChartData.map(point => {
        const adjustedActualValue = point.realDataPoint 
          ? point.actualValue
          : calculateInflationAdjustedValue(
              point.actualValue, 
              baseYear, 
              baseMonth, 
              point.year, 
              point.month, 
              yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100)
            );

        const adjustedProjectedValue = calculateInflationAdjustedValue(
          point.projectedValue, 
          baseYear, 
          baseMonth, 
          point.year, 
          point.month, 
          yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100)
        );

        return {
          ...point,
          actualValue: showNegativeValues ? adjustedActualValue : Math.max(0, adjustedActualValue),
          projectedValue: showNegativeValues ? adjustedProjectedValue : Math.max(0, adjustedProjectedValue),
        };
      })
    : rawChartData.map(point => ({
        ...point,
        actualValue: showNegativeValues ? point.actualValue : Math.max(0, point.actualValue),
        projectedValue: showNegativeValues ? point.projectedValue : Math.max(0, point.projectedValue),
      }));

  // Get final data with zoom applied
  const chartData = getZoomedData(adjustedChartData).map(point => ({
    ...point,
    xAxisLabel: formatXAxisLabel(point)
  }));

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

  const renderGoalIcon = (props: IconProps, goal?: Goal) => {
    if (!isCartesianViewBox(props.viewBox) || !goal) return null;
    
    const { viewBox: { x, y } } = props;
    const iconSize = 20;
    
    const getIcon = () => {
      switch (goal.icon) {
        case 'house':
          return <Home size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
        case 'car':
          return <Car size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
        case 'travel':
          return <Plane size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
        case 'family':
          return <Users size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
        case 'electronic':
          return <Laptop size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
        case 'education':
          return <GraduationCap size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
        case 'hobby':
          return <BookOpen size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
        case 'professional':
          return <Briefcase size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
        case 'health':
          return <Heart size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
        default:
          return <Target size={iconSize} className="text-red-500 group-hover:text-red-600 transition-colors" />;
      }
    };

    const formattedAmount = formatCurrency(goal.asset_value, investmentPlan?.currency as CurrencyCode);
    const monthName = new Date(0, goal.month - 1).toLocaleString('pt-BR', { month: 'long' });

    return (
      <g 
        transform={`translate(${x}, ${y})`}
        className="group cursor-pointer"
        onClick={() => handleEditItem(goal)}
        onMouseEnter={(e) => {
          e.stopPropagation();
          const tooltip = document.querySelector('.recharts-tooltip-wrapper');
          if (tooltip) {
            tooltip.setAttribute('style', 'display: none !important');
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          const tooltip = document.querySelector('.recharts-tooltip-wrapper');
          if (tooltip) {
            tooltip.setAttribute('style', 'position: absolute; pointer-events: none; visibility: visible; z-index: 10; transition: visibility 0s linear 0s, opacity 0.3s linear 0s; opacity: 1; top: 0px; left: 0px; transform: translate3d(0px, 0px, 0px);');
          }
        }}
      >
        <circle
          cx={0}
          cy={0}
          r={iconSize/2 + 4}
          fill="white"
          opacity="0.8"
          className="shadow-sm group-hover:shadow-md transition-all"
        />
        <g transform={`translate(${-iconSize/2}, ${-iconSize/2})`} className="transition-transform duration-200 group-hover:scale-110">
          {getIcon()}
        </g>
        <g transform="translate(0, -60)" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <foreignObject
            x={-100}
            y={100}
            width={200}
            height={50}
            style={{ overflow: 'visible', pointerEvents: 'auto' }}
            onMouseEnter={e => e.stopPropagation()}
            onMouseMove={e => e.stopPropagation()}
          >
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
              <div className="text-sm font-medium text-blue-600 mb-1">
                {t('financialGoals.title')}: {goal.name}
              </div>
              <div className="text-lg font-semibold text-red-600 mb-2">
                {t('common.value')}: {formattedAmount}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {t(`financialGoals.icons.${goal.icon}`)}
              </div>
              <div className="text-sm text-gray-600">
                {t('monthlyView.table.headers.month')}: {monthName}
              </div>
              <div className="text-sm text-gray-600">
                {t('financialRecords.form.year')}: {goal.year}
              </div>
              {(goal.payment_mode === 'installment' || goal.payment_mode === 'repeat') && (
                <>
                  <div className="text-sm text-blue-600 mt-1">
                    {goal.payment_mode === 'installment' ? t('financialGoals.form.installmentCount') : t('events.form.repeatCount')}: {goal.installment_count}x {goal.installment_interval > 1 ? t('common.every') + ' ' + goal.installment_interval + ' ' + t('common.months') : ''}
                  </div>
                </>
              )}
            </div>
          </foreignObject>
        </g>
      </g>
    );
  };

  const renderEventIcon = (props: IconProps, event?: ProjectedEvent) => {
    if (!isCartesianViewBox(props.viewBox) || !event) return null;
    
    const { viewBox: { x, y } } = props;
    const iconSize = 20;
    
    // Determine icon color based on asset value
    const iconColor = event.asset_value >= 0 ? 'text-green-500 group-hover:text-green-600' : 'text-red-500 group-hover:text-red-600';
    
    const getIcon = () => {
      switch (event.icon) {
        case 'goal':
          return <Target size={iconSize} className={`${iconColor} transition-colors`} />;
        case 'contribution':
          return <Banknote size={iconSize} className={`${iconColor} transition-colors`} />;
        default:
          return <Calendar size={iconSize} className={`${iconColor} transition-colors`} />;
      }
    };

    const formattedAmount = formatCurrency(event.asset_value, investmentPlan?.currency as CurrencyCode);
    const monthName = new Date(0, event.month - 1).toLocaleString('pt-BR', { month: 'long' });

    return (
      <g 
        transform={`translate(${x}, ${y})`}
        className="group cursor-pointer"
        onClick={() => handleEditItem(event)}
        onMouseEnter={(e) => {
          e.stopPropagation();
          const tooltip = document.querySelector('.recharts-tooltip-wrapper');
          if (tooltip) {
            tooltip.setAttribute('style', 'display: none !important');
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          const tooltip = document.querySelector('.recharts-tooltip-wrapper');
          if (tooltip) {
            tooltip.setAttribute('style', 'position: absolute; pointer-events: none; visibility: visible; z-index: 10; transition: visibility 0s linear 0s, opacity 0.3s linear 0s; opacity: 1; top: 0px; left: 0px; transform: translate3d(0px, 0px, 0px);');
          }
        }}
      >
        <circle
          cx={0}
          cy={0}
          r={iconSize/2 + 4}
          fill="white"
          opacity="0.8"
          className="shadow-sm group-hover:shadow-md transition-all"
        />
        <g transform={`translate(${-iconSize/2}, ${-iconSize/2})`} className="transition-transform duration-200 group-hover:scale-110">
          {getIcon()}
        </g>
        <g transform="translate(0, -60)" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <foreignObject
            x={-100}
            y={100}
            width={200}
            height={120}
            style={{ overflow: 'visible', pointerEvents: 'auto' }}
            onMouseEnter={e => e.stopPropagation()}
            onMouseMove={e => e.stopPropagation()}
          >
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
              <div className={`text-sm font-medium ${event.asset_value >= 0 ? 'text-green-600' : 'text-red-600'} mb-1`}>
                {t('events.title')}: {event.name}
              </div>
              <div className={`text-lg font-semibold ${event.asset_value >= 0 ? 'text-green-600' : 'text-red-600'} mb-2`}>
                {t('common.value')}: {formattedAmount}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {event.name}
              </div>
              <div className="text-sm text-gray-600">
                {t('monthlyView.table.headers.month')}: {monthName}
              </div>
              <div className="text-sm text-gray-600">
                {t('financialRecords.form.year')}: {event.year}
              </div>
              {(event.payment_mode === 'installment' || event.payment_mode === 'repeat') && (
                <div className="text-sm text-blue-600 mt-1">
                  {event.payment_mode === 'installment' ? t('financialGoals.form.installmentCount') : t('events.form.repeatCount')}: {event.installment_count}x {event.installment_interval > 1 ? t('common.every') + ' ' + event.installment_interval + ' ' + t('common.months') : ''}
                </div>
              )}
            </div>
          </foreignObject>
        </g>
      </g>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          {t('dashboard.charts.portfolioPerformance')}
        </h2>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Inflation adjustment toggle */}
          <div className="inline-flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">{t('expenseChart.nominalValues')}</span>
              <Switch
                checked={showRealValues}
                onCheckedChange={setShowRealValues}
                className="data-[state=checked]:bg-blue-400"
              />
              <span className="text-sm font-medium text-gray-600">{t('expenseChart.realValues')}</span>
            </div>

            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="max-w-xs">
                <p className="text-sm text-gray-600">
                  {showRealValues 
                    ? t('expenseChart.realValuesTooltip')
                    : t('expenseChart.nominalValuesTooltip')}
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Negative values toggle */}
          <div className="inline-flex items-center">
            <button
              onClick={() => setShowNegativeValues(!showNegativeValues)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
                showNegativeValues 
                  ? 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100' 
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              {showNegativeValues ? (
                <span>{t('expenseChart.showNegativeValues')}</span>
              ) : (
                <>
                  <span>{t('expenseChart.hideNegativeValues')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
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
          </div>

          {/* Custom range inputs */}
          {zoomLevel === 'custom' && (
            <div className="flex items-center gap-2">
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
      </div>

      <ResponsiveContainer 
        width="100%" 
        height={500}
        key={`${JSON.stringify(chartData)}-${showRealValues}`}
      >
        <LineChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 50, bottom: 25 }}
          onClick={(data) => data && data.activePayload && handleChartClick(data.activePayload[0].payload)}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
              <stop offset={offset} stopColor="#2563eb" /> {/* blue-600 */}
              <stop offset={offset} stopColor="#93c5fd" /> {/* blue-300 */}
            </linearGradient>
            <linearGradient id="colorProjected" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} /> {/* orange-500 */}
              <stop offset="100%" stopColor="#fb923c" stopOpacity={0.8} /> {/* orange-400 */}
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="2" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid 
            strokeDasharray="5 5" 
            stroke="#e5e7eb" 
            strokeOpacity={1}
            vertical={false}
            horizontal={true}
          />
          <XAxis 
            dataKey="xAxisLabel"
            interval={zoomLevel === 'all' || zoomLevel === '10y' ? 'preserveStartEnd' : 3}
            label={{ 
              value: t('expenseChart.years'), 
              position: 'bottom', 
              offset: 0,
              style: { 
                fill: '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '500'
              }
            }}
            tick={{ 
              fill: '#6b7280',
              fontSize: '0.75rem'
            }}
            axisLine={{ 
              stroke: '#e5e7eb',
              strokeWidth: 2
            }}
          />
          <YAxis 
            tickCount={6}
            tickFormatter={(value) => 
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: investmentPlan?.currency as CurrencyCode,
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value)
            }
            tick={{ 
              fill: '#6b7280',
              fontSize: '0.75rem'
            }}
            axisLine={{ 
              stroke: '#e5e7eb',
              strokeWidth: 2
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              padding: '0.75rem',
            }}
            formatter={(value: number, name: string, props: { color?: string }) => [
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ 
                    background: name === t('expenseChart.actualValue') || name === t('expenseChart.actualValueReal') ? 
                              'linear-gradient(to right, #3b82f6, #60a5fa)' :
                              'linear-gradient(to right, #f97316, #fb923c)'
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm font-medium">{name}</span>
                  <span className={`text-gray-900 font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {value < 0 && '-'}{formatCurrency(Math.abs(value), investmentPlan?.currency as CurrencyCode)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t('expenseChart.lifetimeIncome')}: {formatCurrency((value * (investmentPlan.expected_return/100))/12, investmentPlan?.currency as CurrencyCode)}/{t('common.perMonth')}
                  </span>
                </div>
              </div>
            ]}
            labelFormatter={(label) => {
              const dataPoint = chartData.find(point => point.xAxisLabel === label);
              if (!dataPoint) return '';

              if (zoomLevel === 'all') {
                return `${Math.floor(Number(dataPoint.age))} ${t('expenseChart.years')} (${dataPoint.year})${
                  showRealValues ? ` - ${t('expenseChart.realValues')}` : ''
                }`;
              }

              const monthName = new Date(0, dataPoint.month - 1).toLocaleString('en-US', { month: 'long' }).toLowerCase();
              const wholeAge = Math.floor(Number(dataPoint.age));
              
              return `${wholeAge} ${t('expenseChart.years')} (${t('monthlyView.table.months.' + monthName)} ${dataPoint.year})${
                showRealValues ? ` - ${t('expenseChart.realValues')}` : ''
              }`;
            }}
            labelStyle={{
              color: '#1f2937',
              fontWeight: '600',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
            }}
            itemStyle={{
              color: '#374151',
              fontSize: '0.875rem',
              padding: '0.25rem 0',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ 
              paddingTop: '20px',
              bottom: 0
            }}
            formatter={(value) => (
              <span className="text-sm font-medium text-gray-600">{value}</span>
            )}
          />

          {/* Update reference lines for goals */}
          {goals?.sort((a, b) => a.year - b.year)
            .reduce((acc: React.ReactNode[], goal) => {
              const achievementPoint = chartData.find(point => {
                if (zoomLevel === 'all' || zoomLevel === '10y') {
                  if (chartData.length > 1) { 
                    const yearDiff = chartData[1].year - chartData[0].year;
                    const halfYearDiff = yearDiff / 2;
                    return Math.abs(point.year - goal.year) <= halfYearDiff;
                  }
                  return point.year === goal.year;
                } else {
                  if (chartData.length > 1) {
                    const monthDiff = chartData[1].month - chartData[0].month;
                    const halfMonthDiff = monthDiff / 2;
                    return point.year === goal.year && Math.abs(point.month - goal.month) <= halfMonthDiff;
                  }
                  return point.year === goal.year && point.month === goal.month;
                }
              });
              
              if (achievementPoint) {
                acc.push(
                  <ReferenceLine
                    key={`${goal.id}-actual`}
                    x={achievementPoint.xAxisLabel}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                    strokeOpacity={0.3}
                    ifOverflow="extendDomain"
                    label={{
                      position: 'top',
                      content: (props) => renderGoalIcon(props, goal)
                    }}
                  />
                );
              }
              return acc;
            }, [])}

          {events?.sort((a, b) => a.year - b.year)
            .reduce((acc: React.ReactNode[], event) => {
              const achievementPoint = chartData.find(point => {
                if (zoomLevel === 'all' || zoomLevel === '10y') {
                  if (chartData.length > 1) {
                    const yearDiff = chartData[1].year - chartData[0].year;
                    const halfYearDiff = yearDiff / 2;
                    return Math.abs(point.year - event.year) <= halfYearDiff;
                  }
                  return point.year === event.year;
                } else {
                  if (chartData.length > 1) {
                    const monthDiff = chartData[1].month - chartData[0].month;
                    const halfMonthDiff = monthDiff / 2;
                    return point.year === event.year && Math.abs(point.month - event.month) <= halfMonthDiff;
                  }
                  return point.year === event.year && point.month === event.month;
                }
              });

              if (achievementPoint) {
                acc.push(
                  <ReferenceLine
                    key={event.id}
                    x={achievementPoint.xAxisLabel}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                    strokeOpacity={0.3}
                    ifOverflow="extendDomain"
                    label={{
                      position: 'top',
                      content: (props) => renderEventIcon(props, event)
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
            strokeWidth={3}
            connectNulls
            dot={false}
            activeDot={{ 
              r: 8, 
              strokeWidth: 2,
              stroke: '#3b82f6',
              fill: 'white',
              filter: 'url(#shadow)'
            }}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        
          <Line 
            type="natural"
            dataKey="projectedValue" 
            stroke="url(#colorProjected)"
            name={showRealValues ? t('expenseChart.projectedValueReal') : t('expenseChart.projectedValue')}
            strokeWidth={3}
            strokeDasharray="8 8"
            connectNulls
            dot={false}
            activeDot={{ 
              r: 8, 
              strokeWidth: 2,
              stroke: '#f97316',
              fill: 'white',
              filter: 'url(#shadow)'
            }}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>

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
