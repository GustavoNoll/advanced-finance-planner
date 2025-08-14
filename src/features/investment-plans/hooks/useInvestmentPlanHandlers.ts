import { useCallback } from 'react'
import { handleAgeDateSync, handleFormChange } from '@/utils/formUtils'
import { RISK_PROFILES } from '@/constants/riskProfiles'
import type { InvestmentPlanFormData } from '@/features/investment-plans/types/investment-plan'

interface UseInvestmentPlanHandlersProps {
  formData: InvestmentPlanFormData
  birthDate: Date | null
  isSyncing: boolean
  updateSource: 'age' | 'date' | null
  setFormData: React.Dispatch<React.SetStateAction<InvestmentPlanFormData>>
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
  const handleFormDataChange = useCallback((data: Partial<InvestmentPlanFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [setFormData])

  return {
    handleAgeDateChange,
    handleChange,
    handleFormDataChange,
  }
}
