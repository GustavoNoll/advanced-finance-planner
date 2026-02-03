import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { CheckCircle2, AlertCircle, XCircle, Info, Tag, DollarSign } from 'lucide-react'
import { useMemo } from 'react'
import type { ConsolidatedPerformance } from '@/types/financial'
import type { VerificationResult } from '../types/portfolio-data-management.types'

interface VerificationSummaryProps {
  consolidated: ConsolidatedPerformance[]
  getVerification: (item: ConsolidatedPerformance) => VerificationResult
  t: (key: string, options?: Record<string, unknown>) => string
}

export function VerificationSummary({ consolidated, getVerification, t }: VerificationSummaryProps) {
  const stats = useMemo(() => {
    const statsData = consolidated.reduce((acc, item) => {
      const verification = getVerification(item)
      acc[verification.status]++
      
      // Contar registros com rentabilidade faltando
      if (verification.hasMissingYield) {
        acc.missingYieldRecords++
        acc.missingYieldTotal += verification.missingYieldCount
      }
      
      return acc
    }, { 
      match: 0, 
      tolerance: 0, 
      mismatch: 0, 
      'no-data': 0,
      missingYieldRecords: 0,
      missingYieldTotal: 0
    })

    // Calcular unclassified stats
    const unclassifiedStats = consolidated.reduce((acc, item) => {
      const verification = getVerification(item)
      if (verification.hasUnclassified) {
        acc.recordsWithUnclassified++
        acc.totalUnclassified += verification.unclassifiedCount
      }
      return acc
    }, { recordsWithUnclassified: 0, totalUnclassified: 0 })

    return { ...statsData, unclassifiedStats }
  }, [consolidated, getVerification])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">
          {t('portfolioPerformance.verification.summaryTitle') || 'Resumo de Verificação de Integridade'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Primeira linha: 3 colunas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.match}</p>
                <p className="text-sm text-muted-foreground">{t('portfolioPerformance.verification.match') || 'Corretos'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.tolerance}</p>
                <p className="text-sm text-muted-foreground">{t('portfolioPerformance.verification.tolerance') || 'Tolerância'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.mismatch}</p>
                <p className="text-sm text-muted-foreground">{t('portfolioPerformance.verification.mismatch') || 'Inconsistentes'}</p>
              </div>
            </div>
          </div>
          
          {/* Segunda linha: 3 colunas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats['no-data']}</p>
                <p className="text-sm text-muted-foreground">{t('portfolioPerformance.verification.noData') || 'Sem Dados'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.unclassifiedStats.recordsWithUnclassified}</p>
                <p className="text-sm text-muted-foreground">
                  {t('portfolioPerformance.verification.withUnclassified') || 'Com Não Classificados'}
                  <span className="block text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                    {stats.unclassifiedStats.totalUnclassified} {t('portfolioPerformance.verification.assets') || 'ativos'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.missingYieldRecords}</p>
                <p className="text-sm text-muted-foreground">
                  {t('portfolioPerformance.verification.withMissingYield') || 'Com Rentabilidade Faltando'}
                  <span className="block text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                    {stats.missingYieldTotal} {t('portfolioPerformance.verification.assets') || 'ativos'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

