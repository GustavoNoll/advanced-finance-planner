import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from "react-i18next";
import { FinancialRecord } from '@/types/financial';
import { WithdrawalStrategy } from '@/lib/withdrawal-strategies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateChartProjections } from '@/lib/chart-projections';

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
  
  if (!profile || !investmentPlan || !clientId || !financialRecordsByYear) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }
  
  // Use initial_age from investment plan
  const clientAge = investmentPlan.initial_age;
  const getEndAge = () => {
    if ((investmentPlan.plan_type === "1" || investmentPlan.plan_type === "2") && investmentPlan.limit_age) {
      return investmentPlan.limit_age;
    }
    return 120;
  };
  
  const endAge = getEndAge();
  const yearsUntilEnd = endAge - clientAge;
  
  // Create array of ages from initial_age to endAge
  const allAges = Array.from({ length: yearsUntilEnd + 1 }, (_, i) => clientAge + i);

  const chartData = generateChartProjections(
    profile,
    investmentPlan,
    financialRecordsByYear,
    withdrawalStrategy
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

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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
