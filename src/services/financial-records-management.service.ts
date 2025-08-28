import { supabase } from '@/lib/supabase'
import { FinancialRecord, InvestmentPlan } from '@/types/financial'
import { CurrencyCode } from '@/utils/currency'
import { fetchIPCARates, fetchUSCPIRates, fetchEuroCPIRates } from '@/lib/bcb-api'
import { createDateWithoutTimezone } from '@/utils/dateUtils'
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from '@/lib/financial-math'

export interface CSVRecord {
  Data: string
  PatrimonioInicial: string
  Aporte: string
  PatrimonioFinal: string
  Retorno: string
  RetornoPercentual: string
  RentabilidadeMeta: string
  Eventos: string // Pode ser número (positivo ou negativo) ou vazio
}

export interface CSVRecordValidation {
  record_year: number
  record_month: number
  starting_balance: number
  ending_balance: number
  monthly_contribution: number
  monthly_return: number
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

export interface ImportResult {
  success: number
  failed: number
  errors: Array<{ date: string; reason: string }>
}

export interface SyncResult {
  count: number
  updates: Array<{ id: string; target_rentability: number }>
}

export class FinancialRecordsManagementService {
  /**
   * Busca todos os registros financeiros de um usuário
   */
  static async fetchRecordsByUserId(userId: string): Promise<FinancialRecord[]> {
    if (!userId) return []

    try {
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
    } catch (error) {
      console.error('Error in fetchRecordsByUserId:', error)
      return []
    }
  }

  /**
   * Busca o plano de investimento de um usuário
   */
  static async fetchInvestmentPlanByUserId(userId: string): Promise<InvestmentPlan | null> {
    if (!userId) return null

    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('monthly_deposit, expected_return, currency, plan_initial_date, initial_amount, inflation')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching investment plan:', error)
        return null
      }

