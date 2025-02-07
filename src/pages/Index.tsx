import { DashboardCard } from "@/components/DashboardCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { MonthlyView } from "@/components/MonthlyView";
import { Briefcase, TrendingUp, PiggyBank, Plus, Pencil, Settings, LogOut, ArrowLeft, History, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface FinancialRecord {
  record_year: number;
  record_month: number;
  ending_balance: number;
  starting_balance: number;
  monthly_contribution: number;
  monthly_return_rate: number;
}

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id || user?.id;
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: t('dashboard.messages.logoutSuccess'),
        description: "",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: t('dashboard.messages.logoutError'),
        description: "",
        variant: "destructive",
      });
    }
  };

  const { data: investmentPlan, isLoading: isInvestmentPlanLoading } = useQuery({
    queryKey: ['investmentPlan', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', clientId);

      console.log(data);
      if (error) {
        console.error(t('dashboard.messages.errors.fetchPlan'), error);
        return null;
      }

      return data?.[0] || null;
    },
    enabled: !!clientId,
  });


  const { data: clientProfile, isLoading: isClientProfileLoading } = useQuery({
    queryKey: ['clientProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', clientId)
        .single();
        
      if (error) {
        console.error(t('dashboard.messages.errors.fetchProfile'), error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });
  const { data: brokerProfile, isLoading: isBrokerLoading } = useQuery({
    queryKey: ['brokerProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .eq('is_broker', true)
        .single();

      if (error) {
        console.error(t('dashboard.messages.errors.fetchProfile'), error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const { data: financialRecordsByYear, isLoading: isFinancialRecordsByYearLoading } = useQuery({
    queryKey: ['financialRecordsByYear', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from('user_financial_records')
        .select('*')
        .eq('user_id', clientId)
        .order('record_year', { ascending: false })
        .order('record_month', { ascending: true });

      if (error) {
        console.error('Error fetching financial records:', error);
        return [];
      }

      // Group by year and take last record of each year
      const uniqueYearRecords = Object.values(
        data.reduce((acc: Record<string, FinancialRecord>, record: FinancialRecord) => {
          // Always update the record for the year, since we're getting them in descending order
          // the first record we see for each year will be the last month
          acc[record.record_year] = record;
          return acc;
        }, {})
      );

      return uniqueYearRecords;
    },
    enabled: !!clientId,
  });

  const { data: financialRecords, isLoading: isFinancialRecordsLoading } = useQuery({
    queryKey: ['financialRecords', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      // Get current date for 12-month calculation
      const today = new Date();
      const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 11, 1);
      
      const { data, error } = await supabase
        .from('user_financial_records')
        .select('*')
        .eq('user_id', clientId)
        .gte('record_year', twelveMonthsAgo.getFullYear())
        .order('record_year', { ascending: false })
        .order('record_month', { ascending: false });

      if (error) {
        console.error('Error fetching financial records:', error);
        return [];
      }

      // Filter records from last 12 months
      return data.filter(record => {
        const recordDate = new Date(record.record_year, record.record_month - 1);
        return recordDate >= twelveMonthsAgo;
      });
    },
    enabled: !!clientId,
  });

  const calculateTotalReturns = () => {
    if (!financialRecords?.length) return { totalAmount: 0, percentageReturn: 0 };

    // Calculate returns only for the filtered records (last 12 months)
    const totalReturn = financialRecords.reduce((acc, record) => {
      const monthlyReturn = (record.ending_balance - record.starting_balance - record.monthly_contribution);
      return acc + monthlyReturn;
    }, 0);

    const totalInvested = financialRecords.reduce((acc, record) => 
      acc + record.monthly_contribution, financialRecords[0].starting_balance // Adiciona o saldo inicial do primeiro mês
    );

    const percentageReturn = totalInvested > 0 
      ? (totalReturn / totalInvested) * 100 
      : 0;

    return {
      totalAmount: totalReturn,
      percentageReturn: Number(percentageReturn.toFixed(2))
    };
  };

  const { totalAmount, percentageReturn } = calculateTotalReturns();

  useEffect(() => {
    if (!isInvestmentPlanLoading && !isBrokerLoading) {
      if (brokerProfile && !params.id) {
        navigate('/broker-dashboard');
        return;
      }
      
      if (!investmentPlan) {
        if (brokerProfile) {
          toast({
            title: t('dashboard.messages.noPlan.title'),
            description: t('dashboard.messages.noPlan.description'),
          });
          navigate(`/create-plan${params.id ? `?client_id=${params.id}` : ''}`);
          return;
        }
        
        toast({
          title: t('dashboard.messages.contactBroker.title'),
          description: t('dashboard.messages.contactBroker.description'),
        });
        handleLogout();
        return;
      }
    }
  }, [investmentPlan, brokerProfile, isInvestmentPlanLoading, isBrokerLoading, navigate, params.id]);

  if (isInvestmentPlanLoading || isBrokerLoading || isFinancialRecordsLoading || (!investmentPlan && !brokerProfile)) {
    return <div>{t('dashboard.loading')}</div>;
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const latestRecord = financialRecords?.[0];
  const currentMonthRecord = financialRecords?.find(
    record => record.record_month === currentMonth && record.record_year === currentYear
  );

  const portfolioValue = latestRecord?.ending_balance || 0;
  const monthlyContribution = currentMonthRecord?.monthly_contribution || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {brokerProfile && (
              <Link to="/broker-dashboard">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to={`/financial-records${params.id ? `/${params.id}` : ''}`}>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  {t('dashboard.buttons.financialRecords')}
                </Button>
              </Link>
              {brokerProfile && (
                <Link to={`/investment-plan/${investmentPlan?.id}`}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t('dashboard.buttons.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard title={t('dashboard.cards.portfolioValue.title')}>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(portfolioValue)}
              </p>
              {latestRecord && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {latestRecord.monthly_return_rate}% {t('dashboard.cards.portfolioValue.monthlyReturn')}
                </p>
              )}
            </div>
          </DashboardCard>
          
          <DashboardCard title={t('dashboard.cards.monthlyContributions.title')}>
            <div className="space-y-2">
              <p className={`text-2xl font-bold ${
                investmentPlan?.monthly_deposit && 
                monthlyContribution >= investmentPlan.monthly_deposit 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(monthlyContribution)}
              </p>
              {investmentPlan?.monthly_deposit && (
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.cards.monthlyContributions.target')}: {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(investmentPlan.monthly_deposit)}
                </p>
              )}
            </div>
          </DashboardCard>
          
          <DashboardCard title={t('dashboard.cards.totalReturns.title')}>
            <div className="space-y-2">
              <p className={`text-2xl font-bold ${
                totalAmount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalAmount)}
              </p>
              <p className={`text-sm flex items-center gap-1 ${
                percentageReturn >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <PiggyBank className="h-4 w-4" />
                {percentageReturn}% {t('dashboard.cards.totalReturns.subtitle')}
              </p>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <DashboardCard title={t('dashboard.charts.portfolioPerformance')}>
              <ExpenseChart 
                profile={clientProfile}
                investmentPlan={investmentPlan}
                clientId={clientId}
                financialRecordsByYear={financialRecordsByYear as FinancialRecord[]}
              />
            </DashboardCard>
          </div>
          
          <div className="space-y-6">
            <SavingsGoal />
            <DashboardCard title={t('dashboard.nextSteps.title')}>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  {t('dashboard.nextSteps.items.reviewStrategy')}
                </li>
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  {t('dashboard.nextSteps.items.increaseContributions')}
                </li>
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  {t('dashboard.nextSteps.items.scheduleReview')}
                </li>
              </ul>
            </DashboardCard>
          </div>
        </div>

        <MonthlyView financialRecords={financialRecords || []} />
      </main>
    </div>
  );
};

export default Index;
