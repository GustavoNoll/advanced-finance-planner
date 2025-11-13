import { useMemo } from 'react'
import cdiData from '@/data/cdi-historical.json'
import ipcaData from '@/data/ipca-historical.json'

interface CDIRecord {
  competencia: string
  cdiRate: number
}

interface IPCARecord {
  competencia: string
  ipca: number
}

export function useMarketData() {
  const cdiRecords = useMemo<CDIRecord[]>(() => {
    return (cdiData as any[]).map(item => ({
      competencia: item.competencia || item.period || '',
      cdiRate: item.cdiRate || item.rate || 0
    })).filter(item => item.competencia)
  }, [])

  const ipcaRecords = useMemo<IPCARecord[]>(() => {
    return (ipcaData as any[]).map(item => ({
      competencia: item.competencia || item.period || '',
      ipca: item.ipca || item.rate || 0
    })).filter(item => item.competencia)
  }, [])

  const getCDIByCompetencia = (competencia: string): CDIRecord | undefined => {
    return cdiRecords.find(r => r.competencia === competencia)
  }

  const getIPCAByCompetencia = (competencia: string): IPCARecord | undefined => {
    return ipcaRecords.find(r => r.competencia === competencia)
  }

  return {
    cdiData: cdiRecords,
    ipcaData: ipcaRecords,
    getCDIByCompetencia,
    getIPCAByCompetencia
  }
}

