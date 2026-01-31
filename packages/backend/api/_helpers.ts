import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Helpers para respostas padronizadas
 */
export function successResponse<T>(
  res: VercelResponse,
  data: T,
  message?: string,
  statusCode: number = 200
): void {
  res.status(statusCode).json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  })
}

export function errorResponse(
  res: VercelResponse,
  error: string,
  statusCode: number = 500,
  details?: unknown
): void {
  res.status(statusCode).json({
    success: false,
    error,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  })
}

export function notFoundResponse(res: VercelResponse, resource: string): void {
  errorResponse(res, `${resource} not found`, 404)
}

export function unauthorizedResponse(res: VercelResponse, message?: string): void {
  errorResponse(res, message || 'Unauthorized', 401)
}

export function badRequestResponse(res: VercelResponse, message: string): void {
  errorResponse(res, message, 400)
}

/**
 * Helper para validar métodos HTTP
 */
export function validateMethod(
  req: VercelRequest,
  res: VercelResponse,
  allowedMethods: string[]
): boolean {
  if (!allowedMethods.includes(req.method || '')) {
    errorResponse(res, 'Method not allowed', 405, {
      allowedMethods,
      receivedMethod: req.method,
    })
    return false
  }
  return true
}
