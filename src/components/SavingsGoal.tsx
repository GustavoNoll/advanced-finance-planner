import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SavingsGoal = () => {
  const currentSavings = 5000;
  const goal = 10000;
  const percentage = (currentSavings / goal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Savings Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>${currentSavings}</span>
            <span className="text-muted-foreground">Goal: ${goal}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};