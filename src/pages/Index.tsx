import { ArrowLeft, LogOut, Share2, User, Key, Target, TrendingUp, BarChart } from "lucide-react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { Logo } from '@/components/ui/logo';
import { Avatar } from '@/components/ui/avatar-initial';
import Finances from './planning/Finances';
import InvestmentPolicy from './investment-policy/InvestmentPolicy';
import PortfolioPerformance from './performance/PortfolioPerformance';
import { useMicroInvestmentPlans } from '@/hooks/useMicroInvestmentPlans';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id || user?.id;
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'finances' | 'policies' | 'portfolio-performance'>('policies');

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

  // Hook para gerenciar micro planos de investimento
  const {
    microPlans,
    activeMicroPlan,
    isLoading: isMicroPlansLoading,
    error: microPlansError,
    createMicroPlan,
    updateMicroPlan,
    deleteMicroPlan,
    refreshMicroPlans,
    hasFinancialRecordForActivePlan
  } = useMicroInvestmentPlans(investmentPlan?.id || '');

  useEffect(() => {
    if (!isInvestmentPlanLoading && !isProfilesLoading) { 
      // If user is a broker but not viewing a client, redirect to broker dashboard
      if (brokerProfile && !params.id) {
        navigate('/broker-dashboard');
        return;
      }
      
      // If viewing a client profile as a broker, verify client belongs to this broker
      if (brokerProfile && clientProfile && clientId !== user?.id) {
        if (clientProfile.broker_id !== user?.id) {
          toast({
            title: t('dashboard.messages.errors.unauthorizedAccess'),
            description: t('dashboard.messages.errors.clientNotAssociated'),
            variant: "destructive",
          });
          navigate('/broker-dashboard');
          return;
        }
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

      // Set active view based on URL (query param has priority, then path)
      const searchParams = new URLSearchParams(window.location.search)
      const viewParam = searchParams.get('view')

      if (viewParam === 'policies' || viewParam === 'finances' || viewParam === 'portfolio-performance') {
        setActiveView(viewParam)
      } else {
        const path = window.location.pathname
        if (path.includes('investment-policy')) setActiveView('policies')
        else if (path.includes('portfolio-performance')) setActiveView('portfolio-performance')
        else setActiveView('finances')
      }
    }
  }, [investmentPlan, brokerProfile, clientProfile, isInvestmentPlanLoading, isProfilesLoading, params.id, handleLogout, t, user?.id, clientId, navigate]);

  const handleShareClient = () => {
    const clientLoginUrl = `${window.location.origin}/client-login/${clientId}`;
    navigator.clipboard.writeText(clientLoginUrl);
    toast({
      title: t('common.success'),
      description: t('brokerDashboard.linkCopied'),
    });
  };

  if (isInvestmentPlanLoading || isProfilesLoading || isMicroPlansLoading || (!investmentPlan && !brokerProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Fixed Task Bar - Nubank Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              {brokerProfile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-blue-50/50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-400 transition-all duration-200"
                  onClick={() => navigate('/broker-dashboard')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="relative">
                <Logo variant="minimal" />
              </div>
              {clientProfile && (
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {clientProfile.name}
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {t('dashboard.title') || 'Dashboard'}
                  </p>
                </div>
              )}
            </div>

            {/* Tabs - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-1">
                <div className="flex space-x-1">
                  {/* Política de Investimento - Azul/Roxo */}
                  <div 
                    className="group flex items-center rounded-lg bg-transparent hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                    onClick={() => setActiveView('policies')}
                  >
                    <Button
                      variant="ghost"
                      className={`rounded-lg p-2.5 transition-all duration-200 pointer-events-none flex items-center justify-center ${
                        activeView === 'policies'
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-indigo-500 dark:text-indigo-400'
                      }`}
                    >
                      <Target className="h-5 w-5" />
                    </Button>
                    <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                      {t('dashboard.navigation.investmentPolicy')}
                    </span>
                  </div>
                  
                  {/* Planejamento - Verde */}
                  <div 
                    className="group flex items-center rounded-lg bg-transparent hover:bg-emerald-50/50 dark:hover:bg-emerald-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                    onClick={() => setActiveView('finances')}
                  >
                    <Button
                      variant="ghost"
                      className={`rounded-lg p-2.5 transition-all duration-200 pointer-events-none flex items-center justify-center ${
                        activeView === 'finances'
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-emerald-500 dark:text-emerald-400'
                      }`}
                    >
                      <TrendingUp className="h-5 w-5" />
                    </Button>
                    <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                      {t('dashboard.navigation.planning')}
                    </span>
                  </div>
                  
                  {/* Performance - Laranja */}
                  <div 
                    className="group flex items-center rounded-lg bg-transparent hover:bg-orange-50/50 dark:hover:bg-orange-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                    onClick={() => setActiveView('portfolio-performance')}
                  >
                    <Button
                      variant="ghost"
                      className={`rounded-lg p-2.5 transition-all duration-200 pointer-events-none flex items-center justify-center ${
                        activeView === 'portfolio-performance'
                          ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 shadow-sm'
                          : 'text-orange-500 dark:text-orange-400'
                      }`}
                    >
                      <BarChart className="h-5 w-5" />
                    </Button>
                    <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                      {t('dashboard.navigation.portfolioPerformance')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Nubank Style */}
            <div className="flex items-center gap-1">
              {brokerProfile && (
                <div 
                  className="group flex items-center rounded-full bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                  onClick={handleShareClient}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-transparent text-blue-600 dark:text-blue-400 transition-all duration-200 pointer-events-none"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                    {t('brokerDashboard.shareWithClient')}
                  </span>
                </div>
              )}
              
              <div 
                className="group flex items-center rounded-full bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                onClick={() => navigate(`/client-profile/${clientId}`)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-transparent text-blue-600 dark:text-blue-400 transition-all duration-200 pointer-events-none"
                >
                  <Key className="h-5 w-5" />
                </Button>
                <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                  {t('clientProfile.buttons.changePassword')}
                </span>
              </div>

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

              {/* Mobile menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="group flex items-center rounded-full bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer md:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-transparent text-slate-600 dark:text-slate-400 transition-all duration-200 pointer-events-none"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setActiveView('policies')}>
                    <Target className="h-4 w-4 mr-2" />
                    {t('dashboard.navigation.investmentPolicy')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveView('finances')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {t('dashboard.navigation.planning')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveView('portfolio-performance')}>
                    <BarChart className="h-4 w-4 mr-2" />
                    {t('dashboard.navigation.portfolioPerformance')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content with padding for fixed bar */}
      <div className="pt-24">
        {activeView === 'finances' && (
        <Finances
          clientId={clientId}
          clientProfile={clientProfile}
          brokerProfile={brokerProfile}
          investmentPlan={investmentPlan}
          activeMicroPlan={activeMicroPlan}
          microPlans={microPlans}
          hasFinancialRecordForActivePlan={hasFinancialRecordForActivePlan}
          onLogout={handleLogout}
          onShareClient={handleShareClient}
          onRefreshMicroPlans={refreshMicroPlans}
        />
      )}

      {activeView === 'policies' && (
        <InvestmentPolicy
          clientId={clientId}
          clientProfile={clientProfile}
          brokerProfile={brokerProfile}
          investmentPlan={investmentPlan}
        />
      )}

      {activeView === 'portfolio-performance' && (
        <PortfolioPerformance
          clientId={clientId}
          profile={clientProfile}
          broker={brokerProfile}
          investmentPlan={investmentPlan}
          activeMicroPlan={activeMicroPlan || null}
          onLogout={handleLogout}
          onShareClient={handleShareClient}
        />
      )}
      </div>
    </div>
  );
};

export default Index;
