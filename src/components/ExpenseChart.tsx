import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from "react-i18next";

const data = [
  { month: 'Jan', investment: 10000, inflation: 9800 },
  { month: 'Feb', investment: 10400, inflation: 9900 },
  { month: 'Mar', investment: 10800, inflation: 10000 },
  { month: 'Apr', investment: 11200, inflation: 10100 },
  { month: 'May', investment: 11600, inflation: 10200 },
  { month: 'Jun', investment: 12000, inflation: 10300 },
];

export const ExpenseChart = () => {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="investment" 
          stroke="#22c55e" 
          name={t('expenseChart.portfolioValue')}
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="inflation" 
          stroke="#ef4444" 
          name={t('expenseChart.inflationAdjusted')}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};