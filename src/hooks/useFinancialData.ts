import { useQuery } from '@tanstack/react-query'
import { FinancialRecordsService, ProcessedFinancialRecords } from '@/services/financial-records.service'
import { GoalsEventsService } from '@/services/goals-events.service'
import { useMemo } from 'react'
import { InvestmentPlan, Goal, ProjectedEvent } from '@/types/financial'

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

  // Separação por status
  const goalsByStatus = useMemo(() => {
    if (!goalsAndEvents?.goals) return { pending: [], completed: [] }
    
    return {
      pending: goalsAndEvents.goals.filter((goal: Goal) => goal.status === 'pending'),
      completed: goalsAndEvents.goals.filter((goal: Goal) => goal.status === 'completed')
    }
  }, [goalsAndEvents?.goals])

  const eventsByStatus = useMemo(() => {
    if (!goalsAndEvents?.events) return { pending: [], completed: [] }
    
    return {
      pending: goalsAndEvents.events.filter((event: ProjectedEvent) => event.status === 'pending'),
      completed: goalsAndEvents.events.filter((event: ProjectedEvent) => event.status === 'completed')
    }
  }, [goalsAndEvents?.events])

  return {
    goalsAndEvents: goalsAndEvents || { goals: [], events: [] },
    goalsByStatus,
    eventsByStatus,
    isLoading: isGoalsLoading,
    error: goalsError
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
