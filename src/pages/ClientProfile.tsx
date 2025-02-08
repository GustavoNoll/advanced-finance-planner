import { useState } from 'react';
import { useAuth } from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

const ClientProfile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const params = useParams();
  const clientId = params.id || user?.id;
  
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', clientId],
    queryFn: async () => {
      if (!clientId) return null;

      // Get user email using the admin API
      const { data: { user: userData }, error: userError } = await supabase.auth.admin.getUserById(clientId);

      if (userError) {
        console.error('Error fetching user email:', userError);
      }

      // Then get the profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      setFullName(data.name || '');
      setBirthDate(data.birth_date || '');
      return { ...data, email: userData?.email };
    },
    enabled: !!clientId,
  });

  const { data: brokerProfile } = useQuery({
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

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: fullName,
          birth_date: birthDate,
        })
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: t('clientProfile.messages.profileUpdateSuccess'),
      });
      setIsEditing(false);
      refetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('clientProfile.messages.profileUpdateError'),
        variant: "destructive",
      });
    }
  };

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
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: t('clientProfile.messages.passwordUpdateError'),
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const canEdit = brokerProfile || clientId === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to={brokerProfile && clientId === user?.id ? '/broker-dashboard' : `/client/${clientId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
          <h1 className="text-2xl font-semibold text-gray-900">{t('clientProfile.title')}</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">{t('clientProfile.profileSection')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('clientProfile.email')}
                  </label>
                  <Input value={profile.email} disabled className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('clientProfile.fullName')}
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!isEditing || !canEdit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('clientProfile.birthDate')}
                  </label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    disabled={!isEditing || !canEdit}
                  />
                </div>

                {canEdit && (
                  !isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      {t('clientProfile.buttons.edit')}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile}>
                        {t('clientProfile.buttons.save')}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        {t('clientProfile.buttons.cancel')}
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>

            {canEdit && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-medium mb-4">{t('clientProfile.passwordSection')}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('clientProfile.newPassword')}
                    </label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('clientProfile.confirmPassword')}
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button onClick={handlePasswordChange}>
                    {t('clientProfile.buttons.changePassword')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile; 