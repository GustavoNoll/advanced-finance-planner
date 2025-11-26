import { useState, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTranslation } from "react-i18next"
import { 
  groupStrategyName, 
  getStrategyColor,
  STRATEGY_ORDER,
  type GroupedStrategyKey 
} from "@/utils/benchmark-calculator"
import { translateGroupedStrategy, groupAndTranslateStrategy } from "@/utils/i18n-helpers"
import type { PerformanceData } from "@/types/financial"

interface DiversificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  performanceData: PerformanceData[]
}

interface StrategyDataPoint extends Record<string, string | number> {
  competencia: string
}

interface AssetsDataPoint {
  competencia: string
  ativos: number
}

interface TooltipPayload {
  value: number
  name: string
  color: string
  payload?: StrategyDataPoint
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
}

interface StrategyInfo {
  duration: number
  isActive: boolean
  isSelected: boolean
  isShown: boolean
}

interface CurrentMetrics {
  competencia: string
  assets: number
  strategiesCount: number
}

const TRANSLATION_BASE = 'portfolioPerformance.kpi.diversificationDialog'

/**
 * Sorts periods in "MM/YYYY" format chronologically
 */
function sortPeriods(periods: string[]): string[] {
  return [...periods].sort((a, b) => {
    const [monthA, yearA] = a.split('/').map(Number)
    const [monthB, yearB] = b.split('/').map(Number)
    if (yearA !== yearB) return yearA - yearB
    return monthA - monthB
  })
}

/**
 * Calculates information about a strategy (duration, status, etc.)
 */
function calculateStrategyInfo(
  strategy: string,
  strategiesData: StrategyDataPoint[],
  selectedStrategies: Set<string>
): StrategyInfo {
  const firstAppearance = strategiesData.findIndex(d => d[strategy] === 1)
  const lastAppearance = strategiesData
    .map((d, i) => d[strategy] === 1 ? i : -1)
    .filter(i => i !== -1)
    .pop()
  
  const duration = lastAppearance !== undefined && firstAppearance !== -1 
    ? lastAppearance - firstAppearance + 1 
    : 0
  
  const isActive = strategiesData[strategiesData.length - 1]?.[strategy] === 1
  const isSelected = selectedStrategies.has(strategy)
  const isShown = selectedStrategies.size === 0 || isSelected

  return {
    duration,
    isActive,
    isSelected,
    isShown
  }
}

