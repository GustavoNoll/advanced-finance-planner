import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Upload, RefreshCcw, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Papa from 'papaparse'
import { CSVRecord } from "@/services/financial-records-management.service"

interface ActionButtonsProps {
  isBroker: boolean
  showAddForm: boolean
  onToggleAddForm: () => void
  onReset: () => void
  onSyncIPCA: () => void
  onImportRecords: (records: CSVRecord[]) => void
  t: (key: string) => string
}

export function ActionButtons({
  isBroker,
  showAddForm,
  onToggleAddForm,
  onReset,
  onSyncIPCA,
  onImportRecords,
  t
}: ActionButtonsProps) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const records = results.data
          .map((row: Record<string, string>) => {
            if (Object.keys(row).length >= 6) {
              const record: CSVRecord = {
                Data: row.Data,
                PatrimonioInicial: row.PatrimonioInicial,
                Aporte: row.Aporte,
                PatrimonioFinal: row.PatrimonioFinal,
                RetornoPercentual: row.RetornoPercentual,
                RentabilidadeMeta: row.RentabilidadeMeta,
                Retorno: row.Retorno,
                Eventos: row.Eventos
              }
              return record
            }
            return null
          })
          .filter((record): record is CSVRecord => record !== null)

        if (records.length > 0) {
          onImportRecords(records)
          setIsImportDialogOpen(false)
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
      }
    })
  }

  if (!isBroker) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <Button 
        variant="ghost"
        onClick={onToggleAddForm}
        className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-card hover:bg-muted shadow-sm hover:shadow transition-all duration-200 border border-border"
      >
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-foreground">{t('financialRecords.addNew')}</span>
        </div>
      </Button>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost"
            className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-card hover:bg-muted shadow-sm hover:shadow transition-all duration-200 border border-border"
          >
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-foreground">{t('financialRecords.importButton')}</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1000px] bg-card">
          <DialogHeader>
            <DialogTitle>{t('financialRecords.importTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t('financialRecords.importInstructions')}</p>
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted">
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-foreground border-b border-border">Data</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-foreground border-b border-border">PatrimonioInicial</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-foreground border-b border-border">Aporte</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-foreground border-b border-border">PatrimonioFinal</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-foreground border-b border-border">Retorno</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-foreground border-b border-border">RetornoPercentual</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-foreground border-b border-border">RentabilidadeMeta</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-foreground border-b border-border">Eventos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">01/08/2023</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">R$ 51.447,92</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">R$ 4.000,00</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">R$ 55.992,62</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">R$ 1.000,00</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">1,19%</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">0,64%</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">R$ 500,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="w-full"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Button 
        variant="ghost"
        onClick={onReset}
        className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-card hover:bg-muted shadow-sm hover:shadow transition-all duration-200 border border-border"
      >
        <div className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium text-foreground">{t('financialRecords.resetRecords')}</span>
        </div>
      </Button>

      <Button 
        variant="ghost"
        onClick={onSyncIPCA}
        className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-card hover:bg-muted shadow-sm hover:shadow transition-all duration-200 border border-border"
      >
        <div className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-foreground">{t('financialRecords.syncIPCA')}</span>
        </div>
      </Button>
    </div>
  )
}
