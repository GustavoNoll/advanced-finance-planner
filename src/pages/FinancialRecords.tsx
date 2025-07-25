import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, RefreshCcw, Upload, Pencil, MoreVertical } from "lucide-react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Papa from 'papaparse';
import { Spinner } from "@/components/ui/spinner";
import { AddRecordForm } from "@/components/financial-records/AddRecordForm";
import { FinancialRecord, InvestmentPlan } from "@/types/financial";
import { fetchIPCARates, fetchUSCPIRates, fetchEuroCPIRates } from "@/lib/bcb-api";
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { formatCurrency, CurrencyCode, getCurrencySymbol } from "@/utils/currency";

interface CSVRecord {
  Data: string;
  PatrimonioInicial: string;
  Aporte: string;
  PatrimonioFinal: string;
  Retorno: string;
  RetornoPercentual: string;
  RentabilidadeMeta: string;
  Eventos: string;
}

interface CSVRow {
  Data: string;
  PatrimonioInicial: string;
  Aporte: string;
  PatrimonioFinal: string;
  Retorno: string;
  RetornoPercentual: string;
  RentabilidadeMeta: string;
  Eventos: string;
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

interface LocationState {
  records?: FinancialRecord[];
}

interface CSVRecordValidation {
  record_year: number;
  record_month: number;
  starting_balance: number;
  ending_balance: number;
  monthly_contribution: number;
  monthly_return: number;
}

const sortRecords = (records: FinancialRecord[]) => {
  return records.sort((a, b) => {
    if (a.record_year !== b.record_year) {
      return b.record_year - a.record_year;
    }
    return b.record_month - a.record_month;
  });
};

const parseCurrencyValue = (value: string, currency: CurrencyCode) => {
  if (!value) return 0;
  
  // Remove currency symbol and spaces
  const cleanValue = value.replace(getCurrencySymbol(currency), '').trim();
  
  // Check if the value is negative (starts with - or has - after R$)
  const isNegative = cleanValue.startsWith('-') || cleanValue.includes(' -');
  
  // Remove all non-numeric characters except decimal separator
  const numericValue = cleanValue.replace(/[^\d,-]/g, '');
  
  // Replace comma with dot for decimal point
  const normalizedValue = numericValue.replace(',', '.');
  
  // Parse the number and apply negative sign if needed
  const parsedValue = parseFloat(normalizedValue);
  return isNegative ? -Math.abs(parsedValue) : parsedValue;
};

const FinancialRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const clientId = params.id || user?.id;
  const queryClient = useQueryClient();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const location = useLocation();
  const state = location.state as LocationState;
  const initialRecords = state?.records || [];
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animationPosition, setAnimationPosition] = useState<{ top: number; left: number } | null>(null);
  const [updatedRecordIds, setUpdatedRecordIds] = useState<string[]>([]);
  const [brokerProfile, setBrokerProfile] = useState<{ is_broker: boolean; id: string } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [isValidating, setIsValidating] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_broker, id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        setBrokerProfile(data);
        
        // If user is a broker and trying to access client data (not their own)
        if (data.is_broker && clientId !== user.id) {
          // Fetch client profile to check broker_id
          const { data: clientProfile, error: clientError } = await supabase
            .from('profiles')
            .select('broker_id')
            .eq('id', clientId)
            .single();
            
          if (clientError) {
            console.error('Error fetching client profile:', clientError);
            // Handle not found client
            if (clientError.code === 'PGRST116') {
              setIsAuthorized(false);
              toast({
                title: t('dashboard.messages.errors.unauthorizedAccess'),
                description: t('dashboard.messages.errors.clientNotAssociated'),
                variant: "destructive",
              });
              navigate('/broker-dashboard');
            }
            return;
          }
          
          // Check if client belongs to this broker
          if (clientProfile.broker_id !== user.id) {
            setIsAuthorized(false);
            toast({
              title: t('dashboard.messages.errors.unauthorizedAccess'),
              description: t('dashboard.messages.errors.clientNotAssociated'),
              variant: "destructive",
            });
            navigate('/broker-dashboard');
            return;
          }
        }
        
        setIsValidating(false);
      } catch (error) {
        console.error('Error in authorization check:', error);
        setIsValidating(false);
      }
    };

    fetchProfile();
  }, [user?.id, clientId, navigate, t]);

  const { data: records, isLoading: recordsLoading } = useQuery({
    queryKey: ['financialRecords', clientId],
    queryFn: async () => {
      if (!clientId || !isAuthorized) return [];
      
      if (initialRecords.length > 0) {
        return initialRecords;
      }

      const { data, error } = await supabase
        .from('user_financial_records')
        .select('*')
        .eq('user_id', clientId)
        .order('record_year', { ascending: false })
        .order('record_month', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    initialData: initialRecords,
    enabled: !!clientId && !isValidating && isAuthorized,
    staleTime: 0,
  });

  const { data: investmentPlan } = useQuery({
    queryKey: ['investmentPlan', clientId],
    queryFn: async () => {
      if (!clientId || !isAuthorized) return null;
      
      const { data, error } = await supabase
        .from('investment_plans')
        .select('monthly_deposit, expected_return, currency, plan_initial_date, initial_amount, inflation')
        .eq('user_id', clientId)
        .single();

      if (error) {
        console.error('Error fetching investment plan:', error);
        return null;
      }

      return data;
    },
    enabled: !!clientId && !isValidating && isAuthorized,
  });

  const refreshIndex = () => {
    navigate(params.id ? `/client/${params.id}` : '/', { replace: true });
  };

  const deleteMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('user_financial_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;
      return recordId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['financialRecords', clientId], (oldData: FinancialRecord[] | undefined) => {
        if (!oldData) return [];
        return sortRecords(oldData.filter(record => record.id !== deletedId));
      });
      
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
      
      const { data: existingRecords } = await supabase
        .from('user_financial_records')
        .select('record_year, record_month')
        .eq('user_id', clientId);

      const existingDates = new Set(
        existingRecords?.map(r => `${r.record_year}-${r.record_month}`) || []
      );

      const validateRecord = (record: CSVRecordValidation): ValidationResult => {
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

        if (isNaN(record.monthly_return)) {
          return { valid: false, error: 'Rendimento mensal inválido' };
        }

        return { valid: true };
      };

      const formattedRecords = records.map(record => {
        try {
          const [_, month, year] = record.Data.split('/');
          console.log(record.Aporte);
          const formattedRecord = {
            user_id: clientId,
            record_year: parseInt(year),
            record_month: parseInt(month),
            starting_balance: parseCurrencyValue(record.PatrimonioInicial, investmentPlan?.currency as CurrencyCode),
            monthly_contribution: parseCurrencyValue(record.Aporte, investmentPlan?.currency as CurrencyCode),
            ending_balance: parseCurrencyValue(record.PatrimonioFinal, investmentPlan?.currency as CurrencyCode),
            monthly_return_rate: parseFloat(record.RetornoPercentual.replace('%', '').replace(/\./g, '').replace(',', '.')),
            target_rentability: parseFloat(record.RentabilidadeMeta.replace('%', '').replace(/\./g, '').replace(',', '.')),
            growth_percentage: null,
            monthly_return: parseCurrencyValue(record.Retorno, investmentPlan?.currency as CurrencyCode),
            events_balance: record.Eventos ? parseCurrencyValue(record.Eventos, investmentPlan?.currency as CurrencyCode) : null,
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

      const validRecords = formattedRecords
        .filter(r => r.isValid)
        .map(r => r.record);

      formattedRecords
        .filter(r => !r.isValid)
        .forEach(r => {
          result.failed++;
          result.errors.push({
            date: r.originalDate,
            reason: r.error || 'Erro desconhecido'
          });
        });

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
      queryClient.invalidateQueries();
      refreshIndex();
      
      if (result.failed > 0) {
        const errorsByType = result.errors.reduce((acc, curr) => {
          if (!acc[curr.reason]) {
            acc[curr.reason] = [];
          }
          acc[curr.reason].push(curr.date);
          return acc;
        }, {} as Record<string, string[]>);

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

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(['financialRecords', clientId], []);
      
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

  const syncIPCAMutation = useMutation({
    mutationFn: async () => {
      if (!clientId || !records?.length) return;
      
      try {
        // Find the oldest record's date
        const sortedRecords = [...records].sort((a, b) => {
          if (a.record_year !== b.record_year) {
            return a.record_year - b.record_year;
          }
          return a.record_month - b.record_month;
        });
        
        const oldestRecord = sortedRecords[0];
        // Format the date as DD/MM/YYYY (pt-BR format)
        const startDate = `01/${oldestRecord.record_month.toString().padStart(2, '0')}/${oldestRecord.record_year}`;
        
        // Fetch appropriate CPI rates based on currency
        let response;
        if (investmentPlan?.currency === 'USD') {
          response = fetchUSCPIRates(startDate, new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }));
        } else if (investmentPlan?.currency === 'EUR') {
          response = fetchEuroCPIRates(startDate, new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }));
        } else {
          response = fetchIPCARates(startDate, new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }));
        }
        
        // Create a map of CPI rates by month/year for easier lookup
        const cpiRateMap = new Map();
        response.forEach(item => {
          const date = new Date(item.date);
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // JavaScript months are 0-indexed
          const key = `${year}-${month}`;
          cpiRateMap.set(key, Number(item.monthlyRate));
        });
        
        // Prepare batch updates for each record that has a matching CPI rate
        const updates = [];
        let updatedCount = 0;
        
        for (const record of records) {
          const recordKey = `${record.record_year}-${record.record_month}`;
          if (cpiRateMap.has(recordKey)) {
            const cpiRate = cpiRateMap.get(recordKey);
            const parsedCpiRate = cpiRate;
            const cpiRateConverted = parseFloat((calculateCompoundedRates([parsedCpiRate/100, yearlyReturnRateToMonthlyReturnRate(investmentPlan?.expected_return/100)]) * 100).toFixed(2));
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
          const updatedIds: string[] = [];
          // Process each update individually to ensure they are only updates
          for (const update of updates) {
            const { error } = await supabase
              .from('user_financial_records')
              .update({ target_rentability: update.target_rentability })
              .eq('id', update.id);
            
            if (error) {
              console.error(`Error updating record ${update.id}:`, error);
              throw error;
            }
            updatedIds.push(update.id);
          }
          setUpdatedRecordIds(updatedIds);
        }
        
        return { 
          count: updatedCount,
          updates
        };
      } catch (error) {
        console.error('Error syncing CPI rates:', error);
        throw error;
      }
    },
    onSuccess: (result) => {
      if (!result) return;
      
      // Update the records in the query cache with the new target_rentability values
      queryClient.setQueryData(['financialRecords', clientId], (oldData: FinancialRecord[] | undefined) => {
        if (!oldData) return [];
        
        return oldData.map(record => {
          const update = result.updates.find(u => u.id === record.id);
          if (update) {
            return {
              ...record,
              target_rentability: update.target_rentability
            };
          }
          return record;
        });
      });
      
      if (result.count > 0) {        
        toast({
          title: t('financialRecords.ipcaSyncSuccess', { 
            count: result.count,
          }),
        });
      } else {
        toast({
          title: t('financialRecords.ipcaSyncZeroRecords'),
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

  const handleDelete = (recordId: string) => {
    if (window.confirm(t('financialRecords.confirmDelete'))) {
      deleteMutation.mutate(recordId);
    }
  };

  const handleReset = async () => {
    if (window.confirm(t('financialRecords.confirmReset'))) {
      await resetMutation.mutate();
    }
  };

  const handleSyncIPCA = async () => {
    if (window.confirm(t('financialRecords.confirmIPCASync'))) {
      await syncIPCAMutation.mutate();
    }
  };

  const formatMonth = (month: number) => {
    return t(`monthlyView.table.months.${new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' }).toLowerCase()}`);
  };

  const formatDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const records = results.data
          .map((row: CSVRow) => {
            if (Object.keys(row).length >= 6) {
              const record: CSVRecord = {
                Data: row.Data,
                PatrimonioInicial: row.PatrimonioInicial,
                Aporte: row.Aporte,
                PatrimonioFinal: row.PatrimonioFinal,
                RetornoPercentual: row.RetornoPercentual,
                RentabilidadeMeta: row.RentabilidadeMeta,
                Retorno: row.Retorno,
                Eventos: row.Eventos
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

  const handleEdit = (recordId: number) => {
    setEditingRecordId(editingRecordId === recordId ? null : recordId);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
        <p className="ml-3 text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Already redirected in useEffect
  }

  if (recordsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <SuccessAnimation 
        show={showSuccessAnimation} 
        onComplete={() => {
          setShowSuccessAnimation(false);
          setAnimationPosition(null);
          setUpdatedRecordIds([]);
        }}
        position={animationPosition}
      />
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
          {brokerProfile?.is_broker && (
            <>
              <Button 
                variant="ghost"
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{t('financialRecords.addNew')}</span>
                </div>
              </Button>

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
                <DialogContent className="sm:max-w-[1000px] bg-white">
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
                            <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">Retorno</th>
                            <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">RetornoPercentual</th>
                            <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">RentabilidadeMeta</th>
                            <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-gray-900 border-b">Eventos</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="whitespace-nowrap px-3 py-2 text-gray-700">01/08/2023</td>
                            <td className="whitespace-nowrap px-3 py-2 text-gray-700">{formatCurrency(51447.92, 'BRL')}</td>
                            <td className="whitespace-nowrap px-3 py-2 text-gray-700">{formatCurrency(4000, 'BRL')}</td>
                            <td className="whitespace-nowrap px-3 py-2 text-gray-700">{formatCurrency(55992.62, 'BRL')}</td>
                            <td className="whitespace-nowrap px-3 py-2 text-gray-700">{formatCurrency(1000, 'BRL')}</td>
                            <td className="whitespace-nowrap px-3 py-2 text-gray-700">1,19%</td>
                            <td className="whitespace-nowrap px-3 py-2 text-gray-700">0,64%</td>
                            <td className="whitespace-nowrap px-3 py-2 text-gray-700">{formatCurrency(500, 'BRL')}</td>
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

              <Button 
                variant="ghost"
                onClick={handleSyncIPCA}
                className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-green-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">{t('financialRecords.syncIPCA')}</span>
                </div>
              </Button>
            </>
          )}
        </div>

        {showAddForm && (
          <AddRecordForm 
            clientId={clientId!} 
            onSuccess={() => setShowAddForm(false)} 
            investmentPlan={investmentPlan as InvestmentPlan}
          />
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4">
          {records?.length === 0 ? (
            <Card className="p-6">
              <p className="text-center text-gray-500">{t('financialRecords.noRecords')}</p>
            </Card>
          ) : (
            records?.map((record) => (
              <Card 
                key={record.id} 
                className={`p-6 relative ${
                  updatedRecordIds.includes(record.id) ? 'animate-pulse bg-green-50' : ''
                }`}
                ref={(el) => {
                  if (el && updatedRecordIds.includes(record.id) && !showSuccessAnimation) {
                    const rect = el.getBoundingClientRect();
                    setAnimationPosition({
                      top: rect.top + rect.height / 2,
                      left: rect.left + rect.width / 2
                    });
                    setShowSuccessAnimation(true);
                  }
                }}
              >
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
                    <p className="font-semibold">{formatCurrency(record.starting_balance, investmentPlan?.currency as CurrencyCode)}</p>
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
                        {formatCurrency(record.monthly_contribution, investmentPlan?.currency as CurrencyCode)}
                      </p>
                      {investmentPlan?.monthly_deposit && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Meta: {formatCurrency(investmentPlan.monthly_deposit, investmentPlan?.currency as CurrencyCode)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('financialRecords.endingBalance')}</p>
                    <p className="font-semibold">{formatCurrency(record.ending_balance, investmentPlan?.currency as CurrencyCode)}</p>
                    {record.events_balance != null && record.events_balance !== 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Eventos: {formatCurrency(record.events_balance, investmentPlan?.currency as CurrencyCode)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('financialRecords.growth')}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${record.monthly_return_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {record.monthly_return_rate != null ? record.monthly_return_rate.toFixed(2) : '--'}%
                        </p>
                        <span className="text-xs text-gray-500">
                          (meta: {record.target_rentability != null ? `${record.target_rentability.toFixed(2)}%` : '--'})
                        </span>
                      </div>
                      <p className={`text-xs ${record.monthly_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(record.monthly_return, investmentPlan?.currency as CurrencyCode )}
                      </p>
                    </div>
                  </div>
                  {brokerProfile?.is_broker && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(record.id)}
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
                  )}
                </div>
                
                {editingRecordId === record.id && (
                  <AddRecordForm  
                    clientId={clientId!}
                    onSuccess={() => setEditingRecordId(null)}
                    editingRecord={record}
                    investmentPlan={investmentPlan as InvestmentPlan}
                  />
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default FinancialRecords; 