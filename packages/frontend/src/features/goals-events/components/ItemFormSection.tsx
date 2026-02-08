import { Card } from "@/shared/components/ui/card"
import { FinancialItemForm } from '@/shared/components/chart/FinancialItemForm'
import { CurrencyCode } from "@/utils/currency"
import { FinancialItemFormValues, Goal, ProjectedEvent } from "@/types/financial"

interface ItemFormSectionProps {
  showForm: boolean
  type: 'goal' | 'event'
  currency: CurrencyCode
  isSubmitting: boolean
  editingItem: Goal | ProjectedEvent | null
  onSubmit: (values: FinancialItemFormValues) => void
  onCancel: () => void
  planInitialDate?: string
  limitAge?: number
  birthDate?: string
}

export function ItemFormSection({
  showForm,
  type,
  currency,
  isSubmitting,
  editingItem,
  onSubmit,
  onCancel,
  planInitialDate,
  limitAge,
  birthDate
}: ItemFormSectionProps) {
  if (!showForm && !editingItem) return null

  const initialValues = editingItem ? {
    name: editingItem.name,
    icon: editingItem.icon,
    asset_value: editingItem.asset_value.toString(),
    month: editingItem.month.toString(),
    year: editingItem.year.toString(),
    payment_mode: editingItem.payment_mode,
    installment_count: editingItem.installment_count?.toString() || '',
    installment_interval: editingItem.installment_interval?.toString() || '1',
    adjust_for_inflation: editingItem.adjust_for_inflation ?? true,
  } : undefined

  return (
    <Card className="p-4 bg-card shadow-sm border border-border">
      <FinancialItemForm
        type={type}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        currency={currency}
        showTypeSelector={false}
        initialValues={initialValues}
        isEditing={!!editingItem}
        planInitialDate={planInitialDate || new Date().toISOString().split('T')[0]}
        limitAge={limitAge}
        birthDate={birthDate}
      />
    </Card>
  )
}
