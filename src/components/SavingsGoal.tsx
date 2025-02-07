import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const SavingsGoal = () => {
  const { t } = useTranslation();
  const currentInvestment = 50000;
  const investmentGoal = 100000;
  const percentage = (currentInvestment / investmentGoal) * 100;
  const returnRate = 12.5; // Annual return rate

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('savingsGoal.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <div>
              <span className="block text-lg font-semibold">
                {t('savingsGoal.currentValue', { value: currentInvestment.toLocaleString() })}
              </span>
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" />
                {t('savingsGoal.returnRate', { value: returnRate })}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-lg font-semibold text-muted-foreground">
                {t('savingsGoal.goal.label', { value: investmentGoal.toLocaleString() })}
              </span>
              <span className="text-sm text-muted-foreground">
                {t('savingsGoal.goal.targetDate', { date: 'Dez 2024' })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};