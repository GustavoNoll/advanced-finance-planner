import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/ui/logo';
import { Lock } from 'lucide-react';

export const ClientLoginForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, get the client's email from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('email')
        .eq('id', clientId)
        .single();

      if (profileError || !profile) {
        throw new Error('Client not found');
      }

      // Then try to sign in with the email and password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (signInError) throw signInError;

      // Verify if the logged in user is the same as the clientId
      if (signInData.user?.id !== clientId) {
        throw new Error('Unauthorized access');
      }

      toast({
        title: t('common.success'),
        description: t('auth.loginSuccess'),
      });

      // Redirect to client dashboard
      navigate(`/client/${clientId}`);
    } catch (error: unknown) {
      console.error('Login error:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error && error.message === 'Invalid login credentials' 
          ? t('auth.invalidPassword') 
          : error instanceof Error ? error.message : 'An unknown error occurred',
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
            <CardTitle className="text-2xl font-bold text-center">{t('auth.clientLogin')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  placeholder={t('auth.enterPassword')}
                  startIcon={<Lock className="h-5 w-5 text-gray-400" />}
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