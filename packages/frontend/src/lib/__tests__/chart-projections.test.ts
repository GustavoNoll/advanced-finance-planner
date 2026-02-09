import { describe, it, expect, vi } from 'vitest'
import {
  handleMonthlyGoalsAndEvents,
  getEndAge,
  processEvents,
  processGoals,
  generateDataPoints,
} from '../chart-projections'
import type { InvestmentPlan, Goal, ProjectedEvent } from '@/types/financial'
import type { ProcessedGoalEvent } from '../financial-goals-processor'

// Mock dependencies
vi.mock('../inflation-utils', () => ({
  createIPCARatesMap: vi.fn(() => new Map()),
  createCPIRatesMapByCurrency: vi.fn(() => new Map()),
}))

vi.mock('../bcb-api', () => ({
  fetchIPCARates: vi.fn(() => []),
  fetchUSCPIRates: vi.fn(() => []),
  fetchEuroCPIRates: vi.fn(() => []),
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
  getActiveMicroPlanForDate: vi.fn(() => ({
    id: 'micro-1',
    life_investment_plan_id: 'plan-1',
    effective_date: '2024-01-01',
    monthly_deposit: 1000,
    desired_income: 5000,
    expected_return: 10,
    inflation: 5,
    adjust_contribution_for_accumulated_inflation: false,
    adjust_income_for_accumulated_inflation: false,
  })),
}))

