// 1. Imports externos
import { useCallback } from 'react'

// 2. Imports internos (shared)
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth/components/AuthProvider'

// 3. Hook
export function useLastActive() {
  const { user } = useAuth();

  const updateLastActive = useCallback(async () => {
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating last_active_at:', error);
    }
  }, [user]);

  return { updateLastActive }
}
