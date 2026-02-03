import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { toast } from '@/shared/components/ui/use-toast'
import { useAuth } from '@/features/auth/components/AuthProvider'
import { useMicroInvestmentPlans } from '@/hooks/useMicroInvestmentPlans'
import type { Profile } from '@/types/profiles'
import type { InvestmentPlan, MicroInvestmentPlan } from '@/types/financial'

type DashboardView = 'finances' | 'policies' | 'portfolio-performance'

interface UseDashboardReturn {
  // Data
  clientId: string
  clientProfile: Profile | null
  brokerProfile: Profile | null
  investmentPlan: InvestmentPlan | null
  microPlans: MicroInvestmentPlan[]
  activeMicroPlan: MicroInvestmentPlan | null
  hasFinancialRecordForActivePlan: boolean
  
  // UI State
  activeView: DashboardView
  setActiveView: (view: DashboardView) => void
  
  // Loading states
  isLoading: boolean
  
  // Actions
  handleLogout: () => Promise<void>
  handleShareClient: () => void
  refreshMicroPlans: () => Promise<void>
}

export function useDashboard(): UseDashboardReturn {
  const { user } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const { t } = useTranslation()
  
  const clientId = params.id || user?.id || ''
  const [activeView, setActiveView] = useState<DashboardView>('policies')

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: t('dashboard.messages.logoutSuccess'),
        description: "",
      })
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      toast({
        title: t('dashboard.messages.logoutError'),
        description: "",
        variant: "destructive",
      })
    }
  }, [navigate, t])

  const { data: investmentPlan, isLoading: isInvestmentPlanLoading } = useQuery({
    queryKey: ['investmentPlan', clientId],
    queryFn: async () => {
      if (!clientId) return null
      
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', clientId)

      if (error) {
        console.error(t('dashboard.messages.errors.fetchPlan'), error)
        return null
      }

      return data?.[0] || null
    },
    enabled: !!clientId,
  })

  const { data: profiles, isLoading: isProfilesLoading } = useQuery({
    queryKey: ['profiles', user?.id, clientId],
    queryFn: async () => {
      if (!user?.id) return { clientProfile: null, brokerProfile: null }
      
      const ids = [user.id]
      if (clientId && clientId !== user.id) {
        ids.push(clientId)
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', ids)

      if (error) {
        console.error(t('dashboard.messages.errors.fetchProfile'), error)
        return { clientProfile: null, brokerProfile: null }
      }

      return {
        clientProfile: data.find(p => p.id === clientId),
        brokerProfile: data.find(p => p.id === user.id && p.is_broker)
      }
    },
    enabled: !!user?.id,
  })

  const { clientProfile, brokerProfile } = profiles || {}

  const {
    microPlans,
    activeMicroPlan,
    isLoading: isMicroPlansLoading,
    refreshMicroPlans,
    hasFinancialRecordForActivePlan
  } = useMicroInvestmentPlans(investmentPlan?.id || '')

  useEffect(() => {
    if (!isInvestmentPlanLoading && !isProfilesLoading) { 
      // If user is a broker accessing their own dashboard (clientId === user.id), redirect to broker dashboard
      if (brokerProfile && clientId === user?.id) {
        navigate('/broker-dashboard')
        return
      }
      
      // If user is a broker but not viewing a client, redirect to broker dashboard
      if (brokerProfile && !params.id) {
        navigate('/broker-dashboard')
        return
      }
      
      // If viewing a client profile as a broker, verify client belongs to this broker
      if (brokerProfile && clientProfile && clientId !== user?.id) {
        if (clientProfile.broker_id !== user?.id) {
          toast({
            title: t('dashboard.messages.errors.unauthorizedAccess'),
            description: t('dashboard.messages.errors.clientNotAssociated'),
            variant: "destructive",
          })
          navigate('/broker-dashboard')
          return
        }
      }
      
      if (!investmentPlan) {
        if (brokerProfile) {
          // Only redirect to simulation if viewing a client, not if accessing own dashboard
          if (clientId !== user?.id) {
            toast({
              title: t('dashboard.messages.noPlan.title'),
              description: t('dashboard.messages.noPlan.description'),
            })
            navigate(`/simulation${params.id ? `?client_id=${params.id}` : ''}`)
            return
          } else {
            // Broker accessing own dashboard without plan, go to broker dashboard
            navigate('/broker-dashboard')
            return
          }
        }
        
        toast({
          title: t('dashboard.messages.contactBroker.title'),
          description: t('dashboard.messages.contactBroker.description'),
        })
        handleLogout()
        return
      }

      // Set active view based on URL (query param has priority, then path)
      const searchParams = new URLSearchParams(window.location.search)
      const viewParam = searchParams.get('view')

      if (viewParam === 'policies' || viewParam === 'finances' || viewParam === 'portfolio-performance') {
        setActiveView(viewParam as DashboardView)
      } else {
        const path = window.location.pathname
        if (path.includes('investment-policy')) setActiveView('policies')
        else if (path.includes('portfolio-performance')) setActiveView('portfolio-performance')
        else setActiveView('finances')
      }
    }
  }, [investmentPlan, brokerProfile, clientProfile, isInvestmentPlanLoading, isProfilesLoading, params.id, handleLogout, t, user?.id, clientId, navigate])

  const handleShareClient = useCallback(() => {
    const clientLoginUrl = `${window.location.origin}/client-login/${clientId}`
    navigator.clipboard.writeText(clientLoginUrl)
    toast({
      title: t('common.success'),
      description: t('brokerDashboard.linkCopied'),
    })
  }, [clientId, t])

  const isLoading = isInvestmentPlanLoading || isProfilesLoading || isMicroPlansLoading || (!investmentPlan && !brokerProfile)

  return {
    clientId,
    clientProfile,
    brokerProfile,
    investmentPlan,
    microPlans,
    activeMicroPlan,
    hasFinancialRecordForActivePlan,
    activeView,
    setActiveView,
    isLoading,
    handleLogout,
    handleShareClient,
    refreshMicroPlans,
  }
}
