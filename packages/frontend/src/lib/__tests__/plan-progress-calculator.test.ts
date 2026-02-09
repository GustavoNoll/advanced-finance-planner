import { describe, it, expect, vi, beforeEach } from 'vitest'
import { utils, processPlanProgressData } from '../plan-progress-calculator'
import type { InvestmentPlan, MicroInvestmentPlan, FinancialRecord, Goal, ProjectedEvent } from '@/types/financial'

// Mock dependencies
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
}))

vi.mock('@/utils/microPlanUtils', () => ({
  getActiveMicroPlanForDate: vi.fn((microPlans: MicroInvestmentPlan[], targetDate: Date) => {
    if (!microPlans || microPlans.length === 0) return null
    const sorted = [...microPlans].sort(
      (a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime()
    )
    for (const mp of sorted) {
      const effectiveDate = new Date(mp.effective_date)
      if (effectiveDate <= targetDate) return mp
    }
    return sorted[sorted.length - 1] || null
  }),
}))

vi.mock('@/utils/investmentPlanCalculations', () => ({
  calculateMicroPlanFutureValues: vi.fn(() => ({
    futureValue: 1000000,
    presentFutureValue: 500000,
    inflationAdjustedIncome: 10000,
    realReturn: 5000,
    inflationReturn: 2000,
    totalMonthlyReturn: 7000,
    requiredMonthlyDeposit: 2000,
    necessaryFutureValue: null,
    necessaryDepositToNecessaryFutureValue: null,
  })),
}))

describe('plan-progress-calculator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================================
  // HELPERS
  // ============================================================================

  const createMockMicroPlan = (overrides?: Partial<MicroInvestmentPlan>): MicroInvestmentPlan => ({
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

  const createMockInvestmentPlan = (overrides?: Partial<InvestmentPlan>): InvestmentPlan => ({
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

  // ============================================================================
  // utils.calculateMonthsBetweenDates
  // ============================================================================

  describe('utils.calculateMonthsBetweenDates', () => {
    it('should calculate months between same dates', () => {
      const date = new Date(2024, 0, 1)
      const result = utils.calculateMonthsBetweenDates(date, date)

      expect(result).toBe(0)
    })

    it('should calculate months between dates in the same year', () => {
      const start = new Date(2024, 0, 1) // January 2024
      const end = new Date(2024, 5, 1) // June 2024
      const result = utils.calculateMonthsBetweenDates(start, end)

      expect(result).toBe(5) // month index 5 - month index 0 = 5
    })

    it('should calculate months between dates across years', () => {
      const start = new Date(2024, 0, 1) // January 2024
      const end = new Date(2025, 0, 1) // January 2025
      const result = utils.calculateMonthsBetweenDates(start, end)

      expect(result).toBe(12)
    })

    it('should calculate months between dates across multiple years', () => {
      const start = new Date(2024, 0, 1) // January 2024
      const end = new Date(2026, 5, 1) // June 2026
      const result = utils.calculateMonthsBetweenDates(start, end)

      expect(result).toBe(29) // (2026-2024)*12 + (5-0) = 29
    })

    it('should return null when start date is undefined', () => {
      const result = utils.calculateMonthsBetweenDates(undefined as unknown as Date, new Date())
      expect(result).toBeNull()
    })

    it('should return null when end date is undefined', () => {
      const result = utils.calculateMonthsBetweenDates(new Date(), undefined as unknown as Date)
      expect(result).toBeNull()
    })

    it('should handle negative results when end is before start', () => {
      const start = new Date(2025, 5, 1) // June 2025
      const end = new Date(2024, 0, 1) // January 2024
      const result = utils.calculateMonthsBetweenDates(start, end)

      expect(result).toBeLessThan(0)
    })
  })

  // ============================================================================
  // utils.createDateAtAge
  // ============================================================================

  describe('utils.createDateAtAge', () => {
    it('should create date at specified age', () => {
      const birthDate = new Date(1990, 0, 15) // January 15, 1990
      const result = utils.createDateAtAge(birthDate, 65)

      expect(result.getFullYear()).toBe(2055)
      expect(result.getMonth()).toBe(0) // January
    })

    it('should handle age of 0', () => {
      const birthDate = new Date(1990, 5, 1)
      const result = utils.createDateAtAge(birthDate, 0)

      expect(result.getFullYear()).toBe(1990)
    })

    it('should preserve month from birth date', () => {
      const birthDate = new Date(1990, 6, 20) // July 20, 1990
      const result = utils.createDateAtAge(birthDate, 30)

      expect(result.getFullYear()).toBe(2020)
      expect(result.getMonth()).toBe(6) // July
    })
  })

  // ============================================================================
  // utils.addMonthsToDate
  // ============================================================================

  describe('utils.addMonthsToDate', () => {
    it('should add months to a date', () => {
      const baseDate = new Date(2024, 0, 1) // January 2024
      const result = utils.addMonthsToDate(baseDate, 3)

      // The function adds monthsToAdd + 1 months
      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(4) // May (0 + 3 + 1 = 4)
    })

    it('should handle year transitions', () => {
      const baseDate = new Date(2024, 10, 1) // November 2024
      const result = utils.addMonthsToDate(baseDate, 3)

      // November + 3 + 1 = March 2025
      expect(result.getFullYear()).toBe(2025)
    })

    it('should handle adding zero months', () => {
      const baseDate = new Date(2024, 5, 1) // June 2024
      const result = utils.addMonthsToDate(baseDate, 0)

      // 5 + 0 + 1 = 6 -> July
      expect(result.getMonth()).toBe(6) // July
    })

    it('should handle adding large number of months', () => {
      const baseDate = new Date(2024, 0, 1)
      const result = utils.addMonthsToDate(baseDate, 24) // 2 years

      // 0 + 24 + 1 = 25 months from January = February 2026
      expect(result.getFullYear()).toBe(2026)
    })
  })

  // ============================================================================
  // utils.iterateMonthlyValues
  // ============================================================================

  describe('utils.iterateMonthlyValues', () => {
    it('should iterate over each month in the range', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 2, 1)

      const result = utils.iterateMonthlyValues({
        startDate: start,
        endDate: end,
        collector: (_date, index) => index,
      })

      expect(result).toEqual([0, 1, 2])
    })

    it('should return empty array for invalid range', () => {
      const start = new Date(2025, 0, 1)
      const end = new Date(2024, 0, 1)

      const result = utils.iterateMonthlyValues({
        startDate: start,
        endDate: end,
        collector: (_date, index) => index,
      })

      expect(result).toEqual([])
    })

    it('should pass correct dates to collector', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 2, 1)

      const dates: Date[] = []
      utils.iterateMonthlyValues({
        startDate: start,
        endDate: end,
        collector: (date) => {
          dates.push(new Date(date))
          return date.getMonth()
        },
      })

      expect(dates).toHaveLength(3)
      expect(dates[0].getMonth()).toBe(0) // January
      expect(dates[1].getMonth()).toBe(1) // February
      expect(dates[2].getMonth()).toBe(2) // March
    })

    it('should handle single month range', () => {
      const start = new Date(2024, 5, 1)
      const end = new Date(2024, 5, 1)

      const result = utils.iterateMonthlyValues({
        startDate: start,
        endDate: end,
        collector: (date) => date.getMonth(),
      })

      // calculateMonthsBetweenDates returns 0, + 1 = 1 month
      expect(result).toHaveLength(1)
      expect(result[0]).toBe(5)
    })

    it('should collect typed values correctly', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 2, 1)

      const result = utils.iterateMonthlyValues<string>({
        startDate: start,
        endDate: end,
        collector: (date) => `${date.getFullYear()}-${date.getMonth() + 1}`,
      })

      expect(result).toEqual(['2024-1', '2024-2', '2024-3'])
    })
  })

  // ============================================================================
  // utils.computeInflationFactor
  // ============================================================================

  describe('utils.computeInflationFactor', () => {
    it('should return 1 for invalid range', () => {
      const result = utils.computeInflationFactor({
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2024, 0, 1),
        currency: 'BRL',
        microPlans: [],
      })

      expect(result).toBe(1)
    })

    it('should compute inflation factor using micro plan rates', () => {
      const microPlan = createMockMicroPlan({ inflation: 6 }) // 6% annual
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 11, 1) // 12 months

      const result = utils.computeInflationFactor({
        startDate: start,
        endDate: end,
        currency: 'BRL',
        microPlans: [microPlan],
      })

      // Should be close to 1 + 6% for a full year
      expect(result).toBeGreaterThan(1)
      expect(result).toBeLessThan(1.1)
    })
  })

  // ============================================================================
  // utils.computeEffectiveMonthlyReturnRate
  // ============================================================================

  describe('utils.computeEffectiveMonthlyReturnRate', () => {
    it('should return 0 for invalid range', () => {
      const result = utils.computeEffectiveMonthlyReturnRate({
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2024, 0, 1),
        microPlans: [],
      })

      expect(result).toBe(0)
    })

    it('should compute effective monthly return rate', () => {
      const microPlan = createMockMicroPlan({ expected_return: 10 }) // 10% annual
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 11, 1)

      const result = utils.computeEffectiveMonthlyReturnRate({
        startDate: start,
        endDate: end,
        microPlans: [microPlan],
      })

      // Monthly rate for ~10% annual should be around 0.008
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThan(0.02)
    })
  })

  // ============================================================================
  // utils.computeAverageMonthlyContribution
  // ============================================================================

  describe('utils.computeAverageMonthlyContribution', () => {
    it('should return 0 for invalid period', () => {
      const result = utils.computeAverageMonthlyContribution({
        referenceDate: new Date(2025, 0, 1),
        planEndDate: new Date(2024, 0, 1),
        microPlans: [],
        activeMicroPlan: null,
        adjustForInflation: false,
        planCurrency: 'BRL',
      })

      expect(result).toBe(0)
    })

    it('should compute average contribution for single micro plan', () => {
      const microPlan = createMockMicroPlan({ monthly_deposit: 2000 })
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 11, 1)

      const result = utils.computeAverageMonthlyContribution({
        referenceDate: start,
        planEndDate: end,
        microPlans: [microPlan],
        activeMicroPlan: microPlan,
        adjustForInflation: false,
        planCurrency: 'BRL',
      })

      expect(result).toBeCloseTo(2000, 0)
    })

    it('should handle multiple micro plans with different deposits', () => {
      const microPlan1 = createMockMicroPlan({
        id: 'mp-1',
        effective_date: '2024-01-01',
        monthly_deposit: 1000,
      })
      const microPlan2 = createMockMicroPlan({
        id: 'mp-2',
        effective_date: '2024-07-01',
        monthly_deposit: 2000,
      })
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 11, 1)

      const result = utils.computeAverageMonthlyContribution({
        referenceDate: start,
        planEndDate: end,
        microPlans: [microPlan1, microPlan2],
        activeMicroPlan: microPlan1,
        adjustForInflation: false,
        planCurrency: 'BRL',
      })

      // Should be weighted average of 1000 (6 months) and 2000 (6 months)
      // (1000 * 7 + 2000 * 6) / 12 ≈ ~1500 (exact depends on month counting)
      expect(result).toBeGreaterThan(1000)
      expect(result).toBeLessThan(2000)
    })
  })

  // ============================================================================
  // processPlanProgressData
  // ============================================================================

  describe('processPlanProgressData', () => {
    it('should return null when investmentPlan is missing', () => {
      const result = processPlanProgressData(
        [],
        null as unknown as InvestmentPlan,
        [],
        null,
        { birth_date: '1990-01-01' },
        [],
        [],
        1000000,
        1000000
      )

      expect(result).toBeNull()
    })

    it('should return null when birth_date is missing', () => {
      const plan = createMockInvestmentPlan()
      const result = processPlanProgressData(
        [],
        plan,
        [],
        null,
        { birth_date: undefined },
        [],
        [],
        1000000,
        1000000
      )

      expect(result).toBeNull()
    })

    it('should return valid data for complete inputs', () => {
      const plan = createMockInvestmentPlan()
      const microPlan = createMockMicroPlan()

      const result = processPlanProgressData(
        [],
        plan,
        [microPlan],
        microPlan,
        { birth_date: '1990-01-01' },
        [],
        [],
        1000000,
        1000000
      )

      expect(result).not.toBeNull()
      if (result) {
        expect(result).toHaveProperty('projectedPresentValue')
        expect(result).toHaveProperty('plannedPresentValue')
        expect(result).toHaveProperty('currentProgress')
        expect(result).toHaveProperty('projectedAgeYears')
        expect(result).toHaveProperty('projectedAgeMonths')
        expect(result).toHaveProperty('plannedAgeYears')
        expect(result).toHaveProperty('plannedAgeMonths')
        expect(result).toHaveProperty('isAheadOfSchedule')
        expect(result).toHaveProperty('projectedRetirementDate')
        expect(result).toHaveProperty('finalAgeDate')
        expect(result).toHaveProperty('investmentPlanMonthsToRetirement')
      }
    })

    it('should calculate current progress percentage', () => {
      const plan = createMockInvestmentPlan({ initial_amount: 100000 })
      const microPlan = createMockMicroPlan()
      const financialRecords: FinancialRecord[] = [{
        id: 'record-1',
        user_id: 'user-1',
        record_year: 2024,
        record_month: 6,
        starting_balance: 95000,
        monthly_contribution: 5000,
        monthly_return: 1000,
        monthly_return_rate: 1.05,
        ending_balance: 200000,
      }]

      const result = processPlanProgressData(
        financialRecords,
        plan,
        [microPlan],
        microPlan,
        { birth_date: '1990-01-01' },
        [],
        [],
        1000000,
        1000000
      )

      expect(result).not.toBeNull()
      if (result) {
        // 200000 / futureValue(1000000) * 100 = 20%
        expect(result.currentProgress).toBeCloseTo(20, 0)
      }
    })

    it('should determine isAheadOfSchedule correctly', () => {
      const plan = createMockInvestmentPlan()
      const microPlan = createMockMicroPlan()

      const result = processPlanProgressData(
        [],
        plan,
        [microPlan],
        microPlan,
        { birth_date: '1990-01-01' },
        [],
        [],
        1000000,
        1000000
      )

      expect(result).not.toBeNull()
      if (result) {
        expect(typeof result.isAheadOfSchedule).toBe('boolean')
      }
    })
  })
})
