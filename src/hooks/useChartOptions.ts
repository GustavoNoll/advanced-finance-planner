import { useState, useMemo } from 'react';
import { generateProjectionData, ChartOptions } from '@/lib/chart-projections';
import { InvestmentPlan, Profile, FinancialRecord, Goal, ProjectedEvent } from '@/types/financial';

interface UseChartOptionsProps {
  investmentPlan: InvestmentPlan;
  clientProfile: Profile;
  allFinancialRecords: FinancialRecord[];
  goals?: Goal[];
  events?: ProjectedEvent[];
}

export const useChartOptions = ({
  investmentPlan,
  clientProfile,
  allFinancialRecords,
  goals,
  events
}: UseChartOptionsProps) => {
  // Chart options states
  const [changeMonthlyDeposit, setChangeMonthlyDeposit] = useState({
    enabled: false,
    value: investmentPlan.monthly_deposit,
    date: ''
  });
  
  const [changeMonthlyWithdraw, setChangeMonthlyWithdraw] = useState({
    enabled: false,
    value: investmentPlan.desired_income,
    date: ''
  });

  // Prepare chart options
  const chartOptions: ChartOptions = useMemo(() => ({
    ...(changeMonthlyDeposit.enabled && changeMonthlyDeposit.date && {
      changeMonthlyDeposit: {
        value: changeMonthlyDeposit.value,
        date: changeMonthlyDeposit.date
      }
    }),
    ...(changeMonthlyWithdraw.enabled && changeMonthlyWithdraw.date && {
      changeMontlhyWithdraw: {
        value: changeMonthlyWithdraw.value,
        date: changeMonthlyWithdraw.date
      }
    })
  }), [changeMonthlyDeposit, changeMonthlyWithdraw]);

  // Check if there are active chart options
  const hasActiveChartOptions = useMemo(() => 
    chartOptions.changeMonthlyDeposit || chartOptions.changeMontlhyWithdraw
  , [chartOptions]);

  // Generate projection data with chart options
  const projectionDataWithOptions = useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords) return null;

    return generateProjectionData(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      goals,
      events,
      hasActiveChartOptions ? chartOptions : undefined
    );
  }, [investmentPlan, clientProfile, allFinancialRecords, goals, events, chartOptions, hasActiveChartOptions]);

  return {
    // States
    changeMonthlyDeposit,
    setChangeMonthlyDeposit,
    changeMonthlyWithdraw,
    setChangeMonthlyWithdraw,
    
    // Computed values
    chartOptions,
    hasActiveChartOptions,
    projectionDataWithOptions
  };
}; 