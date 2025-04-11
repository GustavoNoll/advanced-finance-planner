import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { fetchCDIRates, fetchIPCARates } from '@/lib/bcb-api';
import { ChevronDown, ChevronRight, Download, BarChart } from "lucide-react";
import { generateProjectionData, YearlyProjectionData } from '@/lib/chart-projections';
import React from "react";
import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent } from '@/types/financial';
import { supabase } from "@/lib/supabase";
import { CartesianGrid, Line, Tooltip, LineChart as RechartsLineChart, XAxis, YAxis, Legend } from "recharts";
import { ResponsiveContainer } from "recharts";
import { Button } from "@tremor/react";


export const MonthlyView = ({ 
  userId, 
  initialRecords, 
  allFinancialRecords,
  investmentPlan, 
  profile,
  projectionData
}: {
  userId: string;
  initialRecords: FinancialRecord[];
  allFinancialRecords: FinancialRecord[];
  investmentPlan: InvestmentPlan;
  profile: {
    birth_date: string;
  };
  projectionData?: YearlyProjectionData[];
}) => {
  const { t } = useTranslation();
  const RECORDS_PER_PAGE = 12;
  
  // 1. All useState hooks
  const [page, setPage] = useState(1);
  const [timeWindow, setTimeWindow] = useState<6 | 12 | 24 | 0>(12);
  const [expandedYears, setExpandedYears] = useState<number[]>([]);
  
  // 2. All useMemo hooks
  const chartRecords = useMemo(() => {
    if (timeWindow === 0) return allFinancialRecords;
    
    return allFinancialRecords
      .sort((a, b) => {
        if (b.record_year !== a.record_year) {
          return b.record_year - a.record_year;
        }
        return b.record_month - a.record_month;
      })
      .slice(0, timeWindow);
  }, [allFinancialRecords, timeWindow]);


  const paginatedRecords = useMemo(() => {
    const startIndex = 0;
    const endIndex = page * RECORDS_PER_PAGE;
    return allFinancialRecords
      .sort((a, b) => {
        if (b.record_year !== a.record_year) {
          return b.record_year - a.record_year;
        }
        return b.record_month - a.record_month;
      })
      .slice(startIndex, endIndex);
  }, [allFinancialRecords, page]);

  // 3. All useQuery hooks
  const { data: allCdiRates } = useQuery({
    queryKey: ['allCdiRates'],
    queryFn: async () => {
      // Get the earliest and latest dates from all financial records
      const sortedRecords = [...allFinancialRecords].sort((a, b) => {
        if (a.record_year !== b.record_year) return a.record_year - b.record_year;
        return a.record_month - b.record_month;
      });

      const startDate = `01/${sortedRecords[0].record_month.toString().padStart(2, '0')}/${sortedRecords[0].record_year}`;
      const lastRecord = sortedRecords[sortedRecords.length - 1];
      const endDate = `01/${lastRecord.record_month.toString().padStart(2, '0')}/${lastRecord.record_year}`;
      
      return fetchCDIRates(startDate, endDate);
    },
    enabled: Boolean(allFinancialRecords?.length),
  });

  const { data: allIpcaRates } = useQuery({
    queryKey: ['allIpcaRates'],
    queryFn: async () => {
      const sortedRecords = [...allFinancialRecords].sort((a, b) => {
        if (a.record_year !== b.record_year) return a.record_year - b.record_year;
        return a.record_month - b.record_month;
      });

      const startDate = `01/${sortedRecords[0].record_month.toString().padStart(2, '0')}/${sortedRecords[0].record_year}`;
      const lastRecord = sortedRecords[sortedRecords.length - 1];
      const endDate = `01/${lastRecord.record_month.toString().padStart(2, '0')}/${lastRecord.record_year}`;
      
      return fetchIPCARates(startDate, endDate);
    },
    enabled: Boolean(allFinancialRecords?.length),
  });

  const { data: goals } = useQuery<Goal[]>({
    queryKey: ["financial-goals", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("profile_id", userId)
        .eq("status", "pending")
        .order("year", { ascending: true })
        .order("month", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: events } = useQuery<ProjectedEvent[]>({
    queryKey: ["events", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("profile_id", userId)
        .eq("status", "projected"); 

      if (error) throw error;
      return data;
    },
  });

  // 4. All other hooks and functions
  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const downloadCSV = async (data: typeof localizedData | typeof projectionData, filename: string) => {
    try {
      // Create CSV headers based on the data type
      const headers = data === localizedData ? [
        t('monthlyView.table.headers.month'),
        t('monthlyView.table.headers.initialBalance'),
        t('monthlyView.table.headers.contribution'),
        t('monthlyView.table.headers.returns'),
        t('monthlyView.table.headers.returnPercentage'),
        t('monthlyView.table.headers.endBalance'),
        t('monthlyView.table.headers.targetRentability')
      ] : [
        t('monthlyView.futureProjection.age'),
        t('monthlyView.futureProjection.year'),
        t('monthlyView.futureProjection.cashFlow'),
        t('monthlyView.futureProjection.goalsEventsImpact'),
        t('monthlyView.futureProjection.balance'),
        t('monthlyView.futureProjection.projectedBalance'),
        t('monthlyView.futureProjection.ipcaRate'),
        t('monthlyView.futureProjection.effectiveRate')
      ].join(',');

      // Process records for CSV
      const processedData = data === localizedData ? data.map(record => [
        record.month,
        record.balance.toString(),
        record.contribution.toString(),
        record.return.toString(),
        `${record.percentage.toFixed(2)}%`,
        record.endBalance.toString(),
        `${record.targetRentability.toFixed(2)}%`
      ]) : data.map(record => [
        record.age,
        record.year,
        record.contribution > 0 ? `+${record.contribution}` : record.withdrawal > 0 ? `-${record.withdrawal}` : '-',
        record.goalsEventsImpact,
        record.balance,
        record.planned_balance,
        `${(record.ipcaRate * 100).toFixed(2)}%`,
        `${(record.effectiveRate * 100).toFixed(2)}%`
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...processedData.map(row => row.join(','))].join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
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

  const sortedRecords = paginatedRecords.sort((a, b) => {
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
        
      const cdiRate = allCdiRates?.find(rate => 
        rate.date.getMonth() + 1 === record.record_month && 
        rate.date.getFullYear() === record.record_year
      )?.monthlyRate ?? 0;

      const ipcaRate = allIpcaRates?.find(rate => 
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
    chartRecords : 
    initialRecords
  );

  // Update getFilteredChartData to handle the data consistently
  const getFilteredChartData = (data: ReturnType<typeof calculateAccumulatedReturns>) => {
    if (timeWindow === 0) return data;
    return data.slice(-Math.min(timeWindow, data.length));
  };

  const toggleYearExpansion = (year: number) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  return (
    <DashboardCard 
      title={t('monthlyView.title')}
      className="col-span-full"
      icon={BarChart}
    >
      <Tabs defaultValue={allFinancialRecords.length > 0 ? "returnChart" : "table"} className="w-full">
        <TabsList className={`grid w-full ${allFinancialRecords.length > 0 ? 'grid-cols-3' : 'grid-cols-2'} lg:w-[800px] gap-2`}>
          {allFinancialRecords.length > 0 && (
            <TabsTrigger 
              value="returnChart"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-colors relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-500"
            >
              {t('monthlyView.tabs.returnChart')}
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="table"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-colors relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-500"
          >
            {t('monthlyView.tabs.table')}
          </TabsTrigger>
          <TabsTrigger 
            value="futureProjection"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-colors relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-500"
          >
            {t('monthlyView.tabs.futureProjection')}
          </TabsTrigger>
        </TabsList>
        
        {allFinancialRecords.length > 0 && (
          <TabsContent value="returnChart" className="space-y-4">
            <div className="flex justify-end gap-2 mb-4">
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(Number(e.target.value) as typeof timeWindow)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value={6}>{t('monthlyView.timeWindows.last6Months')}</option>
                <option value={12}>{t('monthlyView.timeWindows.last12Months')}</option>
                <option value={24}>{t('monthlyView.timeWindows.last24Months')}</option>
                <option value={0}>{t('monthlyView.timeWindows.allTime')}</option>
              </select>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={getFilteredChartData(calculateAccumulatedReturns(chartDataToUse))}>
                  <defs>
                    <linearGradient id="colorAccumulated" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22c55e" /> {/* green-500 */}
                      <stop offset="100%" stopColor="#4ade80" /> {/* green-400 */}
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
                      <stop offset="100%" stopColor="#fb7185" /> {/* rose-400 */}
                    </linearGradient>
                    <linearGradient id="colorCDI" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
                      <stop offset="100%" stopColor="#60a5fa" /> {/* blue-400 */}
                    </linearGradient>
                    <linearGradient id="colorIPCA" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#eab308" /> {/* yellow-500 */}
                      <stop offset="100%" stopColor="#facc15" /> {/* yellow-400 */}
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                      <feOffset dx="2" dy="2" result="offsetblur" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                    vertical={false}
                    strokeOpacity={0.3}
                  />
                  <XAxis 
                    dataKey="month"
                    tick={{ 
                      fill: '#6b7280',
                      fontSize: '0.75rem'
                    }}
                    axisLine={{ 
                      stroke: '#e5e7eb',
                      strokeWidth: 1
                    }}
                  />
                  <YAxis 
                    unit="%"
                    tick={{ 
                      fill: '#6b7280',
                      fontSize: '0.75rem'
                    }}
                    axisLine={{ 
                      stroke: '#e5e7eb',
                      strokeWidth: 1
                    }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      padding: '0.75rem',
                    }}
                    formatter={(value: number, name: string, props: { color?: string }) => [
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ 
                            background: name === t('monthlyView.chart.accumulatedReturn') ? 'linear-gradient(to right, #22c55e, #4ade80)' :
                                      name === t('monthlyView.chart.accumulatedTargetReturn') ? 'linear-gradient(to right, #f43f5e, #fb7185)' :
                                      name === t('monthlyView.chart.accumulatedCDIReturn') ? 'linear-gradient(to right, #3b82f6, #60a5fa)' :
                                      'linear-gradient(to right, #eab308, #facc15)'
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-sm font-medium">{name}</span>
                          <span className={`text-gray-900 font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {value >= 0 ? '↑' : '↓'} {Math.abs(value).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ]}
                    labelStyle={{
                      color: '#1f2937',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                    }}
                    itemStyle={{
                      color: '#374151',
                      fontSize: '0.875rem',
                      padding: '0.25rem 0',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accumulatedPercentage" 
                    stroke="url(#colorAccumulated)"
                    name={t('monthlyView.chart.accumulatedReturn')}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ 
                      r: 8, 
                      strokeWidth: 2,
                      stroke: '#22c55e',
                      fill: 'white',
                      filter: 'url(#shadow)'
                    }}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accumulatedTargetRentability" 
                    stroke="url(#colorTarget)"
                    name={t('monthlyView.chart.accumulatedTargetReturn')}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ 
                      r: 8, 
                      strokeWidth: 2,
                      stroke: '#f43f5e',
                      fill: 'white',
                      filter: 'url(#shadow)'
                    }}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accumulatedCDIReturn" 
                    stroke="url(#colorCDI)"
                    name={t('monthlyView.chart.accumulatedCDIReturn')}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ 
                      r: 8, 
                      strokeWidth: 2,
                      stroke: '#3b82f6',
                      fill: 'white',
                      filter: 'url(#shadow)'
                    }}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accumulatedIPCAReturn" 
                    stroke="url(#colorIPCA)"
                    name={t('monthlyView.chart.accumulatedIPCAReturn')}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ 
                      r: 8, 
                      strokeWidth: 2,
                      stroke: '#eab308',
                      fill: 'white',
                      filter: 'url(#shadow)'
                    }}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      bottom: 0
                    }}
                    formatter={(value) => (
                      <span className="text-sm font-medium text-gray-600">{value}</span>
                    )}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        )}

        <TabsContent value="table">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              onClick={() => downloadCSV(localizedData, 'financial_records')}
              icon={Download}
              variant="primary"
              size="xs"
            >
              {t('monthlyView.downloadCSV')}
            </Button>
          </div>
          {localizedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>{t('monthlyView.noData')}</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="p-3 text-left font-medium text-muted-foreground">{t('monthlyView.table.headers.month')}</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.initialBalance')}</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.contribution')}</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.returns')}</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.returnPercentage')}</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.endBalance')}</th>
                    <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.targetRentability')}</th>
                  </tr>
                </thead>
                <tbody>
                  {localizedData.map((data, index) => (
                    <tr 
                      key={`${data.month}-${data.balance}-${data.contribution}-${data.return}-${data.endBalance}-${data.targetRentability}`} 
                      className={`border-b transition-colors hover:bg-muted/50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-muted/10'
                      }`}
                    >
                      <td className="p-3 font-medium">{data.month}</td>
                      <td className="p-3 text-right">R$ {data.balance.toLocaleString()}</td>
                      <td className="p-3 text-right">R$ {data.contribution.toLocaleString()}</td>
                      <td className={`p-3 text-right font-medium ${
                        data.return >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.return >= 0 ? '+' : ''}{`R$ ${data.return.toLocaleString()}`}
                      </td>
                      <td className={`p-3 text-right font-medium ${
                        data.percentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.percentage >= 0 ? '+' : ''}{data.percentage.toFixed(2)}%
                      </td>
                      <td className="p-3 text-right font-semibold">R$ {data.endBalance.toLocaleString()}</td>
                      <td className="p-3 text-right font-medium">{data.targetRentability?.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {allFinancialRecords.length > page * RECORDS_PER_PAGE && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10"
              >
                {t('monthlyView.loadMore')}
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="futureProjection">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              onClick={() => downloadCSV(projectionData || generateProjectionData(
                investmentPlan,
                profile,
                allFinancialRecords,
                goals,
                events
              ), 'future_projection')}
              icon={Download}
              variant="primary"
              size="xs"
            >
              {t('monthlyView.downloadCSV')}
            </Button>
          </div>
          <div className="rounded-md border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-3 text-left font-medium text-muted-foreground whitespace-nowrap">{t('monthlyView.futureProjection.age')}</th>
                  <th className="p-3 text-left font-medium text-muted-foreground whitespace-nowrap">{t('monthlyView.futureProjection.year')}</th>
                  <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">{t('monthlyView.futureProjection.cashFlow')}</th>
                  <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">{t('monthlyView.futureProjection.goalsEventsImpact')}</th>
                  <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">{t('monthlyView.futureProjection.balance')}</th>
                  <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">{t('monthlyView.futureProjection.projectedBalance')}</th>
                  <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">{t('monthlyView.futureProjection.ipcaRate')}</th>
                  <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">{t('monthlyView.futureProjection.effectiveRate')}</th>
                  <th className="p-3 text-center font-medium text-muted-foreground w-10"></th>
                </tr>
              </thead>
              <tbody>
                {(projectionData || generateProjectionData(
                  investmentPlan,
                  profile,
                  allFinancialRecords,
                  goals,
                  events
                )).map((projection, index) => (
                  <React.Fragment key={`${projection.year}-${index}-group`}>
                    <tr 
                      className={`border-b transition-colors hover:bg-muted/50 ${
                        projection.hasHistoricalData ? 'bg-blue-50/50' : index % 2 === 0 ? 'bg-white' : 'bg-muted/10'
                      }`}
                    >
                      <td className="p-3">
                        {projection.hasHistoricalData && (
                          <span className="mr-2 text-xs text-blue-600 font-medium">
                            {t('monthlyView.futureProjection.historical')}
                          </span>
                        )}
                        {projection.age}
                      </td>
                      <td className="p-3 font-medium">{projection.year}</td>
                      <td className="p-3 text-right">
                        {projection.contribution > 0 ? (
                          <span className="text-green-600 font-medium">
                            +R$ {projection.contribution.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ) : projection.withdrawal > 0 ? (
                          <span className="text-red-600 font-medium">
                            -R$ {projection.withdrawal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-3 text-right">
                        <span className={`font-medium ${
                          projection.goalsEventsImpact > 0 
                            ? 'text-green-600' 
                            : projection.goalsEventsImpact < 0 
                              ? 'text-red-600' 
                              : 'text-foreground'
                        }`}>
                          R$ {projection.goalsEventsImpact?.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold">
                        R$ {projection.balance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-semibold">
                        R$ {projection.planned_balance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                        {projection.balance !== projection.planned_balance && (
                          <span className={`ml-2 text-xs ${
                            projection.balance > projection.planned_balance 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            ({projection.balance > projection.planned_balance ? '+' : ''}
                            R$ {(projection.balance - projection.planned_balance).toLocaleString('pt-BR', { maximumFractionDigits: 2 })})
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {(projection.ipcaRate * 100).toFixed(2) || '-'}%
                      </td>
                      <td className="p-3 text-right font-medium">
                        {(projection.effectiveRate * 100).toFixed(2) || '-'}%
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleYearExpansion(projection.year)}
                          className="p-1.5 hover:bg-muted rounded-full transition-colors"
                          title={expandedYears.includes(projection.year) 
                            ? t('monthlyView.futureProjection.collapseYear')
                            : t('monthlyView.futureProjection.expandYear')}
                        >
                          {expandedYears.includes(projection.year) 
                            ? <ChevronDown className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </td>
                    </tr>
                    {expandedYears.includes(projection.year) && projection.months?.map((month, monthIndex) => {
                      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                      return (
                        <tr 
                          key={`${projection.year}-${monthIndex}`} 
                          className={`border-b text-xs transition-colors hover:bg-muted/50 ${
                            month.isHistorical 
                              ? 'bg-blue-50/50' 
                              : 'bg-muted/20'
                          }`}
                        >
                          <td className="p-2">
                            {month.isHistorical && (
                              <span className="mr-2 text-xs text-blue-600 font-medium">
                                {'H'}
                              </span>
                            )}
                          </td>
                          <td className="p-2 font-medium">{monthNames[month.month - 1]}</td>
                          <td className="p-2 text-right">
                            {month.contribution > 0 ? (
                              <span className="text-green-600 font-medium">
                                +R$ {month.contribution.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            ) : month.withdrawal > 0 ? (
                              <span className="text-red-600 font-medium">
                                -R$ {month.withdrawal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-2 text-right">
                            <span className={`font-medium ${
                              month.goalsEventsImpact > 0 
                                ? 'text-green-600' 
                                : month.goalsEventsImpact < 0 
                                  ? 'text-red-600' 
                                  : 'text-foreground'
                            }`}>
                              R$ {month.goalsEventsImpact?.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="p-2 text-right font-medium">
                            R$ {month.balance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 text-right font-medium">
                            R$ {month.planned_balance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                            {month.balance !== month.planned_balance && (
                              <span className={`ml-2 text-xs ${
                                month.balance > month.planned_balance 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                ({month.balance > month.planned_balance ? '+' : ''}
                                R$ {(month.balance - month.planned_balance).toLocaleString('pt-BR', { maximumFractionDigits: 2 })})
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-right font-medium">
                            {(month.ipcaRate * 100).toFixed(4) || '-'}%
                          </td>
                          <td className="p-2 text-right font-medium">
                            {(month.effectiveRate * 100).toFixed(4) || '-'}%
                          </td>
                          <td className="p-2"></td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardCard>
  );
};
