import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Pencil, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '@/utils/string';

const incomeSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').trim(),
  amount: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
});

const expenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').trim(),
  amount: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
});

const budgetSchema = z.object({
  incomes: z.array(incomeSchema).min(0, 'Pelo menos uma receita é obrigatória'),
  expenses: z.array(expenseSchema).min(0, 'Pelo menos uma despesa é obrigatória'),
  bonus: z.number().min(0, 'Valor deve ser maior ou igual a zero').nullable(),
  dividends: z.number().min(0, 'Valor deve ser maior ou igual a zero').nullable(),
  savings: z.number().min(0, 'Valor deve ser maior ou igual a zero').nullable(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  initialData?: BudgetFormValues;
  isEditing?: boolean;
  policyId?: string;
  clientId?: string;
}

export const BudgetForm = ({
  initialData,
  isEditing = false,
  policyId,
  clientId,
}: BudgetFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: initialData || {
      incomes: [{ description: '', amount: 0 }],
      expenses: [{ description: '', amount: 0 }],
      bonus: 0,
      dividends: 0,
      savings: 0,
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

  const queryClient = useQueryClient();

  useEffect(() => {
    const loadBudget = async () => {
      if (!policyId) return;

      try {
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('policy_id', policyId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          form.reset({
            ...data,
            incomes: (data.incomes || [{ description: '', amount: 0 }]).map(income => ({
              description: income.description || '',
              amount: income.amount != null ? Number(income.amount) : 0
            })),
            expenses: (data.expenses || [{ description: '', amount: 0 }]).map(expense => ({
              description: expense.description || '',
              amount: expense.amount != null ? Number(expense.amount) : 0
            })),
            bonus: data.bonus != null ? Number(data.bonus) : 0,
            dividends: data.dividends != null ? Number(data.dividends) : 0,
            savings: data.savings != null ? Number(data.savings) : 0,
          });
        } else {
          // Se não houver dados, inicializa com valores padrão
          form.reset({
            incomes: [{ description: '', amount: 0 }],
            expenses: [{ description: '', amount: 0 }],
            bonus: 0,
            dividends: 0,
            savings: 0,
          });
        }
      } catch (error) {
        console.error('Error loading budget:', error);
        if (error instanceof Error && error.message.includes('PGRST116')) {
          return;
        }
        toast({
          title: t('common.error'),
          description: t('budget.messages.loadError'),
          variant: 'destructive',
        });
      }
    };

    loadBudget();
  }, [policyId, form, t, toast]);

  const handleSubmit = async (data: BudgetFormValues) => {
    if (!policyId) return;

    try {
      const transformedData = {
        ...data,
        incomes: data.incomes.map(income => ({
          ...income,
          amount: Number(income.amount) || 0
        })),
        expenses: data.expenses.map(expense => ({
          ...expense,
          amount: Number(expense.amount) || 0
        })),
        bonus: Number(data.bonus) || 0,
        dividends: Number(data.dividends) || 0,
        savings: Number(data.savings) || 0,
        policy_id: policyId
      };

      const { error } = await supabase
        .from('budgets')
        .upsert([transformedData], {
          onConflict: 'policy_id',
          ignoreDuplicates: false
        });

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('budget.messages.success'),
        variant: 'default',
      });

      if (clientId) {
        queryClient.invalidateQueries({ queryKey: ['investmentPolicy', clientId] });
      }

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: t('common.error'),
        description: t('budget.messages.error'),
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderReadOnlyView = () => {
    const incomes = form.getValues('incomes') || [];
    const expenses = form.getValues('expenses') || [];
    const bonus = form.getValues('bonus') ?? 0;
    const dividends = form.getValues('dividends') ?? 0;
    const savings = form.getValues('savings') ?? 0;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('budget.title')}</CardTitle>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              {t('common.edit')}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Incomes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">{t('budget.incomes.title')}</h3>
            {incomes.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('budget.incomes.empty')}</p>
            ) : (
              <div className="space-y-4">
                {incomes.map((income, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr] gap-4 items-end border-l-4 border-green-500 pl-4">
                    <div>
                      <p className="text-sm text-green-600">{t('budget.incomes.description')}</p>
                      <p className="font-medium">{income.description || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('budget.incomes.amount')}</p>
                      <p className="font-medium">{formatCurrency(income.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expenses Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">{t('budget.expenses.title')}</h3>
            {expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('budget.expenses.empty')}</p>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr] gap-4 items-end border-l-4 border-red-500 pl-4">
                    <div>
                      <p className="text-sm text-red-600">{t('budget.expenses.description')}</p>
                      <p className="font-medium">{expense.description || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-red-600">{t('budget.expenses.amount')}</p>
                      <p className="font-medium">{formatCurrency(expense.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-8" />

          {/* Other Fields */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{t('budget.other.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('budget.other.bonus')}</p>
                <p className="font-medium">{formatCurrency(bonus)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('budget.other.dividends')}</p>
                <p className="font-medium">{formatCurrency(dividends)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('budget.other.savings')}</p>
                <p className="font-medium">{formatCurrency(savings)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFormView = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('budget.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-24">
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
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center border-l-4 border-green-500 pl-4">
                      <FormField
                        control={form.control}
                        name={`incomes.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-600">{t('budget.incomes.description')}</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing} 
                                className="border-green-200 focus:border-green-500"
                                onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                              />
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
                                defaultValue={field.value}
                                onValueChange={(value, _name, values) => {
                                  const numValue = values?.float ?? 0;
                                  field.onChange(numValue);
                                }}
                                disabled={!isEditing}
                                currency="BRL"
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
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 mt-6"
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
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center border-l-4 border-red-500 pl-4">
                      <FormField
                        control={form.control}
                        name={`expenses.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-600">{t('budget.expenses.description')}</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing} 
                                className="border-red-200 focus:border-red-500"
                                onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                              />
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
                                defaultValue={field.value}
                                onValueChange={(value, _name, values) => {
                                  const numValue = values?.float ?? 0;
                                  field.onChange(numValue);
                                }}
                                disabled={!isEditing}
                                currency="BRL"
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
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-6"
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
                            value={field.value ?? 0}
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
                            value={field.value ?? 0}
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
                            value={field.value ?? 0}
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

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center gap-4">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Info className="w-4 h-4 text-blue-500" />
              {t('budget.save_changes', 'Salvar alterações em Orçamento')}
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMode(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </div>
      </form>
    </Form>
  );

  return isEditMode ? renderFormView() : renderReadOnlyView();
}; 