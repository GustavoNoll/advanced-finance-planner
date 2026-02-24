'use client'

import { useState } from 'react'
import { LIFE_PLAN_DEFAULTS } from '@/lib/life-defaults'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export interface SetupWizardPayload {
  birthDate: string
  lifeExpectancyYears: number
  baseNetWorth: number
  baseMonthlyIncome: number
  baseMonthlyExpenses: number
  monthlyContribution: number
  expectedReturnYearly: number
  inflationYearly: number
  inflateIncome: boolean
  inflateExpenses: boolean
  retirementAge: number
  retirementMonthlyIncome: number
  inflateRetirementIncome: boolean
}

const STEPS = [
  {
    key: 'birthDate',
    label: 'Qual sua data de nascimento?',
    type: 'date' as const,
    fromPayload: () => LIFE_PLAN_DEFAULTS.getDefaultBirthDate(),
  },
  {
    key: 'lifeExpectancy',
    label: 'Até quantos anos você quer planejar?',
    placeholder: 'Ex: 90',
    min: 60,
    max: 110,
    toValue: (v: number) => v,
    fromPayload: () => LIFE_PLAN_DEFAULTS.lifeExpectancyYears,
  },
  {
    key: 'baseNetWorth',
    label: 'Qual seu patrimônio atual? (R$)',
    placeholder: '0',
    min: 0,
    step: 1000,
    toValue: (v: number) => v,
    fromPayload: () => LIFE_PLAN_DEFAULTS.baseNetWorth,
  },
  {
    key: 'baseMonthlyIncome',
    label: 'Qual sua renda líquida mensal? (R$)',
    placeholder: 'Ex: 8000',
    min: 0,
    step: 500,
    toValue: (v: number) => v,
    fromPayload: () => LIFE_PLAN_DEFAULTS.baseMonthlyIncome,
  },
  {
    key: 'baseMonthlyExpenses',
    label: 'Quanto você gasta por mês, em média? (R$)',
    placeholder: 'Ex: 5000',
    min: 0,
    step: 500,
    toValue: (v: number) => v,
    fromPayload: () => LIFE_PLAN_DEFAULTS.baseMonthlyExpenses,
  },
] as const

interface SetupWizardProps {
  onComplete: (payload: SetupWizardPayload) => void
  isLoading?: boolean
}

export function SetupWizard({ onComplete, isLoading }: SetupWizardProps) {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Record<string, number | string>>(() => {
    const initial: Record<string, number | string> = {}
    STEPS.forEach(s => {
      initial[s.key] = s.fromPayload()
    })
    return initial
  })

  const current = STEPS[step]
  const value = values[current.key] ?? current.fromPayload()
  const isDateStep = 'type' in current && current.type === 'date'
  const isLast = step === STEPS.length - 1
  const progress = ((step + 1) / STEPS.length) * 100

  function handleNext() {
    if (isLast) {
      const birthDateRaw = values.birthDate ?? LIFE_PLAN_DEFAULTS.getDefaultBirthDate()
      const birthDateStr = typeof birthDateRaw === 'string' ? birthDateRaw : LIFE_PLAN_DEFAULTS.getDefaultBirthDate()
      onComplete({
        birthDate: new Date(birthDateStr + 'T12:00:00').toISOString(),
        lifeExpectancyYears: (values.lifeExpectancy as number) ?? LIFE_PLAN_DEFAULTS.lifeExpectancyYears,
        baseNetWorth: (values.baseNetWorth as number) ?? LIFE_PLAN_DEFAULTS.baseNetWorth,
        baseMonthlyIncome: (values.baseMonthlyIncome as number) ?? LIFE_PLAN_DEFAULTS.baseMonthlyIncome,
        baseMonthlyExpenses: (values.baseMonthlyExpenses as number) ?? LIFE_PLAN_DEFAULTS.baseMonthlyExpenses,
        monthlyContribution: Math.max(
          0,
          ((values.baseMonthlyIncome as number) ?? LIFE_PLAN_DEFAULTS.baseMonthlyIncome) -
            ((values.baseMonthlyExpenses as number) ?? LIFE_PLAN_DEFAULTS.baseMonthlyExpenses)
        ),
        expectedReturnYearly: LIFE_PLAN_DEFAULTS.expectedReturnYearly,
        inflationYearly: LIFE_PLAN_DEFAULTS.inflationYearly,
        inflateIncome: LIFE_PLAN_DEFAULTS.inflateIncome,
        inflateExpenses: LIFE_PLAN_DEFAULTS.inflateExpenses,
        retirementAge: LIFE_PLAN_DEFAULTS.retirementAge,
        retirementMonthlyIncome: LIFE_PLAN_DEFAULTS.retirementMonthlyIncome,
        inflateRetirementIncome: LIFE_PLAN_DEFAULTS.inflateRetirementIncome,
      })
    } else {
      setStep(s => s + 1)
    }
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1)
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-8">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Passo {step + 1} de {STEPS.length}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="wizard-input" className="text-base font-medium">
              {current.label}
            </Label>
            {isDateStep ? (
              <Input
                id="wizard-input"
                type="date"
                value={typeof value === 'string' ? value : ''}
                onChange={e => setValues(prev => ({ ...prev, [current.key]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                className="h-12 text-base"
                autoFocus
              />
            ) : (
              <Input
                id="wizard-input"
                type="number"
                min={'min' in current ? current.min : undefined}
                max={'max' in current ? current.max : undefined}
                step={'step' in current ? current.step : 1}
                value={typeof value === 'number' ? value : Number(value) || 0}
                onChange={e => setValues(prev => ({ ...prev, [current.key]: Number(e.target.value) || 0 }))}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                placeholder={'placeholder' in current ? current.placeholder : undefined}
                className="h-12 text-base"
                autoFocus
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="shrink-0"
              >
                Voltar
              </Button>
            )}
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="min-w-[140px] flex-1"
            >
              {isLoading ? 'Criando...' : isLast ? 'Criar meu plano' : 'Continuar'}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Premissas: retorno {LIFE_PLAN_DEFAULTS.expectedReturnYearly}% a.a. · Inflação {LIFE_PLAN_DEFAULTS.inflationLabel}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
