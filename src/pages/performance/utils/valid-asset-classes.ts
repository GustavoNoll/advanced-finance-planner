// Chaves padronizadas para classes de ativo (salvas no banco)
// Ordem definida conforme especificação do usuário
export const VALID_ASSET_CLASSES = [
  'cdi_liquidity',           // CDI - Liquidez
  'cdi_bonds',               // CDI - Titulos
  'cdi_funds',               // CDI - Fundos
  'inflation_bonds',         // Inflação - Titulos
  'inflation_funds',         // Inflação - Fundos
  'pre_fixed_bonds',         // Pré Fixado - Titulos
  'pre_fixed_funds',         // Pré Fixado - Fundos
  'multimarket',             // Multimercado
  'real_estate_assets',      // Imobiliário - Ativos
  'real_estate_funds',       // Imobiliário - Fundos
  'stocks_assets',           // Ações - Ativos
  'stocks_etfs',             // Ações - ETFs
  'stocks_funds',            // Ações - Fundos
  'stocks_long_biased',     // Ações - Long Biased
  'private_equity',          // Private Equity/Venture Capital/ Special Sits
  'foreign_fixed_income',    // Exterior - Renda Fixa
  'foreign_stocks',          // Exterior - Ações
  'coe',                     // COE
  'crypto',                  // Criptoativos
  'gold',                    // Ouro
  'others'                  // Outros
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

