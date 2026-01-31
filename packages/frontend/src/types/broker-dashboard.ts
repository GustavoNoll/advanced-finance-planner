/**
 * Represents a user's investment profile data with enhanced metrics
 */
export interface UserProfileInvestment {
  // Basic profile data
  broker_id: string;
  email: string;
  id: string;
  investment_plan_id: string | null;
  is_broker: boolean;
  profile_id: string;
  profile_name: string;
  birth_date: string;
  profile_created_at?: string;
  last_active_at?: string;
  
  // Financial record data
  financial_created_at?: string;
  record_month?: number;
  record_year?: number;
  starting_balance?: number;
  monthly_contribution?: number;
  monthly_return_rate?: number;
  ending_balance?: number;
  growth_percentage?: number;
  target_rentability?: number;
  
  // Enhanced financial metrics
  total_records?: number;
  total_contributions?: number;
  total_returns?: number;
  total_growth?: number;
  average_monthly_return_rate?: number;
  recent_avg_return?: number;
  last_activity_date?: string;
  first_activity_date?: string;
  
  // Performance metrics
  return_volatility?: number;
  worst_month_return?: number;
  best_month_return?: number;
  sharpe_ratio?: number;
  contribution_consistency?: number;
  months_with_contributions?: number;
  avg_contribution_when_contributing?: number;
  
  // Activity and engagement
  activity_status?: 'active' | 'stale' | 'at_risk' | 'inactive';
  days_since_last_activity?: number;
  engagement_score?: number;
  priority_level?: 'urgent' | 'high' | 'medium' | 'low';
  
  // Plan metrics
  last_plan_review_date?: string;
  next_plan_review_date?: string;
  plan_type?: string;
  final_age?: number;
  initial_amount?: number;
  currency?: string;
  current_age?: number;
  years_to_retirement?: number;
  plan_maturity?: 'new' | 'established' | 'mature';
  risk_level?: 'conservative' | 'low_risk' | 'medium_risk' | 'high_risk';
  
  // Micro plan data
  micro_plan_id?: string;
  current_monthly_deposit?: number;
  current_desired_income?: number;
  current_expected_return?: number;
  current_inflation?: number;
  micro_plan_effective_date?: string;
  micro_plan_created_at?: string;
  
  // Legacy fields for backward compatibility
  near_retirement?: boolean;
  below_required_contribution?: boolean;
  needs_plan_review?: boolean;
  months_without_records?: number;
  has_low_returns?: boolean;
  is_inactive?: boolean;
}

/**
 * Represents a broker's profile data
 */
export interface BrokerProfile {
  id: string;
  name: string;
}

/**
 * Enhanced dashboard metrics with advanced analytics
 */
export interface EnhancedDashboardMetrics {
  // Basic metrics
  totalClients: number;
  clientsWithPlan: number;
  clientsWithOutdatedRecords: number;
  totalBalance: number;
  clientsWithActiveRecords: number;
  
  // Performance metrics
  averageReturn: number;
  averageVolatility: number;
  averageSharpeRatio: number;
  totalGrowth: number;
  
  // Client engagement
  averageEngagementScore: number;
  urgentClients: number;
  highPriorityClients: number;
  inactiveClients: number;
  
  // Activity status distribution
  activityDistribution: {
    active: number;
    stale: number;
    atRisk: number;
    inactive: number;
    noRecords: number;
  };
  
  // Age and retirement analysis
  averageAge: number;
  averageYearsToRetirement: number;
  nearRetirementClients: number;
  
  // Plan maturity
  planMaturity: {
    new: number;
    established: number;
    mature: number;
  };
  
  // Activity status
  activityStatus: {
    active: number;
    stale: number;
    atRisk: number;
    inactive: number;
  };
  
  // Wealth distribution
  wealthDistribution: WealthDistribution[];
  
  // Trends
  trends: TrendMetrics;
  
  // Actions needed
  actions: ActionMetrics;
}

/**
 * Wealth distribution data
 */
export interface WealthDistribution {
  range: string;
  count: number;
  total: number;
  percentage: number;
}

/**
 * Trend metrics for historical analysis
 */
export interface TrendMetrics {
  newClientsThisMonth: number;
  totalGrowthThisMonth: number;
  averageMonthlyGrowth: number;
  inactiveClients: number;
  growthRate: number;
  clientRetentionRate: number;
}

/**
 * Action metrics for broker attention
 */
export interface ActionMetrics {
  needsPlanReview: number;
  belowRequiredContribution: number;
  nearRetirement: number;
  lowReturns: number;
  urgentAttention: number;
  highPriority: number;
}

/**
 * Client insight for personalized recommendations
 */
export interface ClientInsight {
  clientId: string;
  clientName: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  insights: string[];
  recommendations: string[];
  riskLevel: 'conservative' | 'low_risk' | 'medium_risk' | 'high_risk';
  engagementScore: number;
  lastActivity: string;
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