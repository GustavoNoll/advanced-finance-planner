import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calculator as CalculatorIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getBenchmarkMonthlyReturn, type BenchmarkType, getBenchmarkNameKey } from "@/utils/benchmark-calculator"
import type { CurrencyCode } from "@/utils/currency"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"
import i18n from "@/lib/i18n"
import { SelectWithSearch, type SelectOption } from "@/components/ui/select-with-search"

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
    { id: 'CDI', label: 'CDI' },
    { id: 'IPCA', label: 'IPCA' },
    { id: 'PRE', label: 'Pré-fixado' }
  ]
  
  const customIndexerOptions: SelectOption[] = [
    { id: 'CDI', label: 'CDI' },
    { id: 'IPCA', label: 'IPCA' },
    { id: 'PRE', label: 'Pré-fixado' },
    { id: 'MANUAL', label: 'Manual' }
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
    { id: 'BRL', label: 'Real (BRL)' },
    { id: 'USD', label: 'Dólar (USD)' }
  ]
  
  // Função para buscar dados do mercado usando benchmark-calculator
  const handleFetchMarketData = async () => {
    if (!marketPeriod) {
      toast({
        title: "Erro",
        description: "Informe a competência",
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
        const currencyLabel = marketCurrency === 'BRL' ? 'Real (BRL)' : 'Dólar (USD)'
        const errorMessage = `Não foram encontrados dados de rentabilidade para:\n\n• Índice: ${benchmarkDisplayName}\n• Competência: ${marketPeriod}\n• Moeda: ${currencyLabel}\n\nVerifique se:\n- A competência está correta (formato MM/YYYY)\n- Existem dados históricos disponíveis para este período\n- O índice selecionado possui dados para esta moeda`
        
        setMarketError(errorMessage)
        toast({
          title: "Rentabilidade não encontrada",
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
      
      const currencyLabel = marketCurrency === 'BRL' ? 'Real (BRL)' : 'Dólar (USD)'
      toast({
        title: "Dados obtidos",
        description: `Rentabilidade de ${i18n.t(benchmarkName)} em ${currencyLabel}: ${(monthlyReturn * 100).toFixed(4)}%`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar dados do mercado"
      toast({
        title: "Erro",
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
            title: "Aviso",
            description: "Busque os dados do mercado primeiro",
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
        // Implementar lógica manual baseada em indexadores
        // Por enquanto, placeholder
        result = {
          monthlyYield: 0.01, // Placeholder
          metadata: {
            indexer: manualIndexer,
            percentage: parseFloat(manualPercentage),
            operation: manualOperation
          }
        }
      } else if (calculationMode === 'custom') {
        const initial = parseFloat(customInitialValue.replace(',', '.')) || 0
        const percentage = parseFloat(customPercentage.replace(',', '.')) || 0
        
        if (initial === 0) {
          toast({
            title: "Erro",
            description: "Informe um valor inicial válido",
            variant: "destructive"
          })
          return
        }
        
        let monthlyYield = 0
        if (customIndexer === 'MANUAL') {
          monthlyYield = percentage / 100
        } else {
          // Placeholder - implementar lógica real
          monthlyYield = percentage / 100
        }
        
        result = {
          monthlyYield,
          finalValue: initial * (1 + monthlyYield),
          financialGain: initial * monthlyYield,
          metadata: {
            indexer: customIndexer,
            percentage,
            operation: customOperation
          }
        }
      } else if (calculationMode === 'auto') {
        // Modo Automático - calcular rentabilidade ponderada dos ativos vinculados
        if (!period || !institution) {
          toast({
            title: "Dados incompletos",
            description: "Para calcular automaticamente, é necessário informar a competência e a instituição",
            variant: "destructive"
          })
          return
        }
        
        if (editingType === 'detailed') {
          toast({
            title: "Modo não disponível",
            description: "O modo automático está disponível apenas para registros consolidados",
            variant: "destructive"
          })
          return
        }
        
        // Buscar ativos detalhados vinculados (mesma competência, instituição e nome da conta)
        const linkedAssets = detailedData.filter(asset => 
          asset.period === period &&
          asset.institution === institution &&
          (accountName ? asset.account_name === accountName : true)
        )
        
        if (linkedAssets.length === 0) {
          toast({
            title: "Nenhum ativo encontrado",
            description: `Não foram encontrados ativos detalhados vinculados para:\n• Competência: ${period}\n• Instituição: ${institution}${accountName ? `\n• Conta: ${accountName}` : ''}\n\nVerifique se existem ativos cadastrados com essas informações ou use outro modo de cálculo.`,
            variant: "destructive",
            duration: 6000
          })
          return
        }
        
        // Calcular rentabilidade ponderada
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
            title: "Posição total zero",
            description: `Foram encontrados ${linkedAssets.length} ativo(s) vinculado(s), mas a soma das posições é zero.\n\nVerifique se os ativos têm valores de posição preenchidos.`,
            variant: "destructive",
            duration: 6000
          })
          return
        }
        
        const monthlyYield = weightedYield / totalPosition
        
        result = {
          monthlyYield,
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
          title: "Cálculo automático realizado",
          description: `Encontrados ${linkedAssets.length} ativo(s). Rentabilidade ponderada: ${(monthlyYield * 100).toFixed(4)}%`
        })
      }
      
      if (onConfirm) {
        onConfirm(result)
      }
      
      toast({
        title: "Cálculo realizado",
        description: `Rentabilidade: ${(result.monthlyYield * 100).toFixed(4)}%`
      })
      
      if (onOpenChange) {
        onOpenChange(false)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao calcular rentabilidade",
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
            Calculadora de Rentabilidade
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
              Automático
            </Button>
            <Button
              variant={calculationMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setCalculationMode('manual')}
              size="sm"
            >
              Manual
            </Button>
            <Button
              variant={calculationMode === 'custom' ? 'default' : 'outline'}
              onClick={() => setCalculationMode('custom')}
              size="sm"
            >
              Personalizado
            </Button>
            <Button
              variant={calculationMode === 'market' ? 'default' : 'outline'}
              onClick={() => setCalculationMode('market')}
              size="sm"
            >
              Mercado
            </Button>
          </div>
          
          {/* Modo Automático */}
          {calculationMode === 'auto' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Calcula a rentabilidade ponderada dos ativos detalhados vinculados ao registro consolidado.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Critério:</strong> Mesma Competência, Instituição e Nome da Conta.
                </p>
              </div>
              
              {period && institution && (
                <div className="bg-muted p-3 rounded-md space-y-1">
                  <p className="text-sm font-medium">Critérios de busca:</p>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>• Competência: <span className="font-medium text-foreground">{period}</span></p>
                    <p>• Instituição: <span className="font-medium text-foreground">{institution}</span></p>
                    {accountName && (
                      <p>• Conta: <span className="font-medium text-foreground">{accountName}</span></p>
                    )}
                  </div>
                  {detailedData && detailedData.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Total de ativos disponíveis: {detailedData.length}
                    </p>
                  )}
                </div>
              )}
              
              {(!period || !institution) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    ⚠️ <strong>Atenção:</strong> Preencha a competência e a instituição no formulário para usar o modo automático.
                  </p>
                </div>
              )}
              
              {editingType === 'detailed' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    ℹ️ O modo automático está disponível apenas para registros consolidados.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Modo Manual */}
          {calculationMode === 'manual' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="manual-period">Competência</Label>
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
                <Label htmlFor="manual-indexer">Indexador</Label>
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
                  placeholder="Selecione o indexador"
                  searchPlaceholder="Buscar indexador..."
                />
              </div>
              
              {manualIndexer === 'CDI' && (
                <div>
                  <Label>Percentual do CDI (%)</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="flex border rounded-md overflow-hidden">
                      <Button
                        type="button"
                        variant={manualOperation === '%' ? 'default' : 'outline'}
                        onClick={() => {
                          setManualOperation('%')
                          setManualPercentage('100')
                        }}
                        className="rounded-none px-4"
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
                        className="rounded-none px-4"
                        size="sm"
                      >
                        +
                      </Button>
                    </div>
                    <Input
                      type="text"
                      value={manualPercentage}
                      onChange={(e) => setManualPercentage(e.target.value)}
                      placeholder={manualOperation === '%' ? 'Ex: 80 para 80% do CDI' : 'Spread a.a.'}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {manualOperation === '%' ? 'Ex: 80 para 80% do CDI' : 'Ex: 2 para CDI + 2% a.a.'}
                  </p>
                </div>
              )}
              
              {manualIndexer !== 'CDI' && (
                <div>
                  <Label htmlFor="manual-percentage">
                    {manualIndexer === 'IPCA' ? 'Spread ao ano (%)' : 'Taxa Anual (%)'}
                  </Label>
                  <Input
                    id="manual-percentage"
                    type="text"
                    value={manualPercentage}
                    onChange={(e) => setManualPercentage(e.target.value)}
                    placeholder={manualIndexer === 'IPCA' ? 'Ex: 5 para IPCA + 5% a.a.' : 'Ex: 12 para 12% a.a.'}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {manualIndexer === 'IPCA' ? 'Ex: 5 para IPCA + 5% a.a.' : 'Ex: 12 para 12% ao ano'}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Modo Personalizado */}
          {calculationMode === 'custom' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-initial">Valor Inicial (R$)</Label>
                <Input
                  id="custom-initial"
                  type="text"
                  value={customInitialValue}
                  onChange={(e) => setCustomInitialValue(e.target.value)}
                  placeholder="Ex: 10000.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Informe o valor do investimento inicial
                </p>
              </div>
              
              <div>
                <Label htmlFor="custom-period">Competência</Label>
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
                  Ex: 10/2024 para outubro de 2024
                </p>
              </div>
              
              <div>
                <Label htmlFor="custom-indexer">Indexador</Label>
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
                  placeholder="Selecione o indexador"
                  searchPlaceholder="Buscar indexador..."
                />
              </div>
              
              {customIndexer === 'CDI' && (
                <div>
                  <Label>Percentual do CDI (%)</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="flex border rounded-md overflow-hidden">
                      <Button
                        type="button"
                        variant={customOperation === '%' ? 'default' : 'outline'}
                        onClick={() => {
                          setCustomOperation('%')
                          setCustomPercentage('100')
                        }}
                        className="rounded-none px-4"
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
                        className="rounded-none px-4"
                        size="sm"
                      >
                        +
                      </Button>
                    </div>
                    <Input
                      type="text"
                      value={customPercentage}
                      onChange={(e) => setCustomPercentage(e.target.value)}
                      placeholder={customOperation === '%' ? '% do CDI' : 'Spread a.a.'}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {customOperation === '%' ? 'Ex: 80 para 80% do CDI' : 'Ex: 2 para CDI + 2% a.a.'}
                  </p>
                </div>
              )}
              
              {customIndexer !== 'CDI' && (
                <div>
                  <Label htmlFor="custom-percentage">
                    {customIndexer === 'MANUAL' ? 'Rentabilidade Mensal (%)' : customIndexer === 'PRE' ? 'Taxa Anual (%)' : 'Spread ao ano (%)'}
                  </Label>
                  <Input
                    id="custom-percentage"
                    type="text"
                    value={customPercentage}
                    onChange={(e) => setCustomPercentage(e.target.value)}
                    placeholder={customIndexer === 'MANUAL' ? 'Ex: 1.5' : customIndexer === 'PRE' ? 'Ex: 12' : 'Ex: 5'}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {customIndexer === 'MANUAL' ? 'Ex: 1.5 para 1,5% de rentabilidade no mês' : 
                     customIndexer === 'PRE' ? 'Ex: 12 para 12% ao ano' : 
                     'Ex: 5 para IPCA + 5% a.a.'}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Modo Mercado */}
          {calculationMode === 'market' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Busca automaticamente a rentabilidade real de um índice em um mês específico usando dados de mercado.
              </p>
              
              <div>
                <Label htmlFor="market-period">Competência</Label>
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
                  Ex: 10/2024 para outubro de 2024
                </p>
              </div>
              
              <div>
                <Label htmlFor="market-benchmark">Índice/Benchmark</Label>
                <SelectWithSearch
                  options={marketBenchmarkOptions}
                  value={marketBenchmark}
                  onValueChange={(value) => {
                    setMarketBenchmark(value as BenchmarkType)
                    setMarketResult(null) // Limpar resultado ao mudar benchmark
                    setMarketError(null) // Limpar erro ao mudar benchmark
                  }}
                  placeholder="Selecione o índice/benchmark"
                  searchPlaceholder="Buscar índice..."
                />
              </div>
              
              <div>
                <Label htmlFor="market-currency">Moeda</Label>
                <SelectWithSearch
                  options={currencyOptions}
                  value={marketCurrency}
                  onValueChange={(value) => {
                    setMarketCurrency(value as CurrencyCode)
                    setMarketResult(null) // Limpar resultado ao mudar moeda
                    setMarketError(null) // Limpar erro ao mudar moeda
                  }}
                  placeholder="Selecione a moeda"
                  searchPlaceholder="Buscar moeda..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Selecione a moeda para buscar a rentabilidade (ajusta câmbio quando necessário)
                </p>
              </div>
              
              <Button
                onClick={handleFetchMarketData}
                disabled={!marketPeriod || isLoading}
                className="w-full"
                variant="secondary"
              >
                {isLoading ? 'Buscando...' : 'Buscar Rentabilidade'}
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
                        Rentabilidade não encontrada
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
                  <h4 className="font-semibold text-sm">Resultado da Consulta:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Índice:</p>
                      <p className="font-medium">{i18n.t(`${marketResult.benchmarkName}`)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Moeda:</p>
                      <p className="font-medium">
                        {marketCurrency === 'BRL' ? 'Real (BRL)' : 'Dólar (USD)'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Rentabilidade:</p>
                      <p className={`font-medium text-lg ${marketResult.monthlyReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(marketResult.monthlyReturn * 100).toFixed(4)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-2">
                    ℹ️ Ao confirmar, este valor será usado como Rendimento
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
              Cancelar
            </Button>
            <Button
              onClick={handleCalculate}
              className="flex-1"
              disabled={calculationMode === 'market' && !marketResult}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

