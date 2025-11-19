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
} from '@/lib/bcb-api'
import { calculateCompoundedRates } from '@/lib/financial-math'

export type BenchmarkType = 'CDI' | 'IPCA' | 'US_CPI' | 'EUR_CPI' | 'IRF-M' | 'IFIX' | 'IBOV' | 'SP500' | 'T-Bond' | 'Gold' | 'BTC'

/**
 * Chaves padronizadas para estratégias agrupadas
 * Essas chaves são usadas para tradução via i18n
 */
export type GroupedStrategyKey = 
  | 'postFixedLiquidity'
  | 'postFixed'
  | 'inflation'
  | 'preFixed'
  | 'multimarket'
  | 'realEstate'
  | 'stocks'
  | 'stocksLongBias'
  | 'privateEquity'
  | 'foreignFixedIncome'
  | 'foreignStocks'
  | 'coe'
  | 'gold'
  | 'crypto'
  | 'others'

interface StrategyPattern {
  keywords: string[] // Palavras-chave em português e inglês
  benchmark: {
    BRL: BenchmarkType
    USD: BenchmarkType
    EUR: BenchmarkType
  }
  groupedKey: GroupedStrategyKey // Chave padronizada para agrupamento
}

// Fallback para estratégias não mapeadas
const DEFAULT_BENCHMARK_MAP = {
  BRL: 'CDI',
  USD: 'US_CPI',
  EUR: 'EUR_CPI',
} as const

/**
 * Remove acentos de uma string
 */
function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Normaliza uma string para comparação (remove acentos, converte para minúsculas, remove espaços extras e múltiplos espaços)
 */
function normalizeString(str: string): string {
  return removeAccents(str.toLowerCase().trim().replace(/\s+/g, ' '))
}

/**
 * Normaliza um array de palavras-chave para comparação
 * Remove acentos, converte para minúsculas e remove espaços extras
 */
function normalizeKeywords(keywords: string[]): string[] {
  return keywords.map(keyword => normalizeString(keyword))
}

/**
 * Cria um padrão de estratégia com keywords já normalizadas
 */
function createStrategyPattern(
  keywords: string[],
  benchmark: StrategyPattern['benchmark'],
  groupedKey: GroupedStrategyKey
): StrategyPattern {
  return {
    keywords: normalizeKeywords(keywords),
    benchmark,
    groupedKey,
  }
}

