import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withMiddleware } from './_middleware.js'
import { validateMethod } from './_helpers.js'
// import { getController, postController } from '../src/controllers/[nome].controller.js'

/**
 * Template para criar novas APIs
 * 
 * Como usar:
 * 1. Copie este arquivo para api/[nome-da-api].ts
 * 2. Importe os controllers necessários
 * 3. Defina os métodos permitidos
 * 4. Chame o controller apropriado
 * 
 * Arquitetura: Route → Controller → Response
 */
function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Validar método HTTP permitido
  if (!validateMethod(req, res, ['GET', 'POST', 'PUT', 'DELETE'])) {
    return
  }

  // 2. Chamar controller apropriado
  if (req.method === 'GET') {
    // return getController(req, res)
    res.json({ message: 'Implement GET controller' })
    return
  }

  if (req.method === 'POST') {
    // return postController(req, res)
    res.json({ message: 'Implement POST controller' })
    return
  }

  if (req.method === 'PUT') {
    // return putController(req, res)
    res.json({ message: 'Implement PUT controller' })
    return
  }

  if (req.method === 'DELETE') {
    // return deleteController(req, res)
    res.json({ message: 'Implement DELETE controller' })
    return
  }
}

// Exportar com middleware aplicado (CORS + Logging automático)
export default withMiddleware(handler)
