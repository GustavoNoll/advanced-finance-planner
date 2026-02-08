// 1. Imports externos
import { useTranslation } from 'react-i18next'
import { Trash2, Pencil, Target, TrendingUp, TrendingDown, Calendar, Link as LinkIcon } from 'lucide-react'

// 2. Imports internos (shared)
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency, CurrencyCode } from '@/utils/currency'
import { eventIcons } from '@/constants/events'
import { useItemFinancialLinks } from '@/hooks/useItemFinancialLinks'

// 3. Imports internos (feature)
import { ProjectedEvent } from '@/types/financial'

interface EventCardProps { 
  event: ProjectedEvent
  currency: CurrencyCode
  isCompleted: boolean
  onDelete: () => void
  onEdit: () => void
}

export function EventCard({ event, currency, isCompleted, onDelete, onEdit }: EventCardProps) {
  const { t } = useTranslation();
  const { financialLinks, isLoading: linksLoading } = useItemFinancialLinks(event.id, 'event');
  
  const renderPaymentInfo = () => {
    if (event.payment_mode === 'none') {
      return null;
    }

    if (event.payment_mode === 'installment' && event.installment_count) {
      return (
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
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
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
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
    const Icon = eventIcons[event.icon as keyof typeof eventIcons] || eventIcons.other;
    return <Icon className={`h-6 w-6 ${event.asset_value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />;
  };

  const renderFinancialLinks = () => {
    if (linksLoading) {
      return (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {t("common.loading")}...
        </div>
      );
    }

    if (financialLinks.length === 0) {
      return null;
    }

    return (
      <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <LinkIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("common.linkedItems")} ({financialLinks.length})
          </span>
        </div>
        <div className="space-y-2">
          {financialLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">{link.record_date}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  link.is_completing 
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                }`}>
                  {link.is_completing ? t("common.completed") : t("common.partial")}
                </span>
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {formatCurrency(link.allocated_amount, currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-900 ${event.status === 'completed' ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className={`p-3 rounded-xl ${event.asset_value >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            {getEventIcon()}
          </div>
          <div>
            <p className="font-semibold text-lg text-gray-900 dark:text-white">{event.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t(`events.icons.${event.icon}`)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(event.year, event.month - 1)
                .toLocaleDateString(navigator.language, { month: 'long', year: 'numeric' })
                .replace(/^\w/, (c) => c.toUpperCase())}
            </p>
            <p className={`font-medium ${event.asset_value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {event.asset_value >= 0 ? '+' : ''}{formatCurrency(event.asset_value, currency)}
              {renderPaymentInfo()}
            </p>
            <span className={`inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full ${
              event.adjust_for_inflation !== false
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              {event.adjust_for_inflation !== false
                ? <><TrendingUp className="h-3 w-3" /> {t('common.inflationAdjusted')}</>
                : <><TrendingDown className="h-3 w-3" /> {t('common.noInflationAdjustment')}</>
              }
            </span>
            {renderFinancialLinks()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isCompleted && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-gray-600 dark:text-gray-400"
              title={t("common.edit")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors text-gray-600 dark:text-gray-400"
            title={t("common.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
} 