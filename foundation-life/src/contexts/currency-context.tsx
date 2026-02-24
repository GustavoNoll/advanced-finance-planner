'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { CurrencyCode } from '@/lib/format-currency'

interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({
  currency,
  setCurrency,
  children,
}: {
  currency: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
  children: ReactNode
}) {
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency(): CurrencyCode {
  const ctx = useContext(CurrencyContext)
  return ctx?.currency ?? 'BRL'
}

export function useCurrencySetter(): ((code: CurrencyCode) => void) | undefined {
  return useContext(CurrencyContext)?.setCurrency
}
