import { useTranslation } from "react-i18next";
import { ChartDataPoint, FinancialRecord, MonthNumber, InvestmentPlan, Profile } from '@/types/financial';
import { generateChartProjections, YearlyProjectionData } from '@/lib/chart-projections';
import { useState, useEffect } from "react";
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from '@/lib/financial-math';
import { calculateInflationAdjustedValue, getInvestmentPlanBaseDate } from '@/lib/inflation-utils';
import { TrendingUp, Settings } from "lucide-react";
import PatrimonialProjectionChart from "@/components/chart/PatrimonialProjectionChart"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  allFinancialRecords
}: {
  profile: Profile
  investmentPlan: InvestmentPlan
  allFinancialRecords: FinancialRecord[]
}): ChartDataPoint[] {
  return generateChartProjections(
    profile,
    investmentPlan,
    allFinancialRecords,
    [], // No goals for simulation
    []  // No events for simulation
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
  const monthlyInflation = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
  return data.map(point => {
    if (!showRealValues) {
      return {
        ...point,
        actualValue: showNegativeValues ? point.actualValue : Math.max(0, point.actualValue),
        projectedValue: showNegativeValues ? point.projectedValue : Math.max(0, point.projectedValue),
        oldPortfolioValue: point.oldPortfolioValue ? (showNegativeValues ? point.oldPortfolioValue : Math.max(0, point.oldPortfolioValue)) : null,
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
          monthlyInflation,
          allFinancialRecords
        );
    const adjustedProjectedValue = calculateInflationAdjustedValue(
      point.projectedValue,
      baseYear,
      baseMonth,
      point.year,
      point.month,
      monthlyInflation,
      allFinancialRecords
    );
    const adjustedOldPortfolioValue = calculateInflationAdjustedValue(
      point.oldPortfolioValue,
      baseYear,
      baseMonth,
      point.year,
      point.month,
      monthlyInflation,
      allFinancialRecords
    );
    return {
      ...point,
      actualValue: showNegativeValues ? adjustedActualValue : Math.max(0, adjustedActualValue),
      projectedValue: showNegativeValues ? adjustedProjectedValue : Math.max(0, adjustedProjectedValue),
      oldPortfolioValue: point.oldPortfolioValue ? (showNegativeValues ? adjustedOldPortfolioValue : Math.max(0, adjustedOldPortfolioValue)) : null,
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
  onFormDataChange
}: SimulationChartProps) => {
  const { t } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('all');
  const [customRange, setCustomRange] = useState<{ past: number, future: number }>({ past: 1, future: 1 });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showRealValues, setShowRealValues] = useState(false);
  const [showNegativeValues, setShowNegativeValues] = useState(false);
  const [showOldPortfolio, setShowOldPortfolio] = useState(false);

  // Auto-activate showOldPortfolio when hasOldPortfolio is enabled
  useEffect(() => {
    if (formData.hasOldPortfolio && !showOldPortfolio) {
      setShowOldPortfolio(true);
    }
  }, [formData.hasOldPortfolio, showOldPortfolio]);

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
  // 1. Obtenha os dados brutos
  const rawChartData = getRawChartData({
    profile,
    investmentPlan,
    allFinancialRecords
  })

  // 2. Ajuste para inflação/negativos
  const { baseYear, baseMonth } = getInvestmentPlanBaseDate(investmentPlan);
  
  const adjustedChartData = adjustChartData({
    data: rawChartData,
    showRealValues,
    showNegativeValues,
    baseYear,
    baseMonth,
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {t('expenseChart.advancedOptions')}
          </Button>
        </div>

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

      {/* Advanced Options */}
      {showAdvancedOptions && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('expenseChart.chartOptions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showRealValues"
                    checked={showRealValues}
                    onCheckedChange={setShowRealValues}
                  />
                  <Label htmlFor="showRealValues">{t('expenseChart.showRealValues')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showNegativeValues"
                    checked={showNegativeValues}
                    onCheckedChange={setShowNegativeValues}
                  />
                  <Label htmlFor="showNegativeValues">{t('expenseChart.showNegativeValues')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showOldPortfolio"
                    checked={showOldPortfolio}
                    onCheckedChange={(checked) => {
                      setShowOldPortfolio(checked);
                      // Se estiver ativando e não tem carteira anterior configurada, ativa automaticamente
                      if (checked && !formData.hasOldPortfolio) {
                        onFormDataChange('hasOldPortfolio', true);
                        onFormDataChange('oldPortfolioProfitability', '3'); // Valor padrão
                      }
                    }}
                    disabled={!formData.hasOldPortfolio}
                  />
                  <Label htmlFor="showOldPortfolio" className={!formData.hasOldPortfolio ? "text-muted-foreground" : ""}>
                    {t('expenseChart.showOldPortfolio')}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('investmentPlan.form.advancedSettings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="adjustContributionForInflation"
                    checked={formData.adjustContributionForInflation}
                    onCheckedChange={(checked) => onFormDataChange('adjustContributionForInflation', checked)}
                  />
                  <Label htmlFor="adjustContributionForInflation">
                    {t('investmentPlan.form.adjustContributionForInflation')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="adjustIncomeForInflation"
                    checked={formData.adjustIncomeForInflation}
                    onCheckedChange={(checked) => onFormDataChange('adjustIncomeForInflation', checked)}
                  />
                  <Label htmlFor="adjustIncomeForInflation">
                    {t('investmentPlan.form.adjustIncomeForInflation')}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
          investmentPlan={investmentPlan}
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
