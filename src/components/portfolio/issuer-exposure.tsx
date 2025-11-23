import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import type { PerformanceData } from "@/types/financial"
import { formatMaturityDate } from "@/utils/dateUtils"
import { useCurrency } from "@/contexts/CurrencyContext"
import { useTranslation } from "react-i18next"

interface IssuerExposureProps {
  performanceData: PerformanceData[]
}

interface IssuerChartItem {
  name: string
  exposure: number
  count: number
  maturityDates: string[]
}

const LIMIT = 250000
const TRANSLATION_BASE = 'portfolioPerformance.issuerExposure'

export function IssuerExposure({ performanceData }: IssuerExposureProps) {
  const { t } = useTranslation()
  const { formatCurrency, getCurrencySymbol } = useCurrency()

  const issuerMap = performanceData
    .filter(item => (item.issuer || '').trim().length > 0)
    .reduce((acc, item) => {
      const issuer = item.issuer as string
      if (!acc.has(issuer)) acc.set(issuer, { name: issuer, exposure: 0, count: 0, maturityDates: [] as string[] })
      const entry = acc.get(issuer)!
      const position = Number(item.position || 0)
      entry.exposure += position
      entry.count += 1
      if (item.maturity_date) {
        const maturityDate = item.maturity_date
        if (!entry.maturityDates.includes(maturityDate)) entry.maturityDates.push(maturityDate)
      }
      return acc
    }, new Map<string, IssuerChartItem>())

  const chartData = Array.from(issuerMap.values())
    .sort((a, b) => b.exposure - a.exposure)
    .slice(0, 15)

  const getBarColor = (value: number) => value > LIMIT ? 'hsl(var(--destructive))' : '#22c55e'

  const formatMaturityDates = (dates: string[]) => {
    if (!dates || dates.length === 0) return t(`${TRANSLATION_BASE}.noMaturities`)
    const sorted = dates.filter(Boolean).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    if (sorted.length <= 3) return sorted.map(v => formatMaturityDate(v)).join(', ')
    const first = formatMaturityDate(sorted[0])
    const last = formatMaturityDate(sorted[sorted.length - 1])
    return t(`${TRANSLATION_BASE}.maturityRange`, { start: first, end: last, additional: sorted.length - 2 })
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: IssuerChartItem }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const exceedsLimit = data.exposure > LIMIT
      const excess = data.exposure - LIMIT
      return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-lg max-w-xs">
          <p className="text-foreground font-medium">{data.name}</p>
          <p className="text-primary">{t(`${TRANSLATION_BASE}.tooltip.exposure`, { value: formatCurrency(data.exposure) })}</p>
          <p className="text-muted-foreground">{t(`${TRANSLATION_BASE}.tooltip.assets`, { count: data.count })}</p>
          <p className="text-muted-foreground text-sm mt-1">
            <span className="font-medium">{t(`${TRANSLATION_BASE}.tooltip.maturitiesTitle`)}:</span><br />
            {formatMaturityDates(data.maturityDates)}
          </p>
          {exceedsLimit && (
            <p className="text-destructive font-medium mt-1">
              {t(`${TRANSLATION_BASE}.tooltip.limitExceeded`, { value: formatCurrency(excess) })}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const limitDescription = t(`${TRANSLATION_BASE}.limitDescription`, { amount: formatCurrency(LIMIT) })
  const legendInside = t(`${TRANSLATION_BASE}.legend.insideLimit`)
  const legendAbove = t(`${TRANSLATION_BASE}.legend.aboveLimit`)
  const limitReferenceLabel = t(`${TRANSLATION_BASE}.limitReferenceLabel`, {
    symbol: getCurrencySymbol(),
    shortAmount: `${Math.round(LIMIT / 1000)}k`
  })

  return (
    <Card className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
      <CardHeader>
        <CardTitle className="text-foreground">{t(`${TRANSLATION_BASE}.title`)}</CardTitle>
        <p className="text-sm text-muted-foreground">{limitDescription}</p>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }}></div>
            <span>{legendInside}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--destructive))' }}></div>
            <span>{legendAbove}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">{t(`${TRANSLATION_BASE}.noData`)}</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={value => `${getCurrencySymbol()} ${Number(value) / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={LIMIT} stroke="hsl(var(--destructive))" strokeDasharray="5 5" strokeWidth={2} label={{ value: limitReferenceLabel, position: 'right' }} />
              <Bar dataKey="exposure" radius={[4, 4, 0, 0]} opacity={0.85}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.exposure)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
