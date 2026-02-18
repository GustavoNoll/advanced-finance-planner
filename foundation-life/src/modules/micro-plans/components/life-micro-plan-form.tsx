'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface LifeMicroPlanFormPayload {
  effectiveDate: string
  monthlyIncome: number
  monthlyExpenses: number
  monthlyContribution: number
}

interface LifeMicroPlanFormProps {
  onSubmit: (payload: LifeMicroPlanFormPayload) => void
  onCancel?: () => void
  defaultDate?: string
}

export function LifeMicroPlanForm({
  onSubmit,
  onCancel,
  defaultDate = new Date().toISOString().slice(0, 10),
}: LifeMicroPlanFormProps) {
  const [effectiveDate, setEffectiveDate] = useState(defaultDate)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      effectiveDate,
      monthlyIncome,
      monthlyExpenses,
      monthlyContribution: Math.max(0, monthlyIncome - monthlyExpenses),
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Novo micro plano</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>A partir de (data)</Label>
              <Input
                type="date"
                value={effectiveDate}
                onChange={e => setEffectiveDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Renda mensal (R$)</Label>
              <Input
                type="number"
                min={0}
                value={monthlyIncome || ''}
                onChange={e => setMonthlyIncome(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Gastos mensais (R$)</Label>
              <Input
                type="number"
                min={0}
                value={monthlyExpenses || ''}
                onChange={e => setMonthlyExpenses(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            O aporte é calculado automaticamente (renda − gastos).
          </p>
          <div className="flex gap-2 pt-2">
            <Button type="submit" size="sm">
              Adicionar
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
