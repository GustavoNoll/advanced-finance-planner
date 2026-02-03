// 1. Imports externos
import { useTranslation } from 'react-i18next'
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Target, 
  Users, 
  ArrowRight,
  Lightbulb,
  AlertCircle,
  Activity
} from 'lucide-react'

// 2. Imports internos (shared)
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'

// 3. Imports internos (feature)
import { ClientInsight } from '@/types/broker-dashboard'

interface ClientInsightsProps {
  insights: ClientInsight[];
  onClientSelect: (clientId: string) => void;
}

/**
 * Client insights component with AI-powered recommendations
 */
export function ClientInsights({ insights, onClientSelect }: ClientInsightsProps) {
  const { t } = useTranslation();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      default:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high_risk':
        return 'text-red-500';
      case 'medium_risk':
        return 'text-orange-500';
      case 'low_risk':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const formatLastActivity = (lastActivity: string) => {
    const date = new Date(lastActivity);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return t('brokerDashboard.insights.today');
    if (diffInDays === 1) return t('brokerDashboard.insights.yesterday');
    if (diffInDays < 7) return t('brokerDashboard.insights.daysAgo', { days: diffInDays });
    if (diffInDays < 30) return t('brokerDashboard.insights.weeksAgo', { weeks: Math.floor(diffInDays / 7) });
    return t('brokerDashboard.insights.monthsAgo', { months: Math.floor(diffInDays / 30) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('brokerDashboard.insights.title')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('brokerDashboard.insights.subtitle')}
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
          <Lightbulb className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <Card 
            key={insight.clientId} 
            className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group border-l-4 border-l-blue-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {insight.clientName}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={getRiskColor(insight.riskLevel)}>
                      {insight.riskLevel.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClientSelect(insight.clientId)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Engagement Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('brokerDashboard.insights.engagement')}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${getEngagementColor(insight.engagementScore)}`}>
                    {insight.engagementScore}/100
                  </span>
                </div>

                {/* Last Activity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('brokerDashboard.insights.lastActivity')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatLastActivity(insight.lastActivity)}
                  </span>
                </div>

                {/* Key Insights */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('brokerDashboard.insights.keyInsights')}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {insight.insights.slice(0, 2).map((insightText, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <div className="h-1 w-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        {insightText}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('brokerDashboard.insights.recommendations')}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {insight.recommendations.slice(0, 2).map((recommendation, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <div className="h-1 w-1 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onClientSelect(insight.clientId)}
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 dark:group-hover:bg-blue-900/20 dark:group-hover:border-blue-800 transition-colors duration-200"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {t('brokerDashboard.insights.viewClient')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {insights.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t('brokerDashboard.insights.noInsights')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('brokerDashboard.insights.noInsightsDescription')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
