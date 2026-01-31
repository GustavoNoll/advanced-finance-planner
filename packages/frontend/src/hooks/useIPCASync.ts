import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { fetchIPCARates, fetchUSCPIRates, fetchEuroCPIRates } from "@/lib/bcb-api";
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math";
import { FinancialRecord, InvestmentPlan, MicroInvestmentPlan } from "@/types/financial";
import { getActiveMicroPlanForDate } from '@/utils/microPlanUtils';

interface SyncResult {
  count: number;
  updates: Array<{
    id: string;
    target_rentability: number;
  }>;
}

export const useIPCASync = (clientId: string | undefined, records: FinancialRecord[] | undefined, investmentPlan: InvestmentPlan | null, microPlans: MicroInvestmentPlan[]) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const syncIPCAMutation = useMutation({
    mutationFn: async (): Promise<SyncResult> => {
      if (!clientId || !records?.length || !investmentPlan || microPlans.length === 0) {
        return { count: 0, updates: [] };
      }
      
      try {
        // Find the oldest record's date
        const sortedRecords = [...records].sort((a, b) => {
          if (a.record_year !== b.record_year) {
            return a.record_year - b.record_year;
          }
          return a.record_month - b.record_month;
        });
        
        const oldestRecord = sortedRecords[0];
        const startDate = `01/${oldestRecord.record_month.toString().padStart(2, '0')}/${oldestRecord.record_year}`;
        const endDate = new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        // Fetch appropriate CPI rates based on currency
        const response = investmentPlan.currency === 'USD' 
          ? fetchUSCPIRates(startDate, endDate)
          : investmentPlan.currency === 'EUR'
          ? fetchEuroCPIRates(startDate, endDate)
          : fetchIPCARates(startDate, endDate);
        
        // Create a map of CPI rates by month/year for easier lookup
        const cpiRateMap = new Map();
        response.forEach(item => {
          const date = new Date(item.date);
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          cpiRateMap.set(key, Number(item.monthlyRate));
        });
        
        // Prepare batch updates for each record that has a matching CPI rate
        const updates = [];
        let updatedCount = 0;
        
        for (const record of records) {
          const recordKey = `${record.record_year}-${record.record_month}`;
          if (cpiRateMap.has(recordKey)) {
            const cpiRate = cpiRateMap.get(recordKey);
            
            // Encontrar o micro plano ativo para a data do record
            const recordDate = new Date(record.record_year, record.record_month - 1, 1);
            const activeMicroPlanForRecord = getActiveMicroPlanForDate(microPlans, recordDate);
            
            // Usar o expected_return do micro plano ativo ou default de 8%
            const expectedReturn = activeMicroPlanForRecord.expected_return;
            
            const cpiRateConverted = parseFloat((
              calculateCompoundedRates([
                cpiRate/100, 
                yearlyReturnRateToMonthlyReturnRate(expectedReturn/100)
              ]) * 100
            ).toFixed(2));
            
            const parsedTargetRentability = parseFloat(record.target_rentability?.toFixed(2) || '0');
            if (parsedTargetRentability !== cpiRateConverted) {
              updates.push({
                id: record.id,
                target_rentability: cpiRateConverted
              });
              updatedCount++;
            }
          }
        }
        
        // Update records with matching CPI rates
        if (updates.length > 0) {
          for (const update of updates) {
            const { error } = await supabase
              .from('user_financial_records')
              .update({ target_rentability: update.target_rentability })
              .eq('id', update.id);
            
            if (error) {
              console.error(`Error updating record ${update.id}:`, error);
              throw error;
            }
          }
        }
        
        return { count: updatedCount, updates };
      } catch (error) {
        console.error('Error syncing CPI rates:', error);
        throw error;
      }
    },
    onSuccess: (result) => {
      if (!result) return;
      
      // Update the records in the query cache
      queryClient.setQueryData(['allFinancialRecords', clientId], (oldData: FinancialRecord[] | undefined) => {
        if (!oldData) return [];
        
        return oldData.map(record => {
          const update = result.updates.find(u => u.id === record.id);
          return update 
            ? { ...record, target_rentability: update.target_rentability }
            : record;
        });
      });
      
      if (result.count > 0) {        
        toast({
          title: t('financialRecords.ipcaSyncSuccess', { 
            count: result.count,
          }),
        });
      }
    },
    onError: (error) => {
      console.error('Error syncing CPI rates:', error);
      toast({
        title: t('financialRecords.errors.ipcaSyncFailed'),
        variant: "destructive",
      });
    },
  });

  return {
    syncIPCA: syncIPCAMutation.mutate,
    isSyncing: syncIPCAMutation.isPending,
  };
}; 