import type { ConsolidatedPerformance, PerformanceData } from '@/types/financial'
import { formatMaturityDate } from '@/utils/dateUtils'

export interface InstitutionCardData {
  institutionData: Array<{
    institution: string
    patrimonio: number
    rendimento: number
    percentage: number
    color: string
  }>
  totalPatrimonio: number
}

/**
 * Converte um período (MM/YYYY) para timestamp
 */
export function periodToTimestamp(period?: string | null): number {
  if (!period) return 0
  const [m, y] = period.split('/')
  return new Date(parseInt(y), parseInt(m) - 1).getTime()
}

/**
 * Busca o período mais recente de uma lista de dados
 */
export function getMostRecentPeriod(
  data: Array<{ period?: string | null }>
): string | null {
  const periods = [...new Set(data.map(d => d.period).filter(Boolean) as string[])]
  if (periods.length === 0) return null
  return periods.sort((a, b) => periodToTimestamp(b) - periodToTimestamp(a))[0]
}

/**
 * Calcula dados de alocação por instituição para o período mais recente
 */
export function calculateInstitutionCardData(
  consolidatedData: ConsolidatedPerformance[],
  noInstitutionLabel: string
): InstitutionCardData | null {
  if (!consolidatedData || consolidatedData.length === 0) return null

  const mostRecent = getMostRecentPeriod(consolidatedData)
  if (!mostRecent) return null

  const rows = consolidatedData.filter(r => r.period === mostRecent)
  if (rows.length === 0) return null

  const totalPatrimonio = rows.reduce((s, r) => s + Number(r.final_assets || 0), 0)
  const palette = [
    'hsl(40 22% 80%)',
    'hsl(45 18% 86%)',
    'hsl(210 16% 80%)',
    'hsl(210 14% 75%)',
    'hsl(200 18% 68%)',
    'hsl(160 28% 42%)',
    'hsl(38 20% 76%)',
    'hsl(210 18% 84%)'
  ]

  const byInstitution = rows.reduce((acc, r) => {
    const key = r.institution || noInstitutionLabel
    const entry = acc.get(key) || { patrimonio: 0, rendimentoSum: 0, weight: 0 }
    const pat = Number(r.final_assets || 0)
    entry.patrimonio += pat
    entry.rendimentoSum += Number(r.yield || 0) * pat
    entry.weight += pat
    acc.set(key, entry)
    return acc
  }, new Map<string, { patrimonio: number; rendimentoSum: number; weight: number }>())

  const institutionData = Array.from(byInstitution.entries()).map(([institution, v], idx) => ({
    institution,
    patrimonio: v.patrimonio,
    rendimento: v.weight > 0 ? v.rendimentoSum / v.weight : 0,
    percentage: totalPatrimonio > 0 ? (v.patrimonio / totalPatrimonio) * 100 : 0,
    color: palette[idx % palette.length]
  })).sort((a, b) => b.patrimonio - a.patrimonio)

  return { institutionData, totalPatrimonio }
}

/**
 * Calcula o número de ativos na carteira para o período mais recente
 */
export function calculateDiversificationCount(
  performanceData: PerformanceData[]
): number | null {
  if (!performanceData || performanceData.length === 0) return null

  const mostRecent = getMostRecentPeriod(performanceData)
  if (!mostRecent) return null

  return performanceData.filter(d => d.period === mostRecent).length || null
}

/**
 * Busca a próxima data de vencimento dos ativos
 */
export function getNextMaturityDate(
  performanceData: PerformanceData[]
): Date | null {
  if (!performanceData || performanceData.length === 0) return null

  const mostRecent = getMostRecentPeriod(performanceData)
  if (!mostRecent) return null

  const rows = performanceData
    .filter(d => d.period === mostRecent && d.maturity_date)
    .map(d => new Date(d.maturity_date as string))
    .filter(d => d >= new Date())
    .sort((a, b) => a.getTime() - b.getTime())

  return rows.length > 0 ? rows[0] : null
}

/**
 * Formata valor monetário em BRL
 */
export function formatCurrencyBR(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value)
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}
