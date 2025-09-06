import { useCallback } from 'react'
import { createDateWithoutTimezone } from '@/utils/dateUtils'
import { InvestmentPlan, Profile } from '@/types/financial'

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

interface UseInvestmentPlanFormDataProps {
  setFormData: React.Dispatch<React.SetStateAction<SimplifiedFormData>>
  setBirthDate: (date: Date | null) => void
  setHasFinancialRecords: (hasRecords: boolean) => void
}

export function useInvestmentPlanFormData({
  setFormData,
  setBirthDate,
  setHasFinancialRecords
}: UseInvestmentPlanFormDataProps) {

  // Process fetched plan data
  const processPlanData = useCallback((planData: InvestmentPlan, profileData: Profile, hasFinancialRecords: boolean = false) => {
    setBirthDate(profileData.birth_date ? createDateWithoutTimezone(profileData.birth_date) : null)
    setHasFinancialRecords(hasFinancialRecords)

    // Adjust the date to show the correct date when editing
    const planDate = createDateWithoutTimezone(planData.plan_initial_date)
    planDate.setDate(planDate.getDate() - 1)


    setFormData({
      initialAmount: planData.initial_amount.toString(),
      plan_initial_date: planDate.toISOString().split('T')[0],
      finalAge: planData.final_age.toString(),
      planEndAccumulationDate: planData.plan_end_accumulation_date,
      planType: planData.plan_type,
      adjustContributionForInflation: planData.adjust_contribution_for_inflation,
      adjustIncomeForInflation: planData.adjust_income_for_inflation,
      limitAge: planData.limit_age?.toString() || "",
      legacyAmount: planData.legacy_amount?.toString() || "1000000",
      currency: planData.currency || "BRL",
      oldPortfolioProfitability: planData.old_portfolio_profitability?.toString() || null,
      hasOldPortfolio: planData.old_portfolio_profitability !== null,
    })
  }, [setFormData, setBirthDate, setHasFinancialRecords])

  // Process client profile data
  const processClientProfileData = useCallback((profileData: Profile) => {
    setBirthDate(profileData.birth_date ? createDateWithoutTimezone(profileData.birth_date) : null)
  }, [setBirthDate])

  // Validate form data
  const validateFormData = useCallback((formData: SimplifiedFormData, birthDate: Date | null) => {
    const errors: string[] = []

    if (!birthDate) {
      errors.push("Birth date is required")
    }

    if (!formData.initialAmount || parseFloat(formData.initialAmount.replace(',', '.')) <= 0) {
      errors.push("Initial amount must be greater than 0")
    }

    if (!formData.finalAge || parseInt(formData.finalAge) <= 0) {
      errors.push("Final age must be greater than 0")
    }

    if (!formData.planEndAccumulationDate) {
      errors.push("Plan end accumulation date is required")
    }


    if (formData.planType === "2" && (!formData.legacyAmount || parseFloat(formData.legacyAmount.replace(',', '.')) <= 0)) {
      errors.push("Legacy amount must be greater than 0 for this plan type")
    }

    if (formData.hasOldPortfolio && !formData.oldPortfolioProfitability) {
      errors.push("Old portfolio profitability is required when has old portfolio is checked")
    }

    return errors
  }, [])

  return {
    processPlanData,
    processClientProfileData,
    validateFormData,
  }
}
