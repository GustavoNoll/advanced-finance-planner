export interface MicroPlanCalculations {
  futureValue: number
  presentFutureValue: number
  inflationAdjustedIncome: number
  requiredMonthlyDeposit: number
  monthlyDeposit: number
  desiredIncome: number
  expectedReturn: number
  inflation: number
  returnRate: number
}

export interface InvestmentPlan {
  id: string
  user_id: string
  initial_amount: number
  legacy_amount: number
  final_age: number
  limit_age: number
  plan_type: string
  adjust_contribution_for_inflation: boolean
  adjust_income_for_inflation: boolean
  plan_initial_date: string
  plan_end_accumulation_date: string
  created_at?: string
  updated_at?: string
  currency: 'BRL' | 'USD' | 'EUR'
  old_portfolio_profitability: number | null
  status: 'active' | 'inactive'
  micro_investment_plans?: MicroInvestmentPlan[]
}

export interface MicroInvestmentPlan {
  id: string
  life_investment_plan_id: string
  effective_date: string
  monthly_deposit: number
  desired_income: number
  expected_return: number
  adjust_contribution_for_accumulated_inflation: boolean
  adjust_income_for_accumulated_inflation: boolean
  inflation: number
  created_at?: string
  updated_at?: string
}

export type CreateInvestmentPlan = Omit<InvestmentPlan, 'id' | 'created_at' | 'updated_at' | 'micro_investment_plans'>

export type UpdateInvestmentPlan = Partial<CreateInvestmentPlan>

export type CreateMicroInvestmentPlan = Omit<MicroInvestmentPlan, 'id' | 'created_at' | 'updated_at'>

export type UpdateMicroInvestmentPlan = Partial<CreateMicroInvestmentPlan>

