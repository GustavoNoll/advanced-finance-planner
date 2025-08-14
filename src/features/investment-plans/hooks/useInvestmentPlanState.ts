import { useState, useMemo } from 'react'
import { calculateFutureValues, isCalculationReady } from '@/utils/investmentPlanCalculations'
import { RISK_PROFILES } from '@/constants/riskProfiles'
import type { InvestmentPlanFormData } from '@/features/investment-plans/types/investment-plan'

export function useInvestmentPlanState() {
  const [loading, setLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [formData, setFormData] = useState<InvestmentPlanFormData>({
    initialAmount: "",
    plan_initial_date: new Date().toISOString().split('T')[0],
    finalAge: "",
    planEndAccumulationDate: "",
    monthlyDeposit: "",
    desiredIncome: "",
    expectedReturn: RISK_PROFILES.BRL[1].return,
    inflation: "6.0",
    planType: "3",
    adjustContributionForInflation: false,
    adjustIncomeForInflation: false,
    limitAge: "100",
    legacyAmount: "1000000",
    currency: "BRL",
    oldPortfolioProfitability: null,
    hasOldPortfolio: false,
  })

  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [updateSource, setUpdateSource] = useState<'age' | 'date' | null>(null)

  // Memoize calculations to prevent unnecessary recalculations
  const calculations = useMemo(() => {
    if (isCalculationReady(formData) && birthDate) {
      return calculateFutureValues(formData, birthDate)
    }
    return null
  }, [formData, birthDate])

  const isCalculationReadyState = useMemo(() => {
    return isCalculationReady(formData)
  }, [formData])

  return {
    // State
    loading,
    isLoadingData,
    birthDate,
    formData,
    expandedRow,
    isSyncing,
    updateSource,
    calculations,
    isCalculationReady: isCalculationReadyState,
    
    // Setters
    setLoading,
    setIsLoadingData,
    setBirthDate,
    setFormData,
    setExpandedRow,
    setIsSyncing,
    setUpdateSource,
  }
}
