import { useState, useMemo, useCallback } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Calculator as CalculatorIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getBenchmarkMonthlyReturn, type BenchmarkType, getBenchmarkNameKey } from "@/utils/benchmark-calculator"
import type { CurrencyCode } from "@/utils/currency"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"
import i18n from "@/lib/i18n"
import { SelectWithSearch, type SelectOption } from "@/shared/components/ui/select-with-search"
import { shouldExcludeFromReturnCalculation } from "@/utils/portfolio-returns"

interface YieldCalculatorProps {
  /** Valor inicial para cálculo */
  initialValue?: number
  /** Competência (MM/YYYY) */
  period?: string
  /** Instituição do registro sendo editado */
  institution?: string
  /** Nome da conta do registro sendo editado */
  accountName?: string
  /** Moeda para cálculos de benchmark */
  currency?: CurrencyCode
  /** Dados detalhados para cálculo automático */
  detailedData?: PerformanceData[]
  /** Tipo de edição (consolidated ou detailed) */
  editingType?: 'consolidated' | 'detailed'
  /** Callback quando o cálculo é confirmado */
  onConfirm?: (result: YieldCalculationResult) => void
  /** Se o dialog está aberto */
  open?: boolean
  /** Callback quando o dialog é fechado */
  onOpenChange?: (open: boolean) => void
}

export interface YieldCalculationResult {
  /** Rentabilidade mensal em decimal (ex: 0.015 para 1.5%) */
  monthlyYield: number
  /** Valor final calculado */
  finalValue?: number
  /** Ganho financeiro calculado */
  financialGain?: number
  /** Dados adicionais do cálculo */
  metadata?: Record<string, unknown>
}

/**
 * Componente de calculadora de rentabilidade
 * Pode ser facilmente substituído ou estendido com outras calculadoras
 */
