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
  events_balance: number | null;
  created_at?: string;
  updated_at?: string;
  selected_items?: SelectedGoalsEvents;
}

export interface ChartDataPoint {
  age: string;
  year: number;
  month: MonthNumber;
  actualValue?: number | null;
  projectedValue?: number;
  realDataPoint?: boolean;
  realValue?: number;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
}


export type CreateFinancialRecord = Omit<FinancialRecord, 'id' | 'created_at' | 'updated_at'>;

export type UpdateFinancialRecord = Partial<CreateFinancialRecord>;

export interface InvestmentPlan {
  id: string;
  user_id: string;
  initial_amount: number;
  legacy_amount: number;
  final_age: number;
  future_value: number;
  limit_age: number;
  present_future_value: number;
  monthly_deposit: number;
  inflation: number;
  expected_return: number;
  plan_type: string;
  desired_income: number;
  required_monthly_deposit: number;
  adjust_contribution_for_inflation: boolean;
  adjust_income_for_inflation: boolean;
  plan_initial_date: string;
  plan_end_accumulation_date: string;
  created_at?: string;
  updated_at?: string;
  currency: 'BRL' | 'USD' | 'EUR';
}

export interface MonthlyMetrics {
  total_contribution: number;
  total_return: number;
  average_return_rate: number;
  growth_percentage: number;
}

export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Goal {
  id: string;
  profile_id: string;
  icon: 'house' | 'car' | 'travel' | 'family' | 'electronic' | 'education' | 'hobby' | 'professional' | 'health' | 'other';
  asset_value: number;
  month: MonthNumber;
  year: number;
  installment_project: boolean;
  installment_count?: number;
  name: string;
  status?: 'pending' | 'completed';
  created_at?: string;
  updated_at?: string;
  description?: string;
}

export type CreateGoal = Omit<Goal, 'id' | 'created_at' | 'updated_at'>;

export type UpdateGoal = Partial<CreateGoal>;

export interface ProjectedEvent {
  id: string;
  profile_id: string;
  name: string;
  asset_value: number;
  installment_project: boolean;
  installment_count?: number;
  icon: 'goal' | 'contribution' | 'other';
  status: 'pending' | 'completed';
  month: MonthNumber;
  year: number;
  created_at?: string;
  updated_at?: string;
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
};

export type GoalFormValues = BaseFormValues & {
  type: 'goal';
  installment_project: boolean;
  installment_count?: string;
};

export type EventFormValues = BaseFormValues & {
  type: 'event';
  installment_project: boolean;
  installment_count?: string;
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
  installment_project?: boolean;
  installment_count?: number;
};
