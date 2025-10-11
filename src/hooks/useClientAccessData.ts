import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ClientAccessData } from '@/components/shared/ClientAccessAnalysis';

export function useClientAccessData() {
  const [clientAccessData, setClientAccessData] = useState<ClientAccessData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processClientData = useCallback((clients: { id: string; profile_name?: string; email?: string; last_active_at?: string | null }[]) => {
    const processedData = clients.map((client) => {
      let daysSinceLogin = 999; // Default para clientes que nunca fizeram login
      
      if (client.last_active_at) {
        const lastLoginDate = new Date(client.last_active_at);
        const today = new Date();
        daysSinceLogin = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
      }

      return {
        id: client.id,
        name: client.profile_name || 'Nome não informado',
        email: client.email || '',
        lastLogin: client.last_active_at || 'Nunca',
        brokerName: '',
        daysSinceLogin: daysSinceLogin
      };
    });

    setClientAccessData(processedData);
  }, []);

  const fetchClientAccessData = useCallback(async (brokerId?: string) => {
    setIsLoading(true);
    setError(null);
    
    
    try {
      
      // Se brokerId for fornecido, filtrar apenas os clientes desse broker
      if (brokerId) {
        // Para o broker, vamos buscar os dados diretamente da view user_profiles_investment
        const { data: activityStats, error: statsError } = await supabase
          .from('user_profiles_investment')
          .select('id, profile_name, last_active_at')
          .eq('broker_id', brokerId)
          .order('profile_name');

        if (statsError) {
          console.error('Error fetching broker client data:', statsError);
          throw statsError;
        }


        // Calcular dias desde o último login
        const allAccessData = activityStats?.map((stat: {
          id: string;
          profile_name: string;
          last_active_at: string | null;
        }) => {
          let daysSinceLogin = 999; // Default para clientes que nunca fizeram login
          
          if (stat.last_active_at) {
            const lastLoginDate = new Date(stat.last_active_at);
            const today = new Date();
            daysSinceLogin = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
          }

          return {
            id: stat.id,
            name: stat.profile_name || 'Nome não informado',
            email: '', // Não necessário para os gráficos
            lastLogin: stat.last_active_at || 'Nunca',
            brokerName: '', // Não necessário para os gráficos
            daysSinceLogin: daysSinceLogin
          };
        }) || [];

        setClientAccessData(allAccessData);
      } else {
        // Para admin, usar a função RPC original
        const { data: activityStats, error: statsError } = await supabase
          .rpc('get_client_activity_stats');

        if (statsError) {
          throw statsError;
        }

        // Processar dados para gráficos
        const allAccessData = activityStats?.map((stat: {
          id: string;
          name: string;
          last_active_at: string;
          days_since_login: number;
        }) => ({
          id: stat.id,
          name: stat.name || 'Nome não informado',
          email: '', // Não necessário para os gráficos
          lastLogin: stat.last_active_at || 'Nunca',
          brokerName: '', // Não necessário para os gráficos
          daysSinceLogin: stat.days_since_login || 999
        })) || [];

        setClientAccessData(allAccessData);
      }

    } catch (error) {
      console.error('Error fetching client access data:', error);
      setError(error instanceof Error ? error.message : 'Erro ao buscar dados de acesso');
      setClientAccessData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    clientAccessData,
    isLoading,
    error,
    fetchClientAccessData,
    processClientData
  };
}
