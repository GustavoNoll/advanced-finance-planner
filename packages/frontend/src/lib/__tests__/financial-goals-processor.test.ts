import { describe, it, expect } from 'vitest'
import {
  processItem,
  processGoalsForChart,
  processEventsForChart,
  IGNORE_FINANCIAL_LINKS,
  CONSIDER_FINANCIAL_LINKS,
} from '../financial-goals-processor'
import type { Goal, ProjectedEvent, FinancialRecordLink } from '@/types/financial'

describe('financial-goals-processor', () => {
  const createMockGoal = (overrides?: Partial<Goal>): Goal => ({
    id: 'goal-1',
    type: 'goal',
    profile_id: 'profile-1',
    name: 'Test Goal',
    icon: 'house',
    asset_value: 100000,
    year: 2024,
    month: 6,
    status: 'pending',
    payment_mode: 'none',
    adjust_for_inflation: true,
    ...overrides,
  })

  const createMockEvent = (overrides?: Partial<ProjectedEvent>): ProjectedEvent => ({
    id: 'event-1',
    type: 'event',
    profile_id: 'profile-1',
    name: 'Test Event',
    icon: 'contribution',
    asset_value: 50000,
    year: 2024,
    month: 6,
    status: 'pending',
    payment_mode: 'none',
    adjust_for_inflation: true,
    ...overrides,
  })

  const createMockFinancialLink = (amount: number, itemId: string = 'item-1', itemType: 'goal' | 'event' = 'goal'): FinancialRecordLink => ({
    id: 'link-1',
    financial_record_id: 'record-1',
    item_id: itemId,
    item_type: itemType,
    allocated_amount: amount,
    is_completing: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  describe('processItem', () => {
    it('should process goal without installments', () => {
      const goal = createMockGoal()
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(100000)
      expect(result[0].type).toBe('goal')
    })

    it('should process event without installments', () => {
      const event = createMockEvent()
      const result = processItem(event, 'event', IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(50000)
      expect(result[0].type).toBe('event')
    })

    it('should return empty array for fully paid goal', () => {
      const goal = createMockGoal({
        financial_links: [createMockFinancialLink(100000)],
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(0)
    })

    it('should process goal with installments', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 12,
        installment_interval: 1,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(12)
      expect(result[0].amount).toBeCloseTo(100000 / 12, 2)
    })

    it('should process goal with partial payment', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 12,
        installment_interval: 1,
        financial_links: [createMockFinancialLink(50000)],
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      expect(result.length).toBeLessThan(12)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should process goal with repeat mode', () => {
      const goal = createMockGoal({
        payment_mode: 'repeat',
        installment_count: 5,
        installment_interval: 12,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(5)
      result.forEach(item => {
        expect(item.amount).toBe(100000) // Full value for each repetition
      })
    })

    it('should handle repeat mode with partial payments', () => {
      const goal = createMockGoal({
        payment_mode: 'repeat',
        installment_count: 5,
        installment_interval: 12,
        asset_value: 100000,
        financial_links: [createMockFinancialLink(80000)], // Paid 0.8 repetitions (80000 / 100000 = 0.8)
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      // Math.floor(80000 / 100000) = 0 paid repetitions
      // Remaining: 5 - 0 = 5 repetitions
      // But calculateRemainingAmount returns Math.max(0, 100000 - 80000) = 20000
      // Since remainingAmount > 0, it processes
      // For repeat mode, it uses totalPaid to calculate paidRepetitions
      // paidRepetitions = Math.floor(80000 / 100000) = 0
      // remainingRepetitions = 5 - 0 = 5
      expect(result.length).toBe(5)
    })

    it('should calculate correct months for installments', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 3,
        installment_interval: 1,
        year: 2024,
        month: 1,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result[0].month).toBe(1)
      expect(result[0].year).toBe(2024)
      expect(result[1].month).toBe(2)
      expect(result[1].year).toBe(2024)
      expect(result[2].month).toBe(3)
      expect(result[2].year).toBe(2024)
    })

    it('should handle year overflow in installments', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 3,
        installment_interval: 1,
        year: 2024,
        month: 12,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result[0].month).toBe(12)
      expect(result[0].year).toBe(2024)
      expect(result[1].month).toBe(1)
      expect(result[1].year).toBe(2025)
    })

    it('should handle installment with partial first payment', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 12,
        installment_interval: 1,
        asset_value: 120000,
        financial_links: [createMockFinancialLink(55000)], // Paid 4.58 installments
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      // Should have remaining installments
      expect(result.length).toBeGreaterThan(0)
      expect(result.length).toBeLessThan(12)
      // First installment should be partial
      const installmentValue = 120000 / 12
      expect(result[0].amount).toBeLessThan(installmentValue)
    })

    it('should return empty array when overpaid', () => {
      const goal = createMockGoal({
        asset_value: 100000,
        financial_links: [createMockFinancialLink(150000)],
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(0)
    })

    it('should handle multiple financial links', () => {
      const goal = createMockGoal({
        asset_value: 100000,
        financial_links: [
          createMockFinancialLink(30000),
          createMockFinancialLink(20000),
        ],
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(50000) // 100000 - 30000 - 20000
    })

    it('should handle negative financial links for events', () => {
      const event = createMockEvent({
        asset_value: 50000,
        financial_links: [createMockFinancialLink(-20000)],
      })
      const result = processItem(event, 'event', CONSIDER_FINANCIAL_LINKS)
      
      // For events, Math.abs is used, so -20000 becomes 20000
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(30000) // 50000 - 20000
    })

    it('should preserve adjust_for_inflation property', () => {
      const goal = createMockGoal({
        adjust_for_inflation: false,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result[0].adjust_for_inflation).toBe(false)
    })

    it('should default adjust_for_inflation to true when undefined', () => {
      const goal = {
        ...createMockGoal(),
        adjust_for_inflation: undefined,
      } as Goal
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result[0].adjust_for_inflation).toBe(true)
    })

    it('should preserve name and description fields', () => {
      const goal = createMockGoal({
        name: 'Custom Goal Name',
        icon: 'car',
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result[0].name).toBe('Custom Goal Name')
      expect(result[0].description).toBe('car')
    })

    it('should preserve status field', () => {
      const goal = createMockGoal({
        status: 'completed',
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result[0].status).toBe('completed')
    })

    it('should handle payment_mode none with installment_count (should ignore installments)', () => {
      const goal = createMockGoal({
        payment_mode: 'none',
        installment_count: 12,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(100000)
    })

    it('should handle repeat mode with exact full payment', () => {
      const goal = createMockGoal({
        payment_mode: 'repeat',
        installment_count: 5,
        installment_interval: 12,
        asset_value: 100000,
        financial_links: [createMockFinancialLink(100000)], // Paid exactly 1 repetition
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      // When remainingAmount is 0 (fully paid), function returns [] early
      // This is because calculateRemainingAmount returns 0 before checking repetitions
      expect(result).toHaveLength(0)
    })

    it('should handle repeat mode with multiple full payments', () => {
      const goal = createMockGoal({
        payment_mode: 'repeat',
        installment_count: 5,
        installment_interval: 12,
        asset_value: 100000,
        financial_links: [
          createMockFinancialLink(100000),
          createMockFinancialLink(100000),
        ], // Paid exactly 2 repetitions (200000 total)
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      // When total paid (200000) >= asset_value (100000), remainingAmount is 0
      // Function returns [] early before checking repetitions
      expect(result).toHaveLength(0)
    })

    it('should handle repeat mode with interval > 1', () => {
      const goal = createMockGoal({
        payment_mode: 'repeat',
        installment_count: 3,
        installment_interval: 6, // Every 6 months
        year: 2024,
        month: 1,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(3)
      expect(result[0].month).toBe(1)
      expect(result[0].year).toBe(2024)
      expect(result[1].month).toBe(7)
      expect(result[1].year).toBe(2024)
      expect(result[2].month).toBe(1)
      expect(result[2].year).toBe(2025)
    })

    it('should handle installment with interval > 1', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 4,
        installment_interval: 3, // Every 3 months
        year: 2024,
        month: 1,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(4)
      expect(result[0].month).toBe(1)
      expect(result[0].year).toBe(2024)
      expect(result[1].month).toBe(4)
      expect(result[1].year).toBe(2024)
      expect(result[2].month).toBe(7)
      expect(result[2].year).toBe(2024)
      expect(result[3].month).toBe(10)
      expect(result[3].year).toBe(2024)
    })

    it('should include payment_mode in result for installments', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 3,
        installment_interval: 1,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      result.forEach(item => {
        expect(item.payment_mode).toBe('installment')
        expect(item.installment_count).toBe(3)
        expect(item.installment_interval).toBe(1)
      })
    })

    it('should include payment_mode in result for repeat', () => {
      const goal = createMockGoal({
        payment_mode: 'repeat',
        installment_count: 3,
        installment_interval: 12,
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      result.forEach(item => {
        expect(item.payment_mode).toBe('repeat')
        expect(item.installment_count).toBe(3)
        expect(item.installment_interval).toBe(12)
      })
    })

    it('should format description with installment index', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 3,
        installment_interval: 1,
        icon: 'house',
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result[0].description).toBe('house (1/3)')
      expect(result[1].description).toBe('house (2/3)')
      expect(result[2].description).toBe('house (3/3)')
    })

    it('should format description with repetition index', () => {
      const goal = createMockGoal({
        payment_mode: 'repeat',
        installment_count: 3,
        installment_interval: 12,
        icon: 'travel',
      })
      const result = processItem(goal, 'goal', IGNORE_FINANCIAL_LINKS)
      
      expect(result[0].description).toBe('travel (1/3)')
      expect(result[1].description).toBe('travel (2/3)')
      expect(result[2].description).toBe('travel (3/3)')
    })

    it('should handle empty financial_links array', () => {
      const goal = createMockGoal({
        financial_links: [],
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(100000)
    })

    it('should handle undefined financial_links', () => {
      const goal = createMockGoal({
        financial_links: undefined,
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(100000)
    })

    it('should handle installment with exact payment of all installments', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 12,
        installment_interval: 1,
        asset_value: 120000,
        financial_links: [createMockFinancialLink(120000)],
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(0)
    })

    it('should handle installment with payment of some installments', () => {
      const goal = createMockGoal({
        payment_mode: 'installment',
        installment_count: 12,
        installment_interval: 1,
        asset_value: 120000,
        financial_links: [createMockFinancialLink(50000)], // Paid ~4.17 installments
      })
      const result = processItem(goal, 'goal', CONSIDER_FINANCIAL_LINKS)
      
      // paidInstallments = Math.floor(50000 / 10000) = 5
      // remainingInstallments = 12 - 5 = 7
      // remainingAmount = 120000 - 50000 = 70000
      // firstRemainingInstallmentValue = 70000 - (7-1)*10000 = 10000
      expect(result.length).toBe(7)
      const installmentValue = 120000 / 12
      // First remaining installment should be full (10000) since we paid exactly 5 installments
      expect(result[0].amount).toBeCloseTo(installmentValue, 2)
      // Rest should be full installments
      for (let i = 1; i < result.length; i++) {
        expect(result[i].amount).toBeCloseTo(installmentValue, 2)
      }
    })
  })

  describe('processGoalsForChart', () => {
    it('should process multiple goals', () => {
      const goals = [
        createMockGoal({ id: 'goal-1', asset_value: 100000 }),
        createMockGoal({ id: 'goal-2', asset_value: 50000 }),
      ]
      const result = processGoalsForChart(goals, IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(2)
      expect(result[0].amount).toBe(100000)
      expect(result[1].amount).toBe(50000)
    })

    it('should filter out fully paid goals', () => {
      const goals = [
        createMockGoal({ id: 'goal-1' }),
        createMockGoal({
          id: 'goal-2',
          financial_links: [createMockFinancialLink(100000)],
        }),
      ]
      const result = processGoalsForChart(goals, CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('goal-1')
    })

    it('should process empty goals array', () => {
      const result = processGoalsForChart([], IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(0)
    })

    it('should process goals with mixed payment modes', () => {
      const goals = [
        createMockGoal({ id: 'goal-1', payment_mode: 'none' }),
        createMockGoal({
          id: 'goal-2',
          payment_mode: 'installment',
          installment_count: 3,
        }),
        createMockGoal({
          id: 'goal-3',
          payment_mode: 'repeat',
          installment_count: 2,
        }),
      ]
      const result = processGoalsForChart(goals, IGNORE_FINANCIAL_LINKS)
      
      // goal-1: 1 item, goal-2: 3 items, goal-3: 2 items = 6 total
      expect(result).toHaveLength(6)
    })

    it('should handle goals with financial links when ignoring them', () => {
      const goals = [
        createMockGoal({
          id: 'goal-1',
          financial_links: [createMockFinancialLink(50000)],
        }),
      ]
      const result = processGoalsForChart(goals, IGNORE_FINANCIAL_LINKS)
      
      // Should use full asset_value when ignoring links
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(100000)
    })
  })

  describe('processEventsForChart', () => {
    it('should process multiple events', () => {
      const events = [
        createMockEvent({ id: 'event-1', asset_value: 50000 }),
        createMockEvent({ id: 'event-2', asset_value: 30000 }),
      ]
      const result = processEventsForChart(events, IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(2)
      expect(result[0].amount).toBe(50000)
      expect(result[1].amount).toBe(30000)
    })

    it('should handle events with financial links', () => {
      const event = createMockEvent({
        financial_links: [createMockFinancialLink(20000)],
      })
      const result = processEventsForChart([event], CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(30000) // 50000 - 20000
    })

    it('should process empty events array', () => {
      const result = processEventsForChart([], IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(0)
    })

    it('should filter out fully paid events', () => {
      const events = [
        createMockEvent({ id: 'event-1' }),
        createMockEvent({
          id: 'event-2',
          financial_links: [createMockFinancialLink(50000)],
        }),
      ]
      const result = processEventsForChart(events, CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('event-1')
    })

    it('should handle events with multiple financial links', () => {
      const event = createMockEvent({
        asset_value: 50000,
        financial_links: [
          createMockFinancialLink(15000),
          createMockFinancialLink(10000),
        ],
      })
      const result = processEventsForChart([event], CONSIDER_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(25000) // 50000 - 15000 - 10000
    })

    it('should handle events with negative financial links', () => {
      const event = createMockEvent({
        asset_value: 50000,
        financial_links: [
          createMockFinancialLink(-20000),
          createMockFinancialLink(-10000),
        ],
      })
      const result = processEventsForChart([event], CONSIDER_FINANCIAL_LINKS)
      
      // Math.abs is used, so -20000 and -10000 become 20000 and 10000
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(20000) // 50000 - 20000 - 10000
    })

    it('should handle events with installments', () => {
      const events = [
        createMockEvent({
          id: 'event-1',
          payment_mode: 'installment',
          installment_count: 6,
          asset_value: 60000,
        }),
      ]
      const result = processEventsForChart(events, IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(6)
      expect(result[0].amount).toBeCloseTo(60000 / 6, 2)
    })

    it('should handle events with repeat mode', () => {
      const events = [
        createMockEvent({
          id: 'event-1',
          payment_mode: 'repeat',
          installment_count: 3,
          asset_value: 30000,
        }),
      ]
      const result = processEventsForChart(events, IGNORE_FINANCIAL_LINKS)
      
      expect(result).toHaveLength(3)
      result.forEach(item => {
        expect(item.amount).toBe(30000)
      })
    })
  })

  describe('constants', () => {
    it('should export IGNORE_FINANCIAL_LINKS as true', () => {
      expect(IGNORE_FINANCIAL_LINKS).toBe(true)
    })

    it('should export CONSIDER_FINANCIAL_LINKS as false', () => {
      expect(CONSIDER_FINANCIAL_LINKS).toBe(false)
    })
  })
})
