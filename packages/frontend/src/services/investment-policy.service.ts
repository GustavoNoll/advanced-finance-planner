import { supabase } from '@/lib/supabase'

// Platform interface
export interface Platform {
  name: string
}

// Area of interest interface
export interface AreaOfInterest {
  name: string
}

// Asset restriction interface
export interface AssetRestriction {
  name: string
}

// Child interface
export interface Child {
  id: string
  name: string
  birth_date: string
  created_at: string
  updated_at: string
  family_structure_id: string
}

// Investment property interface
export interface InvestmentProperty {
  name: string
  value: number
  country: string
  location: {
    cep: string
    city: string
    state: string
    number: string
    street: string
    complement: string
    neighborhood: string
  }
  description: string
}

// Investment interface
export interface Investments {
  properties: InvestmentProperty[]
  participations: unknown[]
  emergency_reserve: unknown[]
  liquid_investments: unknown[]
}

// Liabilities interface
export interface Liabilities {
  debts: unknown[]
  financing: unknown[]
}

// Personal assets interface
export interface PersonalAssets {
  vehicles: unknown[]
  properties: unknown[]
  valuable_goods: unknown[]
}

// Hobby interface
export interface Hobby {
  name: string
}

// Insurance interface
export interface Insurance {
  type: string
  company: string
  last_review_date: string
}

// Objective interface
export interface Objective {
  name: string
}

// Income interface
export interface Income {
  amount: number
  description: string
}

// Expense interface
export interface Expense {
  amount: number
  description: string
}

// Investment preferences interface
export interface InvestmentPreferences {
  id?: string
  policy_id?: string
  created_at?: string
  updated_at?: string
  risk_profile?: string
  platforms_used?: Platform[]
  areas_of_interest?: AreaOfInterest[]
  fgc_event_feeling?: string
  max_bond_maturity?: string
  asset_restrictions?: AssetRestriction[]
  max_fund_liquidity?: string
  max_acceptable_loss?: string
  target_return_review?: string
  stock_investment_mode?: string
  real_estate_funds_mode?: string
  target_return_ipca_plus?: string
}

// Professional information interface
export interface ProfessionalInformation {
  id?: string
  policy_id?: string
  created_at?: string
  occupation?: string
  updated_at?: string
  work_regime?: 'pj' | 'clt' | 'public_servant'
  work_location?: string
  work_description?: string
  tax_declaration_method?: 'simplified' | 'complete' | 'exempt'
}

// Family structure interface
export interface FamilyStructure {
  id?: string
  children?: Child[]
  policy_id?: string
  created_at?: string
  updated_at?: string
  spouse_name?: string
  has_children?: boolean
  marital_status?: string
  spouse_birth_date?: string
}

// Patrimonial situation interface
export interface PatrimonialSituation {
  id?: string
  policy_id?: string
  created_at?: string
  updated_at?: string
  investments?: Investments
  liabilities?: Liabilities
  personal_assets?: PersonalAssets
}

// Life information interface
export interface LifeInformation {
  id?: string
  hobbies?: Hobby[]
  policy_id?: string
  created_at?: string
  insurances?: Insurance[]
  life_stage?: 'accumulation' | 'enjoyment' | 'consolidation'
  objectives?: Objective[]
  updated_at?: string
}

// Budget interface
export interface Budget {
  id?: string
  bonus?: number | null
  incomes?: Income[]
  savings?: number | null
  expenses?: Expense[]
  dividends?: number | null
  policy_id?: string
  created_at?: string
  updated_at?: string
}

// Asset allocation type alias
export type AssetAllocation = Record<string, number>

export interface InvestmentPolicyData {
  id?: string
  profile_id?: string
  investment_preferences?: InvestmentPreferences
  professional_information?: ProfessionalInformation
  family_structures?: FamilyStructure
  budgets?: Budget
  patrimonial_situations?: PatrimonialSituation
  life_information?: LifeInformation
  asset_allocations?: Record<string, number>
  created_at?: string
  updated_at?: string
}

