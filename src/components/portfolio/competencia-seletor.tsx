import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Filter } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"

interface CompetenciaSeletorProps {
  consolidatedData: ConsolidatedPerformance[]
  performanceData: PerformanceData[]
  onFilterChange: (inicioCompetencia: string, fimCompetencia: string) => void
}

export function CompetenciaSeletor({ consolidatedData, performanceData, onFilterChange }: CompetenciaSeletorProps) {
  const { t } = useTranslation()
  const [inicioCompetencia, setInicioCompetencia] = useState<string>("")
  const [fimCompetencia, setFimCompetencia] = useState<string>("")

  const competencias = useMemo(() => {
    const set = new Set<string>()
    consolidatedData.forEach(r => r.period && set.add(r.period))
    performanceData.forEach(r => r.period && set.add(r.period))
    return Array.from(set).sort((a, b) => {
      const [mA, yA] = a.split('/')
      const [mB, yB] = b.split('/')
      const dA = new Date(parseInt(yA), parseInt(mA) - 1).getTime()
      const dB = new Date(parseInt(yB), parseInt(mB) - 1).getTime()
      return dA - dB
    })
  }, [consolidatedData, performanceData])

  useEffect(() => {
    if (competencias.length > 0) {
      setInicioCompetencia(competencias[0])
      setFimCompetencia(competencias[competencias.length - 1])
      onFilterChange(competencias[0], competencias[competencias.length - 1])
    }
  }, [competencias, onFilterChange])

  const handleInicioChange = (value: string) => {
    setInicioCompetencia(value)
    onFilterChange(value, fimCompetencia)
  }

  const handleFimChange = (value: string) => {
    setFimCompetencia(value)
    onFilterChange(inicioCompetencia, value)
  }

  const formatCompetenciaDisplay = (competencia: string) => {
    const [month, year] = competencia.split('/')
    const monthNames = t('portfolioPerformance.months.short', { returnObjects: true }) as string[]
    return `${monthNames[parseInt(month) - 1]}/${year}`
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-elegant-md mb-6">
      <CardContent className="p-4">
        {competencias.length === 0 ? (
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
              <Select value={inicioCompetencia} onValueChange={handleInicioChange}>
                <SelectTrigger className="w-32 bg-background/50">
                  <SelectValue placeholder={t('portfolioPerformance.competenceSelector.start')} />
                </SelectTrigger>
                <SelectContent>
                  {competencias.map(c => (
                    <SelectItem key={c} value={c}>{formatCompetenciaDisplay(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{t('portfolioPerformance.competenceSelector.to')}</span>
              <Select value={fimCompetencia} onValueChange={handleFimChange}>
                <SelectTrigger className="w-32 bg-background/50">
                  <SelectValue placeholder={t('portfolioPerformance.competenceSelector.end')} />
                </SelectTrigger>
                <SelectContent>
                  {competencias.map(c => (
                    <SelectItem key={c} value={c}>{formatCompetenciaDisplay(c)}</SelectItem>
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


