import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withMiddleware } from './_middleware.js'
import { validateMethod } from './_helpers.js'
import { testGetController, testPostController } from '../src/controllers/test.controller.js'

/**
 * Test endpoint
 * GET /api/test
 * POST /api/test
 * 
 * Route → Controller → Response
 */
function handler(req: VercelRequest, res: VercelResponse) {
  // Validar método
  if (!validateMethod(req, res, ['GET', 'POST'])) {
    return
  }

  // Chamar controller apropriado
  if (req.method === 'GET') {
    return testGetController(req, res)
  }

  if (req.method === 'POST') {
    return testPostController(req, res)
  }
}

// Exportar com middleware aplicado
export default withMiddleware(handler)
