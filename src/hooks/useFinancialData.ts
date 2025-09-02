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

  // Metas com progresso de alocação
  const goalsWithProgress = useMemo(() => {
    if (!goalsAndEvents?.goals) return []
    
    return goalsAndEvents.goals.map(goal => {
      const totalAllocated = goal.financial_links?.reduce((sum, link) => sum + Number(link.allocated_amount), 0) || 0
      const progressPercentage = goal.asset_value > 0 ? (totalAllocated / goal.asset_value) * 100 : 0
      
      return {
        ...goal,
        progressPercentage,
        isFullyAllocated: totalAllocated >= goal.asset_value,
        isPartiallyAllocated: totalAllocated > 0 && totalAllocated < goal.asset_value,
        total_allocated: totalAllocated,
        remaining_amount: goal.asset_value - totalAllocated
      }
    })
  }, [goalsAndEvents?.goals])

  // Eventos com progresso de alocação
  const eventsWithProgress = useMemo(() => {
    if (!goalsAndEvents?.events) return []
    
    return goalsAndEvents.events.map(event => {
      const totalAllocated = event.financial_links?.reduce((sum, link) => sum + Number(link.allocated_amount), 0) || 0
      const progressPercentage = event.asset_value > 0 ? (totalAllocated / event.asset_value) * 100 : 0
      
      return {
        ...event,
        progressPercentage,
        isFullyAllocated: totalAllocated >= event.asset_value,
        isPartiallyAllocated: totalAllocated > 0 && totalAllocated < event.asset_value,
        total_allocated: totalAllocated,
        remaining_amount: event.asset_value - totalAllocated
      }
    })
  }, [goalsAndEvents?.events])

  // Resumo de alocação
  const allocationSummary = useMemo(() => {
    if (!goalsAndEvents) return null
    
    const totalGoalsValue = goalsAndEvents.goals.reduce((sum, goal) => sum + goal.asset_value, 0)
    const totalEventsValue = goalsAndEvents.events.reduce((sum, event) => sum + event.asset_value, 0)
    
    const totalGoalsAllocated = goalsAndEvents.goals.reduce((sum, goal) => {
      const allocated = goal.financial_links?.reduce((linkSum, link) => linkSum + Number(link.allocated_amount), 0) || 0
      return sum + allocated
    }, 0)
    
    const totalEventsAllocated = goalsAndEvents.events.reduce((sum, event) => {
      const allocated = event.financial_links?.reduce((linkSum, link) => linkSum + Number(link.allocated_amount), 0) || 0
      return sum + allocated
    }, 0)
    
    return {
      totalGoalsValue,
      totalEventsValue,
      totalGoalsAllocated,
      totalEventsAllocated,
      totalValue: totalGoalsValue + totalEventsValue,
      totalAllocated: totalGoalsAllocated + totalEventsAllocated,
      goalsProgress: totalGoalsValue > 0 ? (totalGoalsAllocated / totalGoalsValue) * 100 : 0,
      eventsProgress: totalEventsValue > 0 ? (totalEventsAllocated / totalEventsValue) * 100 : 0,
      overallProgress: (totalGoalsValue + totalEventsValue) > 0 ? 
        ((totalGoalsAllocated + totalEventsAllocated) / (totalGoalsValue + totalEventsValue)) * 100 : 0
    }
  }, [goalsAndEvents])

  return {
    goalsAndEvents: goalsAndEvents || { goals: [], events: [] },
    goalsByStatus,
    eventsByStatus,
    goalsWithProgress,
    eventsWithProgress,
    allocationSummary,
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
  t: (key: string, params?: Record<string, string | number>) => string
) {
  const { allFinancialRecords } = useFinancialRecords(clientId)

  const highlights = useMemo(() => {
    return FinancialRecordsService.calculateHighlights(allFinancialRecords, investmentPlan, t)
  }, [allFinancialRecords, investmentPlan, t])

  return highlights
}
