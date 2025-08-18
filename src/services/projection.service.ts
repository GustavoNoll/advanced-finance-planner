import { generateProjectionData, YearlyProjectionData } from '@/lib/chart-projections'
import { processPlanProgressData, PlanProgressData } from '@/lib/plan-progress'
import { FinancialRecord, ProjectedEvent, Goal } from '@/types/financial'
import { Profile, InvestmentPlan } from '@/types/financial'
import { createDateWithoutTimezone } from '@/utils/dateUtils'

export interface ProjectionData {
  projectionData: YearlyProjectionData[]
  planProgressData: PlanProgressData
  retirementBalanceData: {
    nominalDifference: number
    percentageDifference: number
    currentBalance: number
    oldPortfolioBalance: number
  }
}

export interface ChartOptions {
  showRealValues: boolean
  showNegativeValues: boolean
  showOldPortfolio: boolean
  changeMonthlyDeposit?: number
  changeMonthlyWithdraw?: number
}

export class ProjectionService {
  /**
   * Gera dados de projeção com opções avançadas
   */
  static generateProjectionWithOptions(
    investmentPlan: InvestmentPlan,
    clientProfile: Profile,
    allFinancialRecords: FinancialRecord[],
    goals: Goal[],
    events: ProjectedEvent[],
    chartOptions: ChartOptions
  ) {
    if (!investmentPlan || !clientProfile || !allFinancialRecords || !goals || !events) {
      return null
    }

    return generateProjectionData(
      investmentPlan,
      clientProfile,
      allFinancialRecords,
      goals,
      events
    )
  }

