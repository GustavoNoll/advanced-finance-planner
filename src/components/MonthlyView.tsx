import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { fetchCDIRates, fetchIPCARates } from '@/lib/bcb-api';
import { ChevronDown, ChevronRight } from "lucide-react";
import { yearlyReturnRateToMonthlyReturnRate } from '@/lib/financial-math';

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

interface ProjectionData {
  age: number;
  year: number;
  contribution: number;
  withdrawal: number;
  balance: number;
  months?: {
    month: number;
    contribution: number;
    withdrawal: number;
    isHistorical: boolean;
    balance: number;
  }[];
  isRetirementTransitionYear?: boolean;
  hasHistoricalData: boolean;
  returns: number;
}

interface WithdrawalStrategy {
  type: 'fixed' | 'preservation' | 'spend-all' | 'legacy';
  monthlyAmount?: number;
  targetLegacy?: number;
}

export const MonthlyView = ({ 
  userId, 
  initialRecords, 
  allFinancialRecords,
  investmentPlan, 
  profile
}: {
  userId: string;
  initialRecords: FinancialRecord[];
  allFinancialRecords: FinancialRecord[];
  investmentPlan: {
    initial_age: number;
    final_age: number;
    monthly_deposit: number;
    expected_return: number;
    inflation: number;
    adjust_contribution_for_inflation: boolean;
    desired_income: number;
  };
  profile: {
    birth_date: string;
  };
}) => {
  const { t } = useTranslation();
  const RECORDS_PER_PAGE = 12;
  
  // 1. All useState hooks
  const [page, setPage] = useState(1);
  const [timeWindow, setTimeWindow] = useState<6 | 12 | 24 | 0>(12);
  const [expandedYears, setExpandedYears] = useState<number[]>([]);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState<WithdrawalStrategy>({
    type: 'fixed',
    monthlyAmount: investmentPlan?.desired_income,
    targetLegacy: 1000000 // 1M default for legacy strategy
  });
  
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

  const recordsToUse = useMemo(() => 
    timeWindow === 0 || timeWindow > RECORDS_PER_PAGE ? chartRecords : initialRecords,
  [timeWindow, RECORDS_PER_PAGE, chartRecords, initialRecords]);

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
      
      return await fetchCDIRates(startDate, endDate);
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
      
      return await fetchIPCARates(startDate, endDate);
    },
    enabled: Boolean(allFinancialRecords?.length),
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

  // 5. Early returns after all hooks
  if (paginatedRecords.length === 0) {
    return (
      <DashboardCard title={t('monthlyView.title')} className="col-span-full">
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          {t('monthlyView.noData')}
        </div>
      </DashboardCard>
    );
  }

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

  const generateProjectionData = (strategy: WithdrawalStrategy): ProjectionData[] => {
    if (!profile?.birth_date || !investmentPlan || !initialRecords.length) {
      return [];
    }

    try {
      const birthDate = new Date(profile.birth_date);
      const birthYear = birthDate.getFullYear();
      const birthMonth = birthDate.getMonth() + 1;
      const yearsUntil120 = 120 - investmentPlan.initial_age;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      
      const startYear = birthYear + investmentPlan.initial_age;
      
      const projectionData: ProjectionData[] = [];
      let currentBalance = initialRecords[0]?.ending_balance || 0;
      let currentMonthlyDeposit = investmentPlan.monthly_deposit;
      let currentMonthlyWithdrawal = investmentPlan.desired_income;
      const yearlyReturnRate = investmentPlan.expected_return / 100 + investmentPlan.inflation / 100;
      const yearlyInflationRate = investmentPlan.inflation / 100;

      const historicalRecordsMap = new Map(
        allFinancialRecords.map(record => [
          `${record.record_year}-${record.record_month}`,
          record
        ])
      );
      
      for (let i = 0; i <= yearsUntil120; i++) {
        const age = investmentPlan.initial_age + i;
        const year = startYear + i;
        
        const monthlyData = Array.from({ length: 12 }, (_, month) => {
          const currentMonthNumber = month + 1;
          const historicalKey = `${year}-${currentMonthNumber}`;
          const historicalRecord = historicalRecordsMap.get(historicalKey);
          const isInPast = new Date(year, month) < currentDate;
            
          if (historicalRecord) {
            return {
              month: currentMonthNumber,
              contribution: historicalRecord.monthly_contribution,
              withdrawal: 0,
              balance: historicalRecord.ending_balance,
              isHistorical: true
            };
          }

          if (isInPast) {
            return {
              month: currentMonthNumber,
              contribution: 0,
              withdrawal: 0,
              balance: 0,
              isHistorical: false
            };
          }

          const isRetirementAge = age > investmentPlan.final_age || 
            (age === investmentPlan.final_age && currentMonthNumber >= birthMonth);

          if (currentMonthNumber === 1 && i > 0) {
            if (investmentPlan.adjust_contribution_for_inflation && !isRetirementAge) {
              currentMonthlyDeposit *= (1 + yearlyInflationRate);
            }
            currentMonthlyWithdrawal *= (1 + yearlyInflationRate);
          }


          const monthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(yearlyReturnRate);

          if (isRetirementAge) {
            let withdrawal = 0;
            const monthsUntil100 = (100 - age) * 12 - month;
            
            const monthlyReturn = currentBalance * monthlyReturnRate;
            switch (strategy.type) {
              case 'fixed':
                withdrawal = currentMonthlyWithdrawal;
                break;
              case 'preservation':
                withdrawal = monthlyReturn;
                break;
              case 'spend-all':
                // Calculate months remaining until age 100
                if (monthsUntil100 > 0) {
                  // Divide remaining balance plus expected returns by remaining months
                  withdrawal = (currentBalance + monthlyReturn) / monthsUntil100;
                } else {
                  withdrawal = currentBalance + monthlyReturn; // Withdraw everything in the final month
                }
                break;
              case 'legacy':
                if (age < 100) {
                  // Calculate required monthly savings to reach target legacy
                  const monthsUntil100 = (100 - age) * 12 - month;
                  const targetLegacy = strategy.targetLegacy || 1000000;
                  
                  if (monthsUntil100 > 0) {
                    // If current balance minus target legacy is positive, we can withdraw more
                    const excessBalance = currentBalance - targetLegacy;
                    if (excessBalance > 0) {
                      withdrawal = excessBalance / monthsUntil100 + monthlyReturn;
                    } else {
                      withdrawal = monthlyReturn * 0.5; // Withdraw half of returns to build up legacy
                    }
                  }
                }
                break;
            }
            
            currentBalance = (currentBalance - withdrawal) * (1 + monthlyReturnRate);

            return {
              month: currentMonthNumber,
              contribution: 0,
              withdrawal,
              balance: currentBalance,
              returns: monthlyReturn,
              isHistorical: false
            };
          } else {
            const monthlyReturn = currentBalance * monthlyReturnRate;
            currentBalance = (currentBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
            
            return {
              month: currentMonthNumber,
              contribution: currentMonthlyDeposit,
              withdrawal: 0,
              balance: currentBalance,
              returns: monthlyReturn,
              isHistorical: false
            };
          }
        });

        const hasRetirementTransition = age === investmentPlan.final_age;
        const yearlyContribution = monthlyData.reduce((sum, month) => sum + month.contribution, 0);
        const yearlyWithdrawal = monthlyData.reduce((sum, month) => sum + month.withdrawal, 0);

        projectionData.push({
          age,
          year,
          contribution: yearlyContribution,
          withdrawal: yearlyWithdrawal,
          balance: monthlyData[11].balance,
          months: monthlyData,
          isRetirementTransitionYear: hasRetirementTransition,
          hasHistoricalData: monthlyData.some(m => m.isHistorical),
          returns: monthlyData[11].returns
        });
      }

      return projectionData;
    } catch (error) {
      console.error('Error generating projection data:', error);
      return [];
    }
  };

  // Se não tivermos os dados necessários, mostramos uma mensagem
  if (!investmentPlan) {
    return (
      <DashboardCard title={t('monthlyView.title')} className="col-span-full">
        <div className="flex items-center justify-center p-8">
          <Spinner className="mr-2" />
          <span>Carregando dados...</span>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title={t('monthlyView.title')} className="col-span-full">
      <Tabs defaultValue="returnChart" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[800px]">
          <TabsTrigger value="returnChart">{t('monthlyView.tabs.returnChart')}</TabsTrigger>
          <TabsTrigger value="table">{t('monthlyView.tabs.table')}</TabsTrigger>
          <TabsTrigger value="futureProjection">{t('monthlyView.tabs.futureProjection')}</TabsTrigger>
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
            <select
              value={withdrawalStrategy.type}
              onChange={(e) => setWithdrawalStrategy({
                type: e.target.value as WithdrawalStrategy['type'],
                monthlyAmount: e.target.value === 'fixed' ? investmentPlan?.desired_income : undefined,
                targetLegacy: e.target.value === 'legacy' ? 1000000 : undefined
              })}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="fixed">{t('monthlyView.futureProjection.strategies.fixed')}</option>
              <option value="preservation">{t('monthlyView.futureProjection.strategies.preservation')}</option>
              <option value="spend-all">{t('monthlyView.futureProjection.strategies.spendAll')}</option>
              <option value="legacy">{t('monthlyView.futureProjection.strategies.legacy')}</option>
            </select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left whitespace-nowrap">{t('monthlyView.futureProjection.age')}</th>
                  <th className="p-2 text-left whitespace-nowrap">{t('monthlyView.futureProjection.year')}</th>
                  <th className="p-2 text-right whitespace-nowrap">{t('monthlyView.futureProjection.cashFlow')}</th>
                  <th className="p-2 text-right whitespace-nowrap">{t('monthlyView.futureProjection.balance')}</th>
                  <th className="p-2 text-center w-10"></th>
                </tr>
              </thead>
              <tbody>
                {generateProjectionData(withdrawalStrategy).map((projection) => (
                  <>
                    <tr key={projection.year} className={`border-b hover:bg-muted/50 transition-colors ${
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
                      <td className="p-2 text-right font-medium">
                        R$ {projection.balance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
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
                    {expandedYears.includes(projection.year) && projection.months?.map((month) => {
                      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                      return (
                        <tr key={`${projection.year}-${month.month}`} 
                            className={`border-b text-xs ${
                              month.isHistorical 
                                ? 'bg-blue-50/50' 
                                : 'bg-muted/20'
                            }`}>
                          <td className="p-2"></td>
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
                            R$ {month.balance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-2"></td>
                        </tr>
                      );
                    })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardCard>
  );
};
