import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, TrendingUp, X, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserProfileInvestment {
  broker_id: string;
  email: string;
  id: string;
  investment_plan_id: string | null;
  is_broker: boolean;
  profile_id: string;
  profile_name: string;
  financial_created_at?: string;
  monthly_return_rate?: number;
  record_month?: number;
  record_year?: number;
}

interface BrokerProfile {
  id: string;
  name: string;
}

export const BrokerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfileInvestment[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentBroker, setCurrentBroker] = useState<string | null>(null);
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile | null>(null);

  useEffect(() => {
    const getCurrentBroker = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentBroker(user.id);
        
        // Fetch broker profile
        const { data: brokerData, error: brokerError } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('id', user.id)
          .single();

        if (brokerError) {
          console.error('Error fetching broker profile:', brokerError);
          return;
        }

        setBrokerProfile(brokerData);
      }
    };
    getCurrentBroker();
  }, []);

  useEffect(() => {
    if (currentBroker) {
      fetchInitialUsers();
    }
  }, [currentBroker]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (currentBroker) {
        handleSearch();
      }
    }, 300); // 300ms delay

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, currentBroker]);

  const fetchInitialUsers = async () => {
    if (!currentBroker) return;
    
    setIsSearching(true);
    try {
      const { data: users, error } = await supabase
        .from('user_profiles_investment')
        .select('*')
        .eq('broker_id', currentBroker)
        .order('profile_name');

      console.log(users);
      console.log(error);
      if (error) throw error;
      
      setSearchResults(users || []);
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
    navigate(`/client/${userId}`);
  };

  const isRecordOutdated = (recordMonth: number | undefined, recordYear: number | undefined): boolean => {
    if (!recordMonth || !recordYear) return true;
    
    const currentDate = new Date();
    const lastRecordDate = new Date(recordYear, recordMonth - 1);
    const diffMonths = (currentDate.getFullYear() - lastRecordDate.getFullYear()) * 12 + 
                      (currentDate.getMonth() - lastRecordDate.getMonth());
    
    return diffMonths > 1;
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t('brokerDashboard.title')}</h1>
          <div className="flex gap-4">
            {brokerProfile && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/client-profile/${brokerProfile.id}`)}
                  className="flex items-center gap-2 hover:bg-primary/5 transition-colors duration-200 shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 ring-2 ring-primary/20">
                      <span className="text-primary text-sm font-semibold">
                        {brokerProfile.name ? brokerProfile.name[0].toUpperCase() : ''}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{brokerProfile.name || ''}</span>
                  </div>
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              {t('common.logout', { defaultValue: 'Logout' })}
            </Button>
            <Button 
              onClick={() => navigate('/create-client')} 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              {t('brokerDashboard.buttons.newClient')}
            </Button>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="relative">
            <Input
              placeholder={t('brokerDashboard.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 h-12 bg-white shadow-sm rounded-xl border-gray-200 focus:border-primary focus:ring-primary transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {isSearching ? (
                <Search className="h-5 w-5 text-gray-400 animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-gray-400" />
              )}
            </div>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery('')}
              >
                <span className="sr-only">Clear search</span>
                <X className="h-5 w-5 text-gray-400" />
              </Button>
            )}
          </div>
        </div>

        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('brokerDashboard.search.results')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-200">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="relative flex items-center py-4 cursor-pointer hover:bg-gray-50 px-4 -mx-4 transition-colors duration-200"
                    onClick={() => handleUserSelect(user.id)}
                  >
                    {user.monthly_return_rate !== undefined && user.monthly_return_rate !== null && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <p className="text-sm font-medium text-green-600">
                                +{user.monthly_return_rate.toFixed(2)}%
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('brokerDashboard.client.monthlyReturnTooltip', { defaultValue: 'Porcentagem de retorno no último mês' })}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-lg font-semibold">
                          {user.profile_name ? user.profile_name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {user.profile_name || t('common.notAvailable')}
                          </p>
                          {!user.investment_plan_id && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    {t('brokerDashboard.client.pendingPlan')}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t('brokerDashboard.client.pendingPlanTooltip', { defaultValue: 'Cliente sem plano de investimento cadastrado' })}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {user.investment_plan_id && isRecordOutdated(user.record_month, user.record_year) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                    {t('brokerDashboard.client.outdatedRecord')}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {user.record_month && user.record_year
                                      ? t('brokerDashboard.client.outdatedRecordTooltip', {
                                          defaultValue: 'Último registro financeiro em: {{date}}',
                                          date: new Date(user.record_year, user.record_month - 1).toLocaleDateString('pt-BR', {
                                            month: 'long',
                                            year: 'numeric'
                                          })
                                        })
                                      : t('brokerDashboard.client.neverRecordedTooltip', {
                                          defaultValue: 'Nunca registrado'
                                        })
                                    }
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{t('brokerDashboard.client.id')}: {user.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
