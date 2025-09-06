import { supabase } from '@/lib/supabase'
import { InvestmentPlan, MicroInvestmentPlan } from '@/types/financial'
import { calculateFutureValues, isCalculationReady, type FormData, type Calculations } from '@/utils/investmentPlanCalculations'
import { createDateWithoutTimezone } from '@/utils/dateUtils'

export interface PlanCreationData {
  user_id: string
  initial_amount: number
  plan_initial_date: string
  final_age: number
  plan_type: string
  limit_age?: number
  plan_end_accumulation_date: string
  legacy_amount?: number
  currency: string
  adjust_contribution_for_inflation: boolean
  adjust_income_for_inflation: boolean
  old_portfolio_profitability?: number | null
}

export interface MicroPlanCreationData {
  life_investment_plan_id: string
  effective_date: string
  monthly_deposit: number
  desired_income: number
  expected_return: number
  inflation: number
}

export interface ProfileData {
  birth_date: string
  name?: string
}

export class PlanCreationService {
  /**
   * Verifica se já existe um plano para um usuário
   */
  static async checkExistingPlan(userId: string): Promise<InvestmentPlan | null> {
    if (!userId) return null

    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        return null
      }

      return data && data.length > 0 ? data[0] : null
    } catch (error) {
      return null
    }
  }

  /**
   * Busca dados do perfil de um usuário
   */
  static async fetchProfileData(userId: string): Promise<ProfileData | null> {
    if (!userId) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('birth_date, name')
        .eq('id', userId)
        .single()

      if (error) {
        return null
      }

      return data
    } catch (error) {
      return null
    }
  }

  /**
   * Cria um novo plano de investimento (apenas dados básicos)
   */
  static async createPlan(planData: PlanCreationData): Promise<InvestmentPlan> {
    if (!planData.user_id) {
      throw new Error('User ID is required')
    }

    try {
      // Ajustar data (adicionar um dia para evitar problemas de timezone)
      const adjustedDate = createDateWithoutTimezone(planData.plan_initial_date)
      adjustedDate.setDate(adjustedDate.getDate() + 1)

      // Inserir plano no banco (apenas dados básicos)
      const { data, error } = await supabase.from("investment_plans").insert([
        {
          user_id: planData.user_id,
          initial_amount: planData.initial_amount,
          plan_initial_date: adjustedDate.toISOString().split('T')[0],
          final_age: planData.final_age,
          plan_type: planData.plan_type,
          plan_end_accumulation_date: planData.plan_end_accumulation_date,
          status: "active",
          adjust_contribution_for_inflation: planData.adjust_contribution_for_inflation,
          adjust_income_for_inflation: planData.adjust_income_for_inflation,
          limit_age: planData.limit_age,
          legacy_amount: planData.plan_type === "2" ? planData.legacy_amount : null,
          currency: planData.currency,
          old_portfolio_profitability: planData.old_portfolio_profitability,
        },
      ]).select().single()

      if (error) {
        throw new Error('Failed to create investment plan')
      }

      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Cria um micro plano de investimento
   */
  static async createMicroPlan(microPlanData: MicroPlanCreationData): Promise<MicroInvestmentPlan> {
    if (!microPlanData.life_investment_plan_id) {
      throw new Error('Life investment plan ID is required')
    }

    try {
      // Ajustar data (adicionar um dia para evitar problemas de timezone)
      const adjustedDate = createDateWithoutTimezone(microPlanData.effective_date)
      adjustedDate.setDate(adjustedDate.getDate() + 1)

      // Inserir micro plano no banco
      const { data, error } = await supabase.from("micro_investment_plans").insert([
        {
          life_investment_plan_id: microPlanData.life_investment_plan_id,
          effective_date: adjustedDate.toISOString().split('T')[0],
          monthly_deposit: microPlanData.monthly_deposit,
          desired_income: microPlanData.desired_income,
          expected_return: microPlanData.expected_return,
          inflation: microPlanData.inflation,
        },
      ]).select().single()

      if (error) {
        throw new Error('Failed to create micro investment plan')
      }

      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Calcula valores futuros baseado nos dados do formulário
   */
  static calculatePlanValues(formData: FormData, birthDate: Date): Calculations | null {
    if (!isCalculationReady(formData) || !birthDate) {
      return null
    }

    return calculateFutureValues(formData, birthDate)
  }

  /**
   * Valida se os dados do formulário estão prontos para cálculos
   */
  static isFormReady(formData: FormData): boolean {
    return isCalculationReady(formData)
  }

  /**
   * Calcula a idade atual baseada na data de nascimento
   */
  static calculateCurrentAge(birthDate: Date): number {
          const today = createDateWithoutTimezone(new Date())
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  /**
   * Gera opções de idade para o select
   */
  static generateAgeOptions(birthDate: Date): Array<{ value: number; label: string }> {
    const currentAge = this.calculateCurrentAge(birthDate)
    const options = []
    
    for (let i = 0; i <= 120 - currentAge; i++) {
      const age = currentAge + i
      options.push({
        value: age,
        label: `${age} anos`
      })
    }
    
    return options
  }
}
