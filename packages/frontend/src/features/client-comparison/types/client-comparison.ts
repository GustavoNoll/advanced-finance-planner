import type {
  InvestmentPlan,
  MicroInvestmentPlan,
  FinancialRecord,
  Profile,
  Goal,
  ProjectedEvent,
} from '@/types/financial'
import type { YearlyProjectionData } from '@/lib/calculations/chart-projections'
import type { ChartDataPoint } from '@/types/financial'
import type { Calculations } from '@/lib/calculations/investmentPlanCalculations'
import type { InvestmentPolicyData } from '@/features/investment-policy/services/investment-policy.service'

export interface ComparisonClientData {
  clientId: string
  profile: Pick<Profile, 'id' | 'name' | 'birth_date'> & { name: string }
  plan: InvestmentPlan
  microPlans: MicroInvestmentPlan[]
  records: FinancialRecord[]
  goals: Goal[]
  events: ProjectedEvent[]
  calculations: Calculations | null
  projectionData: YearlyProjectionData[]
  chartData: ChartDataPoint[]
  investmentPolicy: InvestmentPolicyData | null
}

export interface ClientOption {
  id: string
  name: string
  planId: string
}
