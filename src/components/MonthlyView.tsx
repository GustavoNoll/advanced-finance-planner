import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  return (
    <DashboardCard title="Monthly Performance" className="col-span-full">
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="chart">Chart View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="endBalance" 
                  stroke="#22c55e" 
                  name="End Balance"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="contribution" 
                  stroke="#3b82f6" 
                  name="Contribution"
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
                  <th className="p-2 text-left">Month</th>
                  <th className="p-2 text-right">Initial Balance</th>
                  <th className="p-2 text-right">Contribution</th>
                  <th className="p-2 text-right">Returns</th>
                  <th className="p-2 text-right">Return %</th>
                  <th className="p-2 text-right">End Balance</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data) => (
                  <tr key={data.month} className="border-b">
                    <td className="p-2">{data.month}</td>
                    <td className="p-2 text-right">${data.balance.toLocaleString()}</td>
                    <td className="p-2 text-right">${data.contribution.toLocaleString()}</td>
                    <td className="p-2 text-right text-green-600">+${data.returns.toLocaleString()}</td>
                    <td className="p-2 text-right text-green-600">+{data.percentage.toFixed(2)}%</td>
                    <td className="p-2 text-right font-medium">${data.endBalance.toLocaleString()}</td>
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