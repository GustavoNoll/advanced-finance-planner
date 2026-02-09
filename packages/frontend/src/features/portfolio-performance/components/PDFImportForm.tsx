import { useState, useRef, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast"
import { handlePDFImport, type PDFImportParams } from "@/features/portfolio-performance/pages/utils/import-export"
import { usePdfImportInstitutions } from "@/hooks/usePdfImportInstitutions"
import type { UserProfileInvestment } from "@/types/broker-dashboard"
import { ClientSelect } from "@/features/portfolio-performance/pages/components/ClientSelect"

interface PDFImportFormProps {
  clients: UserProfileInvestment[]
  selectedClientId?: string
  onSuccess?: () => void
  onCancel?: () => void
  showCancelButton?: boolean
  defaultPeriod?: string
  disabled?: boolean
}

interface FormErrors {
  files?: string
  additionalFile?: string
  cliente?: string
  institution?: string
  currency?: string
  period?: string
  account_name?: string
}

function formatPeriodInput(value: string) {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 6)
  if (digitsOnly.length <= 2) return digitsOnly
  const month = digitsOnly.slice(0, 2)
  const year = digitsOnly.slice(2)
  return `${month}/${year}`
}

export function PDFImportForm({ 
  clients, 
  selectedClientId,
  onSuccess,
  onCancel,
  showCancelButton = true,
  defaultPeriod,
  disabled = false
}: PDFImportFormProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { data: institutions = [], isLoading: isLoadingInstitutions } = usePdfImportInstitutions()
  const [isImporting, setIsImporting] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [additionalFile, setAdditionalFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<PDFImportParams & { cliente: string }>({
    cliente: selectedClientId || '',
    client_id: selectedClientId || '',
    types: ['Performance'],
    institution: '',
    currency: 'BRL',
    period: defaultPeriod || '',
    account_name: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const pdfFileInputRef = useRef<HTMLInputElement>(null)
  const additionalFileInputRef = useRef<HTMLInputElement>(null)
  
  // Check if selected institution requires additional file
  const selectedInstitution = institutions.find(inst => inst.name === formData.institution)
  const requiresAdditionalFile = selectedInstitution?.requires_additional_file || false
  
  // Auto-disable when there's only one client
  const isClientLocked = clients?.length === 1 || !!selectedClientId

  // Initialize form when selectedClientId changes
  useEffect(() => {
    if (selectedClientId) {
      setFormData(prev => ({
        ...prev,
        cliente: selectedClientId,
        client_id: selectedClientId
      }))
    }
  }, [selectedClientId])

  // Set default period if provided
  useEffect(() => {
    if (defaultPeriod && !formData.period) {
      setFormData(prev => ({ ...prev, period: defaultPeriod }))
    }
  }, [defaultPeriod, formData.period])

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
    if (event.target) {
      event.target.value = ''
    }
  }

  const handleAdditionalFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setAdditionalFile(file)
    if (errors.additionalFile) {
      setErrors(prev => ({ ...prev, additionalFile: undefined }))
    }
    if (event.target) {
      event.target.value = ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!pdfFile) {
      newErrors.files = t('portfolioPerformance.dataManagement.importPDF.formErrors.filesRequired') || 'Este campo é obrigatório'
    }

    // Validate additional file if required
    if (requiresAdditionalFile && !additionalFile) {
      newErrors.additionalFile = t('portfolioPerformance.dataManagement.importPDF.formErrors.additionalFileRequired') || 'Arquivo adicional é obrigatório para esta instituição'
    }

    if (!formData.cliente) {
      newErrors.cliente = t('portfolioPerformance.dataManagement.importPDF.formErrors.clientRequired') || 'Este campo é obrigatório'
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInstitutionChange = (institution: string) => {
    const selectedInstitution = institutions.find(inst => inst.name === institution)
    setFormData(prev => ({
      ...prev,
      institution,
      currency: selectedInstitution?.default_currency || 'BRL'
    }))
    // Clear additional file when institution changes if it no longer requires it
    if (!selectedInstitution?.requires_additional_file) {
      setAdditionalFile(null)
    }
    if (errors.institution) {
      setErrors(prev => ({ ...prev, institution: undefined }))
    }
    if (errors.additionalFile) {
      setErrors(prev => ({ ...prev, additionalFile: undefined }))
    }
  }

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({
      ...prev,
      cliente: clientId,
      client_id: clientId
    }))
    if (errors.cliente) {
      setErrors(prev => ({ ...prev, cliente: undefined }))
    }
  }

  const handleSubmitPDF = async () => {
    if (!validateForm() || !pdfFile) return

    setIsImporting(true)

    try {
      await handlePDFImport(pdfFile, {
        client_id: formData.client_id,
        types: formData.types,
        institution: formData.institution,
        currency: formData.currency,
        period: formData.period,
        account_name: formData.account_name,
        additional_file: additionalFile || undefined
      })
      toast({
        title: t('portfolioPerformance.dataManagement.import.pdfSuccess') || 'PDF enviado com sucesso',
        description: t('portfolioPerformance.dataManagement.import.pdfSuccessDescription') || 'O PDF foi enviado para processamento. Os dados serão importados em breve.',
      })
      
      // Reset form
      setPdfFile(null)
      setAdditionalFile(null)
      setFormData({
        cliente: selectedClientId || '',
        client_id: selectedClientId || '',
        types: ['Performance'],
        institution: '',
        currency: 'BRL',
        period: defaultPeriod || '',
        account_name: ''
      })
      setErrors({})
      
      setIsImporting(false)
      onSuccess?.()
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
        ref={pdfFileInputRef}
        type="file"
        accept=".pdf"
        onChange={handlePDFFileSelect}
        className="hidden"
      />
      <input
        ref={additionalFileInputRef}
        type="file"
        accept=".pdf,.xlsx,.xls,.csv"
        onChange={handleAdditionalFileSelect}
        className="hidden"
      />
      <div className="space-y-4">
        {/* File Selection */}
        <div className="space-y-2">
          <Label>
            {t('portfolioPerformance.dataManagement.importPDF.formLabels.file') || 'Arquivo PDF'}
          </Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => pdfFileInputRef.current?.click()}
              disabled={isImporting || disabled}
            >
              <FileText className="mr-2 h-4 w-4" />
              {pdfFile 
                ? pdfFile.name 
                : t('portfolioPerformance.dataManagement.importPDF.selectFile') || 'Selecionar arquivo PDF'}
            </Button>
          </div>
          {errors.files && (
            <p className="text-xs text-red-500">{errors.files}</p>
          )}
        </div>

        {/* Client Selection */}
        <div className="space-y-2">
          <Label htmlFor="cliente">
            {t('portfolioPerformance.dataManagement.importPDF.formLabels.client') || 'Cliente'}
          </Label>
          <ClientSelect
            clients={clients}
            value={formData.cliente}
            onValueChange={handleClientChange}
            placeholder={t('portfolioPerformance.dataManagement.importPDF.formPlaceholders.client') || 'Selecione o cliente'}
            error={!!errors.cliente}
            disabled={isClientLocked || disabled}
          />
          {errors.cliente && (
            <p className="text-xs text-red-500">{errors.cliente}</p>
          )}
        </div>

        {/* Institution */}
        <div className="space-y-2">
          <Label htmlFor="institution">
            {t('portfolioPerformance.dataManagement.importPDF.formLabels.institution') || 'Instituição'}
          </Label>
          <ClientSelect
            options={institutions.map(inst => ({
              id: inst.name,
              label: inst.name
            }))}
            value={formData.institution}
            onValueChange={handleInstitutionChange}
            placeholder={isLoadingInstitutions 
              ? (t('common.loading') || 'Carregando...')
              : (t('portfolioPerformance.dataManagement.importPDF.formPlaceholders.institution') || 'Selecione a instituição')}
            searchPlaceholder={t('portfolioPerformance.dataManagement.importPDF.searchInstitution') || 'Buscar instituição...'}
            emptyMessage={t('portfolioPerformance.dataManagement.importPDF.noInstitutionFound') || 'Nenhuma instituição encontrada.'}
            error={!!errors.institution}
            disabled={isLoadingInstitutions || disabled}
          />
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
            disabled={disabled}
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
              const formattedPeriod = formatPeriodInput(e.target.value)
              setFormData(prev => ({ ...prev, period: formattedPeriod }))
              if (errors.period) {
                setErrors(prev => ({ ...prev, period: undefined }))
              }
            }}
            className={errors.period ? 'border-red-500' : ''}
            disabled={disabled}
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
            disabled={disabled}
          />
          {errors.account_name && (
            <p className="text-xs text-red-500">{errors.account_name}</p>
          )}
        </div>

        {/* Additional File - Only shown when institution requires it */}
        {requiresAdditionalFile && (
          <div className="space-y-2">
            <Label>
              {t('portfolioPerformance.dataManagement.importPDF.formLabels.additionalFile') || 'Arquivo Adicional'}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => additionalFileInputRef.current?.click()}
                disabled={isImporting || disabled}
              >
                <FileText className="mr-2 h-4 w-4" />
                {additionalFile 
                  ? additionalFile.name 
                  : (t('portfolioPerformance.dataManagement.importPDF.selectAdditionalFile') || 'Selecionar arquivo adicional')}
              </Button>
            </div>
            {errors.additionalFile && (
              <p className="text-xs text-red-500">{errors.additionalFile}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {t('portfolioPerformance.dataManagement.importPDF.additionalFileDescription') || 'Esta instituição requer um arquivo adicional para processamento.'}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {showCancelButton && onCancel && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isImporting || disabled}
            >
              {t('portfolioPerformance.dataManagement.cancel') || 'Cancelar'}
            </Button>
          )}
          <Button
            variant="default"
            className={showCancelButton ? "flex-1" : "w-full"}
            onClick={handleSubmitPDF}
            disabled={isImporting || disabled}
          >
            {isImporting 
              ? t('portfolioPerformance.dataManagement.import.uploadingPDF') || 'Enviando PDF...'
              : t('portfolioPerformance.dataManagement.importPDF.submitButton') || 'Enviar PDF'}
          </Button>
        </div>
      </div>
    </>
  )
}

