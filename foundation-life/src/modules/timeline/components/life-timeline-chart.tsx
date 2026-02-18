'use client'

import { useMemo } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import type { LifeMonthlyPoint } from '@/modules/core/domain/life-types'
import { useCurrency } from '@/contexts/currency-context'
import { formatCurrencyShort } from '@/lib/format-currency'

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

interface LifeTimelineChartProps {
  data: LifeMonthlyPoint[]
}

export function LifeTimelineChart({ data }: LifeTimelineChartProps) {
  const currency = useCurrency()
  const { chartData, showMonthly, xAxisKey, xInterval } = useMemo(() => {
    const isShortRange = data.length > 0 && data.length <= 24
    if (isShortRange) {
      const points = data.map(point => ({
        label: `${MONTH_NAMES[point.date.getMonth()]} ${point.date.getFullYear()}`,
        sortKey: point.date.getTime(),
        netWorth: Math.round(point.netWorth),
        realNetWorth: Math.round(point.realNetWorth),
      }))
      return { chartData: points, showMonthly: true, xAxisKey: 'label' as const, xInterval: 0 as const }
    }
    const yearlyPoints = data.filter(point => point.date.getMonth() === 0)
    const points = yearlyPoints.map(point => ({
      label: String(point.date.getFullYear()),
      sortKey: point.date.getTime(),
      netWorth: Math.round(point.netWorth),
      realNetWorth: Math.round(point.realNetWorth),
    }))
    const interval = points.length > 20 ? Math.floor(points.length / 10) : 0
    return { chartData: points, showMonthly: false, xAxisKey: 'label' as const, xInterval: interval }
  }, [data])

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
        Nenhum dado no período selecionado. Altere o filtro ou configure seus dados.
      </div>
    )
  }

  return (
    <div className="h-72 w-full rounded-xl border border-border bg-muted/20 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey={xAxisKey}
            className="text-muted-foreground"
            tickLine={false}
            interval={showMonthly && chartData.length > 6 ? 'preserveStartEnd' : xInterval}
            height={22}
            style={{ fontSize: 14 }}
          />
          <YAxis
            className="text-muted-foreground"
            tickLine={false}
            tickFormatter={v => formatCurrencyShort(v, currency)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderRadius: 8,
              border: '1px solid hsl(var(--border))',
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [formatCurrencyShort(value, currency), name]}
          />
          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
            name="Patrimônio (nominal)"
          />
          <Line
            type="monotone"
            dataKey="realNetWorth"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={false}
            name="Patrimônio (real)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

