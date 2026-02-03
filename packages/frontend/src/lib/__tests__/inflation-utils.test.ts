import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  formatDateForBCB,
  fetchIPCAMonthlyRates,
  calculateAccumulatedInflation,
  createIPCARatesMap,
  createCPIRatesMapByCurrency,
} from '../inflation-utils'
import { fetchIPCARates, fetchUSCPIRates, fetchEuroCPIRates } from '../bcb-api'

// Mock bcb-api
vi.mock('../bcb-api', () => ({
  fetchIPCARates: vi.fn(),
  fetchUSCPIRates: vi.fn(),
  fetchEuroCPIRates: vi.fn(),
}))

describe('inflation-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('formatDateForBCB', () => {
    it('should format date to DD/MM/YYYY', () => {
      // Use UTC date to avoid timezone issues
      const date = new Date('2024-01-15T12:00:00Z')
      const result = formatDateForBCB(date)
      // Check format structure (DD/MM/YYYY)
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
      expect(result).toContain('2024')
    })

    it('should pad single digit day and month', () => {
      const date = new Date('2024-03-05T12:00:00Z')
      const result = formatDateForBCB(date)
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
      expect(result).toContain('2024')
    })

    it('should handle year correctly', () => {
      const date = new Date('2023-12-31T12:00:00Z')
      const result = formatDateForBCB(date)
      expect(result).toMatch(/^\d{2}\/\d{2}\/2023$/)
    })
  })

  describe('fetchIPCAMonthlyRates', () => {
    it('should fetch and convert IPCA rates to decimals', () => {
      const mockRates = [
        { date: new Date('2024-01-01'), monthlyRate: 5.0 },
        { date: new Date('2024-02-01'), monthlyRate: 3.0 },
      ]
      vi.mocked(fetchIPCARates).mockReturnValue(mockRates)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-02-01')
      const result = fetchIPCAMonthlyRates(startDate, endDate)

      expect(result).toHaveLength(2)
      expect(result[0]).toBe(0.05) // 5% / 100
      expect(result[1]).toBe(0.03) // 3% / 100
    })

    it('should call fetchIPCARates with formatted dates', () => {
      const startDate = new Date('2024-01-01T12:00:00Z')
      const endDate = new Date('2024-02-01T12:00:00Z')
      
      fetchIPCAMonthlyRates(startDate, endDate)
      
      expect(fetchIPCARates).toHaveBeenCalled()
      const callArgs = vi.mocked(fetchIPCARates).mock.calls[0]
      expect(callArgs[0]).toMatch(/^\d{2}\/\d{2}\/2024$/)
      expect(callArgs[1]).toMatch(/^\d{2}\/\d{2}\/2024$/)
    })
  })

  describe('calculateAccumulatedInflation', () => {
    it('should calculate accumulated inflation factor', () => {
      const mockRates = [
        { date: new Date('2024-01-01'), monthlyRate: 5.0 },
        { date: new Date('2024-02-01'), monthlyRate: 3.0 },
      ]
      vi.mocked(fetchIPCARates).mockReturnValue(mockRates)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-02-01')
      const result = calculateAccumulatedInflation(startDate, endDate)

      // (1 + 0.05) * (1 + 0.03) - 1 = 0.0815, so factor = 1.0815
      expect(result).toBeCloseTo(1.0815, 3)
    })

    it('should return 1 for no inflation', () => {
      vi.mocked(fetchIPCARates).mockReturnValue([])

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-02-01')
      const result = calculateAccumulatedInflation(startDate, endDate)

      expect(result).toBeCloseTo(1.0, 2)
    })
  })

  describe('createIPCARatesMap', () => {
    it('should create map with YYYY-MM keys', () => {
      const mockRates = [
        { date: new Date('2024-01-15'), monthlyRate: 5.0 },
        { date: new Date('2024-02-20'), monthlyRate: 3.0 },
      ]
      vi.mocked(fetchIPCARates).mockReturnValue(mockRates)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-02-28')
      const result = createIPCARatesMap(startDate, endDate)

      expect(result.size).toBe(2)
      expect(result.get('2024-1')).toBe(0.05)
      expect(result.get('2024-2')).toBe(0.03)
    })

    it('should convert rates to decimals', () => {
      const mockRates = [
        { date: new Date('2024-01-01'), monthlyRate: 10.0 },
      ]
      vi.mocked(fetchIPCARates).mockReturnValue(mockRates)

      const result = createIPCARatesMap(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      )

      expect(result.size).toBe(1)
      // Key format is YYYY-M (month without zero padding)
      const key = Array.from(result.keys())[0]
      expect(result.get(key)).toBe(0.1)
    })
  })

  describe('createCPIRatesMapByCurrency', () => {
    it('should use IPCA for BRL', () => {
      const mockRates = [
        { date: new Date('2024-01-01'), monthlyRate: 5.0 },
      ]
      vi.mocked(fetchIPCARates).mockReturnValue(mockRates)

      const result = createCPIRatesMapByCurrency(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
        'BRL'
      )

      expect(fetchIPCARates).toHaveBeenCalled()
      expect(result.size).toBe(1)
      // Key format is YYYY-M (month without zero padding)
      const key = Array.from(result.keys())[0]
      expect(result.get(key)).toBe(0.05)
    })

    it('should use US CPI for USD', () => {
      const mockRates = [
        { date: new Date('2024-01-01'), monthlyRate: 2.0 },
      ]
      vi.mocked(fetchUSCPIRates).mockReturnValue(mockRates)

      const result = createCPIRatesMapByCurrency(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
        'USD'
      )

      expect(fetchUSCPIRates).toHaveBeenCalled()
      expect(result.size).toBe(1)
      // Key format is YYYY-M (month without zero padding)
      const key = Array.from(result.keys())[0]
      expect(result.get(key)).toBe(0.02)
    })

    it('should use Euro CPI for EUR', () => {
      const mockRates = [
        { date: new Date('2024-01-01'), monthlyRate: 1.5 },
      ]
      vi.mocked(fetchEuroCPIRates).mockReturnValue(mockRates)

      const result = createCPIRatesMapByCurrency(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
        'EUR'
      )

      expect(fetchEuroCPIRates).toHaveBeenCalled()
      expect(result.size).toBe(1)
      // The key format is YYYY-M (month without zero padding)
      const key = Array.from(result.keys())[0]
      expect(result.get(key)).toBe(0.015)
    })

    it('should default to BRL for unknown currency', () => {
      const mockRates = [
        { date: new Date('2024-01-01'), monthlyRate: 5.0 },
      ]
      vi.mocked(fetchIPCARates).mockReturnValue(mockRates)

      const result = createCPIRatesMapByCurrency(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
        'BRL'
      )

      expect(fetchIPCARates).toHaveBeenCalled()
      expect(result.size).toBe(1)
    })
  })
})
