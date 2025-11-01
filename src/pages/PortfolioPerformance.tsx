import { useTranslation } from "react-i18next";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { InvestmentPlan, Profile } from "@/types/financial";
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
import { formatMaturityDate } from "@/utils/dateUtils";
import {
  calculateInstitutionCardData,
  calculateDiversificationCount,
  getNextMaturityDate,
  formatPercentage
} from "./helpers/portfolio-performance.helpers";
import { formatCurrency } from "@/utils/currency";
import { CurrencyCode } from "@/utils/currency";

interface PortfolioPerformanceProps {
  clientId: string;
  profile: Profile | null;
  broker: Profile | null;
  investmentPlan: InvestmentPlan | null;
  onLogout: () => void;
  onShareClient: () => void;
}

function PortfolioPerformance({
  clientId,
  profile,
  broker,
  investmentPlan,
  onLogout,
  onShareClient
}: PortfolioPerformanceProps) {
  const { t } = useTranslation();
  const { consolidatedData, performanceData, loading, error, totalAssets, totalYield, previousAssets, assetsChangePercent, hasData, refetch } = usePerformanceData(profile?.id || null)
  const [filteredRange, setFilteredRange] = useState<{ inicio: string; fim: string }>({ inicio: "", fim: "" })
  const [yearTotals, setYearTotals] = useState<{ totalPatrimonio: number; totalRendimento: number } | null>(null)
  const [maturityDialogOpen, setMaturityDialogOpen] = useState(false)
  const navigate = useNavigate()
  
  const currency = (investmentPlan?.currency || 'BRL') as CurrencyCode
  
  const openDataManagement = () => {
    navigate(`/portfolio-data-management/${profile?.id}`)
  }
  
  const handleFilterChange = useCallback((inicioCompetencia: string, fimCompetencia: string) => {
    setFilteredRange({ inicio: inicioCompetencia, fim: fimCompetencia })
  }, [])

  // Institution allocation data for latest period
  const institutionCardData = useMemo(() => {
    return calculateInstitutionCardData(consolidatedData, t('portfolioPerformance.kpi.noInstitution'))
  }, [consolidatedData, t])

  // Diversification count (assets in portfolio)
  const diversificationCount = useMemo(() => {
    return calculateDiversificationCount(performanceData)
  }, [performanceData])

  // Next maturity date
  const nextMaturity = useMemo(() => {
    return getNextMaturityDate(performanceData)
  }, [performanceData])

  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null)


  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="default" onClick={openDataManagement}>
            {t('portfolioPerformance.kpi.manageData')}
          </Button>
        </div>
        {/* KPI Cards - estilo próximo ao InvestmentDashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.totalAssets')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? <Spinner className="h-5 w-5" /> : formatCurrency(totalAssets || 0, currency)}
              </div>
              {loading ? null : assetsChangePercent !== null ? (
                <p className={`text-xs mt-1 ${assetsChangePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {assetsChangePercent >= 0 ? '↑' : '↓'} {formatPercentage(Math.abs(assetsChangePercent) / 100)} {t('portfolioPerformance.kpi.vsPreviousMonth')}
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('portfolioPerformance.kpi.noPreviousMonth')}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.monthlyYield')}
              </CardTitle>
              <Target className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? <Spinner className="h-5 w-5" /> : formatPercentage(totalYield || 0)}
              </div>
              <p className="text-xs text-emerald-600 mt-1">{t('portfolioPerformance.kpi.vsTarget')}</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.diversification')}
              </CardTitle>
              <Building2 className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? "--" : diversificationCount ?? "--"}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('portfolioPerformance.kpi.assetsInPortfolio')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.nextMaturity')}
              </CardTitle>
              <Calendar className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? "--" : nextMaturity ? formatMaturityDate(nextMaturity) : "--"}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('portfolioPerformance.kpi.waitingData')}
              </p>
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
              currency={currency}
              portfolioTableComponent={
                <PortfolioTable 
                  consolidatedData={consolidatedData}
                  filteredRange={filteredRange}
                  onYearTotalsChange={setYearTotals}
                  currency={currency}
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
        <MaturityDialog open={maturityDialogOpen} onOpenChange={setMaturityDialogOpen} performanceData={performanceData} currency={currency} />

        {/* Charts/Breakdowns similar to InvestmentDashboard */}
        <div className="space-y-6">
          <InvestmentDetailsTable performanceData={performanceData} currency={currency} />
          <MaturityTimeline performanceData={performanceData} currency={currency} />
          <IssuerExposure performanceData={performanceData} currency={currency} />
        </div>
      </div>
    </div>
  );
}

export default PortfolioPerformance;