describe('chart-projections', () => {
  // ============================================================================
  // HELPERS
  // ============================================================================

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

  const createMockGoal = (overrides?: Partial<Goal>): Goal => ({
    id: 'goal-1',
    type: 'goal',
    profile_id: 'profile-1',
    icon: '🏠' as Goal['icon'],
    asset_value: 50000,
    month: 6,
    year: 2025,
    payment_mode: 'none',
    name: 'Test Goal',
    status: 'pending',
    adjust_for_inflation: true,
    financial_links: [],
    ...overrides,
  })

  const createMockEvent = (overrides?: Partial<ProjectedEvent>): ProjectedEvent => ({
    id: 'event-1',
    type: 'event',
    profile_id: 'profile-1',
    name: 'Test Event',
    asset_value: 30000,
    payment_mode: 'none',
    icon: '💰' as ProjectedEvent['icon'],
    status: 'pending',
    month: 6,
    year: 2025,
    adjust_for_inflation: true,
    financial_links: [],
    ...overrides,
  })

  const createMockProcessedGoalEvent = (overrides?: Partial<ProcessedGoalEvent>): ProcessedGoalEvent => ({
    id: 'goal-1',
    type: 'goal',
    amount: 50000,
    month: 6,
    year: 2025,
    status: 'pending',
    adjust_for_inflation: true,
    ...overrides,
  })

  // ============================================================================
  // getEndAge
  // ============================================================================

  describe('getEndAge', () => {
    it('should return limit_age when specified', () => {
      const plan = createMockInvestmentPlan({ limit_age: 90 })
      expect(getEndAge(plan)).toBe(90)
    })

    it('should return 100 as default when limit_age is not set', () => {
      const plan = createMockInvestmentPlan({ limit_age: 0 })
      expect(getEndAge(plan)).toBe(100)
    })

    it('should return limit_age for young retirement age', () => {
      const plan = createMockInvestmentPlan({ limit_age: 50 })
      expect(getEndAge(plan)).toBe(50)
    })
  })

  // ============================================================================
  // processGoals
  // ============================================================================

  describe('processGoals', () => {
    it('should return empty array when goals is undefined', () => {
      const result = processGoals(undefined)
      expect(result).toEqual([])
    })

    it('should return empty array for empty goals array', () => {
      const result = processGoals([])
      expect(result).toEqual([])
    })

    it('should process a single goal', () => {
      const goals = [createMockGoal()]
      const result = processGoals(goals)

      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(50000)
      expect(result[0].type).toBe('goal')
    })

    it('should process multiple goals', () => {
      const goals = [
        createMockGoal({ id: 'g1', asset_value: 50000 }),
        createMockGoal({ id: 'g2', asset_value: 30000 }),
      ]
      const result = processGoals(goals)

      expect(result).toHaveLength(2)
    })

    it('should handle goals with installments', () => {
      const goals = [
        createMockGoal({
          payment_mode: 'installment',
          installment_count: 6,
          installment_interval: 1,
        }),
      ]
      const result = processGoals(goals, true)

      expect(result).toHaveLength(6)
    })
  })

  // ============================================================================
  // processEvents
  // ============================================================================

  describe('processEvents', () => {
    it('should return empty array when events is undefined', () => {
      const result = processEvents(undefined)
      expect(result).toEqual([])
    })

    it('should return empty array for empty events array', () => {
      const result = processEvents([])
      expect(result).toEqual([])
    })

    it('should process a single event', () => {
      const events = [createMockEvent()]
      const result = processEvents(events)

      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(30000)
      expect(result[0].type).toBe('event')
    })

    it('should process events with repeat mode', () => {
      const events = [
        createMockEvent({
          payment_mode: 'repeat',
          installment_count: 3,
          installment_interval: 12,
        }),
      ]
      const result = processEvents(events, true)

      expect(result).toHaveLength(3)
      result.forEach(item => {
        expect(item.amount).toBe(30000)
      })
    })
  })

  // ============================================================================
  // handleMonthlyGoalsAndEvents
  // ============================================================================

  describe('handleMonthlyGoalsAndEvents', () => {
    it('should return original balance when no goals or events', () => {
      const balance = 100000
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 6, 1.0)

      expect(result).toBe(100000)
    })

    it('should subtract goal amounts from balance', () => {
      const balance = 100000
      const goals: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({ amount: 20000, month: 6, year: 2025 }),
      ]
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 6, 1.0, goals)

      expect(result).toBe(80000) // 100000 - 20000
    })

    it('should add event amounts to balance', () => {
      const balance = 100000
      const events: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({
          type: 'event',
          amount: 15000,
          month: 6,
          year: 2025,
        }),
      ]
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 6, 1.0, undefined, events)

      expect(result).toBe(115000) // 100000 + 15000
    })

    it('should handle both goals and events in the same month', () => {
      const balance = 100000
      const goals: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({ amount: 30000, month: 6, year: 2025 }),
      ]
      const events: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({
          type: 'event',
          amount: 10000,
          month: 6,
          year: 2025,
        }),
      ]
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 6, 1.0, goals, events)

      expect(result).toBe(80000) // 100000 - 30000 + 10000
    })

    it('should not apply goals/events from different months', () => {
      const balance = 100000
      const goals: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({ amount: 30000, month: 7, year: 2025 }),
      ]
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 6, 1.0, goals)

      expect(result).toBe(100000) // No change - goal is in month 7
    })

    it('should not apply goals/events from different years', () => {
      const balance = 100000
      const goals: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({ amount: 30000, month: 6, year: 2026 }),
      ]
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 6, 1.0, goals)

      expect(result).toBe(100000) // No change - goal is in year 2026
    })

    it('should adjust goals for inflation when adjust_for_inflation is true', () => {
      const balance = 100000
      const accumulatedInflation = 1.1 // 10% inflation
      const goals: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({
          amount: 10000,
          month: 6,
          year: 2025,
          adjust_for_inflation: true,
        }),
      ]
      // nominal mode: amount * accumulatedInflation = 10000 * 1.1 = 11000
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 6, accumulatedInflation, goals)

      expect(result).toBe(89000) // 100000 - 11000
    })

    it('should not adjust goals for inflation when adjust_for_inflation is false', () => {
      const balance = 100000
      const accumulatedInflation = 1.1 // 10% inflation
      const goals: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({
          amount: 10000,
          month: 6,
          year: 2025,
          adjust_for_inflation: false,
        }),
      ]
      // nominal mode with adjust_for_inflation false: amount stays at 10000
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 6, accumulatedInflation, goals)

      expect(result).toBe(90000) // 100000 - 10000
    })

    it('should show real values when showRealValues is true and adjust_for_inflation is true', () => {
      const balance = 100000
      const accumulatedInflation = 1.1
      const goals: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({
          amount: 10000,
          month: 6,
          year: 2025,
          adjust_for_inflation: true,
        }),
      ]
      // real values mode with adjust_for_inflation true: amount stays as-is
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 6, accumulatedInflation, goals, undefined, true)

      expect(result).toBe(90000) // 100000 - 10000
    })

    it('should handle multiple goals in the same month', () => {
      const balance = 200000
      const goals: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({ id: 'g1', amount: 30000, month: 3, year: 2025 }),
        createMockProcessedGoalEvent({ id: 'g2', amount: 20000, month: 3, year: 2025 }),
      ]
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 3, 1.0, goals)

      expect(result).toBe(150000) // 200000 - 30000 - 20000
    })

    it('should handle multiple events in the same month', () => {
      const balance = 100000
      const events: ProcessedGoalEvent[] = [
        createMockProcessedGoalEvent({ id: 'e1', type: 'event', amount: 10000, month: 3, year: 2025 }),
        createMockProcessedGoalEvent({ id: 'e2', type: 'event', amount: 5000, month: 3, year: 2025 }),
      ]
      const result = handleMonthlyGoalsAndEvents(balance, 2025, 3, 1.0, undefined, events)

      expect(result).toBe(115000) // 100000 + 10000 + 5000
    })
  })

  // ============================================================================
  // generateDataPoints
  // ============================================================================

  describe('generateDataPoints', () => {
    it('should generate data points for the given investment plan', () => {
      const plan = createMockInvestmentPlan({
        plan_initial_date: '2024-01-01',
      })
      const yearsUntilEnd = 2
      const birthYear = 1990

      const result = generateDataPoints(plan, yearsUntilEnd, birthYear)

      expect(result.length).toBeGreaterThan(0)
      expect(result[0].year).toBe(2024)
      expect(result[0].month).toBe(1)
    })

    it('should start from the plan start date month', () => {
      const plan = createMockInvestmentPlan({
        plan_initial_date: '2024-06-01',
      })
      const result = generateDataPoints(plan, 1, 1990)

      expect(result[0].month).toBe(6)
      expect(result[0].year).toBe(2024)
    })

    it('should generate monthly data points', () => {
      const plan = createMockInvestmentPlan({
        plan_initial_date: '2024-01-01',
      })
      const result = generateDataPoints(plan, 1, 1990)

      // Check sequential months
      if (result.length >= 2) {
        const firstMonth = result[0].month
        const secondMonth = result[1].month
        expect(secondMonth).toBe(firstMonth === 12 ? 1 : firstMonth + 1)
      }
    })

    it('should handle year transitions correctly', () => {
      const plan = createMockInvestmentPlan({
        plan_initial_date: '2024-11-01',
      })
      const result = generateDataPoints(plan, 1, 1990)

      // Find December and January
      const december = result.find(dp => dp.month === 12 && dp.year === 2024)
      const january = result.find(dp => dp.month === 1 && dp.year === 2025)

      expect(december).toBeDefined()
      expect(january).toBeDefined()
    })

    it('should set age based on birth year', () => {
      const plan = createMockInvestmentPlan({
        plan_initial_date: '2024-01-01',
      })
      const birthYear = 1990
      const result = generateDataPoints(plan, 1, birthYear)

      // First data point should have age approximately 34
      const firstAge = parseFloat(result[0].age)
      expect(firstAge).toBeCloseTo(34, 0)
    })

    it('should generate correct number of data points', () => {
      const plan = createMockInvestmentPlan({
        plan_initial_date: '2024-01-01',
      })
      // 2 years from January: 2 * 12 + (12 - 1 + 1) = 36
      const result = generateDataPoints(plan, 2, 1990)

      expect(result.length).toBe(36)
    })
  })
})
