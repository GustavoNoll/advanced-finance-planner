import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

const generateRandomEmail = () => {
  const uuid = uuidv4().replace(/-/g, '').substring(0, 12);
  return `${uuid}@foundation.com`;
};

const checkEmailExists = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .single();
  
  return !error && data !== null;
};

export const CreateClient = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    password: '',
    name: '',
    birth_date: '',
  });
  const [currentBroker, setCurrentBroker] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentBroker = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentBroker(user.id);
      }
    };
    getCurrentBroker();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentBroker) {
      toast({
        title: t('createClient.messages.error.title'),
        description: t('common.errors.tryAgain'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Generate a unique random email
      let email = generateRandomEmail();
      let emailExists = await checkEmailExists(email);
      
      // Keep generating new emails until we find one that doesn't exist
      while (emailExists) {
        email = generateRandomEmail();
        emailExists = await checkEmailExists(email);
      }

      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: formData.password,
        user_metadata: { 
          name: formData.name,
          birth_date: formData.birth_date
        },
        email_confirm: true
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error(t('createClient.messages.error.description'));

      // Create profile with broker_id
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            is_broker: false,
            name: formData.name,
            birth_date: formData.birth_date,
            broker_id: currentBroker
          }
        ]);

      if (profileError) throw profileError;

      toast({
        title: t('createClient.messages.success.title'),
        description: t('createClient.messages.success.description'),
      });
      
      // Redirect to create plan page with the new user's ID
      navigate(`/create-plan?client_id=${authData.user.id}`);
    } catch (error: unknown) {
      console.error('Error creating client:', error);
      toast({
        title: t('createClient.messages.error.title'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('createClient.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('createClient.form.name.label')}
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('createClient.form.name.placeholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('createClient.form.password.label')}
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('createClient.form.password.placeholder')}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('createClient.form.birthDate.label')}
                </label>
                <Input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  placeholder={t('createClient.form.birthDate.placeholder')}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/broker-dashboard')}
                  className="flex-1"
                >
                  {t('createClient.buttons.cancel')}
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? t('createClient.buttons.creating') : t('createClient.buttons.create')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