// Mapeamento de padrões de estratégias para benchmarks
// As palavras-chave são normalizadas automaticamente (sem acentos, case-insensitive)
// IMPORTANTE: Padrões mais específicos devem vir primeiro para priorizar matches precisos
const STRATEGY_PATTERNS: StrategyPattern[] = [
  // Exterior - Renda Fixa (mais específico primeiro)
  createStrategyPattern(
    ['exterior - renda fixa', 'foreign - fixed income', 'exterior renda fixa', 'foreign fixed income'],
    { BRL: 'T-Bond', USD: 'T-Bond', EUR: 'T-Bond' },
    'foreignFixedIncome'
  ),
  // Exterior - Ações / Renda Variável (mais específico primeiro)
  createStrategyPattern(
    [
      'exterior - ações',
      'exterior - acoes',
      'exterior - renda variável',
      'exterior - renda variavel',
      'exterior ações',
      'exterior acoes',
      'exterior renda variável',
      'exterior renda variavel',
      'foreign - stocks',
      'foreign - variable income',
      'foreign stocks',
      'foreign variable income',
      'exterior stocks',
      'exterior - stocks',
    ],
    { BRL: 'SP500', USD: 'SP500', EUR: 'SP500' },
    'foreignStocks'
  ),
  // Pós Fixado - Liquidez (mais específico)
  createStrategyPattern(
    ['pós fixado - liquidez', 'pos fixado liquidez', 'post fixed - liquidity', 'post-fixed liquidity', 'pos-fixado liquidez', 'cdi - liquidez'],
    { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
    'postFixedLiquidity'
  ),
  // Ações - Long Bias (mais específico)
  createStrategyPattern(
    ['ações - long bias', 'acoes long bias', 'stocks - long bias', 'stocks long bias', 'long biased', 'long-biased'],
    { BRL: 'IBOV', USD: 'SP500', EUR: 'SP500' },
    'stocksLongBias'
  ),
  // Renda Fixa - Inflação (mais específico)
  createStrategyPattern(
    ['renda fixa - inflação', 'fixed income - inflation', 'renda fixa inflacao', 'inflação - titulos', 'inflação - fundos', 'inflacao titulos', 'inflacao fundos'],
    { BRL: 'IPCA', USD: 'US_CPI', EUR: 'EUR_CPI' },
    'inflation'
  ),
  // Renda Fixa - Pré Fixado (mais específico)
  createStrategyPattern(
    ['renda fixa - pré fixado', 'renda fixa - pre fixado', 'fixed income - pre fixed', 'fixed income - pre-fixed', 'renda fixa pre fixado', 'pré fixado - titulos', 'pré fixado - títulos', 'pré fixado - titulo', 'pré fixado - fundos', 'pre fixado titulos', 'pre fixado titulo', 'pre fixado fundos'],
    { BRL: 'IRF-M', USD: 'T-Bond', EUR: 'T-Bond' },
    'preFixed'
  ),
  // Criptoativos (específico)
  createStrategyPattern(
    ['criptoativos', 'crypto', 'cryptocurrency', 'bitcoin', 'btc'],
    { BRL: 'BTC', USD: 'BTC', EUR: 'BTC' },
    'crypto'
  ),
  // Ouro (específico)
  createStrategyPattern(
    ['ouro', 'gold'],
    { BRL: 'Gold', USD: 'Gold', EUR: 'Gold' },
    'gold'
  ),
  // Private Equity (específico)
  createStrategyPattern(
    ['private equity', 'venture capital', 'special sits'],
    { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
    'privateEquity'
  ),
  // COE (específico)
  createStrategyPattern(
    ['coe'],
    { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
    'coe'
  ),
  // Multimercado (específico)
  createStrategyPattern(
    ['multimercado', 'multimarket'],
    { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
    'multimarket'
  ),
  // Imobiliário (geral)
  createStrategyPattern(
    ['imobiliário', 'imobiliario', 'real estate', 'realestate', 'imobiliário - ativos', 'imobiliário - fundos', 'imobiliario ativos', 'imobiliario fundos'],
    { BRL: 'IFIX', USD: 'T-Bond', EUR: 'T-Bond' },
    'realEstate'
  ),
  // Inflação (geral)
  createStrategyPattern(
    ['inflação', 'inflacao', 'inflation'],
    { BRL: 'IPCA', USD: 'US_CPI', EUR: 'EUR_CPI' },
    'inflation'
  ),
  // Pré Fixado (geral)
  createStrategyPattern(
    ['pré fixado', 'pre fixado', 'pre-fixed', 'pre fixed'],
    { BRL: 'IRF-M', USD: 'T-Bond', EUR: 'T-Bond' },
    'preFixed'
  ),
  // Pós Fixado (geral - depois do mais específico)
  createStrategyPattern(
    ['pós fixado', 'pos fixado', 'post fixed', 'post-fixed', 'pos-fixado', 'cdi - fundos', 'cdi - titulos'],
    { BRL: 'CDI', USD: 'US_CPI', EUR: 'EUR_CPI' },
    'postFixed'
  ),
  // Renda Variável (geral)
  createStrategyPattern(
    ['renda variável', 'renda variavel', 'variable income'],
    { BRL: 'IBOV', USD: 'SP500', EUR: 'SP500' },
    'stocks'
  ),
  // Ações / Stocks (geral - último pois pode aparecer em outros contextos)
  createStrategyPattern(
    ['ações', 'acoes', 'stocks', 'ações - ativos', 'ações - fundos', 'ações - etfs', 'acoes ativos', 'acoes fundos', 'acoes etfs'],
    { BRL: 'IBOV', USD: 'SP500', EUR: 'SP500' },
    'stocks'
  ),
]

/**
 * Encontra o padrão de estratégia correspondente usando match flexível
 * Suporta nomes em português e inglês com variações
 * A ordem dos padrões é importante: mais específicos primeiro
 * As comparações são case-insensitive e ignoram acentos
 * 
 * @returns O padrão encontrado ou null se não houver match
 */
function findStrategyPattern(strategyName: string | null): StrategyPattern | null {
  if (!strategyName) return null
  
  const normalizedStrategy = normalizeString(strategyName)
  
  // Tenta fazer match com cada padrão (ordem importa - mais específicos primeiro)
  // As keywords já estão normalizadas, então não precisamos normalizar novamente
  for (const pattern of STRATEGY_PATTERNS) {
    // Verifica se alguma palavra-chave do padrão está contida no nome da estratégia
    const hasMatch = pattern.keywords.some(keyword => {
      // Match exato
      if (normalizedStrategy === keyword) {
        return true
      }
      
      // Match por contenção: verifica se a palavra-chave está contida no nome da estratégia
      // Isso permite matches flexíveis como "Pós Fixado - Liquidez" contendo "pós fixado"
      if (normalizedStrategy.includes(keyword)) {
        return true
      }
      
      return false
    })
    
    if (hasMatch) {
      return pattern
    }
  }
  
  return null
}

/**
 * Encontra o benchmark correspondente para uma estratégia usando match flexível
 * Suporta nomes em português e inglês com variações
 * A ordem dos padrões é importante: mais específicos primeiro
 * As comparações são case-insensitive e ignoram acentos
 */
function findBenchmarkForStrategy(strategyName: string, currency: CurrencyCode): BenchmarkType {
  const pattern = findStrategyPattern(strategyName)
  
  if (pattern) {
    return pattern.benchmark[currency]
  }
  
  // Fallback padrão para estratégias não mapeadas
  return DEFAULT_BENCHMARK_MAP[currency]
}

/**
 * Agrupa o nome de uma estratégia em uma chave padronizada
 * Esta função centraliza a lógica de agrupamento de estratégias
 * e retorna uma chave que pode ser usada para tradução via i18n
 * 
 * @param strategyName - Nome da estratégia (pode ser null)
 * @returns Chave padronizada para a estratégia agrupada
 * 
 * @example
 * groupStrategyName('CDI - Liquidez') // 'postFixedLiquidity'
 * groupStrategyName('Ações - Long Bias') // 'stocksLongBias'
 * groupStrategyName(null) // 'others'
 */
export function groupStrategyName(strategyName: string | null): GroupedStrategyKey {
  const pattern = findStrategyPattern(strategyName)
  return pattern?.groupedKey || 'others'
}

/**
 * Ordem padrão das estratégias agrupadas
 * Esta ordem é usada para ordenação consistente em todos os componentes
 */
export const STRATEGY_ORDER: GroupedStrategyKey[] = [
  'postFixedLiquidity',
  'postFixed',
  'inflation',
  'preFixed',
  'multimarket',
  'realEstate',
  'stocks',
  'stocksLongBias',
  'privateEquity',
  'foreignFixedIncome',
  'foreignStocks',
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
  postFixedLiquidity: '#3b82f6',    // Blue
  postFixed: '#10b981',              // Emerald
  inflation: '#f59e0b',              // Amber
  preFixed: '#ef4444',               // Red
  multimarket: '#8b5cf6',            // Violet
  realEstate: '#06b6d4',             // Cyan
  stocks: '#ec4899',                 // Pink
  stocksLongBias: '#14b8a6',         // Teal
  privateEquity: '#f97316',          // Orange
  foreignFixedIncome: '#84cc16',     // Lime
  foreignStocks: '#6366f1',          // Indigo
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
  postFixedLiquidity: 'hsl(210 16% 82%)',  // Light blue-gray
  postFixed: 'hsl(32 25% 72%)',           // Light beige
  inflation: 'hsl(45 20% 85%)',          // Very light beige
  preFixed: 'hsl(210 11% 71%)',           // Medium gray
  multimarket: 'hsl(210 16% 58%)',        // Darker gray
  realEstate: 'hsl(207 26% 50%)',         // Blue-gray
  stocks: 'hsl(158 64% 25%)',             // Dark forest green
  stocksLongBias: 'hsl(159 61% 33%)',     // Medium forest green
  privateEquity: 'hsl(210 29% 24%)',      // Dark blue-gray
  foreignFixedIncome: 'hsl(25 28% 53%)',  // Medium brown
  foreignStocks: 'hsl(40 23% 77%)',      // Light tan
  coe: 'hsl(210 14% 53%)',                // Medium blue-gray
  gold: 'hsl(35 31% 65%)',                // Warm beige
  crypto: 'hsl(210 24% 40%)',             // Darker blue-gray
  others: 'hsl(210 16% 58%)',             // Default gray
}

const GROUPED_STRATEGY_BENCHMARK: Record<GroupedStrategyKey, BenchmarkType> = {
  postFixedLiquidity: 'CDI',
  postFixed: 'CDI',
  inflation: 'IPCA',
  preFixed: 'IRF-M',
  multimarket: 'CDI',
  realEstate: 'IFIX',
  stocks: 'IBOV',
  stocksLongBias: 'IBOV',
  privateEquity: 'CDI',
  foreignFixedIncome: 'T-Bond',
  foreignStocks: 'SP500',
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
  const benchmarkName = getBenchmarkName(benchmarkType, locale)
  const prefix = benchmarkType === 'CDI' ? '%' : '±'
  return `${prefix} ${benchmarkName}`
}

export interface BenchmarkData {
  name: string
  nameEn: string
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
 * Busca dados históricos do benchmark
 */
function fetchBenchmarkData(
  benchmarkType: BenchmarkType,
  startDate: string,
  endDate: string
): Array<{ date: Date; return: number }> {
  switch (benchmarkType) {
    case 'CDI': {
      return fetchCDIRates(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // CDI já vem em percentual
      }))
    }
    
    case 'IPCA': {
      return fetchIPCARates(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // IPCA já vem em percentual
      }))
    }
    
    case 'US_CPI': {
      return fetchUSCPIRates(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // US CPI já vem em percentual
      }))
    }
    
    case 'EUR_CPI': {
      return fetchEuroCPIRates(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // Euro CPI já vem em percentual
      }))
    }
    
    case 'IBOV': {
      // IBOV já vem como variação mensal percentual (calculada ao salvar)
      return fetchIBOVRates(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // IBOV já vem em percentual
      }))
    }
    
    case 'SP500': {
      return fetchSP500Prices(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate/100, // SP500 já vem em percentual
      })) 
    }
    
    case 'T-Bond': {
      return fetchTBondPrices(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // T-Bond já vem em percentual
      }))
    }
    
    case 'Gold': {
      return fetchGoldPrices(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // Gold já vem em percentual
      }))
    }

    case "BTC": {
      return fetchBTCPrices(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // BTC já vem em percentual
      }))
    }
    
    case 'IRF-M': {
      return fetchIRFMRates(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // IRF-M já vem em percentual
      }))
    }
    
    case 'IFIX': {
      return fetchIFIXRates(startDate, endDate).map(item => ({
        date: item.date,
        return: item.monthlyRate / 100, // IFIX já vem em percentual
      }))
    }
    
    default:
      return []
  }
}

