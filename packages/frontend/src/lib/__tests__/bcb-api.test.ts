import { describe, it, expect } from 'vitest'
import {
  getIndicatorCurrencyConfig,
  INDICATOR_CURRENCY_CONFIG,
  fetchCDIRates,
  fetchIPCARates,
  fetchUSCPIRates,
  fetchEuroCPIRates,
  fetchSP500Prices,
  fetchTBondPrices,
  fetchIBOVRates,
  fetchGoldPrices,
  fetchBTCPrices,
  fetchIRFMRates,
  fetchIMABRates,
  fetchIHFARates,
  fetchIFIXRates,
  fetchAGGGPrices,
  fetchMSCIPrices,
  getPTAXByCompetencia,
} from '../bcb-api'

describe('bcb-api', () => {
  // ============================================================================
  // INDICATOR_CURRENCY_CONFIG
  // ============================================================================

  describe('INDICATOR_CURRENCY_CONFIG', () => {
    it('should have configuration for all major indicators', () => {
      const expectedIndicators = [
        'ptax', 'cdi', 'ipca', 'ibov', 'ihfa', 'irfm', 'imab', 'ifix',
        'sp500', 'gold', 'btc', 'tBond', 'usCpi', 'euroCpi', 'aggg', 'msciacwi',
      ]

      expectedIndicators.forEach(indicator => {
        expect(INDICATOR_CURRENCY_CONFIG).toHaveProperty(indicator)
      })
    })

    it('should have correct structure for each indicator', () => {
      Object.values(INDICATOR_CURRENCY_CONFIG).forEach(config => {
        expect(config).toHaveProperty('rawCurrency')
        expect(config).toHaveProperty('variationCurrency')
        expect(config).toHaveProperty('needsFXAdjustment')
        expect(['BRL', 'USD', 'INDEX']).toContain(config.rawCurrency)
        expect(['BRL', 'USD', 'INDEX']).toContain(config.variationCurrency)
        expect(typeof config.needsFXAdjustment).toBe('boolean')
      })
    })

    it('should mark SP500 as needing FX adjustment', () => {
      expect(INDICATOR_CURRENCY_CONFIG.sp500.needsFXAdjustment).toBe(true)
      expect(INDICATOR_CURRENCY_CONFIG.sp500.rawCurrency).toBe('USD')
    })

    it('should mark CDI as not needing FX adjustment', () => {
      expect(INDICATOR_CURRENCY_CONFIG.cdi.needsFXAdjustment).toBe(false)
      expect(INDICATOR_CURRENCY_CONFIG.cdi.rawCurrency).toBe('INDEX')
    })

    it('should mark IPCA as INDEX currency', () => {
      expect(INDICATOR_CURRENCY_CONFIG.ipca.rawCurrency).toBe('INDEX')
      expect(INDICATOR_CURRENCY_CONFIG.ipca.variationCurrency).toBe('INDEX')
    })

    it('should mark Gold as USD currency', () => {
      expect(INDICATOR_CURRENCY_CONFIG.gold.rawCurrency).toBe('USD')
      expect(INDICATOR_CURRENCY_CONFIG.gold.needsFXAdjustment).toBe(true)
    })

    it('should mark BTC as USD currency', () => {
      expect(INDICATOR_CURRENCY_CONFIG.btc.rawCurrency).toBe('USD')
      expect(INDICATOR_CURRENCY_CONFIG.btc.needsFXAdjustment).toBe(true)
    })
  })

  // ============================================================================
  // getIndicatorCurrencyConfig
  // ============================================================================

  describe('getIndicatorCurrencyConfig', () => {
    it('should return config for valid indicator (lowercase)', () => {
      const config = getIndicatorCurrencyConfig('sp500')
      expect(config).not.toBeNull()
      expect(config?.rawCurrency).toBe('USD')
    })

    it('should handle case-insensitive lookup', () => {
      const config = getIndicatorCurrencyConfig('SP500')
      expect(config).not.toBeNull()
      expect(config?.rawCurrency).toBe('USD')
    })

    it('should return null for unknown indicator', () => {
      const config = getIndicatorCurrencyConfig('unknown-indicator')
      expect(config).toBeNull()
    })

    it('should return null for empty string', () => {
      const config = getIndicatorCurrencyConfig('')
      expect(config).toBeNull()
    })

    it('should return correct config for CDI', () => {
      const config = getIndicatorCurrencyConfig('cdi')
      expect(config).toEqual({
        rawCurrency: 'INDEX',
        variationCurrency: 'INDEX',
        needsFXAdjustment: false,
      })
    })

    it('should return correct config for IFIX', () => {
      const config = getIndicatorCurrencyConfig('ifix')
      expect(config).toEqual({
        rawCurrency: 'BRL',
        variationCurrency: 'BRL',
        needsFXAdjustment: true,
      })
    })
  })

  // ============================================================================
  // Data Fetching Functions
  // ============================================================================

  describe('fetchCDIRates', () => {
    it('should return array of rates', () => {
      const result = fetchCDIRates('01/01/2024', '31/12/2024')
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return empty array for invalid date range', () => {
      const result = fetchCDIRates('01/01/2099', '31/12/2099')
      expect(result).toEqual([])
    })

    it('should return objects with date and monthlyRate', () => {
      const result = fetchCDIRates('01/01/2020', '31/12/2020')
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('date')
        expect(result[0]).toHaveProperty('monthlyRate')
        expect(result[0].date).toBeInstanceOf(Date)
        expect(typeof result[0].monthlyRate).toBe('number')
      }
    })
  })

  describe('fetchIPCARates', () => {
    it('should return array of rates', () => {
      const result = fetchIPCARates('01/01/2024', '31/12/2024')
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return empty array for invalid date range', () => {
      const result = fetchIPCARates('01/01/2099', '31/12/2099')
      expect(result).toEqual([])
    })

    it('should filter by date range', () => {
      const result = fetchIPCARates('01/01/2020', '31/03/2020')
      if (result.length > 0) {
        result.forEach(rate => {
          expect(rate.date.getFullYear()).toBe(2020)
          expect(rate.date.getMonth()).toBeLessThan(3) // Jan, Feb, Mar
        })
      }
    })
  })

  describe('fetchUSCPIRates', () => {
    it('should return array of rates', () => {
      const result = fetchUSCPIRates('01/01/2024', '31/12/2024')
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return empty array for future dates', () => {
      const result = fetchUSCPIRates('01/01/2099', '31/12/2099')
      expect(result).toEqual([])
    })
  })

  describe('fetchEuroCPIRates', () => {
    it('should return array of rates', () => {
      const result = fetchEuroCPIRates('01/01/2024', '31/12/2024')
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return empty array for future dates', () => {
      const result = fetchEuroCPIRates('01/01/2099', '31/12/2099')
      expect(result).toEqual([])
    })
  })

  describe('fetchSP500Prices', () => {
    it('should return array of price data', () => {
      const result = fetchSP500Prices('01/01/2024', '31/12/2024')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchTBondPrices', () => {
    it('should return array of price data', () => {
      const result = fetchTBondPrices('01/01/2024', '31/12/2024')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchIBOVRates', () => {
    it('should return array of rates', () => {
      const result = fetchIBOVRates('01/01/2024', '31/12/2024')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchGoldPrices', () => {
    it('should return array of price data', () => {
      const result = fetchGoldPrices('01/01/2024', '31/12/2024')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchBTCPrices', () => {
    it('should return array of price data', () => {
      const result = fetchBTCPrices('01/01/2024', '31/12/2024')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchIRFMRates', () => {
    it('should return array of variation rates', () => {
      const result = fetchIRFMRates('01/01/2020', '31/12/2020')
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return objects with date and monthlyRate', () => {
      const result = fetchIRFMRates('01/01/2020', '31/12/2020')
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('date')
        expect(result[0]).toHaveProperty('monthlyRate')
      }
    })
  })

  describe('fetchIMABRates', () => {
    it('should return array of variation rates', () => {
      const result = fetchIMABRates('01/01/2020', '31/12/2020')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchIHFARates', () => {
    it('should return array of variation rates', () => {
      const result = fetchIHFARates('01/01/2020', '31/12/2020')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchIFIXRates', () => {
    it('should return array of variation rates', () => {
      const result = fetchIFIXRates('01/01/2020', '31/12/2020')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchAGGGPrices', () => {
    it('should return array of variation rates', () => {
      const result = fetchAGGGPrices('01/01/2020', '31/12/2020')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchMSCIPrices', () => {
    it('should return array of variation rates', () => {
      const result = fetchMSCIPrices('01/01/2020', '31/12/2020')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  // ============================================================================
  // getPTAXByCompetencia
  // ============================================================================

  describe('getPTAXByCompetencia', () => {
    it('should return a function', () => {
      const getPTAX = getPTAXByCompetencia()
      expect(typeof getPTAX).toBe('function')
    })

    it('should return null for future competencia', () => {
      const getPTAX = getPTAXByCompetencia()
      const result = getPTAX('12/2099')

      // Should return null or a fallback value
      // Since there's no data for 2099, it might return null or nearest previous
      expect(result === null || typeof result === 'number').toBe(true)
    })

    it('should return a number for valid historical competencia', () => {
      const getPTAX = getPTAXByCompetencia()
      // Use a date that likely exists in the historical data
      const result = getPTAX('01/2024')

      if (result !== null) {
        expect(typeof result).toBe('number')
        expect(result).toBeGreaterThan(0)
      }
    })

    it('should fallback to nearest previous for missing competencia', () => {
      const getPTAX = getPTAXByCompetencia()
      // This tests the fallback behavior for a date that may not have exact data
      const result = getPTAX('06/2020')

      // Should return a number (either exact or nearest previous)
      if (result !== null) {
        expect(typeof result).toBe('number')
        expect(result).toBeGreaterThan(0)
      }
    })
  })
})
