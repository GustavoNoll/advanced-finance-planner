import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CurrencyInput from 'react-currency-input-field';
import { FinancialRecord, MonthNumber, Goal, ProjectedEvent, SelectedGoalsEvents } from '@/types/financial';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formSchema = z.object({
  record_year: z.number(),
  record_month: z.number().min(1).max(12).transform(val => val as MonthNumber),
  starting_balance: z.number(),
  monthly_contribution: z.number(),
  monthly_return: z.number(),
  monthly_return_rate: z.number(),
  ending_balance: z.number(),
  target_rentability: z.number().optional(),
  events_balance: z.number().optional(),
  selected_items: z.object({
    goals: z.array(z.string()),
    events: z.array(z.string())
  })
}).refine((data) => {
  const currentDate = new Date();
  const recordDate = new Date(data.record_year, data.record_month - 1);
  return recordDate <= currentDate;
}, {
  message: "Não é possível adicionar registros para datas futuras",
  path: ["record_month", "record_year"],
});

interface AddRecordFormProps {
  clientId: string;
  onSuccess: () => void;
  editingRecord?: FinancialRecord;
}

// Helper function to sort records
const sortRecords = (records: FinancialRecord[]) => {
  return records.sort((a, b) => {
    if (a.record_year !== b.record_year) {
      return b.record_year - a.record_year;
    }
    return b.record_month - a.record_month;
  });
};

