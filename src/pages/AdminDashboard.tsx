import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LogOut, Search, ChevronLeft, ChevronRight, Plus, UserX, UserCheck, Users, Wallet, Target, Activity, Eye, EyeOff, Key } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Avatar } from '@/components/ui/avatar-initial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '@/components/auth/AuthProvider';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
        .select('id, name, active')
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
          const { data: clients, error: clientsError } = await supabase
            .from('profiles')
            .select('id')
            .eq('broker_id', broker.id);

          if (clientsError) throw clientsError;

          const clientIds = clients.map(client => client.id);

          const { data: plans, error: plansError } = await supabase
            .from('investment_plans')
            .select('*')
            .in('user_id', clientIds);

          if (plansError) throw plansError;

          const { data: records, error: recordsError } = await supabase
            .from('user_financial_records')
            .select('*')
            .in('user_id', clientIds)
            .order('record_year', { ascending: false })
            .order('record_month', { ascending: false }) as { data: FinancialRecord[] | null, error: Error | null };

          if (recordsError) throw recordsError;

          // Get current date
          const currentDate = new Date();

          // Function to check if a record is within the last 3 months
          const isWithinLast3Months = (year: number, month: number) => {
            const recordDate = new Date(year, month - 1); // month - 1 because JavaScript months are 0-based
            const threeMonthsAgo = new Date(currentDate);
            threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
            return recordDate >= threeMonthsAgo;
          };

          // Filter to get only the most recent record per client within the last 3 months
          const uniqueRecords = records?.reduce((acc, record) => {
            if (!acc[record.user_id] && isWithinLast3Months(record.record_year, record.record_month)) {
              acc[record.user_id] = record;
            }
            return acc;
          }, {} as Record<string, FinancialRecord>);

          const latestRecords = Object.values(uniqueRecords || {});
          const totalBalance = latestRecords.reduce((sum, record) => sum + (record.ending_balance || 0), 0);
          const lastActivity = latestRecords[0]?.created_at || null;
          const clientsWithActiveRecords = new Set(latestRecords.map(r => r.user_id)).size;
          const clientsWithOutdatedRecords = clientIds.length - clientsWithActiveRecords;

          return {
            id: broker.id,
            name: broker.name || 'Unnamed Broker',
            email: userEmailMap[broker.id] || '',
            totalClients: clientIds.length,
            totalPlans: plans.length,
            totalBalance,
            lastActivity,
            clientsWithActiveRecords,
            clientsWithOutdatedRecords,
            active: broker.active,
          };
        })
      );

      setBrokers(brokerMetrics);
      setFilteredBrokers(brokerMetrics);
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

  // Get top 5 brokers by clients
  const topClientsData = [...filteredBrokers]
    .sort((a, b) => b.totalClients - a.totalClients)
    .slice(0, 5)
    .map(broker => ({
      name: broker.name,
      value: broker.totalClients
    }));

  // Get top 5 brokers by balance
  const topBalanceData = [...filteredBrokers]
    .sort((a, b) => b.totalBalance - a.totalBalance)
    .slice(0, 5)
    .map(broker => ({
      name: broker.name,
      value: broker.totalBalance
    }));

  // Get top 5 brokers by plans
  const topPlansData = [...filteredBrokers]
    .sort((a, b) => b.totalPlans - a.totalPlans)
    .slice(0, 5)
    .map(broker => ({
      name: broker.name,
      value: broker.totalPlans
    }));

  // Get top 5 brokers by active clients ratio
  const topActivityData = [...filteredBrokers]
    .sort((a, b) => {
      const ratioA = a.clientsWithActiveRecords / a.totalClients;
      const ratioB = b.clientsWithActiveRecords / b.totalClients;
      return ratioB - ratioA;
    })
    .slice(0, 5)
    .map(broker => ({
      name: broker.name,
      active: broker.clientsWithActiveRecords,
      inactive: broker.clientsWithOutdatedRecords,
      ratio: (broker.clientsWithActiveRecords / broker.totalClients * 100).toFixed(1) + '%'
    }));

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
                  {t('adminDashboard.totalBrokers')}
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
                <p className="text-3xl font-bold text-foreground">{filteredBrokers.length}</p>
                <p className="text-sm text-muted-foreground">{t('adminDashboard.brokers')}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {filteredBrokers.filter(b => b.active).length} {t('adminDashboard.active')}
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
                  {formatLargeNumber(filteredBrokers.reduce((sum, broker) => sum + broker.totalClients, 0))}
                </p>
                <p className="text-sm text-muted-foreground">{t('adminDashboard.clients')}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {formatLargeNumber(filteredBrokers.reduce((sum, broker) => sum + broker.clientsWithActiveRecords, 0))} {t('adminDashboard.active')}
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
                  {formatLargeNumber(filteredBrokers.reduce((sum, broker) => sum + broker.totalPlans, 0))}
                </p>
                <p className="text-sm text-muted-foreground">{t('adminDashboard.plans')}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {formatLargeNumber(filteredBrokers.reduce((sum, broker) => sum + broker.clientsWithOutdatedRecords, 0))} {t('adminDashboard.needReview')}
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
                  {formatCurrency(filteredBrokers.reduce((sum, broker) => sum + broker.totalBalance, 0))}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {t('adminDashboard.averagePerClient')}: {formatCurrency(
                    filteredBrokers.reduce((sum, broker) => sum + broker.totalBalance, 0) / 
                    filteredBrokers.reduce((sum, broker) => sum + broker.totalClients, 0)
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top 5 Brokers by Clients */}
          <Card className="hover:shadow-lg transition-all duration-200 border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Avatar 
                  icon={Users} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="blue"
                />
                {t('adminDashboard.top5BrokersByClients')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topClientsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickFormatter={(value) => formatLargeNumber(value)}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                              <p className="text-sm text-gray-600">
                                Clientes: {' '} 
                                <span className="font-semibold">{payload[0].value}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#3b82f6" 
                      name={t('adminDashboard.clients')}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Brokers by Balance */}
          <Card className="hover:shadow-lg transition-all duration-200 border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Avatar 
                  icon={Wallet} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="green"
                />
                {t('adminDashboard.top5BrokersByBalance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topBalanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickFormatter={(value) => formatLargeNumber(value)}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              <p className="text-sm text-gray-600">
                                {t('adminDashboard.balance')}: {' '} 
                                <span className="font-semibold">{formatCurrency(payload[0].value as number)}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#10b981" 
                      name={t('adminDashboard.balance')}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Brokers by Plans */}
          <Card className="hover:shadow-lg transition-all duration-200 border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Avatar 
                  icon={Target} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="purple"
                />
                {t('adminDashboard.top5BrokersByPlans')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topPlansData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {topPlansData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
                              <p className="text-sm text-gray-600">
                                {t('adminDashboard.plans')}: {' '} 
                                <span className="font-semibold">{payload[0].value}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => (
                        <span className="text-sm text-gray-600">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Brokers by Activity Ratio */}
          <Card className="hover:shadow-lg transition-all duration-200 border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Avatar 
                  icon={Activity} 
                  size="md" 
                  variant="square"
                  iconClassName="h-5 w-5"
                  color="red"
                />
                {t('adminDashboard.top5BrokersByActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = topActivityData.find(d => d.name === label);
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              <p className="text-sm text-gray-600">
                                {t('adminDashboard.active')}: {' '} 
                                <span className="font-semibold">{data?.active}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              <p className="text-sm text-gray-600">
                                {t('adminDashboard.inactive')}: {' '} 
                                <span className="font-semibold">{data?.inactive}</span>
                              </p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <p className="text-sm text-gray-600">
                                {t('adminDashboard.activeRatio')}: {' '} 
                                <span className="font-semibold">{data?.ratio}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => (
                        <span className="text-sm text-gray-600">{value}</span>
                      )}
                    />
                    <Bar 
                      dataKey="active" 
                      stackId="a" 
                      fill="#10b981" 
                      name={t('adminDashboard.active')}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="inactive" 
                      stackId="a" 
                      fill="#ef4444" 
                      name={t('adminDashboard.inactive')}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 