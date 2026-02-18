import type { LifeMicroPlan } from '../domain/life-types'

/**
 * Returns the active micro plan for a given month: the latest micro plan whose
 * effectiveDate is on or before the start of the given month.
 * If none applies (all plans are in the future), returns null.
 */
export function getActiveMicroPlanForDate(
  microPlans: LifeMicroPlan[],
  targetDate: Date
): LifeMicroPlan | null {
  if (!microPlans?.length) return null

  const targetYear = targetDate.getFullYear()
  const targetMonth = targetDate.getMonth()

  const sorted = [...microPlans].sort(
    (a, b) =>
      new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
  )

  let active: LifeMicroPlan | null = null
  for (const plan of sorted) {
    const d = new Date(plan.effectiveDate)
    const planYear = d.getFullYear()
    const planMonth = d.getMonth()
    if (planYear < targetYear || (planYear === targetYear && planMonth <= targetMonth)) {
      active = plan
    }
  }
  return active
}
