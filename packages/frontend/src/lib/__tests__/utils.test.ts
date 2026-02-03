import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cx, cn, formatCurrency, calculateAge } from '../utils'
import { createDateWithoutTimezone } from '@/utils/dateUtils'

// Mock dateUtils
vi.mock('@/utils/dateUtils', () => ({
  createDateWithoutTimezone: (date: string | Date | null | undefined) => {
    if (!date) return new Date()
    return new Date(date)
  }
}))

describe('utils', () => {
  describe('cx and cn', () => {
    it('should merge class names correctly', () => {
      const result = cx('class1', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('should handle conditional classes', () => {
      const result = cx('base', false && 'hidden', 'visible')
      expect(result).not.toContain('hidden')
      expect(result).toContain('visible')
    })

    it('cn should work the same as cx', () => {
      const result1 = cx('test')
      const result2 = cn('test')
      expect(result1).toBe(result2)
    })
  })

  describe('formatCurrency', () => {
    it('should format number as BRL currency', () => {
      const result = formatCurrency(1234.56)
      expect(result).toContain('1.234,56')
      expect(result).toContain('R$')
    })

    it('should handle zero', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0')
    })

    it('should handle negative numbers', () => {
      const result = formatCurrency(-1000)
      expect(result).toContain('-')
    })

    it('should handle large numbers', () => {
      const result = formatCurrency(1000000)
      expect(result).toContain('1.000.000')
    })
  })

  describe('calculateAge', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-15'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should calculate age correctly', () => {
      const birthDate = '1990-01-01'
      const age = calculateAge(birthDate)
      expect(age).toBe(34)
    })

    it('should handle birthday not yet occurred this year', () => {
      const birthDate = '1990-06-01'
      const age = calculateAge(birthDate)
      expect(age).toBe(33)
    })

    it('should handle birthday already occurred this year', () => {
      const birthDate = '1990-01-10'
      const age = calculateAge(birthDate)
      expect(age).toBe(34)
    })

    it('should return 0 for null or undefined', () => {
      expect(calculateAge(null)).toBe(0)
      expect(calculateAge(undefined)).toBe(0)
    })

    it('should handle Date object', () => {
      const birthDate = new Date('1990-01-01')
      const age = calculateAge(birthDate)
      expect(age).toBe(34)
    })
  })
})
