import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { FinancialRecord, InvestmentPlan } from "@/types/financial"
import { CurrencyCode, formatCurrency } from "@/utils/currency"
import { AddRecordForm } from "@/components/financial-records/AddRecordForm"
import LinkedItemsDisplay from "./LinkedItemsDisplay"
import { useState } from "react"

interface RecordsListProps {
  records: FinancialRecord[]
  investmentPlan: InvestmentPlan | null
  isBroker: boolean
  editingRecordId: number | null
  onEdit: (recordId: number) => void
  onDelete: (recordId: string) => void
  clientId: string
  t: (key: string) => string
}

export function RecordsList({
  records,
  investmentPlan,
  isBroker,
  editingRecordId,
  onEdit,
  onDelete,
  clientId,
  t
}: RecordsListProps) {
  // Estado para forçar refresh dos links
  const [refreshKey, setRefreshKey] = useState(0);
  const formatMonth = (month: number) => {
    return t(`monthlyView.table.months.${new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' }).toLowerCase()}`)
  }

  const formatDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year}`
  }

  if (records.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">{t('financialRecords.noRecords')}</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {records.map((record) => (
        <Card 
          key={record.id} 
          className="p-6 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-4">
            <div>
              <h3 className="font-semibold text-lg">
                {formatMonth(record.record_month)} {record.record_year}
                <div className="text-sm text-muted-foreground">
                  {formatDate(record.record_month, record.record_year)}
                </div>
              </h3>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('financialRecords.startingBalance')}</p>
              <p className="font-semibold">{formatCurrency(record.starting_balance, investmentPlan?.currency as CurrencyCode)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('financialRecords.monthlyContribution')}</p>
              <div>
                <p className={`font-semibold ${
                  investmentPlan?.monthly_deposit && 
                  record.monthly_contribution >= investmentPlan.monthly_deposit 
                    ? 'text-green-600' 
                    : ''
                }`}>
                  {formatCurrency(record.monthly_contribution, investmentPlan?.currency as CurrencyCode)}
                </p>
                {investmentPlan?.monthly_deposit && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Meta: {formatCurrency(investmentPlan.monthly_deposit, investmentPlan?.currency as CurrencyCode)}
                  </p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('financialRecords.endingBalance')}</p>
              <p className="font-semibold">{formatCurrency(record.ending_balance, investmentPlan?.currency as CurrencyCode)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('financialRecords.growth')}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${record.monthly_return_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {record.monthly_return_rate != null ? record.monthly_return_rate.toFixed(2) : '--'}%
                  </p>
                  <span className="text-xs text-muted-foreground">
                    (meta: {record.target_rentability != null ? `${record.target_rentability.toFixed(2)}%` : '--'})
                  </span>
                </div>
                <p className={`text-xs ${record.monthly_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(record.monthly_return, investmentPlan?.currency as CurrencyCode )}
                </p>
              </div>
            </div>
            {isBroker && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(Number(record.id))}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(record.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <LinkedItemsDisplay 
            financialRecordId={Number(record.id)}
            currency={investmentPlan?.currency || 'BRL'}
            refreshKey={refreshKey}
          />
          
          {editingRecordId === Number(record.id) && (
            <AddRecordForm  
              clientId={clientId}
              onSuccess={() => onEdit(0)}
              editingRecord={record}
              investmentPlan={investmentPlan as InvestmentPlan}
              onLinksUpdated={() => {
                // Incrementar a chave de refresh para forçar atualização dos links
                console.log('Links atualizados, incrementando chave de refresh');
                setRefreshKey(prev => prev + 1);
              }}
            />
          )}
        </Card>
      ))}
    </div>
  )
}
