import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { PerformanceData } from "@/types/financial"
import { CurrencyCode } from "@/utils/currency"
import { calculateCompoundedRates } from "@/lib/financial-math"
import { useTranslation } from "react-i18next"
import { calculateBenchmarkReturns } from "@/utils/benchmark-calculator"

interface InvestmentDetailsTableProps {
  performanceData: PerformanceData[]
  currency?: CurrencyCode
}


const COLORS = [
  'hsl(210 16% 82%)',
  'hsl(32 25% 72%)',
  'hsl(45 20% 85%)',
  'hsl(210 11% 71%)',
  'hsl(210 16% 58%)',
  'hsl(207 26% 50%)',
  'hsl(158 64% 25%)',
  'hsl(159 61% 33%)',
  'hsl(210 29% 24%)',
  'hsl(25 28% 53%)',
  'hsl(40 23% 77%)',
  'hsl(210 14% 53%)',
  'hsl(35 31% 65%)',
  'hsl(210 24% 40%)',
]

function toDate(competencia?: string | null) {
  if (!competencia) return 0
  const [m, y] = competencia.split('/')
  return new Date(parseInt(y), parseInt(m) - 1).getTime()
}

function getStrategyColor(strategyName: string, index: number) {
  return COLORS[index % COLORS.length]
}

function calculateCompoundReturn(monthlyReturns: number[]): number {
  if (monthlyReturns.length === 0) return 0
  return calculateCompoundedRates(monthlyReturns)
}

export function InvestmentDetailsTable({ performanceData, currency = 'BRL' }: InvestmentDetailsTableProps) {
  const { t } = useTranslation()
  const currentLocale = currency === 'BRL' ? 'pt-BR' : 'en-US'
  const uniquePeriods = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])]
  const sortedPeriods = uniquePeriods.sort((a, b) => toDate(a) - toDate(b))
  const mostRecent = [...sortedPeriods].sort((a, b) => toDate(b) - toDate(a))[0]

  // Only for sizing and counts, use most recent snapshot per strategy
  const mostRecentData = performanceData.filter(d => d.period === mostRecent)

  const strategySnapshot = mostRecentData.reduce((acc, item) => {
    const assetClass = item.asset_class || "Outros"
    if (!acc[assetClass]) acc[assetClass] = { name: assetClass, value: 0, count: 0 }
    acc[assetClass].value += Number(item.position || 0)
    acc[assetClass].count += 1
    return acc
  }, {} as Record<string, { name: string; value: number; count: number }>)

  const totalPatrimonio = Object.values(strategySnapshot).reduce((sum, item) => sum + item.value, 0)

  function calculateStrategyReturns(strategy: string) {
    const allStrategyData = performanceData.filter(p => (p.asset_class || "Outros") === strategy)
    if (allStrategyData.length === 0) return { month: 0, year: 0, sixMonths: 0, twelveMonths: 0, inception: 0 }

    // group by period -> weighted average return per period
    const byPeriod = allStrategyData.reduce((acc, item) => {
      const key = item.period || ''
      if (!key) return acc
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {} as Record<string, PerformanceData[]>)

    const periodList = Object.keys(byPeriod).sort((a, b) => toDate(a) - toDate(b))
    if (periodList.length === 0) return { month: 0, year: 0, sixMonths: 0, twelveMonths: 0, inception: 0 }

    const weightedReturns = periodList.map(period => {
      const items = byPeriod[period]
      const totalPos = items.reduce((s, x) => s + Number(x.position || 0), 0)
      const totalRet = items.reduce((s, x) => s + (Number(x.yield || 0) * Number(x.position || 0)), 0)
      const r = totalPos > 0 ? totalRet / totalPos : 0
      return { period, r }
    })

    const lastPeriod = periodList[periodList.length - 1]
    const month = weightedReturns.find(w => w.period === lastPeriod)?.r || 0

    const lastYear = lastPeriod?.slice(3)
    const yearReturns = weightedReturns.filter(w => w.period.endsWith(lastYear)).map(w => w.r)
    const year = calculateCompoundReturn(yearReturns)

    // Last 6 and 12 months (by available periods)
    const last6 = weightedReturns.slice(-6).map(w => w.r)
    const last12 = weightedReturns.slice(-12).map(w => w.r)
    const sixMonths = calculateCompoundReturn(last6)
    const twelveMonths = calculateCompoundReturn(last12)

    const inception = calculateCompoundReturn(weightedReturns.map(w => w.r))

    return { month, year, sixMonths, twelveMonths, inception }
  }

  const consolidated = Object.values(strategySnapshot)
    .map((item, index) => {
      const perf = calculateStrategyReturns(item.name)
      
      // Calcula os períodos únicos para esta estratégia
      const strategyPeriods = [...new Set(
        performanceData
          .filter(p => (p.asset_class || "Outros") === item.name)
          .map(p => p.period)
          .filter(Boolean) as string[]
      )]
      
      // Calcula benchmark para esta estratégia
      const benchmark = calculateBenchmarkReturns(
        item.name,
        currency,
        strategyPeriods,
        currentLocale
      )
      
      return {
        ...item,
        percentage: totalPatrimonio > 0 ? (item.value / totalPatrimonio) * 100 : 0,
        monthReturn: perf.month * 100,
        yearReturn: perf.year * 100,
        sixMonthsReturn: perf.sixMonths * 100,
        twelveMonthsReturn: perf.twelveMonths * 100,
        inceptionReturn: perf.inception * 100,
        index,
        benchmark,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  function getPerformanceColor(v: number): string {
    if (v > 2) return 'text-green-600 dark:text-green-500'
    if (v > 0.5) return 'text-black-600 dark:text-black-500'
    if (v > 0) return 'text-yellow-600 dark:text-yellow-500'
    return 'text-red-600 dark:text-red-500'
  }

  function getStrategyColorComparedToBenchmark(strategyReturn: number, benchmarkReturn: number | null): string {
    if (benchmarkReturn === null) {
      // Se não há benchmark, usa a cor padrão baseada no valor
      return getPerformanceColor(strategyReturn)
    }
    // Verde se maior que benchmark, vermelho se menor
    return strategyReturn >= benchmarkReturn
      ? 'text-green-600 dark:text-green-500'
      : 'text-red-600 dark:text-red-500'
  }

  // Cor do benchmark sempre em preto
  const benchmarkColor = 'text-foreground'

  return (
    <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
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
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStrategyColor(item.name, item.index) }} />
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
                        {item.benchmark ? (
                          <span className={benchmarkColor}>
                            {item.benchmark.monthReturn >= 0 ? '+' : ''}{item.benchmark.monthReturn.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">
                        {item.benchmark ? (
                          <span className={benchmarkColor}>
                            {item.benchmark.yearReturn >= 0 ? '+' : ''}{item.benchmark.yearReturn.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">
                        {item.benchmark ? (
                          <span className={benchmarkColor}>
                            {item.benchmark.sixMonthsReturn >= 0 ? '+' : ''}{item.benchmark.sixMonthsReturn.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">
                        {item.benchmark ? (
                          <span className={benchmarkColor}>
                            {item.benchmark.twelveMonthsReturn >= 0 ? '+' : ''}{item.benchmark.twelveMonthsReturn.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">
                        {item.benchmark ? (
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


