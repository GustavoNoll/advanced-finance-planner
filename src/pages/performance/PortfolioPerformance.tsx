import { useTranslation } from "react-i18next";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types/financial";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, Building2, Calendar, CheckCircle2, XCircle, Clock, Loader2, History } from "lucide-react";
import { usePerformanceData } from "@/hooks";
import { useStatementImports } from "@/hooks/useStatementImports";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { CompetenceSelector } from "@/components/portfolio/competence-selector";
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
import { buttonOrange, iconContainerOrange, iconContainerGreen, iconContainerBlue, iconContainerPurple, gradientCard } from "@/lib/gradient-classes";
import {
  calculateInstitutionCardData,
  calculateDiversificationCount,
  getNextMaturityDate,
  formatPercentage
} from "./helpers/portfolio-performance.helpers";
import { fetchIPCARates, fetchUSCPIRates, fetchEuroCPIRates } from "@/lib/bcb-api";
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math";
import { InvestmentPlan, MicroInvestmentPlan } from "@/types/financial/investment-plans";

function competenciaToDate(competencia: string): Date {
  const [month, year] = competencia.split('/').map(Number)
  return new Date(year, month - 1)
}

function isPeriodInRange(period: string, start: string, end: string): boolean {
  const periodDate = competenciaToDate(period)
  const startDate = competenciaToDate(start)
  const endDate = competenciaToDate(end)
  return periodDate.getTime() >= startDate.getTime() && periodDate.getTime() <= endDate.getTime()
}

interface PortfolioPerformanceProps {
  clientId: string;
  profile: Profile | null;
  broker: Profile | null;
  investmentPlan: InvestmentPlan | null;
  activeMicroPlan: MicroInvestmentPlan | null;
  onLogout: () => void;
  onShareClient: () => void;
}

