import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LogOut, Search, Plus, UserX, UserCheck, Users, Wallet, Target, Activity, Eye, EyeOff, Key, TrendingUp, AlertTriangle, Clock, PieChart as PieChartIcon, LineChart as LineChartIcon, Zap, ArrowUpRight, ArrowDownRight, Percent, Shield, Upload, BarChart as BarChartIcon } from 'lucide-react';
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
import { ClientAccessAnalysis } from '@/components/shared/ClientAccessAnalysis';
import { useAccessData } from '@/hooks/useAccessData';
import { useAdminStatementImports } from '@/hooks/useStatementImports';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InvestmentPolicyInsights } from '@/components/admin/InvestmentPolicyInsights';
import { BrokerAccessAnalysis } from '@/components/admin/BrokerAccessAnalysis';
import { tabTriggerActiveBlue } from '@/lib/gradient-classes';
import { StatementImportsList } from '@/components/shared/StatementImportsList';

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
  const [activeBrokerIds, setActiveBrokerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{ id: string; name: string } | null>(null);
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
  
  // Age distribution data state
  const [ageDistributionData, setAgeDistributionData] = useState<Array<{
    ageRange: string;
    count: number;
    percentage: number;
  }>>([]);
  
  // Access data using unified hook
  const { 
    clientAccessData, 
    brokerAccessData,
    fetchClientAccessData,
    fetchBrokerAccessData
  } = useAccessData({ 
    type: 'client',
    activeBrokerIds 
  });
  
  // Statement imports data using hook
  const {
    statementImports,
    statementImportsByDay,
    statementImportsStats,
    loading: statementImportsLoading,
    error: statementImportsError,
    refetch: refetchStatementImports
  } = useAdminStatementImports(30);

  // Map clients and brokers for imports
  const [clientsMap, setClientsMap] = useState<Record<string, { name: string; email: string; broker_id: string | null }>>({});
  const [brokersMap, setBrokersMap] = useState<Record<string, { name: string; email: string }>>({});
  
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

  // Fetch clients and brokers data for imports
  useEffect(() => {
    const fetchImportsData = async () => {
      if (statementImports.length === 0) return;

      const profileIds = [...new Set(statementImports.map(imp => imp.profile_id))];
      
      // Fetch clients
      const { data: clientsData } = await supabase
        .from('user_profiles_investment')
        .select('id, profile_name, email, broker_id')
        .in('id', profileIds);

      const clientsMapData: Record<string, { name: string; email: string; broker_id: string | null }> = {};
      clientsData?.forEach(client => {
        clientsMapData[client.id] = {
          name: client.profile_name || client.email || client.id.slice(0, 8),
          email: client.email || '',
          broker_id: client.broker_id
        };
      });
      setClientsMap(clientsMapData);

      // Fetch brokers
      const brokerIds = [...new Set(clientsData?.map(c => c.broker_id).filter(Boolean) || [])];
      if (brokerIds.length > 0) {
        const { data: brokersData } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', brokerIds);

        const { data: usersData } = await supabase
          .from('users')
          .select('id, email')
          .in('id', brokerIds);

        const brokersMapData: Record<string, { name: string; email: string }> = {};
        brokersData?.forEach(broker => {
          const userEmail = usersData?.find(u => u.id === broker.id)?.email || '';
          brokersMapData[broker.id] = {
            name: broker.name || userEmail || broker.id.slice(0, 8),
            email: userEmail
          };
        });
        setBrokersMap(brokersMapData);
      }
    };

    fetchImportsData();
  }, [statementImports]);

  // Generate growth trend data for the last 12 months - OPTIMIZED: Single query instead of 36
  const generateGrowthTrendData = useCallback(async (brokers: BrokerMetrics[]) => {
    const today = new Date();
    const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    
    // Single query to get all clients created in the last 12 months
    const { data: allClients, error: clientsError } = await supabase
      .from('profiles')
      .select('id, created_at')
      .eq('is_broker', false)
      .gte('created_at', twelveMonthsAgo.toISOString());
    
    if (clientsError) {
      console.error('Error fetching clients for trend:', clientsError);
      return [];
    }
    
    // Single query to get all balance data
    const { data: allBalanceData, error: balanceError } = await supabase
      .from('user_profiles_investment')
      .select('ending_balance, financial_created_at')
      .not('financial_created_at', 'is', null);
    
    if (balanceError) {
      console.error('Error fetching balance for trend:', balanceError);
    }
    
    // Process data in memory
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      const year = date.getFullYear();
      
      const startOfMonth = new Date(year, date.getMonth(), 1);
      const endOfMonth = new Date(year, date.getMonth() + 1, 0);
      
      // Count clients created in this month (from in-memory data)
      const newClients = allClients?.filter(client => {
        const createdAt = new Date(client.created_at);
        return createdAt >= startOfMonth && createdAt <= endOfMonth;
      }).length || 0;
      
      // Count total clients up to this month (from in-memory data)
      const totalClients = allClients?.filter(client => {
        const createdAt = new Date(client.created_at);
        return createdAt <= endOfMonth;
      }).length || 0;
      
      // Calculate total balance for this month (from in-memory data)
      const totalBalance = allBalanceData?.filter(balance => {
        if (!balance.financial_created_at) return false;
        const createdAt = new Date(balance.financial_created_at);
        return createdAt <= endOfMonth;
      }).reduce((sum, client) => sum + (client.ending_balance || 0), 0) || 0;
      
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
    // Filter out inactive brokers and sort by comprehensive performance score
    const activeBrokers = brokers.filter(broker => broker.active && broker.enhancedMetrics);
    
    // Calculate comprehensive performance score for sorting
    const brokersWithScore = activeBrokers.map(broker => {
      const metrics = broker.enhancedMetrics;
      const totalClients = Number(metrics?.totalClients) || 0;
      const totalBalance = Number(metrics?.totalBalance) || 0;
      const averageSharpeRatio = Number(metrics?.averageSharpeRatio) || 0;
      const averageEngagementScore = Number(metrics?.averageEngagementScore) || 0;
      const clientsWithActiveRecords = Number(metrics?.clientsWithActiveRecords) || 0;
      
      // Calculate comprehensive performance score
      const clientScore = totalClients * 0.3; // 30% weight for client count
      const balanceScore = (totalBalance / 1000000) * 0.4; // 40% weight for total balance (in millions)
      const sharpeScore = averageSharpeRatio * 0.2; // 20% weight for Sharpe ratio
      const engagementScore = averageEngagementScore * 0.1; // 10% weight for engagement
      
      const performanceScore = clientScore + balanceScore + sharpeScore + engagementScore;
      
      return { ...broker, performanceScore };
    });
    
    // Sort by performance score and take top 50
    const topBrokers = brokersWithScore
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 50);
    
    return topBrokers.map(broker => {
      const metrics = broker.enhancedMetrics;
      const totalClients = Number(metrics?.totalClients) || 0;
      const activeClients = Number(metrics?.clientsWithActiveRecords) || 0;
      const averageSharpeRatio = Number(metrics?.averageSharpeRatio) || 0;
      const averageEngagementScore = Number(metrics?.averageEngagementScore) || 0;
      const averageVolatility = Number(metrics?.averageVolatility) || 0;
      const totalBalance = Number(metrics?.totalBalance) || 0;
      const totalGrowth = Number(metrics?.totalGrowth) || 0;
      const urgentClients = Number(metrics?.urgentClients) || 0;
      const highPriorityClients = Number(metrics?.highPriorityClients) || 0;
      const inactiveClients = Number(metrics?.inactiveClients) || 0;
      
      // Enhanced data validation and safe calculations
      const safeSharpe = isNaN(averageSharpeRatio) ? 0 : averageSharpeRatio;
      const safeEngagement = isNaN(averageEngagementScore) ? 0 : averageEngagementScore;
      const safeVolatility = isNaN(averageVolatility) ? 0 : averageVolatility;
      
      // Calculate growth rate based on total growth vs total balance
      const growthRate = totalBalance > 0 ? (totalGrowth / totalBalance) * 100 : 0;
      const safeGrowthRate = isNaN(growthRate) ? 0 : growthRate;
      
      // Calculate efficiency metrics
      const clientEfficiency = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;
      const balancePerClient = totalClients > 0 ? totalBalance / totalClients : 0;
      
      
      // Calculate client health score
      const totalProblematicClients = urgentClients + highPriorityClients + inactiveClients;
      const clientHealthScore = totalClients > 0 ? ((totalClients - totalProblematicClients) / totalClients) * 100 : 0;
      
      return {
        name: broker.name || 'Unknown Broker',
        clients: totalClients,
        balance: totalBalance,
        sharpe: Number(safeSharpe),
        sharpeFormatted: Number(safeSharpe).toFixed(2), // For display
        engagement: Number(safeEngagement),
        engagementFormatted: Number(safeEngagement).toFixed(1), // For display
        growth: Number(safeGrowthRate), // Keep as number
        growthFormatted: Number(safeGrowthRate).toFixed(1), // For display
        risk: Number(safeVolatility), // Keep as number for ScatterChart
        riskFormatted: Number(safeVolatility).toFixed(2), // For display
        activeClients: activeClients,
        totalClients: totalClients,
        efficiency: Number(clientEfficiency), // Keep as number
        efficiencyFormatted: Number(clientEfficiency).toFixed(1), // For display
        // Enhanced metrics
        balancePerClient: Number(balancePerClient),
        balancePerClientFormatted: Number(balancePerClient).toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }),
        clientHealthScore: Number(clientHealthScore),
        clientHealthScoreFormatted: Number(clientHealthScore).toFixed(1),
        urgentClients: urgentClients,
        highPriorityClients: highPriorityClients,
        inactiveClients: inactiveClients,
        totalGrowth: totalGrowth,
        totalGrowthFormatted: Number(totalGrowth).toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }),
        performanceScore: broker.performanceScore,
        performanceScoreFormatted: Number(broker.performanceScore).toFixed(1)
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
      ? usersWithReturnData.reduce((sum, user) => sum + user.average_monthly_return_rate/100, 0) / usersWithReturnData.length 
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

  // Generate age distribution data
  const generateAgeDistributionData = useCallback((brokers: BrokerMetrics[]) => {
    // Collect all clients from all brokers
    const allClients = brokers.flatMap(broker => broker.clients || []);
    
    // Filter clients with valid age data
    const clientsWithAge = allClients.filter(client => 
      client.current_age !== null && 
      client.current_age !== undefined && 
      client.current_age > 0
    );
    
    // Define age ranges
    const ageRanges = [
      { min: 18, max: 25, label: '18-25' },
      { min: 26, max: 35, label: '26-35' },
      { min: 36, max: 45, label: '36-45' },
      { min: 46, max: 55, label: '46-55' },
      { min: 56, max: 65, label: '56-65' },
      { min: 66, max: 100, label: '66+' }
    ];
    
    // Count clients in each age range
    const ageDistribution = ageRanges.map(range => {
      const count = clientsWithAge.filter(client => 
        client.current_age! >= range.min && client.current_age! <= range.max
      ).length;
      
      const percentage = clientsWithAge.length > 0 
        ? (count / clientsWithAge.length) * 100 
        : 0;
      
      return {
        ageRange: range.label,
        count,
        percentage: Number(percentage.toFixed(1))
      };
    });
    
    return ageDistribution;
  }, []);



  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin, id, name')
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
      setAdminProfile({ id: profile.id, name: profile.name || 'Admin' });
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
        broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        broker.email.toLowerCase().includes(searchQuery.toLowerCase())
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

      // OPTIMIZED: Get all clients in a single query instead of N queries (one per broker)
      const brokerIds = brokers.map(broker => broker.id);
      const { data: allClientsData, error: allClientsError } = await supabase
        .from('user_profiles_investment')
        .select('*')
        .in('broker_id', brokerIds);

      if (allClientsError) throw allClientsError;

      // Group clients by broker_id in memory
      const clientsByBroker = (allClientsData || []).reduce((acc, client) => {
        const brokerId = client.broker_id;
        if (!acc[brokerId]) {
          acc[brokerId] = [];
        }
        acc[brokerId].push(client);
        return acc;
      }, {} as Record<string, typeof allClients>);

      // Process broker metrics in parallel (no more queries, just calculations)
      const brokerMetrics = await Promise.all(
        brokers.map(async (broker) => {
          const clientList = clientsByBroker[broker.id] || [];
          
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
      const activeBrokerIdsList = activeBrokers.map(broker => broker.id);
      setActiveBrokerIds(activeBrokerIdsList);
      const allClients = activeBrokers.flatMap(broker => broker.clients);
      
      // OPTIMIZED: Run independent operations in parallel
      const [overallMetrics, trendData] = await Promise.all([
        calculateEnhancedMetrics(allClients),
        generateGrowthTrendData(activeBrokers)
      ]);
      
      setOverallMetrics(overallMetrics);
      setGrowthTrendData(trendData);

      // Generate broker performance data using only active brokers (synchronous, no queries)
      const performanceData = generateBrokerPerformanceData(activeBrokers);
      setBrokerPerformanceData(performanceData);

      // Generate age distribution data (synchronous, no queries)
      const ageData = generateAgeDistributionData(activeBrokers);
      setAgeDistributionData(ageData);

      // Fetch client and broker access data (runs in parallel with statement imports hook)
      fetchClientAccessData();
      fetchBrokerAccessData();

      // Statement imports are fetched automatically by the hook

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
      
      // Check if error is same_password
      const supabaseError = error as { code?: string; message?: string };
      if (supabaseError.code === 'same_password') {
        toast({
          title: t('common.error'),
          description: t('adminDashboard.errors.samePassword'),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('common.error'),
          description: supabaseError.message || (error instanceof Error ? error.message : String(error)),
          variant: "destructive",
        });
      }
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
      name: t('adminDashboard.charts.systemMetrics.activeClients'),
      value: overallMetrics.clientsWithActiveRecords,
      color: MODERN_COLORS.success
    },
    {
      name: t('adminDashboard.charts.systemMetrics.inactiveClients'),
      value: overallMetrics.inactiveClients,
      color: MODERN_COLORS.danger
    },
    {
      name: t('adminDashboard.charts.systemMetrics.atRiskClients'),
      value: overallMetrics.activityDistribution.atRisk,
      color: MODERN_COLORS.warning
    },
    {
      name: t('adminDashboard.charts.systemMetrics.staleClients'),
      value: overallMetrics.activityDistribution.stale,
      color: MODERN_COLORS.info
    }
  ];

  // Plan maturity distribution
  const planMaturityData = [
    {
      name: t('adminDashboard.charts.planMaturity.new'),
      value: overallMetrics.planMaturity.new,
      color: MODERN_COLORS.primary
    },
    {
      name: t('adminDashboard.charts.planMaturity.established'),
      value: overallMetrics.planMaturity.established,
      color: MODERN_COLORS.success
    },
    {
      name: t('adminDashboard.charts.planMaturity.mature'),
      value: overallMetrics.planMaturity.mature,
      color: MODERN_COLORS.warning
    }
  ];

  // Performance metrics by category
  const performanceMetricsData = [
    {
      name: t('adminDashboard.charts.performanceMetrics.averageReturn'),
      value: (overallMetrics.averageReturn * 100).toFixed(1),
      unit: '%',
      color: MODERN_COLORS.success
    },
    {
      name: t('adminDashboard.charts.performanceMetrics.averageVolatility'),
      value: overallMetrics.averageVolatility.toFixed(2),
      unit: '',
      color: MODERN_COLORS.warning
    },
    {
      name: t('adminDashboard.charts.performanceMetrics.averageSharpeRatio'),
      value: overallMetrics.averageSharpeRatio.toFixed(2),
      unit: '',
      color: MODERN_COLORS.info
    },
    {
      name: t('adminDashboard.charts.performanceMetrics.averageEngagement'),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Fixed Task Bar - Nubank Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Logo variant="minimal" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {t('adminDashboard.title')}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {adminProfile?.name || 'Admin'}
                </p>
              </div>
            </div>

            {/* Action Buttons - Nubank Style */}
            <div className="flex items-center gap-1">
              {/* Criar Broker */}
              <Dialog open={isCreatingBroker} onOpenChange={setIsCreatingBroker}>
                <DialogTrigger asChild>
                  <div 
                    className="group flex items-center rounded-full bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 pointer-events-none"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                    <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                      {t('adminDashboard.createBroker')}
                    </span>
                  </div>
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

              {/* Alterar Senha */}
              <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                <DialogTrigger asChild>
                  <div 
                    className="group flex items-center rounded-full bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-transparent text-blue-600 dark:text-blue-400 transition-all duration-200 pointer-events-none"
                    >
                      <Key className="h-5 w-5" />
                    </Button>
                    <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                      {t('adminDashboard.changePassword')}
                    </span>
                  </div>
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

              {/* Market Data Audit */}
              {adminProfile?.id && (
                <div 
                  className="group flex items-center rounded-full bg-transparent hover:bg-green-50/50 dark:hover:bg-green-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                  onClick={() => navigate('/market-data-audit')}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-transparent text-green-600 dark:text-green-400 transition-all duration-200 pointer-events-none"
                  >
                    <BarChartIcon className="h-5 w-5" />
                  </Button>
                  <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                    {t('adminDashboard.marketDataAudit')}
                  </span>
                </div>
              )}

              {/* Sair */}
              <div 
                className="group flex items-center rounded-full bg-transparent hover:bg-red-50/50 dark:hover:bg-red-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                onClick={handleLogout}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-transparent text-red-600 dark:text-red-400 transition-all duration-200 pointer-events-none"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
                <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                  {t('common.logout')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content with padding for fixed bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
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
                        <div 
                          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            if (searchQuery === broker.email) {
                              setSearchQuery('');
                            } else {
                              setSearchQuery(broker.email);
                            }
                          }}
                        >
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
                  {t('adminDashboard.cards.activeBrokers')}
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

        {/* Tabs for different sections */}
        <Tabs defaultValue="planning" className="mb-8">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-1">
            <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1 h-auto">
              <TabsTrigger 
                value="planning"
                className={`rounded-lg ${tabTriggerActiveBlue} text-slate-600 dark:text-slate-400 data-[state=active]:text-white dark:data-[state=active]:text-white hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 py-2.5 flex items-center justify-center gap-2`}
              >
                <Target className="h-4 w-4" />
                {t('adminDashboard.tabs.planning')}
              </TabsTrigger>
              <TabsTrigger 
                value="imports"
                className={`rounded-lg ${tabTriggerActiveBlue} text-slate-600 dark:text-slate-400 data-[state=active]:text-white dark:data-[state=active]:text-white hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 py-2.5 flex items-center justify-center gap-2`}
              >
                <Upload className="h-4 w-4" />
                {t('adminDashboard.tabs.imports')}
              </TabsTrigger>
              <TabsTrigger 
                value="policy"
                className={`rounded-lg ${tabTriggerActiveBlue} text-slate-600 dark:text-slate-400 data-[state=active]:text-white dark:data-[state=active]:text-white hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 py-2.5 flex items-center justify-center gap-2`}
              >
                <Shield className="h-4 w-4" />
                {t('adminDashboard.tabs.policy')}
              </TabsTrigger>
              <TabsTrigger 
                value="access"
                className={`rounded-lg ${tabTriggerActiveBlue} text-slate-600 dark:text-slate-400 data-[state=active]:text-white dark:data-[state=active]:text-white hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 py-2.5 flex items-center justify-center gap-2`}
              >
                <Eye className="h-4 w-4" />
                {t('adminDashboard.tabs.access')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="planning" className="mt-6">
            {/* Enhanced Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.cards.averagePerformance')}
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
                <p className="text-sm text-muted-foreground">{t('adminDashboard.cards.returnPerMonth')}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {t('adminDashboard.cards.sharpe')} {overallMetrics.averageSharpeRatio.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.cards.priorityClients')}
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
                <p className="text-sm text-muted-foreground">{t('adminDashboard.cards.urgentClients')}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {overallMetrics.urgentClients} {t('adminDashboard.cards.urgent')}, {overallMetrics.highPriorityClients} {t('adminDashboard.cards.highPriority')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.cards.averageAge')}
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
                <p className="text-sm text-muted-foreground">{t('adminDashboard.cards.years')}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {overallMetrics.averageYearsToRetirement.toFixed(0)} {t('adminDashboard.cards.yearsToRetirement')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.cards.engagement')}
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
                  {overallMetrics.activityDistribution.active} {t('adminDashboard.cards.active')}
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
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.charts.growthTrend.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.charts.growthTrend.description')}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthTrendData.length > 0 ? growthTrendData : [{ month: t('adminDashboard.charts.growthTrend.noData'), totalClients: 0, newClients: 0 }]}>
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
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.growthTrend.totalClients')}</p>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {formatLargeNumber(data?.totalClients || 0)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.growthTrend.totalPatrimony')}</p>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {formatCurrency(data?.totalBalance || 0)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.growthTrend.newClients')}</p>
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
                      name={t('adminDashboard.charts.growthTrend.totalClients')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="newClients" 
                      stroke={MODERN_COLORS.warning}
                      strokeWidth={2}
                      fill="url(#balanceGradient)"
                      name={t('adminDashboard.charts.growthTrend.newClients')}
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
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.charts.wealthDistribution.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.charts.wealthDistribution.description')}
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
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.wealthDistribution.clients')}</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {count}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.wealthDistribution.percentage')}</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.wealthDistribution.total')}</span>
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
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.charts.clientStatus.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.charts.clientStatus.description')}
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
                                {t('adminDashboard.charts.clientStatus.clients')} <span className="font-semibold text-slate-900 dark:text-slate-100">{payload[0].value}</span>
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
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.charts.planMaturityChart.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.charts.planMaturityChart.description')}
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
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.planMaturityChart.plans')}:</span>
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
          {/* Client Age Distribution Chart */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.charts.ageDistribution.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.charts.ageDistribution.description')}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      dataKey="ageRange" 
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
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                              {label}
                            </p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.ageDistribution.clients')}:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data.count}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.ageDistribution.percentage')}:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data.percentage}%
                                </span>
                              </div>
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

          {/* Activity Status Radial Chart */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.charts.activityStatus.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.charts.activityStatus.description')}
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
                        name: t('adminDashboard.charts.activityStatus.active'), 
                        value: overallMetrics.activityDistribution.active || 0, 
                        fill: MODERN_COLORS.success,
                        percentage: overallMetrics.totalClients > 0 ? (((overallMetrics.activityDistribution.active || 0) / overallMetrics.totalClients) * 100).toFixed(1) : '0.0'
                      },
                      { 
                        name: t('adminDashboard.charts.activityStatus.atRisk'), 
                        value: overallMetrics.activityDistribution.atRisk || 0, 
                        fill: MODERN_COLORS.warning,
                        percentage: overallMetrics.totalClients > 0 ? (((overallMetrics.activityDistribution.atRisk || 0) / overallMetrics.totalClients) * 100).toFixed(1) : '0.0'
                      },
                      { 
                        name: t('adminDashboard.charts.activityStatus.inactive'), 
                        value: overallMetrics.activityDistribution.inactive || 0, 
                        fill: MODERN_COLORS.danger,
                        percentage: overallMetrics.totalClients > 0 ? (((overallMetrics.activityDistribution.inactive || 0) / overallMetrics.totalClients) * 100).toFixed(1) : '0.0'
                      },
                      { 
                        name: t('adminDashboard.charts.activityStatus.stale'), 
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
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.activityStatus.clients')}:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data.value}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.activityStatus.percentage')}:</span>
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
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.charts.performanceMetricsChart.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.charts.performanceMetricsChart.description')}
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
                                {t('adminDashboard.charts.performanceMetricsChart.value')} <span className="font-semibold text-slate-900 dark:text-slate-100">{payload[0].value}{data?.unit}</span>
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
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.charts.brokerEfficiency.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.charts.brokerEfficiency.description')}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={brokerPerformanceData.length > 0 ? brokerPerformanceData : [{ name: t('adminDashboard.charts.growthRate.noData'), totalClients: 0, activeClients: 0, efficiency: 0, efficiencyFormatted: '0' }]}>
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
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.brokerEfficiency.totalClients')}</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.totalClients}
                                </span>
                            </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.brokerEfficiency.activeClients')}</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.activeClients}
                                </span>
                            </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.brokerEfficiency.efficiency')}</span>
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
                      name={t('adminDashboard.charts.brokerEfficiency.totalClientsLabel')}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="activeClients" 
                      fill={MODERN_COLORS.success}
                      name={t('adminDashboard.charts.brokerEfficiency.activeClientsLabel')}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke={MODERN_COLORS.warning}
                      strokeWidth={3}
                      name={t('adminDashboard.charts.brokerEfficiency.efficiencyLabel')}
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
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.charts.growthRate.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.charts.growthRate.description')}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brokerPerformanceData.length > 0 ? brokerPerformanceData : [{ name: t('adminDashboard.charts.growthRate.noData'), growth: 0, growthFormatted: '0' }]}>
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
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.growthRate.growth')}:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.growthFormatted}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.charts.growthRate.engagement')}:</span>
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
                      name={t('adminDashboard.charts.growthRate.growthRateLabel')}
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

          </TabsContent>

          <TabsContent value="imports" className="mt-6">
            {/* Statement Imports Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Statement Imports Overview */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <LineChartIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.statementImports.title')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.statementImports.last14Days')}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statementImportsByDay}>
                    <defs>
                      <linearGradient id="importsTotalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={MODERN_COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={MODERN_COLORS.primary} stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="importsSuccessGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={MODERN_COLORS.success} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={MODERN_COLORS.success} stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="importsFailedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={MODERN_COLORS.danger} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={MODERN_COLORS.danger} stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
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
                        const data = statementImportsByDay.find(d => d.date === label);
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">{label}</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.statementImports.total')}</p>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {data?.total || 0}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.statementImports.success')}</p>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {data?.success || 0}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.statementImports.failures')}</p>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {data?.failed || 0}
                                  </p>
                                </div>
                              </div>
                              {data && (data.running > 0 || data.created > 0) && (
                                <>
                                  {data.running > 0 && (
                                    <div className="flex items-center gap-3">
                                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                                      <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.statementImports.running')}</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                          {data.running}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {data.created > 0 && (
                                    <div className="flex items-center gap-3">
                                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                                      <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.statementImports.created')}</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                          {data.created}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke={MODERN_COLORS.primary}
                      strokeWidth={3}
                      fill="url(#importsTotalGradient)"
                      name={t('adminDashboard.statementImports.chartLabels.total')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="success" 
                      stroke={MODERN_COLORS.success}
                      strokeWidth={2}
                      fill="url(#importsSuccessGradient)"
                      name={t('adminDashboard.statementImports.chartLabels.success')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="failed" 
                      stroke={MODERN_COLORS.danger}
                      strokeWidth={2}
                      fill="url(#importsFailedGradient)"
                      name={t('adminDashboard.statementImports.chartLabels.failures')}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Statement Imports Status Distribution */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                  <PieChartIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.statementImports.statusDistribution')}</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                    {t('adminDashboard.statementImports.last30Days')}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: t('adminDashboard.statementImports.chartLabels.success'), value: statementImportsStats.success, color: MODERN_COLORS.success },
                        { name: t('adminDashboard.statementImports.chartLabels.failures'), value: statementImportsStats.failed, color: MODERN_COLORS.danger },
                        { name: t('adminDashboard.statementImports.chartLabels.running'), value: statementImportsStats.running, color: MODERN_COLORS.warning },
                        { name: t('adminDashboard.statementImports.chartLabels.created'), value: statementImportsStats.created, color: MODERN_COLORS.info }
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {[
                        { name: t('adminDashboard.statementImports.chartLabels.success'), value: statementImportsStats.success, color: MODERN_COLORS.success },
                        { name: t('adminDashboard.statementImports.chartLabels.failures'), value: statementImportsStats.failed, color: MODERN_COLORS.danger },
                        { name: t('adminDashboard.statementImports.chartLabels.running'), value: statementImportsStats.running, color: MODERN_COLORS.warning },
                        { name: t('adminDashboard.statementImports.chartLabels.created'), value: statementImportsStats.created, color: MODERN_COLORS.info }
                      ].filter(item => item.value > 0).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = payload[0]?.payload;
                        const total = statementImportsStats.total;
                        const percentage = total > 0 ? ((data?.value || 0) / total * 100).toFixed(1) : '0.0';
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{data?.name}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.statementImports.quantity')}:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {data?.value || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.statementImports.percentage')}:</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {percentage}%
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

        {/* Statement Imports Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.statementImports.totalImports')}
                </CardTitle>
                <Avatar 
                  icon={LineChartIcon} 
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
                  {statementImportsStats.total}
                </p>
                <p className="text-sm text-muted-foreground">{t('adminDashboard.statementImports.last30Days')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.statementImports.success')}
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
                  {statementImportsStats.success}
                </p>
                <p className="text-sm text-muted-foreground">
                  {statementImportsStats.total > 0 
                    ? `${((statementImportsStats.success / statementImportsStats.total) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.statementImports.failures')}
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
                  {statementImportsStats.failed}
                </p>
                <p className="text-sm text-muted-foreground">
                  {statementImportsStats.total > 0 
                    ? `${((statementImportsStats.failed / statementImportsStats.total) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('adminDashboard.statementImports.running')}
                </CardTitle>
                <Avatar 
                  icon={Clock} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="yellow"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">
                  {statementImportsStats.running + statementImportsStats.created}
                </p>
                <p className="text-sm text-muted-foreground">{t('adminDashboard.statementImports.pending')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last 10 Imports List */}
        <StatementImportsList
          imports={statementImports}
          loading={statementImportsLoading}
          error={statementImportsError}
          type="admin"
          clientsMap={clientsMap}
          brokersMap={brokersMap}
          t={t}
        />

          </TabsContent>

          <TabsContent value="policy" className="mt-6">
            <InvestmentPolicyInsights activeBrokerIds={activeBrokerIds} />
          </TabsContent>

          <TabsContent value="access" className="mt-6">
            {/* Broker Access Analysis */}
            <BrokerAccessAnalysis brokerAccessData={brokerAccessData} />
            {/* Client Access Analysis */}
            <ClientAccessAnalysis clientAccessData={clientAccessData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 