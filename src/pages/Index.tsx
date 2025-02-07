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
import { ptBR } from "@/locales/pt-BR";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id || user?.id;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: ptBR.dashboard.messages.logoutSuccess,
        description: "",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: ptBR.dashboard.messages.logoutError,
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
        console.error('Error fetching investment plan:', error);
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
        console.error('Error fetching broker profile:', error);
        return null;
      }

      console.log("data");
      console.log(data);
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
      
      if (!brokerProfile && !investmentPlan) {
        toast({
          title: ptBR.dashboard.messages.noPlan.title,
          description: ptBR.dashboard.messages.noPlan.description,
        });
        if (params.id) {
          navigate(`/create-plan?client_id=${params.id}`);
        } else {
          navigate('/create-plan');
        }
      }
    }
  }, [investmentPlan, brokerProfile, isInvestmentPlanLoading, isBrokerLoading, navigate, params.id]);

  if (isInvestmentPlanLoading || isBrokerLoading || (!investmentPlan && !brokerProfile)) {
    return null;
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
              <h1 className="text-2xl font-bold text-gray-900">{ptBR.dashboard.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to={`/investment-plan/${investmentPlan?.id}`}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {ptBR.dashboard.buttons.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard title={ptBR.dashboard.cards.portfolioValue.title}>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">$50,000.00</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +15.2% {ptBR.dashboard.cards.portfolioValue.ytd}
              </p>
            </div>
          </DashboardCard>
          
          <DashboardCard title={ptBR.dashboard.cards.monthlyContributions.title}>
            <div className="space-y-2">
              <p className="text-2xl font-bold">$1,000.00</p>
              <p className="text-sm text-muted-foreground">
                {ptBR.dashboard.cards.monthlyContributions.subtitle}
              </p>
            </div>
          </DashboardCard>
          
          <DashboardCard title={ptBR.dashboard.cards.totalReturns.title}>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">$7,500.00</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <PiggyBank className="h-4 w-4" />
                12.5% {ptBR.dashboard.cards.totalReturns.subtitle}
              </p>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <DashboardCard title={ptBR.dashboard.charts.portfolioPerformance}>
              <ExpenseChart />
            </DashboardCard>
          </div>
          
          <div className="space-y-6">
            <SavingsGoal />
            <DashboardCard title={ptBR.dashboard.nextSteps.title}>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  {ptBR.dashboard.nextSteps.items.reviewStrategy}
                </li>
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  {ptBR.dashboard.nextSteps.items.increaseContributions}
                </li>
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  {ptBR.dashboard.nextSteps.items.scheduleReview}
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
