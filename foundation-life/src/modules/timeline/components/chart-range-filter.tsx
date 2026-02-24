'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export type ChartRangePreset = 'current_year' | 'next_5' | 'next_10' | 'all' | 'custom'

export interface ChartRangeFilterState {
  preset: ChartRangePreset
  customStart: string // YYYY-MM
  customEnd: string
}

const PRESETS: { value: ChartRangePreset; label: string }[] = [
  { value: 'current_year', label: 'Ano atual' },
  { value: 'next_5', label: 'Próximos 5 anos' },
  { value: 'next_10', label: 'Próximos 10 anos' },
  { value: 'all', label: 'Todos' },
  { value: 'custom', label: 'Personalizado' },
]

function getMonthKey(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth()
}

export function getChartRange(state: ChartRangeFilterState): { startKey: number; endKey: number } {
  const now = new Date()
  const currentKey = getMonthKey(now)

  switch (state.preset) {
    case 'current_year':
      return { startKey: currentKey, endKey: currentKey + 11 }
    case 'next_5':
      return { startKey: currentKey, endKey: currentKey + 60 }
    case 'next_10':
      return { startKey: currentKey, endKey: currentKey + 120 }
    case 'all':
      return { startKey: currentKey, endKey: currentKey + 1200 }
    case 'custom': {
      const [sy, sm] = state.customStart.split('-').map(Number)
      const [ey, em] = state.customEnd.split('-').map(Number)
      const startKey = sy * 12 + (sm - 1)
      const endKey = ey * 12 + (em - 1)
      return { startKey, endKey }
    }
    default:
      return { startKey: currentKey, endKey: currentKey + 120 }
  }
}

const defaultState: ChartRangeFilterState = {
  preset: 'all',
  customStart: new Date().toISOString().slice(0, 7),
  customEnd: new Date(Date.now() + 10 * 365.25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
}

interface ChartRangeFilterProps {
  value: ChartRangeFilterState
  onChange: (value: ChartRangeFilterState) => void
  className?: string
}

export function ChartRangeFilter({ value, onChange, className }: ChartRangeFilterProps) {
  function handlePreset(preset: ChartRangePreset) {
    onChange({ ...value, preset })
  }

  function handleCustomRange(field: 'customStart' | 'customEnd', v: string) {
    onChange({ ...value, [field]: v })
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {PRESETS.map(p => (
        <Button
          key={p.value}
          type="button"
          variant={value.preset === p.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePreset(p.value)}
        >
          {p.label}
        </Button>
      ))}
      {value.preset === 'custom' && (
        <div className="ml-2 flex flex-wrap items-center gap-2 border-l border-border pl-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="chart-start" className="text-xs text-muted-foreground whitespace-nowrap">
              Início
            </Label>
            <Input
              id="chart-start"
              type="month"
              value={value.customStart}
              onChange={e => handleCustomRange('customStart', e.target.value)}
              className="h-8 w-36"
            />
          </div>
          <div className="flex items-center gap-1">
            <Label htmlFor="chart-end" className="text-xs text-muted-foreground whitespace-nowrap">
              Fim
            </Label>
            <Input
              id="chart-end"
              type="month"
              value={value.customEnd}
              onChange={e => handleCustomRange('customEnd', e.target.value)}
              className="h-8 w-36"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function getDefaultChartRangeState(): ChartRangeFilterState {
  return defaultState
}

export function filterMonthlyByRange<T extends { date: Date }>(
  data: T[],
  range: { startKey: number; endKey: number }
): T[] {
  return data.filter(p => {
    const k = p.date.getFullYear() * 12 + p.date.getMonth()
    return k >= range.startKey && k <= range.endKey
  })
}

export function filterYearlyByRange<T extends { year: number }>(
  yearly: T[],
  range: { startKey: number; endKey: number }
): T[] {
  const startYear = Math.floor(range.startKey / 12)
  const endYear = Math.floor(range.endKey / 12)
  return yearly.filter(r => r.year >= startYear && r.year <= endYear)
}
