// 1. Imports externos
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, User, Calendar, Clock, Search, X, Share2, ChevronRight, Trash2, Calculator } from 'lucide-react'

// 2. Imports internos (shared)
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { useToast } from '@/shared/components/ui/use-toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { Avatar } from '@/shared/components/ui/avatar-initial'

// 3. Imports internos (feature)
import { UserProfileInvestment } from '@/types/broker-dashboard'

interface ClientListProps {
  clients: UserProfileInvestment[];
  onClientSelect: (clientId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  isSearching: boolean;
  onDeleteClient: (clientId: string) => Promise<void>;
}

/**
 * Displays a list of clients with their metrics and status indicators
 * @param clients - Array of client profiles
 * @param onClientSelect - Callback function when a client is selected
 * @param searchQuery - Current search query
 * @param onSearchChange - Callback function when search query changes
 * @param onClearSearch - Callback function to clear search
 * @param isSearching - Whether a search is in progress
 */
export function ClientList({ 
  clients, 
  onClientSelect, 
  searchQuery, 
  onSearchChange, 
  onClearSearch,
  isSearching,
  onDeleteClient
}: ClientListProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const handleShareClient = (clientId: string) => {
    const clientLoginUrl = `${window.location.origin}/client-login/${clientId}`;
    navigator.clipboard.writeText(clientLoginUrl);
    toast({
      title: t('common.success'),
      description: t('brokerDashboard.linkCopied'),
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    setClientToDelete(clientId);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    await onDeleteClient(clientToDelete);
    setClientToDelete(null);
  };

  return (
    <>
      <Card className="border-gray-100 dark:border-gray-800 bg-card">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-4">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Avatar 
                icon={User} 
                size="md" 
                variant="square"
                iconClassName="h-5 w-5"
                color="gray"
              />
              {t('brokerDashboard.search.results')}
            </CardTitle>
              <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg blur-sm group-hover:blur-md transition-all duration-300" />
               <div className="relative flex items-center">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                 <Input
                   placeholder={t('brokerDashboard.search.placeholder')}
                   value={searchQuery}
                   onChange={(e) => onSearchChange(e.target.value)}
                   className="pl-10 pr-10 h-11 bg-white/50 dark:bg-gray-900/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 group-hover:bg-white/80 dark:group-hover:bg-gray-900/80 text-foreground"
                 />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-primary/10 rounded-full transition-all duration-200"
                    onClick={onClearSearch}
                  >
                    <X className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                  </Button>
                )}
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {clients.length > 0 ? (
              clients.map((client) => (
                <div
                  key={client.id}
                   className="relative flex items-center py-4 px-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/60 transition-colors duration-200 group"
                  onClick={() => onClientSelect(client.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        initial={client.profile_name?.[0] || '?'}
                        size="md"
                        color="gray"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{client.profile_name}</p>
                          {!client.investment_plan_id && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="px-2 py-0.5 text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full ring-1 ring-yellow-200 dark:ring-yellow-800">
                                    {t('brokerDashboard.client.pendingPlan')}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t('brokerDashboard.client.pendingPlanTooltip')}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {client.needs_plan_review && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="px-2 py-0.5 text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full ring-1 ring-red-200 dark:ring-red-800">
                                    {t('brokerDashboard.client.outdatedRecord')}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {client.months_without_records
                                      ? t('brokerDashboard.client.outdatedRecordTooltip', { months: client.months_without_records })
                                      : t('brokerDashboard.client.neverRecordedTooltip')}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {client.has_low_returns && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="px-2 py-0.5 text-xs font-medium bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full ring-1 ring-orange-200 dark:ring-orange-800">
                                    {t('brokerDashboard.client.lowReturns')}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t('brokerDashboard.client.lowReturnsTooltip')}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {client.below_required_contribution && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="px-2 py-0.5 text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full ring-1 ring-red-200 dark:ring-red-800">
                                    {t('brokerDashboard.client.belowRequiredContribution')}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t('brokerDashboard.client.belowRequiredContributionTooltip')}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300 truncate">{client.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-400">{t('brokerDashboard.client.id')}: {client.id}</p>
                          {client.last_active_at ? (
                            <p className="text-xs text-gray-400">
                              {t('brokerDashboard.client.lastLogin')}: {new Date(client.last_active_at).toLocaleDateString('pt-BR')}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400">
                              {t('brokerDashboard.client.lastLogin')}: {t('brokerDashboard.client.never')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8" style={{marginRight: '10px'}}>
                    {client.monthly_return_rate !== undefined && client.monthly_return_rate !== null && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <p className="text-sm font-medium text-green-600">
                                +{client.monthly_return_rate.toFixed(2)}%
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('brokerDashboard.client.monthlyReturnTooltip')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {client.needs_plan_review && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
                              <Clock className="h-4 w-4" />
                              <p className="text-sm font-medium">Revisão</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('brokerDashboard.client.needsPlanReviewTooltip')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div className="flex items-center gap-8 ml-auto">
                    <div className="flex items-center gap-4">

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShareClient(client.id);
                              }}
                              className="h-8 w-8 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="flex flex-col gap-1 bg-white dark:bg-gray-900">
                            <p className="font-medium">{t('brokerDashboard.client.shareTooltip')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Clique para copiar o link</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleDeleteClick(e, client.id)}
                              className="h-8 w-8 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="flex flex-col gap-1 bg-white dark:bg-gray-900">
                            <p className="font-medium">{t('brokerDashboard.client.deleteTooltip')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('brokerDashboard.client.deleteWarning')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Avatar 
                    icon={Search} 
                    size="lg" 
                    color="gray"
                    iconClassName="h-6 w-6"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {t('brokerDashboard.search.noResults')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  {t('brokerDashboard.search.noResultsDescription')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('brokerDashboard.client.deleteClient.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('brokerDashboard.client.deleteClient.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
};