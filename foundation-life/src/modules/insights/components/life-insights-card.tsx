'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { LifeInsight, InsightType } from '@/modules/insights/utils/life-insights'
import { cn } from '@/lib/utils'

const TYPE_STYLES: Record<InsightType, string> = {
  danger: 'border-destructive/50 bg-destructive/10 text-destructive',
  warning: 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  info: 'border-primary/50 bg-primary/10 text-primary',
}

const TYPE_ICONS: Record<InsightType, string> = {
  danger: '⚠',
  warning: '⚡',
  success: '✓',
  info: 'ℹ',
}

interface LifeInsightsCardProps {
  insights: LifeInsight[]
  className?: string
}

export function LifeInsightsCard({ insights, className }: LifeInsightsCardProps) {
  if (insights.length === 0) {
    return null
  }

  return (
    <Card className={cn('overflow-hidden border-l-4 border-l-[hsl(var(--accent-amber))]', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Insights</CardTitle>
        <CardDescription>
          Análise automática da sua projeção: pontos de atenção e oportunidades.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map(insight => (
          <div
            key={insight.id}
            className={cn(
              'flex gap-3 rounded-lg border px-3 py-2.5 text-sm',
              TYPE_STYLES[insight.type]
            )}
          >
            <span className="shrink-0 text-base" aria-hidden>
              {TYPE_ICONS[insight.type]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{insight.title}</p>
              <p className="mt-0.5 text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
