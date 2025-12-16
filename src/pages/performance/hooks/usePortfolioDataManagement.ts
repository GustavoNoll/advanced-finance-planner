import { useState, useMemo, useCallback } from 'react'
import type { ConsolidatedPerformance, PerformanceData } from '@/types/financial'
import type { SortConfig, Filter, VerificationResult } from '../types/portfolio-data-management.types'
import { applyFiltersGeneric } from '../utils/filters'
import { applySortingGeneric } from '../utils/sorters'
import { createVerificationCache } from '../utils/verification'
import { isValidAssetClass } from '../utils/valid-asset-classes'

interface UsePortfolioDataManagementProps {
  consolidated: ConsolidatedPerformance[]
  detailed: PerformanceData[]
  correctThreshold?: number
  toleranceValue?: number
}

export function usePortfolioDataManagement({
  consolidated,
  detailed,
  correctThreshold = 0.01,
  toleranceValue = 2500
}: UsePortfolioDataManagementProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedIssuers, setSelectedIssuers] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<Filter[]>([])
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [verifFilter, setVerifFilter] = useState<string>('all')
  const [searchText, setSearchText] = useState<string>('')

  const periods = useMemo(() => {
    return Array.from(
      new Set([
        ...consolidated.map(r => r.period || ''),
        ...detailed.map(r => r.period || '')
      ].filter(Boolean))
    ).sort().reverse()
  }, [consolidated, detailed])

  const institutions = useMemo(() => {
    return Array.from(
      new Set([
        ...consolidated.map(r => r.institution || ''),
        ...detailed.map(r => r.institution || '')
      ].filter(Boolean))
    ).sort()
  }, [consolidated, detailed])

  const classes = useMemo(() => {
    return Array.from(
      new Set(detailed.map(r => r.asset_class || '').filter(Boolean))
    ).sort()
  }, [detailed])

  const issuers = useMemo(() => {
    return Array.from(
      new Set(detailed.map(r => r.issuer || '').filter(Boolean))
    ).sort()
  }, [detailed])

  const verificationCache = useMemo(() => {
    return createVerificationCache(consolidated, detailed, correctThreshold, toleranceValue)
  }, [consolidated, detailed, correctThreshold, toleranceValue])

  const getVerification = useCallback((item: ConsolidatedPerformance): VerificationResult => {
    const key = `${item.period || ''}-${item.institution || ''}-${item.account_name || ''}`
    return verificationCache.get(key) || {
      status: 'no-data',
      consolidatedValue: item.final_assets || 0,
      detailedSum: 0,
      difference: 0,
      detailedCount: 0,
      unclassifiedCount: 0,
      hasUnclassified: false,
      missingYieldCount: 0,
      hasMissingYield: false
    }
  }, [verificationCache])

  const filteredConsolidated = useMemo(() => {
    let data = consolidated

    if (selectedPeriods.length > 0) {
      data = data.filter(r => r.period && selectedPeriods.includes(r.period))
    }
    if (selectedInstitutions.length > 0) {
      data = data.filter(r => r.institution && selectedInstitutions.includes(r.institution))
    }

    data = applyFiltersGeneric(data, activeFilters)

    if (verifFilter !== 'all') {
      data = data.filter(item => {
        const verification = getVerification(item)
        return verification.status === verifFilter
      })
    }

    data = applySortingGeneric(data, sortConfig)

    return data
  }, [consolidated, selectedPeriods, selectedInstitutions, activeFilters, verifFilter, sortConfig, getVerification])

  // Função auxiliar para verificar se um registro detalhado tem problemas
  const hasDetailedIssues = useCallback((item: PerformanceData): boolean => {
    const hasInvalidClass = !isValidAssetClass(item.asset_class)
    // Verificar se yield é null, undefined ou NaN
    const hasMissingYield = item.yield == null || (typeof item.yield === 'number' && (isNaN(item.yield) || !isFinite(item.yield)))
    return hasInvalidClass || hasMissingYield
  }, [])

  const filteredDetailed = useMemo(() => {
    let data = detailed

    if (selectedPeriods.length > 0) {
      data = data.filter(r => r.period && selectedPeriods.includes(r.period))
    }
    if (selectedInstitutions.length > 0) {
      data = data.filter(r => r.institution && selectedInstitutions.includes(r.institution))
    }
    if (selectedClasses.length > 0) {
      data = data.filter(r => r.asset_class && selectedClasses.includes(r.asset_class))
    }
    if (selectedIssuers.length > 0) {
      data = data.filter(r => r.issuer && selectedIssuers.includes(r.issuer))
    }

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase()
      data = data.filter(item =>
        item.asset?.toLowerCase().includes(searchLower) ||
        item.issuer?.toLowerCase().includes(searchLower) ||
        item.asset_class?.toLowerCase().includes(searchLower)
      )
    }

    data = applyFiltersGeneric(data, activeFilters)

    // Aplicar filtro de verificação para detalhados
    if (verifFilter !== 'all') {
      if (verifFilter === 'mismatch') {
        // Para detalhados, "mismatch" (Divergência) significa registros com problemas
        // (classe inválida OU rentabilidade faltando)
        data = data.filter(item => hasDetailedIssues(item))
      } else if (verifFilter === 'match') {
        // Para detalhados, "match" significa registros sem problemas
        // (classe válida E rentabilidade preenchida)
        data = data.filter(item => !hasDetailedIssues(item))
      }
      // Para outros filtros (tolerance, no-data), não aplicamos aos detalhados
      // pois eles não têm verificação de integridade como os consolidados
      // Nesses casos, não filtra (mostra todos)
    }

    data = applySortingGeneric(data, sortConfig)

    return data
  }, [detailed, selectedPeriods, selectedInstitutions, selectedClasses, selectedIssuers, searchText, activeFilters, verifFilter, sortConfig, hasDetailedIssues])

  const handleSort = useCallback((field: string) => {
    if (!sortConfig || sortConfig.field !== field) {
      setSortConfig({ field, direction: 'asc' })
    } else if (sortConfig.direction === 'asc') {
      setSortConfig({ field, direction: 'desc' })
    } else {
      setSortConfig(null)
    }
  }, [sortConfig])

  return {
    periods,
    institutions,
    classes,
    issuers,
    selectedPeriods,
    setSelectedPeriods,
    selectedInstitutions,
    setSelectedInstitutions,
    selectedClasses,
    setSelectedClasses,
    selectedIssuers,
    setSelectedIssuers,
    activeFilters,
    setActiveFilters,
    sortConfig,
    handleSort,
    verifFilter,
    setVerifFilter,
    searchText,
    setSearchText,
    filteredConsolidated,
    filteredDetailed,
    getVerification
  }
}

