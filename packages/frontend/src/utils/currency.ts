/**
 * Maps currency codes to their respective symbols
 */
const CURRENCY_SYMBOLS = {
  BRL: 'R$',
  USD: '$',
  EUR: '€'
} as const;

export type CurrencyCode = keyof typeof CURRENCY_SYMBOLS;

/**
 * Maps currency codes to their respective locales
 */
export const CURRENCY_LOCALES = {
  BRL: 'pt-BR',
  USD: 'en-US',
  EUR: 'de-DE'
} as const;

/**
 * Gets the currency symbol for a given currency code
 * @param currency - The currency code (BRL, USD, EUR)
 * @returns The currency symbol
 */
export const getCurrencySymbol = (currency: CurrencyCode): string => {
  return CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.BRL;
};

/**
 * Formats a number as currency according to the specified currency code
 * @param value - The numeric value to format
 * @param currency - The currency code (BRL, USD, EUR)
 * @param options - Additional Intl.NumberFormat options
 * @returns The formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: CurrencyCode,
  options: Intl.NumberFormatOptions = {}
): string => {
  const symbol = getCurrencySymbol(currency);
  const locale = CURRENCY_LOCALES[currency] || CURRENCY_LOCALES.BRL;
  
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };

  return `${symbol} ${value?.toLocaleString(locale, defaultOptions)}`;
}; 