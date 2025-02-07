import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

const FinancialRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const clientId = params.id || user?.id;
  const queryClient = useQueryClient();

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
          <Link to={`/financial-records/new${params.id ? `?client_id=${params.id}` : ''}`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('financialRecords.addNew')}
            </Button>
          </Link>
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