import React, { useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { formatCurrency } from '@/utils/currency'
import type { ComparisonClientData } from '../types/client-comparison'
import type { CurrencyCode } from '@/utils/currency'
import type { MonthlyProjectionData } from '@/lib/calculations/chart-projections'

const COMPARISON_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_NAMES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

interface ProjectionTableComparisonProps {
  clientData: ComparisonClientData[]
}

export function ProjectionTableComparison({ clientData }: ProjectionTableComparisonProps) {
  const { t, i18n } = useTranslation()
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())
  const monthNames = i18n.language?.startsWith('pt') ? MONTH_NAMES_PT : MONTH_NAMES_EN

  const toggleYearExpansion = useCallback((year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }, [])

  const { rows, clientNames } = useMemo(() => {
    if (clientData.length === 0) return { rows: [], clientNames: [] as string[] }

    const yearToData = new Map<
      number,
      Record<string, { balance: number; effectiveRate: number | null; isProjected: boolean }>
    >()
    const allYears: number[] = []

    for (const client of clientData) {
      for (const yearRow of client.projectionData) {
        if (!yearToData.has(yearRow.year)) {
          yearToData.set(yearRow.year, {})
          allYears.push(yearRow.year)
        }
        const row = yearToData.get(yearRow.year)!
        const effectiveRate = yearRow.effectiveRate ?? null
        row[client.profile.name] = {
          balance: yearRow.planned_balance ?? 0,
          effectiveRate: Number.isFinite(effectiveRate as number) ? effectiveRate : null,
          isProjected: !yearRow.hasHistoricalData,
        }
      }
    }

    allYears.sort((a, b) => a - b)
    const clientNames = clientData.map((c) => c.profile.name)

    const rows = allYears.map((year) => {
      const row = yearToData.get(year)!
      return {
        year,
        ...Object.fromEntries(
          clientNames.map((n) => [
            n,
            row[n] ?? { balance: null, effectiveRate: null, isProjected: true },
          ])
        ),
      }
    })

    return { rows, clientNames }
  }, [clientData])

  if (clientData.length === 0) return null

  const currency = (clientData[0]?.plan?.currency || 'BRL') as CurrencyCode

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800/50">
            <TableHead className="font-semibold">{t('clientComparison.table.year')}</TableHead>
            {clientNames.map((name, i) => (
              <TableHead
                key={name}
                colSpan={2}
                className="text-right font-semibold"
                style={{ color: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}
              >
                {name}
              </TableHead>
            ))}
          </TableRow>
          <TableRow className="bg-slate-100/50 dark:bg-slate-800/30">
            <TableHead className="font-medium text-xs" />
            {clientNames.map((name) => (
              <React.Fragment key={name}>
                <TableHead className="text-right text-xs font-medium w-28">
                  {t('clientComparison.table.balance')}
                </TableHead>
                <TableHead className="text-right text-xs font-medium w-24">
                  {t('clientComparison.table.targetReturn')}
                </TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.slice(0, 30).map((row) => {
            const hasMonths = clientData.some(
              (c) =>
                c.projectionData?.find((y) => y.year === row.year)?.months &&
                (c.projectionData?.find((y) => y.year === row.year)?.months?.length ?? 0) > 0
            )
            const isExpanded = expandedYears.has(row.year)
            return (
              <React.Fragment key={row.year}>
                <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-1">
                      {hasMonths ? (
                        <button
                          type="button"
                          onClick={() => toggleYearExpansion(row.year)}
                          className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                          aria-label={
                            isExpanded
                              ? t('clientComparison.table.collapseYear')
                              : t('clientComparison.table.expandYear')
                          }
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      ) : (
                        <span className="w-5 inline-block" />
                      )}
                      {row.year}
                    </span>
                  </TableCell>
                  {clientNames.map((name) => {
                    const cell = row[name] as {
                      balance: number | null
                      effectiveRate: number | null
                      isProjected: boolean
                    }
                    const valueToneClass = cell?.isProjected
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-slate-900 dark:text-slate-100 font-semibold'
                    return (
                      <React.Fragment key={name}>
                        <TableCell className={`text-right font-mono ${valueToneClass}`}>
                          {cell?.balance != null
                            ? formatCurrency(cell.balance, currency)
                            : '-'}
                        </TableCell>
                        <TableCell className={`text-right font-mono text-sm ${valueToneClass}`}>
                          {cell?.balance != null && cell?.effectiveRate != null
                            ? `${(cell.effectiveRate * 100).toFixed(2)}%`
                            : '-'}
                        </TableCell>
                      </React.Fragment>
                    )
                  })}
                </TableRow>
                {isExpanded &&
                  hasMonths &&
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((monthNum) => {
                    return (
                      <TableRow
                        key={`${row.year}-${monthNum}`}
                        className="bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-700/30 text-sm"
                      >
                        <TableCell className="pl-10 font-medium text-slate-600 dark:text-slate-400">
                          {monthNames[monthNum - 1]}
                        </TableCell>
                        {clientNames.map((name) => {
                          const client = clientData.find((c) => c.profile.name === name)
                          const yearData = client?.projectionData?.find((y) => y.year === row.year)
                          const monthData = yearData?.months?.find(
                            (m) => m.month === monthNum
                          ) as MonthlyProjectionData | undefined
                          const balance = monthData?.planned_balance ?? null
                          const effectiveRate = monthData?.effectiveRate ?? null
                          const isProjected = monthData ? !monthData.isHistorical : true
                          const valueToneClass = isProjected
                            ? 'text-slate-500 dark:text-slate-400'
                            : 'text-slate-900 dark:text-slate-100 font-semibold'
                          return (
                            <React.Fragment key={name}>
                              <TableCell className={`text-right font-mono text-xs ${valueToneClass}`}>
                                {balance != null
                                  ? formatCurrency(balance, currency)
                                  : '-'}
                              </TableCell>
                              <TableCell className={`text-right font-mono text-xs ${valueToneClass}`}>
                                {balance != null && effectiveRate != null
                                  ? `${(effectiveRate * 100).toFixed(2)}%`
                                  : '-'}
                              </TableCell>
                            </React.Fragment>
                          )
                        })}
                      </TableRow>
                    )
                  })}
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>
      <div className="p-3 text-sm text-slate-500 dark:text-slate-400 border-t dark:border-slate-700 space-y-1">
        {rows.length > 30 && (
          <p>{t('clientComparison.table.showingFirst', { count: 30, total: rows.length })}</p>
        )}
        <p className="text-xs">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {t('clientComparison.table.realDataLegend', { defaultValue: 'Dados reais' })}
          </span>
          {' · '}
          <span className="text-slate-500 dark:text-slate-400">
            {t('clientComparison.table.projectedLegend', { defaultValue: 'Dados projetados' })}
          </span>
        </p>
      </div>
    </div>
  )
}
