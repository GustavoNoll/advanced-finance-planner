import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { PerformanceData } from "@/types/financial"
import { formatCurrency, getCurrencySymbol } from "@/utils/currency"
import { CurrencyCode } from "@/utils/currency"

interface MaturityTimelineProps {
  performanceData: PerformanceData[]
  currency?: CurrencyCode
}

interface MaturityYearDataItem {
  year: string
  strategies: Record<string, { amount: number; count: number; rates: string[] }>
  totalAmount: number
  avgRate: string
  totalInvestments: number
}

interface AssetClassOption {
  key: string
  label: string
}

export function MaturityTimeline({ performanceData, currency = 'BRL' }: MaturityTimelineProps) {
  const { t } = useTranslation()
  
  // Extract unique asset classes with maturity dates from performance data
  const assetClassOptions = useMemo<AssetClassOption[]>(() => {
    const now = new Date()
    
    // Get all unique asset classes that have maturity dates in the future
    const uniqueClasses = Array.from(new Set(
      performanceData
        .filter(item => item.maturity_date)
        .filter(item => new Date(item.maturity_date as string) >= now)
        .map(item => item.asset_class)
        .filter((assetClass): assetClass is string => !!assetClass)
    ))
    
    // Create options using the class name directly
    return uniqueClasses.map((className) => ({
      key: className,
      label: className
    })).sort((a, b) => a.label.localeCompare(b.label))
  }, [performanceData])

  const [selectedAssetClass, setSelectedAssetClass] = useState<string>(() => {
    // Initialize with first option key, or empty string if no options
    return assetClassOptions.length > 0 ? assetClassOptions[0].key : ''
  })

  // Update selected asset class when options change
  useEffect(() => {
    if (assetClassOptions.length > 0 && (!selectedAssetClass || !assetClassOptions.find(opt => opt.key === selectedAssetClass))) {
      setSelectedAssetClass(assetClassOptions[0].key)
    }
  }, [assetClassOptions, selectedAssetClass])

  const filteredData = useMemo(() => {
    if (!selectedAssetClass || assetClassOptions.length === 0) return []
    
    const now = new Date()
    
    // Filter by exact asset_class name
    return performanceData
      .filter(item => item.maturity_date)
      .filter(item => new Date(item.maturity_date as string) >= now)
      .filter(item => item.asset_class === selectedAssetClass)
  }, [performanceData, selectedAssetClass, assetClassOptions])

  const maturityData = useMemo(() => {
    const grouped = filteredData
      .filter(investment => investment.maturity_date)
      .reduce((acc, investment) => {
        const maturityDate = new Date(investment.maturity_date as string)
        const maturityYear = maturityDate.getFullYear().toString()
        const strategy = investment.asset_class || 'N/A'

        if (!acc[maturityYear]) {
          acc[maturityYear] = {
            year: maturityYear,
            strategies: {},
            totalAmount: 0,
            avgRate: "",
            totalInvestments: 0
          }
        }

        if (!acc[maturityYear].strategies[strategy]) {
          acc[maturityYear].strategies[strategy] = {
            amount: 0,
            count: 0,
            rates: [] as string[]
          }
        }

        const position = Number(investment.position || 0)
        acc[maturityYear].strategies[strategy].amount += position
        acc[maturityYear].strategies[strategy].count += 1
        if (investment.rate) acc[maturityYear].strategies[strategy].rates.push(investment.rate)

        acc[maturityYear].totalAmount += position
        acc[maturityYear].totalInvestments += 1
        return acc
      }, {} as Record<string, MaturityYearDataItem>)

    const chartReady = Object.values(grouped)
      .map(item => {
        const allRates = Object.values(item.strategies).flatMap(s => s.rates)
        const rateCount = allRates.reduce((acc, rate) => {
          acc[rate] = (acc[rate] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        const mostCommonRate = Object.entries(rateCount)
          .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || ""
        item.avgRate = mostCommonRate
        return item
      })
      .sort((a, b) => parseInt(a.year) - parseInt(b.year))

    return chartReady
  }, [filteredData])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: MaturityYearDataItem }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as MaturityYearDataItem
      return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{t('portfolioPerformance.kpi.maturityTimeline.year', 'Ano')}: {data.year}</p>
          <p className="text-primary">{t('portfolioPerformance.kpi.maturityTimeline.total', 'Valor Total')}: {formatCurrency(data.totalAmount, currency)}</p>
          <p className="text-muted-foreground">{t('portfolioPerformance.kpi.maturityTimeline.avgRate', 'Taxa Média')}: {data.avgRate}</p>
          <div className="mt-2">
            <p className="text-sm font-medium text-foreground">{t('portfolioPerformance.kpi.maturityTimeline.byStrategy', 'Por Estratégia')}:</p>
            {Object.entries(data.strategies).map(([strategy, s]) => (
              <div key={strategy} className="text-xs text-muted-foreground ml-2">
                {strategy}: {formatCurrency(s.amount, currency)}
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">{t('portfolioPerformance.kpi.maturityTimeline.title', 'Vencimentos por Estratégia')}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('portfolioPerformance.kpi.maturityTimeline.subtitle', 'Distribuição por data de vencimento')}</p>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {assetClassOptions.length > 0 ? (
              assetClassOptions.map(option => (
                <Button
                  key={option.key}
                  variant={selectedAssetClass === option.key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedAssetClass(option.key)}
                  className="text-xs px-3 py-1 h-8"
                >
                  {option.label}
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('portfolioPerformance.kpi.maturityTimeline.emptyFor', 'Nenhum dado de vencimento disponível')}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {maturityData.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <p>
              {t('portfolioPerformance.kpi.maturityTimeline.emptyFor', 'Nenhum dado de vencimento disponível para')}{' '}
              {assetClassOptions.find(opt => opt.key === selectedAssetClass)?.label || selectedAssetClass}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={maturityData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
              <XAxis 
                dataKey="year"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={{ stroke: '#E5E7EB' }}
                height={40}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={{ stroke: '#E5E7EB' }}
                tickFormatter={value => `${getCurrencySymbol(currency)} ${Number(value) / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="totalAmount" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                opacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

