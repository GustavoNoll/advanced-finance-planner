import type { Response } from 'express'
import type { ApiResponse } from '../types/index.js'

/**
 * Helper para criar respostas padronizadas
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }
  res.status(statusCode).json(response)
}

export function errorResponse(
  res: Response,
  error: string,
  statusCode: number = 500,
  details?: unknown
): void {
  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
    ...(details && { data: details }),
  }
  res.status(statusCode).json(response)
}

export function notFoundResponse(res: Response, resource: string): void {
  errorResponse(res, `${resource} not found`, 404)
}

export function unauthorizedResponse(res: Response, message?: string): void {
  errorResponse(res, message || 'Unauthorized', 401)
}

export function badRequestResponse(res: Response, message: string): void {
  errorResponse(res, message, 400)
}
