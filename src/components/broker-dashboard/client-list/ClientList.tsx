import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserProfileInvestment } from '@/types/broker-dashboard';

interface ClientListProps {
  clients: UserProfileInvestment[];
  onClientSelect: (clientId: string) => void;
}

/**
 * Displays a list of clients with their metrics and status indicators
 * @param clients - Array of client profiles
 * @param onClientSelect - Callback function when a client is selected
 */
export const ClientList = ({ clients, onClientSelect }: ClientListProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('brokerDashboard.search.results')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200">
          {clients.map((client) => (
            <div
              key={client.id}
              className="relative flex items-center py-4 cursor-pointer hover:bg-gray-50 px-4 -mx-4 transition-colors duration-200"
              onClick={() => onClientSelect(client.id)}
            >
              {client.monthly_return_rate !== undefined && client.monthly_return_rate !== null && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-medium text-green-600">
                          +{client.monthly_return_rate.toFixed(2)}%
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('brokerDashboard.client.monthlyReturnTooltip', { defaultValue: 'Porcentagem de retorno no último mês' })}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-lg font-semibold">
                    {client.profile_name ? client.profile_name[0].toUpperCase() : client.email[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {client.profile_name || t('common.notAvailable')}
                    </p>
                    {!client.investment_plan_id && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              {t('brokerDashboard.client.pendingPlan')}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('brokerDashboard.client.pendingPlanTooltip', { defaultValue: 'Cliente sem plano de investimento cadastrado' })}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {client.needs_plan_review && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              {t('brokerDashboard.client.outdatedRecord')}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {client.months_without_records
                                ? t('brokerDashboard.client.outdatedRecordTooltip', {
                                    defaultValue: 'Sem registros há {{months}} meses',
                                    months: client.months_without_records
                                  })
                                : t('brokerDashboard.client.neverRecordedTooltip', {
                                    defaultValue: 'Nunca registrado'
                                  })
                              }
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {client.has_low_returns && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                              {t('brokerDashboard.client.lowReturns')}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('brokerDashboard.client.lowReturnsTooltip', { defaultValue: 'Retornos abaixo de 0.5%' })}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {client.below_required_contribution && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              {t('brokerDashboard.client.belowRequiredContribution')}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('brokerDashboard.client.belowRequiredContributionTooltip', { defaultValue: 'Aportes abaixo do necessário' })}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{client.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400">{t('brokerDashboard.client.id')}: {client.id}</p>
                    {client.last_activity_date && (
                      <p className="text-xs text-gray-400">
                        {t('brokerDashboard.client.lastActivity')}: {new Date(client.last_activity_date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 