
import { DashboardCard } from "@/components/DashboardCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { MonthlyView } from "@/components/MonthlyView";
import { Briefcase, TrendingUp, PiggyBank, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const { user } = useAuth();

  const { data: investmentPlan, isLoading } = useQuery({
    queryKey: ['investmentPlan', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching investment plan:', error);
        return null;
      }

      return data?.[0] || null;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
            </div>
            {!isLoading && (
              <Link to={investmentPlan ? `/edit-plan/${investmentPlan.id}` : "/create-plan"}>
                <Button className="flex items-center gap-2">
                  {investmentPlan ? (
                    <>
                      <Pencil className="h-4 w-4" />
                      Edit Investment Plan
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Investment Plan
                    </>
                  )}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard title="Total Portfolio Value">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">$50,000.00</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +15.2% YTD
              </p>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Monthly Contributions">
            <div className="space-y-2">
              <p className="text-2xl font-bold">$1,000.00</p>
              <p className="text-sm text-muted-foreground">Regular deposits</p>
            </div>
          </DashboardCard>
          
          <DashboardCard title="Total Returns">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">$7,500.00</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <PiggyBank className="h-4 w-4" />
                12.5% Annual Return
              </p>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <DashboardCard title="Portfolio Performance vs. Inflation">
              <ExpenseChart />
            </DashboardCard>
          </div>
          
          <div className="space-y-6">
            <SavingsGoal />
            <DashboardCard title="Next Steps">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  Review your investment strategy
                </li>
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  Consider increasing monthly contributions
                </li>
                <li className="flex items-center gap-2 text-left">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  Schedule a portfolio review meeting
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
