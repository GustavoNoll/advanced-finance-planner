import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LogOut, Search, Plus, UserX, UserCheck, Users, Wallet, Target, Activity, Eye, EyeOff, Key, TrendingUp, AlertTriangle, Clock, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Zap, ArrowUpRight, ArrowDownRight, Percent } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Avatar } from '@/components/ui/avatar-initial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area, 
  ComposedChart, ScatterChart, Scatter, RadialBarChart, RadialBar,
  Treemap, ReferenceLine, LabelList
} from 'recharts';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserProfileInvestment, EnhancedDashboardMetrics, WealthDistribution, TrendMetrics, ActionMetrics } from '@/types/broker-dashboard';
import { createDateWithoutTimezone } from '@/utils/dateUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BrokerMetrics {
  id: string;
  name: string;
  email: string;
  totalClients: number;
  totalPlans: number;
  totalBalance: number;
  lastActivity: string | null;
  clientsWithActiveRecords: number;
  clientsWithOutdatedRecords: number;
  active: boolean;
  // Enhanced metrics from user_profiles_investment
  enhancedMetrics: EnhancedDashboardMetrics;
  clients: UserProfileInvestment[];
}

interface BrokerProfile {
  id: string;
  name: string;
  active: boolean;
  user: {
    email: string;
  };
}

interface FinancialRecord {
  user_id: string;
  ending_balance: number;
  created_at: string;
  record_year: number;
  record_month: number;
}

// Modern color palette
const MODERN_COLORS = {
  primary: '#6366f1', // Indigo
  secondary: '#8b5cf6', // Violet
  success: '#10b981', // Emerald
  warning: '#f59e0b', // Amber
  danger: '#ef4444', // Red
  info: '#06b6d4', // Cyan
  purple: '#a855f7', // Purple
  pink: '#ec4899', // Pink
  blue: '#3b82f6', // Blue
  green: '#22c55e', // Green
  orange: '#f97316', // Orange
  teal: '#14b8a6', // Teal
};

const GRADIENT_COLORS = [
  { start: '#6366f1', end: '#8b5cf6' }, // Indigo to Violet
  { start: '#10b981', end: '#06b6d4' }, // Emerald to Cyan
  { start: '#f59e0b', end: '#f97316' }, // Amber to Orange
  { start: '#ef4444', end: '#ec4899' }, // Red to Pink
  { start: '#a855f7', end: '#3b82f6' }, // Purple to Blue
];

const CHART_COLORS = [
  MODERN_COLORS.primary,
  MODERN_COLORS.success,
  MODERN_COLORS.warning,
  MODERN_COLORS.danger,
  MODERN_COLORS.info,
  MODERN_COLORS.purple,
  MODERN_COLORS.pink,
  MODERN_COLORS.blue,
  MODERN_COLORS.green,
  MODERN_COLORS.orange,
];

