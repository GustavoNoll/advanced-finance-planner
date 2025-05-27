import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { GoalCard } from '@/components/financial-goals/GoalCard';
import { FinancialItemForm } from '@/components/chart/FinancialItemForm';
import { CurrencyCode } from "@/utils/currency";
import { FinancialItemFormValues, Goal } from "@/types/financial";

const FinancialGoals = () => {
  const { id: userId } = useParams();
  const location = useLocation();
  const [currency, setCurrency] = useState<CurrencyCode | null>(location.state?.currency || null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { data: goals, isLoading } = useQuery({
    queryKey: ["financial-goals", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("profile_id", userId)
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createGoal = useMutation({
    mutationFn: async (values: FinancialItemFormValues) => {
      const assetValue = parseFloat(values.asset_value.replace(/[^\d.,-]/g, '').replace(',', '.'));
      
      const { data, error } = await supabase.from("financial_goals").insert([
        {
          profile_id: userId,
          name: values.name,
          icon: values.icon,
          asset_value: assetValue,
          month: parseInt(values.month),
          year: parseInt(values.year),
          status: 'pending',
          payment_mode: values.payment_mode,
          installment_count: values.installment_count ? parseInt(values.installment_count) : null,
          installment_interval: values.installment_interval ? parseInt(values.installment_interval) : null,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
      setShowAddForm(false);
      toast({
        title: t("financialGoals.messages.createSuccess"),
      });
    },
    onError: () => {
      toast({
        title: t("financialGoals.messages.createError"),
        variant: "destructive",
      });
    },
  });

  const updateGoal = useMutation({
    mutationFn: async (values: FinancialItemFormValues) => {
      if (!editingGoal) throw new Error('No goal selected for editing');
      
      const assetValue = parseFloat(values.asset_value.replace(/[^\d.,-]/g, '').replace(',', '.'));
      
      const { data, error } = await supabase
        .from("financial_goals")
        .update({
          name: values.name,
          icon: values.icon,
          asset_value: assetValue,
          month: parseInt(values.month),
          year: parseInt(values.year),
          payment_mode: values.payment_mode,
          installment_count: values.installment_count ? parseInt(values.installment_count) : null,
          installment_interval: values.installment_interval ? parseInt(values.installment_interval) : null,
        })
        .eq("id", editingGoal.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
      setEditingGoal(null);
      toast({
        title: t("financialGoals.messages.updateSuccess"),
      });
    },
    onError: () => {
      toast({
        title: t("financialGoals.messages.updateError"),
        variant: "destructive",
      });
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from("financial_goals")
        .delete()
        .eq("id", goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
      toast({
        title: t("financialGoals.messages.deleteSuccess"),
      });
    },
    onError: () => {
      toast({
        title: t("financialGoals.messages.deleteError"),
        variant: "destructive",
      });
    },
  });

  const toggleGoalStatus = useMutation({
    mutationFn: async ({ goalId, status }: { goalId: string; status: 'pending' | 'completed' }) => {
      const { error } = await supabase
        .from("financial_goals")
        .update({ status })
        .eq("id", goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const projectedGoals = goals?.filter(goal => goal.status === 'pending') || [];
  const completedGoals = goals?.filter(goal => goal.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="w-1/3">
              <Link to={userId ? `/client/${userId}` : "/"}>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center w-1/3">
              <h1 className="text-xl font-semibold text-gray-900">{t("financialGoals.title")}</h1>
            </div>

            <div className="w-1/3" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4">
          <Button 
            variant="ghost"
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{t("financialGoals.addNew")}</span>
            </div>
          </Button>

          {(showAddForm || editingGoal) && (
            <Card className="p-4 bg-white shadow-sm border border-gray-200">
              <FinancialItemForm
                type="goal"
                onSubmit={(values) => editingGoal ? updateGoal.mutate(values) : createGoal.mutate(values)}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingGoal(null);
                }}
                isSubmitting={createGoal.isPending || updateGoal.isPending}
                currency={currency as CurrencyCode}
                showTypeSelector={false}
                initialValues={editingGoal ? {
                  name: editingGoal.name,
                  icon: editingGoal.icon,
                  asset_value: editingGoal.asset_value.toString(),
                  month: editingGoal.month.toString(),
                  year: editingGoal.year.toString(),
                  payment_mode: editingGoal.payment_mode,
                  installment_count: editingGoal.installment_count?.toString() || '',
                  installment_interval: editingGoal.installment_interval?.toString() || '1',
                } : undefined}
              />
            </Card>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">{t("financialGoals.projected")}</h2>
            {projectedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                currency={currency as CurrencyCode}
                onDelete={() => {
                  if (window.confirm(t("common.confirmDelete"))) {
                    deleteGoal.mutate(goal.id);
                  }
                }}
                onToggleStatus={() => {
                  toggleGoalStatus.mutate({
                    goalId: goal.id,
                    status: goal.status === 'pending' ? 'completed' : 'pending'
                  });
                }}
                onEdit={() => setEditingGoal(goal)}
              />
            ))}
          </div>

          <div>
            <Button
              variant="ghost"
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full justify-start text-gray-500"
            >
              {showCompleted ? t("financialGoals.hideCompleted") : t("financialGoals.showCompleted")}
            </Button>
            
            {showCompleted && completedGoals.length > 0 && (
              <div className="mt-4 space-y-4">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    currency={currency as CurrencyCode}
                    onDelete={() => {
                      if (window.confirm(t("common.confirmDelete"))) {
                        deleteGoal.mutate(goal.id);
                      }
                    }}
                    onToggleStatus={() => {
                      toggleGoalStatus.mutate({
                        goalId: goal.id,
                        status: goal.status === 'pending' ? 'completed' : 'pending'
                      });
                    }}
                    onEdit={() => setEditingGoal(goal)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialGoals; 