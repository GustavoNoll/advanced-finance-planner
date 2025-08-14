import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { InvestmentPlanService, InvestmentPlanWithProfile, InvestmentPlanFilters } from '@/services/investment-plan.service'
import { InvestmentPlan } from '@/types/financial'
import { useMemo } from 'react'

export interface InvestmentPlanStats {
  total: number
  active: number
  inactive: number
  totalInitialAmount: number
  totalMonthlyDeposit: number
  averageInitialAmount: number
  averageMonthlyDeposit: number
}

export function useInvestmentPlan(planId: string) {
  const { data: plan, isLoading, error } = useQuery({
    queryKey: ['investmentPlan', planId],
    queryFn: () => InvestmentPlanService.fetchPlanById(planId),
    enabled: !!planId,
  })

  return {
    plan,
    isLoading,
    error,
    hasAccess: plan !== null
  }
}

export function useInvestmentPlansByUserId(userId: string) {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['investmentPlans', 'user', userId],
    queryFn: () => InvestmentPlanService.fetchPlansByUserId(userId),
    enabled: !!userId,
  })

  const stats = useMemo(() => {
    return InvestmentPlanService.calculatePlansStats(plans || [])
  }, [plans])

  const activePlans = useMemo(() => {
    return plans?.filter(plan => plan.status === 'active') || []
  }, [plans])

  const inactivePlans = useMemo(() => {
    return plans?.filter(plan => plan.status === 'inactive') || []
  }, [plans])

  return {
    plans: plans || [],
    activePlans,
    inactivePlans,
    stats,
    isLoading,
    error
  }
}

export function useInvestmentPlansByBrokerId(brokerId: string) {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['investmentPlans', 'broker', brokerId],
    queryFn: () => InvestmentPlanService.fetchPlansByBrokerId(brokerId),
    enabled: !!brokerId,
  })

  const stats = useMemo(() => {
    return InvestmentPlanService.calculatePlansStats(plans || [])
  }, [plans])

  const activePlans = useMemo(() => {
    return plans?.filter(plan => plan.status === 'active') || []
  }, [plans])

  const inactivePlans = useMemo(() => {
    return plans?.filter(plan => plan.status === 'inactive') || []
  }, [plans])

  return {
    plans: plans || [],
    activePlans,
    inactivePlans,
    stats,
    isLoading,
    error
  }
}

export function useInvestmentPlanMutations() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createPlan = useMutation({
    mutationFn: (planData: Partial<InvestmentPlan>) => 
      InvestmentPlanService.createPlan(planData),
    onSuccess: (newPlan) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['investmentPlans'] })
      queryClient.invalidateQueries({ queryKey: ['investmentPlan', newPlan.id] })
      
      toast({
        title: 'Plano de investimento criado com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error creating investment plan:', error)
      toast({
        title: 'Erro ao criar plano de investimento',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const updatePlan = useMutation({
    mutationFn: ({ planId, planData }: { planId: string; planData: Partial<InvestmentPlan> }) =>
      InvestmentPlanService.updatePlan(planId, planData),
    onSuccess: (updatedPlan) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['investmentPlans'] })
      queryClient.invalidateQueries({ queryKey: ['investmentPlan', updatedPlan.id] })
      
      toast({
        title: 'Plano de investimento atualizado com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error updating investment plan:', error)
      toast({
        title: 'Erro ao atualizar plano de investimento',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const deletePlan = useMutation({
    mutationFn: (planId: string) => InvestmentPlanService.deletePlan(planId),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['investmentPlans'] })
      
      toast({
        title: 'Plano de investimento removido com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error deleting investment plan:', error)
      toast({
        title: 'Erro ao remover plano de investimento',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  return {
    createPlan,
    updatePlan,
    deletePlan,
  }
}

export function usePlanAccess(planId: string, userId: string) {
  const { data: hasAccess, isLoading, error } = useQuery({
    queryKey: ['planAccess', planId, userId],
    queryFn: () => InvestmentPlanService.checkPlanAccess(planId, userId),
    enabled: !!planId && !!userId,
  })

  return {
    hasAccess: hasAccess || false,
    isLoading,
    error
  }
}
