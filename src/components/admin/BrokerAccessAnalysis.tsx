import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3, Users, Briefcase } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { BrokerAccessData } from '@/hooks/useAccessData'

const MODERN_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#a855f7',
  pink: '#ec4899',
  blue: '#3b82f6',
  green: '#22c55e',
  orange: '#f97316',
  teal: '#14b8a6',
}

interface BrokerAccessAnalysisProps {
  brokerAccessData: BrokerAccessData[]
  title?: string
  showTitle?: boolean
}

export function BrokerAccessAnalysis({ 
  brokerAccessData, 
  title,
  showTitle = true 
}: BrokerAccessAnalysisProps) {
  const { t } = useTranslation()

  const displayTitle = title || t('adminDashboard.brokerAccessAnalysis.title')

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
                  {t('adminDashboard.brokerAccessAnalysis.activityStatus.title')}
                </span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {t('adminDashboard.brokerAccessAnalysis.activityStatus.description')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { 
                    status: t('adminDashboard.brokerAccessAnalysis.activityStatus.today'), 
                    count: brokerAccessData.filter(b => b.daysSinceLogin === 0).length,
                    color: MODERN_COLORS.success
                  },
                  { 
                    status: t('adminDashboard.brokerAccessAnalysis.activityStatus.thisWeek'), 
                    count: brokerAccessData.filter(b => b.daysSinceLogin > 0 && b.daysSinceLogin <= 7).length,
                    color: MODERN_COLORS.info
                  },
                  { 
                    status: t('adminDashboard.brokerAccessAnalysis.activityStatus.thisMonth'), 
                    count: brokerAccessData.filter(b => b.daysSinceLogin > 7 && b.daysSinceLogin <= 30).length,
                    color: MODERN_COLORS.warning
                  },
                  { 
                    status: t('adminDashboard.brokerAccessAnalysis.activityStatus.inactive'), 
                    count: brokerAccessData.filter(b => b.daysSinceLogin > 30).length,
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
                      if (!active || !payload || !payload.length) return null
                      return (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{label}</p>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {t('adminDashboard.brokerAccessAnalysis.consultants')}: <span className="font-semibold text-slate-900 dark:text-slate-100">{payload[0].value}</span>
                            </p>
                          </div>
                        </div>
                      )
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
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">
                  {t('adminDashboard.brokerAccessAnalysis.accessSummary.title')}
                </span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {t('adminDashboard.brokerAccessAnalysis.accessSummary.description')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.brokerAccessAnalysis.accessSummary.totalConsultants')}
                </span>
                <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {brokerAccessData.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.brokerAccessAnalysis.accessSummary.accessedToday')}
                </span>
                <span className="text-lg font-semibold text-green-600">
                  {brokerAccessData.filter(b => b.daysSinceLogin === 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.brokerAccessAnalysis.accessSummary.accessedThisWeek')}
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  {brokerAccessData.filter(b => b.daysSinceLogin <= 7).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.brokerAccessAnalysis.accessSummary.inactive30Days')}
                </span>
                <span className="text-lg font-semibold text-red-600">
                  {brokerAccessData.filter(b => b.daysSinceLogin > 30).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.brokerAccessAnalysis.accessSummary.totalClients')}
                </span>
                <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {brokerAccessData.reduce((sum, b) => sum + b.totalClients, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('adminDashboard.brokerAccessAnalysis.accessSummary.activeClients')}
                </span>
                <span className="text-lg font-semibold text-green-600">
                  {brokerAccessData.reduce((sum, b) => sum + b.activeClients, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Access Table */}
      <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-slate-900 dark:text-slate-100">
                {t('adminDashboard.brokerAccessAnalysis.recentAccess.title')}
              </span>
              <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                {t('adminDashboard.brokerAccessAnalysis.recentAccess.description')}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('adminDashboard.brokerAccessAnalysis.recentAccess.consultant')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('adminDashboard.brokerAccessAnalysis.recentAccess.lastAccess')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('adminDashboard.brokerAccessAnalysis.recentAccess.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('adminDashboard.brokerAccessAnalysis.recentAccess.totalClients')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('adminDashboard.brokerAccessAnalysis.recentAccess.activeClients')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {brokerAccessData
                  .sort((a, b) => a.daysSinceLogin - b.daysSinceLogin)
                  .slice(0, 50)
                  .map((broker) => (
                    <tr key={broker.id} className="hover:bg-muted">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-foreground">{broker.name}</div>
                        <div className="text-xs text-muted-foreground">{broker.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {broker.lastLogin === 'Nunca' 
                          ? t('adminDashboard.brokerAccessAnalysis.recentAccess.never')
                          : new Date(broker.lastLogin).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-4">
                        {broker.daysSinceLogin === 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {t('adminDashboard.brokerAccessAnalysis.recentAccess.today')}
                          </span>
                        ) : broker.daysSinceLogin === 1 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {t('adminDashboard.brokerAccessAnalysis.recentAccess.yesterday')}
                          </span>
                        ) : broker.daysSinceLogin <= 7 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {broker.daysSinceLogin} {t('adminDashboard.brokerAccessAnalysis.recentAccess.days')}
                          </span>
                        ) : broker.daysSinceLogin > 30 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {t('adminDashboard.brokerAccessAnalysis.recentAccess.inactive')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {broker.daysSinceLogin} {t('adminDashboard.brokerAccessAnalysis.recentAccess.days')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {broker.totalClients}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        <span className="font-semibold text-green-600">{broker.activeClients}</span> / {broker.totalClients}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

