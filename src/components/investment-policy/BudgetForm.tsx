import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import CurrencyInput from 'react-currency-input-field';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const incomeSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
});

const expenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
});

const budgetSchema = z.object({
  incomes: z.array(incomeSchema),
  expenses: z.array(expenseSchema),
  bonus: z.number().min(0, 'Valor deve ser maior ou igual a zero').nullable().optional(),
  dividends: z.number().min(0, 'Valor deve ser maior ou igual a zero').nullable().optional(),
  savings: z.number().min(0, 'Valor deve ser maior ou igual a zero').nullable().optional(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  initialData?: BudgetFormValues;
  isEditing?: boolean;
  policyId?: string;
}

export const BudgetForm = ({
  initialData,
  isEditing = false,
  policyId,
}: BudgetFormProps) => {
  const { t } = useTranslation();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: initialData || {
      incomes: [{ description: '', amount: 0 }],
      expenses: [{ description: '', amount: 0 }],
      bonus: null,
      dividends: null,
      savings: null,
    },
  });

  const { fields: incomeFields, append: appendIncome, remove: removeIncome } = useFieldArray({
    control: form.control,
    name: 'incomes',
  });

  const { fields: expenseFields, append: appendExpense, remove: removeExpense } = useFieldArray({
    control: form.control,
    name: 'expenses',
  });

  useEffect(() => {
    const loadBudget = async () => {
      if (!policyId) return;

      try {
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('policy_id', policyId)
          .single();

        if (error) throw error;

        if (data) {
          form.reset({
            ...data,
            incomes: data.incomes || [{ description: '', amount: 0 }],
            expenses: data.expenses || [{ description: '', amount: 0 }],
          });
        }
      } catch (error) {
        console.error('Error loading budget:', error);
        toast({
          title: t('common.error'),
          description: t('budget.messages.loadError'),
          variant: 'destructive',
        });
      }
    };

    loadBudget();
  }, [policyId, form, t]);

  const handleSubmit = async (data: BudgetFormValues) => {
    if (!policyId) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .upsert([{ ...data, policy_id: policyId }], {
          onConflict: 'policy_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('budget.messages.success'),
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: t('common.error'),
        description: t('budget.messages.error'),
        variant: 'destructive',
      });
    }
  };

  const parseInputValue = (value: string) => {
    return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              {/* Incomes Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-600">{t('budget.incomes.title')}</h3>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => appendIncome({ description: '', amount: 0 })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('budget.incomes.add')}
                    </Button>
                  )}
                </div>

                {incomeFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('budget.incomes.empty')}</p>
                ) : (
                  incomeFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end border-l-4 border-green-500 pl-4">
                      <FormField
                        control={form.control}
                        name={`incomes.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-600">{t('budget.incomes.description')}</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} className="border-green-200 focus:border-green-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`incomes.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-600">{t('budget.incomes.amount')}</FormLabel>
                            <FormControl>
                              <CurrencyInput
                                value={field.value}
                                onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                                disabled={!isEditing}
                                intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                                className="flex h-10 w-full rounded-md border border-green-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {isEditing && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIncome(index)}
                          className="self-center text-green-600 hover:text-green-700 hover:bg-green-50"
                          aria-label={t('budget.incomes.remove')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Expenses Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-red-600">{t('budget.expenses.title')}</h3>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => appendExpense({ description: '', amount: 0 })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('budget.expenses.add')}
                    </Button>
                  )}
                </div>

                {expenseFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('budget.expenses.empty')}</p>
                ) : (
                  expenseFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end border-l-4 border-red-500 pl-4">
                      <FormField
                        control={form.control}
                        name={`expenses.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-600">{t('budget.expenses.description')}</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} className="border-red-200 focus:border-red-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`expenses.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-600">{t('budget.expenses.amount')}</FormLabel>
                            <FormControl>
                              <CurrencyInput
                                value={field.value}
                                onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                                disabled={!isEditing}
                                intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                                className="flex h-10 w-full rounded-md border border-red-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {isEditing && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExpense(index)}
                          className="self-center text-red-600 hover:text-red-700 hover:bg-red-50"
                          aria-label={t('budget.expenses.remove')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <Separator className="my-8" />

              {/* Other Fields */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{t('budget.other.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bonus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('budget.other.bonus')}</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value}
                            onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                            disabled={!isEditing}
                            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dividends"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('budget.other.dividends')}</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value}
                            onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                            disabled={!isEditing}
                            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="savings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('budget.other.savings')}</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value}
                            onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                            disabled={!isEditing}
                            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end">
            <Button type="submit">{t('common.save')}</Button>
          </div>
        )}
      </form>
    </Form>
  );
}; 