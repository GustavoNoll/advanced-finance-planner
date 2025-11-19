import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LabelList } from 'recharts'
import { TrendingUp, Settings, ArrowLeftRight, Wallet, BarChart3, Calendar as CalendarIcon } from "lucide-react"
import { useState, useMemo } from "react"
import type { ConsolidatedPerformance } from "@/types/financial"
import { fetchIPCARates, fetchCDIRates } from "@/lib/bcb-api"
import { useCurrency } from "@/contexts/CurrencyContext"

interface PerformanceChartProps {
  consolidatedData: ConsolidatedPerformance[]
  targetReturnIpcaPlus?: string
}

// Helper function to convert competencia to Date
const competenciaToDate = (competencia: string): Date => {
  const [month, year] = competencia.split('/').map(Number)
  return new Date(year, month - 1)
}

// Format competencia display
const formatCompetenciaDisplay = (competencia: string) => {
  const [month, year] = competencia.split('/')
  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ]
  return `${monthNames[parseInt(month) - 1]}/${year.slice(-2)}`
}

export function PerformanceChart({ consolidatedData, targetReturnIpcaPlus }: PerformanceChartProps) {
  const { convertValue, adjustReturnWithFX, formatCurrency } = useCurrency()
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year' | '12months' | 'all' | 'custom'>('12months')
  const [customStartCompetencia, setCustomStartCompetencia] = useState<string>('')
  const [customEndCompetencia, setCustomEndCompetencia] = useState<string>('')
  const [showCustomSelector, setShowCustomSelector] = useState(false)
  const [showIndicators, setShowIndicators] = useState(false)
  const [viewMode, setViewMode] = useState<'rentabilidade' | 'patrimonio' | 'crescimento'>('rentabilidade')
  const [showOnlyRendaGerada, setShowOnlyRendaGerada] = useState(false)
  const [selectedIndicators, setSelectedIndicators] = useState({
    cdi: false,
    target: true,
    ipca: true
  })

  // Consolidate data by competencia (sum patrimônio, weighted average rendimento)
  const consolidatedByCompetencia = useMemo(() => {
    const competenciaMap = new Map<string, {
      competencia: string
      patrimonioFinal: number
      patrimonioInicial: number
      movimentacao: number
      ganhoFinanceiro: number
      impostos: number
      rendimentoSum: number
      patrimonioForWeightedAvg: number
    }>()

    consolidatedData.forEach(item => {
      const competencia = item.period || ''
      if (!competencia) return

      if (!competenciaMap.has(competencia)) {
        competenciaMap.set(competencia, {
          competencia,
          patrimonioFinal: 0,
          patrimonioInicial: 0,
          movimentacao: 0,
          ganhoFinanceiro: 0,
          impostos: 0,
          rendimentoSum: 0,
          patrimonioForWeightedAvg: 0
        })
      }

      const consolidated = competenciaMap.get(competencia)!
      const originalCurrency = (item.currency === 'USD' || item.currency === 'Dolar') ? 'USD' : 'BRL'
      
      const patrimonioFinalConvertido = convertValue(
        Number(item.final_assets || 0),
        competencia,
        originalCurrency
      )
      const patrimonioInicialConvertido = convertValue(
        Number(item.initial_assets || 0),
        competencia,
        originalCurrency
      )
      const movimentacaoConvertida = convertValue(
        Number(item.movement || 0),
        competencia,
        originalCurrency
      )
      const ganhoFinanceiroConvertido = convertValue(
        Number(item.financial_gain || 0),
        competencia,
        originalCurrency
      )
      const impostosConvertidos = convertValue(
        Number(item.taxes || 0),
        competencia,
        originalCurrency
      )

      consolidated.patrimonioFinal += patrimonioFinalConvertido
      consolidated.patrimonioInicial += patrimonioInicialConvertido
      consolidated.movimentacao += movimentacaoConvertida
      consolidated.ganhoFinanceiro += ganhoFinanceiroConvertido
      consolidated.impostos += impostosConvertidos

      // For weighted average rendimento - with FX adjustment
      const rendimentoAjustado = adjustReturnWithFX(
        Number(item.yield || 0),
        competencia,
        originalCurrency
      )

      consolidated.rendimentoSum += rendimentoAjustado * patrimonioFinalConvertido
      consolidated.patrimonioForWeightedAvg += patrimonioFinalConvertido
    })

    return Array.from(competenciaMap.values()).map(item => ({
      competencia: item.competencia,
      patrimonioFinal: item.patrimonioFinal,
      patrimonioInicial: item.patrimonioInicial,
      movimentacao: item.movimentacao,
      ganhoFinanceiro: item.ganhoFinanceiro,
      impostos: item.impostos,
      rendimento: item.patrimonioForWeightedAvg > 0 ? item.rendimentoSum / item.patrimonioForWeightedAvg : 0
    })).sort((a, b) => {
      const dateA = competenciaToDate(a.competencia)
      const dateB = competenciaToDate(b.competencia)
      return dateA.getTime() - dateB.getTime()
    })
  }, [consolidatedData, convertValue, adjustReturnWithFX])

  // Get available competencias for custom selector
  const availableCompetencias = useMemo(() => {
    return [...new Set(consolidatedByCompetencia.map(item => item.competencia))]
      .sort((a, b) => {
        const dateA = competenciaToDate(a)
        const dateB = competenciaToDate(b)
        return dateA.getTime() - dateB.getTime()
      })
  }, [consolidatedByCompetencia])

  // Filter data based on selected period
  const getFilteredData = () => {
    if (consolidatedByCompetencia.length === 0) return []

    let filteredData = consolidatedByCompetencia

    switch (selectedPeriod) {
      case 'month':
        filteredData = consolidatedByCompetencia.slice(-1)
        break
      case 'year':
        if (consolidatedByCompetencia.length > 0) {
          const mostRecentCompetencia = consolidatedByCompetencia[consolidatedByCompetencia.length - 1].competencia
          const mostRecentYear = mostRecentCompetencia.split('/')[1]
          filteredData = consolidatedByCompetencia.filter(item => {
            const itemYear = item.competencia.split('/')[1]
            return itemYear === mostRecentYear
          })
        }
        break
      case '12months':
        filteredData = consolidatedByCompetencia.slice(-12)
        break
      case 'all':
        filteredData = consolidatedByCompetencia
        break
      case 'custom':
        if (customStartCompetencia && customEndCompetencia) {
          filteredData = consolidatedByCompetencia.filter(item => {
            const itemDate = competenciaToDate(item.competencia)
            const startDate = competenciaToDate(customStartCompetencia)
            const endDate = competenciaToDate(customEndCompetencia)
            return itemDate >= startDate && itemDate <= endDate
          })
        }
        break
    }

    return filteredData
  }

  const filteredData = getFilteredData()

  // Calculate accumulated returns with compound interest
  const calculateAccumulatedReturns = (data: typeof filteredData) => {
    if (data.length === 0) return []

    const result = []
    let accumulated = 0 // Start at 0%

    // Add zero point one month before the first competencia
    if (data.length > 0) {
      const [firstMonth, firstYear] = data[0].competencia.split('/').map(Number)
      const firstDate = new Date(firstYear, firstMonth - 1, 1)
      const previousMonth = new Date(firstDate)
      previousMonth.setMonth(previousMonth.getMonth() - 1)

      result.push({
        name: formatCompetenciaDisplay(`${String(previousMonth.getMonth() + 1).padStart(2, '0')}/${previousMonth.getFullYear()}`),
        retornoAcumulado: 0,
        retornoMensal: 0,
        competencia: `${String(previousMonth.getMonth() + 1).padStart(2, '0')}/${previousMonth.getFullYear()}`
      })
    }

    // Calculate compound accumulated returns
    data.forEach((item) => {
      const monthlyReturn = item.rendimento || 0
      // Compound interest formula: (1 + accumulated) * (1 + monthly_return) - 1
      accumulated = (1 + accumulated) * (1 + monthlyReturn) - 1

      result.push({
        name: formatCompetenciaDisplay(item.competencia),
        retornoAcumulado: accumulated * 100,
        retornoMensal: monthlyReturn * 100,
        competencia: item.competencia
      })
    })

    return result
  }

  const chartData = calculateAccumulatedReturns(filteredData)

  // Calculate patrimônio data (patrimônio aplicado e patrimônio atual)
  const calculatePatrimonioData = (data: typeof filteredData) => {
    if (data.length === 0) return []

    const result = []
    let cumulativeMovimentacao = 0

    // Add zero point one month before the first competencia
    if (data.length > 0) {
      const [firstMonth, firstYear] = data[0].competencia.split('/').map(Number)
      const firstDate = new Date(firstYear, firstMonth - 1, 1)
      const previousMonth = new Date(firstDate)
      previousMonth.setMonth(previousMonth.getMonth() - 1)

      const initialPatrimonio = data[0].patrimonioInicial || 0

      result.push({
        name: formatCompetenciaDisplay(`${String(previousMonth.getMonth() + 1).padStart(2, '0')}/${previousMonth.getFullYear()}`),
        patrimonioAplicado: initialPatrimonio,
        patrimonioAtual: initialPatrimonio,
        competencia: `${String(previousMonth.getMonth() + 1).padStart(2, '0')}/${previousMonth.getFullYear()}`
      })
    }

    // Calculate patrimônio for each month
    data.forEach((item) => {
      // Patrimônio Aplicado = Patrimônio Inicial + acumulação de todas as movimentações
      cumulativeMovimentacao += item.movimentacao || 0
      const patrimonioAplicado = (data[0]?.patrimonioInicial || 0) + cumulativeMovimentacao
      const patrimonioAtual = item.patrimonioFinal || 0

      result.push({
        name: formatCompetenciaDisplay(item.competencia),
        patrimonioAplicado,
        patrimonioAtual,
        competencia: item.competencia
      })
    })

    return result
  }

  const patrimonioData = calculatePatrimonioData(filteredData)

  // Calculate growth data showing patrimônio volume with total growth
  const calculateGrowthData = (data: typeof filteredData) => {
    if (data.length === 0) return []

    // Calcular meta mensalizada do componente pré-fixado
    let monthlyTargetRate = 0
    if (targetReturnIpcaPlus) {
      const metaMatch = targetReturnIpcaPlus.match(/\+(\d+(?:\.\d+)?)/) || targetReturnIpcaPlus.match(/ipca_plus_(\d+)/i)
      if (metaMatch) {
        const preFixedComponent = parseFloat(metaMatch[1]) / 100
        monthlyTargetRate = Math.pow(1 + preFixedComponent, 1/12) - 1
      }
    }

    const result = []

    data.forEach((item) => {
      const patrimonioInicial = item.patrimonioInicial || 0
      const patrimonioFinal = item.patrimonioFinal || 0
      const movimentacao = item.movimentacao || 0
      const ganhoFinanceiro = item.ganhoFinanceiro || 0

      // Renda gerada = patrimônio do mês * meta mensalizada
      const rendaGerada = patrimonioInicial * monthlyTargetRate

      // Total growth = movimentação + ganho financeiro = patrimônio final - patrimônio inicial
      const totalGrowth = patrimonioFinal - patrimonioInicial
      const growthPercentage = patrimonioInicial > 0 ? (totalGrowth / patrimonioInicial) * 100 : 0

      const patrimonioBaseAdjusted = Math.max(0, patrimonioInicial - rendaGerada)

      result.push({
        name: formatCompetenciaDisplay(item.competencia),
        rendaGerada: rendaGerada,
        patrimonioBase: patrimonioBaseAdjusted,
        growth: totalGrowth >= 0 ? totalGrowth : 0,
        negativeGrowth: totalGrowth < 0 ? totalGrowth : 0,
        totalGrowth,
        growthPercentage,
        patrimonioFinal,
        patrimonioInicial,
        movimentacao,
        ganhoFinanceiro,
        competencia: item.competencia
      })
    })

    return result
  }

  const growthData = calculateGrowthData(filteredData)

  // Get CDI and IPCA data for the period
  const marketData = useMemo(() => {
    if (filteredData.length === 0) return { cdiData: [], ipcaData: [] }

    const firstCompetencia = filteredData[0]?.competencia
    const lastCompetencia = filteredData[filteredData.length - 1]?.competencia
    if (!firstCompetencia || !lastCompetencia) return { cdiData: [], ipcaData: [] }

    // Convert competencia to date format for fetch functions (DD/MM/YYYY)
    const [firstMonth, firstYear] = firstCompetencia.split('/').map(Number)
    const [lastMonth, lastYear] = lastCompetencia.split('/').map(Number)

    const startDate = `01/${String(firstMonth).padStart(2, '0')}/${firstYear}`
    const lastDay = new Date(lastYear, lastMonth, 0).getDate()
    const endDate = `${String(lastDay).padStart(2, '0')}/${String(lastMonth).padStart(2, '0')}/${lastYear}`

    try {
      const cdiRates = fetchCDIRates(startDate, endDate)
      const ipcaRates = fetchIPCARates(startDate, endDate)

      // Group by competencia (MM/YYYY) and get the last value of each month
      const cdiMap = new Map<string, { competencia: string; cdiRate: number }>()
      cdiRates.forEach(cdi => {
        const competencia = `${String(cdi.date.getMonth() + 1).padStart(2, '0')}/${cdi.date.getFullYear()}`
        const existing = cdiMap.get(competencia)
        if (!existing || cdi.date > competenciaToDate(existing.competencia)) {
          cdiMap.set(competencia, {
            competencia,
            cdiRate: cdi.monthlyRate / 100 // Convert percentage to decimal
          })
        }
      })

      const ipcaMap = new Map<string, { competencia: string; monthlyRate: number }>()
      ipcaRates.forEach(ipca => {
        const competencia = `${String(ipca.date.getMonth() + 1).padStart(2, '0')}/${ipca.date.getFullYear()}`
        const existing = ipcaMap.get(competencia)
        if (!existing || ipca.date > competenciaToDate(existing.competencia)) {
          ipcaMap.set(competencia, {
            competencia,
            monthlyRate: ipca.monthlyRate / 100 // Convert percentage to decimal
          })
        }
      })

      const cdiData = Array.from(cdiMap.values()).sort((a, b) => {
        const dateA = competenciaToDate(a.competencia)
        const dateB = competenciaToDate(b.competencia)
        return dateA.getTime() - dateB.getTime()
      })

      const ipcaData = Array.from(ipcaMap.values()).sort((a, b) => {
        const dateA = competenciaToDate(a.competencia)
        const dateB = competenciaToDate(b.competencia)
        return dateA.getTime() - dateB.getTime()
      })

      return { cdiData, ipcaData }
    } catch (error) {
      console.error('Error fetching market data:', error)
      return { cdiData: [], ipcaData: [] }
    }
  }, [filteredData])

  // Calculate target return from investment plan
  const extractTargetValue = (targetString?: string): number => {
    if (!targetString) return 0
    // Handle both formats: "IPCA+5%" and "ipca_plus_5"
    const match = targetString.match(/\+(\d+(?:\.\d+)?)/) || targetString.match(/ipca_plus_(\d+)/i)
    return match ? parseFloat(match[1]) / 100 : 0
  }

  const targetValue = extractTargetValue(targetReturnIpcaPlus)

  // Add all indicators data to chart data
  const chartDataWithIndicators = chartData.map((point, index) => {
    if (index === 0) {
      return {
        ...point,
        cdiRetorno: 0,
        targetRetorno: 0,
        ipcaRetorno: 0
      }
    }

    const firstCompetencia = chartData[1]?.competencia
    const currentCompetencia = point.competencia

    // CDI data - composição mensal correta
    let cdiRetorno = null
    if (firstCompetencia && marketData.cdiData.length > 0) {
      const firstDate = competenciaToDate(firstCompetencia)
      const currentDate = competenciaToDate(currentCompetencia)

      const periodCDI = marketData.cdiData.filter(cdi => {
        const cdiDate = competenciaToDate(cdi.competencia)
        return cdiDate >= firstDate && cdiDate <= currentDate
      })

      if (periodCDI.length > 0) {
        if (currentCompetencia === firstCompetencia) {
          cdiRetorno = periodCDI[0].cdiRate * 100
        } else {
          let accumulatedCDI = 0
          periodCDI.forEach(cdi => {
            accumulatedCDI = (1 + accumulatedCDI) * (1 + cdi.cdiRate) - 1
          })
          cdiRetorno = accumulatedCDI * 100
        }
      }
    }

    // IPCA data
    let ipcaRetorno = null
    if (firstCompetencia && marketData.ipcaData.length > 0) {
      const firstDate = competenciaToDate(firstCompetencia)
      const currentDate = competenciaToDate(currentCompetencia)

      const periodIpca = marketData.ipcaData.filter(ipca => {
        const ipcaDate = competenciaToDate(ipca.competencia)
        return ipcaDate >= firstDate && ipcaDate <= currentDate
      })

      if (periodIpca.length > 0) {
        if (currentCompetencia === firstCompetencia) {
          ipcaRetorno = periodIpca[0].monthlyRate * 100
        } else {
          let accumulatedIPCA = 0
          periodIpca.forEach(ipca => {
            accumulatedIPCA = (1 + accumulatedIPCA) * (1 + ipca.monthlyRate) - 1
          })
          ipcaRetorno = accumulatedIPCA * 100
        }
      }
    }

    // Target data (IPCA + targetValue)
    let targetRetorno = null
    if (firstCompetencia && targetValue > 0 && marketData.ipcaData.length > 0) {
      const firstDate = competenciaToDate(firstCompetencia)
      const currentDate = competenciaToDate(currentCompetencia)

      const periodIpca = marketData.ipcaData.filter(ipca => {
        const ipcaDate = competenciaToDate(ipca.competencia)
        return ipcaDate >= firstDate && ipcaDate <= currentDate
      })

      if (periodIpca.length > 0) {
        let accumulatedTarget = 0
        periodIpca.forEach(ipca => {
          const monthlyIpca = ipca.monthlyRate
          // Calculate monthly target: (1 + IPCA) * (1 + target/12) - 1
          const monthlyTargetRate = Math.pow(1 + targetValue, 1/12) - 1
          const monthlyTarget = monthlyIpca + monthlyTargetRate
          accumulatedTarget = (1 + accumulatedTarget) * (1 + monthlyTarget) - 1
        })
        targetRetorno = accumulatedTarget * 100
      }
    }

    return {
      ...point,
      cdiRetorno,
      targetRetorno,
      ipcaRetorno
    }
  })

  // Calculate optimal Y axis scale
  const portfolioValues = chartDataWithIndicators.map(item => item.retornoAcumulado)
  const cdiValues = chartDataWithIndicators.map(item => item.cdiRetorno).filter(v => v !== null && v !== 0) as number[]
  const targetValues = chartDataWithIndicators.map(item => item.targetRetorno).filter(v => v !== null && v !== 0) as number[]
  const ipcaValues = chartDataWithIndicators.map(item => item.ipcaRetorno).filter(v => v !== null && v !== 0) as number[]

  let allValues = [...portfolioValues]
  if (selectedIndicators.cdi) allValues = [...allValues, ...cdiValues]
  if (selectedIndicators.target) allValues = [...allValues, ...targetValues]
  if (selectedIndicators.ipca) allValues = [...allValues, ...ipcaValues]

  const minValue = Math.min(...allValues, 0)
  const maxValue = Math.max(...allValues)

  const range = maxValue - minValue
  const buffer = Math.max(range * 0.1, 0.5)
  const yAxisMin = Math.floor((minValue - buffer) * 2) / 2
  const yAxisMax = Math.ceil((maxValue + buffer) * 2) / 2

  const generateTicks = (min: number, max: number) => {
    const range = max - min
    let step
    if (range <= 2) step = 0.25
    else if (range <= 5) step = 0.5
    else if (range <= 10) step = 1
    else if (range <= 20) step = 2
    else step = Math.ceil(range / 10)

    const ticks = []
    for (let i = Math.floor(min / step) * step; i <= max; i += step) {
      ticks.push(Number(i.toFixed(2)))
    }
    return ticks
  }

  const yAxisTicks = generateTicks(yAxisMin, yAxisMax)

  const periodButtons = [
    { id: 'month', label: 'Mês' },
    { id: 'year', label: 'Ano' },
    { id: '12months', label: '12M' },
    { id: 'all', label: 'Ótimo' },
    { id: 'custom', label: 'Personalizado' }
  ]

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (chartDataWithIndicators.length === 0) return null

    const lastDataPoint = chartDataWithIndicators[chartDataWithIndicators.length - 1]
    const portfolioReturn = lastDataPoint.retornoAcumulado
    const cdiReturn = lastDataPoint.cdiRetorno
    const targetReturn = lastDataPoint.targetRetorno
    const ipcaReturn = lastDataPoint.ipcaRetorno

    return {
      portfolioReturn,
      cdiReturn,
      targetReturn,
      ipcaReturn,
      targetDifference: portfolioReturn - (targetReturn || 0),
      ipcaDifference: portfolioReturn - (ipcaReturn || 0),
      cdiRelative: cdiReturn && cdiReturn !== 0 ? (portfolioReturn / cdiReturn) * 100 : null
    }
  }, [chartDataWithIndicators])

  if (consolidatedData.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group px-4 py-2 -ml-4 rounded-lg hover:bg-accent/50 transition-all"
            onClick={() => {
              if (viewMode === 'rentabilidade') setViewMode('patrimonio')
              else if (viewMode === 'patrimonio') setViewMode('crescimento')
              else setViewMode('rentabilidade')
            }}
          >
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md ${
              viewMode === 'rentabilidade' 
                ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700' 
                : viewMode === 'patrimonio' 
                ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700'
                : 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 dark:from-purple-600 dark:via-purple-700 dark:to-pink-700'
            }`}>
              {viewMode === 'rentabilidade' ? (
                <TrendingUp className="h-6 w-6 text-white" />
              ) : viewMode === 'patrimonio' ? (
                <Wallet className="h-6 w-6 text-white" />
              ) : (
                <BarChart3 className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-foreground text-xl font-semibold">
                {viewMode === 'rentabilidade' ? 'Retorno Acumulado' : viewMode === 'patrimonio' ? 'Seu patrimônio' : 'Crescimento'}
              </CardTitle>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 group-hover:bg-muted transition-colors">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Trocar</span>
              </div>
            </div>
          </div>

          {/* Period Selection and Indicators */}
          <div className="flex items-center gap-2">
            {/* Indicators Selector - only show in rentabilidade mode */}
            {viewMode === 'rentabilidade' && (
              <Popover open={showIndicators} onOpenChange={setShowIndicators}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Indicadores
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-background border-border z-50" align="end">
                  <div className="space-y-3 p-2">
                    <h4 className="font-medium text-sm">Selecionar Indicadores</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cdi"
                          checked={selectedIndicators.cdi}
                          onCheckedChange={(checked) =>
                            setSelectedIndicators(prev => ({ ...prev, cdi: checked as boolean }))
                          }
                        />
                        <label htmlFor="cdi" className="text-sm">CDI</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="target"
                          checked={selectedIndicators.target}
                          onCheckedChange={(checked) =>
                            setSelectedIndicators(prev => ({ ...prev, target: checked as boolean }))
                          }
                        />
                        <label htmlFor="target" className="text-sm">
                          Meta {targetReturnIpcaPlus ? `(${targetReturnIpcaPlus.includes('ipca_plus') ? targetReturnIpcaPlus.replace('ipca_plus_', 'IPCA+').replace('_', '') + '%' : targetReturnIpcaPlus})` : '(Não disponível)'}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ipca"
                          checked={selectedIndicators.ipca}
                          onCheckedChange={(checked) =>
                            setSelectedIndicators(prev => ({ ...prev, ipca: checked as boolean }))
                          }
                        />
                        <label htmlFor="ipca" className="text-sm">IPCA</label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <div className="flex items-center gap-1">
              {viewMode === 'crescimento' && (
                <Button
                  variant={showOnlyRendaGerada ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOnlyRendaGerada(!showOnlyRendaGerada)}
                  className="gap-2 text-xs px-3 py-1 h-8 mr-2"
                >
                  <Wallet className="h-4 w-4" />
                  {showOnlyRendaGerada ? "Ver Tudo" : "Renda Gerada"}
                </Button>
              )}

              {periodButtons.map((button) => (
                <Button
                  key={button.id}
                  variant={selectedPeriod === button.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setSelectedPeriod(button.id as any)
                    if (button.id === 'custom') {
                      setShowCustomSelector(true)
                    }
                  }}
                  className="text-xs px-3 py-1 h-8"
                >
                  {button.label}
                </Button>
              ))}

              {selectedPeriod === 'custom' && (
                <Popover open={showCustomSelector} onOpenChange={setShowCustomSelector}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Competência Inicial</label>
                        <Select value={customStartCompetencia} onValueChange={setCustomStartCompetencia}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a competência inicial" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCompetencias.map((competencia) => (
                              <SelectItem key={competencia} value={competencia}>
                                {formatCompetenciaDisplay(competencia)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Competência Final</label>
                        <Select value={customEndCompetencia} onValueChange={setCustomEndCompetencia}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a competência final" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCompetencias.map((competencia) => (
                              <SelectItem key={competencia} value={competencia}>
                                {formatCompetenciaDisplay(competencia)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-6">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'crescimento' ? (
              <BarChart
                data={growthData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                barGap={8}
              >
                <defs>
                  <linearGradient id="barRendaGerada" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(47 100% 65%)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="hsl(47 95% 55%)" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="barBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  </linearGradient>
                  <linearGradient id="barPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142 50% 50%)" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="hsl(142 45% 42%)" stopOpacity={0.75} />
                  </linearGradient>
                  <linearGradient id="barNegative" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="hsl(0 84% 60%)" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(0 72% 50%)" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.2}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                  tick={{ dy: 10 }}
                  interval={0}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${formatCurrency(0).replace(/[\d,.]/g, '').trim()} ${(value / 1000000).toFixed(1)}M`
                    if (value >= 1000) return `${formatCurrency(0).replace(/[\d,.]/g, '').trim()} ${(value / 1000).toFixed(0)}k`
                    return formatCurrency(value)
                  }}
                  width={70}
                  domain={[0, (dataMax: number) => dataMax * 1.08]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
                    fontSize: '13px',
                    padding: '14px'
                  }}
                  content={(props) => {
                    const { active, payload } = props
                    if (!active || !payload || !payload.length) return null

                    const data = payload[0].payload
                    const isPositive = data.totalGrowth >= 0

                    return (
                      <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
                        fontSize: '13px',
                        padding: '14px',
                        minWidth: '260px'
                      }}>
                        <div style={{
                          color: 'hsl(var(--foreground))',
                          fontWeight: '600',
                          marginBottom: '12px',
                          fontSize: '14px',
                          borderBottom: '1px solid hsl(var(--border))',
                          paddingBottom: '8px'
                        }}>
                          {data.name}
                        </div>
                        <div style={{
                          marginBottom: '10px',
                          padding: '8px',
                          borderRadius: '8px',
                          backgroundColor: 'hsl(var(--muted) / 0.3)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>Patrimônio Inicial</span>
                            <strong style={{ fontSize: '12px' }}>{formatCurrency(data.patrimonioInicial)}</strong>
                          </div>
                          {data.rendaGerada > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'hsl(47 90% 45%)' }}>Renda Gerada</span>
                              <strong style={{ fontSize: '12px', color: 'hsl(47 90% 40%)' }}>{formatCurrency(data.rendaGerada)}</strong>
                            </div>
                          )}
                        </div>
                        <div style={{
                          marginBottom: '10px',
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: isPositive ? 'hsl(142 71% 45% / 0.1)' : 'hsl(0 84% 60% / 0.1)',
                          border: `1px solid ${isPositive ? 'hsl(142 71% 45% / 0.3)' : 'hsl(0 84% 60% / 0.3)'}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: isPositive ? 'hsl(142 71% 35%)' : 'hsl(0 72% 45%)' }}>
                              Crescimento Total
                            </span>
                            <strong style={{
                              fontSize: '14px',
                              color: isPositive ? 'hsl(142 71% 35%)' : 'hsl(0 72% 45%)'
                            }}>
                              {isPositive ? '+' : ''}{formatCurrency(data.totalGrowth)}
                            </strong>
                          </div>
                          <div style={{
                            fontSize: '13px',
                            color: isPositive ? 'hsl(142 71% 35%)' : 'hsl(0 72% 45%)',
                            fontWeight: '700',
                            textAlign: 'right'
                          }}>
                            {isPositive ? '+' : ''}{data.growthPercentage.toFixed(2)}%
                          </div>
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'hsl(var(--muted-foreground))',
                          paddingTop: '10px',
                          borderTop: '1px solid hsl(var(--border))',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Movimentação:</span>
                            <span style={{ fontWeight: '600', color: data.movimentacao >= 0 ? 'hsl(var(--foreground))' : 'hsl(var(--destructive))' }}>
                              {data.movimentacao > 0 ? '+' : ''}{formatCurrency(data.movimentacao)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Ganho Financeiro:</span>
                            <span style={{ fontWeight: '600', color: data.ganhoFinanceiro >= 0 ? 'hsl(142 71% 35%)' : 'hsl(0 72% 45%)' }}>
                              {data.ganhoFinanceiro > 0 ? '+' : ''}{formatCurrency(data.ganhoFinanceiro)}
                            </span>
                          </div>
                          <div style={{
                            marginTop: '6px',
                            paddingTop: '8px',
                            borderTop: '1px solid hsl(var(--border))',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <strong style={{ color: 'hsl(var(--foreground))' }}>Patrimônio Final:</strong>
                            <strong style={{ color: 'hsl(var(--primary))' }}>{formatCurrency(data.patrimonioFinal)}</strong>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 4 }}
                />
                <Bar
                  dataKey="rendaGerada"
                  stackId="a"
                  fill="url(#barRendaGerada)"
                  radius={[0, 0, 6, 6]}
                  maxBarSize={60}
                  hide={showOnlyRendaGerada ? false : false}
                >
                  {showOnlyRendaGerada && (
                    <LabelList
                      dataKey="rendaGerada"
                      position="top"
                      formatter={(value: number) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                        return value.toFixed(0)
                      }}
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        fill: 'hsl(var(--foreground))'
                      }}
                      offset={8}
                    />
                  )}
                </Bar>
                <Bar
                  dataKey="patrimonioBase"
                  stackId="a"
                  fill="url(#barBase)"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={60}
                  hide={showOnlyRendaGerada}
                />
                <Bar
                  dataKey="growth"
                  stackId="a"
                  fill="url(#barPositive)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                  hide={showOnlyRendaGerada}
                />
                <Bar
                  dataKey="negativeGrowth"
                  stackId="a"
                  fill="url(#barNegative)"
                  radius={[0, 0, 6, 6]}
                  maxBarSize={60}
                  hide={showOnlyRendaGerada}
                />
              </BarChart>
            ) : viewMode === 'rentabilidade' ? (
              <LineChart
                data={chartDataWithIndicators}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ dy: 10 }}
                  interval={0}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                  domain={[yAxisMin, yAxisMax]}
                  ticks={yAxisTicks}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
                    fontSize: '13px',
                    padding: '12px'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'retornoAcumulado') {
                      return [`${Number(value).toFixed(2)}%`, 'Portfolio']
                    }
                    if (name === 'cdiRetorno') {
                      return [`${Number(value).toFixed(2)}%`, 'CDI']
                    }
                    if (name === 'targetRetorno') {
                      return [`${Number(value).toFixed(2)}%`, 'Meta']
                    }
                    if (name === 'ipcaRetorno') {
                      return [`${Number(value).toFixed(2)}%`, 'IPCA']
                    }
                    return [`${Number(value).toFixed(2)}%`, name]
                  }}
                  labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                />
                {/* Portfolio Line */}
                <Line
                  type="monotone"
                  dataKey="retornoAcumulado"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))',
                    r: 4
                  }}
                  activeDot={{
                    r: 6,
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 3,
                    stroke: 'hsl(var(--background))'
                  }}
                />
                {selectedIndicators.cdi && (
                  <Line
                    type="monotone"
                    dataKey="cdiRetorno"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={{
                      fill: 'hsl(var(--muted-foreground))',
                      strokeWidth: 1,
                      stroke: 'hsl(var(--background))',
                      r: 3
                    }}
                    activeDot={{
                      r: 5,
                      fill: 'hsl(var(--muted-foreground))',
                      strokeWidth: 2,
                      stroke: 'hsl(var(--background))'
                    }}
                  />
                )}
                {selectedIndicators.target && (
                  <Line
                    type="monotone"
                    dataKey="targetRetorno"
                    stroke="hsl(0 84% 60%)"
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{
                      fill: "hsl(0 84% 60%)",
                      strokeWidth: 1,
                      stroke: 'hsl(var(--background))',
                      r: 3
                    }}
                    activeDot={{
                      r: 5,
                      fill: "hsl(0 84% 60%)",
                      strokeWidth: 2,
                      stroke: 'hsl(var(--background))'
                    }}
                  />
                )}
                {selectedIndicators.ipca && (
                  <Line
                    type="monotone"
                    dataKey="ipcaRetorno"
                    stroke="hsl(var(--info))"
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{
                      fill: 'hsl(var(--info))',
                      strokeWidth: 1,
                      stroke: 'hsl(var(--background))',
                      r: 3
                    }}
                    activeDot={{
                      r: 5,
                      fill: 'hsl(var(--info))',
                      strokeWidth: 2,
                      stroke: 'hsl(var(--background))'
                    }}
                  />
                )}
              </LineChart>
            ) : (
              <LineChart
                data={patrimonioData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ dy: 10 }}
                  interval={0}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => {
                    const symbol = formatCurrency(0).replace(/[\d,.]/g, '').trim()
                    return `${symbol} ${(value / 1000000).toFixed(1)}M`
                  }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
                    fontSize: '13px',
                    padding: '12px'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'patrimonioAplicado') {
                      return [formatCurrency(value), 'Patrimônio Aplicado']
                    }
                    if (name === 'patrimonioAtual') {
                      return [formatCurrency(value), 'Patrimônio']
                    }
                    return [value, name]
                  }}
                  labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                />
                {/* Patrimônio Aplicado Line */}
                <Line
                  type="monotone"
                  dataKey="patrimonioAplicado"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2.5}
                  dot={{
                    fill: 'hsl(var(--muted-foreground))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))',
                    r: 4
                  }}
                  activeDot={{
                    r: 5,
                    fill: 'hsl(var(--muted-foreground))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))'
                  }}
                />
                {/* Patrimônio Atual Line */}
                <Line
                  type="monotone"
                  dataKey="patrimonioAtual"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))',
                    r: 4
                  }}
                  activeDot={{
                    r: 6,
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 3,
                    stroke: 'hsl(var(--background))'
                  }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        {viewMode === 'patrimonio' ? (
          // Modo "Seu patrimônio" - apenas "Efeito bola de neve"
          patrimonioData.length > 1 && (() => {
            const lastDataPoint = patrimonioData[patrimonioData.length - 1]
            const patrimonioAtual = lastDataPoint.patrimonioAtual
            const patrimonioAplicado = lastDataPoint.patrimonioAplicado

            // Efeito bola de neve = Patrimônio Atual / Patrimônio Aplicado
            const snowballEffect = patrimonioAplicado > 0 ?
              (patrimonioAtual / patrimonioAplicado) : 1

            const percentageGain = (snowballEffect - 1) * 100

            return (
              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Efeito bola de neve</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {snowballEffect.toFixed(2)}x
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {percentageGain >= 0 ? '+' : ''}{percentageGain.toFixed(2)}% sobre o patrimônio aplicado
                      </p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      percentageGain >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {percentageGain >= 0 ? '↑' : '↓'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()
        ) : viewMode === 'crescimento' ? (
          // Modo "Crescimento" - crescimento médio e total + renda gerada
          growthData.length > 0 && (() => {
            // Calcular crescimento percentual médio
            const averageGrowthPercentage = growthData.reduce((sum, item) => sum + item.growthPercentage, 0) / growthData.length

            // Calcular crescimento total do período
            const firstPatrimonio = growthData[0]?.patrimonioBase || 0
            const lastPatrimonio = growthData[growthData.length - 1]?.patrimonioFinal || 0
            const periodGrowth = lastPatrimonio - firstPatrimonio
            const periodGrowthPercentage = firstPatrimonio > 0 ? (periodGrowth / firstPatrimonio) * 100 : 0

            // Última renda gerada
            const lastRendaGerada = growthData[growthData.length - 1]?.rendaGerada || 0
            const lastPatrimonioInicial = growthData[growthData.length - 1]?.patrimonioInicial || 0
            const rendaPercentage = lastPatrimonioInicial > 0 ? (lastRendaGerada / lastPatrimonioInicial) * 100 : 0

            // Renda média dos últimos 12 meses
            const last12MonthsData = growthData.slice(-12)
            const averageRenda12M = last12MonthsData.reduce((sum, item) => sum + (item.rendaGerada || 0), 0) / last12MonthsData.length
            const totalRenda12M = last12MonthsData.reduce((sum, item) => sum + (item.rendaGerada || 0), 0)

            return (
              <>
                {!showOnlyRendaGerada && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Crescimento médio</p>
                          <p className="text-2xl font-semibold text-foreground">
                            {averageGrowthPercentage >= 0 ? '+' : ''}{averageGrowthPercentage.toFixed(2)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            por período
                          </p>
                        </div>
                        <div className={`text-sm px-2 py-1 rounded ${
                          averageGrowthPercentage >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {averageGrowthPercentage >= 0 ? '↑' : '↓'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Crescimento total no período</p>
                          <p className="text-2xl font-semibold text-foreground">
                            {periodGrowthPercentage >= 0 ? '+' : ''}{periodGrowthPercentage.toFixed(2)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(periodGrowth)}
                          </p>
                        </div>
                        <div className={`text-sm px-2 py-1 rounded ${
                          periodGrowthPercentage >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {periodGrowthPercentage >= 0 ? '↑' : '↓'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showOnlyRendaGerada && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Última renda gerada</p>
                          <p className="text-2xl font-semibold text-foreground">
                            {formatCurrency(lastRendaGerada)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rendaPercentage.toFixed(2)}% do patrimônio
                          </p>
                        </div>
                        <div className="text-sm px-2 py-1 rounded bg-[hsl(47_100%_65%)]/10" style={{ color: 'hsl(47 90% 40%)' }}>
                          <Wallet className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Renda média (12M)</p>
                          <p className="text-2xl font-semibold text-foreground">
                            {formatCurrency(averageRenda12M)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total: {formatCurrency(totalRenda12M)}
                          </p>
                        </div>
                        <div className="text-sm px-2 py-1 rounded bg-[hsl(47_100%_65%)]/10" style={{ color: 'hsl(47 90% 40%)' }}>
                          <Wallet className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )
          })()
        ) : (
          // Modos "Retorno Acumulado" - todos os bullets
          chartDataWithIndicators.length > 1 && summaryMetrics && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {targetReturnIpcaPlus && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">vs Meta</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {summaryMetrics.targetDifference >= 0 ? '+' : ''}{summaryMetrics.targetDifference.toFixed(2)}pp
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {summaryMetrics.targetDifference >= 0 ? 'acima' : 'abaixo'} da meta ({targetReturnIpcaPlus.includes('ipca_plus') ? targetReturnIpcaPlus.replace('ipca_plus_', 'IPCA+').replace('_', '') + '%' : targetReturnIpcaPlus})
                      </p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      summaryMetrics.targetDifference >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {summaryMetrics.targetDifference >= 0 ? '↑' : '↓'}
                    </div>
                  </div>
                </div>
              )}

              {summaryMetrics.cdiRelative !== null && selectedIndicators.cdi && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">vs CDI</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {summaryMetrics.cdiRelative.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        do retorno do CDI
                      </p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      summaryMetrics.cdiRelative >= 100 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {summaryMetrics.cdiRelative >= 100 ? '↑' : '↓'} {Math.abs(summaryMetrics.cdiRelative - 100).toFixed(1)}pp
                    </div>
                  </div>
                </div>
              )}

              {summaryMetrics.ipcaDifference !== null && selectedIndicators.ipca && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">vs IPCA</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {summaryMetrics.ipcaDifference >= 0 ? '+' : ''}{summaryMetrics.ipcaDifference.toFixed(2)}pp
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {summaryMetrics.ipcaDifference >= 0 ? 'acima' : 'abaixo'} da inflação
                      </p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      summaryMetrics.ipcaDifference >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {summaryMetrics.ipcaDifference >= 0 ? '↑' : '↓'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}

