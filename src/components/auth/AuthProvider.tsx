
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isBroker: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isBroker: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBroker, setIsBroker] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(session.user);
        
        if (session.user) {
          // First check if profile exists
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('is_broker')
            .eq('id', session.user.id);
          
          if (profileError) {
            throw profileError;
          }

          // If no profile exists, create one
          if (!profiles || profiles.length === 0) {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{ id: session.user.id, is_broker: false }])
              .select('is_broker')
              .single();
            
            if (createError) {
              throw createError;
            }
            
            setIsBroker(newProfile?.is_broker || false);
          } else {
            setIsBroker(profiles[0]?.is_broker || false);
          }
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        // Clear the session on error
        await supabase.auth.signOut();
        setUser(null);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsBroker(false);
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        // Fetch broker status when user signs in
        const { data: profiles } = await supabase
          .from('profiles')
          .select('is_broker')
          .eq('id', session.user.id);
        
        setIsBroker(profiles?.[0]?.is_broker || false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, isBroker }}>
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

