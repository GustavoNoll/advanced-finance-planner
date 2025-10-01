import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FinancialItemForm } from "./FinancialItemForm";
import { FinancialItemFormValues } from "@/types/financial";
import { CurrencyCode } from "@/utils/currency";
import { Goal, ProjectedEvent } from "@/types/financial";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface EditFinancialItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Goal | ProjectedEvent | null;
  currency: CurrencyCode;
  onSubmit: (values: FinancialItemFormValues) => Promise<void>;
  onDelete?: () => void;
  planInitialDate?: string;
  limitAge?: number;
  birthDate?: string;
}

export const EditFinancialItemDialog = ({
  open,
  onOpenChange,
  item,
  currency,
  onSubmit,
  onDelete,
  planInitialDate,
  limitAge,
  birthDate,
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
          planInitialDate={planInitialDate || new Date().toISOString().split('T')[0]}
          limitAge={limitAge}
          birthDate={birthDate}
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
          <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('common.confirmDeleteTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('common.confirmDeleteMessage')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmDeleteOpen(false)}>
                  {t('common.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => { 
                    setConfirmDeleteOpen(false); 
                    onDelete(); 
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t('common.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DialogContent>
    </Dialog>
  );
}; 