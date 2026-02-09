import { eventIcons } from '@/constants/events'
import { goalIcons } from '@/constants/goals'
import { MonthNumber } from '../common'
import { FinancialRecordLink } from './links'

export interface Goal {
  id: string
  type?: 'goal'
  profile_id: string
  icon: keyof typeof goalIcons
  asset_value: number
  month: MonthNumber
  year: number
  payment_mode: 'none' | 'installment' | 'repeat'
  installment_count?: number
  installment_interval?: number
  name: string
  status?: 'pending' | 'completed'
  created_at?: string
  updated_at?: string
  description?: string
  adjust_for_inflation: boolean
  financial_links?: FinancialRecordLink[]
}

export interface ProjectedEvent {
  id: string
  type?: 'event'
  profile_id: string
  name: string
  asset_value: number
  payment_mode: 'none' | 'installment' | 'repeat'
  installment_count?: number
  installment_interval?: number
  icon: keyof typeof eventIcons
  status: 'pending' | 'completed'
  month: MonthNumber
  year: number
  created_at?: string
  updated_at?: string
  adjust_for_inflation: boolean
  financial_links?: FinancialRecordLink[]
}

export interface SelectedGoalsEvents {
  goals: string[]
  events: string[]
  totalValue: number
}

export type BaseFormValues = {
  name: string
  month: string
  year: string
  icon: string
  asset_value: string
  payment_mode: 'none' | 'installment' | 'repeat'
  installment_count?: string
  installment_interval?: string
  adjust_for_inflation: boolean
}

export type GoalFormValues = BaseFormValues & {
  type: 'goal'
}

export type EventFormValues = BaseFormValues & {
  type: 'event'
}

export type FinancialItemFormValues = GoalFormValues | EventFormValues

export type ChartFormValues = {
  name: string
  amount: number
  date: string
  type: 'goal' | 'event'
  icon: string
  asset_value: number
  month: number
  year: number
  payment_mode?: 'none' | 'installment' | 'repeat'
  installment_count?: number
}

export type CreateGoal = Omit<Goal, 'id' | 'created_at' | 'updated_at'>

export type UpdateGoal = Partial<CreateGoal>

