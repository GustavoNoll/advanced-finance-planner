import { DashboardCard } from "@/components/DashboardCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { MonthlyView } from "@/components/MonthlyView";
import { Briefcase, TrendingUp, PiggyBank, Plus, Pencil, Settings, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id || user?.id;
  const { t } = useTranslation();

  const handleLogout = async () => {
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
  };

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

  const { data: brokerProfile, isLoading: isBrokerLoading } = useQuery({
    queryKey: ['brokerProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .eq('is_broker', true)
        .single();

      if (error) {
        console.error(t('dashboard.messages.errors.fetchProfile'), error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!isInvestmentPlanLoading && !isBrokerLoading) {
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
    }
  }, [investmentPlan, brokerProfile, isInvestmentPlanLoading, isBrokerLoading, navigate, params.id]);

  if (isInvestmentPlanLoading || isBrokerLoading || (!investmentPlan && !brokerProfile)) {
    return <div>{t('dashboard.loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {brokerProfile && (
              <Link to="/broker-dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            </div>
            <div className="flex items-center gap-4">
              {brokerProfile && (
                <Link to={`/investment-plan/${investmentPlan?.id}`}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t('dashboard.buttons.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard title={t('dashboard.cards.portfolioValue.title')}>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">
                {t('dashboard.cards.portfolioValue.amount', { value: '50,000.00' })}
              </p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {t('dashboard.cards.totalReturns.percentage', { value: '15.2' })} {t('dashboard.cards.portfolioValue.ytd')}
              </p>
            </div>
          </DashboardCard>
          
          <DashboardCard title={t('dashboard.cards.monthlyContributions.title')}>
            <div className="space-y-2">
              <p className="text-2xl font-bold">R$ 1,000.00</p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.cards.monthlyContributions.subtitle')}
              </p>
            </div>
          </DashboardCard>
          
          <DashboardCard title={t('dashboard.cards.totalReturns.title')}>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">R$ 7,500.00</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <PiggyBank className="h-4 w-4" />
                12.5% {t('dashboard.cards.totalReturns.subtitle')}
              </p>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <DashboardCard title={t('dashboard.charts.portfolioPerformance')}>
              <ExpenseChart />
            </DashboardCard>
          </div>
          
          <div className="space-y-6">
            <SavingsGoal />
            <DashboardCard title={t('dashboard.nextSteps.title')}>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  {t('dashboard.nextSteps.items.reviewStrategy')}
                </li>
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  {t('dashboard.nextSteps.items.increaseContributions')}
                </li>
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  {t('dashboard.nextSteps.items.scheduleReview')}
                </li>
              </ul>
            </DashboardCard>
          </div>
        </div>

        <MonthlyView />
      </main>
    </div>
  );
};

export default Index;
