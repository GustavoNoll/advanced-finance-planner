/**
 * Environment Variables Configuration
 * 
 * Centralized environment variable validation and documentation.
 * Uses Zod for runtime validation.
 * 
 * This file documents all environment variables used in the project.
 */

import { z } from 'zod'

/**
 * Frontend Environment Variables Schema
 * 
 * Variables prefixed with VITE_ are exposed to the client bundle.
 * NEVER put sensitive secrets in VITE_ variables!
 */
export const frontendEnvSchema = z.object({
  // Supabase Configuration (Frontend)
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY is required'),

  // API Configuration
  VITE_API_URL: z.string().optional(), // Optional: defaults to same domain in production

  // Environment
  VITE_ENVIRONMENT: z.enum(['development', 'production', 'staging']).optional().default('development'),

  // Optional: Base URL for SEO
  VITE_BASE_URL: z.string().url().optional().or(z.literal('')),

  // Optional: N8N Integration
  VITE_N8N_PDF_IMPORT_URL: z.string().url().optional(),
})

/**
 * Backend Environment Variables Schema
 * 
 * These variables are NOT exposed to the client.
 * Safe for secrets and API keys.
 */
export const backendEnvSchema = z.object({
  // Supabase Configuration (Backend)
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'SUPABASE_SERVICE_KEY is required'),

  // Frontend URL (for CORS)
  FRONTEND_URL: z.string().url().or(z.literal('*')).default('*'),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server Port (development only)
  PORT: z.string().regex(/^\d+$/).transform(Number).optional().default('8081'),

  // Optional: FRED API Key
  FRED_API_KEY: z.string().optional(),
})

/**
 * Type definitions for validated environment variables
 */
export type FrontendEnv = z.infer<typeof frontendEnvSchema>
export type BackendEnv = z.infer<typeof backendEnvSchema>

/**
 * Validate and parse frontend environment variables
 * 
 * @throws {z.ZodError} If validation fails
 */
export function validateFrontendEnv(): FrontendEnv {
  try {
    // @ts-expect-error - import.meta.env is provided by Vite
    return frontendEnvSchema.parse(import.meta.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Frontend environment variables validation failed:')
      error.errors.forEach((err) => {
        console.error(`   - ${err.path.join('.')}: ${err.message}`)
      })
      throw new Error('Invalid frontend environment variables. Check .env.example for required variables.')
    }
    throw error
  }
}

/**
 * Validate and parse backend environment variables
 * 
 * @throws {z.ZodError} If validation fails
 */
export function validateBackendEnv(): BackendEnv {
  try {
    return backendEnvSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Backend environment variables validation failed:')
      error.errors.forEach((err) => {
        console.error(`   - ${err.path.join('.')}: ${err.message}`)
      })
      throw new Error('Invalid backend environment variables. Check .env.example for required variables.')
    }
    throw error
  }
}
