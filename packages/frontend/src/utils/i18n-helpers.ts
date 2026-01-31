import type { GroupedStrategyKey } from '@/utils/benchmark-calculator'
import { groupStrategyName } from '@/utils/benchmark-calculator'

/**
 * Funções helper para valores comuns de tradução
 * Centraliza valores que são compartilhados entre diferentes seções
 */

/**
 * Chaves comuns que são compartilhadas entre diferentes seções
 */
const COMMON_KEYS: Record<string, string> = {
  gold: 'portfolioPerformance.common.gold',
  crypto: 'portfolioPerformance.common.crypto',
  coe: 'portfolioPerformance.common.coe',
  others: 'portfolioPerformance.common.others'
}

/**
 * Verifica se uma chave é um valor comum compartilhado
 */
export function isCommonKey(key: string): boolean {
  return key in COMMON_KEYS
}

/**
 * Obtém a chave de tradução para valores comuns
 * @param key - Chave do valor comum ('gold', 'crypto', 'coe', 'others')
 */
export function getCommonTranslationKey(key: string): string | null {
  return COMMON_KEYS[key] || null
}

/**
 * Traduz uma chave, usando common se disponível, senão usa a chave fornecida
 */
export function translateWithCommon(
  t: (key: string) => string,
  key: string,
  fallbackKey: string
): string {
  const commonKey = getCommonTranslationKey(key)
  if (commonKey) {
    return t(commonKey)
  }
  return t(fallbackKey)
}

/**
 * Traduz uma chave de estratégia agrupada usando i18n
 * Todas as traduções estão em portfolioPerformance.common.*
 * 
 * @param key - Chave da estratégia agrupada
 * @param t - Função de tradução do react-i18next
 * @returns Tradução da estratégia agrupada
 */
export function translateGroupedStrategy(
  key: GroupedStrategyKey,
  t: (key: string) => string
): string {
  return t(`portfolioPerformance.common.${key}`)
}

/**
 * Agrupa e traduz o nome de uma estratégia
 * 
 * @param strategy - Nome da estratégia ou asset class (pode ser null)
 * @param t - Função de tradução do react-i18next
 * @returns Tradução da estratégia agrupada
 */
export function groupAndTranslateStrategy(
  strategy: string | null,
  t: (key: string) => string
): string {
  const groupedKey = groupStrategyName(strategy)
  return translateGroupedStrategy(groupedKey, t)
}

