import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Filter } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"

interface CompetenceSelectorProps {
  consolidatedData: ConsolidatedPerformance[]
  performanceData: PerformanceData[]
  onFilterChange: (startPeriod: string, endPeriod: string) => void
}

/**
 * Provides a bilingual competence range selector that keeps the data filter in sync.
 */
export function CompetenceSelector({ consolidatedData, performanceData, onFilterChange }: CompetenceSelectorProps) {
  const { t } = useTranslation()
  const [startPeriod, setStartPeriod] = useState<string>("")
  const [endPeriod, setEndPeriod] = useState<string>("")

  /**
   * Consolidates all unique available periods from both datasets.
   */
  const availablePeriods = useMemo(() => {
    const uniquePeriods = new Set<string>()
    consolidatedData.forEach(record => record.period && uniquePeriods.add(record.period))
    performanceData.forEach(record => record.period && uniquePeriods.add(record.period))

    return Array.from(uniquePeriods).sort((first, second) => {
      const [firstMonth, firstYear] = first.split('/')
      const [secondMonth, secondYear] = second.split('/')
      const firstDate = new Date(parseInt(firstYear), parseInt(firstMonth) - 1).getTime()
      const secondDate = new Date(parseInt(secondYear), parseInt(secondMonth) - 1).getTime()
      return firstDate - secondDate
    })
  }, [consolidatedData, performanceData])

  /**
   * Keeps the range always initialized to the full available data window.
   */
  useEffect(() => {
    if (availablePeriods.length === 0) return

    const initialStart = availablePeriods[0]
    const initialEnd = availablePeriods[availablePeriods.length - 1]
    setStartPeriod(initialStart)
    setEndPeriod(initialEnd)
    onFilterChange(initialStart, initialEnd)
  }, [availablePeriods, onFilterChange])

  const handleStartChange = (value: string) => {
    setStartPeriod(value)
    onFilterChange(value, endPeriod || value)
  }

  const handleEndChange = (value: string) => {
    setEndPeriod(value)
    onFilterChange(startPeriod || value, value)
  }

  const formatPeriodLabel = (period: string) => {
    const [month, year] = period.split('/')
    const monthNames = t('portfolioPerformance.months.short', { returnObjects: true }) as string[]
    const fallbackMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthsDictionary = monthNames?.length === 12 ? monthNames : fallbackMonths
    return `${monthsDictionary[parseInt(month) - 1]}/${year}`
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-elegant-md mb-6">
      <CardContent className="p-4">
        {availablePeriods.length === 0 ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t('portfolioPerformance.competenceSelector.noCompetenceFound')}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{t('portfolioPerformance.competenceSelector.filterByPeriod')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t('portfolioPerformance.competenceSelector.from')}</span>
              <Select value={startPeriod} onValueChange={handleStartChange}>
                <SelectTrigger className="w-32 bg-background/50">
                  <SelectValue placeholder={t('portfolioPerformance.competenceSelector.start')} />
                </SelectTrigger>
                <SelectContent>
                  {availablePeriods.map(period => (
                    <SelectItem key={period} value={period}>{formatPeriodLabel(period)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{t('portfolioPerformance.competenceSelector.to')}</span>
              <Select value={endPeriod} onValueChange={handleEndChange}>
                <SelectTrigger className="w-32 bg-background/50">
                  <SelectValue placeholder={t('portfolioPerformance.competenceSelector.end')} />
                </SelectTrigger>
                <SelectContent>
                  {availablePeriods.map(period => (
                    <SelectItem key={period} value={period}>{formatPeriodLabel(period)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


