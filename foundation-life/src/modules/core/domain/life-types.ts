export interface LifeProfile {
  birthDate: Date
  lifeExpectancyYears: number
}

export interface LifeSettings {
  baseNetWorth: number
  baseMonthlyIncome: number
  baseMonthlyExpenses: number
  monthlyContribution: number
  expectedReturnYearly: number
  inflationYearly: number
  inflateIncome: boolean
  inflateExpenses: boolean
  retirementAge: number
  retirementMonthlyIncome: number
  inflateRetirementIncome: boolean
}

/** Alinhado aos ícones de evento do Foundation Hub (eventIcons em packages/frontend/src/constants/events.ts). */
export type LifeEventType =
  | 'goal'
  | 'contribution'
  | 'car'
  | 'house'
  | 'travel'
  | 'accident'
  | 'renovation'
  | 'other'

/** Micro plano: a partir de effectiveDate vigora esta renda/gastos/aporte (sem usar eventos). */
export interface LifeMicroPlan {
  id: string
  effectiveDate: Date
  monthlyIncome: number
  monthlyExpenses: number
  monthlyContribution: number
}

export interface LifeEvent {
  id: string
  type: LifeEventType
  title: string
  date: Date
  endDate?: Date
  amount: number
  frequency: 'once' | 'monthly' | 'yearly'
  durationMonths?: number
  inflationIndexed: boolean
}

export interface LifeMonthlyPoint {
  date: Date
  age: number
  netWorth: number
  realNetWorth: number
  income: number
  expenses: number
  contribution: number
  returns: number
}

export interface LifeYearlyPoint {
  year: number
  age: number
  netWorth: number
  realNetWorth: number
  income: number
  expenses: number
  contribution: number
  returns: number
}

export interface ProjectionParams {
  profile: LifeProfile
  settings: LifeSettings
  events: LifeEvent[]
  microPlans?: LifeMicroPlan[]
}

export interface ProjectionResult {
  monthly: LifeMonthlyPoint[]
  yearly: LifeYearlyPoint[]
  /** Primeiro mês (índice) em que o patrimônio fica ≤ 0 após o início; null se nunca zerar. */
  firstMonthWithZeroOrNegativeNetWorth: number | null
}

