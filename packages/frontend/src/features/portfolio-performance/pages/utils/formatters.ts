import type { CurrencyCode } from '@/utils/currency'

export function formatCurrency(value?: number | null, currency: CurrencyCode = 'BRL'): string {
  const currencyCode = currency === 'USD' ? 'USD' : currency === 'EUR' ? 'EUR' : 'BRL'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  }).format(Number(value || 0))
}

export function formatPercentage(value?: number | null): string {
  return ((value || 0) * 100).toFixed(2).replace('.', ',') + '%'
}

export function parseBrazilianNumber(value: string): number {
  if (!value || value.trim() === '') return 0
  
  let cleaned = value.trim()
  
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '')
    cleaned = cleaned.replace(',', '.')
  }
  
  const numericValue = parseFloat(cleaned)
  return isNaN(numericValue) ? 0 : numericValue
}

export function formatBrazilianNumber(value: number): string {
  const parts = value.toFixed(2).split('.')
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const decimalPart = parts[1]
  return `${integerPart},${decimalPart}`
}

