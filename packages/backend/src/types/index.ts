/**
 * Tipos compartilhados para o backend
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface RequestContext {
  userId?: string
  ip?: string
  userAgent?: string
  timestamp: string
}

export interface LogEntry {
  level: 'info' | 'warn' | 'error'
  message: string
  context?: RequestContext
  data?: unknown
  timestamp: string
}
