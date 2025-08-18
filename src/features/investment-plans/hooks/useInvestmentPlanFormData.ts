import { useCallback } from 'react'
import { RISK_PROFILES } from '@/constants/riskProfiles'
import type { FormData } from '@/utils/investmentPlanCalculations'
import { createDateWithoutTimezone } from '@/utils/dateUtils'

interface UseInvestmentPlanFormDataProps {
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  setBirthDate: (date: Date | null) => void
}

export function useInvestmentPlanFormData({
  setFormData,
  setBirthDate
}: UseInvestmentPlanFormDataProps) {

  // Process fetched plan data
  const processPlanData = useCallback((planData: any, profileData: any) => {
    setBirthDate(profileData.birth_date ? createDateWithoutTimezone(profileData.birth_date) : null)

    // Adjust the date to show the correct date when editing
    const planDate = createDateWithoutTimezone(planData.plan_initial_date)
    planDate.setDate(planDate.getDate() - 1)

    // Find the matching risk profile for the plan's currency
    const profiles = RISK_PROFILES[planData.currency || "BRL"]
    const matchingProfile = profiles.find(p => parseFloat(p.return) === parseFloat(planData.expected_return))
    const defaultProfile = profiles[1] // Use moderate as default

    setFormData({
      initialAmount: planData.initial_amount.toString(),
      plan_initial_date: planDate.toISOString().split('T')[0],
      finalAge: planData.final_age.toString(),
      planEndAccumulationDate: planData.plan_end_accumulation_date,
      monthlyDeposit: planData.monthly_deposit.toString(),
      desiredIncome: planData.desired_income.toString(),
      expectedReturn: matchingProfile?.return || defaultProfile.return,
      inflation: planData.inflation.toString(),
      planType: planData.plan_type,
      adjustContributionForInflation: planData.adjust_contribution_for_inflation,
      adjustIncomeForInflation: planData.adjust_income_for_inflation,
      limitAge: planData.limit_age?.toString() || "",
      legacyAmount: planData.legacy_amount?.toString() || "1000000",
      currency: planData.currency || "BRL",
      oldPortfolioProfitability: planData.old_portfolio_profitability?.toString() || null,
      hasOldPortfolio: planData.old_portfolio_profitability !== null,
    })
  }, [setFormData, setBirthDate])

  // Process client profile data
  const processClientProfileData = useCallback((profileData: any) => {
    setBirthDate(profileData.birth_date ? createDateWithoutTimezone(profileData.birth_date) : null)
  }, [setBirthDate])

  // Validate form data
  const validateFormData = useCallback((formData: FormData, birthDate: Date | null) => {
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

    if (!formData.monthlyDeposit || parseFloat(formData.monthlyDeposit.replace(',', '.')) < 0) {
      errors.push("Monthly deposit cannot be negative")
    }

    if (!formData.desiredIncome || parseFloat(formData.desiredIncome.replace(',', '.')) <= 0) {
      errors.push("Desired income must be greater than 0")
    }

    if (!formData.expectedReturn || parseFloat(formData.expectedReturn.replace(',', '.')) <= 0) {
      errors.push("Expected return must be greater than 0")
    }

    if (!formData.inflation || parseFloat(formData.inflation.replace(',', '.')) < 0) {
      errors.push("Inflation rate cannot be negative")
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
