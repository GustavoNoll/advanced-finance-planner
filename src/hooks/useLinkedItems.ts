import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface LinkedItem {
  id: string;
  item_type: 'goal' | 'event';
  allocated_amount: number;
  is_completing: boolean;
  item_name: string;
  item_icon: string;
  item_payment_mode: string;
  item_installment_count?: number;
  item_id: string; // ID do objetivo/evento para poder atualizar o status
}

export const useLinkedItems = (financialRecordId: number, refreshKey?: number) => {
  const [linkedItems, setLinkedItems] = useState<LinkedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinkedItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      
      // Primeiro, buscar os links
      const { data: links, error: fetchError } = await supabase
        .from('financial_record_links')
        .select('*')
        .eq('financial_record_id', financialRecordId);


      if (fetchError) {
        console.error('Erro ao buscar itens vinculados:', fetchError);
        setError('Erro ao carregar itens vinculados');
        return;
      }

      // Processar os dados dos links
      const processedItems: LinkedItem[] = [];
      
      for (const link of links) {
        try {
          let itemData;
          
          if (link.item_type === 'goal') {
            // Buscar dados do objetivo
            const { data: goal, error: goalError } = await supabase
              .from('financial_goals')
              .select('name, icon, payment_mode, installment_count')
              .eq('id', link.item_id)
              .single();
              
            if (goalError || !goal) {
              console.warn('Objetivo não encontrado para o link:', link.id, goalError);
              continue;
            }
            
            itemData = goal;
          } else if (link.item_type === 'event') {
            // Buscar dados do evento
            const { data: event, error: eventError } = await supabase
              .from('events')
              .select('name, icon, payment_mode, installment_count')
              .eq('id', link.item_id)
              .single();
              
            if (eventError || !event) {
              console.warn('Evento não encontrado para o link:', link.id, eventError);
              continue;
            }
            
            itemData = event;
          } else {
            console.warn('Tipo de item inválido:', link.item_type);
            continue;
          }
          
          processedItems.push({
            id: link.id,
            item_type: link.item_type,
            allocated_amount: link.allocated_amount,
            is_completing: link.is_completing,
            item_name: itemData.name,
            item_icon: itemData.icon,
            item_payment_mode: itemData.payment_mode || 'none',
            item_installment_count: itemData.installment_count,
            item_id: link.item_id
          });
          
        } catch (error) {
          console.error('Erro ao processar link:', link.id, error);
          continue;
        }
      }

      setLinkedItems(processedItems);
      
    } catch (err) {
      console.error('Erro ao buscar itens vinculados:', err);
      setError('Erro inesperado ao carregar itens');
    } finally {
      setIsLoading(false);
    }
  };

  const removeLink = async (linkId: string, itemType: 'goal' | 'event', itemId: string, isCompleting: boolean) => {
    try {
      
      // 1. Remover o vínculo
      const { error: deleteError } = await supabase
        .from('financial_record_links')
        .delete()
        .eq('id', linkId);

      if (deleteError) {
        console.error('Erro ao deletar vínculo:', deleteError);
        throw new Error('Falha ao remover vínculo');
      }

    

      // 2. Se o link for completo (is_completing = true), remover o objetivo/evento também
      if (isCompleting) {
    
        
        const tableName = itemType === 'goal' ? 'financial_goals' : 'events';
        const { error: deleteItemError } = await supabase
          .from(tableName)
          .delete()
          .eq('id', itemId);

        if (deleteItemError) {
          console.error('Erro ao deletar item:', deleteItemError);
          throw new Error('Falha ao remover item');
        }
      }

      // 3. Recarregar a lista
      await fetchLinkedItems();
      

      return true;
      
    } catch (err) {
      console.error('Erro ao remover vínculo/item:', err);
      setError(err instanceof Error ? err.message : 'Erro ao remover vínculo/item');
      return false;
    }
  };

  useEffect(() => {
    if (financialRecordId) {
      fetchLinkedItems();
    }
  }, [financialRecordId, refreshKey]);



  // Função para forçar refresh dos dados
  const refreshData = () => {
    if (financialRecordId) {
      fetchLinkedItems();
    }
  };

  return {
    linkedItems,
    isLoading,
    error,
    fetchLinkedItems,
    removeLink,
    refreshData,
    clearError: () => setError(null)
  };
};
