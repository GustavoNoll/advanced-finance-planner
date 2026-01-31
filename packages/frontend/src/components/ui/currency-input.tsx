import CurrencyInputLib from 'react-currency-input-field'
import { CurrencyCode, getCurrencySymbol, CURRENCY_LOCALES } from '@/utils/currency'
import type { CurrencyInputProps } from 'react-currency-input-field'

interface CurrencyInputWrapperProps extends Omit<CurrencyInputProps, 'value' | 'defaultValue' | 'prefix'> {
  value?: number | string
  defaultValue?: number | string
  currency?: CurrencyCode
  prefix?: string
  keyPrefix?: string
  id?: string
  decimalSeparator?: string
  groupSeparator?: string
}

/**
 * Gets the decimal and group separators based on currency locale
 */
function getSeparatorsForCurrency(currency: CurrencyCode): { decimalSeparator: string; groupSeparator: string } {
  const locale = CURRENCY_LOCALES[currency] || CURRENCY_LOCALES.BRL
  
  // Get separators based on locale
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  
  // Create a sample number to detect separators
  const parts = formatter.formatToParts(1234567.89)
  const groupSeparator = parts.find(p => p.type === 'group')?.value || '.'
  const decimalSeparator = parts.find(p => p.type === 'decimal')?.value || ','
  
  return { decimalSeparator, groupSeparator }
}

/**
 * Wrapper component for CurrencyInput with locale-aware formatting
 * Uses defaultValue by default to allow proper decimal separator input without blocking
 */
export function CurrencyInput({
  value,
  defaultValue,
  currency = 'BRL',
  keyPrefix,
  prefix,
  decimalSeparator: customDecimalSeparator,
  groupSeparator: customGroupSeparator,
  decimalsLimit = 2,
  allowDecimals = true,
  onValueChange,
  id,
  ...props
}: CurrencyInputWrapperProps) {
  const currencyPrefix = prefix ?? getCurrencySymbol(currency)
  
  // Get separators based on currency if not explicitly provided
  const separators = customDecimalSeparator && customGroupSeparator
    ? { decimalSeparator: customDecimalSeparator, groupSeparator: customGroupSeparator }
    : getSeparatorsForCurrency(currency)
  
  // Use defaultValue to allow component to manage its own state during typing
  // This prevents the component from reformatting and blocking decimal separator input
  const finalDefaultValue = defaultValue ?? value
  const finalValue = defaultValue !== undefined ? undefined : value
  
  // Generate key for remounting when item changes (useful for edit dialogs)
  // Use only keyPrefix if provided, not the value or id, to avoid remounting during typing
  // The keyPrefix should include the item id when passed from parent component
  const inputKey = keyPrefix

  return (
    <CurrencyInputLib
      {...props}
      id={id}
      key={inputKey}
      prefix={currencyPrefix}
      decimalSeparator={separators.decimalSeparator}
      groupSeparator={separators.groupSeparator}
      decimalsLimit={decimalsLimit}
      allowDecimals={allowDecimals}
      value={finalValue}
      defaultValue={finalDefaultValue}
      onValueChange={onValueChange}
    />
  )
}