function PortfolioPerformance({
  clientId,
  profile,
  broker,
  investmentPlan,
  activeMicroPlan,
  onLogout,
  onShareClient
}: PortfolioPerformanceProps) {
  const { t } = useTranslation();
  const { isBroker, loading: authLoading, user } = useAuth();
  const { currency: displayCurrency, convertValue, adjustReturnWithFX, formatCurrency: formatCurrencyContext } = useCurrency();
  const { consolidatedData, performanceData, loading, error, totalAssets, totalYield, previousAssets, assetsChangePercent, hasData, refetch, mostRecentPeriod } = usePerformanceData(profile?.id || null)
  const { latestImport } = useStatementImports(profile?.id || null)
  const [filteredPeriodRange, setFilteredPeriodRange] = useState<{ start: string; end: string }>({ start: "", end: "" })
  const [yearTotals, setYearTotals] = useState<{ totalPatrimonio: number; totalRendimento: number } | null>(null)
  const [maturityDialogOpen, setMaturityDialogOpen] = useState(false)
  const [diversificationDialogOpen, setDiversificationDialogOpen] = useState(false)
  const navigate = useNavigate()

  // Dados filtrados pela competência selecionada
  const filteredConsolidatedData = useMemo(() => {
    if (!filteredPeriodRange.start || !filteredPeriodRange.end) return consolidatedData
    return consolidatedData.filter(entry => entry.period && isPeriodInRange(entry.period, filteredPeriodRange.start, filteredPeriodRange.end))
  }, [consolidatedData, filteredPeriodRange])

  const filteredPerformanceData = useMemo(() => {
    if (!filteredPeriodRange.start || !filteredPeriodRange.end) return performanceData
    return performanceData.filter(entry => entry.period && isPeriodInRange(entry.period, filteredPeriodRange.start, filteredPeriodRange.end))
  }, [performanceData, filteredPeriodRange])

  // Período de referência para KPIs (última competência dentro do filtro, caindo para mostRecentPeriod se necessário)
  const kpiReferencePeriod = useMemo(() => {
    if (filteredConsolidatedData.length === 0 && filteredPerformanceData.length === 0) return mostRecentPeriod
    
    const periods = [
      ...new Set([
        ...filteredConsolidatedData.map(d => d.period).filter(Boolean) as string[],
        ...filteredPerformanceData.map(d => d.period).filter(Boolean) as string[]
      ])
    ].sort((a, b) => {
      const dateA = competenciaToDate(a)
      const dateB = competenciaToDate(b)
      return dateB.getTime() - dateA.getTime()
    })

    return periods[0] || mostRecentPeriod
  }, [filteredConsolidatedData, filteredPerformanceData, mostRecentPeriod])

  // Get current month inflation rate based on investment plan currency
  // Uses the KPI reference period (respecting selected competence range)
  const currentMonthInflation = useMemo(() => {
    if (!investmentPlan || !kpiReferencePeriod) return null
    
    // Parse the period (MM/YYYY format) to get month and year
    const [monthStr, yearStr] = kpiReferencePeriod.split('/')
    const month = parseInt(monthStr, 10)
    const year = parseInt(yearStr, 10)
    
    if (isNaN(month) || isNaN(year)) return null
    
    // Create date range for that specific month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 1) // First day of next month (exclusive)
    
    const startDateStr = `01/${String(startDate.getMonth() + 1).padStart(2, '0')}/${startDate.getFullYear()}`
    const endDateStr = `01/${String(endDate.getMonth() + 1).padStart(2, '0')}/${endDate.getFullYear()}`
    
    let rates: Array<{ date: Date; monthlyRate: number }> = []
    switch (investmentPlan.currency) {
      case 'USD':
        rates = fetchUSCPIRates(startDateStr, endDateStr)
        break
      case 'EUR':
        rates = fetchEuroCPIRates(startDateStr, endDateStr)
        break
      case 'BRL':
      default:
        rates = fetchIPCARates(startDateStr, endDateStr)
        break
    }
    
    if (rates.length === 0) return null
    
    // Find the rate for the specific month we're looking for
    const rateForPeriod = rates.find(rate => {
      const rateDate = rate.date
      return rateDate.getFullYear() === year && rateDate.getMonth() === month - 1
    })
    
    // If exact match not found, use the most recent rate in the range
    return rateForPeriod ? rateForPeriod.monthlyRate : (rates[rates.length - 1]?.monthlyRate ?? null)
  }, [investmentPlan, kpiReferencePeriod])

  // Calculate target return: Expected Return - Current Month Inflation
  const targetReturn = useMemo(() => {
    if (!activeMicroPlan || !currentMonthInflation) return null
    const inflation = currentMonthInflation
    
    const targetConverted = parseFloat((
      calculateCompoundedRates([
        inflation/100, 
        yearlyReturnRateToMonthlyReturnRate(activeMicroPlan.expected_return/100)
      ])
    ).toFixed(10))
    return targetConverted
  }, [activeMicroPlan, currentMonthInflation])
  
  
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
  
  const handleFilterChange = useCallback((startPeriod: string, endPeriod: string) => {
    setFilteredPeriodRange({ start: startPeriod, end: endPeriod })
  }, [])

  // Calculate converted total assets considering currency conversion (respecting competence filter)
  const convertedTotalAssets = useMemo(() => {
    if (!hasData || filteredConsolidatedData.length === 0) return totalAssets || 0
    
    // Get most recent period
    const periods = [...new Set(filteredConsolidatedData.map(d => d.period).filter(Boolean) as string[])]
      .sort((a, b) => {
        const [mA, yA] = a.split('/').map(Number)
        const [mB, yB] = b.split('/').map(Number)
        if (yA !== yB) return yB - yA
        return mB - mA
      })
    
    if (periods.length === 0) return totalAssets || 0
    
    const latestPeriodInFilter = periods[0]
    const recentData = filteredConsolidatedData.filter(d => d.period === latestPeriodInFilter)
    
    return recentData.reduce((sum, entry) => {
      const originalCurrency = (entry.currency === 'USD' || entry.currency === 'Dolar') ? 'USD' : 'BRL'
      const value = entry.final_assets || 0
      return sum + convertValue(value, entry.period || latestPeriodInFilter, originalCurrency)
    }, 0)
  }, [filteredConsolidatedData, hasData, totalAssets, convertValue])

  // Calculate converted total yield considering FX adjustment (respecting competence filter)
  const convertedTotalYield = useMemo(() => {
    if (!hasData || filteredConsolidatedData.length === 0) return totalYield || 0
    
    // Get most recent period
    const periods = [...new Set(filteredConsolidatedData.map(d => d.period).filter(Boolean) as string[])]
      .sort((a, b) => {
        const [mA, yA] = a.split('/').map(Number)
        const [mB, yB] = b.split('/').map(Number)
        if (yA !== yB) return yB - yA
        return mB - mA
      })
    
    if (periods.length === 0) return totalYield || 0
    
    const latestPeriodInFilter = periods[0]
    const recentData = filteredConsolidatedData.filter(d => d.period === latestPeriodInFilter)
    
    // Calculate weighted average yield with FX adjustment
    const totalWeight = recentData.reduce((sum, entry) => {
      const originalCurrency = (entry.currency === 'USD' || entry.currency === 'Dolar') ? 'USD' : 'BRL'
      const value = entry.final_assets || 0
      return sum + convertValue(value, entry.period || latestPeriodInFilter, originalCurrency)
    }, 0)
    
    if (totalWeight === 0) return totalYield || 0
    
    const weightedYield = recentData.reduce((sum, entry) => {
      const originalCurrency = (entry.currency === 'USD' || entry.currency === 'Dolar') ? 'USD' : 'BRL'
      const patrimonio = entry.final_assets || 0
      const patrimonioConvertido = convertValue(patrimonio, entry.period || latestPeriodInFilter, originalCurrency)
      const rendimentoAjustado = adjustReturnWithFX(entry.yield || 0, entry.period || latestPeriodInFilter, originalCurrency)
      return sum + (rendimentoAjustado * patrimonioConvertido)
    }, 0)
    
    return weightedYield / totalWeight
  }, [filteredConsolidatedData, hasData, totalYield, convertValue, adjustReturnWithFX])

  // Institution allocation data for latest period (respecting competence filter)
  const institutionCardData = useMemo(() => {
    return calculateInstitutionCardData(
      filteredConsolidatedData, 
      t('portfolioPerformance.kpi.noInstitution'),
      convertValue,
      adjustReturnWithFX
    )
  }, [filteredConsolidatedData, t, convertValue, adjustReturnWithFX])

  // Diversification count (assets in portfolio) within selected competence range
  const diversificationCount = useMemo(() => {
    return calculateDiversificationCount(filteredPerformanceData)
  }, [filteredPerformanceData])

  // Next maturity date within selected competence range
  const nextMaturity = useMemo(() => {
    return getNextMaturityDate(filteredPerformanceData)
  }, [filteredPerformanceData])

  // Calculate total value that will mature on next maturity date within selected competence range
  const nextMaturityValue = useMemo(() => {
    if (!nextMaturity || !filteredPerformanceData.length) return null

    const periods = [...new Set(filteredPerformanceData.map(d => d.period).filter(Boolean) as string[])]
      .sort((a, b) => {
        const [mA, yA] = a.split('/').map(Number)
        const [mB, yB] = b.split('/').map(Number)
        if (yA !== yB) return yB - yA
        return mB - mA
      })

    const latestPeriodInFilter = periods[0]

    if (!latestPeriodInFilter) return null

    // Filter assets that mature on the next maturity date
    const assetsMaturing = filteredPerformanceData.filter(item => {
      if (item.period !== latestPeriodInFilter || !item.maturity_date) return false
      const maturityDate = new Date(item.maturity_date)
      return maturityDate.getTime() === nextMaturity.getTime()
    })

    if (assetsMaturing.length === 0) return null

    // Sum all positions converted to display currency
    const totalValue = assetsMaturing.reduce((sum, item) => {
      const originalCurrency = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
      const position = Number(item.position || 0)
      const positionConverted = convertValue(position, item.period || latestPeriodInFilter, originalCurrency)
      return sum + positionConverted
    }, 0)

    return totalValue
  }, [nextMaturity, filteredPerformanceData, convertValue])

  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null)


  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            {!authLoading && user && isBroker && (
              <>
                <Button 
                  variant="outline" 
                  onClick={openImportsHistory}
                  className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
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
                <Button 
                  variant="default" 
                  onClick={openDataManagement}
                  className={buttonOrange}
                >
                  {t('portfolioPerformance.kpi.manageData')}
                </Button>
              </>
            )}
          </div>
        </div>
        {/* KPI cards styled similar to InvestmentDashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={gradientCard}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.totalAssets')}
              </CardTitle>
              <div className={iconContainerOrange}>
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

          <Card className={gradientCard}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.monthlyYield')}
              </CardTitle>
              <div className={iconContainerGreen}>
                <Target className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? <Spinner className="h-5 w-5" /> : formatPercentage(convertedTotalYield)}
              </div>
              {targetReturn !== null ? (() => {
                const difference = (convertedTotalYield - targetReturn) * 100 // Difference in percentage points
                const isAbove = difference >= 0
                const sign = isAbove ? '+' : ''
                return (
                  <p className={`text-xs mt-1 ${isAbove ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t('portfolioPerformance.kpi.vsTarget')}: {formatPercentage(targetReturn)} ({sign}{Math.abs(difference).toFixed(2)}pp)
                  </p>
                )
              })() : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('portfolioPerformance.kpi.vsTarget')}</p>
              )}
            </CardContent>
          </Card>

          <Card 
            className={`${gradientCard} cursor-pointer hover:shadow-xl transition-shadow`}
            onClick={() => setDiversificationDialogOpen(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.diversification')}
              </CardTitle>
              <div className={iconContainerBlue}>
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
            className={`${gradientCard} cursor-pointer hover:shadow-xl transition-shadow`}
            onClick={() => setMaturityDialogOpen(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('portfolioPerformance.kpi.nextMaturity')}
              </CardTitle>
              <div className={iconContainerPurple}>
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? "--" : nextMaturity ? formatMaturityDate(nextMaturity) : "--"}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {loading ? t('portfolioPerformance.kpi.waitingData') : nextMaturityValue !== null ? formatCurrencyContext(nextMaturityValue) : t('portfolioPerformance.kpi.waitingData')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Competence (Period) Selector */}
        <CompetenceSelector 
          consolidatedData={consolidatedData}
          performanceData={performanceData}
          onFilterChange={handleFilterChange}
        />
        
        {/* Performance Chart - Above Consolidated Performance */}
        {hasData && (
          <PerformanceChart 
            consolidatedData={filteredConsolidatedData}
            targetReturnIpcaPlus={targetReturn !== null ? targetReturn.toString() : undefined}
            targetReturnIpcaPlusText={(() => {
              if (!investmentPlan || !activeMicroPlan) return undefined
              const currency = investmentPlan.currency
              const expectedReturn = activeMicroPlan.expected_return
              
              if (currency === 'USD') {
                return `CPI+${expectedReturn}%`
              } else if (currency === 'EUR') {
                return `CPI+${expectedReturn}%`
              } else {
                return `IPCA+${expectedReturn}%`
              }
            })()}
          />
        )}
        
        {/* Consolidated performance card plus wealth summary */}
        {loading ? (
          <div className="py-8 flex justify-center"><Spinner className="h-6 w-6" /></div>
        ) : hasData ? (
          <>
            <ClientDataDisplay 
              consolidatedData={filteredConsolidatedData}
              performanceData={filteredPerformanceData}
              loading={loading}
              clientName={profile?.name || ''}
              portfolioTableComponent={
                <PortfolioTable 
                  consolidatedData={consolidatedData}
                  filteredRange={filteredPeriodRange}
                  onYearTotalsChange={setYearTotals}
                />
              }
              institutionCardData={institutionCardData || undefined}
              selectedInstitution={selectedInstitution}
              onInstitutionClick={(institution) => setSelectedInstitution(prev => prev === institution ? null : institution)}
            />
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">{t('common.noData')}</p>
        )}

        {/* Dialogs */}
        <MaturityDialog open={maturityDialogOpen} onOpenChange={setMaturityDialogOpen} performanceData={filteredPerformanceData} />
        <DiversificationDialog open={diversificationDialogOpen} onOpenChange={setDiversificationDialogOpen} performanceData={filteredPerformanceData} />

        {/* Charts/Breakdowns similar to InvestmentDashboard */}
        <div className="space-y-6">
          <StrategyBreakdown performanceData={filteredPerformanceData} />
          <InvestmentDetailsTable performanceData={filteredPerformanceData} />
          <MaturityTimeline performanceData={filteredPerformanceData} />
          <IssuerExposure performanceData={filteredPerformanceData} />
          <AssetReturnsTable performanceData={filteredPerformanceData} />
        </div>
      </div>
    </div>
  );
}

export default PortfolioPerformance;


