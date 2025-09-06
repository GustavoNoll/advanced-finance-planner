import { useState, useMemo } from 'react';
import { generateProjectionData, ChartOptions } from '@/lib/chart-projections';
import { InvestmentPlan, MicroInvestmentPlan, Profile, FinancialRecord, Goal, ProjectedEvent } from '@/types/financial';

interface UseChartOptionsProps {
  investmentPlan: InvestmentPlan;
  activeMicroPlan: MicroInvestmentPlan | null;
  microPlans: MicroInvestmentPlan[];
  clientProfile: Profile;
  allFinancialRecords: FinancialRecord[];
  goals?: Goal[];
  events?: ProjectedEvent[];
}

export const useChartOptions = ({
  investmentPlan,
  activeMicroPlan,
  microPlans,
  clientProfile,
  allFinancialRecords,
  goals,
  events
}: UseChartOptionsProps) => {
  // Chart options states
  const [changeMonthlyDeposit, setChangeMonthlyDeposit] = useState({
    enabled: false,
    value: activeMicroPlan?.monthly_deposit || 0,
    date: ''
  });
  
  const [changeMonthlyWithdraw, setChangeMonthlyWithdraw] = useState({
    enabled: false,
    value: activeMicroPlan?.desired_income || 0,
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
      changeMonthlyWithdraw: {
        value: changeMonthlyWithdraw.value,
        date: changeMonthlyWithdraw.date
      }
    })
  }), [changeMonthlyDeposit, changeMonthlyWithdraw]);

  // Generate projection data with chart options
  const projectionDataWithOptions = useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords) return null;

    return generateProjectionData(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      microPlans,
      goals,
      events,
      chartOptions
    );
  }, [investmentPlan, microPlans, clientProfile, allFinancialRecords, goals, events, chartOptions]);

  return {
    // States
    changeMonthlyDeposit,
    setChangeMonthlyDeposit,
    changeMonthlyWithdraw,
    setChangeMonthlyWithdraw,
    
    // Computed values
    chartOptions,
    projectionDataWithOptions
  };
}; 