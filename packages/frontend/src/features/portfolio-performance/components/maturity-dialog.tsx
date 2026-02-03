import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart"
import { format } from "date-fns"
import { ptBR, enUS } from "date-fns/locale"
import type { PerformanceData } from "@/types/financial"
import { useCurrency } from "@/contexts/CurrencyContext"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"

interface MaturityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  performanceData: PerformanceData[]
}

const TRANSLATION_BASE = 'portfolioPerformance.kpi.maturityDialog'
const MAX_UPCOMING_MATURITIES = 10
const MONTHS_AHEAD = 12

/**
 * Converts a period string (MM/YYYY) to a timestamp for sorting
 */
function periodToTimestamp(period?: string | null): number {
  if (!period) return 0
  const [month, year] = period.split('/')
  return new Date(parseInt(year), parseInt(month) - 1).getTime()
}

/**
 * Determines the original currency from a currency string
 */
function getOriginalCurrency(currency?: string | null): 'USD' | 'BRL' {
  return currency === 'USD' || currency === 'Dolar' ? 'USD' : 'BRL'
}

export function MaturityDialog({ open, onOpenChange, performanceData }: MaturityDialogProps) {
  const { t, i18n } = useTranslation()
  const { convertValue, formatCurrency } = useCurrency()
  const currentLocale = i18n.language === 'pt-BR' ? ptBR : enUS
  
  // Find the most recent period from performance data
  const mostRecentPeriod = useMemo(() => {
    const uniquePeriods = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])]
    return uniquePeriods.sort((a, b) => periodToTimestamp(b) - periodToTimestamp(a))[0]
  }, [performanceData])

  // Filter to most recent period and extract future maturities
  const upcomingMaturities = useMemo(() => {
    const filtered = performanceData.filter(d => d.period === mostRecentPeriod)
    const now = new Date()
    
    return filtered
      .filter(item => item.maturity_date)
      .map(item => ({ 
        ...item, 
        maturityDate: new Date(item.maturity_date as string) 
      }))
      .filter(item => item.maturityDate >= now)
      .sort((a, b) => a.maturityDate.getTime() - b.maturityDate.getTime())
  }, [performanceData, mostRecentPeriod])

  // Group maturities by year for chart visualization
  const yearlyMaturityGroups = useMemo(() => {
    return upcomingMaturities.reduce((acc, item) => {
      const year = format(item.maturityDate, 'yyyy')
      if (!acc[year]) {
        acc[year] = {
          year,
          total: 0,
          count: 0
        }
      }
      const originalCurrency = getOriginalCurrency(item.currency)
      const positionConverted = convertValue(
        item.position || 0, 
        item.period || mostRecentPeriod, 
        originalCurrency
      )
      acc[year].total += positionConverted
      acc[year].count += 1
      return acc
    }, {} as Record<string, { year: string; total: number; count: number }>)
  }, [upcomingMaturities, mostRecentPeriod, convertValue])

  // Sort chart data chronologically
  const chartData = useMemo(() => {
    return Object.values(yearlyMaturityGroups)
      .sort((a, b) => parseInt(a.year) - parseInt(b.year))
  }, [yearlyMaturityGroups])

  // Calculate total for next 12 months
  const totalNext12Months = useMemo(() => {
    const twelveMonthsFromNow = new Date()
    twelveMonthsFromNow.setMonth(twelveMonthsFromNow.getMonth() + MONTHS_AHEAD)
    
    return upcomingMaturities
      .filter(item => item.maturityDate <= twelveMonthsFromNow)
      .reduce((sum, item) => {
        const originalCurrency = getOriginalCurrency(item.currency)
        const positionConverted = convertValue(
          item.position || 0, 
          item.period || mostRecentPeriod, 
          originalCurrency
        )
        return sum + positionConverted
      }, 0)
  }, [upcomingMaturities, mostRecentPeriod, convertValue])

  // Chart color palette
  const chartColors = useMemo(() => [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'
  ], [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold">
            {t(`${TRANSLATION_BASE}.title`)}
          </DialogTitle>
          <DialogDescription>
            {t(`${TRANSLATION_BASE}.description`)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {t(`${TRANSLATION_BASE}.totalNext12Months`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {formatCurrency(totalNext12Months)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {t(`${TRANSLATION_BASE}.titlesWithMaturity`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {upcomingMaturities.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          {chartData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">
                  {t(`${TRANSLATION_BASE}.maturitiesByYear`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 md:px-6">
                <ChartContainer
                  config={{
                    total: {
                      label: t(`${TRANSLATION_BASE}.chartValueLabel`),
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
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={chartColors[index % chartColors.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm md:text-base">
                {t(`${TRANSLATION_BASE}.noFutureMaturities`)}
              </CardContent>
            </Card>
          )}

          {/* List of upcoming maturities */}
          {upcomingMaturities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">
                  {t(`${TRANSLATION_BASE}.upcomingMaturities`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 md:px-6">
                <div className="space-y-2 max-h-[250px] md:max-h-[300px] overflow-y-auto">
                  {upcomingMaturities.slice(0, MAX_UPCOMING_MATURITIES).map((item, index) => {
                    const originalCurrency = getOriginalCurrency(item.currency)
                    const positionConverted = convertValue(
                      item.position || 0, 
                      item.period || mostRecentPeriod, 
                      originalCurrency
                    )
                    return (
                      <div 
                        key={`${item.asset}-${item.maturity_date}-${index}`}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 md:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs md:text-sm truncate">
                            {item.asset || '-'}
                          </div>
                          <div className="text-[10px] md:text-xs text-muted-foreground truncate">
                            {item.issuer || '-'}
                          </div>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <div className="font-semibold text-xs md:text-sm">
                            {formatCurrency(positionConverted)}
                          </div>
                          <div className="text-[10px] md:text-xs text-muted-foreground">
                            {format(item.maturityDate, 'dd/MM/yyyy', { locale: currentLocale })}
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


