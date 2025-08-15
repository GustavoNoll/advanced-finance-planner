import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { FinancialRecordsManagementService, CSVRecord, ImportResult, SyncResult } from '@/services/financial-records-management.service'
import { FinancialRecord, InvestmentPlan } from '@/types/financial'
import { useMemo } from 'react'

export interface FinancialRecordsStats {
  total: number
  totalStartingBalance: number
  totalEndingBalance: number
  totalMonthlyContribution: number
  totalMonthlyReturn: number
  averageMonthlyReturnRate: number
  totalGrowth: number
}

export function useFinancialRecords(userId: string, initialRecords: FinancialRecord[] = []) {
  const { data: records, isLoading, error } = useQuery({
    queryKey: ['financialRecords', userId],
    queryFn: () => FinancialRecordsManagementService.fetchRecordsByUserId(userId),
    enabled: !!userId,
    initialData: initialRecords.length > 0 ? initialRecords : undefined,
    staleTime: 0,
  })

  const sortedRecords = useMemo(() => {
    return FinancialRecordsManagementService.sortRecords(records || [])
  }, [records])

  const stats = useMemo(() => {
    return FinancialRecordsManagementService.calculateRecordsStats(records || [])
  }, [records])

  return {
    records: records || [],
    sortedRecords,
    stats,
    isLoading,
    error
  }
}

export function useInvestmentPlan(userId: string) {
  const { data: investmentPlan, isLoading, error } = useQuery({
    queryKey: ['investmentPlan', userId],
    queryFn: () => FinancialRecordsManagementService.fetchInvestmentPlanByUserId(userId),
    enabled: !!userId,
  })

  return {
    investmentPlan,
    isLoading,
    error
  }
}

export function useFinancialRecordsMutations(userId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createRecord = useMutation({
    mutationFn: (recordData: Partial<FinancialRecord>) => 
      FinancialRecordsManagementService.createRecord(recordData),
    onSuccess: (newRecord) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['financialRecords', userId] })
      
      toast({
        title: 'Registro financeiro criado com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error creating financial record:', error)
      toast({
        title: 'Erro ao criar registro financeiro',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const updateRecord = useMutation({
    mutationFn: ({ recordId, recordData }: { recordId: string; recordData: Partial<FinancialRecord> }) =>
      FinancialRecordsManagementService.updateRecord(recordId, recordData),
    onSuccess: (updatedRecord) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['financialRecords', userId] })
      
      toast({
        title: 'Registro financeiro atualizado com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error updating financial record:', error)
      toast({
        title: 'Erro ao atualizar registro financeiro',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const deleteRecord = useMutation({
    mutationFn: (recordId: string) => FinancialRecordsManagementService.deleteRecord(recordId),
    onSuccess: (deletedId) => {
      // Atualizar cache local
      queryClient.setQueryData(['financialRecords', userId], (oldData: FinancialRecord[] | undefined) => {
        if (!oldData) return []
        return FinancialRecordsManagementService.sortRecords(oldData.filter(record => record.id !== deletedId))
      })
      
      toast({
        title: 'Registro financeiro removido com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error deleting financial record:', error)
      toast({
        title: 'Erro ao remover registro financeiro',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const deleteAllRecords = useMutation({
    mutationFn: () => FinancialRecordsManagementService.deleteAllRecordsByUserId(userId),
    onSuccess: () => {
      // Limpar cache local
      queryClient.setQueryData(['financialRecords', userId], [])
      
      toast({
        title: 'Todos os registros foram removidos com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error deleting all financial records:', error)
      toast({
        title: 'Erro ao remover registros financeiros',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const importRecords = useMutation({
    mutationFn: ({ records, investmentPlan }: { records: CSVRecord[]; investmentPlan: InvestmentPlan | null }) =>
      FinancialRecordsManagementService.importRecords(records, userId, investmentPlan),
    onSuccess: (result: ImportResult) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['financialRecords', userId] })
      
      if (result.failed > 0) {
        const errorsByType = result.errors.reduce((acc, curr) => {
          if (!acc[curr.reason]) {
            acc[curr.reason] = []
          }
          acc[curr.reason].push(curr.date)
          return acc
        }, {} as Record<string, string[]>)

        const errorMessage = Object.entries(errorsByType)
          .map(([reason, dates]) => {
            const datesStr = dates.join(', ')
            return `${reason}:\n${datesStr}`
          })
          .join('\n\n')

        toast({
          title: `Importação parcial: ${result.success} sucessos, ${result.failed} falhas`,
          description: errorMessage,
          variant: "destructive",
          duration: 10000,
        })
      } else {
        toast({
          title: `Importação bem-sucedida: ${result.success} registros importados`,
        })
      }
    },
    onError: (error) => {
      console.error('Error importing records:', error)
      toast({
        title: 'Erro ao importar registros',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const syncInflationRates = useMutation({
    mutationFn: ({ records, investmentPlan }: { records: FinancialRecord[]; investmentPlan: InvestmentPlan | null }) =>
      FinancialRecordsManagementService.syncInflationRates(records, investmentPlan),
    onSuccess: (result: SyncResult) => {
      // Atualizar cache local com as novas taxas de rentabilidade
      queryClient.setQueryData(['financialRecords', userId], (oldData: FinancialRecord[] | undefined) => {
        if (!oldData) return []
        
        return oldData.map(record => {
          const update = result.updates.find(u => u.id === record.id)
          if (update) {
            return {
              ...record,
              target_rentability: update.target_rentability
            }
          }
          return record
        })
      })
      
      if (result.count > 0) {
        toast({
          title: `Sincronização bem-sucedida: ${result.count} registros atualizados`,
        })
      } else {
        toast({
          title: 'Nenhum registro foi atualizado',
        })
      }
    },
    onError: (error) => {
      console.error('Error syncing inflation rates:', error)
      toast({
        title: 'Erro ao sincronizar taxas de inflação',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  return {
    createRecord,
    updateRecord,
    deleteRecord,
    deleteAllRecords,
    importRecords,
    syncInflationRates,
  }
}
