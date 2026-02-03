import { generateProjectionData, MonthlyProjectionData, YearlyProjectionData } from '@/lib/chart-projections'
import { processPlanProgressData, PlanProgressData } from '@/lib/plan-progress-calculator'
import { FinancialRecord, ProjectedEvent, Goal, MicroInvestmentPlan } from '@/types/financial'
import { Profile, InvestmentPlan } from '@/types/financial'
import { createDateWithoutTimezone } from '@/utils/dateUtils'
import { ChartOptions } from '@/lib/chart-projections'
// Interface local para dados mensais de projeção


export interface ProjectionData {
  projectionData: YearlyProjectionData[] | null
  planProgressData: PlanProgressData
  retirementBalanceData: {
    nominalDifference: number
    percentageDifference: number
    currentBalance: number
    oldPortfolioBalance: number
  }
}

export interface HistoricalDataInfo {
  lastHistoricalYear: YearlyProjectionData | null
  lastHistoricalMonth: MonthlyProjectionData | null
  nextMonthAfterHistorical: MonthlyProjectionData | null
}

export interface RetirementDataInfo {
  retirementYear: YearlyProjectionData | null
  retirementMonth: MonthlyProjectionData | null
}

export class ProjectionService {
  /**
   * Encontra o último ano e mês com dados históricos
   * 
   * @param projectionData - Array de dados de projeção anual
   * @returns Objeto com informações sobre o último ano histórico, último mês histórico e último mês de projeção
   * 
   * @example
   * ```typescript
   * const historicalInfo = ProjectionService.findLastHistoricalData(projectionData)
   * console.log('Último ano histórico:', historicalInfo.lastHistoricalYear?.year)
   * console.log('Último mês histórico:', historicalInfo.lastHistoricalMonth?.month)
   * ```
   */
  static findLastHistoricalData(projectionData: YearlyProjectionData[]): HistoricalDataInfo {
    if (!projectionData || projectionData.length === 0) {
      return {
        lastHistoricalYear: null,
        lastHistoricalMonth: null,
        nextMonthAfterHistorical: null
      }
    }

    // Encontra o último ano com dados históricos
    const lastHistoricalYear = projectionData
      .slice()
      .reverse()
      .find((year: YearlyProjectionData) => year.hasHistoricalData)
    
    if (!lastHistoricalYear || !lastHistoricalYear.months) {
      return {
        lastHistoricalYear: null,
        lastHistoricalMonth: null,
        nextMonthAfterHistorical: null
      }
    }

    // Encontra o último mês com dados históricos dentro do ano
    const lastHistoricalMonth = lastHistoricalYear.months
      .slice()
      .reverse()
      .find((month: MonthlyProjectionData) => month.isHistorical)
    
    if (!lastHistoricalMonth) {
      return {
        lastHistoricalYear,
        lastHistoricalMonth: null,
        nextMonthAfterHistorical: null
      }
    }

    // Encontra o próximo mês após o último histórico
    let nextMonthAfterHistorical: MonthlyProjectionData | null = null
    
    // Primeiro, tenta encontrar no mesmo ano
    const currentYearIndex = projectionData.findIndex(year => year.year === lastHistoricalYear.year)
    const currentMonthIndex = lastHistoricalYear.months.findIndex(month => 
      month.month === lastHistoricalMonth.month && month.year === lastHistoricalMonth.year
    )
    
    if (currentMonthIndex < lastHistoricalYear.months.length - 1) {
      // Próximo mês está no mesmo ano
      nextMonthAfterHistorical = lastHistoricalYear.months[currentMonthIndex + 1]
    } else if (currentYearIndex < projectionData.length - 1) {
      // Próximo mês está no próximo ano
      const nextYear = projectionData[currentYearIndex + 1]
      if (nextYear.months && nextYear.months.length > 0) {
        nextMonthAfterHistorical = nextYear.months[0]
      }
    }
    
    return {
      lastHistoricalYear,
      lastHistoricalMonth,
      nextMonthAfterHistorical
    }
  } 

