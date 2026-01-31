import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { requestLogger, errorLogger } from './middleware/logger.js'
import { loadApiRoutes } from './utils/load-api-routes.js'
import { validateBackendEnv } from '@app/shared/config/env'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Carregar variáveis de ambiente (apenas em desenvolvimento local)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '../../.env' })
}

// Validar variáveis de ambiente no startup
const env = validateBackendEnv()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PORT = env.PORT

const app = express()

// Middlewares globais
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use(requestLogger)

// Carregar rotas automaticamente de packages/backend/api/
const apiDir = join(__dirname, '../api')
loadApiRoutes(app, apiDir)
  .then((routes) => {
    console.log(`\n📋 Loaded ${routes.length} route(s) from ${apiDir}`)
    routes.forEach(route => {
      console.log(`   ${route.methods.join(', ')} ${route.path}`)
    })
  })
  .catch((error) => {
    console.error('❌ Error loading API routes:', error)
  })

// Rota de info (não está em api/)
app.get('/info', (req, res) => {
  res.json({
    name: 'Advanced Finance Planner API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    mode: 'Express Server (Development)',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware (deve ser o último)
app.use(errorLogger)

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📡 Info endpoint: http://localhost:${PORT}/info`)
  console.log(`📁 API routes loaded from: ${apiDir}\n`)
})
