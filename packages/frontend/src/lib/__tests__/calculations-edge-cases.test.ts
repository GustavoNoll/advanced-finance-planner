/**
 * Edge case tests for lib/calculations as per CALCULATIONS_REVIEW.md §7.1
 *
 * - Plano sem registros financeiros
 * - initialRecords vazio ou com um único registro
 * - Goals/events no mês exato de aposentadoria
 * - expectedReturn ou inflation zero
 * - monthsInRetirement zero ou negativo
 * - Plano tipo 2 com/sem herança
 */
import { describe, it, expect, vi } from 'vitest'
import { generateProjectionData } from '../calculations/chart-projections'
import { processPlanProgressData } from '../calculations/plan-progress-calculator'
import {
  calculateFutureValues,
  calculateMicroPlanFutureValues,
} from '../calculations/investmentPlanCalculations'
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
  plan_end_accumulation_date: '2054-01-01', // 30 years, retirement at 65 from 1990
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
  monthly_return: 100,
  monthly_return_rate: 1.01,
  ending_balance: 11100,
  ...overrides,
})

const createGoal = (overrides?: Partial<Goal>): Goal => ({
  id: 'goal-1',
  type: 'goal',
  profile_id: 'profile-1',
  name: 'Test Goal',
  icon: 'house' as Goal['icon'],
  asset_value: 50000,
  year: 2055,
  month: 1,
  status: 'pending',
  payment_mode: 'none',
  adjust_for_inflation: true,
  financial_links: [],
  ...overrides,
})

const createEvent = (overrides?: Partial<ProjectedEvent>): ProjectedEvent => ({
  id: 'event-1',
  type: 'event',
  profile_id: 'profile-1',
  name: 'Test Event',
  icon: 'contribution' as ProjectedEvent['icon'],
  asset_value: 30000,
  year: 2055,
  month: 1,
  status: 'pending',
  payment_mode: 'none',
  adjust_for_inflation: true,
  financial_links: [],
  ...overrides,
})

