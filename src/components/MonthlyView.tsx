import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { fetchCDIRates, fetchIPCARates, fetchUSCPIRates, fetchEuroCPIRates } from '@/lib/bcb-api';
import { ChevronDown, ChevronRight, Download, BarChart } from "lucide-react";
import { generateProjectionData, YearlyProjectionData } from '@/lib/chart-projections';
import React from "react";
import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent, Profile } from '@/types/financial';
import { supabase } from "@/lib/supabase";
import { CartesianGrid, Line, Tooltip, LineChart as RechartsLineChart, XAxis, YAxis, Legend } from "recharts";
import { ResponsiveContainer } from "recharts";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatCurrency, CurrencyCode } from "@/utils/currency";

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
  profile: Profile;
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

  const { data: allUsCpiRates } = useQuery({
    queryKey: ['allUsCpiRates'],
    queryFn: async () => {
      const sortedRecords = [...allFinancialRecords].sort((a, b) => {
        if (a.record_year !== b.record_year) return a.record_year - b.record_year;
        return a.record_month - b.record_month;
      });

      const startDate = `01/${sortedRecords[0].record_month.toString().padStart(2, '0')}/${sortedRecords[0].record_year}`;
      const lastRecord = sortedRecords[sortedRecords.length - 1];
      const endDate = `01/${lastRecord.record_month.toString().padStart(2, '0')}/${lastRecord.record_year}`;
      
      return fetchUSCPIRates(startDate, endDate);
    },
    enabled: Boolean(allFinancialRecords?.length),
  });

  const { data: allEuroCpiRates } = useQuery({
    queryKey: ['allEuroCpiRates'],
    queryFn: async () => {
      const sortedRecords = [...allFinancialRecords].sort((a, b) => {
        if (a.record_year !== b.record_year) return a.record_year - b.record_year;
        return a.record_month - b.record_month;
      });

      const startDate = `01/${sortedRecords[0].record_month.toString().padStart(2, '0')}/${sortedRecords[0].record_year}`;
      const lastRecord = sortedRecords[sortedRecords.length - 1];
      const endDate = `01/${lastRecord.record_month.toString().padStart(2, '0')}/${lastRecord.record_year}`;
      
      return fetchEuroCPIRates(startDate, endDate);
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
        .eq("status", "pending"); 

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
      let headers: string[]
      let rows: string[][]

      if (data === localizedData) {
        headers = [
          t('monthlyView.table.headers.month'),
          t('monthlyView.table.headers.initialBalance'),
          t('monthlyView.table.headers.contribution'),
          t('monthlyView.table.headers.returns'),
          t('monthlyView.table.headers.returnPercentage'),
          t('monthlyView.table.headers.endBalance'),
          t('monthlyView.table.headers.targetRentability')
        ];
        rows = data.map(record => [
          record.month,
          record.balance.toString(),
          record.contribution.toString(),
          record.return.toString(),
          `${record.percentage.toFixed(2)}%`,
          record.endBalance.toString(),
          `${record.targetRentability.toFixed(2)}%`
        ]);
      } else {
        // projectionData
        headers = [
          t('monthlyView.futureProjection.age'),
          t('monthlyView.futureProjection.year'),
          t('monthlyView.table.headers.month'),
          t('monthlyView.futureProjection.cashFlow'),
          t('monthlyView.futureProjection.goalsEventsImpact'),
          t('monthlyView.futureProjection.balance'),
          t('monthlyView.futureProjection.projectedBalance'),
          t('monthlyView.futureProjection.ipcaRate'),
          t('monthlyView.futureProjection.effectiveRate')
        ];
        rows = [];
        data.forEach(yearRow => {
          // If months exist, add a row for each month
          if (Array.isArray(yearRow.months) && yearRow.months.length > 0) {
            yearRow.months.forEach(month => {
              rows.push([
                yearRow.age?.toString() ?? '',
                yearRow.year?.toString() ?? '',
                month.month?.toString() ?? '',
                month.contribution > 0 ? `+${month.contribution}` : month.withdrawal > 0 ? `-${month.withdrawal}` : '-',
                month.goalsEventsImpact?.toString() ?? '',
                month.balance?.toString() ?? '',
                month.planned_balance?.toString() ?? '',
                month.ipcaRate !== undefined ? `${(month.ipcaRate * 100).toFixed(4) || ''}` : '',
                month.effectiveRate !== undefined ? `${(month.effectiveRate * 100).toFixed(4) || ''}` : ''
              ]);
            });
          } else {
            // Fallback: just the year row
            rows.push([
              yearRow.age?.toString() ?? '',
              yearRow.year?.toString() ?? '',
              '',
              yearRow.contribution > 0 ? `+${yearRow.contribution}` : yearRow.withdrawal > 0 ? `-${yearRow.withdrawal}` : '-',
              yearRow.goalsEventsImpact?.toString() ?? '',
              yearRow.balance?.toString() ?? '',
              yearRow.planned_balance?.toString() ?? '',
              yearRow.ipcaRate !== undefined ? `${(yearRow.ipcaRate * 100).toFixed(2) || ''}` : '',
              yearRow.effectiveRate !== undefined ? `${(yearRow.effectiveRate * 100).toFixed(2) || ''}` : ''
            ]);
          }
        });
      }

      const clientName = profile?.name ? profile.name.replace(/\s+/g, '_').toLowerCase() : filename;
      const dateStr = new Date().toISOString().split('T')[0];
      const csvFileName = `${clientName}_${dateStr}.csv`;
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', csvFileName);
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
    month: `${t(`monthlyView.table.months.${data.month.split('/')[0].toLowerCase()}`)}/${data.month.split('/')[1]}`
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

      const usCpiRate = allUsCpiRates?.find(rate => 
        rate.date.getMonth() + 1 === record.record_month && 
        rate.date.getFullYear() === record.record_year
      )?.monthlyRate ?? 0;

      const euroCpiRate = allEuroCpiRates?.find(rate => 
        rate.date.getMonth() + 1 === record.record_month && 
        rate.date.getFullYear() === record.record_year
      )?.monthlyRate ?? 0;

      return {
        monthIndex: record.record_month - 1,
        year: record.record_year,
        month: `${t(`monthlyView.table.months.${monthNames[record.record_month - 1].toLowerCase()}`)}/${record.record_year}`,
        balance: record.starting_balance,
        contribution: record.monthly_contribution,
        percentage: record.monthly_return_rate,
        return: record.monthly_return,
        endBalance: record.ending_balance,
        targetRentability: record.target_rentability,
        cdiRate,
        ipcaRate,
        usCpiRate,
        euroCpiRate
      };
    }).reverse();
  };

  const calculateAccumulatedReturns = (data: ReturnType<typeof processRecordsForChart>) => {
    if (data.length === 0) return [];
    const processedData = data.map((record, index, array) => {
      const startIndex = timeWindow === 0 ? 0 : Math.max(0, array.length - timeWindow );
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

      const accumulatedUSCPIReturn = relevantData.reduce((acc, curr) => {
        return acc * (1 + curr.usCpiRate / 100);
      }, 1);

      const accumulatedEuroCPIReturn = relevantData.reduce((acc, curr) => {
        return acc * (1 + curr.euroCpiRate / 100);
      }, 1);

      return {
        ...record,
        accumulatedPercentage: ((accumulatedReturn - 1) * 100),
        accumulatedTargetRentability: ((accumulatedTargetReturn - 1) * 100),
        accumulatedCDIReturn: ((accumulatedCDIReturn - 1) * 100),
        accumulatedIPCAReturn: ((accumulatedIPCAReturn - 1) * 100),
        accumulatedUSCPIReturn: ((accumulatedUSCPIReturn - 1) * 100),
        accumulatedEuroCPIReturn: ((accumulatedEuroCPIReturn - 1) * 100)
      };
    });

    // Create a synthetic data point for the month before the first record
    const firstRecord = { ...processedData[0] };
    const month = firstRecord.monthIndex;
    const year = firstRecord.year;
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
      'july', 'august', 'september', 'october', 'november', 'december'];
    const previousMonth = month === 0 ? 'december' : monthNames[month - 1];
    const previousYear = month === 0 ? year - 1 : year;
    firstRecord.month = `${t(`monthlyView.table.months.${previousMonth.toLowerCase()}`)}/${previousYear}`;
    const syntheticDataPoint = {
      ...firstRecord,
      accumulatedPercentage: 0,
      accumulatedTargetRentability: 0,
      accumulatedCDIReturn: 0,
      accumulatedIPCAReturn: 0,
      accumulatedUSCPIReturn: 0,
      accumulatedEuroCPIReturn: 0
    };
    return [syntheticDataPoint, ...processedData];
  };

  const getFilteredChartData = (data: ReturnType<typeof calculateAccumulatedReturns>) => {
    if (timeWindow === 0) return data;
    return data.slice(-Math.min(timeWindow + 1, data.length));
  };

  const chartDataToUse = useMemo(() => 
    processRecordsForChart(
      timeWindow === 0 || timeWindow > RECORDS_PER_PAGE ? 
      chartRecords : 
      initialRecords
    ),
    [timeWindow, chartRecords, initialRecords]
  );

  const accumulatedReturns = useMemo(() => {
    return calculateAccumulatedReturns(chartDataToUse);
  }, [chartDataToUse]);

  const filteredChartData = useMemo(() => 
    getFilteredChartData(accumulatedReturns),
    [accumulatedReturns, timeWindow]
  );

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
            >
              {t('monthlyView.tabs.returnChart')}
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="table"
          >
            {t('monthlyView.tabs.table')}
          </TabsTrigger>
          <TabsTrigger 
            value="futureProjection"
          >
            {t('monthlyView.tabs.futureProjection')}
          </TabsTrigger>
        </TabsList>
        
        {allFinancialRecords.length > 0 && (
          <TabsContent value="returnChart" className="space-y-4">
            <div className="flex justify-end gap-2 mb-4">
                <Select value={timeWindow.toString()} onValueChange={(value) => setTimeWindow(Number(value) as typeof timeWindow)}>
                  <SelectTrigger className="w-[150px] h-8 text-sm border border-gray-200 rounded-lg px-2 bg-white/90 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 transition-colors ml-auto">
                    <SelectValue placeholder={t('common.selectPeriod')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">{t('monthlyView.timeWindows.last6Months')}</SelectItem>
                    <SelectItem value="12">{t('monthlyView.timeWindows.last12Months')}</SelectItem>
                    <SelectItem value="24">{t('monthlyView.timeWindows.last24Months')}</SelectItem>
                    <SelectItem value="0">{t('monthlyView.timeWindows.allTime')}</SelectItem>
                  </SelectContent>
                </Select> 
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={filteredChartData}>
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
                    <linearGradient id="colorUSCPI" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" /> {/* purple-500 */}
                      <stop offset="100%" stopColor="#c4b5fd" /> {/* purple-400 */}
                    </linearGradient>
                    <linearGradient id="colorEuroCPI" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ec4899" /> {/* pink-500 */}
                      <stop offset="100%" stopColor="#f472b6" /> {/* pink-400 */} 
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
                  {investmentPlan?.currency === 'BRL' && (
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
                  )}
                  {investmentPlan?.currency === 'BRL' && (
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
                  )}
                  {investmentPlan?.currency === 'USD' && (
                    <Line 
                      type="monotone" 
                      dataKey="accumulatedUSCPIReturn" 
                      stroke="url(#colorUSCPI)"
                      name={t('monthlyView.chart.accumulatedUSCPIReturn')}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ 
                        r: 8, 
                        strokeWidth: 2,
                        stroke: '#8b5cf6',
                        fill: 'white',
                        filter: 'url(#shadow)'
                      }}
                      animationDuration={1000}
                      animationEasing="ease-in-out"
                    />
                  )}
                  {investmentPlan?.currency === 'EUR' && (
                    <Line 
                      type="monotone" 
                      dataKey="accumulatedEuroCPIReturn" 
                      stroke="url(#colorEuroCPI)"
                      name={t('monthlyView.chart.accumulatedEuroCPIReturn')}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ 
                        r: 8, 
                        strokeWidth: 2,
                        stroke: '#ec4899',
                        fill: 'white',
                        filter: 'url(#shadow)'
                      }}
                      animationDuration={1000}
                      animationEasing="ease-in-out"
                    />
                  )}
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
              variant="default"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
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
                      <td className="p-3 text-right">{formatCurrency(data.balance, investmentPlan?.currency as CurrencyCode)}</td>
                      <td className="p-3 text-right">{formatCurrency(data.contribution, investmentPlan?.currency as CurrencyCode)}</td>
                      <td className={`p-3 text-right font-medium ${
                        data.return >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.return >= 0 ? '+' : ''}{formatCurrency(data.return, investmentPlan?.currency as CurrencyCode)}
                      </td>
                      <td className={`p-3 text-right font-medium ${
                        data.percentage === null ? 'text-gray-600' : data.percentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.percentage && data.percentage >= 0 ? '+' : ''}{data.percentage?.toFixed(2) || 0}%
                      </td>
                      <td className="p-3 text-right font-semibold">{formatCurrency(data.endBalance, investmentPlan?.currency as CurrencyCode)}</td>
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
              variant="default"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
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
                        {projection.contribution - projection.withdrawal > 0 ? (
                          <span className="text-green-600 font-medium">
                            +{formatCurrency(projection.contribution - projection.withdrawal, investmentPlan?.currency as CurrencyCode)}
                          </span>
                        ) : projection.withdrawal > 0 ? (
                          <span className="text-red-600 font-medium">
                            -{formatCurrency(projection.withdrawal - projection.contribution, investmentPlan?.currency as CurrencyCode)}
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
                          {formatCurrency(projection.goalsEventsImpact, investmentPlan?.currency as CurrencyCode)}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold">
                        <span className={projection.balance < 0 ? 'text-red-600' : ''}>
                          {formatCurrency(projection.balance, investmentPlan?.currency as CurrencyCode)}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold">
                        <span className={projection.planned_balance < 0 ? 'text-red-600' : ''}>
                          {formatCurrency(projection.planned_balance, investmentPlan?.currency as CurrencyCode)}
                        </span>
                        {projection.balance !== projection.planned_balance && (
                          <span className={`ml-2 text-xs ${
                            projection.balance - projection.planned_balance < 0 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            ({projection.balance > projection.planned_balance ? '+' : ''}
                            {formatCurrency(projection.balance - projection.planned_balance, investmentPlan?.currency as CurrencyCode)})
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
                                +{formatCurrency(month.contribution, investmentPlan?.currency as CurrencyCode)}
                              </span>
                            ) : month.withdrawal > 0 ? (
                              <span className="text-red-600 font-medium">
                                -{formatCurrency(month.withdrawal, investmentPlan?.currency as CurrencyCode)}
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
                              {formatCurrency(month.goalsEventsImpact, investmentPlan?.currency as CurrencyCode)}
                            </span>
                          </td>
                          <td className="p-2 text-right font-semibold">
                            <span className={month.balance < 0 ? 'text-red-600' : ''}>
                              {formatCurrency(month.balance, investmentPlan?.currency as CurrencyCode)}
                            </span>
                          </td>
                          <td className="p-2 text-right font-semibold">
                            {formatCurrency(month.planned_balance, investmentPlan?.currency as CurrencyCode)}
                            {month.balance !== month.planned_balance && (
                              <span className={`ml-2 text-xs ${
                                month.balance - month.planned_balance < 0 
                                  ? 'text-red-600' 
                                  : 'text-green-600'
                              }`}>
                                ({month.balance > month.planned_balance ? '+' : ''}
                                {formatCurrency(month.balance - month.planned_balance, investmentPlan?.currency as CurrencyCode)})
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
