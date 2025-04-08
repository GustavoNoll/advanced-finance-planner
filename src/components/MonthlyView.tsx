import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { fetchCDIRates, fetchIPCARates } from '@/lib/bcb-api';
import { ChevronDown, ChevronRight } from "lucide-react";
import { generateProjectionData, YearlyProjectionData } from '@/lib/chart-projections';
import React from "react";
import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent } from '@/types/financial';
import { supabase } from "@/lib/supabase";

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

  const downloadCSV = async () => {
    try {
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

      // Process records for CSV using allFinancialRecords
      const processedData = allFinancialRecords
        .sort((a, b) => {
          if (b.record_year !== a.record_year) {
            return b.record_year - a.record_year;
          }
          return b.record_month - a.record_month;
        })
        .map(record => {
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
    <DashboardCard title={t('monthlyView.title')} className="col-span-full">
      <Tabs defaultValue={allFinancialRecords.length > 0 ? "returnChart" : "table"} className="w-full">
        <TabsList className={`grid w-full ${allFinancialRecords.length > 0 ? 'grid-cols-3' : 'grid-cols-2'} lg:w-[800px]`}>
          {allFinancialRecords.length > 0 && (
            <TabsTrigger value="returnChart">{t('monthlyView.tabs.returnChart')}</TabsTrigger>
          )}
          <TabsTrigger value="table">{t('monthlyView.tabs.table')}</TabsTrigger>
          <TabsTrigger value="futureProjection">{t('monthlyView.tabs.futureProjection')}</TabsTrigger>
        </TabsList>
        
        {allFinancialRecords.length > 0 && (
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
        )}

        <TabsContent value="table">
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={downloadCSV}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
              {t('monthlyView.downloadCSV')}
            </button>
          </div>
          {localizedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>{t('monthlyView.noData')}</p>
            </div>
          ) : (
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
                    <tr key={`${data.month}-${data.balance}-${data.contribution}-${data.return}-${data.endBalance}-${data.targetRentability}`} className="border-b">
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
                      <td className="p-2 text-right font-medium">{data.targetRentability?.toFixed(2)}%</td>
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
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left whitespace-nowrap">{t('monthlyView.futureProjection.age')}</th>
                  <th className="p-2 text-left whitespace-nowrap">{t('monthlyView.futureProjection.year')}</th>
                  <th className="p-2 text-right whitespace-nowrap">{t('monthlyView.futureProjection.cashFlow')}</th>
                  <th className="p-2 text-right whitespace-nowrap">{t('monthlyView.futureProjection.goalsEventsImpact')}</th>
                  <th className="p-2 text-right whitespace-nowrap">{t('monthlyView.futureProjection.balance')}</th>
                  <th className="p-2 text-right whitespace-nowrap">{t('monthlyView.futureProjection.projectedBalance')}</th>
                  <th className="p-2 text-right whitespace-nowrap">{t('monthlyView.futureProjection.ipcaRate')}</th>
                  <th className="p-2 text-center w-10"></th>
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
                    <tr key={`${projection.year}-${index}`} className={`border-b hover:bg-muted/50 transition-colors ${
                      projection.hasHistoricalData ? 'bg-blue-50/50' : ''
                    }`}>
                      <td className="p-2">
                        {projection.hasHistoricalData && (
                          <span className="mr-2 text-xs text-blue-600 font-medium">
                            {t('monthlyView.futureProjection.historical')}
                          </span>
                        )}
                        {projection.age}
                      </td>
                      <td className="p-2">{projection.year}</td>
                      <td className="p-2 text-right">
                        {projection.contribution > 0 ? (
                          <span className="text-green-600">
                            +R$ {projection.contribution.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ) : projection.withdrawal > 0 ? (
                          <span className="text-red-600">
                            -R$ {projection.withdrawal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-2 text-right">
                        <span className={`${
                          projection.goalsEventsImpact > 0 
                            ? 'text-green-600' 
                            : projection.goalsEventsImpact < 0 
                              ? 'text-red-600' 
                              : 'text-black'
                        }`}>
                          R$ {projection.goalsEventsImpact?.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="p-2 text-right font-medium">
                        R$ {projection.balance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-2 text-right font-medium">
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
                      <td className="p-2 text-right font-medium">
                        {projection.ipcaRate?.toFixed(2) || '-'}%
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleYearExpansion(projection.year)}
                          className="p-1 hover:bg-muted rounded-full"
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
                        <tr key={`${projection.year}-${monthIndex}`} 
                            className={`border-b text-xs ${
                              month.isHistorical 
                                ? 'bg-blue-50/50' 
                                : 'bg-muted/20'
                            }`}>
                           <td className="p-2">
                            {month.isHistorical && (
                              <span className="mr-2 text-xs text-blue-600 font-medium">
                                {'H'}
                              </span>
                            )}
                          </td>
                          <td className="p-2">{monthNames[month.month - 1]}</td>
                          <td className="p-2 text-right">
                            {month.contribution > 0 ? (
                              <span className="text-green-600">
                                +R$ {month.contribution.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            ) : month.withdrawal > 0 ? (
                              <span className="text-red-600">
                                -R$ {month.withdrawal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-2 text-right">
                            <span className={`${
                              month.goalsEventsImpact > 0 
                                ? 'text-green-600' 
                                : month.goalsEventsImpact < 0 
                                  ? 'text-red-600' 
                                  : 'text-black'
                            }`}>
                              R$ {month.goalsEventsImpact?.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            R$ {month.balance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 text-right">
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
                            {month.ipcaRate?.toFixed(2) || '-'}%
                          </td>
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
