import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: '../../.env' })

const app = express()
const PORT = process.env.PORT || 8081

// Middlewares
app.use(cors())
app.use(express.json())

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  })
})

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend API is working!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// Rota POST de teste
app.post('/api/test', (req, res) => {
  res.json({ 
    message: 'POST request received',
    body: req.body,
    timestamp: new Date().toISOString()
  })
})

// Rota 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/health`)
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`)
})
