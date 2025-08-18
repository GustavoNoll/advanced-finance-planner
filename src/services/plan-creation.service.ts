import { supabase } from '@/lib/supabase'
import { InvestmentPlan } from '@/types/financial'
import { calculateFutureValues, isCalculationReady, type FormData, type Calculations } from '@/utils/investmentPlanCalculations'
import { createDateWithoutTimezone } from '@/utils/dateUtils'

export interface PlanCreationData {
  user_id: string
  initial_amount: number
  plan_initial_date: string
  plan_end_accumulation_date: string
  final_age: number
  monthly_deposit: number
  desired_income: number
  expected_return: number
  inflation: number
  plan_type: string
  adjust_contribution_for_inflation: boolean
  adjust_income_for_inflation: boolean
  limit_age?: number
  legacy_amount?: number
  currency: string
  old_portfolio_profitability?: number | null
}

export interface ProfileData {
  birth_date: string
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
        console.error('Error checking existing plan:', error)
        return null
      }

      return data && data.length > 0 ? data[0] : null
    } catch (error) {
      console.error('Error in checkExistingPlan:', error)
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
        .select('birth_date')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile data:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in fetchProfileData:', error)
      return null
    }
  }

  /**
   * Cria um novo plano de investimento
   */
  static async createPlan(planData: PlanCreationData, birthDate: Date): Promise<InvestmentPlan> {
    if (!planData.user_id) {
      throw new Error('User ID is required')
    }

    try {
      // Preparar dados do formulário para cálculos
      const formData: FormData = {
        initialAmount: planData.initial_amount.toString(),
        plan_initial_date: planData.plan_initial_date,
        finalAge: planData.final_age.toString(),
        planEndAccumulationDate: planData.plan_end_accumulation_date,
        monthlyDeposit: planData.monthly_deposit.toString(),
        desiredIncome: planData.desired_income.toString(),
        expectedReturn: planData.expected_return.toString(),
        inflation: planData.inflation.toString(),
        planType: planData.plan_type,
        adjustContributionForInflation: planData.adjust_contribution_for_inflation,
        adjustIncomeForInflation: planData.adjust_income_for_inflation,
        limitAge: planData.limit_age?.toString() || "100",
        legacyAmount: planData.legacy_amount?.toString() || "1000000",
        currency: planData.currency as 'BRL' | 'USD' | 'EUR',
        oldPortfolioProfitability: planData.old_portfolio_profitability?.toString() || null,
        hasOldPortfolio: planData.old_portfolio_profitability !== null,
      }

      // Verificar se os cálculos estão prontos
      if (!isCalculationReady(formData)) {
        throw new Error('Required data for calculations is missing')
      }

      // Calcular valores futuros
      const calculations = calculateFutureValues(formData, birthDate)

      // Ajustar datas (adicionar um dia para evitar problemas de timezone)
      const adjustedDate = createDateWithoutTimezone(planData.plan_initial_date)
      adjustedDate.setDate(adjustedDate.getDate() + 1)
      const adjustedEndDate = createDateWithoutTimezone(planData.plan_end_accumulation_date)
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)

      // Inserir plano no banco
      const { data, error } = await supabase.from("investment_plans").insert([
        {
          user_id: planData.user_id,
          initial_amount: planData.initial_amount,
          plan_initial_date: adjustedDate.toISOString().split('T')[0],
          plan_end_accumulation_date: adjustedEndDate.toISOString().split('T')[0],
          final_age: planData.final_age,
          monthly_deposit: planData.monthly_deposit,
          desired_income: planData.desired_income,
          expected_return: planData.expected_return,
          inflation: planData.inflation,
          plan_type: planData.plan_type,
          future_value: calculations.futureValue,
          inflation_adjusted_income: calculations.inflationAdjustedIncome,
          required_monthly_deposit: calculations.requiredMonthlyDeposit,
          present_future_value: calculations.presentFutureValue,
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