export const AdminDashboard = () => {
  const [brokers, setBrokers] = useState<BrokerMetrics[]>([]);
  const [filteredBrokers, setFilteredBrokers] = useState<BrokerMetrics[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatingBroker, setIsCreatingBroker] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newBroker, setNewBroker] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const itemsPerPage = 10;
  
  // Enhanced metrics states
  const [overallMetrics, setOverallMetrics] = useState<EnhancedDashboardMetrics>({
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
  
  // Trend data states
  const [growthTrendData, setGrowthTrendData] = useState<Array<{
    month: string;
    year: number;
    totalClients: number;
    totalBalance: number;
    newClients: number;
    growthRate: string;
  }>>([]);
  const [brokerPerformanceData, setBrokerPerformanceData] = useState<Array<{
    name: string;
    clients: number;
    balance: number;
    return: number;
    returnFormatted: string;
    sharpe: number;
    sharpeFormatted: string;
    engagement: number;
    engagementFormatted: string;
    growth: number;
    growthFormatted: string;
    risk: number;
    riskFormatted: string;
    activeClients: number;
    totalClients: number;
    efficiency: number;
    efficiencyFormatted: string;
  }>>([]);
  
  // Client access data states
  const [clientAccessData, setClientAccessData] = useState<Array<{
    id: string;
    name: string;
    email: string;
    lastLogin: string;
    brokerName: string;
    daysSinceLogin: number;
  }>>([]);
  
  // All client access data for charts (no limit)
  const [allClientAccessData, setAllClientAccessData] = useState<Array<{
    id: string;
    name: string;
    email: string;
    lastLogin: string;
    brokerName: string;
    daysSinceLogin: number;
  }>>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();


  useEffect(() => {
    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, toast, t]);

  useEffect(() => {
    const updateTheme = () => setIsDark(document.documentElement.classList.contains('dark'))
    updateTheme()
    window.addEventListener('themechange', updateTheme)
    return () => window.removeEventListener('themechange', updateTheme)
  }, [])

  // Generate growth trend data for the last 12 months
  const generateGrowthTrendData = useCallback(async (brokers: BrokerMetrics[]) => {
    const months = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      const year = date.getFullYear();
      
      // Get real data for this month
      const startOfMonth = new Date(year, date.getMonth(), 1);
      const endOfMonth = new Date(year, date.getMonth() + 1, 0);
      
      // Count clients created in this month
      const { data: clientsCreated, error: clientsError } = await supabase
        .from('profiles')
        .select('id, created_at')
        .eq('is_broker', false)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());
      
      if (clientsError) {
        console.error('Error fetching clients for month:', clientsError);
        continue;
      }
      
      const newClients = clientsCreated?.length || 0;
      
      // Get total clients up to this month
      const { data: totalClientsData, error: totalError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_broker', false)
        .lte('created_at', endOfMonth.toISOString());
      
      if (totalError) {
        console.error('Error fetching total clients for month:', totalError);
        continue;
      }
      
      const totalClients = totalClientsData?.length || 0;
      
      // Get total balance for this month (from user_profiles_investment view)
      const { data: balanceData, error: balanceError } = await supabase
        .from('user_profiles_investment')
        .select('ending_balance')
        .lte('financial_created_at', endOfMonth.toISOString());
      
      if (balanceError) {
        console.error('Error fetching balance for month:', balanceError);
        continue;
      }
      
      const totalBalance = balanceData?.reduce((sum, client) => sum + (client.ending_balance || 0), 0) || 0;
      
      months.push({
        month: monthName,
        year: year,
        totalClients: totalClients,
        totalBalance: totalBalance,
        newClients: newClients,
        growthRate: totalClients > 0 ? ((newClients / totalClients) * 100).toFixed(1) : '0.0',
      });
    }
    
    return months;
  }, []);

  // Generate broker performance comparison data (limited to top 50 for performance)
  const generateBrokerPerformanceData = useCallback((brokers: BrokerMetrics[]) => {
    // Sort by total clients and take top 50 for performance
    const topBrokers = [...brokers]
      .sort((a, b) => (Number(b.enhancedMetrics?.totalClients) || 0) - (Number(a.enhancedMetrics?.totalClients) || 0))
      .slice(0, 50);
    
    return topBrokers.map(broker => {
      const metrics = broker.enhancedMetrics;
      const totalClients = Number(metrics?.totalClients) || 0;
      const activeClients = Number(metrics?.clientsWithActiveRecords) || 0;
      const averageReturn = Number(metrics?.averageReturn) || 0;
      const averageSharpeRatio = Number(metrics?.averageSharpeRatio) || 0;
      const averageEngagementScore = Number(metrics?.averageEngagementScore) || 0;
      const averageVolatility = Number(metrics?.averageVolatility) || 0;
      const totalBalance = Number(metrics?.totalBalance) || 0;
      
      // Ensure no NaN values
      const safeReturn = isNaN(averageReturn) ? 0 : averageReturn;
      const safeSharpe = isNaN(averageSharpeRatio) ? 0 : averageSharpeRatio;
      const safeEngagement = isNaN(averageEngagementScore) ? 0 : averageEngagementScore;
      const safeVolatility = isNaN(averageVolatility) ? 0 : averageVolatility;
      const safeGrowth = totalBalance > 0 ? (totalBalance / (totalClients || 1)) / 1000 : 0; // Growth based on average balance per client
      
      return {
        name: broker.name || 'Unknown Broker',
        clients: totalClients,
        balance: totalBalance,
        return: Number(safeReturn * 100), // Keep as number for ScatterChart
        returnFormatted: Number(safeReturn * 100).toFixed(1), // For display
        sharpe: Number(safeSharpe),
        sharpeFormatted: Number(safeSharpe).toFixed(2), // For display
        engagement: Number(safeEngagement),
        engagementFormatted: Number(safeEngagement).toFixed(1), // For display
        growth: Number(safeGrowth), // Keep as number
        growthFormatted: Number(safeGrowth).toFixed(1), // For display
        risk: Number(safeVolatility), // Keep as number for ScatterChart
        riskFormatted: Number(safeVolatility).toFixed(2), // For display
        activeClients: activeClients,
        totalClients: totalClients,
        efficiency: totalClients > 0 ? Number((activeClients / totalClients) * 100) : 0, // Keep as number
        efficiencyFormatted: totalClients > 0 ? Number((activeClients / totalClients) * 100).toFixed(1) : '0.0', // For display
      };
    });
  }, []);

  const calculateEnhancedMetrics = useCallback(async (users: UserProfileInvestment[]) => {
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

    return {
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
    };
  }, []);

  const fetchClientAccessData = async () => {
    try {
      // Get activity statistics using SQL aggregation
      const { data: activityStats, error: statsError } = await supabase
        .rpc('get_client_activity_stats');

      if (statsError) {
        console.error('Error fetching activity stats:', statsError);
        // Fallback to empty data
        setClientAccessData([]);
        setAllClientAccessData([]);
        return;
      }

      // Get recent 20 clients for table
      const { data: recentClients, error: recentError } = await supabase
        .rpc('get_recent_client_access', { limit_count: 20 });

      if (recentError) {
        console.error('Error fetching recent clients:', recentError);
        // Fallback to empty data
        setClientAccessData([]);
        setAllClientAccessData([]);
        return;
      }

      // Get emails for recent clients separately
      const userIds = recentClients?.map((client: { id: string }) => client.id) || [];
      const { data: userEmails, error: emailsError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', userIds);

      if (emailsError) {
        console.error('Error fetching emails:', emailsError);
      }

      const emailMap = userEmails?.reduce((acc: Record<string, string>, user: { id: string; email: string }) => {
        acc[user.id] = user.email;
        return acc;
      }, {}) || {};

      // Process activity stats for charts
      const allAccessData = activityStats?.map((stat: {
        id: string;
        name: string;
        last_active_at: string;
        days_since_login: number;
      }) => ({
        id: stat.id,
        name: stat.name || 'Nome não informado',
        email: '', // Not needed for charts
        lastLogin: stat.last_active_at || 'Nunca',
        brokerName: '', // Not needed for charts
        daysSinceLogin: stat.days_since_login || 999
      })) || [];

      // Process recent clients for table
      const recentAccessData = recentClients?.map((client: {
        id: string;
        name: string;
        email: string;
        last_active_at: string;
        broker_name: string;
        days_since_login: number;
      }) => ({
        id: client.id,
        name: client.name || 'Nome não informado',
        email: emailMap[client.id] || 'Email não encontrado',
        lastLogin: client.last_active_at || 'Nunca',
        brokerName: client.broker_name || 'Broker não encontrado',
        daysSinceLogin: client.days_since_login || 999
      })) || [];

      // Set both datasets
      setClientAccessData(recentAccessData); // For table (20 users)
      setAllClientAccessData(allAccessData); // For charts (all users)

    } catch (error) {
      console.error('Error fetching client access data:', error);
    }
  };


  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (!profile?.is_admin) {
        toast({
          title: t('common.error'),
          description: t('adminDashboard.errors.unauthorized'),
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      fetchBrokerMetrics();
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
      navigate('/login');
    }
  };

  useEffect(() => {
    let filtered = brokers;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(broker => 
        statusFilter === 'active' ? broker.active : !broker.active
      );  
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(broker => 
        broker.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredBrokers(filtered);
  }, [searchQuery, statusFilter, brokers]);

  const fetchBrokerMetrics = async () => {
    try {
      const { data: brokers, error: brokersError } = await supabase
        .from('profiles')
        .select('id, name, active, last_active_at')
        .eq('is_broker', true)
        .not('name', 'ilike', '%teste%');

      if (brokersError) throw brokersError;

      // Get all user emails in a single query
      const userIds = brokers.map(broker => broker.id);
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', userIds);

      if (usersError) throw usersError;

      // Create a map of user_id to email for quick lookup
      const userEmailMap = users?.reduce((acc, user) => {
        acc[user.id] = user.email;
        return acc;
      }, {} as Record<string, string>) || {};

      const brokerMetrics = await Promise.all(
        brokers.map(async (broker) => {
          // Get all clients for this broker using the enhanced view
          const { data: clients, error: clientsError } = await supabase
            .from('user_profiles_investment')
            .select('*')
            .eq('broker_id', broker.id);

          if (clientsError) throw clientsError;

          const clientList = clients || [];
          
          // Calculate enhanced metrics for this broker's clients
          const enhancedMetrics = await calculateEnhancedMetrics(clientList);

          // Calculate basic metrics for backward compatibility
          const totalClients = clientList.length;
          const totalPlans = clientList.filter(client => client.investment_plan_id).length;
          const totalBalance = clientList.reduce((sum, client) => sum + (client.ending_balance || 0), 0);
          const clientsWithActiveRecords = clientList.filter(client => client.activity_status === 'active').length;
          const clientsWithOutdatedRecords = clientList.filter(client => 
            client.activity_status === 'stale' || 
            client.activity_status === 'at_risk' || 
            client.activity_status === 'inactive'
          ).length;

          return {
            id: broker.id,
            name: broker.name || 'Unnamed Broker',
            email: userEmailMap[broker.id] || '',
            totalClients,
            totalPlans,
            totalBalance,
            lastActivity: broker.last_active_at,
            clientsWithActiveRecords,
            clientsWithOutdatedRecords,
            active: broker.active,
            enhancedMetrics,
            clients: clientList,
          };
        })
      );

      setBrokers(brokerMetrics);
      setFilteredBrokers(brokerMetrics);

      // Calculate overall metrics across only active brokers
      const activeBrokers = brokerMetrics.filter(broker => broker.active);
      const allClients = activeBrokers.flatMap(broker => broker.clients);
      const overallMetrics = await calculateEnhancedMetrics(allClients);
      setOverallMetrics(overallMetrics);

      // Generate trend data using only active brokers
      const trendData = await generateGrowthTrendData(activeBrokers);
      setGrowthTrendData(trendData);

      // Generate broker performance data using only active brokers
      const performanceData = generateBrokerPerformanceData(activeBrokers);
      setBrokerPerformanceData(performanceData);

      // Fetch client access data
      await fetchClientAccessData();

    } catch (error) {
      console.error('Error fetching broker metrics:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleCreateBroker = async () => {
    try {
      // Validate fields
      if (!newBroker.email || !newBroker.password || !newBroker.name) {
        toast({
          title: t('common.error'),
          description: t('validation.required'),
          variant: "destructive",
        });
        return;
      }

      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newBroker.email)) {
        toast({
          title: t('common.error'),
          description: t('validation.invalidEmail'),
          variant: "destructive",
        });
        return;
      }

      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', newBroker.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError;
      }

      if (existingUser) {
        toast({
          title: t('common.error'),
          description: t('adminDashboard.errors.emailExists'),
          variant: "destructive",
        });
        return;
      }

      // First create the auth user using admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newBroker.email,
        password: newBroker.password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          name: newBroker.name,
        },
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('Failed to create user');

      // Then create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: newBroker.name,
          is_broker: true,
          active: true, // Set broker as active by default
        });

      if (profileError) {
        // If profile creation fails, try to delete the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      toast({
        title: t('common.success'),
        description: t('adminDashboard.brokerCreated'),
      });

      setIsCreatingBroker(false);
      setNewBroker({ email: '', password: '', name: '' });
      fetchBrokerMetrics();
    } catch (error) {
      console.error('Error creating broker:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleToggleBrokerStatus = async (brokerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: !currentStatus })
        .eq('id', brokerId);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: currentStatus 
          ? t('adminDashboard.brokerDeactivated') 
          : t('adminDashboard.brokerActivated'),
      });

      fetchBrokerMetrics();
    } catch (error) {
      console.error('Error toggling broker status:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        toast({
          title: t('common.error'),
          description: t('validation.required'),
          variant: "destructive",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        toast({
          title: t('common.error'),
          description: t('validation.passwordsDontMatch'),
          variant: "destructive",
        });
        return;
      }

      if (newPassword.length < 6) {
        toast({
          title: t('common.error'),
          description: t('validation.passwordTooShort'),
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('adminDashboard.passwordChanged'),
      });

      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">{t('adminDashboard.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // System-wide metrics for charts
  const systemMetricsData = [
    {
      name: 'Clientes Ativos',
      value: overallMetrics.clientsWithActiveRecords,
      color: MODERN_COLORS.success
    },
    {
      name: 'Clientes Inativos',
      value: overallMetrics.inactiveClients,
      color: MODERN_COLORS.danger
    },
    {
      name: 'Clientes em Risco',
      value: overallMetrics.activityDistribution.atRisk,
      color: MODERN_COLORS.warning
    },
    {
      name: 'Clientes Stale',
      value: overallMetrics.activityDistribution.stale,
      color: MODERN_COLORS.info
    }
  ];

  // Plan maturity distribution
  const planMaturityData = [
    {
      name: 'Planos Novos',
      value: overallMetrics.planMaturity.new,
      color: MODERN_COLORS.primary
    },
    {
      name: 'Planos Estabelecidos',
      value: overallMetrics.planMaturity.established,
      color: MODERN_COLORS.success
    },
    {
      name: 'Planos Maduros',
      value: overallMetrics.planMaturity.mature,
      color: MODERN_COLORS.warning
    }
  ];

  // Performance metrics by category
  const performanceMetricsData = [
    {
      name: 'Retorno Médio',
      value: (overallMetrics.averageReturn * 100).toFixed(1),
      unit: '%',
      color: MODERN_COLORS.success
    },
    {
      name: 'Volatilidade Média',
      value: overallMetrics.averageVolatility.toFixed(2),
      unit: '',
      color: MODERN_COLORS.warning
    },
    {
      name: 'Sharpe Ratio Médio',
      value: overallMetrics.averageSharpeRatio.toFixed(2),
      unit: '',
      color: MODERN_COLORS.info
    },
    {
      name: 'Engajamento Médio',
      value: overallMetrics.averageEngagementScore.toFixed(1),
      unit: '/100',
      color: MODERN_COLORS.primary
    }
  ];


  const paginatedBrokers = filteredBrokers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBrokers.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <Logo variant="minimal" />
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{t('adminDashboard.title')}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t('adminDashboard.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog open={isCreatingBroker} onOpenChange={setIsCreatingBroker}>
                <DialogTrigger asChild>
                  <Button variant="default" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t('adminDashboard.createBroker')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('adminDashboard.createBroker')}</DialogTitle>
                    <DialogDescription>
                      {t('adminDashboard.createBrokerDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        {t('adminDashboard.brokerName')}
                      </label>
                      <Input
                        id="name"
                        value={newBroker.name}
                        onChange={(e) => setNewBroker({ ...newBroker, name: e.target.value })}
                        placeholder={t('adminDashboard.brokerNamePlaceholder')}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        {t('adminDashboard.brokerEmail')}
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={newBroker.email}
                        onChange={(e) => setNewBroker({ ...newBroker, email: e.target.value })}
                        placeholder={t('adminDashboard.brokerEmailPlaceholder')}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        {t('adminDashboard.brokerPassword')}
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={newBroker.password}
                          onChange={(e) => setNewBroker({ ...newBroker, password: e.target.value })}
                          placeholder={t('adminDashboard.brokerPasswordPlaceholder')}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingBroker(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={handleCreateBroker}>
                      {t('common.create')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Key className="h-4 w-4" />
                    {t('adminDashboard.changePassword')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('adminDashboard.changePassword')}</DialogTitle>
                    <DialogDescription>
                      {t('adminDashboard.changePasswordDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="newPassword" className="text-sm font-medium">
                        {t('adminDashboard.newPassword')}
                      </label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={t('adminDashboard.newPasswordPlaceholder')}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium">
                        {t('adminDashboard.confirmPassword')}
                      </label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('adminDashboard.confirmPasswordPlaceholder')}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={handleChangePassword}>
                      {t('common.change')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                size="default"
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                {t('common.logout')}
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('adminDashboard.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              {t('adminDashboard.allStatus')}
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('active')}
            >
              {t('adminDashboard.activeOnly')}
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('inactive')}
            >
              {t('adminDashboard.inactiveOnly')}
            </Button>
          </div>
        </div>

        {/* Brokers List */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('adminDashboard.brokersList')}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/4">
                      {t('adminDashboard.broker')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/6">
                      {t('adminDashboard.status')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/6">
                      {t('adminDashboard.clients')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/6">
                      {t('adminDashboard.plans')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/6">
                      {t('adminDashboard.balance')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/6">
                      {t('adminDashboard.lastActivity')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/6">
                      {t('adminDashboard.activeClients')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/6">
                      {t('adminDashboard.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {paginatedBrokers.map((broker) => (
                    <tr key={broker.id} className="hover:bg-muted">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Avatar initial={broker.name[0]} color="bluePrimary" />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-foreground truncate max-w-[180px]">{broker.name}</div>
                            <div className="text-[10px] text-muted-foreground truncate max-w-[180px]">{broker.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          variant={broker.active ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleBrokerStatus(broker.id, broker.active)}
                          className={broker.active ? "bg-green-600 hover:bg-green-700" : "text-gray-500"}
                        >
                          {broker.active ? t('adminDashboard.active') : t('adminDashboard.inactive')}
                        </Button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-foreground">{broker.totalClients}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-foreground">{broker.totalPlans}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-foreground">
                          {formatLargeNumber(broker.totalBalance)}
                          <span className="text-xs text-muted-foreground ml-1">{formatCurrency(broker.totalBalance)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-foreground">
                          {formatDate(broker.lastActivity)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-foreground">
                          {broker.clientsWithActiveRecords} / {broker.totalClients}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleBrokerStatus(broker.id, broker.active)}
                            className={`p-2 transition-colors ${
                              broker.active 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-green-500 hover:text-green-600'
                            }`}
                            title={broker.active ? t('adminDashboard.deactivateClient') : t('adminDashboard.activateClient')}
                          >
                            {broker.active ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {t('adminDashboard.showingItems', {
                  from: (currentPage - 1) * itemsPerPage + 1,
                  to: Math.min(currentPage * itemsPerPage, filteredBrokers.length),
                  total: filteredBrokers.length
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  {t('adminDashboard.previous')}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t('adminDashboard.page')} {currentPage} {t('adminDashboard.of')} {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t('adminDashboard.next')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Brokers Ativos
                </CardTitle>
                <Avatar 
                  icon={Users} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="blue"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">{filteredBrokers.filter(b => b.active).length}</p>
                <p className="text-sm text-muted-foreground">{t('adminDashboard.activeBrokers')}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {filteredBrokers.length} {t('adminDashboard.totalBrokers')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.totalClients')}
                </CardTitle>
                <Avatar 
                  icon={UserCheck} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="green"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">
                  {formatLargeNumber(overallMetrics.totalClients)}
                </p>
                <p className="text-sm text-muted-foreground">{t('adminDashboard.clients')}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {formatLargeNumber(overallMetrics.clientsWithActiveRecords)} {t('adminDashboard.active')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.totalPlans')}
                </CardTitle>
                <Avatar 
                  icon={Target} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="purple"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">
                  {formatLargeNumber(overallMetrics.clientsWithPlan)}
                </p>
                <p className="text-sm text-muted-foreground">{t('adminDashboard.plans')}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {formatLargeNumber(overallMetrics.clientsWithOutdatedRecords)} {t('adminDashboard.needReview')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.totalBalance')}
                </CardTitle>
                <Avatar 
                  icon={Wallet} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="green"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">
                  {formatCurrency(overallMetrics.totalBalance)}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {t('adminDashboard.averagePerClient')}: {formatCurrency(
                    overallMetrics.totalBalance / (overallMetrics.totalClients || 1)
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Performance Média
                </CardTitle>
                <Avatar 
                  icon={TrendingUp} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="green"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">
                  {(overallMetrics.averageReturn * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">retorno/mês</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Sharpe: {overallMetrics.averageSharpeRatio.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Clientes Prioritários
                </CardTitle>
                <Avatar 
                  icon={AlertTriangle} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="red"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">
                  {overallMetrics.urgentClients + overallMetrics.highPriorityClients}
                </p>
                <p className="text-sm text-muted-foreground">urgentes</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {overallMetrics.urgentClients} urgentes, {overallMetrics.highPriorityClients} alta prioridade
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Idade Média
                </CardTitle>
                <Avatar 
                  icon={Clock} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="blue"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">
                  {overallMetrics.averageAge.toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">anos</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {overallMetrics.averageYearsToRetirement.toFixed(0)} anos para aposentadoria
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Engajamento
              </CardTitle>
                <Avatar 
                  icon={Activity} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="purple"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">
                  {overallMetrics.averageEngagementScore.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">/100</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {overallMetrics.activityDistribution.active} ativos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Trends & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Growth Trend Chart */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">Crescimento Mensal</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Tendência dos últimos 12 meses
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthTrendData.length > 0 ? growthTrendData : [{ month: 'Nenhum dado', totalClients: 0, newClients: 0 }]}>
                    <defs>
                      <linearGradient id="clientGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={MODERN_COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={MODERN_COLORS.primary} stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={MODERN_COLORS.success} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={MODERN_COLORS.success} stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => {
                        if (isNaN(value) || value === null || value === undefined) return '0';
                        return formatLargeNumber(value);
                      }}
                      domain={['dataMin', 'dataMax']}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = growthTrendData.find(d => d.month === label);
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">{label}</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Clientes</p>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {formatLargeNumber(data?.totalClients || 0)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Patrimônio Total</p>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {formatCurrency(data?.totalBalance || 0)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Novos Clientes</p>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {formatLargeNumber(data?.newClients || 0)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalClients" 
                      stroke={MODERN_COLORS.primary}
                      strokeWidth={3}
                      fill="url(#clientGradient)"
                      name="Total Clientes"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="newClients" 
                      stroke={MODERN_COLORS.warning}
                      strokeWidth={2}
                      fill="url(#balanceGradient)"
                      name="Novos Clientes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Wealth Distribution - Modern Donut Chart */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                  <PieChartIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">Distribuição de Riqueza</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Por faixas de patrimônio
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overallMetrics.wealthDistribution.filter(item => item.count > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="range"
                    >
                      {overallMetrics.wealthDistribution.filter(item => item.count > 0).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        
                        // Get data from the nested payload structure
                        const data = payload[0]?.payload?.payload || payload[0]?.payload;
                        const count = payload[0]?.value || 0;
                        const percentage = data?.percentage || 0;
                        const total = data?.total || 0;
                        const range = data?.range || label || 'N/A';
                        
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{range}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Clientes:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {count}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Percentual:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Total:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {formatCurrency(total)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={60}
                      formatter={(value) => (
                        <span className="text-sm text-slate-600 dark:text-slate-400">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Activity Status */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">Status dos Clientes</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Visão geral do sistema
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={systemMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{label}</p>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Clientes: <span className="font-semibold text-slate-900 dark:text-slate-100">{payload[0].value}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={MODERN_COLORS.primary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Plan Maturity Distribution */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">Maturidade dos Planos</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Distribuição por estágio
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planMaturityData.filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {planMaturityData.filter(item => item.value > 0).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = planMaturityData.find(d => d.name === label);
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{label}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Planos:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={60}
                      formatter={(value) => (
                        <span className="text-sm text-slate-600 dark:text-slate-400">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>


        </div>

        {/* Advanced Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Broker Performance Scatter Plot */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">Performance vs Risco</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Análise de retorno vs volatilidade
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={brokerPerformanceData.length > 0 ? brokerPerformanceData : [{ name: 'Nenhum dado', return: 0, risk: 0, sharpe: 0, clients: 0, returnFormatted: '0', riskFormatted: '0', sharpeFormatted: '0' }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      type="number" 
                      dataKey="risk" 
                      name="Risco (Volatilidade)"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="return" 
                      name="Retorno (%)"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">{data.name}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Retorno:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data.returnFormatted}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Risco:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data.riskFormatted}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Sharpe:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data.sharpeFormatted}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Clientes:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data.clients}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Scatter 
                      dataKey="return" 
                      fill={MODERN_COLORS.primary}
                      r={8}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Status Radial Chart */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">Status de Atividade</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Distribuição por status
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="90%" 
                    data={[
                      { 
                        name: 'Ativos', 
                        value: overallMetrics.activityDistribution.active || 0, 
                        fill: MODERN_COLORS.success,
                        percentage: overallMetrics.totalClients > 0 ? (((overallMetrics.activityDistribution.active || 0) / overallMetrics.totalClients) * 100).toFixed(1) : '0.0'
                      },
                      { 
                        name: 'Em Risco', 
                        value: overallMetrics.activityDistribution.atRisk || 0, 
                        fill: MODERN_COLORS.warning,
                        percentage: overallMetrics.totalClients > 0 ? (((overallMetrics.activityDistribution.atRisk || 0) / overallMetrics.totalClients) * 100).toFixed(1) : '0.0'
                      },
                      { 
                        name: 'Inativos', 
                        value: overallMetrics.activityDistribution.inactive || 0, 
                        fill: MODERN_COLORS.danger,
                        percentage: overallMetrics.totalClients > 0 ? (((overallMetrics.activityDistribution.inactive || 0) / overallMetrics.totalClients) * 100).toFixed(1) : '0.0'
                      },
                      { 
                        name: 'Stale', 
                        value: overallMetrics.activityDistribution.stale || 0, 
                        fill: MODERN_COLORS.info,
                        percentage: overallMetrics.totalClients > 0 ? (((overallMetrics.activityDistribution.stale || 0) / overallMetrics.totalClients) * 100).toFixed(1) : '0.0'
                      }
                    ].filter(item => item.value > 0)}
                  >
                    <RadialBar 
                      dataKey="value" 
                      cornerRadius={10} 
                      fill="#8884d8"
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{data.name}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Clientes:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data.value}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Percentual:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data.percentage}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={60}
                      formatter={(value) => (
                        <span className="text-sm text-slate-600 dark:text-slate-400">{value}</span>
                      )}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Performance Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Performance Metrics Overview */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">Métricas de Performance</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Indicadores do sistema
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = performanceMetricsData.find(d => d.name === label);
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{label}</p>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Valor: <span className="font-semibold text-slate-900 dark:text-slate-100">{payload[0].value}{data?.unit}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={MODERN_COLORS.primary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Broker Efficiency & Growth Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Broker Efficiency Comparison */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">Eficiência dos Brokers</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Clientes ativos vs total
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={brokerPerformanceData.length > 0 ? brokerPerformanceData : [{ name: 'Nenhum dado', totalClients: 0, activeClients: 0, efficiency: 0, efficiencyFormatted: '0' }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = brokerPerformanceData.find(d => d.name === label);
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">{label}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Total Clientes:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.totalClients}
                                </span>
                            </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Clientes Ativos:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.activeClients}
                                </span>
                            </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Eficiência:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.efficiencyFormatted}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar 
                      dataKey="totalClients" 
                      fill={MODERN_COLORS.info}
                      name="Total Clientes"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="activeClients" 
                      fill={MODERN_COLORS.success}
                      name="Clientes Ativos"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke={MODERN_COLORS.warning}
                      strokeWidth={3}
                      name="Eficiência (%)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Growth Rate Analysis */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                  <ArrowUpRight className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">Taxa de Crescimento</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Performance por broker
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brokerPerformanceData.length > 0 ? brokerPerformanceData : [{ name: 'Nenhum dado', growth: 0, growthFormatted: '0' }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = brokerPerformanceData.find(d => d.name === label);
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">{label}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Crescimento:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.growthFormatted}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Retorno:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.returnFormatted}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Engajamento:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.engagementFormatted}/100
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar 
                      dataKey="growth" 
                      fill="url(#growthGradient)"
                      name="Taxa de Crescimento (%)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={MODERN_COLORS.success} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={MODERN_COLORS.success} stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Access Analysis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t('adminDashboard.clientAccessAnalysis.title')}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Activity Status Distribution */}
            <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.clientAccessAnalysis.activityStatus.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.clientAccessAnalysis.activityStatus.description')}
                  </p>
                </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { 
                        status: t('adminDashboard.clientAccessAnalysis.activityStatus.today'), 
                        count: allClientAccessData.filter(c => c.daysSinceLogin === 0).length,
                        color: MODERN_COLORS.success
                      },
                      { 
                        status: t('adminDashboard.clientAccessAnalysis.activityStatus.thisWeek'), 
                        count: allClientAccessData.filter(c => c.daysSinceLogin > 0 && c.daysSinceLogin <= 7).length,
                        color: MODERN_COLORS.info
                      },
                      { 
                        status: t('adminDashboard.clientAccessAnalysis.activityStatus.thisMonth'), 
                        count: allClientAccessData.filter(c => c.daysSinceLogin > 7 && c.daysSinceLogin <= 30).length,
                        color: MODERN_COLORS.warning
                      },
                      { 
                        status: t('adminDashboard.clientAccessAnalysis.activityStatus.inactive'), 
                        count: allClientAccessData.filter(c => c.daysSinceLogin > 30).length,
                        color: MODERN_COLORS.danger
                      }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                      <XAxis 
                        dataKey="status" 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (!active || !payload || !payload.length) return null;
                          return (
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{label}</p>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Clientes: <span className="font-semibold text-slate-900 dark:text-slate-100">{payload[0].value}</span>
                                </p>
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill={MODERN_COLORS.primary}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Client Access Summary */}
            <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.clientAccessAnalysis.accessSummary.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.clientAccessAnalysis.accessSummary.description')}
                  </p>
                </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.clientAccessAnalysis.accessSummary.totalClients')}</span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {allClientAccessData.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.clientAccessAnalysis.accessSummary.accessedToday')}</span>
                    <span className="text-lg font-semibold text-green-600">
                      {allClientAccessData.filter(c => c.daysSinceLogin === 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.clientAccessAnalysis.accessSummary.accessedThisWeek')}</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {allClientAccessData.filter(c => c.daysSinceLogin <= 7).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.clientAccessAnalysis.accessSummary.inactive30Days')}</span>
                    <span className="text-lg font-semibold text-red-600">
                      {allClientAccessData.filter(c => c.daysSinceLogin > 30).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Client Access Table */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.clientAccessAnalysis.recentAccess.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    Últimos 20 clientes que acessaram a plataforma
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('adminDashboard.clientAccessAnalysis.recentAccess.client')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('adminDashboard.clientAccessAnalysis.recentAccess.broker')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('adminDashboard.clientAccessAnalysis.recentAccess.lastAccess')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('adminDashboard.clientAccessAnalysis.recentAccess.status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {clientAccessData.slice(0, 20).map((client) => (
                      <tr key={client.id} className="hover:bg-muted">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <Avatar initial={client.name[0]} color="bluePrimary" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-foreground truncate max-w-[180px]">
                                {client.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                                {client.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-foreground">{client.brokerName}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-foreground">
                            {client.lastLogin === 'Nunca' ? t('adminDashboard.clientAccessAnalysis.recentAccess.never') : formatDate(client.lastLogin)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            client.daysSinceLogin === 0 
                              ? 'bg-green-100 text-green-800' 
                              : client.daysSinceLogin <= 7 
                              ? 'bg-blue-100 text-blue-800'
                              : client.daysSinceLogin <= 30
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {client.daysSinceLogin === 0 
                              ? t('adminDashboard.clientAccessAnalysis.recentAccess.today')
                              : client.daysSinceLogin === 1
                              ? t('adminDashboard.clientAccessAnalysis.recentAccess.yesterday')
                              : client.daysSinceLogin <= 7
                              ? `${client.daysSinceLogin} ${t('adminDashboard.clientAccessAnalysis.recentAccess.days')}`
                              : client.daysSinceLogin <= 30
                              ? `${client.daysSinceLogin} ${t('adminDashboard.clientAccessAnalysis.recentAccess.days')}`
                              : t('adminDashboard.clientAccessAnalysis.recentAccess.inactive')
                            }
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 