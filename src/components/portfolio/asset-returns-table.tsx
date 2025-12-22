import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Target, Settings2, ChevronRight, ChevronDown } from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { 
  groupStrategyName, 
  getStrategyBenchmarkLabelByKey,
  getStrategyColor,
  getStrategyOrder,
  STRATEGY_ORDER,
  calculateBenchmarkReturnsByAssetClass,
  type GroupedStrategyKey 
} from "@/utils/benchmark-calculator"
import { translateGroupedStrategy } from "@/utils/i18n-helpers"
import { isValidAssetClass, type ValidAssetClass } from "@/pages/performance/utils/valid-asset-classes"
import type { PerformanceData } from "@/types/financial"
import { useCurrency } from "@/contexts/CurrencyContext"
import { 
  competenciaToDate,
  safeParseFloat,
  ensureValidNumber,
  normalizeCurrency,
  shouldExcludeFromReturnCalculation,
  calculateCompoundReturn,
  getMostRecentData,
  calculateAdjustedReturn,
  calculateWeightedReturnForPeriod
} from "@/utils/portfolio-returns"

interface AssetReturnsTableProps {
  performanceData: PerformanceData[]
}

interface AssetReturnsTableCopy {
  title: string
  columnsButton: string
  dropdownLabel: string
  columns: {
    asset: string
    allocation: string
    grossBalance: string
    month: string
    year: string
    inception: string
    issuer: string
    institution: string
    accountName: string
    maturity: string
    currency: string
  }
  summary: {
    balance: string
    rentability: string
    rentabilityShort: string
  }
}

const ASSET_RETURNS_I18N_PATH = "portfolioPerformance.assetReturnsTable"

interface VisibleColumnsState {
  allocation: boolean
  grossBalance: boolean
  month: boolean
  year: boolean
  inception: boolean
  issuer: boolean
  institution: boolean
  accountName: boolean
  maturity: boolean
  currency: boolean
}


