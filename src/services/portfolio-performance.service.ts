import { supabase } from '@/lib/supabase'
import type { ConsolidatedPerformance, PerformanceData } from '@/types/financial'

export interface CreateConsolidatedData {
  profile_id: string
  institution?: string | null
  period?: string | null
  report_date?: string | null
  initial_assets?: number | null
  movement?: number | null
  taxes?: number | null
  financial_gain?: number | null
  final_assets?: number | null
  yield?: number | null
  currency?: string | null
  account_name?: string | null
}

export interface UpdateConsolidatedData {
  institution?: string | null
  period?: string | null
  report_date?: string | null
  initial_assets?: number | null
  movement?: number | null
  taxes?: number | null
  financial_gain?: number | null
  final_assets?: number | null
  yield?: number | null
  currency?: string | null
  account_name?: string | null
}

export interface CreateDetailedData {
  profile_id: string
  institution?: string | null
  period?: string | null
  report_date?: string | null
  asset?: string | null
  issuer?: string | null
  asset_class?: string | null
  position?: number | null
  rate?: string | null
  maturity_date?: string | null
  yield?: number | null
  currency?: string | null
  account_name?: string | null
}

export interface UpdateDetailedData {
  institution?: string | null
  period?: string | null
  report_date?: string | null
  asset?: string | null
  issuer?: string | null
  asset_class?: string | null
  position?: number | null
  rate?: string | null
  maturity_date?: string | null
  yield?: number | null
  currency?: string | null
  account_name?: string | null
}

export class PortfolioPerformanceService {
  /**
   * Busca todos os dados consolidados de um perfil
   */
  static async fetchConsolidatedData(
    profileId: string,
    orderBy: 'period' | 'report_date' = 'period',
    ascending: boolean = false
  ): Promise<ConsolidatedPerformance[]> {
    const { data, error } = await supabase
      .from('consolidated_performance')
      .select('*')
      .eq('profile_id', profileId)
      .order(orderBy, { ascending })

    if (error) {
      throw new Error(`Erro ao buscar dados consolidados: ${error.message}`)
    }

    return data || []
  }

  /**
   * Busca todos os dados detalhados de um perfil
   */
  static async fetchDetailedData(
    profileId: string,
    orderBy: 'period' | 'report_date' = 'period',
    ascending: boolean = false
  ): Promise<PerformanceData[]> {
    const { data, error } = await supabase
      .from('performance_data')
      .select('*')
      .eq('profile_id', profileId)
      .order(orderBy, { ascending })

    if (error) {
      throw new Error(`Erro ao buscar dados detalhados: ${error.message}`)
    }

    return data || []
  }

  /**
   * Busca todos os dados (consolidados e detalhados) de um perfil
   */
  static async fetchAllData(
    profileId: string,
    orderBy: 'period' | 'report_date' = 'period',
    ascending: boolean = false
  ): Promise<{
    consolidated: ConsolidatedPerformance[]
    detailed: PerformanceData[]
  }> {
    const [consolidated, detailed] = await Promise.all([
      this.fetchConsolidatedData(profileId, orderBy, ascending),
      this.fetchDetailedData(profileId, orderBy, ascending)
    ])

    return { consolidated, detailed }
  }