/**
 * Obtém o nome do benchmark traduzido
 */
function getBenchmarkName(benchmarkType: BenchmarkType, locale: 'pt-BR' | 'en-US'): string {
  const names = {
    pt: {
      CDI: 'CDI',
      IPCA: 'IPCA',
      US_CPI: 'US CPI',
      EUR_CPI: 'Euro CPI',
      'IRF-M': 'IRF-M',
      IFIX: 'IFIX',
      IBOV: 'IBOVESPA',
      SP500: 'S&P 500',
      'T-Bond': 'T-Bond 10Y',
      Gold: 'Ouro',
      BTC: 'Bitcoin',
    },
    en: {
      CDI: 'CDI',
      IPCA: 'IPCA',
      US_CPI: 'US CPI',
      EUR_CPI: 'Euro CPI',
      'IRF-M': 'IRF-M',
      IFIX: 'IFIX',
      IBOV: 'IBOVESPA',
      SP500: 'S&P 500',
      'T-Bond': 'T-Bond 10Y',
      Gold: 'Gold',
      BTC: 'Bitcoin',
    },
  }
  
  const lang = locale === 'pt-BR' ? 'pt' : 'en'
  return names[lang][benchmarkType] || benchmarkType
}

/**
 * Obtém o benchmark correto para uma estratégia agrupada baseado no currency
 * Esta função centraliza a lógica de seleção de benchmark por currency
 */
