import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const formSchema = z.object({
  record_year: z.number().min(2000).max(2100),
  record_month: z.number().min(1).max(12),
  starting_balance: z.number().min(0),
  monthly_contribution: z.number().min(0),
  monthly_return_rate: z.number(),
  ending_balance: z.number().min(0),
  target_rentability: z.number().optional(),
}).refine((data) => {
  const currentDate = new Date();
  const recordDate = new Date(data.record_year, data.record_month - 1);
  return recordDate <= currentDate;
}, {
  message: "Não é possível adicionar registros para datas futuras",
  path: ["record_month"], // This will show the error on the month field
});

const NewFinancialRecord = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const clientId = searchParams.get('client_id') || user?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      record_year: new Date().getFullYear(),
      record_month: new Date().getMonth() + 1,
      starting_balance: 0,
      monthly_contribution: 0,
      monthly_return_rate: 0,
      ending_balance: 0,
      target_rentability: 0,
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch last financial record
        const { data: lastRecord, error: recordError } = await supabase
          .from('user_financial_records')
          .select('ending_balance')
          .eq('user_id', clientId)
          .order('record_year', { ascending: false })
          .order('record_month', { ascending: false })
          .limit(1)
          .single();

        console.log(recordError);
        // Fetch investment plan if no last record exists
        const { data: investmentPlan, error: planError } = await supabase
          .from('investment_plans')
          .select('initial_amount, inflation')
          .eq('user_id', clientId)
          .single();

        console.log(investmentPlan);
        if (recordError && recordError.code !== 'PGRST116') {
          throw recordError;
        }

        // Set starting balance from last record or investment plan
        const startingBalance = lastRecord?.ending_balance || investmentPlan?.initial_amount || 0;
        form.setValue('starting_balance', startingBalance);

        // Calculate target rentability (existing code)
        const response = await fetch(
          'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json'
        );
        const data = await response.json();
        
        const monthlyIPCA = Number(data[0].valor);
        
        form.setValue('target_rentability', monthlyIPCA);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: t('financialRecords.errors.dataFetchFailed'),
          variant: "destructive",
        });
      }
    };

    if (clientId) {
      fetchInitialData();
    }
  }, [clientId]);

  // Add this function to calculate monthly return rate
  const calculateMonthlyReturnRate = (starting: number, ending: number, contribution: number) => {
    if (starting <= 0) return 0;
    // Formula: ((ending_balance - monthly_contribution) / starting_balance - 1) * 100
    const rate = ((ending - contribution) / starting - 1) * 100;
    return Number(rate.toFixed(2));
  };

  // Add effect to update monthly return rate when values change
  useEffect(() => {
    const starting = form.getValues('starting_balance');
    const ending = form.getValues('ending_balance');
    const contribution = form.getValues('monthly_contribution');
    
    if (starting > 0) {
      const rate = calculateMonthlyReturnRate(starting, ending, contribution);
      form.setValue('monthly_return_rate', rate);
    }
  }, [form.watch('starting_balance'), form.watch('ending_balance'), form.watch('monthly_contribution')]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!clientId) return;

    // Add validation check here as well for extra safety
    const currentDate = new Date();
    const recordDate = new Date(values.record_year, values.record_month - 1);
    
    if (recordDate > currentDate) {
      toast({
        title: t('financialRecords.errors.futureDate'),
        description: t('financialRecords.errors.futureDateDescription'),
        variant: "destructive",
      });
      return;
    }

    const growth_percentage = (((values.ending_balance - values.starting_balance) / values.starting_balance) * 100) || 0;

    console.log(values);
    console.log(growth_percentage);
    const { error } = await supabase
      .from('user_financial_records')
      .insert([
        {
          user_id: clientId,
          ...values,
          growth_percentage,
        },
      ]);

    if (error) {
      console.error('Error creating financial record:', error);
      // Check for duplicate record error
      if (error.code === '23505') {
        toast({
          title: t('financialRecords.errors.duplicateRecord'),
          description: t('financialRecords.errors.recordExists', {
            month: new Date(2000, values.record_month - 1).toLocaleString('pt-BR', { month: 'long' }),
            year: values.record_year
          }),
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

    toast({
      title: t('financialRecords.success.created'),
    });
    navigate(`/financial-records${clientId !== user?.id ? `/${clientId}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link to={`/financial-records${clientId !== user?.id ? `/${clientId}` : ''}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t('financialRecords.new.title')}</h1>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <FormField
                control={form.control}
                name="starting_balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('financialRecords.form.startingBalance')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="Saldo Inicial" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthly_contribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('financialRecords.form.monthlyContribution')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="Aportes no Mês"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="ending_balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('financialRecords.form.endingBalance')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="Saldo Final"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))} 
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
                    <FormLabel>{t('financialRecords.form.monthlyReturnRate')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target_rentability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('financialRecords.form.targetRentability')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {t('financialRecords.form.submit')}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default NewFinancialRecord; 