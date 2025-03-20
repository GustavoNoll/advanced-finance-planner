/**
 * Represents a user's investment profile data
 */
export interface UserProfileInvestment {
  broker_id: string;
  email: string;
  id: string;
  investment_plan_id: string | null;
  is_broker: boolean;
  profile_id: string;
  profile_name: string;
  birth_date: string;
  financial_created_at?: string;
  record_month?: number;
  record_year?: number;
  starting_balance?: number;
  monthly_contribution?: number;
  monthly_return_rate?: number;
  ending_balance?: number;
  growth_percentage?: number;
  target_rentability?: number;
  total_records?: number;
  total_contributions?: number;
  total_returns?: number;
  average_monthly_return_rate?: number;
  last_activity_date?: string;
  is_inactive?: boolean;
  last_plan_review_date?: string;
  next_plan_review_date?: string;
  near_retirement?: boolean;
  below_required_contribution?: boolean;
  needs_plan_review?: boolean;
  months_without_records?: number;
  has_low_returns?: boolean;
}

/**
 * Represents a broker's profile data
 */
export interface BrokerProfile {
  id: string;
  name: string;
}

/**
 * Represents wealth distribution data for charting
 */
export interface WealthDistribution {
  range: string;
  count: number;
  total: number;
}

/**
 * Represents planning metrics data
 */
export interface PlanningMetrics {
  averageAge: number;
  averageRetirementAge: number;
  averageDesiredIncome: number;
  planTypes: {
    type1: number; // End at 120
    type2: number; // Leave inheritance
    type3: number; // Keep principal
  };
}

/**
 * Represents trend metrics data
 */
export interface TrendMetrics {
  newClientsThisMonth: number;
  totalGrowthThisMonth: number;
  averageMonthlyGrowth: number;
  inactiveClients: number;
}

/**
 * Represents action metrics data
 */
export interface ActionMetrics {
  needsPlanReview: number;
  belowRequiredContribution: number;
  nearRetirement: number;
  lowReturns: number;
}

/**
 * Represents all dashboard metrics
 */
export interface DashboardMetrics {
  totalClients: number;
  clientsWithPlan: number;
  clientsWithOutdatedRecords: number;
  totalBalance: number;
  clientsWithActiveRecords: number;
  wealthDistribution: WealthDistribution[];
  planning: PlanningMetrics;
  trends: TrendMetrics;
  actions: ActionMetrics;
} 