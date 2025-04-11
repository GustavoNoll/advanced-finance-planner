import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoalForm } from "@/components/financial-goals/GoalForm";
import { EventForm } from "@/components/events/EventForm";
import { useTranslation } from "react-i18next";

interface ChartPoint {
  age: string;
  year: number;
  month: number;
  actualValue: number;
  projectedValue: number;
  realDataPoint: boolean;
}

interface GoalFormValues {
  icon: string;
  asset_value: string;
  goal_month: string;
  goal_year: string;
  installment_project: boolean;
  installment_count?: string;
}

interface EventFormValues {
  name: string;
  amount: string;
  month: string;
  year: string;
}

interface ChartPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPoint: ChartPoint | null;
  dialogType: 'goal' | 'event' | null;
  onDialogTypeChange: (type: 'goal' | 'event' | null) => void;
  onSubmitGoal: (values: GoalFormValues) => void;
  onSubmitEvent: (values: EventFormValues) => void;
  onCancel: () => void;
}

export const ChartPointDialog = ({
  open,
  onOpenChange,
  selectedPoint,
  dialogType,
  onDialogTypeChange,
  onSubmitGoal,
  onSubmitEvent,
  onCancel,
}: ChartPointDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) {
        onDialogTypeChange(null);
      }
    }}>
      <DialogContent className="bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {t("common.addNew")} {dialogType === 'goal' ? t("financialGoals.title") : t("events.title")}
          </DialogTitle>
        </DialogHeader>
        
        {selectedPoint ? (
          <>
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                {t("expenseChart.selectedDate")}: {new Date(selectedPoint.year, selectedPoint.month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            {dialogType === 'goal' ? (
              <GoalForm
                onSubmit={onSubmitGoal}
                onCancel={onCancel}
                initialValues={{
                  goal_month: selectedPoint.month.toString().padStart(2, '0'),
                  goal_year: selectedPoint.year.toString(),
                }}
              />
            ) : dialogType === 'event' ? (
              <EventForm
                onSubmit={onSubmitEvent}
                onCancel={onCancel}
                initialValues={{
                  month: selectedPoint.month.toString().padStart(2, '0'),
                  year: selectedPoint.year.toString(),
                }}
              />
            ) : (
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => onDialogTypeChange('goal')}
                  className="w-full"
                >
                  {t("expenseChart.addNewGoal")}
                </Button>
                <Button
                  onClick={() => onDialogTypeChange('event')}
                  className="w-full"
                >
                  {t("expenseChart.addNewEvent")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">
            {t("expenseChart.clickToAdd")}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}; 