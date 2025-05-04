import { ArrowLeft, LogOut, Share2, User } from "lucide-react";
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
import Finances from './Finances';
import InvestmentPolicy from './InvestmentPolicy';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id || user?.id;
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'finances' | 'policies'>('finances');

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

      // Set active view based on URL
      const path = window.location.pathname;
      if (path.includes('investment-policy')) {
        setActiveView('policies');
      } else {
        setActiveView('finances');
      }
    }
  }, [investmentPlan, brokerProfile, isInvestmentPlanLoading, isProfilesLoading, params.id, handleLogout, t]);

  const handleShareClient = () => {
    const clientLoginUrl = `${window.location.origin}/client-login/${clientId}`;
    navigator.clipboard.writeText(clientLoginUrl);
    toast({
      title: t('common.success'),
      description: t('brokerDashboard.linkCopied'),
    });
  };

  if (isInvestmentPlanLoading || isProfilesLoading || (!investmentPlan && !brokerProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
      <header className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {brokerProfile && (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/broker-dashboard')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Logo variant="minimal" className="h-6" />
              {clientProfile && (
                <p className="text-sm text-gray-700 font-medium hidden sm:block">{clientProfile.name}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant="ghost"
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    activeView === 'finances'
                      ? 'text-blue-600 bg-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => {
                    setActiveView('finances');
                  }}
                >
                  {t('dashboard.navigation.finances')}
                </Button>
                <Button
                  variant="ghost"
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    activeView === 'policies'
                      ? 'text-blue-600 bg-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => {
                    setActiveView('policies');
                  }}
                >
                  {t('dashboard.navigation.investmentPolicy')}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {brokerProfile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShareClient}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('brokerDashboard.shareWithClient')}</span>
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

      {activeView === 'finances' && (
        <Finances
          clientId={clientId}
          clientProfile={clientProfile}
          brokerProfile={brokerProfile}
          investmentPlan={investmentPlan}
          onLogout={handleLogout}
          onShareClient={handleShareClient}
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
    </div>
  );
};

export default Index;
