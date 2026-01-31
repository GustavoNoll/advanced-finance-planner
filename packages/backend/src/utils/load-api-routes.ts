import type { Express, Request, Response } from 'express'
import { readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { adaptVercelHandler } from './adapt-vercel-handler.js'

interface RouteConfig {
  path: string
  methods: string[]
  handler: (req: Request, res: Response) => void | Promise<void>
}

/**
 * Carrega automaticamente todas as Serverless Functions de packages/backend/api/
 * e cria rotas Express correspondentes
 */
export async function loadApiRoutes(app: Express, apiDir: string): Promise<RouteConfig[]> {
  const routes: RouteConfig[] = []

  // Função recursiva para ler arquivos
  async function readFiles(dir: string, basePath: string = ''): Promise<void> {
    const files = readdirSync(dir)

    for (const file of files) {
      const filePath = join(dir, file)
      const stat = statSync(filePath)

      if (stat.isDirectory()) {
        // Recursão para subdiretórios
        await readFiles(filePath, join(basePath, file))
      } else if (extname(file) === '.ts' || extname(file) === '.js') {
        // Carregar arquivo de função
        const fileName = basename(file, extname(file))
        const routePath = basePath ? `/${basePath}/${fileName}` : `/${fileName}`

        try {
          // Converter caminho para URL para import dinâmico
          const fileUrl = `file://${filePath}`
          const module = await import(fileUrl)
          const handler = module.default

          if (typeof handler === 'function') {
            // Detectar métodos suportados (baseado no handler)
            const methods = detectMethods(handler)

            // Adaptar handler do Vercel para Express
            const expressHandler = adaptVercelHandler(handler)

            // Registrar rota
            const fullPath = `/api${routePath}`
            
            // Registrar cada método
            methods.forEach(method => {
              const methodLower = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options'
              if (methodLower === 'get') {
                app.get(fullPath, expressHandler)
              } else if (methodLower === 'post') {
                app.post(fullPath, expressHandler)
              } else if (methodLower === 'put') {
                app.put(fullPath, expressHandler)
              } else if (methodLower === 'delete') {
                app.delete(fullPath, expressHandler)
              } else if (methodLower === 'patch') {
                app.patch(fullPath, expressHandler)
              } else if (methodLower === 'options') {
                app.options(fullPath, expressHandler)
              }
              
              routes.push({
                path: fullPath,
                methods: [method],
                handler: expressHandler,
              })
            })

            console.log(`✅ Loaded route: ${methods.join(', ')} ${fullPath}`)
          } else {
            console.warn(`⚠️  ${filePath} does not export a default function`)
          }
        } catch (error) {
          console.error(`❌ Error loading ${filePath}:`, error)
          if (error instanceof Error) {
            console.error(`   Error message: ${error.message}`)
            console.error(`   Stack: ${error.stack}`)
          }
        }
      }
    }
  }

  // Ler arquivos da pasta api
  try {
    if (statSync(apiDir).isDirectory()) {
      await readFiles(apiDir)
    } else {
      console.warn(`⚠️  API directory not found: ${apiDir}`)
    }
  } catch (error) {
    console.error(`❌ Error accessing API directory ${apiDir}:`, error)
  }

  return routes
}

/**
 * Detecta métodos HTTP suportados pela função
 * Analisa o código da função para determinar métodos
 */
function detectMethods(handler: (req: unknown, res: unknown) => void | Promise<void>): string[] {
  const handlerStr = handler.toString()
  const methods: string[] = []

  // Verificar métodos comuns
  if (handlerStr.includes('req.method === \'GET\'') || handlerStr.includes('req.method === "GET"')) {
    methods.push('GET')
  }
  if (handlerStr.includes('req.method === \'POST\'') || handlerStr.includes('req.method === "POST"')) {
    methods.push('POST')
  }
  if (handlerStr.includes('req.method === \'PUT\'') || handlerStr.includes('req.method === "PUT"')) {
    methods.push('PUT')
  }
  if (handlerStr.includes('req.method === \'DELETE\'') || handlerStr.includes('req.method === "DELETE"')) {
    methods.push('DELETE')
  }
  if (handlerStr.includes('req.method === \'PATCH\'') || handlerStr.includes('req.method === "PATCH"')) {
    methods.push('PATCH')
  }

  // Se não detectou nenhum método específico, assume GET
  if (methods.length === 0) {
    methods.push('GET')
  }

  // Sempre adiciona OPTIONS para CORS
  if (!methods.includes('OPTIONS')) {
    methods.push('OPTIONS')
  }

  return methods
}
