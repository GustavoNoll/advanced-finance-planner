import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { GoalCard } from '@/components/financial-goals/GoalCard';
import { goalIcons } from "@/constants/goals";
import CurrencyInput from 'react-currency-input-field';


const formSchema = z.object({
  icon: z.enum(Object.keys(goalIcons) as [string, ...string[]]),
  asset_value: z.string().min(1, "Valor do bem é obrigatório"),
  goal_month: z.string().min(1, "Mês é obrigatório"),
  goal_year: z.string().min(1, "Ano é obrigatório"),
  installment_project: z.boolean().default(false),
  installment_count: z.string().optional(),
}).refine((data) => {
  const currentDate = new Date();
  const selectedDate = new Date(
    parseInt(data.goal_year),
    parseInt(data.goal_month) - 1
  );
  
  // Set both dates to the first of the month to compare only month/year
  currentDate.setDate(1);
  currentDate.setHours(0, 0, 0, 0);
  selectedDate.setDate(1);
  selectedDate.setHours(0, 0, 0, 0);
  
  return selectedDate >= currentDate;
}, {
  message: "A data selecionada não pode ser no passado",
  path: ["goal_month"] // This will show the error under the month field
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
      asset_value: "",
      goal_month: "",
      goal_year: "",
      installment_project: false,
      installment_count: "",
    },
  });

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
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase.from("financial_goals").insert([
        {
          profile_id: userId,
          icon: values.icon,
          asset_value: parseFloat(values.asset_value.replace(/[^\d.,]/g, '').replace(',', '.')),
          month: parseInt(values.goal_month),
          year: parseInt(values.goal_year),
          installment_project: values.installment_project,
          installment_count: values.installment_project ? parseInt(values.installment_count || "0") : null,
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
      // Delete the goal
      const { error: deleteError } = await supabase
        .from("financial_goals")
        .delete()
        .eq("id", goalId);

      if (deleteError) throw deleteError;
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
                  <CurrencyInput
                    id="asset_value"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    prefix="R$ "
                    groupSeparator="."
                    decimalSeparator=","
                    decimalsLimit={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="goal_month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("financialGoals.form.goalMonth")}</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...field}
                    >
                      <option value="">{t("common.select")}</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        return (
                          <option key={month} value={month}>
                            {new Date(2000, i).toLocaleDateString('pt-BR', { month: 'long' })}
                          </option>
                        );
                      })}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("financialGoals.form.goalYear")}</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...field}
                    >
                      <option value="">{t("common.select")}</option>
                      {Array.from({ length: 2300 - new Date().getFullYear() + 1 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString();
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="installment_project"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel className="font-normal">
                {t("financialGoals.form.isInstallment")}
              </FormLabel>
            </FormItem>
          )}
        />

        {form.watch("installment_project") && (
          <FormField
            control={form.control}
            name="installment_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("financialGoals.form.installmentCount")}</FormLabel>
                <FormControl>
                  <input
                    type="number"
                    min="1"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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

            <div className="space-y-4">
              {goals?.map((goal) => (
                <GoalCard
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
      </main>
    </div>
  );
};

export default FinancialGoals; 