  /**
   * Cria um novo registro consolidado
   */
  static async createConsolidatedRecord(
    data: CreateConsolidatedData
  ): Promise<ConsolidatedPerformance> {
    const { data: created, error } = await supabase
      .from('consolidated_performance')
      .insert([data])
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar registro consolidado: ${error.message}`)
    }

    if (!created) {
      throw new Error('Erro ao criar registro consolidado: nenhum dado retornado')
    }

    return created
  }

  /**
   * Atualiza um registro consolidado existente
   */
  static async updateConsolidatedRecord(
    id: string,
    data: UpdateConsolidatedData
  ): Promise<ConsolidatedPerformance> {
    const { data: updated, error } = await supabase
      .from('consolidated_performance')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar registro consolidado: ${error.message}`)
    }

    if (!updated) {
      throw new Error('Erro ao atualizar registro consolidado: nenhum dado retornado')
    }

    return updated
  }

  /**
   * Cria ou atualiza um registro consolidado
   */
  static async upsertConsolidatedRecord(
    data: CreateConsolidatedData & { id?: string }
  ): Promise<ConsolidatedPerformance> {
    if (data.id) {
      const { id, ...updateData } = data
      return this.updateConsolidatedRecord(id, updateData)
    } else {
      return this.createConsolidatedRecord(data)
    }
  }

  /**
   * Cria um novo registro detalhado
   */
  static async createDetailedRecord(
    data: CreateDetailedData
  ): Promise<PerformanceData> {
    const { data: created, error } = await supabase
      .from('performance_data')
      .insert([data])
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar registro detalhado: ${error.message}`)
    }

    if (!created) {
      throw new Error('Erro ao criar registro detalhado: nenhum dado retornado')
    }

    return created
  }

  /**
   * Atualiza um registro detalhado existente
   */
  static async updateDetailedRecord(
    id: string,
    data: UpdateDetailedData
  ): Promise<PerformanceData> {
    const { data: updated, error } = await supabase
      .from('performance_data')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar registro detalhado: ${error.message}`)
    }

    if (!updated) {
      throw new Error('Erro ao atualizar registro detalhado: nenhum dado retornado')
    }

    return updated
  }

  /**
   * Cria ou atualiza um registro detalhado
   */
  static async upsertDetailedRecord(
    data: CreateDetailedData & { id?: string }
  ): Promise<PerformanceData> {
    if (data.id) {
      const { id, ...updateData } = data
      return this.updateDetailedRecord(id, updateData)
    } else {
      return this.createDetailedRecord(data)
    }
  }

  /**
   * Deleta um registro consolidado
   */
  static async deleteConsolidatedRecord(id: string): Promise<void> {
    const { error } = await supabase
      .from('consolidated_performance')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar registro consolidado: ${error.message}`)
    }
  }

  /**
   * Deleta múltiplos registros consolidados
   */
  static async deleteMultipleConsolidatedRecords(ids: string[]): Promise<void> {
    if (ids.length === 0) return

    const { error } = await supabase
      .from('consolidated_performance')
      .delete()
      .in('id', ids)

    if (error) {
      throw new Error(`Erro ao deletar registros consolidados: ${error.message}`)
    }
  }

  /**
   * Deleta um registro detalhado
   */
  static async deleteDetailedRecord(id: string): Promise<void> {
    const { error } = await supabase
      .from('performance_data')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar registro detalhado: ${error.message}`)
    }
  }

  /**
   * Deleta múltiplos registros detalhados
   */
  static async deleteMultipleDetailedRecords(ids: string[]): Promise<void> {
    if (ids.length === 0) return

    const { error } = await supabase
      .from('performance_data')
      .delete()
      .in('id', ids)

    if (error) {
      throw new Error(`Erro ao deletar registros detalhados: ${error.message}`)
    }
  }

  /**
   * Verifica se existe um registro consolidado duplicado
   * @param excludeId - ID do registro a excluir da verificação (útil ao editar)
   */
  static async checkConsolidatedDuplicate(
    profileId: string,
    institution: string | null,
    period: string | null,
    excludeId?: string
  ): Promise<boolean> {
    if (!period) return false

    let query = supabase
      .from('consolidated_performance')
      .select('id, institution')
      .eq('profile_id', profileId)
      .eq('period', period)

    // Excluir o registro atual da verificação quando estiver editando
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Erro ao verificar duplicata: ${error.message}`)
    }

    if (!data || data.length === 0) return false

    // Check if any record matches institution (handling null)
    return data.some(r => {
      const existingInst = r.institution
      return existingInst === institution
    })
  }

  /**
   * Verifica se existe um registro detalhado duplicado
   * @param excludeId - ID do registro a excluir da verificação (útil ao editar)
   */
  static async checkDetailedDuplicate(
    profileId: string,
    institution: string | null,
    asset: string | null,
    position: number,
    period: string | null,
    accountName: string | null,
    excludeId?: string
  ): Promise<boolean> {
    if (!period || !asset) return false

    let query = supabase
      .from('performance_data')
      .select('id, institution, account_name')
      .eq('profile_id', profileId)
      .eq('period', period)
      .eq('asset', asset)

    // Excluir o registro atual da verificação quando estiver editando
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Erro ao verificar duplicata: ${error.message}`)
    }

    if (!data || data.length === 0) return false

    // Check if any record matches institution and account_name (handling null)
    return data.some(r => {
      const existingInst = r.institution
      const existingAccount = r.account_name
      return existingInst === institution && existingAccount === accountName
    })
  }

  /**
   * Busca todos os registros consolidados existentes de um perfil (para verificação de duplicatas)
   */
  static async fetchExistingConsolidatedRecords(profileId: string): Promise<Array<{
    profile_id: string
    institution: string | null
    period: string | null
  }>> {
    const { data, error } = await supabase
      .from('consolidated_performance')
      .select('profile_id, institution, period')
      .eq('profile_id', profileId)

    if (error) {
      throw new Error(`Erro ao buscar registros consolidados existentes: ${error.message}`)
    }

    return data || []
  }

  /**
   * Busca todos os registros detalhados existentes de um perfil (para verificação de duplicatas)
   */
  static async fetchExistingDetailedRecords(profileId: string): Promise<Array<{
    profile_id: string
    institution: string | null
    asset: string | null
    position: number | null
    period: string | null
    account_name: string | null
  }>> {
    const { data, error } = await supabase
      .from('performance_data')
      .select('profile_id, institution, asset, position, period, account_name')
      .eq('profile_id', profileId)

    if (error) {
      throw new Error(`Erro ao buscar registros detalhados existentes: ${error.message}`)
    }

    return data || []
  }

  /**
   * Insere múltiplos registros consolidados em lote
   */
  static async bulkInsertConsolidatedRecords(records: CreateConsolidatedData[]): Promise<void> {
    if (records.length === 0) return

    const { error } = await supabase
      .from('consolidated_performance')
      .insert(records)

    if (error) {
      throw new Error(`Erro ao inserir registros consolidados em lote: ${error.message}`)
    }
  }

  /**
   * Insere múltiplos registros detalhados em lote
   */
  static async bulkInsertDetailedRecords(records: CreateDetailedData[]): Promise<void> {
    if (records.length === 0) return

    const { error } = await supabase
      .from('performance_data')
      .insert(records)

    if (error) {
      throw new Error(`Erro ao inserir registros detalhados em lote: ${error.message}`)
    }
  }
}
