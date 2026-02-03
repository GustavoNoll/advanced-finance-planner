import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/shared/components/ui/spinner";
import { CurrencyCode } from "@/utils/currency";
import { Goal, FinancialItemFormValues } from "@/types/financial";
import { 
  GoalsEventsHeader, 
  AddItemButton, 
  ItemFormSection, 
  ItemsList 
} from "@/features/goals-events/components";
import { useGoals, useGoalMutations } from "@/hooks/useGoalsEventsManagement";
import { useInvestmentPlanByUserId } from "@/hooks/useInvestmentPlan";
import { useProfileData } from "@/hooks/usePlanCreation";

const FinancialGoals = () => {
  const { id: userId } = useParams();
  const location = useLocation();
  const [currency, setCurrency] = useState<CurrencyCode | null>(location.state?.currency || null);
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Função para fechar o formulário e limpar o estado de edição
  const closeForm = () => {
    setShowAddForm(false);
    setEditingGoal(null);
  };

  // Hooks para dados e mutações com callback de sucesso
  const { projectedGoals, completedGoals, isLoading } = useGoals(userId || '');
  const { createGoal, updateGoal, deleteGoal } = useGoalMutations(userId || '', closeForm);
  
  // Hooks para obter dados do plano de investimento
  const { plan: investmentPlan } = useInvestmentPlanByUserId(userId || '');
  const { profileData } = useProfileData(userId || '');

  // Handlers
  const handleSubmit = (values: FinancialItemFormValues) => {
    if (editingGoal) {
      updateGoal.mutate({ goalId: editingGoal.id, values });
    } else {
      createGoal.mutate(values);
    }
  };

  const handleCancel = () => {
    closeForm();
  };

  const handleDelete = (goalId: string) => {
    deleteGoal.mutate(goalId);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowAddForm(false);
  };

  if (isLoading || !profileData || !investmentPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GoalsEventsHeader 
        title={t("financialGoals.title")} 
        userId={userId} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4">
          <AddItemButton
            onClick={() => setShowAddForm(!showAddForm)}
            label={t("financialGoals.addNew")}
          />

          <ItemFormSection
            showForm={showAddForm}
            type="goal"
            currency={currency as CurrencyCode}
            isSubmitting={createGoal.isPending || updateGoal.isPending}
            editingItem={editingGoal}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            planInitialDate={investmentPlan.plan_initial_date}
            limitAge={investmentPlan.limit_age}
            birthDate={profileData?.birth_date}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ItemsList
          type="goal"
          projectedItems={projectedGoals}
          completedItems={completedGoals}
          currency={currency as CurrencyCode}
          showCompleted={showCompleted}
          onToggleShowCompleted={() => setShowCompleted(!showCompleted)}
          onDelete={handleDelete}
          onEdit={handleEdit}
          t={t}
        />
      </main>
    </div>
  );
};

export default FinancialGoals; 