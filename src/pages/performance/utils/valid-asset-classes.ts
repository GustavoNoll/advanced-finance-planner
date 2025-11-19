export const VALID_ASSET_CLASSES = [
  'CDI - Liquidez',
  'CDI - Titulos',
  'CDI - Fundos',
  'Inflação - Titulos',
  'Inflação - Fundos',
  'Pré Fixado - Titulos',
  'Pré Fixado - Fundos',
  'Multimercado',
  'Imobiliário - Ativos',
  'Imobiliário - Fundos',
  'Ações - Ativos',
  'Ações - ETFs',
  'Ações - Fundos',
  'Ações - Long Biased',
  'Private Equity/Venture Capital/Special Sits',
  'Exterior - Renda Fixa',
  'Exterior - Ações',
  'COE',
  'Criptoativos',
  'Ouro'
] as const

export type ValidAssetClass = typeof VALID_ASSET_CLASSES[number]

export function isValidAssetClass(classe: string | null | undefined): boolean {
  if (!classe || classe.trim() === '') return false
  return VALID_ASSET_CLASSES.includes(classe as ValidAssetClass)
}

