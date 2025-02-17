import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { goalIcons } from "@/constants/goals";
import { Goal } from "@/types/financial";

export const GoalCard = ({ goal, onDelete }: { 
  goal: Goal; 
  onDelete: () => void;
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="text-3xl bg-gray-50 p-3 rounded-xl">{goalIcons[goal.icon]}</span>
          <div>
            <p className="font-semibold text-lg">
              {new Date(goal.year, goal.month - 1)
                .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                .replace(/^\w/, (c) => c.toUpperCase())}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {goal.installment_project 
                ? `R$ ${goal.asset_value.toLocaleString('pt-BR')} (${goal.installment_count}x de R$ ${(goal.asset_value / goal.installment_count).toLocaleString('pt-BR')})`
                : `R$ ${goal.asset_value.toLocaleString('pt-BR')}`
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