import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { FinancialRecord, InvestmentPlan, MicroInvestmentPlan } from '@/types/financial'
import { calculateFutureValues, FormData, Calculations } from '@/utils/investmentPlanCalculations'

interface UseFinancialRecordsForMicroPlanProps {
  planId: string
  activeMicroPlan: MicroInvestmentPlan | null
  plan: InvestmentPlan | null
  birthDate: Date
}

export function useFinancialRecordsForMicroPlan({ 
  planId, 
  activeMicroPlan, 
  plan, 
  birthDate 
}: UseFinancialRecordsForMicroPlanProps) {
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [calculations, setCalculations] = useState<Calculations | null>(null)

  // Memoize the user ID to prevent unnecessary re-renders
  const userId = useMemo(() => plan?.user_id, [plan?.user_id])

  const fetchFinancialRecords = useCallback(async () => {
    if (!planId || !activeMicroPlan || !userId) return

    try {
      setIsLoading(true)
      setError(null)

      // Buscar financial records do usuário
      const { data: records, error: recordsError } = await supabase
        .from('user_financial_records')
        .select('*')
        .eq('user_id', userId)
        .order('record_year', { ascending: true })
        .order('record_month', { ascending: true })

      if (recordsError) throw recordsError

      // Only update if the data has actually changed
      setFinancialRecords(prevRecords => {
        const newRecords = records || []
        if (prevRecords.length !== newRecords.length) {
          return newRecords
        }
        
        // Deep comparison to check if records have changed
        const hasChanged = prevRecords.some((prevRecord, index) => {
          const newRecord = newRecords[index]
          return !newRecord || 
                 prevRecord.id !== newRecord.id ||
                 prevRecord.ending_balance !== newRecord.ending_balance ||
                 prevRecord.record_year !== newRecord.record_year ||
                 prevRecord.record_month !== newRecord.record_month
        })
        
        return hasChanged ? newRecords : prevRecords
      })
    } catch (err) {
      console.error('Error fetching financial records:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar registros financeiros')
    } finally {
      setIsLoading(false)
    }
  }, [planId, activeMicroPlan, userId])

  const calculateMicroPlanValues = useCallback(() => {
    if (!activeMicroPlan || !plan || !birthDate) return

    try {
      // Se é o micro plano base, usar dados do plano principal
      if (activeMicroPlan.effective_date === plan.plan_initial_date) {
        const formData: FormData = {
          initialAmount: plan.initial_amount.toString(),
          plan_initial_date: plan.plan_initial_date,
          finalAge: plan.final_age.toString(),
          planEndAccumulationDate: plan.plan_end_accumulation_date || '',
          monthlyDeposit: activeMicroPlan.monthly_deposit.toString(),
          desiredIncome: activeMicroPlan.desired_income.toString(),
          expectedReturn: activeMicroPlan.expected_return.toString(),
          inflation: activeMicroPlan.inflation.toString(),
          planType: plan.plan_type,
          adjustContributionForInflation: plan.adjust_contribution_for_inflation,
          adjustIncomeForInflation: plan.adjust_income_for_inflation,
          limitAge: plan.limit_age?.toString() || '110',
          legacyAmount: plan.legacy_amount?.toString() || '0',
          currency: plan.currency,
          oldPortfolioProfitability: plan.old_portfolio_profitability?.toString() || null,
          hasOldPortfolio: plan.old_portfolio_profitability !== null
        }

        const calc = calculateFutureValues(formData, birthDate)
        setCalculations(calc)
        return
      }

      // Para micro planos não-base, buscar o financial record do mês anterior
      const microPlanDate = new Date(activeMicroPlan.effective_date)
      const previousMonth = microPlanDate.getMonth() === 0 ? 11 : microPlanDate.getMonth() - 1
      const previousYear = microPlanDate.getMonth() === 0 ? microPlanDate.getFullYear() - 1 : microPlanDate.getFullYear()

      const previousRecord = financialRecords.find(record => 
        record.record_year === previousYear && record.record_month === previousMonth + 1
      )

      // Se não existir financial record, usar o valor inicial do investment plan
      const initialAmount = previousRecord 
        ? previousRecord.ending_balance.toString()
        : plan.initial_amount.toString()

      if (!previousRecord) {
        console.warn('No financial record found for previous month, using investment plan initial amount')
      }

      // Calcular a partir do valor final do mês anterior ou valor inicial do plano
      const formData: FormData = {
        initialAmount,
        plan_initial_date: activeMicroPlan.effective_date,
        finalAge: plan.final_age.toString(),
        planEndAccumulationDate: plan.plan_end_accumulation_date || '',
        monthlyDeposit: activeMicroPlan.monthly_deposit.toString(),
        desiredIncome: activeMicroPlan.desired_income.toString(),
        expectedReturn: activeMicroPlan.expected_return.toString(),
        inflation: activeMicroPlan.inflation.toString(),
        planType: plan.plan_type,
        adjustContributionForInflation: plan.adjust_contribution_for_inflation,
        adjustIncomeForInflation: plan.adjust_income_for_inflation,
        limitAge: plan.limit_age?.toString() || '110',
        legacyAmount: plan.legacy_amount?.toString() || '0',
        currency: plan.currency,
        oldPortfolioProfitability: plan.old_portfolio_profitability?.toString() || null,
        hasOldPortfolio: plan.old_portfolio_profitability !== null
      }

      const calc = calculateFutureValues(formData, birthDate)
      setCalculations(calc)
    } catch (err) {
      console.error('Error calculating micro plan values:', err)
      setError(err instanceof Error ? err.message : 'Erro ao calcular valores')
    }
  }, [activeMicroPlan, plan, birthDate, financialRecords])

  // Fetch financial records when dependencies change
  useEffect(() => {
    if (userId) {
      fetchFinancialRecords()
    }
  }, [userId, activeMicroPlan?.id, fetchFinancialRecords])

  // Calculate micro plan values when dependencies change
  const activeMicroPlanId = activeMicroPlan?.id
  const planIdFromPlan = plan?.id
  const birthDateTime = birthDate?.getTime()
  
  useEffect(() => {
    if (activeMicroPlan && plan && birthDate) {
      calculateMicroPlanValues()
    }
  }, [activeMicroPlan, activeMicroPlanId, plan, planIdFromPlan, birthDate, birthDateTime, financialRecords.length, calculateMicroPlanValues])

  return {
    financialRecords,
    calculations,
    isLoading,
    error,
    refetch: fetchFinancialRecords
  }
}
