import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/shared/components/ui/use-toast'
import { InvestmentPolicyService, InvestmentPolicyData, PolicySectionData } from '@/features/investment-policy/services/investment-policy.service'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

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

// Investment Policy Insights Types and Hook
interface ProfessionalInsight {
  occupation: string
  count: number
}

interface WorkLocationInsight {
  location: string
  count: number
}

interface WorkRegimeInsight {
  regime: string
  count: number
}

interface BudgetInsight {
  totalIncomes: number
  totalExpenses: number
  totalBonus: number
  totalDividends: number
  totalSavings: number
  averageIncome: number
  averageExpense: number
  averageBonus: number
  averageDividends: number
  averageSavings: number
  clientsWithBudget: number
}

interface LifeStageInsight {
  stage: string
  count: number
}

interface MaritalStatusInsight {
  status: string
  count: number
}

interface ChildrenInsight {
  hasChildren: number
  noChildren: number
  averageChildren: number
}

interface RiskProfileInsight {
  profile: string
  count: number
}

interface TargetReturnInsight {
  return: string
  count: number
}

export interface InvestmentPolicyInsights {
  professional: {
    occupations: ProfessionalInsight[]
    workLocations: WorkLocationInsight[]
    workRegimes: WorkRegimeInsight[]
    totalClients: number
  }
  budget: BudgetInsight
  life: {
    stages: LifeStageInsight[]
    totalClients: number
  }
  family: {
    maritalStatus: MaritalStatusInsight[]
    children: ChildrenInsight
    totalClients: number
  }
  preferences: {
    riskProfiles: RiskProfileInsight[]
    targetReturns: TargetReturnInsight[]
    totalClients: number
  }
}

