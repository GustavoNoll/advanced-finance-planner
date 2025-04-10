import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/ui/logo';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      // Check if user is a broker
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_broker')
        .eq('id', signInData.user.id)
        .single();

      if (profileError) throw profileError;

      toast({
        title: t('common.success'),
        description: t('auth.loginSuccess'),
      });
      
      console.log("Profile data:", profile); // Debug log
      console.log("Is broker:", profile?.is_broker); // Debug log

      if (profile?.is_broker) {
        navigate('/broker-dashboard');
      } else {
        navigate('/');
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
      <div className="flex flex-col items-center justify-center w-full h-full">
      <Logo variant="full" />
        <div className="h-1/2 flex items-center justify-center w-full">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>{t('auth.login')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.enterEmail')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">{t('auth.password')}</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t('auth.enterPassword')}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('common.loading') : t('auth.login')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
