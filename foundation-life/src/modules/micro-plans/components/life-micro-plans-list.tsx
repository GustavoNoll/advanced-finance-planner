'use client'

import { Button } from '@/components/ui/button'
import { useCurrency } from '@/contexts/currency-context'
import { formatCurrency } from '@/lib/format-currency'

export interface LifeMicroPlanItem {
  id: string
  effectiveDate: string
  monthlyIncome: number
  monthlyExpenses: number
  monthlyContribution: number
}

interface LifeMicroPlansListProps {
  microPlans: LifeMicroPlanItem[]
  onDelete: (id: string) => void
}

function formatDate(isoDate: string): string {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric',
  })
}

export function LifeMicroPlansList({ microPlans, onDelete }: LifeMicroPlansListProps) {
  const currency = useCurrency()
  if (microPlans.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum micro plano. Adicione para definir mudanças de renda, gastos e aporte a partir de uma data.
      </p>
    )
  }

  const sorted = [...microPlans].sort(
    (a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
  )

  return (
    <ul className="space-y-2">
      {sorted.map(plan => (
        <li
          key={plan.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              A partir de {formatDate(plan.effectiveDate)}
            </p>
            <p className="text-xs text-muted-foreground">
              Renda {formatCurrency(plan.monthlyIncome, currency)} · Gastos {formatCurrency(plan.monthlyExpenses, currency)} · Aporte {formatCurrency(plan.monthlyContribution, currency)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(plan.id)}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Excluir micro plano"
          >
            ×
          </Button>
        </li>
      ))}
    </ul>
  )
}
