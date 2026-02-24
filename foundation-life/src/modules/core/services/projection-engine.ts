import {
  LifeEvent,
  LifeMonthlyPoint,
  LifeYearlyPoint,
  ProjectionParams,
  ProjectionResult,
} from '../domain/life-types'
import { getActiveMicroPlanForDate } from '../utils/micro-plan-utils'

function yearlyToMonthlyRate(yearlyPercent: number): number {
  const yearly = yearlyPercent / 100
  if (yearly <= -1) return 0
  return Math.pow(1 + yearly, 1 / 12) - 1
}

function getMonthsDiff(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
}

function cloneDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

interface MonthEventImpact {
  income: number
  expenses: number
  extraIncome: number
  extraExpenses: number
  /** One-time outflow in this month (e.g. large purchase) — reduces net worth directly */
  oneTimeOutflow: number
  /** One-time inflow (e.g. sale of asset) — increases net worth directly */
  oneTimeInflow: number
}

function applyEventsForMonth(baseIncome: number, baseExpenses: number, date: Date, events: LifeEvent[]): MonthEventImpact {
  let income = baseIncome
  let expenses = baseExpenses
  let extraIncome = 0
  let extraExpenses = 0
  let oneTimeOutflow = 0
  let oneTimeInflow = 0

  for (const event of events) {
    const eventMonthKey = event.date.getFullYear() * 12 + event.date.getMonth()
    const currentMonthKey = date.getFullYear() * 12 + date.getMonth()

    const isWithinDuration =
      !event.endDate || (date >= event.date && date <= event.endDate)

    if (!isWithinDuration) continue

    const isIncome = event.type === 'contribution'
    const amount = event.amount
    const absAmount = Math.abs(amount)

    if (event.frequency === 'once') {
      if (currentMonthKey !== eventMonthKey) continue
      if (isIncome) {
        extraIncome += amount
      } else {
        oneTimeOutflow += absAmount
        extraExpenses += absAmount
      }
    }

    if (event.frequency === 'monthly') {
      if (currentMonthKey < eventMonthKey) continue
      if (isIncome) income += amount
      else expenses += absAmount
    }

    if (event.frequency === 'yearly') {
      if (date.getMonth() !== event.date.getMonth()) continue
      if (date.getFullYear() < event.date.getFullYear()) continue
      if (isIncome) extraIncome += amount
      else extraExpenses += absAmount
    }
  }

  return { income, expenses, extraIncome, extraExpenses, oneTimeOutflow, oneTimeInflow }
}

export function buildLifeProjection(params: ProjectionParams): ProjectionResult {
  const { profile, settings, events, microPlans = [] } = params

  const monthlyReturnRate = yearlyToMonthlyRate(settings.expectedReturnYearly)
  const monthlyInflationRate = yearlyToMonthlyRate(settings.inflationYearly)

  const startDate = new Date()
  const endDate = cloneDate(profile.birthDate)
  endDate.setFullYear(endDate.getFullYear() + profile.lifeExpectancyYears)

  const totalMonths = Math.max(0, getMonthsDiff(startDate, endDate))

  let currentNetWorth = settings.baseNetWorth
  let accumulatedInflation = 1
  let firstMonthWithZeroOrNegativeNetWorth: number | null = null

  const monthly: LifeMonthlyPoint[] = []

  const retirementAge = settings.retirementAge ?? 65
  const inflateIncome = settings.inflateIncome ?? true
  const inflateExpenses = settings.inflateExpenses ?? true
  const inflateRetirementIncome = settings.inflateRetirementIncome ?? true
  const retirementMonthlyIncome = settings.retirementMonthlyIncome ?? 0

  for (let i = 0; i <= totalMonths; i++) {
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
    const age =
      currentDate.getFullYear() - profile.birthDate.getFullYear() -
      (currentDate.getMonth() < profile.birthDate.getMonth() ? 1 : 0)

    const activeMicro = getActiveMicroPlanForDate(microPlans, currentDate)
    const baseIncomeForMonth = activeMicro
      ? activeMicro.monthlyIncome
      : (age < retirementAge ? settings.baseMonthlyIncome : retirementMonthlyIncome)
    const baseExpensesForMonth = activeMicro ? activeMicro.monthlyExpenses : settings.baseMonthlyExpenses
    const inflateIncomeForMonth = age < retirementAge ? inflateIncome : inflateRetirementIncome
    const nominalBaseIncome = inflateIncomeForMonth ? baseIncomeForMonth * accumulatedInflation : baseIncomeForMonth
    const nominalBaseExpenses = inflateExpenses ? baseExpensesForMonth * accumulatedInflation : baseExpensesForMonth

    const impact = applyEventsForMonth(
      nominalBaseIncome,
      nominalBaseExpenses,
      currentDate,
      events,
    )

    const monthIncome = impact.income + impact.extraIncome
    const monthExpenses = impact.expenses + impact.extraExpenses
    const contribution = Math.max(0, monthIncome - monthExpenses)

    // Apply one-time inflows/outflows (e.g. large purchase reduces patrimônio; sale adds)
    currentNetWorth += impact.oneTimeInflow - impact.oneTimeOutflow
    if (i >= 1 && currentNetWorth <= 0 && firstMonthWithZeroOrNegativeNetWorth === null) {
      firstMonthWithZeroOrNegativeNetWorth = i
    }
    const preReturnNetWorth = currentNetWorth + contribution
    const returns = preReturnNetWorth * monthlyReturnRate
    currentNetWorth = preReturnNetWorth + returns
    if (i >= 1 && currentNetWorth <= 0 && firstMonthWithZeroOrNegativeNetWorth === null) {
      firstMonthWithZeroOrNegativeNetWorth = i
    }

    accumulatedInflation *= 1 + monthlyInflationRate
    const realNetWorth = currentNetWorth / accumulatedInflation

    monthly.push({
      date: currentDate,
      age,
      netWorth: currentNetWorth,
      realNetWorth,
      income: monthIncome,
      expenses: monthExpenses,
      contribution,
      returns,
    })
  }

  const yearlyMap = new Map<number, LifeYearlyPoint>()

  for (const point of monthly) {
    const year = point.date.getFullYear()
    const existing = yearlyMap.get(year)

    if (!existing) {
      yearlyMap.set(year, {
        year,
        age: point.age,
        netWorth: point.netWorth,
        realNetWorth: point.realNetWorth,
        income: point.income,
        expenses: point.expenses,
        contribution: point.contribution,
        returns: point.returns,
      })
    } else {
      existing.netWorth = point.netWorth
      existing.realNetWorth = point.realNetWorth
      existing.income += point.income
      existing.expenses += point.expenses
      existing.contribution += point.contribution
      existing.returns += point.returns
    }
  }

  const yearly = Array.from(yearlyMap.values()).sort((a, b) => a.year - b.year)

  return { monthly, yearly, firstMonthWithZeroOrNegativeNetWorth }
}

