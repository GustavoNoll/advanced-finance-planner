import type { VercelRequest, VercelResponse } from '@vercel/node'
import { successResponse, errorResponse } from '../../api/_helpers.js'

/**
 * Test Controller
 * Lógica de negócio para o endpoint de teste
 */
export async function testGetController(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Lógica para GET
  const data = {
    message: 'Backend API is working!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    method: 'GET',
    timestamp: new Date().toISOString(),
  }

  successResponse(res, data)
}

export async function testPostController(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Lógica para POST
  const { body } = req

  // Validação (exemplo)
  if (!body) {
    return errorResponse(res, 'Body is required', 400)
  }

  const data = {
    message: 'POST request received',
    body,
    method: 'POST',
    timestamp: new Date().toISOString(),
  }

  successResponse(res, data, 'Request processed successfully', 201)
}
