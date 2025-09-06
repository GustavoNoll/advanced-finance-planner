import { supabase } from '@/lib/supabase'
import { InvestmentPlan } from '@/types/financial'

export interface InvestmentPlanWithProfile extends InvestmentPlan {
  profiles?: {
    name: string
    broker_id: string
    birth_date: string
  }
}

export interface InvestmentPlanFilters {
  userId?: string
  brokerId?: string
  status?: 'active' | 'inactive' | 'all'
}

export class InvestmentPlanService {
  /**
   * Busca um plano de investimento por ID com dados do perfil
   */
  static async fetchPlanById(planId: string): Promise<InvestmentPlanWithProfile | null> {
    if (!planId) return null

    try {
      // Buscar o plano de investimento
      const { data: investmentPlan, error: planError } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('id', planId)
        .single()

      if (planError) {
        console.error('Error fetching investment plan:', planError)
        return null
      }

      // Buscar o perfil relacionado
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, broker_id, birth_date')
        .eq('id', investmentPlan.user_id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        return null
      }

      // Combinar os resultados
      return {
        ...investmentPlan,
        profiles: profile
      }
    } catch (error) {
      console.error('Error in fetchPlanById:', error)
      return null
    }
  }

  /**
   * Busca todos os planos de investimento de um usuário
   */
  static async fetchPlansByUserId(userId: string): Promise<InvestmentPlan[]> {
    if (!userId) return []

    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching plans by user ID:', error)
        throw new Error('Failed to fetch investment plans')
      }

      return data || []
    } catch (error) {
      console.error('Error in fetchPlansByUserId:', error)
      return []
    }
  }

  /**
   * Busca todos os planos de investimento de um broker
   */
  static async fetchPlansByBrokerId(brokerId: string): Promise<InvestmentPlanWithProfile[]> {
    if (!brokerId) return []

    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select(`
          *,
          profiles!inner(name, broker_id, birth_date)
        `)
        .eq('profiles.broker_id', brokerId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching plans by broker ID:', error)
        throw new Error('Failed to fetch investment plans')
      }

      return data || []
    } catch (error) {
      console.error('Error in fetchPlansByBrokerId:', error)
      return []
    }
  }

  /**
   * Cria um novo plano de investimento
   */
  static async createPlan(planData: Partial<InvestmentPlan>): Promise<InvestmentPlan> {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .insert([planData])
        .select()
        .single()

      if (error) {
        console.error('Error creating investment plan:', error)
        throw new Error('Failed to create investment plan')
      }

      return data
    } catch (error) {
      console.error('Error in createPlan:', error)
      throw error
    }
  }

  /**
   * Atualiza um plano de investimento existente
   */
  static async updatePlan(planId: string, planData: Partial<InvestmentPlan>): Promise<InvestmentPlan> {
    if (!planId) throw new Error('Plan ID is required')

    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .update(planData)
        .eq('id', planId)
        .select()
        .single()

      if (error) {
        console.error('Error updating investment plan:', error)
        throw new Error('Failed to update investment plan')
      }

      return data
    } catch (error) {
      console.error('Error in updatePlan:', error)
      throw error
    }
  }

  /**
   * Remove um plano de investimento
   */
  static async deletePlan(planId: string): Promise<void> {
    if (!planId) throw new Error('Plan ID is required')

    try {
      const { error } = await supabase
        .from('investment_plans')
        .delete()
        .eq('id', planId)

      if (error) {
        console.error('Error deleting investment plan:', error)
        throw new Error('Failed to delete investment plan')
      }
    } catch (error) {
      console.error('Error in deletePlan:', error)
      throw error
    }
  }

  /**
   * Verifica se um usuário tem permissão para acessar um plano
   */
  static async checkPlanAccess(planId: string, userId: string): Promise<boolean> {
    if (!planId || !userId) return false

    try {
      const plan = await this.fetchPlanById(planId)
      if (!plan) return false

      // Verificar se o usuário é o dono do plano ou o broker
      return plan.user_id === userId || plan.profiles?.broker_id === userId
    } catch (error) {
      console.error('Error checking plan access:', error)
      return false
    }
  }

  /**
   * Calcula estatísticas dos planos
   */
  static calculatePlansStats(plans: InvestmentPlan[]) {
    const total = plans.length
    const active = plans.filter(plan => plan.status === 'active').length
    const inactive = plans.filter(plan => plan.status === 'inactive').length
    const totalInitialAmount = plans.reduce((sum, plan) => sum + plan.initial_amount, 0)
    const totalMonthlyDeposit = plans.reduce((sum, plan) => sum + plan.monthly_deposit, 0)

    return {
      total,
      active,
      inactive,
      totalInitialAmount,
      totalMonthlyDeposit,
      averageInitialAmount: total > 0 ? totalInitialAmount / total : 0,
      averageMonthlyDeposit: total > 0 ? totalMonthlyDeposit / total : 0
    }
  }

  /**
   * Filtra planos por critérios
   */
  static filterPlans(plans: InvestmentPlan[], filters: InvestmentPlanFilters): InvestmentPlan[] {
    let filteredPlans = plans

    if (filters.userId) {
      filteredPlans = filteredPlans.filter(plan => plan.user_id === filters.userId)
    }

    if (filters.status && filters.status !== 'all') {
      filteredPlans = filteredPlans.filter(plan => plan.status === filters.status)
    }

    return filteredPlans
  }
}
