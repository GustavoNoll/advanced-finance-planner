'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LIFE_PLAN_DEFAULTS } from '@/lib/life-defaults'
import { SetupWizard } from '@/modules/onboarding/components/setup-wizard'
import { LifeTimelineChart } from '@/modules/timeline/components/life-timeline-chart'
import { LifeProjectionTable } from '@/modules/timeline/components/life-projection-table'
import { LifeEventForm } from '@/modules/timeline/components/life-event-form'
import { LifeEventsList } from '@/modules/timeline/components/life-events-list'
import { buildLifeProjection } from '@/modules/core/services/projection-engine'
import type { LifeEvent, LifeEventType } from '@/modules/core/domain/life-types'
import {
  getLifeData,
  saveLifeData,
  saveLifeEvent,
  deleteLifeEvent,
  saveLifeMicroPlan,
  deleteLifeMicroPlan,
} from '@/app/actions/life'
import { LifeMicroPlanForm } from '@/modules/micro-plans/components/life-micro-plan-form'
import { LifeMicroPlansList } from '@/modules/micro-plans/components/life-micro-plans-list'
import type { LifeMicroPlan } from '@/modules/core/domain/life-types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CollapsibleCard } from '@/components/ui/collapsible-card'
import {
  ChartRangeFilter,
  getChartRange,
  getDefaultChartRangeState,
  filterMonthlyByRange,
  filterYearlyByRange,
  type ChartRangeFilterState,
} from '@/modules/timeline/components/chart-range-filter'
import { EditSidebar, type SidebarKey } from '@/modules/dashboard/components/edit-sidebar'
import { getLifeInsights } from '@/modules/insights/utils/life-insights'
import { LifeInsightsCard } from '@/modules/insights/components/life-insights-card'
import { CurrencyProvider } from '@/contexts/currency-context'
import { useTheme, type ThemeMode } from '@/contexts/theme-context'
import { CURRENCIES, type CurrencyCode } from '@/lib/format-currency'

