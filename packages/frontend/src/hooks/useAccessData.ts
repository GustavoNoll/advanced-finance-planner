// 1. Imports externos
import { useState, useCallback, useEffect } from 'react'

// 2. Imports internos (shared)
import { supabase } from '@/lib/supabase'
import { ClientAccessData } from '@/components/shared/ClientAccessAnalysis'

export interface BrokerAccessData {
  id: string
  name: string
  email: string
  lastLogin: string
  daysSinceLogin: number
  totalClients: number
  activeClients: number
}

interface UseAccessDataOptions {
  type?: 'client' | 'broker'
  brokerId?: string
  activeBrokerIds?: string[]
}

interface UseAccessDataReturn {
  // Client access data
  clientAccessData: ClientAccessData[]
  // Broker access data
  brokerAccessData: BrokerAccessData[]
  // Common states
  isLoading: boolean
  error: string | null
  // Client methods
  fetchClientAccessData: (brokerId?: string) => Promise<void>
  processClientData: (clients: { id: string; profile_name?: string; email?: string; last_active_at?: string | null }[]) => void
  // Broker methods
  fetchBrokerAccessData: () => Promise<void>
}

export function useAccessData(options: UseAccessDataOptions = {}): UseAccessDataReturn {
  const { type = 'client', brokerId, activeBrokerIds } = options

  // Client access state
  const [clientAccessData, setClientAccessData] = useState<ClientAccessData[]>([])
  
  // Broker access state
  const [brokerAccessData, setBrokerAccessData] = useState<BrokerAccessData[]>([])
  
  // Common state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Client access methods
  const processClientData = useCallback((clients: { id: string; profile_name?: string; email?: string; last_active_at?: string | null }[]) => {
    const processedData = clients.map((client) => {
      let daysSinceLogin = 999 // Default para clientes que nunca fizeram login
      
      if (client.last_active_at) {
        const lastLoginDate = new Date(client.last_active_at)
        const today = new Date()
        daysSinceLogin = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24))
      }

      return {
        id: client.id,
        name: client.profile_name || 'Nome não informado',
        email: client.email || '',
        lastLogin: client.last_active_at || 'Nunca',
        brokerName: '',
        daysSinceLogin: daysSinceLogin
      }
    })

    setClientAccessData(processedData)
  }, [])

  const fetchClientAccessData = useCallback(async (clientBrokerId?: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const targetBrokerId = clientBrokerId || brokerId
      
      // Se brokerId for fornecido, filtrar apenas os clientes desse broker
      if (targetBrokerId) {
        // Para o broker, vamos buscar os dados diretamente da view user_profiles_investment
        const { data: activityStats, error: statsError } = await supabase
          .from('user_profiles_investment')
          .select('id, profile_name, last_active_at')
          .eq('broker_id', targetBrokerId)
          .order('profile_name')

        if (statsError) {
          console.error('Error fetching broker client data:', statsError)
          throw statsError
        }

        // Calcular dias desde o último login
        const allAccessData = activityStats?.map((stat: {
          id: string
          profile_name: string
          last_active_at: string | null
        }) => {
          let daysSinceLogin = 999 // Default para clientes que nunca fizeram login
          
          if (stat.last_active_at) {
            const lastLoginDate = new Date(stat.last_active_at)
            const today = new Date()
            daysSinceLogin = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24))
          }

          return {
            id: stat.id,
            name: stat.profile_name || 'Nome não informado',
            email: '', // Não necessário para os gráficos
            lastLogin: stat.last_active_at || 'Nunca',
            brokerName: '', // Não necessário para os gráficos
            daysSinceLogin: daysSinceLogin
          }
        }) || []

        setClientAccessData(allAccessData)
      } else {
        // Para admin, usar a função RPC original
        const { data: activityStats, error: statsError } = await supabase
          .rpc('get_client_activity_stats')

        if (statsError) {
          throw statsError
        }

        // Processar dados para gráficos
        const allAccessData = activityStats?.map((stat: {
          id: string
          name: string
          last_active_at: string
          days_since_login: number
        }) => ({
          id: stat.id,
          name: stat.name || 'Nome não informado',
          email: '', // Não necessário para os gráficos
          lastLogin: stat.last_active_at || 'Nunca',
          brokerName: '', // Não necessário para os gráficos
          daysSinceLogin: stat.days_since_login || 999
        })) || []

        setClientAccessData(allAccessData)
      }
    } catch (error) {
      console.error('Error fetching client access data:', error)
      setError(error instanceof Error ? error.message : 'Erro ao buscar dados de acesso')
      setClientAccessData([])
    } finally {
      setIsLoading(false)
    }
  }, [brokerId])

  // Broker access methods
  const fetchBrokerAccessData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Se IDs foram fornecidos, usar diretamente. Caso contrário, buscar brokers ativos
      let query = supabase
        .from('profiles')
        .select('id, name, last_active_at')
        .eq('is_broker', true)
        .not('name', 'ilike', '%teste%')

      if (activeBrokerIds && activeBrokerIds.length > 0) {
        query = query.in('id', activeBrokerIds)
      } else {
        query = query.eq('active', true)
      }

      const { data: brokers, error: brokersError } = await query

      if (brokersError) throw brokersError

      // Buscar emails dos usuários separadamente
      const userIds = (brokers || []).map(broker => broker.id)
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', userIds)

      if (usersError) throw usersError

      // Criar um mapa de user_id para email
      const userEmailMap = (users || []).reduce((acc, user) => {
        acc[user.id] = user.email
        return acc
      }, {} as Record<string, string>)

      // Buscar dados de clientes por broker para calcular métricas
      const { data: clientsData, error: clientsError } = await supabase
        .from('user_profiles_investment')
        .select('broker_id, activity_status')

      if (clientsError) throw clientsError

      // Processar dados dos brokers
      const processedData = (brokers || []).map((broker) => {
        let daysSinceLogin = 999 // Default para brokers que nunca fizeram login

        if (broker.last_active_at) {
          const lastLoginDate = new Date(broker.last_active_at)
          const today = new Date()
          daysSinceLogin = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24))
        }

        // Calcular total de clientes e clientes ativos para este broker
        const brokerClients = clientsData?.filter(c => c.broker_id === broker.id) || []
        const totalClients = brokerClients.length
        const activeClients = brokerClients.filter(c => c.activity_status === 'active').length

        // Obter email do mapa
        const email = userEmailMap[broker.id] || ''

        return {
          id: broker.id,
          name: broker.name || 'Nome não informado',
          email: email,
          lastLogin: broker.last_active_at || 'Nunca',
          daysSinceLogin: daysSinceLogin,
          totalClients: totalClients,
          activeClients: activeClients
        }
      })

      setBrokerAccessData(processedData)
    } catch (error) {
      console.error('Error fetching broker access data:', error)
      setError(error instanceof Error ? error.message : 'Erro ao buscar dados de acesso dos consultores')
      setBrokerAccessData([])
    } finally {
      setIsLoading(false)
    }
  }, [activeBrokerIds])

  // Auto-fetch based on type (only if type is specified)
  useEffect(() => {
    if (type === 'client') {
      fetchClientAccessData()
    } else if (type === 'broker') {
      fetchBrokerAccessData()
    }
    // If no type specified, don't auto-fetch (caller will handle it)
  }, [type, fetchClientAccessData, fetchBrokerAccessData])

  return {
    clientAccessData,
    brokerAccessData,
    isLoading,
    error,
    fetchClientAccessData,
    processClientData,
    fetchBrokerAccessData
  }
}

