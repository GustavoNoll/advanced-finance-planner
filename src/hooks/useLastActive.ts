import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

export const useLastActive = () => {
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

  return { updateLastActive };
};
