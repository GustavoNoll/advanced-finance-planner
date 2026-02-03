import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Briefcase, Building2, Wallet, Users, Heart, Target } from 'lucide-react'
import { useInvestmentPolicyInsights } from '@/hooks/useInvestmentPolicy'

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

const CHART_COLORS = [
  MODERN_COLORS.primary,
  MODERN_COLORS.success,
  MODERN_COLORS.warning,
  MODERN_COLORS.danger,
  MODERN_COLORS.info,
  MODERN_COLORS.purple,
  MODERN_COLORS.pink,
  MODERN_COLORS.blue,
  MODERN_COLORS.green,
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Helper functions to translate values
const translateValue = (t: (key: string) => string, category: string, value: string): string => {
  const translationKey = `adminDashboard.policyInsights.values.${category}.${value}`
  const translated = t(translationKey)
  // If translation doesn't exist, return the original value
  return translated !== translationKey ? translated : value
}

interface InvestmentPolicyInsightsProps {
  activeBrokerIds?: string[]
}

export function InvestmentPolicyInsights({ activeBrokerIds }: InvestmentPolicyInsightsProps) {
  const { t } = useTranslation()
  const { insights, loading, error } = useInvestmentPolicyInsights(activeBrokerIds)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">{t('adminDashboard.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !insights) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || t('adminDashboard.policyInsights.noData')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Professional Information Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.policyInsights.professional.occupations')}</span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {insights.professional.totalClients} {t('adminDashboard.policyInsights.clients')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.professional.occupations.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis 
                    dataKey="occupation" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {payload[0].payload.occupation}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t('adminDashboard.policyInsights.count')}: <span className="font-semibold">{payload[0].value}</span>
                          </p>
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

        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.policyInsights.professional.workLocations')}</span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {insights.professional.totalClients} {t('adminDashboard.policyInsights.clients')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.professional.workLocations.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis 
                    dataKey="location" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {payload[0].payload.location}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t('adminDashboard.policyInsights.count')}: <span className="font-semibold">{payload[0].value}</span>
                          </p>
                        </div>
                      )
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={MODERN_COLORS.success}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.policyInsights.professional.workRegimes')}</span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {insights.professional.totalClients} {t('adminDashboard.policyInsights.clients')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insights.professional.workRegimes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="regime"
                  >
                    {insights.professional.workRegimes.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      const data = payload[0].payload
                      const total = insights.professional.workRegimes.reduce((sum, item) => sum + item.count, 0)
                      const percentage = total > 0 ? ((data.count / total) * 100).toFixed(1) : '0.0'
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            {translateValue(t, 'workRegime', data.regime)}
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.policyInsights.count')}:</span>
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{data.count}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.policyInsights.percentage')}:</span>
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{percentage}%</span>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={60}
                    formatter={(value) => (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {translateValue(t, 'workRegime', value)}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Insights */}
      <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.policyInsights.budget.title')}</span>
              <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                {insights.budget.clientsWithBudget} {t('adminDashboard.policyInsights.clients')}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.totalIncomes')}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(insights.budget.totalIncomes)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.totalExpenses')}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(insights.budget.totalExpenses)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.totalBonus')}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(insights.budget.totalBonus)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.totalDividends')}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(insights.budget.totalDividends)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.totalSavings')}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(insights.budget.totalSavings)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.averageIncome')}</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(insights.budget.averageIncome)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.averageExpense')}</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{formatCurrency(insights.budget.averageExpense)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.averageBonus')}</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(insights.budget.averageBonus)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.averageDividends')}</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{formatCurrency(insights.budget.averageDividends)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.budget.averageSavings')}</p>
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{formatCurrency(insights.budget.averageSavings)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Life & Family Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.policyInsights.life.stages')}</span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {insights.life.totalClients} {t('adminDashboard.policyInsights.clients')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insights.life.stages}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="stage"
                  >
                    {insights.life.stages.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      const data = payload[0].payload
                      const total = insights.life.stages.reduce((sum, item) => sum + item.count, 0)
                      const percentage = total > 0 ? ((data.count / total) * 100).toFixed(1) : '0.0'
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            {translateValue(t, 'lifeStage', data.stage)}
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.policyInsights.count')}:</span>
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{data.count}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">{t('adminDashboard.policyInsights.percentage')}:</span>
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{percentage}%</span>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={60}
                    formatter={(value) => (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {translateValue(t, 'lifeStage', value)}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.policyInsights.family.maritalStatus')}</span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {insights.family.totalClients} {t('adminDashboard.policyInsights.clients')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.family.maritalStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis 
                    dataKey="status" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => translateValue(t, 'maritalStatus', value)}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {translateValue(t, 'maritalStatus', payload[0].payload.status)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t('adminDashboard.policyInsights.count')}: <span className="font-semibold">{payload[0].value}</span>
                          </p>
                        </div>
                      )
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={MODERN_COLORS.info}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.family.withChildren')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{insights.family.children.hasChildren}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.family.noChildren')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{insights.family.children.noChildren}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('adminDashboard.policyInsights.family.averageChildren')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{insights.family.children.averageChildren.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Preferences Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.policyInsights.preferences.riskProfiles')}</span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {insights.preferences.totalClients} {t('adminDashboard.policyInsights.clients')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.preferences.riskProfiles}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis 
                    dataKey="profile" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => translateValue(t, 'riskProfile', value)}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {translateValue(t, 'riskProfile', payload[0].payload.profile)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t('adminDashboard.policyInsights.count')}: <span className="font-semibold">{payload[0].value}</span>
                          </p>
                        </div>
                      )
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={MODERN_COLORS.warning}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">{t('adminDashboard.policyInsights.preferences.targetReturns')}</span>
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {insights.preferences.totalClients} {t('adminDashboard.policyInsights.clients')}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.preferences.targetReturns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis 
                    dataKey="return" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => translateValue(t, 'targetReturn', value)}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {translateValue(t, 'targetReturn', payload[0].payload.return)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t('adminDashboard.policyInsights.count')}: <span className="font-semibold">{payload[0].value}</span>
                          </p>
                        </div>
                      )
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={MODERN_COLORS.purple}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

