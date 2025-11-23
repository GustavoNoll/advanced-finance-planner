export type StatementImportStatus = 'created' | 'running' | 'success' | 'failed'
export type StatementImportType = 'consolidated' | 'detailed'

export interface StatementImport {
  id: string
  n8n_execution_id: string
  profile_id: string
  import_type: StatementImportType
  status: StatementImportStatus
  metadata: Record<string, unknown>
  error_message: string | null
  created_at: string
  updated_at: string
  started_at: string | null
  completed_at: string | null
}

