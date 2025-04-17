import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { goalIcons } from "@/constants/goals";
import { Goal } from "@/types/financial";
import { formatCurrency, CurrencyCode, getCurrencySymbol } from "@/utils/currency";

export const GoalCard = ({ goal, currency, onDelete }: { 
  goal: Goal; 
  currency: CurrencyCode;
  onDelete: () => void;
}) => {
  const { t } = useTranslation();
  const Icon = goalIcons[goal.icon];
  
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="bg-gray-50 p-3 rounded-xl">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-lg">
              {new Date(goal.year, goal.month - 1)
                .toLocaleDateString(navigator.language, { month: 'long', year: 'numeric' })
                .replace(/^\w/, (c) => c.toUpperCase())}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {goal.installment_project 
                ? `${getCurrencySymbol(currency)} ${goal.asset_value.toLocaleString('pt-BR')} (${goal.installment_count}x de ${formatCurrency(goal.asset_value / goal.installment_count, currency)})`
                : `${getCurrencySymbol(currency)} ${goal.asset_value.toLocaleString('pt-BR')}`
              }
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDelete}
          className="hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}; 