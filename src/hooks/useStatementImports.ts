import { useState, useEffect, useCallback } from 'react'
import { StatementImportsService } from '@/services/statement-imports.service'
import type { StatementImport } from '@/types/financial'

export function useStatementImports(profileId: string | null) {
  const [latestImport, setLatestImport] = useState<StatementImport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLatestImport = useCallback(async () => {
    if (!profileId) {
      setLatestImport(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const importData = await StatementImportsService.getLatestImport(profileId)
      setLatestImport(importData)
    } catch (err) {
      console.error('Error fetching latest import:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar importação')
    } finally {
      setLoading(false)
    }
  }, [profileId])

  useEffect(() => {
    fetchLatestImport()
  }, [fetchLatestImport])

  return {
    latestImport,
    loading,
    error,
    refetch: fetchLatestImport
  }
}

export function useStatementImportsHistory(profileId: string | null) {
  const [imports, setImports] = useState<StatementImport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchImports = useCallback(async () => {
    if (!profileId) {
      setImports([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const importsData = await StatementImportsService.getAllImports(profileId)
      setImports(importsData)
    } catch (err) {
      console.error('Error fetching imports history:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }, [profileId])

  useEffect(() => {
    fetchImports()
  }, [fetchImports])

  return {
    imports,
    loading,
    error,
    refetch: fetchImports
  }
}