  static findFirstRetirementMonth(projectionData: YearlyProjectionData[] | null | undefined): RetirementDataInfo | null {
    // Verificar se projectionData é válido
    if (!projectionData || !Array.isArray(projectionData) || projectionData.length === 0) {
      return {
        retirementYear: null,
        retirementMonth: null
      }
    }

    // Encontra primeiro mês de aposentadoria
    const retirementYear = projectionData.find((year: YearlyProjectionData) => year.isRetirementTransitionYear)
    const retirementMonth = retirementYear?.months?.find((month: MonthlyProjectionData) => month.retirement)

    return {
      retirementYear,
      retirementMonth
    }
  }

  /**
   * Exemplo de uso: Obtém informações sobre dados históricos e último mês de projeção
   */
  static getProjectionSummary(projectionData: YearlyProjectionData[] | null | undefined): {
    historicalInfo: HistoricalDataInfo
    summary: string
  } {
    const historicalInfo = this.findLastHistoricalData(projectionData)
    
    let summary = 'Nenhum dado de projeção encontrado'
    
    if (historicalInfo.lastHistoricalYear) {
      summary = `Último ano com dados históricos: ${historicalInfo.lastHistoricalYear.year}`
      
      if (historicalInfo.lastHistoricalMonth) {
        summary += `, último mês histórico: ${historicalInfo.lastHistoricalMonth.month}/${historicalInfo.lastHistoricalMonth.year}`
      }
      
    }
    
    return {
      historicalInfo,
      summary
    }
  }

  /**
   * Gera dados de projeção com opções avançadas
   */
  static generateProjectionWithOptions(
    investmentPlan: InvestmentPlan,
    clientProfile: Profile,
    allFinancialRecords: FinancialRecord[],
    microPlans: MicroInvestmentPlan[],
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
      microPlans,
      goals,
      events,
      chartOptions
    )
  }

  /**
   * Calcula dados de progresso do plano
   */
  static calculatePlanProgress(
    allFinancialRecords: FinancialRecord[],
    investmentPlan: InvestmentPlan,
    activeMicroPlan: MicroInvestmentPlan | null,
    microPlans: MicroInvestmentPlan[],
    clientProfile: Profile,
    goals: Goal[],
    events: ProjectedEvent[],
    projectionData: YearlyProjectionData[] | null | undefined
  ): PlanProgressData {
    // Verificar se projectionData é válido
    if (!projectionData || !Array.isArray(projectionData) || projectionData.length === 0) {
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
      const retirementYear = projectionData.find((year: YearlyProjectionData) => year.year === retirementDate.getFullYear())
      const retirementMonthIndex = retirementYear?.months?.findIndex((month: MonthlyProjectionData) => month.month === retirementDate.getMonth() + 1)
      
      // Obtém informações sobre dados históricos
      const lastHistoricalDataInfo = this.findLastHistoricalData(projectionData)
      
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
        microPlans,
        activeMicroPlan,
        { 
          birth_date: clientProfile.birth_date
        },
        goals,
        events,
        plannedFuturePresentValue,
        projectedFuturePresentValue,
        lastHistoricalDataInfo
      )
    } catch (error) {
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
    projectionData: YearlyProjectionData[] | null | undefined,
    investmentPlan: InvestmentPlan
  ) {
    // Verificar se projectionData é válido
    if (!projectionData || !Array.isArray(projectionData) || projectionData.length === 0 || !investmentPlan) {
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
      const retirementYear = projectionData.find((year: YearlyProjectionData) => year.year === retirementDate.getFullYear())
      
      if (!retirementYear) {
        return {
          nominalDifference: 0,
          percentageDifference: 0,
          currentBalance: 0,
          oldPortfolioBalance: 0
        }
      }

      // Obtém o mês antes da aposentadoria (último mês de acumulação)
      const retirementMonthIndex = retirementYear.months?.findIndex((month: MonthlyProjectionData) => month.month === retirementDate.getMonth() + 1)
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
      return {
        nominalDifference: 0,
        percentageDifference: 0,
        currentBalance: 0,
        oldPortfolioBalance: 0
      }
    }
  }
}
