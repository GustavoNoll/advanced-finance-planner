import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, LogOut, RefreshCcw, Upload, Pencil, MoreVertical } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Papa from 'papaparse';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

interface CSVRecord {
  Data: string;
  PatrimonioInicial: string;
  Aporte: string;
  PatrimonioFinal: string;
  RetornoPercentual: string;
  RentabilidadeMeta: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ date: string; reason: string }>;
}

const FinancialRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const clientId = params.id || user?.id;
  const queryClient = useQueryClient();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const { data: records, isLoading: recordsLoading } = useQuery({
    queryKey: ['financialRecords', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from('user_financial_records')
        .select('*')
        .eq('user_id', clientId)
        .order('record_year', { ascending: false })
        .order('record_month', { ascending: false });

      if (error) {
        console.error('Error fetching financial records:', error);
        toast({
          title: t('financialRecords.errors.fetchFailed'),
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!clientId,
  });

  const { data: investmentPlan } = useQuery({
    queryKey: ['investmentPlan', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      
      const { data, error } = await supabase
        .from('investment_plans')
        .select('monthly_deposit')
        .eq('user_id', clientId)
        .single();

      if (error) {
        console.error('Error fetching investment plan:', error);
        return null;
      }

      return data;
    },
    enabled: !!clientId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (recordId: number) => {
      const { error } = await supabase
        .from('user_financial_records')
        .delete()
        .eq('id', recordId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords', clientId] });
      toast({
        title: t('financialRecords.deleteSuccess'),
      });
    },
    onError: (error) => {
      console.error('Error deleting record:', error);
      toast({
        title: t('financialRecords.errors.deleteFailed'),
        variant: "destructive",
      });
    },
  });

  const importMutation = useMutation({
    mutationFn: async (records: CSVRecord[]): Promise<ImportResult> => {
      const result: ImportResult = { success: 0, failed: 0, errors: [] };
      
      // Primeiro, busca todos os registros existentes para o usuário
      const { data: existingRecords } = await supabase
        .from('user_financial_records')
        .select('record_year, record_month')
        .eq('user_id', clientId);

      const existingDates = new Set(
        existingRecords?.map(r => `${r.record_year}-${r.record_month}`) || []
      );

      const validateRecord = (record: any): ValidationResult => {
        if (!record.record_year || !record.record_month) {
          return { valid: false, error: 'Data inválida' };
        }
        
        if (existingDates.has(`${record.record_year}-${record.record_month}`)) {
          return { valid: false, error: 'Já existe um registro para este mês' };
        }

        if (isNaN(record.starting_balance) || record.starting_balance < 0) {
          return { valid: false, error: 'Patrimônio inicial inválido' };
        }

        if (isNaN(record.ending_balance) || record.ending_balance < 0) {
          return { valid: false, error: 'Patrimônio final inválido' };
        }

        if (isNaN(record.monthly_contribution)) {
          return { valid: false, error: 'Aporte mensal inválido' };
        }

        return { valid: true };
      };

      // Formata e valida todos os registros primeiro
      const formattedRecords = records.map(record => {
        try {
          const [_, month, year] = record.Data.split('/');
          const formattedRecord = {
            user_id: clientId,
            record_year: parseInt(year),
            record_month: parseInt(month),
            starting_balance: parseFloat(record.PatrimonioInicial.replace('R$ ', '').replace('.', '').replace(',', '.')),
            monthly_contribution: parseFloat(record.Aporte.replace('R$ ', '').replace('.', '').replace(',', '.')),
            ending_balance: parseFloat(record.PatrimonioFinal.replace('R$ ', '').replace('.', '').replace(',', '.')),
            monthly_return_rate: parseFloat(record.RetornoPercentual.replace('%', '').replace(',', '.')),
            target_rentability: parseFloat(record.RentabilidadeMeta.replace('%', '').replace(',', '.')),
            growth_percentage: null,
          };
          formattedRecord.growth_percentage = ((formattedRecord.ending_balance - formattedRecord.starting_balance) / formattedRecord.starting_balance) * 100;

          const validation = validateRecord(formattedRecord);
          
          return {
            record: formattedRecord,
            isValid: validation.valid,
            error: validation.error,
            originalDate: record.Data
          };
        } catch (error) {
          return {
            record: null,
            isValid: false,
            error: 'Erro ao processar registro',
            originalDate: record.Data
          };
        }
      });

      // Filtra apenas os registros válidos
      const validRecords = formattedRecords
        .filter(r => r.isValid)
        .map(r => r.record);

      // Registra os erros
      formattedRecords
        .filter(r => !r.isValid)
        .forEach(r => {
          result.failed++;
          result.errors.push({
            date: r.originalDate,
            reason: r.error || 'Erro desconhecido'
          });
        });

      // Se houver registros válidos, tenta inserir
      if (validRecords.length > 0) {
        const { error } = await supabase
          .from('user_financial_records')
          .insert(validRecords);

        if (error) {
          throw error;
        }
        
        result.success = validRecords.length;
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords', clientId] });
      
      if (result.failed > 0) {
        // Agrupa os erros por tipo para melhor visualização
        const errorsByType = result.errors.reduce((acc, curr) => {
          if (!acc[curr.reason]) {
            acc[curr.reason] = [];
          }
          acc[curr.reason].push(curr.date);
          return acc;
        }, {} as Record<string, string[]>);

        // Formata a mensagem de erro de forma mais organizada
        const errorMessage = Object.entries(errorsByType)
          .map(([reason, dates]) => {
            const datesStr = dates.join(', ');
            return `${reason}:\n${datesStr}`;
          })
          .join('\n\n');

        toast({
          title: t('financialRecords.partialImport', {
            success: result.success,
            failed: result.failed
          }),
          description: errorMessage,
          variant: "destructive",
          duration: 10000,
        });
      } else {
        toast({
          title: t('financialRecords.importSuccess', {
            count: result.success
          }),
        });
      }
    },
    onError: (error) => {
      console.error('Error importing records:', error);
      toast({
        title: t('financialRecords.errors.importFailed'),
        variant: "destructive",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!clientId) return;
      
      const { error } = await supabase
        .from('user_financial_records')
        .delete()
        .eq('user_id', clientId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords', clientId] });
      toast({
        title: t('financialRecords.resetSuccess'),
      });
    },
    onError: (error) => {
      console.error('Error resetting records:', error);
      toast({
        title: t('financialRecords.errors.resetFailed'),
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (recordId: number) => {
    if (window.confirm(t('financialRecords.confirmDelete'))) {
      await deleteMutation.mutate(recordId);
    }
  };

  const handleReset = async () => {
    if (window.confirm(t('financialRecords.confirmReset'))) {
      await resetMutation.mutate();
    }
  };

  const formatMonth = (month: number) => {
    return t(`monthlyView.table.months.${new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' })}`);
  };

  const formatDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const records = results.data
          .map((row: any) => {
            if (Object.keys(row).length >= 6) {
              const record: CSVRecord = {
                Data: row.Data,
                PatrimonioInicial: row.PatrimonioInicial,
                Aporte: row.Aporte,
                PatrimonioFinal: row.PatrimonioFinal,
                RetornoPercentual: row.RetornoPercentual,
                RentabilidadeMeta: row.RentabilidadeMeta
              };
              return record;
            }
            return null;
          })
          .filter((record): record is CSVRecord => record !== null);

        if (records.length > 0) {
          await importMutation.mutate(records);
          setIsImportDialogOpen(false);
        } else {
          toast({
            title: t('financialRecords.errors.invalidFormat'),
            variant: "destructive",
          });
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        toast({
          title: t('financialRecords.errors.invalidFormat'),
          variant: "destructive",
        });
      }
    });
  };

  if (recordsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="w-1/3">
              <Link to={params.id ? `/client/${params.id}` : "/"}>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center w-1/3">
              <h1 className="text-xl font-semibold text-gray-900">{t('financialRecords.title')}</h1>
            </div>

            <div className="flex justify-end w-1/3">
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link to={`/financial-records/new${params.id ? `?client_id=${params.id}` : ''}`}>
            <Button 
              variant="ghost"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{t('financialRecords.addNew')}</span>
              </div>
            </Button>
          </Link>

          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost"
                className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{t('financialRecords.importButton')}</span>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>{t('financialRecords.importTitle')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">{t('financialRecords.importInstructions')}</p>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">Data</th>
                        <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">PatrimonioInicial</th>
                        <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">Aporte</th>
                        <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">PatrimonioFinal</th>
                        <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">RetornoPercentual</th>
                        <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">RentabilidadeMeta</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700">01/08/2023</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700">R$ 51.447,92</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700">R$ 4.000,00</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700">R$ 55.992,62</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700">1,19%</td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700">0,64%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="w-full"
                />
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="ghost"
            onClick={handleReset}
            className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-red-50 hover:to-red-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-gray-700">{t('financialRecords.resetRecords')}</span>
            </div>
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4">
          {records?.length === 0 ? (
            <Card className="p-6">
              <p className="text-center text-gray-500">{t('financialRecords.noRecords')}</p>
            </Card>
          ) : (
            records?.map((record) => (
              <Card key={record.id} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {formatMonth(record.record_month)} {record.record_year}
                      <div className="text-sm text-gray-500">
                        {formatDate(record.record_month, record.record_year)}
                      </div>
                    </h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('financialRecords.startingBalance')}</p>
                    <p className="font-semibold">{formatCurrency(record.starting_balance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('financialRecords.monthlyContribution')}</p>
                    <div>
                      <p className={`font-semibold ${
                        investmentPlan?.monthly_deposit && 
                        record.monthly_contribution >= investmentPlan.monthly_deposit 
                          ? 'text-green-600' 
                          : ''
                      }`}>
                        {formatCurrency(record.monthly_contribution)}
                      </p>
                      {investmentPlan?.monthly_deposit && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Meta: {formatCurrency(investmentPlan.monthly_deposit)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('financialRecords.endingBalance')}</p>
                    <p className="font-semibold">{formatCurrency(record.ending_balance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('financialRecords.growth')}</p>
                    <p className={`font-semibold ${record.monthly_return_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {record.monthly_return_rate}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/financial-records/edit/${record.id}${params.id ? `?client_id=${params.id}` : ''}`)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default FinancialRecords; 