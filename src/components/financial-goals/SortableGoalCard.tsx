import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { goalIcons } from "@/constants/goals";

interface SortableGoalCardProps {
  goal: {
    id: string;
    icon: keyof typeof goalIcons;
    asset_value: number;
    target_amount: number;
    priority: number;
  };
  onDelete: () => void;
}

export function SortableGoalCard({ goal, onDelete }: SortableGoalCardProps) {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-6 cursor-move"
      {...attributes}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="cursor-grab active:cursor-grabbing p-0 h-auto"
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{goalIcons[goal.icon]}</span>
            <span className="text-xs text-gray-400">#{goal.priority}</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {t("financialGoals.labels.assetValue")}: {" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(goal.asset_value)}
            </p>
            <p className="text-sm text-gray-500">
              {t("financialGoals.labels.targetAmount")}: {" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(goal.target_amount)}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
} 