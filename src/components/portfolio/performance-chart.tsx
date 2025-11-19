import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LabelList } from 'recharts'
import { TrendingUp, Settings, ArrowLeftRight, Wallet, BarChart3, Calendar as CalendarIcon } from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import type { ConsolidatedPerformance } from "@/types/financial"
import { fetchIPCARates, fetchCDIRates } from "@/lib/bcb-api"
import { useCurrency } from "@/contexts/CurrencyContext"
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math"

interface PerformanceChartProps {
  consolidatedData: ConsolidatedPerformance[]
  targetReturnIpcaPlus?: string
}

type ViewMode = 'rentabilidade' | 'patrimonio' | 'crescimento'
type PeriodType = 'month' | 'year' | '12months' | 'all' | 'custom'

interface ConsolidatedByPeriod {
  period: string
  finalPatrimony: number
  initialPatrimony: number
  movement: number
  financialGain: number
  taxes: number
  yield: number
}

interface ChartDataPoint {
  name: string
  accumulatedReturn: number
  monthlyReturn: number
  period: string
  cdiReturn?: number | null
  targetReturn?: number | null
  ipcaReturn?: number | null
}

interface PatrimonyDataPoint {
  name: string
  appliedPatrimony: number
  currentPatrimony: number
  period: string
}

interface GrowthDataPoint {
  name: string
  generatedIncome: number
  basePatrimony: number
  growth: number
  negativeGrowth: number
  totalGrowth: number
  growthPercentage: number
  finalPatrimony: number
  initialPatrimony: number
  movement: number
  financialGain: number
  period: string
}

/**
 * Converts a period string (MM/YYYY) to a Date object
 */
function periodToDate(period: string): Date {
  const [month, year] = period.split('/').map(Number)
  return new Date(year, month - 1)
}

/**
 * Formats a period string for display using i18n month names
 */
function formatPeriodDisplay(period: string, monthNames: string[]): string {
  const [month, year] = period.split('/')
  const monthIndex = parseInt(month) - 1
  const fallbackMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const months = monthNames?.length === 12 ? monthNames : fallbackMonths
  return `${months[monthIndex] || fallbackMonths[monthIndex]}/${year.slice(-2)}`
}

/**
 * Determines the original currency from a currency string
 */
function getOriginalCurrency(currency?: string | null): 'USD' | 'BRL' {
  return currency === 'USD' || currency === 'Dolar' ? 'USD' : 'BRL'
}

/**
 * Performance chart component displaying portfolio returns, patrimony, and growth over time
 * Supports multiple view modes and period filters with market indicators
 */
