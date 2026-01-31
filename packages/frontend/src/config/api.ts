/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints.
 * Uses environment variable VITE_API_URL for backend URL.
 */

// Backend API URL - configurado via variável de ambiente
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

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
