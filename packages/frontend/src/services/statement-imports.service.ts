import { supabase } from '@/lib/supabase'
import type { StatementImport } from '@/types/financial'

export class StatementImportsService {
  /**
   * Busca a última importação de um perfil
   */
  static async getLatestImport(profileId: string): Promise<StatementImport | null> {
    const { data, error } = await supabase
      .from('statement_imports')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw new Error(`Erro ao buscar última importação: ${error.message}`)
    }

    return data
  }

  /**
   * Busca todas as importações de um perfil
   */
  static async getAllImports(
    profileId: string,
    limit: number = 50
  ): Promise<StatementImport[]> {
    const { data, error } = await supabase
      .from('statement_imports')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Erro ao buscar importações: ${error.message}`)
    }

    return data || []
  }

  /**
   * Busca importações por status
   */
  static async getImportsByStatus(
    profileId: string,
    status: StatementImport['status']
  ): Promise<StatementImport[]> {
    const { data, error } = await supabase
      .from('statement_imports')
      .select('*')
      .eq('profile_id', profileId)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar importações por status: ${error.message}`)
    }

    return data || []
  }
}

