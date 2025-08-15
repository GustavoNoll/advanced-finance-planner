import { useQuery } from '@tanstack/react-query'
import { FinancialRecordsService, ProcessedFinancialRecords } from '@/services/financial-records.service'
import { GoalsEventsService } from '@/services/goals-events.service'
import { useMemo } from 'react'
import { InvestmentPlan } from '@/types/financial'

export function useFinancialRecords(clientId: string) {
  const { data: allFinancialRecords, isLoading: isFinancialRecordsLoading, error: financialRecordsError } = useQuery({
    queryKey: ['allFinancialRecords', clientId],
    queryFn: () => FinancialRecordsService.fetchAllRecords(clientId),
    enabled: !!clientId,
  })

  const processedRecords = useMemo(() => {
    return FinancialRecordsService.processRecords(allFinancialRecords || [])
  }, [allFinancialRecords])

  return {
    allFinancialRecords: allFinancialRecords || [],
    processedRecords,
    isLoading: isFinancialRecordsLoading,
    error: financialRecordsError
  }
}

export function useGoalsAndEvents(clientId: string) {
  const { data: goalsAndEvents, isLoading: isGoalsLoading, error: goalsError } = useQuery({
    queryKey: ['goalsAndEvents', clientId],
    queryFn: () => GoalsEventsService.fetchGoalsAndEvents(clientId),
    enabled: !!clientId
  })

  const { data: counters, isLoading: isCountersLoading, error: countersError } = useQuery({
    queryKey: ['counters', clientId],
    queryFn: () => GoalsEventsService.fetchCounters(clientId),
    enabled: !!clientId,
  })

  return {
    goalsAndEvents: goalsAndEvents || { goals: [], events: [] },
    counters: counters || { goals: 0, events: 0 },
    isLoading: isGoalsLoading || isCountersLoading,
    error: goalsError || countersError
  }
}

export function useFinancialMetrics(
  clientId: string,
  selectedPeriod: 'all' | '6m' | '12m' | '24m' = 'all',
  contributionPeriod: 'all' | '6m' | '12m' | '24m' = 'all',
  investmentPlan?: InvestmentPlan
) {
  const { allFinancialRecords, processedRecords } = useFinancialRecords(clientId)

  const totalReturns = useMemo(() => {
    return FinancialRecordsService.calculateTotalReturns(allFinancialRecords, selectedPeriod)
  }, [allFinancialRecords, selectedPeriod])

  const totalContribution = useMemo(() => {
    return FinancialRecordsService.calculateMonthlyContributions(
      allFinancialRecords,
      contributionPeriod,
      investmentPlan?.initial_amount || 0
    )
  }, [allFinancialRecords, contributionPeriod, investmentPlan?.initial_amount])

  const oldestRecord = useMemo(() => {
    return FinancialRecordsService.getOldestRecord(allFinancialRecords)
  }, [allFinancialRecords])

  return {
    totalReturns,
    totalContribution,
    oldestRecord,
    processedRecords
  }
}

export function useFinancialHighlights(
  clientId: string,
  investmentPlan: InvestmentPlan,
  t: (key: string, params?: any) => string
) {
  const { allFinancialRecords } = useFinancialRecords(clientId)

  const highlights = useMemo(() => {
    return FinancialRecordsService.calculateHighlights(allFinancialRecords, investmentPlan, t)
  }, [allFinancialRecords, investmentPlan, t])

  return highlights
}
