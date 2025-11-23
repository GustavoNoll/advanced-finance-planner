export interface Profile {
  id: string
  user_id: string
  name: string
  birth_date: string
  email?: string
  created_at?: string
  updated_at?: string
  broker_id?: string | null
  is_active?: boolean
  is_broker?: boolean
  is_admin?: boolean
  last_active_at?: string
}

