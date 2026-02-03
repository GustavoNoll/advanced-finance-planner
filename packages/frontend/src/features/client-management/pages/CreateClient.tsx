import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentUserProfile, useClientMutations } from '@/hooks/useClientManagement';

export const CreateClient = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    password: '',
    name: '',
    birth_date: '',
  });

  // Hooks para dados e mutações
  const { profile: currentBroker } = useCurrentUserProfile();
  const { createClient } = useClientMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentBroker?.id) {
      return;
    }

    setLoading(true);

    try {
      await createClient.mutateAsync({ 
        clientData: formData, 
        brokerId: currentBroker.id 
      });
      
      // Redirecionar para a página de criação de plano com o ID do novo usuário
      // O ID será retornado pela mutation
      navigate('/broker-dashboard');
    } catch (error) {
      console.error('Error creating client:', error);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('createClient.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
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
                <label className="text-sm font-medium text-muted-foreground">
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
                <label className="text-sm font-medium text-muted-foreground">
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
