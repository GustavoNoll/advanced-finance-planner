'use server'

import { prisma } from '@/lib/prisma'
import type { LifeEventType } from '@/modules/core/domain/life-types'

export type CurrencyCode = 'BRL' | 'USD' | 'EUR'

export interface LifeDataPayload {
  birthDate: string // ISO
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
  baseCurrency?: CurrencyCode
}

export interface LifeEventPayload {
  id?: string
  type: LifeEventType
  title: string
  date: string // ISO
  endDate?: string
  amount: number
  frequency: 'once' | 'monthly' | 'yearly'
  durationMonths?: number
  inflationIndexed?: boolean
}

export interface LifeMicroPlanPayload {
  effectiveDate: string // ISO date (YYYY-MM-DD or full ISO)
  monthlyIncome: number
  monthlyExpenses: number
  monthlyContribution: number
}

export interface LifeDataResult {
  profileId: string
  scenarioId: string
  birthDate: string
  lifeExpectancyYears: number
  baseCurrency: CurrencyCode
  settings: LifeDataPayload
  events: LifeEventPayload[]
  microPlans: (LifeMicroPlanPayload & { id: string })[]
}

export async function getLifeData(authUserId: string): Promise<LifeDataResult | null> {
  const profile = await prisma.profile.findUnique({
    where: { authUserId },
  })

  if (!profile?.birthDate) return null

  const scenario = await prisma.lifeScenario.findFirst({
    where: { profileId: profile.id, isDefault: true },
    include: {
      settings: true,
      events: { orderBy: { date: 'asc' } },
    },
  })

  if (!scenario?.settings) return null

  const microPlans = await prisma.lifeMicroPlan.findMany({
    where: { scenarioId: scenario.id },
    orderBy: { effectiveDate: 'asc' },
  })

  const settings = scenario.settings
  const birthDate = profile.birthDate

  return {
    profileId: profile.id,
    scenarioId: scenario.id,
    birthDate: birthDate.toISOString(),
    lifeExpectancyYears: profile.lifeExpectancyYears,
    baseCurrency: (profile.baseCurrency as CurrencyCode) || 'BRL',
    settings: {
      birthDate: birthDate.toISOString(),
      lifeExpectancyYears: profile.lifeExpectancyYears,
      baseNetWorth: settings.baseNetWorth,
      baseMonthlyIncome: settings.baseMonthlyIncome,
      baseMonthlyExpenses: settings.baseMonthlyExpenses,
      monthlyContribution: settings.monthlyContribution,
      expectedReturnYearly: settings.expectedReturnYearly,
      inflationYearly: settings.inflationYearly,
      inflateIncome: settings.inflateIncome ?? true,
      inflateExpenses: settings.inflateExpenses ?? true,
      retirementAge: settings.retirementAge ?? 65,
      retirementMonthlyIncome: settings.retirementMonthlyIncome ?? 0,
      inflateRetirementIncome: settings.inflateRetirementIncome ?? true,
    },
    events: scenario.events.map(e => ({
      id: e.id,
      type: e.type as LifeEventType,
      title: e.title,
      date: e.date.toISOString(),
      endDate: e.endDate?.toISOString(),
      amount: e.amount,
      frequency: e.frequency as 'once' | 'monthly' | 'yearly',
      durationMonths: e.durationMonths ?? undefined,
      inflationIndexed: e.inflationIndexed,
    })),
    microPlans: microPlans.map(m => ({
      id: m.id,
      effectiveDate: m.effectiveDate.toISOString().slice(0, 10),
      monthlyIncome: m.monthlyIncome,
      monthlyExpenses: m.monthlyExpenses,
      monthlyContribution: m.monthlyContribution,
    })),
  }
}

