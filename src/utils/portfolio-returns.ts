import type { PerformanceData } from "@/types/financial"
import { calculateCompoundedRates } from "@/lib/financial-math"

/**
 * Converts a competencia string (MM/YYYY) to a Date object
 */
export function competenciaToDate(competencia: string): Date {
  const [month, year] = competencia.split('/').map(Number)
  return new Date(year, month - 1)
}

/**
 * Safely parses a string to a float number
 */
export function safeParseFloat(value: string | null | undefined): number {
  if (!value) return 0
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Ensures a number is valid (not NaN or Infinity)
 */
export function ensureValidNumber(value: number): number {
  if (isNaN(value) || !isFinite(value)) return 0
  return value
}

/**
 * Normalizes currency string to 'BRL' | 'USD'
 */
export function normalizeCurrency(currency: string | null | undefined): 'BRL' | 'USD' {
  if (currency === 'USD' || currency === 'Dolar') return 'USD'
  return 'BRL'
}

/**
 * Checks if an asset should be excluded from return calculations
 * Excludes Caixa, Proventos, and Cash assets as they don't contribute to portfolio returns
 */
export function shouldExcludeFromReturnCalculation(assetName: string | null | undefined): boolean {
  if (!assetName) return false
  const normalizedName = assetName.toLowerCase().trim()
  return (
    normalizedName === 'caixa' ||
    normalizedName === 'proventos' ||
    normalizedName === 'cash' ||
    normalizedName === 'provento' ||
    normalizedName === 'caixa livre' ||
    normalizedName === 'cash livre'
  )
}

/**
 * Calculates compound return from an array of monthly returns
 */
export function calculateCompoundReturn(returns: number[]): number {
  if (returns.length === 0) return 0
  const validReturns = returns.map(r => ensureValidNumber(r))
  return ensureValidNumber(calculateCompoundedRates(validReturns))
}

/**
 * Gets the most recent period data from performance data array
 */
export function getMostRecentData(data: PerformanceData[]): PerformanceData[] {
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

/**
 * Calculates adjusted return from an asset, preferring yield over rate
 */
export function calculateAdjustedReturn(
  asset: PerformanceData,
  period: string,
  adjustReturnWithFX: (returnPercent: number, competencia: string, originalCurrency: 'BRL' | 'USD') => number
): number {
  const moedaOriginal = normalizeCurrency(asset.currency)
  let rendimentoAjustado = 0
  
  // Prefer yield over rate as yield is already calculated and may be more accurate
  if (asset.yield !== null && asset.yield !== undefined) {
    const yieldValue = safeParseFloat(String(asset.yield))
    rendimentoAjustado = ensureValidNumber(adjustReturnWithFX(yieldValue, period, moedaOriginal))
  } else if (asset.rate) {
    const rateValue = safeParseFloat(asset.rate) / 100
    rendimentoAjustado = ensureValidNumber(adjustReturnWithFX(rateValue, period, moedaOriginal))
  }
  
  return rendimentoAjustado
}

/**
 * Calculates weighted return for a group of assets in a specific period
 */
export function calculateWeightedReturnForPeriod(
  assets: PerformanceData[],
  period: string,
  convertValue: (value: number, competencia: string, originalCurrency: 'BRL' | 'USD') => number,
  adjustReturnWithFX: (returnPercent: number, competencia: string, originalCurrency: 'BRL' | 'USD') => number
): { weightedReturn: number; totalPosition: number } {
  // Filter out cash/liquidity assets
  const filteredAssets = assets.filter(asset => !shouldExcludeFromReturnCalculation(asset.asset))
  
  const weightedReturn = filteredAssets.reduce((sum, asset) => {
    const moedaOriginal = normalizeCurrency(asset.currency)
    const posicaoConvertida = ensureValidNumber(convertValue(asset.position || 0, period, moedaOriginal))
    const rendimentoAjustado = calculateAdjustedReturn(asset, period, adjustReturnWithFX)
    return sum + (rendimentoAjustado * posicaoConvertida)
  }, 0)
  
  const totalPosition = filteredAssets.reduce((sum, asset) => {
    const moedaOriginal = normalizeCurrency(asset.currency)
    return sum + ensureValidNumber(convertValue(asset.position || 0, period, moedaOriginal))
  }, 0)
  
  return { weightedReturn, totalPosition }
}

