
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const CreateClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    monthlyDeposit: "",
    targetAmount: "",
    targetDate: "",
    expectedReturn: "",
  });

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
      // Create user account
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (userError) throw userError;
      if (!userData.user) throw new Error("Failed to create user");

      // Create profile with is_broker = false
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userData.user.id,
            email: formData.email,
            is_broker: false,
          }
        ]);

      if (profileError) throw profileError;

      // Create investment plan
      const { error: planError } = await supabase
        .from("investment_plans")
        .insert([
          {
            user_id: userData.user.id,
            monthly_deposit: parseFloat(formData.monthlyDeposit),
            target_amount: parseFloat(formData.targetAmount),
            target_date: formData.targetDate,
            expected_return: parseFloat(formData.expectedReturn),
            current_amount: 0,
            status: "active",
          },
        ]);

      if (planError) throw planError;

      toast({
        title: "Success",
        description: "Client and investment plan created successfully",
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
            <CardTitle>Create New Client</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Initial Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

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
                {loading ? "Creating..." : "Create Client"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

