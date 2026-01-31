import type { Request, Response, NextFunction } from 'express'

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
 * Middleware de logging para requests e responses
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()

  // Log do request
  const requestLog: RequestLog = {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
    headers: {
      'content-type': req.get('content-type') || '',
      'user-agent': req.get('user-agent') || '',
    },
    timestamp,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
  }

  console.log('📥 Request:', JSON.stringify(requestLog, null, 2))

  // Interceptar o método end para logar a resposta
  const originalEnd = res.end.bind(res)
  res.end = function (chunk?: unknown, encoding?: unknown, cb?: () => void) {
    const responseTime = Date.now() - startTime
    const responseLog: ResponseLog = {
      statusCode: res.statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
    }

    console.log('📤 Response:', JSON.stringify(responseLog, null, 2))
    console.log(`⏱️  Total time: ${responseTime}ms\n`)

    // Chamar o método original
    if (typeof chunk === 'function') {
      return originalEnd(chunk)
    } else if (typeof encoding === 'function') {
      return originalEnd(chunk, encoding)
    } else {
      return originalEnd(chunk, encoding, cb)
    }
  }

  next()
}

/**
 * Middleware de error logging
 */
export function errorLogger(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errorLog = {
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    request: {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
    },
    timestamp: new Date().toISOString(),
  }

  console.error('❌ Error:', JSON.stringify(errorLog, null, 2))

  next(err)
}
