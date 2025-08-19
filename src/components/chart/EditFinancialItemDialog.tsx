import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FinancialItemForm } from "./FinancialItemForm";
import { FinancialItemFormValues } from "@/types/financial";
import { CurrencyCode } from "@/utils/currency";
import { Goal, ProjectedEvent } from "@/types/financial";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EditFinancialItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Goal | ProjectedEvent | null;
  currency: CurrencyCode;
  onSubmit: (values: FinancialItemFormValues) => Promise<void>;
  onDelete?: () => void;
}

export const EditFinancialItemDialog = ({
  open,
  onOpenChange,
  item,
  currency,
  onSubmit,
  onDelete,
}: EditFinancialItemDialogProps) => {
  const { t } = useTranslation();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues.type === 'goal' ? t('financialGoals.editGoal') : t('events.editEvent')}
          </DialogTitle>
        </DialogHeader>
        <FinancialItemForm
          type={initialValues.type}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          initialValues={initialValues}
          currency={currency}
          showTypeSelector={false}
          leftActions={onDelete ? (
            <Button
              type="button"
              variant="destructive"
              className="h-9"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              {t('common.delete')}
            </Button>
          ) : null}
        />
        {onDelete && (
          <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
            <DialogContent className="max-w-xs">
              <DialogHeader>
                <DialogTitle>{t('common.confirmDeleteTitle')}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-700 mb-4">{t('common.confirmDeleteMessage')} </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button variant="destructive" onClick={() => { setConfirmDeleteOpen(false); onDelete() }}>
                  {t('common.delete')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}; 