import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/shared/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth/components/AuthProvider'
import { useTranslation } from 'react-i18next'
import { createDateWithoutTimezone } from '@/utils/dateUtils'
import { MicroInvestmentPlanService, MicroInvestmentPlan } from '@/features/investment-plans/services/micro-investment-plan.service'
type SimplifiedFormData = {
  initialAmount: string;
  plan_initial_date: string;
  finalAge: string;
  planEndAccumulationDate: string;
  planType: string;
  adjustContributionForInflation: boolean;
  adjustIncomeForInflation: boolean;
  limitAge: string;
  legacyAmount: string;
  currency: 'BRL' | 'USD' | 'EUR';
  oldPortfolioProfitability: string | null;
  hasOldPortfolio: boolean;
}

interface UseInvestmentPlanOperationsProps {
  formData: SimplifiedFormData
  birthDate: Date | null
  setLoading: (loading: boolean) => void
  setIsLoadingData: (loading: boolean) => void
}

export function useInvestmentPlanOperations({
  formData,
  birthDate,
  setLoading,
  setIsLoadingData
}: UseInvestmentPlanOperationsProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Fetch plan data for editing
  const fetchPlan = useCallback(async (planId: string) => {
    setIsLoadingData(true)

    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('id', planId)
        .single()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch investment plan",
          variant: "destructive",
        })
        navigate('/')
        return null
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('broker_id, is_broker, birth_date')
        .eq('id', data.user_id)
        .single()

      if (profileError) {
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive",
        })
        navigate('/')
        return null
      }

      const { data: actualUser, error: actualUserError } = await supabase.auth.getUser()

      if (actualUserError) {
        toast({
          title: "Error",
          description: "Failed to fetch user",
        })
      }

      const { data: actualUserProfile, error: actualUserProfileError } = await supabase
        .from('profiles')
        .select('broker_id, is_broker')
        .eq('id', actualUser.user.id)
        .single()

      if (actualUserProfile.is_broker && profile.broker_id !== actualUser.user.id) {
        toast({
          title: "Error",
          description: "You don't have permission to edit this plan",
          variant: "destructive",
        })
        navigate('/')
        return null
      }

      // Buscar registros financeiros para verificar se o valor inicial pode ser editado
      const { data: financialRecords, error: financialRecordsError } = await supabase
        .from('user_financial_records')
        .select('id')
        .eq('user_id', data.user_id)
        .limit(1)

      if (financialRecordsError) {
        console.warn('Warning: Could not fetch financial records for validation:', financialRecordsError)
      }

      return { 
        plan: data, 
        profile,
        hasFinancialRecords: (financialRecords || []).length > 0
      }
    } catch (error) {
      console.error('Error fetching plan:', error)
      toast({
        title: "Error",
        description: "Failed to fetch plan data",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoadingData(false)
    }
  }, [navigate, toast, setIsLoadingData])

  // Fetch client profile for creating new plan
  const fetchClientProfile = useCallback(async (clientId: string) => {
    setIsLoadingData(true)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('birth_date')
        .eq('id', clientId)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error fetching client profile:', error)
      toast({
        title: "Error",
        description: "Failed to fetch client profile",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoadingData(false)
    }
  }, [toast, setIsLoadingData])

  // Create new plan
  const createPlan = useCallback(async (clientId: string) => {
    if (!birthDate) {
      toast({
        title: "Error",
        description: "Birth date is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      
      // Adjust the date to prevent UTC offset
      const adjustedDate = createDateWithoutTimezone(formData.plan_initial_date)
      adjustedDate.setDate(adjustedDate.getDate() + 1)

      const adjustedEndDate = createDateWithoutTimezone(formData.planEndAccumulationDate)
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)
      
      const { data, error } = await supabase
        .from("investment_plans")
        .insert({
          user_id: clientId,
          initial_amount: parseFloat((formData.initialAmount || '0').replace(',', '.')),
          plan_initial_date: adjustedDate.toISOString().split('T')[0],
          plan_end_accumulation_date: adjustedEndDate.toISOString().split('T')[0],
          final_age: parseInt(formData.finalAge || '0'),
          plan_type: formData.planType,
          adjust_contribution_for_inflation: formData.adjustContributionForInflation,
          adjust_income_for_inflation: formData.adjustIncomeForInflation,
          limit_age: formData.limitAge ? parseInt(formData.limitAge) : null,
          legacy_amount: formData.planType === "2" ? parseFloat((formData.legacyAmount || '0').replace(',', '.')) : null,
          currency: formData.currency,
          old_portfolio_profitability: formData.hasOldPortfolio && formData.oldPortfolioProfitability 
            ? parseInt(formData.oldPortfolioProfitability) 
            : null,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success",
        description: t('investmentPlan.create.success'),
      })

      navigate(`/investment-plan/${data.id}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [formData, birthDate, navigate, toast, t, setLoading])

  // Update existing plan
  const updatePlan = useCallback(async (planId: string) => {
    if (!birthDate) {
      toast({
        title: "Error",
        description: "Birth date is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      
      // Adjust the date to prevent UTC offset
      const adjustedDate = createDateWithoutTimezone(formData.plan_initial_date)
      adjustedDate.setDate(adjustedDate.getDate() + 1)

      const adjustedEndDate = createDateWithoutTimezone(formData.planEndAccumulationDate)
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)
      
      const { error } = await supabase
        .from("investment_plans")
        .update({
          initial_amount: parseFloat((formData.initialAmount || '0').replace(',', '.')),
          plan_initial_date: adjustedDate.toISOString().split('T')[0],
          plan_end_accumulation_date: adjustedEndDate.toISOString().split('T')[0],
          final_age: parseInt(formData.finalAge || '0'),
          plan_type: formData.planType,
          adjust_contribution_for_inflation: formData.adjustContributionForInflation,
          adjust_income_for_inflation: formData.adjustIncomeForInflation,
          limit_age: formData.limitAge ? parseInt(formData.limitAge) : null,
          legacy_amount: formData.planType === "2" ? parseFloat((formData.legacyAmount || '0').replace(',', '.')) : null,
          currency: formData.currency,
          old_portfolio_profitability: formData.hasOldPortfolio && formData.oldPortfolioProfitability 
            ? parseInt(formData.oldPortfolioProfitability) 
            : null,
        })
        .eq('id', planId)

      if (error) throw error

      // Buscar micro planos e atualizar o primeiro se existir
      let microPlans: MicroInvestmentPlan[] = []
      try {
        microPlans = await MicroInvestmentPlanService.fetchMicroPlansByLifePlanId(planId)
        if (microPlans && microPlans.length > 0) {
          // Ordenar por data de criação para pegar o primeiro (mais antigo)
          const firstMicroPlan = microPlans.sort((a, b) => 
            new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
          )[0]
          
          // Atualizar a data efetiva do primeiro micro plano para a nova data do plano
          await MicroInvestmentPlanService.updateMicroPlan(firstMicroPlan.id, {
            effective_date: adjustedDate.toISOString().split('T')[0]
          })
        }
      } catch (microPlanError) {
        console.warn('Failed to update first micro plan date:', microPlanError)
        // Não falhar a operação principal se houver erro ao atualizar micro plano
      }

      // Verificar se houve micro planos atualizados para mostrar mensagem apropriada
      const hasMicroPlans = microPlans && microPlans.length > 0
      
      toast({
        title: "Success",
        description: hasMicroPlans 
          ? t('investmentPlan.edit.successWithMicroPlans')
          : t('investmentPlan.edit.success'),
      })

      navigate(`/investment-plan/${planId}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [formData, birthDate, navigate, toast, t, setLoading])

  // Check if plan already exists
  const checkExistingPlan = useCallback(async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', clientId)

      if (error) throw error

      if (data && data.length > 0) {
        toast({
          title: "Plan already exists",
          description: "This client already has an investment plan. Redirecting to edit page...",
        })
        navigate(`/edit-plan/${data[0].id}`)
        return true
      }
      return false
    } catch (error) {
      console.error('Error checking existing plan:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      })
      return false
    }
  }, [navigate, toast])

  return {
    fetchPlan,
    fetchClientProfile,
    createPlan,
    updatePlan,
    checkExistingPlan,
  }
}
