import { MonthNumber } from '../common'
import { SelectedGoalsEvents } from './goals-events'
import { FinancialRecordLink } from './links'

export interface FinancialRecord {
  id: string
  user_id: string
  record_year: number
  record_month: number
  starting_balance: number
  monthly_contribution: number
  monthly_return: number
  monthly_return_rate: number
  ending_balance: number
  target_rentability?: number
  growth_percentage?: number
  created_at?: string
  updated_at?: string
  selected_items?: SelectedGoalsEvents
  links?: FinancialRecordLink[]
}

export interface ChartDataPoint {
  age: string
  year: number
  month: MonthNumber
  actualValue?: number | null
  projectedValue?: number
  oldPortfolioValue?: number | null
  realDataPoint?: boolean
  realValue?: number
}

export type CreateFinancialRecord = Omit<FinancialRecord, 'id' | 'created_at' | 'updated_at'>

export type UpdateFinancialRecord = Partial<CreateFinancialRecord>

