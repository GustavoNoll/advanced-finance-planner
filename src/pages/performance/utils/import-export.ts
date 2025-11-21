import { PerformanceImportService } from "@/services/performance-import.service"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"

export type ImportResult = {
  success: number
  failed: number
  errors: Array<{ row: number; reason: string }>
}

export type ExportType = 'filtered' | 'all'
export type DataType = 'consolidated' | 'detailed'

export interface AcceptedInstitution {
  name: string
  defaultCurrency: 'BRL' | 'USD' | 'EUR'
}

/**
 * List of accepted institutions with their default currencies
 */
export const ACCEPTED_INSTITUTIONS: AcceptedInstitution[] = [
  { name: 'Avenue', defaultCurrency: 'USD' },
  { name: 'B3', defaultCurrency: 'BRL' },
  { name: 'BB', defaultCurrency: 'BRL' },
  { name: 'Bradesco', defaultCurrency: 'BRL' },
  { name: 'BTG', defaultCurrency: 'BRL' },
  { name: 'C6', defaultCurrency: 'BRL' },
  { name: 'Fidelity', defaultCurrency: 'USD' },
  { name: 'IB', defaultCurrency: 'USD' },
  { name: 'Itau', defaultCurrency: 'BRL' },
  { name: 'Santander', defaultCurrency: 'BRL' },
  { name: 'Smart', defaultCurrency: 'BRL' },
  { name: 'Warren', defaultCurrency: 'BRL' },
  { name: 'XP', defaultCurrency: 'BRL' }
]

export interface PDFImportParams {
  client_id: string
  types: string[]
  institution: string
  currency: 'BRL' | 'USD' | 'EUR'
  period: string // MM/YYYY format
  account_name: string
}

/**
 * Downloads a CSV template for the specified data type
 */
export function downloadCSVTemplate(type: DataType): void {
  try {
    let headers: string[] = []
    let exampleRows: string[][] = []

    if (type === 'consolidated') {
      headers = [
        'Period', 'Institution', 'Currency', 'Account Name',
        'Initial Assets', 'Movement', 'Taxes', 'Financial Gain',
        'Final Assets', 'Yield'
      ]
      exampleRows = [
        ['09/2025', 'XP Investimentos', 'BRL', 'Conta 12345', '500000.00', '10000.00', '500.00', '5000.00', '514500.00', '1.00'],
        ['09/2025', 'BTG Pactual', 'BRL', 'Conta 67890', '100000.00', '0.00', '100.00', '1500.00', '101400.00', '1.50']
      ]
    } else {
      headers = [
        'Period', 'Institution', 'Currency', 'Account Name',
        'Asset', 'Issuer', 'Asset Class', 'Position',
        'Rate', 'Maturity', 'Yield'
      ]
      exampleRows = [
        ['09/2025', 'XP Investimentos', 'BRL', 'Conta 12345', 'CDB', 'Banco Exemplo', 'CDI - Titulos', '50000.00', '110% CDI', '2026-01-15', '1.00'],
        ['09/2025', 'Corretora XYZ', 'BRL', 'Conta 67890', 'LCI', 'Banco ABC', 'Inflação - Titulos', '100000.00', 'IPCA + 5.5%', '2027-03-20', '1.20']
      ]
    }

    const csvRows = [
      headers.join(','),
      ...exampleRows.map(row => 
        row.map(value => {
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',')
      )
    ]

    const csvContent = csvRows.join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    const fileName = `template_importacao_${type}_${new Date().toISOString().split('T')[0]}.csv`
    
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Erro ao gerar template:', error)
    throw error
  }
}

/**
 * Handles CSV import for consolidated or detailed data
 */
export async function handleCSVImport(
  file: File,
  type: DataType,
  profileId: string
): Promise<ImportResult> {
  try {
    if (type === 'consolidated') {
      const rows = await PerformanceImportService.parseConsolidatedCSV(file)
      return await PerformanceImportService.importConsolidated(rows, profileId)
    } else {
      const rows = await PerformanceImportService.parseDetailedCSV(file)
      return await PerformanceImportService.importDetailed(rows, profileId)
    }
  } catch (error) {
    console.error('Import error:', error)
    return {
      success: 0,
      failed: 0,
      errors: [{ row: 0, reason: error instanceof Error ? error.message : 'Unknown error' }]
    }
  }
}

/**
 * Handles PDF import to n8n webhook
 */
export async function handlePDFImport(
  file: File,
  params: PDFImportParams
): Promise<void> {
  if (!file.name.endsWith('.pdf')) {
    throw new Error('Invalid file type. Please select a PDF file.')
  }

  const n8nUrl = import.meta.env.VITE_N8N_PDF_IMPORT_URL
  
  if (!n8nUrl) {
    throw new Error(
      'VITE_N8N_PDF_IMPORT_URL environment variable is not set. ' +
      'Please configure it in your Vercel project settings and redeploy.'
    )
  }
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('client_id', params.client_id)
  formData.append('types', JSON.stringify(params.types))
  formData.append('institution', params.institution)
  formData.append('currency', params.currency)
  formData.append('period', params.period)
  formData.append('account_name', params.account_name)

  const response = await fetch(n8nUrl, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  await response.json()
}

/**
 * Exports data to CSV file
 */
export function exportToCSV(
  data: ConsolidatedPerformance[] | PerformanceData[],
  type: DataType,
  exportType: ExportType,
  profileId: string
): void {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  let headers: string[] = []
  let rows: string[][] = []

  if (type === 'consolidated') {
    headers = [
      'Period', 'Institution', 'Currency', 'Account Name',
      'Initial Assets', 'Movement', 'Taxes', 'Financial Gain',
      'Final Assets', 'Yield'
    ]
    rows = (data as ConsolidatedPerformance[]).map(item => [
      item.period || '',
      item.institution || '',
      item.currency || '',
      item.account_name || '',
      String(item.initial_assets || 0),
      String(item.movement || 0),
      String(item.taxes || 0),
      String(item.financial_gain || 0),
      String(item.final_assets || 0),
      String((item.yield || 0) * 100)
    ])
  } else {
    headers = [
      'Period', 'Institution', 'Currency', 'Account Name',
      'Asset', 'Issuer', 'Asset Class', 'Position',
      'Rate', 'Maturity', 'Yield'
    ]
    rows = (data as PerformanceData[]).map(item => [
      item.period || '',
      item.institution || '',
      item.currency || '',
      item.account_name || '',
      item.asset || '',
      item.issuer || '',
      item.asset_class || '',
      String(item.position || 0),
      item.rate || '',
      item.maturity_date || '',
      String((item.yield || 0) * 100)
    ])
  }

  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      row.map(value => {
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ]

  const csvContent = csvRows.join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  const fileName = exportType === 'filtered' 
    ? `${type}_filtrado_${profileId}_${new Date().toISOString().split('T')[0]}.csv`
    : `${type}_completo_${profileId}_${new Date().toISOString().split('T')[0]}.csv`
  
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

