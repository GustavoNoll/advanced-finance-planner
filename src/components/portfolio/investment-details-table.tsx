import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { PerformanceData } from "@/types/financial"
import { calculateCompoundedRates } from "@/lib/financial-math"
import { useTranslation } from "react-i18next"
import { 
  calculateBenchmarkReturnsByGroupedKey,
  groupStrategyName, 
  getStrategyColor,
  getStrategyOrder,
  STRATEGY_ORDER,
  type GroupedStrategyKey 
} from "@/utils/benchmark-calculator"
import { useMemo, useCallback } from "react"
import { useCurrency } from "@/contexts/CurrencyContext"

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


/**
 * Calculates compound return from an array of monthly returns
 */
function calculateCompoundReturn(monthlyReturns: number[]): number {
  if (monthlyReturns.length === 0) return 0
  return calculateCompoundedRates(monthlyReturns)
}

export function InvestmentDetailsTable({ performanceData }: InvestmentDetailsTableProps) {
  const { t } = useTranslation()
  const { currency, adjustReturnWithFX, convertValue } = useCurrency()
  const currentLocale = currency === 'BRL' ? 'pt-BR' : 'en-US'
  
  /**
   * Traduz uma chave de estratégia agrupada usando i18n
   */
  const translateGroupedStrategy = useCallback((key: GroupedStrategyKey): string => {
    const strategiesOrder = 'portfolioPerformance.kpi.diversificationDialog.strategiesOrder'
    return t(`${strategiesOrder}.${key}`)
  }, [t])

  /**
   * Agrupa e traduz o nome de uma estratégia
   */
  const groupStrategy = useCallback((strategy: string | null): string => {
    const groupedKey = groupStrategyName(strategy)
    return translateGroupedStrategy(groupedKey)
  }, [translateGroupedStrategy])

  /**
   * Obtém a ordem de uma estratégia traduzida
   */
  const getStrategyOrderForName = useCallback((strategyName: string): number => {
    const strategiesOrder = 'portfolioPerformance.kpi.diversificationDialog.strategiesOrder'
    for (const key of STRATEGY_ORDER) {
      if (t(`${strategiesOrder}.${key}`) === strategyName) {
        return getStrategyOrder(key)
      }
    }
    return STRATEGY_ORDER.length // Put unknown strategies at the end
  }, [t])

  /**
   * Obtém a cor de uma estratégia traduzida
   */
  const getStrategyColorForName = useCallback((strategyName: string): string => {
    const strategiesOrder = 'portfolioPerformance.kpi.diversificationDialog.strategiesOrder'
    for (const key of STRATEGY_ORDER) {
      if (t(`${strategiesOrder}.${key}`) === strategyName) {
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
    const weightedReturns = periodList.map(period => {
      const items = byPeriod[period]
      // Convert positions and adjust returns with FX
      const totalPos = items.reduce((s, x) => {
        const originalCurrency = (x.currency === 'USD' || x.currency === 'Dolar') ? 'USD' : 'BRL'
        const position = Number(x.position || 0)
        return s + convertValue(position, period, originalCurrency)
      }, 0)
      const totalRet = items.reduce((s, x) => {
        const originalCurrency = (x.currency === 'USD' || x.currency === 'Dolar') ? 'USD' : 'BRL'
        const position = Number(x.position || 0)
        const positionConverted = convertValue(position, period, originalCurrency)
        const yieldValue = Number(x.yield || 0) / 100 // Convert to decimal
        const yieldAdjusted = adjustReturnWithFX(yieldValue, period, originalCurrency)
        return s + (yieldAdjusted * positionConverted)
      }, 0)
      const r = totalPos > 0 ? totalRet / totalPos : 0
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
        
        // Get the grouped key for this strategy
        // Find the first asset's original class to get the grouped key
        const firstAssetClass = strategyAssets
          .map(p => p.asset_class)
          .find(Boolean) || null
        
        const groupedKey = groupStrategyName(firstAssetClass)
        
        // Determine locale based on the currency prop
        const benchmarkLocale: 'pt-BR' | 'en-US' = currency === 'BRL' ? 'pt-BR' : 'en-US'
        
        // Calculate benchmark returns using the grouped key and currency
        // This function centralizes the logic: IFIX for BRL Real Estate, T-Bond for USD Real Estate, etc.
        const benchmark = calculateBenchmarkReturnsByGroupedKey(
          groupedKey,
          currency,
          strategyPeriods,
          benchmarkLocale
        )
        
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

  return (
    <Card className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
      <CardHeader>
        <CardTitle className="text-foreground">{t('portfolioPerformance.kpi.investmentDetails.title')}</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <>
                    <TableRow key={item.name} className="border-border/50">
                      <TableCell className="font-medium text-foreground flex items-center gap-2 py-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStrategyColorForName(item.name) }} />
                        {item.name}
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <span className={getStrategyColorComparedToBenchmark(item.monthReturn, item.benchmark?.monthReturn ?? null)}>
                          {item.monthReturn >= 0 ? '+' : ''}{item.monthReturn.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <span className={getStrategyColorComparedToBenchmark(item.yearReturn, item.benchmark?.yearReturn ?? null)}>
                          {item.yearReturn >= 0 ? '+' : ''}{item.yearReturn.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <span className={getStrategyColorComparedToBenchmark(item.sixMonthsReturn, item.benchmark?.sixMonthsReturn ?? null)}>
                          {item.sixMonthsReturn >= 0 ? '+' : ''}{item.sixMonthsReturn.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <span className={getStrategyColorComparedToBenchmark(item.twelveMonthsReturn, item.benchmark?.twelveMonthsReturn ?? null)}>
                          {item.twelveMonthsReturn >= 0 ? '+' : ''}{item.twelveMonthsReturn.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <span className={getStrategyColorComparedToBenchmark(item.inceptionReturn, item.benchmark?.inceptionReturn ?? null)}>
                          {item.inceptionReturn >= 0 ? '+' : ''}{item.inceptionReturn.toFixed(2)}%
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`${item.name}-benchmark`} className="border-border/50 bg-muted/20">
                      <TableCell className="font-medium text-muted-foreground pl-8 py-1">
                        {item.benchmark 
                          ? (currentLocale === 'pt-BR' ? item.benchmark.name : item.benchmark.nameEn)
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">
                        {item.benchmark && item.benchmark.monthReturn !== null ? (
                          <span className={benchmarkColor}>
                            {item.benchmark.monthReturn >= 0 ? '+' : ''}{item.benchmark.monthReturn.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">
                        {item.benchmark && item.benchmark.yearReturn !== null ? (
                          <span className={benchmarkColor}>
                            {item.benchmark.yearReturn >= 0 ? '+' : ''}{item.benchmark.yearReturn.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">
                        {item.benchmark && item.benchmark.sixMonthsReturn !== null ? (
                          <span className={benchmarkColor}>
                            {item.benchmark.sixMonthsReturn >= 0 ? '+' : ''}{item.benchmark.sixMonthsReturn.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">
                        {item.benchmark && item.benchmark.twelveMonthsReturn !== null ? (
                          <span className={benchmarkColor}>
                            {item.benchmark.twelveMonthsReturn >= 0 ? '+' : ''}{item.benchmark.twelveMonthsReturn.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">
                        {item.benchmark && item.benchmark.inceptionReturn !== null ? (
                          <span className={benchmarkColor}>
                            {item.benchmark.inceptionReturn >= 0 ? '+' : ''}{item.benchmark.inceptionReturn.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  </>
                ))
              ) : (
                <TableRow className="border-border/50">
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">{t('portfolioPerformance.kpi.investmentDetails.noData')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


