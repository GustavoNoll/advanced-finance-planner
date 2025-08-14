import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { GoalsEventsManagementService } from '@/services/goals-events-management.service'
import { Goal, ProjectedEvent, FinancialItemFormValues } from '@/types/financial'
import { useMemo } from 'react'

export interface GoalsStats {
  total: number
  pending: number
  completed: number
  totalValue: number
  pendingValue: number
  completedValue: number
  completionRate: number
}

export interface EventsStats {
  total: number
  pending: number
  completed: number
  totalValue: number
  pendingValue: number
  completedValue: number
  completionRate: number
}

export function useGoals(userId: string) {
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['goals', userId],
    queryFn: () => GoalsEventsManagementService.fetchGoals(userId),
    enabled: !!userId,
  })

  const stats = useMemo(() => {
    return GoalsEventsManagementService.calculateGoalsStats(goals || [])
  }, [goals])

  const projectedGoals = useMemo(() => {
    return GoalsEventsManagementService.filterGoalsByStatus(goals || [], 'pending')
  }, [goals])

  const completedGoals = useMemo(() => {
    return GoalsEventsManagementService.filterGoalsByStatus(goals || [], 'completed')
  }, [goals])

  return {
    goals: goals || [],
    projectedGoals,
    completedGoals,
    stats,
    isLoading,
    error
  }
}

export function useEvents(userId: string) {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events', userId],
    queryFn: () => GoalsEventsManagementService.fetchEvents(userId),
    enabled: !!userId,
  })

  const stats = useMemo(() => {
    return GoalsEventsManagementService.calculateEventsStats(events || [])
  }, [events])

  const projectedEvents = useMemo(() => {
    return GoalsEventsManagementService.filterEventsByStatus(events || [], 'pending')
  }, [events])

  const completedEvents = useMemo(() => {
    return GoalsEventsManagementService.filterEventsByStatus(events || [], 'completed')
  }, [events])

  return {
    events: events || [],
    projectedEvents,
    completedEvents,
    stats,
    isLoading,
    error
  }
}

export function useGoalMutations(userId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createGoal = useMutation({
    mutationFn: (values: FinancialItemFormValues) => 
      GoalsEventsManagementService.createGoal(userId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
      queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', userId] })
      queryClient.invalidateQueries({ queryKey: ['counters', userId] })
      toast({
        title: 'Meta criada com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error creating goal:', error)
      toast({
        title: 'Erro ao criar meta',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const updateGoal = useMutation({
    mutationFn: ({ goalId, values }: { goalId: string; values: FinancialItemFormValues }) =>
      GoalsEventsManagementService.updateGoal(goalId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
      queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', userId] })
      toast({
        title: 'Meta atualizada com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error updating goal:', error)
      toast({
        title: 'Erro ao atualizar meta',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const deleteGoal = useMutation({
    mutationFn: (goalId: string) => GoalsEventsManagementService.deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
      queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', userId] })
      queryClient.invalidateQueries({ queryKey: ['counters', userId] })
      toast({
        title: 'Meta removida com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error deleting goal:', error)
      toast({
        title: 'Erro ao remover meta',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const toggleGoalStatus = useMutation({
    mutationFn: ({ goalId, status }: { goalId: string; status: 'pending' | 'completed' }) =>
      GoalsEventsManagementService.toggleGoalStatus(goalId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
      queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', userId] })
    },
    onError: (error) => {
      console.error('Error toggling goal status:', error)
      toast({
        title: 'Erro ao alterar status da meta',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  return {
    createGoal,
    updateGoal,
    deleteGoal,
    toggleGoalStatus,
  }
}

export function useEventMutations(userId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createEvent = useMutation({
    mutationFn: (values: FinancialItemFormValues) => 
      GoalsEventsManagementService.createEvent(userId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] })
      queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', userId] })
      queryClient.invalidateQueries({ queryKey: ['counters', userId] })
      toast({
        title: 'Evento criado com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error creating event:', error)
      toast({
        title: 'Erro ao criar evento',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const updateEvent = useMutation({
    mutationFn: ({ eventId, values }: { eventId: string; values: FinancialItemFormValues }) =>
      GoalsEventsManagementService.updateEvent(eventId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] })
      queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', userId] })
      toast({
        title: 'Evento atualizado com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error updating event:', error)
      toast({
        title: 'Erro ao atualizar evento',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const deleteEvent = useMutation({
    mutationFn: (eventId: string) => GoalsEventsManagementService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] })
      queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', userId] })
      queryClient.invalidateQueries({ queryKey: ['counters', userId] })
      toast({
        title: 'Evento removido com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error deleting event:', error)
      toast({
        title: 'Erro ao remover evento',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const toggleEventStatus = useMutation({
    mutationFn: ({ eventId, status }: { eventId: string; status: 'pending' | 'completed' }) =>
      GoalsEventsManagementService.toggleEventStatus(eventId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] })
      queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', userId] })
    },
    onError: (error) => {
      console.error('Error toggling event status:', error)
      toast({
        title: 'Erro ao alterar status do evento',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    toggleEventStatus,
  }
}
