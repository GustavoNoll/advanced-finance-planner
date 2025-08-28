import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { InvestmentPlan } from '@/types/financial';
import { CurrencyCode, getCurrencySymbol } from "@/utils/currency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Plus } from "lucide-react";
import SelectExistingItems from "./SelectExistingItems";
import SelectedItemCard from "./SelectedItemCard";
import { FinancialItemForm } from "@/components/chart/FinancialItemForm";

// Interfaces para os itens selecionados
interface Goal {
  id: string;
  name: string;
  icon: string;
  asset_value: number;
  status: string;
  payment_mode: 'none' | 'installment' | 'repeat';
  installment_count?: number;
  installment_interval?: number;
}

interface Event {
  id: string;
  name: string;
  icon: string;
  asset_value: number;
  status: string;
  payment_mode: 'none' | 'installment' | 'repeat';
  installment_count?: number;
  installment_interval?: number;
}


const formSchema = z.object({
  record_year: z.number(),
  record_month: z.number().min(1).max(12).transform(val => val as MonthNumber),
  starting_balance: z.number(),
  monthly_contribution: z.number(),
  monthly_return: z.number(),
  monthly_return_rate: z.number(),
  ending_balance: z.number(),
  target_rentability: z.number().optional(),

})
.refine((data) => {
  const currentDate = new Date();
  const recordDate = new Date(data.record_year, data.record_month - 1);
  return recordDate <= currentDate;
}, {
  message: "Não é possível adicionar registros para datas futuras",
  path: ["record_month", "record_year"],
})
.refine((data) => {
  // investmentPlan.plan_initial_date está disponível no escopo do componente, mas não aqui.
  // Então, a validação precisa ser feita no handleSubmit/onSubmit, ou passar a data inicial como parâmetro do schema.
  return true; // Placeholder, será ajustado no componente.
}, {
  message: "Não é possível adicionar registros para datas anteriores ao início do plano",
  path: ["record_month", "record_year"],
});

interface LinkedItem {
  id: string;
  type: 'goal' | 'event';
  name: string;
  allocatedAmount: number;
  isCompleting: boolean;
  icon: string;
}

