import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronUp, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ConsolidatedPerformance } from "@/types/financial"

interface MarketPoint { competencia: string; clientTarget: number }

interface PortfolioTableProps {
  consolidatedData: ConsolidatedPerformance[]
  filteredRange?: { inicio: string; fim: string }
  onYearTotalsChange?: (totals: { totalPatrimonio: number; totalRendimento: number } | null) => void
  marketData?: MarketPoint[]
}

export function PortfolioTable({ consolidatedData, filteredRange, onYearTotalsChange, marketData }: PortfolioTableProps) {
  const toDate = (comp?: string | null) => {
    if (!comp) return 0
    const [m, y] = comp.split('/')
    return new Date(parseInt(y), parseInt(m) - 1).getTime()
  }

  const filtered = useMemo(() => {
    if (!filteredRange?.inicio || !filteredRange?.fim) return consolidatedData
    const start = toDate(filteredRange.inicio)
    const end = toDate(filteredRange.fim)
    return consolidatedData.filter(r => {
      const d = toDate(r.period)
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
      const sorted = [...rows].sort((a, b) => toDate(a.period) - toDate(b.period))
      const oldest = sorted[0]
      const mostRecent = sorted[sorted.length - 1]
      const movement = rows.reduce((s, r) => s + Number(r.movement || 0), 0)
      const taxes = rows.reduce((s, r) => s + Number(r.taxes || 0), 0)
      const gain = rows.reduce((s, r) => s + Number(r.financial_gain || 0), 0)
      const compound = sorted.reduce((acc, r) => (1 + acc) * (1 + Number(r.yield || 0)) - 1, 0)
      // Target compose
      let ppAbove: string | null = null
      if (marketData && marketData.length > 0) {
        const [first, last] = [sorted[0].period!, sorted[sorted.length - 1].period!]
        const pts = marketData
          .filter(m => toDate(m.competencia) >= toDate(first) && toDate(m.competencia) <= toDate(last))
          .sort((a, b) => toDate(a.competencia) - toDate(b.competencia))
        const targetCompound = pts.reduce((acc, p) => (1 + acc) * (1 + (p.clientTarget || 0)) - 1, 0)
        ppAbove = `${((compound - targetCompound) * 100).toFixed(2)}pp`
      }
      const best = rows.reduce((best, cur) => (Number(cur.yield || 0) > Number(best.yield || 0) ? cur : best), rows[0])
      return {
        year,
        initial: Number(oldest.initial_assets || 0),
        movement,
        taxes,
        final: Number(mostRecent.final_assets || 0),
        gain,
        compound,
        bestMonth: best.period || '',
        ppAbove
      }
    }).sort((a, b) => b.year.localeCompare(a.year))
  }, [filtered, marketData])

  // Build months per year aggregates similar to reference component
  const monthsByYear = useMemo(() => {
    const yearToMonths = new Map<string, Array<{ period: string; initial: number; movement: number; taxes: number; final: number; gain: number; yield: number }>>()
    const periodAgg = new Map<string, { initial: number; movement: number; taxes: number; final: number; gain: number; yieldWeighted: number; weight: number }>()
    filtered.forEach(r => {
      const p = r.period || '-'
      const agg = periodAgg.get(p) || { initial: 0, movement: 0, taxes: 0, final: 0, gain: 0, yieldWeighted: 0, weight: 0 }
      agg.initial += Number(r.initial_assets || 0)
      agg.movement += Number(r.movement || 0)
      agg.taxes += Number(r.taxes || 0)
      agg.final += Number(r.final_assets || 0)
      agg.gain += Number(r.financial_gain || 0)
      const weight = Number(r.final_assets || 0)
      agg.yieldWeighted += Number(r.yield || 0) * weight
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
      arr.sort((a, b) => toDate(b.period) - toDate(a.period))
    })
    return yearToMonths
  }, [filtered])

  const mostRecentMonthRow = useMemo(() => {
    if (filtered.length === 0) return null
    return filtered.reduce((latest, cur) => (toDate(cur.period) > toDate(latest.period) ? cur : latest), filtered[0])
  }, [filtered])

  const totals = useMemo(() => {
    if (byYear.length === 0) return null
    const initial = byYear[byYear.length - 1].initial
    const movement = byYear.reduce((s, y) => s + y.movement, 0)
    const taxes = byYear.reduce((s, y) => s + y.taxes, 0)
    const gain = byYear.reduce((s, y) => s + y.gain, 0)
    const final = byYear[0].final
    const compound = byYear.reduce((acc, y) => (1 + acc) * (1 + y.compound) - 1, 0)
    return { initial, movement, taxes, final, gain, compound }
  }, [byYear])

  useEffect(() => {
    if (!onYearTotalsChange) return
    if (totals) onYearTotalsChange({ totalPatrimonio: totals.final, totalRendimento: totals.compound })
    else onYearTotalsChange(null)
  }, [totals, onYearTotalsChange])

  const currency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v || 0)

  const monthShort = (period?: string | null) => {
    if (!period) return '-'
    const [m] = period.split('/')
    const map = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']
    const idx = Math.max(1, Math.min(12, parseInt(m))) - 1
    return map[idx]
  }

  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
  const toggleYear = (year: string) => {
    const next = new Set(expandedYears)
    if (next.has(year)) next.delete(year)
    else next.add(year)
    setExpandedYears(next)
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
      <CardHeader>
        <CardTitle className="text-foreground">Resumo do Patrimônio</CardTitle>
        <p className="text-sm text-muted-foreground">Evolução patrimonial consolidada com retornos acumulados</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground w-8"></TableHead>
                <TableHead className="text-muted-foreground">Competência</TableHead>
                <TableHead className="text-muted-foreground">Patrimônio Inicial</TableHead>
                <TableHead className="text-muted-foreground">Movimentações</TableHead>
                <TableHead className="text-muted-foreground">Imposto</TableHead>
                <TableHead className="text-muted-foreground">Patrimônio Final</TableHead>
                <TableHead className="text-muted-foreground">Rendimento</TableHead>
                <TableHead className="text-muted-foreground">Rentabilidade</TableHead>
                <TableHead className="text-muted-foreground">Rentabilidade (pp acima da meta)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byYear.map(y => (
                <>
                  <TableRow key={y.year} className="border-border/50 bg-muted/10">
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
                    <TableCell className="text-foreground">{currency(y.initial)}</TableCell>
                    <TableCell className="text-destructive">{currency(y.movement)}</TableCell>
                    <TableCell className="text-destructive">{currency(y.taxes)}</TableCell>
                    <TableCell className="text-foreground">{currency(y.final)}</TableCell>
                    <TableCell className="text-success">{currency(y.gain)}</TableCell>
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
                      <TableCell className="text-foreground">{currency(m.initial)}</TableCell>
                      <TableCell className="text-destructive">{currency(m.movement)}</TableCell>
                      <TableCell className="text-destructive">{currency(m.taxes)}</TableCell>
                      <TableCell className="text-foreground">{currency(m.final)}</TableCell>
                      <TableCell className="text-success">{currency(m.gain)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${m.yield >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>{(m.yield * 100).toFixed(2)}%</span>
                      </TableCell>
                      <TableCell className="text-foreground">N/A</TableCell>
                    </TableRow>
                  ))}
                </>
              ))}

              {/* No row extra para mês mais recente; os meses aparecem dentro do respectivo ano */}

              {totals && (
                <TableRow className="border-border/50">
                  <TableCell className="text-foreground flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                  </TableCell>
                  <TableCell className="text-foreground font-semibold">Total</TableCell>
                  <TableCell className="text-foreground">{currency(totals.initial)}</TableCell>
                  <TableCell className="text-destructive">{currency(totals.movement)}</TableCell>
                  <TableCell className="text-destructive">{currency(totals.taxes)}</TableCell>
                  <TableCell className="text-foreground">{currency(totals.final)}</TableCell>
                  <TableCell className="text-success">{currency(totals.gain)}</TableCell>
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
          <div className="mt-4 text-sm text-muted-foreground">🏆 Mês com melhor rentabilidade do ano</div>
        )}
      </CardContent>
    </Card>
  )
}


