import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { generateStructuredData, injectStructuredData } from '../seo-utils'

describe('seo-utils', () => {
  beforeEach(() => {
    // Clear any existing structured data
    const existing = document.getElementById('structured-data-custom')
    if (existing) {
      existing.remove()
    }
  })

  afterEach(() => {
    // Clean up after each test
    const existing = document.getElementById('structured-data-custom')
    if (existing) {
      existing.remove()
    }
  })

  describe('generateStructuredData', () => {
    it('should generate WebPage structured data', () => {
      const data = {
        name: 'Test Page',
        url: 'https://example.com',
      }
      const result = generateStructuredData('WebPage', data)
      const parsed = JSON.parse(result)
      
      expect(parsed['@context']).toBe('https://schema.org')
      expect(parsed['@type']).toBe('WebPage')
      expect(parsed.name).toBe('Test Page')
      expect(parsed.url).toBe('https://example.com')
    })

    it('should generate FAQPage structured data', () => {
      const data = {
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is this?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'This is a test',
            },
          },
        ],
      }
      const result = generateStructuredData('FAQPage', data)
      const parsed = JSON.parse(result)
      
      expect(parsed['@type']).toBe('FAQPage')
      expect(parsed.mainEntity).toBeDefined()
    })

    it('should generate HowTo structured data', () => {
      const data = {
        name: 'How to test',
        step: [
          {
            '@type': 'HowToStep',
            text: 'Step 1',
          },
        ],
      }
      const result = generateStructuredData('HowTo', data)
      const parsed = JSON.parse(result)
      
      expect(parsed['@type']).toBe('HowTo')
      expect(parsed.step).toBeDefined()
    })

    it('should generate Article structured data', () => {
      const data = {
        headline: 'Test Article',
        author: {
          '@type': 'Person',
          name: 'Test Author',
        },
      }
      const result = generateStructuredData('Article', data)
      const parsed = JSON.parse(result)
      
      expect(parsed['@type']).toBe('Article')
      expect(parsed.headline).toBe('Test Article')
    })

    it('should format JSON with proper indentation', () => {
      const data = { name: 'Test' }
      const result = generateStructuredData('WebPage', data)
      
      // Should have newlines and indentation
      expect(result).toContain('\n')
      expect(result).toContain('  ')
    })
  })

  describe('injectStructuredData', () => {
    it('should inject structured data script into head', () => {
      const structuredData = generateStructuredData('WebPage', { name: 'Test' })
      const cleanup = injectStructuredData(structuredData)
      
      const script = document.getElementById('structured-data-custom')
      expect(script).not.toBeNull()
      expect(script?.type).toBe('application/ld+json')
      expect(script?.textContent).toBe(structuredData)
      
      cleanup()
      expect(document.getElementById('structured-data-custom')).toBeNull()
    })

    it('should replace existing structured data', () => {
      const firstData = generateStructuredData('WebPage', { name: 'First' })
      const secondData = generateStructuredData('WebPage', { name: 'Second' })
      
      injectStructuredData(firstData)
      injectStructuredData(secondData)
      
      const script = document.getElementById('structured-data-custom')
      expect(script).not.toBeNull()
      expect(script?.textContent).toBe(secondData)
      expect(script?.textContent).not.toContain('First')
    })

    it('should return cleanup function', () => {
      const structuredData = generateStructuredData('WebPage', { name: 'Test' })
      const cleanup = injectStructuredData(structuredData)
      
      expect(typeof cleanup).toBe('function')
      
      cleanup()
      expect(document.getElementById('structured-data-custom')).toBeNull()
    })

    it('should handle multiple injections and cleanups', () => {
      const data1 = generateStructuredData('WebPage', { name: 'Test 1' })
      const data2 = generateStructuredData('WebPage', { name: 'Test 2' })
      
      const cleanup1 = injectStructuredData(data1)
      const cleanup2 = injectStructuredData(data2)
      
      expect(document.getElementById('structured-data-custom')?.textContent).toBe(data2)
      
      cleanup2()
      expect(document.getElementById('structured-data-custom')).toBeNull()
      
      cleanup1() // Should not throw even though already removed
    })
  })
})
