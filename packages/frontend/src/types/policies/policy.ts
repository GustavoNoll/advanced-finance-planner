export interface Policy {
  id?: string
  profile_id?: string
  created_at?: string
  updated_at?: string
  patrimonial_situations?: {
    investments?: {
      properties?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>
      liquid_investments?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>
      participations?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>
      emergency_reserve?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>
    }
    personal_assets?: {
      properties?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>
      vehicles?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>
      valuable_goods?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>
    }
    liabilities?: {
      financing?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>
      debts?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>
    }
  }
  budgets?: {
    incomes?: Array<{ description: string; amount: number }>
    expenses?: Array<{ description: string; amount: number }>
    bonus?: number | null
    dividends?: number | null
    savings?: number | null
  }
  life_information?: {
    life_stage?: string
    hobbies?: Array<{ name: string }>
    objectives?: Array<{ name: string }>
    insurances?: Array<{ type: string; company: string; last_review_date: string }>
  }
  professional_information?: {
    occupation?: string
    work_description?: string
    work_location?: string
    work_regime?: string
    tax_declaration_method?: string
  }
  family_structures?: {
    marital_status?: string
    children?: Array<{ name: string; birth_date: string | Date }>
  }
  investment_preferences?: {
    risk_profile?: string
    target_return_review?: string
    max_bond_maturity?: string
    fgc_event_feeling?: string
    max_fund_liquidity?: string
    max_acceptable_loss?: string
    target_return_ipca_plus?: string
    stock_investment_mode?: string
    real_estate_funds_mode?: string
    platforms_used?: Array<{ name: string }>
    asset_restrictions?: Array<{ name: string }>
    areas_of_interest?: Array<{ name: string }>
  }
}

