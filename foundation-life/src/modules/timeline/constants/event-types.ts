import type { LifeEventType } from '@/modules/core/domain/life-types'

/** Rótulos alinhados ao Foundation Hub (eventIcons / goals-events). */
export const EVENT_TYPE_LABELS: Record<LifeEventType, string> = {
  goal: 'Objetivo / Meta',
  contribution: 'Aporte',
  car: 'Carro',
  house: 'Casa / Imóvel',
  travel: 'Viagem',
  accident: 'Imprevisto / Acidente',
  renovation: 'Reforma',
  other: 'Outro',
}

/** Tipos de evento no formulário. */
export const EVENT_TYPES: LifeEventType[] = [
  'goal',
  'contribution',
  'car',
  'house',
  'travel',
  'accident',
  'renovation',
  'other',
]
