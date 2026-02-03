import { useMemo } from 'react'
import { ProjectionService, ProjectionData } from '@/features/investment-plans/services/projection.service'
import { Profile, InvestmentPlan, MicroInvestmentPlan, ProjectedEvent, Goal } from '@/types/financial'
import { FinancialRecord } from '@/types/financial'
import { ChartOptions, generateProjectionData } from '@/lib/chart-projections'

export function useProjectionData(
  investmentPlan: InvestmentPlan | null,
  activeMicroPlan: MicroInvestmentPlan | null,
  microPlans: MicroInvestmentPlan[],
  clientProfile: Profile | null,
  allFinancialRecords: FinancialRecord[],
  goals: Goal[],
  events: ProjectedEvent[],
  chartOptions: ChartOptions
) {
  // Dados de projeção originais (sem opções avançadas)
  const originalProjectionData = useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords || !goals || !events || !activeMicroPlan || microPlans.length === 0) return null

    return generateProjectionData(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      microPlans,
      goals,
      events,
      {}
    )
  }, [investmentPlan, microPlans, clientProfile, allFinancialRecords, goals, events, chartOptions])

  // Dados de projeção com opções avançadas
  const projectionDataWithOptions = useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords || !goals || !events) return null

    return ProjectionService.generateProjectionWithOptions(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      microPlans,
      goals,
      events,
      chartOptions
    )
  }, [investmentPlan, microPlans, clientProfile, allFinancialRecords, goals, events, chartOptions])

  // Dados de progresso do plano
  const planProgressData = useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords || !goals || !events || !originalProjectionData) {
      return {
        plannedMonths: 0,
        projectedMonths: 0,
        monthsDifference: 0,
        plannedContribution: 0,
        projectedContribution: 0,
      }
    }

    return ProjectionService.calculatePlanProgress(
      allFinancialRecords,
      investmentPlan,
      activeMicroPlan,
      microPlans,
      clientProfile,
      goals,
      events,
      originalProjectionData
    )
  }, [
    investmentPlan,
    activeMicroPlan,
    microPlans,
    clientProfile,
    allFinancialRecords,
    goals,
    events,
    originalProjectionData
  ])

  // Dados de diferença do saldo de aposentadoria
  const retirementBalanceData = useMemo(() => {
    if (!originalProjectionData || !investmentPlan) {
      return {
        nominalDifference: 0,
        percentageDifference: 0,
        currentBalance: 0,
        oldPortfolioBalance: 0
      }
    }

    return ProjectionService.calculateRetirementBalanceDifference(
      projectionDataWithOptions,
      investmentPlan
    )
  }, [originalProjectionData, investmentPlan])

  // Verifica se há opções de gráfico ativas
  const hasActiveChartOptions = useMemo(() => {
    return chartOptions.showRealValues || 
           chartOptions.showNegativeValues || 
           chartOptions.showOldPortfolio ||
           chartOptions.changeMonthlyDeposit !== undefined ||
           chartOptions.changeMonthlyWithdraw !== undefined
  }, [chartOptions])

  // Dados finais de projeção (com ou sem opções)
  const finalProjectionData = hasActiveChartOptions 
    ? projectionDataWithOptions 
    : originalProjectionData

  return {
    originalProjectionData,
    projectionDataWithOptions,
    finalProjectionData,
    planProgressData,
    retirementBalanceData,
    hasActiveChartOptions
  }
}

