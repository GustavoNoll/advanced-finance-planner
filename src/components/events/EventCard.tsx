import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, Target, TrendingUp, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProjectedEvent } from "@/types/financial";
import { formatCurrency, CurrencyCode, getCurrencySymbol } from "@/utils/currency";

export const EventCard = ({ event, currency, onDelete, onToggleStatus }: { 
  event: ProjectedEvent; 
  currency: CurrencyCode;
  onDelete: () => void;
  onToggleStatus: () => void;
}) => {
  const { t } = useTranslation();
  
  const renderPaymentInfo = () => {
    if (event.payment_mode === 'none') {
      return null;
    }

    if (event.payment_mode === 'installment' && event.installment_count) {
      return (
        <span className="text-sm text-gray-500 ml-2">
          ({event.installment_count}x de {formatCurrency(Math.abs(event.asset_value) / event.installment_count, currency)}
          {event.installment_interval && event.installment_interval > 1 && (
            <span> {t('common.every')} {event.installment_interval} {t('common.months')}</span>
          )}
          )
        </span>
      );
    }

    if (event.payment_mode === 'repeat' && event.installment_count) {
      return (
        <span className="text-sm text-gray-500 ml-2">
          ({event.installment_count}x de {formatCurrency(Math.abs(event.asset_value), currency)}
          {event.installment_interval && event.installment_interval > 1 && (
            <span> {t('common.every')} {event.installment_interval} {t('common.months')}</span>
          )}
          )
        </span>
      );
    }

    return null;
  };

  const getEventIcon = () => {
    const iconColor = event.asset_value >= 0 ? 'text-green-600' : 'text-red-600';
    switch (event.icon) {
      case 'goal':
        return <Target className={`h-6 w-6 ${iconColor}`} />;
      case 'contribution':
        return <TrendingUp className={`h-6 w-6 ${iconColor}`} />;
      case 'other':
        return <Calendar className={`h-6 w-6 ${iconColor}`} />;
      default:
        return <Calendar className={`h-6 w-6 ${iconColor}`} />;
    }
  };
  
  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-200 ${event.status === 'completed' ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className={`p-3 rounded-xl ${event.asset_value >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            {getEventIcon()}
          </div>
          <div>
            <p className="font-semibold text-lg">{event.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {t(`events.icons.${event.icon}`)}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(event.year, event.month - 1)
                .toLocaleDateString(navigator.language, { month: 'long', year: 'numeric' })
                .replace(/^\w/, (c) => c.toUpperCase())}
            </p>
            <p className={`font-medium ${event.asset_value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {event.asset_value >= 0 ? '+' : ''}{formatCurrency(event.asset_value, currency)}
              {renderPaymentInfo()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleStatus}
            className="hover:bg-green-50 hover:text-green-500 transition-colors"
          >
            {event.status === 'completed' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Calendar className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}; 