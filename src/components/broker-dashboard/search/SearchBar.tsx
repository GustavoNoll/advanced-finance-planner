import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  isSearching: boolean;
}

/**
 * Displays a search bar with loading state and clear button
 * @param searchQuery - Current search query value
 * @param onSearchChange - Callback function when search query changes
 * @param onClearSearch - Callback function to clear the search
 * @param isSearching - Whether a search is in progress
 */
export const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch, 
  isSearching 
}: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative mb-8">
      <div className="relative">
        <Input
          placeholder={t('brokerDashboard.search.placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 h-12 bg-white shadow-sm rounded-xl border-gray-200 focus:border-primary focus:ring-primary transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isSearching ? (
            <Search className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={onClearSearch}
          >
            <span className="sr-only">Clear search</span>
            <X className="h-5 w-5 text-gray-400" />
          </Button>
        )}
      </div>
    </div>
  );
}; 