  /**
   * Calcula dados de progresso do plano
   */
  static calculatePlanProgress(
    allFinancialRecords: FinancialRecord[],
    investmentPlan: InvestmentPlan,
    clientProfile: Profile,
    goals: Goal[],
    events: ProjectedEvent[],
    projectionData: YearlyProjectionData[]
  ): PlanProgressData {
    if (
      !investmentPlan ||
      !clientProfile ||
      !allFinancialRecords ||
      !goals ||
      !events ||
      !projectionData
    ) {
      return {
        plannedMonths: 0,
        projectedMonths: 0,
        monthsDifference: 0,
        plannedContribution: 0,
        projectedContribution: 0,
        projectedPresentValue: 0,
        plannedPresentValue: 0,
        projectedFuturePresentValue: 0,
        plannedFuturePresentValue: 0,
        projectedMonthlyIncome: 0,
        plannedMonthlyIncome: 0,
        projectedRetirementDate: undefined,
        finalAgeDate: undefined,
        currentProgress: 0,
        plannedAgeYears: 0,
        plannedAgeMonths: 0,
        projectedAgeYears: 0,
        projectedAgeMonths: 0,
        projectedAge: 0,
        isAheadOfSchedule: false
      }
    }

    try {
      // Encontra o mês de aposentadoria e obtém os dados do mês anterior
      const retirementDate = createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date)
      const retirementYear = projectionData.find((year: any) => year.year === retirementDate.getFullYear())
      const retirementMonthIndex = retirementYear?.months?.findIndex((month: any) => month.month === retirementDate.getMonth() + 1)
      let plannedFuturePresentValue = 0
      let projectedFuturePresentValue = 0

      if (retirementYear && retirementMonthIndex !== undefined) {
        // Obtém o mês antes da aposentadoria
        const monthBeforeRetirement = retirementYear.months[retirementMonthIndex]
        plannedFuturePresentValue = monthBeforeRetirement?.planned_balance || 0
        projectedFuturePresentValue = monthBeforeRetirement?.balance || 0
      }

      return processPlanProgressData(
        allFinancialRecords,
        investmentPlan,
        { 
          birth_date: clientProfile.birth_date
        },
        goals,
        events,
        plannedFuturePresentValue,
        projectedFuturePresentValue
      )
    } catch (error) {
      console.error('Error calculating plan progress data:', error)
      return {
        plannedMonths: 0,
        projectedMonths: 0,
        monthsDifference: 0,
        plannedContribution: 0,
        projectedContribution: 0,
        projectedPresentValue: 0,
        plannedPresentValue: 0,
        projectedFuturePresentValue: 0,
        plannedFuturePresentValue: 0,
        projectedMonthlyIncome: 0,
        plannedMonthlyIncome: 0,
        projectedRetirementDate: undefined,
        finalAgeDate: undefined,
        currentProgress: 0,
        plannedAgeYears: 0,
        plannedAgeMonths: 0,
        projectedAgeYears: 0,
        projectedAgeMonths: 0,
        projectedAge: 0,
        isAheadOfSchedule: false
  }
    }
  }

  /**
   * Calcula diferença do saldo de aposentadoria
   */
  static calculateRetirementBalanceDifference(
    projectionData: YearlyProjectionData[],
    investmentPlan: InvestmentPlan
  ) {
    if (!projectionData || !investmentPlan) {
      return {
        nominalDifference: 0,
        percentageDifference: 0,
        currentBalance: 0,
        oldPortfolioBalance: 0
      }
    }

    try {
      // Encontra os dados do ano de aposentadoria
      const retirementDate = createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date)
      const retirementYear = projectionData.find((year: any) => year.year === retirementDate.getFullYear())
      
      if (!retirementYear) {
        return {
          nominalDifference: 0,
          percentageDifference: 0,
          currentBalance: 0,
          oldPortfolioBalance: 0
        }
      }

      // Obtém o mês antes da aposentadoria (último mês de acumulação)
      const retirementMonthIndex = retirementYear.months?.findIndex((month: any) => month.month === retirementDate.getMonth() + 1)
      const monthBeforeRetirement = retirementYear.months?.[retirementMonthIndex !== undefined && retirementMonthIndex > 0 ? retirementMonthIndex - 1 : 0]

      if (!monthBeforeRetirement) {
        return {
          nominalDifference: 0,
          percentageDifference: 0,
          currentBalance: 0,
          oldPortfolioBalance: 0
        }
      }

      const currentBalance = monthBeforeRetirement.balance
      const oldPortfolioBalance = monthBeforeRetirement.old_portfolio_balance || 0

      // Calcula diferença nominal (portfólio atual vs antigo)
      const nominalDifference = currentBalance - oldPortfolioBalance

      // Calcula diferença percentual
      const percentageDifference = oldPortfolioBalance > 0 
        ? ((currentBalance - oldPortfolioBalance) / oldPortfolioBalance) * 100 
        : 0

      return {
        nominalDifference,
        percentageDifference,
        currentBalance,
        oldPortfolioBalance
      }
    } catch (error) {
      console.error('Error calculating retirement balance difference:', error)
      return {
        nominalDifference: 0,
        percentageDifference: 0,
        currentBalance: 0,
        oldPortfolioBalance: 0
      }
    }
  }

  /**
   * Calcula todas as métricas de projeção
   */
  static calculateAllProjectionMetrics(
    investmentPlan: InvestmentPlan,
    clientProfile: Profile,
    allFinancialRecords: FinancialRecord[],
    goals: Goal[],
    events: ProjectedEvent[],
    chartOptions: ChartOptions
  ): ProjectionData | null {
    if (!investmentPlan || !clientProfile || !allFinancialRecords || !goals || !events) {
      return null
    }

    try {
      // Gera dados de projeção
      const projectionData = this.generateProjectionWithOptions(
        investmentPlan,
        clientProfile,
        allFinancialRecords,
        goals,
        events,
        chartOptions
      )

      if (!projectionData) {
        return null
      }

      // Calcula progresso do plano
      const planProgressData = this.calculatePlanProgress(
        allFinancialRecords,
        investmentPlan,
        clientProfile,
        goals,
        events,
        projectionData
      )

      // Calcula diferença do saldo de aposentadoria
      const retirementBalanceData = this.calculateRetirementBalanceDifference(
        projectionData,
        investmentPlan
      )

      return {
        projectionData,
        planProgressData,
        retirementBalanceData
      }
    } catch (error) {
      console.error('Error calculating projection metrics:', error)
      return null
    }
  }
}
