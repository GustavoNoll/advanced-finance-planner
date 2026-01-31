import type { VercelRequest, VercelResponse } from '@vercel/node'
import { 
  logRequestToConsole, 
  logResponseToConsole, 
  logErrorToConsole 
} from './_logger.js'

/**
 * Middleware genérico para todas as APIs
 * Aplica CORS, logging e error handling
 * Usa o logger compartilhado de packages/backend/src/middleware/logger.ts
 */
export function withMiddleware(
  handler: (req: VercelRequest, res: VercelResponse) => void | Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    // Log do request (usa logger compartilhado)
    const startTime = logRequestToConsole(req)

    // CORS headers
    const frontendUrl = process.env.FRONTEND_URL || '*'
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', frontendUrl)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200)
      logResponseToConsole(res, startTime)
      return res.end()
    }

    try {
      // Executar handler
      await handler(req, res)

      // Log da resposta (usa logger compartilhado)
      logResponseToConsole(res, startTime)
    } catch (error) {
      // Error logging (usa logger compartilhado)
      logErrorToConsole(error, req, startTime)

      // Enviar resposta de erro se ainda não foi enviada
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Internal server error',
          timestamp: new Date().toISOString(),
        })
        logResponseToConsole(res, startTime)
      }
    }
  }
}
