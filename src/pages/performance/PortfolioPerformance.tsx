import { useTranslation } from "react-i18next";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InvestmentPlan, Profile } from "@/types/financial";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, Building2, Calendar, CheckCircle2, XCircle, Clock, Loader2, History, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { usePerformanceData } from "@/hooks";
import { useStatementImports } from "@/hooks/useStatementImports";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { InvestmentPolicyService, type InvestmentPreferences } from "@/services/investment-policy.service";
import { CompetenciaSeletor } from "@/components/portfolio/competencia-seletor";
import { ClientDataDisplay } from "@/components/portfolio/client-data-display";
import { PortfolioTable } from "@/components/portfolio/portfolio-table";
import { MaturityDialog } from "@/components/portfolio/maturity-dialog";
import { DiversificationDialog } from "@/components/portfolio/diversification-dialog";
import { IssuerExposure } from "@/components/portfolio/issuer-exposure";
import { MaturityTimeline } from "@/components/portfolio/maturity-timeline";
import { InvestmentDetailsTable } from "@/components/portfolio/investment-details-table";
import { StrategyBreakdown } from "@/components/portfolio/strategy-breakdown";
import { CurrencyToggle } from "@/components/portfolio/currency-toggle";
import { PerformanceChart } from "@/components/portfolio/performance-chart";
import { AssetReturnsTable } from "@/components/portfolio/asset-returns-table";
import { useCurrency } from "@/contexts/CurrencyContext";
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
  const { isBroker } = useAuth();
  const { currency: displayCurrency, convertValue, adjustReturnWithFX, formatCurrency: formatCurrencyContext } = useCurrency();
  const { consolidatedData, performanceData, loading, error, totalAssets, totalYield, previousAssets, assetsChangePercent, hasData, refetch } = usePerformanceData(profile?.id || null)
  const { latestImport } = useStatementImports(profile?.id || null)
  const [filteredRange, setFilteredRange] = useState<{ inicio: string; fim: string }>({ inicio: "", fim: "" })
  const [yearTotals, setYearTotals] = useState<{ totalPatrimonio: number; totalRendimento: number } | null>(null)
  const [maturityDialogOpen, setMaturityDialogOpen] = useState(false)
  const [diversificationDialogOpen, setDiversificationDialogOpen] = useState(false)
  const [targetReturnIpcaPlus, setTargetReturnIpcaPlus] = useState<string | undefined>(undefined)
  const navigate = useNavigate()

  // Fetch investment policy to get target_return_ipca_plus
  useEffect(() => {
    if (profile?.id) {
      InvestmentPolicyService.fetchPolicyByClientId(profile.id)
        .then(policy => {
          const preferences = policy.investment_preferences as InvestmentPreferences | undefined
          if (preferences?.target_return_ipca_plus) {
            setTargetReturnIpcaPlus(preferences.target_return_ipca_plus)
          }
        })
        .catch(err => {
          console.error('Error fetching investment policy:', err)
        })
    }
  }, [profile?.id])
  
  // Use display currency from context, fallback to investment plan currency
  const currency = (investmentPlan?.currency || displayCurrency) as CurrencyCode
  
  const openDataManagement = () => {
    navigate(`/portfolio-data-management/${profile?.id}`)
  }

  const openImportsHistory = () => {
    navigate(`/statement-imports-history/${profile?.id}`)
  }

  const getStatusIcon = (status: string | null) => {
    if (!status) return null
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'created':
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }
  
  const handleFilterChange = useCallback((inicioCompetencia: string, fimCompetencia: string) => {
    setFilteredRange({ inicio: inicioCompetencia, fim: fimCompetencia })
  }, [])

  // Calculate converted total assets considering currency conversion
  const convertedTotalAssets = useMemo(() => {
    if (!hasData || consolidatedData.length === 0) return totalAssets || 0
    
    // Get most recent period
    const periods = [...new Set(consolidatedData.map(d => d.period).filter(Boolean) as string[])]
      .sort((a, b) => {
        const [mA, yA] = a.split('/').map(Number)
        const [mB, yB] = b.split('/').map(Number)
        if (yA !== yB) return yB - yA
        return mB - mA
      })
    
    if (periods.length === 0) return totalAssets || 0
    
    const mostRecentPeriod = periods[0]
    const recentData = consolidatedData.filter(d => d.period === mostRecentPeriod)
    
    return recentData.reduce((sum, entry) => {
      const originalCurrency = (entry.currency === 'USD' || entry.currency === 'Dolar') ? 'USD' : 'BRL'
      const value = entry.final_assets || 0
      return sum + convertValue(value, entry.period || mostRecentPeriod, originalCurrency)
    }, 0)
  }, [consolidatedData, hasData, totalAssets, convertValue])

  // Calculate converted total yield considering FX adjustment
  const convertedTotalYield = useMemo(() => {
    if (!hasData || consolidatedData.length === 0) return totalYield || 0
    
    // Get most recent period
    const periods = [...new Set(consolidatedData.map(d => d.period).filter(Boolean) as string[])]
      .sort((a, b) => {
        const [mA, yA] = a.split('/').map(Number)
        const [mB, yB] = b.split('/').map(Number)
        if (yA !== yB) return yB - yA
        return mB - mA
      })
    
    if (periods.length === 0) return totalYield || 0
    
    const mostRecentPeriod = periods[0]
    const recentData = consolidatedData.filter(d => d.period === mostRecentPeriod)
    
    // Calculate weighted average yield with FX adjustment
    const totalWeight = recentData.reduce((sum, entry) => {
      const originalCurrency = (entry.currency === 'USD' || entry.currency === 'Dolar') ? 'USD' : 'BRL'
      const value = entry.final_assets || 0
      return sum + convertValue(value, entry.period || mostRecentPeriod, originalCurrency)
    }, 0)
    
    if (totalWeight === 0) return totalYield || 0
    
    const weightedYield = recentData.reduce((sum, entry) => {
      const originalCurrency = (entry.currency === 'USD' || entry.currency === 'Dolar') ? 'USD' : 'BRL'
      const patrimonio = entry.final_assets || 0
      const patrimonioConvertido = convertValue(patrimonio, entry.period || mostRecentPeriod, originalCurrency)
      const rendimentoAjustado = adjustReturnWithFX(entry.yield || 0, entry.period || mostRecentPeriod, originalCurrency)
      return sum + (rendimentoAjustado * patrimonioConvertido)
    }, 0)
    
    return weightedYield / totalWeight
  }, [consolidatedData, hasData, totalYield, convertValue, adjustReturnWithFX])

  // Institution allocation data for latest period
  const institutionCardData = useMemo(() => {
    return calculateInstitutionCardData(
      consolidatedData, 
      t('portfolioPerformance.kpi.noInstitution'),
      convertValue,
      adjustReturnWithFX
    )
  }, [consolidatedData, t, convertValue, adjustReturnWithFX])

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
        <div className="flex justify-between items-center">
          <div></div>
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            {isBroker && (
              <>
                <Button 
                  variant="outline" 
                  onClick={openImportsHistory}
                  className="flex items-center gap-2"
                >
                  {latestImport ? (
                    <>
                      {getStatusIcon(latestImport.status)}
                      <History className="h-4 w-4" />
                      {t('portfolioPerformance.kpi.imports.history')}
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-gray-500" />
                      <History className="h-4 w-4" />
                      {t('portfolioPerformance.kpi.imports.neverImported')}
                    </>
                  )}
                </Button>
                <Button variant="default" onClick={openDataManagement}>
                  {t('portfolioPerformance.kpi.manageData')}
                </Button>
              </>
            )}
          </div>
        </div>
        {/* KPI Cards - estilo próximo ao InvestmentDashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.totalAssets')}
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 dark:from-amber-600 dark:via-amber-700 dark:to-orange-700 flex items-center justify-center shadow-md">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? <Spinner className="h-5 w-5" /> : formatCurrencyContext(convertedTotalAssets)}
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
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700 flex items-center justify-center shadow-md">
                <Target className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? <Spinner className="h-5 w-5" /> : formatPercentage(convertedTotalYield)}
              </div>
              <p className="text-xs text-emerald-600 mt-1">{t('portfolioPerformance.kpi.vsTarget')}</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setDiversificationDialogOpen(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.diversification')}
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 flex items-center justify-center shadow-md">
                <Building2 className="h-5 w-5 text-white" />
              </div>
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

          <Card 
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setMaturityDialogOpen(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.nextMaturity')}
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 dark:from-purple-600 dark:via-purple-700 dark:to-pink-700 flex items-center justify-center shadow-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
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
        
        {/* Performance Chart - Above Consolidated Performance */}
        {hasData && (
          <PerformanceChart 
            consolidatedData={consolidatedData}
            targetReturnIpcaPlus={targetReturnIpcaPlus}
          />
        )}
        
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

        {/* Dialogs */}
        <MaturityDialog open={maturityDialogOpen} onOpenChange={setMaturityDialogOpen} performanceData={performanceData} />
        <DiversificationDialog open={diversificationDialogOpen} onOpenChange={setDiversificationDialogOpen} performanceData={performanceData} />

        {/* Charts/Breakdowns similar to InvestmentDashboard */}
        <div className="space-y-6">
          <StrategyBreakdown performanceData={performanceData} />
          <InvestmentDetailsTable performanceData={performanceData} />
          <MaturityTimeline performanceData={performanceData} />
          <IssuerExposure performanceData={performanceData} />
          <AssetReturnsTable performanceData={performanceData} />
        </div>
      </div>
    </div>
  );
}

export default PortfolioPerformance;


