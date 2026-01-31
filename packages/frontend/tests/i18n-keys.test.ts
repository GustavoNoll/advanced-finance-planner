import { describe, it, expect } from 'vitest'
import { ptBR } from '@/locales/pt-BR'
import { enUS } from '@/locales/en-US'

/**
 * Gets all nested keys from an object
 * Example: { a: { b: { c: 'value' } } } => ['a.b.c']
 */
function getNestedKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getNestedKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  
  return keys
}

/**
 * Compares two sets of keys and returns missing keys
 */
function findMissingKeys(sourceKeys: string[], targetKeys: string[]): string[] {
  return sourceKeys.filter(key => !targetKeys.includes(key))
}

describe('i18n Translation Keys', () => {
  it('should have all pt-BR keys in en-US', () => {
    const ptBRKeys = getNestedKeys(ptBR)
    const enUSKeys = getNestedKeys(enUS)
    
    const missingKeys = findMissingKeys(ptBRKeys, enUSKeys)
    
    if (missingKeys.length > 0) {
      console.error('Missing keys in en-US:')
      missingKeys.forEach(key => console.error(`  - ${key}`))
    }
    
    expect(missingKeys).toEqual([])
  })

  it('should have all en-US keys in pt-BR', () => {
    const ptBRKeys = getNestedKeys(ptBR)
    const enUSKeys = getNestedKeys(enUS)
    
    const missingKeys = findMissingKeys(enUSKeys, ptBRKeys)
    
    if (missingKeys.length > 0) {
      console.error('Missing keys in pt-BR:')
      missingKeys.forEach(key => console.error(`  - ${key}`))
    }
    
    expect(missingKeys).toEqual([])
  })

  it('should have the same number of keys', () => {
    const ptBRKeys = getNestedKeys(ptBR)
    const enUSKeys = getNestedKeys(enUS)
    
    expect(ptBRKeys.length).toBe(enUSKeys.length)
  })

  it('should not have empty string values in pt-BR', () => {
    const ptBRKeys = getNestedKeys(ptBR)
    const emptyKeys: string[] = []
    
    ptBRKeys.forEach(key => {
      const value = key.split('.').reduce((obj: unknown, k) => (obj as Record<string, unknown>)?.[k], ptBR as unknown)
      if (value === '') {
        emptyKeys.push(key)
      }
    })
    
    if (emptyKeys.length > 0) {
      console.error('Empty values in pt-BR:')
      emptyKeys.forEach(key => console.error(`  - ${key}`))
    }
    
    expect(emptyKeys).toEqual([])
  })

  it('should not have empty string values in en-US', () => {
    const enUSKeys = getNestedKeys(enUS)
    const emptyKeys: string[] = []
    
    enUSKeys.forEach(key => {
      const value = key.split('.').reduce((obj: unknown, k) => (obj as Record<string, unknown>)?.[k], enUS as unknown)
      if (value === '') {
        emptyKeys.push(key)
      }
    })
    
    if (emptyKeys.length > 0) {
      console.error('Empty values in en-US:')
      emptyKeys.forEach(key => console.error(`  - ${key}`))
    }
    
    expect(emptyKeys).toEqual([])
  })
})
