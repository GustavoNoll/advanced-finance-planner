import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from "react-i18next";

interface FinancialRecord {
  record_year: number;
  record_month: number;
  ending_balance: number;
  starting_balance: number;
  monthly_contribution: number;
  monthly_return_rate: number;
}

interface InvestmentPlan {
  created_at: string;
  monthly_deposit: number;
  expected_return: number;
  inflation: number;
  initial_amount: number;
}

interface ExpenseChartProps {
  investmentPlan: InvestmentPlan;
  clientId: string;
  financialRecordsByYear: FinancialRecord[];
}

export const ExpenseChart = ({ investmentPlan, clientId, financialRecordsByYear }: ExpenseChartProps) => {
  const { t } = useTranslation();
  const startYear = new Date(investmentPlan.created_at).getFullYear();
  const endYear = startYear + 70;
  const allYears = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  const generateProjectedValues = (startDate: Date, startBalance: number) => {
    const projectedData = [];
    const yearlyReturnRate = (investmentPlan.expected_return + investmentPlan.inflation) / 100;
    let currentBalance = startBalance;
    
    for (let i = 0; i < allYears.length; i++) {
      const year = allYears[i];
      
      if (i === 0) {
        // For the first year, just use the initial balance without calculations
        projectedData.push({
          year,
          projectedValue: Math.round(currentBalance)
        });
      } else {
        // For subsequent years, calculate with full 12 months
        currentBalance = (currentBalance + (investmentPlan.monthly_deposit * 12)) * (1 + yearlyReturnRate);
        projectedData.push({
          year,
          projectedValue: Math.round(currentBalance)
        });
      }
    }
    
    return projectedData;
  };
  
  const generateRealValues = () => {
    const startYear = new Date(investmentPlan.created_at).getFullYear();
    const endYear = startYear + 70;
    const allYears = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    if (financialRecordsByYear.length === 0) {
      return allYears.map(year => ({
        year,
        actualValue: 0
      }));
    }
    console.log(financialRecordsByYear);
    const realValues = allYears.map(year => {
      const record = financialRecordsByYear.find(record => record.record_year === year);
      return {
        year,
        actualValue: record ? record.ending_balance : null
      };
    });


    // fill with 0 for years before the first record
    let beforeFirstRecord = true;
    let lastBalance = 0;
    const yearlyReturnRate = (investmentPlan.expected_return + investmentPlan.inflation) / 100;
    for (const realValue of realValues) {
      if (realValue.actualValue !== null) {
        beforeFirstRecord = false;
        lastBalance = realValue.actualValue;
        continue;
      }
      if (beforeFirstRecord) {
        realValue.actualValue = lastBalance;
        lastBalance = 0;
      }
      lastBalance = (lastBalance  + (investmentPlan.monthly_deposit * 12)) * (1 + yearlyReturnRate);
      realValue.actualValue = lastBalance;

    }
    return realValues;
  };
  
  // Combine real and projected values
  const generateChartData = () => {
    const realValues = generateRealValues();
    
    // Get the last real value to start projections from
    const projectedValues = generateProjectedValues(
      new Date(investmentPlan.created_at),
      investmentPlan.initial_amount
    );

    // Merge real and projected values
    const chartData = allYears.map(year => {
      const realData = realValues.find(v => v.year === year);
      const projectedData = projectedValues.find(v => v.year === year);
      
      return {
        year: year.toString(),
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
          dataKey="year"
          tickFormatter={(value) => value}
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

function toast(arg0: { title: string; variant: string; }) {
  throw new Error('Function not implemented.');
}
