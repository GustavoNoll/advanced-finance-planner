import { supabase } from '@/lib/supabase'
import { FinancialRecord } from '@/types/financial'

export interface ProcessedFinancialRecords {
  financialRecords: FinancialRecord[]
  financialRecordsByYear: FinancialRecord[]
  latestRecord: FinancialRecord | null
  currentMonthRecord: FinancialRecord | null
}

export interface FinancialRecordsFilters {
  period?: 'all' | '6m' | '12m' | '24m'
  includeInitialAmount?: boolean
}

export class FinancialRecordsService {
  /**
   * Busca todos os registros financeiros de um usuário
   */
  static async fetchAllRecords(userId: string): Promise<FinancialRecord[]> {
    if (!userId) return []

    const { data, error } = await supabase
      .from('user_financial_records')
      .select('*')
      .eq('user_id', userId)
      .order('record_year', { ascending: false })
      .order('record_month', { ascending: false })

    if (error) {
      console.error('Error fetching financial records:', error)
      throw new Error('Failed to fetch financial records')
    }

    return data || []
  }

  /**
   * Processa os registros financeiros para extrair informações úteis
   */
  static processRecords(records: FinancialRecord[]): ProcessedFinancialRecords {
    if (!records?.length) {
      return {
        financialRecords: [],
        financialRecordsByYear: [],
        latestRecord: null,
        currentMonthRecord: null
      }
    }

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    
    // Cria uma cópia dos registros
    const financialRecords = [...records]

    // Agrupa registros por ano
    const financialRecordsByYear = Object.values(
      [...records].reduce((acc: Record<string, FinancialRecord>, record: FinancialRecord) => {
        acc[record.record_year] = record
        return acc
      }, {})
    )

    // Obtém o registro mais recente e do mês atual
    const latestRecord = financialRecords[0]
    const currentMonthRecord = financialRecords.find(
      record => record.record_month === currentMonth && record.record_year === currentYear
    )

    return {
      financialRecords,
      financialRecordsByYear,
      latestRecord,
      currentMonthRecord
    }
  }

  /**
   * Filtra registros por período
   */
  static filterRecordsByPeriod(records: FinancialRecord[], period: 'all' | '6m' | '12m' | '24m'): FinancialRecord[] {
    if (period === 'all') return records

    const currentDate = new Date()
    const months = parseInt(period)
    const cutoffDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - months,
      1
    )

