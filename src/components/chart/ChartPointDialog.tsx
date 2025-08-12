import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { CurrencyCode } from "@/utils/currency";
import { FinancialItemForm } from "./FinancialItemForm";
import { GoalFormValues, EventFormValues, FinancialItemFormValues } from "@/types/financial";

interface ChartPoint {
  age: string;
  year: number;
  month: number;
  actualValue: number;
  projectedValue: number;
  realDataPoint: boolean;
}

interface ChartPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPoint: ChartPoint | null;
  currency: CurrencyCode;
  onSubmitGoal: (values: GoalFormValues) => Promise<void>;
  onSubmitEvent: (values: EventFormValues) => Promise<void>;
  onCancel: () => void;
  type: 'goal' | 'event';
}

export const ChartPointDialog = ({
  open,
  onOpenChange,
  selectedPoint,
  currency,
  onSubmitGoal,
  onSubmitEvent,
  onCancel,
  type
}: ChartPointDialogProps) => {
  const { t } = useTranslation();
  const [formType, setFormType] = useState<'goal' | 'event'>(type);
  const { formatDate } = useLocale();

  const handleSubmit = async (values: FinancialItemFormValues) => {
    try {
      if (values.type === 'goal') {
        await onSubmitGoal(values);
      } else {
        await onSubmitEvent(values);
      }
      onOpenChange(false);
    } catch (e) {
      // error handled by parent toast
    }
  };

  const handleCancel = () => {
    onCancel();
    setFormType('goal');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {formType === 'goal' ? t('financialGoals.addNew') : formType === 'event' ? t('events.addNew') : t('other.addNew')}
          </DialogTitle>
        </DialogHeader>
        
        {selectedPoint ? (
          <>
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/80 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("expenseChart.selectedDate")}: {formatDate(new Date(selectedPoint.year, selectedPoint.month - 1))}
              </p>
            </div>
            
            <FinancialItemForm
              type={formType}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialValues={{
                name: '',
                icon: '',
                asset_value: '',
                month: selectedPoint.month.toString().padStart(2, '0'),
                year: selectedPoint.year.toString(),
                type: formType,
                payment_mode: 'none',
                installment_count: '',
              }}
              currency={currency}
              onTypeChange={setFormType}
              isSubmitting={false}
            />
          </>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            {t("expenseChart.clickToAdd")}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}; 