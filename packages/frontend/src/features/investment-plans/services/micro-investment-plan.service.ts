import { supabase } from '@/lib/supabase'

export interface MicroInvestmentPlan {
  id: string
  life_investment_plan_id: string
  effective_date: string
  monthly_deposit: number
  desired_income: number
  expected_return: number
  adjust_contribution_for_accumulated_inflation: boolean
  adjust_income_for_accumulated_inflation: boolean
  inflation: number
  created_at?: string
  updated_at?: string
}

export interface CreateMicroInvestmentPlan {
  life_investment_plan_id: string
  effective_date: string
  monthly_deposit: number
  desired_income: number
  expected_return: number
  adjust_contribution_for_accumulated_inflation: boolean
  adjust_income_for_accumulated_inflation: boolean
  inflation: number
}

export interface UpdateMicroInvestmentPlan {
  effective_date?: string
  monthly_deposit?: number
  desired_income?: number
  expected_return?: number
  adjust_contribution_for_accumulated_inflation?: boolean
  adjust_income_for_accumulated_inflation?: boolean
  inflation?: number
}

export interface MicroInvestmentPlanFilters {
  lifeInvestmentPlanId?: string
  effectiveDateFrom?: string
  effectiveDateTo?: string
}

export class MicroInvestmentPlanService {
  /**
   * Busca um micro plano de investimento por ID
   */
  static async fetchMicroPlanById(microPlanId: string): Promise<MicroInvestmentPlan | null> {
    if (!microPlanId) return null

    try {
      const { data, error } = await supabase
        .from('micro_investment_plans')
        .select('*')
        .eq('id', microPlanId)
        .single()

      if (error) {
        console.error('Error fetching micro investment plan:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in fetchMicroPlanById:', error)
      return null
    }
  }

  /**
   * Busca todos os micro planos de um plano de investimento principal
   */
  static async fetchMicroPlansByLifePlanId(lifeInvestmentPlanId: string): Promise<MicroInvestmentPlan[]> {
    if (!lifeInvestmentPlanId) return []

    try {
      const { data, error } = await supabase
        .from('micro_investment_plans')
        .select('*')
        .eq('life_investment_plan_id', lifeInvestmentPlanId)
        .order('effective_date', { ascending: true })

      if (error) {
        console.error('Error fetching micro plans by life plan ID:', error)
        throw new Error('Failed to fetch micro investment plans')
      }

      return data || []
    } catch (error) {
      console.error('Error in fetchMicroPlansByLifePlanId:', error)
      return []
    }
  }

  /**
   * Busca o micro plano ativo (mais recente) de um plano de investimento
   */
  static async fetchActiveMicroPlan(lifeInvestmentPlanId: string): Promise<MicroInvestmentPlan | null> {
    if (!lifeInvestmentPlanId) return null

    try {
      const { data, error } = await supabase
        .from('micro_investment_plans')
        .select('*')
        .eq('life_investment_plan_id', lifeInvestmentPlanId)
        .order('effective_date', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error('Error fetching active micro plan:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in fetchActiveMicroPlan:', error)
      return null
    }
  }

  /**
   * Verifica se já existe um micro plano em uma data específica
   */
  static async checkMicroPlanExistsByDate(lifeInvestmentPlanId: string, effectiveDate: string): Promise<boolean> {
    if (!lifeInvestmentPlanId || !effectiveDate) return false

    try {
      const { data, error } = await supabase
        .from('micro_investment_plans')
        .select('id')
        .eq('life_investment_plan_id', lifeInvestmentPlanId)
        .eq('effective_date', effectiveDate)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking micro plan existence:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Error in checkMicroPlanExistsByDate:', error)
      return false
    }
  }

  /**
   * Cria um novo micro plano de investimento
   */
  static async createMicroPlan(microPlanData: CreateMicroInvestmentPlan): Promise<MicroInvestmentPlan> {
    try {
      const { data, error } = await supabase
        .from('micro_investment_plans')
        .insert([microPlanData])
        .select()
        .single()

      if (error) {
        console.error('Error creating micro investment plan:', error)
        throw new Error('Failed to create micro investment plan')
      }

      return data
    } catch (error) {
      console.error('Error in createMicroPlan:', error)
      throw error
    }
  }

  /**
   * Atualiza um micro plano de investimento existente
   */
  static async updateMicroPlan(microPlanId: string, microPlanData: UpdateMicroInvestmentPlan): Promise<MicroInvestmentPlan> {
    if (!microPlanId) throw new Error('Micro plan ID is required')

    try {
      const { data, error } = await supabase
        .from('micro_investment_plans')
        .update(microPlanData)
        .eq('id', microPlanId)
        .select()
        .single()

      if (error) {
        console.error('Error updating micro investment plan:', error)
        throw new Error('Failed to update micro investment plan')
      }

      return data
    } catch (error) {
      console.error('Error in updateMicroPlan:', error)
      throw error
    }
  }

  /**
   * Remove um micro plano de investimento
   */
  static async deleteMicroPlan(microPlanId: string): Promise<void> {
    if (!microPlanId) throw new Error('Micro plan ID is required')

    try {
      const { error } = await supabase
        .from('micro_investment_plans')
        .delete()
        .eq('id', microPlanId)

      if (error) {
        console.error('Error deleting micro investment plan:', error)
        throw new Error('Failed to delete micro investment plan')
      }
    } catch (error) {
      console.error('Error in deleteMicroPlan:', error)
      throw error
    }
  }

  /**
   * Filtra micro planos por critérios
   */
  static filterMicroPlans(microPlans: MicroInvestmentPlan[], filters: MicroInvestmentPlanFilters): MicroInvestmentPlan[] {
    let filteredPlans = microPlans

    if (filters.lifeInvestmentPlanId) {
      filteredPlans = filteredPlans.filter(plan => plan.life_investment_plan_id === filters.lifeInvestmentPlanId)
    }

    if (filters.effectiveDateFrom) {
      filteredPlans = filteredPlans.filter(plan => plan.effective_date >= filters.effectiveDateFrom!)
    }

    if (filters.effectiveDateTo) {
      filteredPlans = filteredPlans.filter(plan => plan.effective_date <= filters.effectiveDateTo!)
    }

    return filteredPlans
  }

  /**
   * Calcula estatísticas dos micro planos
   */
  static calculateMicroPlansStats(microPlans: MicroInvestmentPlan[]) {
    const total = microPlans.length
    const totalMonthlyDeposit = microPlans.reduce((sum, plan) => sum + plan.monthly_deposit, 0)
    const totalDesiredIncome = microPlans.reduce((sum, plan) => sum + plan.desired_income, 0)
    const averageExpectedReturn = total > 0 ? microPlans.reduce((sum, plan) => sum + plan.expected_return, 0) / total : 0
    const averageInflation = total > 0 ? microPlans.reduce((sum, plan) => sum + plan.inflation, 0) / total : 0

    return {
      total,
      totalMonthlyDeposit,
      totalDesiredIncome,
      averageExpectedReturn,
      averageInflation,
      averageMonthlyDeposit: total > 0 ? totalMonthlyDeposit / total : 0,
      averageDesiredIncome: total > 0 ? totalDesiredIncome / total : 0
    }
  }
}
