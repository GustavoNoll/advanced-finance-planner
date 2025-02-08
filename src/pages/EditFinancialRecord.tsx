import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

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
}

const EditFinancialRecord = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const recordId = params.id;
  const clientId = searchParams.get('client_id') || user?.id;

  const [formData, setFormData] = useState<Partial<FinancialRecord>>({
    starting_balance: null,
    monthly_contribution: null,
    monthly_return_rate: null,
    ending_balance: null,
    target_rentability: null,
  });

  const { data: record, isLoading } = useQuery({
    queryKey: ['financialRecord', recordId],
    queryFn: async () => {
      if (!recordId) return null;
      
      const { data, error } = await supabase
        .from('user_financial_records')
        .select('*')
        .eq('id', recordId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!recordId,
  });

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  const calculateMonthlyReturnRate = (starting: number, ending: number, contribution: number) => {
    if (starting <= 0) return 0;
    const rate = ((ending - contribution) / starting - 1) * 100;
    return Number(rate.toFixed(2));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value === '' ? null : parseFloat(value),
      };

      if (['starting_balance', 'ending_balance', 'monthly_contribution'].includes(name)) {
        newData.monthly_return_rate = calculateMonthlyReturnRate(
          newData.starting_balance ?? 0,
          newData.ending_balance ?? 0,
          newData.monthly_contribution ?? 0
        );
      }

      return newData;
    });
  };

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<FinancialRecord>) => {
      if (!recordId) throw new Error('No record ID');

      const growth_percentage = ((data.ending_balance! - data.starting_balance!) / data.starting_balance!) * 100;

      const { error } = await supabase
        .from('user_financial_records')
        .update({
          starting_balance: data.starting_balance,
          monthly_contribution: data.monthly_contribution,
          ending_balance: data.ending_balance,
          target_rentability: data.target_rentability,
          monthly_return_rate: data.monthly_return_rate,
          growth_percentage,
        })
        .eq('id', recordId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords', clientId] });
      toast({
        title: t('financialRecords.updateSuccess'),
      });
      navigate(clientId ? `/financial-records/${clientId}` : '/financial-records');
    },
    onError: (error) => {
      console.error('Error updating record:', error);
      toast({
        title: t('financialRecords.errors.updateFailed'),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all required fields have values
    const requiredFields = ['starting_balance', 'monthly_contribution', 'ending_balance', 'monthly_return_rate', 'target_rentability'];
    const hasEmptyFields = requiredFields.some(field => 
      formData[field as keyof typeof formData] === undefined || 
      formData[field as keyof typeof formData] === null
    );

    if (hasEmptyFields) {
      toast({
        title: t('financialRecords.errors.emptyFields'),
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(formData);
  };

  const formatMonth = (month: number) => {
    return t(`monthlyView.table.months.${new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' })}`);
  };

  if (isLoading) {
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
            <Link to={clientId ? `/financial-records/${clientId}` : '/financial-records'}>
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">
              {t('financialRecords.editTitle')}
            </h1>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read-only date display */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {formatMonth(record?.record_month || 1)} {record?.record_year}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="starting_balance">
                  {t('financialRecords.startingBalance')}
                </Label>
                <Input
                  id="starting_balance"
                  name="starting_balance"
                  type="number"
                  step="0.01"
                  value={formData.starting_balance ?? ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="monthly_contribution">
                  {t('financialRecords.monthlyContribution')}
                </Label>
                <Input
                  id="monthly_contribution"
                  name="monthly_contribution"
                  type="number"
                  step="0.01"
                  value={formData.monthly_contribution ?? ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="ending_balance">
                  {t('financialRecords.endingBalance')}
                </Label>
                <Input
                  id="ending_balance"
                  name="ending_balance"
                  type="number"
                  step="0.01"
                  value={formData.ending_balance ?? ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="monthly_return_rate">
                  {t('financialRecords.form.monthlyReturnRate')}
                </Label>
                <Input
                  id="monthly_return_rate"
                  name="monthly_return_rate"
                  type="number"
                  step="0.01"
                  value={formData.monthly_return_rate ?? ''}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="target_rentability">
                  {t('financialRecords.form.targetRentability')}
                </Label>
                <Input
                  id="target_rentability"
                  name="target_rentability"
                  type="number"
                  step="0.01"
                  value={formData.target_rentability ?? ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(clientId ? `/financial-records/${clientId}` : '/financial-records')}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('common.save')}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default EditFinancialRecord; 