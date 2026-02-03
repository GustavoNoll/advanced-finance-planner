// 1. Imports externos
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// 2. Imports internos (shared)
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useToast } from '@/shared/components/ui/use-toast'
import { Logo } from '@/shared/components/ui/logo'
import { Spinner } from '@/shared/components/ui/spinner'
import { supabase } from '@/lib/supabase'

// 3. Component
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Update last_active_at on login
      await supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', signInData.user.id);

      // Check user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_broker, is_admin, active')
        .eq('id', signInData.user.id)
        .single();

      if (profileError) throw profileError;

      // Check if user is neither admin nor broker
      if (!profile?.is_admin && !profile?.is_broker) {
        throw new Error(t('auth.notAuthorized'));
      }

      // Show success toast
      toast({
        title: t('common.success'),
        description: t('auth.loginSuccess'),
      });

      // Set navigating state for smooth transition
      setIsNavigating(true);

      // Small delay to ensure AuthProvider syncs and smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));

      // Redirect based on user type
      if (profile?.is_admin) {
        navigate('/admin-dashboard', { replace: true });
      } else if (profile?.is_broker) {
        if (profile?.active) {
          navigate('/broker-dashboard', { replace: true });
        } else {
          setIsNavigating(false);
          setLoading(false);
          toast({
            title: t('common.error'),
            description: t('auth.brokerInactive'),
            variant: "destructive",
          });
        }
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      setIsNavigating(false);
      setLoading(false);
      toast({
        title: t('common.error'),
        description: error instanceof Error && error.message === 'Invalid login credentials' 
          ? t('auth.invalidPassword') 
          : error instanceof Error ? error.message : t('common.errors.tryAgain'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-white to-blue-50/50 p-4 dark:from-slate-900 dark:via-gray-950 dark:to-slate-900/50 relative">
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-4">
              <Spinner size="lg" className="border-t-primary/80" />
              <div className="space-y-2 text-center">
                <Logo variant="full" />
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                  {t('common.loading')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isNavigating ? 0.3 : 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center w-full max-w-md"
      >
        <Logo variant="full" className="mb-8" />
        <Card className="w-full shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{t('auth.brokerLogin')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t('auth.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.enterEmail')}
                  required
                  disabled={loading || isNavigating}
                  startIcon={<Mail className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || isNavigating}
                  placeholder={t('auth.enterPassword')}
                  startIcon={<Lock className="h-5 w-5 text-gray-400" />}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading || isNavigating}
                      className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  }
                />
              </div>
              <Button 
                type="submit" 
                variant="default"
                size="lg"
                fullWidth
                loading={loading || isNavigating}
                disabled={loading || isNavigating}
                className="mt-4"
              >
                {t('auth.login')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
