
import { useState } from 'react';
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .eq('is_broker', false);

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
              <div className="divide-y">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="py-4 cursor-pointer hover:bg-gray-50 px-4 -mx-4"
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
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
