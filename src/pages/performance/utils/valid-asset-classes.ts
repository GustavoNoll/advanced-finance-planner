// Chaves padronizadas para classes de ativo (salvas no banco)
export const VALID_ASSET_CLASSES = [
  'cdi_liquidity',
  'cdi_bonds',
  'cdi_funds',
  'inflation_bonds',
  'inflation_funds',
  'pre_fixed_bonds',
  'pre_fixed_funds',
  'multimarket',
  'real_estate_assets',
  'real_estate_funds',
  'stocks_assets',
  'stocks_etfs',
  'stocks_funds',
  'stocks_long_biased',
  'private_equity',
  'foreign_fixed_income',
  'foreign_stocks',
  'coe',
  'crypto',
  'gold',
  'others'
] as const

export type ValidAssetClass = typeof VALID_ASSET_CLASSES[number]

/**
 * Valida se uma classe de ativo é válida
 */
export function isValidAssetClass(classe: string | null | undefined): boolean {
  if (!classe || classe.trim() === '') return false
  return VALID_ASSET_CLASSES.includes(classe as ValidAssetClass)
}

/**
 * Traduz uma chave de classe de ativo para exibição
 * Esta função deve ser usada com i18n para obter a tradução correta
 * @param assetClassKey - A chave padronizada (ex: 'cdi_liquidity')
 * @param t - Função de tradução do i18n
 * @returns A tradução da chave ou a própria chave se não encontrar tradução
 */
export function translateAssetClassForDisplay(
  assetClassKey: string | null | undefined,
  t: (key: string, options?: { defaultValue?: string }) => string
): string {
  if (!assetClassKey) return '-'
  
  // Todas as traduções estão em portfolioPerformance.common.*
  return t(`portfolioPerformance.common.${assetClassKey}`, {
    defaultValue: assetClassKey
  })
}

