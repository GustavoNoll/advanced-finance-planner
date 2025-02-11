import { DashboardCard } from "@/components/DashboardCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { MonthlyView } from "@/components/MonthlyView";
import { Briefcase, TrendingUp, PiggyBank, Plus, Pencil, Settings, LogOut, ArrowLeft, History, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";

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

  const handleLogout = useCallback(async () => {
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
  }, [navigate, t]);

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

  // Combine as queries de profile em uma única consulta
  const { data: profiles, isLoading: isProfilesLoading } = useQuery({
    queryKey: ['profiles', user?.id, clientId],
    queryFn: async () => {
      if (!user?.id) return { clientProfile: null, brokerProfile: null };
      
      const ids = [user.id];
      if (clientId && clientId !== user.id) {
        ids.push(clientId);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', ids);

      if (error) {
        console.error(t('dashboard.messages.errors.fetchProfile'), error);
        return { clientProfile: null, brokerProfile: null };
      }

      return {
        clientProfile: data.find(p => p.id === clientId),
        brokerProfile: data.find(p => p.id === user.id && p.is_broker)
      };
    },
    enabled: !!user?.id,
  });

  const { clientProfile, brokerProfile } = profiles || {};

  const { data: allFinancialRecords, isLoading: isFinancialRecordsLoading } = useQuery({
    queryKey: ['allFinancialRecords', clientId],
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
        return [];
      }

      return data;
    },
    enabled: !!clientId,
  });

  // Processa os registros no cliente
  const financialRecords = useMemo(() => {
    if (!allFinancialRecords?.length) return [];
    
    const today = new Date();
    const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    
    return allFinancialRecords.filter(record => {
      const recordDate = new Date(record.record_year, record.record_month - 1);
      return recordDate >= twelveMonthsAgo;
    });
  }, [allFinancialRecords]);

  const financialRecordsByYear = useMemo(() => {
    if (!allFinancialRecords?.length) return [];
    
    return Object.values(
      allFinancialRecords.reduce((acc: Record<string, FinancialRecord>, record: FinancialRecord) => {
        acc[record.record_year] = record;
        return acc;
      }, {})
    );
  }, [allFinancialRecords]);

  const calculateTotalReturns = useCallback(() => {
    if (!financialRecords?.length) return { totalAmount: 0, percentageReturn: 0 };

    let totalReturn = 0;
    let accumulatedReturn = 1;

    for (const record of financialRecords) {
      totalReturn += record.monthly_return;
      accumulatedReturn *= (1 + record.monthly_return_rate / 100);
    }

    // Subtract 1 to get the actual percentage change
    accumulatedReturn = accumulatedReturn - 1;

    return {
      totalAmount: totalReturn,
      percentageReturn: (accumulatedReturn * 100).toFixed(2)
    };
  }, [financialRecords]);

  const { totalAmount, percentageReturn } = calculateTotalReturns();

  useEffect(() => {
    if (!isInvestmentPlanLoading && !isProfilesLoading) {
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
  }, [investmentPlan, brokerProfile, isInvestmentPlanLoading, isProfilesLoading, navigate, params.id]);

  if (isInvestmentPlanLoading || isProfilesLoading || isFinancialRecordsLoading || (!investmentPlan && !brokerProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="w-1/3">
              {brokerProfile && (
                <Link to="/broker-dashboard">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    <Search className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex flex-col items-center w-1/3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">{t('dashboard.title')}</h1>
              </div>
              {clientProfile && (
                <p className="text-sm text-gray-500">{clientProfile.name}</p>
              )}
            </div>

            <div className="flex justify-end w-1/3">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link to={`/financial-records${params.id ? `/${params.id}` : ''}`}>
            <Button 
              variant="ghost"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{t('dashboard.buttons.financialRecords')}</span>
              </div>
            </Button>
          </Link>

          <Link to={`/investment-plan/${investmentPlan?.id}`}>
            <Button 
              variant="ghost"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{t('dashboard.buttons.investmentPlan')}</span>
              </div>
            </Button>
          </Link>

          {brokerProfile && (
            <Link to={`/client-profile/${clientId}`}>
              <Button 
                variant="ghost"
                className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{t('dashboard.buttons.clientInfo')}</span>
                </div>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            className="transform transition-all hover:scale-102 hover:shadow-lg"
            title={t('dashboard.cards.portfolioValue.title')}
          >
            <div className="space-y-3">
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(portfolioValue)}
              </p>
              {latestRecord && (
                <div className={`flex items-center gap-2 ${
                  latestRecord.monthly_return_rate >= 0 ? 'bg-green-50' : 'bg-red-50'
                } rounded-full px-3 py-1 w-fit`}>
                  <TrendingUp className={`h-4 w-4 ${
                    latestRecord.monthly_return_rate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <p className={`text-sm font-medium ${
                    latestRecord.monthly_return_rate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {latestRecord.monthly_return_rate}%
                  </p>
                </div>
              )}
            </div>
          </DashboardCard>
          
          <DashboardCard title={
            <div className="flex items-center justify-between w-full">
              <span>{t('dashboard.cards.monthlyContributions.title')}</span>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())}
              </span>
            </div>
          }>
            <div className="space-y-2">
              <p className={`text-2xl font-bold ${
                investmentPlan?.required_monthly_deposit && 
                monthlyContribution >= investmentPlan.required_monthly_deposit 
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
              {investmentPlan?.required_monthly_deposit && (
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.cards.monthlyContributions.required')}: {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(investmentPlan.required_monthly_deposit)}
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
              
              <div className={`flex items-center gap-2 ${
                Number(percentageReturn) >= 0 ? 'bg-green-50' : 'bg-red-50'
              } rounded-full px-3 py-1 w-fit`}>
                <TrendingUp className={`h-4 w-4 ${
                  Number(percentageReturn) >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
                <p className={`text-sm flex items-center gap-1 ${
                  Number(percentageReturn) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {percentageReturn}%
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">{t('dashboard.charts.portfolioPerformance')}</h2>
            <ExpenseChart 
              profile={clientProfile}
              investmentPlan={investmentPlan}
              clientId={clientId}
              financialRecordsByYear={financialRecordsByYear as FinancialRecord[]}
            />
          </div>
          
          <div className="space-y-6">
            <SavingsGoal 
              currentInvestment={latestRecord?.ending_balance ?? 0}
              investmentPlan={{
                future_value: investmentPlan?.future_value ?? 0,
                monthly_deposit: investmentPlan?.monthly_deposit ?? 0,
                inflation: investmentPlan?.inflation ?? 0,
                expected_return: investmentPlan?.expected_return ?? 0,
                final_age: investmentPlan?.final_age ?? 0
              }}
              profile={{
                birth_date: clientProfile?.birth_date
              }}
            />
            <DashboardCard 
              title={t('dashboard.nextSteps.title')}
              className="bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <ul className="space-y-4">
                {['reviewStrategy', 'increaseContributions', 'scheduleReview'].map((step) => (
                  <li key={step} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 bg-blue-600 rounded-full" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {t(`dashboard.nextSteps.items.${step}`)}
                    </p>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>
        </div>

        <section>
          <MonthlyView 
            userId={clientId} 
            initialRecords={financialRecords || []} 
          />
        </section>
      </main>
    </div>
  );
};

export default Index;
