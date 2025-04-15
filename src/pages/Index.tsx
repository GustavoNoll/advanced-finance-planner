import { DashboardCard } from "@/components/DashboardCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { MonthlyView } from "@/components/MonthlyView";
import { Briefcase, LineChart, PiggyBank, LogOut, History, Search, User, Info, Target, Trophy, Calendar, Share2, TrendingUp } from "lucide-react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Calculator } from "@/components/Calculator";
import { processPlanProgressData, PlanProgressData } from "@/lib/plan-progress";
import { generateProjectionData } from '@/lib/chart-projections';
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from '@/components/ui/logo';
import { InvestmentPlanDetails } from "@/components/InvestmentPlanDetails";
import { formatCurrency, CurrencyCode } from "@/utils/currency";
import { EditPlanModal } from "@/components/EditPlanModal";
type TimePeriod = 'all' | '6m' | '12m' | '24m';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id || user?.id;
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const [contributionPeriod, setContributionPeriod] = useState<TimePeriod>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

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
    
    // Create a copy of allFinancialRecords
    const financialRecords = [...allFinancialRecords];

    // Get records by year using a copy
    const financialRecordsByYear = Object.values(
      [...allFinancialRecords].reduce((acc: Record<string, FinancialRecord>, record: FinancialRecord) => {
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
    if (streak > 1) {
      highlights.push({
        message: t('dashboard.highlights.contributionStreak', { months: streak }),
        value: streak,
        icon: <Target className="h-4 w-4" />
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

    // Meta de renda mensal alcançada
    const currentMonthlyIncome = (latest?.ending_balance || 0) * (investmentPlan.expected_return / 100) / 12;
    const incomeProgress = (currentMonthlyIncome / investmentPlan.desired_income) * 100;
    highlights.push({
      message: t('dashboard.highlights.incomeProgress', { 
        percentage: incomeProgress.toFixed(1) 
      }),
      value: incomeProgress,
      icon: <TrendingUp className="h-4 w-4" />
    });

    // Consistência de retornos positivos
    const positiveReturns = processedRecords.financialRecords
      .filter(record => record.monthly_return_rate > 0).length;
    const consistencyRate = (positiveReturns / planMonths) * 100;
    highlights.push({
      message: t('dashboard.highlights.returnConsistency', { 
        percentage: consistencyRate.toFixed(1) 
      }),
      value: consistencyRate,
      icon: <LineChart className="h-4 w-4" />
    });

    // Novos highlights comportamentais
    // 1. Frequência de registros
    const monthsWithRecords = processedRecords.financialRecords.length;
    const monthsWithContributions = processedRecords.financialRecords
      .filter(record => record.monthly_contribution > 0).length;
    const contributionDiscipline = (monthsWithContributions / monthsWithRecords) * 100;
    highlights.push({
      message: t('dashboard.highlights.contributionDiscipline', { 
        percentage: contributionDiscipline.toFixed(1) 
      }),
      value: contributionDiscipline,
      icon: <PiggyBank className="h-4 w-4" />
    });

    // 3. Evolução do patrimônio
    const initialBalance = processedRecords.financialRecords[processedRecords.financialRecords.length - 1]?.starting_balance || 0;
    const patrimonyGrowth = ((latest?.ending_balance || 0) - initialBalance) / initialBalance * 100;
    highlights.push({
      message: t('dashboard.highlights.patrimonyGrowth', { 
        growth: patrimonyGrowth.toFixed(1) 
      }),
      value: patrimonyGrowth,
      icon: <TrendingUp className="h-4 w-4" />
    });

    // Retorna os 3 highlights com maiores valores
    return highlights.sort(() => Math.random() - 0.5).slice(0, 3);
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

  // Add this before the return statement, after other useMemo hooks
  const projectionData = useMemo(() => {
    if (isInvestmentPlanLoading || isProfilesLoading || isFinancialRecordsLoading || isGoalsLoading) return null;

    return generateProjectionData(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      goalsAndEvents?.goals,
      goalsAndEvents?.events
    );
  }, [investmentPlan, clientProfile, allFinancialRecords, goalsAndEvents?.goals, goalsAndEvents?.events]);

  // Memoize plan progress data
  const planProgressData = useMemo(() => {
    // Só calcula após todos os dados estarem carregados
    if (
      isInvestmentPlanLoading ||
      isProfilesLoading ||
      isFinancialRecordsLoading ||
      isGoalsLoading ||
      !projectionData
    ) {
      return {
        plannedMonths: 0,
        projectedMonths: 0,
        monthsDifference: 0,
        plannedContribution: 0,
        projectedContribution: 0,
      };
    }
    try {

      // debug
      console.log(projectionData)

      // Find the retirement month and get the previous month's data
      const retirementDate = new Date(investmentPlan.plan_end_accumulation_date); 
      const retirementYear = projectionData.find(year => year.year === retirementDate.getFullYear());
      const retirementMonthIndex = retirementYear?.months?.findIndex(month => month.month === retirementDate.getMonth() + 1);
      let plannedFuturePresentValue = 0;
      let projectedFuturePresentValue = 0;

      if (retirementYear && retirementMonthIndex !== undefined && retirementMonthIndex > 0) {
        // Get the month before retirement
        const monthBeforeRetirement = retirementYear.months[retirementMonthIndex];
        plannedFuturePresentValue = monthBeforeRetirement?.planned_balance || 0;
        projectedFuturePresentValue = monthBeforeRetirement?.balance || 0;
      }

      return processPlanProgressData(
        allFinancialRecords,
        investmentPlan,
        { 
          birth_date: clientProfile.birth_date
        },
        goalsAndEvents?.goals || [],
        goalsAndEvents?.events || [],
        plannedFuturePresentValue,
        projectedFuturePresentValue
      );
    } catch (error) {
      console.error('Error calculating plan progress data:', error);
      return {
        plannedMonths: 0,
        projectedMonths: 0,
        monthsDifference: 0,
        plannedContribution: 0,
        projectedContribution: 0,
      };
    }
  }, [allFinancialRecords, investmentPlan, clientProfile?.birth_date, goalsAndEvents?.goals, goalsAndEvents?.events, projectionData]);

  const calculateMonthlyContributions = useCallback((period: TimePeriod = 'all') => {
    if (!processedRecords.financialRecords?.length) return 0;

    const currentDate = new Date();
    let filteredRecords = [...processedRecords.financialRecords];
    let includesOldestRecord = true;

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

      includesOldestRecord = filteredRecords.some(record => 
        record.record_year === oldestRecord?.record_year && 
        record.record_month === oldestRecord?.record_month
      );
    }

    const totalContribution = filteredRecords.reduce((sum, record) => 
      sum + (record.monthly_contribution || 0), 0);
    
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

  // Add function to reload projection data
  const handleProjectionDataChange = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
    queryClient.invalidateQueries({ queryKey: ["goalsAndEvents"] });
  }, [queryClient, clientId]);

  const handleShareClient = () => {
    const clientLoginUrl = `${window.location.origin}/client-login/${clientId}`;
    navigator.clipboard.writeText(clientLoginUrl);
    toast({
      title: t('common.success'),
      description: t('brokerDashboard.linkCopied'),
    });
  };

  const handlePlanUpdated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['investmentPlan', clientId] });
    queryClient.invalidateQueries({ queryKey: ['allFinancialRecords', clientId] });
    queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', clientId] });
  }, [queryClient, clientId]);

  if (isInvestmentPlanLoading || isProfilesLoading || isFinancialRecordsLoading || isGoalsLoading || (!investmentPlan && !brokerProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const portfolioValue = processedRecords.latestRecord?.ending_balance || 0;
  const portfolioIncreaseRate = ((portfolioValue - processedRecords.latestRecord?.starting_balance) / processedRecords.latestRecord?.starting_balance) * 100 || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
      <header className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="w-1/3">
              {brokerProfile && (
                <Link to="/broker-dashboard">
                  <Button variant="ghost" className="text-gray-600 hover:text-blue-600 transition-colors">
                    <Search className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex flex-col items-center w-1/3">
              <Logo variant="minimal" className="mb-2" />
              {clientProfile && (
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500 font-medium">{clientProfile.name}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end w-1/3 gap-2">
              {brokerProfile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShareClient}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{t('brokerDashboard.shareWithClient')}</span>
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
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
              variant="outline"
              size="lg"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm hover:from-blue-50/95 hover:via-blue-100/90 hover:to-blue-200/80 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('dashboard.buttons.financialRecords')}</span>
              </div>
            </Button>
          </Link>

          <Link to={`/investment-plan/${investmentPlan?.id}`}>
            <Button 
              variant="outline"
              size="lg"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm hover:from-blue-50/95 hover:via-blue-100/90 hover:to-blue-200/80 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('dashboard.buttons.investmentPlan')}</span>
              </div>
            </Button>
          </Link>

          <Link 
            to={`/financial-goals${params.id ? `/${params.id}` : ''}`}
            state={{ currency: investmentPlan?.currency }}
          >
            <Button 
              variant="outline"
              size="lg"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm hover:from-blue-50/95 hover:via-blue-100/90 hover:to-blue-200/80 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Target className="h-4 w-4 text-blue-600" />
                  {counters?.goals > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
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
            state={{ currency: investmentPlan?.currency }}
          >
            <Button 
              variant="outline"
              size="lg"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm hover:from-blue-50/95 hover:via-blue-100/90 hover:to-blue-200/80 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  {counters?.events > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
                      {counters.events}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('dashboard.buttons.events')}</span>
              </div>
            </Button>
          </Link>

          <Link to={`/client-profile/${clientId}`}>
            <Button 
              variant="outline"
              size="lg"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm hover:from-blue-50/95 hover:via-blue-100/90 hover:to-blue-200/80 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('dashboard.buttons.clientInfo')}</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {calculateHighlights().map((highlight, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              style={{
                background: index === 0 
                  ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.8), rgba(167, 243, 208, 0.8))'
                  : index === 1
                  ? 'linear-gradient(135deg, rgba(239, 246, 255, 0.8), rgba(191, 219, 254, 0.8))'
                  : 'linear-gradient(135deg, rgba(254, 242, 242, 0.8), rgba(254, 202, 202, 0.8))'
              }}
            >
              <div className="p-2 rounded-lg bg-white/50">
                {highlight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {highlight.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-lg hover:border-blue-100/50"
            title={
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">
                  {t('dashboard.cards.portfolioValue.title')}
                </span>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-gray-400 cursor-help hover:text-blue-600 transition-colors" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-white shadow-lg rounded-lg">
                    <p className="text-sm text-gray-600">
                      {t('dashboard.cards.portfolioValue.tooltip')}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            }
            icon={Briefcase}
          >
            <div className="space-y-3">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 bg-clip-text text-transparent drop-shadow-sm">
                {formatCurrency(portfolioValue, investmentPlan?.currency as CurrencyCode)}
              </p>
              {portfolioIncreaseRate && (
                <div className={`flex items-center gap-2 ${
                  portfolioIncreaseRate >= 0 ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/50' : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-100/50'
                } rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur-sm border border-white/50`}>
                  <LineChart className={`h-4 w-4 ${
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
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-lg hover:border-blue-100/50"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">
                    {t('dashboard.cards.contributions.title')}
                  </span>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="h-4 w-4 text-gray-400 cursor-help hover:text-blue-600 transition-colors" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-white shadow-lg rounded-lg">
                      <p className="text-sm text-gray-600">
                        {t('dashboard.cards.contributions.tooltip')}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <select
                  value={contributionPeriod}
                  onChange={(e) => setContributionPeriod(e.target.value as TimePeriod)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white/90 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 transition-colors"
                >
                  <option value="all">{t('common.allTime')}</option>
                  <option value="6m">{t('common.last6Months')}</option>
                  <option value="12m">{t('common.last12Months')}</option>
                  <option value="24m">{t('common.last24Months')}</option>
                </select>
              </div>
            }
            icon={PiggyBank}
          >
            <div className="space-y-2">
              <p className={`text-2xl font-bold drop-shadow-sm ${
                investmentPlan?.required_monthly_deposit && 
                totalContribution >= investmentPlan.required_monthly_deposit 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formatCurrency(totalContribution, investmentPlan?.currency as CurrencyCode)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.cards.contributions.total')}
              </p>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-lg hover:border-blue-100/50"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">
                    {t('dashboard.cards.totalReturns.title')}
                  </span>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="h-4 w-4 text-gray-400 cursor-help hover:text-blue-600 transition-colors" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-white shadow-lg rounded-lg">
                      <p className="text-sm text-gray-600">
                        {t('dashboard.cards.totalReturns.tooltip')}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white/90 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 transition-colors"
                >
                  <option value="all">{t('common.allTime')}</option>
                  <option value="6m">{t('common.last6Months')}</option>
                  <option value="12m">{t('common.last12Months')}</option>
                  <option value="24m">{t('common.last24Months')}</option>
                </select>
              </div>
            }
            icon={LineChart}
          >
            <div className="space-y-2">
              <p className={`text-2xl font-bold drop-shadow-sm ${
                totalAmount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(totalAmount, investmentPlan?.currency as CurrencyCode)}
              </p>
              
              <div className={`flex items-center gap-2 ${
                Number(percentageReturn) >= 0 ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/50' : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-100/50'
              } rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur-sm border border-white/50`}>
                <LineChart className={`h-4 w-4 ${
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

        <div className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100/50 hover:border-blue-100/50">
          {projectionData ? (
            <ExpenseChart 
              profile={clientProfile}
              investmentPlan={investmentPlan}
              clientId={clientId}
              allFinancialRecords={[...(allFinancialRecords || [])]}
              projectionData={projectionData}
              onProjectionDataChange={handleProjectionDataChange}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <Spinner size="lg" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planProgressData && (
            <Calculator data={planProgressData as PlanProgressData} investmentPlan={investmentPlan} />
          )}
          
          {investmentPlan?.present_future_value > 0 && (
            <SavingsGoal 
              allFinancialRecords={[...(allFinancialRecords || [])]}
              investmentPlan={investmentPlan}
              profile={{
                birth_date: clientProfile?.birth_date
              }}
              planProgressData={planProgressData as PlanProgressData}
            />
          )}
          
          <DashboardCard 
            title={
              <span className="text-gray-900 font-medium">
                {t('dashboard.investmentPlan.title')}
              </span>
            }
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-blue-50/95 via-indigo-50/90 to-slate-50/80 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-lg hover:border-blue-100/50"
            icon={Trophy}
          >
            <InvestmentPlanDetails 
              investmentPlan={investmentPlan}
              birthDate={clientProfile?.birth_date}
              onPlanUpdated={handlePlanUpdated}
              onEditClick={() => setIsEditModalOpen(true)}
            />
          </DashboardCard>
        </div>

        <section className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 hover:border-blue-100/50">
          {projectionData ? (
            <MonthlyView 
              userId={clientId} 
              initialRecords={[...processedRecords.financialRecords]} 
              allFinancialRecords={[...(allFinancialRecords || [])]}
              investmentPlan={investmentPlan}
              profile={clientProfile}
              projectionData={projectionData}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <Spinner size="lg" />
            </div>
          )}
        </section>
      </main>
      {isEditModalOpen && investmentPlan && clientProfile?.birth_date && (
        <EditPlanModal
          investmentPlan={investmentPlan}
          birthDate={clientProfile.birth_date}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            handlePlanUpdated();
          }}
        />
      )}
    </div>
  );
};

export default Index;