    return records.filter(record => {
      const recordDate = new Date(record.record_year, record.record_month - 1, 1)
      return recordDate >= cutoffDate
    })
  }

  /**
   * Calcula retornos totais para um período
   */
  static calculateTotalReturns(records: FinancialRecord[], period: 'all' | '6m' | '12m' | '24m' = 'all') {
    if (!records?.length) return { totalAmount: 0, percentageReturn: 0 }

    const filteredRecords = this.filterRecordsByPeriod(records, period)
    
    let totalReturn = 0
    let accumulatedReturn = 1

    for (const record of filteredRecords) {
      totalReturn += record.monthly_return
      accumulatedReturn *= (1 + record.monthly_return_rate / 100)
    }

    accumulatedReturn = accumulatedReturn - 1

    return {
      totalAmount: totalReturn,
      percentageReturn: (accumulatedReturn * 100).toFixed(2)
    }
  }

  /**
   * Calcula contribuições mensais para um período
   */
  static calculateMonthlyContributions(
    records: FinancialRecord[], 
    period: 'all' | '6m' | '12m' | '24m' = 'all',
    initialAmount: number = 0
  ): number {
    if (!records?.length) return 0

    const filteredRecords = this.filterRecordsByPeriod(records, period)
    const oldestRecord = this.getOldestRecord(records)
    let includesOldestRecord = true

    if (period !== 'all') {
      includesOldestRecord = filteredRecords.some(record => 
        record.record_year === oldestRecord?.record_year && 
        record.record_month === oldestRecord?.record_month
      )
    }

    const totalContribution = filteredRecords.reduce((sum, record) => 
      sum + (record.monthly_contribution || 0), 0)
    
    return totalContribution + (includesOldestRecord ? initialAmount : 0)
  }

  /**
   * Obtém o registro mais antigo
   */
  static getOldestRecord(records: FinancialRecord[]): FinancialRecord | null {
    if (!records?.length) return null
    
    return [...records].sort((a, b) => {
      return (a.record_year * 12 + a.record_month) - (b.record_year * 12 + b.record_month)
    })[0]
  }

  /**
   * Calcula métricas de destaque para o dashboard
   */
  static calculateHighlights(
    records: FinancialRecord[], 
    investmentPlan: any, 
    t: (key: string, params?: any) => string
  ) {
    if (!investmentPlan) return []
    if (!records?.length) return [
      {
        message: t('dashboard.highlights.startToInvest'),
        value: 0,
        icon: 'Target'
      },
    ]

    const processedRecords = this.processRecords(records)
    const latest = processedRecords.latestRecord
    const highlights: { message: string; value: number; icon: string }[] = []

    // Cálculo da sequência de aportes consistentes
    let streak = 0
    for (const record of records) {
      if (record.monthly_contribution >= (investmentPlan.required_monthly_deposit || 0)) {
        streak++
      } else break
    }
    if (streak > 1) {
      highlights.push({
        message: t('dashboard.highlights.contributionStreak', { months: streak }),
        value: streak,
        icon: 'Target'
      })
    }

    // Melhor mês de rentabilidade
    const bestReturn = Math.max(...records.map(record => record.monthly_return_rate))
    highlights.push({
      message: t('dashboard.highlights.bestReturn', { return: bestReturn.toFixed(2) }),
      value: bestReturn,
      icon: 'Trophy'
    })

    // Tempo do plano
    const planMonths = records.length
    highlights.push({
      message: t('dashboard.highlights.planAge', { months: planMonths }),
      value: planMonths,
      icon: 'Calendar'
    })

    // Meta de renda mensal alcançada
    const currentMonthlyIncome = (latest?.ending_balance || 0) * (investmentPlan.expected_return / 100) / 12
    const incomeProgress = (currentMonthlyIncome / investmentPlan.desired_income) * 100
    highlights.push({
      message: t('dashboard.highlights.incomeProgress', { percentage: incomeProgress.toFixed(1) }),
      value: incomeProgress,
      icon: 'TrendingUp'
    })

    // Consistência de retornos positivos
    const positiveReturns = records.filter(record => record.monthly_return_rate > 0).length
    const consistencyRate = (positiveReturns / planMonths) * 100
    highlights.push({
      message: t('dashboard.highlights.returnConsistency', { percentage: consistencyRate.toFixed(1) }),
      value: consistencyRate,
      icon: 'LineChart'
    })

    // Frequência de registros
    const monthsWithRecords = records.length
    const monthsWithContributions = records.filter(record => record.monthly_contribution > 0).length
    const contributionDiscipline = (monthsWithContributions / monthsWithRecords) * 100
    highlights.push({
      message: t('dashboard.highlights.contributionDiscipline', { percentage: contributionDiscipline.toFixed(1) }),
      value: contributionDiscipline,
      icon: 'PiggyBank'
    })

    // Evolução do patrimônio
    const initialBalance = records[records.length - 1]?.starting_balance || 0
    const patrimonyGrowth = ((latest?.ending_balance || 0) - initialBalance) / initialBalance * 100
    highlights.push({
      message: t('dashboard.highlights.patrimonyGrowth', { growth: patrimonyGrowth.toFixed(1) }),
      value: patrimonyGrowth,
      icon: 'TrendingUp'
    })

    // Retorna os 3 highlights com maiores valores
    return highlights.sort(() => Math.random() - 0.5).slice(0, 3)
  }
}
