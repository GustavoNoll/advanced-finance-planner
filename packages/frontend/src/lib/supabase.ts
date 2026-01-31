import { createClient } from '@supabase/supabase-js'
import { validateFrontendEnv } from '@app/shared'

// Validar variáveis de ambiente no startup
const env = validateFrontendEnv()

export const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)