// 1. Imports externos
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'

// 2. Imports internos (shared)
import { supabase } from '@/lib/supabase'
import { detectLanguage } from '@/lib/locale-detection'

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isBroker: boolean;
  isAdmin: boolean;
  updateLastActive: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isBroker: false,
  isAdmin: false,
  updateLastActive: async () => {},
});

// 3. Types
interface AuthProviderProps {
  children: React.ReactNode
}

// 4. Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBroker, setIsBroker] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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

  const initialLoadRef = useRef(false);
  const fetchUserCalledRef = useRef(false);
  const isProcessingRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Prevent multiple calls in React Strict Mode
    if (fetchUserCalledRef.current) {
      return;
    }
    fetchUserCalledRef.current = true;

    let mounted = true;

    const fetchUserProfile = async (userId: string) => {
      try {
        // First check if profile exists
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('is_broker, is_admin')
          .eq('id', userId);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }
        
        if (!mounted) {
          return;
        }
        
        // If no profile exists, create one
        if (!profiles || profiles.length === 0) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              is_broker: false,
              is_admin: false,
              language_preference: detectLanguage()
            }])
            .select('is_broker, is_admin')
            .single();
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
          
          if (mounted) {
            setIsBroker(newProfile?.is_broker || false);
            setIsAdmin(newProfile?.is_admin || false);
          }
        } else {
          if (mounted) {
            setIsBroker(profiles[0]?.is_broker || false);
            setIsAdmin(profiles[0]?.is_admin || false);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (mounted) {
          setIsBroker(false);
          setIsAdmin(false);
        }
      }
    };

    const initializeAuth = async () => {
      // Prevent concurrent execution
      if (isProcessingRef.current) {
        return;
      }
      
      isProcessingRef.current = true;
      
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          throw userError;
        }
        
        if (!mounted) {
          isProcessingRef.current = false;
          return;
        }
        
        setUser(user);
        currentUserIdRef.current = user?.id || null;
        
        if (user) {
          await fetchUserProfile(user.id);
        } else {
          setIsBroker(false);
          setIsAdmin(false);
        }
        
        initialLoadRef.current = true;
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setIsBroker(false);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
        isProcessingRef.current = false;
      }
    };

    // Start initializing auth
    initializeAuth();

    // Safety timeout: always set loading to false after 5 seconds max
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        setLoading(false);
        initialLoadRef.current = true;
      }
    }, 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip INITIAL_SESSION - we handle it in initializeAuth
      if (event === 'INITIAL_SESSION') {
        // Ensure loading is false if we've already initialized
        if (mounted && initialLoadRef.current) {
          setLoading(false);
        }
        return;
      }
      
      if (!mounted) {
        return;
      }
      
      const newUser = session?.user ?? null;
      
      // If same user and already processed, just ensure loading is false
      if (newUser && currentUserIdRef.current === newUser.id && initialLoadRef.current) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }
      
      // For SIGNED_IN event, set loading to false quickly for smooth transition
      if (event === 'SIGNED_IN' && newUser) {
        setUser(newUser);
        currentUserIdRef.current = newUser.id;
        // Don't set loading to false immediately - let fetchUserProfile handle it
        // This prevents flickering
      }
      
      // If fetchUser is still processing, wait for it
      if (isProcessingRef.current) {
        const checkInterval = setInterval(() => {
          if (!isProcessingRef.current && mounted) {
            clearInterval(checkInterval);
            // Process the change after init completes
            setUser(newUser);
            currentUserIdRef.current = newUser?.id || null;
            if (newUser) {
              fetchUserProfile(newUser.id).finally(() => {
                if (mounted) {
                  setLoading(false);
                }
              });
            } else {
              setIsBroker(false);
              setIsAdmin(false);
              setLoading(false);
            }
          }
        }, 50);
        
        // Timeout after 2 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          if (mounted) {
            setLoading(false);
          }
        }, 2000);
        
        return;
      }
      
      // Only update if user actually changed
      if (currentUserIdRef.current !== newUser?.id) {
        setUser(newUser);
        currentUserIdRef.current = newUser?.id || null;
        
        if (newUser) {
          await fetchUserProfile(newUser.id);
        } else {
          setIsBroker(false);
          setIsAdmin(false);
        }
      }
      
      // Always set loading to false
      if (mounted) {
        setLoading(false);
        initialLoadRef.current = true;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      fetchUserCalledRef.current = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isBroker, isAdmin, updateLastActive }}>
      {children}
    </AuthContext.Provider>
  )
}

// 5. Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
