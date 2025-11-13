import type { SortConfig } from '../types/portfolio-data-management.types'

export function applySortingGeneric<T extends Record<string, any>>(
  data: T[],
  sortConfig: SortConfig | null
): T[] {
  if (!sortConfig) return data
  
  return [...data].sort((a, b) => {
    const aValue = a[sortConfig.field as keyof T]
    const bValue = b[sortConfig.field as keyof T]
    
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1
    
    let comparison = 0
    
    if (sortConfig.field === 'period' || sortConfig.field === 'competencia') {
      const parsePeriod = (period: string) => {
        const [month, year] = String(period).split('/')
        return `${year}${month.padStart(2, '0')}`
      }
      
      const aPeriod = parsePeriod(String(aValue))
      const bPeriod = parsePeriod(String(bValue))
      comparison = aPeriod.localeCompare(bPeriod)
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue
    } else {
      comparison = String(aValue).localeCompare(String(bValue), 'pt-BR')
    }
    
    return sortConfig.direction === 'asc' ? comparison : -comparison
  })
}

