import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withMiddleware } from './_middleware.js'
import { validateMethod } from './_helpers.js'
import { healthController } from '../src/controllers/health.controller.js'

/**
 * Health check endpoint
 * GET /api/health
 * 
 * Route → Controller → Response
 */
function handler(req: VercelRequest, res: VercelResponse) {
  // Validar método
  if (!validateMethod(req, res, ['GET'])) {
    return
  }

  // Chamar controller
  return healthController(req, res)
}

// Exportar com middleware aplicado
export default withMiddleware(handler)
