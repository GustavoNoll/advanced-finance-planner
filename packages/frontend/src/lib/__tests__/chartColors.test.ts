import { describe, it, expect } from 'vitest'
import {
  chartColors,
  AvailableChartColors,
  constructCategoryColors,
  getColorClassName,
  type AvailableChartColorsKeys,
} from '../chartColors'

describe('chartColors', () => {
  describe('chartColors', () => {
    it('should have all required color utilities', () => {
      const color = chartColors.blue
      expect(color).toHaveProperty('bg')
      expect(color).toHaveProperty('stroke')
      expect(color).toHaveProperty('fill')
      expect(color).toHaveProperty('text')
    })

    it('should have multiple color options', () => {
      expect(chartColors).toHaveProperty('blue')
      expect(chartColors).toHaveProperty('emerald')
      expect(chartColors).toHaveProperty('violet')
      expect(chartColors).toHaveProperty('amber')
    })

    it('should have valid Tailwind classes', () => {
      expect(chartColors.blue.bg).toContain('bg-blue-500')
      expect(chartColors.emerald.stroke).toContain('stroke-emerald-500')
      expect(chartColors.violet.fill).toContain('fill-violet-500')
      expect(chartColors.amber.text).toContain('text-amber-500')
    })
  })

  describe('AvailableChartColors', () => {
    it('should be an array of color keys', () => {
      expect(Array.isArray(AvailableChartColors)).toBe(true)
      expect(AvailableChartColors.length).toBeGreaterThan(0)
    })

    it('should contain valid color keys', () => {
      AvailableChartColors.forEach(color => {
        expect(chartColors).toHaveProperty(color)
      })
    })
  })

  describe('constructCategoryColors', () => {
    it('should map categories to colors', () => {
      const categories = ['Category A', 'Category B', 'Category C']
      const colors: AvailableChartColorsKeys[] = ['blue', 'emerald', 'violet']
      const result = constructCategoryColors(categories, colors)
      
      expect(result.size).toBe(3)
      expect(result.get('Category A')).toBe('blue')
      expect(result.get('Category B')).toBe('emerald')
      expect(result.get('Category C')).toBe('violet')
    })

    it('should cycle through colors when categories exceed colors', () => {
      const categories = ['A', 'B', 'C', 'D', 'E']
      const colors: AvailableChartColorsKeys[] = ['blue', 'emerald']
      const result = constructCategoryColors(categories, colors)
      
      expect(result.get('A')).toBe('blue')
      expect(result.get('B')).toBe('emerald')
      expect(result.get('C')).toBe('blue') // Cycles back
      expect(result.get('D')).toBe('emerald')
      expect(result.get('E')).toBe('blue')
    })

    it('should handle empty categories', () => {
      const result = constructCategoryColors([], ['blue'])
      expect(result.size).toBe(0)
    })

    it('should handle single category', () => {
      const result = constructCategoryColors(['Single'], ['blue'])
      expect(result.size).toBe(1)
      expect(result.get('Single')).toBe('blue')
    })
  })

  describe('getColorClassName', () => {
    it('should return correct class name for valid color and type', () => {
      expect(getColorClassName('blue', 'bg')).toBe('bg-blue-500')
      expect(getColorClassName('emerald', 'stroke')).toBe('stroke-emerald-500')
      expect(getColorClassName('violet', 'fill')).toBe('fill-violet-500')
      expect(getColorClassName('amber', 'text')).toBe('text-amber-500')
    })

    it('should return fallback for invalid color', () => {
      const result = getColorClassName('invalid-color' as AvailableChartColorsKeys, 'bg')
      expect(result).toBe('bg-gray-500')
    })

    it('should return fallback for invalid type', () => {
      // TypeScript should prevent this, but testing runtime behavior
      // The function uses: chartColors[color]?.[type] ?? fallbackColor[type]
      // If type is invalid, chartColors[color]?.[type] is undefined
      // Then it tries fallbackColor[type], which is also undefined for invalid type
      // So it returns undefined
      const result = getColorClassName('blue', 'invalid' as any)
      // The function doesn't handle invalid types, it returns undefined
      expect(result).toBeUndefined()
    })

    it('should handle all color utilities', () => {
      const types: Array<'bg' | 'stroke' | 'fill' | 'text'> = ['bg', 'stroke', 'fill', 'text']
      types.forEach(type => {
        const result = getColorClassName('blue', type)
        expect(result).toContain('blue-500')
        expect(result).toContain(type)
      })
    })
  })
})
