import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FinancialRecord {
  id: number;
  record_year: number;
  record_month: number;
  starting_balance: number;
  monthly_contribution: number;
  monthly_return_rate: number;
  ending_balance: number;
  growth_percentage: number;
  target_rentability: number;
  created_at: string;
  investment_plan?: {
    monthly_deposit: number;
  };
}

interface CSVRecord {
  Data: string;
  PatrimonioInicial: string;
  Aporte: string;
  PatrimonioFinal: string;
  RetornoPercentual: string;
  RentabilidadeMeta: string;
}

const FinancialRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const clientId = params.id || user?.id;
  const queryClient = useQueryClient();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

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
    mutationFn: async (records: CSVRecord[]) => {
      const formattedRecords = records.map(record => {
        const [month, year] = record.Data.split('/');
        const startingBalance = parseFloat(record['PatrimonioInicial'].replace('R$ ', '').replace('.', '').replace(',', '.'));
        const monthlyContribution = parseFloat(record.Aporte.replace('R$ ', '').replace('.', '').replace(',', '.'));
        const endingBalance = parseFloat(record['PatrimonioFinal'].replace('R$ ', '').replace('.', '').replace(',', '.'));
        const monthlyReturnRate = parseFloat(record['RetornoPercentual'].replace('%', ''));
        const targetRentability = parseFloat(record['RentabilidadeMeta'].replace('%', ''));

        return {
          user_id: clientId,
          record_year: parseInt(year),
          record_month: parseInt(month),
          starting_balance: startingBalance,
          monthly_contribution: monthlyContribution,
          monthly_return_rate: monthlyReturnRate,
          ending_balance: endingBalance,
          target_rentability: targetRentability,
        };
      });

      const { error } = await supabase
        .from('user_financial_records')
        .insert(formattedRecords);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords', clientId] });
      toast({
        title: t('financialRecords.importSuccess'),
      });
    },
    onError: (error) => {
      console.error('Error importing records:', error);
      toast({
        title: t('financialRecords.errors.importFailed'),
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (recordId: number) => {
    if (window.confirm(t('financialRecords.confirmDelete'))) {
      await deleteMutation.mutate(recordId);
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

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split('\t'));
      const headers = rows[0];
      const records = rows.slice(1)
        .filter(row => row.length === headers.length)
        .map(row => {
          const record: CSVRecord = {
            Data: row[0],
            PatrimonioInicial: row[1],
            Aporte: row[2],
            PatrimonioFinal: row[3],
            RetornoPercentual: row[4],
            RentabilidadeMeta: row[5],
          };
          return record;
        });

      await importMutation.mutate(records);
      setIsImportDialogOpen(false);
    };
    reader.readAsText(file);
  };

  if (recordsLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={params.id ? `/client/${params.id}` : "/"}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{t('financialRecords.title')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Import CSV
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
            <Link to={`/financial-records/new${params.id ? `?client_id=${params.id}` : ''}`}>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('financialRecords.addNew')}
              </Button>
            </Link>
          </div>
        </div>

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
                  <div className="flex items-center">
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
      </div>
    </div>
  );
};

export default FinancialRecords; 