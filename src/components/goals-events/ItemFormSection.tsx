import { Card } from "@/components/ui/card"
import { FinancialItemForm } from '@/components/chart/FinancialItemForm'
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
}

export function ItemFormSection({
  showForm,
  type,
  currency,
  isSubmitting,
  editingItem,
  onSubmit,
  onCancel
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
      />
    </Card>
  )
}
