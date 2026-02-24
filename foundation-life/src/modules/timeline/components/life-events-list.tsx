'use client'

import { EVENT_TYPE_LABELS } from '../constants/event-types'
import type { LifeEvent } from '@/modules/core/domain/life-types'
import { Button } from '@/components/ui/button'
import { useCurrency } from '@/contexts/currency-context'
import { formatCurrency } from '@/lib/format-currency'

interface LifeEventsListProps {
  events: LifeEvent[]
  onDelete: (id: string) => void
}

export function LifeEventsList({ events, onDelete }: LifeEventsListProps) {
  const currency = useCurrency()
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum evento ainda. Adicione mudanças de renda, grandes compras, filhos, aposentadoria, etc.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {events.map(event => (
        <li
          key={event.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {event.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {EVENT_TYPE_LABELS[event.type as keyof typeof EVENT_TYPE_LABELS] ?? event.type} · {new Date(event.date).toLocaleDateString('pt-BR')}
              {event.frequency !== 'once' && ` · ${event.frequency}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {event.amount >= 0
                ? `+${formatCurrency(event.amount, currency)}`
                : formatCurrency(event.amount, currency)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDelete(event.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label="Excluir evento"
            >
              ×
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
