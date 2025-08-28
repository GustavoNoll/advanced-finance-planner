import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { goalIcons } from "@/constants/goals";
import { eventIcons } from "@/constants/events";
import { useLinkedItems, LinkedItem } from "@/hooks/useLinkedItems";
import { useTranslation } from "react-i18next";

interface LinkedItemsDisplayProps {
  financialRecordId: number;
  currency: string;
  refreshKey?: number;
}

const LinkedItemsDisplay = ({ financialRecordId, currency, refreshKey }: LinkedItemsDisplayProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { linkedItems, isLoading, error, removeLink, refreshData } = useLinkedItems(financialRecordId, refreshKey);

  // Função para forçar refresh dos dados
  const forceRefresh = () => {
    console.log('Forçando refresh dos dados para o registro:', financialRecordId);
    refreshData();
  };

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{t('common.error')}: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  const handleRemoveLink = async (linkId: string, itemType: 'goal' | 'event', itemId: string, isCompleting: boolean) => {
    const itemTypeText = itemType === 'goal' ? t('common.goal') : t('common.event');
    
    // Mensagem de confirmação baseada no tipo de link
    let confirmMessage = '';
    if (isCompleting) {
      confirmMessage = `Tem certeza que deseja remover este ${itemTypeText.toLowerCase()}? Como o link é completo, o ${itemTypeText.toLowerCase()} será removido permanentemente. Esta ação não pode ser desfeita.`;
    } else {
      confirmMessage = `Tem certeza que deseja remover este vínculo? O ${itemTypeText.toLowerCase()} será mantido, apenas o vínculo será removido.`;
    }
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    const success = await removeLink(linkId, itemType, itemId, isCompleting);
    if (success) {
      const actionText = isCompleting ? 'vínculo e item removidos' : 'vínculo removido';
      console.log(`${actionText} com sucesso`);
    }
  };

  // Mostrar loading se estiver carregando
  if (isLoading) {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t('common.linkedItems')}
          </h4>
        </div>
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  // Mostrar mensagem se não houver itens
  if (linkedItems.length === 0) {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t('common.linkedItems')} (0)
          </h4>
        </div>
        <p className="text-sm text-muted-foreground">{t('common.noLinkedItems')}</p>
      </div>
    );
  }

  const totalAllocated = linkedItems.reduce((sum, item) => sum + item.allocated_amount, 0);

  return (
    <div className="mt-4 pt-4 border-t border-border" data-record-id={financialRecordId}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t('common.linkedItems')} ({linkedItems.length})
          </h4>
          <Badge variant="outline" className="text-xs">
            Total: {totalAllocated >= 0 ? '+' : ''}{totalAllocated.toLocaleString('pt-BR', { 
              style: 'currency', 
              currency: currency || 'BRL' 
            })}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 px-2 text-xs"
        >
          {isExpanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {linkedItems.map((item) => {
            const Icon = item.item_type === 'goal' 
              ? goalIcons[item.item_icon as keyof typeof goalIcons] || goalIcons.other
              : eventIcons[item.item_icon as keyof typeof eventIcons] || eventIcons.other;

            return (
              <div key={item.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <Badge variant={item.item_type === 'goal' ? 'default' : 'secondary'} className="text-xs">
                      {item.item_type === 'goal' ? t('common.goal') : t('common.event')}
                    </Badge>
                    <span className="text-sm font-medium">{item.item_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    item.allocated_amount < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {item.allocated_amount >= 0 ? '+' : ''}{item.allocated_amount.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: currency || 'BRL' 
                    })}
                  </span>
                  {item.is_completing && (
                    <Badge variant="default" className="text-xs bg-green-600">
                      ✅ {t('common.completed')}
                    </Badge>
                  )}
                  {item.item_payment_mode === 'installment' && item.item_installment_count && (
                    <Badge variant="outline" className="text-xs">
                      {item.item_installment_count}x
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLink(item.id, item.item_type, item.item_id, item.is_completing)}
                    className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                    title={`${t('common.remove')} ${item.item_type === 'goal' ? t('common.goal') : t('common.event')}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LinkedItemsDisplay;