export function DiversificationDialog({ open, onOpenChange, performanceData }: DiversificationDialogProps) {
  const { t } = useTranslation()
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set())
  
  const toggleStrategy = useCallback((strategy: string) => {
    setSelectedStrategies(prev => {
      const newSet = new Set(prev)
      if (newSet.has(strategy)) {
        newSet.delete(strategy)
      } else {
        newSet.add(strategy)
      }
      return newSet
    })
  }, [])

  // Get all unique competencias and sort them chronologically
  const allCompetencias = useMemo(() => {
    const competencias = [...new Set(
      performanceData
        .map(item => item.period)
        .filter((period): period is string => Boolean(period))
    )]
    return sortPeriods(competencias)
  }, [performanceData])

  // Get all unique strategies across all time (using grouped strategies)
  const allStrategies = useMemo(() => {
    const strategies = [...new Set(
      performanceData
        .map(item => groupAndTranslateStrategy(item.asset_class, t))
        .filter(Boolean)
    )]
    return strategies
  }, [performanceData, t])

  // Define the order for strategies based on translations
  const strategyOrder = useMemo(() => {
    return STRATEGY_ORDER.map(key => translateGroupedStrategy(key, t))
  }, [t])

  // Sort strategies by the defined order
  const sortedStrategies = useMemo(() => {
    return allStrategies.sort((a, b) => {
      const indexA = strategyOrder.indexOf(a)
      const indexB = strategyOrder.indexOf(b)
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      return a.localeCompare(b)
    })
  }, [allStrategies, strategyOrder])

  // Calculate number of assets per competencia
  const assetsData = useMemo((): AssetsDataPoint[] => {
    return allCompetencias.map(competencia => {
      const competenciaData = performanceData.filter(item => item.period === competencia)
      // Count unique assets (not just records)
      const uniqueAssets = new Set(
        competenciaData
          .map(item => item.asset)
          .filter((asset): asset is string => Boolean(asset))
      ).size
      
      return {
        competencia,
        ativos: uniqueAssets,
      }
    })
  }, [allCompetencias, performanceData])

  // Calculate presence of each strategy per competencia for stacked area chart
  const strategiesData = useMemo((): StrategyDataPoint[] => {
    return allCompetencias.map(competencia => {
      const competenciaData = performanceData.filter(item => item.period === competencia)
      const strategiesInMonth = new Set(
        competenciaData
          .map(item => groupAndTranslateStrategy(item.asset_class, t))
          .filter(Boolean)
      )

      const dataPoint: StrategyDataPoint = { competencia }
      
      // For each strategy, add 1 if present, 0 if absent (for stacked area)
      sortedStrategies.forEach(strategy => {
        dataPoint[strategy] = strategiesInMonth.has(strategy) ? 1 : 0
      })

      return dataPoint
    })
  }, [allCompetencias, performanceData, sortedStrategies, t])

  // Get current period metrics
  const currentMetrics = useMemo((): CurrentMetrics => {
    const currentCompetencia = allCompetencias[allCompetencias.length - 1] || ''
    const currentAssets = assetsData[assetsData.length - 1]?.ativos || 0
    
    // Count current active strategies
    const currentStrategiesData = strategiesData[strategiesData.length - 1]
    const currentStrategiesCount = currentStrategiesData 
      ? Object.keys(currentStrategiesData)
          .filter(key => key !== 'competencia' && currentStrategiesData[key] === 1)
          .length 
      : 0

    return {
      competencia: currentCompetencia,
      assets: currentAssets,
      strategiesCount: currentStrategiesCount
    }
  }, [allCompetencias, assetsData, strategiesData])

  // Get color for a translated strategy name
  const getStrategyColorForName = useCallback((strategyName: string) => {
    // Find the key by matching the translated name
    for (const key of STRATEGY_ORDER) {
      if (translateGroupedStrategy(key, t) === strategyName) {
        return getStrategyColor(key)
      }
    }
    return getStrategyColor('others')
  }, [t])

  // Filter strategies for display
  const displayedStrategies = useMemo(() => {
    return selectedStrategies.size === 0 
      ? sortedStrategies 
      : sortedStrategies.filter(s => selectedStrategies.has(s))
  }, [selectedStrategies, sortedStrategies])

  // Custom tooltip for strategies chart
  const CustomTooltip = useCallback(({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null
    
    const activeStrategies = payload.filter(p => p.value === 1)
    const totalStrategies = activeStrategies.length
    
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg max-w-xs">
        <div className="font-semibold text-sm mb-2 pb-2 border-b">
          {payload[0]?.payload?.competencia}
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          {totalStrategies} {t(`${TRANSLATION_BASE}.activeStrategies`)}
        </div>
        <div className="space-y-1.5">
          {activeStrategies.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }, [t])

  // Memoized strategy info calculator
  const getStrategyInfo = useCallback((strategy: string): StrategyInfo => {
    return calculateStrategyInfo(strategy, strategiesData, selectedStrategies)
  }, [strategiesData, selectedStrategies])

  // Chart configuration for assets
  const assetsChartConfig = useMemo(() => ({
    ativos: {
      label: t(`${TRANSLATION_BASE}.currentAssets`),
      color: "#3b82f6",
    },
  }), [t])

  // Chart configuration for strategies
  const strategiesChartConfig = useMemo(() => {
    return Object.fromEntries(
      sortedStrategies.map((strategy) => [
        strategy,
        {
          label: strategy,
          color: getStrategyColorForName(strategy),
        },
      ])
    )
  }, [sortedStrategies, getStrategyColorForName])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[90vh] overflow-y-auto">
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
                  {t(`${TRANSLATION_BASE}.currentAssets`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {currentMetrics.assets}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(`${TRANSLATION_BASE}.inPeriod`, { period: currentMetrics.competencia })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {t(`${TRANSLATION_BASE}.currentStrategies`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {currentMetrics.strategiesCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(`${TRANSLATION_BASE}.assetClasses`)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          {assetsData.length > 0 && (
            <div className="space-y-4 md:space-y-6">
              {/* Assets Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {t(`${TRANSLATION_BASE}.assetsEvolution`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                  <ChartContainer
                    config={assetsChartConfig}
                    className="h-[250px] md:h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assetsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                        <XAxis 
                          dataKey="competencia" 
                          tick={{ fontSize: 10, fill: '#6b7280' }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          tick={{ fontSize: 10, fill: '#6b7280' }}
                          width={35}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="ativos" 
                          name={t(`${TRANSLATION_BASE}.currentAssets`)}
                          radius={[4, 4, 0, 0]}
                        >
                          {assetsData.map((entry, index) => {
                            const colorKey = STRATEGY_ORDER[index % STRATEGY_ORDER.length]
                            return (
                              <Cell key={`cell-${index}`} fill={getStrategyColor(colorKey)} />
                            )
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Strategies Stacked Area Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {t(`${TRANSLATION_BASE}.strategiesTimeline`)}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(`${TRANSLATION_BASE}.strategiesTimelineDescription`)}
                  </p>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                  <ChartContainer
                    config={strategiesChartConfig}
                    className="h-[300px] md:h-[400px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={strategiesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                        <XAxis 
                          dataKey="competencia" 
                          tick={{ fontSize: 10, fill: '#6b7280' }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          tick={{ fontSize: 10, fill: '#6b7280' }}
                          width={35}
                          label={{ 
                            value: t(`${TRANSLATION_BASE}.strategies`), 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { fontSize: '10px', fill: '#6b7280' }
                          }}
                        />
                        <ChartTooltip content={CustomTooltip} />
                        {displayedStrategies.map((strategy) => {
                          const color = getStrategyColorForName(strategy)
                          return (
                            <Area
                              key={strategy}
                              type="monotone"
                              dataKey={strategy}
                              stackId="1"
                              stroke={color}
                              fill={color}
                              fillOpacity={0.6}
                              name={strategy}
                            />
                          )
                        })}
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  
                  {/* Interactive Legend with selection */}
                  <div className="mt-6 space-y-4">
                    <p className="text-xs text-center text-muted-foreground">
                      {t(`${TRANSLATION_BASE}.clickToFilter`)}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {sortedStrategies.map((strategy) => {
                        const { duration, isActive, isShown } = getStrategyInfo(strategy)
                        const durationText = duration === 1 
                          ? t(`${TRANSLATION_BASE}.month`)
                          : t(`${TRANSLATION_BASE}.months`)
                        
                        return (
                          <button
                            key={strategy}
                            onClick={() => toggleStrategy(strategy)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer hover:scale-105 ${
                              isShown
                                ? isActive 
                                  ? 'bg-primary/10 border-primary/30' 
                                  : 'bg-muted/50 border-muted'
                                : 'opacity-30 bg-muted/20 border-muted/20'
                            }`}
                          >
                            <div 
                              className="w-3 h-3 rounded-sm flex-shrink-0" 
                              style={{ backgroundColor: getStrategyColorForName(strategy) }}
                            />
                            <span className="text-xs font-medium">{strategy}</span>
                            <span className="text-[10px] text-muted-foreground">
                              ({duration} {durationText})
                            </span>
                            {isActive && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                                {t(`${TRANSLATION_BASE}.active`)}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}