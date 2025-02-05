import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export const SavingsGoal = () => {
  const currentInvestment = 50000;
  const investmentGoal = 100000;
  const percentage = (currentInvestment / investmentGoal) * 100;
  const returnRate = 12.5; // Annual return rate

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Investment Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <div>
              <span className="block text-lg font-semibold">${currentInvestment.toLocaleString()}</span>
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" />
                {returnRate}% a.a.
              </span>
            </div>
            <div className="text-right">
              <span className="block text-lg font-semibold text-muted-foreground">
                Goal: ${investmentGoal.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                Target Date: Dec 2024
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};