      return data as InvestmentPlan
    } catch (error) {
      console.error('Error in fetchInvestmentPlanByUserId:', error)
      return null
    }
  }

  /**
   * Cria um novo registro financeiro
   */
  static async createRecord(recordData: Partial<FinancialRecord>): Promise<FinancialRecord> {
    try {
      const { data, error } = await supabase
        .from('user_financial_records')
        .insert([recordData])
        .select()
        .single()

      if (error) {
        console.error('Error creating financial record:', error)
        throw new Error('Failed to create financial record')
      }

      return data
    } catch (error) {
      console.error('Error in createRecord:', error)
      throw error
    }
  }

  /**
   * Atualiza um registro financeiro existente
   */
  static async updateRecord(recordId: string, recordData: Partial<FinancialRecord>): Promise<FinancialRecord> {
    if (!recordId) throw new Error('Record ID is required')

    try {
      const { data, error } = await supabase
        .from('user_financial_records')
        .update(recordData)
        .eq('id', recordId)
        .select()
        .single()

      if (error) {
        console.error('Error updating financial record:', error)
        throw new Error('Failed to update financial record')
      }

      return data
    } catch (error) {
      console.error('Error in updateRecord:', error)
      throw error
    }
  }

  /**
   * Remove um registro financeiro
   */
  static async deleteRecord(recordId: string): Promise<void> {
    if (!recordId) throw new Error('Record ID is required')

    try {
      const { error } = await supabase
        .from('user_financial_records')
        .delete()
        .eq('id', recordId)

      if (error) {
        console.error('Error deleting financial record:', error)
        throw new Error('Failed to delete financial record')
      }
    } catch (error) {
      console.error('Error in deleteRecord:', error)
      throw error
    }
  }

  /**
   * Remove todos os registros de um usuário
   */
  static async deleteAllRecordsByUserId(userId: string): Promise<void> {
    if (!userId) throw new Error('User ID is required')

    try {
      const { error } = await supabase
        .from('user_financial_records')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting all financial records:', error)
        throw new Error('Failed to delete all financial records')
      }
    } catch (error) {
      console.error('Error in deleteAllRecordsByUserId:', error)
      throw error
    }
  }

  /**
   * Importa registros de um CSV
   */
  static async importRecords(
    records: CSVRecord[],
    userId: string,
    investmentPlan: InvestmentPlan | null
  ): Promise<ImportResult> {
    if (!userId) throw new Error('User ID is required')

    try {
      const result: ImportResult = { success: 0, failed: 0, errors: [] }

      // Buscar registros existentes para verificar duplicatas
      const { data: existingRecords } = await supabase
        .from('user_financial_records')
        .select('record_year, record_month')
        .eq('user_id', userId)

      const existingDates = new Set(
        existingRecords?.map(r => `${r.record_year}-${r.record_month}`) || []
      )

      const validateRecord = (record: CSVRecordValidation): ValidationResult => {
        if (!record.record_year || !record.record_month) {
          return { valid: false, error: 'Data inválida' }
        }

        if (existingDates.has(`${record.record_year}-${record.record_month}`)) {
          return { valid: false, error: 'Já existe um registro para este mês' }
        }

        if (isNaN(record.starting_balance) || record.starting_balance < 0) {
          return { valid: false, error: 'Patrimônio inicial inválido' }
        }

        if (isNaN(record.ending_balance) || record.ending_balance < 0) {
          return { valid: false, error: 'Patrimônio final inválido' }
        }

        if (isNaN(record.monthly_contribution)) {
          return { valid: false, error: 'Aporte mensal inválido' }
        }

        if (isNaN(record.monthly_return)) {
          return { valid: false, error: 'Rendimento mensal inválido' }
        }

        return { valid: true }
      }

      const parseCurrencyValue = (value: string, currency: CurrencyCode) => {
        if (!value) return 0

        // Remove currency symbol and spaces
        const cleanValue = value.replace(/[^\d,-]/g, '')

        // Check if the value is negative
        const isNegative = cleanValue.startsWith('-') || cleanValue.includes(' -')

        // Replace comma with dot for decimal point
        const normalizedValue = cleanValue.replace(',', '.')

        // Parse the number and apply negative sign if needed
        const parsedValue = parseFloat(normalizedValue)
        return isNegative ? -Math.abs(parsedValue) : parsedValue
      }

      const formattedRecords = records.map(record => {
        try {
          const [_, month, year] = record.Data.split('/')
          const formattedRecord = {
            user_id: userId,
            record_year: parseInt(year),
            record_month: parseInt(month),
            starting_balance: parseCurrencyValue(record.PatrimonioInicial, investmentPlan?.currency as CurrencyCode),
            monthly_contribution: parseCurrencyValue(record.Aporte, investmentPlan?.currency as CurrencyCode),
            ending_balance: parseCurrencyValue(record.PatrimonioFinal, investmentPlan?.currency as CurrencyCode),
            monthly_return_rate: parseFloat(record.RetornoPercentual.replace('%', '').replace(/\./g, '').replace(',', '.')),
            target_rentability: parseFloat(record.RentabilidadeMeta.replace('%', '').replace(/\./g, '').replace(',', '.')),
            growth_percentage: null,
            monthly_return: parseCurrencyValue(record.Retorno, investmentPlan?.currency as CurrencyCode),
    
          }
          formattedRecord.growth_percentage = ((formattedRecord.ending_balance - formattedRecord.starting_balance) / formattedRecord.starting_balance) * 100

          const validation = validateRecord(formattedRecord)

          return {
            record: formattedRecord,
            isValid: validation.valid,
            error: validation.error,
            originalDate: record.Data
          }
        } catch (error) {
          return {
            record: null,
            isValid: false,
            error: 'Erro ao processar registro',
            originalDate: record.Data
          }
        }
      })

      const validRecords = formattedRecords
        .filter(r => r.isValid)
        .map(r => r.record)

      formattedRecords
        .filter(r => !r.isValid)
        .forEach(r => {
          result.failed++
          result.errors.push({
            date: r.originalDate,
            reason: r.error || 'Erro desconhecido'
          })
        })

      if (validRecords.length > 0) {
        const { data: insertedRecords, error } = await supabase
          .from('user_financial_records')
          .insert(validRecords)
          .select()

        if (error) {
          throw error
        }

        result.success = validRecords.length

        // Processar eventos do CSV e criar links
        await this.processCSVEvents(insertedRecords, records, userId)
      }

      return result
    } catch (error) {
      console.error('Error in importRecords:', error)
      throw error
    }
  }

  /**
   * Sincroniza taxas de inflação com os registros
   */
  static async syncInflationRates(
    records: FinancialRecord[],
    investmentPlan: InvestmentPlan | null
  ): Promise<SyncResult> {
    if (!records?.length || !investmentPlan) {
      return { count: 0, updates: [] }
    }

    try {
      // Encontrar a data do registro mais antigo
      const sortedRecords = [...records].sort((a, b) => {
        if (a.record_year !== b.record_year) {
          return a.record_year - b.record_year
        }
        return a.record_month - b.record_month
      })

      const oldestRecord = sortedRecords[0]
      const startDate = `01/${oldestRecord.record_month.toString().padStart(2, '0')}/${oldestRecord.record_year}`

      // Buscar taxas de inflação apropriadas baseadas na moeda
      let response
      if (investmentPlan.currency === 'USD') {
        response = fetchUSCPIRates(startDate, createDateWithoutTimezone(new Date()).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }))
      } else if (investmentPlan.currency === 'EUR') {
        response = fetchEuroCPIRates(startDate, createDateWithoutTimezone(new Date()).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }))
      } else {
        response = fetchIPCARates(startDate, createDateWithoutTimezone(new Date()).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }))
      }

      // Criar um mapa de taxas de inflação por mês/ano para busca mais fácil
      const cpiRateMap = new Map()
      response.forEach(item => {
        const date = createDateWithoutTimezone(item.date)
        const year = date.getFullYear()
        const month = date.getMonth() + 1 // JavaScript months are 0-indexed
        const key = `${year}-${month}`
        cpiRateMap.set(key, Number(item.monthlyRate))
      })

      // Preparar atualizações em lote para cada registro que tem uma taxa de inflação correspondente
      const updates = []
      let updatedCount = 0

      for (const record of records) {
        const recordKey = `${record.record_year}-${record.record_month}`
        if (cpiRateMap.has(recordKey)) {
          const cpiRate = cpiRateMap.get(recordKey)
          const parsedCpiRate = cpiRate
          const cpiRateConverted = parseFloat((calculateCompoundedRates([parsedCpiRate/100, yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100)]) * 100).toFixed(2))
          const parsedTargetRentability = parseFloat(record.target_rentability?.toFixed(2) || '0')
          if (parsedTargetRentability !== cpiRateConverted) {
            updates.push({
              id: record.id,
              target_rentability: cpiRateConverted
            })
            updatedCount++
          }
        }
      }

      // Atualizar registros com taxas de inflação correspondentes
      if (updates.length > 0) {
        const updatedIds: string[] = []
        // Processar cada atualização individualmente para garantir que são apenas atualizações
        for (const update of updates) {
          const { error } = await supabase
            .from('user_financial_records')
            .update({ target_rentability: update.target_rentability })
            .eq('id', update.id)

          if (error) {
            console.error(`Error updating record ${update.id}:`, error)
            throw error
          }
          updatedIds.push(update.id)
        }
      }

      return {
        count: updatedCount,
        updates
      }
    } catch (error) {
      console.error('Error in syncInflationRates:', error)
      throw error
    }
  }

  /**
   * Ordena registros por data (mais recente primeiro)
   */
  static sortRecords(records: FinancialRecord[]): FinancialRecord[] {
    return records.sort((a, b) => {
      if (a.record_year !== b.record_year) {
        return b.record_year - a.record_year
      }
      return b.record_month - a.record_month
    })
  }

  /**
   * Calcula estatísticas dos registros
   */
  static calculateRecordsStats(records: FinancialRecord[]) {
    const total = records.length
    const totalStartingBalance = records.reduce((sum, record) => sum + record.starting_balance, 0)
    const totalEndingBalance = records.reduce((sum, record) => sum + record.ending_balance, 0)
    const totalMonthlyContribution = records.reduce((sum, record) => sum + record.monthly_contribution, 0)
    const totalMonthlyReturn = records.reduce((sum, record) => sum + record.monthly_return, 0)
    const averageMonthlyReturnRate = records.reduce((sum, record) => sum + (record.monthly_return_rate || 0), 0) / total

    return {
      total,
      totalStartingBalance,
      totalEndingBalance,
      totalMonthlyContribution,
      totalMonthlyReturn,
      averageMonthlyReturnRate,
      totalGrowth: totalEndingBalance - totalStartingBalance
    }
  }

  /**
   * Busca os links de um registro financeiro específico
   */
  static async fetchLinksByFinancialRecordId(financialRecordId: string) {
    try {
      const { data, error } = await supabase
        .from('financial_record_links')
        .select('*')
        .eq('financial_record_id', financialRecordId)

      if (error) {
        console.error('Error fetching financial record links:', error)
        throw error
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error in fetchLinksByFinancialRecordId:', error)
      return { data: [], error }
    }
  }

  /**
   * Processa eventos do CSV e cria eventos e links automaticamente
   */
  private static async processCSVEvents(
    insertedRecords: FinancialRecord[],
    csvRecords: CSVRecord[],
    userId: string
  ): Promise<void> {
    try {

      for (let i = 0; i < insertedRecords.length; i++) {
        const record = insertedRecords[i]
        const csvRecord = csvRecords[i]
        
        // Verificar se há eventos no CSV (deve ser um número válido e diferente de zero)
        const eventValue = parseFloat(csvRecord.Eventos)
        if (csvRecord.Eventos && csvRecord.Eventos.trim() !== '' && !isNaN(eventValue) && eventValue !== 0) {
          
          // Criar nome do evento baseado na data
          const eventName = `Importado via CSV - ${csvRecord.Data}`
          
          // Criar o evento
          const { data: createdEvent, error: eventError } = await supabase
            .from('events')
            .insert([{
              profile_id: userId,
              name: eventName,
              icon: 'other',
              asset_value: 0, // Valor será calculado baseado no registro
              month: record.record_month,
              year: record.record_year,
              payment_mode: 'none',
              installment_count: null,
              installment_interval: 1,
              status: 'pending'
            }])
            .select()
            .single()

          if (eventError) {
            console.error('Erro ao criar evento:', eventError)
            continue
          }

          // Atualizar o evento com o valor do CSV
          const { error: updateError } = await supabase
            .from('events')
            .update({ asset_value: eventValue })
            .eq('id', createdEvent.id)

          if (updateError) {
            console.error('Erro ao atualizar valor do evento:', updateError)
          }

          // Criar o link entre o evento e o registro financeiro
          const { error: linkError } = await supabase
            .from('financial_record_links')
            .insert([{
              financial_record_id: record.id,
              item_id: createdEvent.id,
              item_type: 'event',
              allocated_amount: eventValue,
              is_completing: true // Marcar como completo pois é um evento histórico
            }])

          if (linkError) {
            console.error('Erro ao criar link do evento:', linkError)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar eventos do CSV:', error)
    }
  }
}
