
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isBroker: boolean;
  updateLastActive: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isBroker: false,
  updateLastActive: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBroker, setIsBroker] = useState(false);

  const updateLastActive = async () => {
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating last_active_at:', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // First check if profile exists
        const { data: profiles } = await supabase
          .from('profiles')
          .select('is_broker')
          .eq('id', user.id);
        
        // If no profile exists, create one
        if (!profiles || profiles.length === 0) {
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert([{ id: user.id, is_broker: false }])
            .select('is_broker')
            .single();
          
          setIsBroker(newProfile?.is_broker || false);
        } else {
          setIsBroker(profiles[0]?.is_broker || false);
        }
      }
      
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isBroker, updateLastActive }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
