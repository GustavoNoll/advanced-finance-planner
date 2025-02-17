import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useTranslation } from "react-i18next";
import { FinancialRecord, Goal } from '@/types/financial';
import { WithdrawalStrategy } from '@/lib/withdrawal-strategies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateChartProjections } from '@/lib/chart-projections';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Profile {
  birth_date: string;
}

interface InvestmentPlan {
  created_at: string;
  monthly_deposit: number;
  expected_return: number;
  inflation: number;
  initial_amount: number;
  initial_age: number;
  final_age: number;
  desired_income: number;
  adjust_contribution_for_inflation: boolean;
  plan_type: string;
  limit_age?: number;
}

interface ExpenseChartProps {
  investmentPlan: InvestmentPlan;
  clientId: string;
  financialRecordsByYear: FinancialRecord[];
  profile: Profile;
  withdrawalStrategy?: WithdrawalStrategy;
}

// Add goalIcons constant (you might want to move this to a shared constants file)
const goalIcons = {
  house: "🏠",
  car: "🚗",
  education: "🎓",
  retirement: "👴",
  travel: "✈️",
  emergency: "🚨",
  other: "🎯",
};

export const ExpenseChart = ({ 
  profile, 
  investmentPlan, 
  clientId, 
  financialRecordsByYear, 
  withdrawalStrategy = { type: 'fixed' },
  onWithdrawalStrategyChange
}: ExpenseChartProps & {
  onWithdrawalStrategyChange?: (strategy: WithdrawalStrategy) => void;
}) => {
  const { t } = useTranslation();
  
  // Add query for financial goals
  const { data: goals } = useQuery<Goal[]>({
    queryKey: ["financial-goals", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("profile_id", clientId)
        .order("year", { ascending: true })
        .order("month", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (!profile || !investmentPlan || !clientId || !financialRecordsByYear) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  const chartData = generateChartProjections(
    profile,
    investmentPlan,
    financialRecordsByYear,
    withdrawalStrategy,
    goals
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('dashboard.charts.portfolioPerformance')}</h2>
        <Select
          value={withdrawalStrategy.type}
          onValueChange={(value) => {
            onWithdrawalStrategyChange?.({
              type: value as WithdrawalStrategy['type'],
              monthlyAmount: value === 'fixed' ? investmentPlan?.desired_income : undefined,
              targetLegacy: value === 'legacy' ? 1000000 : undefined
            });
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('expenseChart.selectStrategy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">{t('monthlyView.futureProjection.strategies.fixed')}</SelectItem>
            <SelectItem value="preservation">{t('monthlyView.futureProjection.strategies.preservation')}</SelectItem>
            <SelectItem value="spend-all">{t('monthlyView.futureProjection.strategies.spendAll')}</SelectItem>
            <SelectItem value="legacy">{t('monthlyView.futureProjection.strategies.legacy')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer 
        width="100%" 
        height={300}
        key={JSON.stringify(chartData)}
      >
        <LineChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="age"
            tickFormatter={(value) => `${value} ${t('expenseChart.years')}`}
          />
          <YAxis 
            tickFormatter={(value) => 
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value)
            }
          />
          <Tooltip 
            formatter={(value: number) => 
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value)
            }
          />
          <Legend />

          {/* Update reference lines for goals */}
          {goals
            ?.sort((a, b) => a.year - b.year)
            .reduce((acc: React.ReactNode[], goal, index, sortedGoals) => {
              // Get the last achievement age from previous goals
              const lastAchievementAge = index > 0 
                ? Number(acc[index - 1]?.props?.x ?? 0)
                : 0;
              console.log(lastAchievementAge);
              // Find the first data point where a goal is achieved after the last goal
              console.log(chartData);
              const achievementPoint = chartData.find(
                point => 
                  point.goalAchievedActual && 
                  Number(point.age) > lastAchievementAge
              );
              
              // Only add reference line if:
              // 1. We found an achievement point
              // 2. The initial value is less than the goal (to avoid showing goals already achieved)
              if (achievementPoint) {
                console.log(achievementPoint);
                acc.push(
                  <ReferenceLine
                    key={`${goal.id}-actual`}
                    x={achievementPoint.age}
                    stroke="blue"
                    strokeDasharray="3 3"
                    ifOverflow="extendDomain"
                    label={{
                      value: `${goalIcons[goal.icon]}`,
                      position: 'top',
                      fill: 'blue',
                      fontSize: 14,
                      dy: 0,
                      className: "font-medium"
                    }}
                  />
                );
              }
              return acc;
            }, [])}

          <Line 
            type="natural"
            dataKey="actualValue" 
            stroke="#3b82f6"
            name={t('expenseChart.actualValue')}
            strokeWidth={2.5}
            connectNulls
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line 
            type="natural"
            dataKey="projectedValue" 
            stroke="#f97316"
            name={t('expenseChart.projectedValue')}
            strokeWidth={2.5}
            strokeDasharray="8 8"
            connectNulls
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
