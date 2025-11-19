import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { PerformanceData } from "@/types/financial"
import { useTranslation } from "react-i18next"
import { useMemo, useCallback } from "react"
import { 
  groupStrategyName, 
  getStrategyColor,
  getStrategyOrder,
  STRATEGY_ORDER,
  type GroupedStrategyKey 
} from "@/utils/benchmark-calculator"
import { useCurrency } from "@/contexts/CurrencyContext"

interface StrategyBreakdownProps {
  performanceData: PerformanceData[];
}

/**
 * Converts a period string (MM/YYYY) to a Date object
 */
function periodToDate(period?: string | null): Date {
  if (!period) return new Date(0)
  const [month, year] = period.split('/')
  return new Date(parseInt(year), parseInt(month) - 1)
}

export function StrategyBreakdown({ performanceData }: StrategyBreakdownProps) {
  const { t } = useTranslation()
  const { convertValue, formatCurrency, currency } = useCurrency()

  /**
   * Traduz uma chave de estratégia agrupada usando i18n
   */
  const translateGroupedStrategy = useCallback((key: GroupedStrategyKey): string => {
    const strategiesOrder = 'portfolioPerformance.kpi.diversificationDialog.strategiesOrder'
    return t(`${strategiesOrder}.${key}`)
  }, [t])

  /**
   * Agrupa e traduz o nome de uma estratégia
   */
  const groupStrategy = useCallback((strategy: string | null): string => {
    const groupedKey = groupStrategyName(strategy)
    return translateGroupedStrategy(groupedKey)
  }, [translateGroupedStrategy])

  /**
   * Obtém a ordem de uma estratégia traduzida
   */
  const getStrategyOrderForName = useCallback((strategyName: string): number => {
    const strategiesOrder = 'portfolioPerformance.kpi.diversificationDialog.strategiesOrder'
    for (const key of STRATEGY_ORDER) {
      if (t(`${strategiesOrder}.${key}`) === strategyName) {
        return getStrategyOrder(key)
      }
    }
    return STRATEGY_ORDER.length // Put unknown strategies at the end
  }, [t])

  /**
   * Obtém a cor de uma estratégia traduzida
   */
  const getStrategyColorForName = useCallback((strategyName: string): string => {
    const strategiesOrder = 'portfolioPerformance.kpi.diversificationDialog.strategiesOrder'
    for (const key of STRATEGY_ORDER) {
      if (t(`${strategiesOrder}.${key}`) === strategyName) {
        return getStrategyColor(key, true) // Use soft colors for this component
      }
    }
    return getStrategyColor('others', true)
  }, [t])

  // Find the most recent period from performance data
  const mostRecentPeriod = useMemo(() => {
    const uniquePeriods = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])]
    const sortedPeriods = uniquePeriods.sort((a, b) => periodToDate(a).getTime() - periodToDate(b).getTime())
    return [...sortedPeriods].sort((a, b) => periodToDate(b).getTime() - periodToDate(a).getTime())[0]
  }, [performanceData])

  // Filter to get only the most recent period data with valid positions
  const filteredData = useMemo(() => {
    return performanceData.filter(
      item => item.period === mostRecentPeriod && item.position && item.position > 0
    )
  }, [performanceData, mostRecentPeriod])

  // Group investments by asset class and calculate totals
  const strategyData = useMemo(() => {
    return filteredData.reduce((acc, investment) => {
      const originalStrategy = investment.asset_class || null
      const groupedStrategy = groupStrategy(originalStrategy)
      
      if (!acc[groupedStrategy]) {
        acc[groupedStrategy] = { 
          name: groupedStrategy, 
          value: 0, 
          count: 0,
          totalReturn: 0
        }
      }
      // Convert position to display currency
      const originalCurrency = (investment.currency === 'USD' || investment.currency === 'Dolar') ? 'USD' : 'BRL'
      const position = Number(investment.position || 0)
      const positionConverted = convertValue(position, investment.period || '', originalCurrency)
      const yieldValue = Number(investment.yield || 0)
      acc[groupedStrategy].value += positionConverted
      acc[groupedStrategy].totalReturn += yieldValue * positionConverted
      acc[groupedStrategy].count += 1
      return acc
    }, {} as Record<string, { name: string; value: number; count: number; totalReturn: number }>)
  }, [filteredData, groupStrategy, convertValue])

  // Calculate total patrimony for percentage calculations
  const totalPatrimonio = useMemo(() => {
    return Object.values(strategyData).reduce((sum, item) => sum + item.value, 0)
  }, [strategyData])

  // Prepare chart data with percentages and colors
  const chartData = useMemo(() => {
    return Object.values(strategyData)
      .map((item) => ({
        ...item,
        percentage: totalPatrimonio > 0 ? (item.value / totalPatrimonio) * 100 : 0,
        avgReturn: item.value > 0 ? (item.totalReturn / item.value) * 100 : 0,
        color: getStrategyColorForName(item.name)
      }))
      .sort((a, b) => {
        const orderA = getStrategyOrderForName(a.name)
        const orderB = getStrategyOrderForName(b.name)
        if (orderA !== orderB) {
          return orderA - orderB
        }
        return b.percentage - a.percentage
      })
  }, [strategyData, totalPatrimonio, getStrategyColorForName, getStrategyOrderForName])

  if (filteredData.length === 0) {
    return null
  }

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        value: number;
        percentage: number;
        color: string;
      };
      fill?: string;
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const fillColor = payload[0].fill || data.color;
      
      return (
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg p-4 min-w-[180px]">
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: fillColor }}
            />
            <p className="text-foreground font-semibold text-sm">{data.name}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-foreground font-bold text-base">
                {formatCurrency(data.value)}
              </span>
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              {data.percentage.toFixed(2)}% {t('portfolioPerformance.kpi.strategyBreakdown.ofPatrimony')}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
      <CardHeader>
        <CardTitle className="text-foreground text-lg">{t('portfolioPerformance.kpi.strategyBreakdown.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Table */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground border-b border-border/30 pb-2">
              <div>{t('portfolioPerformance.kpi.strategyBreakdown.name')}</div>
              <div className="text-center">{t('portfolioPerformance.kpi.strategyBreakdown.allocation')}</div>
              <div className="text-right">{t('portfolioPerformance.kpi.strategyBreakdown.grossBalance')}</div>
            </div>
            
            {chartData.map((item) => (
              <div key={item.name} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-border/10 hover:bg-muted/30 transition-colors rounded-sm px-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-1 h-4 rounded-sm shadow-sm" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
                <div className="text-center text-foreground font-medium">
                  {item.percentage.toFixed(2)}%
                </div>
                <div className="text-right text-foreground">
                  {formatCurrency(item.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Donut Chart */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width="100%" height={400} minWidth={350}>
                <PieChart width={400} height={400}>
                  <defs>
                    {chartData.map((item, index) => (
                      <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={item.color} stopOpacity={1}/>
                        <stop offset="100%" stopColor={item.color} stopOpacity={0.8}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={120}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Content with backdrop */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-card/80 backdrop-blur-sm rounded-full px-4 py-3 border border-border/30 shadow-elegant-sm">
                  <div className="text-xs text-muted-foreground mb-1 text-center font-medium">
                    {t('portfolioPerformance.kpi.strategyBreakdown.grossPatrimony')}
                  </div>
                  <div className="text-lg font-bold text-foreground text-center">
                    {formatCurrency(totalPatrimonio)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

