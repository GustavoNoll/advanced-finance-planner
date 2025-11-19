import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { PerformanceData } from "@/types/financial"
import { useCurrency } from "@/contexts/CurrencyContext"

interface MaturityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  performanceData: PerformanceData[]
}

export function MaturityDialog({ open, onOpenChange, performanceData }: MaturityDialogProps) {
  const { convertValue, formatCurrency } = useCurrency()
  
  const toDate = (competencia?: string | null) => {
    if (!competencia) return 0
    const [m, y] = competencia.split('/')
    return new Date(parseInt(y), parseInt(m) - 1).getTime()
  }

  const mostRecent = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])]
    .sort((a, b) => toDate(b) - toDate(a))[0]

  const filtered = performanceData.filter(d => d.period === mostRecent)
  const now = new Date()
  const maturity = filtered
    .filter(i => i.maturity_date)
    .map(i => ({ ...i, mat: new Date(i.maturity_date as string) }))
    .filter(i => i.mat >= now)
    .sort((a, b) => a.mat.getTime() - b.mat.getTime())

  // Group by year for chart
  const yearlyGroups = maturity.reduce((acc, item) => {
    const year = format(item.mat, 'yyyy')
    if (!acc[year]) {
      acc[year] = {
        year: year,
        total: 0,
        count: 0
      }
    }
    const originalCurrency = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
    const positionConverted = convertValue(item.position || 0, item.period || mostRecent, originalCurrency)
    acc[year].total += positionConverted
    acc[year].count += 1
    return acc
  }, {} as Record<string, { year: string; total: number; count: number }>)

  const chartData = (Object.values(yearlyGroups) as Array<{ year: string; total: number; count: number }>)
    .sort((a, b) => parseInt(a.year) - parseInt(b.year))

  // Calculate total for next 12 months only
  const twelveMonthsFromNow = new Date()
  twelveMonthsFromNow.setMonth(twelveMonthsFromNow.getMonth() + 12)
  
  const next12MonthsData = maturity.filter(item => 
    item.mat <= twelveMonthsFromNow
  )
  
  const totalNext12 = next12MonthsData.reduce((s, i) => {
    const originalCurrency = (i.currency === 'USD' || i.currency === 'Dolar') ? 'USD' : 'BRL'
    const positionConverted = convertValue(i.position || 0, i.period || mostRecent, originalCurrency)
    return s + positionConverted
  }, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold">Cronograma de Vencimentos</DialogTitle>
          <DialogDescription>
            Próximos vencimentos de títulos da carteira
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Total a Vencer (12 meses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {formatCurrency(totalNext12)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Títulos com Vencimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {maturity.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          {chartData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Vencimentos por Ano</CardTitle>
              </CardHeader>
              <CardContent className="px-2 md:px-6">
                <ChartContainer
                  config={{
                    total: {
                      label: "Valor",
                      color: "#3b82f6",
                    },
                  }}
                  className="h-[250px] md:h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        tickFormatter={(value) => 
                          value >= 1000000 
                            ? `${(value / 1000000).toFixed(1)}M`
                            : `${(value / 1000).toFixed(0)}k`
                        }
                        width={45}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="total" 
                        fill="#3b82f6" 
                        radius={[8, 8, 0, 0]}
                      >
                        {chartData.map((entry, index) => {
                          const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6']
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm md:text-base">
                Nenhum vencimento futuro encontrado
              </CardContent>
            </Card>
          )}

          {/* List of upcoming maturities */}
          {maturity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Próximos Vencimentos</CardTitle>
              </CardHeader>
              <CardContent className="px-2 md:px-6">
                <div className="space-y-2 max-h-[250px] md:max-h-[300px] overflow-y-auto">
                  {maturity.slice(0, 10).map((item, index) => {
                    const originalCurrency = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
                    const positionConverted = convertValue(item.position || 0, item.period || mostRecent, originalCurrency)
                    return (
                      <div 
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 md:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs md:text-sm truncate">{item.asset || '-'}</div>
                          <div className="text-[10px] md:text-xs text-muted-foreground truncate">{item.issuer || '-'}</div>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <div className="font-semibold text-xs md:text-sm">
                            {formatCurrency(positionConverted)}
                          </div>
                          <div className="text-[10px] md:text-xs text-muted-foreground">
                            {format(item.mat, 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


