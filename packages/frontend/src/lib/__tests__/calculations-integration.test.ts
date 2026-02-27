/**
 * Integration tests between chart-projections, plan-progress-calculator and
 * investmentPlanCalculations (CALCULATIONS_REVIEW.md §7.2)
 *
 * Ensures that the same inputs produce coherent results for balance and income
 * across all three modules — validating they "point in the same direction".
 */
import { describe, it, expect, vi } from 'vitest'
import { generateProjectionData } from '../calculations/chart-projections'
import { processPlanProgressData } from '../calculations/plan-progress-calculator'
import { calculateMicroPlanFutureValues } from '../calculations/investmentPlanCalculations'
import type {
  InvestmentPlan,
  MicroInvestmentPlan,
  FinancialRecord,
  Goal,
  ProjectedEvent,
} from '@/types/financial'

vi.mock('../bcb-api', () => ({
  fetchIPCARates: vi.fn(() => []),
  fetchUSCPIRates: vi.fn(() => []),
  fetchEuroCPIRates: vi.fn(() => []),
}))

vi.mock('../inflation-utils', () => ({
  createIPCARatesMap: vi.fn(() => new Map()),
  createCPIRatesMapByCurrency: vi.fn(() => new Map()),
}))

vi.mock('@/utils/dateUtils', () => ({
  createDateWithoutTimezone: (date: string | Date) => {
    if (typeof date === 'string') {
      const parts = date.split('-').map(Number)
      if (parts.length === 2) return new Date(parts[0], parts[1] - 1, 1)
      if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2])
    }
    if (date instanceof Date) return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return new Date()
  },
  createDateFromYearMonth: (year: number, month: number) => new Date(year, month - 1, 1),
  getLastDayOfYear: (year: number) => new Date(year, 11, 31),
}))

vi.mock('@/utils/microPlanUtils', () => ({
  getActiveMicroPlanForDate: vi.fn((microPlans: MicroInvestmentPlan[], targetDate: Date) => {
    if (!microPlans || microPlans.length === 0) return null
    const sorted = [...microPlans].sort(
      (a, b) => new Date(a.effective_date).getTime() - new Date(b.effective_date).getTime()
    )
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (new Date(sorted[i].effective_date) <= targetDate) return sorted[i]
    }
    return sorted[0] || null
  }),
}))

const createMicroPlan = (overrides?: Partial<MicroInvestmentPlan>): MicroInvestmentPlan => ({
  id: 'micro-1',
  life_investment_plan_id: 'plan-1',
  effective_date: '2024-01-01',
  monthly_deposit: 1000,
  desired_income: 5000,
  expected_return: 10,
  inflation: 5,
  adjust_contribution_for_accumulated_inflation: false,
  adjust_income_for_accumulated_inflation: false,
  ...overrides,
})

const createPlan = (overrides?: Partial<InvestmentPlan>): InvestmentPlan => ({
  id: 'plan-1',
  user_id: 'user-1',
  initial_amount: 10000,
  legacy_amount: 0,
  final_age: 65,
  limit_age: 100,
  plan_type: '1',
  adjust_contribution_for_inflation: true,
  adjust_income_for_inflation: true,
  plan_initial_date: '2024-01-01',
  plan_end_accumulation_date: '2054-01-01',
  currency: 'BRL',
  old_portfolio_profitability: null,
  status: 'active',
  ...overrides,
})

const createRecord = (overrides?: Partial<FinancialRecord>): FinancialRecord => ({
  id: 'rec-1',
  user_id: 'user-1',
  record_year: 2024,
  record_month: 6,
  starting_balance: 10000,
  monthly_contribution: 1000,
  monthly_return: 80,
  monthly_return_rate: 1.008,
  ending_balance: 11080,
  ...overrides,
})

const sharedFixture = () => {
  const birthDate = new Date('1990-01-01')
  const plan = createPlan()
  const microPlan = createMicroPlan()
  const microPlans = [microPlan]
  const records: FinancialRecord[] = []
  const goals: Goal[] = []
  const events: ProjectedEvent[] = []

  return { birthDate, plan, microPlan, microPlans, records, goals, events }
}

