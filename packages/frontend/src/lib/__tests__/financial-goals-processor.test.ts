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
    name: 'Test Goal',
    icon: '🏠',
    asset_value: 100000,
    year: 2024,
    month: 6,
    status: 'pending',
    payment_mode: 'none',
    ...overrides,
  })

  const createMockEvent = (overrides?: Partial<ProjectedEvent>): ProjectedEvent => ({
    id: 'event-1',
    type: 'event',
    name: 'Test Event',
    icon: '💰',
    asset_value: 50000,
    year: 2024,
    month: 6,
    status: 'pending',
    payment_mode: 'none',
    ...overrides,
  })

  const createMockFinancialLink = (amount: number): FinancialRecordLink => ({
    id: 'link-1',
    financial_record_id: 'record-1',
    goal_id: null,
    event_id: null,
    allocated_amount: amount,
    created_at: new Date().toISOString(),
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
  })
})
