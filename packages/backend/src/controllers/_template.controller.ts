import type { VercelRequest, VercelResponse } from '@vercel/node'
import { successResponse, errorResponse, badRequestResponse } from '../../api/_helpers.js'

/**
 * Template Controller
 * 
 * Como usar:
 * 1. Copie este arquivo para controllers/[nome].controller.ts
 * 2. Implemente a lógica de negócio
 * 3. Use helpers para respostas padronizadas
 */

/**
 * GET Controller
 */
export async function getController(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    // Sua lógica aqui
    // Exemplo: buscar dados do banco, processar, etc.
    
    const data = {
      // seus dados
    }

    successResponse(res, data, 'Dados recuperados com sucesso')
  } catch (error) {
    errorResponse(
      res,
      error instanceof Error ? error.message : 'Erro desconhecido',
      500
    )
  }
}

/**
 * POST Controller
 */
export async function postController(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    // Validar body
    const { field } = req.body
    
    if (!field) {
      return badRequestResponse(res, 'Campo obrigatório ausente')
    }

    // Sua lógica aqui
    // Exemplo: criar registro, processar dados, etc.
    
    const data = {
      // resultado
    }

    successResponse(res, data, 'Criado com sucesso', 201)
  } catch (error) {
    errorResponse(
      res,
      error instanceof Error ? error.message : 'Erro desconhecido',
      500
    )
  }
}

/**
 * PUT Controller
 */
export async function putController(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    const { id } = req.query
    const { field } = req.body

    if (!id) {
      return badRequestResponse(res, 'ID é obrigatório')
    }

    // Sua lógica de atualização aqui
    
    const data = {
      id,
      // dados atualizados
    }

    successResponse(res, data, 'Atualizado com sucesso')
  } catch (error) {
    errorResponse(
      res,
      error instanceof Error ? error.message : 'Erro desconhecido',
      500
    )
  }
}

/**
 * DELETE Controller
 */
export async function deleteController(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    const { id } = req.query

    if (!id) {
      return badRequestResponse(res, 'ID é obrigatório')
    }

    // Sua lógica de exclusão aqui

    successResponse(res, { id }, 'Excluído com sucesso')
  } catch (error) {
    errorResponse(
      res,
      error instanceof Error ? error.message : 'Erro desconhecido',
      500
    )
  }
}
