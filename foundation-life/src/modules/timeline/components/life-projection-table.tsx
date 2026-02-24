'use client'

import { useState, useMemo, Fragment } from 'react'
import type { LifeYearlyPoint, LifeMonthlyPoint } from '@/modules/core/domain/life-types'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { formatCurrency } from '@/lib/format-currency'

interface LifeProjectionTableProps {
  yearlyData: LifeYearlyPoint[]
  monthlyData: LifeMonthlyPoint[]
}

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function LifeProjectionTable({
  yearlyData,
  monthlyData,
}: LifeProjectionTableProps) {
  const currency = useCurrency()
  const [expandedYear, setExpandedYear] = useState<number | null>(null)

  const monthlyByYear = useMemo(() => {
    const map = new Map<number, LifeMonthlyPoint[]>()
    for (const p of monthlyData) {
      const y = p.date.getFullYear()
      if (!map.has(y)) map.set(y, [])
      map.get(y)!.push(p)
    }
    map.forEach(arr => arr.sort((a, b) => a.date.getTime() - b.date.getTime()))
    return map
  }, [monthlyData])

  if (!yearlyData.length) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 py-8 text-center text-sm text-muted-foreground">
        Nenhum dado no período. Altere o filtro acima.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted/10">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-8 px-2 py-2" aria-hidden />
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Ano
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Idade
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Renda anual
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Gastos anuais
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Aportes
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Patrimônio final
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {yearlyData.map(row => {
              const surplus = row.income - row.expenses
              const isPositiveSurplus = surplus > 0
              return (
              <Fragment key={row.year}>
                <tr
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-muted/50',
                    expandedYear === row.year && 'bg-muted/50'
                  )}
                  onClick={() => setExpandedYear(y => (y === row.year ? null : row.year))}
                >
                  <td className="w-8 px-2 py-2">
                    <span
                      className={cn(
                        'inline-block',
                        isPositiveSurplus ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'
                      )}
                      aria-hidden
                    >
                      {expandedYear === row.year ? '▼' : '▶'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-foreground">{row.year}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground">{row.age}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground">
                    {formatCurrency(row.income, currency)}
                  </td>
                  <td className="px-4 py-2 text-right text-muted-foreground">
                    {formatCurrency(row.expenses, currency)}
                  </td>
                  <td className="px-4 py-2 text-right text-muted-foreground">
                    {formatCurrency(row.contribution, currency)}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-foreground">
                    {formatCurrency(row.netWorth, currency)}
                  </td>
                </tr>
                {expandedYear === row.year && (() => {
                  const months = monthlyByYear.get(row.year) ?? []
                  if (!months.length) {
                    return (
                      <tr key={`${row.year}-empty`}>
                        <td colSpan={7} className="bg-muted/20 px-4 py-2 text-center text-xs text-muted-foreground">
                          Nenhum dado mensal para este ano.
                        </td>
                      </tr>
                    )
                  }
                  return (
                    <tr key={`${row.year}-monthly`}>
                      <td colSpan={7} className="bg-muted/20 p-0">
                        <table className="min-w-full text-xs">
                          <thead>
                            <tr className="border-b border-border/50 text-muted-foreground">
                              <th className="w-6 px-2 py-1.5" aria-hidden />
                              <th className="px-4 py-1.5 text-left">Mês</th>
                              <th className="px-4 py-1.5 text-right">Idade</th>
                              <th className="px-4 py-1.5 text-right">Renda</th>
                              <th className="px-4 py-1.5 text-right">Gastos</th>
                              <th className="px-4 py-1.5 text-right">Aporte</th>
                              <th className="px-4 py-1.5 text-right">Patrimônio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {months.map((m, i) => {
                              const monthSurplus = m.income - m.expenses
                              const monthPositive = monthSurplus > 0
                              return (
                              <tr key={i} className="border-b border-border/30 last:border-0">
                                <td className="w-6 px-2 py-1.5 align-middle">
                                  <span
                                    className={cn(
                                      'inline-block h-2 w-2 shrink-0 rounded-full',
                                      monthPositive ? 'bg-blue-500' : 'bg-amber-500'
                                    )}
                                    aria-hidden
                                  />
                                </td>
                                <td className="px-4 py-1.5 text-muted-foreground">
                                  {MONTH_NAMES[m.date.getMonth()]} {m.date.getFullYear()}
                                </td>
                                <td className="px-4 py-1.5 text-right text-muted-foreground">{m.age}</td>
                                <td className="px-4 py-1.5 text-right text-muted-foreground">
                                  {formatCurrency(m.income, currency)}
                                </td>
                                <td className="px-4 py-1.5 text-right text-muted-foreground">
                                  {formatCurrency(m.expenses, currency)}
                                </td>
                                <td className="px-4 py-1.5 text-right text-muted-foreground">
                                  {formatCurrency(m.contribution, currency)}
                                </td>
                                <td className="px-4 py-1.5 text-right font-medium text-foreground">
                                  {formatCurrency(m.netWorth, currency)}
                                </td>
                              </tr>
                            )
                            })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )
                })()}
              </Fragment>
            )
            })}
          </tbody>
        </table>
    </div>
  )
}
