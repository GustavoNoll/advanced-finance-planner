import { useState, useMemo } from 'react';
import { generateProjectionData, ChartOptions } from '@/lib/chart-projections';
import { InvestmentPlan, MicroInvestmentPlan, Profile, FinancialRecord, Goal, ProjectedEvent } from '@/types/financial';

interface UseChartOptionsProps {
  investmentPlan: InvestmentPlan;
  activeMicroPlan: MicroInvestmentPlan | null;
  clientProfile: Profile;
  allFinancialRecords: FinancialRecord[];
  goals?: Goal[];
  events?: ProjectedEvent[];
}

export const useChartOptions = ({
  investmentPlan,
  activeMicroPlan,
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
      changeMonthlyWithdraw: {
        value: changeMonthlyWithdraw.value,
        date: changeMonthlyWithdraw.date
      }
    })
  }), [changeMonthlyDeposit, changeMonthlyWithdraw]);

  // Generate projection data with chart options
  const projectionDataWithOptions = useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords) return null;

    // Criar um plano combinado com dados do micro plano ativo
    const combinedPlan = activeMicroPlan ? {
      ...investmentPlan,
      monthly_deposit: activeMicroPlan.monthly_deposit,
      desired_income: activeMicroPlan.desired_income,
      expected_return: activeMicroPlan.expected_return,
      inflation: activeMicroPlan.inflation
    } : investmentPlan;

    return generateProjectionData(
      combinedPlan,
      clientProfile,
      allFinancialRecords,
      goals,
      events,
      chartOptions
    );
  }, [investmentPlan, activeMicroPlan, clientProfile, allFinancialRecords, goals, events, chartOptions]);

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