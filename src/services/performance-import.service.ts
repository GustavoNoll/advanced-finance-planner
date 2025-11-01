import Papa from 'papaparse'
import { supabase } from '@/lib/supabase'
import { PortfolioPerformanceService } from './portfolio-performance.service'

export interface ConsolidatedCSVRow {
  Nome?: string
  Name?: string
  Instituicao?: string
  Institution?: string
  Data?: string
  Date?: string
  Competencia?: string
  Period?: string
  'Patrimonio Inicial'?: string
  'Initial Assets'?: string
  Movimentacao?: string
  Movement?: string
  Impostos?: string
  Taxes?: string
  'Patrimonio Final'?: string
  'Final Assets'?: string
  'Ganho Financeiro'?: string
  'Financial Gain'?: string
  Rendimento?: string
  Yield?: string
  Moeda?: string
  Currency?: string
  'Conta Adicional'?: string
  'Additional Account'?: string
}

export interface DetailedCSVRow {
  Nome?: string
  Name?: string
  Instituicao?: string
  Institution?: string
  Data?: string
  Date?: string
  Ativo?: string
  Asset?: string
  Posicao?: string
  Position?: string
  'Classe do ativo'?: string
  'Asset Class'?: string
  Taxa?: string
  Rate?: string
  Vencimento?: string
  Maturity?: string
  Emissor?: string
  Issuer?: string
  Competencia?: string
  Period?: string
  Rendimento?: string
  Yield?: string
  Moeda?: string
  Currency?: string
  'Conta Adicional'?: string
  'Additional Account'?: string
}

interface ImportResult {
  success: number
  failed: number
  errors: Array<{ row: number; reason: string }>
}