export interface PolicySectionData {
  id?: string
  policy_id?: string
  [key: string]: unknown
}

export class InvestmentPolicyService {
  /**
   * Busca a política de investimento de um cliente
   */
  static async fetchPolicyByClientId(clientId: string): Promise<InvestmentPolicyData> {
    if (!clientId) {
      return this.getDefaultEmptyPolicy()
    }

    try {
      // Primeiro, tentar buscar política existente
      const { data: existingPolicy, error: fetchError } = await supabase
        .from('investment_policies')
        .select(`
          *,
          investment_preferences (*),
          professional_information (*),
          family_structures (*, children (*)),
          budgets (*),
          patrimonial_situations (*),
          life_information (*),
          asset_allocations (*)
        `)
        .eq('profile_id', clientId)
        .maybeSingle()

      if (fetchError) {
        console.error('Error fetching investment policy:', fetchError)
        return this.getDefaultEmptyPolicy()
      }

      // Se a política existe, retorná-la
      if (existingPolicy) {
        const assetAllocations = existingPolicy.asset_allocations?.reduce((acc, curr) => ({
          ...acc,
          [curr.asset_class]: curr.allocation
        }), {}) || {}

        return {
          ...this.getDefaultEmptyPolicy(),
          ...existingPolicy,
          investment_preferences: existingPolicy?.investment_preferences || {},
          professional_information: existingPolicy?.professional_information || {},
          family_structures: existingPolicy?.family_structures || {},
          budgets: existingPolicy?.budgets || {},
          patrimonial_situations: existingPolicy?.patrimonial_situations || {},
          life_information: existingPolicy?.life_information || {},
          asset_allocations: assetAllocations,
        }
      }

      // Se não existe política, criar uma nova
      const { data: newPolicy, error: createError } = await supabase
        .from('investment_policies')
        .insert([{ profile_id: clientId }])
        .select()
        .single()

      if (createError) {
        console.error('Error creating investment policy:', createError)
        return this.getDefaultEmptyPolicy()
      }

      return {
        ...this.getDefaultEmptyPolicy(),
        ...newPolicy,
      }
    } catch (error) {
      console.error('Error in fetchPolicyByClientId:', error)
      return this.getDefaultEmptyPolicy()
    }
  }

  /**
   * Atualiza uma seção específica da política
   */
  static async updatePolicySection(
    policyId: string,
    sectionName: string,
    sectionData: PolicySectionData
  ): Promise<Record<string, unknown>> {
    if (!policyId) throw new Error('Policy ID is required')

    try {
      const { data, error } = await supabase
        .from(sectionName)
        .upsert([{ ...sectionData, policy_id: policyId }])
        .select()
        .single()

      if (error) {
        console.error(`Error updating ${sectionName}:`, error)
        throw new Error(`Failed to update ${sectionName}`)
      }

      return data
    } catch (error) {
      console.error(`Error in updatePolicySection for ${sectionName}:`, error)
      throw error
    }
  }

  /**
   * Atualiza as alocações de ativos
   */
  static async updateAssetAllocations(
    policyId: string,
    assetAllocations: Record<string, number>
  ): Promise<void> {
    if (!policyId) throw new Error('Policy ID is required')

    try {
      // Primeiro, deletar alocações existentes
      const { error: deleteError } = await supabase
        .from('asset_allocations')
        .delete()
        .eq('policy_id', policyId)

      if (deleteError) {
        console.error('Error deleting existing asset allocations:', deleteError)
        throw new Error('Failed to update asset allocations')
      }

      // Depois, inserir novas alocações
      const allocationsToInsert = Object.entries(assetAllocations).map(([assetClass, allocation]) => ({
        policy_id: policyId,
        asset_class: assetClass,
        allocation: allocation
      }))

      if (allocationsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('asset_allocations')
          .insert(allocationsToInsert)

        if (insertError) {
          console.error('Error inserting asset allocations:', insertError)
          throw new Error('Failed to update asset allocations')
        }
      }
    } catch (error) {
      console.error('Error in updateAssetAllocations:', error)
      throw error
    }
  }

