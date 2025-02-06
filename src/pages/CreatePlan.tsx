
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";

export const CreatePlan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    monthlyDeposit: "",
    targetAmount: "",
    targetDate: "",
    expectedReturn: "",
  });

  useEffect(() => {
    const checkExistingPlan = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('investment_plans')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          toast({
            title: "Plan already exists",
            description: "You already have an investment plan. Redirecting to edit page...",
          });
          navigate(`/edit-plan/${data[0].id}`);
        }
      } catch (error: any) {
        console.error('Error checking existing plan:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    checkExistingPlan();
  }, [user, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("investment_plans").insert([
        {
          user_id: user?.id,
          monthly_deposit: parseFloat(formData.monthlyDeposit),
          target_amount: parseFloat(formData.targetAmount),
          target_date: formData.targetDate,
          expected_return: parseFloat(formData.expectedReturn),
          current_amount: 0,
          status: "active",
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment plan created successfully",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Investment Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Deposit Goal</label>
                <Input
                  type="number"
                  name="monthlyDeposit"
                  value={formData.monthlyDeposit}
                  onChange={handleChange}
                  placeholder="1000"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Amount</label>
                <Input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="100000"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Date</label>
                <Input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Annual Return (%)</label>
                <Input
                  type="number"
                  name="expectedReturn"
                  value={formData.expectedReturn}
                  onChange={handleChange}
                  placeholder="12.5"
                  step="0.1"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Plan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
