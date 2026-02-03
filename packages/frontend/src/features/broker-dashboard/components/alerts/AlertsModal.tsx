import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { 
  AlertTriangle, 
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight,
  Users,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onClientSelect: (clientId: string) => void;
}

/**
 * Modal component to display all alerts in a detailed view
 */
export function AlertsModal({ isOpen, onClose, alerts, onClientSelect }: AlertsModalProps) {
  const { t } = useTranslation();

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

  const handleClientSelect = (clientId: string) => {
    onClientSelect(clientId);
    onClose();
  };

  const urgentCount = alerts.filter(a => a.type === 'urgent').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const infoCount = alerts.filter(a => a.type === 'info').length;
  const successCount = alerts.filter(a => a.type === 'success').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('brokerDashboard.alerts.allAlerts')}
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('brokerDashboard.alerts.allAlertsDescription')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Alert Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {urgentCount > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  {urgentCount} {t('brokerDashboard.alerts.urgent')}
                </p>
              </div>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  {warningCount} {t('brokerDashboard.alerts.warnings')}
                </p>
              </div>
            </div>
          )}
          {infoCount > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {infoCount} {t('brokerDashboard.alerts.info')}
                </p>
              </div>
            </div>
          )}
          {successCount > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  {successCount} {t('brokerDashboard.alerts.success')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Alerts List */}
        <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`relative overflow-hidden hover:shadow-md transition-all duration-200 group border-l-4 rounded-lg ${getAlertColor(alert.type)}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              <div className="relative z-10 p-4">
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
                        onClick={() => handleClientSelect(alert.clientId)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClientSelect(alert.clientId)}
                        className="w-full group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors duration-200"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        {alert.action}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t('brokerDashboard.alerts.noAlerts')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('brokerDashboard.alerts.noAlertsDescription')}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
