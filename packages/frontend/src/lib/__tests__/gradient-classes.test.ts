import { describe, it, expect } from 'vitest'
import {
  gradientOrange,
  gradientGreen,
  gradientBlue,
  gradientPurple,
  gradientCard,
  iconContainerOrange,
  iconContainerGreen,
  iconContainerBlue,
  iconContainerPurple,
  buttonOrange,
  buttonGreen,
  buttonSelectedOrange,
  buttonSelectedGreen,
  tabTriggerActiveGreen,
  tabTriggerActiveBlue,
  iconContainerRentabilidade,
  iconContainerPatrimonio,
  iconContainerCrescimento,
} from '../gradient-classes'

describe('gradient-classes', () => {
  // ============================================================================
  // Gradient base classes
  // ============================================================================

  describe('gradient base classes', () => {
    it('should export gradientOrange with correct Tailwind classes', () => {
      expect(gradientOrange).toContain('bg-gradient-to-br')
      expect(gradientOrange).toContain('from-amber-400')
      expect(gradientOrange).toContain('to-orange-500')
      expect(gradientOrange).toContain('dark:')
    })

    it('should export gradientGreen with correct Tailwind classes', () => {
      expect(gradientGreen).toContain('bg-gradient-to-br')
      expect(gradientGreen).toContain('from-emerald-400')
      expect(gradientGreen).toContain('to-teal-500')
      expect(gradientGreen).toContain('dark:')
    })

    it('should export gradientBlue with correct Tailwind classes', () => {
      expect(gradientBlue).toContain('bg-gradient-to-br')
      expect(gradientBlue).toContain('from-blue-400')
      expect(gradientBlue).toContain('to-indigo-500')
      expect(gradientBlue).toContain('dark:')
    })

    it('should export gradientPurple with correct Tailwind classes', () => {
      expect(gradientPurple).toContain('bg-gradient-to-br')
      expect(gradientPurple).toContain('from-purple-400')
      expect(gradientPurple).toContain('to-pink-500')
      expect(gradientPurple).toContain('dark:')
    })

    it('should export gradientCard with backdrop and border', () => {
      expect(gradientCard).toContain('bg-gradient-to-br')
      expect(gradientCard).toContain('backdrop-blur-sm')
      expect(gradientCard).toContain('rounded-xl')
      expect(gradientCard).toContain('shadow-lg')
      expect(gradientCard).toContain('border')
    })
  })

  // ============================================================================
  // Icon container classes
  // ============================================================================

  describe('icon container classes', () => {
    it('should export iconContainerOrange with sizing and flex', () => {
      expect(iconContainerOrange).toContain('h-10')
      expect(iconContainerOrange).toContain('w-10')
      expect(iconContainerOrange).toContain('rounded-lg')
      expect(iconContainerOrange).toContain('flex')
      expect(iconContainerOrange).toContain('items-center')
      expect(iconContainerOrange).toContain('justify-center')
      expect(iconContainerOrange).toContain('shadow-md')
    })

    it('should export iconContainerGreen with sizing and flex', () => {
      expect(iconContainerGreen).toContain('h-10')
      expect(iconContainerGreen).toContain('w-10')
      expect(iconContainerGreen).toContain('from-emerald-400')
    })

    it('should export iconContainerBlue with sizing and flex', () => {
      expect(iconContainerBlue).toContain('h-10')
      expect(iconContainerBlue).toContain('w-10')
      expect(iconContainerBlue).toContain('from-blue-400')
    })

    it('should export iconContainerPurple with sizing and flex', () => {
      expect(iconContainerPurple).toContain('h-10')
      expect(iconContainerPurple).toContain('w-10')
      expect(iconContainerPurple).toContain('from-purple-400')
    })
  })

  // ============================================================================
  // Button classes
  // ============================================================================

  describe('button classes', () => {
    it('should export buttonOrange with text color and transitions', () => {
      expect(buttonOrange).toContain('text-white')
      expect(buttonOrange).toContain('shadow-md')
      expect(buttonOrange).toContain('hover:shadow-lg')
      expect(buttonOrange).toContain('transition-all')
      expect(buttonOrange).toContain('rounded-full')
    })

    it('should export buttonGreen with text color and transitions', () => {
      expect(buttonGreen).toContain('text-white')
      expect(buttonGreen).toContain('shadow-md')
      expect(buttonGreen).toContain('hover:shadow-lg')
      expect(buttonGreen).toContain('transition-all')
      expect(buttonGreen).toContain('rounded-full')
    })

    it('should export buttonSelectedOrange with shadow', () => {
      expect(buttonSelectedOrange).toContain('text-white')
      expect(buttonSelectedOrange).toContain('shadow-md')
      expect(buttonSelectedOrange).toContain('from-amber-400')
    })

    it('should export buttonSelectedGreen with shadow', () => {
      expect(buttonSelectedGreen).toContain('text-white')
      expect(buttonSelectedGreen).toContain('shadow-md')
      expect(buttonSelectedGreen).toContain('from-emerald-400')
    })
  })

  // ============================================================================
  // Tab trigger classes
  // ============================================================================

  describe('tab trigger classes', () => {
    it('should export tabTriggerActiveGreen with data-state selectors', () => {
      expect(tabTriggerActiveGreen).toContain('data-[state=active]')
      expect(tabTriggerActiveGreen).toContain('text-white')
      expect(tabTriggerActiveGreen).toContain('shadow-md')
    })

    it('should export tabTriggerActiveBlue with data-state selectors', () => {
      expect(tabTriggerActiveBlue).toContain('data-[state=active]')
      expect(tabTriggerActiveBlue).toContain('text-white')
      expect(tabTriggerActiveBlue).toContain('shadow-md')
    })
  })

  // ============================================================================
  // View mode icon containers
  // ============================================================================

  describe('view mode icon containers', () => {
    it('should export iconContainerRentabilidade with green gradient', () => {
      expect(iconContainerRentabilidade).toContain('from-emerald-400')
      expect(iconContainerRentabilidade).toContain('to-teal-500')
    })

    it('should export iconContainerPatrimonio with blue gradient', () => {
      expect(iconContainerPatrimonio).toContain('from-blue-400')
      expect(iconContainerPatrimonio).toContain('to-indigo-500')
    })

    it('should export iconContainerCrescimento with purple gradient', () => {
      expect(iconContainerCrescimento).toContain('from-purple-400')
      expect(iconContainerCrescimento).toContain('to-pink-500')
    })
  })

  // ============================================================================
  // All exports are strings
  // ============================================================================

  describe('type validation', () => {
    it('all exports should be non-empty strings', () => {
      const allExports = [
        gradientOrange,
        gradientGreen,
        gradientBlue,
        gradientPurple,
        gradientCard,
        iconContainerOrange,
        iconContainerGreen,
        iconContainerBlue,
        iconContainerPurple,
        buttonOrange,
        buttonGreen,
        buttonSelectedOrange,
        buttonSelectedGreen,
        tabTriggerActiveGreen,
        tabTriggerActiveBlue,
        iconContainerRentabilidade,
        iconContainerPatrimonio,
        iconContainerCrescimento,
      ]

      allExports.forEach(cls => {
        expect(typeof cls).toBe('string')
        expect(cls.length).toBeGreaterThan(0)
      })
    })

    it('all gradient exports should contain bg-gradient-to-br', () => {
      const gradients = [
        gradientOrange,
        gradientGreen,
        gradientBlue,
        gradientPurple,
        gradientCard,
      ]

      gradients.forEach(gradient => {
        expect(gradient).toContain('bg-gradient-to-br')
      })
    })

    it('all exports should include dark mode variants', () => {
      const allExports = [
        gradientOrange,
        gradientGreen,
        gradientBlue,
        gradientPurple,
        gradientCard,
        iconContainerOrange,
        iconContainerGreen,
        iconContainerBlue,
        iconContainerPurple,
        buttonOrange,
        buttonGreen,
      ]

      allExports.forEach(cls => {
        expect(cls).toContain('dark:')
      })
    })
  })
})