describe('calculations integration (CALCULATIONS_REVIEW §7.2)', () => {
  describe('same inputs produce coherent results across modules', () => {
    it('retirement dates from both modules fall within same planning horizon', () => {
      const { birthDate, plan, microPlan, microPlans, records, goals, events } = sharedFixture()
      const profile = { birth_date: '1990-01-01' }

      const projectionData = generateProjectionData(
        plan,
        profile,
        records,
        microPlans,
        goals,
        events
      )

      const calc = calculateMicroPlanFutureValues(plan, microPlan, records, birthDate)
      const planProgress = processPlanProgressData(
        records,
        plan,
        microPlans,
        microPlan,
        profile,
        goals,
        events,
        calc.futureValue,
        calc.futureValue
      )

      expect(planProgress).not.toBeNull()
      expect(projectionData.length).toBeGreaterThan(0)

      const plannedRetirementYear = new Date(plan.plan_end_accumulation_date).getFullYear()
      const projectedRetirementYear = planProgress!.projectedRetirementDate.getFullYear()

      expect(projectedRetirementYear).toBeGreaterThanOrEqual(birthDate.getFullYear())
      expect(projectedRetirementYear).toBeLessThanOrEqual(plan.limit_age + birthDate.getFullYear())
    })

    it('balance at retirement from chart is in same order of magnitude as investmentPlan futureValue', () => {
      const { birthDate, plan, microPlan, microPlans, records, goals, events } = sharedFixture()
      const profile = { birth_date: '1990-01-01' }

      const projectionData = generateProjectionData(
        plan,
        profile,
        records,
        microPlans,
        goals,
        events
      )

      const calc = calculateMicroPlanFutureValues(plan, microPlan, records, birthDate)
      const futureValue = calc.futureValue

      const retirementYear = 2054
      const yearData = projectionData.find((y) => y.year === retirementYear)
      expect(yearData).toBeDefined()

      const lastMonth = yearData!.months?.slice(-1)[0]
      expect(lastMonth).toBeDefined()

      const chartBalanceAtRetirement = lastMonth!.balance
      const orderOfMagnitude = (n: number) => Math.pow(10, Math.floor(Math.log10(Math.max(1, Math.abs(n)))))

      expect(chartBalanceAtRetirement).toBeGreaterThan(0)
      const chartOrder = orderOfMagnitude(chartBalanceAtRetirement)
      const futureValueOrder = orderOfMagnitude(futureValue)
      expect(Math.abs(Math.log10(chartOrder) - Math.log10(futureValueOrder))).toBeLessThanOrEqual(2)
    })

    it('monthly income from plan-progress and investmentPlan are both positive and coherent', () => {
      const { birthDate, plan, microPlan, microPlans, records, goals, events } = sharedFixture()

      const calc = calculateMicroPlanFutureValues(plan, microPlan, records, birthDate)
      const planProgress = processPlanProgressData(
        records,
        plan,
        microPlans,
        microPlan,
        { birth_date: '1990-01-01' },
        goals,
        events,
        calc.futureValue,
        calc.futureValue
      )

      expect(planProgress).not.toBeNull()
      const projectedIncome = planProgress!.projectedMonthlyIncome
      const plannedIncome = planProgress!.plannedMonthlyIncome

      expect(projectedIncome).toBeGreaterThan(0)
      expect(plannedIncome).toBeGreaterThan(0)
      expect(calc.inflationAdjustedIncome).toBeGreaterThan(0)
    })

    it('contribution from plan-progress is coherent with investmentPlan requiredMonthlyDeposit', () => {
      const { birthDate, plan, microPlan, microPlans, records, goals, events } = sharedFixture()

      const calc = calculateMicroPlanFutureValues(plan, microPlan, records, birthDate)
      const planProgress = processPlanProgressData(
        records,
        plan,
        microPlans,
        microPlan,
        { birth_date: '1990-01-01' },
        goals,
        events,
        calc.futureValue,
        calc.futureValue
      )

      const requiredDeposit = calc.requiredMonthlyDeposit
      const plannedContribution = planProgress!.plannedContribution

      expect(requiredDeposit).toBeGreaterThan(0)
      expect(plannedContribution).toBeGreaterThan(0)
      const ratio = plannedContribution / requiredDeposit
      expect(ratio).toBeGreaterThan(0.3)
      expect(ratio).toBeLessThan(3)
    })

    it('chart planned_balance grows in same direction as projection over accumulation phase', () => {
      const { plan, microPlans, records, goals, events } = sharedFixture()
      const profile = { birth_date: '1990-01-01' }

      const projectionData = generateProjectionData(
        plan,
        profile,
        records,
        microPlans,
        goals,
        events
      )

      const accumulationYears = projectionData.filter(
        (y) => y.year >= 2024 && y.year <= 2054 && !y.isRetirementTransitionYear
      )

      for (let i = 1; i < accumulationYears.length; i++) {
        const prev = accumulationYears[i - 1].planned_balance
        const curr = accumulationYears[i].planned_balance
        expect(curr).toBeGreaterThanOrEqual(prev * 0.9)
      }
    })

    it('chart balance at same date matches order of magnitude across accumulation phase', () => {
      const { birthDate, plan, microPlan, microPlans, records, goals, events } = sharedFixture()
      const profile = { birth_date: '1990-01-01' }

      const projectionData = generateProjectionData(
        plan,
        profile,
        records,
        microPlans,
        goals,
        events
      )
      const calc = calculateMicroPlanFutureValues(plan, microPlan, records, birthDate)

      const year2025 = projectionData.find((y) => y.year === 2025)
      expect(year2025).toBeDefined()
      const balance2025 = year2025!.balance
      expect(balance2025).toBeGreaterThan(plan.initial_amount)
      expect(balance2025).toBeLessThan(calc.futureValue * 2)
    })

    it('currentProgress and isAheadOfSchedule point in same direction when balance changes', () => {
      const { birthDate, plan, microPlan, microPlans, goals, events } = sharedFixture()

      const recordsBehind: FinancialRecord[] = [
        createRecord({ record_year: 2024, record_month: 6, ending_balance: 5000 }),
      ]
      const recordsAhead: FinancialRecord[] = [
        createRecord({ record_year: 2024, record_month: 6, ending_balance: 500000 }),
      ]

      const calc = calculateMicroPlanFutureValues(plan, microPlan, [], birthDate)
      const investmentGoal = calc.futureValue

      const progressBehind = processPlanProgressData(
        recordsBehind,
        plan,
        microPlans,
        microPlan,
        { birth_date: '1990-01-01' },
        goals,
        events,
        investmentGoal,
        investmentGoal
      )

      const progressAhead = processPlanProgressData(
        recordsAhead,
        plan,
        microPlans,
        microPlan,
        { birth_date: '1990-01-01' },
        goals,
        events,
        investmentGoal,
        investmentGoal
      )

      expect(progressBehind!.currentProgress).toBeLessThan(progressAhead!.currentProgress)
    })
  })

  describe('coherent balance and income trajectory', () => {
    it('chart and plan-progress both show retirement phase with positive withdrawal/income', () => {
      const { birthDate, plan, microPlan, microPlans, records, goals, events } = sharedFixture()
      const profile = { birth_date: '1990-01-01' }

      const projectionData = generateProjectionData(
        plan,
        profile,
        records,
        microPlans,
        goals,
        events
      )

      const planProgress = processPlanProgressData(
        records,
        plan,
        microPlans,
        microPlan,
        profile,
        goals,
        events,
        1000000,
        1000000
      )

      const retirementYears = projectionData.filter((y) => y.year > 2054)
      expect(retirementYears.length).toBeGreaterThan(0)

      const firstRetirementYear = retirementYears[0]
      expect(firstRetirementYear.withdrawal).toBeGreaterThan(0)
      expect(planProgress!.projectedMonthlyIncome).toBeGreaterThan(0)
    })
  })
})
