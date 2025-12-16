import type { Filter } from '../types/portfolio-data-management.types'

export function applyFiltersGeneric<T extends Record<string, unknown>>(
  data: T[],
  filters: Filter[]
): T[] {
  return data.filter(item => {
    return filters.every(filter => {
      const fieldValue = item[filter.field as keyof T]
      
      switch (filter.operator) {
        case 'equals':
          return fieldValue === filter.value
        case 'notEquals':
          return fieldValue !== filter.value
        case 'contains':
          if (Array.isArray(filter.value)) {
            // Para arrays, verificar se o valor do campo está no array (igualdade)
            // Isso é útil para campos como período, instituição, etc.
            return filter.value.some(val => 
              String(fieldValue) === String(val)
            )
          }
          return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase())
        case 'notContains':
          if (Array.isArray(filter.value)) {
            // Para arrays, verificar se o valor do campo NÃO está no array (igualdade)
            return !filter.value.some(val => 
              String(fieldValue) === String(val)
            )
          }
          return !String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase())
        case 'greaterThan':
          return Number(fieldValue) > Number(filter.value)
        case 'greaterThanOrEqual':
          return Number(fieldValue) >= Number(filter.value)
        case 'lessThan':
          return Number(fieldValue) < Number(filter.value)
        case 'lessThanOrEqual':
          return Number(fieldValue) <= Number(filter.value)
        case 'isEmpty':
          return !fieldValue || fieldValue === ''
        case 'isNotEmpty':
          return fieldValue && fieldValue !== ''
        default:
          return true
      }
    })
  })
}

export const operatorsByFieldType: { [key: string]: Array<{ value: string; label: string }> } = {
  text: [
    { value: 'equals', label: 'é' },
    { value: 'notEquals', label: 'não é' },
    { value: 'contains', label: 'contém' },
    { value: 'notContains', label: 'não contém' },
    { value: 'isEmpty', label: 'está vazio' },
    { value: 'isNotEmpty', label: 'não está vazio' }
  ],
  number: [
    { value: 'equals', label: '=' },
    { value: 'notEquals', label: '≠' },
    { value: 'greaterThan', label: '>' },
    { value: 'greaterThanOrEqual', label: '≥' },
    { value: 'lessThan', label: '<' },
    { value: 'lessThanOrEqual', label: '≤' },
    { value: 'isEmpty', label: 'está vazio' },
    { value: 'isNotEmpty', label: 'não está vazio' }
  ]
}

