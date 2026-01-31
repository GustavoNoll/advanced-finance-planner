import type { ConsolidatedPerformance, PerformanceData } from '@/types/financial'

export interface VerificationResult {
  status: 'match' | 'tolerance' | 'mismatch' | 'no-data'
  consolidatedValue: number
  detailedSum: number
  difference: number
  detailedCount: number
  unclassifiedCount: number
  hasUnclassified: boolean
  missingYieldCount: number
  hasMissingYield: boolean
}

export interface Filter {
  id: string
  field: string
  operator: string
  value: string | number | string[]
}

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterableField {
  key: string
  label: string
  type: 'text' | 'number'
  options?: string[]
}

export interface CalculatorMode {
  mode: 'auto' | 'manual' | 'custom' | 'market'
  context: 'bulk' | 'single'
}

export interface ManualCalcData {
  competencia: string
  indexador: 'CDI' | 'IPCA' | 'PRE'
  percentual: number
  cdiOperacao: '%' | '+'
  ipcaOperacao: '+'
}

export interface CustomCalcData {
  valorInicial: number
  competencia: string
  indexador: 'CDI' | 'IPCA' | 'PRE' | 'MANUAL'
  cdiOperacao: '%' | '+'
  percentual: number
}

export interface CustomCalcResults {
  percentual: number
  ganhoFinanceiro: number
  valorFinal: number
}

export interface MarketCalcData {
  competencia: string
  ticker: string
}

export interface MarketCalcResult {
  monthlyReturn: number
  startPrice: number
  endPrice: number
  ticker: string
}

export interface VerificationSettings {
  toleranceValue: number
  correctThreshold: number
}

export type ConsolidatedRow = ConsolidatedPerformance
export type PerformanceRow = PerformanceData

