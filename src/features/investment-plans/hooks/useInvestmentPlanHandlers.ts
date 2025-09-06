import { useCallback } from 'react'
import { handleAgeDateSync, handleFormChange } from '@/utils/formUtils'
import { RISK_PROFILES } from '@/constants/riskProfiles'
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

interface UseInvestmentPlanHandlersProps {
  formData: SimplifiedFormData
  birthDate: Date | null
  isSyncing: boolean
  updateSource: 'age' | 'date' | null
  setFormData: React.Dispatch<React.SetStateAction<SimplifiedFormData>>
  setIsSyncing: (syncing: boolean) => void
  setUpdateSource: (source: 'age' | 'date' | null) => void
}

export function useInvestmentPlanHandlers({
  formData,
  birthDate,
  isSyncing,
  updateSource,
  setFormData,
  setIsSyncing,
  setUpdateSource
}: UseInvestmentPlanHandlersProps) {
  
  // Handle age and date synchronization
  const handleAgeDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (!birthDate || isSyncing) return

    const result = handleAgeDateSync(name, value, birthDate, isSyncing, updateSource)
    if (result) {
      setIsSyncing(true)
      setUpdateSource(name === 'finalAge' ? 'age' : 'date')
      
      setFormData(prev => ({
        ...prev,
        ...result
      }))

      setTimeout(() => {
        setIsSyncing(false)
        setUpdateSource(null)
      }, 100)
    }
  }, [birthDate, isSyncing, updateSource, setIsSyncing, setUpdateSource, setFormData])

  // Handle form changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    const newFormData = handleFormChange(name, value, checked, formData.currency, RISK_PROFILES)
    setFormData(prev => ({
      ...prev,
      ...newFormData
    }))
  }, [formData.currency, setFormData])

  // Handle form data changes (for currency inputs)
  const handleFormDataChange = useCallback((data: Partial<SimplifiedFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [setFormData])

  return {
    handleAgeDateChange,
    handleChange,
    handleFormDataChange,
  }
}
