import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, FileText, Info } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast"
import { downloadCSVTemplate, handleCSVImport, type ImportResult, type DataType } from "../utils/import-export"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: DataType
  profileId: string
  onImportSuccess: () => void
  onOpenPdfDialog: () => void
}

export function ImportDialog({ open, onOpenChange, type, profileId, onImportSuccess, onOpenPdfDialog }: ImportDialogProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const csvFileInputRef = useRef<HTMLInputElement>(null)

  const handleDownloadTemplate = () => {
    try {
      downloadCSVTemplate(type)
      toast({
        title: t('portfolioPerformance.dataManagement.import.templateDownloaded') || 'Template baixado',
        description: t('portfolioPerformance.dataManagement.import.templateDownloadedDescription') || 'Arquivo exemplo baixado com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao gerar template:', error)
      toast({
        title: t('portfolioPerformance.dataManagement.import.templateError') || 'Erro ao gerar template',
        description: t('portfolioPerformance.dataManagement.import.templateErrorDescription') || 'Ocorreu um erro ao criar o arquivo exemplo.',
        variant: 'destructive'
      })
    }
  }

  const handleCSVFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const result = await handleCSVImport(file, type, profileId)
      setImportResult(result)
      if (result.failed === 0) {
        setTimeout(() => {
          onImportSuccess()
          onOpenChange(false)
          setImportResult(null)
        }, 2000)
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
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  return (
    <>
      <input
        ref={csvFileInputRef}
        type="file"
        accept=".csv"
        onChange={handleCSVFileSelect}
        className="hidden"
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {type === 'consolidated' 
                ? t('portfolioPerformance.dataManagement.import.consolidatedTitle') || 'Importar Dados Consolidados'
                : t('portfolioPerformance.dataManagement.import.detailedTitle') || 'Importar Dados Detalhados'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {t('portfolioPerformance.dataManagement.import.description') || 'Escolha uma das opções abaixo para importar seus dados:'}
            </p>
            
            <div className="space-y-3">
              {/* Opção 1: Download do Template CSV */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <ArrowDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {t('portfolioPerformance.dataManagement.import.downloadTemplate') || '1. Baixar arquivo exemplo'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('portfolioPerformance.dataManagement.import.downloadTemplateDescription') || 'Baixe um arquivo CSV exemplo com o formato correto das colunas.'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadTemplate}
                >
                  <ArrowDown className="mr-2 h-4 w-4" />
                  {t('portfolioPerformance.dataManagement.import.downloadTemplateButton') || 'Baixar Template CSV'}
                </Button>
              </div>

              {/* Opção 2: Upload do CSV */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {t('portfolioPerformance.dataManagement.import.uploadCSV') || '2. Importar seu arquivo CSV'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('portfolioPerformance.dataManagement.import.uploadCSVDescription') || 'Após preencher o arquivo, faça o upload do CSV para importar os dados.'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  className="w-full"
                  disabled={isImporting}
                  onClick={() => {
                    onOpenChange(false)
                    setTimeout(() => {
                      csvFileInputRef.current?.click()
                    }, 100)
                  }}
                >
                  <ArrowUp className="mr-2 h-4 w-4" />
                  {isImporting 
                    ? t('portfolioPerformance.dataManagement.import.importing') || 'Importando...'
                    : t('portfolioPerformance.dataManagement.import.selectCSV') || 'Selecionar arquivo CSV'}
                </Button>
              </div>

              {/* Opção 3: Importar extrato */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {t('portfolioPerformance.dataManagement.import.uploadPDF') || '3. Importar extrato'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('portfolioPerformance.dataManagement.import.uploadPDFDescription') || 'Envie um extrato para processamento automático.'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  className="w-full"
                  disabled={isImporting}
                  onClick={() => {
                    onOpenChange(false)
                    setTimeout(() => {
                      onOpenPdfDialog()
                    }, 150)
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t('portfolioPerformance.dataManagement.import.selectPDF') || 'Importar extrato'}
                </Button>
              </div>
            </div>

            {/* Informação adicional */}
            <div className="bg-muted/50 rounded-lg p-3 mt-4">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">
                    {t('portfolioPerformance.dataManagement.import.columnOrder') || 'Ordem das colunas:'}
                  </p>
                  <p className="text-[10px] leading-relaxed">
                    {type === 'consolidated'
                      ? t('portfolioPerformance.dataManagement.import.consolidatedColumnOrder') || 'Period → Institution → Currency → Account Name → Initial Assets → Movement → Taxes → Financial Gain → Final Assets → Yield'
                      : t('portfolioPerformance.dataManagement.import.detailedColumnOrder') || 'Period → Institution → Currency → Account Name → Asset → Issuer → Asset Class → Position → Rate → Maturity → Yield'}
                  </p>
                </div>
              </div>
            </div>

            {/* Import Result */}
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
                    ? t('portfolioPerformance.importCSV.successTitle') || 'Importação Bem-sucedida'
                    : t('portfolioPerformance.importCSV.partialSuccessTitle') || 'Importação Parcial'}
                </h4>
                <p className={`text-sm ${
                  importResult.failed === 0
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {importResult.failed === 0
                    ? t('portfolioPerformance.importCSV.successMessage', { success: importResult.success })
                    : t('portfolioPerformance.importCSV.partialSuccessMessage', {
                        success: importResult.success,
                        failed: importResult.failed
                      })}
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

