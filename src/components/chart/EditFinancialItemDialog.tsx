import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FinancialItemForm } from "./FinancialItemForm";
import { FinancialItemFormValues } from "@/types/financial";
import { CurrencyCode } from "@/utils/currency";
import { Goal, ProjectedEvent } from "@/types/financial";

interface EditFinancialItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Goal | ProjectedEvent | null;
  currency: CurrencyCode;
  onSubmit: (values: FinancialItemFormValues) => Promise<void>;
}

export const EditFinancialItemDialog = ({
  open,
  onOpenChange,
  item,
  currency,
  onSubmit,
}: EditFinancialItemDialogProps) => {
  if (!item) return null;

  const initialValues: FinancialItemFormValues = {
    name: item.name,
    icon: item.icon,
    type: item.type,
    asset_value: item.asset_value.toString(),
    month: item.month.toString(),
    year: item.year.toString(),
    payment_mode: item.payment_mode,
    installment_count: item.installment_count?.toString() || '',
    installment_interval: item.installment_interval?.toString() || '1',
  };

  console.log('initialValues', initialValues);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues.type === 'goal' ? 'Edit Financial Goal' : 'Edit Event'}
          </DialogTitle>
        </DialogHeader>
        <FinancialItemForm
          type={initialValues.type}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          initialValues={initialValues}
          currency={currency}
          showTypeSelector={false}
        />
      </DialogContent>
    </Dialog>
  );
}; 