import type { CurrencyCode } from '@/utils/currency'
import {
  fetchCDIRates,
  fetchIPCARates,
  fetchUSCPIRates,
  fetchEuroCPIRates,
  fetchSP500Prices,
  fetchTBondPrices,
  fetchIBOVRates,
  fetchGoldPrices,
  fetchBTCPrices,
  fetchIRFMRates,
  fetchIFIXRates,
  fetchIMABRates,
  fetchIHFARates,
  fetchAGGGPrices,
  fetchMSCIPrices,
  getIndicatorCurrencyConfig,
  getPTAXByCompetencia,
} from '@/lib/bcb-api'
import { calculateCompoundedRates } from '@/lib/financial-math'
import type { ValidAssetClass } from '@/pages/performance/utils/valid-asset-classes'

export type BenchmarkType = 'CDI' | 'IPCA' | 'US_CPI' | 'EUR_CPI' | 'IRF-M' | 'IFIX' | 'IBOV' | 'SP500' | 'T-Bond' | 'Gold' | 'BTC' | 'IMA-B' | 'IHFA' | 'AGGG' | 'MSCI_ACWI'

/**
 * Chaves padronizadas para estratégias agrupadas
 * Essas chaves são baseadas nas chaves de asset class, agrupando _bonds e _funds
 */
export type GroupedStrategyKey = 
  | 'cdi_liquidity'
  | 'cdi'
  | 'inflation'
  | 'pre_fixed'
  | 'multimarket'
  | 'real_estate'
  | 'stocks'
  | 'stocks_long_biased'
  | 'private_equity'
  | 'foreign_fixed_income'
  | 'foreign_stocks'
  | 'coe'
  | 'gold'
  | 'crypto'
  | 'others'

// Fallback para estratégias não mapeadas
const DEFAULT_BENCHMARK_MAP = {
  BRL: 'CDI',
  USD: 'US_CPI',
  EUR: 'EUR_CPI',
} as const

// Mapeamento direto de chaves de asset class para GroupedStrategyKey
// Agrupa _bonds e _funds no mesmo grupo base
const ASSET_CLASS_TO_GROUPED_KEY: Record<ValidAssetClass, GroupedStrategyKey> = {
  'cdi_liquidity': 'cdi_liquidity',
  'cdi_bonds': 'cdi',
  'cdi_funds': 'cdi',
  'inflation_bonds': 'inflation',
  'inflation_funds': 'inflation',
  'pre_fixed_bonds': 'pre_fixed',
  'pre_fixed_funds': 'pre_fixed',
  'multimarket': 'multimarket',
  'real_estate_assets': 'real_estate',
  'real_estate_funds': 'real_estate',
  'stocks_assets': 'stocks',
  'stocks_etfs': 'stocks',
  'stocks_funds': 'stocks',
  'stocks_long_biased': 'stocks_long_biased',
  'private_equity': 'private_equity',
  'foreign_fixed_income': 'foreign_fixed_income',
  'foreign_stocks': 'foreign_stocks',
  'coe': 'coe',
  'crypto': 'crypto',
  'gold': 'gold',
  'others': 'others'
}

/**
 * Agrupa uma classe de ativo (chave padronizada) em uma chave de estratégia agrupada
 * 
 * @param assetClassOrStrategyName - Chave padronizada de asset class (ex: 'cdi_liquidity')
 * @returns Chave padronizada para a estratégia agrupada
 * 
 * @example
 * groupStrategyName('cdi_liquidity') // 'cdi_liquidity'
 * groupStrategyName('pre_fixed_bonds') // 'pre_fixed'
 * groupStrategyName('stocks_long_biased') // 'stocks_long_biased'
 * groupStrategyName(null) // 'others'
 */
export function groupStrategyName(assetClassOrStrategyName: string | null): GroupedStrategyKey {
  if (!assetClassOrStrategyName) return 'others'
  
  // Se é uma chave padronizada, usa mapeamento direto
  if (assetClassOrStrategyName in ASSET_CLASS_TO_GROUPED_KEY) {
    return ASSET_CLASS_TO_GROUPED_KEY[assetClassOrStrategyName as ValidAssetClass]
  }
  
  // Se não for uma chave padronizada, retorna 'others'
  return 'others'
}

