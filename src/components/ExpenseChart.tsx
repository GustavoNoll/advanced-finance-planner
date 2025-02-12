
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from "react-i18next";

interface FinancialRecord {
  record_year: number;
  record_month: number;
  ending_balance: number;
  starting_balance: number;
  monthly_contribution: number;
  monthly_return_rate: number;
  monthly_return: number;
}

interface Profile {
  birth_date: string;
}

interface InvestmentPlan {
  created_at: string;
  monthly_deposit: number;
  expected_return: number;
  inflation: number;
  initial_amount: number;
  final_age: number;
  desired_income: number;
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
  
  // Calculate age-based year range
  const startYear = new Date(investmentPlan.created_at).getFullYear();
  const birthYear = new Date(profile.birth_date).getFullYear();
  const clientAge = startYear - birthYear;
  const yearsUntil120 = 120 - clientAge; // Extended to age 120
  
  // Modified to use ages instead of years
  const allAges = Array.from({ length: yearsUntil120 + 1 }, (_, i) => clientAge + i);

  const generateProjectedValues = (startDate: Date, startBalance: number) => {
    const projectedData = [];
    const yearlyReturnRate = investmentPlan.expected_return / 100;
    const yearlyInflationRate = investmentPlan.inflation / 100;
    let currentBalance = startBalance;
    let currentMonthlyDeposit = investmentPlan.monthly_deposit;
    let currentMonthlyWithdrawal = investmentPlan.desired_income;
    
    for (let i = 0; i < allAges.length; i++) {
      const age = allAges[i];
      const isRetirementAge = age >= investmentPlan.final_age;
      
      if (i === 0) {
        projectedData.push({
          age,
          projectedValue: Math.round(currentBalance)
        });
      } else {
        // Adjust monthly deposit/withdrawal for inflation annually
        if (i % 12 === 0) {
          currentMonthlyDeposit *= (1 + yearlyInflationRate);
          currentMonthlyWithdrawal *= (1 + yearlyInflationRate);
        }

        // Calculate yearly change based on whether in retirement or not
        if (isRetirementAge) {
          // In retirement: withdraw adjusted monthly amount and apply returns
          currentBalance = (currentBalance - (currentMonthlyWithdrawal * 12)) * (1 + yearlyReturnRate);
        } else {
          // Before retirement: contribute adjusted monthly amount and apply returns
          currentBalance = (currentBalance + (currentMonthlyDeposit * 12)) * (1 + yearlyReturnRate);
        }

        projectedData.push({
          age,
          projectedValue: Math.round(currentBalance)
        });
      }
    }
    
    return projectedData;
  };
  
  const generateRealValues = () => {
    if (financialRecordsByYear.length === 0) {
      return allAges.map(age => ({
        age,
        actualValue: 0
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
    const yearlyReturnRate = investmentPlan.expected_return / 100;
    const yearlyInflationRate = investmentPlan.inflation / 100;

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

      // Adjust for inflation annually
      if (i % 12 === 0) {
        currentMonthlyDeposit *= (1 + yearlyInflationRate);
        currentMonthlyWithdrawal *= (1 + yearlyInflationRate);
      }

      if (isRetirementAge) {
        // In retirement: withdraw adjusted monthly amount and apply returns
        lastBalance = (lastBalance - (currentMonthlyWithdrawal * 12)) * (1 + yearlyReturnRate);
      } else {
        // Before retirement: contribute adjusted monthly amount and apply returns
        lastBalance = (lastBalance + (currentMonthlyDeposit * 12)) * (1 + yearlyReturnRate);
      }

      realValue.actualValue = lastBalance;
    }

    return realValues;
  };
  
  // Combine real and projected values
  const generateChartData = () => {
    const realValues = generateRealValues();
    const projectedValues = generateProjectedValues(
      new Date(investmentPlan.created_at),
      investmentPlan.initial_amount
    );

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
