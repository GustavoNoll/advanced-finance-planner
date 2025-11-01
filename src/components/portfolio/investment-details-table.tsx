import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { PerformanceData } from "@/types/financial"
import { CurrencyCode } from "@/utils/currency"
import { calculateCompoundedRates } from "@/lib/financial-math"
import { useTranslation } from "react-i18next"

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

function groupStrategy(strategy?: string | null): string {
  const strategyLower = (strategy || 'Outros').toLowerCase()

  if (strategyLower.includes('cdi - liquidez')) return 'Pós Fixado - Liquidez'
  if (strategyLower.includes('cdi - fundos') || strategyLower.includes('cdi - titulos')) return 'Pós Fixado'
  if (strategyLower.includes('inflação')) return 'Inflação'
  if (strategyLower.includes('pré fixado')) return 'Pré Fixado'
  if (strategyLower.includes('multimercado')) return 'Multimercado'
  if (strategyLower.includes('imobili')) return 'Imobiliário'
  if (strategyLower.includes('ações')) return 'Ações'
  if (strategyLower.includes('long bias')) return 'Ações - Long Bias'
  if (strategyLower.includes('private equity') || strategyLower.includes('venture capital') || strategyLower.includes('special sits')) return 'Private Equity'
  if (strategyLower.includes('exterior') && strategyLower.includes('renda fixa')) return 'Exterior - Renda Fixa'
  if (strategyLower.includes('exterior') && (strategyLower.includes('ações') || strategyLower.includes('acoes'))) return 'Exterior - Ações'
  if (strategyLower.includes('coe')) return 'COE'
  if (strategyLower.includes('ouro')) return 'Ouro'
  if (strategyLower.includes('cripto')) return 'Criptoativos'

  return strategy || 'Outros'
}

const strategyOrder = [
  'Pós Fixado - Liquidez',
  'Pós Fixado',
  'Inflação',
  'Pré Fixado',
  'Multimercado',
  'Imobiliário',
  'Ações',
  'Ações - Long Bias',
  'Private Equity',
  'Exterior - Renda Fixa',
  'Exterior - Ações',
  'COE',
  'Ouro',
  'Criptoativos',
]

function getStrategyColor(strategyName: string) {
  const index = strategyOrder.indexOf(strategyName)
  return index !== -1 ? COLORS[index] : COLORS[0]
}

function calculateCompoundReturn(monthlyReturns: number[]): number {
  if (monthlyReturns.length === 0) return 0
  return calculateCompoundedRates(monthlyReturns)
}

export function InvestmentDetailsTable({ performanceData, currency = 'BRL' }: InvestmentDetailsTableProps) {
  const { t } = useTranslation()
  const uniquePeriods = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])]
  const sortedPeriods = uniquePeriods.sort((a, b) => toDate(a) - toDate(b))
  const mostRecent = [...sortedPeriods].sort((a, b) => toDate(b) - toDate(a))[0]

  // Only for sizing and counts, use most recent snapshot per strategy
  const mostRecentData = performanceData.filter(d => d.period === mostRecent)

  const strategySnapshot = mostRecentData.reduce((acc, item) => {
    const grouped = groupStrategy(item.asset_class)
    if (!acc[grouped]) acc[grouped] = { name: grouped, value: 0, count: 0 }
    acc[grouped].value += Number(item.position || 0)
    acc[grouped].count += 1
    return acc
  }, {} as Record<string, { name: string; value: number; count: number }>)

  const totalPatrimonio = Object.values(strategySnapshot).reduce((sum, item) => sum + item.value, 0)

  function calculateStrategyReturns(strategy: string) {
    const allStrategyData = performanceData.filter(p => groupStrategy(p.asset_class) === strategy)
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
    .map(item => {
      const perf = calculateStrategyReturns(item.name)
      return {
        ...item,
        percentage: totalPatrimonio > 0 ? (item.value / totalPatrimonio) * 100 : 0,
        monthReturn: perf.month * 100,
        yearReturn: perf.year * 100,
        sixMonthsReturn: perf.sixMonths * 100,
        twelveMonthsReturn: perf.twelveMonths * 100,
        inceptionReturn: perf.inception * 100,
      }
    })
    .sort((a, b) => {
      const ia = strategyOrder.indexOf(a.name)
      const ib = strategyOrder.indexOf(b.name)
      if (ia !== -1 && ib !== -1) return ia - ib
      if (ia !== -1) return -1
      if (ib !== -1) return 1
      return 0
    })

  function getBenchmark(strategyName: string) {
    switch (strategyName) {
      case 'Pós Fixado - Liquidez':
      case 'Pós Fixado':
      case 'Multimercado':
      case 'Private Equity':
      case 'COE':
        return '± CDI'
      case 'Inflação':
        return '± IPCA'
      case 'Pré Fixado':
        return '± IRF-M'
      case 'Imobiliário':
        return '± IFIX'
      case 'Ações':
      case 'Ações - Long Bias':
        return '± IBOV'
      case 'Exterior - Renda Fixa':
        return '± T-Bond'
      case 'Exterior - Ações':
        return '± S&P500'
      case 'Ouro':
        return '± Gold'
      case 'Criptoativos':
        return '± BTC'
      default:
        return '± CDI'
    }
  }

  function performanceBadge(v: number) {
    if (v > 2) return <Badge className="bg-success/20 text-success border-success/30">{t('portfolioPerformance.kpi.investmentDetails.performance.excellent')}</Badge>
    if (v > 0.5) return <Badge className="bg-info/20 text-info border-info/30">{t('portfolioPerformance.kpi.investmentDetails.performance.good')}</Badge>
    if (v > 0) return <Badge className="bg-warning/20 text-warning border-warning/30">{t('portfolioPerformance.kpi.investmentDetails.performance.regular')}</Badge>
    return <Badge className="bg-destructive/20 text-destructive border-destructive/30">{t('portfolioPerformance.kpi.investmentDetails.performance.negative')}</Badge>
  }

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
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStrategyColor(item.name) }} />
                        {item.name}
                      </TableCell>
                      <TableCell className={`text-center py-2 ${item.monthReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {item.monthReturn >= 0 ? '+' : ''}{item.monthReturn.toFixed(2)}%
                      </TableCell>
                      <TableCell className={`text-center py-2 ${item.yearReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {item.yearReturn >= 0 ? '+' : ''}{item.yearReturn.toFixed(2)}%
                      </TableCell>
                      <TableCell className={`text-center py-2 ${item.sixMonthsReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {item.sixMonthsReturn >= 0 ? '+' : ''}{item.sixMonthsReturn.toFixed(2)}%
                      </TableCell>
                      <TableCell className={`text-center py-2 ${item.twelveMonthsReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {item.twelveMonthsReturn >= 0 ? '+' : ''}{item.twelveMonthsReturn.toFixed(2)}%
                      </TableCell>
                      <TableCell className={`text-center py-2 ${item.inceptionReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {item.inceptionReturn >= 0 ? '+' : ''}{item.inceptionReturn.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                    <TableRow key={`${item.name}-benchmark`} className="border-border/50 bg-muted/20">
                      <TableCell className="font-medium text-muted-foreground pl-8 py-1">
                        {getBenchmark(item.name)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">-</TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">-</TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">-</TableCell>
                      <TableCell className="text-center text-muted-foreground py-1">-</TableCell>
                      <TableCell className="text-center text-muted-foreground py-1 text-xs">0</TableCell>
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


