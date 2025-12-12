import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranslation } from "react-i18next"
import type { UserProfileInvestment } from "@/types/broker-dashboard"
import { PDFImportForm } from "@/components/performance/PDFImportForm"

interface BrokerPDFImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: UserProfileInvestment[]
  selectedClientId?: string
}

export function BrokerPDFImportDialog({ open, onOpenChange, clients, selectedClientId }: BrokerPDFImportDialogProps) {
  const { t } = useTranslation()
  
  const handleSuccess = () => {
    setTimeout(() => {
      onOpenChange(false)
    }, 2000)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t('portfolioPerformance.dataManagement.importPDF.brokerDialogTitle') || 'Importar PDF de Performance'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <PDFImportForm
            clients={clients}
            selectedClientId={selectedClientId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            showCancelButton={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

