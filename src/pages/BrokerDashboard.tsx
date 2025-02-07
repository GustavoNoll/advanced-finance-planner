import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BrokerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchInitialUsers = async () => {
    setIsSearching(true);
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          profiles!inner(
            is_broker,
            name
          ),
          investment_plans(id)
        `)
        .eq('profiles.is_broker', false)
        .order('email')
        .limit(10);

      console.log(users);
      if (error) throw error;
      
      setSearchResults(users || []);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchInitialUsers();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return fetchInitialUsers();
    }
    
    setIsSearching(true);
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          profiles!inner(
            is_broker,
            name
          ),
          investment_plans(id)
        `)
        .eq('profiles.is_broker', false)
        .or(`email.ilike.%${searchQuery}%,profiles.name.ilike.%${searchQuery}%`);

      if (error) throw error;
      
      setSearchResults(users || []);
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = (userId: string) => {
    navigate(`/client/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t('brokerDashboard.title')}</h1>
          <Button onClick={() => navigate('/create-client')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('brokerDashboard.buttons.newClient')}
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('brokerDashboard.search.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder={t('brokerDashboard.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                {isSearching ? t('brokerDashboard.search.searching') : t('brokerDashboard.search.button')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('brokerDashboard.search.results')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-200">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 px-4 -mx-4 transition-colors duration-200"
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-lg font-semibold">
                          {user.profiles.name ? user.profiles.name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {user.profiles.name || t('common.notAvailable')}
                          </p>
                          {user.investment_plans.length === 0 && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              {t('brokerDashboard.client.pendingPlan')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{t('brokerDashboard.client.id')}: {user.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
