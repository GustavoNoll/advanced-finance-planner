import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getCurrencySymbol } from '@/utils/currency'
import type { CurrencyCode } from '@/utils/currency'

interface UseInvestmentPlanUIProps {
  birthDate: Date | null
  formData: {
    currency: string
    planEndAccumulationDate: string
  }
}

export function useInvestmentPlanUI({ birthDate, formData }: UseInvestmentPlanUIProps) {
  const { t } = useTranslation()

  // Generate age options data
  const ageOptions = useMemo(() => {
    if (!birthDate) return []

    return Array.from({ length: 121 - (new Date().getFullYear() - new Date(birthDate).getFullYear()) }, (_, i) => {
      const currentAge = new Date().getFullYear() - new Date(birthDate).getFullYear()
      const monthDiff = new Date().getMonth() - new Date(birthDate).getMonth()
      const adjustedCurrentAge = monthDiff < 0 ? currentAge - 1 : currentAge
      const age = adjustedCurrentAge + i
      return { age, label: `${age} ${t('investmentPlan.form.years')}` }
    })
  }, [birthDate, t])

  // Generate year options data
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i <= currentYear + 100; i++) {
      years.push({ year: i, label: i.toString() })
    }
    return years
  }, [])

  // Get currency symbol
  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(formData.currency as CurrencyCode)
  }, [formData.currency])

  // Get current month and year from plan end date
  const currentMonth = useMemo(() => {
    if (!formData.planEndAccumulationDate) return 0
    return new Date(formData.planEndAccumulationDate).getMonth()
  }, [formData.planEndAccumulationDate])

  const currentYear = useMemo(() => {
    if (!formData.planEndAccumulationDate) return new Date().getFullYear()
    return new Date(formData.planEndAccumulationDate).getFullYear()
  }, [formData.planEndAccumulationDate])

  // Month options
  const monthOptions = useMemo(() => [
    { value: 0, label: t('date.months.january') },
    { value: 1, label: t('date.months.february') },
    { value: 2, label: t('date.months.march') },
    { value: 3, label: t('date.months.april') },
    { value: 4, label: t('date.months.may') },
    { value: 5, label: t('date.months.june') },
    { value: 6, label: t('date.months.july') },
    { value: 7, label: t('date.months.august') },
    { value: 8, label: t('date.months.september') },
    { value: 9, label: t('date.months.october') },
    { value: 10, label: t('date.months.november') },
    { value: 11, label: t('date.months.december') },
  ], [t])

  return {
    ageOptions,
    yearOptions,
    monthOptions,
    currencySymbol,
    currentMonth,
    currentYear,
  }
}
