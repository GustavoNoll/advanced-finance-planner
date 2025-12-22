import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { PerformanceData } from "@/types/financial"
import { calculateCompoundReturn, shouldExcludeFromReturnCalculation, calculateWeightedReturnForPeriod } from "@/utils/portfolio-returns"
import { useTranslation } from "react-i18next"
import { 
  calculateBenchmarkReturnsByAssetClass,
  groupStrategyName, 
  getStrategyColor,
  getStrategyOrder,
  STRATEGY_ORDER,
  type GroupedStrategyKey,
  type BenchmarkType
} from "@/utils/benchmark-calculator"
import { translateGroupedStrategy } from "@/utils/i18n-helpers"
import { isValidAssetClass, type ValidAssetClass } from "@/pages/performance/utils/valid-asset-classes"
import { useMemo, useCallback, Fragment } from "react"
import { useCurrency } from "@/contexts/CurrencyContext"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface InvestmentDetailsTableProps {
  performanceData: PerformanceData[]
}

/**
 * Converts a period string (MM/YYYY) to a timestamp for sorting
 */
function periodToTimestamp(period?: string | null): number {
  if (!period) return 0
  const [month, year] = period.split('/')
  return new Date(parseInt(year), parseInt(month) - 1).getTime()
}



export function InvestmentDetailsTable({ performanceData }: InvestmentDetailsTableProps) {
  const { t } = useTranslation()
  const { currency, adjustReturnWithFX, convertValue, formatCurrency } = useCurrency()
  const currentLocale = currency === 'BRL' ? 'pt-BR' : 'en-US'
  
  /**
   * Traduz uma chave de estratégia agrupada usando i18n
   * Todas as traduções estão em portfolioPerformance.common.*
   */
  const translateGroupedStrategyMemo = useCallback((key: GroupedStrategyKey): string => {
    return translateGroupedStrategy(key, t)
  }, [t])

  /**
   * Agrupa e traduz o nome de uma estratégia
   */
  const groupStrategy = useCallback((strategy: string | null): string => {
    const groupedKey = groupStrategyName(strategy)
    return translateGroupedStrategyMemo(groupedKey)
  }, [translateGroupedStrategyMemo])

  /**
   * Obtém a ordem de uma estratégia traduzida
   */
  const getStrategyOrderForName = useCallback((strategyName: string): number => {
    for (const key of STRATEGY_ORDER) {
      if (t(`portfolioPerformance.common.${key}`) === strategyName) {
        return getStrategyOrder(key)
      }
    }
    return STRATEGY_ORDER.length // Put unknown strategies at the end
  }, [t])

  /**
   * Obtém a cor de uma estratégia traduzida
   */
  const getStrategyColorForName = useCallback((strategyName: string): string => {
    for (const key of STRATEGY_ORDER) {
      if (t(`portfolioPerformance.common.${key}`) === strategyName) {
        return getStrategyColor(key, true) // Use soft colors for this component
      }
    }
    return getStrategyColor('others', true)
  }, [t])
  
  // Find the most recent period from performance data
  const mostRecentPeriod = useMemo(() => {
    const uniquePeriods = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])]
    const sortedPeriods = uniquePeriods.sort((a, b) => periodToTimestamp(a) - periodToTimestamp(b))
    return [...sortedPeriods].sort((a, b) => periodToTimestamp(b) - periodToTimestamp(a))[0]
  }, [performanceData])

  // Filter to most recent period for snapshot calculations
  const mostRecentData = useMemo(() => {
    return performanceData.filter(d => d.period === mostRecentPeriod)
  }, [performanceData, mostRecentPeriod])

  // Build strategy snapshot from most recent period
  const strategySnapshot = useMemo(() => {
    return mostRecentData.reduce((acc, item) => {
      const originalStrategy = item.asset_class || null
      const groupedStrategy = groupStrategy(originalStrategy)
      if (!acc[groupedStrategy]) acc[groupedStrategy] = { name: groupedStrategy, value: 0, count: 0 }
      // Convert position to display currency
      const originalCurrency = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
      const position = Number(item.position || 0)
      const positionConverted = convertValue(position, item.period || '', originalCurrency)
      acc[groupedStrategy].value += positionConverted
      acc[groupedStrategy].count += 1
      return acc
    }, {} as Record<string, { name: string; value: number; count: number }>)
  }, [mostRecentData, groupStrategy, convertValue])

  // Calculate total patrimony for percentage calculations
  const totalPatrimonio = useMemo(() => {
    return Object.values(strategySnapshot).reduce((sum, item) => sum + item.value, 0)
  }, [strategySnapshot])

  /**
   * Calculates returns for a specific strategy across different time periods
   */
  const calculateStrategyReturns = useCallback((strategy: string) => {
    const allStrategyData = performanceData.filter(p => 
      groupStrategy(p.asset_class || null) === strategy
    )
    if (allStrategyData.length === 0) return { month: 0, year: 0, sixMonths: 0, twelveMonths: 0, inception: 0 }

    // Group by period and calculate weighted average return per period
    const byPeriod = allStrategyData.reduce((acc, item) => {
      const key = item.period || ''
      if (!key) return acc
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {} as Record<string, PerformanceData[]>)

    const periodList = Object.keys(byPeriod).sort((a, b) => periodToTimestamp(a) - periodToTimestamp(b))
    if (periodList.length === 0) return { month: 0, year: 0, sixMonths: 0, twelveMonths: 0, inception: 0 }

    // Calculate weighted returns for each period with FX adjustment
    // Exclude Caixa, Proventos, and Cash from return calculations
    const weightedReturns = periodList.map(period => {
      const items = byPeriod[period]
      const { weightedReturn, totalPosition } = 
        calculateWeightedReturnForPeriod(items, period, convertValue, adjustReturnWithFX)
      const r = totalPosition > 0 ? weightedReturn / totalPosition : 0
      return { period, r }
    })

    const lastPeriod = periodList[periodList.length - 1]
    const month = weightedReturns.find(w => w.period === lastPeriod)?.r || 0

    // Year return: compound return for the year of the most recent period
    const lastYear = lastPeriod?.slice(3)
    const yearReturns = weightedReturns.filter(w => w.period.endsWith(lastYear)).map(w => w.r)
    const year = calculateCompoundReturn(yearReturns)

    // Last 6 and 12 months (by available periods)
    const last6 = weightedReturns.slice(-6).map(w => w.r)
    const last12 = weightedReturns.slice(-12).map(w => w.r)
    const sixMonths = calculateCompoundReturn(last6)
    const twelveMonths = calculateCompoundReturn(last12)

    // Inception return: compound return since first period
    const inception = calculateCompoundReturn(weightedReturns.map(w => w.r))

    return { month, year, sixMonths, twelveMonths, inception }
  }, [performanceData, groupStrategy, convertValue, adjustReturnWithFX])

  // Consolidate strategy data with returns and benchmarks
  const consolidated = useMemo(() => {
    return Object.values(strategySnapshot)
      .map((item, index) => {
        const perf = calculateStrategyReturns(item.name)
        
        // Get all assets for this strategy
        const strategyAssets = performanceData.filter(p => 
          groupStrategy(p.asset_class || null) === item.name
        )
        
        // Get unique periods for this strategy
        const strategyPeriods = [...new Set(
          strategyAssets
            .map(p => p.period)
            .filter(Boolean) as string[]
        )]
        
        // Get the first asset's original class to calculate benchmark
        const firstAssetClass = strategyAssets
          .map(p => p.asset_class)
          .find(Boolean) || null
        
        // Determine locale based on the currency prop
        const benchmarkLocale: 'pt-BR' | 'en-US' = currency === 'BRL' ? 'pt-BR' : 'en-US'
        
        // Calculate benchmark returns directly from asset class if it's a standardized key
        // Otherwise fallback to grouped key (for backward compatibility)
        const benchmark = firstAssetClass && isValidAssetClass(firstAssetClass)
          ? calculateBenchmarkReturnsByAssetClass(
              firstAssetClass as ValidAssetClass,
              currency,
              strategyPeriods,
              benchmarkLocale
            )
          : null
        
        return {
          ...item,
          percentage: totalPatrimonio > 0 ? (item.value / totalPatrimonio) * 100 : 0,
          monthReturn: perf.month * 100,
          yearReturn: perf.year * 100,
          sixMonthsReturn: perf.sixMonths * 100,
          twelveMonthsReturn: perf.twelveMonths * 100,
          inceptionReturn: perf.inception * 100,
          benchmark,
        }
      })
      .sort((a, b) => {
        const orderA = getStrategyOrderForName(a.name)
        const orderB = getStrategyOrderForName(b.name)
        if (orderA !== orderB) {
          return orderA - orderB
        }
        return a.name.localeCompare(b.name)
      })
  }, [strategySnapshot, totalPatrimonio, performanceData, groupStrategy, getStrategyOrderForName, calculateStrategyReturns, currency])

  /**
   * Gets color class based on return performance thresholds
   */
  function getPerformanceColor(returnValue: number): string {
    if (returnValue > 2) return 'text-green-600 dark:text-green-500'
    if (returnValue > 0.5) return 'text-black-600 dark:text-black-500'
    if (returnValue > 0) return 'text-yellow-600 dark:text-yellow-500'
    return 'text-red-600 dark:text-red-500'
  }

  /**
   * Gets color class comparing strategy return to benchmark
   * Green if above benchmark, red if below
   */
  function getStrategyColorComparedToBenchmark(strategyReturn: number, benchmarkReturn: number | null): string {
    if (benchmarkReturn === null) {
      // If no benchmark, use default color based on value
      return getPerformanceColor(strategyReturn)
    }
    // Green if greater than or equal to benchmark, red if below
    return strategyReturn >= benchmarkReturn
      ? 'text-green-600 dark:text-green-500'
      : 'text-red-600 dark:text-red-500'
  }

  // Benchmark color is always neutral (foreground)
  const benchmarkColor = 'text-foreground'

  /**
   * Calcula o valor do benchmark a ser exibido
   * Para CDI: retorna o percentual do CDI (retorno estratégia / retorno CDI * 100)
   * Para outros benchmarks: retorna a diferença (retorno estratégia - retorno benchmark)
   */
  function calculateBenchmarkDisplayValue(
    strategyReturn: number,
    benchmarkReturn: number | null,
    benchmarkType: BenchmarkType
  ): number | null {
    if (benchmarkReturn === null) return null
    
    if (benchmarkType === 'CDI') {
      // Para CDI, calcula o percentual: estratégia / CDI * 100
      if (benchmarkReturn === 0) return null
      return (strategyReturn / benchmarkReturn) * 100
    } else {
      // Para outros benchmarks, calcula a diferença: estratégia - benchmark
      return strategyReturn - benchmarkReturn
    }
  }

  /**
   * Formata o valor do benchmark para exibição
   */
  function formatBenchmarkValue(value: number | null, benchmarkType: BenchmarkType): string {
    if (value === null) return '-'
    
    if (benchmarkType === 'CDI') {
      // Para CDI, mostra como percentual sem sinal de +/-
      return `${value.toFixed(2)}%`
    } else {
      // Para outros benchmarks, mostra a diferença com sinal
      return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
    }
  }

  /**
   * Obtém a cor baseada no valor calculado do benchmark
   * Para CDI: sempre cor neutra (sem cor)
   * Para outros: verde se >= 0, vermelho se < 0
   */
  function getBenchmarkDisplayColor(value: number | null, benchmarkType: BenchmarkType): string {
    if (value === null) return benchmarkColor
    
    if (benchmarkType === 'CDI') {
      // CDI sempre sem cor
      return benchmarkColor
    } else {
      return value >= 0
        ? 'text-green-600 dark:text-green-500'
        : 'text-red-600 dark:text-red-500'
    }
  }

  /**
   * Renderiza um valor de retorno com ícone e cor apropriados
   */
  function renderReturnValue(value: number): React.ReactNode {
    const isPositive = value > 0
    const isNegative = value < 0
    const color = isPositive 
      ? 'text-green-600 dark:text-green-500' 
      : isNegative 
        ? 'text-red-600 dark:text-red-500' 
        : 'text-foreground'
    
    return (
      <div className={`flex items-center justify-center gap-1 ${color}`}>
        {isPositive && <TrendingUp className="w-4 h-4" />}
        {isNegative && <TrendingDown className="w-4 h-4" />}
        {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
        <span className="font-semibold">
          {value >= 0 ? '+' : ''}{value.toFixed(2)}%
        </span>
      </div>
    )
  }

  /**
   * Visualização em cards
   */
  function renderVisualView() {
    if (consolidated.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-12">
          {t('portfolioPerformance.kpi.investmentDetails.noData')}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {consolidated.map(item => {
          const strategyColor = getStrategyColorForName(item.name)
          
          return (
            <Card 
              key={item.name}
              className="bg-gradient-to-br from-white/95 to-slate-50/90 dark:from-gray-900/90 dark:to-slate-800/70 border border-gray-200/50 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: strategyColor }} 
                    />
                    <CardTitle className="text-base font-semibold text-foreground">
                      {item.name}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {formatCurrency(item.value)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Retornos da Carteira */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    {t('portfolioPerformance.kpi.investmentDetails.yourPortfolio')}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('portfolioPerformance.kpi.investmentDetails.month')}
                      </div>
                      {renderReturnValue(item.monthReturn)}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('portfolioPerformance.kpi.investmentDetails.year')}
                      </div>
                      {renderReturnValue(item.yearReturn)}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('portfolioPerformance.kpi.investmentDetails.sixMonths')}
                      </div>
                      {renderReturnValue(item.sixMonthsReturn)}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('portfolioPerformance.kpi.investmentDetails.twelveMonths')}
                      </div>
                      {renderReturnValue(item.twelveMonthsReturn)}
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('portfolioPerformance.kpi.investmentDetails.inception')}
                      </div>
                      {renderReturnValue(item.inceptionReturn)}
                    </div>
                  </div>
                </div>

                {/* Comparação com Benchmark */}
                {item.benchmark && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      {t('portfolioPerformance.kpi.investmentDetails.comparison')} {(() => {
                        const translatedName = t(item.benchmark.nameKey)
                        return translatedName
                      })()}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {t('portfolioPerformance.kpi.investmentDetails.month')}
                        </div>
                        <div className="text-sm">
                          {(() => {
                            const displayValue = calculateBenchmarkDisplayValue(
                              item.monthReturn,
                              item.benchmark.monthReturn,
                              item.benchmark.benchmarkType
                            )
                            return (
                              <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                                {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                              </span>
                            )
                          })()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {t('portfolioPerformance.kpi.investmentDetails.year')}
                        </div>
                        <div className="text-sm">
                          {(() => {
                            const displayValue = calculateBenchmarkDisplayValue(
                              item.yearReturn,
                              item.benchmark.yearReturn,
                              item.benchmark.benchmarkType
                            )
                            return (
                              <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                                {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                              </span>
                            )
                          })()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {t('portfolioPerformance.kpi.investmentDetails.sixMonths')}
                        </div>
                        <div className="text-sm">
                          {(() => {
                            const displayValue = calculateBenchmarkDisplayValue(
                              item.sixMonthsReturn,
                              item.benchmark.sixMonthsReturn,
                              item.benchmark.benchmarkType
                            )
                            return (
                              <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                                {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                              </span>
                            )
                          })()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {t('portfolioPerformance.kpi.investmentDetails.twelveMonths')}
                        </div>
                        <div className="text-sm">
                          {(() => {
                            const displayValue = calculateBenchmarkDisplayValue(
                              item.twelveMonthsReturn,
                              item.benchmark.twelveMonthsReturn,
                              item.benchmark.benchmarkType
                            )
                            return (
                              <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                                {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                              </span>
                            )
                          })()}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-muted-foreground mb-1">
                          {t('portfolioPerformance.kpi.investmentDetails.inception')}
                        </div>
                        <div className="text-sm">
                          {(() => {
                            const displayValue = calculateBenchmarkDisplayValue(
                              item.inceptionReturn,
                              item.benchmark.inceptionReturn,
                              item.benchmark.benchmarkType
                            )
                            return (
                              <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                                {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                              </span>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  /**
   * Visualização em tabela
   */
  function renderTableView() {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-muted-foreground">{t('portfolioPerformance.kpi.investmentDetails.strategy')}</TableHead>
              <TableHead className="text-muted-foreground text-center">{t('portfolioPerformance.kpi.investmentDetails.month')}</TableHead>
              <TableHead className="text-muted-foreground text-center">{t('portfolioPerformance.kpi.investmentDetails.year')}</TableHead>
              <TableHead className="text-muted-foreground text-center">{t('portfolioPerformance.kpi.investmentDetails.sixMonths')}</TableHead>
              <TableHead className="text-muted-foreground text-center">{t('portfolioPerformance.kpi.investmentDetails.twelveMonths')}</TableHead>
              <TableHead className="text-muted-foreground text-center">{t('portfolioPerformance.kpi.investmentDetails.inception')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consolidated.length > 0 ? (
              consolidated.map(item => (
                <Fragment key={item.name}>
                  <TableRow className="border-border/50">
                    <TableCell className="font-medium text-foreground flex items-center gap-2 py-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStrategyColorForName(item.name) }} />
                      {item.name}
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <span className="text-foreground">
                        {item.monthReturn >= 0 ? '+' : ''}{item.monthReturn.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <span className="text-foreground">
                        {item.yearReturn >= 0 ? '+' : ''}{item.yearReturn.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <span className="text-foreground">
                        {item.sixMonthsReturn >= 0 ? '+' : ''}{item.sixMonthsReturn.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <span className="text-foreground">
                        {item.twelveMonthsReturn >= 0 ? '+' : ''}{item.twelveMonthsReturn.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <span className="text-foreground">
                        {item.inceptionReturn >= 0 ? '+' : ''}{item.inceptionReturn.toFixed(2)}%
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-muted/20">
                    <TableCell className="font-medium text-muted-foreground pl-8 py-1">
                      {item.benchmark 
                        ? (() => {
                            const prefix = item.benchmark.benchmarkType === 'CDI' ? '%' : '±'
                            const translatedName = t(item.benchmark.nameKey)
                            return `${prefix} ${translatedName}`
                          })()
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground py-1">
                      {item.benchmark ? (() => {
                        const displayValue = calculateBenchmarkDisplayValue(
                          item.monthReturn,
                          item.benchmark.monthReturn,
                          item.benchmark.benchmarkType
                        )
                        return (
                          <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                            {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                          </span>
                        )
                      })() : '-'}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground py-1">
                      {item.benchmark ? (() => {
                        const displayValue = calculateBenchmarkDisplayValue(
                          item.yearReturn,
                          item.benchmark.yearReturn,
                          item.benchmark.benchmarkType
                        )
                        return (
                          <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                            {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                          </span>
                        )
                      })() : '-'}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground py-1">
                      {item.benchmark ? (() => {
                        const displayValue = calculateBenchmarkDisplayValue(
                          item.sixMonthsReturn,
                          item.benchmark.sixMonthsReturn,
                          item.benchmark.benchmarkType
                        )
                        return (
                          <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                            {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                          </span>
                        )
                      })() : '-'}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground py-1">
                      {item.benchmark ? (() => {
                        const displayValue = calculateBenchmarkDisplayValue(
                          item.twelveMonthsReturn,
                          item.benchmark.twelveMonthsReturn,
                          item.benchmark.benchmarkType
                        )
                        return (
                          <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                            {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                          </span>
                        )
                      })() : '-'}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground py-1">
                      {item.benchmark ? (() => {
                        const displayValue = calculateBenchmarkDisplayValue(
                          item.inceptionReturn,
                          item.benchmark.inceptionReturn,
                          item.benchmark.benchmarkType
                        )
                        return (
                          <span className={getBenchmarkDisplayColor(displayValue, item.benchmark.benchmarkType)}>
                            {formatBenchmarkValue(displayValue, item.benchmark.benchmarkType)}
                          </span>
                        )
                      })() : '-'}
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <TableRow className="border-border/50">
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">{t('portfolioPerformance.kpi.investmentDetails.noData')}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
      <CardHeader>
        <CardTitle className="text-foreground">{t('portfolioPerformance.kpi.investmentDetails.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
            <TabsTrigger value="visual">
              {t('portfolioPerformance.kpi.investmentDetails.viewMode.visual')}
            </TabsTrigger>
            <TabsTrigger value="table">
              {t('portfolioPerformance.kpi.investmentDetails.viewMode.table')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="visual" className="mt-0">
            {renderVisualView()}
          </TabsContent>
          <TabsContent value="table" className="mt-0">
            {renderTableView()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


