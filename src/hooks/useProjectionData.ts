import { useMemo } from 'react'
import { ProjectionService, ProjectionData } from '@/services/projection.service'
import { Profile, InvestmentPlan, ProjectedEvent, Goal } from '@/types/financial'
import { FinancialRecord } from '@/types/financial'
import { ChartOptions, generateProjectionData } from '@/lib/chart-projections'

export function useProjectionData(
  investmentPlan: InvestmentPlan | null,
  clientProfile: Profile | null,
  allFinancialRecords: FinancialRecord[],
  goals: Goal[],
  events: ProjectedEvent[],
  chartOptions: ChartOptions
) {
  // Dados de projeção originais (sem opções avançadas)
  const originalProjectionData = useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords || !goals || !events) return null

    return generateProjectionData(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      goals,
      events,
      chartOptions
    )
  }, [investmentPlan, clientProfile, allFinancialRecords, goals, events, chartOptions])

  // Dados de projeção com opções avançadas
  const projectionDataWithOptions = useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords || !goals || !events) return null

    return ProjectionService.generateProjectionWithOptions(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      goals,
      events,
      chartOptions
    )
  }, [investmentPlan, clientProfile, allFinancialRecords, goals, events, chartOptions])

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
      clientProfile,
      goals,
      events,
      originalProjectionData
    )
  }, [
    investmentPlan,
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
      originalProjectionData,
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

export function useAllProjectionMetrics(
  investmentPlan: InvestmentPlan | null,
  clientProfile: Profile | null,
  allFinancialRecords: FinancialRecord[],
  goals: Goal[],
  events: ProjectedEvent[],
  chartOptions: ChartOptions
): ProjectionData | null {
  return useMemo(() => {
    if (!investmentPlan || !clientProfile || !allFinancialRecords || !goals || !events) {
      return null
    }

    return ProjectionService.calculateAllProjectionMetrics(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      goals,
      events,
      chartOptions
    )
  }, [investmentPlan, clientProfile, allFinancialRecords, goals, events, chartOptions])
}
