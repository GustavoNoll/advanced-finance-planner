import { DashboardCard } from "@/components/DashboardCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { MonthlyView } from "@/components/MonthlyView";
import { Briefcase, TrendingUp, PiggyBank, Plus, Pencil, Settings, LogOut, ArrowLeft, History, Search, User, Info, Target, Trophy, LineChart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useMemo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { FinancialRecord } from "@/types/financial";
import { yearlyReturnRateToMonthlyReturnRate } from '@/lib/financial-math';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Calculator } from "@/components/Calculator";
import { processPlanProgressData } from "@/lib/plan-progress";

type TimePeriod = 'all' | '6m' | '12m' | '24m';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id || user?.id;
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const [contributionPeriod, setContributionPeriod] = useState<TimePeriod>('all');

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

  const { data: allFinancialRecords, isLoading: isFinancialRecordsLoading, refetch: refetchFinancialRecords } = useQuery({
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

  // Process records on the client side
  const processedRecords = useMemo(() => {
    if (!allFinancialRecords?.length) return {
      financialRecords: [],
      financialRecordsByYear: [],
      latestRecord: null,
      currentMonthRecord: null
    };

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    // Get last 12 months records
    const today = new Date();
    
    const financialRecords = allFinancialRecords

    // Get records by year
    const financialRecordsByYear = Object.values(
      allFinancialRecords.reduce((acc: Record<string, FinancialRecord>, record: FinancialRecord) => {
        acc[record.record_year] = record;
        return acc;
      }, {})
    );

    // Get latest and current month records
    const latestRecord = financialRecords[0];
    const currentMonthRecord = financialRecords.find(
      record => record.record_month === currentMonth && record.record_year === currentYear
    );

    return {
      financialRecords: financialRecords,
      financialRecordsByYear,
      latestRecord,
      currentMonthRecord
    };
  }, [allFinancialRecords]);

  const calculateTotalReturns = useCallback((period: TimePeriod = 'all') => {
    if (!processedRecords.financialRecords?.length) return { totalAmount: 0, percentageReturn: 0 };

    const currentDate = new Date();
    let filteredRecords = [...processedRecords.financialRecords];

    // Filter records based on selected period
    if (period !== 'all') {
      const months = parseInt(period);
      const cutoffDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - months,
        1
      );

      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.record_year, record.record_month - 1, 1);
        return recordDate >= cutoffDate;
      });
    }

    let totalReturn = 0;
    let accumulatedReturn = 1;

    for (const record of filteredRecords) {
      totalReturn += record.monthly_return;
      accumulatedReturn *= (1 + record.monthly_return_rate / 100);
    }

    accumulatedReturn = accumulatedReturn - 1;

    return {
      totalAmount: totalReturn,
      percentageReturn: (accumulatedReturn * 100).toFixed(2)
    };
  }, [processedRecords.financialRecords]);

  const { totalAmount, percentageReturn } = calculateTotalReturns(selectedPeriod);

  const calculateHighlights = useCallback(() => {
    if (!investmentPlan) return []
    if (!processedRecords.financialRecords?.length) return [
      {
        message: t('dashboard.highlights.startToInvest'),
        value: 0,
        icon: <Target className="h-4 w-4" />
      },
    ];

    const latest = processedRecords.latestRecord;
    const highlights: { message: string; value: number; icon: JSX.Element }[] = [];

    // Cálculo da sequência de aportes consistentes
    let streak = 0;
    for (const record of processedRecords.financialRecords) {
      if (record.monthly_contribution >= (investmentPlan.required_monthly_deposit || 0)) {
        streak++;
      } else break;
    }
    if (streak > 0) {
      highlights.push({
        message: t('dashboard.highlights.contributionStreak', { months: streak }),
        value: streak,
        icon: <Target className="h-4 w-4" />
      });
    }

    // Retorno sobre aportes
    const totalContributions = processedRecords.financialRecords
      .reduce((sum, record) => sum + (record.monthly_contribution || 0), 0);
    const returnOnContributions = ((latest?.ending_balance || 0) - totalContributions) / totalContributions * 100;
    if (returnOnContributions > 0) {
      highlights.push({
        message: t('dashboard.highlights.returnOnContributions', { 
          percentage: returnOnContributions.toFixed(1) 
        }),
        value: returnOnContributions,
        icon: <PiggyBank className="h-4 w-4" />
      });
    }

    // Melhor mês de rentabilidade
    const bestReturn = Math.max(...processedRecords.financialRecords
      .map(record => record.monthly_return_rate));
    highlights.push({
      message: t('dashboard.highlights.bestReturn', { 
        return: bestReturn.toFixed(2) 
      }),
      value: bestReturn,
      icon: <Trophy className="h-4 w-4" />
    });

    // Tempo do plano
    const planMonths = processedRecords.financialRecords.length;
    highlights.push({
      message: t('dashboard.highlights.planAge', { months: planMonths }),
      value: planMonths,
      icon: <Calendar className="h-4 w-4" />
    });

    // Retorna os 3 highlights com maiores valores
    return highlights.sort((a, b) => b.value - a.value).slice(0, 3);
  }, [processedRecords.financialRecords, processedRecords.latestRecord, investmentPlan, t]);

  // Add these queries after the existing useQuery hooks
  const { data: counters } = useQuery({
    queryKey: ['counters', clientId],
    queryFn: async () => {
      if (!clientId) return { goals: 0, events: 0 };
      
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      const [goalsResponse, eventsResponse] = await Promise.all([
        supabase
          .from('financial_goals')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', clientId)
          .eq('status', 'pending')
          .or(`year.gt.${currentYear},and(year.eq.${currentYear},month.gte.${currentMonth})`),
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', clientId)
          .eq('status', 'projected')
      ]);

      return {
        goals: goalsResponse.count || 0,
        events: eventsResponse.count || 0
      };
    },
    enabled: !!clientId,
  });

  const { data: goalsAndEvents, isLoading: isGoalsLoading } = useQuery({
    queryKey: ['goalsAndEvents', clientId],
    queryFn: async () => {
      const [goalsResponse, eventsResponse] = await Promise.all([
        supabase
          .from('financial_goals')
          .select('*')
          .eq('profile_id', clientId)
          .eq('status', 'pending'),
        supabase
          .from('events')
          .select('*')
          .eq('profile_id', clientId)
          .eq('status', 'projected')
      ]);
      return {
        goals: goalsResponse.data || [],
        events: eventsResponse.data || []
      };
    },
    enabled: !!clientId
  });

  // Memoize the oldest record outside the callback
  const oldestRecord = useMemo(() => {
    if (!processedRecords.financialRecords?.length) return null;
    
    return [...processedRecords.financialRecords].sort((a, b) => {
      // Comparação mais eficiente usando uma única expressão
      return (a.record_year * 12 + a.record_month) - (b.record_year * 12 + b.record_month);
    })[0];
  }, [processedRecords.financialRecords]);

  const calculateMonthlyContributions = useCallback((period: TimePeriod = 'all') => {
    if (!processedRecords.financialRecords?.length) return 0;

    const currentDate = new Date();
    let filteredRecords = [...processedRecords.financialRecords];
    let includesOldestRecord = true; // Por padrão, considerar que inclui o registro mais antigo

    // Filtrar registros apenas quando necessário
    if (period !== 'all') {
      const months = parseInt(period.replace('m', ''));
      const cutoffDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - months,
        1
      );

      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.record_year, record.record_month - 1, 1);
        return recordDate >= cutoffDate;
      });

      // Verificar se o registro mais antigo está incluído apenas quando filtramos
      includesOldestRecord = filteredRecords.some(record => 
        record.record_year === oldestRecord?.record_year && 
        record.record_month === oldestRecord?.record_month
      );
    }

    // Calcular a contribuição total de uma só vez
    const totalContribution = filteredRecords.reduce((sum, record) => 
      sum + (record.monthly_contribution || 0), 0);
    
    // Adicionar initial_amount apenas se o registro mais antigo estiver incluído
    return totalContribution + (includesOldestRecord ? (investmentPlan?.initial_amount || 0) : 0);
  }, [processedRecords.financialRecords, investmentPlan?.initial_amount, oldestRecord]);

  const totalContribution = calculateMonthlyContributions(contributionPeriod);

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

  if (isInvestmentPlanLoading || isProfilesLoading || isFinancialRecordsLoading || isGoalsLoading || (!investmentPlan && !brokerProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const portfolioValue = processedRecords.latestRecord?.ending_balance || 0;
  const portfolioIncreaseRate = ((portfolioValue - processedRecords.latestRecord?.starting_balance) / processedRecords.latestRecord?.starting_balance) * 100 || null;

  const planProgressData = processPlanProgressData(
    allFinancialRecords,
    investmentPlan,
    {
      birth_date: clientProfile?.birth_date
    },
    goalsAndEvents?.goals || [],
    goalsAndEvents?.events || []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

            <div className="flex justify-end w-1/3 gap-2">
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

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <Link 
            to={`/financial-records${params.id ? `/${params.id}` : ''}`} 
            state={{ records: allFinancialRecords }}
          >
            <Button 
              variant="ghost"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('dashboard.buttons.financialRecords')}</span>
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
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('dashboard.buttons.investmentPlan')}</span>
              </div>
            </Button>
          </Link>

          <Link 
            to={`/financial-goals${params.id ? `/${params.id}` : ''}`}
          >
            <Button 
              variant="ghost"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Target className="h-4 w-4 text-blue-600" />
                  {counters?.goals > 0 && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {counters.goals}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('dashboard.buttons.financialGoals')}</span>
              </div>
            </Button>
          </Link>

          <Link 
            to={`/events${params.id ? `/${params.id}` : ''}`}
          >
            <Button 
              variant="ghost"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  {counters?.events > 0 && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {counters.events}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('dashboard.buttons.events')}</span>
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
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('dashboard.buttons.clientInfo')}</span>
                </div>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            className="transform transition-all hover:scale-102 hover:shadow-lg bg-gradient-to-br from-white to-gray-50"
            title={
              <div className="flex items-center gap-2">
                {t('dashboard.cards.portfolioValue.title')}
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm text-gray-600">
                      {t('dashboard.cards.portfolioValue.tooltip')}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            }
          >
            <div className="space-y-3">
              <p className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(portfolioValue)}
              </p>
              {portfolioIncreaseRate && (
                <div className={`flex items-center gap-2 ${
                  portfolioIncreaseRate >= 0 ? 'bg-green-50' : 'bg-red-50'
                } rounded-full px-3 py-1 w-fit`}>
                  <TrendingUp className={`h-4 w-4 ${
                    portfolioIncreaseRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <p className={`text-sm font-medium ${
                    portfolioIncreaseRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {portfolioIncreaseRate.toFixed(2)}% {t('dashboard.cards.portfolioValue.monthlyReturn')}
                  </p>
                </div>
              )}
            </div>
          </DashboardCard>
          
          <DashboardCard 
            className="bg-gradient-to-br from-white to-gray-50"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span>{t('dashboard.cards.contributions.title')}</span>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <p className="text-sm text-gray-600">
                        {t('dashboard.cards.contributions.tooltip')}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <select
                  value={contributionPeriod}
                  onChange={(e) => setContributionPeriod(e.target.value as TimePeriod)}
                  className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{t('common.allTime')}</option>
                  <option value="6m">{t('common.last6Months')}</option>
                  <option value="12m">{t('common.last12Months')}</option>
                  <option value="24m">{t('common.last24Months')}</option>
                </select>
              </div>
            }
          >
            <div className="space-y-2">
              <p className={`text-2xl font-bold ${
                investmentPlan?.required_monthly_deposit && 
                totalContribution >= investmentPlan.required_monthly_deposit 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalContribution)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.cards.contributions.total')}
              </p>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            className="bg-gradient-to-br from-white to-gray-50"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span>{t('dashboard.cards.totalReturns.title')}</span>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <p className="text-sm text-gray-600">
                        {t('dashboard.cards.totalReturns.tooltip')}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
                  className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{t('common.allTime')}</option>
                  <option value="6m">{t('common.last6Months')}</option>
                  <option value="12m">{t('common.last12Months')}</option>
                  <option value="24m">{t('common.last24Months')}</option>
                </select>
              </div>
            }
          >
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

        <div className="bg-white rounded-xl shadow-sm p-6">
          <ExpenseChart 
            profile={clientProfile}
            investmentPlan={investmentPlan}
            clientId={clientId}
            allFinancialRecords={allFinancialRecords || []}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planProgressData && (
            <Calculator data={planProgressData} />
          )}
          
          <SavingsGoal 
            allFinancialRecords={allFinancialRecords || []}
            investmentPlan={investmentPlan}
            profile={{
              birth_date: clientProfile?.birth_date
            }}
            planProgressData={planProgressData}
          />
          
          <DashboardCard 
            title={t('dashboard.highlights.title')}
            className="bg-gradient-to-br from-blue-50 to-indigo-50"
          >
            <div className="space-y-4">
              {calculateHighlights().map((highlight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    index === 0 ? 'bg-green-100 text-green-600' :
                    index === 1 ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {highlight.icon}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {highlight.message}
                  </p>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <section className="bg-white rounded-xl shadow-sm">
          <MonthlyView 
            userId={clientId} 
            initialRecords={processedRecords.financialRecords} 
            allFinancialRecords={allFinancialRecords || []}
            investmentPlan={investmentPlan}
            profile={clientProfile}
          />
        </section>
      </main>
    </div>
  );
};

export default Index;
