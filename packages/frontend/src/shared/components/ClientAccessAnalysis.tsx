// 1. Imports externos
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3, Users } from 'lucide-react'

// 2. Imports internos (shared)
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

// Modern color palette
const MODERN_COLORS = {
  primary: '#6366f1', // Indigo
  secondary: '#8b5cf6', // Violet
  success: '#10b981', // Emerald
  warning: '#f59e0b', // Amber
  danger: '#ef4444', // Red
  info: '#06b6d4', // Cyan
  purple: '#a855f7', // Purple
  pink: '#ec4899', // Pink
  blue: '#3b82f6', // Blue
  green: '#22c55e', // Green
  orange: '#f97316', // Orange
  teal: '#14b8a6', // Teal
};

export interface ClientAccessData {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  brokerName: string;
  daysSinceLogin: number;
}

interface ClientAccessAnalysisProps {
  clientAccessData: ClientAccessData[];
  title?: string;
  showTitle?: boolean;
}

export function ClientAccessAnalysis({ 
  clientAccessData, 
  title,
  showTitle = true 
}: ClientAccessAnalysisProps) {
  const { t } = useTranslation();

  const displayTitle = title || t('adminDashboard.clientAccessAnalysis.title');

  return (
    <div className="mb-8">
      {showTitle && (
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {displayTitle}
        </h2>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Status Distribution */}
        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">
                  {t('adminDashboard.clientAccessAnalysis.activityStatus.title')}
                </span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {t('adminDashboard.clientAccessAnalysis.activityStatus.description')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { 
                    status: t('adminDashboard.clientAccessAnalysis.activityStatus.today'), 
                    count: clientAccessData.filter(c => c.daysSinceLogin === 0).length,
                    color: MODERN_COLORS.success
                  },
                  { 
                    status: t('adminDashboard.clientAccessAnalysis.activityStatus.thisWeek'), 
                    count: clientAccessData.filter(c => c.daysSinceLogin > 0 && c.daysSinceLogin <= 7).length,
                    color: MODERN_COLORS.info
                  },
                  { 
                    status: t('adminDashboard.clientAccessAnalysis.activityStatus.thisMonth'), 
                    count: clientAccessData.filter(c => c.daysSinceLogin > 7 && c.daysSinceLogin <= 30).length,
                    color: MODERN_COLORS.warning
                  },
                  { 
                    status: t('adminDashboard.clientAccessAnalysis.activityStatus.inactive'), 
                    count: clientAccessData.filter(c => c.daysSinceLogin > 30).length,
                    color: MODERN_COLORS.danger
                  }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis 
                    dataKey="status" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      return (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{label}</p>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Clientes: <span className="font-semibold text-slate-900 dark:text-slate-100">{payload[0].value}</span>
                            </p>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={MODERN_COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Access Summary Metrics */}
        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">
                  {t('adminDashboard.clientAccessAnalysis.accessSummary.title')}
                </span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {t('adminDashboard.clientAccessAnalysis.accessSummary.description')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.clientAccessAnalysis.accessSummary.totalClients')}
                </span>
                <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {clientAccessData.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.clientAccessAnalysis.accessSummary.accessedToday')}
                </span>
                <span className="text-lg font-semibold text-green-600">
                  {clientAccessData.filter(c => c.daysSinceLogin === 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.clientAccessAnalysis.accessSummary.accessedThisWeek')}
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  {clientAccessData.filter(c => c.daysSinceLogin <= 7).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.clientAccessAnalysis.accessSummary.inactive30Days')}
                </span>
                <span className="text-lg font-semibold text-red-600">
                  {clientAccessData.filter(c => c.daysSinceLogin > 30).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
