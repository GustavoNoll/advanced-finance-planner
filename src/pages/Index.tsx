
import { DashboardCard } from "@/components/DashboardCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SavingsGoal } from "@/components/SavingsGoal";
import { MonthlyView } from "@/components/MonthlyView";
import { Briefcase, TrendingUp, PiggyBank, Plus, Pencil, LogOut, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Index = () => {
  const { user, isBroker } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients', searchQuery, isBroker],
    queryFn: async () => {
      if (!isBroker) return [];
      
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 20,
      });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        return [];
      }

      // Filter users by email locally since we can't query the auth.users table directly
      const filteredUsers = usersData.users.filter(user => 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredUsers.length === 0) return [];

      // Get is_broker status for each user from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, is_broker')
        .in('id', filteredUsers.map(u => u.id));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      // Only return non-broker users
      return filteredUsers
        .filter(user => {
          const profile = profiles?.find(p => p.id === user.id);
          return !profile?.is_broker;
        })
        .map(user => ({
          id: user.id,
          email: user.email
        }));
    },
    enabled: !!isBroker,
  });

  const { data: investmentPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: ['investmentPlan', selectedUserId || user?.id],
    queryFn: async () => {
      const targetUserId = selectedUserId || user?.id;
      if (!targetUserId) return null;
      
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error) {
        console.error('Error fetching investment plan:', error);
        return null;
      }

      return data;
    },
    enabled: !!(selectedUserId || user?.id),
  });

  useEffect(() => {
    if (!isLoadingPlan && !investmentPlan && !isBroker) {
      toast({
        title: "No Investment Plan",
        description: "Please create an investment plan to continue.",
      });
      navigate('/create-plan');
    }
  }, [investmentPlan, isLoadingPlan, navigate, isBroker]);

  const isLoading = isLoadingPlan || isLoadingClients;

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (isBroker && !selectedUserId) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Broker Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link to="/create-client">
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  New Client
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search clients by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="space-y-2">
              {isLoadingClients ? (
                <p>Loading clients...</p>
              ) : clients?.length === 0 ? (
                <p>No clients found</p>
              ) : (
                clients?.map((client) => (
                  <Button
                    key={client.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setSelectedUserId(client.id)}
                  >
                    {client.email}
                  </Button>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
            </div>
            <div className="flex items-center gap-4">
              {isBroker && (
                <Button variant="outline" onClick={() => setSelectedUserId(null)}>
                  Back to Clients
                </Button>
              )}
              <Link to={`/edit-plan/${investmentPlan?.id}`}>
                <Button className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Investment Plan
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
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
