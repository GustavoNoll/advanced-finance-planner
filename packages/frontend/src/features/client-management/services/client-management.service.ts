import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export interface CreateClientData {
  password: string
  name: string
  birth_date: string
}

export interface ClientProfile {
  id: string
  is_broker: boolean
  name: string
  birth_date: string
  broker_id: string
}

export class ClientManagementService {
  /**
   * Gera um email aleatório único
   */
  static generateRandomEmail(): string {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 12)
    return `${uuid}@foundation.com`
  }

  /**
   * Verifica se um email já existe
   */
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      return !error && data !== null
    } catch (error) {
      console.error('Error checking email existence:', error)
      return false
    }
  }

  /**
   * Cria um novo cliente
   */
  static async createClient(clientData: CreateClientData, brokerId: string): Promise<ClientProfile> {
    if (!brokerId) {
      throw new Error('Broker ID is required')
    }

    try {
      // Gerar um email único aleatório
      let email = this.generateRandomEmail()
      let emailExists = await this.checkEmailExists(email)

      // Continuar gerando novos emails até encontrar um que não existe
      while (emailExists) {
        email = this.generateRandomEmail()
        emailExists = await this.checkEmailExists(email)
      }

      // Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: clientData.password,
        user_metadata: {
          name: clientData.name,
          birth_date: clientData.birth_date
        },
        email_confirm: true
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // Criar perfil com broker_id
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            is_broker: false,
            name: clientData.name,
            birth_date: clientData.birth_date,
            broker_id: brokerId
          }
        ])

      if (profileError) throw profileError

      return {
        id: authData.user.id,
        is_broker: false,
        name: clientData.name,
        birth_date: clientData.birth_date,
        broker_id: brokerId
      }
    } catch (error) {
      console.error('Error in createClient:', error)
      throw error
    }
  }

  /**
   * Busca o perfil atual do usuário
   */
  static async getCurrentUserProfile(): Promise<{ id: string; is_broker: boolean } | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('id, is_broker')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error)
      return null
    }
  }

  /**
   * Verifica se um broker tem acesso a um cliente
   */
  static async checkBrokerAccess(brokerId: string, clientId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('broker_id')
        .eq('id', clientId)
        .single()

      if (error) {
        console.error('Error checking broker access:', error)
        return false
      }

      return data.broker_id === brokerId
    } catch (error) {
      console.error('Error in checkBrokerAccess:', error)
      return false
    }
  }

  /**
   * Busca todos os clientes de um broker
   */
  static async getClientsByBrokerId(brokerId: string): Promise<ClientProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('broker_id', brokerId)
        .eq('is_broker', false)
        .order('name')

      if (error) {
        console.error('Error fetching clients by broker:', error)
        throw new Error('Failed to fetch clients')
      }

      return data || []
    } catch (error) {
      console.error('Error in getClientsByBrokerId:', error)
      return []
    }
  }

  /**
   * Busca um cliente por ID
   */
  static async getClientById(clientId: string): Promise<ClientProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', clientId)
        .eq('is_broker', false)
        .single()

      if (error) {
        console.error('Error fetching client:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getClientById:', error)
      return null
    }
  }

  /**
   * Atualiza dados de um cliente
   */
  static async updateClient(clientId: string, clientData: Partial<ClientProfile>): Promise<ClientProfile> {
    if (!clientId) throw new Error('Client ID is required')

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(clientData)
        .eq('id', clientId)
        .select()
        .single()

      if (error) {
        console.error('Error updating client:', error)
        throw new Error('Failed to update client')
      }

      return data
    } catch (error) {
      console.error('Error in updateClient:', error)
      throw error
    }
  }

  /**
   * Remove um cliente
   */
  static async deleteClient(clientId: string): Promise<void> {
    if (!clientId) throw new Error('Client ID is required')

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', clientId)

      if (error) {
        console.error('Error deleting client:', error)
        throw new Error('Failed to delete client')
      }
    } catch (error) {
      console.error('Error in deleteClient:', error)
      throw error
    }
  }
}
