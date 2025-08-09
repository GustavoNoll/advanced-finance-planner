import { DashboardCard } from "@/components/DashboardCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { MonthlyView } from "@/components/MonthlyView";
import { Briefcase, LineChart, PiggyBank, Target, Trophy, Calendar, TrendingUp, Info, User, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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
import { InvestmentPlanDetails } from "@/components/InvestmentPlanDetails";
import { formatCurrency, CurrencyCode } from "@/utils/currency";
import { EditPlanModal } from "@/components/EditPlanModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartAdvancedOptionsModal } from "@/components/chart/ChartAdvancedOptionsModal";
import { useIPCASync } from "@/hooks/useIPCASync";
import { useChartOptions } from "@/hooks/useChartOptions";
import { Profile, InvestmentPlan } from "@/types/financial";
type TimePeriod = 'all' | '6m' | '12m' | '24m';

interface FinancesProps {
  clientId: string;
  clientProfile: Profile;
  brokerProfile: Profile;
  investmentPlan: InvestmentPlan;
  onLogout: () => void;
  onShareClient: () => void;
}

const Finances = ({
  clientId,
  clientProfile,
  brokerProfile,
  investmentPlan,
  onLogout,
  onShareClient
}: FinancesProps) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const [contributionPeriod, setContributionPeriod] = useState<TimePeriod>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showRealValues, setShowRealValues] = useState<boolean>(false);
  const [showNegativeValues, setShowNegativeValues] = useState<boolean>(false);
  const queryClient = useQueryClient();

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
          .or(`year.gt.${currentYear},and(year.eq.${currentYear},month.gte.${currentMonth})`),
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', clientId)
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
          .eq('profile_id', clientId),
        supabase
          .from('events')
          .select('*')
          .eq('profile_id', clientId)
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

  // Use chart options hook for projection data with advanced options
  const chartOptionsHook = useChartOptions({
    investmentPlan,
    clientProfile,
    allFinancialRecords: allFinancialRecords || [],
    goals: goalsAndEvents?.goals,
    events: goalsAndEvents?.events
  });

  // Fallback to original projection data when no chart options are active
  const originalProjectionData = useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords || !goalsAndEvents) return null;

    return generateProjectionData(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      goalsAndEvents?.goals,
      goalsAndEvents?.events
    );
  }, [investmentPlan, clientProfile, allFinancialRecords, goalsAndEvents?.goals, goalsAndEvents?.events]);

  // Use chart options projection data if available, otherwise use original
  const projectionData = chartOptionsHook.hasActiveChartOptions 
    ? chartOptionsHook.projectionDataWithOptions 
    : originalProjectionData;

  // Memoize plan progress data
  const planProgressData = useMemo(() => {
    // Só calcula após todos os dados estarem carregados
    if (
      !investmentPlan ||
      !clientProfile ||
      !allFinancialRecords ||
      !goalsAndEvents ||
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
      // Find the retirement month and get the previous month's data
      const retirementDate = new Date(investmentPlan.plan_end_accumulation_date); 
      const retirementYear = projectionData.find(year => year.year === retirementDate.getFullYear());
      const retirementMonthIndex = retirementYear?.months?.findIndex(month => month.month === retirementDate.getMonth() + 1);
      let plannedFuturePresentValue = 0;
      let projectedFuturePresentValue = 0;

      if (retirementYear && retirementMonthIndex !== undefined) {
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
  }, [
    // allFinancialRecords: depend on length and a stable identifier (e.g., JSON.stringify or .map(r => r.id))
    allFinancialRecords?.length,
    JSON.stringify(allFinancialRecords), // Replace with .map(r => r.id) if available
    // investmentPlan: only plan_end_accumulation_date and any other used property
    investmentPlan?.plan_end_accumulation_date,
    // clientProfile: only birth_date
    clientProfile?.birth_date,
    // goalsAndEvents: only goals and events arrays
    goalsAndEvents?.goals?.length,
    JSON.stringify(goalsAndEvents?.goals),
    goalsAndEvents?.events?.length,
    JSON.stringify(goalsAndEvents?.events),
    // projectionData: depend on length and a stable identifier
    projectionData?.length,
    JSON.stringify(projectionData)
  ]);

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

  // Add function to reload projection data
  const handleProjectionDataChange = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
    queryClient.invalidateQueries({ queryKey: ["goalsAndEvents"] });
  }, [queryClient]);

  const handlePlanUpdated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['investmentPlan', clientId] });
    queryClient.invalidateQueries({ queryKey: ['allFinancialRecords', clientId] });
    queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', clientId] });
  }, [queryClient, clientId]);

  const { syncIPCA, isSyncing } = useIPCASync(clientId, allFinancialRecords, investmentPlan);

  // Add useEffect to sync IPCA when component mounts
  useEffect(() => {
    if (allFinancialRecords?.length && investmentPlan) {
      syncIPCA();
    }
  }, [allFinancialRecords, investmentPlan, syncIPCA]);

  if (!investmentPlan || !clientProfile || !allFinancialRecords || isGoalsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const portfolioValue = processedRecords.latestRecord?.ending_balance || 0;
  const portfolioIncreaseRate = ((portfolioValue - processedRecords.latestRecord?.starting_balance) / processedRecords.latestRecord?.starting_balance) * 100 || null;

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link 
            to={`/financial-records${clientId ? `/${clientId}` : ''}`} 
            state={{ records: allFinancialRecords }}
          >
            <Button 
              variant="outline"
              size="lg"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm hover:from-blue-50/95 dark:hover:from-gray-800 hover:via-blue-100/90 dark:hover:via-gray-800 hover:to-blue-200/80 dark:hover:to-slate-700 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 dark:border-gray-800 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{t('dashboard.buttons.financialRecords')}</span>
              </div>
            </Button>
          </Link>

          <Link to={`/investment-plan/${investmentPlan?.id}`}>
            <Button 
              variant="outline"
              size="lg"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm hover:from-blue-50/95 dark:hover:from-gray-800 hover:via-blue-100/90 dark:hover:via-gray-800 hover:to-blue-200/80 dark:hover:to-slate-700 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 dark:border-gray-800 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{t('dashboard.buttons.investmentPlan')}</span>
              </div>
            </Button>
          </Link>

          <Link 
            to={`/financial-goals${clientId ? `/${clientId}` : ''}`}
            state={{ currency: investmentPlan?.currency }}
          >
            <Button 
              variant="outline"
              size="lg"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm hover:from-blue-50/95 dark:hover:from-gray-800 hover:via-blue-100/90 dark:hover:via-gray-800 hover:to-blue-200/80 dark:hover:to-slate-700 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 dark:border-gray-800 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {counters?.goals > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
                      {counters.goals}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{t('dashboard.buttons.financialGoals')}</span>
              </div>
            </Button>
          </Link>

          <Link 
            to={`/events${clientId ? `/${clientId}` : ''}`}
            state={{ currency: investmentPlan?.currency }}
          >
            <Button 
              variant="outline"
              size="lg"
              className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm hover:from-blue-50/95 dark:hover:from-gray-800 hover:via-blue-100/90 dark:hover:via-gray-800 hover:to-blue-200/80 dark:hover:to-slate-700 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100/50 dark:border-gray-800 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {counters?.events > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
                      {counters.events}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{t('dashboard.buttons.events')}</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {calculateHighlights().map((highlight, index) => {
            function getHighlightBgClasses(i: number): string {
              if (i === 0) return 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/70 dark:from-emerald-900/60 dark:via-emerald-800/40 dark:to-emerald-700/40 border border-emerald-100/60 dark:border-emerald-700/60'
              if (i === 1) return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100/70 dark:from-blue-900/60 dark:via-indigo-800/40 dark:to-blue-700/40 border border-blue-100/60 dark:border-blue-700/60'
              return 'bg-gradient-to-br from-rose-50 via-red-50 to-rose-100/70 dark:from-rose-900/60 dark:via-rose-800/40 dark:to-rose-700/40 border border-rose-100/60 dark:border-rose-700/60'
            }
            return (
            <div 
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${getHighlightBgClasses(index)}`}
            >
              <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/80">
                {highlight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-100 truncate">
                  {highlight.message}
                </p>
              </div>
            </div>
          )})}
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
            title={
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {t('dashboard.cards.portfolioValue.title')}
                </span>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-help hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('dashboard.cards.portfolioValue.tooltip')}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            }
            icon={Briefcase}
          >
            <div className="space-y-3">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 dark:from-blue-400 dark:via-indigo-400 dark:to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
                {formatCurrency(portfolioValue, investmentPlan?.currency as CurrencyCode)}
              </p>
              {portfolioIncreaseRate && (
                <div className={`flex items-center gap-2 ${
                  portfolioIncreaseRate >= 0 ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/50 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-emerald-900/10' : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-100/50 dark:from-rose-900/30 dark:via-rose-900/20 dark:to-rose-900/10'
                } rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur-sm border border-white/50 dark:border-gray-800`}>
                  <LineChart className={`h-4 w-4 ${
                    portfolioIncreaseRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    portfolioIncreaseRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {portfolioIncreaseRate.toFixed(2)}% {t('dashboard.cards.portfolioValue.monthlyReturn')}
                  </p>
                </div>
              )}
            </div>
          </DashboardCard>
          
          <DashboardCard 
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {t('dashboard.cards.contributions.title')}
                  </span>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-help hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('dashboard.cards.contributions.tooltip')}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Select value={contributionPeriod} onValueChange={(value) => setContributionPeriod(value as TimePeriod)}>
                  <SelectTrigger className="w-[150px] h-8 text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 bg-white/90 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 dark:hover:border-gray-600 transition-colors ml-auto">
                    <SelectValue placeholder={t('common.selectPeriod')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allTime')}</SelectItem>
                    <SelectItem value="6m">{t('common.last6Months')}</SelectItem>
                    <SelectItem value="12m">{t('common.last12Months')}</SelectItem>
                    <SelectItem value="24m">{t('common.last24Months')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
            icon={PiggyBank}
          >
            <div className="space-y-2">
              <p className={`text-2xl font-bold drop-shadow-sm ${
                investmentPlan?.required_monthly_deposit && 
                totalContribution >= investmentPlan.required_monthly_deposit 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(totalContribution, investmentPlan?.currency as CurrencyCode)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.cards.contributions.total')}
              </p>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {t('dashboard.cards.totalReturns.title')}
                  </span>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="h-4 w-4 text-gray-400 dark:text-gray-300 cursor-help hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('dashboard.cards.totalReturns.tooltip')}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as TimePeriod)}>
                  <SelectTrigger className="w-[150px] h-8 text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 bg-white/90 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 dark:hover:border-gray-600 transition-colors ml-auto">
                    <SelectValue placeholder={t('common.selectPeriod')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allTime')}</SelectItem>
                    <SelectItem value="6m">{t('common.last6Months')}</SelectItem>
                    <SelectItem value="12m">{t('common.last12Months')}</SelectItem>
                    <SelectItem value="24m">{t('common.last24Months')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
            icon={LineChart}
          >
            <div className="space-y-2">
              <p className={`text-2xl font-bold drop-shadow-sm ${
                totalAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(totalAmount, investmentPlan?.currency as CurrencyCode)}
              </p>
              
              <div className={`flex items-center gap-2 ${
                Number(percentageReturn) >= 0 ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/50 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-emerald-900/10' : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-100/50 dark:from-rose-900/30 dark:via-rose-900/20 dark:to-rose-900/10'
              } rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur-sm border border-white/50 dark:border-gray-800`}>
                <LineChart className={`h-4 w-4 ${
                  Number(percentageReturn) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`} />
                <p className={`text-sm flex items-center gap-1 ${
                  Number(percentageReturn) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {percentageReturn}%
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
          {projectionData ? (
            <ExpenseChart 
              profile={clientProfile}
              investmentPlan={investmentPlan}
              clientId={clientId}
              allFinancialRecords={[...(allFinancialRecords || [])]}
              projectionData={projectionData}
              onProjectionDataChange={handleProjectionDataChange}
              showRealValues={showRealValues}
              showNegativeValues={showNegativeValues}
              onOpenAdvancedOptions={() => setShowAdvancedOptions(true)}
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
              <span className="text-gray-900 font-medium dark:text-gray-100">
                {t('dashboard.investmentPlan.title')}
              </span>
            }
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-card backdrop-blur-sm border border-gray-100/50 dark:border-gray-800 rounded-xl shadow-lg hover:border-blue-100/50 dark:hover:border-gray-700"
            icon={Trophy}
          >
            <InvestmentPlanDetails 
              investmentPlan={investmentPlan}
              birthDate={clientProfile?.birth_date}
              onPlanUpdated={handlePlanUpdated}
              onEditClick={() => setIsEditModalOpen(true)}
              isBroker={brokerProfile !== undefined}
            />
          </DashboardCard>
        </div>

        <section className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50 dark:border-gray-800 hover:border-blue-100/50 dark:hover:border-gray-700">
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
      
      <ChartAdvancedOptionsModal
        open={showAdvancedOptions}
        onOpenChange={setShowAdvancedOptions}
        investmentPlan={investmentPlan}
        showRealValues={showRealValues}
        setShowRealValues={setShowRealValues}
        showNegativeValues={showNegativeValues}
        setShowNegativeValues={setShowNegativeValues}
        changeMonthlyDeposit={chartOptionsHook.changeMonthlyDeposit}
        setChangeMonthlyDeposit={chartOptionsHook.setChangeMonthlyDeposit}
        changeMonthlyWithdraw={chartOptionsHook.changeMonthlyWithdraw}
        setChangeMonthlyWithdraw={chartOptionsHook.setChangeMonthlyWithdraw}
      />
    </>
  );
};

export default Finances; 