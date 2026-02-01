import { useMemo, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle2, Settings2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { CurrencyToggle } from "@/components/portfolio/currency-toggle"
import { useCurrency } from "@/contexts/CurrencyContext"
import { getIndicatorCurrencyConfig, IndicatorCurrency } from "@/lib/bcb-api"
import ipcaData from '@shared/data/ipca-historical.json'
import cdiData from '@shared/data/cdi-historical.json'
import ibovData from '@shared/data/ibov-historical.json'
import sp500Data from '@shared/data/sp500-historical.json'
import tBondData from '@shared/data/t-bond-historical.json'
import goldData from '@shared/data/gold-historical.json'
import btcData from '@shared/data/btc-historical.json'
import usCpiData from '@shared/data/us-cpi-historical.json'
import euroCpiData from '@shared/data/euro-cpi-historical.json'
import ptaxData from '@shared/data/ptax-historical.json'
import ihfaData from '@shared/data/ihfa-historical.json'
import irfmData from '@shared/data/irfm-historical.json'
import imabData from '@shared/data/imab-historical.json'
import agggData from '@shared/data/aggg-historical.json'
import msciAcwiData from '@shared/data/msci-acwi-historical.json'
import ifixData from '@shared/data/ifix-historical.json'

interface BCBResponse {
  data: string
  valor: string
}

interface ConsolidatedData {
  competence: string // MM/YYYY
  ptax: number | null
  ptaxRaw: number | null
  cdiMonthly: number | null
  cdiAccumulated: number | null
  ipcaMonthly: number | null
  ipcaAccumulated: number | null
  ibovMonthly: number | null
  ibovRaw: number | null
  sp500Monthly: number | null
  sp500Raw: number | null
  tBondMonthly: number | null
  goldMonthly: number | null
  goldRaw: number | null
  btcMonthly: number | null
  btcRaw: number | null
  usCpiMonthly: number | null
  usCpiRaw: number | null
  euroCpiMonthly: number | null
  euroCpiRaw: number | null
  ihfaMonthly: number | null
  ihfaRaw: number | null
  irfmMonthly: number | null
  irfmRaw: number | null
  imabMonthly: number | null
  imabRaw: number | null
  agggMonthly: number | null
  agggRaw: number | null
  msciAcwiMonthly: number | null
  msciAcwiRaw: number | null
  ifixMonthly: number | null
  ifixRaw: number | null
}

type ColumnKey = 'competence' | 'ptax' | 'cdiMonthly' | 'cdiAccumulated' | 'ipcaMonthly' | 'ipcaAccumulated' | 
  'ibovMonthly' | 'sp500Monthly' | 'tBondMonthly' | 'goldMonthly' | 'btcMonthly' | 'usCpiMonthly' | 'euroCpiMonthly' | 'ihfaMonthly' | 'irfmMonthly' | 'imabMonthly' | 'agggMonthly' | 'msciAcwiMonthly' | 'ifixMonthly'

function parseBrazilianDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}

