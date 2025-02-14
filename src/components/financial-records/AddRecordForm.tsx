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
import { FinancialRecord, MonthNumber } from '@/types/financial';

const formSchema = z.object({
  record_year: z.number(),
  record_month: z.number().min(1).max(12) as z.ZodType<MonthNumber>,
  starting_balance: z.number(),
  monthly_contribution: z.number(),
  monthly_return: z.number(),
  monthly_return_rate: z.number(),
  ending_balance: z.number(),
  target_rentability: z.number().optional(),
}).refine((data) => {
  const currentDate = new Date();
  const recordDate = new Date(data.record_year, data.record_month - 1);
  return recordDate <= currentDate;
}, {
  message: "Não é possível adicionar registros para datas futuras",
  path: ["record_month"],
});

interface AddRecordFormProps {
  clientId: string;
  onSuccess: () => void;
  editingRecord?: FinancialRecord;
}

export const AddRecordForm = ({ clientId, onSuccess, editingRecord }: AddRecordFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [ipcaDate, setIpcaDate] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editingRecord ? {
      record_year: editingRecord.record_year,
      record_month: editingRecord.record_month,
      starting_balance: editingRecord.starting_balance,
      monthly_contribution: editingRecord.monthly_contribution,
      monthly_return: editingRecord.monthly_return,
      monthly_return_rate: editingRecord.monthly_return_rate,
      ending_balance: editingRecord.ending_balance,
      target_rentability: editingRecord.target_rentability || 0,
    } : {
      record_year: new Date().getFullYear(),
      record_month: new Date().getMonth() + 1,
      starting_balance: 0,
      monthly_contribution: 0,
      monthly_return: 0,
      monthly_return_rate: 0,
      ending_balance: 0,
      target_rentability: 0,
    },
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
          console.log('startingBalance', startingBalance);
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
  }, [clientId, editingRecord]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    const growth_percentage = (((values.ending_balance - values.starting_balance) / values.starting_balance) * 100) || 0;

    try {
      if (editingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('user_financial_records')
          .update({ ...values, growth_percentage })
          .eq('id', editingRecord.id);

        if (error) {
          toast({
            title: t('financialRecords.errors.updateFailed'),
            variant: "destructive",
          });
          return;
        }

        toast({ title: t('financialRecords.success.updated') });
      } else {
        // Create new record
        const { error } = await supabase
          .from('user_financial_records')
          .insert([{ user_id: clientId, ...values, growth_percentage }]);

        if (error) {
          if (error.code === '23505') {
            toast({
              title: t('financialRecords.errors.duplicateRecord'),
              variant: "destructive",
            });
            return;
          }
          
          toast({
            title: t('financialRecords.errors.createFailed'),
            variant: "destructive",
          });
          return;
        }

        toast({ title: t('financialRecords.success.created') });
      }

      queryClient.invalidateQueries({ queryKey: ['financialRecords', clientId] });
      onSuccess();
      if (!editingRecord) {
        form.reset();
      }
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