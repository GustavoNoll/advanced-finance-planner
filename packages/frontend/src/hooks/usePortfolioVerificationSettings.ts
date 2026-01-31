import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface PortfolioVerificationSettings {
  id: string
  profile_id: string
  correct_threshold: number
  tolerance_value: number
  created_at: string
  updated_at: string
}

const DEFAULT_CORRECT_THRESHOLD = 0.01
const DEFAULT_TOLERANCE_VALUE = 2500.00

/**
 * Hook para buscar as configurações de verificação do portfolio por profile_id
 * Retorna as configurações ou valores padrão se não existirem
 */
export function usePortfolioVerificationSettings(profileId: string | null) {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['portfolioVerificationSettings', profileId],
    queryFn: async () => {
      if (!profileId) return null

      const { data, error } = await supabase
        .from('portfolio_verification_settings')
        .select('*')
        .eq('profile_id', profileId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      return data as PortfolioVerificationSettings | null
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Retornar valores padrão se não houver configurações
  const correctThreshold = settings?.correct_threshold ?? DEFAULT_CORRECT_THRESHOLD
  const toleranceValue = settings?.tolerance_value ?? DEFAULT_TOLERANCE_VALUE

  return {
    settings,
    correctThreshold,
    toleranceValue,
    isLoading,
    error,
    hasSettings: !!settings
  }
}

/**
 * Hook para atualizar as configurações de verificação do portfolio
 */
export function usePortfolioVerificationSettingsMutations(profileId: string | null) {
  const queryClient = useQueryClient()

  const updateSettings = useMutation({
    mutationFn: async ({
      correctThreshold,
      toleranceValue
    }: {
      correctThreshold: number
      toleranceValue: number
    }) => {
      if (!profileId) {
        throw new Error('Profile ID is required')
      }

      const { data, error } = await supabase
        .from('portfolio_verification_settings')
        .upsert({
          profile_id: profileId,
          correct_threshold: correctThreshold,
          tolerance_value: toleranceValue
        }, {
          onConflict: 'profile_id'
        })
        .select()
        .single()

      if (error) throw error

      return data as PortfolioVerificationSettings
    },
    onSuccess: () => {
      // Invalidar a query para refetch automático
      queryClient.invalidateQueries({ 
        queryKey: ['portfolioVerificationSettings', profileId] 
      })
    },
  })

  return {
    updateSettings
  }
}