function formatCompetence(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${year}`
}

export default function MarketDataAudit() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { currency: displayCurrency, convertValue, adjustReturnWithFX, formatCurrency: formatCurrencyContext } = useCurrency()

  const [consolidatedData, setConsolidatedData] = useState<ConsolidatedData[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dados raw carregados dinamicamente
  const [rawData, setRawData] = useState<{
    ptax: BCBResponse[]
    ibov: BCBResponse[]
    sp500: BCBResponse[]
    gold: BCBResponse[]
    btc: BCBResponse[]
    usCpi: BCBResponse[]
    euroCpi: BCBResponse[]
    ihfa: BCBResponse[]
    irfm: BCBResponse[]
    imab: BCBResponse[]
    aggg: BCBResponse[]
    msciAcwi: BCBResponse[]
    ifix: BCBResponse[]
  }>({
    ptax: [],
    ibov: [],
    sp500: [],
    gold: [],
    btc: [],
    usCpi: [],
    euroCpi: [],
    ihfa: [],
    irfm: [],
    imab: [],
    aggg: [],
    msciAcwi: [],
    ifix: []
  })
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  
  // Filtros por ano
  const [filterStartYear, setFilterStartYear] = useState<string>('')
  const [filterEndYear, setFilterEndYear] = useState<string>('')
  
  // Colunas visíveis
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    competence: true,
    ptax: true,
    cdiMonthly: true,
    cdiAccumulated: true,
    ipcaMonthly: true,
    ipcaAccumulated: true,
    ibovMonthly: false,
    sp500Monthly: false,
    tBondMonthly: false,
    goldMonthly: false,
    btcMonthly: false,
    usCpiMonthly: false,
    euroCpiMonthly: false,
    ihfaMonthly: false,
    irfmMonthly: false,
    imabMonthly: false,
    agggMonthly: false,
    msciAcwiMonthly: false,
    ifixMonthly: false
  })
  const [showColumnSelector, setShowColumnSelector] = useState(false)

  // Carregar dados raw quando disponíveis
  useEffect(() => {
    const loadRawData = async () => {
      const raw: typeof rawData = {
        ptax: [],
        ibov: [],
        sp500: [],
        gold: [],
        btc: [],
        usCpi: [],
        euroCpi: [],
        ihfa: [],
        irfm: [],
        imab: [],
        aggg: [],
        msciAcwi: [],
        ifix: []
      }

      try {
        const ptaxRaw = await import('@shared/data/ptax-raw-historical.json')
        raw.ptax = (ptaxRaw.default || ptaxRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const ibovRaw = await import('@shared/data/ibov-raw-historical.json')
        raw.ibov = (ibovRaw.default || ibovRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const sp500Raw = await import('@shared/data/sp500-raw-historical.json')
        raw.sp500 = (sp500Raw.default || sp500Raw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const goldRaw = await import('@shared/data/gold-raw-historical.json')
        raw.gold = (goldRaw.default || goldRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const btcRaw = await import('@shared/data/btc-raw-historical.json')
        raw.btc = (btcRaw.default || btcRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const usCpiRaw = await import('@shared/data/us-cpi-raw-historical.json')
        raw.usCpi = (usCpiRaw.default || usCpiRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const euroCpiRaw = await import('@shared/data/euro-cpi-raw-historical.json')
        raw.euroCpi = (euroCpiRaw.default || euroCpiRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const ihfaRaw = await import('@shared/data/ihfa-raw-historical.json')
        raw.ihfa = (ihfaRaw.default || ihfaRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const irfmRaw = await import('@shared/data/irfm-raw-historical.json')
        raw.irfm = (irfmRaw.default || irfmRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const imabRaw = await import('@shared/data/imab-raw-historical.json')
        raw.imab = (imabRaw.default || imabRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const agggRaw = await import('@shared/data/aggg-raw-historical.json')
        raw.aggg = (agggRaw.default || agggRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const msciAcwiRaw = await import('@shared/data/msci-acwi-raw-historical.json')
        raw.msciAcwi = (msciAcwiRaw.default || msciAcwiRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      try {
        const ifixRaw = await import('@shared/data/ifix-raw-historical.json')
        raw.ifix = (ifixRaw.default || ifixRaw) as BCBResponse[]
      } catch {
        // Arquivo não existe ainda
      }

      setRawData(raw)
    }

    loadRawData()
  }, [])

  // Processar todos os dados
  const processedData = useMemo(() => {
    const dataMap = new Map<string, {
      competence: string
      ptax?: number
      ptaxRaw?: number
      cdiMonthly?: number
      ipcaMonthly?: number
      ibovMonthly?: number
      ibovRaw?: number
      sp500Monthly?: number
      sp500Raw?: number
      tBondMonthly?: number
      goldMonthly?: number
      goldRaw?: number
      btcMonthly?: number
      btcRaw?: number
      usCpiMonthly?: number
      usCpiRaw?: number
      euroCpiMonthly?: number
      euroCpiRaw?: number
      ihfaMonthly?: number
      ihfaRaw?: number
      irfmMonthly?: number
      irfmRaw?: number
      imabMonthly?: number
      imabRaw?: number
      agggMonthly?: number
      agggRaw?: number
      msciAcwiMonthly?: number
      msciAcwiRaw?: number
      ifixMonthly?: number
      ifixRaw?: number
    }>()
    
    // Processar CDI
    cdiData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.cdiMonthly = value
    })

    // Processar IPCA
    ipcaData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.ipcaMonthly = value
    })

    // Processar IBOV
    ibovData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.ibovMonthly = value
    })

    // Processar S&P 500
    sp500Data.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.sp500Monthly = value
    })

    // Processar T-Bond
    tBondData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.tBondMonthly = value
    })

    // Processar Gold
    goldData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.goldMonthly = value
    })

    // Processar BTC
    btcData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.btcMonthly = value
    })

    // Processar US CPI
    usCpiData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.usCpiMonthly = value
    })

    // Processar Euro CPI
    euroCpiData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.euroCpiMonthly = value
    })

    // Processar IHFA
    ihfaData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.ihfaMonthly = value
    })

    // Processar IRFM
    irfmData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.irfmMonthly = value
    })

    // Processar IMAB
    imabData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.imabMonthly = value
    })

    // Processar AGGG
    agggData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.agggMonthly = value
    })

    // Processar MSCI ACWI
    msciAcwiData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.msciAcwiMonthly = value
    })

    // Processar IFIX
    ifixData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.ifixMonthly = value
    })

    // Processar PTAX
    ptaxData.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.ptax = value
    })

    // Processar dados raw quando disponíveis
    // PTAX Raw
    rawData.ptax.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.ptaxRaw = value
    })

    // IBOV Raw
    rawData.ibov.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.ibovRaw = value
    })

    // S&P 500 Raw
    rawData.sp500.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.sp500Raw = value
    })

    // Gold Raw
    rawData.gold.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.goldRaw = value
    })

    // BTC Raw
    rawData.btc.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.btcRaw = value
    })

    // US CPI Raw
    rawData.usCpi.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.usCpiRaw = value
    })

    // Euro CPI Raw
    rawData.euroCpi.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.euroCpiRaw = value
    })

    // IHFA Raw
    rawData.ihfa.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.ihfaRaw = value
    })

    // IRFM Raw
    rawData.irfm.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.irfmRaw = value
    })

    // IMAB Raw
    rawData.imab.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.imabRaw = value
    })

    // AGGG Raw
    rawData.aggg.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.agggRaw = value
    })

    // MSCI ACWI Raw
    rawData.msciAcwi.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.msciAcwiRaw = value
    })

    // IFIX Raw
    rawData.ifix.forEach(item => {
      const date = parseBrazilianDate(item.data)
      const competence = formatCompetence(date)
      const value = parseFloat(item.valor)
      if (!dataMap.has(competence)) {
        dataMap.set(competence, { competence })
      }
      dataMap.get(competence)!.ifixRaw = value
    })

    // Ordenar competências
    const sortedCompetences = Array.from(dataMap.keys()).sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number)
      const [monthB, yearB] = b.split('/').map(Number)
      if (yearA !== yearB) return yearB - yearA
      return monthB - monthA
    })

    // Calcular valores acumulados e criar array final
    return sortedCompetences.map(competence => {
      const entry = dataMap.get(competence)!
      const [month, year] = competence.split('/').map(Number)
      
      // Calcular CDI acumulado
      let cdiAccumulated: number | null = null
      if (entry.cdiMonthly !== null && entry.cdiMonthly !== undefined) {
        const yearCompetences = sortedCompetences.filter(c => {
          const [m, y] = c.split('/').map(Number)
          return y === year && m <= month
        })
        
        let accumulated = 1
        yearCompetences.forEach(c => {
          const cdiEntry = dataMap.get(c)
          if (cdiEntry?.cdiMonthly !== null && cdiEntry?.cdiMonthly !== undefined) {
            accumulated *= (1 + (cdiEntry.cdiMonthly as number) / 100)
          }
        })
        cdiAccumulated = (accumulated - 1) * 100
      }

      // Calcular IPCA acumulado
      let ipcaAccumulated: number | null = null
      if (entry.ipcaMonthly !== null && entry.ipcaMonthly !== undefined) {
        const yearCompetences = sortedCompetences.filter(c => {
          const [m, y] = c.split('/').map(Number)
          return y === year && m <= month
        })
        
        let accumulated = 1
        yearCompetences.forEach(c => {
          const ipcaEntry = dataMap.get(c)
          if (ipcaEntry?.ipcaMonthly !== null && ipcaEntry?.ipcaMonthly !== undefined) {
            accumulated *= (1 + (ipcaEntry.ipcaMonthly as number) / 100)
          }
        })
        ipcaAccumulated = (accumulated - 1) * 100
      }

      return {
        competence,
        ptax: entry.ptax as number | null ?? null,
        ptaxRaw: entry.ptaxRaw as number | null ?? null,
        cdiMonthly: entry.cdiMonthly as number | null ?? null,
        cdiAccumulated,
        ipcaMonthly: entry.ipcaMonthly as number | null ?? null,
        ipcaAccumulated,
        ibovMonthly: entry.ibovMonthly as number | null ?? null,
        ibovRaw: entry.ibovRaw as number | null ?? null,
        sp500Monthly: entry.sp500Monthly as number | null ?? null,
        sp500Raw: entry.sp500Raw as number | null ?? null,
        tBondMonthly: entry.tBondMonthly as number | null ?? null,
        goldMonthly: entry.goldMonthly as number | null ?? null,
        goldRaw: entry.goldRaw as number | null ?? null,
        btcMonthly: entry.btcMonthly as number | null ?? null,
        btcRaw: entry.btcRaw as number | null ?? null,
        usCpiMonthly: entry.usCpiMonthly as number | null ?? null,
        usCpiRaw: entry.usCpiRaw as number | null ?? null,
        euroCpiMonthly: entry.euroCpiMonthly as number | null ?? null,
        euroCpiRaw: entry.euroCpiRaw as number | null ?? null,
        ihfaMonthly: entry.ihfaMonthly as number | null ?? null,
        ihfaRaw: entry.ihfaRaw as number | null ?? null,
        irfmMonthly: entry.irfmMonthly as number | null ?? null,
        irfmRaw: entry.irfmRaw as number | null ?? null,
        imabMonthly: entry.imabMonthly as number | null ?? null,
        imabRaw: entry.imabRaw as number | null ?? null,
        agggMonthly: entry.agggMonthly as number | null ?? null,
        agggRaw: entry.agggRaw as number | null ?? null,
        msciAcwiMonthly: entry.msciAcwiMonthly as number | null ?? null,
        msciAcwiRaw: entry.msciAcwiRaw as number | null ?? null,
        ifixMonthly: entry.ifixMonthly as number | null ?? null,
        ifixRaw: entry.ifixRaw as number | null ?? null
      }
    })
  }, [rawData])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = processedData.map(item => ({ ...item }))
      setConsolidatedData(data)
      setLoading(false)
    }
    loadData()
  }, [processedData])

  // Função helper para converter valor raw baseado na configuração
  const convertRawValue = useCallback((
    value: number | null,
    indicatorName: string,
    competence: string
  ): number | null => {
    if (value === null) return null
    
    const config = getIndicatorCurrencyConfig(indicatorName)
    if (!config) return value
    
    // Se é índice, não converte
    if (config.rawCurrency === 'INDEX') return value
    
    // Se a moeda original é igual à moeda de exibição, não converte
    if (config.rawCurrency === displayCurrency) return value
    
    // Converter se necessário
    const originalCurrency = config.rawCurrency === 'USD' ? 'USD' : 'BRL'
    return convertValue(value, competence, originalCurrency)
  }, [displayCurrency, convertValue])

  // Função helper para ajustar porcentagem baseado na configuração
  const adjustVariation = useCallback((
    value: number | null,
    indicatorName: string,
    competence: string
  ): number | null => {
    if (value === null) return null
    
    const config = getIndicatorCurrencyConfig(indicatorName)
    if (!config) return value
    
    // Se não precisa ajuste FX, retorna como está
    if (!config.needsFXAdjustment) return value
    
    
    // Se a moeda da variação é igual à moeda de exibição, não ajusta
    if (config.variationCurrency === displayCurrency) return value
    
    // Ajustar com efeito cambial
    const originalCurrency = config.variationCurrency === 'USD' ? 'USD' : 'BRL'
    return adjustReturnWithFX(value / 100, competence, originalCurrency) * 100
  }, [displayCurrency, adjustReturnWithFX])

  // Converter dados com base na moeda selecionada usando configuração centralizada
  const convertedData = useMemo(() => {
    return consolidatedData.map(item => {
      const competence = item.competence
      const converted = { ...item }

      // Converter valores raw usando configuração centralizada
      converted.sp500Raw = convertRawValue(converted.sp500Raw, 'sp500', competence)
      converted.goldRaw = convertRawValue(converted.goldRaw, 'gold', competence)
      converted.btcRaw = convertRawValue(converted.btcRaw, 'btc', competence)
      converted.ptaxRaw = convertRawValue(converted.ptaxRaw, 'ptax', competence)
      converted.ibovRaw = convertRawValue(converted.ibovRaw, 'ibov', competence)
      converted.ihfaRaw = convertRawValue(converted.ihfaRaw, 'ihfa', competence)
      converted.irfmRaw = convertRawValue(converted.irfmRaw, 'irfm', competence)
      converted.imabRaw = convertRawValue(converted.imabRaw, 'imab', competence)
      converted.usCpiRaw = convertRawValue(converted.usCpiRaw, 'usCpi', competence)
      converted.euroCpiRaw = convertRawValue(converted.euroCpiRaw, 'euroCpi', competence)
      converted.agggRaw = convertRawValue(converted.agggRaw, 'aggg', competence)
      converted.msciAcwiRaw = convertRawValue(converted.msciAcwiRaw, 'msciAcwi', competence)
      converted.ifixRaw = convertRawValue(converted.ifixRaw, 'ifix', competence)

      // Ajustar porcentagens usando configuração centralizada
      converted.sp500Monthly = adjustVariation(converted.sp500Monthly, 'sp500', competence)
      converted.goldMonthly = adjustVariation(converted.goldMonthly, 'gold', competence)
      converted.btcMonthly = adjustVariation(converted.btcMonthly, 'btc', competence)
      converted.ptax = adjustVariation(converted.ptax, 'ptax', competence)
      converted.ibovMonthly = adjustVariation(converted.ibovMonthly, 'ibov', competence)
      converted.ihfaMonthly = adjustVariation(converted.ihfaMonthly, 'ihfa', competence)
      converted.irfmMonthly = adjustVariation(converted.irfmMonthly, 'irfm', competence)
      converted.imabMonthly = adjustVariation(converted.imabMonthly, 'imab', competence)
      converted.usCpiMonthly = adjustVariation(converted.usCpiMonthly, 'usCpi', competence)
      converted.euroCpiMonthly = adjustVariation(converted.euroCpiMonthly, 'euroCpi', competence)
      converted.tBondMonthly = adjustVariation(converted.tBondMonthly, 'tBond', competence)
      converted.agggMonthly = adjustVariation(converted.agggMonthly, 'aggg', competence)
      converted.msciAcwiMonthly = adjustVariation(converted.msciAcwiMonthly, 'msciAcwi', competence)
      converted.ifixMonthly = adjustVariation(converted.ifixMonthly, 'ifix', competence)

      return converted
    })
  }, [consolidatedData, convertRawValue, adjustVariation])

  // Filtrar dados por ano
  const filteredData = useMemo(() => {
    let filtered = convertedData

    if (filterStartYear) {
      const startYear = Number(filterStartYear)
      filtered = filtered.filter(item => {
        const [, year] = item.competence.split('/').map(Number)
        return year >= startYear
      })
    }

    if (filterEndYear) {
      const endYear = Number(filterEndYear)
      filtered = filtered.filter(item => {
        const [, year] = item.competence.split('/').map(Number)
        return year <= endYear
      })
    }

    return filtered
  }, [convertedData, filterStartYear, filterEndYear])

  // Dados paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Estatísticas
  const stats = useMemo(() => {
    return {
      ptax: convertedData.filter(d => d.ptax !== null).length,
      cdi: convertedData.filter(d => d.cdiMonthly !== null).length,
      ipca: convertedData.filter(d => d.ipcaMonthly !== null).length,
      ibov: convertedData.filter(d => d.ibovMonthly !== null).length,
      sp500: convertedData.filter(d => d.sp500Monthly !== null).length,
      tBond: convertedData.filter(d => d.tBondMonthly !== null).length,
      gold: convertedData.filter(d => d.goldMonthly !== null).length,
      btc: convertedData.filter(d => d.btcMonthly !== null).length,
      usCpi: convertedData.filter(d => d.usCpiMonthly !== null).length,
      euroCpi: convertedData.filter(d => d.euroCpiMonthly !== null).length,
      ihfa: convertedData.filter(d => d.ihfaMonthly !== null).length,
      irfm: convertedData.filter(d => d.irfmMonthly !== null).length,
      imab: convertedData.filter(d => d.imabMonthly !== null).length,
      aggg: convertedData.filter(d => d.agggMonthly !== null).length,
      msciAcwi: convertedData.filter(d => d.msciAcwiMonthly !== null).length,
      ifix: convertedData.filter(d => d.ifixMonthly !== null).length
    }
  }, [convertedData])

  // Lista de anos disponíveis para filtro
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    convertedData.forEach(d => {
      const [, year] = d.competence.split('/').map(Number)
      years.add(year)
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [convertedData])

  const formatPercentage = (value: number | null): string => {
    if (value === null) return '-'
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  const formatCurrency = (value: number | null): string => {
    if (value === null) return '-'
    // Usar formatCurrencyContext mas com 4 decimais para PTAX
    if (displayCurrency === 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }).format(value)
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }).format(value)
    }
  }

  const formatCurrencyUSD = (value: number | null): string => {
    if (value === null) return '-'
    // Usar formatCurrencyContext mas com 2 decimais para valores USD
    return formatCurrencyContext(value)
  }

  const formatNumber = (value: number | null, decimals: number = 2): string => {
    if (value === null) return '-'
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)
  }

  // Formata valor raw com variação
  const formatWithVariation = (
    rawValue: number | null,
    variation: number | null,
    formatRaw: (v: number | null) => string = formatNumber
  ): string => {
    if (rawValue === null && variation === null) return '-'
    if (rawValue === null) return formatPercentage(variation)
    if (variation === null) return formatRaw(rawValue)
    
    const rawFormatted = formatRaw(rawValue)
    const variationFormatted = formatPercentage(variation)
    return `${rawFormatted} (${variationFormatted})`
  }

  // Formata moeda BRL com variação
  const formatCurrencyWithVariation = (
    rawValue: number | null,
    variation: number | null
  ): string => {
    return formatWithVariation(rawValue, variation, formatCurrency)
  }

  // Formata moeda USD com variação
  const formatCurrencyUSDWithVariation = (
    rawValue: number | null,
    variation: number | null
  ): string => {
    return formatWithVariation(rawValue, variation, formatCurrencyUSD)
  }

  // Formata PTAX sempre em BRL (não converte)
  const formatPTAX = (value: number | null): string => {
    if (value === null) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(value)
  }

  // Formata PTAX com variação sempre em BRL
  const formatPTAXWithVariation = (
    rawValue: number | null,
    variation: number | null
  ): string => {
    return formatWithVariation(rawValue, variation, formatPTAX)
  }

  const columnLabels: Record<ColumnKey, string> = {
    competence: t('portfolioPerformance.marketDataAudit.competence'),
    ptax: t('portfolioPerformance.marketDataAudit.ptaxRate'),
    cdiMonthly: t('portfolioPerformance.marketDataAudit.cdiMonthly'),
    cdiAccumulated: t('portfolioPerformance.marketDataAudit.cdiAccumulated'),
    ipcaMonthly: t('portfolioPerformance.marketDataAudit.ipcaMonthly'),
    ipcaAccumulated: t('portfolioPerformance.marketDataAudit.ipcaAccumulated'),
    ibovMonthly: t('portfolioPerformance.marketDataAudit.ibovMonthly'),
    sp500Monthly: t('portfolioPerformance.marketDataAudit.sp500Monthly'),
    tBondMonthly: t('portfolioPerformance.marketDataAudit.tBondMonthly'),
    goldMonthly: t('portfolioPerformance.marketDataAudit.goldMonthly'),
    btcMonthly: t('portfolioPerformance.marketDataAudit.btcMonthly'),
    usCpiMonthly: t('portfolioPerformance.marketDataAudit.usCpiMonthly'),
    euroCpiMonthly: t('portfolioPerformance.marketDataAudit.euroCpiMonthly'),
    ihfaMonthly: t('portfolioPerformance.marketDataAudit.ihfaMonthly'),
    irfmMonthly: t('portfolioPerformance.marketDataAudit.irfmMonthly'),
    imabMonthly: t('portfolioPerformance.marketDataAudit.imabMonthly'),
    agggMonthly: t('portfolioPerformance.marketDataAudit.agggMonthly'),
    msciAcwiMonthly: t('portfolioPerformance.marketDataAudit.msciAcwiMonthly'),
    ifixMonthly: t('portfolioPerformance.marketDataAudit.ifixMonthly')
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('portfolioPerformance.marketDataAudit.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('portfolioPerformance.marketDataAudit.title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('portfolioPerformance.marketDataAudit.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CurrencyToggle />
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('portfolioPerformance.marketDataAudit.ptax')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ptax}</div>
            <p className="text-xs text-muted-foreground">{t('portfolioPerformance.marketDataAudit.competencesLoaded')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('portfolioPerformance.marketDataAudit.cdi')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cdi}</div>
            <p className="text-xs text-muted-foreground">{t('portfolioPerformance.marketDataAudit.competencesLoaded')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('portfolioPerformance.marketDataAudit.ipca')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ipca}</div>
            <p className="text-xs text-muted-foreground">{t('portfolioPerformance.marketDataAudit.competencesLoaded')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('portfolioPerformance.marketDataAudit.ibov')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ibov}</div>
            <p className="text-xs text-muted-foreground">{t('portfolioPerformance.marketDataAudit.competencesLoaded')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('portfolioPerformance.marketDataAudit.marketIndicators')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.sp500 + stats.tBond + stats.gold + stats.btc + stats.usCpi + stats.euroCpi + stats.ihfa + stats.irfm + stats.imab + stats.aggg + stats.msciAcwi + stats.ifix}
            </div>
            <p className="text-xs text-muted-foreground">{t('portfolioPerformance.marketDataAudit.competencesLoaded')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Controles */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('portfolioPerformance.marketDataAudit.filters')}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
              >
                <Settings2 className="h-4 w-4 mr-2" />
                {t('portfolioPerformance.marketDataAudit.selectColumns')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>{t('portfolioPerformance.marketDataAudit.filterStartYear')}</Label>
              <Select 
                value={filterStartYear || '__all__'} 
                onValueChange={(v) => setFilterStartYear(v === '__all__' ? '' : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('portfolioPerformance.marketDataAudit.allYears')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t('portfolioPerformance.marketDataAudit.allYears')}</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('portfolioPerformance.marketDataAudit.filterEndYear')}</Label>
              <Select 
                value={filterEndYear || '__all__'} 
                onValueChange={(v) => setFilterEndYear(v === '__all__' ? '' : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('portfolioPerformance.marketDataAudit.allYears')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t('portfolioPerformance.marketDataAudit.allYears')}</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('portfolioPerformance.marketDataAudit.itemsPerPage')}</Label>
              <Select value={itemsPerPage.toString()} onValueChange={(v) => {
                setItemsPerPage(Number(v))
                setCurrentPage(1)
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterStartYear('')
                  setFilterEndYear('')
                  setCurrentPage(1)
                }}
              >
                {t('portfolioPerformance.marketDataAudit.clearFilters')}
              </Button>
            </div>
          </div>

          {/* Seletor de Colunas */}
          {showColumnSelector && (
            <div className="border-t pt-4 mt-4">
              <Label className="mb-3 block">{t('portfolioPerformance.marketDataAudit.visibleColumns')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(columnLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={visibleColumns[key as ColumnKey]}
                      onCheckedChange={(checked) => {
                        setVisibleColumns(prev => ({
                          ...prev,
                          [key]: checked as boolean
                        }))
                      }}
                    />
                    <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Dados Consolidados */}
      <Card>
        <CardHeader>
          <CardTitle>{t('portfolioPerformance.marketDataAudit.consolidatedTableTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.competence && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.competence')}</TableHead>
                  )}
                  {visibleColumns.ptax && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.ptaxRate')}</TableHead>
                  )}
                  {visibleColumns.cdiMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.cdiMonthly')}</TableHead>
                  )}
                  {visibleColumns.cdiAccumulated && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.cdiAccumulated')}</TableHead>
                  )}
                  {visibleColumns.ipcaMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.ipcaMonthly')}</TableHead>
                  )}
                  {visibleColumns.ipcaAccumulated && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.ipcaAccumulated')}</TableHead>
                  )}
                  {visibleColumns.ibovMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.ibovMonthly')}</TableHead>
                  )}
                  {visibleColumns.sp500Monthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.sp500Monthly')}</TableHead>
                  )}
                  {visibleColumns.tBondMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.tBondMonthly')}</TableHead>
                  )}
                  {visibleColumns.goldMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.goldMonthly')}</TableHead>
                  )}
                  {visibleColumns.btcMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.btcMonthly')}</TableHead>
                  )}
                  {visibleColumns.usCpiMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.usCpiMonthly')}</TableHead>
                  )}
                  {visibleColumns.euroCpiMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.euroCpiMonthly')}</TableHead>
                  )}
                  {visibleColumns.ihfaMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.ihfaMonthly')}</TableHead>
                  )}
                  {visibleColumns.irfmMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.irfmMonthly')}</TableHead>
                  )}
                  {visibleColumns.imabMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.imabMonthly')}</TableHead>
                  )}
                  {visibleColumns.agggMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.agggMonthly')}</TableHead>
                  )}
                  {visibleColumns.msciAcwiMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.msciAcwiMonthly')}</TableHead>
                  )}
                  {visibleColumns.ifixMonthly && (
                    <TableHead>{t('portfolioPerformance.marketDataAudit.ifixMonthly')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center">
                      {t('portfolioPerformance.marketDataAudit.loading')}
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center">
                      {t('portfolioPerformance.marketDataAudit.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => (
                    <TableRow key={row.competence}>
                      {visibleColumns.competence && (
                        <TableCell className="font-medium">{row.competence}</TableCell>
                      )}
                      {visibleColumns.ptax && (
                        <TableCell className={row.ptax !== null && row.ptax >= 0 ? 'text-green-600' : row.ptax !== null ? 'text-red-600' : ''}>
                          {formatPTAXWithVariation(row.ptaxRaw, row.ptax)}
                        </TableCell>
                      )}
                      {visibleColumns.cdiMonthly && (
                        <TableCell className={row.cdiMonthly !== null && row.cdiMonthly >= 0 ? 'text-green-600' : row.cdiMonthly !== null ? 'text-red-600' : ''}>
                          {formatPercentage(row.cdiMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.cdiAccumulated && (
                        <TableCell className={row.cdiAccumulated !== null && row.cdiAccumulated >= 0 ? 'text-green-600' : row.cdiAccumulated !== null ? 'text-red-600' : ''}>
                          {formatPercentage(row.cdiAccumulated)}
                        </TableCell>
                      )}
                      {visibleColumns.ipcaMonthly && (
                        <TableCell className={row.ipcaMonthly !== null && row.ipcaMonthly >= 0 ? 'text-green-600' : row.ipcaMonthly !== null ? 'text-red-600' : ''}>
                          {formatPercentage(row.ipcaMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.ipcaAccumulated && (
                        <TableCell className={row.ipcaAccumulated !== null && row.ipcaAccumulated >= 0 ? 'text-green-600' : row.ipcaAccumulated !== null ? 'text-red-600' : ''}>
                          {formatPercentage(row.ipcaAccumulated)}
                        </TableCell>
                      )}
                      {visibleColumns.ibovMonthly && (
                        <TableCell className={row.ibovMonthly !== null && row.ibovMonthly >= 0 ? 'text-green-600' : row.ibovMonthly !== null ? 'text-red-600' : ''}>
                          {formatWithVariation(row.ibovRaw, row.ibovMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.sp500Monthly && (
                        <TableCell className={row.sp500Monthly !== null && row.sp500Monthly >= 0 ? 'text-green-600' : row.sp500Monthly !== null ? 'text-red-600' : ''}>
                          {formatCurrencyUSDWithVariation(row.sp500Raw, row.sp500Monthly)}
                        </TableCell>
                      )}
                      {visibleColumns.tBondMonthly && (
                        <TableCell className={row.tBondMonthly !== null && row.tBondMonthly >= 0 ? 'text-green-600' : row.tBondMonthly !== null ? 'text-red-600' : ''}>
                          {formatPercentage(row.tBondMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.goldMonthly && (
                        <TableCell className={row.goldMonthly !== null && row.goldMonthly >= 0 ? 'text-green-600' : row.goldMonthly !== null ? 'text-red-600' : ''}>
                          {formatCurrencyUSDWithVariation(row.goldRaw, row.goldMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.btcMonthly && (
                        <TableCell className={row.btcMonthly !== null && row.btcMonthly >= 0 ? 'text-green-600' : row.btcMonthly !== null ? 'text-red-600' : ''}>
                          {formatCurrencyUSDWithVariation(row.btcRaw, row.btcMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.usCpiMonthly && (
                        <TableCell className={row.usCpiMonthly !== null && row.usCpiMonthly >= 0 ? 'text-green-600' : row.usCpiMonthly !== null ? 'text-red-600' : ''}>
                          {formatWithVariation(row.usCpiRaw, row.usCpiMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.euroCpiMonthly && (
                        <TableCell className={row.euroCpiMonthly !== null && row.euroCpiMonthly >= 0 ? 'text-green-600' : row.euroCpiMonthly !== null ? 'text-red-600' : ''}>
                          {formatWithVariation(row.euroCpiRaw, row.euroCpiMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.ihfaMonthly && (
                        <TableCell className={row.ihfaMonthly !== null && row.ihfaMonthly >= 0 ? 'text-green-600' : row.ihfaMonthly !== null ? 'text-red-600' : ''}>
                          {formatWithVariation(row.ihfaRaw, row.ihfaMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.irfmMonthly && (
                        <TableCell className={row.irfmMonthly !== null && row.irfmMonthly >= 0 ? 'text-green-600' : row.irfmMonthly !== null ? 'text-red-600' : ''}>
                          {formatWithVariation(row.irfmRaw, row.irfmMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.imabMonthly && (
                        <TableCell className={row.imabMonthly !== null && row.imabMonthly >= 0 ? 'text-green-600' : row.imabMonthly !== null ? 'text-red-600' : ''}>
                          {formatWithVariation(row.imabRaw, row.imabMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.agggMonthly && (
                        <TableCell className={row.agggMonthly !== null && row.agggMonthly >= 0 ? 'text-green-600' : row.agggMonthly !== null ? 'text-red-600' : ''}>
                          {formatCurrencyUSDWithVariation(row.agggRaw, row.agggMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.msciAcwiMonthly && (
                        <TableCell className={row.msciAcwiMonthly !== null && row.msciAcwiMonthly >= 0 ? 'text-green-600' : row.msciAcwiMonthly !== null ? 'text-red-600' : ''}>
                          {formatCurrencyUSDWithVariation(row.msciAcwiRaw, row.msciAcwiMonthly)}
                        </TableCell>
                      )}
                      {visibleColumns.ifixMonthly && (
                        <TableCell className={row.ifixMonthly !== null && row.ifixMonthly >= 0 ? 'text-green-600' : row.ifixMonthly !== null ? 'text-red-600' : ''}>
                          {formatWithVariation(row.ifixRaw, row.ifixMonthly)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {t('portfolioPerformance.marketDataAudit.showingItems', {
                  from: (currentPage - 1) * itemsPerPage + 1,
                  to: Math.min(currentPage * itemsPerPage, filteredData.length),
                  total: filteredData.length
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  {t('portfolioPerformance.marketDataAudit.previous')}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t('portfolioPerformance.marketDataAudit.page')} {currentPage} {t('portfolioPerformance.marketDataAudit.of')} {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t('portfolioPerformance.marketDataAudit.next')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

