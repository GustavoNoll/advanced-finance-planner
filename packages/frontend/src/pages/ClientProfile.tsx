import { useState, useEffect } from 'react';
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

const ClientProfile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id || user?.id;
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordValid = newPassword.length >= 6 && confirmPassword.length >= 6 && newPassword === confirmPassword;

  const getPasswordErrorMessage = () => {
    if (newPassword.length === 0 && confirmPassword.length === 0) {
      return t('clientProfile.messages.fillPasswords');
    }
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      return t('clientProfile.messages.passwordTooShort');
    }
    if (newPassword !== confirmPassword) {
      return t('clientProfile.messages.passwordMismatch');
    }
    return '';
  };

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', clientId],
    queryFn: async () => {
      if (!clientId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!clientId,
  });

  const { data: brokerProfile, isLoading: brokerLoading } = useQuery({
    queryKey: ['brokerProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .eq('is_broker', true)
        .single();

      if (error) {
        console.error('Error fetching broker profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  // Validate broker-client relationship
  useEffect(() => {
    if (!profileLoading && !brokerLoading && brokerProfile && clientId !== user?.id) {
      // If the broker is accessing a client profile, validate the relationship
      if (profile && profile.broker_id !== user?.id) {
        toast({
          title: t('dashboard.messages.errors.unauthorizedAccess'),
          description: t('dashboard.messages.errors.clientNotAssociated'),
          variant: "destructive",
        });
        navigate('/broker-dashboard');
      }
    }
  }, [profile, brokerProfile, profileLoading, brokerLoading, user?.id, clientId, navigate, t]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: t('clientProfile.messages.passwordMismatch'),
        variant: "destructive",
      });
      return;
    }

    try {
      // If broker is changing client's password
      if (brokerProfile && clientId !== user?.id) {
        const { error } = await supabase.auth.admin.updateUserById(
          clientId,
          { password: newPassword }
        );
        if (error) throw error;
      } else {
        // Client changing their own password
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) throw error;
      }

      toast({
        title: t('clientProfile.messages.passwordUpdateSuccess'),
      });
      
      setNewPassword('');
      setConfirmPassword('');

      // Redirect broker to broker dashboard after successfully changing password
      if (brokerProfile && clientId !== user?.id) {
        navigate('/broker-dashboard');
      }else{
        navigate(`/client/${clientId}`);
      }

    } catch (error) {
      console.error('Error updating password:', error);
      
      // Check if error is same_password
      const supabaseError = error as { code?: string; message?: string };
      if (supabaseError.code === 'same_password') {
        toast({
          title: t('clientProfile.messages.samePassword'),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('clientProfile.messages.passwordUpdateError'),
          description: supabaseError.message || '',
          variant: "destructive",
        });
      }
    }
  };

  if (profileLoading || brokerLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const canEdit = brokerProfile || clientId === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to={brokerProfile && clientId === user?.id ? '/broker-dashboard' : `/client/${clientId}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Link>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 space-y-8 border border-border">
          <h1 className="text-2xl font-semibold text-foreground">Troca de Senha</h1>

          {canEdit && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    {t('clientProfile.newPassword')}
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 rounded-lg transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    {t('clientProfile.confirmPassword')}
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-lg transition-colors"
                  />
                </div>

                {!isPasswordValid && (
                  <div className="text-sm text-red-500 text-center">
                    {getPasswordErrorMessage()}
                  </div>
                )}

                <div className="flex justify-center pt-4 border-t border-border">
                  <Button 
                    onClick={handlePasswordChange}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isPasswordValid}
                  >
                    {t('clientProfile.buttons.changePassword')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile; 