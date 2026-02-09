// 1. Imports externos
import { useState, useEffect, useCallback } from 'react'

// 2. Imports internos (shared)
import { supabase } from '@/lib/supabase'

export interface ItemFinancialLink {
  id: string;
  financial_record_id: number;
  allocated_amount: number;
  is_completing: boolean;
  record_year: number;
  record_month: number;
  record_date: string; // Data formatada
}

export function useItemFinancialLinks(itemId: string, itemType: 'goal' | 'event') {
  const [financialLinks, setFinancialLinks] = useState<ItemFinancialLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItemFinancialLinks = useCallback(async () => {
    if (!itemId || !itemType) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar os links financeiros para este item
      const { data: links, error: fetchError } = await supabase
        .from('financial_record_links')
        .select(`
          id,
          financial_record_id,
          allocated_amount,
          is_completing
        `)
        .eq('item_id', itemId)
        .eq('item_type', itemType);

      if (fetchError) {
        console.error('Erro ao buscar links financeiros:', fetchError);
        setError('Erro ao carregar links financeiros');
        return;
      }

      if (!links || links.length === 0) {
        setFinancialLinks([]);
        return;
      }

      // Buscar os dados dos registros financeiros
      const recordIds = links.map(link => link.financial_record_id);
      const { data: records, error: recordsError } = await supabase
        .from('user_financial_records')
        .select('id, record_year, record_month')
        .in('id', recordIds);

      if (recordsError) {
        console.error('Erro ao buscar registros financeiros:', recordsError);
        setError('Erro ao carregar registros financeiros');
        return;
      }

      // Criar um mapa para facilitar o acesso aos registros
      const recordsMap = new Map(records?.map(record => [record.id, record]) || []);

      // Processar os dados dos links
      const processedLinks: ItemFinancialLink[] = links.map(link => {
        const record = recordsMap.get(link.financial_record_id);
        if (!record) {
          console.warn('Registro financeiro não encontrado para o link:', link.id);
          return null;
        }

        const date = new Date(record.record_year, record.record_month - 1);
        
        return {
          id: link.id,
          financial_record_id: link.financial_record_id,
          allocated_amount: link.allocated_amount,
          is_completing: link.is_completing,
          record_year: record.record_year,
          record_month: record.record_month,
          record_date: date.toLocaleDateString('pt-BR', { 
            month: 'short', 
            year: 'numeric' 
          })
        };
      }).filter((link): link is ItemFinancialLink => link !== null);

      // Ordenar por data (mais recente primeiro)
      processedLinks.sort((a, b) => {
        if (a.record_year !== b.record_year) {
          return b.record_year - a.record_year;
        }
        return b.record_month - a.record_month;
      });

      setFinancialLinks(processedLinks);
      
    } catch (err) {
      console.error('Erro ao buscar links financeiros:', err);
      setError('Erro inesperado ao carregar links');
    } finally {
      setIsLoading(false);
    }
  }, [itemId, itemType]);

  useEffect(() => {
    fetchItemFinancialLinks();
  }, [fetchItemFinancialLinks]);

  const refreshData = () => {
    fetchItemFinancialLinks();
  };

  return {
    financialLinks,
    isLoading,
    error,
    refreshData,
    clearError: () => setError(null)
  };
};
