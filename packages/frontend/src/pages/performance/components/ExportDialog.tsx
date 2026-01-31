import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Filter as FilterIcon, BarChart3 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast"
import { exportToCSV, type ExportType, type DataType } from "../utils/import-export"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: DataType
  profileId: string
  filteredData: ConsolidatedPerformance[] | PerformanceData[]
  allData: ConsolidatedPerformance[] | PerformanceData[]
}

export function ExportDialog({ 
  open, 
  onOpenChange, 
  type, 
  profileId, 
  filteredData, 
  allData 
}: ExportDialogProps) {
  const { t } = useTranslation()
  const { toast } = useToast()

  const handleExport = (exportType: ExportType) => {
    try {
      const dataToExport = exportType === 'filtered' ? filteredData : allData
      exportToCSV(dataToExport, type, exportType, profileId)
      toast({
        title: t('portfolioPerformance.dataManagement.export.success') || 'Exportação concluída',
        description: `${dataToExport.length} ${t('portfolioPerformance.dataManagement.export.recordsExported') || 'registro(s) exportado(s) com sucesso.'}`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao exportar CSV:', error)
      toast({
        title: t('portfolioPerformance.dataManagement.export.error') || 'Erro ao exportar',
        description: error instanceof Error ? error.message : t('portfolioPerformance.dataManagement.export.errorDescription') || 'Ocorreu um erro ao exportar os dados.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('portfolioPerformance.dataManagement.export.title') || 'Exportar Dados para CSV'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            {t('portfolioPerformance.dataManagement.export.description') || 'Escolha qual conjunto de dados você deseja exportar:'}
          </p>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4 px-4"
              onClick={() => handleExport('filtered')}
            >
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center gap-2 font-medium">
                  <FilterIcon className="h-4 w-4" />
                  {t('portfolioPerformance.dataManagement.export.filtered') || 'Exportar dados filtrados'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {filteredData.length} {t('portfolioPerformance.dataManagement.export.recordsWithFilters') || 'registro(s) com os filtros atuais aplicados'}
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4 px-4"
              onClick={() => handleExport('all')}
            >
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center gap-2 font-medium">
                  <BarChart3 className="h-4 w-4" />
                  {t('portfolioPerformance.dataManagement.export.all') || 'Exportar todos os dados'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {allData.length} {t('portfolioPerformance.dataManagement.export.recordsWithoutFilters') || 'registro(s) sem aplicar filtros'}
                </div>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

