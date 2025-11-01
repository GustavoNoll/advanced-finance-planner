import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import type { PerformanceData } from "@/types/financial"
import { formatMaturityDate } from "@/utils/dateUtils"
import { formatCurrency, getCurrencySymbol } from "@/utils/currency"
import { CurrencyCode } from "@/utils/currency"

interface IssuerExposureProps {
  performanceData: PerformanceData[]
  currency?: CurrencyCode
}

interface IssuerChartItem {
  name: string
  exposure: number
  count: number
  vencimentos: string[]
}

export function IssuerExposure({ performanceData, currency = 'BRL' }: IssuerExposureProps) {
  // Aggregate by issuer and collect unique maturity dates
  const issuerMap = performanceData
    .filter(item => (item.issuer || '').trim().length > 0)
    .reduce((acc, item) => {
      const issuer = item.issuer as string
      if (!acc.has(issuer)) acc.set(issuer, { name: issuer, exposure: 0, count: 0, vencimentos: [] as string[] })
      const entry = acc.get(issuer)!
      const position = Number(item.position || 0)
      entry.exposure += position
      entry.count += 1
      if (item.maturity_date) {
        const md = item.maturity_date
        if (!entry.vencimentos.includes(md)) entry.vencimentos.push(md)
      }
      return acc
    }, new Map<string, IssuerChartItem>())

  const LIMIT = 250000

  const chartData = Array.from(issuerMap.values())
    .sort((a, b) => b.exposure - a.exposure)
    .slice(0, 15)

  const getBarColor = (value: number) => value > LIMIT ? 'hsl(var(--destructive))' : 'hsl(var(--accent))'

  const formatVencimentos = (vencimentos: string[]) => {
    if (!vencimentos || vencimentos.length === 0) return 'N/A'
    const sorted = vencimentos.filter(Boolean).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    if (sorted.length <= 3) return sorted.map(v => formatMaturityDate(v)).join(', ')
    const first = formatMaturityDate(sorted[0])
    const last = formatMaturityDate(sorted[sorted.length - 1])
    return `${first} ... ${last} (+${sorted.length - 2} outros)`
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: IssuerChartItem }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const exceedsLimit = data.exposure > LIMIT
      const excess = data.exposure - LIMIT
      return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-lg max-w-xs">
          <p className="text-foreground font-medium">{data.name}</p>
          <p className="text-primary">Exposição: {formatCurrency(data.exposure, currency)}</p>
          <p className="text-muted-foreground">Ativos: {data.count}</p>
          <p className="text-muted-foreground text-sm mt-1">
            <span className="font-medium">Vencimentos:</span><br />
            {formatVencimentos(data.vencimentos)}
          </p>
          {exceedsLimit && (
            <p className="text-destructive font-medium mt-1">Acima do limite em: {formatCurrency(excess, currency)}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-foreground">Exposição por Emissor</CardTitle>
        <p className="text-sm text-muted-foreground">Limite de concentração: {formatCurrency(250000, currency)} por emissor</p>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--accent))' }}></div>
            <span>Dentro do limite</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--destructive))' }}></div>
            <span>Acima do limite</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Sem dados</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={value => `${getCurrencySymbol(currency)} ${Number(value) / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={LIMIT} stroke="hsl(var(--destructive))" strokeDasharray="5 5" strokeWidth={2} label={{ value: `Limite ${getCurrencySymbol(currency)} 250k`, position: 'right' }} />
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
