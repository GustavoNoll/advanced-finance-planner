import { eventIcons } from "@/constants/events";
import { goalIcons } from "@/constants/goals";

export interface MicroPlanCalculations {
  futureValue: number;
  presentFutureValue: number;
  inflationAdjustedIncome: number;
  requiredMonthlyDeposit: number;
  monthlyDeposit: number;
  desiredIncome: number;
  expectedReturn: number;
  inflation: number;
  returnRate: number;
}

export interface FinancialRecordLink {
  id: string;
  financial_record_id: string;
  item_id: string;
  item_type: 'goal' | 'event';
  allocated_amount: number;
  is_completing: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialRecord {
  id: string;
  user_id: string;
  record_year: number;
  record_month: number;
  starting_balance: number;
  monthly_contribution: number;
  monthly_return: number;
  monthly_return_rate: number;
  ending_balance: number;
  target_rentability?: number;
  growth_percentage?: number;

  created_at?: string;
  updated_at?: string;
  selected_items?: SelectedGoalsEvents;
  links?: FinancialRecordLink[];
}

export interface ChartDataPoint {
  age: string;
  year: number;
  month: MonthNumber;
  actualValue?: number | null;
  projectedValue?: number;
  oldPortfolioValue?: number | null;
  realDataPoint?: boolean;
  realValue?: number;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  broker_id?: string | null;
  is_active?: boolean;
  is_broker?: boolean;
  is_admin?: boolean;
}


export type CreateFinancialRecord = Omit<FinancialRecord, 'id' | 'created_at' | 'updated_at'>;

export type UpdateFinancialRecord = Partial<CreateFinancialRecord>;

export interface InvestmentPlan {
  id: string;
  user_id: string;
  initial_amount: number;
  legacy_amount: number;
  final_age: number;
  limit_age: number;
  monthly_deposit: number;
  inflation: number;
  expected_return: number;
  plan_type: string;
  desired_income: number;
  adjust_contribution_for_inflation: boolean;
  adjust_income_for_inflation: boolean;
  plan_initial_date: string;
  plan_end_accumulation_date: string;
  created_at?: string;
  updated_at?: string;
  currency: 'BRL' | 'USD' | 'EUR';
  old_portfolio_profitability: number | null;
  status: 'active' | 'inactive';
  micro_investment_plans?: MicroInvestmentPlan[];
}

export interface MicroInvestmentPlan {
  id: string;
  life_investment_plan_id: string;
  effective_date: string;
  monthly_deposit: number;
  desired_income: number;
  expected_return: number;
  inflation: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateMicroInvestmentPlan = Omit<MicroInvestmentPlan, 'id' | 'created_at' | 'updated_at'>;

export type UpdateMicroInvestmentPlan = Partial<CreateMicroInvestmentPlan>;

export interface MonthlyMetrics {
  total_contribution: number;
  total_return: number;
  average_return_rate: number;
  growth_percentage: number;
}

export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Goal {
  id: string;
  type?: 'goal'
  profile_id: string;
  icon: keyof typeof goalIcons;
  asset_value: number;
  month: MonthNumber;
  year: number;
  payment_mode: 'none' | 'installment' | 'repeat';
  installment_count?: number;
  installment_interval?: number;
  name: string;
  status?: 'pending' | 'completed';
  created_at?: string;
  updated_at?: string;
  description?: string;
  financial_links?: FinancialRecordLink[];
}

export type CreateGoal = Omit<Goal, 'id' | 'created_at' | 'updated_at'>;

export type UpdateGoal = Partial<CreateGoal>;

export interface ProjectedEvent {
  id: string;
  type?: 'event'
  profile_id: string;
  name: string;
  asset_value: number;
  payment_mode: 'none' | 'installment' | 'repeat';
  installment_count?: number;
  installment_interval?: number;
  icon: keyof typeof eventIcons;
  status: 'pending' | 'completed';
  month: MonthNumber;
  year: number;
  created_at?: string;
  updated_at?: string;
  financial_links?: FinancialRecordLink[];
}

export interface SelectedGoalsEvents {
  goals: string[];
  events: string[];
  totalValue: number;
}

export type BaseFormValues = {
  name: string;
  month: string;
  year: string;
  icon: string;
  asset_value: string;
  payment_mode: 'none' | 'installment' | 'repeat';
  installment_count?: string;
  installment_interval?: string;
};

export type GoalFormValues = BaseFormValues & {
  type: 'goal';
};

export type EventFormValues = BaseFormValues & {
  type: 'event';
};

export type FinancialItemFormValues = GoalFormValues | EventFormValues;

export type ChartFormValues = {
  name: string;
  amount: number;
  date: string;
  type: 'goal' | 'event';
  icon: string;
  asset_value: number;
  month: number;
  year: number;
  payment_mode?: 'none' | 'installment' | 'repeat';
  installment_count?: number;
};

export interface Policy {
  id?: string;
  profile_id?: string;
  created_at?: string;
  updated_at?: string;
  patrimonial_situations?: {
    investments?: {
      properties?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>;
      liquid_investments?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>;
      participations?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>;
      emergency_reserve?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>;
    };
    personal_assets?: {
      properties?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>;
      vehicles?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>;
      valuable_goods?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>;
    };
    liabilities?: {
      financing?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>;
      debts?: Array<{ name: string; value: number; location?: string; description?: string; country?: string }>;
    };
  };
  budgets?: {
    incomes?: Array<{ description: string; amount: number }>;
    expenses?: Array<{ description: string; amount: number }>;
    bonus?: number | null;
    dividends?: number | null;
    savings?: number | null;
  };
  life_information?: {
    life_stage?: string;
    hobbies?: Array<{ name: string }>;
    objectives?: Array<{ name: string }>;
    insurances?: Array<{ type: string; company: string; last_review_date: string }>;
  };
  professional_information?: {
    occupation?: string;
    work_description?: string;
    work_location?: string;
    work_regime?: string;
    tax_declaration_method?: string;
  };
  family_structures?: {
    marital_status?: string;
    children?: Array<{ name: string; birth_date: string | Date }>;
  };
  investment_preferences?: {
    risk_profile?: string;
    target_return_review?: string;
    max_bond_maturity?: string;
    fgc_event_feeling?: string;
    max_fund_liquidity?: string;  
    max_acceptable_loss?: string;
    target_return_ipca_plus?: string;
    stock_investment_mode?: string;
    real_estate_funds_mode?: string;
    platforms_used?: Array<{ name: string }>;
    asset_restrictions?: Array<{ name: string }>;
    areas_of_interest?: Array<{ name: string }>;
  };
}
