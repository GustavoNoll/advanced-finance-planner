import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Plus, LogOut, Share2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SummaryMetrics } from '@/components/broker-dashboard/metrics/SummaryMetrics';
import { WealthDistributionChart } from '@/components/broker-dashboard/charts/WealthDistributionChart';
import { PlanningMetrics } from '@/components/broker-dashboard/metrics/PlanningMetrics';
import { TrendMetrics } from '@/components/broker-dashboard/metrics/TrendMetrics';
import { ActionMetrics } from '@/components/broker-dashboard/metrics/ActionMetrics';
import { ClientList } from '@/components/broker-dashboard/client-list/ClientList';
import { UserProfileInvestment, BrokerProfile } from '@/types/broker-dashboard';
import { Logo } from '@/components/ui/logo';
import { Avatar } from '@/components/ui/avatar-initial';
import { useAuth } from '@/components/auth/AuthProvider';
import { Spinner } from '@/components/ui/spinner';

interface WealthDistribution {
  range: string;
  count: number;
  total: number;
}

interface PlanningMetrics {
  averageAge: number;
  averageRetirementAge: number;
  averageDesiredIncome: number;
  planTypes: {
    type1: number; // Encerrar
    type2: number; // Deixar Herança
    type3: number; // Não tocar no principal
  };
}

interface TrendMetrics {
  newClientsThisMonth: number;
  totalGrowthThisMonth: number;
  averageMonthlyGrowth: number;
  inactiveClients: number;
}

interface ActionMetrics {
  needsPlanReview: number;
  belowRequiredContribution: number;
  nearRetirement: number;
  lowReturns: number;
}

