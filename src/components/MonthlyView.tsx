import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";

const monthlyData = [
  {
    month: 'January',
    balance: 50000,
    contribution: 1000,
    returns: 625,
    percentage: 1.25,
    endBalance: 51625
  },
  {
    month: 'February',
    balance: 51625,
    contribution: 1000,
    returns: 657,
    percentage: 1.27,
    endBalance: 53282
  },
  {
    month: 'March',
    balance: 53282,
    contribution: 1000,
    returns: 681,
    percentage: 1.28,
    endBalance: 54963
  },
  // Add more months as needed
];

export const MonthlyView = () => {
  const { t } = useTranslation();

  const localizedData = monthlyData.map(data => ({
    ...data,
    month: t(`monthlyView.table.months.${data.month}`)
  }));

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
              <LineChart data={localizedData}>
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