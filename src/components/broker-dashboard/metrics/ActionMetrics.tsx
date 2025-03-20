import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DashboardMetrics } from '@/types/broker-dashboard';

interface ActionMetricsProps {
  metrics: DashboardMetrics;
}

/**
 * Displays action metrics including clients needing plan review, below required contribution, etc.
 * @param metrics - The dashboard metrics data
 */
export const ActionMetrics = ({ metrics }: ActionMetricsProps) => {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          {t('brokerDashboard.metrics.actions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <TooltipProvider>
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <p className="text-sm text-gray-500">{t('brokerDashboard.metrics.actions.needsPlanReview')}</p>
                    <p className="text-2xl font-bold text-yellow-600">{metrics.actions.needsPlanReview}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p>{t('brokerDashboard.metrics.wealthDistribution.tooltips.needsPlanReview')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <p className="text-sm text-gray-500">{t('brokerDashboard.metrics.actions.belowRequiredContribution')}</p>
                    <p className="text-2xl font-bold text-red-600">{metrics.actions.belowRequiredContribution}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p>{t('brokerDashboard.metrics.wealthDistribution.tooltips.belowRequiredContribution')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <p className="text-sm text-gray-500">{t('brokerDashboard.metrics.actions.nearRetirement')}</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.actions.nearRetirement}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p>{t('brokerDashboard.metrics.wealthDistribution.tooltips.nearRetirement')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <p className="text-sm text-gray-500">{t('brokerDashboard.metrics.actions.lowReturns')}</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics.actions.lowReturns}</p>
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
  );
}; 