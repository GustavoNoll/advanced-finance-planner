import { useState, useEffect, useCallback } from 'react'
import { MicroInvestmentPlan, CreateMicroInvestmentPlan, UpdateMicroInvestmentPlan, FinancialRecord } from '@/types/financial'
import { MicroInvestmentPlanService } from '@/services'
import { supabase } from '@/lib/supabase'

interface UseMicroInvestmentPlansReturn {
  microPlans: MicroInvestmentPlan[]
  activeMicroPlan: MicroInvestmentPlan | null
  isLoading: boolean
  error: string | null
  createMicroPlan: (data: CreateMicroInvestmentPlan) => Promise<MicroInvestmentPlan | null>
  updateMicroPlan: (id: string, data: UpdateMicroInvestmentPlan) => Promise<MicroInvestmentPlan | null>
  deleteMicroPlan: (id: string) => Promise<boolean>
  refreshMicroPlans: () => Promise<void>
  hasFinancialRecordForActivePlan: boolean
}

export function useMicroInvestmentPlans(lifeInvestmentPlanId: string): UseMicroInvestmentPlansReturn {
  const [microPlans, setMicroPlans] = useState<MicroInvestmentPlan[]>([])
  const [activeMicroPlan, setActiveMicroPlan] = useState<MicroInvestmentPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFinancialRecordForActivePlan, setHasFinancialRecordForActivePlan] = useState(false)

  const checkIfMicroPlanHasFinancialRecord = useCallback(async (plan: MicroInvestmentPlan, userId: string, allMicroPlans: MicroInvestmentPlan[]): Promise<boolean> => {
    try {
      // Se é o primeiro micro plano (base), sempre tem financial record (usar dados do plano principal)
      const isFirstMicroPlan = allMicroPlans.length > 0 && allMicroPlans[0].id === plan.id
      if (isFirstMicroPlan) {
        return true
      }

      // Para micro planos não-base, verificar se existe financial record no mesmo mês
      const microPlanDate = new Date(plan.effective_date)
      const currentMonth = microPlanDate.getMonth() + 1 // getMonth() retorna 0-11, precisamos 1-12
      const currentYear = microPlanDate.getFullYear()

      // Verificar se existe financial record no mesmo mês do micro plano
      const { data: currentMonthRecord, error: currentMonthError } = await supabase
        .from('user_financial_records')
        .select('id')
        .eq('user_id', userId)
        .eq('record_year', currentYear)
        .eq('record_month', currentMonth)
        .single()

      if (currentMonthRecord && !currentMonthError) {
        return true
      }

      // Se não tem no mesmo mês, verificar o mês anterior
      const previousMonth = microPlanDate.getMonth() === 0 ? 12 : microPlanDate.getMonth()
      const previousYear = microPlanDate.getMonth() === 0 ? microPlanDate.getFullYear() - 1 : microPlanDate.getFullYear()

      const { data: previousMonthRecord, error: previousMonthError } = await supabase
        .from('user_financial_records')
        .select('id')
        .eq('user_id', userId)
        .eq('record_year', previousYear)
        .eq('record_month', previousMonth)
        .single()

      return !!(previousMonthRecord && !previousMonthError)
    } catch (err) {
      console.error('Error checking financial record:', err)
      return false
    }
  }, [])

  const checkFinancialRecordForActivePlan = useCallback(async (activePlan: MicroInvestmentPlan | null, userId: string, allMicroPlans: MicroInvestmentPlan[]) => {
    if (!activePlan || !userId) {
      setHasFinancialRecordForActivePlan(false)
      return
    }

    const hasRecord = await checkIfMicroPlanHasFinancialRecord(activePlan, userId, allMicroPlans)
    setHasFinancialRecordForActivePlan(hasRecord)
  }, [checkIfMicroPlanHasFinancialRecord])

  // Função para reavaliar qual micro plano deveria estar ativo
  const reevaluateActiveMicroPlan = useCallback(async (allPlans: MicroInvestmentPlan[], userId: string) => {
    const today = new Date()
    
    // Ordenar planos por data de vigência (mais recente primeiro)
    const eligiblePlans = allPlans
      .filter(plan => new Date(plan.effective_date) <= today)
      .sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime())

    // O micro plano ativo deve ser o mais recente que já deveria estar ativo (data <= hoje)
    // Independente de ter registros financeiros ou não
    let newActive = null
    if (eligiblePlans.length > 0) {
      newActive = eligiblePlans[0] // O mais recente que já deveria estar ativo
    } else if (allPlans.length > 0) {
      // Se nenhum plano deveria estar ativo ainda, usar o mais antigo (primeiro criado)
      newActive = allPlans.sort((a, b) => new Date(a.created_at || a.effective_date).getTime() - new Date(b.created_at || b.effective_date).getTime())[0]
    }

    setActiveMicroPlan(newActive)
    
    // Verificar se o novo micro plano ativo tem financial record
    if (newActive) {
      await checkFinancialRecordForActivePlan(newActive, userId, allPlans)
    }
  }, [checkFinancialRecordForActivePlan])

  const fetchMicroPlans = useCallback(async () => {
    if (!lifeInvestmentPlanId) return

    setIsLoading(true)
    setError(null)

    try {
      const plans = await MicroInvestmentPlanService.fetchMicroPlansByLifePlanId(lifeInvestmentPlanId)
      setMicroPlans(plans)

      // Buscar o user_id do plano
      const { data: planData } = await supabase
        .from('investment_plans')
        .select('user_id')
        .eq('id', lifeInvestmentPlanId)
        .single()

      if (!planData?.user_id) {
        setActiveMicroPlan(null)
        setIsLoading(false)
        return
      }

      // Usar a função centralizada para determinar o micro plano ativo
      await reevaluateActiveMicroPlan(plans, planData.user_id)
    } catch (err) {
      console.error('Error fetching micro investment plans:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar micro planos')
    } finally {
      setIsLoading(false)
    }
  }, [lifeInvestmentPlanId, reevaluateActiveMicroPlan])

  const createMicroPlan = useCallback(async (data: CreateMicroInvestmentPlan): Promise<MicroInvestmentPlan | null> => {
    try {
      setError(null)
      const newMicroPlan = await MicroInvestmentPlanService.createMicroPlan(data)
      
      if (newMicroPlan) {
        // Atualizar a lista local
        setMicroPlans(prev => [...prev, newMicroPlan])
        
        // Se este micro plano é ativo (data <= hoje), atualizar o ativo
        const today = new Date()
        const isNewPlanActive = new Date(newMicroPlan.effective_date) <= today
        if (isNewPlanActive && (!activeMicroPlan || new Date(newMicroPlan.effective_date) >= new Date(activeMicroPlan.effective_date))) {
          setActiveMicroPlan(newMicroPlan)
        }
      }
      
      return newMicroPlan
    } catch (err) {
      console.error('Error creating micro investment plan:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar micro plano')
      return null
    }
  }, [activeMicroPlan])

  const updateMicroPlan = useCallback(async (id: string, data: UpdateMicroInvestmentPlan): Promise<MicroInvestmentPlan | null> => {
    try {
      setError(null)
      const updatedMicroPlan = await MicroInvestmentPlanService.updateMicroPlan(id, data)
      
      if (updatedMicroPlan) {
        // Atualizar a lista local
        const updatedPlans = microPlans.map(plan => plan.id === id ? updatedMicroPlan : plan)
        setMicroPlans(updatedPlans)
        
        // Buscar o user_id do plano para reavaliar o micro plano ativo
        const { data: planData } = await supabase
          .from('investment_plans')
          .select('user_id')
          .eq('id', lifeInvestmentPlanId)
          .single()

        if (planData?.user_id) {
          // Reavaliar qual micro plano deveria estar ativo
          await reevaluateActiveMicroPlan(updatedPlans, planData.user_id)
        }
      }
      
      return updatedMicroPlan
    } catch (err) {
      console.error('Error updating micro investment plan:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar micro plano')
      return null
    }
  }, [microPlans, lifeInvestmentPlanId, reevaluateActiveMicroPlan])

  const deleteMicroPlan = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      // Verificar se é o primeiro micro plano (base)
      setMicroPlans(prev => {
        if (prev.length > 0 && prev[0].id === id) {
          setError('Não é possível excluir o micro plano base')
          return prev
        }
        return prev
      })
      
      await MicroInvestmentPlanService.deleteMicroPlan(id)
      
      // Remover da lista local e recalcular ativo se necessário
      setMicroPlans(prev => {
        const newPlans = prev.filter(plan => plan.id !== id)
        
        // Se era o micro plano ativo, recalcular o ativo baseado na data atual
        if (activeMicroPlan?.id === id) {
          const today = new Date()
          const newActive = newPlans
            .filter(plan => new Date(plan.effective_date) <= today)
            .sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime())[0] || null
          setActiveMicroPlan(newActive)
        }
        
        return newPlans
      })
      
      return true
    } catch (err) {
      console.error('Error deleting micro investment plan:', err)
      setError(err instanceof Error ? err.message : 'Erro ao excluir micro plano')
      return false
    }
  }, [activeMicroPlan])

  const refreshMicroPlans = useCallback(async () => {
    await fetchMicroPlans()
  }, [fetchMicroPlans])

  useEffect(() => {
    fetchMicroPlans()
  }, [fetchMicroPlans])

  return {
    microPlans,
    activeMicroPlan,
    isLoading,
    error,
    createMicroPlan,
    updateMicroPlan,
    deleteMicroPlan,
    refreshMicroPlans,
    hasFinancialRecordForActivePlan
  }
}
