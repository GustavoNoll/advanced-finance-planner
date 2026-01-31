import type { Request, Response } from 'express'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Adapta um handler do Vercel (Serverless Function) para Express
 * Permite reutilizar as mesmas funções em desenvolvimento local e produção
 */
export function adaptVercelHandler(
  vercelHandler: (req: VercelRequest, res: VercelResponse) => void | Promise<void>
) {
  return async (req: Request, res: Response) => {
    // Converter Express Request para VercelRequest
    const vercelReq = {
      query: req.query as Record<string, string | string[]>,
      body: req.body,
      cookies: req.cookies || {},
      headers: req.headers as Record<string, string | string[]>,
      method: req.method,
      url: req.url,
      // Vercel-specific properties
      clientIp: req.ip || req.socket.remoteAddress || '',
    } as unknown as VercelRequest

    // Converter Express Response para VercelResponse
    const vercelRes = {
      status: (code: number) => {
        res.status(code)
        return vercelRes
      },
      json: (body: unknown) => {
        res.json(body)
        return vercelRes
      },
      send: (body: unknown) => {
        res.send(body)
        return vercelRes
      },
      end: (body?: unknown) => {
        if (body) {
          res.send(body)
        } else {
          res.end()
        }
        return vercelRes
      },
      setHeader: (name: string, value: string | number) => {
        res.setHeader(name, value)
        return vercelRes
      },
      getHeader: (name: string) => {
        return res.getHeader(name) as string | undefined
      },
      removeHeader: (name: string) => {
        res.removeHeader(name)
        return vercelRes
      },
      redirect: (statusOrUrl: string | number, url?: string) => {
        if (typeof statusOrUrl === 'number') {
          res.redirect(statusOrUrl, url || '')
        } else {
          res.redirect(statusOrUrl)
        }
        return vercelRes
      },
      // Vercel-specific properties
      statusCode: res.statusCode,
      headers: res.getHeaders() as Record<string, string>,
    } as unknown as VercelResponse

    try {
      await vercelHandler(vercelReq, vercelRes)
    } catch (error) {
      console.error('Error in adapted handler:', error)
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }
}
