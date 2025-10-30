import { useTranslation } from "react-i18next";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types/financial";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, Building2, Calendar } from "lucide-react";
import { usePerformanceData } from "@/hooks";
import { Button } from "@/components/ui/button";
import { CompetenciaSeletor } from "@/components/portfolio/competencia-seletor";
import { ClientDataDisplay } from "@/components/portfolio/client-data-display";
import { PortfolioTable } from "@/components/portfolio/portfolio-table";
import { MaturityDialog } from "@/components/portfolio/maturity-dialog";
import { IssuerExposure } from "@/components/portfolio/issuer-exposure";
import { MaturityTimeline } from "@/components/portfolio/maturity-timeline";
import { InvestmentDetailsTable } from "@/components/portfolio/investment-details-table";

interface PortfolioPerformanceProps {
  clientId: string;
  profile: Profile | null;
  broker: Profile | null;
  onLogout: () => void;
  onShareClient: () => void;
}

function PortfolioPerformance({
  clientId,
  profile,
  broker,
  onLogout,
  onShareClient
}: PortfolioPerformanceProps) {
  const { t } = useTranslation();
  const { consolidatedData, performanceData, loading, error, totalAssets, totalYield, hasData, refetch } = usePerformanceData(profile?.id || null)
  const [filteredRange, setFilteredRange] = useState<{ inicio: string; fim: string }>({ inicio: "", fim: "" })
  const [yearTotals, setYearTotals] = useState<{ totalPatrimonio: number; totalRendimento: number } | null>(null)
  const [maturityDialogOpen, setMaturityDialogOpen] = useState(false)
  const navigate = useNavigate()
  
  const openDataManagement = () => {
    navigate(`/portfolio-data-management/${profile?.id}`)
  }
  
  const handleFilterChange = useCallback((inicioCompetencia: string, fimCompetencia: string) => {
    setFilteredRange({ inicio: inicioCompetencia, fim: fimCompetencia })
  }, [])
  // Institution allocation data for latest period
  const institutionCardData = useMemo(() => {
    if (!consolidatedData || consolidatedData.length === 0) return null
    const toDate = (p?: string | null) => {
      if (!p) return 0
      const [m, y] = p.split('/')
      return new Date(parseInt(y), parseInt(m) - 1).getTime()
    }
    const mostRecent = [...new Set(consolidatedData.map(r => r.period).filter(Boolean) as string[])]
      .sort((a, b) => toDate(b) - toDate(a))[0]
    if (!mostRecent) return null
    const rows = consolidatedData.filter(r => r.period === mostRecent)
    if (rows.length === 0) return null
    const totalPatrimonio = rows.reduce((s, r) => s + Number(r.final_assets || 0), 0)
    const palette = [
      'hsl(40 22% 80%)','hsl(45 18% 86%)','hsl(210 16% 80%)','hsl(210 14% 75%)',
      'hsl(200 18% 68%)','hsl(160 28% 42%)','hsl(38 20% 76%)','hsl(210 18% 84%)'
    ]
    const byInstitution = rows.reduce((acc, r) => {
      const key = r.institution || 'Sem Instituição'
      const entry = acc.get(key) || { patrimonio: 0, rendimentoSum: 0, weight: 0 }
      const pat = Number(r.final_assets || 0)
      entry.patrimonio += pat
      entry.rendimentoSum += Number(r.yield || 0) * pat
      entry.weight += pat
      acc.set(key, entry)
      return acc
    }, new Map<string, { patrimonio: number; rendimentoSum: number; weight: number }>())
    const institutionData = Array.from(byInstitution.entries()).map(([institution, v], idx) => ({
      institution,
      patrimonio: v.patrimonio,
      rendimento: v.weight > 0 ? v.rendimentoSum / v.weight : 0,
      percentage: totalPatrimonio > 0 ? (v.patrimonio / totalPatrimonio) * 100 : 0,
      color: palette[idx % palette.length]
    })).sort((a, b) => b.patrimonio - a.patrimonio)
    return { institutionData, totalPatrimonio }
  }, [consolidatedData])

  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null)


  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="default" onClick={openDataManagement}>
            Gerenciar dados
          </Button>
        </div>
        {/* KPI Cards - estilo próximo ao InvestmentDashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Patrimônio Total</CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? <Spinner className="h-5 w-5" /> : `R$ ${Number(totalAssets || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sem mês anterior para comparar</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Rentabilidade no mês</CardTitle>
              <Target className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? <Spinner className="h-5 w-5" /> : `${(Number(totalYield || 0) * 100).toFixed(2)}%`}
              </div>
              <p className="text-xs text-emerald-600 mt-1">vs Meta: --</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Diversificação</CardTitle>
              <Building2 className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {(() => {
                  if (loading) return "--"
                  const toDate = (p?: string | null) => {
                    if (!p) return 0
                    const [m, y] = p.split('/')
                    return new Date(parseInt(y), parseInt(m) - 1).getTime()
                  }
                  const mostRecent = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])]
                    .sort((a, b) => toDate(b) - toDate(a))[0]
                  if (!mostRecent) return "--"
                  return performanceData.filter(d => d.period === mostRecent).length || "--"
                })()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ativos na carteira</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Próximo Vencimento</CardTitle>
              <Calendar className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {(() => {
                  if (loading) return "--"
                  const toDate = (p?: string | null) => {
                    if (!p) return 0
                    const [m, y] = p.split('/')
                    return new Date(parseInt(y), parseInt(m) - 1).getTime()
                  }
                  const mostRecent = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])]
                    .sort((a, b) => toDate(b) - toDate(a))[0]
                  const rows = performanceData.filter(d => d.period === mostRecent && d.maturity_date)
                    .map(d => new Date(d.maturity_date as string))
                    .filter(d => d >= new Date())
                    .sort((a, b) => a.getTime() - b.getTime())
                  if (rows.length === 0) return "--"
                  return rows[0].toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
                })()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aguardando dados</p>
            </CardContent>
          </Card>
        </div>

        {/* Competência (Período) Selector */}
        <CompetenciaSeletor 
          consolidatedData={consolidatedData}
          performanceData={performanceData}
          onFilterChange={handleFilterChange}
        />
        
        {/* Consolidated Performance Card + Resumo do Patrimônio (cada um com seu card) */}
        {loading ? (
          <div className="py-8 flex justify-center"><Spinner className="h-6 w-6" /></div>
        ) : hasData ? (
          <>
            <ClientDataDisplay 
              consolidatedData={consolidatedData}
              performanceData={performanceData}
              loading={loading}
              clientName={profile?.name || ''}
              portfolioTableComponent={
                <PortfolioTable 
                  consolidatedData={consolidatedData}
                  filteredRange={filteredRange}
                  onYearTotalsChange={setYearTotals}
                />
              }
              institutionCardData={institutionCardData || undefined}
              selectedInstitution={selectedInstitution}
              onInstitutionClick={(institution) => setSelectedInstitution(prev => prev === institution ? null : institution)}
            />
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">{t('common.noData') || 'Sem dados'}</p>
        )}

        {/* Maturity Dialog trigger placeholder (can be wired to a button later) */}
        <MaturityDialog open={maturityDialogOpen} onOpenChange={setMaturityDialogOpen} performanceData={performanceData} />

        {/* Charts/Breakdowns similar to InvestmentDashboard */}
        <div className="space-y-6">
          <InvestmentDetailsTable performanceData={performanceData} />
          <MaturityTimeline performanceData={performanceData} />
          <IssuerExposure performanceData={performanceData} />
        </div>
      </div>
    </div>
  );
}

export default PortfolioPerformance;

