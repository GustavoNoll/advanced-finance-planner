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
import { formatCurrency } from '@/lib/utils';

const incomeSchema = z.object({
  description: z.string(),
  amount: z.number(),
});

const expenseSchema = z.object({
  description: z.string(),
  amount: z.number(),
});

const budgetSchema = z.object({
  incomes: z.array(incomeSchema),
  expenses: z.array(expenseSchema),
  bonus: z.number().optional(),
  dividends: z.number().optional(),
  savings: z.number().optional(),
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

  const handleSubmit = async (data: BudgetFormValues) => {
    if (!policyId) return;

    const { error } = await supabase
      .from('budgets')
      .upsert([{ ...data, policy_id: policyId }]);

    if (error) {
      console.error('Error updating budget:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar orçamento',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Sucesso',
      description: 'Orçamento atualizado com sucesso',
    });
  };

  const formatInputValue = (value: number) => {
    return value ? formatCurrency(value) : '';
  };

  const parseInputValue = (value: string) => {
    return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Orçamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              {/* Rendas Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Rendas</h3>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendIncome({ description: '', amount: 0 })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Renda
                    </Button>
                  )}
                </div>

                {incomeFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma renda cadastrada</p>
                ) : (
                  incomeFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`incomes.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
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
                            <FormLabel>Valor</FormLabel>
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
                      {isEditing && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIncome(index)}
                          className="self-center"
                          aria-label="Remover renda"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Gastos Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Gastos</h3>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendExpense({ description: '', amount: 0 })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Gasto
                    </Button>
                  )}
                </div>

                {expenseFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum gasto cadastrado</p>
                ) : (
                  expenseFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`expenses.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
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
                            <FormLabel>Valor</FormLabel>
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
                      {isEditing && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExpense(index)}
                          className="self-center"
                          aria-label="Remover gasto"
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
                <h3 className="text-lg font-semibold">Outros</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bonus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bônus</FormLabel>
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
                        <FormLabel>Dividendos</FormLabel>
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
                        <FormLabel>Poupança</FormLabel>
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
            <Button type="submit">Salvar Alterações</Button>
          </div>
        )}
      </form>
    </Form>
  );
}; 