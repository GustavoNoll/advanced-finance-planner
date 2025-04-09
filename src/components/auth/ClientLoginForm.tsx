import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{t('auth.clientLogin')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t('auth.password')}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
  );
}; 