import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { InvestmentPolicyService, InvestmentPolicyData, PolicySectionData } from '@/services/investment-policy.service'
import { useMemo } from 'react'

export interface PolicyStats {
  totalSections: number
  completedSections: number
  completionRate: number
  hasAssetAllocations: boolean
}

export function useInvestmentPolicy(clientId: string) {
  const { data: policy, isLoading, error } = useQuery({
    queryKey: ['investmentPolicy', clientId],
    queryFn: () => InvestmentPolicyService.fetchPolicyByClientId(clientId),
    enabled: !!clientId,
  })

  const stats = useMemo(() => {
    return InvestmentPolicyService.calculatePolicyStats(policy || {})
  }, [policy])

  const validation = useMemo(() => {
    return InvestmentPolicyService.validatePolicyCompleteness(policy || {})
  }, [policy])

  return {
    policy: policy || {},
    stats,
    validation,
    isLoading,
    error
  }
}

export function usePolicySectionData(policyId: string, sectionName: string) {
  const { data: sectionData, isLoading, error } = useQuery({
    queryKey: ['policySection', policyId, sectionName],
    queryFn: () => InvestmentPolicyService.fetchSectionData(policyId, sectionName),
    enabled: !!policyId && !!sectionName,
  })

  return {
    sectionData: sectionData || [],
    isLoading,
    error
  }
}

export function useInvestmentPolicyMutations() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updatePolicySection = useMutation({
    mutationFn: ({ 
      policyId, 
      sectionName, 
      sectionData 
    }: { 
      policyId: string
      sectionName: string
      sectionData: PolicySectionData 
    }) => InvestmentPolicyService.updatePolicySection(policyId, sectionName, sectionData),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['investmentPolicy'] })
      queryClient.invalidateQueries({ queryKey: ['policySection', variables.policyId, variables.sectionName] })
      
      toast({
        title: 'Seção atualizada com sucesso',
      })
    },
    onError: (error, variables) => {
      console.error(`Error updating ${variables.sectionName}:`, error)
      toast({
        title: `Erro ao atualizar ${variables.sectionName}`,
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const updateAssetAllocations = useMutation({
    mutationFn: ({ 
      policyId, 
      assetAllocations 
    }: { 
      policyId: string
      assetAllocations: Record<string, number> 
    }) => InvestmentPolicyService.updateAssetAllocations(policyId, assetAllocations),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['investmentPolicy'] })
      
      toast({
        title: 'Alocação de ativos atualizada com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error updating asset allocations:', error)
      toast({
        title: 'Erro ao atualizar alocação de ativos',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const deleteSectionData = useMutation({
    mutationFn: ({ 
      policyId, 
      sectionName, 
      recordId 
    }: { 
      policyId: string
      sectionName: string
      recordId?: string 
    }) => InvestmentPolicyService.deleteSectionData(policyId, sectionName, recordId),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['investmentPolicy'] })
      queryClient.invalidateQueries({ queryKey: ['policySection', variables.policyId, variables.sectionName] })
      
      toast({
        title: 'Dados removidos com sucesso',
      })
    },
    onError: (error, variables) => {
      console.error(`Error deleting ${variables.sectionName}:`, error)
      toast({
        title: `Erro ao remover dados de ${variables.sectionName}`,
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  return {
    updatePolicySection,
    updateAssetAllocations,
    deleteSectionData,
  }
}

export function usePolicyCompleteness(policy: InvestmentPolicyData) {
  const validation = useMemo(() => {
    return InvestmentPolicyService.validatePolicyCompleteness(policy)
  }, [policy])

  const stats = useMemo(() => {
    return InvestmentPolicyService.calculatePolicyStats(policy)
  }, [policy])

  return {
    validation,
    stats,
    isComplete: validation.isValid,
    missingSections: validation.missingSections,
    completionRate: stats.completionRate
  }
}
