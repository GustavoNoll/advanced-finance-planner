import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, GitCompare, TrendingUp, Table2, User, FileText } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Spinner } from '@/shared/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { useAuth } from '@/features/auth/components/AuthProvider'
import { useComparisonData } from '@/features/client-comparison/hooks/use-comparison-data'
import {
  ClientComparisonSelector,
  BasicDataComparisonTable,
  ProjectionChartComparison,
  ProjectionTableComparison,
  InvestmentPolicyComparisonTable,
} from '@/features/client-comparison/components'

export function ComparisonPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const brokerId = user?.id ?? null

  const { clientData, clientOptions, isLoading, error } = useComparisonData(
    brokerId,
    selectedIds
  )

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const showNav = clientData.length > 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/broker-dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-blue-500" />
              {t('clientComparison.title')}
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {showNav && (
        <TooltipProvider>
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => scrollToSection('comparison-basic')}
                >
                  <User className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {t('clientComparison.nav.basic')}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => scrollToSection('comparison-policy')}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {t('clientComparison.nav.policy')}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => scrollToSection('comparison-chart')}
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {t('clientComparison.nav.chart')}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => scrollToSection('comparison-table')}
                >
                  <Table2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {t('clientComparison.nav.table')}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              {t('clientComparison.selectTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientComparisonSelector
              options={clientOptions}
              value={selectedIds}
              onChange={setSelectedIds}
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-10 w-10" />
          </div>
        ) : clientData.length > 0 ? (
          <div className="space-y-8">
            <Card id="comparison-basic" className="scroll-mt-28">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-slate-500" />
                  {t('clientComparison.basicTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BasicDataComparisonTable clientData={clientData} />
              </CardContent>
            </Card>

            <Card id="comparison-policy" className="scroll-mt-28">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  {t('clientComparison.policy.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InvestmentPolicyComparisonTable clientData={clientData} />
              </CardContent>
            </Card>

            <Card id="comparison-chart" className="scroll-mt-28">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  {t('clientComparison.chartTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectionChartComparison clientData={clientData} />
              </CardContent>
            </Card>

            <Card id="comparison-table" className="scroll-mt-28">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table2 className="h-5 w-5 text-emerald-500" />
                  {t('clientComparison.tableTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectionTableComparison clientData={clientData} />
              </CardContent>
            </Card>
          </div>
        ) : (
          selectedIds.length > 0 && (
            <Card>
              <CardContent className="py-16 text-center text-slate-500 dark:text-slate-400">
                {t('clientComparison.noData')}
              </CardContent>
            </Card>
          )
        )}

        {selectedIds.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-16 text-center text-slate-500 dark:text-slate-400">
              {t('clientComparison.emptyState')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
