import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, CheckCircle, CircleDot } from "lucide-react";
import { useTranslation } from "react-i18next";
import { goalIcons } from "@/constants/goals";
import { Goal } from "@/types/financial";
import { formatCurrency, CurrencyCode, getCurrencySymbol } from "@/utils/currency";

export const GoalCard = ({ goal, currency, onDelete, onEdit, onToggleStatus }: { 
  goal: Goal; 
  currency: CurrencyCode;
  onDelete: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
}) => {
  const { t } = useTranslation();
  const Icon = goalIcons[goal.icon];
  
  const renderPaymentInfo = () => {
    if (goal.payment_mode === 'none') {
      return null;
    }

    if (goal.payment_mode === 'installment' && goal.installment_count) {
      return (
        <span className="text-sm text-gray-500 ml-2">
          ({goal.installment_count}x de {formatCurrency(Math.abs(goal.asset_value) / goal.installment_count, currency)}
          {goal.installment_interval && goal.installment_interval > 1 && (
            <span> {t('common.every')} {goal.installment_interval} {t('common.months')}</span>
          )}
          )
        </span>
      );
    }

    if (goal.payment_mode === 'repeat' && goal.installment_count) {
      return (
        <span className="text-sm text-gray-500 ml-2">
          ({goal.installment_count}x de {formatCurrency(Math.abs(goal.asset_value), currency)}
          {goal.installment_interval && goal.installment_interval > 1 && (
            <span> {t('common.every')} {goal.installment_interval} {t('common.months')}</span>
          )}
          )
        </span>
      );
    }

    return null;
  };
  
  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-200 border-red-100 ${goal.status === 'completed' ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="bg-red-50 p-3 rounded-xl">
            <Icon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-lg">{goal.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(goal.year, goal.month - 1)
                .toLocaleDateString(navigator.language, { month: 'long', year: 'numeric' })
                .replace(/^\w/, (c) => c.toUpperCase())}
            </p>
            <p className="text-red-600 font-medium">
              {formatCurrency(Math.abs(goal.asset_value), currency)}
              {renderPaymentInfo()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleStatus}
            className={`hover:bg-green-50 hover:text-green-500 transition-colors ${goal.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`}
          >
            {goal.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEdit}
            className="hover:bg-blue-50 hover:text-blue-500 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}; 