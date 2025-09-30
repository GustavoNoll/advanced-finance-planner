import { useTranslation } from "react-i18next";
import { ChartDataPoint, FinancialRecord, InvestmentPlan, Profile } from '@/types/financial';
import { ChartOptions, generateChartProjections } from '@/lib/chart-projections';
import { useState, useEffect } from "react";
import PatrimonialProjectionChart from "@/components/chart/PatrimonialProjectionChart";
import { createDateWithoutTimezone, createDateFromYearMonth } from '@/utils/dateUtils';

interface SimulationFormData {
  initialAmount: string;
  monthlyDeposit: string;
  desiredIncome: string;
  expectedReturn: string;
  inflation: string;
  planType: string;
  planInitialDate: string;
  birthDate: string;
  finalAge: string;
  currency: string;
  adjustContributionForInflation: boolean;
  adjustIncomeForInflation: boolean;
  hasOldPortfolio: boolean;
  oldPortfolioProfitability: string;
}

interface SimulationChartProps {
  investmentPlan: InvestmentPlan;
  clientId: string;
  allFinancialRecords: FinancialRecord[];
  profile: Profile;
  formData: SimulationFormData;
  onFormDataChange: (field: keyof SimulationFormData, value: string | boolean) => void;
  rawChartData: ChartDataPoint[];
  chartOptions: ChartOptions;
}

// Update the zoom level type to include custom
type ZoomLevel = '1y' | '5y' | '10y' | 'all' | 'custom';

/**
 * Obtém os dados brutos do gráfico, usando projeções se disponíveis ou gerando-as.
 * @param profile Perfil do usuário
 * @param investmentPlan Plano de investimento
 * @param allFinancialRecords Todos os registros financeiros
 * @returns Array de ChartDataPoint
 */
function getRawChartData({
  profile,
  investmentPlan,
  allFinancialRecords,
  chartOptions
}: {
  profile: Profile
  investmentPlan: InvestmentPlan
  allFinancialRecords: FinancialRecord[]
  chartOptions: ChartOptions
}): ChartDataPoint[] {
  return generateChartProjections(
    profile,
    investmentPlan,
    allFinancialRecords,
    [], // No goals for simulation
    [],  // No events for simulation
    chartOptions
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
  chartOptions
}: {
  data: ChartDataPoint[]
  chartOptions: ChartOptions
}): ChartDataPoint[] {
  return data.map(point => {
    return {
      ...point,
      actualValue: chartOptions.showNegativeValues ? point.actualValue : Math.max(0, point.actualValue),
      projectedValue: chartOptions.showNegativeValues ? point.projectedValue : Math.max(0, point.projectedValue),
      oldPortfolioValue: point.oldPortfolioValue ? (chartOptions.showNegativeValues ? point.oldPortfolioValue : Math.max(0, point.oldPortfolioValue)) : null,
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
  const currentDate = createDateWithoutTimezone(new Date());
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

export const SimulationChart = ({ 
  profile, 
  investmentPlan, 
  clientId, 
  allFinancialRecords,
  formData,
  onFormDataChange,
  rawChartData,
  chartOptions: externalChartOptions
}: SimulationChartProps) => {
  const { t } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('all');
  const [customRange, setCustomRange] = useState<{ past: number, future: number }>({ past: 1, future: 1 });
  const [showRealValues, setShowRealValues] = useState(externalChartOptions.showRealValues || false);
  const [showNegativeValues, setShowNegativeValues] = useState(externalChartOptions.showNegativeValues || false);
  const [showOldPortfolio, setShowOldPortfolio] = useState(externalChartOptions.showOldPortfolio || false);

  // Auto-activate showOldPortfolio when hasOldPortfolio is enabled
  useEffect(() => {
    if (formData.hasOldPortfolio && !showOldPortfolio) {
      setShowOldPortfolio(true);
    }
  }, [formData.hasOldPortfolio, showOldPortfolio]);

  // Sync local state with external chart options
  useEffect(() => {
    setShowRealValues(externalChartOptions.showRealValues || false);
    setShowNegativeValues(externalChartOptions.showNegativeValues || false);
    setShowOldPortfolio(externalChartOptions.showOldPortfolio || false);
  }, [externalChartOptions]);

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
    
    const monthName = createDateFromYearMonth(2000, point.month).toLocaleString('default', { month: 'short' });
    return `${Math.floor(Number(point.age))}/${monthName}`;
  };

  // --- PREPARAÇÃO DOS DADOS DO GRÁFICO ---
  // 1. Use os dados brutos fornecidos
  const rawChartDataToUse = rawChartData;

  // 2. Ajuste para inflação/negativos
  const adjustedChartData = adjustChartData({
    data: rawChartDataToUse,
    chartOptions: {
      showRealValues,
      showNegativeValues,
      showOldPortfolio
    }
  });

  // 3. Aplique o zoom
  const chartData = getZoomedChartData({
    data: adjustedChartData,
    zoomLevel,
    customRange
  }).map(point => ({
    ...point,
    xAxisLabel: formatXAxisLabel(point)
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center rounded-md border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-900/80">
            <button
              onClick={() => setZoomLevel('1y')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === '1y' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.last1YearS')}
            </button>
            <button
              onClick={() => setZoomLevel('5y')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === '5y' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.last5YearsS')}
            </button>
            <button
              onClick={() => setZoomLevel('10y')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === '10y' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.last10YearsS')}
            </button>
            <button
              onClick={() => setZoomLevel('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === 'all' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.all')}
            </button>
            <button
              onClick={() => setZoomLevel('custom')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === 'custom' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
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
        </div>
      </div>

      <div className="mt-8">
        <PatrimonialProjectionChart
          monthlyData={chartData.map((d) => ({
            age: d.age,
            year: d.year,
            month: d.month,
            actualValue: 0, // No real data in simulation
            projectedValue: d.projectedValue,
            oldPortfolioValue: d.oldPortfolioValue,
            realDataPoint: false, // No real data points in simulation
          }))}
          objectives={[]} // No objectives for simulation
          selectedYears={Array.from(new Set(chartData.map(d => d.year)))}
          showNominalValues={!showRealValues}
          hideNegativeValues={!showNegativeValues}
          showOldPortfolio={showOldPortfolio}
          showProjectedLine={externalChartOptions.showProjectedLine ?? true}
          showPlannedLine={externalChartOptions.showPlannedLine ?? false}
          investmentPlan={investmentPlan}
          activeMicroPlan={null} // No active micro plan in simulation
          handleEditItem={() => {}} // No edit functionality in simulation
          onSubmitGoal={() => Promise.resolve()} // No submit functionality in simulation
          onSubmitEvent={() => Promise.resolve()} // No submit functionality in simulation
          currency={investmentPlan.currency}
          birthDate={profile.birth_date}
          zoomLevel={zoomLevel}
          width="100%"
          height={500}
          isSimulation={true}
        />
      </div>
    </div>
  );
};
