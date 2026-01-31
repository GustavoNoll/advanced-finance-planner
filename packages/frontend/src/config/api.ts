/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints.
 * Uses environment variable VITE_API_URL for backend URL.
 */

import { validateFrontendEnv } from '@app/shared'

// Validar variáveis de ambiente no startup
const env = validateFrontendEnv()

// Backend API URL
// Em produção: usa o mesmo domínio (Serverless Functions na Vercel)
// Em desenvolvimento: usa Express local ou deixa vazio para usar o mesmo domínio
const isDevelopment = import.meta.env.DEV
export const API_URL = env.VITE_API_URL || (isDevelopment ? 'http://localhost:8081' : '')

// Helper para fazer chamadas à API
export const apiClient = {
  baseURL: API_URL,
  
  async get(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    return response.json()
  },
  
  async post(endpoint: string, data: unknown) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    return response.json()
  },
}