  /**
   * Busca dados de uma seção específica
   */
  static async fetchSectionData(
    policyId: string,
    sectionName: string
  ): Promise<Record<string, unknown>[]> {
    if (!policyId) return []

    try {
      const { data, error } = await supabase
        .from(sectionName)
        .select('*')
        .eq('policy_id', policyId)

      if (error) {
        console.error(`Error fetching ${sectionName}:`, error)
        return []
      }

      return data || []
    } catch (error) {
      console.error(`Error in fetchSectionData for ${sectionName}:`, error)
      return []
    }
  }

  /**
   * Remove dados de uma seção específica
   */
  static async deleteSectionData(
    policyId: string,
    sectionName: string,
    recordId?: string
  ): Promise<void> {
    if (!policyId) throw new Error('Policy ID is required')

    try {
      let query = supabase
        .from(sectionName)
        .delete()
        .eq('policy_id', policyId)

      if (recordId) {
        query = query.eq('id', recordId)
      }

      const { error } = await query

      if (error) {
        console.error(`Error deleting ${sectionName}:`, error)
        throw new Error(`Failed to delete ${sectionName}`)
      }
    } catch (error) {
      console.error(`Error in deleteSectionData for ${sectionName}:`, error)
      throw error
    }
  }

  /**
   * Calcula estatísticas da política
   */
  static calculatePolicyStats(policy: InvestmentPolicyData) {
    const sections = [
      'investment_preferences',
      'professional_information',
      'family_structures',
      'budgets',
      'patrimonial_situations',
      'life_information'
    ]

    const completedSections = sections.filter(section => {
      const data = policy[section as keyof InvestmentPolicyData]
      return data && typeof data === 'object' && Object.keys(data).length > 1
    }).length

    const totalSections = sections.length
    const completionRate = totalSections > 0 ? (completedSections / totalSections) * 100 : 0

    return {
      totalSections,
      completedSections,
      completionRate,
      hasAssetAllocations: policy.asset_allocations && Object.keys(policy.asset_allocations).length > 0
    }
  }

  /**
   * Retorna política vazia padrão
   */
  private static getDefaultEmptyPolicy(): InvestmentPolicyData {
    return {
      investment_preferences: {},
      professional_information: {},
      family_structures: {},
      patrimonial_situations: {},
      life_information: {},
      budgets: {},
      asset_allocations: {}
    }
  }

  /**
   * Valida se uma política está completa
   */
  static validatePolicyCompleteness(policy: InvestmentPolicyData): {
    isValid: boolean
    missingSections: string[]
    errors: string[]
  } {
    const missingSections: string[] = []
    const errors: string[] = []

    // Verificar se todas as seções têm dados
    const requiredSections = [
      { key: 'investment_preferences', name: 'Preferências de Investimento' },
      { key: 'professional_information', name: 'Informações Profissionais' },
      { key: 'family_structures', name: 'Estrutura Familiar' },
      { key: 'budgets', name: 'Orçamento' },
      { key: 'patrimonial_situations', name: 'Situação Patrimonial' },
      { key: 'life_information', name: 'Informações de Vida' }
    ]

    requiredSections.forEach(section => {
      const data = policy[section.key as keyof InvestmentPolicyData]
      if (!data || typeof data !== 'object' || Object.keys(data).length <= 1) {
        missingSections.push(section.name)
      }
    })

    // Verificar se há alocações de ativos
    if (!policy.asset_allocations || Object.keys(policy.asset_allocations).length === 0) {
      missingSections.push('Alocação de Ativos')
    }

    const isValid = missingSections.length === 0

    return {
      isValid,
      missingSections,
      errors
    }
  }
}
