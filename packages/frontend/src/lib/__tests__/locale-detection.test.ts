import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { detectLanguage, detectCurrency, detectUserPreferences } from '../locale-detection'

describe('locale-detection', () => {
  const originalLanguage = navigator.language

  beforeEach(() => {
    // Reset navigator.language before each test
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: originalLanguage,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: originalLanguage,
      configurable: true,
    })
  })

  describe('detectLanguage', () => {
    it('should detect Portuguese (pt-BR)', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'pt-BR',
        configurable: true,
      })
      expect(detectLanguage()).toBe('pt-BR')
    })

    it('should detect Portuguese from pt prefix', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'pt-PT',
        configurable: true,
      })
      expect(detectLanguage()).toBe('pt-BR')
    })

    it('should detect English (en-US)', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'en-US',
        configurable: true,
      })
      expect(detectLanguage()).toBe('en-US')
    })

    it('should detect English from en prefix', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'en-GB',
        configurable: true,
      })
      expect(detectLanguage()).toBe('en-US')
    })

    it('should default to pt-BR for unknown languages', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'fr-FR',
        configurable: true,
      })
      expect(detectLanguage()).toBe('pt-BR')
    })

    it('should default to pt-BR when navigator.language is undefined', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: undefined,
        configurable: true,
      })
      expect(detectLanguage()).toBe('pt-BR')
    })
  })

  describe('detectCurrency', () => {
    it('should detect BRL for pt-BR', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'pt-BR',
        configurable: true,
      })
      expect(detectCurrency()).toBe('BRL')
    })

    it('should detect EUR for pt-PT', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'pt-PT',
        configurable: true,
      })
      expect(detectCurrency()).toBe('EUR')
    })

    it('should detect USD for en-US', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'en-US',
        configurable: true,
      })
      expect(detectCurrency()).toBe('USD')
    })

    it('should detect EUR for en-GB', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'en-GB',
        configurable: true,
      })
      expect(detectCurrency()).toBe('EUR')
    })

    it('should detect EUR for European languages', () => {
      const europeanLangs = ['de-DE', 'fr-FR', 'it-IT', 'nl-NL']
      europeanLangs.forEach(lang => {
        Object.defineProperty(navigator, 'language', {
          writable: true,
          value: lang,
          configurable: true,
        })
        expect(detectCurrency()).toBe('EUR')
      })
    })

    it('should default to BRL for unknown locales', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'ja-JP',
        configurable: true,
      })
      expect(detectCurrency()).toBe('BRL')
    })
  })

  describe('detectUserPreferences', () => {
    it('should return both locale and currency', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'pt-BR',
        configurable: true,
      })
      const prefs = detectUserPreferences()
      expect(prefs).toHaveProperty('locale')
      expect(prefs).toHaveProperty('currency')
      expect(prefs.locale).toBe('pt-BR')
      expect(prefs.currency).toBe('BRL')
    })

    it('should return correct preferences for en-US', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'en-US',
        configurable: true,
      })
      const prefs = detectUserPreferences()
      expect(prefs.locale).toBe('en-US')
      expect(prefs.currency).toBe('USD')
    })
  })
})
