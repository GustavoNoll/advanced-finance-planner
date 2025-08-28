import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Target, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import CurrencyInput from 'react-currency-input-field';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CurrencyCode, getCurrencySymbol } from "@/utils/currency";

interface LinkedItem {
  id: string;
  type: 'goal' | 'event';
  name: string;
  allocatedAmount: number;
  isCompleting: boolean;
  icon: string;
}

interface SelectedItemCardProps {
  item: LinkedItem;
  onUpdate: (updates: Partial<LinkedItem>) => void;
  onRemove: () => void;
  currency: CurrencyCode;
}

const SelectedItemCard = ({ item, onUpdate, onRemove, currency }: SelectedItemCardProps) => {
  const { t } = useTranslation();
  const Icon = item.type === 'goal' ? Target : Calendar;

  // Form interno para o valor alocado
  const valueForm = useForm({
    defaultValues: {
      allocatedAmount: item.allocatedAmount
    }
  });

  // Atualizar o form quando o item mudar
  React.useEffect(() => {
    console.log(`SelectedItemCard: Atualizando allocatedAmount para ${item.name} (${item.type}): ${item.allocatedAmount}`);
    valueForm.setValue('allocatedAmount', item.allocatedAmount);
  }, [item.allocatedAmount, valueForm, item.name, item.type]);

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge variant={item.type === 'goal' ? 'default' : 'secondary'}>
            {item.type === 'goal' ? t('financialGoals.title') : t('events.title')}
          </Badge>
          <span className="font-medium">{item.name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const itemTypeText = item.type === 'goal' ? t('common.goal') : t('events.title_single');
            
            // Mensagem de confirmação baseada no status de completude
            let confirmMessage = '';
            if (item.isCompleting) {
              confirmMessage = `Tem certeza que deseja remover este ${itemTypeText.toLowerCase()}? Como o link é completo, o ${itemTypeText.toLowerCase()} será removido permanentemente. Esta ação não pode ser desfeita.`;
            } else {
              confirmMessage = `Tem certeza que deseja remover este vínculo? O ${itemTypeText.toLowerCase()} será mantido, apenas o vínculo será removido.`;
            }
            
            if (window.confirm(confirmMessage)) {
              onRemove();
            }
          }}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
          title={`${t('common.remove')} ${item.type === 'goal' ? t('common.goal') : t('events.title_single')}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormField
            control={valueForm.control}
            name="allocatedAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">{t('common.value')}</FormLabel>
                <FormControl>
                  <CurrencyInput
                    id="allocated-amount"
                    className={`flex h-9 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark] ${item.allocatedAmount < 0 ? 'text-red-600' : item.allocatedAmount > 0 ? 'text-green-600' : ''}`}
                    prefix={getCurrencySymbol(currency)}
                    groupSeparator="."
                    decimalSeparator=","
                    decimalsLimit={2}
                    allowNegativeValue={true}
                    value={field.value}
                    onValueChange={(value) => {
                      console.log(`CurrencyInput onValueChange: valor recebido = "${value}", item.allocatedAmount = ${item.allocatedAmount}`);
                      const numericValue = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
                      console.log(`CurrencyInput: valor numérico calculado = ${numericValue}`);
                      field.onChange(numericValue);
                      onUpdate({ allocatedAmount: numericValue });
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t('common.allowNegativeValues')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id={`completing-${item.id}`}
            checked={item.isCompleting}
            onCheckedChange={(checked) => onUpdate({ isCompleting: checked })}
          />
          <Label htmlFor={`completing-${item.id}`} className="text-sm">
            {t('common.complete')} {item.type === 'goal' ? t('financialGoals.title_single').toLowerCase() : t('events.title_single').toLowerCase()}
          </Label>
        </div>
      </div>
      
      {item.isCompleting && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
          ✅ {t('common.itemWillBeCompleted')}
        </div>
      )}
    </div>
  );
};

export default SelectedItemCard;
