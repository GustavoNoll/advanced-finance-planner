import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InstitutionAllocationCard } from "@/components/portfolio/institution-allocation-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/CurrencyContext"

interface ClientDataDisplayProps {
  consolidatedData: ConsolidatedPerformance[]
  performanceData: PerformanceData[]
  loading: boolean
  clientName: string
  portfolioTableComponent?: React.ReactNode
  institutionCardData?: {
    institutionData: Array<{
      institution: string
      patrimonio: number
      rendimento: number
      percentage: number
      color: string
    }>
    totalPatrimonio: number
  }
  selectedInstitution?: string | null
  onInstitutionClick?: (institution: string) => void
}

export function ClientDataDisplay({ consolidatedData, performanceData, loading, clientName, portfolioTableComponent, institutionCardData, selectedInstitution, onInstitutionClick }: ClientDataDisplayProps) {
  const { t } = useTranslation()
  const { convertValue, adjustReturnWithFX, formatCurrency: formatCurrencyContext } = useCurrency()
  
  if (!clientName) return null

  const toDate = (competencia?: string | null) => {
    if (!competencia) return 0
    const [m, y] = competencia.split('/')
    return new Date(parseInt(y), parseInt(m) - 1).getTime()
  }

  const mostRecent = [...new Set(consolidatedData.map(i => i.period).filter(Boolean) as string[])]
    .sort((a, b) => toDate(b) - toDate(a))[0]

  const latestRows = consolidatedData.filter(i => i.period === mostRecent)

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('portfolioPerformance.kpi.clientDataDisplay.loading')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 mb-8">
      {latestRows.length > 0 && (
        <Card className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">{t('portfolioPerformance.kpi.clientDataDisplay.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('portfolioPerformance.kpi.clientDataDisplay.table.institution')}</TableHead>
                  <TableHead>{t('portfolioPerformance.kpi.clientDataDisplay.table.initialAssets')}</TableHead>
                  <TableHead>{t('portfolioPerformance.kpi.clientDataDisplay.table.movement')}</TableHead>
                  <TableHead>{t('portfolioPerformance.kpi.clientDataDisplay.table.taxes')}</TableHead>
                  <TableHead>{t('portfolioPerformance.kpi.clientDataDisplay.table.financialGain')}</TableHead>
                  <TableHead>{t('portfolioPerformance.kpi.clientDataDisplay.table.finalAssets')}</TableHead>
                  <TableHead>{t('portfolioPerformance.kpi.clientDataDisplay.table.yield')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestRows.map(r => {
                  const originalCurrency = (r.currency === 'USD' || r.currency === 'Dolar') ? 'USD' : 'BRL'
                  const period = r.period || mostRecent
                  const initialConverted = convertValue(Number(r.initial_assets || 0), period, originalCurrency)
                  const movementConverted = convertValue(Number(r.movement || 0), period, originalCurrency)
                  const taxesConverted = convertValue(Number(r.taxes || 0), period, originalCurrency)
                  const gainConverted = convertValue(Number(r.financial_gain || 0), period, originalCurrency)
                  const finalConverted = convertValue(Number(r.final_assets || 0), period, originalCurrency)
                  const yieldAdjusted = adjustReturnWithFX(Number(r.yield || 0), period, originalCurrency)
                  
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.institution || '-'}</TableCell>
                      <TableCell>{formatCurrencyContext(initialConverted)}</TableCell>
                      <TableCell className={movementConverted >= 0 ? "text-success" : "text-destructive"}>{formatCurrencyContext(movementConverted)}</TableCell>
                      <TableCell className={taxesConverted >= 0 ? "text-muted-foreground" : "text-destructive"}>{formatCurrencyContext(taxesConverted)}</TableCell>
                      <TableCell className={gainConverted >= 0 ? "text-success" : "text-destructive"}>{formatCurrencyContext(gainConverted)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrencyContext(finalConverted)}</TableCell>
                      <TableCell>
                        <Badge variant={yieldAdjusted >= 0 ? "default" : "destructive"}>{((yieldAdjusted) * 100).toFixed(2)}%</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {portfolioTableComponent}

      {institutionCardData && (
        <InstitutionAllocationCard
          institutionData={institutionCardData.institutionData}
          totalPatrimonio={institutionCardData.totalPatrimonio}
          selectedInstitution={selectedInstitution}
          onInstitutionClick={onInstitutionClick}
        />
      )}

      {consolidatedData.length === 0 && performanceData.length === 0 && (
        <Card className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('portfolioPerformance.kpi.clientDataDisplay.noData.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('portfolioPerformance.kpi.clientDataDisplay.noData.message', { clientName })}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


