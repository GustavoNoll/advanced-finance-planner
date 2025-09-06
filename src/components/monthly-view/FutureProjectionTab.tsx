import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronRight } from "lucide-react";
import { generateProjectionData, YearlyProjectionData, ChartOptions } from '@/lib/chart-projections';
import { FinancialRecord, InvestmentPlan, MicroInvestmentPlan, Goal, ProjectedEvent, Profile, ChartDataPoint } from '@/types/financial';
import { formatCurrency, CurrencyCode } from "@/utils/currency";
import { toast } from "@/components/ui/use-toast";

interface FutureProjectionTabProps {
  investmentPlan: InvestmentPlan;
  activeMicroPlan?: MicroInvestmentPlan | null;
  profile: Profile;
  allFinancialRecords: FinancialRecord[];
  goals?: Goal[];
  events?: ProjectedEvent[];
  projectionData?: YearlyProjectionData[];
  showGoalsEvents?: boolean;
  showRealEvolution?: boolean;
  isSimulation?: boolean;
  rawChartData?: ChartDataPoint[];
  chartOptions?: ChartOptions;
}

export function FutureProjectionTab({ 
  investmentPlan, 
  activeMicroPlan,
  profile, 
  allFinancialRecords, 
  goals, 
  events, 
  projectionData,
  showGoalsEvents = true,
  showRealEvolution = true,
  isSimulation = false,
  rawChartData,
  chartOptions
}: FutureProjectionTabProps) {
  const { t } = useTranslation();
  const [expandedYears, setExpandedYears] = useState<number[]>([]);

  const toggleYearExpansion = (year: number) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const downloadCSV = async (data: YearlyProjectionData[], filename: string) => {
    try {
      const headers = [
        t('monthlyView.futureProjection.age'),
        t('monthlyView.futureProjection.year'),
        t('monthlyView.table.headers.month'),
        t('monthlyView.futureProjection.cashFlow'),
        ...(showGoalsEvents ? [t('monthlyView.futureProjection.goalsEventsImpact')] : []),
        ...(showRealEvolution ? [t('monthlyView.futureProjection.balance')] : []),
        t('monthlyView.futureProjection.projectedBalance'),
        t('monthlyView.futureProjection.ipcaRate'),
        t('monthlyView.futureProjection.effectiveRate')
      ];
      
      const rows: string[][] = [];
      data.forEach(yearRow => {
        if (Array.isArray(yearRow.months) && yearRow.months.length > 0) {
          yearRow.months.forEach(month => {
            const row = [
              yearRow.age?.toString() ?? '',
              yearRow.year?.toString() ?? '',
              month.month?.toString() ?? '',
              month.contribution > 0 ? `+${Number(month.contribution).toFixed(2)}` : month.withdrawal > 0 ? `-${Number(month.withdrawal).toFixed(2)}` : '-',
              ...(showGoalsEvents ? [month.goalsEventsImpact ? Number(month.goalsEventsImpact).toFixed(2) : ''] : []),
              ...(showRealEvolution ? [month.balance ? Number(month.balance).toFixed(2) : ''] : []),
              month.planned_balance ? Number(month.planned_balance).toFixed(2) : '',
              month.ipcaRate !== undefined ? `${(month.ipcaRate * 100).toFixed(4)}` : '',
              month.effectiveRate !== undefined ? `${(month.effectiveRate * 100).toFixed(4)}` : ''
            ];
            rows.push(row);
          });
        } else {
          const row = [
            yearRow.age?.toString() ?? '',
            yearRow.year?.toString() ?? '',
            '',
            yearRow.contribution > 0 ? `+${Number(yearRow.contribution).toFixed(2)}` : yearRow.withdrawal > 0 ? `-${Number(yearRow.withdrawal).toFixed(2)}` : '-',
            ...(showGoalsEvents ? [yearRow.goalsEventsImpact ? Number(yearRow.goalsEventsImpact).toFixed(2) : ''] : []),
            ...(showRealEvolution ? [yearRow.balance ? Number(yearRow.balance).toFixed(2) : ''] : []),
            yearRow.planned_balance ? Number(yearRow.planned_balance).toFixed(2) : '',
            yearRow.ipcaRate !== undefined ? `${(yearRow.ipcaRate * 100).toFixed(4)}` : '',
            yearRow.effectiveRate !== undefined ? `${(yearRow.effectiveRate * 100).toFixed(4)}` : ''
          ];
          rows.push(row);
        }
      });

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

  const dataToShow = useMemo(() => {
    // If projectionData is provided, use it
    if (projectionData) {
      const data = projectionData;

      // In simulation mode, filter out historical data and simplify the structure
      if (isSimulation) {
        return data.map(yearRow => ({
          ...yearRow,
          hasHistoricalData: false, // Hide historical indicators in simulation
          months: yearRow.months?.map(month => ({
            ...month,
            isHistorical: false // Hide historical indicators in simulation
          }))
        }));
      }

      return data;
    }

    // Otherwise, generate projection data
    // Criar um plano combinado com dados do micro plano ativo
    const combinedPlan = activeMicroPlan ? {
      ...investmentPlan,
      monthly_deposit: activeMicroPlan.monthly_deposit,
      desired_income: activeMicroPlan.desired_income,
      expected_return: activeMicroPlan.expected_return,
      inflation: activeMicroPlan.inflation
    } : investmentPlan;

    const data = generateProjectionData(
      combinedPlan,
      profile,
      allFinancialRecords,
      goals,
      events,
      chartOptions
    );

    // In simulation mode, filter out historical data and simplify the structure
    if (isSimulation) {
      return data.map(yearRow => ({
        ...yearRow,
        hasHistoricalData: false, // Hide historical indicators in simulation
        months: yearRow.months?.map(month => ({
          ...month,
          isHistorical: false // Hide historical indicators in simulation
        }))
      }));
    }

    return data;
  }, [projectionData, investmentPlan, profile, allFinancialRecords, goals, events, isSimulation, chartOptions]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          onClick={() => downloadCSV(dataToShow, isSimulation ? 'simulation_projection' : 'future_projection')}
          variant="default"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('monthlyView.downloadCSV')}
        </Button>
      </div>
      
      <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b dark:border-gray-800">
              <th className="p-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                {t('monthlyView.futureProjection.age')}
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                {t('monthlyView.futureProjection.year')}
              </th>
              <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                {t('monthlyView.futureProjection.cashFlow')}
              </th>
              {showGoalsEvents && (
                <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                  {t('monthlyView.futureProjection.goalsEventsImpact')}
                </th>
              )}
              {showRealEvolution && (
                <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                  {t('monthlyView.futureProjection.balance')}
                </th>
              )}
              <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                {t('monthlyView.futureProjection.projectedBalance')}
              </th>
              <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                {t('monthlyView.futureProjection.ipcaRate')}
              </th>
              <th className="p-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                {t('monthlyView.futureProjection.effectiveRate')}
              </th>
              <th className="p-3 text-center font-medium text-muted-foreground w-10"></th>
            </tr>
          </thead>
          <tbody>
            {dataToShow.map((projection, index) => (
              <React.Fragment key={`${projection.year}-${index}-group`}>
                <tr 
                  className={`border-b dark:border-gray-800 transition-colors hover:bg-muted/50 dark:hover:bg-gray-800/60 ${
                    !isSimulation && projection.hasHistoricalData ? 'bg-blue-50/50 dark:bg-blue-900/20' : index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-muted/10 dark:bg-gray-800/40'
                  }`}
                >
                  <td className="p-3">
                    {!isSimulation && projection.hasHistoricalData && (
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
                  {showGoalsEvents && (
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
                  )}
                  {showRealEvolution && (
                    <td className="p-3 text-right font-semibold">
                      <span className={projection.balance < 0 ? 'text-red-600' : ''}>
                        {formatCurrency(projection.balance, investmentPlan?.currency as CurrencyCode)}
                      </span>
                    </td>
                  )}
                  <td className="p-3 text-right font-semibold">
                    <span className={projection.planned_balance < 0 ? 'text-red-600' : ''}>
                      {formatCurrency(projection.planned_balance, investmentPlan?.currency as CurrencyCode)}
                    </span>
                    {showRealEvolution && projection.balance !== projection.planned_balance && (
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
                      className={`border-b dark:border-gray-800 text-xs transition-colors hover:bg-muted/50 dark:hover:bg-gray-800/60 ${
                        !isSimulation && month.isHistorical 
                          ? 'bg-blue-50/50 dark:bg-blue-900/20' 
                          : 'bg-muted/20 dark:bg-gray-800/40'
                      }`}
                    >
                      <td className="p-2">
                        {!isSimulation && month.isHistorical && (
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
                      {showGoalsEvents && (
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
                      )}
                      {showRealEvolution && (
                        <td className="p-2 text-right font-semibold">
                          <span className={month.balance < 0 ? 'text-red-600' : ''}>
                            {formatCurrency(month.balance, investmentPlan?.currency as CurrencyCode)}
                          </span>
                        </td>
                      )}
                      <td className="p-2 text-right font-semibold">
                        {formatCurrency(month.planned_balance, investmentPlan?.currency as CurrencyCode)}
                        {showRealEvolution && month.balance !== month.planned_balance && (
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
    </div>
  );
}