export function YieldCalculator({
  initialValue = 0,
  period = '',
  institution = '',
  accountName = '',
  currency = 'BRL',
  detailedData = [],
  editingType = 'consolidated',
  onConfirm,
  open = false,
  onOpenChange
}: YieldCalculatorProps) {
  const { toast } = useToast()
  const [calculationMode, setCalculationMode] = useState<'auto' | 'manual' | 'custom' | 'market'>('auto')
  const [isLoading, setIsLoading] = useState(false)
  
  // Estados para modo Manual
  const [manualPeriod, setManualPeriod] = useState<string>(period)
  const [manualIndexer, setManualIndexer] = useState<'CDI' | 'IPCA' | 'PRE'>('CDI')
  const [manualPercentage, setManualPercentage] = useState<string>('100')
  const [manualOperation, setManualOperation] = useState<'%' | '+'>('%')
  
  // Estados para modo Personalizado
  const [customInitialValue, setCustomInitialValue] = useState<string>(initialValue.toString())
  const [customPeriod, setCustomPeriod] = useState<string>(period)
  const [customIndexer, setCustomIndexer] = useState<'CDI' | 'IPCA' | 'PRE' | 'MANUAL'>('CDI')
  const [customPercentage, setCustomPercentage] = useState<string>('100')
  const [customOperation, setCustomOperation] = useState<'%' | '+'>('%')
  
  // Estados para modo Mercado
  const [marketPeriod, setMarketPeriod] = useState<string>(period)
  const [marketBenchmark, setMarketBenchmark] = useState<BenchmarkType>('CDI')
  const [marketCurrency, setMarketCurrency] = useState<CurrencyCode>(currency)
  const [marketResult, setMarketResult] = useState<{ monthlyReturn: number; benchmarkName: string } | null>(null)
  const [marketError, setMarketError] = useState<string | null>(null)
  
  // Opções para selects
  const manualIndexerOptions: SelectOption[] = [
    { id: 'CDI', label: i18n.t('portfolioPerformance.yieldCalculator.indexers.cdi') },
    { id: 'IPCA', label: i18n.t('portfolioPerformance.yieldCalculator.indexers.ipca') },
    { id: 'PRE', label: i18n.t('portfolioPerformance.yieldCalculator.indexers.preFixed') }
  ]
  
  const customIndexerOptions: SelectOption[] = [
    { id: 'CDI', label: i18n.t('portfolioPerformance.yieldCalculator.indexers.cdi') },
    { id: 'IPCA', label: i18n.t('portfolioPerformance.yieldCalculator.indexers.ipca') },
    { id: 'PRE', label: i18n.t('portfolioPerformance.yieldCalculator.indexers.preFixed') },
    { id: 'MANUAL', label: i18n.t('portfolioPerformance.yieldCalculator.indexers.manual') }
  ]
  
  const marketBenchmarkOptions: SelectOption[] = [
    { id: 'CDI', label: i18n.t('portfolioPerformance.benchmarks.cdi') },
    { id: 'IPCA', label: i18n.t('portfolioPerformance.benchmarks.ipca') },
    { id: 'IBOV', label: i18n.t('portfolioPerformance.benchmarks.ibov') },
    { id: 'SP500', label: i18n.t('portfolioPerformance.benchmarks.sp500') },
    { id: 'IFIX', label: i18n.t('portfolioPerformance.benchmarks.ifix') },
    { id: 'IMA-B', label: i18n.t('portfolioPerformance.benchmarks.imab') },
    { id: 'IHFA', label: i18n.t('portfolioPerformance.benchmarks.ihfa') },
    { id: 'IRF-M', label: i18n.t('portfolioPerformance.benchmarks.irfm') },
    { id: 'Gold', label: i18n.t('portfolioPerformance.benchmarks.gold') },
    { id: 'BTC', label: i18n.t('portfolioPerformance.benchmarks.btc') },
    { id: 'T-Bond', label: i18n.t('portfolioPerformance.benchmarks.tBond') },
    { id: 'AGGG', label: i18n.t('portfolioPerformance.benchmarks.aggg') },
    { id: 'MSCI_ACWI', label: i18n.t('portfolioPerformance.benchmarks.msciAcwi') }
  ]
  
  const currencyOptions: SelectOption[] = [
    { id: 'BRL', label: i18n.t('portfolioPerformance.yieldCalculator.currencies.brl') },
    { id: 'USD', label: i18n.t('portfolioPerformance.yieldCalculator.currencies.usd') }
  ]
  
  // Função auxiliar para calcular rentabilidade mensal baseada em indexador
  const calculateMonthlyYieldFromIndexer = useCallback((
    indexer: 'CDI' | 'IPCA' | 'PRE' | 'MANUAL',
    period: string,
    percentage: number,
    operation: '%' | '+'
  ): number | null => {
    if (indexer === 'MANUAL') {
      // Rentabilidade manual já está em % ao mês, converter para decimal
      // Ex: se usuário digita 1.0, significa 1% ao mês = 0.01
      if (percentage === 0) {
        return null
      }
      return percentage / 100
    }
    
    if (!period) {
      return null
    }
    
    if (indexer === 'CDI') {
      const cdiMonthlyReturn = getBenchmarkMonthlyReturn('CDI', period, 'BRL')
      if (cdiMonthlyReturn === null) {
        return null
      }
      
      if (operation === '%') {
        // Porcentagem do CDI (ex: 80% do CDI)
        return cdiMonthlyReturn * (percentage / 100)
      } else {
        // Spread sobre CDI (ex: CDI + 2% a.a.)
        // Converter spread anual para mensal: (1 + spread_anual)^(1/12) - 1
        const annualSpread = percentage / 100
        const monthlySpread = Math.pow(1 + annualSpread, 1/12) - 1
        return cdiMonthlyReturn + monthlySpread
      }
    }
    
    if (indexer === 'IPCA') {
      const ipcaMonthlyReturn = getBenchmarkMonthlyReturn('IPCA', period, 'BRL')
      if (ipcaMonthlyReturn === null) {
        return null
      }
      
      // IPCA + spread anual (ex: IPCA + 5% a.a.)
      // Converter spread anual para mensal: (1 + spread_anual)^(1/12) - 1
      const annualSpread = percentage / 100
      const monthlySpread = Math.pow(1 + annualSpread, 1/12) - 1
      return ipcaMonthlyReturn + monthlySpread
    }
    
    if (indexer === 'PRE') {
      // Taxa pré-fixada anual (ex: 12% a.a.)
      // Converter taxa anual para mensal: (1 + taxa_anual)^(1/12) - 1
      const annualRate = percentage / 100
      return Math.pow(1 + annualRate, 1/12) - 1
    }
    
    return null
  }, [])
  
  // Cálculo em tempo real para modo Personalizado
  const customCalculationResult = useMemo(() => {
    if (calculationMode !== 'custom') {
      return null
    }
    
    const initial = parseFloat(customInitialValue.replace(',', '.')) || 0
    const percentage = parseFloat(customPercentage.replace(',', '.')) || 0
    
    if (initial === 0) {
      return null
    }
    
    // Validar período se não for MANUAL
    if (customIndexer !== 'MANUAL' && !customPeriod) {
      return null
    }
    
    if (percentage === 0 && customIndexer !== 'MANUAL') {
      return null
    }
    
    // Calcular rentabilidade mensal baseada no indexador
    const monthlyYield = calculateMonthlyYieldFromIndexer(
      customIndexer,
      customPeriod,
      percentage,
      customOperation
    )
    
    if (monthlyYield === null) {
      return null
    }
    
    const finalValue = Math.round((initial * (1 + monthlyYield)) * 100) / 100
    const financialGain = Math.round((initial * monthlyYield) * 100) / 100
    
    return {
      monthlyYield,
      finalValue,
      financialGain,
      percentageValue: monthlyYield * 100
    }
  }, [calculationMode, customInitialValue, customPercentage, customPeriod, customIndexer, customOperation, calculateMonthlyYieldFromIndexer])
  
  // Função para buscar dados do mercado usando benchmark-calculator
  const handleFetchMarketData = async () => {
    if (!marketPeriod) {
      toast({
        title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
        description: i18n.t('portfolioPerformance.yieldCalculator.errors.informPeriod'),
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)
    setMarketError(null)
    setMarketResult(null)
    try {
      // Buscar diretamente pelo BenchmarkType usando a moeda selecionada
      const monthlyReturn = getBenchmarkMonthlyReturn(marketBenchmark, marketPeriod, marketCurrency)
      
      if (monthlyReturn === null) {
        const benchmarkName = getBenchmarkNameKey(marketBenchmark)
        const benchmarkDisplayName = i18n.t(benchmarkName)
        const currencyLabel = marketCurrency === 'BRL' 
          ? i18n.t('portfolioPerformance.yieldCalculator.currencies.brl') 
          : i18n.t('portfolioPerformance.yieldCalculator.currencies.usd')
        const errorMessage = i18n.t('portfolioPerformance.yieldCalculator.market.errorMessage', {
          benchmark: benchmarkDisplayName,
          period: marketPeriod,
          currency: currencyLabel
        })
        
        setMarketError(errorMessage)
        toast({
          title: i18n.t('portfolioPerformance.yieldCalculator.market.errorTitle'),
          description: errorMessage,
          variant: "destructive",
          duration: 8000
        })
        setMarketResult(null)
        return
      }
      
      // Limpar erro se encontrou dados
      setMarketError(null)
      
      const benchmarkName = getBenchmarkNameKey(marketBenchmark)
      
      setMarketResult({
        monthlyReturn,
        benchmarkName
      })
      
      const currencyLabel = marketCurrency === 'BRL' 
        ? i18n.t('portfolioPerformance.yieldCalculator.currencies.brl') 
        : i18n.t('portfolioPerformance.yieldCalculator.currencies.usd')
      toast({
        title: i18n.t('portfolioPerformance.yieldCalculator.success.dataObtained'),
        description: i18n.t('portfolioPerformance.yieldCalculator.success.dataObtainedDescription', {
          benchmark: i18n.t(benchmarkName),
          currency: currencyLabel,
          yield: (monthlyReturn * 100).toFixed(4)
        })
      })
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : i18n.t('portfolioPerformance.yieldCalculator.errors.marketDataError')
      toast({
        title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
        description: errorMessage,
        variant: "destructive"
      })
      setMarketResult(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCalculate = () => {
    try {
      let result: YieldCalculationResult
      
      if (calculationMode === 'market') {
        if (!marketResult) {
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.searchFirst'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.searchFirstDescription'),
            variant: "destructive"
          })
          return
        }
        
        result = {
          monthlyYield: marketResult.monthlyReturn,
          metadata: {
            benchmark: marketBenchmark,
            benchmarkName: marketResult.benchmarkName,
            period: marketPeriod
          }
        }
      } else if (calculationMode === 'manual') {
        // Validar período
        if (!manualPeriod) {
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.informPeriod'),
            variant: "destructive"
          })
          return
        }
        
        const percentage = parseFloat(manualPercentage.replace(',', '.')) || 0
        
        if (percentage === 0) {
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.informValidPercentage'),
            variant: "destructive"
          })
          return
        }
        
        // Calcular rentabilidade mensal baseada no indexador
        const monthlyYield = calculateMonthlyYieldFromIndexer(
          manualIndexer as 'CDI' | 'IPCA' | 'PRE',
          manualPeriod,
          percentage,
          manualOperation
        )
        
        if (monthlyYield === null) {
          const indexerName = manualIndexer === 'CDI' 
            ? i18n.t('portfolioPerformance.yieldCalculator.indexers.cdi')
            : manualIndexer === 'IPCA'
            ? i18n.t('portfolioPerformance.yieldCalculator.indexers.ipca')
            : i18n.t('portfolioPerformance.yieldCalculator.indexers.preFixed')
          
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.indexerDataNotFound', {
              indexer: indexerName,
              period: manualPeriod
            }),
            variant: "destructive"
          })
          return
        }
        
        result = {
          monthlyYield,
          metadata: {
            indexer: manualIndexer,
            percentage,
            operation: manualOperation,
            period: manualPeriod
          }
        }
      } else if (calculationMode === 'custom') {
        const initial = parseFloat(customInitialValue.replace(',', '.')) || 0
        const percentage = parseFloat(customPercentage.replace(',', '.')) || 0
        
        if (initial === 0) {
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.informValidInitialValue'),
            variant: "destructive"
          })
          return
        }
        
        // Validar período se não for MANUAL
        if (customIndexer !== 'MANUAL' && !customPeriod) {
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.informPeriod'),
            variant: "destructive"
          })
          return
        }
        
        if (percentage === 0 && customIndexer !== 'MANUAL') {
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.informValidPercentage'),
            variant: "destructive"
          })
          return
        }
        
        // Calcular rentabilidade mensal baseada no indexador
        const monthlyYield = calculateMonthlyYieldFromIndexer(
          customIndexer,
          customPeriod,
          percentage,
          customOperation
        )
        
        if (monthlyYield === null) {
          const indexerName = customIndexer === 'CDI' 
            ? i18n.t('portfolioPerformance.yieldCalculator.indexers.cdi')
            : customIndexer === 'IPCA'
            ? i18n.t('portfolioPerformance.yieldCalculator.indexers.ipca')
            : customIndexer === 'PRE'
            ? i18n.t('portfolioPerformance.yieldCalculator.indexers.preFixed')
            : i18n.t('portfolioPerformance.yieldCalculator.indexers.manual')
          
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.indexerDataNotFound', {
              indexer: indexerName,
              period: customPeriod || '-'
            }),
            variant: "destructive"
          })
          return
        }
        
        result = {
          monthlyYield,
          finalValue: Math.round((initial * (1 + monthlyYield)) * 100) / 100,
          financialGain: Math.round((initial * monthlyYield) * 100) / 100,
          metadata: {
            indexer: customIndexer,
            percentage,
            operation: customOperation,
            period: customPeriod
          }
        }
      } else if (calculationMode === 'auto') {
        // Modo Automático - calcular rentabilidade ponderada dos ativos vinculados
        if (!period || !institution) {
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.incompleteData'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.incompleteDataDescription'),
            variant: "destructive"
          })
          return
        }
        
        if (editingType === 'detailed') {
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.modeNotAvailable'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.modeNotAvailableDescription'),
            variant: "destructive"
          })
          return
        }
        
        // Buscar ativos detalhados vinculados (mesma competência, instituição e nome da conta)
        // Exclude Caixa, Proventos, and Cash from return calculations
        const linkedAssets = detailedData.filter(asset => 
          asset.period === period &&
          asset.institution === institution &&
          (accountName ? asset.account_name === accountName : true) &&
          !shouldExcludeFromReturnCalculation(asset.asset)
        )
        
        if (linkedAssets.length === 0) {
          const accountText = accountName ? `\n• ${i18n.t('portfolioPerformance.yieldCalculator.auto.account')} ${accountName}` : ''
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.noAssetsFound'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.noAssetsFoundDescription', {
              period,
              institution,
              account: accountText
            }),
            variant: "destructive",
            duration: 6000
          })
          return
        }
        
        // Calcular rentabilidade ponderada
        // Exclude Caixa, Proventos, and Cash assets as they don't contribute to portfolio returns
        let totalPosition = 0
        let weightedYield = 0
        
        linkedAssets.forEach(asset => {
          const position = asset.position || 0
          const yieldValue = typeof asset.yield === 'number' ? asset.yield : 0
          
          totalPosition += position
          weightedYield += position * yieldValue
        })
        
        if (totalPosition === 0) {
          toast({
            title: i18n.t('portfolioPerformance.yieldCalculator.errors.zeroPosition'),
            description: i18n.t('portfolioPerformance.yieldCalculator.errors.zeroPositionDescription', {
              count: linkedAssets.length
            }),
            variant: "destructive",
            duration: 6000
          })
          return
        }
        
        const monthlyYield = weightedYield / totalPosition
        
        // O totalPosition já é a soma das posições finais dos ativos detalhados
        // Usar diretamente como patrimônio final para garantir que bata com a verificação de integridade
        const finalValue = Math.round(totalPosition * 100) / 100
        
        // Calcular ganho financeiro baseado no initial_assets do consolidado (se disponível)
        // ou estimar baseado na rentabilidade
        let financialGain = 0
        if (initialValue > 0) {
          // Se temos o valor inicial do consolidado, calcular o ganho baseado nele
          financialGain = Math.round((finalValue - initialValue) * 100) / 100
        } else if (monthlyYield !== 0 && !isNaN(monthlyYield) && isFinite(monthlyYield)) {
          // Caso contrário, estimar baseado na rentabilidade
          const estimatedInitialPosition = totalPosition / (1 + monthlyYield)
          financialGain = Math.round((totalPosition - estimatedInitialPosition) * 100) / 100
        }
        
        result = {
          monthlyYield,
          finalValue,
          financialGain,
          metadata: {
            mode: 'auto',
            linkedAssetsCount: linkedAssets.length,
            totalPosition,
            period,
            institution,
            accountName
          }
        }
        
        toast({
          title: i18n.t('portfolioPerformance.yieldCalculator.success.autoCalculationDone'),
          description: i18n.t('portfolioPerformance.yieldCalculator.success.autoCalculationDescription', {
            count: linkedAssets.length,
            yield: (monthlyYield * 100).toFixed(4)
          })
        })
      }
      
      if (onConfirm) {
        onConfirm(result)
      }
      
      // Toast detalhado para modo Personalizado
      if (calculationMode === 'custom' && result.metadata) {
        const metadata = result.metadata as {
          indexer: 'CDI' | 'IPCA' | 'PRE' | 'MANUAL'
          percentage: number
          operation: '%' | '+'
          period?: string
        }
        
        const initial = parseFloat(customInitialValue.replace(',', '.')) || 0
        const finalValue = result.finalValue || initial * (1 + result.monthlyYield)
        const financialGain = result.financialGain || initial * result.monthlyYield
        
        // Formatar detalhes do cálculo
        let calculationDetails = ''
        const indexerName = metadata.indexer === 'CDI' 
          ? i18n.t('portfolioPerformance.yieldCalculator.indexers.cdi')
          : metadata.indexer === 'IPCA'
          ? i18n.t('portfolioPerformance.yieldCalculator.indexers.ipca')
          : metadata.indexer === 'PRE'
          ? i18n.t('portfolioPerformance.yieldCalculator.indexers.preFixed')
          : i18n.t('portfolioPerformance.yieldCalculator.indexers.manual')
        
        if (metadata.indexer === 'MANUAL') {
          calculationDetails = `${indexerName} (${metadata.percentage.toFixed(2)}% a.m.) = ${(result.monthlyYield * 100).toFixed(2)}%`
        } else if (metadata.indexer === 'CDI') {
          const cdiMonthlyReturn = metadata.period ? getBenchmarkMonthlyReturn('CDI', metadata.period, 'BRL') : null
          const cdiPercent = cdiMonthlyReturn ? (cdiMonthlyReturn * 100).toFixed(2) : 'N/A'
          
          if (metadata.operation === '%') {
            // Para CDI com %, mostrar: CDI (X%) × Y% = Z%
            calculationDetails = `${indexerName} (${cdiPercent}%) × ${metadata.percentage}% = ${(result.monthlyYield * 100).toFixed(2)}%`
          } else {
            // Para CDI com +, mostrar: CDI (X%) + Y% a.a. (Z% a.m.) = W%
            const annualSpread = metadata.percentage
            const monthlySpread = Math.pow(1 + annualSpread / 100, 1/12) - 1
            calculationDetails = `${indexerName} (${cdiPercent}%) + ${annualSpread}% a.a. (${(monthlySpread * 100).toFixed(2)}% a.m.) = ${(result.monthlyYield * 100).toFixed(2)}%`
          }
        } else if (metadata.indexer === 'IPCA') {
          const ipcaMonthlyReturn = metadata.period ? getBenchmarkMonthlyReturn('IPCA', metadata.period, 'BRL') : null
          const ipcaPercent = ipcaMonthlyReturn ? (ipcaMonthlyReturn * 100).toFixed(2) : 'N/A'
          const annualSpread = metadata.percentage
          const monthlySpread = Math.pow(1 + annualSpread / 100, 1/12) - 1
          calculationDetails = `${indexerName} (${ipcaPercent}%) + ${annualSpread}% a.a. (${(monthlySpread * 100).toFixed(2)}% a.m.) = ${(result.monthlyYield * 100).toFixed(2)}%`
        } else if (metadata.indexer === 'PRE') {
          const annualRate = metadata.percentage
          const monthlyRate = Math.pow(1 + annualRate / 100, 1/12) - 1
          calculationDetails = `${indexerName} ${annualRate}% a.a. (${(monthlyRate * 100).toFixed(2)}% a.m.) = ${(result.monthlyYield * 100).toFixed(2)}%`
        }
        
        const formattedInitial = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(initial)
        
        const formattedFinancialGain = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(financialGain)
        
        const formattedFinalValue = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(finalValue)
        
        const periodText = metadata.period || '-'
        
        toast({
          title: i18n.t('portfolioPerformance.yieldCalculator.success.calculationDone'),
          description: (
            <div className="space-y-2 text-sm">
              {metadata.period && (
                <div className="flex items-start gap-2">
                  <strong className="min-w-[80px]">{i18n.t('portfolioPerformance.yieldCalculator.custom.toast.period')}:</strong>
                  <span>{periodText}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <strong className="min-w-[80px]">{i18n.t('portfolioPerformance.yieldCalculator.custom.toast.calculation')}:</strong>
                <span className="break-words">{calculationDetails}</span>
              </div>
              <div className="flex items-start gap-2">
                <strong className="min-w-[80px]">{i18n.t('portfolioPerformance.yieldCalculator.custom.toast.initialValue')}:</strong>
                <span>{formattedInitial}</span>
              </div>
              <div className="flex items-start gap-2">
                <strong className="min-w-[80px]">{i18n.t('portfolioPerformance.yieldCalculator.custom.toast.financialGain')}:</strong>
                <span className="text-green-600 dark:text-green-400 font-medium">{formattedFinancialGain}</span>
              </div>
              <div className="flex items-start gap-2">
                <strong className="min-w-[80px]">{i18n.t('portfolioPerformance.yieldCalculator.custom.toast.finalValue')}:</strong>
                <span className="font-medium">{formattedFinalValue}</span>
              </div>
            </div>
          ),
          duration: 10000
        })
      } else {
        // Toast simples para outros modos
        toast({
          title: i18n.t('portfolioPerformance.yieldCalculator.success.calculationDone'),
          description: i18n.t('portfolioPerformance.yieldCalculator.success.calculationDescription', {
            yield: (result.monthlyYield * 100).toFixed(4)
          })
        })
      }
      
      if (onOpenChange) {
        onOpenChange(false)
      }
    } catch (error) {
      toast({
        title: i18n.t('portfolioPerformance.yieldCalculator.errors.error'),
        description: i18n.t('portfolioPerformance.yieldCalculator.errors.calculationError'),
        variant: "destructive"
      })
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalculatorIcon className="h-5 w-5" />
            {i18n.t('portfolioPerformance.yieldCalculator.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Seletor de modo */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={calculationMode === 'auto' ? 'default' : 'outline'}
              onClick={() => setCalculationMode('auto')}
              size="sm"
            >
              {i18n.t('portfolioPerformance.yieldCalculator.modes.auto')}
            </Button>
            <Button
              variant={calculationMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setCalculationMode('manual')}
              size="sm"
            >
              {i18n.t('portfolioPerformance.yieldCalculator.modes.manual')}
            </Button>
            <Button
              variant={calculationMode === 'custom' ? 'default' : 'outline'}
              onClick={() => setCalculationMode('custom')}
              size="sm"
            >
              {i18n.t('portfolioPerformance.yieldCalculator.modes.custom')}
            </Button>
            <Button
              variant={calculationMode === 'market' ? 'default' : 'outline'}
              onClick={() => setCalculationMode('market')}
              size="sm"
            >
              {i18n.t('portfolioPerformance.yieldCalculator.modes.market')}
            </Button>
          </div>
          
          {/* Modo Automático */}
          {calculationMode === 'auto' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {i18n.t('portfolioPerformance.yieldCalculator.auto.description')}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>{i18n.t('portfolioPerformance.yieldCalculator.auto.criteria')}</strong>
                </p>
              </div>
              
              {period && institution && (
                <div className="bg-muted p-3 rounded-md space-y-1">
                  <p className="text-sm font-medium">{i18n.t('portfolioPerformance.yieldCalculator.auto.searchCriteria')}</p>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>• {i18n.t('portfolioPerformance.yieldCalculator.auto.competence')} <span className="font-medium text-foreground">{period}</span></p>
                    <p>• {i18n.t('portfolioPerformance.yieldCalculator.auto.institution')} <span className="font-medium text-foreground">{institution}</span></p>
                    {accountName && (
                      <p>• {i18n.t('portfolioPerformance.yieldCalculator.auto.account')} <span className="font-medium text-foreground">{accountName}</span></p>
                    )}
                  </div>
                  {detailedData && detailedData.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {i18n.t('portfolioPerformance.yieldCalculator.auto.totalAssetsAvailable', { count: detailedData.length })}
                    </p>
                  )}
                </div>
              )}
              
              {(!period || !institution) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200" dangerouslySetInnerHTML={{ __html: i18n.t('portfolioPerformance.yieldCalculator.auto.warning') }} />
                </div>
              )}
              
              {editingType === 'detailed' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    {i18n.t('portfolioPerformance.yieldCalculator.auto.info')}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Modo Manual */}
          {calculationMode === 'manual' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="manual-period">{i18n.t('portfolioPerformance.yieldCalculator.manual.period')}</Label>
                <Input
                  id="manual-period"
                  value={manualPeriod}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '')
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + '/' + value.substring(2, 6)
                    }
                    setManualPeriod(value)
                  }}
                  placeholder="MM/YYYY"
                  maxLength={7}
                />
              </div>
              
              <div>
                <Label htmlFor="manual-indexer">{i18n.t('portfolioPerformance.yieldCalculator.manual.indexer')}</Label>
                <SelectWithSearch
                  options={manualIndexerOptions}
                  value={manualIndexer}
                  onValueChange={(value) => {
                    const indexer = value as 'CDI' | 'IPCA' | 'PRE'
                    setManualIndexer(indexer)
                    if (indexer === 'CDI') {
                      setManualOperation('%')
                      setManualPercentage('100')
                    }
                  }}
                  placeholder={i18n.t('portfolioPerformance.yieldCalculator.manual.selectIndexer')}
                  searchPlaceholder={i18n.t('portfolioPerformance.yieldCalculator.manual.searchIndexer')}
                />
              </div>
              
              {manualIndexer === 'CDI' && (
                <div>
                  <Label>{i18n.t('portfolioPerformance.yieldCalculator.custom.cdiPercentage')}</Label>
                  <div className="flex gap-3 mt-1">
                    <div className="flex border rounded-md overflow-hidden">
                      <Button
                        type="button"
                        variant={manualOperation === '%' ? 'default' : 'outline'}
                        onClick={() => {
                          setManualOperation('%')
                          setManualPercentage('100')
                        }}
                        className="rounded-none px-5 min-w-[50px]"
                        size="sm"
                      >
                        %
                      </Button>
                      <Button
                        type="button"
                        variant={manualOperation === '+' ? 'default' : 'outline'}
                        onClick={() => {
                          setManualOperation('+')
                          setManualPercentage('0')
                        }}
                        className="rounded-none px-5 min-w-[50px]"
                        size="sm"
                      >
                        +
                      </Button>
                    </div>
                    <Input
                      type="text"
                      value={manualPercentage}
                      onChange={(e) => setManualPercentage(e.target.value)}
                      placeholder={manualOperation === '%' ? i18n.t('portfolioPerformance.yieldCalculator.manual.cdiExample') : i18n.t('portfolioPerformance.yieldCalculator.manual.spreadExample')}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {manualOperation === '%' ? i18n.t('portfolioPerformance.yieldCalculator.manual.cdiExample') : i18n.t('portfolioPerformance.yieldCalculator.manual.spreadExample')}
                  </p>
                </div>
              )}
              
              {manualIndexer !== 'CDI' && (
                <div>
                  <Label htmlFor="manual-percentage">
                    {manualIndexer === 'IPCA' ? i18n.t('portfolioPerformance.yieldCalculator.manual.ipcaSpread') : i18n.t('portfolioPerformance.yieldCalculator.manual.annualRate')}
                  </Label>
                  <Input
                    id="manual-percentage"
                    type="text"
                    value={manualPercentage}
                    onChange={(e) => setManualPercentage(e.target.value)}
                    placeholder={manualIndexer === 'IPCA' ? i18n.t('portfolioPerformance.yieldCalculator.manual.ipcaExample') : i18n.t('portfolioPerformance.yieldCalculator.manual.annualRateExample')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {manualIndexer === 'IPCA' ? i18n.t('portfolioPerformance.yieldCalculator.manual.ipcaExample') : i18n.t('portfolioPerformance.yieldCalculator.manual.annualRateExample')}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Modo Personalizado */}
          {calculationMode === 'custom' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-initial">{i18n.t('portfolioPerformance.yieldCalculator.custom.initialValue')}</Label>
                <Input
                  id="custom-initial"
                  type="text"
                  value={customInitialValue}
                  onChange={(e) => setCustomInitialValue(e.target.value)}
                  placeholder={i18n.t('portfolioPerformance.yieldCalculator.custom.initialValueExample')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {i18n.t('portfolioPerformance.yieldCalculator.custom.initialValueDescription')}
                </p>
              </div>
              
              <div>
                <Label htmlFor="custom-period">{i18n.t('portfolioPerformance.yieldCalculator.custom.period')}</Label>
                <Input
                  id="custom-period"
                  value={customPeriod}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '')
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + '/' + value.substring(2, 6)
                    }
                    setCustomPeriod(value)
                  }}
                  placeholder="MM/YYYY"
                  maxLength={7}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {i18n.t('portfolioPerformance.yieldCalculator.custom.periodExample')}
                </p>
              </div>
              
              <div>
                <Label htmlFor="custom-indexer">{i18n.t('portfolioPerformance.yieldCalculator.custom.indexer')}</Label>
                <SelectWithSearch
                  options={customIndexerOptions}
                  value={customIndexer}
                  onValueChange={(value) => {
                    const indexer = value as 'CDI' | 'IPCA' | 'PRE' | 'MANUAL'
                    setCustomIndexer(indexer)
                    if (indexer === 'CDI') {
                      setCustomOperation('%')
                      setCustomPercentage('100')
                    } else if (indexer === 'MANUAL') {
                      setCustomPercentage('1.0')
                    }
                  }}
                  placeholder={i18n.t('portfolioPerformance.yieldCalculator.custom.selectIndexer')}
                  searchPlaceholder={i18n.t('portfolioPerformance.yieldCalculator.custom.searchIndexer')}
                />
              </div>
              
              {customIndexer === 'CDI' && (
                <div>
                  <Label>{i18n.t('portfolioPerformance.yieldCalculator.custom.cdiPercentage')}</Label>
                  <div className="flex gap-3 mt-1">
                    <div className="flex border rounded-md overflow-hidden">
                      <Button
                        type="button"
                        variant={customOperation === '%' ? 'default' : 'outline'}
                        onClick={() => {
                          setCustomOperation('%')
                          setCustomPercentage('100')
                        }}
                        className="rounded-none px-5 min-w-[50px]"
                        size="sm"
                      >
                        %
                      </Button>
                      <Button
                        type="button"
                        variant={customOperation === '+' ? 'default' : 'outline'}
                        onClick={() => {
                          setCustomOperation('+')
                          setCustomPercentage('0')
                        }}
                        className="rounded-none px-5 min-w-[50px]"
                        size="sm"
                      >
                        +
                      </Button>
                    </div>
                    <Input
                      type="text"
                      value={customPercentage}
                      onChange={(e) => setCustomPercentage(e.target.value)}
                      placeholder={customOperation === '%' ? i18n.t('portfolioPerformance.yieldCalculator.custom.cdiExample') : i18n.t('portfolioPerformance.yieldCalculator.custom.spreadExample')}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {customOperation === '%' ? i18n.t('portfolioPerformance.yieldCalculator.custom.cdiExample') : i18n.t('portfolioPerformance.yieldCalculator.custom.spreadExample')}
                  </p>
                </div>
              )}
              
              {customIndexer !== 'CDI' && (
                <div>
                  <Label htmlFor="custom-percentage">
                    {customIndexer === 'MANUAL' ? i18n.t('portfolioPerformance.yieldCalculator.custom.monthlyYield') : customIndexer === 'PRE' ? i18n.t('portfolioPerformance.yieldCalculator.custom.annualRate') : i18n.t('portfolioPerformance.yieldCalculator.custom.ipcaSpread')}
                  </Label>
                  <Input
                    id="custom-percentage"
                    type="text"
                    value={customPercentage}
                    onChange={(e) => setCustomPercentage(e.target.value)}
                    placeholder={customIndexer === 'MANUAL' ? i18n.t('portfolioPerformance.yieldCalculator.custom.monthlyYieldExample') : customIndexer === 'PRE' ? i18n.t('portfolioPerformance.yieldCalculator.custom.annualRateExample') : i18n.t('portfolioPerformance.yieldCalculator.custom.ipcaExample')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {customIndexer === 'MANUAL' ? i18n.t('portfolioPerformance.yieldCalculator.custom.monthlyYieldExample') : 
                     customIndexer === 'PRE' ? i18n.t('portfolioPerformance.yieldCalculator.custom.annualRateExample') : 
                     i18n.t('portfolioPerformance.yieldCalculator.custom.ipcaExample')}
                  </p>
                </div>
              )}
              
              {/* Resultado do Cálculo em Tempo Real */}
              {customCalculationResult && (
                <div className="bg-muted p-4 rounded-md border border-primary/20 space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">
                    {i18n.t('portfolioPerformance.yieldCalculator.custom.resultTitle')}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {i18n.t('portfolioPerformance.yieldCalculator.custom.percentageValue')}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {customCalculationResult.percentageValue.toFixed(4)}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {i18n.t('portfolioPerformance.yieldCalculator.custom.financialGain')}
                      </p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(customCalculationResult.financialGain)}
                      </p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {i18n.t('portfolioPerformance.yieldCalculator.custom.finalValue')}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(customCalculationResult.finalValue)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Modo Mercado */}
          {calculationMode === 'market' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {i18n.t('portfolioPerformance.yieldCalculator.market.description')}
              </p>
              
              <div>
                <Label htmlFor="market-period">{i18n.t('portfolioPerformance.yieldCalculator.market.period')}</Label>
                <Input
                  id="market-period"
                  value={marketPeriod}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '')
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + '/' + value.substring(2, 6)
                    }
                    setMarketPeriod(value)
                    setMarketResult(null) // Limpar resultado ao mudar período
                    setMarketError(null) // Limpar erro ao mudar período
                  }}
                  placeholder="MM/YYYY"
                  maxLength={7}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {i18n.t('portfolioPerformance.yieldCalculator.market.periodExample')}
                </p>
              </div>
              
              <div>
                <Label htmlFor="market-benchmark">{i18n.t('portfolioPerformance.yieldCalculator.market.benchmark')}</Label>
                <SelectWithSearch
                  options={marketBenchmarkOptions}
                  value={marketBenchmark}
                  onValueChange={(value) => {
                    setMarketBenchmark(value as BenchmarkType)
                    setMarketResult(null) // Limpar resultado ao mudar benchmark
                    setMarketError(null) // Limpar erro ao mudar benchmark
                  }}
                  placeholder={i18n.t('portfolioPerformance.yieldCalculator.market.selectBenchmark')}
                  searchPlaceholder={i18n.t('portfolioPerformance.yieldCalculator.market.searchBenchmark')}
                />
              </div>
              
              <div>
                <Label htmlFor="market-currency">{i18n.t('portfolioPerformance.yieldCalculator.market.currency')}</Label>
                <SelectWithSearch
                  options={currencyOptions}
                  value={marketCurrency}
                  onValueChange={(value) => {
                    setMarketCurrency(value as CurrencyCode)
                    setMarketResult(null) // Limpar resultado ao mudar moeda
                    setMarketError(null) // Limpar erro ao mudar moeda
                  }}
                  placeholder={i18n.t('portfolioPerformance.yieldCalculator.market.selectCurrency')}
                  searchPlaceholder={i18n.t('portfolioPerformance.yieldCalculator.market.searchCurrency')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {i18n.t('portfolioPerformance.yieldCalculator.market.currencyDescription')}
                </p>
              </div>
              
              <Button
                onClick={handleFetchMarketData}
                disabled={!marketPeriod || isLoading}
                className="w-full"
                variant="secondary"
              >
                {isLoading ? i18n.t('portfolioPerformance.yieldCalculator.market.searching') : i18n.t('portfolioPerformance.yieldCalculator.market.searchButton')}
              </Button>
              
              {marketError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-red-900 dark:text-red-100 mb-2">
                        {i18n.t('portfolioPerformance.yieldCalculator.market.errorTitle')}
                      </h4>
                      <div className="text-xs text-red-800 dark:text-red-200 space-y-1 whitespace-pre-line">
                        {marketError.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {marketResult && (
                <div className="bg-muted p-4 rounded-md space-y-2 border border-primary/20">
                  <h4 className="font-semibold text-sm">{i18n.t('portfolioPerformance.yieldCalculator.market.resultTitle')}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">{i18n.t('portfolioPerformance.yieldCalculator.market.index')}</p>
                      <p className="font-medium">{i18n.t(`${marketResult.benchmarkName}`)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{i18n.t('portfolioPerformance.yieldCalculator.market.currencyLabel')}</p>
                      <p className="font-medium">
                        {marketCurrency === 'BRL' ? i18n.t('portfolioPerformance.yieldCalculator.currencies.brl') : i18n.t('portfolioPerformance.yieldCalculator.currencies.usd')}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">{i18n.t('portfolioPerformance.yieldCalculator.market.yield')}</p>
                      <p className={`font-medium text-lg ${marketResult.monthlyReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(marketResult.monthlyReturn * 100).toFixed(4)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-2">
                    {i18n.t('portfolioPerformance.yieldCalculator.market.confirmNote')}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Botões de ação */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setMarketResult(null)
                onOpenChange?.(false)
              }}
              className="flex-1"
            >
              {i18n.t('portfolioPerformance.yieldCalculator.buttons.cancel')}
            </Button>
            <Button
              onClick={handleCalculate}
              className="flex-1"
              disabled={calculationMode === 'market' && !marketResult}
            >
              {i18n.t('portfolioPerformance.yieldCalculator.buttons.confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