/**
 * Encontra o benchmark diretamente a partir de uma chave de asset class padronizada
 * Esta função é mais eficiente quando já temos a chave padronizada
 * 
 * @param assetClassKey - Chave padronizada de asset class (ex: 'cdi_liquidity')
 * @param currency - Moeda para determinar o benchmark correto
 * @returns Tipo de benchmark correspondente
 */
export function findBenchmarkForAssetClass(
  assetClassKey: ValidAssetClass,
  currency: CurrencyCode
): BenchmarkType {
  const groupedKey = ASSET_CLASS_TO_GROUPED_KEY[assetClassKey]
  return getBenchmarkForGroupedStrategy(groupedKey, currency)
}

/**
 * Calcula os retornos do benchmark diretamente a partir de uma chave de asset class padronizada
 * Esta função é mais eficiente quando já temos a chave padronizada, evitando o match flexível
 * 
 * @param assetClassKey - Chave padronizada de asset class (ex: 'cdi_liquidity')
 * @param currency - Moeda para determinar o benchmark correto
 * @param periods - Array de períodos no formato "MM/YYYY"
 * @param locale - Locale para tradução do nome do benchmark
 * @param displayCurrency - Moeda de exibição (opcional, usa currency como padrão)
 * @returns Dados do benchmark ou null se não houver dados
 */
export function calculateBenchmarkReturnsByAssetClass(
  assetClassKey: ValidAssetClass,
  currency: CurrencyCode,
  periods: string[],
  locale: 'pt-BR' | 'en-US' = 'pt-BR',
  displayCurrency?: CurrencyCode
): BenchmarkData | null {
  const groupedKey = ASSET_CLASS_TO_GROUPED_KEY[assetClassKey]
  return calculateBenchmarkReturnsByGroupedKey(groupedKey, currency, periods, locale, displayCurrency)
}

/**
 * Ordem padrão das estratégias agrupadas
 * Esta ordem é usada para ordenação consistente em todos os componentes
 */
export const STRATEGY_ORDER: GroupedStrategyKey[] = [
  'cdi_liquidity',
  'cdi',
  'inflation',
  'pre_fixed',
  'multimarket',
  'real_estate',
  'stocks',
  'stocks_long_biased',
  'private_equity',
  'foreign_fixed_income',
  'foreign_stocks',
  'coe',
  'gold',
  'crypto',
  'others'
]

/**
 * Cores para estratégias agrupadas
 * Mapeia cada chave de estratégia para uma cor específica
 * Usa uma paleta consistente em todos os componentes
 */
export const STRATEGY_COLORS: Record<GroupedStrategyKey, string> = {
  cdi_liquidity: '#3b82f6',    // Blue
  cdi: '#10b981',              // Emerald
  inflation: '#f59e0b',              // Amber
  pre_fixed: '#ef4444',               // Red
  multimarket: '#8b5cf6',            // Violet
  real_estate: '#06b6d4',             // Cyan
  stocks: '#ec4899',                 // Pink
  stocks_long_biased: '#14b8a6',         // Teal
  private_equity: '#f97316',          // Orange
  foreign_fixed_income: '#84cc16',     // Lime
  foreign_stocks: '#6366f1',          // Indigo
  coe: '#22c55e',                    // Green
  gold: '#a855f7',                   // Purple
  crypto: '#eab308',                 // Yellow
  others: '#6b7280',                  // Gray
}

/**
 * Cores alternativas para gráficos (paleta mais suave)
 * Usada em componentes que precisam de cores mais sutis
 */
