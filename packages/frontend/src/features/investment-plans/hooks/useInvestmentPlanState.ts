import { useState } from 'react'
import { createDateWithoutTimezone } from '@/utils/dateUtils'

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

export function useInvestmentPlanState() {
  const [loading, setLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [hasFinancialRecords, setHasFinancialRecords] = useState(false)
  const [formData, setFormData] = useState<SimplifiedFormData>({
    initialAmount: "",
    plan_initial_date: createDateWithoutTimezone(new Date()).toISOString().split('T')[0],
    finalAge: "",
    planEndAccumulationDate: "",
    planType: "3",
    adjustContributionForInflation: false,
    adjustIncomeForInflation: false,
    limitAge: "100",
    legacyAmount: "1000000",
    currency: "BRL",
    oldPortfolioProfitability: null,
    hasOldPortfolio: false,
  })

  const [isSyncing, setIsSyncing] = useState(false)
  const [updateSource, setUpdateSource] = useState<'age' | 'date' | null>(null)

  return {
    // State
    loading,
    isLoadingData,
    birthDate,
    formData,
    isSyncing,
    updateSource,
    hasFinancialRecords,
    
    // Setters
    setLoading,
    setIsLoadingData,
    setBirthDate,
    setFormData,
    setIsSyncing,
    setUpdateSource,
    setHasFinancialRecords,
  }
}
