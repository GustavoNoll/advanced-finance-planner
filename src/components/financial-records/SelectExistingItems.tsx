import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { goalIcons } from "@/constants/goals";
import { eventIcons } from "@/constants/events";
import { useTranslation } from "react-i18next";
import { CurrencyCode, formatCurrency } from "@/utils/currency";

interface Goal {
  id: string;
  name: string;
  icon: string;
  asset_value: number;
  status: string;
  payment_mode: 'none' | 'installment' | 'repeat';
  installment_count?: number;
  installment_interval?: number;
}

interface Event {
  id: string;
  name: string;
  icon: string;
  asset_value: number;
  status: string;
  payment_mode: 'none' | 'installment' | 'repeat';
  installment_count?: number;
  installment_interval?: number;
}

interface SelectExistingItemsProps {
  onSelect: (item: (Goal | Event) & { type: 'goal' | 'event' }) => void;
  selectedItems: Array<{ id: string }>;
  userId: string;
  currency: CurrencyCode;
}

const SelectExistingItems = ({ onSelect, selectedItems, userId, currency }: SelectExistingItemsProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [selectedItems]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      // Buscar goals não selecionados
      const { data: goalsData } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('profile_id', userId)
        .eq('status', 'pending');

      // Buscar events não selecionados
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('profile_id', userId)
        .eq('status', 'pending');

      setGoals(goalsData || []);
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableItems = [
    ...goals.map(g => ({ ...g, type: 'goal' as const })),
    ...events.map(e => ({ ...e, type: 'event' as const }))
  ];

  const filteredItems = availableItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-2">
        {filteredItems.map(item => {
          const Icon = item.type === 'goal' 
            ? goalIcons[item.icon as keyof typeof goalIcons] || goalIcons.other
            : eventIcons[item.icon as keyof typeof eventIcons] || eventIcons.other;
          
          return (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <Badge variant={item.type === 'goal' ? 'default' : 'secondary'}>
                    {item.type === 'goal' ? t('financialGoals.title_single') : t('events.title_single')}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className={item.type === 'goal' ? 'text-red-600' : 'text-green-600'}>
                      {item.type === 'goal' ? '-' : '+'} {formatCurrency(item.asset_value, currency)}
                    </p>
                    {item.payment_mode !== 'none' && (
                      <div className="flex items-center gap-2 text-xs">
                        {item.payment_mode === 'installment' && (
                          <>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {t('financialGoals.form.installmentMode')}
                            </span>
                            {item.installment_count && (
                              <span>
                                {item.installment_count} {item.installment_count === 1 ? t('common.month') : t('common.months')}
                              </span>
                            )}
                            {item.installment_interval && item.installment_interval > 1 && (
                              <span>
                                {t('common.every')} {item.installment_interval} {t('common.months')}
                              </span>
                            )}
                          </>
                        )}
                        {item.payment_mode === 'repeat' && (
                          <>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {t('financialGoals.form.repeatMode')}
                            </span>
                            {item.installment_count && (
                              <span>
                                {item.installment_count} {item.installment_count === 1 ? t('common.month') : t('common.months')}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => onSelect(item)}
                disabled={selectedItems.some(s => s.id === item.id)}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t('common.select')}
              </Button>
            </div>
          );
        })}
        
        {filteredItems.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground py-4">
            {t('common.noItemsFound')}
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectExistingItems;
