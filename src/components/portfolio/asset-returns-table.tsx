import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Target, Settings2, ChevronRight, ChevronDown } from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { 
  groupStrategyName, 
  getStrategyColor,
  getStrategyOrder,
  STRATEGY_ORDER,
  type GroupedStrategyKey 
} from "@/utils/benchmark-calculator"
import type { PerformanceData } from "@/types/financial"
import { useCurrency } from "@/contexts/CurrencyContext"

interface AssetReturnsTableProps {
  performanceData: PerformanceData[]
}


export function AssetReturnsTable({ performanceData }: AssetReturnsTableProps) {
  const { convertValue, adjustReturnWithFX, formatCurrency } = useCurrency()
  const [expandedStrategies, setExpandedStrategies] = useState<Set<string>>(new Set())
  const [visibleColumns, setVisibleColumns] = useState({
    alocacao: true,
    saldoBruto: true,
    mes: true,
    ano: true,
    inicio: true,
    emissor: true,
    instituicao: true,
    nomeConta: true,
    vencimento: true,
    moedaOrigem: true
  })

  // Helper function to generate grid template columns based on visible columns
  const getGridTemplateColumns = () => {
    const columns = ['minmax(180px, 1fr)'] // Ativo - flexível com mínimo de 180px
    
    if (visibleColumns.alocacao) columns.push('110px')      // Alocação % - fixo
    if (visibleColumns.saldoBruto) columns.push('130px')    // Saldo Bruto - fixo
    if (visibleColumns.mes) columns.push('75px')            // Mês % - fixo
    if (visibleColumns.ano) columns.push('75px')             // Ano % - fixo
    if (visibleColumns.inicio) columns.push('75px')          // Início % - fixo
    if (visibleColumns.emissor) columns.push('140px')        // Emissor - fixo
    if (visibleColumns.instituicao) columns.push('130px')    // Instituição - fixo
    if (visibleColumns.nomeConta) columns.push('140px')     // Nome da Conta - fixo
    if (visibleColumns.vencimento) columns.push('95px')     // Vencimento - fixo
    if (visibleColumns.moedaOrigem) columns.push('90px')     // Moeda - fixo
    
    return columns.join(' ')
  }

  // Helper function to convert competencia to Date
  const competenciaToDate = (competencia: string): Date => {
    const [month, year] = competencia.split('/').map(Number)
    return new Date(year, month - 1)
  }

  // Helper function to safely parse a number
  const safeParseFloat = (value: string | null | undefined): number => {
    if (!value) return 0
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }

  // Helper function to ensure a number is valid (not NaN or Infinity)
  const ensureValidNumber = (value: number): number => {
    if (isNaN(value) || !isFinite(value)) return 0
    return value
  }

  // Helper function to calculate compound return
  const calculateCompoundReturn = useCallback((returns: number[]): number => {
    if (returns.length === 0) return 0
    const result = returns.reduce((acc, r) => {
      const validR = ensureValidNumber(r)
      return (1 + acc) * (1 + validR) - 1
    }, 0)
    return ensureValidNumber(result)
  }, [])

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
      const originalCurrency = (lastMonthData?.currency === 'USD' || lastMonthData?.currency === 'Dolar') ? 'USD' : 'BRL'
      let monthReturn = 0
      if (lastMonthData && lastMonthData.rate) {
        const rateValue = safeParseFloat(lastMonthData.rate) / 100
        monthReturn = ensureValidNumber(adjustReturnWithFX(rateValue, mostRecentCompetencia, originalCurrency))
      }
      
      // Year return: compound return for the year of most recent competencia
      const lastYear = mostRecentCompetencia.split('/')[1]
      const yearData = allAssetData.filter(item => item.period && item.period.endsWith(`/${lastYear}`))
      const sortedYearData = yearData.sort((a, b) => {
        if (!a.period || !b.period) return 0
        return a.period.localeCompare(b.period)
      })
      
      const yearMonthlyReturns = sortedYearData.map(item => {
        const moeda = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
        if (!item.rate) return 0
        const rateValue = safeParseFloat(item.rate) / 100
        return ensureValidNumber(adjustReturnWithFX(rateValue, item.period || '', moeda))
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
        const moeda = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
        if (!item.rate) return 0
        const rateValue = safeParseFloat(item.rate) / 100
        return ensureValidNumber(adjustReturnWithFX(rateValue, item.period || '', moeda))
      })
      const inceptionReturn = calculateCompoundReturn(inceptionMonthlyReturns)
      
      returns.set(assetName, { monthReturn, yearReturn, inceptionReturn })
    })
    
    return returns
  }, [performanceData, adjustReturnWithFX, calculateCompoundReturn])

  // Get most recent data
  const getMostRecentData = (data: PerformanceData[]) => {
    if (data.length === 0) return []
    
    const mostRecentPeriod = data
      .filter(item => item.period)
      .reduce((latest, current) => {
        if (!latest.period || !current.period) return latest
        const latestDate = competenciaToDate(latest.period)
        const currentDate = competenciaToDate(current.period)
        return currentDate > latestDate ? current : latest
      }).period
    
    if (!mostRecentPeriod) return []
    
    return data.filter(item => item.period === mostRecentPeriod)
  }

  const finalPeriodData = getMostRecentData(performanceData)

  // Calculate total patrimonio for allocation percentage
  const totalPatrimonio = useMemo(() => {
    return finalPeriodData.reduce((sum, item) => {
      const originalCurrency = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
      return sum + convertValue(item.position || 0, item.period || '', originalCurrency)
    }, 0)
  }, [finalPeriodData, convertValue])

  const { t } = useTranslation()

  /**
   * Traduz uma chave de estratégia agrupada usando i18n
   */
  const translateGroupedStrategy = useCallback((key: GroupedStrategyKey): string => {
    const strategiesOrder = 'portfolioPerformance.kpi.diversificationDialog.strategiesOrder'
    return t(`${strategiesOrder}.${key}`)
  }, [t])

  /**
   * Agrupa e traduz o nome de uma estratégia
   */
  const groupStrategy = useCallback((strategy: string | null): string => {
    const groupedKey = groupStrategyName(strategy)
    return translateGroupedStrategy(groupedKey)
  }, [translateGroupedStrategy])

  /**
   * Obtém a ordem de uma estratégia traduzida
   */
  const getStrategyOrderForName = useCallback((strategyName: string): number => {
    const strategiesOrder = 'portfolioPerformance.kpi.diversificationDialog.strategiesOrder'
    for (const key of STRATEGY_ORDER) {
      if (t(`${strategiesOrder}.${key}`) === strategyName) {
        return getStrategyOrder(key)
      }
    }
    return STRATEGY_ORDER.length // Put unknown strategies at the end
  }, [t])

  /**
   * Obtém a cor de uma estratégia traduzida
   */
  const getStrategyColorForName = useCallback((strategyName: string): string => {
    const strategiesOrder = 'portfolioPerformance.kpi.diversificationDialog.strategiesOrder'
    for (const key of STRATEGY_ORDER) {
      if (t(`${strategiesOrder}.${key}`) === strategyName) {
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
      const lastMonthWeightedReturn = lastMonthAssets.reduce((sum, asset) => {
        const moedaOriginal = (asset.currency === 'USD' || asset.currency === 'Dolar') ? 'USD' : 'BRL'
        const posicaoConvertida = ensureValidNumber(convertValue(asset.position || 0, mostRecentCompetencia, moedaOriginal))
        let rendimentoAjustado = 0
        if (asset.rate) {
          const rateValue = safeParseFloat(asset.rate) / 100
          rendimentoAjustado = ensureValidNumber(adjustReturnWithFX(rateValue, mostRecentCompetencia, moedaOriginal))
        }
        return sum + (rendimentoAjustado * posicaoConvertida)
      }, 0)
      
      const lastMonthTotalPosition = lastMonthAssets.reduce((sum, asset) => {
        const moedaOriginal = (asset.currency === 'USD' || asset.currency === 'Dolar') ? 'USD' : 'BRL'
        return sum + ensureValidNumber(convertValue(asset.position || 0, mostRecentCompetencia, moedaOriginal))
      }, 0)
      
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
        
        const weightedReturn = competenciaAssets.reduce((sum, asset) => {
          const moedaOriginal = (asset.currency === 'USD' || asset.currency === 'Dolar') ? 'USD' : 'BRL'
          const posicaoConvertida = ensureValidNumber(convertValue(asset.position || 0, competencia, moedaOriginal))
          let rendimentoAjustado = 0
          if (asset.rate) {
            const rateValue = safeParseFloat(asset.rate) / 100
            rendimentoAjustado = ensureValidNumber(adjustReturnWithFX(rateValue, competencia, moedaOriginal))
          }
          return sum + (rendimentoAjustado * posicaoConvertida)
        }, 0)
        
        const totalPosition = competenciaAssets.reduce((sum, asset) => {
          const moedaOriginal = (asset.currency === 'USD' || asset.currency === 'Dolar') ? 'USD' : 'BRL'
          return sum + ensureValidNumber(convertValue(asset.position || 0, competencia, moedaOriginal))
        }, 0)
        
        return totalPosition > 0 
          ? ensureValidNumber(weightedReturn / totalPosition) 
          : 0
      })
    const yearReturn = calculateCompoundReturn(yearReturns)
    
    // Inception return: compound return for all competencias
      const monthlyReturns = sortedCompetencias.map(competencia => {
        const competenciaAssets = competenciaGroups[competencia]
        
        const weightedReturn = competenciaAssets.reduce((sum, asset) => {
          const moedaOriginal = (asset.currency === 'USD' || asset.currency === 'Dolar') ? 'USD' : 'BRL'
          const posicaoConvertida = ensureValidNumber(convertValue(asset.position || 0, competencia, moedaOriginal))
          let rendimentoAjustado = 0
          if (asset.rate) {
            const rateValue = safeParseFloat(asset.rate) / 100
            rendimentoAjustado = ensureValidNumber(adjustReturnWithFX(rateValue, competencia, moedaOriginal))
          }
          return sum + (rendimentoAjustado * posicaoConvertida)
        }, 0)
        
        const totalPosition = competenciaAssets.reduce((sum, asset) => {
          const moedaOriginal = (asset.currency === 'USD' || asset.currency === 'Dolar') ? 'USD' : 'BRL'
          return sum + ensureValidNumber(convertValue(asset.position || 0, competencia, moedaOriginal))
        }, 0)
        
        return totalPosition > 0 
          ? ensureValidNumber(weightedReturn / totalPosition) 
          : 0
      })
    const inceptionReturn = calculateCompoundReturn(monthlyReturns)
    
    return { monthReturn, yearReturn, inceptionReturn }
  }, [performanceData, convertValue, adjustReturnWithFX, calculateCompoundReturn, groupStrategy])


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
        const moedaOriginal = (asset.currency === 'USD' || asset.currency === 'Dolar') ? 'USD' : 'BRL'
        const posicaoConvertida = convertValue(asset.position || 0, asset.period || '', moedaOriginal)
        return sum + posicaoConvertida
      }, 0)
      const returns = calculateStrategyReturns(strategy)
      
      return {
        strategy,
        assets,
        totalPosition,
        monthReturn: returns.monthReturn,
        yearReturn: returns.yearReturn,
        inceptionReturn: returns.inceptionReturn,
        percentage: totalPatrimonio > 0 ? (totalPosition / totalPatrimonio) * 100 : 0
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
  }, [groupedData, totalPatrimonio, calculateStrategyReturns, convertValue, getStrategyOrderForName])

  if (performanceData.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Retorno por Ativo
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="h-4 w-4" />
                Colunas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-sm border-border shadow-lg z-50">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Exibir Colunas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={visibleColumns.alocacao}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, alocacao: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Alocação / Qtd.
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.saldoBruto}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, saldoBruto: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Saldo Bruto
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.mes}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, mes: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Mês
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.ano}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, ano: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Ano
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.inicio}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, inicio: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Início
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.emissor}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, emissor: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Emissor
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.instituicao}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, instituicao: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Instituição
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.nomeConta}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, nomeConta: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Nome da Conta
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.vencimento}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, vencimento: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Vencimento
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.moedaOrigem}
                onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, moedaOrigem: checked }))}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                Moeda Origem
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {strategyTotals.map(({ strategy, assets, totalPosition, monthReturn, yearReturn, inceptionReturn, percentage }) => {
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
                            <div className="text-sm text-muted-foreground">Saldo</div>
                            <div className="font-semibold text-foreground">{formatCurrency(totalPosition)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Rentabilidade</div>
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
                            <div className="text-left">Ativo</div>
                            {visibleColumns.alocacao && <div className="text-right">Alocação / Qtd.</div>}
                            {visibleColumns.saldoBruto && <div className="text-right">Saldo Bruto</div>}
                            {visibleColumns.mes && <div className="text-center">Mês</div>}
                            {visibleColumns.ano && <div className="text-center">Ano</div>}
                            {visibleColumns.inicio && <div className="text-center">Início</div>}
                            {visibleColumns.emissor && <div className="text-left">Emissor</div>}
                            {visibleColumns.instituicao && <div className="text-left">Instituição</div>}
                            {visibleColumns.nomeConta && <div className="text-left">Nome da Conta</div>}
                            {visibleColumns.vencimento && <div className="text-center">Vencimento</div>}
                            {visibleColumns.moedaOrigem && <div className="text-center">Moeda Origem</div>}
                          </div>
                          
                          {/* Strategy Summary Row */}
                          <div className={`grid gap-4 p-3 border-b border-border/30 bg-muted/30 text-sm font-semibold`} style={{ gridTemplateColumns: getGridTemplateColumns() }}>
                            <div className="text-left text-foreground">{strategy}</div>
                            {visibleColumns.alocacao && <div className="text-right text-foreground">{percentage.toFixed(2)}%</div>}
                            {visibleColumns.saldoBruto && <div className="text-right text-foreground">{formatCurrency(totalPosition)}</div>}
                            {visibleColumns.mes && <div className="text-center">
                              <div className="text-xs text-muted-foreground">Rent.</div>
                              <div className={`font-medium ${monthReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                {monthReturn >= 0 ? "+" : ""}{(monthReturn * 100).toFixed(2)}%
                              </div>
                            </div>}
                            {visibleColumns.ano && <div className="text-center">
                              <div className="text-xs text-muted-foreground">Rent.</div>
                              <div className={`font-medium ${yearReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                {yearReturn >= 0 ? "+" : ""}{(yearReturn * 100).toFixed(2)}%
                              </div>
                            </div>}
                            {visibleColumns.inicio && <div className="text-center">
                              <div className="text-xs text-muted-foreground">Rent.</div>
                              <div className={`font-medium ${inceptionReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                {inceptionReturn >= 0 ? "+" : ""}{(inceptionReturn * 100).toFixed(2)}%
                              </div>
                            </div>}
                            {visibleColumns.emissor && <div className="text-left text-foreground">-</div>}
                            {visibleColumns.instituicao && <div className="text-left text-foreground">-</div>}
                            {visibleColumns.nomeConta && <div className="text-left text-foreground">-</div>}
                            {visibleColumns.vencimento && <div className="text-center text-foreground">-</div>}
                            {visibleColumns.moedaOrigem && <div className="text-center text-foreground">-</div>}
                          </div>

                          {/* Benchmark Row */}
                          <div className={`grid gap-4 p-3 border-b border-border/30 bg-muted/10 text-sm`} style={{ gridTemplateColumns: getGridTemplateColumns() }}>
                            <div className="text-left text-muted-foreground">
                              {(() => {
                                switch (strategy) {
                                  case 'Pós Fixado - Liquidez':
                                  case 'Pós Fixado':
                                    return '% CDI'
                                  case 'Inflação':
                                    return '± IPCA'
                                  case 'Pré Fixado':
                                    return '± IRF-M'
                                  case 'Multimercado':
                                    return '% CDI'
                                  case 'Imobiliário':
                                    return '± IFIX'
                                  case 'Ações':
                                  case 'Ações - Long Bias':
                                    return '± IBOV'
                                  case 'Private Equity':
                                    return '% CDI'
                                  case 'Exterior - Renda Fixa':
                                    return '± T-Bond'
                                  case 'Exterior - Ações':
                                    return '± S&P500'
                                  case 'COE':
                                    return '% CDI'
                                  case 'Ouro':
                                    return '± Gold'
                                  case 'Criptoativos':
                                    return '± BTC'
                                  default:
                                    return '% CDI'
                                }
                              })()}
                            </div>
                            {visibleColumns.alocacao && <div className="text-right text-muted-foreground">-</div>}
                            {visibleColumns.saldoBruto && <div className="text-right text-muted-foreground">-</div>}
                            {visibleColumns.mes && <div className="text-center text-muted-foreground">-</div>}
                            {visibleColumns.ano && <div className="text-center text-muted-foreground">-</div>}
                            {visibleColumns.inicio && <div className="text-center text-muted-foreground">-</div>}
                            {visibleColumns.emissor && <div className="text-left text-muted-foreground">-</div>}
                            {visibleColumns.instituicao && <div className="text-left text-muted-foreground">-</div>}
                            {visibleColumns.nomeConta && <div className="text-left text-muted-foreground">-</div>}
                            {visibleColumns.vencimento && <div className="text-center text-muted-foreground">-</div>}
                            {visibleColumns.moedaOrigem && <div className="text-center text-muted-foreground">-</div>}
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
                                  {visibleColumns.alocacao && <div className="text-right text-foreground text-xs">
                                    {totalPatrimonio > 0 ? (() => {
                                      const originalCurrency = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
                                      const posicaoConvertida = convertValue(item.position || 0, item.period || '', originalCurrency)
                                      return `${((posicaoConvertida / totalPatrimonio) * 100).toFixed(2)}%`
                                    })() : "-"}
                                  </div>}
                                  {visibleColumns.saldoBruto && <div className="text-right text-foreground">
                                    {(() => {
                                      const originalCurrency = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
                                      const posicaoConvertida = convertValue(item.position || 0, item.period || '', originalCurrency)
                                      return formatCurrency(posicaoConvertida)
                                    })()}
                                  </div>}
                                  {visibleColumns.mes && <div className="text-center">
                                    <div className={`font-medium ${assetReturns.monthReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                      {assetReturns.monthReturn >= 0 ? "+" : ""}{(assetReturns.monthReturn * 100).toFixed(2)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">-</div>
                                  </div>}
                                  {visibleColumns.ano && <div className="text-center">
                                    <div className={`font-medium ${assetReturns.yearReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                      {assetReturns.yearReturn >= 0 ? "+" : ""}{(assetReturns.yearReturn * 100).toFixed(2)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">-</div>
                                  </div>}
                                  {visibleColumns.inicio && <div className="text-center">
                                    <div className={`font-medium ${assetReturns.inceptionReturn >= 0 ? "text-success" : "text-destructive"}`}>
                                      {assetReturns.inceptionReturn >= 0 ? "+" : ""}{(assetReturns.inceptionReturn * 100).toFixed(2)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">-</div>
                                  </div>}
                                  {visibleColumns.emissor && <div className="text-left text-foreground text-xs">{item.issuer || "-"}</div>}
                                  {visibleColumns.instituicao && <div className="text-left text-foreground text-xs">{item.institution || "-"}</div>}
                                  {visibleColumns.nomeConta && <div className="text-left text-foreground text-xs">{item.account_name || "-"}</div>}
                                  {visibleColumns.vencimento && <div className="text-center text-foreground text-xs">
                                    {item.maturity_date ? new Date(item.maturity_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "-"}
                                  </div>}
                                  {visibleColumns.moedaOrigem && <div className="text-center text-foreground text-xs">
                                    {item.currency === 'USD' || item.currency === 'Dolar' ? (
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