export function AssetReturnsTable({ performanceData }: AssetReturnsTableProps) {
  const { convertValue, adjustReturnWithFX, formatCurrency, currency } = useCurrency()
  const [expandedStrategies, setExpandedStrategies] = useState<Set<string>>(new Set())
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumnsState>({
    allocation: true,
    grossBalance: true,
    month: true,
    year: true,
    inception: true,
    issuer: true,
    institution: true,
    accountName: true,
    maturity: true,
    currency: true
  })

  // Helper function to generate grid template columns based on visible columns
  const getGridTemplateColumns = () => {
    const columns = ['minmax(180px, 1fr)'] // Ativo - flexível com mínimo de 180px
    
    if (visibleColumns.allocation) columns.push('110px')      // Alocação % - fixo
    if (visibleColumns.grossBalance) columns.push('130px')    // Saldo Bruto - fixo
    if (visibleColumns.month) columns.push('75px')            // Mês % - fixo
    if (visibleColumns.year) columns.push('75px')             // Ano % - fixo
    if (visibleColumns.inception) columns.push('75px')          // Início % - fixo
    if (visibleColumns.issuer) columns.push('140px')        // Emissor - fixo
    if (visibleColumns.institution) columns.push('130px')    // Instituição - fixo
    if (visibleColumns.accountName) columns.push('140px')     // Nome da Conta - fixo
    if (visibleColumns.maturity) columns.push('95px')     // Vencimento - fixo
    if (visibleColumns.currency) columns.push('90px')     // Moeda - fixo
    
    return columns.join(' ')
  }


  // Pre-compute asset returns for all assets
  const precomputedAssetReturns = useMemo(() => {
    const returns = new Map<string, { monthReturn: number; yearReturn: number; inceptionReturn: number }>()
    
    // Get unique asset names
    const uniqueAssets = Array.from(new Set(performanceData.map(item => item.asset).filter(Boolean) as string[]))
    
    uniqueAssets.forEach(assetName => {
      // Get all data for this asset
      const allAssetData = performanceData.filter(item => item.asset === assetName)
      
      if (allAssetData.length === 0) {
        returns.set(assetName, { monthReturn: 0, yearReturn: 0, inceptionReturn: 0 })
        return
      }
      
      // Find most recent competencia for this asset
      const mostRecentCompetencia = allAssetData.reduce((latest, current) => {
        if (!latest.period || !current.period) return latest
        const latestDate = competenciaToDate(latest.period)
        const currentDate = competenciaToDate(current.period)
        return currentDate > latestDate ? current : latest
      }).period
      
      if (!mostRecentCompetencia) {
        returns.set(assetName, { monthReturn: 0, yearReturn: 0, inceptionReturn: 0 })
        return
      }
      
      // Month return: return from most recent competencia
      const lastMonthData = allAssetData.find(item => item.period === mostRecentCompetencia)
      const monthReturn = lastMonthData 
        ? calculateAdjustedReturn(lastMonthData, mostRecentCompetencia, adjustReturnWithFX)
        : 0
      
      // Year return: compound return for the year of most recent competencia
      const lastYear = mostRecentCompetencia.split('/')[1]
      const yearData = allAssetData.filter(item => item.period && item.period.endsWith(`/${lastYear}`))
      const sortedYearData = yearData.sort((a, b) => {
        if (!a.period || !b.period) return 0
        return a.period.localeCompare(b.period)
      })
      
      const yearMonthlyReturns = sortedYearData.map(item => {
        return calculateAdjustedReturn(item, item.period || '', adjustReturnWithFX)
      })
      const yearReturn = calculateCompoundReturn(yearMonthlyReturns)
      
      // Inception return: compound return since first competencia
      const sortedAllData = allAssetData
        .filter(item => item.period)
        .sort((a, b) => {
          if (!a.period || !b.period) return 0
          return a.period.localeCompare(b.period)
        })
      
      const inceptionMonthlyReturns = sortedAllData.map(item => {
        return calculateAdjustedReturn(item, item.period || '', adjustReturnWithFX)
      })
      const inceptionReturn = calculateCompoundReturn(inceptionMonthlyReturns)
      
      returns.set(assetName, { monthReturn, yearReturn, inceptionReturn })
    })
    
    return returns
  }, [performanceData, adjustReturnWithFX])

  const finalPeriodData = getMostRecentData(performanceData)

  // Calculate total patrimonio for allocation percentage
  const totalPatrimonio = useMemo(() => {
    return finalPeriodData.reduce((sum, item) => {
      const originalCurrency = normalizeCurrency(item.currency)
      return sum + convertValue(item.position || 0, item.period || '', originalCurrency)
    }, 0)
  }, [finalPeriodData, convertValue])

  const { t, i18n } = useTranslation()
  const currentLocale: 'pt-BR' | 'en-US' = i18n.language === 'en-US' ? 'en-US' : 'pt-BR'
  const assetReturnsCopy = useMemo<AssetReturnsTableCopy>(() => ({
    title: t(`${ASSET_RETURNS_I18N_PATH}.title`),
    columnsButton: t(`${ASSET_RETURNS_I18N_PATH}.columnsButton`),
    dropdownLabel: t(`${ASSET_RETURNS_I18N_PATH}.dropdownLabel`),
    columns: {
      asset: t(`${ASSET_RETURNS_I18N_PATH}.columns.asset`),
      allocation: t(`${ASSET_RETURNS_I18N_PATH}.columns.allocation`),
      grossBalance: t(`${ASSET_RETURNS_I18N_PATH}.columns.grossBalance`),
      month: t(`${ASSET_RETURNS_I18N_PATH}.columns.month`),
      year: t(`${ASSET_RETURNS_I18N_PATH}.columns.year`),
      inception: t(`${ASSET_RETURNS_I18N_PATH}.columns.inception`),
      issuer: t(`${ASSET_RETURNS_I18N_PATH}.columns.issuer`),
      institution: t(`${ASSET_RETURNS_I18N_PATH}.columns.institution`),
      accountName: t(`${ASSET_RETURNS_I18N_PATH}.columns.accountName`),
      maturity: t(`${ASSET_RETURNS_I18N_PATH}.columns.maturity`),
      currency: t(`${ASSET_RETURNS_I18N_PATH}.columns.currency`),
    },
    summary: {
      balance: t(`${ASSET_RETURNS_I18N_PATH}.summary.balance`),
      rentability: t(`${ASSET_RETURNS_I18N_PATH}.summary.rentability`),
      rentabilityShort: t(`${ASSET_RETURNS_I18N_PATH}.summary.rentabilityShort`)
    }
  }), [t])

  /**
   * Traduz uma chave de estratégia agrupada usando i18n
   * Todas as traduções estão em portfolioPerformance.common.*
   */
  const translateGroupedStrategyMemo = useCallback((key: GroupedStrategyKey): string => {
    return translateGroupedStrategy(key, t)
  }, [t])

  /**
   * Agrupa e traduz o nome de uma estratégia
   */
  const groupStrategy = useCallback((strategy: string | null): string => {
    const groupedKey = groupStrategyName(strategy)
    return translateGroupedStrategyMemo(groupedKey)
  }, [translateGroupedStrategyMemo])

  /**
   * Obtém a ordem de uma estratégia traduzida
   */
  const getStrategyOrderForName = useCallback((strategyName: string): number => {
    for (const key of STRATEGY_ORDER) {
      if (t(`portfolioPerformance.common.${key}`) === strategyName) {
        return getStrategyOrder(key)
      }
    }
    return STRATEGY_ORDER.length // Put unknown strategies at the end
  }, [t])

  /**
   * Obtém a cor de uma estratégia traduzida
   */
  const getStrategyColorForName = useCallback((strategyName: string): string => {
    for (const key of STRATEGY_ORDER) {
      if (t(`portfolioPerformance.common.${key}`) === strategyName) {
        return getStrategyColor(key, true) // Use soft colors for this component
      }
    }
    return getStrategyColor('others', true)
  }, [t])

  // Group data by strategy
  const groupedData = useMemo(() => {
    return finalPeriodData.reduce((acc, item) => {
      const originalStrategy = item.asset_class || "Outros"
      const groupedStrategy = groupStrategy(originalStrategy)
      
      if (!acc[groupedStrategy]) {
        acc[groupedStrategy] = []
      }
      acc[groupedStrategy].push(item)
      return acc
    }, {} as Record<string, PerformanceData[]>)
  }, [finalPeriodData, groupStrategy])

  // Calculate returns for strategies
  const calculateStrategyReturns = useCallback((strategy: string) => {
    const allStrategyData = performanceData.filter(item => 
      groupStrategy(item.asset_class || "Outros") === strategy
    )
    
    if (allStrategyData.length === 0) return { monthReturn: 0, yearReturn: 0, inceptionReturn: 0 }
    
    // Find the most recent competencia
    const mostRecentCompetencia = allStrategyData
      .filter(item => item.period)
      .reduce((latest, current) => {
        if (!latest.period || !current.period) return latest
        const latestDate = competenciaToDate(latest.period)
        const currentDate = competenciaToDate(current.period)
        return currentDate > latestDate ? current : latest
      }).period
    
    if (!mostRecentCompetencia) return { monthReturn: 0, yearReturn: 0, inceptionReturn: 0 }
    
    // Get only assets from the most recent competencia for monthly return calculation
    const lastMonthAssets = allStrategyData.filter(item => item.period === mostRecentCompetencia)
    
    // Calculate weighted return with FX adjustments
    const { weightedReturn: lastMonthWeightedReturn, totalPosition: lastMonthTotalPosition } = 
      calculateWeightedReturnForPeriod(lastMonthAssets, mostRecentCompetencia, convertValue, adjustReturnWithFX)
    
    // Calculate return: if total position is zero, return 0 (all assets have zero position)
    // Otherwise, calculate weighted average excluding Caixa, Proventos, and Cash
    const monthReturn = lastMonthTotalPosition > 0 
      ? ensureValidNumber(lastMonthWeightedReturn / lastMonthTotalPosition) 
      : 0
    
    // Group by competencia for year and inception calculations
    const competenciaGroups = allStrategyData.reduce((acc, item) => {
      if (!item.period) return acc
      if (!acc[item.period]) {
        acc[item.period] = []
      }
      acc[item.period].push(item)
      return acc
    }, {} as Record<string, PerformanceData[]>)
    
    const sortedCompetencias = Object.keys(competenciaGroups).sort()
    
    if (sortedCompetencias.length === 0) return { monthReturn, yearReturn: 0, inceptionReturn: 0 }
    
    // Year return: compound return for the year of the most recent competencia
    const lastYear = mostRecentCompetencia.split('/')[1]
    const yearCompetenciasInFilter = sortedCompetencias.filter(comp => comp.endsWith(`/${lastYear}`))
    
      const yearReturns = yearCompetenciasInFilter.map(competencia => {
        const competenciaAssets = competenciaGroups[competencia]
        const { weightedReturn, totalPosition } = 
          calculateWeightedReturnForPeriod(competenciaAssets, competencia, convertValue, adjustReturnWithFX)
        
        // Calculate return: if total position is zero, return 0 (all assets have zero position)
        // Otherwise, calculate weighted average excluding Caixa, Proventos, and Cash
        return totalPosition > 0 
          ? ensureValidNumber(weightedReturn / totalPosition) 
          : 0
      })
    const yearReturn = calculateCompoundReturn(yearReturns)
    
    // Inception return: compound return for all competencias
      const monthlyReturns = sortedCompetencias.map(competencia => {
        const competenciaAssets = competenciaGroups[competencia]
        const { weightedReturn, totalPosition } = 
          calculateWeightedReturnForPeriod(competenciaAssets, competencia, convertValue, adjustReturnWithFX)
        
        // Calculate return: if total position is zero, return 0 (all assets have zero position)
        // Otherwise, calculate weighted average excluding Caixa, Proventos, and Cash
        return totalPosition > 0 
          ? ensureValidNumber(weightedReturn / totalPosition) 
          : 0
      })
    const inceptionReturn = calculateCompoundReturn(monthlyReturns)
    
    return { monthReturn, yearReturn, inceptionReturn }
  }, [performanceData, convertValue, adjustReturnWithFX, groupStrategy])


  const toggleStrategy = (strategy: string) => {
    const newExpanded = new Set(expandedStrategies)
    if (newExpanded.has(strategy)) {
      newExpanded.delete(strategy)
    } else {
      newExpanded.add(strategy)
    }
    setExpandedStrategies(newExpanded)
  }

  // Calculate totals for each strategy
  const strategyTotals = useMemo(() => {
    return Object.entries(groupedData).map(([strategy, assets]) => {
      const totalPosition = assets.reduce((sum, asset) => {
        const moedaOriginal = normalizeCurrency(asset.currency)
        const posicaoConvertida = convertValue(asset.position || 0, asset.period || '', moedaOriginal)
        return sum + posicaoConvertida
      }, 0)
      const returns = calculateStrategyReturns(strategy)
      
      // Get unique periods for this strategy to calculate benchmark
      const strategyPeriods = [...new Set(
        performanceData
          .filter(p => groupStrategy(p.asset_class || null) === strategy)
          .map(p => p.period)
          .filter(Boolean) as string[]
      )]
      
      // Get the first asset's original class to calculate benchmark
      const firstAssetClass = assets
        .map(p => p.asset_class)
        .find(Boolean) || null
      
      // Determine locale based on the currency
      const benchmarkLocale: 'pt-BR' | 'en-US' = currency === 'BRL' ? 'pt-BR' : 'en-US'
      
      // Calculate benchmark returns directly from asset class if it's a standardized key
      // Otherwise fallback to grouped key (for backward compatibility)
      const benchmark = firstAssetClass && isValidAssetClass(firstAssetClass)
        ? calculateBenchmarkReturnsByAssetClass(
            firstAssetClass as ValidAssetClass,
            currency,
            strategyPeriods,
            benchmarkLocale
          )
        : null
      
      return {
        strategy,
        assets,
        totalPosition,
        monthReturn: returns.monthReturn,
        yearReturn: returns.yearReturn,
        inceptionReturn: returns.inceptionReturn,
        percentage: totalPatrimonio > 0 ? (totalPosition / totalPatrimonio) * 100 : 0,
        benchmark
      }
    }).sort((a, b) => {
      const indexA = getStrategyOrderForName(a.strategy)
      const indexB = getStrategyOrderForName(b.strategy)
      
      // If both strategies are in the order array, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      // If only one is in the array, prioritize it
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      // If neither is in the array, maintain original order
      return 0
    })
  }, [groupedData, totalPatrimonio, calculateStrategyReturns, convertValue, getStrategyOrderForName, performanceData, groupStrategy, currency])

  if (performanceData.length === 0) {
    return null
  }
  
  return (
    <Card className="bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {assetReturnsCopy.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="h-4 w-4" />
                {assetReturnsCopy.columnsButton}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-sm border-border shadow-lg z-50">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {assetReturnsCopy.dropdownLabel}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={visibleColumns.allocation}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, allocation: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.allocation}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.grossBalance}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, grossBalance: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.grossBalance}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.month}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, month: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.month}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.year}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, year: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.year}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.inception}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, inception: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.inception}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.issuer}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, issuer: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.issuer}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.institution}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, institution: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.institution}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.accountName}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, accountName: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.accountName}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.maturity}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, maturity: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.maturity}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.currency}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, currency: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                {assetReturnsCopy.columns.currency}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {strategyTotals.map(({ strategy, assets, totalPosition, monthReturn, yearReturn, inceptionReturn, percentage, benchmark }) => {
            const isExpanded = expandedStrategies.has(strategy)
            const strategyColor = getStrategyColorForName(strategy)
            
            return (
              <Collapsible key={strategy} open={isExpanded} onOpenChange={() => toggleStrategy(strategy)}>
                <div className="border border-border/50 rounded-lg overflow-hidden bg-card/50">
                  {/* Strategy Header */}
                  <CollapsibleTrigger asChild>
                    <div 
                      className="p-4 cursor-pointer hover:bg-muted/30 transition-colors border-l-4" 
                      style={{ borderLeftColor: strategyColor }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: strategyColor }}
                            ></div>
                            <span className="font-semibold text-foreground text-lg">{strategy}</span>
                            <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center text-xs font-bold text-muted-foreground">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{assetReturnsCopy.summary.balance}</div>
                            <div className="font-semibold text-foreground">{formatCurrency(totalPosition)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{assetReturnsCopy.summary.rentability}</div>
                            <div className={`font-semibold ${monthReturn >= 0 ? "text-success" : "text-destructive"}`}>
                              {monthReturn >= 0 ? "+" : ""}{(monthReturn * 100).toFixed(2)}%
                            </div>
                          </div>
                          <div className="ml-2">
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  {/* Assets List */}
                  <CollapsibleContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="border-t border-border/50 bg-muted/10">
                      {/* Scroll Container */}
                      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                        <div className="min-w-max">
                          {/* Table Header */}
                          <div className={`grid gap-4 p-3 border-b border-border/30 bg-muted/20 text-xs font-medium text-muted-foreground`} style={{ gridTemplateColumns: getGridTemplateColumns() }}>
                            <div className="text-left">{assetReturnsCopy.columns.asset}</div>
                            {visibleColumns.allocation && <div className="text-right">{assetReturnsCopy.columns.allocation}</div>}
                            {visibleColumns.grossBalance && <div className="text-right">{assetReturnsCopy.columns.grossBalance}</div>}
                            {visibleColumns.month && <div className="text-center">{assetReturnsCopy.columns.month}</div>}
                            {visibleColumns.year && <div className="text-center">{assetReturnsCopy.columns.year}</div>}
                            {visibleColumns.inception && <div className="text-center">{assetReturnsCopy.columns.inception}</div>}
                            {visibleColumns.issuer && <div className="text-left">{assetReturnsCopy.columns.issuer}</div>}
                            {visibleColumns.institution && <div className="text-left">{assetReturnsCopy.columns.institution}</div>}
                            {visibleColumns.accountName && <div className="text-left">{assetReturnsCopy.columns.accountName}</div>}
                            {visibleColumns.maturity && <div className="text-center">{assetReturnsCopy.columns.maturity}</div>}
                            {visibleColumns.currency && <div className="text-center">{assetReturnsCopy.columns.currency}</div>}
                          </div>
                          
                          {/* Strategy Summary Row */}
                          <div className={`grid gap-4 p-3 border-b border-border/30 bg-muted/30 text-sm font-semibold`} style={{ gridTemplateColumns: getGridTemplateColumns() }}>
                            <div className="text-left text-foreground">{strategy}</div>
                            {visibleColumns.allocation && <div className="text-right text-foreground">{percentage.toFixed(2)}%</div>}
                            {visibleColumns.grossBalance && <div className="text-right text-foreground">{formatCurrency(totalPosition)}</div>}
                            {visibleColumns.month && <div className="text-center">
                              <div className="text-xs text-muted-foreground">{assetReturnsCopy.summary.rentabilityShort}</div>
                              <div className={`font-medium ${monthReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                {monthReturn >= 0 ? "+" : ""}{(monthReturn * 100).toFixed(2)}%
                              </div>
                            </div>}
                            {visibleColumns.year && <div className="text-center">
                              <div className="text-xs text-muted-foreground">{assetReturnsCopy.summary.rentabilityShort}</div>
                              <div className={`font-medium ${yearReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                {yearReturn >= 0 ? "+" : ""}{(yearReturn * 100).toFixed(2)}%
                              </div>
                            </div>}
                            {visibleColumns.inception && <div className="text-center">
                              <div className="text-xs text-muted-foreground">{assetReturnsCopy.summary.rentabilityShort}</div>
                              <div className={`font-medium ${inceptionReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                {inceptionReturn >= 0 ? "+" : ""}{(inceptionReturn * 100).toFixed(2)}%
                              </div>
                            </div>}
                            {visibleColumns.issuer && <div className="text-left text-foreground">-</div>}
                            {visibleColumns.institution && <div className="text-left text-foreground">-</div>}
                            {visibleColumns.accountName && <div className="text-left text-foreground">-</div>}
                            {visibleColumns.maturity && <div className="text-center text-foreground">-</div>}
                            {visibleColumns.currency && <div className="text-center text-foreground">-</div>}
                          </div>

                          {/* Benchmark Row */}
                          <div className={`grid gap-4 p-3 border-b border-border/30 bg-muted/10 text-sm`} style={{ gridTemplateColumns: getGridTemplateColumns() }}>
                            <div className="text-left text-muted-foreground">
                              {benchmark 
                                ? (() => {
                                    const prefix = benchmark.benchmarkType === 'CDI' ? '%' : '±'
                                    const translatedName = t(benchmark.nameKey)
                                    return `${prefix} ${translatedName}`
                                  })()
                                : '-'}
                            </div>
                            {visibleColumns.allocation && <div className="text-right text-muted-foreground">-</div>}
                            {visibleColumns.grossBalance && <div className="text-right text-muted-foreground">-</div>}
                            {visibleColumns.month && <div className="text-center text-muted-foreground">
                              {benchmark && benchmark.monthReturn !== null ? (
                                <span className="text-foreground">
                                  {benchmark.monthReturn >= 0 ? '+' : ''}{benchmark.monthReturn.toFixed(2)}%
                                </span>
                              ) : '-'}
                            </div>}
                            {visibleColumns.year && <div className="text-center text-muted-foreground">
                              {benchmark && benchmark.yearReturn !== null ? (
                                <span className="text-foreground">
                                  {benchmark.yearReturn >= 0 ? '+' : ''}{benchmark.yearReturn.toFixed(2)}%
                                </span>
                              ) : '-'}
                            </div>}
                            {visibleColumns.inception && <div className="text-center text-muted-foreground">
                              {benchmark && benchmark.inceptionReturn !== null ? (
                                <span className="text-foreground">
                                  {benchmark.inceptionReturn >= 0 ? '+' : ''}{benchmark.inceptionReturn.toFixed(2)}%
                                </span>
                              ) : '-'}
                            </div>}
                            {visibleColumns.issuer && <div className="text-left text-muted-foreground">-</div>}
                            {visibleColumns.institution && <div className="text-left text-muted-foreground">-</div>}
                            {visibleColumns.accountName && <div className="text-left text-muted-foreground">-</div>}
                            {visibleColumns.maturity && <div className="text-center text-muted-foreground">-</div>}
                            {visibleColumns.currency && <div className="text-center text-muted-foreground">-</div>}
                          </div>

                          {/* Individual Assets */}
                          {assets.map((item, index) => {
                            const assetReturns = precomputedAssetReturns.get(item.asset || '') || { monthReturn: 0, yearReturn: 0, inceptionReturn: 0 }
                            return (
                              <div key={item.id}>
                                <div className={`grid gap-4 p-3 hover:bg-muted/20 transition-colors text-sm`} style={{ gridTemplateColumns: getGridTemplateColumns() }}>
                                  <div className="text-left">
                                    <div className="font-medium text-foreground text-xs">{item.asset || "-"}</div>
                                  </div>
                                  {visibleColumns.allocation && <div className="text-right text-foreground text-xs">
                                    {totalPatrimonio > 0 ? (() => {
                                      const originalCurrency = normalizeCurrency(item.currency)
                                      const posicaoConvertida = convertValue(item.position || 0, item.period || '', originalCurrency)
                                      return `${((posicaoConvertida / totalPatrimonio) * 100).toFixed(2)}%`
                                    })() : "-"}
                                  </div>}
                                  {visibleColumns.grossBalance && <div className="text-right text-foreground">
                                    {(() => {
                                      const originalCurrency = normalizeCurrency(item.currency)
                                      const posicaoConvertida = convertValue(item.position || 0, item.period || '', originalCurrency)
                                      return formatCurrency(posicaoConvertida)
                                    })()}
                                  </div>}
                                  {visibleColumns.month && <div className="text-center">
                                    <div className={`font-medium ${assetReturns.monthReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                      {assetReturns.monthReturn >= 0 ? "+" : ""}{(assetReturns.monthReturn * 100).toFixed(2)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">-</div>
                                  </div>}
                                  {visibleColumns.year && <div className="text-center">
                                    <div className={`font-medium ${assetReturns.yearReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                      {assetReturns.yearReturn >= 0 ? "+" : ""}{(assetReturns.yearReturn * 100).toFixed(2)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">-</div>
                                  </div>}
                                  {visibleColumns.inception && <div className="text-center">
                                    <div className={`font-medium ${assetReturns.inceptionReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                      {assetReturns.inceptionReturn >= 0 ? "+" : ""}{(assetReturns.inceptionReturn * 100).toFixed(2)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">-</div>
                                  </div>}
                                  {visibleColumns.issuer && <div className="text-left text-foreground text-xs">{item.issuer || "-"}</div>}
                                  {visibleColumns.institution && <div className="text-left text-foreground text-xs">{item.institution || "-"}</div>}
                                  {visibleColumns.accountName && <div className="text-left text-foreground text-xs">{item.account_name || "-"}</div>}
                                  {visibleColumns.maturity && <div className="text-center text-foreground text-xs">
                                    {item.maturity_date ? new Date(item.maturity_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "-"}
                                  </div>}
                                  {visibleColumns.currency && <div className="text-center text-foreground text-xs">
                                    {normalizeCurrency(item.currency) === 'USD' ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                        USD
                                      </span>
                                    ) : item.currency === 'BRL' || item.currency === 'Real' ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        BRL
                                      </span>
                                    ) : '-'}
                                  </div>}
                                </div>
                                {index < assets.length - 1 && (
                                  <div className="border-b border-border/20"></div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

