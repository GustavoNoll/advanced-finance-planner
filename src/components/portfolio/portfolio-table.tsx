import { Fragment, useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronUp, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ConsolidatedPerformance } from "@/types/financial"
import { calculateCompoundedRates } from "@/lib/financial-math"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/CurrencyContext"

interface MarketPoint { period: string; clientTarget: number }

interface PortfolioTableProps {
  consolidatedData: ConsolidatedPerformance[]
  filteredRange?: { start: string; end: string }
  onYearTotalsChange?: (totals: { totalPatrimonio: number; totalRendimento: number } | null) => void
  marketData?: MarketPoint[]
}

export function PortfolioTable({ consolidatedData, filteredRange, onYearTotalsChange, marketData }: PortfolioTableProps) {
  const { t } = useTranslation()
  const { convertValue, adjustReturnWithFX, formatCurrency: formatCurrencyContext } = useCurrency()
  const periodToDate = (period?: string | null) => {
    if (!period) return 0
    const [month, year] = period.split('/')
    return new Date(parseInt(year), parseInt(month) - 1).getTime()
  }
  const getOriginalCurrency = (currency?: string | null) => currency === 'USD' || currency === 'Dolar' ? 'USD' : 'BRL'

  const filtered = useMemo(() => {
    if (!filteredRange?.start || !filteredRange?.end) return consolidatedData
    const start = periodToDate(filteredRange.start)
    const end = periodToDate(filteredRange.end)
    return consolidatedData.filter(r => {
      const d = periodToDate(r.period)
      return d >= start && d <= end
    })
  }, [consolidatedData, filteredRange])

  const byYear = useMemo(() => {
    const groups = new Map<string, ConsolidatedPerformance[]>()
    filtered.forEach(r => {
      const year = (r.period || '').split('/')[1] || '-'
      const arr = groups.get(year) || []
      arr.push(r)
      groups.set(year, arr)
    })
    return Array.from(groups.entries()).map(([year, rows]) => {
      const sorted = [...rows].sort((a, b) => periodToDate(a.period) - periodToDate(b.period))
      const oldest = sorted[0]
      const mostRecent = sorted[sorted.length - 1]
      
      // Convert values considering currency
      const movement = rows.reduce((s, r) => {
        const originalCurrency = getOriginalCurrency(r.currency)
        return s + convertValue(Number(r.movement || 0), r.period || '', originalCurrency)
      }, 0)
      const taxes = rows.reduce((s, r) => {
        const originalCurrency = getOriginalCurrency(r.currency)
        return s + convertValue(Number(r.taxes || 0), r.period || '', originalCurrency)
      }, 0)
      const gain = rows.reduce((s, r) => {
        const originalCurrency = getOriginalCurrency(r.currency)
        return s + convertValue(Number(r.financial_gain || 0), r.period || '', originalCurrency)
      }, 0)
      
      // Adjust yields with FX
      const adjustedYields = sorted.map(r => {
        const originalCurrency = getOriginalCurrency(r.currency)
        return adjustReturnWithFX(Number(r.yield || 0), r.period || '', originalCurrency)
      })
      const compound = calculateCompoundedRates(adjustedYields)
      // Compose portfolio return vs. client target to highlight deltas
      let ppAbove: string | null = null
      if (marketData && marketData.length > 0) {
        const [first, last] = [sorted[0].period!, sorted[sorted.length - 1].period!]
        const pts = marketData
          .filter(m => periodToDate(m.period) >= periodToDate(first) && periodToDate(m.period) <= periodToDate(last))
          .sort((a, b) => periodToDate(a.period) - periodToDate(b.period))
        const targetCompound = calculateCompoundedRates(pts.map(p => p.clientTarget || 0))
        ppAbove = `${((compound - targetCompound) * 100).toFixed(2)}pp`
      }
      const best = rows.reduce((best, cur) => {
        const curOriginalCurrency = getOriginalCurrency(cur.currency)
        const bestOriginalCurrency = getOriginalCurrency(best.currency)
        const curYield = adjustReturnWithFX(Number(cur.yield || 0), cur.period || '', curOriginalCurrency)
        const bestYield = adjustReturnWithFX(Number(best.yield || 0), best.period || '', bestOriginalCurrency)
        return curYield > bestYield ? cur : best
      }, rows[0])
      
      const oldestOriginalCurrency = getOriginalCurrency(oldest.currency)
      const mostRecentOriginalCurrency = getOriginalCurrency(mostRecent.currency)
      
      return {
        year,
        initial: convertValue(Number(oldest.initial_assets || 0), oldest.period || '', oldestOriginalCurrency),
        movement,
        taxes,
        final: convertValue(Number(mostRecent.final_assets || 0), mostRecent.period || '', mostRecentOriginalCurrency),
        gain,
        compound,
        bestMonth: best.period || '',
        ppAbove
      }
    }).sort((a, b) => b.year.localeCompare(a.year))
  }, [filtered, marketData, convertValue, adjustReturnWithFX])

  // Build months per year aggregates similar to reference component
  const monthsByYear = useMemo(() => {
    const yearToMonths = new Map<string, Array<{ period: string; initial: number; movement: number; taxes: number; final: number; gain: number; yield: number }>>()
    const periodAgg = new Map<string, { initial: number; movement: number; taxes: number; final: number; gain: number; yieldWeighted: number; weight: number }>()
    filtered.forEach(r => {
      const p = r.period || '-'
      const originalCurrency = getOriginalCurrency(r.currency)
      const agg = periodAgg.get(p) || { initial: 0, movement: 0, taxes: 0, final: 0, gain: 0, yieldWeighted: 0, weight: 0 }
      agg.initial += convertValue(Number(r.initial_assets || 0), p, originalCurrency)
      agg.movement += convertValue(Number(r.movement || 0), p, originalCurrency)
      agg.taxes += convertValue(Number(r.taxes || 0), p, originalCurrency)
      agg.final += convertValue(Number(r.final_assets || 0), p, originalCurrency)
      agg.gain += convertValue(Number(r.financial_gain || 0), p, originalCurrency)
      const weight = convertValue(Number(r.final_assets || 0), p, originalCurrency)
      const adjustedYield = adjustReturnWithFX(Number(r.yield || 0), p, originalCurrency)
      agg.yieldWeighted += adjustedYield * weight
      agg.weight += weight
      periodAgg.set(p, agg)
    })
    Array.from(periodAgg.entries()).forEach(([period, v]) => {
      const year = period.split('/')[1] || '-'
      const arr = yearToMonths.get(year) || []
      arr.push({
        period,
        initial: v.initial,
        movement: v.movement,
        taxes: v.taxes,
        final: v.final,
        gain: v.gain,
        yield: v.weight > 0 ? v.yieldWeighted / v.weight : 0
      })
      yearToMonths.set(year, arr)
    })
    // sort months desc within each year
    Array.from(yearToMonths.keys()).forEach(y => {
      const arr = yearToMonths.get(y)!
      arr.sort((a, b) => periodToDate(b.period) - periodToDate(a.period))
    })
    return yearToMonths
  }, [filtered, convertValue, adjustReturnWithFX])

  const totals = useMemo(() => {
    if (byYear.length === 0) return null
    const initial = byYear[byYear.length - 1].initial
    const movement = byYear.reduce((s, y) => s + y.movement, 0)
    const taxes = byYear.reduce((s, y) => s + y.taxes, 0)
    const gain = byYear.reduce((s, y) => s + y.gain, 0)
    const final = byYear[0].final
    const compound = calculateCompoundedRates(byYear.map(y => y.compound))
    return { initial, movement, taxes, final, gain, compound }
  }, [byYear])

  useEffect(() => {
    if (!onYearTotalsChange) return
    if (totals) onYearTotalsChange({ totalPatrimonio: totals.final, totalRendimento: totals.compound })
    else onYearTotalsChange(null)
  }, [totals, onYearTotalsChange])

  const formatCurrencyValue = (v: number) => formatCurrencyContext(v || 0)

  const monthShort = (period?: string | null) => {
    if (!period) return '-'
    const [m] = period.split('/')
    const monthNames = t('portfolioPerformance.months.short', { returnObjects: true }) as string[]
    const fallbackMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dictionary = monthNames?.length === 12 ? monthNames : fallbackMonths
    const idx = Math.max(1, Math.min(12, parseInt(m))) - 1
    return dictionary[idx] || '-'
  }

  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
  const toggleYear = (year: string) => {
    const next = new Set(expandedYears)
    if (next.has(year)) next.delete(year)
    else next.add(year)
    setExpandedYears(next)
  }

  return (
    <Card className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
      <CardHeader>
        <CardTitle className="text-foreground">{t('portfolioPerformance.kpi.table.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('portfolioPerformance.kpi.table.description')}</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground w-8"></TableHead>
                <TableHead className="text-muted-foreground">{t('portfolioPerformance.kpi.table.period')}</TableHead>
                <TableHead className="text-muted-foreground">{t('portfolioPerformance.kpi.table.initialAssets')}</TableHead>
                <TableHead className="text-muted-foreground">{t('portfolioPerformance.kpi.table.movement')}</TableHead>
                <TableHead className="text-muted-foreground">{t('portfolioPerformance.kpi.table.taxes')}</TableHead>
                <TableHead className="text-muted-foreground">{t('portfolioPerformance.kpi.table.finalAssets')}</TableHead>
                <TableHead className="text-muted-foreground">{t('portfolioPerformance.kpi.table.gain')}</TableHead>
                <TableHead className="text-muted-foreground">{t('portfolioPerformance.kpi.rentability')}</TableHead>
                <TableHead className="text-muted-foreground">{t('portfolioPerformance.kpi.rentabilityVsTarget')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byYear.map(y => (
                <Fragment key={y.year}>
                  <TableRow className="border-border/50 bg-muted/10">
                    <TableCell className="text-foreground font-semibold flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                      <button aria-label="toggle-year" className="text-muted-foreground" onClick={() => toggleYear(y.year)}>
                        {expandedYears.has(y.year) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-foreground font-semibold">{y.year}</TableCell>
                    <TableCell className="text-foreground">{formatCurrencyValue(y.initial)}</TableCell>
                    <TableCell className="text-destructive">{formatCurrencyValue(y.movement)}</TableCell>
                    <TableCell className="text-destructive">{formatCurrencyValue(y.taxes)}</TableCell>
                    <TableCell className="text-foreground">{formatCurrencyValue(y.final)}</TableCell>
                    <TableCell className="text-success">{formatCurrencyValue(y.gain)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${y.compound >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>{(y.compound * 100).toFixed(2)}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-sm font-medium bg-muted/20 text-muted-foreground">{y.ppAbove || 'N/A'}</span>
                    </TableCell>
                  </TableRow>
                  {expandedYears.has(y.year) && monthsByYear.get(y.year)?.map(m => (
                    <TableRow key={`${y.year}-${m.period}`} className="border-border/50">
                      <TableCell className="text-foreground pl-8 flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                        {y.bestMonth === m.period && <Trophy className="h-4 w-4 text-yellow-600" />}
                      </TableCell>
                      <TableCell className="text-foreground">{monthShort(m.period)}</TableCell>
                      <TableCell className="text-foreground">{formatCurrencyValue(m.initial)}</TableCell>
                      <TableCell className="text-destructive">{formatCurrencyValue(m.movement)}</TableCell>
                      <TableCell className="text-destructive">{formatCurrencyValue(m.taxes)}</TableCell>
                      <TableCell className="text-foreground">{formatCurrencyValue(m.final)}</TableCell>
                      <TableCell className="text-success">{formatCurrencyValue(m.gain)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${m.yield >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>{(m.yield * 100).toFixed(2)}%</span>
                      </TableCell>
                      <TableCell className="text-foreground">N/A</TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}

              {/* No row extra para mês mais recente; os meses aparecem dentro do respectivo ano */}

              {totals && (
                <TableRow className="border-border/50">
                  <TableCell className="text-foreground flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                  </TableCell>
                  <TableCell className="text-foreground font-semibold">{t('portfolioPerformance.kpi.table.total')}</TableCell>
                  <TableCell className="text-foreground">{formatCurrencyValue(totals.initial)}</TableCell>
                  <TableCell className="text-destructive">{formatCurrencyValue(totals.movement)}</TableCell>
                  <TableCell className="text-destructive">{formatCurrencyValue(totals.taxes)}</TableCell>
                  <TableCell className="text-foreground">{formatCurrencyValue(totals.final)}</TableCell>
                  <TableCell className="text-success">{formatCurrencyValue(totals.gain)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${totals.compound >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>{(totals.compound * 100).toFixed(2)}%</span>
                  </TableCell>
                  <TableCell className="text-foreground">{marketData && marketData.length ? `${(totals.compound * 100).toFixed(2)}pp` : 'N/A'}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {byYear.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">🏆 {t('portfolioPerformance.kpi.bestMonthRentability')}</div>
        )}
      </CardContent>
    </Card>
  )
}


