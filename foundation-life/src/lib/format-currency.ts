export const CURRENCIES = [
  { code: 'BRL', name: 'Real (BRL)', locale: 'pt-BR' },
  { code: 'USD', name: 'Dólar (USD)', locale: 'en-US' },
  { code: 'EUR', name: 'Euro (EUR)', locale: 'de-DE' },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['code']

export function formatCurrency(value: number, currency: CurrencyCode = 'BRL'): string {
  const config = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0]
  return Math.round(value).toLocaleString(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/** Short format for charts (e.g. 1k, 1.5M) with optional currency symbol prefix */
export function formatCurrencyShort(value: number, currency: CurrencyCode = 'BRL'): string {
  const abs = Math.abs(value)
  let suffix = ''
  if (abs >= 1e6) suffix = (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  else if (abs >= 1e3) suffix = (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
  else suffix = String(Math.round(value))
  const symbols: Record<CurrencyCode, string> = { BRL: 'R$', USD: '$', EUR: '€' }
  return `${symbols[currency]} ${suffix}`
}
