import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

interface FinancialRecord {
  record_year: number;
  record_month: number;
  ending_balance: number;
  starting_balance: number;
  monthly_contribution: number;
  monthly_return_rate: number;
  target_rentability: number;
}

interface MonthlyViewProps {
  userId: string;
  initialRecords: FinancialRecord[];
}

export const MonthlyView = ({ userId, initialRecords }: MonthlyViewProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const RECORDS_PER_PAGE = 12;

  const { data: additionalRecords, isLoading } = useQuery({
    queryKey: ['financialRecords', userId, page],
    queryFn: async () => {
      if (page === 1) return [];
      
      const { data, error } = await supabase
        .from('user_financial_records')
        .select('*')
        .eq('user_id', userId)
        .order('record_year', { ascending: false })
        .order('record_month', { ascending: false })
        .range(RECORDS_PER_PAGE, (page * RECORDS_PER_PAGE) - 1);

      if (error) {
        console.error('Error fetching additional records:', error);
        return [];
      }

      return data;
    },
    enabled: page > 1,
  });

  // Add a query to get total count
  const { data: totalCount } = useQuery({
    queryKey: ['financialRecordsCount', userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_financial_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching count:', error);
        return 0;
      }

      return count || 0;
    },
  });

  const allDisplayedRecords = [...initialRecords, ...(additionalRecords || [])];

  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const downloadCSV = async () => {
    try {
      // Fetch all records for CSV
      const { data: allRecords, error } = await supabase
        .from('user_financial_records')
        .select('*')
        .eq('user_id', userId)
        .order('record_year', { ascending: false })
        .order('record_month', { ascending: false });

      if (error) throw error;

      // Create CSV headers
      const headers = [
        t('monthlyView.table.headers.month'),
        t('monthlyView.table.headers.initialBalance'),
        t('monthlyView.table.headers.contribution'),
        t('monthlyView.table.headers.returns'),
        t('monthlyView.table.headers.returnPercentage'),
        t('monthlyView.table.headers.endBalance'),
        t('monthlyView.table.headers.targetRentability')
      ].join(',');

      // Process all records for CSV
      const processedData = allRecords.map(record => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December'];
        
        const month = `${t(`monthlyView.table.months.${monthNames[record.record_month - 1]}`)}/${record.record_year}`;
        const returns = record.ending_balance - record.starting_balance;
        
        return [
          month,
          record.starting_balance.toString(),
          record.monthly_contribution.toString(),
          returns.toString(),
          `${record.monthly_return_rate.toFixed(2)}%`,
          record.ending_balance.toString(),
          `${record.target_rentability.toFixed(2)}%`
        ].join(',');
      });

      // Combine headers and rows
      const csvContent = [headers, ...processedData].join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `financial_records_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: t('monthlyView.downloadError'),
        variant: "destructive",
      });
    }
  };

  // Add check for empty records
  if (allDisplayedRecords.length === 0) {
    return (
      <DashboardCard title={t('monthlyView.title')} className="col-span-full">
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          {t('monthlyView.noData')}
        </div>
      </DashboardCard>
    );
  }

  const sortedRecords = allDisplayedRecords.sort((a, b) => {
    // Sort by year and month in descending order
    if (a.record_year !== b.record_year) {
      return b.record_year - a.record_year;
    }
    return b.record_month - a.record_month;
  });

  const monthlyData = sortedRecords.map(record => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'];
      
    const returns = record.ending_balance - record.starting_balance;
      
    return {
      month: `${monthNames[record.record_month - 1]}/${record.record_year}`,
      balance: record.starting_balance,
      contribution: record.monthly_contribution,
      returns,
      percentage: record.monthly_return_rate,
      endBalance: record.ending_balance,
      targetRentability: record.target_rentability
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
      <Tabs defaultValue="balanceChart" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="balanceChart">{t('monthlyView.tabs.balanceChart')}</TabsTrigger>
          <TabsTrigger value="returnChart">{t('monthlyView.tabs.returnChart')}</TabsTrigger>
          <TabsTrigger value="table">{t('monthlyView.tabs.table')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="balanceChart" className="space-y-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 'auto']} />
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
        
        <TabsContent value="returnChart" className="space-y-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis unit="%" />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#22c55e" 
                  name={t('monthlyView.chart.monthlyReturn')}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="targetRentability" 
                  stroke="#f43f5e" 
                  name={t('monthlyView.chart.targetRentability')}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="table">
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={downloadCSV}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
              {t('monthlyView.downloadCSV')}
            </button>
          </div>
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
                  <th className="p-2 text-right">{t('monthlyView.table.headers.targetRentability')}</th>
                </tr>
              </thead>
              <tbody>
                {localizedData.map((data) => (
                  <tr key={data.month} className="border-b">
                    <td className="p-2">{data.month}</td>
                    <td className="p-2 text-right">R$ {data.balance.toLocaleString()}</td>
                    <td className="p-2 text-right">R$ {data.contribution.toLocaleString()}</td>
                    <td className={`p-2 text-right ${data.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.returns >= 0 ? '+' : ''}{`R$ ${data.returns.toLocaleString()}`}
                    </td>
                    <td className={`p-2 text-right ${data.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.percentage >= 0 ? '+' : ''}{data.percentage.toFixed(2)}%
                    </td>
                    <td className="p-2 text-right font-medium">R$ {data.endBalance.toLocaleString()}</td>
                    <td className="p-2 text-right font-medium">{data.targetRentability.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalCount !== null && (page * RECORDS_PER_PAGE) < totalCount && !isLoading && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10"
              >
                {t('monthlyView.loadMore')}
              </button>
            </div>
          )}
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <Spinner size="sm" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardCard>
  );
};