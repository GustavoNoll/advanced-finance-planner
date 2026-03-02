import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { InvestmentPlanService } from '@/features/investment-plans/services/investment-plan.service'
import { MicroInvestmentPlanService } from '@/features/investment-plans/services/micro-investment-plan.service'
import { GoalsEventsService } from '@/features/goals-events/services/goals-events.service'
import { InvestmentPolicyService } from '@/features/investment-policy/services/investment-policy.service'
import {
  generateProjectionData,
  generateChartProjections,
  type YearlyProjectionData,
  type ChartOptions,
} from '@/lib/calculations/chart-projections'
import { calculateMicroPlanFutureValues } from '@/lib/calculations/investmentPlanCalculations'
import type { ComparisonClientData, ClientOption } from '../types/client-comparison'
import type {
  MicroInvestmentPlan,
  FinancialRecord,
} from '@/types/financial'

const MAX_CLIENTS = 4
const DEFAULT_CHART_OPTIONS: ChartOptions = {
  showRealValues: false,
  showNegativeValues: false,
  showOldPortfolio: false,
  showProjectedLine: true,
  showPlannedLine: true,
}

export interface UseComparisonDataReturn {
  clientData: ComparisonClientData[]
  clientOptions: ClientOption[]
  isLoading: boolean
  error: string | null
  fetchClients: (brokerId: string) => Promise<void>
}

export function useComparisonData(
  brokerId: string | null,
  selectedClientIds: string[]
): UseComparisonDataReturn {
  const [clientData, setClientData] = useState<ComparisonClientData[]>([])
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async (bId: string) => {
    if (!bId) return

    try {
      const plans = await InvestmentPlanService.fetchPlansByBrokerId(bId)
      const options: ClientOption[] = (plans || [])
        .filter((p) => p.user_id && p.status === 'active')
        .map((p) => ({
          id: p.user_id,
          name: (p.profiles as { name: string })?.name || 'Unknown',
          planId: p.id,
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
        )
      setClientOptions(options)
    } catch (err) {
      console.error('Error fetching broker clients:', err)
      setClientOptions([])
    }
  }, [])

  useEffect(() => {
    if (brokerId) {
      fetchClients(brokerId)
    }
  }, [brokerId, fetchClients])

  useEffect(() => {
    if (!brokerId || selectedClientIds.length === 0) {
      setClientData([])
      return
    }

    if (selectedClientIds.length > MAX_CLIENTS) {
      setError(`Maximum ${MAX_CLIENTS} clients can be compared`)
      return
    }

    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const plans = await InvestmentPlanService.fetchPlansByBrokerId(brokerId)
        const results = await Promise.all(
          selectedClientIds.map(async (clientId) => {
            const plan = plans.find((p) => p.user_id === clientId)
            if (!plan || !plan.profiles) return null

            const profileData = plan.profiles as { name: string; birth_date: string }
            const birthDate = profileData.birth_date || ''
            if (!birthDate) return null

            const [microPlansRes, recordsRes, goalsEventsRes, investmentPolicyRes] =
              await Promise.all([
                MicroInvestmentPlanService.fetchMicroPlansByLifePlanId(plan.id),
                supabase
                  .from('user_financial_records')
                  .select('*')
                  .eq('user_id', clientId)
                  .order('record_year', { ascending: true })
                  .order('record_month', { ascending: true }),
                GoalsEventsService.fetchGoalsAndEvents(clientId),
                InvestmentPolicyService.fetchPolicyByClientId(clientId),
              ])

            if (recordsRes.error) {
              throw new Error(
                `Failed to load financial records for client ${profileData.name}: ${recordsRes.error.message}`
              )
            }

            const microPlans: MicroInvestmentPlan[] = microPlansRes || []
            const records: FinancialRecord[] = (recordsRes.data || []) as FinancialRecord[]
            const goals = goalsEventsRes?.goals ?? []
            const events = goalsEventsRes?.events ?? []
            const activeMicroPlan = microPlans[microPlans.length - 1] ?? microPlans[0]
            const birthDateObj = new Date(birthDate)
            const calculations = activeMicroPlan
              ? calculateMicroPlanFutureValues(plan, activeMicroPlan, records, birthDateObj)
              : null

            const projectionData: YearlyProjectionData[] = generateProjectionData(
              plan,
              { birth_date: birthDate },
              records,
              microPlans,
              goals,
              events,
              DEFAULT_CHART_OPTIONS
            )

            const chartData = generateChartProjections(
              { birth_date: birthDate },
              plan,
              records,
              goals,
              events,
              DEFAULT_CHART_OPTIONS,
              microPlans
            )

            return {
              clientId,
              profile: {
                id: clientId,
                name: profileData.name,
                birth_date: birthDate,
              },
              plan,
              microPlans,
              records,
              goals,
              events,
              calculations,
              projectionData,
              chartData,
              investmentPolicy: investmentPolicyRes ?? null,
            } as ComparisonClientData
          })
        )

        setClientData(results.filter((result): result is ComparisonClientData => result !== null))
      } catch (err) {
        console.error('Error loading comparison data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setClientData([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [brokerId, selectedClientIds.join(',')])

  return {
    clientData,
    clientOptions,
    isLoading,
    error,
    fetchClients,
  }
}