describe('calculations edge cases (CALCULATIONS_REVIEW §7.1)', () => {
  describe('1. Plano sem registros financeiros', () => {
    it('generateProjectionData should handle empty initialRecords and use initial_amount', () => {
      const plan = createPlan()
      const microPlans = [createMicroPlan()]
      const result = generateProjectionData(
        plan,
        { birth_date: '1990-01-01' },
        [],
        microPlans,
        [],
        [],
        undefined
      )

      expect(result.length).toBeGreaterThan(0)
      const firstYear = result[0]
      expect(firstYear).toHaveProperty('balance')
      expect(firstYear).toHaveProperty('planned_balance')
    })

    it('processPlanProgressData should handle empty allFinancialRecords', () => {
      const plan = createPlan()
      const microPlan = createMicroPlan()
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
      }
    })
  })

  describe('2. initialRecords vazio ou com um único registro', () => {
    it('generateProjectionData should handle empty array', () => {
      const plan = createPlan()
      const microPlans = [createMicroPlan()]
      const result = generateProjectionData(
        plan,
        { birth_date: '1990-01-01' },
        [],
        microPlans,
        undefined,
        undefined
      )

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('generateProjectionData should handle single record', () => {
      const plan = createPlan()
      const microPlans = [createMicroPlan()]
      const singleRecord = [createRecord({ record_year: 2024, record_month: 3, ending_balance: 15000 })]

      const result = generateProjectionData(
        plan,
        { birth_date: '1990-01-01' },
        singleRecord,
        microPlans,
        undefined,
        undefined
      )

      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('3. Goals/events no mês exato de aposentadoria', () => {
    it('generateProjectionData should include goals/events on retirement month', () => {
      const plan = createPlan({
        plan_initial_date: '1990-01-01',
        plan_end_accumulation_date: '2055-01-01', // retirement at 65
      })
      const microPlans = [createMicroPlan({ effective_date: '1990-01-01' })]
      const retirementGoal = createGoal({ year: 2055, month: 1 })
      const retirementEvent = createEvent({ year: 2055, month: 1 })

      const result = generateProjectionData(
        plan,
        { birth_date: '1990-01-01' },
        [],
        microPlans,
        [retirementGoal],
        [retirementEvent]
      )

      expect(result.length).toBeGreaterThan(0)
      const retirementYearData = result.find((y) => y.year === 2055)
      expect(retirementYearData).toBeDefined()
    })
  })

  describe('4. expectedReturn ou inflation zero', () => {
    it('calculateFutureValues should handle expectedReturn zero', () => {
      const formData = {
        initialAmount: '10000',
        plan_initial_date: '2024-01-01',
        finalAge: '65',
        planEndAccumulationDate: '',
        monthlyDeposit: '1000',
        desiredIncome: '5000',
        expectedReturn: '0',
        inflation: '5',
        planType: '1',
        adjustContributionForInflation: true,
        adjustIncomeForInflation: true,
        limitAge: '100',
        legacyAmount: '0',
        currency: 'BRL' as const,
        oldPortfolioProfitability: null,
        hasOldPortfolio: false,
      }
      const birthDate = new Date('1990-01-01')
      const result = calculateFutureValues(formData, birthDate)

      expect(result).toHaveProperty('futureValue')
      expect(result).toHaveProperty('requiredMonthlyDeposit')
      expect(typeof result.futureValue).toBe('number')
    })

    it('calculateFutureValues should handle inflation zero', () => {
      const formData = {
        initialAmount: '10000',
        plan_initial_date: '2024-01-01',
        finalAge: '65',
        planEndAccumulationDate: '',
        monthlyDeposit: '1000',
        desiredIncome: '5000',
        expectedReturn: '10',
        inflation: '0',
        planType: '1',
        adjustContributionForInflation: true,
        adjustIncomeForInflation: true,
        limitAge: '100',
        legacyAmount: '0',
        currency: 'BRL' as const,
        oldPortfolioProfitability: null,
        hasOldPortfolio: false,
      }
      const birthDate = new Date('1990-01-01')
      const result = calculateFutureValues(formData, birthDate)

      expect(result).toHaveProperty('futureValue')
      expect(typeof result.futureValue).toBe('number')
    })
  })

  describe('5. monthsInRetirement zero ou negativo', () => {
    it('calculateFutureValues should handle limit_age equal to final_age (monthsInRetirement = 0)', () => {
      const formData = {
        initialAmount: '10000',
        plan_initial_date: '2024-01-01',
        finalAge: '65',
        planEndAccumulationDate: '',
        monthlyDeposit: '1000',
        desiredIncome: '5000',
        expectedReturn: '10',
        inflation: '5',
        planType: '1',
        adjustContributionForInflation: true,
        adjustIncomeForInflation: true,
        limitAge: '65',
        legacyAmount: '0',
        currency: 'BRL' as const,
        oldPortfolioProfitability: null,
        hasOldPortfolio: false,
      }
      const birthDate = new Date('1990-01-01')
      const result = calculateFutureValues(formData, birthDate)

      expect(result).toHaveProperty('presentFutureValue')
      expect(typeof result.presentFutureValue).toBe('number')
    })
  })

  describe('6. Plano tipo 2 com/sem herança', () => {
    it('calculateFutureValues should handle plan type 2 without legacy (legacy_amount = 0)', () => {
      const formData = {
        initialAmount: '10000',
        plan_initial_date: '2024-01-01',
        finalAge: '65',
        planEndAccumulationDate: '',
        monthlyDeposit: '1000',
        desiredIncome: '5000',
        expectedReturn: '10',
        inflation: '5',
        planType: '2',
        adjustContributionForInflation: true,
        adjustIncomeForInflation: true,
        limitAge: '100',
        legacyAmount: '0',
        currency: 'BRL' as const,
        oldPortfolioProfitability: null,
        hasOldPortfolio: false,
      }
      const birthDate = new Date('1990-01-01')
      const result = calculateFutureValues(formData, birthDate)

      expect(result).toHaveProperty('necessaryFutureValue')
      expect(result).toHaveProperty('necessaryDepositToNecessaryFutureValue')
      expect(typeof result.necessaryFutureValue).toBe('number')
    })

    it('calculateFutureValues should handle plan type 2 with legacy', () => {
      const formData = {
        initialAmount: '10000',
        plan_initial_date: '2024-01-01',
        finalAge: '65',
        planEndAccumulationDate: '',
        monthlyDeposit: '1000',
        desiredIncome: '5000',
        expectedReturn: '10',
        inflation: '5',
        planType: '2',
        adjustContributionForInflation: true,
        adjustIncomeForInflation: true,
        limitAge: '100',
        legacyAmount: '500000',
        currency: 'BRL' as const,
        oldPortfolioProfitability: null,
        hasOldPortfolio: false,
      }
      const birthDate = new Date('1990-01-01')
      const result = calculateFutureValues(formData, birthDate)

      expect(result).toHaveProperty('necessaryFutureValue')
      expect(result.necessaryFutureValue).toBeGreaterThan(0)
    })

    it('calculateMicroPlanFutureValues should handle plan type 2 with legacy', () => {
      const plan = createPlan({
        plan_type: '2',
        legacy_amount: 200000,
      })
      const microPlan = createMicroPlan()
      const bd = new Date('1990-01-01')

      const result = calculateMicroPlanFutureValues(plan, microPlan, [], bd)

      expect(result).toHaveProperty('necessaryFutureValue')
      expect(result).toHaveProperty('necessaryDepositToNecessaryFutureValue')
    })
  })
})
