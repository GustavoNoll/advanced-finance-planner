import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { DashboardMetrics } from '@/types/broker-dashboard';
import { Avatar } from '@/shared/components/ui/avatar-initial';

interface ActionMetricsProps {
  metrics: DashboardMetrics;
}

/**
 * Displays action metrics including clients needing plan review, below required contribution, etc.
 * @param metrics - The dashboard metrics data
 */
export function ActionMetrics({ metrics }: ActionMetricsProps) {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-100 dark:border-gray-800 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Avatar 
            icon={AlertTriangle} 
            size="md" 
            variant="square"
            iconClassName="h-5 w-5"
            color="yellow"
          />
          {t('brokerDashboard.metrics.actions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <TooltipProvider>
            <div className="space-y-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help group">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t('brokerDashboard.metrics.actions.needsPlanReview')}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-yellow-600">{metrics.actions.needsPlanReview}</p>
                      <div className="h-2 w-2 rounded-full bg-yellow-500 group-hover:bg-yellow-400 transition-colors"></div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p>{t('brokerDashboard.metrics.wealthDistribution.tooltips.needsPlanReview')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="space-y-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help group">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t('brokerDashboard.metrics.actions.belowRequiredContribution')}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-red-600">{metrics.actions.belowRequiredContribution}</p>
                      <div className="h-2 w-2 rounded-full bg-red-500 group-hover:bg-red-400 transition-colors"></div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p>{t('brokerDashboard.metrics.wealthDistribution.tooltips.belowRequiredContribution')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="space-y-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help group">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t('brokerDashboard.metrics.actions.nearRetirement')}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-blue-600">{metrics.actions.nearRetirement}</p>
                      <div className="h-2 w-2 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors"></div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p>{t('brokerDashboard.metrics.wealthDistribution.tooltips.nearRetirement')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="space-y-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help group">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t('brokerDashboard.metrics.actions.lowReturns')}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-orange-600">{metrics.actions.lowReturns}</p>
                      <div className="h-2 w-2 rounded-full bg-orange-500 group-hover:bg-orange-400 transition-colors"></div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p>{t('brokerDashboard.metrics.wealthDistribution.tooltips.lowReturns')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
} 