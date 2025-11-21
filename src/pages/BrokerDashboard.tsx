import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Plus, LogOut, Share2, Trash2, Calculator, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createDateWithoutTimezone } from '@/utils/dateUtils';

import { SummaryMetrics } from '@/components/broker-dashboard/metrics/SummaryMetrics';
import { PerformanceMetrics } from '@/components/broker-dashboard/metrics/PerformanceMetrics';
import { AdvancedWealthChart } from '@/components/broker-dashboard/charts/AdvancedWealthChart';
import { ContributionTrendChart } from '@/components/broker-dashboard/charts/ContributionTrendChart';
import { SmartAlerts } from '@/components/broker-dashboard/alerts/SmartAlerts';
import { ClientList } from '@/components/broker-dashboard/client-list/ClientList';
import { UserProfileInvestment, BrokerProfile, EnhancedDashboardMetrics, DashboardMetrics } from '@/types/broker-dashboard';
import { Logo } from '@/components/ui/logo';
import { Avatar } from '@/components/ui/avatar-initial';
import { useAuth } from '@/components/auth/AuthProvider';
import { Spinner } from '@/components/ui/spinner';
import { ClientAccessAnalysis } from '@/components/shared/ClientAccessAnalysis';
import { useClientAccessData } from '@/hooks/useClientAccessData';
import { BrokerPDFImportDialog } from '@/pages/performance/components/BrokerPDFImportDialog';

/**
 * Main broker dashboard component that displays client metrics and management tools
 */