interface DashboardMetrics {
  totalClients: number;
  clientsWithPlan: number;
  clientsWithOutdatedRecords: number;
  totalBalance: number;
  clientsWithActiveRecords: number;
  wealthDistribution: WealthDistribution[];
  planning: PlanningMetrics;
  trends: TrendMetrics;
  actions: ActionMetrics;
}

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
      inactiveClients: 0
    },
    actions: {
      needsPlanReview: 0,
      belowRequiredContribution: 0,
      nearRetirement: 0,
      lowReturns: 0
    }
  });

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
  }, [user, navigate, toast, t]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (currentBroker) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, currentBroker]);

  const calculateWealthDistribution = (users: UserProfileInvestment[]): WealthDistribution[] => {
    const ranges = [
      { min: 0, max: 500000, label: '0 - 500k' },
      { min: 500000, max: 10000000, label: '500k - 10M' },
      { min: 10000000, max: 50000000, label: '10M - 50M' },
      { min: 50000000, max: Infinity, label: '50M+' }
    ];

    return ranges.map(range => {
      const clients = users.filter(user => {
        const balance = user.ending_balance || 0;
        return balance >= range.min && balance < range.max;
      });

      return {
        range: range.label,
        count: clients.length,
        total: clients.reduce((sum, user) => sum + (user.ending_balance || 0), 0)
      };
    });
  };

  const calculatePlanningMetrics = async (users: UserProfileInvestment[]) => {
    const usersWithPlan = users.filter(user => user.investment_plan_id);
    
    // Fetch investment plans for these users
    const { data: plans, error } = await supabase
      .from('investment_plans')
      .select('*')
      .in('user_id', usersWithPlan.map(user => user.id));

    if (error) {
      console.error('Error fetching investment plans:', error);
      return null;
    }

    const planTypes = {
      type1: plans.filter(plan => plan.plan_type === '1').length,
      type2: plans.filter(plan => plan.plan_type === '2').length,
      type3: plans.filter(plan => plan.plan_type === '3').length
    };

    const averageDesiredIncome = plans.reduce((sum, plan) => sum + plan.desired_income, 0) / plans.length;
    const averageRetirementAge = plans.reduce((sum, plan) => sum + plan.final_age, 0) / plans.length;

    // Calculate average age using birth_date from the view
    const averageAge = usersWithPlan.reduce((sum, user) => {
      const birthDate = new Date(user.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return sum + age;
    }, 0) / usersWithPlan.length;

    return {
      averageAge,
      averageRetirementAge,
      averageDesiredIncome,
      planTypes
    };
  };

  const calculateTrendMetrics = async (users: UserProfileInvestment[]) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // New clients this month
    const newClientsThisMonth = users.filter(user => {
      const createdAt = new Date(user.financial_created_at || '');
      return createdAt >= firstDayOfMonth;
    }).length;

    // Inactive clients (no records in last 6 months)
    const inactiveClients = users.filter(user => user.is_inactive).length;

    // Calculate growth metrics using the new fields
    const totalGrowthThisMonth = users.reduce((sum, user) => 
      sum + (user.total_returns || 0), 0);

    const averageMonthlyGrowth = totalGrowthThisMonth / (users.length || 1);

    return {
      newClientsThisMonth,
      totalGrowthThisMonth,
      averageMonthlyGrowth,
      inactiveClients
    };
  };

  const calculateActionMetrics = async (users: UserProfileInvestment[]) => {
    const needsPlanReview = users.filter(user => user.needs_plan_review).length;
    const belowRequiredContribution = users.filter(user => user.below_required_contribution).length;
    const nearRetirement = users.filter(user => user.near_retirement).length;
    const lowReturns = users.filter(user => user.has_low_returns).length;

    return {
      needsPlanReview,
      belowRequiredContribution,
      nearRetirement,
      lowReturns
    };
  };

  const calculateMetrics = async (users: UserProfileInvestment[]) => {
    const totalClients = users.length;
    const clientsWithPlan = users.filter(user => user.investment_plan_id).length;
    const clientsWithOutdatedRecords = users.filter(user => user.needs_plan_review).length;
    const clientsWithActiveRecords = users.filter(user => !user.needs_plan_review).length;

    const totalBalance = users.reduce((sum, user) => {
      return sum + (user.ending_balance || 0);
    }, 0);

    const wealthDistribution = calculateWealthDistribution(users);
    const planning = await calculatePlanningMetrics(users);
    const trends = await calculateTrendMetrics(users);
    const actions = await calculateActionMetrics(users);

    setMetrics({
      totalClients,
      clientsWithPlan,
      clientsWithOutdatedRecords,
      totalBalance,
      clientsWithActiveRecords,
      wealthDistribution,
      planning: planning || metrics.planning,
      trends: trends || metrics.trends,
      actions: actions || metrics.actions
    });
  };

  const fetchInitialUsers = async () => {
    if (!currentBroker) return;
    
    setIsSearching(true);
    try {
      const { data: users, error } = await supabase
        .from('user_profiles_investment')
        .select('*')
        .eq('broker_id', currentBroker)
        .order('profile_name');

      if (error) throw error;
      
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
  };

  const handleSearch = async () => {
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
      
      console.log(users);
      console.log(error); 
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
  };

  const handleUserSelect = (userId: string) => {
    // Find the client in the search results
    const client = searchResults.find(c => c.id === userId);
    
    // If client doesn't have an investment plan, navigate to create-plan with client_id
    if (client && !client.investment_plan_id) {
      navigate(`/create-plan?client_id=${userId}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:via-gray-950 dark:to-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <Logo variant="minimal" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{t('brokerDashboard.title')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {brokerProfile?.name || 'Welcome back'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="outline" 
                size="default"
                onClick={() => navigate(`/client-profile/${brokerProfile?.id}`)}
                className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Avatar 
                    initial={brokerProfile?.name?.[0] || ''} 
                    color="bluePrimary"
                  />
                  <span className="text-sm font-medium text-gray-700">{t('brokerDashboard.myProfile')}</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="default"
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                {t('common.logout')}
              </Button>
              
              <Button
                variant="default"
                size="default"
                onClick={() => navigate('/create-client')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t('brokerDashboard.buttons.newClient')}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-8">
          <SummaryMetrics metrics={metrics} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <WealthDistributionChart metrics={metrics} />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <PlanningMetrics metrics={metrics} />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <TrendMetrics metrics={metrics} />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <ActionMetrics metrics={metrics} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
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
    </div>
  );
};

