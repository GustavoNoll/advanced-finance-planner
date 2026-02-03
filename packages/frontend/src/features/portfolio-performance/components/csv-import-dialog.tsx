import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useTranslation } from "react-i18next"
import { Upload, FileText } from "lucide-react"
import Papa from "papaparse"
import { PerformanceImportService, ConsolidatedCSVRow, DetailedCSVRow } from "@/features/portfolio-performance/services/performance-import.service"

interface CSVImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileId: string
  onImportComplete: () => void
  importType: 'consolidated' | 'detailed'
}

export function CSVImportDialog({
  open,
  onOpenChange,
  profileId,
  onImportComplete,
  importType
}: CSVImportDialogProps) {
  const { t, i18n } = useTranslation()
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: Array<{ row: number; reason: string }> } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isPT = i18n.language === 'pt-BR'

  const consolidatedHeadersPT = ['Nome', 'Instituicao', 'Data', 'Competencia', 'Patrimonio Inicial', 'Movimentacao', 'Impostos', 'Patrimonio Final', 'Ganho Financeiro', 'Rendimento', 'Moeda', 'Conta Adicional']
  const consolidatedHeadersEN = ['Name', 'Institution', 'Date', 'Period', 'Initial Assets', 'Movement', 'Taxes', 'Final Assets', 'Financial Gain', 'Yield', 'Currency', 'Additional Account']

  const detailedHeadersPT = ['Nome', 'Instituicao', 'Data', 'Ativo', 'Posicao', 'Classe do ativo', 'Taxa', 'Vencimento', 'Emissor', 'Competencia', 'Rendimento', 'Moeda', 'Conta Adicional']
  const detailedHeadersEN = ['Name', 'Institution', 'Date', 'Asset', 'Position', 'Asset Class', 'Rate', 'Maturity', 'Issuer', 'Period', 'Yield', 'Currency', 'Additional Account']

  const headers = importType === 'consolidated' 
    ? (isPT ? consolidatedHeadersPT : consolidatedHeadersEN)
    : (isPT ? detailedHeadersPT : detailedHeadersEN)

  const exampleConsolidatedPT = [
    ['ANTONIO AUGUSTO MOREIRA MARCELLINI', 'Smart', '30/10/2025', '09/2025', 'R$6.952.610,94', 'R$0,00', 'R$144.403,86', 'R$7.036.692,09', 'R$85.038,26', '1,24%', '', '']
  ]

  const exampleConsolidatedEN = [
    ['John Doe', 'Bank', '10/30/2025', '09/2025', '$6952610.94', '$0.00', '$144403.86', '$7036692.09', '$85038.26', '1.24%', '', '']
  ]

  const exampleDetailedPT = [
    ['ANTONIO AUGUSTO MOREIRA MARCELLINI', 'Smart', '30/10/2025', 'ABSOLUTE PACE LB ADV FC FIA', 'R$ 64.632,25', 'Ações - Long Biased', '100% CDI', '02/01/2030', 'BANCO SANTANDER', '09/2025', '4,98%', '', ''],
    ['ANTONIO AUGUSTO MOREIRA MARCELLINI', 'Smart', '30/10/2025', 'IVVB11', 'R$ 48.775,60', 'Exterior - Ações', '', '', '', '09/2025', '1,51%', '', '']
  ]

  const exampleDetailedEN = [
    ['John Doe', 'Bank', '10/30/2025', 'FUND XYZ', '$64632.25', 'Stocks - Long Biased', '100% CDI', '01/02/2030', 'BANK NAME', '09/2025', '4.98%', '', ''],
    ['John Doe', 'Bank', '10/30/2025', 'IVVB11', '$48775.60', 'Foreign - Stocks', '', '', '', '09/2025', '1.51%', '', '']
  ]

  const examples = importType === 'consolidated'
    ? (isPT ? exampleConsolidatedPT : exampleConsolidatedEN)
    : (isPT ? exampleDetailedPT : exampleDetailedEN)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportResult(null)

    try {
      if (importType === 'consolidated') {
        const rows = await PerformanceImportService.parseConsolidatedCSV(file)
        const result = await PerformanceImportService.importConsolidated(rows, profileId)
        setImportResult(result)
        if (result.failed === 0) {
          setTimeout(() => {
            onImportComplete()
            onOpenChange(false)
            setImportResult(null)
          }, 2000)
        }
      } else {
        const rows = await PerformanceImportService.parseDetailedCSV(file)
        const result = await PerformanceImportService.importDetailed(rows, profileId)
        setImportResult(result)
        if (result.failed === 0) {
          setTimeout(() => {
            onImportComplete()
            onOpenChange(false)
            setImportResult(null)
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Import error:', error)
      setImportResult({
        success: 0,
        failed: 0,
        errors: [{ row: 0, reason: error instanceof Error ? error.message : 'Unknown error' }]
      })
    } finally {
      setIsImporting(false)
      // Reset input
      event.target.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('portfolioPerformance.importCSV.title')}</DialogTitle>
          <DialogDescription>
            {importType === 'consolidated' 
              ? t('portfolioPerformance.importCSV.consolidatedDescription')
              : t('portfolioPerformance.importCSV.detailedDescription')
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="format">
              <FileText className="h-4 w-4 mr-2" />
              {t('portfolioPerformance.importCSV.expectedFormat')}
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              {t('portfolioPerformance.importCSV.importFile')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t('portfolioPerformance.importCSV.requiredColumns')}</h4>
              <div className="flex flex-wrap gap-2">
                {headers.map((header, idx) => (
                  <span key={idx} className="px-2 py-1 bg-background rounded text-sm font-mono">
                    {header}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">{t('portfolioPerformance.importCSV.exampleData')}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-muted">
                      {headers.map((header, idx) => (
                        <th key={idx} className="border border-gray-300 px-2 py-1 text-left font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {examples.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="border border-gray-300 px-2 py-1">
                            {cell || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                {t('portfolioPerformance.importCSV.notes.title')}
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>{t('portfolioPerformance.importCSV.notes.dateFormat')}</li>
                <li>{t('portfolioPerformance.importCSV.notes.periodFormat')}</li>
                <li>{t('portfolioPerformance.importCSV.notes.currencyFormat')}</li>
                <li>{t('portfolioPerformance.importCSV.notes.percentageFormat')}</li>
                <li>{t('portfolioPerformance.importCSV.notes.duplicates')}</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isImporting}
                  className="hidden"
                />
                <Button 
                  disabled={isImporting} 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isImporting 
                    ? t('portfolioPerformance.importCSV.importing')
                    : t('portfolioPerformance.importCSV.selectFile')
                  }
                </Button>
                <p className="text-sm text-gray-500">
                  {t('portfolioPerformance.importCSV.fileHint')}
                </p>
              </div>
            </div>

            {importResult && (
              <div className={`p-4 rounded-lg ${
                importResult.failed === 0 
                  ? 'bg-green-50 dark:bg-green-950' 
                  : 'bg-yellow-50 dark:bg-yellow-950'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  importResult.failed === 0
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-yellow-900 dark:text-yellow-100'
                }`}>
                  {importResult.failed === 0
                    ? t('portfolioPerformance.importCSV.successTitle')
                    : t('portfolioPerformance.importCSV.partialSuccessTitle')
                  }
                </h4>
                <p className={`text-sm ${
                  importResult.failed === 0
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {importResult.failed === 0
                    ? t('portfolioPerformance.importCSV.successMessage', {
                        success: importResult.success
                      })
                    : t('portfolioPerformance.importCSV.partialSuccessMessage', {
                        success: importResult.success,
                        failed: importResult.failed
                      })
                  }
                </p>
                {importResult.errors.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {importResult.errors.slice(0, 10).map((error, idx) => (
                      <p key={idx} className="text-xs text-red-600 dark:text-red-400">
                        {t('portfolioPerformance.importCSV.errorRow', {
                          row: error.row,
                          reason: error.reason
                        })}
                      </p>
                    ))}
                    {importResult.errors.length > 10 && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {t('portfolioPerformance.importCSV.moreErrors', {
                          count: importResult.errors.length - 10
                        })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
