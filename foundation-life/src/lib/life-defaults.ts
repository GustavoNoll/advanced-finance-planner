/**
 * Default values for the life plan (setup inicial).
 * Retorno anual 6%; inflação IPCA+5%.
 */
function getDefaultBirthDate(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 30)
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

export const LIFE_PLAN_DEFAULTS = {
  getDefaultBirthDate,
  lifeExpectancyYears: 90,
  baseNetWorth: 0,
  baseMonthlyIncome: 8000,
  baseMonthlyExpenses: 5000,
  monthlyContribution: 1500,
  expectedReturnYearly: 6,
  inflationYearly: 5,
  inflationLabel: 'IPCA+5',
  inflateIncome: true,
  inflateExpenses: true,
  retirementAge: 65,
  retirementMonthlyIncome: 0,
  inflateRetirementIncome: true,
} as const

export type LifePlanDefaults = typeof LIFE_PLAN_DEFAULTS