interface AddRecordFormProps {
  clientId: string;
  onSuccess: () => void;
  editingRecord?: FinancialRecord;
  investmentPlan: InvestmentPlan;
  onLinksUpdated?: () => void;
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

export const AddRecordForm = ({ clientId, onSuccess, editingRecord, investmentPlan, onLinksUpdated }: AddRecordFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [ipcaDate, setIpcaDate] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showGoalEventOptions, setShowGoalEventOptions] = useState(false);
  const [selectedItems, setSelectedItems] = useState<LinkedItem[]>([]);
  const [newItemType, setNewItemType] = useState<'goal' | 'event'>('goal');

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

    } : {
      record_year: new Date().getFullYear(),
      record_month: (new Date().getMonth() + 1) as MonthNumber,
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
  }, [clientId, editingRecord]);

  // Não carregar itens linkados existentes - apenas mostrar itens sendo selecionados no momento
  useEffect(() => {
    if (!editingRecord) {
      // Limpar itens selecionados quando não estiver editando
      setSelectedItems([]);
    }
  }, [editingRecord]);

  const handleCreateItem = (itemData: { type: 'goal' | 'event'; name: string; asset_value: string | number; icon: string }) => {
    const newItem: LinkedItem = {
      id: `temp-${Date.now()}`, // ID temporário até salvar no banco
      type: itemData.type,
      name: itemData.name,
      allocatedAmount: parseFloat(String(itemData.asset_value)),
      isCompleting: false,
      icon: itemData.icon
    };
    
    setSelectedItems(prev => {
      const updated = [...prev, newItem];
      console.log('Lista de itens atualizada após criação:', updated);
      console.log('Total de itens selecionados:', updated.length);
      return updated;
    });
  };

  const handleSelectExistingItem = (item: (Goal | Event) & { type: 'goal' | 'event' }) => {
    console.log('Item selecionado:', item);
    
    // Calcular valor alocado baseado no modo de pagamento
    let allocatedAmount = 0;
    
    if (item.payment_mode === 'none') {
      // Se não é parcelado, usar o valor total
      allocatedAmount = item.type === 'goal' ? -item.asset_value : item.asset_value;
    } else if (item.payment_mode === 'installment' && item.installment_count) {
      // Se é parcelado, calcular valor da parcela
      const installmentAmount = item.asset_value / item.installment_count;
      allocatedAmount = item.type === 'goal' ? -installmentAmount : installmentAmount;
    } else if (item.payment_mode === 'repeat' && item.installment_count) {
      // Se é recorrente, usar o valor total
      allocatedAmount = item.type === 'goal' ? -item.asset_value : item.asset_value;
    }

    console.log('Valor alocado calculado:', allocatedAmount);

    const newItem: LinkedItem = {
      id: item.id,
      type: item.type, // Agora sabemos que item.type existe
      name: item.name,
      allocatedAmount,
      isCompleting: false,
      icon: item.icon
    };
    
    console.log('Novo item criado:', newItem);
    
    setSelectedItems(prev => {
      const updated = [...prev, newItem];
      console.log('Lista de itens atualizada após seleção:', updated);
      console.log('Total de itens selecionados:', updated.length);
      return updated;
    });
  };

  const handleUpdateItem = (itemId: string, updates: Partial<LinkedItem>) => {
    console.log('Atualizando item:', itemId, 'com updates:', updates);
    setSelectedItems(prev => {
      const updated = prev.map(item => item.id === itemId ? { ...item, ...updates } : item);
      console.log('Lista atualizada após update:', updated);
      return updated;
    });
  };

  const handleRemoveItem = (itemId: string) => {
    console.log('Removendo item:', itemId);
    setSelectedItems(prev => {
      const filtered = prev.filter(item => item.id !== itemId);
      console.log('Lista atualizada após remoção:', filtered);
      return filtered;
    });
  };

  // Função para processar itens finalizados
  const processCompletingItems = async (completingItems: LinkedItem[], recordMonth: number, recordYear: number) => {
    for (const item of completingItems) {
      try {
        console.log(`Processando item finalizado: ${item.type} - ${item.id}`);
        
        // Calcular o valor total de todos os links para este item
        const { data: allLinks, error: linksError } = await supabase
          .from('financial_record_links')
          .select('allocated_amount')
          .eq('item_id', item.id)
          .eq('item_type', item.type);

        if (linksError) {
          console.error('Erro ao buscar links para cálculo:', linksError);
          continue;
        }

        // Somar todos os valores alocados
        const totalAllocated = allLinks.reduce((sum, link) => sum + (link.allocated_amount || 0), 0);
        console.log(`Valor total alocado para ${item.type} ${item.id}: ${totalAllocated}`);

        // Para goals, converter para positivo (despesa), para events manter o sinal
        const finalValue = item.type === 'goal' ? Math.abs(totalAllocated) : totalAllocated;
        console.log(`Valor final para ${item.type} ${item.id}: ${finalValue} (${item.type === 'goal' ? 'despesa positiva' : 'mantém sinal'})`);

        // Atualizar o item com a data do registro e o valor total
        const tableName = item.type === 'goal' ? 'financial_goals' : 'events';
        const { error: updateError } = await supabase
          .from(tableName)
          .update({ 
            month: recordMonth,
            year: recordYear,
            asset_value: finalValue, // Atualizar com o valor final (positivo para goals)
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);

        if (updateError) {
          console.error(`Erro ao atualizar ${item.type}:`, updateError);
        } else {
          console.log(`${item.type} ${item.id} atualizado com sucesso - Data: ${recordMonth}/${recordYear}, Valor: ${totalAllocated}`);
        }
      } catch (error) {
        console.error(`Erro ao processar ${item.type} ${item.id}:`, error);
      }
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const recordDate = new Date(values.record_year, values.record_month - 1);
    const planInitialDateRaw = new Date(investmentPlan.plan_initial_date);
    const planInitialDate = new Date(planInitialDateRaw.getFullYear(), planInitialDateRaw.getMonth(), 1);
    if (recordDate < planInitialDate) {
      toast({
        title: t('financialRecords.errors.beforePlanInitialDate'),
        description: t('financialRecords.errors.beforePlanInitialDateDescription', { date: planInitialDate.toLocaleDateString() }),
        variant: "destructive",
      });
      return;
    }
    onSubmit(values);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    
    try {
      const growth_percentage = (((values.ending_balance - values.starting_balance) / values.starting_balance) * 100) || 0;

      const recordData = {
        ...values,
        growth_percentage,
        user_id: clientId,
      };

      const { ...finalRecordData } = recordData;

      if (editingRecord) {
        const { data, error } = await supabase
          .from('user_financial_records')
          .update(finalRecordData)
          .eq('id', editingRecord.id)
          .select()
          .single();

        if (error) throw error;

        // Criar os links se houver itens selecionados (para edição também)
        console.log('Editando registro - Itens selecionados para criar links:', selectedItems);
        console.log('ID do registro financeiro editado:', data.id);
        
        if (selectedItems.length > 0) {
          const linkData = selectedItems.map(item => {
            console.log('Processando item para edição:', item);
            console.log('Item ID starts with temp-?', item.id.startsWith('temp-'));
            
            const link = {
              financial_record_id: data.id,
              item_id: item.id.startsWith('temp-') ? null : item.id, // Ignorar IDs temporários
              item_type: item.type,
              allocated_amount: item.allocatedAmount,
              is_completing: item.isCompleting
            };
            console.log('Link individual para edição:', link);
            return link;
          }).filter(link => {
            console.log('Filtrando link para edição:', link, 'item_id !== null?', link.item_id !== null);
            return link.item_id !== null;
          }); // Filtrar apenas itens existentes

          console.log('Dados dos links para edição:', linkData);

          if (linkData.length > 0) {
            console.log('Tentando criar links na tabela financial_record_links para edição...');
            
            console.log('Tentando inserir na tabela financial_record_links com dados:', linkData);
            
            const { data: insertedLinks, error: linksError } = await supabase
              .from('financial_record_links')
              .insert(linkData)
              .select();

            if (linksError) {
              console.error('Error creating links para edição:', linksError);
              console.error('Detalhes do erro:', {
                code: linksError.code,
                message: linksError.message,
                details: linksError.details,
                hint: linksError.hint
              });
              // Não falhar se os links não puderem ser criados
            } else {
              console.log('Links criados com sucesso para edição!', insertedLinks);
              // Notificar que os links foram atualizados
              if (onLinksUpdated) {
                onLinksUpdated();
              }
            }

            // Processar itens marcados como concluídos
            const completingItems = selectedItems.filter(item => 
              item.isCompleting && !item.id.startsWith('temp-')
            );

            if (completingItems.length > 0) {
              await processCompletingItems(completingItems, values.record_month, values.record_year);
            }
          }
        }

        // Atualizar o cache do registro financeiro
        queryClient.setQueryData(['financialRecords', clientId], (oldData: FinancialRecord[] | undefined) => {
          if (!oldData) return [data];
          const updatedRecords = oldData.map(record => 
            record.id === editingRecord.id ? data : record
          );
          return sortRecords(updatedRecords);
        });

        // Invalidar queries relacionadas para forçar atualização dos links
        await queryClient.invalidateQueries({
          queryKey: ['financialRecords', clientId]
        });
        
        // Invalidar também queries específicas de links se existirem
        await queryClient.invalidateQueries({
          queryKey: ['linkedItems']
        });
        
        // Forçar atualização dos dados relacionados
        await queryClient.invalidateQueries({
          queryKey: ['financialRecords', clientId, 'links']
        });

        toast({ title: t('financialRecords.success.updated') });
      } else {
        const { data, error } = await supabase
          .from('user_financial_records')
          .insert([finalRecordData])
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

        // Criar os links se houver itens selecionados
        console.log('Itens selecionados para criar links:', selectedItems);
        console.log('ID do registro financeiro criado:', data.id);
        
        if (selectedItems.length > 0) {
          const linkData = selectedItems.map(item => {
            console.log('Processando item:', item);
            console.log('Item ID starts with temp-?', item.id.startsWith('temp-'));
            
            const link = {
              financial_record_id: data.id,
              item_id: item.id.startsWith('temp-') ? null : item.id, // Ignorar IDs temporários
              item_type: item.type,
              allocated_amount: item.allocatedAmount,
              is_completing: item.isCompleting
            };
            console.log('Link individual:', link);
            return link;
          }).filter(link => {
            console.log('Filtrando link:', link, 'item_id !== null?', link.item_id !== null);
            return link.item_id !== null;
          }); // Filtrar apenas itens existentes

          console.log('Dados dos links a serem criados:', linkData);

          if (linkData.length > 0) {
            console.log('Tentando criar links na tabela financial_record_links...');
            console.log('Estrutura da tabela esperada:', {
              financial_record_id: 'integer',
              item_id: 'uuid',
              item_type: 'varchar (goal/event)',
              allocated_amount: 'numeric',
              is_completing: 'boolean'
            });
            
            console.log('Tentando inserir na tabela financial_record_links com dados:', linkData);
            
            const { data: insertedLinks, error: linksError } = await supabase
              .from('financial_record_links')
              .insert(linkData)
              .select();

            if (linksError) {
              console.error('Error creating links:', linksError);
              console.error('Detalhes do erro:', {
                code: linksError.code,
                message: linksError.message,
                details: linksError.details,
                hint: linksError.hint
              });
              // Não falhar se os links não puderem ser criados
            } else {
              console.log('Links criados com sucesso!', insertedLinks);
              // Notificar que os links foram atualizados
              if (onLinksUpdated) {
                onLinksUpdated();
              }
            }

            // Processar itens marcados como concluídos
            const completingItems = selectedItems.filter(item => 
              item.isCompleting && !item.id.startsWith('temp-')
            );

            if (completingItems.length > 0) {
              await processCompletingItems(completingItems, values.record_month, values.record_year);
            }
          }
        }

        // Atualizar o cache do registro financeiro
        queryClient.setQueryData(['financialRecords', clientId], (oldData: FinancialRecord[] | undefined) => {
          if (!oldData) return [data];
          return sortRecords([...oldData, data]);
        });

        // Invalidar queries relacionadas para forçar atualização dos links
        await queryClient.invalidateQueries({
          queryKey: ['financialRecords', clientId]
        });
        
        // Invalidar também queries específicas de links se existirem
        await queryClient.invalidateQueries({
          queryKey: ['linkedItems']
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
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">{t('financialRecords.form.basicInfo')}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="record_month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">{t('financialRecords.form.month')}</FormLabel>
                  <select
                    {...field}
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                    className="w-full h-12 px-4 py-2 text-sm rounded-lg border border-input bg-background text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors appearance-none dark:[color-scheme:dark] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA5TDEyIDE1TDE4IDkiIHN0cm9rZT0iIzYxNjE2MSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-no-repeat bg-[right_1rem_center]"
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="1">{t('date.months.january')}</option>
                    <option value="2">{t('date.months.february')}</option>
                    <option value="3">{t('date.months.march')}</option>
                    <option value="4">{t('date.months.april')}</option>
                    <option value="5">{t('date.months.may')}</option>
                    <option value="6">{t('date.months.june')}</option>
                    <option value="7">{t('date.months.july')}</option>
                    <option value="8">{t('date.months.august')}</option>
                    <option value="9">{t('date.months.september')}</option>
                    <option value="10">{t('date.months.october')}</option>
                    <option value="11">{t('date.months.november')}</option>
                    <option value="12">{t('date.months.december')}</option>
                  </select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="record_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">{t('financialRecords.form.year')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                      className="h-12"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">{t('financialRecords.form.balances')}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              key={'starting_balance'}
              control={form.control}
              name={'starting_balance'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">{t(`financialRecords.form.startingBalance`)}</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      id={'starting_balance'}
                      className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                      prefix={getCurrencySymbol(investmentPlan?.currency as CurrencyCode)}
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
                  <FormLabel className="text-sm font-medium text-muted-foreground">{t(`financialRecords.form.endingBalance`)}</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      id={'ending_balance'}
                      className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                      prefix={getCurrencySymbol(investmentPlan?.currency as CurrencyCode)}
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">{t('financialRecords.form.contributions')}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="monthly_contribution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">{t('financialRecords.form.monthlyContribution')}</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      id="monthly_contribution"
                      className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                      prefix={getCurrencySymbol(investmentPlan?.currency as CurrencyCode)}
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
                  <FormLabel className="text-sm font-medium text-muted-foreground">{t('financialRecords.form.targetRentability')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))} 
                      className="h-12"
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">{t('financialRecords.form.returns')}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="monthly_return"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">{t('financialRecords.form.monthlyReturn')}</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      id="monthly_return"
                      className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                      prefix={getCurrencySymbol(investmentPlan?.currency as CurrencyCode)}
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
                  <FormLabel className="text-sm font-medium text-muted-foreground">{t('financialRecords.form.monthlyReturnRate')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))} 
                      className="h-12"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>



      {/* Seção de link com objetivos/eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Vincular a Objetivos/Eventos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Vincule este registro a objetivos ou eventos existentes ou crie novos
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowGoalEventOptions(!showGoalEventOptions)}
            >
              {showGoalEventOptions ? 'Ocultar' : 'Vincular'}
            </Button>
          </div>

          {showGoalEventOptions && (
            <Tabs defaultValue="existing" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Vincular Existente</TabsTrigger>
                <TabsTrigger value="create">Criar Novo</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4">
                <SelectExistingItems
                  onSelect={handleSelectExistingItem}
                  selectedItems={selectedItems}
                  userId={clientId}
                  currency={investmentPlan.currency as CurrencyCode}
                />
              </TabsContent>

              <TabsContent value="create" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    type="button"
                    variant={newItemType === 'goal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewItemType('goal')}
                  >
                    Objetivo
                  </Button>
                  <Button
                    type="button"
                    variant={newItemType === 'event' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewItemType('event')}
                  >
                    Evento
                  </Button>
                </div>
                
                <FinancialItemForm
                  type={newItemType}
                  onSubmit={handleCreateItem}
                  onCancel={() => {}} // Não precisa cancelar aqui
                  currency="BRL"
                  showTypeSelector={false}
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Lista dos itens selecionados */}
          {selectedItems.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Itens Vinculados ({selectedItems.length})</h4>
              <div className="space-y-3">
                {selectedItems.map((item) => (
                  <SelectedItemCard
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                    onRemove={() => handleRemoveItem(item.id)}
                    currency={investmentPlan.currency as CurrencyCode}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <Button 
          type="button" 
          variant="outline"
          onClick={onSuccess}
          disabled={isSaving}
          className="px-6 py-2 text-foreground hover:bg-muted"
        >
          {t('common.cancel')}
        </Button>
        <Button 
          type="submit" 
          className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 ${isSaving ? 'opacity-70 scale-95' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? t('common.saving') : editingRecord ? t('common.update') : t('common.save')}
        </Button>
      </div>
    </form>
  );

  return (
    <div className={editingRecord ? "mt-4 border-t border-border pt-4" : ""}>
      <Form {...form}>
        {!editingRecord ? (
          <Card className="p-6 bg-card rounded-lg shadow-sm border border-border">
            {renderFormFields()}
          </Card>
        ) : (
          renderFormFields()
        )}
      </Form>
    </div>
  );
}; 