export function LifeDashboard() {
  const router = useRouter()
  const [authUserId, setAuthUserId] = useState<string | null>(null)
  const [scenarioId, setScenarioId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [setupSaving, setSetupSaving] = useState(false)
  const [eventSaving, setEventSaving] = useState(false)
  const [hasPlan, setHasPlan] = useState(false)

  const [birthDate, setBirthDate] = useState(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 30)
    return d.toISOString().slice(0, 10) // YYYY-MM-DD
  })
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(LIFE_PLAN_DEFAULTS.lifeExpectancyYears)
  const [netWorth, setNetWorth] = useState<number>(LIFE_PLAN_DEFAULTS.baseNetWorth)
  const [income, setIncome] = useState<number>(LIFE_PLAN_DEFAULTS.baseMonthlyIncome)
  const [expenses, setExpenses] = useState<number>(LIFE_PLAN_DEFAULTS.baseMonthlyExpenses)
  const [returnYearly, setReturnYearly] = useState<number>(LIFE_PLAN_DEFAULTS.expectedReturnYearly)
  const [inflationYearly, setInflationYearly] = useState<number>(LIFE_PLAN_DEFAULTS.inflationYearly)
  const [inflateIncome, setInflateIncome] = useState<boolean>(LIFE_PLAN_DEFAULTS.inflateIncome)
  const [inflateExpenses, setInflateExpenses] = useState<boolean>(LIFE_PLAN_DEFAULTS.inflateExpenses)
  const [retirementAge, setRetirementAge] = useState<number>(LIFE_PLAN_DEFAULTS.retirementAge)
  const [retirementMonthlyIncome, setRetirementMonthlyIncome] = useState<number>(LIFE_PLAN_DEFAULTS.retirementMonthlyIncome)
  const [inflateRetirementIncome, setInflateRetirementIncome] = useState<boolean>(LIFE_PLAN_DEFAULTS.inflateRetirementIncome)
  const [currency, setCurrency] = useState<CurrencyCode>('BRL')
  const { theme, setTheme } = useTheme()
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [microPlans, setMicroPlans] = useState<{ id: string; effectiveDate: string; monthlyIncome: number; monthlyExpenses: number; monthlyContribution: number }[]>([])
  const [showMicroPlanForm, setShowMicroPlanForm] = useState(false)
  const [microPlanSaving, setMicroPlanSaving] = useState(false)
  const [chartRange, setChartRange] = useState<ChartRangeFilterState>(getDefaultChartRangeState())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({
    you: false,
    aposentadoria: false,
    microPlans: false,
    events: false,
    configuracoes: false,
  })
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({
    projecao: null,
    insights: null,
    tabela: null,
    you: null,
    aposentadoria: null,
    microPlans: null,
    events: null,
    configuracoes: null,
  })
  const lastSavedPlanRef = useRef<string | null>(null)

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.replace('/login')
        return
      }
      setAuthUserId(data.user.id)
      const saved = await getLifeData(data.user.id)
      if (saved) {
        setHasPlan(true)
        setBirthDate(saved.birthDate.slice(0, 10)) // YYYY-MM-DD para input date
        setLifeExpectancy(saved.lifeExpectancyYears)
        setNetWorth(saved.settings.baseNetWorth)
        setIncome(saved.settings.baseMonthlyIncome)
        setExpenses(saved.settings.baseMonthlyExpenses)
        setReturnYearly(saved.settings.expectedReturnYearly)
        setInflationYearly(saved.settings.inflationYearly)
        setInflateIncome(saved.settings.inflateIncome ?? true)
        setInflateExpenses(saved.settings.inflateExpenses ?? true)
        setRetirementAge(saved.settings.retirementAge ?? 65)
        setRetirementMonthlyIncome(saved.settings.retirementMonthlyIncome ?? 0)
        setInflateRetirementIncome(saved.settings.inflateRetirementIncome ?? true)
        setCurrency((saved.baseCurrency as CurrencyCode) ?? 'BRL')
        setScenarioId(saved.scenarioId)
        setEvents(
          saved.events.map(e => ({
            id: e.id!,
            type: e.type,
            title: e.title,
            date: new Date(e.date),
            endDate: e.endDate ? new Date(e.endDate) : undefined,
            amount: e.amount,
            frequency: e.frequency,
            durationMonths: e.durationMonths,
            inflationIndexed: e.inflationIndexed ?? true,
          }))
        )
        setMicroPlans(
          saved.microPlans.map(m => ({
            id: m.id,
            effectiveDate: m.effectiveDate,
            monthlyIncome: m.monthlyIncome,
            monthlyExpenses: m.monthlyExpenses,
            monthlyContribution: m.monthlyContribution,
          }))
        )
        lastSavedPlanRef.current = JSON.stringify({
          birthDate: saved.birthDate.slice(0, 10),
          lifeExpectancyYears: saved.lifeExpectancyYears,
          baseNetWorth: saved.settings.baseNetWorth,
          baseMonthlyIncome: saved.settings.baseMonthlyIncome,
          baseMonthlyExpenses: saved.settings.baseMonthlyExpenses,
          baseCurrency: saved.baseCurrency,
          expectedReturnYearly: saved.settings.expectedReturnYearly,
          inflationYearly: saved.settings.inflationYearly,
          inflateIncome: saved.settings.inflateIncome ?? true,
          inflateExpenses: saved.settings.inflateExpenses ?? true,
          retirementAge: saved.settings.retirementAge ?? 65,
          retirementMonthlyIncome: saved.settings.retirementMonthlyIncome ?? 0,
          inflateRetirementIncome: saved.settings.inflateRetirementIncome ?? true,
        })
      }
      setLoading(false)
    }
    init()
  }, [router])

  async function handleSetupComplete(payload: Parameters<typeof saveLifeData>[1]) {
    if (!authUserId) return
    setSetupSaving(true)
    try {
      const result = await saveLifeData(authUserId, payload)
      setScenarioId(result.scenarioId)
      setHasPlan(true)
      setBirthDate(payload.birthDate.slice(0, 10))
      setLifeExpectancy(payload.lifeExpectancyYears)
      setNetWorth(payload.baseNetWorth)
      setIncome(payload.baseMonthlyIncome)
      setExpenses(payload.baseMonthlyExpenses)
      setReturnYearly(payload.expectedReturnYearly)
      setInflationYearly(payload.inflationYearly)
      setInflateIncome(payload.inflateIncome ?? true)
      setInflateExpenses(payload.inflateExpenses ?? true)
      setRetirementAge(payload.retirementAge ?? 65)
      setRetirementMonthlyIncome(payload.retirementMonthlyIncome ?? 0)
      setInflateRetirementIncome(payload.inflateRetirementIncome ?? true)
      lastSavedPlanRef.current = JSON.stringify({
        birthDate: payload.birthDate.slice(0, 10),
        lifeExpectancyYears: payload.lifeExpectancyYears,
        baseNetWorth: payload.baseNetWorth,
        baseMonthlyIncome: payload.baseMonthlyIncome,
        baseMonthlyExpenses: payload.baseMonthlyExpenses,
        expectedReturnYearly: payload.expectedReturnYearly,
        inflationYearly: payload.inflationYearly,
        inflateIncome: payload.inflateIncome ?? true,
        inflateExpenses: payload.inflateExpenses ?? true,
        retirementAge: payload.retirementAge ?? 65,
        retirementMonthlyIncome: payload.retirementMonthlyIncome ?? 0,
        inflateRetirementIncome: payload.inflateRetirementIncome ?? true,
      })
    } finally {
      setSetupSaving(false)
    }
  }

  const birthDateAsDate = useMemo(
    () => new Date(birthDate + 'T12:00:00'),
    [birthDate]
  )

  const microPlansForEngine: LifeMicroPlan[] = useMemo(
    () =>
      microPlans.map(m => ({
        id: m.id,
        effectiveDate: new Date(m.effectiveDate + 'T12:00:00'),
        monthlyIncome: m.monthlyIncome,
        monthlyExpenses: m.monthlyExpenses,
        monthlyContribution: m.monthlyContribution,
      })),
    [microPlans]
  )

  const projection = useMemo(
    () =>
      buildLifeProjection({
        profile: {
          birthDate: birthDateAsDate,
          lifeExpectancyYears: lifeExpectancy,
        },
        settings: {
          baseNetWorth: netWorth,
          baseMonthlyIncome: income,
          baseMonthlyExpenses: expenses,
          monthlyContribution: Math.max(0, income - expenses),
          expectedReturnYearly: returnYearly,
          inflationYearly,
          inflateIncome,
          inflateExpenses,
          retirementAge,
          retirementMonthlyIncome,
          inflateRetirementIncome,
        },
        events,
        microPlans: microPlansForEngine,
      }),
    [
      birthDateAsDate,
      lifeExpectancy,
      netWorth,
      income,
      expenses,
      returnYearly,
      inflationYearly,
      inflateIncome,
      inflateExpenses,
      retirementAge,
      retirementMonthlyIncome,
      inflateRetirementIncome,
      events,
      microPlansForEngine,
    ]
  )

  const chartRangeKeys = useMemo(() => getChartRange(chartRange), [chartRange])
  const filteredMonthly = useMemo(
    () => filterMonthlyByRange(projection.monthly, chartRangeKeys),
    [projection.monthly, chartRangeKeys]
  )
  const filteredYearly = useMemo(
    () => filterYearlyByRange(projection.yearly, chartRangeKeys),
    [projection.yearly, chartRangeKeys]
  )

  const insights = useMemo(
    () =>
      getLifeInsights(
        projection,
        { birthDate: birthDateAsDate, lifeExpectancyYears: lifeExpectancy },
        {
          baseNetWorth: netWorth,
          baseMonthlyIncome: income,
          baseMonthlyExpenses: expenses,
          monthlyContribution: Math.max(0, income - expenses),
          expectedReturnYearly: returnYearly,
          inflationYearly,
          inflateIncome,
          inflateExpenses,
          retirementAge,
          retirementMonthlyIncome,
          inflateRetirementIncome,
        },
        currency
      ),
    [
      projection,
      birthDateAsDate,
      lifeExpectancy,
      netWorth,
      income,
      expenses,
      returnYearly,
      inflationYearly,
      inflateIncome,
      inflateExpenses,
      retirementAge,
      retirementMonthlyIncome,
      inflateRetirementIncome,
      currency,
    ]
  )

  const derivedContribution = Math.max(0, income - expenses)

  useEffect(() => {
    if (!authUserId || !hasPlan) return
    const payload = {
      birthDate,
      lifeExpectancyYears: lifeExpectancy,
      baseNetWorth: netWorth,
      baseMonthlyIncome: income,
      baseMonthlyExpenses: expenses,
      baseCurrency: currency,
      expectedReturnYearly: returnYearly,
      inflationYearly,
      inflateIncome,
      inflateExpenses,
      retirementAge,
      retirementMonthlyIncome,
      inflateRetirementIncome,
    }
    const payloadKey = JSON.stringify(payload)
    if (payloadKey === lastSavedPlanRef.current) return
    const t = setTimeout(async () => {
      setSaving(true)
      try {
        const result = await saveLifeData(authUserId, {
          birthDate: new Date(birthDate + 'T12:00:00').toISOString(),
          lifeExpectancyYears: lifeExpectancy,
          baseNetWorth: netWorth,
          baseMonthlyIncome: income,
          baseMonthlyExpenses: expenses,
          monthlyContribution: derivedContribution,
          expectedReturnYearly: returnYearly,
          inflationYearly,
          inflateIncome,
          inflateExpenses,
          retirementAge,
          retirementMonthlyIncome,
          inflateRetirementIncome,
          baseCurrency: currency,
        })
        setScenarioId(result.scenarioId)
        lastSavedPlanRef.current = payloadKey
      } finally {
        setSaving(false)
      }
    }, 1500)
    return () => clearTimeout(t)
  }, [
    authUserId,
    hasPlan,
    birthDate,
    lifeExpectancy,
    netWorth,
    income,
    expenses,
    currency,
    returnYearly,
    inflationYearly,
    inflateIncome,
    inflateExpenses,
    retirementAge,
    retirementMonthlyIncome,
    inflateRetirementIncome,
  ])

  async function handleSavePlan() {
    if (!authUserId) return
    setSaving(true)
    try {
      const result = await saveLifeData(authUserId, {
        birthDate: new Date(birthDate + 'T12:00:00').toISOString(),
        lifeExpectancyYears: lifeExpectancy,
        baseNetWorth: netWorth,
        baseMonthlyIncome: income,
        baseMonthlyExpenses: expenses,
        monthlyContribution: derivedContribution,
        expectedReturnYearly: returnYearly,
        inflationYearly,
        inflateIncome,
        inflateExpenses,
        retirementAge,
        retirementMonthlyIncome,
        inflateRetirementIncome,
        baseCurrency: currency,
      })
      setScenarioId(result.scenarioId)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddEvent(payload: {
    type: LifeEventType
    title: string
    date: string
    endDate?: string
    amount: number
    frequency: 'once' | 'monthly' | 'yearly'
    durationMonths?: number
    inflationIndexed: boolean
  }) {
    if (!authUserId) return
    let sid = scenarioId
    if (!sid) {
      const result = await saveLifeData(authUserId, {
        birthDate: new Date(birthDate + 'T12:00:00').toISOString(),
        lifeExpectancyYears: lifeExpectancy,
        baseNetWorth: netWorth,
        baseMonthlyIncome: income,
        baseMonthlyExpenses: expenses,
        monthlyContribution: derivedContribution,
        expectedReturnYearly: returnYearly,
        inflationYearly,
        inflateIncome,
        inflateExpenses,
        retirementAge,
        retirementMonthlyIncome,
        inflateRetirementIncome,
        baseCurrency: currency,
      })
      sid = result.scenarioId
      setScenarioId(sid)
    }
    setEventSaving(true)
    try {
      const { id } = await saveLifeEvent(authUserId, sid, payload)
      setEvents(prev => [
        ...prev,
        {
          id,
          type: payload.type,
          title: payload.title,
          date: new Date(payload.date),
          endDate: payload.endDate ? new Date(payload.endDate) : undefined,
          amount: payload.amount,
          frequency: payload.frequency,
          durationMonths: payload.durationMonths,
          inflationIndexed: payload.inflationIndexed,
        },
      ])
      setShowEventForm(false)
    } finally {
      setEventSaving(false)
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!authUserId) return
    await deleteLifeEvent(authUserId, id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  async function handleAddMicroPlan(payload: {
    effectiveDate: string
    monthlyIncome: number
    monthlyExpenses: number
    monthlyContribution: number
  }) {
    if (!authUserId || !scenarioId) return
    setMicroPlanSaving(true)
    try {
      const { id } = await saveLifeMicroPlan(authUserId, scenarioId, payload)
      setMicroPlans(prev => [
        ...prev,
        {
          id,
          effectiveDate: payload.effectiveDate,
          monthlyIncome: payload.monthlyIncome,
          monthlyExpenses: payload.monthlyExpenses,
          monthlyContribution: payload.monthlyContribution,
        },
      ])
      setShowMicroPlanForm(false)
    } finally {
      setMicroPlanSaving(false)
    }
  }

  async function handleDeleteMicroPlan(id: string) {
    if (!authUserId) return
    await deleteLifeMicroPlan(authUserId, id)
    setMicroPlans(prev => prev.filter(m => m.id !== id))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Carregando seu planejamento...
      </div>
    )
  }

  if (!hasPlan) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Seu plano de vida
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Responda algumas perguntas para criarmos seu cenário inicial.
          </p>
        </div>
        <SetupWizard
          onComplete={handleSetupComplete}
          isLoading={setupSaving}
        />
      </div>
    )
  }

  function focusSection(key: SidebarKey) {
    const navOnly = key === 'projecao' || key === 'insights' || key === 'tabela'
    if (!navOnly) setSectionOpen(prev => ({ ...prev, [key]: true }))
    setSidebarOpen(false)
    setTimeout(() => sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <EditSidebar
          onSelect={focusSection}
          isOverlay
          onCloseOverlay={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex gap-6 px-4 py-6">
        <div className="hidden w-fit shrink-0 overflow-hidden md:block">
          <div className="sticky top-6">
            <EditSidebar onSelect={focusSection} />
          </div>
        </div>
        <CurrencyProvider currency={currency} setCurrency={setCurrency}>
        <div className="min-w-0 flex-1">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                  onClick={() => setSidebarOpen(o => !o)}
                  aria-label="Abrir menu"
                >
                  <span className="text-sm">{sidebarOpen ? '✕' : '☰'}</span>
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Seu plano de vida
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Projeção patrimonial. Use a sidebar para navegar ou editar dados.
                  </p>
                </div>
              </div>
            </header>

        {/* Gráfico sempre visível no topo */}
        <div ref={el => { sectionRefs.current.projecao = el }} className="scroll-mt-24">
        <Card className="border-l-4 border-l-[hsl(var(--chart-1))]">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">Projeção patrimonial</CardTitle>
                <CardDescription>Evolução ao longo do tempo — use os filtros para alterar o período</CardDescription>
              </div>
              <ChartRangeFilter value={chartRange} onChange={setChartRange} />
            </div>
          </CardHeader>
          <CardContent>
            <LifeTimelineChart data={filteredMonthly} />
          </CardContent>
        </Card>
        </div>

        <div ref={el => { sectionRefs.current.insights = el }} className="scroll-mt-24">
        <LifeInsightsCard insights={insights} />
        </div>

        <div ref={el => { sectionRefs.current.tabela = el }} className="scroll-mt-24">
        <Card className="border-l-4 border-l-[hsl(var(--chart-2))]">
          <CardHeader>
            <CardTitle className="text-base">Tabela anual</CardTitle>
            <CardDescription>Resumo no período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <LifeProjectionTable
              yearlyData={filteredYearly}
              monthlyData={projection.monthly}
            />
          </CardContent>
        </Card>
        </div>

        {/* Seções colapsáveis para edição de dados */}
        <div ref={el => { sectionRefs.current.you = el }} className="scroll-mt-24">
          <CollapsibleCard
            title="Você hoje"
            description="Dados atuais para a projeção — salvamento automático após pausa na edição"
            open={sectionOpen.you}
            onOpenChange={o => setSectionOpen(prev => ({ ...prev, you: o }))}
          >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-muted-foreground">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lifeExp" className="text-muted-foreground">Expectativa de vida</Label>
              <Input
                id="lifeExp"
                type="number"
                min={60}
                max={110}
                value={lifeExpectancy}
                onChange={e => setLifeExpectancy(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="netWorth" className="text-muted-foreground">Patrimônio atual (R$)</Label>
              <Input
                id="netWorth"
                type="number"
                value={netWorth}
                onChange={e => setNetWorth(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="income" className="text-muted-foreground">Renda mensal (R$)</Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={e => setIncome(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenses" className="text-muted-foreground">Gastos mensais (R$)</Label>
              <Input
                id="expenses"
                type="number"
                value={expenses}
                onChange={e => setExpenses(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            O aporte é calculado automaticamente como renda − gastos.
          </p>
        </CollapsibleCard>
        </div>

        <div ref={el => { sectionRefs.current.aposentadoria = el }} className="scroll-mt-24">
          <CollapsibleCard
            title="Aposentadoria"
            description="Idade e renda a partir da aposentadoria — salvamento automático após pausa na edição"
            open={sectionOpen.aposentadoria}
            onOpenChange={o => setSectionOpen(prev => ({ ...prev, aposentadoria: o }))}
          >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retirementAge">Idade de aposentadoria</Label>
              <Input
                id="retirementAge"
                type="number"
                min={40}
                max={90}
                value={retirementAge}
                onChange={e => setRetirementAge(Number(e.target.value) || 65)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retirementMonthlyIncome">Renda mensal (R$)</Label>
              <Input
                id="retirementMonthlyIncome"
                type="number"
                min={0}
                value={retirementMonthlyIncome}
                onChange={e => setRetirementMonthlyIncome(Number(e.target.value) || 0)}
                placeholder="Ex: 8000"
              />
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inflateRetirementIncome}
              onChange={e => setInflateRetirementIncome(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span>Inflacionar renda de aposentadoria</span>
          </label>
        </CollapsibleCard>
        </div>

        <div ref={el => { sectionRefs.current.microPlans = el }} className="scroll-mt-24">
          <CollapsibleCard
          title="Micro planos"
          description="A partir de uma data: outra renda, gastos e aporte"
          open={sectionOpen.microPlans}
          onOpenChange={o => setSectionOpen(prev => ({ ...prev, microPlans: o }))}
          headerAction={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMicroPlanForm(p => !p)}
              disabled={!scenarioId}
            >
              {showMicroPlanForm ? 'Ocultar' : '+ Adicionar'}
            </Button>
          }
        >
          {showMicroPlanForm && (
            <div className="mb-4">
              <LifeMicroPlanForm
                onSubmit={handleAddMicroPlan}
                onCancel={() => setShowMicroPlanForm(false)}
              />
            </div>
          )}
          <LifeMicroPlansList microPlans={microPlans} onDelete={handleDeleteMicroPlan} />
        </CollapsibleCard>
        </div>

        <div ref={el => { sectionRefs.current.events = el }} className="scroll-mt-24">
          <CollapsibleCard
          title="Eventos de vida"
          description="Mudanças de renda, gastos e marcos"
          open={sectionOpen.events}
          onOpenChange={o => setSectionOpen(prev => ({ ...prev, events: o }))}
          headerAction={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEventForm(p => !p)}
            >
              {showEventForm ? 'Ocultar' : '+ Adicionar evento'}
            </Button>
          }
        >
          {showEventForm && (
            <div className="mb-4">
              <LifeEventForm
                onSubmit={handleAddEvent}
                onCancel={() => setShowEventForm(false)}
              />
            </div>
          )}
          <LifeEventsList events={events} onDelete={handleDeleteEvent} />
        </CollapsibleCard>
        </div>

        <div ref={el => { sectionRefs.current.configuracoes = el }} className="scroll-mt-24">
          <CollapsibleCard
            title="Configurações"
            description="Moeda, retorno, inflação e indexação — salvamento automático após pausa na edição"
            open={sectionOpen.configuracoes}
            onOpenChange={o => setSectionOpen(prev => ({ ...prev, configuracoes: o }))}
          >
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme" className="text-sm font-medium text-muted-foreground">Aparência</Label>
              <select
                id="theme"
                value={theme}
                onChange={e => setTheme(e.target.value as ThemeMode)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="light">Modo claro</option>
                <option value="dark">Modo escuro</option>
                <option value="system">Seguir sistema</option>
              </select>
            </div>
            <div>
              <Label htmlFor="currency" className="text-sm font-medium text-muted-foreground">Moeda</Label>
              <select
                id="currency"
                value={currency}
                onChange={e => setCurrency(e.target.value as CurrencyCode)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Retorno e inflação</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="returnYearly">Retorno anual (%)</Label>
                  <Input
                    id="returnYearly"
                    type="number"
                    value={returnYearly}
                    onChange={e => setReturnYearly(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inflationYearly">Inflação anual (%)</Label>
                  <Input
                    id="inflationYearly"
                    type="number"
                    value={inflationYearly}
                    onChange={e => setInflationYearly(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Indexação</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={inflateIncome}
                    onChange={e => setInflateIncome(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span>Inflacionar renda</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={inflateExpenses}
                    onChange={e => setInflateExpenses(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span>Inflacionar gastos</span>
                </label>
              </div>
            </div>
          </div>
        </CollapsibleCard>
        </div>
          </div>
        </div>
        </CurrencyProvider>
      </div>
    </div>
  )
}
