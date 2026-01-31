import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Logger genérico para Serverless Functions (Vercel)
 * Compatível com a estrutura do logger do Express
 */

interface RequestLog {
  method: string
  path: string
  query?: Record<string, unknown>
  body?: unknown
  headers?: Record<string, string>
  timestamp: string
  ip?: string
  userAgent?: string
}

interface ResponseLog {
  statusCode: number
  responseTime: number
  timestamp: string
}

/**
 * Cria log de request para Vercel
 */
export function logRequest(req: VercelRequest): RequestLog {
  const timestamp = new Date().toISOString()
  
  return {
    method: req.method || 'UNKNOWN',
    path: req.url || (req as any).path || '/',
    query: req.query,
    body: req.method !== 'GET' && req.method !== 'OPTIONS' ? req.body : undefined,
    headers: {
      'content-type': (req.headers['content-type'] as string) || '',
      'user-agent': (req.headers['user-agent'] as string) || '',
      'authorization': req.headers['authorization'] ? '***' : undefined, // Não logar token completo
    },
    timestamp,
    ip: (req.headers['x-forwarded-for'] as string) || 
        (req.headers['x-real-ip'] as string) || 
        (req as any).clientIp || 
        'unknown',
    userAgent: (req.headers['user-agent'] as string) || undefined,
  }
}

/**
 * Cria log de response para Vercel
 */
export function logResponse(
  res: VercelResponse,
  startTime: number
): ResponseLog {
  return {
    statusCode: res.statusCode || 200,
    responseTime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Loga request
 */
export function logRequestToConsole(req: VercelRequest): number {
  const requestLog = logRequest(req)
  console.log('📥 Request:', JSON.stringify(requestLog, null, 2))
  return Date.now() // Retorna startTime
}

/**
 * Loga response
 */
export function logResponseToConsole(
  res: VercelResponse,
  startTime: number
): void {
  const responseLog = logResponse(res, startTime)
  console.log('📤 Response:', JSON.stringify(responseLog, null, 2))
  console.log(`⏱️  Total time: ${responseLog.responseTime}ms\n`)
}

/**
 * Loga erro
 */
export function logErrorToConsole(
  error: unknown,
  req: VercelRequest,
  startTime: number
): void {
  const errorLog = {
    error: {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' && error instanceof Error 
        ? error.stack 
        : undefined,
    },
    request: {
      method: req.method,
      path: req.url || (req as any).path,
      query: req.query,
    },
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime,
  }

  console.error('❌ Error:', JSON.stringify(errorLog, null, 2))
}