export const STRATEGY_COLORS_SOFT: Record<GroupedStrategyKey, string> = {
  cdi_liquidity: 'hsl(210 16% 82%)',  // Light blue-gray
  cdi: 'hsl(32 25% 72%)',           // Light beige
  inflation: 'hsl(45 20% 85%)',          // Very light beige
  pre_fixed: 'hsl(210 11% 71%)',           // Medium gray
  multimarket: 'hsl(210 16% 58%)',        // Darker gray
  real_estate: 'hsl(207 26% 50%)',         // Blue-gray
  stocks: 'hsl(158 64% 25%)',             // Dark forest green
  stocks_long_biased: 'hsl(159 61% 33%)',     // Medium forest green
  private_equity: 'hsl(210 29% 24%)',      // Dark blue-gray
  foreign_fixed_income: 'hsl(25 28% 53%)',  // Medium brown
  foreign_stocks: 'hsl(40 23% 77%)',      // Light tan
  coe: 'hsl(210 14% 53%)',                // Medium blue-gray
  gold: 'hsl(35 31% 65%)',                // Warm beige
  crypto: 'hsl(210 24% 40%)',             // Darker blue-gray
  others: 'hsl(210 16% 58%)',             // Default gray
}

// Mapeamento direto de GroupedStrategyKey para benchmarks por currency
const GROUPED_STRATEGY_BENCHMARK_BY_CURRENCY: Record<GroupedStrategyKey, { BRL: BenchmarkType; USD: BenchmarkType; EUR: BenchmarkType }> = {
  cdi_liquidity: { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
  cdi: { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
  inflation: { BRL: 'IMA-B', USD: 'US_CPI', EUR: 'EUR_CPI' },
  pre_fixed: { BRL: 'IRF-M', USD: 'T-Bond', EUR: 'T-Bond' },
  multimarket: { BRL: 'IHFA', USD: 'US_CPI', EUR: 'EUR_CPI' },
  real_estate: { BRL: 'IFIX', USD: 'T-Bond', EUR: 'T-Bond' },
  stocks: { BRL: 'IBOV', USD: 'SP500', EUR: 'SP500' },
  stocks_long_biased: { BRL: 'IBOV', USD: 'SP500', EUR: 'SP500' },
  private_equity: { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
  foreign_fixed_income: { BRL: 'AGGG', USD: 'AGGG', EUR: 'AGGG' },
  foreign_stocks: { BRL: 'MSCI_ACWI', USD: 'MSCI_ACWI', EUR: 'MSCI_ACWI' },
  coe: { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
  gold: { BRL: 'Gold', USD: 'Gold', EUR: 'Gold' },
  crypto: { BRL: 'BTC', USD: 'BTC', EUR: 'BTC' },
  others: { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
}

// Mantido para compatibilidade (usa BRL como padrão)
const GROUPED_STRATEGY_BENCHMARK: Record<GroupedStrategyKey, BenchmarkType> = {
  cdi_liquidity: 'CDI',
  cdi: 'CDI',
  inflation: 'IMA-B',
  pre_fixed: 'IRF-M',
  multimarket: 'IHFA',
  real_estate: 'IFIX',
  stocks: 'IBOV',
  stocks_long_biased: 'IBOV',
  private_equity: 'CDI',
  foreign_fixed_income: 'AGGG',
  foreign_stocks: 'MSCI_ACWI',
  coe: 'CDI',
  gold: 'Gold',
  crypto: 'BTC',
  others: 'CDI',
}

/**
 * Obtém a cor de uma estratégia agrupada
 * 
 * @param key - Chave da estratégia agrupada
 * @param useSoft - Se true, usa a paleta de cores suaves
 * @returns Cor hexadecimal ou HSL
 */
export function getStrategyColor(key: GroupedStrategyKey, useSoft: boolean = false): string {
  return useSoft ? STRATEGY_COLORS_SOFT[key] : STRATEGY_COLORS[key]
}

/**
 * Obtém a ordem de uma estratégia agrupada
 * 
 * @param key - Chave da estratégia agrupada
 * @returns Índice da estratégia na ordem padrão, ou -1 se não encontrada
 */
export function getStrategyOrder(key: GroupedStrategyKey): number {
  return STRATEGY_ORDER.indexOf(key)
}

export function getStrategyBenchmarkLabelByKey(
  key: GroupedStrategyKey,
  locale: 'pt-BR' | 'en-US' = 'pt-BR'
): string {
  const benchmarkType = GROUPED_STRATEGY_BENCHMARK[key] || 'CDI'
  const nameKey = getBenchmarkNameKey(benchmarkType)
  const prefix = benchmarkType === 'CDI' ? '%' : '±'
  // Retorna a chave de i18n - o componente deve usar t() para traduzir
  return `${prefix} ${nameKey}`
}

export interface BenchmarkData {
  nameKey: string // Chave de i18n para tradução do nome do benchmark
  benchmarkType: BenchmarkType // Tipo do benchmark para referência
  monthReturn: number | null
  yearReturn: number | null
  sixMonthsReturn: number | null
  twelveMonthsReturn: number | null
  inceptionReturn: number | null
}

/**
 * Converte período no formato "MM/YYYY" para Date
 */
function periodToDate(period: string): Date {
  const [month, year] = period.split('/').map(Number)
  return new Date(year, month - 1, 1)
}

/**
 * Formata data para formato brasileiro "DD/MM/YYYY"
 */
function formatDateForBCB(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Mapeia BenchmarkType para o nome do indicador usado na configuração
 */
function benchmarkTypeToIndicatorName(benchmarkType: BenchmarkType): string {
  const mapping: Record<BenchmarkType, string> = {
    'CDI': 'cdi',
    'IPCA': 'ipca',
    'US_CPI': 'usCpi',
    'EUR_CPI': 'euroCpi',
    'IRF-M': 'irfm',
    'IFIX': 'ifix',
    'IBOV': 'ibov',
    'SP500': 'sp500',
    'T-Bond': 'tBond',
    'Gold': 'gold',
    'BTC': 'btc',
    'IMA-B': 'imab',
    'IHFA': 'ihfa',
    'AGGG': 'aggg',
    'MSCI_ACWI': 'msciAcwi',
  }
  return mapping[benchmarkType] || 'cdi'
}

/**
 * Obtém competência anterior (mês anterior)
 */
function getPreviousCompetence(competence: string): string {
  const [mes, ano] = competence.split('/').map(Number)
  if (mes === 1) {
    return `12/${ano - 1}`
  }
  const mesAnterior = mes - 1
  return `${String(mesAnterior).padStart(2, '0')}/${ano}`
}

// Cache para getCotacaoByCompetencia
let cachedGetCotacaoByCompetencia: ((competencia: string) => number | null) | null = null

/**
 * Ajusta retorno com efeito cambial baseado na configuração centralizada
 */
function adjustReturnWithFX(
  returnPercent: number,
  benchmarkType: BenchmarkType,
  competence: string,
  displayCurrency: CurrencyCode
): number {
  const indicatorName = benchmarkTypeToIndicatorName(benchmarkType)
  const config = getIndicatorCurrencyConfig(indicatorName)
  
  if (!config) return returnPercent
  
  // Se não precisa ajuste FX, retorna como está
  if (!config.needsFXAdjustment) return returnPercent
  
  // Se a moeda da variação é igual à moeda de exibição, não ajusta
  if (config.variationCurrency === displayCurrency) return returnPercent
  
  // Se é índice, não ajusta
  if (config.variationCurrency === 'INDEX') return returnPercent
  
  // Obter cotações PTAX (cache para evitar múltiplas chamadas)
  if (!cachedGetCotacaoByCompetencia) {
    cachedGetCotacaoByCompetencia = getPTAXByCompetencia()
  }
  const getCotacaoByCompetencia = cachedGetCotacaoByCompetencia
  
  const competenciaAnterior = getPreviousCompetence(competence)
  const cotacaoAtual = getCotacaoByCompetencia(competence)
  const cotacaoAnterior = getCotacaoByCompetencia(competenciaAnterior)
  
  if (!cotacaoAtual || !cotacaoAnterior) {
    return returnPercent
  }
  
  // Variação cambial no mês (decimal, não percentual)
  const fxVariation = (cotacaoAtual - cotacaoAnterior) / cotacaoAnterior
  
  // USD → BRL: Adicionar efeito cambial
  if (config.variationCurrency === 'USD' && displayCurrency === 'BRL') {
    return (1 + returnPercent) * (1 + fxVariation) - 1
  }
  
  // BRL → USD: Remover efeito cambial
  if (config.variationCurrency === 'BRL' && displayCurrency === 'USD') {
    return ((1 + returnPercent) / (1 + fxVariation)) - 1
  }
  
  return returnPercent
}

/**
 * Calcula retornos mensais a partir de preços
 */
function calculateReturnsFromPrices(
  prices: Array<{ date: Date; monthlyRate: number }>
): Array<{ date: Date; return: number }> {
  if (prices.length === 0) return []
  
  const returns: Array<{ date: Date; return: number }> = []
  
  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i].monthlyRate
    const previousPrice = prices[i - 1].monthlyRate
    
    if (previousPrice > 0) {
      const returnRate = (currentPrice - previousPrice) / previousPrice
      returns.push({
        date: prices[i].date,
        return: returnRate,
      })
    }
  }
  
  return returns
}

/**
 * Processa dados de benchmark convertendo para formato padronizado
 * Aplica ajuste FX se necessário baseado na moeda de exibição
 */
function processBenchmarkData(
  data: Array<{ date: Date; monthlyRate: number }>,
  benchmarkType: BenchmarkType,
  displayCurrency?: CurrencyCode
): Array<{ date: Date; return: number; competence: string }> {
  return data.map(item => {
    const competence = `${String(item.date.getMonth() + 1).padStart(2, '0')}/${item.date.getFullYear()}`
    let returnValue = item.monthlyRate / 100 // Dados já vêm em percentual
    
    if (displayCurrency) {
      returnValue = adjustReturnWithFX(returnValue, benchmarkType, competence, displayCurrency)
    }
    
    return {
      date: item.date,
      return: returnValue,
      competence
    }
  })
}

/**
 * Busca dados históricos do benchmark
 * @param benchmarkType - Tipo do benchmark
 * @param startDate - Data inicial (DD/MM/YYYY)
 * @param endDate - Data final (DD/MM/YYYY)
 * @param displayCurrency - Moeda de exibição (opcional, para ajuste FX)
 */
function fetchBenchmarkData(
  benchmarkType: BenchmarkType,
  startDate: string,
  endDate: string,
  displayCurrency?: CurrencyCode
): Array<{ date: Date; return: number; competence: string }> {
  let rawData: Array<{ date: Date; monthlyRate: number }> = []
  
  switch (benchmarkType) {
    case 'CDI':
      rawData = fetchCDIRates(startDate, endDate)
      break
    case 'IPCA':
      rawData = fetchIPCARates(startDate, endDate)
      break
    case 'US_CPI':
      rawData = fetchUSCPIRates(startDate, endDate)
      break
    case 'EUR_CPI':
      rawData = fetchEuroCPIRates(startDate, endDate)
      break
    case 'IBOV':
      rawData = fetchIBOVRates(startDate, endDate)
      break
    case 'SP500':
      rawData = fetchSP500Prices(startDate, endDate)
      break
    case 'T-Bond':
      rawData = fetchTBondPrices(startDate, endDate)
      break
    case 'Gold':
      rawData = fetchGoldPrices(startDate, endDate)
      break
    case 'BTC':
      rawData = fetchBTCPrices(startDate, endDate)
      break
    case 'IRF-M':
      rawData = fetchIRFMRates(startDate, endDate)
      break
    case 'IFIX':
      rawData = fetchIFIXRates(startDate, endDate)
      break
    case 'IMA-B':
      rawData = fetchIMABRates(startDate, endDate)
      break
    case 'IHFA':
      rawData = fetchIHFARates(startDate, endDate)
      break
    case 'AGGG':
      rawData = fetchAGGGPrices(startDate, endDate)
      break
    case 'MSCI_ACWI':
      rawData = fetchMSCIPrices(startDate, endDate)
      break
    default:
      return []
  }
  
  return processBenchmarkData(rawData, benchmarkType, displayCurrency)
}

// Mapeamento de BenchmarkType para chave de i18n
const BENCHMARK_I18N_KEY: Record<BenchmarkType, string> = {
  CDI: 'portfolioPerformance.benchmarks.cdi',
  IPCA: 'portfolioPerformance.benchmarks.ipca',
  US_CPI: 'portfolioPerformance.benchmarks.usCpi',
  EUR_CPI: 'portfolioPerformance.benchmarks.euroCpi',
  'IRF-M': 'portfolioPerformance.benchmarks.irfm',
  IFIX: 'portfolioPerformance.benchmarks.ifix',
  IBOV: 'portfolioPerformance.benchmarks.ibov',
  SP500: 'portfolioPerformance.benchmarks.sp500',
  'T-Bond': 'portfolioPerformance.benchmarks.tBond',
  Gold: 'portfolioPerformance.benchmarks.gold',
  BTC: 'portfolioPerformance.benchmarks.btc',
  'IMA-B': 'portfolioPerformance.benchmarks.imab',
  IHFA: 'portfolioPerformance.benchmarks.ihfa',
  AGGG: 'portfolioPerformance.benchmarks.aggg',
  MSCI_ACWI: 'portfolioPerformance.benchmarks.msciAcwi',
}

/**
 * Obtém a chave de i18n para um benchmark
 */
export function getBenchmarkNameKey(benchmarkType: BenchmarkType): string {
  return BENCHMARK_I18N_KEY[benchmarkType] || 'portfolioPerformance.benchmarks.unknown'
}

/**
 * Obtém o benchmark correto para uma estratégia agrupada baseado no currency
 * Esta função centraliza a lógica de seleção de benchmark por currency
 */
function getBenchmarkForGroupedStrategy(
  groupedKey: GroupedStrategyKey,
  currency: CurrencyCode
): BenchmarkType {
  // Usa mapeamento direto por currency
  const benchmarkMap = GROUPED_STRATEGY_BENCHMARK_BY_CURRENCY[groupedKey]
  return benchmarkMap ? benchmarkMap[currency] : DEFAULT_BENCHMARK_MAP[currency]
}

/**
 * Encontra o benchmark correspondente para uma chave de asset class padronizada
 * 
 * @param strategyNameOrKey - Chave padronizada (ex: 'cdi_liquidity')
 * @param currency - Moeda para determinar o benchmark correto
 * @returns Tipo de benchmark correspondente
 */
function findBenchmarkForStrategy(strategyNameOrKey: string, currency: CurrencyCode): BenchmarkType {
  // Se é uma chave padronizada, usa mapeamento direto
  if (strategyNameOrKey in ASSET_CLASS_TO_GROUPED_KEY) {
    const groupedKey = ASSET_CLASS_TO_GROUPED_KEY[strategyNameOrKey as ValidAssetClass]
    return getBenchmarkForGroupedStrategy(groupedKey, currency)
  }
  
  // Fallback padrão para estratégias não mapeadas
  return DEFAULT_BENCHMARK_MAP[currency]
}

/**
 * Calcula os retornos do benchmark para os mesmos períodos da estratégia
 * Esta função pode receber tanto o nome da estratégia original quanto uma chave padronizada
 * Se receber uma chave padronizada (ValidAssetClass), usa o caminho direto (mais eficiente)
 * Caso contrário, usa match flexível com palavras-chave (backward compatibility)
 * @param displayCurrency - Moeda de exibição (opcional, usa currency como padrão)
 */
export function calculateBenchmarkReturns(
  strategyName: string,
  currency: CurrencyCode,
  periods: string[],
  locale: 'pt-BR' | 'en-US' = 'pt-BR',
  displayCurrency?: CurrencyCode
): BenchmarkData | null {
  // Se é uma chave padronizada, usa o caminho direto (mais eficiente)
  if (strategyName in ASSET_CLASS_TO_GROUPED_KEY) {
    return calculateBenchmarkReturnsByAssetClass(
      strategyName as ValidAssetClass,
      currency,
      periods,
      locale,
      displayCurrency
    )
  }
  
  if (periods.length === 0) return null
  
  // Ordena os períodos cronologicamente
  const sortedPeriods = [...periods].sort((a, b) => {
    const dateA = periodToDate(a)
    const dateB = periodToDate(b)
    return dateA.getTime() - dateB.getTime()
  })
  
  const firstPeriod = sortedPeriods[0]
  const lastPeriod = sortedPeriods[sortedPeriods.length - 1]
  
  const startDate = formatDateForBCB(periodToDate(firstPeriod))
  const endDate = formatDateForBCB(periodToDate(lastPeriod))
  
  // Determina o tipo de benchmark usando match flexível (para valores antigos)
  const benchmarkType: BenchmarkType = findBenchmarkForStrategy(strategyName, currency)
  
  // Usa displayCurrency se fornecido, senão usa currency
  const finalDisplayCurrency = displayCurrency || currency
  
  // Busca os dados históricos do benchmark com ajuste FX se necessário
  const benchmarkData = fetchBenchmarkData(benchmarkType, startDate, endDate, finalDisplayCurrency)
  
  if (benchmarkData.length === 0) return null
  
  // Agrupa retornos por período (MM/YYYY) usando a competence já calculada
  const returnsByPeriod = new Map<string, number[]>()
  
  benchmarkData.forEach(item => {
    const periodKey = item.competence
    if (!returnsByPeriod.has(periodKey)) {
      returnsByPeriod.set(periodKey, [])
    }
    returnsByPeriod.get(periodKey)!.push(item.return)
  })
  
  // Calcula retorno médio por período
  const periodReturns = sortedPeriods.map(period => {
    const periodReturnsList = returnsByPeriod.get(period) || []
    if (periodReturnsList.length === 0) return 0
    return periodReturnsList.reduce((a, b) => a + b, 0) / periodReturnsList.length
  })
  
  if (periodReturns.length === 0) return null
  
  // Calcula os retornos para diferentes janelas de tempo
  const lastMonthReturn = periodReturns[periodReturns.length - 1] || 0
  
  // Retornos do último ano (últimos 12 períodos ou todos se houver menos)
  const lastYearReturns = periodReturns.slice(-12)
  const yearReturn = lastYearReturns.length > 0
    ? calculateCompoundedRates(lastYearReturns) // Já está em decimal (0.05 para 5%)
    : 0
  
  // Retornos dos últimos 6 meses
  const last6Returns = periodReturns.slice(-6)
  const sixMonthsReturn = last6Returns.length > 0
    ? calculateCompoundedRates(last6Returns)
    : 0
  
  // Retornos dos últimos 12 meses
  const last12Returns = periodReturns.slice(-12)
  const twelveMonthsReturn = last12Returns.length > 0
    ? calculateCompoundedRates(last12Returns)
    : 0
  
  // Retorno desde o início (inception)
  const inceptionReturn = periodReturns.length > 0
    ? calculateCompoundedRates(periodReturns)
    : 0
  
  const nameKey = getBenchmarkNameKey(benchmarkType)
  
  return {
    nameKey,
    benchmarkType,
    monthReturn: lastMonthReturn * 100, // Converte para percentual
    yearReturn: yearReturn * 100,
    sixMonthsReturn: sixMonthsReturn * 100,
    twelveMonthsReturn: twelveMonthsReturn * 100,
    inceptionReturn: inceptionReturn * 100,
  }
}

/**
 * Calcula os retornos do benchmark usando o groupedKey diretamente
 * Esta função centraliza toda a lógica de determinação de benchmark baseado no currency
 * 
 * @param groupedKey - A chave da estratégia agrupada (ex: 'real_estate', 'pre_fixed')
 * @param currency - A moeda para determinar qual benchmark usar (BRL usa IFIX, USD usa T-Bond, etc.)
 * @param periods - Array de períodos no formato "MM/YYYY"
 * @param locale - Locale para tradução do nome do benchmark
 * @param displayCurrency - Moeda de exibição (opcional, usa currency como padrão)
 * @returns Dados do benchmark ou null se não houver dados
 */
export function calculateBenchmarkReturnsByGroupedKey(
  groupedKey: GroupedStrategyKey,
  currency: CurrencyCode,
  periods: string[],
  locale: 'pt-BR' | 'en-US' = 'pt-BR',
  displayCurrency?: CurrencyCode
): BenchmarkData | null {
  // Determina o tipo de benchmark baseado no groupedKey e currency
  const benchmarkType: BenchmarkType = getBenchmarkForGroupedStrategy(groupedKey, currency)
  const nameKey = getBenchmarkNameKey(benchmarkType)
  
  // Sempre retorna pelo menos o nome do benchmark, mesmo sem dados
  if (periods.length === 0) {
    return {
      nameKey,
      benchmarkType,
      monthReturn: null,
      yearReturn: null,
      sixMonthsReturn: null,
      twelveMonthsReturn: null,
      inceptionReturn: null,
    }
  }
  
  // Ordena os períodos cronologicamente
  const sortedPeriods = [...periods].sort((a, b) => {
    const dateA = periodToDate(a)
    const dateB = periodToDate(b)
    return dateA.getTime() - dateB.getTime()
  })
  
  const firstPeriod = sortedPeriods[0]
  const lastPeriod = sortedPeriods[sortedPeriods.length - 1]
  
  const startDate = formatDateForBCB(periodToDate(firstPeriod))
  const endDate = formatDateForBCB(periodToDate(lastPeriod))
  
  // Usa displayCurrency se fornecido, senão usa currency
  const finalDisplayCurrency = displayCurrency || currency
  
  // Busca os dados históricos do benchmark com ajuste FX se necessário
  const benchmarkData = fetchBenchmarkData(benchmarkType, startDate, endDate, finalDisplayCurrency)
  
  // Se não houver dados, retorna o nome do benchmark com retornos null
  if (benchmarkData.length === 0) {
    return {
      nameKey,
      benchmarkType,
      monthReturn: null,
      yearReturn: null,
      sixMonthsReturn: null,
      twelveMonthsReturn: null,
      inceptionReturn: null,
    }
  }
  
  // Agrupa retornos por período (MM/YYYY) usando a competence já calculada
  const returnsByPeriod = new Map<string, number[]>()
  
  benchmarkData.forEach(item => {
    const periodKey = item.competence
    if (!returnsByPeriod.has(periodKey)) {
      returnsByPeriod.set(periodKey, [])
    }
    returnsByPeriod.get(periodKey)!.push(item.return)
  })
  
  // Calcula retorno médio por período
  const periodReturns = sortedPeriods.map(period => {
    const periodReturnsList = returnsByPeriod.get(period) || []
    if (periodReturnsList.length === 0) return 0
    return periodReturnsList.reduce((a, b) => a + b, 0) / periodReturnsList.length
  })
  
  // Se não houver retornos calculados, retorna o nome do benchmark com retornos null
  if (periodReturns.length === 0) {
    return {
      nameKey,
      benchmarkType,
      monthReturn: null,
      yearReturn: null,
      sixMonthsReturn: null,
      twelveMonthsReturn: null,
      inceptionReturn: null,
    }
  }
  
  // Calcula os retornos para diferentes janelas de tempo
  const lastMonthReturn = periodReturns[periodReturns.length - 1] || 0
  
  // Retornos do último ano (últimos 12 períodos ou todos se houver menos)
  const lastYearReturns = periodReturns.slice(-12)
  const yearReturn = lastYearReturns.length > 0
    ? calculateCompoundedRates(lastYearReturns) // Já está em decimal (0.05 para 5%)
    : 0
  
  // Retornos dos últimos 6 meses
  const last6Returns = periodReturns.slice(-6)
  const sixMonthsReturn = last6Returns.length > 0
    ? calculateCompoundedRates(last6Returns)
    : 0
  
  // Retornos dos últimos 12 meses
  const last12Returns = periodReturns.slice(-12)
  const twelveMonthsReturn = last12Returns.length > 0
    ? calculateCompoundedRates(last12Returns)
    : 0
  
  // Retorno desde o início (inception)
  const inceptionReturn = periodReturns.length > 0
    ? calculateCompoundedRates(periodReturns)
    : 0
  
  return {
    nameKey,
    benchmarkType,
    monthReturn: lastMonthReturn * 100, // Converte para percentual
    yearReturn: yearReturn * 100,
    sixMonthsReturn: sixMonthsReturn * 100,
    twelveMonthsReturn: twelveMonthsReturn * 100,
    inceptionReturn: inceptionReturn * 100,
  }
}
