import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetchCDIRates, fetchIPCARates, fetchUSCPIRates, fetchEuroCPIRates } from '@/lib/bcb-api';
import { generateProjectionData, YearlyProjectionData } from '@/lib/chart-projections';
import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent, Profile } from '@/types/financial';
import { CartesianGrid, Line, Tooltip, LineChart as RechartsLineChart, XAxis, YAxis, Legend } from "recharts";
import { ResponsiveContainer } from "recharts";
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math";

interface ReturnChartTabProps {
  allFinancialRecords: FinancialRecord[];
  investmentPlan: InvestmentPlan;
  profile: Profile;
  goals?: Goal[];
  events?: ProjectedEvent[];
}

// Update the zoom level type to include custom
type ZoomLevel = '6m' | '12m' | '24m' | 'all' | 'custom';

export function ReturnChartTab({ 
  allFinancialRecords, 
  investmentPlan, 
  profile,
  goals,
  events
}: ReturnChartTabProps) {
  const { t } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('12m');
  const [customRange, setCustomRange] = useState<{ startDate: string, endDate: string }>({ 
    startDate: '', 
    endDate: '' 
  });
  const [isDark, setIsDark] = useState<boolean>(typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false);
  
  useEffect(() => {
    const handler = () => setIsDark(document.documentElement.classList.contains('dark'));
    window.addEventListener('themechange', handler);
    return () => window.removeEventListener('themechange', handler);
  }, []);

  // Get filtered records based on zoom level
  const getFilteredRecords = (records: FinancialRecord[], zoomLevel: ZoomLevel, customRange: { startDate: string, endDate: string }) => {
    if (zoomLevel === 'all') return records;
    
    const sortedRecords = [...records].sort((a, b) => {
      if (a.record_year !== b.record_year) {
        return a.record_year - b.record_year;
      }
      return a.record_month - b.record_month;
    });

    if (zoomLevel === 'custom' && customRange.startDate && customRange.endDate) {
      // Parse dates correctly to avoid timezone issues
      const [startYear, startMonth] = customRange.startDate.split('-').map(Number);
      const [endYear, endMonth] = customRange.endDate.split('-').map(Number);
      
      // Create dates as first day of each month
      const startDate = new Date(startYear, startMonth - 1, 1);
      const endDate = new Date(endYear, endMonth - 1, 1);
      
      // Validate date range
      if (startDate > endDate) {
        return sortedRecords; // Return all records if invalid range
      }
      
      
      const filteredRecords = sortedRecords.filter(record => {
        const recordYear = record.record_year;
        const recordMonth = record.record_month;
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth() + 1; // getMonth() returns 0-11
        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth() + 1; // getMonth() returns 0-11
        
        // Check if record is within the range
        if (recordYear < startYear || (recordYear === startYear && recordMonth < startMonth)) {
          return false;
        }
        if (recordYear > endYear || (recordYear === endYear && recordMonth > endMonth)) {
          return false;
        }
        
        return true;
      });
      
      console.log('Records after filter:', filteredRecords.length);
      console.log('Filtered records:', filteredRecords.map(r => `${r.record_month}/${r.record_year}`));
      
      return filteredRecords;
    }

    // Convert zoom level to months
    const monthsMap = {
      '6m': 6,
      '12m': 12,
      '24m': 24,
    };

    const months = monthsMap[zoomLevel] || 12;
    // Get the last N months from the sorted records
    return sortedRecords.slice(-months);
  };

  const chartRecords = useMemo(() => {
    return getFilteredRecords(allFinancialRecords, zoomLevel, customRange);
  }, [allFinancialRecords, zoomLevel, customRange]);

  // Get available date range for custom selection
  const availableDateRange = useMemo(() => {
    if (allFinancialRecords.length === 0) return { min: '', max: '' };
    
    const sortedRecords = [...allFinancialRecords].sort((a, b) => {
      if (a.record_year !== b.record_year) {
        return a.record_year - b.record_year;
      }
      return a.record_month - b.record_month;
    });

    const firstRecord = sortedRecords[0];
    const lastRecord = sortedRecords[sortedRecords.length - 1];

    const minDate = `${firstRecord.record_year}-${firstRecord.record_month.toString().padStart(2, '0')}`;
    const maxDate = `${lastRecord.record_year}-${lastRecord.record_month.toString().padStart(2, '0')}`;

    return { min: minDate, max: maxDate };
  }, [allFinancialRecords]);

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

  const processRecordsForChart = (records: FinancialRecord[], investmentPlan: InvestmentPlan) => {
    const sortedRecords = records.sort((a, b) => {
      if (a.record_year !== b.record_year) {
        return a.record_year - b.record_year;
      }
      return a.record_month - b.record_month;
    });

    // old_portfolio_profitability representa IPCA + X%
    // Se old_portfolio_profitability = 2, significa IPCA + 2%
    const oldPortfolioSpreadMonthly = yearlyReturnRateToMonthlyReturnRate(investmentPlan.old_portfolio_profitability / 100);
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

      let rateToCalculateOldPortfolio = [];
      switch (investmentPlan.currency) {
        case 'USD':
          rateToCalculateOldPortfolio = allUsCpiRates;
          break;
        case 'EUR':
          rateToCalculateOldPortfolio = allEuroCpiRates;
          break;
        default:
          rateToCalculateOldPortfolio = allIpcaRates;
          break;
      }
      const rateToCalculateOldPortfolioMonthly = rateToCalculateOldPortfolio?.find(rate => 
        rate.date.getMonth() + 1 === record.record_month && 
        rate.date.getFullYear() === record.record_year
      )?.monthlyRate ?? 0;
      const oldPortfolioRateWithIpca = calculateCompoundedRates([rateToCalculateOldPortfolioMonthly/100, oldPortfolioSpreadMonthly]) * 100;
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
        euroCpiRate,
        oldPortfolioRate: oldPortfolioRateWithIpca
      };
    });
  };

  const calculateAccumulatedReturns = (data: ReturnType<typeof processRecordsForChart>) => {
    if (data.length === 0) return [];
    const processedData = data.map((record, index, array) => {
      const relevantData = array.slice(0, index + 1);
      
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

      // Calculate accumulated old portfolio return if available
      const accumulatedOldPortfolioReturn = relevantData.reduce((acc, curr) => {
        return acc * (1 + curr.oldPortfolioRate / 100);
      }, 1);

      return {
        ...record,
        accumulatedPercentage: ((accumulatedReturn - 1) * 100),
        accumulatedTargetRentability: ((accumulatedTargetReturn - 1) * 100),
        accumulatedCDIReturn: ((accumulatedCDIReturn - 1) * 100),
        accumulatedIPCAReturn: ((accumulatedIPCAReturn - 1) * 100),
        accumulatedUSCPIReturn: ((accumulatedUSCPIReturn - 1) * 100),
        accumulatedEuroCPIReturn: ((accumulatedEuroCPIReturn - 1) * 100),
        accumulatedOldPortfolioReturn: accumulatedOldPortfolioReturn ? ((accumulatedOldPortfolioReturn - 1) * 100) : 0
      };
    });

    // Create a synthetic data point for the month before the first record
    if (processedData.length > 0) {
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
        accumulatedEuroCPIReturn: 0,
        accumulatedOldPortfolioReturn: 0
      };
      return [syntheticDataPoint, ...processedData];
    }
    
    return processedData;
  };

  const chartDataToUse = useMemo(() => 
    processRecordsForChart(chartRecords, investmentPlan),
    [chartRecords, allCdiRates, allIpcaRates, allUsCpiRates, allEuroCpiRates]
  );

  const accumulatedReturns = useMemo(() => {
    return calculateAccumulatedReturns(chartDataToUse);
  }, [chartDataToUse]);

  const filteredChartData = useMemo(() => 
    accumulatedReturns,
    [accumulatedReturns]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('monthlyView.chart.title')}
        </h2>
        
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center rounded-md border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-900/80">
            <button
              onClick={() => setZoomLevel('6m')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === '6m' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('monthlyView.timeWindows.last6Months')}
            </button>
            <button
              onClick={() => setZoomLevel('12m')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === '12m' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('monthlyView.timeWindows.last12Months')}
            </button>
            <button
              onClick={() => setZoomLevel('24m')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === '24m' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('monthlyView.timeWindows.last24Months')}
            </button>
            <button
              onClick={() => setZoomLevel('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === 'all' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('monthlyView.timeWindows.allTime')}
            </button>
            <button
              onClick={() => setZoomLevel('custom')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                zoomLevel === 'custom' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('common.custom')}
            </button>
          </div>
          
          {zoomLevel === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {t('common.startDate')}:
                </label>
                <Input
                  type="month"
                  value={customRange.startDate}
                  onChange={(e) => setCustomRange({ ...customRange, startDate: e.target.value })}
                  className="w-full sm:w-[150px] h-8 text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 bg-white/90 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 dark:hover:border-gray-600 transition-colors"
                  min={availableDateRange.min}
                  max={availableDateRange.max}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {t('common.endDate')}:
                </label>
                <Input
                  type="month"
                  value={customRange.endDate}
                  onChange={(e) => setCustomRange({ ...customRange, endDate: e.target.value })}
                  className="w-full sm:w-[150px] h-8 text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 bg-white/90 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-200 dark:hover:border-gray-600 transition-colors"
                  min={availableDateRange.min}
                  max={availableDateRange.max}
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>📅</span>
                <span>
                  {availableDateRange.min && availableDateRange.max 
                    ? `Período disponível: ${availableDateRange.min.split('-')[1]}/${availableDateRange.min.split('-')[0]} a ${availableDateRange.max.split('-')[1]}/${availableDateRange.max.split('-')[0]}`
                    : 'Selecione um período'
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
        <ResponsiveContainer width="100%" height={400}>
          <RechartsLineChart data={filteredChartData}>
            <defs>
              <linearGradient id="colorAccumulated" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
              <linearGradient id="colorCDI" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <linearGradient id="colorIPCA" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>
              <linearGradient id="colorUSCPI" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
              <linearGradient id="colorEuroCPI" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
              <linearGradient id="colorOldPortfolio" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c2410c" />
                <stop offset="100%" stopColor="#ea580c" />
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
              stroke={isDark ? '#374151' : '#e5e7eb'} 
              vertical={false}
              strokeOpacity={0.3}
            />
            <XAxis 
              dataKey="month"
              tick={{ 
                fill: isDark ? '#9ca3af' : '#6b7280',
                fontSize: '0.75rem'
              }}
              axisLine={{ 
                stroke: isDark ? '#374151' : '#e5e7eb',
                strokeWidth: 1
              }}
            />
            <YAxis 
              unit="%"
              tick={{ 
                fill: isDark ? '#9ca3af' : '#6b7280',
                fontSize: '0.75rem'
              }}
              axisLine={{ 
                stroke: isDark ? '#374151' : '#e5e7eb',
                strokeWidth: 1
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDark ? '#111827' : 'white',
                border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                padding: '0.75rem',
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const sortedPayload = [...payload].sort((a, b) => {
                    const valueA = typeof a.value === 'number' ? a.value : 0;
                    const valueB = typeof b.value === 'number' ? b.value : 0;
                    return valueB - valueA;
                  });

                  return (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
                      <div className="space-y-2">
                        {sortedPayload.map((entry, index) => {
                          const value = typeof entry.value === 'number' ? entry.value : 0;
                          const name = String(entry.name || '');
                          
                          const getColor = (name: string) => {
                            switch (name) {
                              case t('monthlyView.chart.accumulatedReturn'):
                                return 'linear-gradient(to right, #22c55e, #4ade80)';
                              case t('monthlyView.chart.accumulatedTargetReturn'):
                                return 'linear-gradient(to right, #f43f5e, #fb7185)';
                              case t('monthlyView.chart.accumulatedCDIReturn'):
                                return 'linear-gradient(to right, #3b82f6, #60a5fa)';
                              case t('monthlyView.chart.accumulatedIPCAReturn'):
                                return 'linear-gradient(to right, #eab308, #facc15)';
                              case t('monthlyView.chart.accumulatedUSCPIReturn'):
                                return 'linear-gradient(to right, #8b5cf6, #c4b5fd)';
                              case t('monthlyView.chart.accumulatedEuroCPIReturn'):
                                return 'linear-gradient(to right, #ec4899, #f472b6)';
                              case t('monthlyView.chart.accumulatedOldPortfolioReturn'):
                                return 'linear-gradient(to right, #c2410c, #ea580c)';
                              default:
                                return 'linear-gradient(to right, #eab308, #facc15)';
                            }
                          };

                          return (
                            <div key={index} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ background: getColor(name) }}
                              />
                              <div className="flex flex-col">
                                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{name}</span>
                                <span className={`text-gray-900 dark:text-gray-100 font-semibold ${value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {value >= 0 ? '↑' : '↓'} {Math.abs(value).toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              labelStyle={{
                color: isDark ? '#e5e7eb' : '#1f2937',
                fontWeight: '600',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
              }}
              itemStyle={{
                color: isDark ? '#d1d5db' : '#374151',
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
            {investmentPlan?.old_portfolio_profitability && (
              <Line 
                type="monotone" 
                dataKey="accumulatedOldPortfolioReturn" 
                stroke="url(#colorOldPortfolio)"
                name={t('monthlyView.chart.accumulatedOldPortfolioReturn')}
                strokeWidth={3}
                dot={false}
                activeDot={{ 
                  r: 8, 
                  strokeWidth: 2,
                  stroke: '#c2410c',
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
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{value}</span>
              )}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
