import type { VercelRequest, VercelResponse } from '@vercel/node'
import { successResponse } from '../../api/_helpers.js'

/**
 * Health Check Controller
 * Lógica de negócio para o endpoint de health check
 */
export async function healthController(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Lógica de health check
  const healthData = {
    status: 'ok',
    message: 'Backend is running',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    // Adicione mais verificações aqui se necessário
    // database: await checkDatabase(),
    // services: await checkServices(),
  }

  successResponse(res, healthData)
}