export const BrokerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfileInvestment[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBroker, setIsBroker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentBroker, setCurrentBroker] = useState<string | null>(null);
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    clientsWithPlan: 0,
    clientsWithOutdatedRecords: 0,
    totalBalance: 0,
    clientsWithActiveRecords: 0,
    wealthDistribution: [],
    planning: {
      averageAge: 0,
      averageRetirementAge: 0,
      averageDesiredIncome: 0,
      planTypes: {
        type1: 0,
        type2: 0,
        type3: 0
      }
    },
    trends: {
      newClientsThisMonth: 0,
      totalGrowthThisMonth: 0,
      averageMonthlyGrowth: 0,
      inactiveClients: 0,
      growthRate: 0,
      clientRetentionRate: 0
    },
    actions: {
      needsPlanReview: 0,
      belowRequiredContribution: 0,
      nearRetirement: 0,
      lowReturns: 0,
      urgentAttention: 0,
      highPriority: 0
    }
  });

  const [enhancedMetrics, setEnhancedMetrics] = useState<EnhancedDashboardMetrics>({
    totalClients: 0,
    clientsWithPlan: 0,
    clientsWithOutdatedRecords: 0,
    totalBalance: 0,
    clientsWithActiveRecords: 0,
    averageReturn: 0,
    averageVolatility: 0,
    averageSharpeRatio: 0,
    totalGrowth: 0,
    averageEngagementScore: 0,
    urgentClients: 0,
    highPriorityClients: 0,
    inactiveClients: 0,
    activityDistribution: {
      active: 0,
      stale: 0,
      atRisk: 0,
      inactive: 0,
      noRecords: 0
    },
    averageAge: 0,
    averageYearsToRetirement: 0,
    nearRetirementClients: 0,
    planMaturity: {
      new: 0,
      established: 0,
      mature: 0
    },
    activityStatus: {
      active: 0,
      stale: 0,
      atRisk: 0,
      inactive: 0
    },
    wealthDistribution: [],
    trends: {
      newClientsThisMonth: 0,
      totalGrowthThisMonth: 0,
      averageMonthlyGrowth: 0,
      inactiveClients: 0,
      growthRate: 0,
      clientRetentionRate: 0
    },
    actions: {
      needsPlanReview: 0,
      belowRequiredContribution: 0,
      nearRetirement: 0,
      lowReturns: 0,
      urgentAttention: 0,
      highPriority: 0
    }
  });

  const [contributionTrendData, setContributionTrendData] = useState<Array<{
    month: string;
    totalClients: number;
    adequateContributors: number;
    percentage: number;
  }>>([]);

  const [isPDFImportDialogOpen, setIsPDFImportDialogOpen] = useState(false);

  // Client access data using shared hook
  const { clientAccessData, fetchClientAccessData, processClientData } = useClientAccessData();



  const calculateContributionTrends = useCallback(async (users: UserProfileInvestment[]) => {
    const last6Months = [];
    const today = new Date();
    
    // Generate last 6 months (excluding current month)
    for (let i = 6; i >= 1; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      last6Months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        monthName: date.toLocaleDateString('pt-BR', { month: 'short' }),
        fullMonthName: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      });
    }

    const trendData = await Promise.all(
      last6Months.map(async ({ year, month, monthName, fullMonthName }) => {
        // Get users who had financial records in this month
        const { data: monthlyRecords, error } = await supabase
          .from('user_financial_records')
          .select(`
            user_id,
            monthly_contribution,
            created_at
          `)
          .eq('record_year', year)
          .eq('record_month', month);

        if (error) {
          console.error('Error fetching monthly records:', error);
          return {
            month: monthName,
            totalClients: 0,
            adequateContributors: 0,
            percentage: 0
          };
        }

        // Get micro plans for these users
        const userIds = monthlyRecords.map(record => record.user_id);
        const { data: microPlans } = await supabase
          .from('micro_investment_plans')
          .select(`
            life_investment_plan_id,
            monthly_deposit,
            effective_date
          `)
          .in('life_investment_plan_id', 
            users.filter(u => userIds.includes(u.id) && u.investment_plan_id)
                 .map(u => u.investment_plan_id)
          );

        // Calculate adequacy
        let adequateContributors = 0;
        const totalClients = userIds.length;

        monthlyRecords.forEach(record => {
          const user = users.find(u => u.id === record.user_id);
          if (!user || !user.investment_plan_id) return;

          const userMicroPlan = microPlans?.find(mp => 
            mp.life_investment_plan_id === user.investment_plan_id &&
            new Date(mp.effective_date) <= new Date(year, month - 1, 1)
          );

          if (userMicroPlan) {
            const requiredContribution = userMicroPlan.monthly_deposit;
            const actualContribution = record.monthly_contribution || 0;
            
            if (actualContribution >= requiredContribution) {
              adequateContributors++;
            }
          }
        });

        const percentage = totalClients > 0 ? (adequateContributors / totalClients) * 100 : 0;

        return {
          month: monthName,
          totalClients,
          adequateContributors,
          percentage
        };
      })
    );

    setContributionTrendData(trendData);
  }, []);


  const calculateMetrics = useCallback(async (users: UserProfileInvestment[]) => {
    const totalClients = users.length;
    const clientsWithPlan = users.filter(user => user.investment_plan_id).length;
    const clientsWithOutdatedRecords = users.filter(user => user.activity_status === 'stale' || user.activity_status === 'at_risk' || user.activity_status === 'inactive').length;
    const clientsWithActiveRecords = users.filter(user => user.activity_status === 'active').length;

    const totalBalance = users.reduce((sum, user) => {
      return sum + (user.ending_balance || 0);
    }, 0);

    // Calculate wealth distribution
    const ranges = [
      { min: 0, max: 500000, label: '0 - 500k' },
      { min: 500000, max: 10000000, label: '500k - 10M' },
      { min: 10000000, max: 50000000, label: '10M - 50M' },
      { min: 50000000, max: Infinity, label: '50M+' }
    ];

    const wealthDistribution = ranges.map(range => {
      const clients = users.filter(user => {
        const balance = user.ending_balance || 0;
        return balance >= range.min && balance < range.max;
      });

      return {
        range: range.label,
        count: clients.length,
        total: clients.reduce((sum, user) => sum + (user.ending_balance || 0), 0),
        percentage: totalClients > 0 ? (clients.length / totalClients) * 100 : 0
      };
    });

    // Calculate planning metrics
    const usersWithPlan = users.filter(user => user.investment_plan_id);
    const averageAge = usersWithPlan.reduce((sum, user) => {
      const birthDate = createDateWithoutTimezone(user.birth_date);
      const today = createDateWithoutTimezone(new Date());
      const age = today.getFullYear() - birthDate.getFullYear();
      return sum + age;
    }, 0) / usersWithPlan.length;

    const planning = {
      averageAge: averageAge || 0,
      averageRetirementAge: 0,
      averageDesiredIncome: 0,
      planTypes: {
        type1: 0,
        type2: 0,
        type3: 0
      }
    };

    // Calculate trends
    const today = createDateWithoutTimezone(new Date());
    const firstDayOfMonth = createDateWithoutTimezone(new Date(today.getFullYear(), today.getMonth(), 1));

    const newClientsThisMonth = users.filter(user => {
      if (!user.financial_created_at) return false;
      const createdAt = createDateWithoutTimezone(user.financial_created_at || '');
      return createdAt >= firstDayOfMonth;
    }).length;

    const totalGrowthThisMonth = users.reduce((sum, user) => 
      sum + (user.total_returns || 0), 0);

    const averageMonthlyGrowth = totalGrowthThisMonth / (users.length || 1);
    const inactiveClients = users.filter(user => user.is_inactive).length;

    const trends = {
      newClientsThisMonth,
      totalGrowthThisMonth,
      averageMonthlyGrowth,
      inactiveClients,
      growthRate: 0,
      clientRetentionRate: 0
    };

    // Calculate actions
    const needsPlanReview = users.filter(user => user.needs_plan_review).length;
    const belowRequiredContribution = users.filter(user => user.below_required_contribution).length;
    const nearRetirement = users.filter(user => user.near_retirement).length;
    const lowReturns = users.filter(user => user.has_low_returns).length;

    const actions = {
      needsPlanReview,
      belowRequiredContribution,
      nearRetirement,
      lowReturns,
      urgentAttention: 0,
      highPriority: 0
    };

    setMetrics({
      totalClients,
      clientsWithPlan,
      clientsWithOutdatedRecords,
      totalBalance,
      clientsWithActiveRecords,
      wealthDistribution,
      planning,
      trends,
      actions
    });

    // Calculate enhanced metrics
    await calculateEnhancedMetrics(users);
    
    // Calculate contribution trends
    await calculateContributionTrends(users);
    
    // Process client access data
    processClientData(users);
  }, [calculateContributionTrends, processClientData]);

  const fetchInitialUsers = useCallback(async () => {
    if (!currentBroker) return;
    
    setIsSearching(true);
    try {
      const { data: users, error } = await supabase
        .from('user_profiles_investment')
        .select('*')
        .eq('broker_id', currentBroker)
        .order('profile_name');

      if (error) throw error;

      console.log(users);
      
      setSearchResults(users || []);
      calculateMetrics(users || []);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [currentBroker, toast, calculateMetrics]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      return fetchInitialUsers();
    }
    
    setIsSearching(true);
    try {
      const { data: users, error } = await supabase
        .from('user_profiles_investment')
        .select('*')
        .eq('broker_id', currentBroker)
        .or(`email.ilike.%${searchQuery}%,profile_name.ilike.%${searchQuery}%`)
        .order('profile_name');
      
      if (error) throw error;
      setSearchResults(users || []);
      calculateMetrics(users || []);
    } catch (error: unknown) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, currentBroker, fetchInitialUsers, toast, t, calculateMetrics]);

  // Combined initialization effect
  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_broker, id, name')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (!profile?.is_broker) {
          toast({
            title: t('common.error'),
            description: t('brokerDashboard.messages.error.unauthorized'),
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setIsBroker(true);
        setCurrentBroker(profile.id);
        setBrokerProfile(profile);
        await fetchInitialUsers();
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        toast({
          title: t('common.error'),
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [user, navigate, toast, t, fetchInitialUsers]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (currentBroker) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, currentBroker, handleSearch]);



  const calculateEnhancedMetrics = async (users: UserProfileInvestment[]) => {
    const totalClients = users.length;
    const clientsWithPlan = users.filter(user => user.investment_plan_id).length;
    const clientsWithOutdatedRecords = users.filter(user => user.activity_status === 'stale' || user.activity_status === 'at_risk' || user.activity_status === 'inactive').length;
    const clientsWithActiveRecords = users.filter(user => user.activity_status === 'active').length;

    const totalBalance = users.reduce((sum, user) => sum + (user.ending_balance || 0), 0);
    const totalGrowth = users.reduce((sum, user) => {
      const endingBalance = user.ending_balance || 0;
      const initialAmount = user.initial_amount || 0;
      return sum + (endingBalance - initialAmount);
    }, 0);

    // Performance metrics - only consider users with non-null values
    const usersWithReturnData = users.filter(user => user.average_monthly_return_rate !== null && user.average_monthly_return_rate !== undefined);
    const usersWithVolatilityData = users.filter(user => user.return_volatility !== null && user.return_volatility !== undefined);
    const usersWithSharpeData = users.filter(user => user.sharpe_ratio !== null && user.sharpe_ratio !== undefined);
    const usersWithEngagementData = users.filter(user => user.engagement_score !== null && user.engagement_score !== undefined);
    
    const averageReturn = usersWithReturnData.length > 0 
      ? usersWithReturnData.reduce((sum, user) => sum + user.average_monthly_return_rate! / 100, 0) / usersWithReturnData.length 
      : 0;

    const averageVolatility = usersWithVolatilityData.length > 0 
      ? usersWithVolatilityData.reduce((sum, user) => sum + user.return_volatility!, 0) / usersWithVolatilityData.length 
      : 0;
    
    const averageSharpeRatio = usersWithSharpeData.length > 0 
      ? usersWithSharpeData.reduce((sum, user) => sum + user.sharpe_ratio!, 0) / usersWithSharpeData.length 
      : 0;
    
    const averageEngagementScore = usersWithEngagementData.length > 0 
      ? usersWithEngagementData.reduce((sum, user) => sum + user.engagement_score!, 0) / usersWithEngagementData.length 
      : 0;

    // Priority clients
    const urgentClients = users.filter(user => user.priority_level === 'urgent').length;
    const highPriorityClients = users.filter(user => user.priority_level === 'high').length;
    const inactiveClients = users.filter(user => user.activity_status === 'inactive').length;

    // Activity status distribution
    const activityDistribution = {
      active: users.filter(user => user.activity_status === 'active').length,
      stale: users.filter(user => user.activity_status === 'stale').length,
      atRisk: users.filter(user => user.activity_status === 'at_risk').length,
      inactive: users.filter(user => user.activity_status === 'inactive').length,
      noRecords: users.filter(user => !user.total_records || user.total_records === 0).length
    };

    // Age and retirement - only consider users with non-null values
    const usersWithAgeData = users.filter(user => user.current_age !== null && user.current_age !== undefined);
    const usersWithRetirementData = users.filter(user => user.years_to_retirement !== null && user.years_to_retirement !== undefined);
    
    const averageAge = usersWithAgeData.length > 0 
      ? usersWithAgeData.reduce((sum, user) => sum + user.current_age!, 0) / usersWithAgeData.length 
      : 0;
    
    const averageYearsToRetirement = usersWithRetirementData.length > 0 
      ? usersWithRetirementData.reduce((sum, user) => sum + user.years_to_retirement!, 0) / usersWithRetirementData.length 
      : 0;
    const nearRetirementClients = users.filter(user => user.near_retirement).length;

    // Plan maturity
    const planMaturity = {
      new: users.filter(user => user.plan_maturity === 'new').length,
      established: users.filter(user => user.plan_maturity === 'established').length,
      mature: users.filter(user => user.plan_maturity === 'mature').length
    };

    // Activity status
    const activityStatus = {
      active: users.filter(user => user.activity_status === 'active').length,
      stale: users.filter(user => user.activity_status === 'stale').length,
      atRisk: users.filter(user => user.activity_status === 'at_risk').length,
      inactive: users.filter(user => user.activity_status === 'inactive').length
    };

    // Wealth distribution with percentages
    const ranges = [
      { min: 0, max: 500000, label: '0 - 500k' },
      { min: 500000, max: 10000000, label: '500k - 10M' },
      { min: 10000000, max: 50000000, label: '10M - 50M' },
      { min: 50000000, max: Infinity, label: '50M+' }
    ];

    const wealthDistribution = ranges.map(range => {
      const clients = users.filter(user => {
        const balance = user.ending_balance || 0;
        return balance >= range.min && balance < range.max;
      });

      return {
        range: range.label,
        count: clients.length,
        total: clients.reduce((sum, user) => sum + (user.ending_balance || 0), 0),
        percentage: totalClients > 0 ? (clients.length / totalClients) * 100 : 0
      };
    });

    // Trends
    const today = createDateWithoutTimezone(new Date());
    const firstDayOfMonth = createDateWithoutTimezone(new Date(today.getFullYear(), today.getMonth(), 1));

    const newClientsThisMonth = users.filter(user => {
      if (!user.financial_created_at) return false;
      const createdAt = createDateWithoutTimezone(user.financial_created_at || '');
      return createdAt >= firstDayOfMonth;
    }).length;

    const totalGrowthThisMonth = users.reduce((sum, user) => 
      sum + (user.total_returns || 0), 0);

    const averageMonthlyGrowth = totalGrowthThisMonth / (users.length || 1);

    const trends = {
      newClientsThisMonth,
      totalGrowthThisMonth,
      averageMonthlyGrowth,
      inactiveClients,
      growthRate: totalBalance > 0 ? (totalGrowth / totalBalance) * 100 : 0,
      clientRetentionRate: totalClients > 0 ? ((totalClients - inactiveClients) / totalClients) * 100 : 0
    };

    // Actions
    const needsPlanReview = users.filter(user => user.needs_plan_review).length;
    const belowRequiredContribution = users.filter(user => user.below_required_contribution).length;
    const nearRetirement = users.filter(user => user.near_retirement).length;
    const lowReturns = users.filter(user => user.has_low_returns).length;

    const actions = {
      needsPlanReview,
      belowRequiredContribution,
      nearRetirement,
      lowReturns,
      urgentAttention: urgentClients,
      highPriority: highPriorityClients
    };
    setEnhancedMetrics({
      totalClients,
      clientsWithPlan,
      clientsWithOutdatedRecords,
      totalBalance,
      clientsWithActiveRecords,
      averageReturn: averageReturn || 0,
      averageVolatility: averageVolatility || 0,
      averageSharpeRatio: averageSharpeRatio || 0,
      totalGrowth,
      averageEngagementScore: averageEngagementScore || 0,
      urgentClients,
      highPriorityClients,
      inactiveClients,
      activityDistribution,
      averageAge: averageAge || 0,
      averageYearsToRetirement: averageYearsToRetirement || 0,
      nearRetirementClients,
      planMaturity,
      activityStatus,
      wealthDistribution,
      trends,
      actions
    });
  };


  const handleUserSelect = (userId: string) => {
    // Find the client in the search results
    const client = searchResults.find(c => c.id === userId);
    
    // If client doesn't have an investment plan, navigate to simulation with client_id
    if (client && !client.investment_plan_id) {
      navigate(`/simulation?client_id=${userId}`);
    } else {
      // If client has a plan, navigate to client profile as usual
      navigate(`/client/${userId}`);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: unknown) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase.rpc('delete_client', {
        p_client_id: clientId
      });

      if (error) throw error;

      // Update the UI
      setSearchResults(prev => prev.filter(client => client.id !== clientId));
      calculateMetrics(searchResults.filter(client => client.id !== clientId));

      toast({
        title: t('common.success'),
        description: t('brokerDashboard.clientDeleted'),
      });
    } catch (error: unknown) {
      console.error('Error deleting client:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleSimulationClick = () => {
    // Navigate to simulation page
    navigate('/simulation');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Futuristic Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl border border-blue-200 dark:border-slate-700 p-8 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-48 translate-x-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full translate-y-32 -translate-x-32" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Logo variant="minimal" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                    {t('brokerDashboard.title')}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {brokerProfile?.name || 'Welcome back'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {/* Primeira linha: Meu Perfil e Sair */}
                <div className="flex flex-wrap items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate(`/client-profile/${brokerProfile?.id}`)}
                    className="flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 border-blue-200 dark:border-blue-800"
                  >
                    <Avatar 
                      initial={brokerProfile?.name?.[0] || ''} 
                      color="bluePrimary"
                    />
                    <span className="font-medium">{t('brokerDashboard.myProfile')}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleLogout}
                    className="flex items-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-700 dark:hover:border-red-600 transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5" />
                    {t('common.logout')}
                  </Button>
                </div>
                
                {/* Segunda linha: Novo Cliente e Simular Projeção */}
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => navigate('/create-client')}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    {t('brokerDashboard.buttons.newClient')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleSimulationClick}
                    className="flex items-center gap-3 bg-green-50 hover:bg-green-100 text-green-600 border-green-200 hover:border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-700 dark:hover:border-green-600 transition-all duration-300"
                  >
                    <Calculator className="h-5 w-5" />
                    {t('brokerDashboard.buttons.simulation')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsPDFImportDialogOpen(true)}
                    className="flex items-center gap-3 bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200 hover:border-purple-300 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700 dark:hover:border-purple-600 transition-all duration-300"
                  >
                    <FileText className="h-5 w-5" />
                    {t('brokerDashboard.buttons.importPDF') || 'Importar PDF'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="mb-8 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 mb-8">
          <SummaryMetrics metrics={metrics} />
        </div>

        {/* Performance Metrics */}
        <div className="mb-8 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 mb-8">
          <PerformanceMetrics metrics={enhancedMetrics} />
        </div>

        {/* Advanced Analytics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Wealth Distribution Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <AdvancedWealthChart data={enhancedMetrics.wealthDistribution} />
          </div>

          {/* Smart Alerts */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            <SmartAlerts 
              clients={searchResults} 
              onClientSelect={handleUserSelect}
            />
          </div>
        </div>

        {/* Contribution Trends Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
          <ContributionTrendChart data={contributionTrendData} />
        </div>

        {/* Client Access Analysis */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8 p-8">
          <ClientAccessAnalysis 
            clientAccessData={clientAccessData} 
            title={t('brokerDashboard.clientAccessAnalysis.title')}
            showTitle={true}
          />
        </div>

        {/* Client List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <ClientList
            clients={searchResults}
            onClientSelect={handleUserSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            isSearching={isSearching}
            onDeleteClient={handleDeleteClient}
          />
        </div>
      </div>

      {/* PDF Import Dialog */}
      <BrokerPDFImportDialog
        open={isPDFImportDialogOpen}
        onOpenChange={setIsPDFImportDialogOpen}
        clients={searchResults}
      />
    </div>
  );
};

