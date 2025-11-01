import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InstitutionAllocationCard } from "@/components/portfolio/institution-allocation-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"
import { formatCurrency } from "@/utils/currency"
import { CurrencyCode } from "@/utils/currency"
import { useTranslation } from "react-i18next"

interface ClientDataDisplayProps {
  consolidatedData: ConsolidatedPerformance[]
  performanceData: PerformanceData[]
  loading: boolean
  clientName: string
  currency?: CurrencyCode
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

export function ClientDataDisplay({ consolidatedData, performanceData, loading, clientName, currency = 'BRL', portfolioTableComponent, institutionCardData, selectedInstitution, onInstitutionClick }: ClientDataDisplayProps) {
  const { t } = useTranslation()
  
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
        <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
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
        <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
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
                {latestRows.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.institution || '-'}</TableCell>
                    <TableCell>{formatCurrency(Number(r.initial_assets || 0), currency)}</TableCell>
                    <TableCell className={Number(r.movement || 0) >= 0 ? "text-success" : "text-destructive"}>{formatCurrency(Number(r.movement || 0), currency)}</TableCell>
                    <TableCell className={Number(r.taxes || 0) >= 0 ? "text-muted-foreground" : "text-destructive"}>{formatCurrency(Number(r.taxes || 0), currency)}</TableCell>
                    <TableCell className={Number(r.financial_gain || 0) >= 0 ? "text-success" : "text-destructive"}>{formatCurrency(Number(r.financial_gain || 0), currency)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(Number(r.final_assets || 0), currency)}</TableCell>
                    <TableCell>
                      <Badge variant={Number(r.yield || 0) >= 0 ? "default" : "destructive"}>{((Number(r.yield || 0)) * 100).toFixed(2)}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
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
          currency={currency}
        />
      )}

      {consolidatedData.length === 0 && performanceData.length === 0 && (
        <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
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