export const AddRecordForm = ({ clientId, onSuccess, editingRecord }: AddRecordFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [ipcaDate, setIpcaDate] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [pendingGoals, setPendingGoals] = useState<Goal[]>([]);
  const [projectedEvents, setProjectedEvents] = useState<ProjectedEvent[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedGoalsEvents>({
    goals: [],
    events: [],
    totalValue: 0
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editingRecord ? {
      record_year: editingRecord.record_year,
      record_month: editingRecord.record_month as MonthNumber,
      starting_balance: editingRecord.starting_balance,
      monthly_contribution: editingRecord.monthly_contribution,
      monthly_return: editingRecord.monthly_return,
      monthly_return_rate: editingRecord.monthly_return_rate,
      ending_balance: editingRecord.ending_balance,
      target_rentability: editingRecord.target_rentability || 0,
      events_balance: editingRecord.events_balance || 0,
      selected_items: {
        goals: editingRecord.selected_items?.goals || [],
        events: editingRecord.selected_items?.events || []
      }
    } : {
      record_year: new Date().getFullYear(),
      record_month: (new Date().getMonth() + 1) as MonthNumber,
      starting_balance: 0,
      monthly_contribution: 0,
      monthly_return: 0,
      monthly_return_rate: 0,
      ending_balance: 0,
      target_rentability: 0,
      events_balance: 0,
      selected_items: {
        goals: [],
        events: []
      }
    },
  });

  const { data: goalsAndEvents } = useQuery({
    queryKey: ['goalsAndEvents', clientId],
    queryFn: async () => {
      const [goalsResponse, eventsResponse] = await Promise.all([
        supabase
          .from('financial_goals')
          .select('*')
          .eq('profile_id', clientId)
          .eq('status', 'pending'),
        supabase
          .from('events')
          .select('*')
          .eq('profile_id', clientId)
          .eq('status', 'projected')
      ]);

      return {
        goals: goalsResponse.data || [],
        events: eventsResponse.data || []
      };
    },
    enabled: !!clientId
  });

  useEffect(() => {
    if (!editingRecord) {
      const fetchInitialData = async () => {
        try {
          const { data: lastRecord } = await supabase
            .from('user_financial_records')
            .select('ending_balance')
            .eq('user_id', clientId)
            .order('record_year', { ascending: false })
            .order('record_month', { ascending: false })
            .limit(1)
            .single();

          const { data: investmentPlan } = await supabase
            .from('investment_plans')
            .select('initial_amount, inflation')
            .eq('user_id', clientId)
            .single();

          const startingBalance = lastRecord?.ending_balance || investmentPlan?.initial_amount || 0;
          form.setValue('starting_balance', startingBalance);

          const response = await fetch(
            'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json'
          );
          const data = await response.json();
          const monthlyIPCA = Number(data[0].valor);
          const ipcaDateStr = new Date(data[0].data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });
          setIpcaDate(ipcaDateStr);
          form.setValue('target_rentability', monthlyIPCA);
        } catch (error) {
          console.error('Error fetching data:', error);
          toast({
            title: t('financialRecords.errors.dataFetchFailed'),
            variant: "destructive",
          });
        }
      };

      fetchInitialData();
    }

    if (goalsAndEvents) {
      setPendingGoals(goalsAndEvents.goals);
      setProjectedEvents(goalsAndEvents.events);
    }
  }, [clientId, editingRecord, goalsAndEvents]);

  const handleItemSelection = (type: 'goals' | 'events', id: string, value: number, checked: boolean) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      
      if (checked) {
        newItems[type] = [...prev[type], id];
        if (type === 'events') {
          newItems.totalValue += value;
        }
      } else {
        newItems[type] = prev[type].filter(item => item !== id);
        if (type === 'events') {
          newItems.totalValue -= value;
        }
      }

      form.setValue('events_balance', newItems.totalValue);
      return newItems;
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    
    try {
      // Update goals and events status
      if (selectedItems.goals.length > 0) {
        await supabase
          .from('financial_goals')
          .update({ status: 'completed' })
          .in('id', selectedItems.goals);
      }

      if (selectedItems.events.length > 0) {
        await supabase
          .from('events')
          .update({ status: 'completed' })
          .in('id', selectedItems.events);
      }

      const growth_percentage = (((values.ending_balance - values.starting_balance) / values.starting_balance) * 100) || 0;

      const recordData = {
        ...values,
        growth_percentage,
        user_id: clientId,
      };

      const { selected_items, ...finalRecordData } = recordData;

      if (editingRecord) {

        const { data, error } = await supabase
          .from('user_financial_records')
          .update(finalRecordData)
          .eq('id', editingRecord.id)
          .select()
          .single();

        if (error) throw error;

        queryClient.setQueryData(['financialRecords', clientId], (oldData: FinancialRecord[] | undefined) => {
          if (!oldData) return [data];
          const updatedRecords = oldData.map(record => 
            record.id === editingRecord.id ? data : record
          );
          return sortRecords(updatedRecords);
        });

        toast({ title: t('financialRecords.success.updated') });
      } else {
        const finalRecordDataWithEventsBalance = {
          ...finalRecordData,
          events_balance: selectedItems.totalValue
        };

        const { data, error } = await supabase
          .from('user_financial_records')
          .insert([finalRecordDataWithEventsBalance])
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            toast({
              title: t('financialRecords.errors.duplicateRecord'),
              variant: "destructive",
            });
            return;
          }
          throw error;
        }

        queryClient.setQueryData(['financialRecords', clientId], (oldData: FinancialRecord[] | undefined) => {
          if (!oldData) return [data];
          return sortRecords([...oldData, data]);
        });

        toast({ title: t('financialRecords.success.created') });
      }

      onSuccess();
      if (!editingRecord) {
        form.reset();
      }
    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: editingRecord 
          ? t('financialRecords.errors.updateFailed')
          : t('financialRecords.errors.createFailed'),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderFormFields = () => (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="record_month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('financialRecords.form.month')}</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="record_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('financialRecords.form.year')}</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
            key={'starting_balance'}
            control={form.control}
            name={'starting_balance'}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">{t(`financialRecords.form.startingBalance`)}</FormLabel>
                <FormControl>
                  <CurrencyInput
                    id={'starting_balance'}
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    prefix="R$ "
                    groupSeparator="."
                    decimalSeparator=","
                    decimalsLimit={2}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            key={'ending_balance'}
            control={form.control}
            name={'ending_balance'}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">{t(`financialRecords.form.endingBalance`)}</FormLabel>
                <FormControl>
                  <CurrencyInput
                    id={'ending_balance'}
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    prefix="R$ "
                    groupSeparator="."
                    decimalSeparator=","
                    decimalsLimit={2}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="monthly_contribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">{t('financialRecords.form.monthlyContribution')}</FormLabel>
              <FormControl>
                <CurrencyInput
                  id="monthly_contribution"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  prefix="R$ "
                  groupSeparator="."
                  decimalSeparator=","
                  decimalsLimit={2}
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_rentability"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">{t('financialRecords.form.targetRentability')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))} 
                  className="h-8"
                />
              </FormControl>
              {ipcaDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  IPCA referente a {ipcaDate}
                </p>
              )}
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="monthly_return"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">{t('financialRecords.form.monthlyReturn')}</FormLabel>
              <FormControl>
                <CurrencyInput
                  id="monthly_return"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  prefix="R$ "
                  groupSeparator="."
                  decimalSeparator=","
                  decimalsLimit={2}
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthly_return_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">{t('financialRecords.form.monthlyReturnRate')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))} 
                  className="h-8"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {!editingRecord ? (
        <div className="space-y-4">
          <h3 className="font-medium text-sm">
            {t('financialRecords.form.goalsAndEvents')}
          </h3>
          
          <ScrollArea className="h-[200px] rounded-md border p-4">
            {pendingGoals.length === 0 && projectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t('financialRecords.form.noGoalsOrEvents')}
              </p>
            ) : (
              <div className="space-y-4">
                {pendingGoals.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t('financialRecords.form.goals')}</h4>
                    {pendingGoals.map(goal => (
                      <div key={goal.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`goal-${goal.id}`}
                          checked={selectedItems.goals.includes(goal.id)}
                          onCheckedChange={(checked) => 
                            handleItemSelection('goals', goal.id, goal.asset_value, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`goal-${goal.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {goal.icon} - {formatCurrency(goal.asset_value)}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {pendingGoals.length > 0 && projectedEvents.length > 0 && (
                  <Separator className="my-2" />
                )}

                {projectedEvents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t('financialRecords.form.events')}</h4>
                    {projectedEvents.map(event => (
                      <div key={event.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`event-${event.id}`}
                          checked={selectedItems.events.includes(event.id)}
                          onCheckedChange={(checked) => 
                            handleItemSelection('events', event.id, event.amount, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`event-${event.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {event.name} - {formatCurrency(event.amount)}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {selectedItems.totalValue > 0 && (
            <p className="text-sm font-medium">
              {t('financialRecords.form.selectedTotal')}: {formatCurrency(selectedItems.totalValue)}
            </p>
          )}
        </div>
      ) : (
        <FormField
          control={form.control}
          name="events_balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">{t('financialRecords.form.eventsBalance')}</FormLabel>
              <FormControl>
                <CurrencyInput
                  id="events_balance"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  prefix="R$ "
                  groupSeparator="."
                  decimalSeparator=","
                  decimalsLimit={2}
                  allowNegativeValue={true}
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    const numericValue = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
                    field.onChange(numericValue);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      <div className="flex gap-2 justify-end">
        <Button 
          type="button" 
          variant="outline"
          onClick={onSuccess}
          disabled={isSaving}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          type="submit" 
          className={`transition-all duration-200 ${isSaving ? 'opacity-70 scale-95' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? t('common.saving') : editingRecord ? t('common.update') : t('common.save')}
        </Button>
      </div>
    </form>
  );

  return (
    <div className={editingRecord ? "mt-4 border-t pt-4" : ""}>
      <Form {...form}>
        {!editingRecord ? (
          <Card className="p-4">
            {renderFormFields()}
          </Card>
        ) : (
          renderFormFields()
        )}
      </Form>
    </div>
  );
}; 