function parseValue(value: string | undefined): number {
  if (!value) return 0
  // Remove currency symbols, spaces, and convert comma to dot
  const cleaned = value
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

function parsePercentage(value: string | undefined): number {
  if (!value) return 0
  // Remove % and convert comma to dot
  const cleaned = value.replace('%', '').replace(',', '.').trim()
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed / 100
}

function parseDate(value: string | undefined): string | null {
  if (!value) return null
  // Try to parse DD/MM/YYYY format
  const parts = value.split('/')
  if (parts.length === 3) {
    const [day, month, year] = parts
    // Return as ISO date string
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  return null
}

function parsePeriod(value: string | undefined): string | null {
  if (!value) return null
  // Expected format: MM/YYYY
  return value.trim()
}

export class PerformanceImportService {
  static parseConsolidatedCSV(file: File): Promise<ConsolidatedCSVRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as ConsolidatedCSVRow[])
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  static parseDetailedCSV(file: File): Promise<DetailedCSVRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as DetailedCSVRow[])
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  static async checkConsolidatedDuplicate(
    profileId: string,
    institution: string | null,
    period: string | null
  ): Promise<boolean> {
    return PortfolioPerformanceService.checkConsolidatedDuplicate(
      profileId,
      institution,
      period
    )
  }

  static async importConsolidated(
    rows: ConsolidatedCSVRow[],
    profileId: string
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    }

    // First, fetch existing records to check duplicates
    const existingRecords = await PortfolioPerformanceService.fetchExistingConsolidatedRecords(profileId)

    const existingSet = new Set(
      existingRecords.map(r => 
        `${r.profile_id}|${r.institution || ''}|${r.period || ''}`
      )
    )

    const records = rows.map((row, index) => {
      try {
        const period = row.Competencia || row.Period
        const institution = row.Instituicao || row.Institution
        const reportDate = parseDate(row.Data || row.Date)
        const initialAssets = parseValue(row['Patrimonio Inicial'] || row['Initial Assets'])
        const movement = parseValue(row.Movimentacao || row.Movement)
        const taxes = parseValue(row.Impostos || row.Taxes)
        const financialGain = parseValue(row['Ganho Financeiro'] || row['Financial Gain'])
        const finalAssets = parseValue(row['Patrimonio Final'] || row['Final Assets'])
        const yieldValue = parsePercentage(row.Rendimento || row.Yield)

        if (!period) {
          throw new Error('Period (Competencia) is required')
        }

        const parsedPeriod = parsePeriod(period)
        const recordKey = `${profileId}|${institution || ''}|${parsedPeriod || ''}`

        // Check for duplicate
        if (existingSet.has(recordKey)) {
          throw new Error('Duplicate record: Record with same Profile, Institution, and Period already exists')
        }

        return {
          profile_id: profileId,
          institution: institution || null,
          period: parsedPeriod,
          report_date: reportDate,
          initial_assets: initialAssets,
          movement: movement,
          taxes: taxes,
          financial_gain: financialGain,
          final_assets: finalAssets,
          yield: yieldValue
        }
      } catch (error) {
        result.failed++
        result.errors.push({
          row: index + 2, // +2 because index is 0-based and we skip header
          reason: error instanceof Error ? error.message : 'Unknown error'
        })
        return null
      }
    }).filter((r): r is NonNullable<typeof r> => r !== null)

    // Add new records to existing set to avoid duplicates within the same batch
    records.forEach(r => {
      const key = `${r.profile_id}|${r.institution || ''}|${r.period || ''}`
      existingSet.add(key)
    })

    if (records.length > 0) {
      await PortfolioPerformanceService.bulkInsertConsolidatedRecords(records)
      result.success = records.length
    }

    return result
  }

  static async checkDetailedDuplicate(
    profileId: string,
    institution: string | null,
    asset: string | null,
    position: number,
    period: string | null
  ): Promise<boolean> {
    return PortfolioPerformanceService.checkDetailedDuplicate(
      profileId,
      institution,
      asset,
      position,
      period
    )
  }

  static async importDetailed(
    rows: DetailedCSVRow[],
    profileId: string
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    }

    // First, fetch existing records to check duplicates
    const existingRecords = await PortfolioPerformanceService.fetchExistingDetailedRecords(profileId)

    const existingSet = new Set(
      existingRecords.map(r => 
        `${r.profile_id}|${r.institution || ''}|${r.asset || ''}|${r.position || 0}|${r.period || ''}`
      )
    )

    const records = rows.map((row, index) => {
      try {
        const period = row.Competencia || row.Period
        const institution = row.Instituicao || row.Institution
        const reportDate = parseDate(row.Data || row.Date)
        const asset = row.Ativo || row.Asset
        const position = parseValue(row.Posicao || row.Position)
        const assetClass = row['Classe do ativo'] || row['Asset Class']
        const rate = row.Taxa || row.Rate
        const maturityDate = parseDate(row.Vencimento || row.Maturity)
        const issuer = row.Emissor || row.Issuer
        const yieldValue = parsePercentage(row.Rendimento || row.Yield)

        if (!period) {
          throw new Error('Period (Competencia) is required')
        }

        if (!asset) {
          throw new Error('Asset (Ativo) is required')
        }

        const parsedPeriod = parsePeriod(period)
        const recordKey = `${profileId}|${institution || ''}|${asset || ''}|${position}|${parsedPeriod || ''}`

        // Check for duplicate
        if (existingSet.has(recordKey)) {
          throw new Error('Duplicate record: Record with same Profile, Institution, Asset, Position, and Period already exists')
        }

        return {
          profile_id: profileId,
          institution: institution || null,
          period: parsedPeriod,
          report_date: reportDate,
          asset: asset || null,
          position: position,
          asset_class: assetClass || null,
          rate: rate || null,
          maturity_date: maturityDate,
          issuer: issuer || null,
          yield: yieldValue
        }
      } catch (error) {
        result.failed++
        result.errors.push({
          row: index + 2,
          reason: error instanceof Error ? error.message : 'Unknown error'
        })
        return null
      }
    }).filter((r): r is NonNullable<typeof r> => r !== null)

    // Add new records to existing set to avoid duplicates within the same batch
    records.forEach(r => {
      const key = `${r.profile_id}|${r.institution || ''}|${r.asset || ''}|${r.position}|${r.period || ''}`
      existingSet.add(key)
    })

    if (records.length > 0) {
      await PortfolioPerformanceService.bulkInsertDetailedRecords(records)
      result.success = records.length
    }

    return result
  }
}