export async function saveLifeData(authUserId: string, payload: LifeDataPayload): Promise<{ scenarioId: string }> {
  let profile = await prisma.profile.findUnique({
    where: { authUserId },
  })

  const baseCurrency = payload.baseCurrency ?? 'BRL'
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        authUserId,
        birthDate: new Date(payload.birthDate),
        lifeExpectancyYears: payload.lifeExpectancyYears,
        baseCurrency,
      },
    })
  } else {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        birthDate: new Date(payload.birthDate),
        lifeExpectancyYears: payload.lifeExpectancyYears,
        baseCurrency,
      },
    })
  }

  let scenario = await prisma.lifeScenario.findFirst({
    where: { profileId: profile.id, isDefault: true },
  })
  if (!scenario) {
    scenario = await prisma.lifeScenario.create({
      data: {
        profileId: profile.id,
        name: 'Plano principal',
        isDefault: true,
      },
    })
  }

  await prisma.lifeSettings.upsert({
    where: { scenarioId: scenario.id },
    create: {
      scenarioId: scenario.id,
      baseNetWorth: payload.baseNetWorth,
      baseMonthlyIncome: payload.baseMonthlyIncome,
      baseMonthlyExpenses: payload.baseMonthlyExpenses,
      monthlyContribution: payload.monthlyContribution,
      expectedReturnYearly: payload.expectedReturnYearly,
      inflationYearly: payload.inflationYearly,
      inflateIncome: payload.inflateIncome ?? true,
      inflateExpenses: payload.inflateExpenses ?? true,
      retirementAge: payload.retirementAge ?? 65,
      retirementMonthlyIncome: payload.retirementMonthlyIncome ?? 0,
      inflateRetirementIncome: payload.inflateRetirementIncome ?? true,
    },
    update: {
      baseNetWorth: payload.baseNetWorth,
      baseMonthlyIncome: payload.baseMonthlyIncome,
      baseMonthlyExpenses: payload.baseMonthlyExpenses,
      monthlyContribution: payload.monthlyContribution,
      expectedReturnYearly: payload.expectedReturnYearly,
      inflationYearly: payload.inflationYearly,
      inflateIncome: payload.inflateIncome ?? true,
      inflateExpenses: payload.inflateExpenses ?? true,
      retirementAge: payload.retirementAge ?? 65,
      retirementMonthlyIncome: payload.retirementMonthlyIncome ?? 0,
      inflateRetirementIncome: payload.inflateRetirementIncome ?? true,
    },
  })

  return { scenarioId: scenario.id }
}

export async function saveLifeEvent(
  authUserId: string,
  scenarioId: string,
  payload: Omit<LifeEventPayload, 'id'>
): Promise<{ id: string }> {
  const scenario = await prisma.lifeScenario.findFirst({
    where: { id: scenarioId, profile: { authUserId } },
  })
  if (!scenario) throw new Error('Scenario not found')

  const event = await prisma.lifeEvent.create({
    data: {
      scenarioId,
      type: payload.type,
      title: payload.title,
      date: new Date(payload.date),
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      amount: payload.amount,
      frequency: payload.frequency,
      durationMonths: payload.durationMonths ?? null,
      inflationIndexed: payload.inflationIndexed ?? true,
    },
  })
  return { id: event.id }
}

export async function deleteLifeEvent(authUserId: string, eventId: string): Promise<void> {
  const profile = await prisma.profile.findUnique({ where: { authUserId } })
  if (!profile) return

  const event = await prisma.lifeEvent.findFirst({
    where: { id: eventId, scenario: { profileId: profile.id } },
  })
  if (event) await prisma.lifeEvent.delete({ where: { id: eventId } })
}

export async function saveLifeMicroPlan(
  authUserId: string,
  scenarioId: string,
  payload: LifeMicroPlanPayload
): Promise<{ id: string }> {
  const scenario = await prisma.lifeScenario.findFirst({
    where: { id: scenarioId, profile: { authUserId } },
  })
  if (!scenario) throw new Error('Scenario not found')

  const microPlan = await prisma.lifeMicroPlan.create({
    data: {
      scenarioId,
      effectiveDate: new Date(payload.effectiveDate + 'T12:00:00'),
      monthlyIncome: payload.monthlyIncome,
      monthlyExpenses: payload.monthlyExpenses,
      monthlyContribution: payload.monthlyContribution,
    },
  })
  return { id: microPlan.id }
}

export async function updateLifeMicroPlan(
  authUserId: string,
  microPlanId: string,
  payload: Partial<LifeMicroPlanPayload>
): Promise<void> {
  const microPlan = await prisma.lifeMicroPlan.findFirst({
    where: { id: microPlanId, scenario: { profile: { authUserId } } },
  })
  if (!microPlan) throw new Error('Micro plan not found')

  await prisma.lifeMicroPlan.update({
    where: { id: microPlanId },
    data: {
      ...(payload.effectiveDate != null && { effectiveDate: new Date(payload.effectiveDate + 'T12:00:00') }),
      ...(payload.monthlyIncome != null && { monthlyIncome: payload.monthlyIncome }),
      ...(payload.monthlyExpenses != null && { monthlyExpenses: payload.monthlyExpenses }),
      ...(payload.monthlyContribution != null && { monthlyContribution: payload.monthlyContribution }),
    },
  })
}

export async function deleteLifeMicroPlan(authUserId: string, microPlanId: string): Promise<void> {
  const microPlan = await prisma.lifeMicroPlan.findFirst({
    where: { id: microPlanId, scenario: { profile: { authUserId } } },
  })
  if (microPlan) {
    await prisma.lifeMicroPlan.delete({ where: { id: microPlanId } })
  }
}
