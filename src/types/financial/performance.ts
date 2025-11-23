export interface ConsolidatedPerformance {
  id: string
  profile_id: string
  created_at: string
  updated_at: string
  institution: string | null
  report_date: string | null
  period: string | null
  initial_assets: number | null
  movement: number | null
  taxes: number | null
  final_assets: number | null
  financial_gain: number | null
  yield: number | null
  currency: string | null
  account_name: string | null
}

export interface PerformanceData {
  id: string
  profile_id: string
  created_at: string
  updated_at: string
  institution: string | null
  report_date: string | null
  asset: string | null
  position: number | null
  asset_class: string | null
  rate: string | null
  maturity_date: string | null
  issuer: string | null
  period: string | null
  yield: number | null
  currency: string | null
  account_name: string | null
}

