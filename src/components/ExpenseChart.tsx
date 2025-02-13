import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from "react-i18next";
import { FinancialRecord } from '@/types/financial';
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from '@/lib/financial-math';

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
  adjust_contribution_for_inflation: boolean
}

interface ExpenseChartProps {
  investmentPlan: InvestmentPlan;
  clientId: string;
  financialRecordsByYear: FinancialRecord[];
  profile: Profile;
}

export const ExpenseChart = ({ profile, investmentPlan, clientId, financialRecordsByYear }: ExpenseChartProps) => {
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
  const yearsUntil120 = 120 - clientAge;
  
  // Create array of ages from initial_age to 120
  const allAges = Array.from({ length: yearsUntil120 + 1 }, (_, i) => clientAge + i);

  const generateProjectedValues = () => {
    const projectedData = [];
    // Convert yearly rates to monthly
    const monthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100 + investmentPlan.inflation/100);
    const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);

    
    let currentBalance = investmentPlan.initial_amount;
    let currentMonthlyDeposit = investmentPlan.monthly_deposit;
    let currentMonthlyWithdrawal = investmentPlan.desired_income;

    for (let i = 0; i < allAges.length; i++) {
      const age = allAges[i];
      const isRetirementAge = age >= investmentPlan.final_age;
      
      // Calculate all months for the year
      for (let month = 0; month < 12; month++) {
        // Adjust for inflation monthly
        if (investmentPlan.adjust_contribution_for_inflation) {
          currentMonthlyDeposit *= (1 + monthlyInflationRate);
        }
        currentMonthlyWithdrawal *= (1 + monthlyInflationRate);
        // Calculate monthly changes
        if (isRetirementAge) {
          // In retirement: first subtract withdrawal, then apply returns
          currentBalance = (currentBalance - currentMonthlyWithdrawal) * (1 + monthlyReturnRate);
        } else {
          // Before retirement: first add deposit, then apply returns
          currentBalance = (currentBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
        }
      }
      
      // Store the year-end balance
    projectedData.push({
        age,
        projectedValue: Math.round(Math.max(0, currentBalance))
      });
    }
    
    return projectedData;
  };
  
  const generateRealValues = () => {
    const birthYear = new Date(profile.birth_date).getFullYear();

    if (financialRecordsByYear.length === 0) {
      return generateProjectedValues().map(value => ({
        age: value.age,
        actualValue: value.projectedValue
      }));
    }

    const realValues = allAges.map(age => {
      const year = birthYear + age;
      const record = financialRecordsByYear.find(record => record.record_year === year);
      return {
        age,
        actualValue: record ? record.ending_balance : null
      };
    });

    // Fill with projections for future years
    let beforeFirstRecord = true;
    let lastBalance = 0;
    let currentMonthlyDeposit = investmentPlan.monthly_deposit;
    let currentMonthlyWithdrawal = investmentPlan.desired_income;

    for (let i = 0; i < realValues.length; i++) {
      const realValue = realValues[i];
      const age = allAges[i];
      const isRetirementAge = age >= investmentPlan.final_age;

      if (realValue.actualValue !== null) {
        beforeFirstRecord = false;
        lastBalance = realValue.actualValue;
        continue;
      }

      if (beforeFirstRecord) {
        realValue.actualValue = lastBalance;
        lastBalance = 0;
        continue;
      }

      // Convert yearly rates to monthly for more accurate calculations
      const monthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100 + investmentPlan.inflation/100);
      const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);

      // Calculate all months for the year
      for (let month = 0; month < 12; month++) {
        // Adjust for inflation monthly
        if (investmentPlan.adjust_contribution_for_inflation) {
          currentMonthlyDeposit *= (1 + monthlyInflationRate);
        }
        currentMonthlyWithdrawal *= (1 + monthlyInflationRate);

        if (isRetirementAge) {
          // In retirement: withdraw adjusted monthly amount and apply returns
          lastBalance = (lastBalance - currentMonthlyWithdrawal) * (1 + monthlyReturnRate);
        } else {
          // Before retirement: contribute adjusted monthly amount and apply returns
          lastBalance = (lastBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
        }
      }

      realValue.actualValue = Math.max(0, lastBalance); // Prevent negative balances
    }

    return realValues;
  };
  
  // Combine real and projected values
  const generateChartData = () => {
    const realValues = generateRealValues();
    const projectedValues = generateProjectedValues();

    // Merge real and projected values using age instead of year
    const chartData = allAges.map(age => {
      const realData = realValues.find(v => v.age === age);
      const projectedData = projectedValues.find(v => v.age === age);
      
      return {
        age: age.toString(),
        actualValue: realData?.actualValue,
        projectedValue: projectedData?.projectedValue
      };
    });

    return chartData;
  };

  const chartData = generateChartData();

  return (
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
  );
};
