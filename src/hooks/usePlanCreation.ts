import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { PlanCreationService, PlanCreationData, ProfileData } from '@/services/plan-creation.service'
import { InvestmentPlan } from '@/types/financial'
import { FormData, Calculations } from '@/utils/investmentPlanCalculations'



export function useProfileData(userId: string) {
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profileData', userId],
    queryFn: () => PlanCreationService.fetchProfileData(userId),
    enabled: !!userId,
  })

  return {
    profileData,
    isLoading,
    error
  }
}

export function usePlanCreation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createPlan = useMutation({
    mutationFn: ({ planData, birthDate }: { planData: PlanCreationData; birthDate: Date }) =>
      PlanCreationService.createPlan(planData, birthDate),
    onSuccess: (newPlan) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['investmentPlans'] })
      queryClient.invalidateQueries({ queryKey: ['investmentPlan', newPlan.user_id] })
      
      toast({
        title: 'Plano de investimento criado com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error creating investment plan:', error)
      toast({
        title: 'Erro ao criar plano de investimento',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  return {
    createPlan,
  }
}

export function usePlanCalculations(formData: FormData, birthDate: Date | null) {
  const calculations = useQuery({
    queryKey: ['planCalculations', formData, birthDate],
    queryFn: () => {
      if (!birthDate) return null
      return PlanCreationService.calculatePlanValues(formData, birthDate)
    },
    enabled: !!birthDate && PlanCreationService.isFormReady(formData),
  })

  return {
    calculations: calculations.data,
    isLoading: calculations.isLoading,
    error: calculations.error
  }
}

export function useAgeOptions(birthDate: Date | null) {
  const ageOptions = useQuery({
    queryKey: ['ageOptions', birthDate],
    queryFn: () => {
      if (!birthDate) return []
      return PlanCreationService.generateAgeOptions(birthDate)
    },
    enabled: !!birthDate,
  })

  return {
    ageOptions: ageOptions.data || [],
    isLoading: ageOptions.isLoading,
    error: ageOptions.error
  }
}
