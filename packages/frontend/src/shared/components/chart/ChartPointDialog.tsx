// 1. Imports externos
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// 2. Imports internos (shared)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { CurrencyCode } from '@/utils/currency'
import { useLocale } from '@/hooks/useLocale'

// 3. Imports internos (feature)
import { FinancialItemForm } from './FinancialItemForm'
import { GoalFormValues, EventFormValues, FinancialItemFormValues } from '@/types/financial'

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
  planInitialDate?: string;
  limitAge?: number;
  birthDate?: string;
}

export function ChartPointDialog({
  open,
  onOpenChange,
  selectedPoint,
  currency,
  onSubmitGoal,
  onSubmitEvent,
  onCancel,
  type,
  planInitialDate,
  limitAge,
  birthDate
}: ChartPointDialogProps) {
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
                month: selectedPoint.month.toString(),
                year: selectedPoint.year.toString(),
                type: formType,
                payment_mode: 'none',
                installment_count: '',
              }}
              currency={currency}
              onTypeChange={setFormType}
              isSubmitting={false}
              planInitialDate={planInitialDate || new Date().toISOString().split('T')[0]}
              limitAge={limitAge}
              birthDate={birthDate}
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