interface UseInvestmentPolicyInsightsReturn {
  insights: InvestmentPolicyInsights | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useInvestmentPolicyInsights(activeBrokerIds?: string[]): UseInvestmentPolicyInsightsReturn {
  const [insights, setInsights] = useState<InvestmentPolicyInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Se IDs foram fornecidos, usar diretamente. Caso contrário, buscar brokers ativos
      let activeBrokerIdsList: string[] = []
      
      if (activeBrokerIds && activeBrokerIds.length > 0) {
        activeBrokerIdsList = activeBrokerIds
      } else {
        const { data: activeBrokers, error: brokersError } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_broker', true)
          .eq('active', true)
          .not('name', 'ilike', '%teste%')

        if (brokersError) throw brokersError

        activeBrokerIdsList = (activeBrokers || []).map((b: { id: string }) => b.id)
      }

      if (activeBrokerIdsList.length === 0) {
        // No active brokers, return empty insights
        setInsights({
          professional: {
            occupations: [],
            workLocations: [],
            workRegimes: [],
            totalClients: 0
          },
          budget: {
            totalIncomes: 0,
            totalExpenses: 0,
            totalBonus: 0,
            totalDividends: 0,
            totalSavings: 0,
            averageIncome: 0,
            averageExpense: 0,
            averageBonus: 0,
            averageDividends: 0,
            averageSavings: 0,
            clientsWithBudget: 0
          },
          life: {
            stages: [],
            totalClients: 0
          },
          family: {
            maritalStatus: [],
            children: {
              hasChildren: 0,
              noChildren: 0,
              averageChildren: 0
            },
            totalClients: 0
          },
          preferences: {
            riskProfiles: [],
            targetReturns: [],
            totalClients: 0
          }
        })
        setLoading(false)
        return
      }

      // Get client profiles that belong to active brokers
      const { data: clientProfiles, error: clientsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_broker', false)
        .in('broker_id', activeBrokerIdsList)

      if (clientsError) throw clientsError

      const clientIds = (clientProfiles || []).map((p: { id: string }) => p.id)

      if (clientIds.length === 0) {
        // No clients from active brokers, return empty insights
        setInsights({
          professional: {
            occupations: [],
            workLocations: [],
            workRegimes: [],
            totalClients: 0
          },
          budget: {
            totalIncomes: 0,
            totalExpenses: 0,
            totalBonus: 0,
            totalDividends: 0,
            totalSavings: 0,
            averageIncome: 0,
            averageExpense: 0,
            averageBonus: 0,
            averageDividends: 0,
            averageSavings: 0,
            clientsWithBudget: 0
          },
          life: {
            stages: [],
            totalClients: 0
          },
          family: {
            maritalStatus: [],
            children: {
              hasChildren: 0,
              noChildren: 0,
              averageChildren: 0
            },
            totalClients: 0
          },
          preferences: {
            riskProfiles: [],
            targetReturns: [],
            totalClients: 0
          }
        })
        setLoading(false)
        return
      }

      // Fetch investment policies only for clients of active brokers
      const { data: policies, error: policiesError } = await supabase
        .from('investment_policies')
        .select(`
          id,
          profile_id,
          professional_information (
            occupation,
            work_location,
            work_regime
          ),
          budgets (
            incomes,
            expenses,
            bonus,
            dividends,
            savings
          ),
          life_information (
            life_stage
          ),
          family_structures (
            marital_status,
            children (
              id
            )
          ),
          investment_preferences (
            risk_profile,
            target_return_ipca_plus
          )
        `)
        .in('profile_id', clientIds)

      if (policiesError) throw policiesError

      const policiesData = policies || []

      // Process professional information
      const occupationsMap = new Map<string, number>()
      const workLocationsMap = new Map<string, number>()
      const workRegimesMap = new Map<string, number>()
      let professionalCount = 0

      policiesData.forEach((policy: {
        professional_information?: { occupation?: string; work_location?: string; work_regime?: string } | Array<{ occupation?: string; work_location?: string; work_regime?: string }>
        budgets?: { incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number } | Array<{ incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number }>
        life_information?: { life_stage?: string } | Array<{ life_stage?: string }>
        family_structures?: { marital_status?: string; children?: Array<{ id: string }> } | Array<{ marital_status?: string; children?: Array<{ id: string }> }>
        investment_preferences?: { risk_profile?: string; target_return_ipca_plus?: string } | Array<{ risk_profile?: string; target_return_ipca_plus?: string }>
      }) => {
        const profInfo = policy.professional_information
        // Handle both array and single object responses
        const info = Array.isArray(profInfo) ? (profInfo.length > 0 ? profInfo[0] : null) : profInfo
        if (info) {
          professionalCount++
          
          if (info.occupation) {
            occupationsMap.set(info.occupation, (occupationsMap.get(info.occupation) || 0) + 1)
          }
          if (info.work_location) {
            workLocationsMap.set(info.work_location, (workLocationsMap.get(info.work_location) || 0) + 1)
          }
          if (info.work_regime) {
            workRegimesMap.set(info.work_regime, (workRegimesMap.get(info.work_regime) || 0) + 1)
          }
        }
      })

      const occupations: ProfessionalInsight[] = Array.from(occupationsMap.entries())
        .map(([occupation, count]) => ({ occupation, count }))
        .sort((a, b) => b.count - a.count)

      const workLocations: WorkLocationInsight[] = Array.from(workLocationsMap.entries())
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)

      const workRegimes: WorkRegimeInsight[] = Array.from(workRegimesMap.entries())
        .map(([regime, count]) => ({ regime, count }))
        .sort((a, b) => b.count - a.count)

      // Process budget information
      let totalIncomes = 0
      let totalExpenses = 0
      let totalBonus = 0
      let totalDividends = 0
      let totalSavings = 0
      let clientsWithBudget = 0
      let incomeCount = 0
      let expenseCount = 0

      policiesData.forEach((policy: {
        professional_information?: { occupation?: string; work_location?: string; work_regime?: string } | Array<{ occupation?: string; work_location?: string; work_regime?: string }>
        budgets?: { incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number } | Array<{ incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number }>
        life_information?: { life_stage?: string } | Array<{ life_stage?: string }>
        family_structures?: { marital_status?: string; children?: Array<{ id: string }> } | Array<{ marital_status?: string; children?: Array<{ id: string }> }>
        investment_preferences?: { risk_profile?: string; target_return_ipca_plus?: string } | Array<{ risk_profile?: string; target_return_ipca_plus?: string }>
      }) => {
        const budget = policy.budgets
        // Handle both array and single object responses
        const budgetData = Array.isArray(budget) ? (budget.length > 0 ? budget[0] : null) : budget
        if (budgetData) {
          clientsWithBudget++

          if (budgetData.incomes && Array.isArray(budgetData.incomes)) {
            const incomeSum = budgetData.incomes.reduce((sum: number, inc: { amount: number }) => sum + (inc.amount || 0), 0)
            totalIncomes += incomeSum
            if (incomeSum > 0) incomeCount++
          }

          if (budgetData.expenses && Array.isArray(budgetData.expenses)) {
            const expenseSum = budgetData.expenses.reduce((sum: number, exp: { amount: number }) => sum + (exp.amount || 0), 0)
            totalExpenses += expenseSum
            if (expenseSum > 0) expenseCount++
          }

          totalBonus += budgetData.bonus || 0
          totalDividends += budgetData.dividends || 0
          totalSavings += budgetData.savings || 0
        }
      })

      // Calculate averages for bonus, dividends, and savings
      const bonusCount = policiesData.filter((policy: {
        budgets?: { bonus?: number } | Array<{ bonus?: number }>
      }) => {
        const budget = policy.budgets
        const budgetData = Array.isArray(budget) ? (budget.length > 0 ? budget[0] : null) : budget
        return budgetData && (budgetData.bonus || 0) > 0
      }).length

      const dividendsCount = policiesData.filter((policy: {
        budgets?: { dividends?: number } | Array<{ dividends?: number }>
      }) => {
        const budget = policy.budgets
        const budgetData = Array.isArray(budget) ? (budget.length > 0 ? budget[0] : null) : budget
        return budgetData && (budgetData.dividends || 0) > 0
      }).length

      const savingsCount = policiesData.filter((policy: {
        budgets?: { savings?: number } | Array<{ savings?: number }>
      }) => {
        const budget = policy.budgets
        const budgetData = Array.isArray(budget) ? (budget.length > 0 ? budget[0] : null) : budget
        return budgetData && (budgetData.savings || 0) > 0
      }).length

      const budgetInsight: BudgetInsight = {
        totalIncomes,
        totalExpenses,
        totalBonus,
        totalDividends,
        totalSavings,
        averageIncome: incomeCount > 0 ? totalIncomes / incomeCount : 0,
        averageExpense: expenseCount > 0 ? totalExpenses / expenseCount : 0,
        averageBonus: bonusCount > 0 ? totalBonus / bonusCount : 0,
        averageDividends: dividendsCount > 0 ? totalDividends / dividendsCount : 0,
        averageSavings: savingsCount > 0 ? totalSavings / savingsCount : 0,
        clientsWithBudget
      }

      // Process life information
      const stagesMap = new Map<string, number>()
      let lifeCount = 0

      policiesData.forEach((policy: {
        professional_information?: { occupation?: string; work_location?: string; work_regime?: string } | Array<{ occupation?: string; work_location?: string; work_regime?: string }>
        budgets?: { incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number } | Array<{ incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number }>
        life_information?: { life_stage?: string } | Array<{ life_stage?: string }>
        family_structures?: { marital_status?: string; children?: Array<{ id: string }> } | Array<{ marital_status?: string; children?: Array<{ id: string }> }>
        investment_preferences?: { risk_profile?: string; target_return_ipca_plus?: string } | Array<{ risk_profile?: string; target_return_ipca_plus?: string }>
      }) => {
        const lifeInfo = policy.life_information
        // Handle both array and single object responses
        const info = Array.isArray(lifeInfo) ? (lifeInfo.length > 0 ? lifeInfo[0] : null) : lifeInfo
        if (info) {
          lifeCount++
          if (info.life_stage) {
            stagesMap.set(info.life_stage, (stagesMap.get(info.life_stage) || 0) + 1)
          }
        }
      })

      const stages: LifeStageInsight[] = Array.from(stagesMap.entries())
        .map(([stage, count]) => ({ stage, count }))
        .sort((a, b) => b.count - a.count)

      // Process family structures
      const maritalStatusMap = new Map<string, number>()
      let familyCount = 0
      let totalChildren = 0
      let familiesWithChildren = 0

      policiesData.forEach((policy: {
        professional_information?: { occupation?: string; work_location?: string; work_regime?: string } | Array<{ occupation?: string; work_location?: string; work_regime?: string }>
        budgets?: { incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number } | Array<{ incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number }>
        life_information?: { life_stage?: string } | Array<{ life_stage?: string }>
        family_structures?: { marital_status?: string; children?: Array<{ id: string }> } | Array<{ marital_status?: string; children?: Array<{ id: string }> }>
        investment_preferences?: { risk_profile?: string; target_return_ipca_plus?: string } | Array<{ risk_profile?: string; target_return_ipca_plus?: string }>
      }) => {
        const family = policy.family_structures
        // Handle both array and single object responses
        const familyData = Array.isArray(family) ? (family.length > 0 ? family[0] : null) : family
        if (familyData) {
          familyCount++

          if (familyData.marital_status) {
            maritalStatusMap.set(familyData.marital_status, (maritalStatusMap.get(familyData.marital_status) || 0) + 1)
          }

          if (familyData.children && Array.isArray(familyData.children)) {
            const childrenCount = familyData.children.length
            totalChildren += childrenCount
            if (childrenCount > 0) familiesWithChildren++
          }
        }
      })

      const maritalStatus: MaritalStatusInsight[] = Array.from(maritalStatusMap.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count)

      const childrenInsight: ChildrenInsight = {
        hasChildren: familiesWithChildren,
        noChildren: familyCount - familiesWithChildren,
        averageChildren: familyCount > 0 ? totalChildren / familyCount : 0
      }

      // Process investment preferences
      const riskProfilesMap = new Map<string, number>()
      const targetReturnsMap = new Map<string, number>()
      let preferencesCount = 0

      policiesData.forEach((policy: {
        professional_information?: { occupation?: string; work_location?: string; work_regime?: string } | Array<{ occupation?: string; work_location?: string; work_regime?: string }>
        budgets?: { incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number } | Array<{ incomes?: Array<{ amount: number }>; expenses?: Array<{ amount: number }>; bonus?: number; dividends?: number; savings?: number }>
        life_information?: { life_stage?: string } | Array<{ life_stage?: string }>
        family_structures?: { marital_status?: string; children?: Array<{ id: string }> } | Array<{ marital_status?: string; children?: Array<{ id: string }> }>
        investment_preferences?: { risk_profile?: string; target_return_ipca_plus?: string } | Array<{ risk_profile?: string; target_return_ipca_plus?: string }>
      }) => {
        const prefs = policy.investment_preferences
        // Handle both array and single object responses
        const prefData = Array.isArray(prefs) ? (prefs.length > 0 ? prefs[0] : null) : prefs
        if (prefData) {
          preferencesCount++

          if (prefData.risk_profile) {
            riskProfilesMap.set(prefData.risk_profile, (riskProfilesMap.get(prefData.risk_profile) || 0) + 1)
          }

          if (prefData.target_return_ipca_plus) {
            targetReturnsMap.set(prefData.target_return_ipca_plus, (targetReturnsMap.get(prefData.target_return_ipca_plus) || 0) + 1)
          }
        }
      })

      const riskProfiles: RiskProfileInsight[] = Array.from(riskProfilesMap.entries())
        .map(([profile, count]) => ({ profile, count }))
        .sort((a, b) => b.count - a.count)

      const targetReturns: TargetReturnInsight[] = Array.from(targetReturnsMap.entries())
        .map(([returnVal, count]) => ({ return: returnVal, count }))
        .sort((a, b) => b.count - a.count)

      setInsights({
        professional: {
          occupations,
          workLocations,
          workRegimes,
          totalClients: professionalCount
        },
        budget: budgetInsight,
        life: {
          stages,
          totalClients: lifeCount
        },
        family: {
          maritalStatus,
          children: childrenInsight,
          totalClients: familyCount
        },
        preferences: {
          riskProfiles,
          targetReturns,
          totalClients: preferencesCount
        }
      })
    } catch (err) {
      console.error('Error fetching investment policy insights:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar insights')
    } finally {
      setLoading(false)
    }
  }, [activeBrokerIds])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  return {
    insights,
    loading,
    error,
    refetch: fetchInsights
  }
}
