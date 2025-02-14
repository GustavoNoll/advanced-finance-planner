import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableGoalCard } from '@/components/financial-goals/SortableGoalCard';
import { goalIcons, goalNames } from "@/constants/goals";


const formSchema = z.object({
  icon: z.enum(Object.keys(goalIcons) as [string, ...string[]]),
  target_amount: z.string().min(1, "Valor necessário é obrigatório"),
  asset_value: z.string().min(1, "Valor do bem é obrigatório"),
});

const FinancialGoals = () => {
  const { id: userId } = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: "other",
      target_amount: "",
      asset_value: "",
    },
  });

  const { data: goals, isLoading } = useQuery({
    queryKey: ["financial-goals", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("profile_id", userId)
        .order("priority", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const createGoal = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const maxPriority = goals?.reduce((max, goal) => Math.max(max, goal.priority), 0) ?? 0;
      
      const { data, error } = await supabase.from("financial_goals").insert([
        {
          profile_id: userId,
          icon: values.icon,
          target_amount: parseFloat(values.target_amount),
          asset_value: parseFloat(values.asset_value),
          priority: maxPriority + 1,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
      setShowAddForm(false);
      form.reset();
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

  const updatePriorities = useMutation({
    mutationFn: async (updatedGoals: typeof goals) => {
      if (!updatedGoals) return;
      
      const updates = updatedGoals.map((goal) => ({
        id: goal.id,
        profile_id: goal.profile_id,
        priority: goal.priority,
        icon: goal.icon,
        target_amount: goal.target_amount,
        asset_value: goal.asset_value
      }));

      const { error } = await supabase
        .from("financial_goals")
        .upsert(updates);

      if (error) {
        console.error("Error updating priorities:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
    },
    onError: () => {
      console.log("Error updating priorities");
      toast({
        title: t("financialGoals.messages.priorityUpdateError"),
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id && goals) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over.id);
      
      const newGoals = arrayMove(goals, oldIndex, newIndex).map((goal, index) => ({
        ...goal,
        priority: index + 1
      }));

      updatePriorities.mutate(newGoals);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const renderForm = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => createGoal.mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("financialGoals.form.icon")}</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full p-2 border rounded-md"
                >
                  {Object.entries(goalIcons).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value} {t(`financialGoals.icons.${key}`)}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="asset_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("financialGoals.form.assetValue")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("financialGoals.form.targetAmount")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setShowAddForm(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit">
            {t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );

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

            <div className="flex justify-end w-1/3">
            </div>
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

          {showAddForm && (
            <Card className="p-4">
              {renderForm()}
            </Card>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={goals?.map(g => g.id) ?? []}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {goals?.map((goal) => (
                <SortableGoalCard
                  key={goal.id}
                  goal={goal}
                  onDelete={() => {
                    if (window.confirm(t("common.confirmDelete"))) {
                      deleteGoal.mutate(goal.id);
                    }
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
};

export default FinancialGoals; 