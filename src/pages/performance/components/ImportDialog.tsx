import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowUp, FileText, Info } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast"
import { downloadCSVTemplate, handleCSVImport, handlePDFImport, type ImportResult, type DataType, ACCEPTED_INSTITUTIONS, type PDFImportParams } from "../utils/import-export"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: DataType
  profileId: string
  onImportSuccess: () => void
}

interface FormErrors {
  files?: string
  institution?: string
  currency?: string
  period?: string
  account_name?: string
}

export function ImportDialog({ open, onOpenChange, type, profileId, onImportSuccess }: ImportDialogProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [showPDFForm, setShowPDFForm] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<PDFImportParams>({
    client_id: profileId,
    types: ['Performance'],
    institution: '',
    currency: 'BRL',
    period: '',
    account_name: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const csvFileInputRef = useRef<HTMLInputElement>(null)
  const pdfFileInputRef = useRef<HTMLInputElement>(null)

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

  const handlePDFFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.pdf')) {
      toast({
        title: t('portfolioPerformance.dataManagement.import.invalidFile') || 'Arquivo inválido',
        description: t('portfolioPerformance.dataManagement.import.invalidFileDescription') || 'Por favor, selecione um arquivo PDF.',
        variant: 'destructive'
      })
      if (event.target) {
        event.target.value = ''
      }
      return
    }

    setPdfFile(file)
    setShowPDFForm(true)
    if (event.target) {
      event.target.value = ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!pdfFile) {
      newErrors.files = t('portfolioPerformance.dataManagement.importPDF.formErrors.filesRequired') || 'Este campo é obrigatório'
    }

    if (!formData.institution) {
      newErrors.institution = t('portfolioPerformance.dataManagement.importPDF.formErrors.institutionRequired') || 'Este campo é obrigatório'
    }

    if (!formData.currency) {
      newErrors.currency = t('portfolioPerformance.dataManagement.importPDF.formErrors.currencyRequired') || 'Este campo é obrigatório'
    }

    if (!formData.period) {
      newErrors.period = t('portfolioPerformance.dataManagement.importPDF.formErrors.periodRequired') || 'Este campo é obrigatório'
    } else {
      // Validate MM/YYYY format
      const periodRegex = /^(0[1-9]|1[0-2])\/\d{4}$/
      if (!periodRegex.test(formData.period)) {
        newErrors.period = t('portfolioPerformance.dataManagement.importPDF.formErrors.periodInvalid') || 'Formato inválido. Use MM/YYYY'
      }
    }

    if (!formData.account_name) {
      newErrors.account_name = t('portfolioPerformance.dataManagement.importPDF.formErrors.accountNameRequired') || 'Este campo é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInstitutionChange = (institution: string) => {
    const selectedInstitution = ACCEPTED_INSTITUTIONS.find(inst => inst.name === institution)
    setFormData(prev => ({
      ...prev,
      institution,
      currency: selectedInstitution?.defaultCurrency || 'BRL'
    }))
    if (errors.institution) {
      setErrors(prev => ({ ...prev, institution: undefined }))
    }
  }

  const handleSubmitPDF = async () => {
    if (!validateForm() || !pdfFile) return

    setIsImporting(true)

    try {
      await handlePDFImport(pdfFile, formData)
      toast({
        title: t('portfolioPerformance.dataManagement.import.pdfSuccess') || 'PDF enviado com sucesso',
        description: t('portfolioPerformance.dataManagement.import.pdfSuccessDescription') || 'O PDF foi enviado para processamento. Os dados serão importados em breve.',
      })
      setTimeout(() => {
        onOpenChange(false)
        setIsImporting(false)
        setShowPDFForm(false)
        setPdfFile(null)
        setFormData({
          client_id: profileId,
          types: ['Performance'],
          institution: '',
          currency: 'BRL',
          period: '',
          account_name: ''
        })
        setErrors({})
      }, 2000)
    } catch (error) {
      console.error('PDF import error:', error)
      toast({
        title: t('portfolioPerformance.dataManagement.import.pdfError') || 'Erro ao enviar PDF',
        description: error instanceof Error ? error.message : t('portfolioPerformance.dataManagement.import.pdfErrorDescription') || 'Ocorreu um erro ao enviar o PDF.',
        variant: 'destructive'
      })
      setIsImporting(false)
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
      <input
        ref={pdfFileInputRef}
        type="file"
        accept=".pdf"
        onChange={handlePDFFileSelect}
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

              {/* Opção 3: Upload do PDF */}
              {!showPDFForm ? (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {t('portfolioPerformance.dataManagement.import.uploadPDF') || '3. Importar arquivo PDF'}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('portfolioPerformance.dataManagement.import.uploadPDFDescription') || 'Envie um PDF para processamento automático via n8n.'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className="w-full"
                    disabled={isImporting}
                    onClick={() => {
                      pdfFileInputRef.current?.click()
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {t('portfolioPerformance.dataManagement.import.selectPDF') || 'Selecionar arquivo PDF'}
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {t('portfolioPerformance.dataManagement.importPDF.formTitle') || 'Preencha os dados do PDF'}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pdfFile?.name || ''}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Institution */}
                    <div className="space-y-2">
                      <Label htmlFor="institution">
                        {t('portfolioPerformance.dataManagement.importPDF.formLabels.institution') || 'Instituição'}
                      </Label>
                      <Select
                        value={formData.institution}
                        onValueChange={handleInstitutionChange}
                      >
                        <SelectTrigger id="institution" className={errors.institution ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('portfolioPerformance.dataManagement.importPDF.formPlaceholders.institution') || 'Selecione a instituição'} />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCEPTED_INSTITUTIONS.map((inst) => (
                            <SelectItem key={inst.name} value={inst.name}>
                              {inst.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.institution && (
                        <p className="text-xs text-red-500">{errors.institution}</p>
                      )}
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                      <Label htmlFor="currency">
                        {t('portfolioPerformance.dataManagement.importPDF.formLabels.currency') || 'Moeda'}
                      </Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, currency: value as 'BRL' | 'USD' | 'EUR' }))
                          if (errors.currency) {
                            setErrors(prev => ({ ...prev, currency: undefined }))
                          }
                        }}
                      >
                        <SelectTrigger id="currency" className={errors.currency ? 'border-red-500' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRL">BRL</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.currency && (
                        <p className="text-xs text-red-500">{errors.currency}</p>
                      )}
                    </div>

                    {/* Period */}
                    <div className="space-y-2">
                      <Label htmlFor="period">
                        {t('portfolioPerformance.dataManagement.importPDF.formLabels.period') || 'Período (MM/YYYY)'}
                      </Label>
                      <Input
                        id="period"
                        placeholder="09/2025"
                        value={formData.period}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, period: e.target.value }))
                          if (errors.period) {
                            setErrors(prev => ({ ...prev, period: undefined }))
                          }
                        }}
                        className={errors.period ? 'border-red-500' : ''}
                      />
                      {errors.period && (
                        <p className="text-xs text-red-500">{errors.period}</p>
                      )}
                    </div>

                    {/* Account Name */}
                    <div className="space-y-2">
                      <Label htmlFor="account_name">
                        {t('portfolioPerformance.dataManagement.importPDF.formLabels.accountName') || 'Nome da Conta'}
                      </Label>
                      <Input
                        id="account_name"
                        placeholder={t('portfolioPerformance.dataManagement.importPDF.formPlaceholders.accountName') || 'Ex: Conta 12345'}
                        value={formData.account_name}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, account_name: e.target.value }))
                          if (errors.account_name) {
                            setErrors(prev => ({ ...prev, account_name: undefined }))
                          }
                        }}
                        className={errors.account_name ? 'border-red-500' : ''}
                      />
                      {errors.account_name && (
                        <p className="text-xs text-red-500">{errors.account_name}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowPDFForm(false)
                          setPdfFile(null)
                          setErrors({})
                        }}
                        disabled={isImporting}
                      >
                        {t('portfolioPerformance.dataManagement.cancel') || 'Cancelar'}
                      </Button>
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={handleSubmitPDF}
                        disabled={isImporting}
                      >
                        {isImporting 
                          ? t('portfolioPerformance.dataManagement.import.uploadingPDF') || 'Enviando PDF...'
                          : t('portfolioPerformance.dataManagement.importPDF.submitButton') || 'Enviar PDF'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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

