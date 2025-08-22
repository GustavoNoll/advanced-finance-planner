import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth/AuthProvider'
import { calculateFutureValues } from '@/utils/investmentPlanCalculations'
import { useTranslation } from 'react-i18next'
import { createDateWithoutTimezone } from '@/utils/dateUtils'
import type { FormData } from '@/utils/investmentPlanCalculations'

interface UseInvestmentPlanOperationsProps {
  formData: FormData
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
      const calculations = calculateFutureValues(formData, birthDate)
      
      // Adjust the date to prevent UTC offset
      const adjustedDate = createDateWithoutTimezone(formData.plan_initial_date)
      adjustedDate.setDate(adjustedDate.getDate() + 1)

      const adjustedEndDate = createDateWithoutTimezone(formData.planEndAccumulationDate)
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)
      
      const { data, error } = await supabase
        .from("investment_plans")
        .insert({
          user_id: clientId,
          initial_amount: parseFloat(formData.initialAmount.replace(',', '.')),
          plan_initial_date: adjustedDate.toISOString().split('T')[0],
          plan_end_accumulation_date: adjustedEndDate.toISOString().split('T')[0],
          final_age: parseInt(formData.finalAge),
          monthly_deposit: parseFloat(formData.monthlyDeposit.replace(',', '.')),
          desired_income: parseFloat(formData.desiredIncome.replace(',', '.')),
          expected_return: parseFloat(formData.expectedReturn.replace(',', '.')),
          inflation: parseFloat(formData.inflation.replace(',', '.')),
          plan_type: formData.planType,
          future_value: calculations.futureValue,
          present_future_value: calculations.presentFutureValue,
          inflation_adjusted_income: calculations.inflationAdjustedIncome,
          required_monthly_deposit: calculations.requiredMonthlyDeposit,
          adjust_contribution_for_inflation: formData.adjustContributionForInflation,
          adjust_income_for_inflation: formData.adjustIncomeForInflation,
          limit_age: formData.limitAge ? parseInt(formData.limitAge) : null,
          legacy_amount: formData.planType === "2" ? parseFloat(formData.legacyAmount.replace(',', '.')) : null,
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
      const calculations = calculateFutureValues(formData, birthDate)
      
      // Adjust the date to prevent UTC offset
      const adjustedDate = createDateWithoutTimezone(formData.plan_initial_date)
      adjustedDate.setDate(adjustedDate.getDate() + 1)

      const adjustedEndDate = createDateWithoutTimezone(formData.planEndAccumulationDate)
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)
      
      const { error } = await supabase
        .from("investment_plans")
        .update({
          initial_amount: parseFloat(formData.initialAmount.replace(',', '.')),
          plan_initial_date: adjustedDate.toISOString().split('T')[0],
          plan_end_accumulation_date: adjustedEndDate.toISOString().split('T')[0],
          final_age: parseInt(formData.finalAge),
          monthly_deposit: parseFloat(formData.monthlyDeposit.replace(',', '.')),
          desired_income: parseFloat(formData.desiredIncome.replace(',', '.')),
          expected_return: parseFloat(formData.expectedReturn.replace(',', '.')),
          inflation: parseFloat(formData.inflation.replace(',', '.')),
          plan_type: formData.planType,
          future_value: calculations.futureValue,
          present_future_value: calculations.presentFutureValue,
          inflation_adjusted_income: calculations.inflationAdjustedIncome,
          required_monthly_deposit: calculations.requiredMonthlyDeposit,
          adjust_contribution_for_inflation: formData.adjustContributionForInflation,
          adjust_income_for_inflation: formData.adjustIncomeForInflation,
          limit_age: formData.limitAge ? parseInt(formData.limitAge) : null,
          legacy_amount: formData.planType === "2" ? parseFloat(formData.legacyAmount.replace(',', '.')) : null,
          currency: formData.currency,
          old_portfolio_profitability: formData.hasOldPortfolio && formData.oldPortfolioProfitability 
            ? parseInt(formData.oldPortfolioProfitability) 
            : null,
        })
        .eq('id', planId)

      if (error) throw error

      toast({
        title: "Success",
        description: t('investmentPlan.edit.success'),
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