export function PerformanceChart({ consolidatedData, targetReturnIpcaPlus }: PerformanceChartProps) {
  const { t } = useTranslation()
  const { convertValue, adjustReturnWithFX, formatCurrency } = useCurrency()
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('12months')
  const [customStartPeriod, setCustomStartPeriod] = useState<string>('')
  const [customEndPeriod, setCustomEndPeriod] = useState<string>('')
  const [showCustomSelector, setShowCustomSelector] = useState(false)
  const [showIndicators, setShowIndicators] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('rentabilidade')
  const [showOnlyGeneratedIncome, setShowOnlyGeneratedIncome] = useState(false)
  const [selectedIndicators, setSelectedIndicators] = useState({
    cdi: false,
    target: true,
    ipca: true
  })

  // Get month names from i18n
  const monthNames = useMemo(() => {
    return t('portfolioPerformance.months.short', { returnObjects: true }) as string[]
  }, [t])

  /**
   * Consolidate data by period (sum patrimony, weighted average yield)
   */
  const consolidatedByPeriod = useMemo(() => {
    const periodMap = new Map<string, {
      period: string
      finalPatrimony: number
      initialPatrimony: number
      movement: number
      financialGain: number
      taxes: number
      yieldSum: number
      patrimonyForWeightedAvg: number
    }>()

    consolidatedData.forEach(item => {
      const period = item.period || ''
      if (!period) return

      if (!periodMap.has(period)) {
        periodMap.set(period, {
          period,
          finalPatrimony: 0,
          initialPatrimony: 0,
          movement: 0,
          financialGain: 0,
          taxes: 0,
          yieldSum: 0,
          patrimonyForWeightedAvg: 0
        })
      }

      const consolidated = periodMap.get(period)!
      const originalCurrency = getOriginalCurrency(item.currency)
      
      const finalPatrimonyConverted = convertValue(
        Number(item.final_assets || 0),
        period,
        originalCurrency
      )
      const initialPatrimonyConverted = convertValue(
        Number(item.initial_assets || 0),
        period,
        originalCurrency
      )
      const movementConverted = convertValue(
        Number(item.movement || 0),
        period,
        originalCurrency
      )
      const financialGainConverted = convertValue(
        Number(item.financial_gain || 0),
        period,
        originalCurrency
      )
      const taxesConverted = convertValue(
        Number(item.taxes || 0),
        period,
        originalCurrency
      )

      consolidated.finalPatrimony += finalPatrimonyConverted
      consolidated.initialPatrimony += initialPatrimonyConverted
      consolidated.movement += movementConverted
      consolidated.financialGain += financialGainConverted
      consolidated.taxes += taxesConverted

      // For weighted average yield - with FX adjustment
      const adjustedYield = adjustReturnWithFX(
        Number(item.yield || 0),
        period,
        originalCurrency
      )

      consolidated.yieldSum += adjustedYield * finalPatrimonyConverted
      consolidated.patrimonyForWeightedAvg += finalPatrimonyConverted
    })

    return Array.from(periodMap.values()).map(item => ({
      period: item.period,
      finalPatrimony: item.finalPatrimony,
      initialPatrimony: item.initialPatrimony,
      movement: item.movement,
      financialGain: item.financialGain,
      taxes: item.taxes,
      yield: item.patrimonyForWeightedAvg > 0 ? item.yieldSum / item.patrimonyForWeightedAvg : 0
    })).sort((a, b) => {
      const dateA = periodToDate(a.period)
      const dateB = periodToDate(b.period)
      return dateA.getTime() - dateB.getTime()
    })
  }, [consolidatedData, convertValue, adjustReturnWithFX])

  /**
   * Get available periods for custom selector, sorted chronologically
   */
  const availablePeriods = useMemo(() => {
    return [...new Set(consolidatedByPeriod.map(item => item.period))]
      .sort((a, b) => {
        const dateA = periodToDate(a)
        const dateB = periodToDate(b)
        return dateA.getTime() - dateB.getTime()
      })
  }, [consolidatedByPeriod])


  /**
   * Calculates accumulated returns with compound interest
   * Adds a zero starting point one month before the first data point
   */
  const calculateAccumulatedReturns = useCallback((data: ConsolidatedByPeriod[]): ChartDataPoint[] => {
    if (data.length === 0) return []

    const result: ChartDataPoint[] = []
    let accumulated = 0 // Start at 0%

    // Add zero point one month before the first period
    if (data.length > 0) {
      const [firstMonth, firstYear] = data[0].period.split('/').map(Number)
      const firstDate = new Date(firstYear, firstMonth - 1, 1)
      const previousMonth = new Date(firstDate)
      previousMonth.setMonth(previousMonth.getMonth() - 1)

      const previousPeriod = `${String(previousMonth.getMonth() + 1).padStart(2, '0')}/${previousMonth.getFullYear()}`
      result.push({
        name: formatPeriodDisplay(previousPeriod, monthNames),
        accumulatedReturn: 0,
        monthlyReturn: 0,
        period: previousPeriod
      })
    }

    // Calculate compound accumulated returns
    data.forEach((item) => {
      const monthlyReturn = item.yield || 0
      // Use financial-math function for compound interest calculation
      // For accumulated returns, we need to compound: (1 + accumulated) * (1 + monthlyReturn) - 1
      // calculateCompoundedRates calculates: (1 + rate1) * (1 + rate2) * ... - 1
      // So we pass the accumulated value as a rate: accumulated is already a return, so we use it directly
      accumulated = calculateCompoundedRates([accumulated, monthlyReturn])

      result.push({
        name: formatPeriodDisplay(item.period, monthNames),
        accumulatedReturn: accumulated * 100,
        monthlyReturn: monthlyReturn * 100,
        period: item.period
      })
    })

    return result
  }, [monthNames])

  /**
   * Calculates patrimony data (applied patrimony and current patrimony)
   * Applied patrimony = initial patrimony + cumulative movements
   */
  const calculatePatrimonioData = useCallback((data: ConsolidatedByPeriod[]): PatrimonyDataPoint[] => {
    if (data.length === 0) return []

    const result: PatrimonyDataPoint[] = []
    let cumulativeMovement = 0

    // Add zero point one month before the first period
    if (data.length > 0) {
      const [firstMonth, firstYear] = data[0].period.split('/').map(Number)
      const firstDate = new Date(firstYear, firstMonth - 1, 1)
      const previousMonth = new Date(firstDate)
      previousMonth.setMonth(previousMonth.getMonth() - 1)

      const initialPatrimony = data[0].initialPatrimony || 0
      const previousPeriod = `${String(previousMonth.getMonth() + 1).padStart(2, '0')}/${previousMonth.getFullYear()}`

      result.push({
        name: formatPeriodDisplay(previousPeriod, monthNames),
        appliedPatrimony: initialPatrimony,
        currentPatrimony: initialPatrimony,
        period: previousPeriod
      })
    }

    // Calculate patrimony for each month
    data.forEach((item) => {
      // Applied Patrimony = Initial Patrimony + cumulative movements
      cumulativeMovement += item.movement || 0
      const appliedPatrimony = (data[0]?.initialPatrimony || 0) + cumulativeMovement
      const currentPatrimony = item.finalPatrimony || 0

      result.push({
        name: formatPeriodDisplay(item.period, monthNames),
        appliedPatrimony,
        currentPatrimony,
        period: item.period
      })
    })

    return result
  }, [monthNames])

  // Memoize filtered data and calculated datasets
  const filteredData = useMemo(() => {
    if (consolidatedByPeriod.length === 0) return []

    let filtered: ConsolidatedByPeriod[] = consolidatedByPeriod

    switch (selectedPeriod) {
      case 'month':
        filtered = consolidatedByPeriod.slice(-1)
        break
      case 'year':
        if (consolidatedByPeriod.length > 0) {
          const mostRecentPeriod = consolidatedByPeriod[consolidatedByPeriod.length - 1].period
          const mostRecentYear = mostRecentPeriod.split('/')[1]
          filtered = consolidatedByPeriod.filter(item => {
            const itemYear = item.period.split('/')[1]
            return itemYear === mostRecentYear
          })
        }
        break
      case '12months':
        filtered = consolidatedByPeriod.slice(-12)
        break
      case 'all':
        filtered = consolidatedByPeriod
        break
      case 'custom':
        if (customStartPeriod && customEndPeriod) {
          filtered = consolidatedByPeriod.filter(item => {
            const itemDate = periodToDate(item.period)
            const startDate = periodToDate(customStartPeriod)
            const endDate = periodToDate(customEndPeriod)
            return itemDate >= startDate && itemDate <= endDate
          })
        }
        break
    }

    return filtered
  }, [consolidatedByPeriod, selectedPeriod, customStartPeriod, customEndPeriod])

  const chartData = useMemo(() => calculateAccumulatedReturns(filteredData), [filteredData, calculateAccumulatedReturns])
  const patrimonioData = useMemo(() => calculatePatrimonioData(filteredData), [filteredData, calculatePatrimonioData])

  /**
   * Calculates growth data showing patrimony volume with total growth
   * Includes generated income based on monthly target rate
   */
  const calculateGrowthData = useCallback((data: ConsolidatedByPeriod[]): GrowthDataPoint[] => {
    if (data.length === 0) return []

    // Calculate monthly target rate from pre-fixed component
    let monthlyTargetRate = 0
    if (targetReturnIpcaPlus) {
      const metaMatch = targetReturnIpcaPlus.match(/\+(\d+(?:\.\d+)?)/) || targetReturnIpcaPlus.match(/ipca_plus_(\d+)/i)
      if (metaMatch) {
        const preFixedComponent = parseFloat(metaMatch[1]) / 100
        // Use financial-math function to convert yearly rate to monthly
        monthlyTargetRate = yearlyReturnRateToMonthlyReturnRate(preFixedComponent)
      }
    }

    const result: GrowthDataPoint[] = []

    data.forEach((item) => {
      const initialPatrimony = item.initialPatrimony || 0
      const finalPatrimony = item.finalPatrimony || 0
      const movement = item.movement || 0
      const financialGain = item.financialGain || 0

      // Generated income = patrimony of the month * monthly target rate
      const generatedIncome = initialPatrimony * monthlyTargetRate

      // Total growth = movement + financial gain = final patrimony - initial patrimony
      const totalGrowth = finalPatrimony - initialPatrimony
      const growthPercentage = initialPatrimony > 0 ? (totalGrowth / initialPatrimony) * 100 : 0

      const basePatrimonyAdjusted = Math.max(0, initialPatrimony - generatedIncome)

      result.push({
        name: formatPeriodDisplay(item.period, monthNames),
        generatedIncome: generatedIncome,
        basePatrimony: basePatrimonyAdjusted,
        growth: totalGrowth >= 0 ? totalGrowth : 0,
        negativeGrowth: totalGrowth < 0 ? totalGrowth : 0,
        totalGrowth,
        growthPercentage,
        finalPatrimony,
        initialPatrimony,
        movement,
        financialGain,
        period: item.period
      })
    })

    return result
  }, [targetReturnIpcaPlus, monthNames])

  const growthData = useMemo(() => calculateGrowthData(filteredData), [filteredData, calculateGrowthData])

  // Get CDI and IPCA data for the period
  const marketData = useMemo(() => {
    if (filteredData.length === 0) return { cdiData: [], ipcaData: [] }

    const firstPeriod = filteredData[0]?.period
    const lastPeriod = filteredData[filteredData.length - 1]?.period
    if (!firstPeriod || !lastPeriod) return { cdiData: [], ipcaData: [] }

    // Convert period to date format for fetch functions (DD/MM/YYYY)
    const [firstMonth, firstYear] = firstPeriod.split('/').map(Number)
    const [lastMonth, lastYear] = lastPeriod.split('/').map(Number)

    const startDate = `01/${String(firstMonth).padStart(2, '0')}/${firstYear}`
    const lastDay = new Date(lastYear, lastMonth, 0).getDate()
    const endDate = `${String(lastDay).padStart(2, '0')}/${String(lastMonth).padStart(2, '0')}/${lastYear}`

    try {
      const cdiRates = fetchCDIRates(startDate, endDate)
      const ipcaRates = fetchIPCARates(startDate, endDate)

      // Group by period (MM/YYYY) and get the last value of each month
      const cdiMap = new Map<string, { period: string; cdiRate: number }>()
      cdiRates.forEach(cdi => {
        const period = `${String(cdi.date.getMonth() + 1).padStart(2, '0')}/${cdi.date.getFullYear()}`
        const existing = cdiMap.get(period)
        if (!existing || cdi.date > periodToDate(existing.period)) {
          cdiMap.set(period, {
            period,
            cdiRate: cdi.monthlyRate / 100 // Convert percentage to decimal
          })
        }
      })

      const ipcaMap = new Map<string, { period: string; monthlyRate: number }>()
      ipcaRates.forEach(ipca => {
        const period = `${String(ipca.date.getMonth() + 1).padStart(2, '0')}/${ipca.date.getFullYear()}`
        const existing = ipcaMap.get(period)
        if (!existing || ipca.date > periodToDate(existing.period)) {
          ipcaMap.set(period, {
            period,
            monthlyRate: ipca.monthlyRate / 100 // Convert percentage to decimal
          })
        }
      })

      const cdiData = Array.from(cdiMap.values()).sort((a, b) => {
        const dateA = periodToDate(a.period)
        const dateB = periodToDate(b.period)
        return dateA.getTime() - dateB.getTime()
      })

      const ipcaData = Array.from(ipcaMap.values()).sort((a, b) => {
        const dateA = periodToDate(a.period)
        const dateB = periodToDate(b.period)
        return dateA.getTime() - dateB.getTime()
      })

      return { cdiData, ipcaData }
    } catch (error) {
      console.error('Error fetching market data:', error)
      return { cdiData: [], ipcaData: [] }
    }
  }, [filteredData])

  // Calculate target return from investment plan
  const extractTargetValue = (targetString?: string): number => {
    if (!targetString) return 0
    // Handle both formats: "IPCA+5%" and "ipca_plus_5"
    const match = targetString.match(/\+(\d+(?:\.\d+)?)/) || targetString.match(/ipca_plus_(\d+)/i)
    return match ? parseFloat(match[1]) / 100 : 0
  }

  const targetValue = extractTargetValue(targetReturnIpcaPlus)

  /**
   * Adds all indicators data (CDI, IPCA, Target) to chart data
   * Calculates accumulated returns for each indicator
   */
  const chartDataWithIndicators = useMemo(() => {
    return chartData.map((point, index) => {
    if (index === 0) {
      return {
        ...point,
        cdiReturn: 0,
        targetReturn: 0,
        ipcaReturn: 0
      }
    }

    const firstPeriod = chartData[1]?.period
    const currentPeriod = point.period

    // CDI data - correct monthly composition
    let cdiReturn = null
    if (firstPeriod && marketData.cdiData.length > 0) {
      const firstDate = periodToDate(firstPeriod)
      const currentDate = periodToDate(currentPeriod)

      const periodCDI = marketData.cdiData.filter(cdi => {
        const cdiDate = periodToDate(cdi.period)
        return cdiDate >= firstDate && cdiDate <= currentDate
      })

      if (periodCDI.length > 0) {
        if (currentPeriod === firstPeriod) {
          cdiReturn = periodCDI[0].cdiRate * 100
        } else {
          // Use financial-math function to compound CDI rates
          // cdiRate is already a decimal (e.g., 0.01 for 1%)
          const cdiRates = periodCDI.map(cdi => cdi.cdiRate)
          const accumulatedCDI = calculateCompoundedRates(cdiRates)
          cdiReturn = accumulatedCDI * 100
        }
      }
    }

    // IPCA data
    let ipcaReturn = null
    if (firstPeriod && marketData.ipcaData.length > 0) {
      const firstDate = periodToDate(firstPeriod)
      const currentDate = periodToDate(currentPeriod)

      const periodIpca = marketData.ipcaData.filter(ipca => {
        const ipcaDate = periodToDate(ipca.period)
        return ipcaDate >= firstDate && ipcaDate <= currentDate
      })

      if (periodIpca.length > 0) {
        if (currentPeriod === firstPeriod) {
          ipcaReturn = periodIpca[0].monthlyRate * 100
        } else {
          // Use financial-math function to compound IPCA rates
          // monthlyRate is already a decimal (e.g., 0.01 for 1%)
          const ipcaRates = periodIpca.map(ipca => ipca.monthlyRate)
          const accumulatedIPCA = calculateCompoundedRates(ipcaRates)
          ipcaReturn = accumulatedIPCA * 100
        }
      }
    }

    // Target data (IPCA + targetValue)
    let targetReturn = null
    if (firstPeriod && targetValue > 0 && marketData.ipcaData.length > 0) {
      const firstDate = periodToDate(firstPeriod)
      const currentDate = periodToDate(currentPeriod)

      const periodIpca = marketData.ipcaData.filter(ipca => {
        const ipcaDate = periodToDate(ipca.period)
        return ipcaDate >= firstDate && ipcaDate <= currentDate
      })

      if (periodIpca.length > 0) {
        // Use financial-math function to convert yearly target to monthly
        const monthlyTargetRate = yearlyReturnRateToMonthlyReturnRate(targetValue)
        // Calculate monthly rates: IPCA + monthly target rate
        const monthlyRates = periodIpca.map(ipca => {
          const monthlyIpca = ipca.monthlyRate
          return monthlyIpca + monthlyTargetRate
        })
        // Use financial-math function to compound target rates
        // Rates are already decimals, no need to multiply by 100
        const accumulatedTarget = calculateCompoundedRates(monthlyRates)
        targetReturn = accumulatedTarget * 100
      }
    }

    return {
      ...point,
      cdiReturn,
      targetReturn,
      ipcaReturn
    }
    })
  }, [chartData, marketData, targetValue])

  /**
   * Calculates optimal Y axis scale based on visible indicators
   */
  const { yAxisMin, yAxisMax, yAxisTicks } = useMemo(() => {
    const portfolioValues = chartDataWithIndicators.map(item => item.accumulatedReturn)
    const cdiValues = chartDataWithIndicators.map(item => item.cdiReturn).filter(v => v !== null && v !== 0) as number[]
    const targetValues = chartDataWithIndicators.map(item => item.targetReturn).filter(v => v !== null && v !== 0) as number[]
    const ipcaValues = chartDataWithIndicators.map(item => item.ipcaReturn).filter(v => v !== null && v !== 0) as number[]

    let allValues = [...portfolioValues]
    if (selectedIndicators.cdi) allValues = [...allValues, ...cdiValues]
    if (selectedIndicators.target) allValues = [...allValues, ...targetValues]
    if (selectedIndicators.ipca) allValues = [...allValues, ...ipcaValues]

    const minValue = Math.min(...allValues, 0)
    const maxValue = Math.max(...allValues)

    const range = maxValue - minValue
    const buffer = Math.max(range * 0.1, 0.5)
    const yAxisMin = Math.floor((minValue - buffer) * 2) / 2
    const yAxisMax = Math.ceil((maxValue + buffer) * 2) / 2

    /**
     * Generates evenly spaced ticks for Y axis
     */
    const generateTicks = (min: number, max: number): number[] => {
      const range = max - min
      let step
      if (range <= 2) step = 0.25
      else if (range <= 5) step = 0.5
      else if (range <= 10) step = 1
      else if (range <= 20) step = 2
      else step = Math.ceil(range / 10)

      const ticks: number[] = []
      for (let i = Math.floor(min / step) * step; i <= max; i += step) {
        ticks.push(Number(i.toFixed(2)))
      }
      return ticks
    }

    return {
      yAxisMin,
      yAxisMax,
      yAxisTicks: generateTicks(yAxisMin, yAxisMax)
    }
  }, [chartDataWithIndicators, selectedIndicators])

  /**
   * Period button configuration with i18n labels
   */
  const periodButtons = useMemo(() => [
    { id: 'month' as PeriodType, label: t('portfolioPerformance.performanceChart.periodButtons.month') },
    { id: 'year' as PeriodType, label: t('portfolioPerformance.performanceChart.periodButtons.year') },
    { id: '12months' as PeriodType, label: t('portfolioPerformance.performanceChart.periodButtons.twelveMonths') },
    { id: 'all' as PeriodType, label: t('portfolioPerformance.performanceChart.periodButtons.all') },
    { id: 'custom' as PeriodType, label: t('portfolioPerformance.performanceChart.periodButtons.custom') }
  ], [t])

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (chartDataWithIndicators.length === 0) return null

    const lastDataPoint = chartDataWithIndicators[chartDataWithIndicators.length - 1]
    const portfolioReturn = lastDataPoint.accumulatedReturn
    const cdiReturn = lastDataPoint.cdiReturn
    const targetReturn = lastDataPoint.targetReturn
    const ipcaReturn = lastDataPoint.ipcaReturn

    return {
      portfolioReturn,
      cdiReturn,
      targetReturn,
      ipcaReturn,
      targetDifference: portfolioReturn - (targetReturn || 0),
      ipcaDifference: portfolioReturn - (ipcaReturn || 0),
      cdiRelative: cdiReturn && cdiReturn !== 0 ? (portfolioReturn / cdiReturn) * 100 : null
    }
  }, [chartDataWithIndicators])

  if (consolidatedData.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group px-4 py-2 -ml-4 rounded-lg hover:bg-accent/50 transition-all"
            onClick={() => {
              if (viewMode === 'rentabilidade') setViewMode('patrimonio')
              else if (viewMode === 'patrimonio') setViewMode('crescimento')
              else setViewMode('rentabilidade')
            }}
          >
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md ${
              viewMode === 'rentabilidade' 
                ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700' 
                : viewMode === 'patrimonio' 
                ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700'
                : 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 dark:from-purple-600 dark:via-purple-700 dark:to-pink-700'
            }`}>
              {viewMode === 'rentabilidade' ? (
                <TrendingUp className="h-6 w-6 text-white" />
              ) : viewMode === 'patrimonio' ? (
                <Wallet className="h-6 w-6 text-white" />
              ) : (
                <BarChart3 className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-foreground text-xl font-semibold">
                {viewMode === 'rentabilidade' 
                  ? t('portfolioPerformance.performanceChart.viewModes.returns')
                  : viewMode === 'patrimonio' 
                  ? t('portfolioPerformance.performanceChart.viewModes.patrimony')
                  : t('portfolioPerformance.performanceChart.viewModes.growth')}
              </CardTitle>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 group-hover:bg-muted transition-colors">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {t('portfolioPerformance.performanceChart.switchView')}
                </span>
              </div>
            </div>
          </div>

          {/* Period Selection and Indicators */}
          <div className="flex items-center gap-2">
            {/* Indicators Selector - only show in rentabilidade mode */}
            {viewMode === 'rentabilidade' && (
              <Popover open={showIndicators} onOpenChange={setShowIndicators}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    {t('portfolioPerformance.performanceChart.indicators')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-background border-border z-50" align="end">
                  <div className="space-y-3 p-2">
                    <h4 className="font-medium text-sm">{t('portfolioPerformance.performanceChart.selectIndicators')}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cdi"
                          checked={selectedIndicators.cdi}
                          onCheckedChange={(checked) =>
                            setSelectedIndicators(prev => ({ ...prev, cdi: checked as boolean }))
                          }
                        />
                        <label htmlFor="cdi" className="text-sm">{t('portfolioPerformance.performanceChart.tooltips.cdi')}</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="target"
                          checked={selectedIndicators.target}
                          onCheckedChange={(checked) =>
                            setSelectedIndicators(prev => ({ ...prev, target: checked as boolean }))
                          }
                        />
                        <label htmlFor="target" className="text-sm">
                          {t('portfolioPerformance.performanceChart.target')} {targetReturnIpcaPlus 
                            ? `(${targetReturnIpcaPlus.includes('ipca_plus') ? targetReturnIpcaPlus.replace('ipca_plus_', 'IPCA+').replace('_', '') + '%' : targetReturnIpcaPlus})` 
                            : t('portfolioPerformance.performanceChart.targetNotAvailable')}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ipca"
                          checked={selectedIndicators.ipca}
                          onCheckedChange={(checked) =>
                            setSelectedIndicators(prev => ({ ...prev, ipca: checked as boolean }))
                          }
                        />
                        <label htmlFor="ipca" className="text-sm">{t('portfolioPerformance.performanceChart.tooltips.ipca')}</label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <div className="flex items-center gap-1">
              {viewMode === 'crescimento' && (
                <Button
                  variant={showOnlyGeneratedIncome ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOnlyGeneratedIncome(!showOnlyGeneratedIncome)}
                  className="gap-2 text-xs px-3 py-1 h-8 mr-2"
                >
                  <Wallet className="h-4 w-4" />
                  {showOnlyGeneratedIncome 
                    ? t('portfolioPerformance.performanceChart.growthView.showAll')
                    : t('portfolioPerformance.performanceChart.growthView.generatedIncome')}
                </Button>
              )}

              {periodButtons.map((button) => (
                <Button
                  key={button.id}
                  variant={selectedPeriod === button.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setSelectedPeriod(button.id)
                    if (button.id === 'custom') {
                      setShowCustomSelector(true)
                    }
                  }}
                  className="text-xs px-3 py-1 h-8"
                >
                  {button.label}
                </Button>
              ))}

              {selectedPeriod === 'custom' && (
                <Popover open={showCustomSelector} onOpenChange={setShowCustomSelector}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t('portfolioPerformance.performanceChart.customPeriod.startPeriod')}
                        </label>
                        <Select value={customStartPeriod} onValueChange={setCustomStartPeriod}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('portfolioPerformance.performanceChart.customPeriod.selectStart')} />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePeriods.map((period) => (
                              <SelectItem key={period} value={period}>
                                {formatPeriodDisplay(period, monthNames)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t('portfolioPerformance.performanceChart.customPeriod.endPeriod')}
                        </label>
                        <Select value={customEndPeriod} onValueChange={setCustomEndPeriod}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('portfolioPerformance.performanceChart.customPeriod.selectEnd')} />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePeriods.map((period) => (
                              <SelectItem key={period} value={period}>
                                {formatPeriodDisplay(period, monthNames)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-6">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'crescimento' ? (
              <BarChart
                data={growthData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                barGap={8}
              >
                <defs>
                  <linearGradient id="barRendaGerada" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(47 100% 65%)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="hsl(47 95% 55%)" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="barBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  </linearGradient>
                  <linearGradient id="barPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142 50% 50%)" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="hsl(142 45% 42%)" stopOpacity={0.75} />
                  </linearGradient>
                  <linearGradient id="barNegative" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="hsl(0 84% 60%)" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(0 72% 50%)" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.2}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                  tick={{ dy: 10 }}
                  interval={0}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${formatCurrency(0).replace(/[\d,.]/g, '').trim()} ${(value / 1000000).toFixed(1)}M`
                    if (value >= 1000) return `${formatCurrency(0).replace(/[\d,.]/g, '').trim()} ${(value / 1000).toFixed(0)}k`
                    return formatCurrency(value)
                  }}
                  width={70}
                  domain={[0, (dataMax: number) => dataMax * 1.08]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
                    fontSize: '13px',
                    padding: '14px'
                  }}
                  content={(props) => {
                    const { active, payload } = props
                    if (!active || !payload || !payload.length) return null

                    const data = payload[0].payload
                    const isPositive = data.totalGrowth >= 0

                    return (
                      <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
                        fontSize: '13px',
                        padding: '14px',
                        minWidth: '260px'
                      }}>
                        <div style={{
                          color: 'hsl(var(--foreground))',
                          fontWeight: '600',
                          marginBottom: '12px',
                          fontSize: '14px',
                          borderBottom: '1px solid hsl(var(--border))',
                          paddingBottom: '8px'
                        }}>
                          {data.name}
                        </div>
                        <div style={{
                          marginBottom: '10px',
                          padding: '8px',
                          borderRadius: '8px',
                          backgroundColor: 'hsl(var(--muted) / 0.3)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                              {t('portfolioPerformance.performanceChart.growthView.initialPatrimony')}
                            </span>
                            <strong style={{ fontSize: '12px' }}>{formatCurrency(data.initialPatrimony)}</strong>
                          </div>
                          {data.generatedIncome > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'hsl(47 90% 45%)' }}>
                                {t('portfolioPerformance.performanceChart.growthView.generatedIncome')}
                              </span>
                              <strong style={{ fontSize: '12px', color: 'hsl(47 90% 40%)' }}>{formatCurrency(data.generatedIncome)}</strong>
                            </div>
                          )}
                        </div>
                        <div style={{
                          marginBottom: '10px',
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: isPositive ? 'hsl(142 71% 45% / 0.1)' : 'hsl(0 84% 60% / 0.1)',
                          border: `1px solid ${isPositive ? 'hsl(142 71% 45% / 0.3)' : 'hsl(0 84% 60% / 0.3)'}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: isPositive ? 'hsl(142 71% 35%)' : 'hsl(0 72% 45%)' }}>
                              {t('portfolioPerformance.performanceChart.growthView.totalGrowth')}
                            </span>
                            <strong style={{
                              fontSize: '14px',
                              color: isPositive ? 'hsl(142 71% 35%)' : 'hsl(0 72% 45%)'
                            }}>
                              {isPositive ? '+' : ''}{formatCurrency(data.totalGrowth)}
                            </strong>
                          </div>
                          <div style={{
                            fontSize: '13px',
                            color: isPositive ? 'hsl(142 71% 35%)' : 'hsl(0 72% 45%)',
                            fontWeight: '700',
                            textAlign: 'right'
                          }}>
                            {isPositive ? '+' : ''}{data.growthPercentage.toFixed(2)}%
                          </div>
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'hsl(var(--muted-foreground))',
                          paddingTop: '10px',
                          borderTop: '1px solid hsl(var(--border))',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('portfolioPerformance.performanceChart.growthView.movement')}</span>
                            <span style={{ fontWeight: '600', color: data.movement >= 0 ? 'hsl(var(--foreground))' : 'hsl(var(--destructive))' }}>
                              {data.movement > 0 ? '+' : ''}{formatCurrency(data.movement)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('portfolioPerformance.performanceChart.growthView.financialGain')}</span>
                            <span style={{ fontWeight: '600', color: data.financialGain >= 0 ? 'hsl(142 71% 35%)' : 'hsl(0 72% 45%)' }}>
                              {data.financialGain > 0 ? '+' : ''}{formatCurrency(data.financialGain)}
                            </span>
                          </div>
                          <div style={{
                            marginTop: '6px',
                            paddingTop: '8px',
                            borderTop: '1px solid hsl(var(--border))',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <strong style={{ color: 'hsl(var(--foreground))' }}>
                              {t('portfolioPerformance.performanceChart.growthView.finalPatrimony')}
                            </strong>
                            <strong style={{ color: 'hsl(var(--primary))' }}>{formatCurrency(data.finalPatrimony)}</strong>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 4 }}
                />
                <Bar
                  dataKey="generatedIncome"
                  stackId="a"
                  fill="url(#barRendaGerada)"
                  radius={[0, 0, 6, 6]}
                  maxBarSize={60}
                  hide={showOnlyGeneratedIncome ? false : false}
                >
                  {showOnlyGeneratedIncome && (
                    <LabelList
                      dataKey="generatedIncome"
                      position="top"
                      formatter={(value: number) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                        return value.toFixed(0)
                      }}
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        fill: 'hsl(var(--foreground))'
                      }}
                      offset={8}
                    />
                  )}
                </Bar>
                <Bar
                  dataKey="basePatrimony"
                  stackId="a"
                  fill="url(#barBase)"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={60}
                  hide={showOnlyGeneratedIncome}
                />
                <Bar
                  dataKey="growth"
                  stackId="a"
                  fill="url(#barPositive)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                  hide={showOnlyGeneratedIncome}
                />
                <Bar
                  dataKey="negativeGrowth"
                  stackId="a"
                  fill="url(#barNegative)"
                  radius={[0, 0, 6, 6]}
                  maxBarSize={60}
                  hide={showOnlyGeneratedIncome}
                />
              </BarChart>
            ) : viewMode === 'rentabilidade' ? (
              <LineChart
                data={chartDataWithIndicators}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ dy: 10 }}
                  interval={0}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                  domain={[yAxisMin, yAxisMax]}
                  ticks={yAxisTicks}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
                    fontSize: '13px',
                    padding: '12px'
                  }}
                  formatter={(value: number | string, name: string) => {
                    const numValue = typeof value === 'number' ? value : Number(value)
                    if (name === 'accumulatedReturn') {
                      return [`${numValue.toFixed(2)}%`, t('portfolioPerformance.performanceChart.tooltips.portfolio')]
                    }
                    if (name === 'cdiReturn') {
                      return [`${numValue.toFixed(2)}%`, t('portfolioPerformance.performanceChart.tooltips.cdi')]
                    }
                    if (name === 'targetReturn') {
                      return [`${numValue.toFixed(2)}%`, t('portfolioPerformance.performanceChart.tooltips.target')]
                    }
                    if (name === 'ipcaReturn') {
                      return [`${numValue.toFixed(2)}%`, t('portfolioPerformance.performanceChart.tooltips.ipca')]
                    }
                    return [`${numValue.toFixed(2)}%`, name]
                  }}
                  labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                />
                {/* Portfolio Line */}
                <Line
                  type="monotone"
                  dataKey="accumulatedReturn"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))',
                    r: 4
                  }}
                  activeDot={{
                    r: 6,
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 3,
                    stroke: 'hsl(var(--background))'
                  }}
                />
                {selectedIndicators.cdi && (
                  <Line
                    type="monotone"
                    dataKey="cdiReturn"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={{
                      fill: 'hsl(var(--muted-foreground))',
                      strokeWidth: 1,
                      stroke: 'hsl(var(--background))',
                      r: 3
                    }}
                    activeDot={{
                      r: 5,
                      fill: 'hsl(var(--muted-foreground))',
                      strokeWidth: 2,
                      stroke: 'hsl(var(--background))'
                    }}
                  />
                )}
                {selectedIndicators.target && (
                  <Line
                    type="monotone"
                    dataKey="targetReturn"
                    stroke="hsl(0 84% 60%)"
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{
                      fill: "hsl(0 84% 60%)",
                      strokeWidth: 1,
                      stroke: 'hsl(var(--background))',
                      r: 3
                    }}
                    activeDot={{
                      r: 5,
                      fill: "hsl(0 84% 60%)",
                      strokeWidth: 2,
                      stroke: 'hsl(var(--background))'
                    }}
                  />
                )}
                {selectedIndicators.ipca && (
                  <Line
                    type="monotone"
                    dataKey="ipcaReturn"
                    stroke="hsl(var(--info))"
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{
                      fill: 'hsl(var(--info))',
                      strokeWidth: 1,
                      stroke: 'hsl(var(--background))',
                      r: 3
                    }}
                    activeDot={{
                      r: 5,
                      fill: 'hsl(var(--info))',
                      strokeWidth: 2,
                      stroke: 'hsl(var(--background))'
                    }}
                  />
                )}
              </LineChart>
            ) : (
              <LineChart
                data={patrimonioData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ dy: 10 }}
                  interval={0}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => {
                    const symbol = formatCurrency(0).replace(/[\d,.]/g, '').trim()
                    return `${symbol} ${(value / 1000000).toFixed(1)}M`
                  }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
                    fontSize: '13px',
                    padding: '12px'
                  }}
                  formatter={(value: number | string, name: string) => {
                    const numValue = typeof value === 'number' ? value : Number(value)
                    if (name === 'appliedPatrimony') {
                      return [formatCurrency(numValue), t('portfolioPerformance.performanceChart.tooltips.appliedPatrimony')]
                    }
                    if (name === 'currentPatrimony') {
                      return [formatCurrency(numValue), t('portfolioPerformance.performanceChart.tooltips.patrimony')]
                    }
                    return [String(value), name]
                  }}
                  labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                />
                {/* Applied Patrimony Line */}
                <Line
                  type="monotone"
                  dataKey="appliedPatrimony"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2.5}
                  dot={{
                    fill: 'hsl(var(--muted-foreground))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))',
                    r: 4
                  }}
                  activeDot={{
                    r: 5,
                    fill: 'hsl(var(--muted-foreground))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))'
                  }}
                />
                {/* Current Patrimony Line */}
                <Line
                  type="monotone"
                  dataKey="currentPatrimony"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))',
                    r: 4
                  }}
                  activeDot={{
                    r: 6,
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 3,
                    stroke: 'hsl(var(--background))'
                  }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        {viewMode === 'patrimonio' ? (
          // Modo "Seu patrimônio" - apenas "Efeito bola de neve"
          patrimonioData.length > 1 && (() => {
            const lastDataPoint = patrimonioData[patrimonioData.length - 1]
            const currentPatrimony = lastDataPoint.currentPatrimony
            const appliedPatrimony = lastDataPoint.appliedPatrimony

            // Snowball effect = Current Patrimony / Applied Patrimony
            const snowballEffect = appliedPatrimony > 0 ?
              (currentPatrimony / appliedPatrimony) : 1

            const percentageGain = (snowballEffect - 1) * 100

            return (
              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('portfolioPerformance.performanceChart.metrics.snowballEffect')}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {snowballEffect.toFixed(2)}x
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {percentageGain >= 0 ? '+' : ''}{percentageGain.toFixed(2)}% {t('portfolioPerformance.performanceChart.metrics.snowballDescription')}
                      </p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      percentageGain >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {percentageGain >= 0 ? '↑' : '↓'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()
        ) : viewMode === 'crescimento' ? (
          // Modo "Crescimento" - crescimento médio e total + renda gerada
          growthData.length > 0 && (() => {
            // Calculate average growth percentage
            const averageGrowthPercentage = growthData.reduce((sum, item) => sum + item.growthPercentage, 0) / growthData.length

            // Calculate total growth for the period
            const firstPatrimony = growthData[0]?.basePatrimony || 0
            const lastPatrimony = growthData[growthData.length - 1]?.finalPatrimony || 0
            const periodGrowth = lastPatrimony - firstPatrimony
            const periodGrowthPercentage = firstPatrimony > 0 ? (periodGrowth / firstPatrimony) * 100 : 0

            // Last generated income
            const lastGeneratedIncome = growthData[growthData.length - 1]?.generatedIncome || 0
            const lastInitialPatrimony = growthData[growthData.length - 1]?.initialPatrimony || 0
            const incomePercentage = lastInitialPatrimony > 0 ? (lastGeneratedIncome / lastInitialPatrimony) * 100 : 0

            // Average income for last 12 months
            const last12MonthsData = growthData.slice(-12)
            const averageIncome12M = last12MonthsData.reduce((sum, item) => sum + (item.generatedIncome || 0), 0) / last12MonthsData.length
            const totalIncome12M = last12MonthsData.reduce((sum, item) => sum + (item.generatedIncome || 0), 0)

            return (
              <>
                {!showOnlyGeneratedIncome && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t('portfolioPerformance.performanceChart.metrics.averageGrowth')}
                          </p>
                          <p className="text-2xl font-semibold text-foreground">
                            {averageGrowthPercentage >= 0 ? '+' : ''}{averageGrowthPercentage.toFixed(2)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('portfolioPerformance.performanceChart.metrics.perPeriod')}
                          </p>
                        </div>
                        <div className={`text-sm px-2 py-1 rounded ${
                          averageGrowthPercentage >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {averageGrowthPercentage >= 0 ? '↑' : '↓'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t('portfolioPerformance.performanceChart.metrics.totalGrowthPeriod')}
                          </p>
                          <p className="text-2xl font-semibold text-foreground">
                            {periodGrowthPercentage >= 0 ? '+' : ''}{periodGrowthPercentage.toFixed(2)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(periodGrowth)}
                          </p>
                        </div>
                        <div className={`text-sm px-2 py-1 rounded ${
                          periodGrowthPercentage >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {periodGrowthPercentage >= 0 ? '↑' : '↓'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showOnlyGeneratedIncome && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t('portfolioPerformance.performanceChart.metrics.lastGeneratedIncome')}
                          </p>
                          <p className="text-2xl font-semibold text-foreground">
                            {formatCurrency(lastGeneratedIncome)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {incomePercentage.toFixed(2)} {t('portfolioPerformance.performanceChart.metrics.incomePercentage')}
                          </p>
                        </div>
                        <div className="text-sm px-2 py-1 rounded bg-[hsl(47_100%_65%)]/10" style={{ color: 'hsl(47 90% 40%)' }}>
                          <Wallet className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t('portfolioPerformance.performanceChart.metrics.averageIncome12M')}
                          </p>
                          <p className="text-2xl font-semibold text-foreground">
                            {formatCurrency(averageIncome12M)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('portfolioPerformance.performanceChart.metrics.total')} {formatCurrency(totalIncome12M)}
                          </p>
                        </div>
                        <div className="text-sm px-2 py-1 rounded bg-[hsl(47_100%_65%)]/10" style={{ color: 'hsl(47 90% 40%)' }}>
                          <Wallet className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )
          })()
        ) : (
          // Modos "Retorno Acumulado" - todos os bullets
          chartDataWithIndicators.length > 1 && summaryMetrics && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {targetReturnIpcaPlus && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('portfolioPerformance.performanceChart.metrics.vsTarget')}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {summaryMetrics.targetDifference >= 0 ? '+' : ''}{summaryMetrics.targetDifference.toFixed(2)}pp
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {summaryMetrics.targetDifference >= 0 
                          ? t('portfolioPerformance.performanceChart.metrics.aboveTarget')
                          : t('portfolioPerformance.performanceChart.metrics.belowTarget')} {t('portfolioPerformance.performanceChart.metrics.ofTarget')} ({targetReturnIpcaPlus.includes('ipca_plus') ? targetReturnIpcaPlus.replace('ipca_plus_', 'IPCA+').replace('_', '') + '%' : targetReturnIpcaPlus})
                      </p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      summaryMetrics.targetDifference >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {summaryMetrics.targetDifference >= 0 ? '↑' : '↓'}
                    </div>
                  </div>
                </div>
              )}

              {summaryMetrics.cdiRelative !== null && selectedIndicators.cdi && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('portfolioPerformance.performanceChart.metrics.vsCDI')}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {summaryMetrics.cdiRelative.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('portfolioPerformance.performanceChart.metrics.ofCDIReturn')}
                      </p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      summaryMetrics.cdiRelative >= 100 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {summaryMetrics.cdiRelative >= 100 ? '↑' : '↓'} {Math.abs(summaryMetrics.cdiRelative - 100).toFixed(1)}pp
                    </div>
                  </div>
                </div>
              )}

              {summaryMetrics.ipcaDifference !== null && selectedIndicators.ipca && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('portfolioPerformance.performanceChart.metrics.vsIPCA')}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {summaryMetrics.ipcaDifference >= 0 ? '+' : ''}{summaryMetrics.ipcaDifference.toFixed(2)}pp
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {summaryMetrics.ipcaDifference >= 0 
                          ? t('portfolioPerformance.performanceChart.metrics.aboveInflation')
                          : t('portfolioPerformance.performanceChart.metrics.belowInflation')} {t('portfolioPerformance.performanceChart.metrics.ofInflation')}
                      </p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      summaryMetrics.ipcaDifference >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {summaryMetrics.ipcaDifference >= 0 ? '↑' : '↓'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}

