import { ArrowLeft, LogOut, Share2, User, Key } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-900 dark:via-gray-950 dark:to-slate-900/50">
      <header className="bg-white/95 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {brokerProfile && (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/broker-dashboard')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Logo variant="minimal" className="h-6 shrink-0" />
              {clientProfile && (
                <p
                  className="text-sm text-gray-700 dark:text-gray-300 font-medium hidden sm:block truncate max-w-[120px] sm:max-w-[180px] md:max-w-[240px] lg:max-w-none"
                  title={clientProfile.name}
                >
                  {clientProfile.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Desktop tabs */}
              <div className="hidden md:flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <Button
                  variant="ghost"
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    activeView === 'policies'
                      ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 shadow-sm'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                  }`}
                  onClick={() => {
                    setActiveView('policies');
                  }}
                >
                  {t('dashboard.navigation.investmentPolicy')}
                </Button>
                <Button
                  variant="ghost"
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    activeView === 'finances'
                      ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 shadow-sm'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                  }`}
                  onClick={() => {
                    setActiveView('finances');
                  }}
                >
                  {t('dashboard.navigation.planning')}
                </Button>
                <Button
                  variant="ghost"
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    activeView === 'portfolio-performance'
                      ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 shadow-sm'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                  }`}
                  onClick={() => {
                    setActiveView('portfolio-performance');
                  }}
                >
                  {t('dashboard.navigation.portfolioPerformance')}
                </Button>
              </div>

              {/* Mobile menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuItem onClick={() => setActiveView('policies')}>
                    {t('dashboard.navigation.investmentPolicy')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveView('finances')}>
                    {t('dashboard.navigation.planning')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveView('portfolio-performance')}>
                    {t('dashboard.navigation.portfolioPerformance')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              {brokerProfile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShareClient}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={t('brokerDashboard.shareWithClient')}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden md:inline ml-1">{t('brokerDashboard.shareWithClient')}</span>
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/client-profile/${clientId}`)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label={t('clientProfile.buttons.changePassword')}
              >
                <Key className="h-4 w-4" />
                <span className="hidden md:inline ml-1">{t('clientProfile.buttons.changePassword')}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                aria-label={t('common.logout')}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

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
  );
};

export default Index;
