import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Info, Minus } from "lucide-react";
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
    },
    mode: 'onChange'
  });

  // Atualizar o form quando o item mudar
  React.useEffect(() => {
    valueForm.setValue('allocatedAmount', item.allocatedAmount);
  }, [item.allocatedAmount, valueForm, item.name, item.type]);

  return (
    <div 
      className="border rounded-lg p-4 bg-card"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge variant={item.type === 'goal' ? 'default' : 'secondary'}>
            {item.type === 'goal' ? t('financialGoals.title') : t('events.title')}
          </Badge>
          <span className="font-medium">{item.name}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
          title={`${t('common.deselect')} ${item.type === 'goal' ? t('common.goal') : t('events.title_single')}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormField
            control={valueForm.control}
            name="allocatedAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">{t('common.paidAmount')}</FormLabel>
                <FormControl>
                  <CurrencyInput
                    id="allocated-amount"
                    className={`flex h-9 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark] ${(() => { const displayed = item.type === 'goal' ? -Math.abs(Number(field.value || 0)) : Number(field.value || 0); return displayed < 0 ? 'text-red-600' : displayed > 0 ? 'text-green-600' : '' })()}`}
                    prefix={getCurrencySymbol(currency)}
                    groupSeparator="."
                    decimalSeparator="," 
                    decimalsLimit={2}
                    allowNegativeValue={true}
                    value={item.type === 'goal' ? -Math.abs(Number(field.value || 0)) : Number(field.value || 0)}
                    onValueChange={(value) => {
                      const raw = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
                      const coerced = item.type === 'goal' ? -Math.abs(raw) : raw;
                      field.onChange(coerced);
                      onUpdate({ allocatedAmount: coerced });
                    }}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('common.paidAmountHelp', { type: item.type === 'goal' ? t('common.goal').toLowerCase() : t('events.title_single').toLowerCase() })}
                </p>
              </FormItem>
            )}
          />
          <p className="text-xs text-muted-foreground mt-1">{item.type === 'goal' ? t('common.goalsAlwaysNegative') : t('common.allowNegativeValues')}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id={`completing-${item.id}`}
            checked={item.isCompleting}
            onCheckedChange={(checked) => onUpdate({ isCompleting: checked })}
          />
          <div className="flex items-center gap-2">
            <Label htmlFor={`completing-${item.id}`} className="text-sm">
              {t('common.complete')} {item.type === 'goal' ? t('financialGoals.title_single').toLowerCase() : t('events.title_single').toLowerCase()}
            </Label>
            <div className="relative group">
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto w-80 z-50 border">
                <div className="font-medium mb-2">{t('common.completeExplanation.title')}</div>
                <div className="mb-2">{t('common.completeExplanation.description')}</div>
                <ul className="list-disc list-inside mb-2 space-y-1">
                  {(t('common.completeExplanation.steps', { returnObjects: true }) as string[]).map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
                <div className="text-muted-foreground italic">{t('common.completeExplanation.note')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {item.isCompleting && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
          <div className="flex items-start gap-2">
            <div className="text-green-600 mt-0.5">✅</div>
            <div>
              <div className="font-medium">{t('common.completeExplanation.completedStatus')}</div>
              <div className="text-xs text-green-700 mt-1">
                {t('common.completeExplanation.completedDescription')}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!item.isCompleting && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <div className="text-blue-600 mt-0.5">⏳</div>
            <div>
              <div className="font-medium">{t('common.completeExplanation.pendingStatus')}</div>
              <div className="text-xs text-blue-700 mt-1">
                {t('common.completeExplanation.pendingDescription')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedItemCard;
