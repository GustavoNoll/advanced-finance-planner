import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/ui/logo';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

      toast({
        title: t('common.success'),
        description: t('auth.loginSuccess'),
      });

      // Redirect based on user type
      if (profile?.is_admin) {
        navigate('/admin-dashboard');
      } else if (profile?.is_broker) {
        if (profile?.active) {
          navigate('/broker-dashboard');
        } else {
          toast({
            title: t('common.error'),
            description: t('auth.brokerInactive'),
            variant: "destructive",
          });
        }
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error && error.message === 'Invalid login credentials' 
          ? t('auth.invalidPassword') 
          : error instanceof Error ? error.message : t('common.errors.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-white to-blue-50/50 p-4 dark:from-slate-900 dark:via-gray-950 dark:to-slate-900/50">
      <div className="flex flex-col items-center justify-center w-full max-w-md">
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
                  placeholder={t('auth.enterPassword')}
                  startIcon={<Lock className="h-5 w-5 text-gray-400" />}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
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
                loading={loading}
                className="mt-4"
              >
                {t('auth.login')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