function getBenchmarkForGroupedStrategy(
  groupedKey: GroupedStrategyKey,
  currency: CurrencyCode
): BenchmarkType {
  // Para estratégias que têm benchmarks diferentes por currency, usar o mapeamento do padrão
  const strategyPattern = STRATEGY_PATTERNS.find(pattern => pattern.groupedKey === groupedKey)
  
  if (strategyPattern) {
    return strategyPattern.benchmark[currency]
  }
  
  // Fallback para o mapeamento padrão
  const defaultBenchmark = GROUPED_STRATEGY_BENCHMARK[groupedKey] || 'CDI'
  
  // Se o benchmark padrão não varia por currency, retornar direto
  // Caso contrário, usar o padrão do currency
  if (defaultBenchmark === 'IFIX' && currency !== 'BRL') {
    return 'T-Bond' // IFIX só existe para BRL, usar T-Bond para USD/EUR
  }
  
  if (defaultBenchmark === 'IRF-M' && currency !== 'BRL') {
    return 'T-Bond' // IRF-M só existe para BRL, usar T-Bond para USD/EUR
  }
  
  if (defaultBenchmark === 'IBOV' && currency !== 'BRL') {
    return 'SP500' // IBOV só existe para BRL, usar SP500 para USD/EUR
  }
  
  return defaultBenchmark
}

