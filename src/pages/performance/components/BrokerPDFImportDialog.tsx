import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast"
import { handlePDFImport, ACCEPTED_INSTITUTIONS, type PDFImportParams } from "../utils/import-export"
import type { UserProfileInvestment } from "@/types/broker-dashboard"
import { ClientSelect } from "./ClientSelect"

interface BrokerPDFImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: UserProfileInvestment[]
}

interface FormErrors {
  files?: string
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

export function BrokerPDFImportDialog({ open, onOpenChange, clients }: BrokerPDFImportDialogProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isImporting, setIsImporting] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<PDFImportParams & { cliente: string }>({
    cliente: '',
    client_id: '',
    types: ['Performance'],
    institution: '',
    currency: 'BRL',
    period: '',
    account_name: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const pdfFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!clients?.length) return
    if (formData.cliente) return
    const defaultClient = clients[0]
    setFormData(prev => ({
      ...prev,
      cliente: defaultClient.id,
      client_id: defaultClient.id
    }))
    if (errors.cliente) {
      setErrors(prev => ({ ...prev, cliente: undefined }))
    }
  }, [clients, formData.cliente, errors.cliente])

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!pdfFile) {
      newErrors.files = t('portfolioPerformance.dataManagement.importPDF.formErrors.filesRequired') || 'Este campo é obrigatório'
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
        account_name: formData.account_name
      })
      toast({
        title: t('portfolioPerformance.dataManagement.import.pdfSuccess') || 'PDF enviado com sucesso',
        description: t('portfolioPerformance.dataManagement.import.pdfSuccessDescription') || 'O PDF foi enviado para processamento. Os dados serão importados em breve.',
      })
      setTimeout(() => {
        onOpenChange(false)
        setIsImporting(false)
        setPdfFile(null)
        setFormData({
          cliente: '',
          client_id: '',
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
        ref={pdfFileInputRef}
        type="file"
        accept=".pdf"
        onChange={handlePDFFileSelect}
        className="hidden"
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t('portfolioPerformance.dataManagement.importPDF.brokerDialogTitle') || 'Importar PDF de Performance'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                  disabled={isImporting}
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
                disabled
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
                options={ACCEPTED_INSTITUTIONS.map(inst => ({
                  id: inst.name,
                  label: inst.name
                }))}
                value={formData.institution}
                onValueChange={handleInstitutionChange}
                placeholder={t('portfolioPerformance.dataManagement.importPDF.formPlaceholders.institution') || 'Selecione a instituição'}
                searchPlaceholder={t('portfolioPerformance.dataManagement.importPDF.searchInstitution') || 'Buscar instituição...'}
                emptyMessage={t('portfolioPerformance.dataManagement.importPDF.noInstitutionFound') || 'Nenhuma instituição encontrada.'}
                error={!!errors.institution}
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
                  onOpenChange(false)
                  setPdfFile(null)
                  setFormData({
                    cliente: '',
                    client_id: '',
                    types: ['Performance'],
                    institution: '',
                    currency: 'BRL',
                    period: '',
                    account_name: ''
                  })
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
        </DialogContent>
      </Dialog>
    </>
  )
}

