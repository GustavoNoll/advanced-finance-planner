import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/utils/currency'
import type { ComparisonClientData } from '../types/client-comparison'

const COMPARISON_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']

interface ProjectionChartComparisonProps {
  clientData: ComparisonClientData[]
}

export function ProjectionChartComparison({ clientData }: ProjectionChartComparisonProps) {
  const { t } = useTranslation()

  const { chartData, dataKeys } = useMemo(() => {
    if (clientData.length === 0) return { chartData: [], dataKeys: [] as string[] }

    const dateToPoint = new Map<string, Record<string, number | string>>()
    const allDates: string[] = []

    for (const client of clientData) {
      for (const point of client.chartData) {
        const dateKey = `${point.year}-${String(point.month).padStart(2, '0')}`
        const rawValue = point.projectedValue ?? point.actualValue ?? 0
        const value = Math.max(0, Number(rawValue))

        if (!dateToPoint.has(dateKey)) {
          dateToPoint.set(dateKey, { dateKey, dateLabel: `${point.month}/${point.year}` })
          allDates.push(dateKey)
        }
        const row = dateToPoint.get(dateKey)!
        row[client.profile.name] = value
      }
    }

    allDates.sort()
    const dataKeys = clientData.map((c) => c.profile.name)

    const chartData = allDates.map((dk) => dateToPoint.get(dk)!).filter(Boolean)

    return { chartData, dataKeys }
  }, [clientData])

  if (clientData.length === 0) return null

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
  }) => {
    if (!active || !payload?.length) return null
    const row = payload[0]?.payload as Record<string, string | number>
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
        <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {row?.dateLabel as string}
        </p>
        <div className="space-y-1">
          {dataKeys.map((key, i) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="text-sm" style={{ color: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}>
                {key}:
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {row?.[key] != null ? formatCurrency(Number(row[key])) : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 70, bottom: 0 }}>
          <defs>
            {dataKeys.map((_, i) => (
              <linearGradient
                key={i}
                id={`comparison-gradient-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={COMPARISON_COLORS[i]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COMPARISON_COLORS[i]} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            width={65}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v, 'BRL', { notation: 'compact' })}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {dataKeys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COMPARISON_COLORS[i]}
              fill={`url(#comparison-gradient-${i})`}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