/**
 * Calcula os retornos do benchmark para os mesmos períodos da estratégia
 * Esta função pode receber tanto o nome da estratégia original quanto o groupedKey
 */
export function calculateBenchmarkReturns(
  strategyName: string,
  currency: CurrencyCode,
  periods: string[],
  locale: 'pt-BR' | 'en-US' = 'pt-BR'
): BenchmarkData | null {
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
  
  // Determina o tipo de benchmark usando match flexível
  const benchmarkType: BenchmarkType = findBenchmarkForStrategy(strategyName, currency)
  
  // Busca os dados históricos do benchmark
  const benchmarkData = fetchBenchmarkData(benchmarkType, startDate, endDate)
  
  if (benchmarkData.length === 0) return null
  
  // Agrupa retornos por período (MM/YYYY)
  const returnsByPeriod = new Map<string, number[]>()
  
  benchmarkData.forEach(item => {
    const periodKey = `${String(item.date.getMonth() + 1).padStart(2, '0')}/${item.date.getFullYear()}`
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
  
  const benchmarkName = getBenchmarkName(benchmarkType, locale)
  
  return {
    name: `± ${benchmarkName}`,
    nameEn: `± ${getBenchmarkName(benchmarkType, 'en-US')}`,
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
 * @param groupedKey - A chave da estratégia agrupada (ex: 'realEstate', 'preFixed')
 * @param currency - A moeda para determinar qual benchmark usar (BRL usa IFIX, USD usa T-Bond, etc.)
 * @param periods - Array de períodos no formato "MM/YYYY"
 * @param locale - Locale para tradução do nome do benchmark
 * @returns Dados do benchmark ou null se não houver dados
 */
export function calculateBenchmarkReturnsByGroupedKey(
  groupedKey: GroupedStrategyKey,
  currency: CurrencyCode,
  periods: string[],
  locale: 'pt-BR' | 'en-US' = 'pt-BR'
): BenchmarkData | null {
  // Determina o tipo de benchmark baseado no groupedKey e currency
  const benchmarkType: BenchmarkType = getBenchmarkForGroupedStrategy(groupedKey, currency)
  const benchmarkName = getBenchmarkName(benchmarkType, locale)
  
  // Sempre retorna pelo menos o nome do benchmark, mesmo sem dados
  if (periods.length === 0) {
    return {
      name: `± ${benchmarkName}`,
      nameEn: `± ${getBenchmarkName(benchmarkType, 'en-US')}`,
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
  
  // Busca os dados históricos do benchmark
  const benchmarkData = fetchBenchmarkData(benchmarkType, startDate, endDate)
  
  // Se não houver dados, retorna o nome do benchmark com retornos null
  if (benchmarkData.length === 0) {
    return {
      name: `± ${benchmarkName}`,
      nameEn: `± ${getBenchmarkName(benchmarkType, 'en-US')}`,
      monthReturn: null,
      yearReturn: null,
      sixMonthsReturn: null,
      twelveMonthsReturn: null,
      inceptionReturn: null,
    }
  }
  
  // Agrupa retornos por período (MM/YYYY)
  const returnsByPeriod = new Map<string, number[]>()
  
  benchmarkData.forEach(item => {
    const periodKey = `${String(item.date.getMonth() + 1).padStart(2, '0')}/${item.date.getFullYear()}`
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
      name: `± ${benchmarkName}`,
      nameEn: `± ${getBenchmarkName(benchmarkType, 'en-US')}`,
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
  
  // benchmarkName já foi declarado no início da função
  return {
    name: `± ${benchmarkName}`,
    nameEn: `± ${getBenchmarkName(benchmarkType, 'en-US')}`,
    monthReturn: lastMonthReturn * 100, // Converte para percentual
    yearReturn: yearReturn * 100,
    sixMonthsReturn: sixMonthsReturn * 100,
    twelveMonthsReturn: twelveMonthsReturn * 100,
    inceptionReturn: inceptionReturn * 100,
  }
}
