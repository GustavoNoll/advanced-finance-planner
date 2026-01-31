export interface FinancialRecordLink {
  id: string
  financial_record_id: string
  item_id: string
  item_type: 'goal' | 'event'
  allocated_amount: number
  is_completing: boolean
  created_at: string
  updated_at: string
}

