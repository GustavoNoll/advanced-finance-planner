'use client'

import { useState } from 'react'
import { EVENT_TYPE_LABELS, EVENT_TYPES } from '../constants/event-types'
import type { LifeEventType } from '@/modules/core/domain/life-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface LifeEventFormProps {
  onSubmit: (event: {
    type: LifeEventType
    title: string
    date: string
    endDate?: string
    amount: number
    frequency: 'once' | 'monthly' | 'yearly'
    durationMonths?: number
    inflationIndexed: boolean
  }) => void
  onCancel?: () => void
}

const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

export function LifeEventForm({ onSubmit, onCancel }: LifeEventFormProps) {
  const [type, setType] = useState<LifeEventType>('contribution')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [amount, setAmount] = useState(0)
  const [frequency, setFrequency] = useState<'once' | 'monthly' | 'yearly'>('once')
  const [inflationIndexed, setInflationIndexed] = useState(true)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      type,
      title: title.trim(),
      date: new Date(date).toISOString(),
      amount: Number(amount) || 0,
      frequency,
      inflationIndexed,
    })
    setTitle('')
    setAmount(0)
    setDate(new Date().toISOString().slice(0, 10))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Novo evento de vida</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <select
                value={type}
                onChange={e => setType(e.target.value as LifeEventType)}
                className={cn(selectClassName)}
              >
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t}>
                    {EVENT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Promoção, Compra do carro"
              />
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={amount || ''}
                onChange={e => setAmount(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Frequência</Label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as 'once' | 'monthly' | 'yearly')}
                className={cn(selectClassName)}
              >
                <option value="once">Uma vez</option>
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-8 sm:col-span-2">
              <input
                type="checkbox"
                id="inflation"
                checked={inflationIndexed}
                onChange={e => setInflationIndexed(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="inflation" className="font-normal text-muted-foreground">
                Ajustar pela inflação
              </Label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" size="sm">
              Adicionar evento
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
