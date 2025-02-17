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
}

export type CreateFinancialRecord = Omit<FinancialRecord, 'id' | 'created_at' | 'updated_at'>;

export type UpdateFinancialRecord = Partial<CreateFinancialRecord>;

export interface InvestmentPlan {
  id: string;
  user_id: string;
  initial_amount: number;
  target_amount: number;
  initial_age: number;
  final_age: number;
  future_value: number;
  monthly_deposit: number;
  inflation: number;
  expected_return: number;
  plan_type: string;
  desired_income: number;
  adjust_contribution_for_inflation: boolean;
  created_at?: string;
  updated_at?: string;
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
  icon: 'house' | 'car' | 'education' | 'retirement' | 'travel' | 'emergency' | 'other';
  asset_value: number;
  month: MonthNumber;
  year: number;
  installment_project: boolean;
  installment_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateGoal = Omit<Goal, 'id' | 'created_at' | 'updated_at'>;

export type UpdateGoal = Partial<CreateGoal>;
