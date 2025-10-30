import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InstitutionAllocationCard } from "@/components/portfolio/institution-allocation-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"

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
            <CardTitle className="text-sm text-muted-foreground">Carregando dados...</CardTitle>
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
            <CardTitle className="flex items-center gap-2">Performance Consolidada - Competência Mais Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Patrimônio Inicial</TableHead>
                  <TableHead>Movimentação</TableHead>
                  <TableHead>Impostos</TableHead>
                  <TableHead>Ganho Financeiro</TableHead>
                  <TableHead>Patrimônio Final</TableHead>
                  <TableHead>Rendimento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestRows.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.institution || '-'}</TableCell>
                    <TableCell>{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2}).format(Number(r.initial_assets || 0))}</TableCell>
                    <TableCell className={Number(r.movement || 0) >= 0 ? "text-success" : "text-destructive"}>{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2}).format(Number(r.movement || 0))}</TableCell>
                    <TableCell className={Number(r.taxes || 0) >= 0 ? "text-muted-foreground" : "text-destructive"}>{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2}).format(Number(r.taxes || 0))}</TableCell>
                    <TableCell className={Number(r.financial_gain || 0) >= 0 ? "text-success" : "text-destructive"}>{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2}).format(Number(r.financial_gain || 0))}</TableCell>
                    <TableCell className="font-semibold">{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2}).format(Number(r.final_assets || 0))}</TableCell>
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
        />
      )}

      {consolidatedData.length === 0 && performanceData.length === 0 && (
        <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Nenhum dado encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Não foram encontrados dados para o cliente "{clientName}".</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


