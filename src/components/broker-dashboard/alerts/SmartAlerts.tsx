import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  Target, 
  Users, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserProfileInvestment } from '@/types/broker-dashboard';
import { AlertsModal } from './AlertsModal';
import { useState } from 'react';

interface SmartAlertsProps {
  clients: UserProfileInvestment[];
  onClientSelect: (clientId: string) => void;
}

interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  action: string;
  timestamp: string;
}

/**
 * Smart alerts component with AI-powered client monitoring
 */
export const SmartAlerts = ({ clients, onClientSelect }: SmartAlertsProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate alerts based on client data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    clients.forEach(client => {
      // Multiple urgent conditions - create specific alerts
      const urgentConditions = [];
      
      // Warning: No investment plan
      if (!client.investment_plan_id) {
        urgentConditions.push('no_plan');
      }
      
      // Urgent: Has plan but no financial records
      if (client.investment_plan_id && (!client.total_records || client.total_records === 0)) {
        urgentConditions.push('no_records');
      }
      
      // Urgent: Contributing below required (only if client has records)
      if (client.below_required_contribution && client.total_records && client.total_records > 0) {
        urgentConditions.push('below_contribution');
      }
      
      // Urgent: Near retirement and below contribution (only if client has records)
      if (client.near_retirement && client.below_required_contribution && client.total_records && client.total_records > 0) {
        urgentConditions.push('retirement_contribution');
      }
      
      // Urgent: Very low engagement (risk of churn)
      if (client.engagement_score && client.engagement_score < 20) {
        urgentConditions.push('very_low_engagement');
      }

      // Create specific urgent alerts
      if (urgentConditions.includes('no_plan')) {
        alerts.push({
          id: `warning-no-plan-${client.id}`,
          type: 'warning',
          title: t('brokerDashboard.alerts.urgentNoPlan'),
          description: t('brokerDashboard.alerts.urgentNoPlanDescription', { 
            name: client.profile_name
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.createPlan'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      if (urgentConditions.includes('no_records')) {
        alerts.push({
          id: `urgent-no-records-${client.id}`,
          type: 'urgent',
          title: t('brokerDashboard.alerts.urgentNoRecords'),
          description: t('brokerDashboard.alerts.urgentNoRecordsDescription', { 
            name: client.profile_name
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.setupRecords'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      if (urgentConditions.includes('below_contribution')) {
        alerts.push({
          id: `urgent-below-contribution-${client.id}`,
          type: 'urgent',
          title: t('brokerDashboard.alerts.urgentBelowContribution'),
          description: t('brokerDashboard.alerts.urgentBelowContributionDescription', { 
            name: client.profile_name
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.reviewContribution'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      if (urgentConditions.includes('retirement_contribution')) {
        alerts.push({
          id: `urgent-retirement-${client.id}`,
          type: 'urgent',
          title: t('brokerDashboard.alerts.urgentRetirement'),
          description: t('brokerDashboard.alerts.urgentRetirementDescription', { 
            name: client.profile_name,
            years: client.years_to_retirement 
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.reviewRetirementPlan'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      if (urgentConditions.includes('very_low_engagement')) {
        alerts.push({
          id: `urgent-engagement-${client.id}`,
          type: 'urgent',
          title: t('brokerDashboard.alerts.urgentLowEngagement'),
          description: t('brokerDashboard.alerts.urgentLowEngagementDescription', { 
            name: client.profile_name,
            score: client.engagement_score 
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.contactImmediately'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      // High volatility warning
      if (client.return_volatility && client.return_volatility > 0.15) {
        alerts.push({
          id: `volatility-${client.id}`,
          type: 'warning',
          title: t('brokerDashboard.alerts.highVolatility'),
          description: t('brokerDashboard.alerts.highVolatilityDescription', { 
            name: client.profile_name,
            volatility: client.return_volatility ? (client.return_volatility * 100).toFixed(2) : '0'
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.rebalancePortfolio'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      // Low engagement alerts
      if (client.engagement_score && client.engagement_score < 40 && client.engagement_score >= 20) {
        alerts.push({
          id: `engagement-${client.id}`,
          type: 'warning',
          title: t('brokerDashboard.alerts.lowEngagement'),
          description: t('brokerDashboard.alerts.lowEngagementDescription', { 
            name: client.profile_name,
            score: client.engagement_score 
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.boostEngagement'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      // Near retirement alerts
      if (client.near_retirement) {
        alerts.push({
          id: `retirement-${client.id}`,
          type: 'info',
          title: t('brokerDashboard.alerts.nearRetirement'),
          description: t('brokerDashboard.alerts.nearRetirementDescription', { 
            name: client.profile_name,
            years: client.years_to_retirement 
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.reviewPlan'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      // Below required contribution alerts (only if client has records)
      if (client.below_required_contribution && client.total_records && client.total_records > 0) {
        alerts.push({
          id: `contribution-${client.id}`,
          type: 'warning',
          title: t('brokerDashboard.alerts.belowContribution'),
          description: t('brokerDashboard.alerts.belowContributionDescription', { 
            name: client.profile_name 
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.adjustContribution'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      // Low returns alerts
      if (client.has_low_returns && client.average_monthly_return_rate && client.average_monthly_return_rate < 0.5) {
        alerts.push({
          id: `returns-${client.id}`,
          type: 'warning',
          title: t('brokerDashboard.alerts.lowReturns'),
          description: t('brokerDashboard.alerts.lowReturnsDescription', { 
            name: client.profile_name,
            rate: (client.average_monthly_return_rate * 100).toFixed(2)
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.optimizeStrategy'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }

      // High volatility alerts
      if (client.return_volatility && client.return_volatility > 0.1) {
        alerts.push({
          id: `volatility-${client.id}`,
          type: 'info',
          title: t('brokerDashboard.alerts.highVolatility'),
          description: t('brokerDashboard.alerts.highVolatilityDescription', { 
            name: client.profile_name,
            volatility: (client.return_volatility * 100).toFixed(2)
          }),
          clientId: client.id,
          clientName: client.profile_name,
          action: t('brokerDashboard.alerts.reviewRisk'),
          timestamp: client.last_activity_date || client.profile_created_at || ''
        });
      }
    });

    // Sort by priority and timestamp
    return alerts.sort((a, b) => {
      const priorityOrder = { urgent: 0, warning: 1, info: 2, success: 3 };
      if (priorityOrder[a.type] !== priorityOrder[b.type]) {
        return priorityOrder[a.type] - priorityOrder[b.type];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  };

  const alerts = generateAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'warning':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'info':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('brokerDashboard.alerts.justNow');
    if (diffInHours < 24) return t('brokerDashboard.alerts.hoursAgo', { hours: diffInHours });
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return t('brokerDashboard.alerts.daysAgo', { days: diffInDays });
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('brokerDashboard.alerts.title')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('brokerDashboard.alerts.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {alerts.filter(a => a.type === 'urgent').length} {t('brokerDashboard.alerts.urgent')}
          </Badge>
          {alerts.length > 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {t('brokerDashboard.alerts.viewAll')} ({alerts.length})
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 3).map((alert) => (
          <Card 
            key={alert.id} 
            className={`relative overflow-hidden hover:shadow-md transition-all duration-200 group border-l-4 ${getAlertColor(alert.type)}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            <CardContent className="relative z-10 p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {t('brokerDashboard.alerts.client')}: {alert.clientName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onClientSelect(alert.clientId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onClientSelect(alert.clientId)}
                      className="w-full group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors duration-200"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {alert.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t('brokerDashboard.alerts.noAlerts')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('brokerDashboard.alerts.noAlertsDescription')}
            </p>
          </CardContent>
        </Card>
      )}


      {/* Alerts Modal */}
      <AlertsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alerts={alerts}
        onClientSelect={onClientSelect}
      />
    </div>
  );
};
