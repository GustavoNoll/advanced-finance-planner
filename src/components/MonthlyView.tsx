import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { fetchCDIRates } from '@/lib/bcb-api';
import { fetchIPCARates } from '@/lib/bcb-api';

interface FinancialRecord {
  record_year: number;
  record_month: number;
  ending_balance: number;
  starting_balance: number;
  monthly_contribution: number;
  monthly_return_rate: number;
  monthly_return: number;
  target_rentability: number;
}

interface MonthlyViewProps {
  userId: string;
  initialRecords: FinancialRecord[];
}

export const MonthlyView = ({ userId, initialRecords }: MonthlyViewProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [timeWindow, setTimeWindow] = useState<6 | 12 | 24 | 0>(12); // 0 means all time
  const RECORDS_PER_PAGE = 12;

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

  const { data: additionalRecords, isLoading } = useQuery({
    queryKey: ['financialRecords', userId, page, timeWindow],
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

  const { data: chartRecords } = useQuery({
    queryKey: ['chartRecords', userId, timeWindow],
    queryFn: async () => {
      console.log(timeWindow);
      if (timeWindow === 0) {
        const { data, error } = await supabase
          .from('user_financial_records')
          .select('*')
          .eq('user_id', userId)
          .order('record_year', { ascending: false })
          .order('record_month', { ascending: false });
  
        if (error) {
          console.error('Error fetching all records:', error);
          return initialRecords;
        }
  
        return data;
      }

      if (timeWindow <= RECORDS_PER_PAGE) {
        return initialRecords;
      }

      const { data, error } = await supabase
        .from('user_financial_records')
        .select('*')
        .eq('user_id', userId)
        .order('record_year', { ascending: false })
        .order('record_month', { ascending: false })
        .limit(timeWindow);

      if (error) {
        console.error('Error fetching chart records:', error);
        return initialRecords;
      }

      return data;
    },
    enabled: timeWindow > RECORDS_PER_PAGE || timeWindow === 0,
  });

  const allDisplayedRecords = [...initialRecords, ...(additionalRecords || [])];
  const allChartRecords = chartRecords || initialRecords;

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
        
        return [
          month,
          record.starting_balance.toString(),
          record.monthly_contribution.toString(),
          record.monthly_return.toString(),
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
      
      
    return {
      month: `${monthNames[record.record_month - 1]}/${record.record_year}`,
      balance: record.starting_balance,
      contribution: record.monthly_contribution,
      percentage: record.monthly_return_rate,
      return: record.monthly_return,
      endBalance: record.ending_balance,
      targetRentability: record.target_rentability
    };
  });

  const localizedData = monthlyData.map(data => ({
    ...data,
    month: `${t(`monthlyView.table.months.${data.month.split('/')[0]}`)}/${data.month.split('/')[1]}`
  }));

  // Update the query keys to include timeWindow
  const { data: cdiRates } = useQuery({
    queryKey: ['cdiRates', initialRecords, timeWindow, chartRecords],
    queryFn: async () => {
      const recordsToUse = timeWindow === 0 || timeWindow > RECORDS_PER_PAGE ? 
        chartRecords : initialRecords;

      if (!recordsToUse?.length) return [];
      
      const sortedRecords = [...recordsToUse].sort((a, b) => {
        if (a.record_year !== b.record_year) return a.record_year - b.record_year;
        return a.record_month - b.record_month;
      });

      const startDate = `01/${sortedRecords[0].record_month.toString().padStart(2, '0')}/${sortedRecords[0].record_year}`;
      const lastRecord = sortedRecords[sortedRecords.length - 1];
      const endDate = `01/${lastRecord.record_month.toString().padStart(2, '0')}/${lastRecord.record_year}`;
      
      return await fetchCDIRates(startDate, endDate);
    },
    enabled: (timeWindow === 0 || timeWindow > RECORDS_PER_PAGE ? !!chartRecords : !!initialRecords.length),
  });

  const { data: ipcaRates } = useQuery({
    queryKey: ['ipcaRates', initialRecords, timeWindow, chartRecords],
    queryFn: async () => {
      const recordsToUse = timeWindow === 0 || timeWindow > RECORDS_PER_PAGE ? 
        chartRecords : initialRecords;

      if (!recordsToUse?.length) return [];
      
      const sortedRecords = [...recordsToUse].sort((a, b) => {
        if (a.record_year !== b.record_year) return a.record_year - b.record_year;
        return a.record_month - b.record_month;
      });

      const startDate = `01/${sortedRecords[0].record_month.toString().padStart(2, '0')}/${sortedRecords[0].record_year}`;
      const lastRecord = sortedRecords[sortedRecords.length - 1];
      const endDate = `01/${lastRecord.record_month.toString().padStart(2, '0')}/${lastRecord.record_year}`;
      
      return await fetchIPCARates(startDate, endDate);
    },
    enabled: (timeWindow === 0 || timeWindow > RECORDS_PER_PAGE ? !!chartRecords : !!initialRecords.length),
  });

  const processRecordsForChart = (records: FinancialRecord[]) => {
    const sortedRecords = records.sort((a, b) => {
      if (a.record_year !== b.record_year) {
        return b.record_year - a.record_year;
      }
      return b.record_month - a.record_month;
    });

    return sortedRecords.map(record => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];
        
      const cdiRate = cdiRates?.find(rate => 
        rate.date.getMonth() + 1 === record.record_month && 
        rate.date.getFullYear() === record.record_year
      )?.monthlyRate ?? 0;

      const ipcaRate = ipcaRates?.find(rate => 
        rate.date.getMonth() + 1 === record.record_month && 
        rate.date.getFullYear() === record.record_year
      )?.monthlyRate ?? 0;

      return {
        month: `${t(`monthlyView.table.months.${monthNames[record.record_month - 1]}`)}/${record.record_year}`,
        balance: record.starting_balance,
        contribution: record.monthly_contribution,
        percentage: record.monthly_return_rate,
        return: record.monthly_return,
        endBalance: record.ending_balance,
        targetRentability: record.target_rentability,
        cdiRate,
        ipcaRate
      };
    }).reverse();
  };

  const calculateAccumulatedReturns = (data: ReturnType<typeof processRecordsForChart>) => {
    return data.map((record, index, array) => {
      // Calculate the start index based on the timeWindow
      const startIndex = timeWindow === 0 ? 0 : Math.max(0, array.length - timeWindow);
      // Only use data from the startIndex up to the current index
      const relevantData = array.slice(startIndex, index + 1);
      
      const accumulatedReturn = relevantData.reduce((acc, curr) => {
        return acc * (1 + curr.percentage / 100);
      }, 1);
      
      const accumulatedTargetReturn = relevantData.reduce((acc, curr) => {
        return acc * (1 + curr.targetRentability / 100);
      }, 1);

      const accumulatedCDIReturn = relevantData.reduce((acc, curr) => {
        return acc * (1 + curr.cdiRate / 100);
      }, 1);

      const accumulatedIPCAReturn = relevantData.reduce((acc, curr) => {
        return acc * (1 + curr.ipcaRate / 100);
      }, 1);

      return {
        ...record,
        accumulatedPercentage: ((accumulatedReturn - 1) * 100),
        accumulatedTargetRentability: ((accumulatedTargetReturn - 1) * 100),
        accumulatedCDIReturn: ((accumulatedCDIReturn - 1) * 100),
        accumulatedIPCAReturn: ((accumulatedIPCAReturn - 1) * 100)
      };
    });
  };

  // Modify the chartDataToUse assignment
  const chartDataToUse = processRecordsForChart(
    timeWindow === 0 || timeWindow > RECORDS_PER_PAGE ? 
    allChartRecords : 
    initialRecords
  );

  // Update getFilteredChartData to handle the data consistently
  const getFilteredChartData = (data: ReturnType<typeof calculateAccumulatedReturns>) => {
    if (timeWindow === 0) return data;
    return data.slice(-Math.min(timeWindow, data.length));
  };

  return (
    <DashboardCard title={t('monthlyView.title')} className="col-span-full">
      <Tabs defaultValue="returnChart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[600px]">
          <TabsTrigger value="returnChart">{t('monthlyView.tabs.returnChart')}</TabsTrigger>
          <TabsTrigger value="table">{t('monthlyView.tabs.table')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="returnChart" className="space-y-4">
          <div className="flex justify-end gap-2 mb-4">
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(Number(e.target.value) as typeof timeWindow)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value={6}>{t('monthlyView.timeWindows.last6Months')}</option>
              <option value={12}>{t('monthlyView.timeWindows.last12Months')}</option>
              <option value={24}>{t('monthlyView.timeWindows.last24Months')}</option>
              <option value={0}>{t('monthlyView.timeWindows.allTime')}</option>
            </select>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getFilteredChartData(calculateAccumulatedReturns(chartDataToUse))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis unit="%" />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Line 
                  type="monotone" 
                  dataKey="accumulatedPercentage" 
                  stroke="#22c55e" 
                  name={t('monthlyView.chart.accumulatedReturn')}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="accumulatedTargetRentability" 
                  stroke="#f43f5e" 
                  name={t('monthlyView.chart.accumulatedTargetReturn')}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="accumulatedCDIReturn" 
                  stroke="#3b82f6" 
                  name={t('monthlyView.chart.accumulatedCDIReturn')}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="accumulatedIPCAReturn" 
                  stroke="#eab308" 
                  name={t('monthlyView.chart.accumulatedIPCAReturn')}
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
                    <td className={`p-2 text-right ${data.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.return >= 0 ? '+' : ''}{`R$ ${data.return.toLocaleString()}`}
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