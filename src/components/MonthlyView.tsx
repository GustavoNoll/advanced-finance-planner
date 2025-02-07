import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";

interface FinancialRecord {
  record_year: number;
  record_month: number;
  ending_balance: number;
  starting_balance: number;
  monthly_contribution: number;
  monthly_return_rate: number;
}

interface MonthlyViewProps {
  financialRecords: FinancialRecord[];
}

export const MonthlyView = ({ financialRecords }: MonthlyViewProps) => {
  const { t } = useTranslation();

  // Add check for empty records
  if (financialRecords.length === 0) {
    return (
      <DashboardCard title={t('monthlyView.title')} className="col-span-full">
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          {t('monthlyView.noData')}
        </div>
      </DashboardCard>
    );
  }

  const sortedRecords = financialRecords.sort((a, b) => {
    // Sort by year and month in descending order
    if (a.record_year !== b.record_year) {
      return b.record_year - a.record_year;
    }
    return b.record_month - a.record_month;
  });

  const monthlyData = sortedRecords.map(record => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'];
      
    const returns = record.ending_balance - record.starting_balance - record.monthly_contribution;
      
    return {
      month: `${monthNames[record.record_month - 1]}/${record.record_year}`,
      balance: record.starting_balance,
      contribution: record.monthly_contribution,
      returns,
      percentage: record.monthly_return_rate,
      endBalance: record.ending_balance
    };
  });

  const localizedData = monthlyData.map(data => ({
    ...data,
    month: `${t(`monthlyView.table.months.${data.month.split('/')[0]}`)}/${data.month.split('/')[1]}`
  }));

  // Create reversed data for chart
  const chartData = [...localizedData].reverse();

  return (
    <DashboardCard title={t('monthlyView.title')} className="col-span-full">
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="chart">{t('monthlyView.tabs.chart')}</TabsTrigger>
          <TabsTrigger value="table">{t('monthlyView.tabs.table')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="endBalance" 
                  stroke="#22c55e" 
                  name={t('monthlyView.chart.endBalance')}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="contribution" 
                  stroke="#3b82f6" 
                  name={t('monthlyView.chart.contribution')}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="table">
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">{t('monthlyView.table.headers.month')}</th>
                  <th className="p-2 text-right">{t('monthlyView.table.headers.initialBalance')}</th>
                  <th className="p-2 text-right">{t('monthlyView.table.headers.contribution')}</th>
                  <th className="p-2 text-right">{t('monthlyView.table.headers.returns')}</th>
                  <th className="p-2 text-right">{t('monthlyView.table.headers.returnPercentage')}</th>
                  <th className="p-2 text-right">{t('monthlyView.table.headers.endBalance')}</th>
                </tr>
              </thead>
              <tbody>
                {localizedData.map((data) => (
                  <tr key={data.month} className="border-b">
                    <td className="p-2">{data.month}</td>
                    <td className="p-2 text-right">R$ {data.balance.toLocaleString()}</td>
                    <td className="p-2 text-right">R$ {data.contribution.toLocaleString()}</td>
                    <td className="p-2 text-right text-green-600">+R$ {data.returns.toLocaleString()}</td>
                    <td className="p-2 text-right text-green-600">+{data.percentage.toFixed(2)}%</td>
                    <td className="p-2 text-right font-medium">R$ {data.endBalance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardCard>
  );
};