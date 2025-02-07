import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search } from 'lucide-react';

export const BrokerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchInitialUsers = async () => {
    setIsSearching(true);
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          profiles!inner(is_broker)
        `)
        .eq('profiles.is_broker', false)
        .order('email')
        .limit(10);

      if (error) throw error;
      
      setSearchResults(users || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
          profiles!inner(is_broker)
        `)
        .eq('profiles.is_broker', false)
        .ilike('email', `%${searchQuery}%`);

      if (error) throw error;
      
      setSearchResults(users || []);
    } catch (error: any) {
      toast({
        title: "Error",
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
          <h1 className="text-2xl font-bold">Broker Dashboard</h1>
          <Button onClick={() => navigate('/create-client')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Client
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
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
                          {user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-500">Client ID: {user.id}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      View Details →
                    </Button>
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
