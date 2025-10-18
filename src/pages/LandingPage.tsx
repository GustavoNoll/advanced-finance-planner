import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  Users, 
  PieChart, 
  Target, 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Mail,
  Sparkles,
  LineChart,
  Brain,
  Clock,
  Send,
  LogIn,
  Calculator as CalculatorIcon,
  Gauge
} from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useMemo } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { SimulationChart } from "@/components/broker-dashboard/SimulationChart"
import { generateChartProjections } from "@/lib/chart-projections"
import type { Profile, InvestmentPlan, FinancialRecord, Goal, ProjectedEvent } from "@/types/financial"
import { useTranslation } from "react-i18next"
import { formatCurrency } from "@/utils/currency"
import { detectCurrency } from "@/lib/locale-detection"

interface MetricCardProps {
  label: string
  value: string
  change: string
  icon: React.ComponentType<{ className?: string }>
}

function MetricCard({ label, value, change, icon: Icon }: MetricCardProps) {
  return (
    <Card className="border-blue-100 dark:border-blue-900 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
          <TrendingUp className="h-3 w-3" />
          {change}
        </p>
      </CardContent>
    </Card>
  )
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default function LandingPage() {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // Detecta a moeda automaticamente baseada no locale do navegador
  const currency = useMemo(() => detectCurrency(), [])

  // Mock data usando i18n
  const mockProfile: Profile = useMemo(() => ({
    id: 'demo-user',
    user_id: 'demo-user',
    name: t('landingPage.mocks.profile.name'),
    birth_date: '1988-07-15',
    email: 'demo@foundation.com',
    is_broker: false,
    created_at: '2023-07-01',
  }), [t])

  const mockInvestmentPlan: InvestmentPlan = useMemo(() => ({
    id: 'demo-plan',
    user_id: 'demo-user',
    plan_initial_date: '2023-07-01',
    plan_end_accumulation_date: '2053-07-01',
    initial_amount: 80000,
    final_age: 65,
    plan_type: '1',
    currency: currency,
    adjust_contribution_for_inflation: true,
    adjust_income_for_inflation: true,
    old_portfolio_profitability: 3,
    legacy_amount: 0,
    limit_age: 90,
    status: 'active' as const,
    created_at: '2023-07-01',
    updated_at: '2024-10-01',
    micro_investment_plans: [
      {
        id: 'demo-micro-plan',
        life_investment_plan_id: 'demo-plan',
        effective_date: '2023-07-01',
        monthly_deposit: 5000,
        desired_income: 15000,
        expected_return: 6.0,
        adjust_contribution_for_accumulated_inflation: false,
        adjust_income_for_accumulated_inflation: false,
        inflation: 4.5,
        created_at: '2023-07-01',
      }
    ],
  }), [])

  const mockFinancialRecords: FinancialRecord[] = useMemo(() => [
    { id: '1', user_id: 'demo-user', record_year: 2023, record_month: 7, starting_balance: 80000, monthly_contribution: 4500, monthly_return: 400, ending_balance: 84900, monthly_return_rate: 0.5, target_rentability: 0.5, created_at: '2023-07-01' },
    { id: '2', user_id: 'demo-user', record_year: 2023, record_month: 8, starting_balance: 84900, monthly_contribution: 4500, monthly_return: 446, ending_balance: 89846, monthly_return_rate: 0.52, target_rentability: 0.5, created_at: '2023-08-01' },
    { id: '3', user_id: 'demo-user', record_year: 2023, record_month: 9, starting_balance: 89846, monthly_contribution: 4500, monthly_return: 471, ending_balance: 94817, monthly_return_rate: 0.52, target_rentability: 0.5, created_at: '2023-09-01' },
    { id: '4', user_id: 'demo-user', record_year: 2023, record_month: 10, starting_balance: 94817, monthly_contribution: 4500, monthly_return: 496, ending_balance: 99813, monthly_return_rate: 0.52, target_rentability: 0.5, created_at: '2023-10-01' },
    { id: '5', user_id: 'demo-user', record_year: 2023, record_month: 11, starting_balance: 99813, monthly_contribution: 5000, monthly_return: 524, ending_balance: 105337, monthly_return_rate: 0.52, target_rentability: 0.5, created_at: '2023-11-01' },
    { id: '6', user_id: 'demo-user', record_year: 2023, record_month: 12, starting_balance: 105337, monthly_contribution: 5000, monthly_return: 551, ending_balance: 110888, monthly_return_rate: 0.52, target_rentability: 0.5, created_at: '2023-12-01' },
    { id: '7', user_id: 'demo-user', record_year: 2024, record_month: 1, starting_balance: 110888, monthly_contribution: 5000, monthly_return: 604, ending_balance: 116492, monthly_return_rate: 0.54, target_rentability: 0.5, created_at: '2024-01-01' },
    { id: '8', user_id: 'demo-user', record_year: 2024, record_month: 2, starting_balance: 116492, monthly_contribution: 5000, monthly_return: 636, ending_balance: 122128, monthly_return_rate: 0.54, target_rentability: 0.5, created_at: '2024-02-01' },
    { id: '9', user_id: 'demo-user', record_year: 2024, record_month: 3, starting_balance: 122128, monthly_contribution: 5000, monthly_return: 686, ending_balance: 127814, monthly_return_rate: 0.56, target_rentability: 0.5, created_at: '2024-03-01' },
    { id: '10', user_id: 'demo-user', record_year: 2024, record_month: 4, starting_balance: 127814, monthly_contribution: 5000, monthly_return: 739, ending_balance: 133553, monthly_return_rate: 0.58, target_rentability: 0.5, created_at: '2024-04-01' },
    { id: '11', user_id: 'demo-user', record_year: 2024, record_month: 5, starting_balance: 133553, monthly_contribution: 5000, monthly_return: 775, ending_balance: 139328, monthly_return_rate: 0.58, target_rentability: 0.5, created_at: '2024-05-01' },
    { id: '12', user_id: 'demo-user', record_year: 2024, record_month: 6, starting_balance: 139328, monthly_contribution: 5000, monthly_return: 804, ending_balance: 145132, monthly_return_rate: 0.58, target_rentability: 0.5, created_at: '2024-06-01' },
    { id: '13', user_id: 'demo-user', record_year: 2024, record_month: 7, starting_balance: 145132, monthly_contribution: 5000, monthly_return: 841, ending_balance: 150973, monthly_return_rate: 0.58, target_rentability: 0.5, created_at: '2024-07-01' },
    { id: '14', user_id: 'demo-user', record_year: 2024, record_month: 8, starting_balance: 150973, monthly_contribution: 5000, monthly_return: 876, ending_balance: 156849, monthly_return_rate: 0.58, target_rentability: 0.5, created_at: '2024-08-01' },
    { id: '15', user_id: 'demo-user', record_year: 2024, record_month: 9, starting_balance: 156849, monthly_contribution: 5000, monthly_return: 910, ending_balance: 162759, monthly_return_rate: 0.58, target_rentability: 0.5, created_at: '2024-09-01' },
    { id: '16', user_id: 'demo-user', record_year: 2024, record_month: 10, starting_balance: 162759, monthly_contribution: 5000, monthly_return: 944, ending_balance: 168703, monthly_return_rate: 0.58, target_rentability: 0.5, created_at: '2024-10-01' },
  ], [])

  const mockGoals: Goal[] = useMemo(() => [
    {
      id: 'goal-1',
      type: 'goal',
      profile_id: 'demo-user',
      icon: 'travel',
      asset_value: 50000,
      month: 6,
      year: 2026,
      payment_mode: 'none',
      name: t('landingPage.mocks.goals.europeTrip'),
      status: 'pending',
      created_at: '2024-01-01'
    },
    {
      id: 'goal-2',
      type: 'goal',
      profile_id: 'demo-user',
      icon: 'car',
      asset_value: 150000,
      month: 3,
      year: 2033,
      payment_mode: 'installment',
      installment_count: 36,
      installment_interval: 1,
      name: t('landingPage.mocks.goals.newCar'),
      status: 'pending',
      created_at: '2024-01-01'
    },
    {
      id: 'goal-3',
      type: 'goal',
      profile_id: 'demo-user',
      icon: 'house',
      asset_value: 800000,
      month: 9,
      year: 2041,
      payment_mode: 'none',
      name: t('landingPage.mocks.goals.ownHome'),
      status: 'pending',
      created_at: '2024-01-01'
    },
    {
      id: 'goal-4',
      type: 'goal',
      profile_id: 'demo-user',
      icon: 'education',
      asset_value: 300000,
      month: 2,
      year: 2048,
      payment_mode: 'installment',
      installment_count: 48,
      installment_interval: 1,
      name: t('landingPage.mocks.goals.childrenEducation'),
      status: 'pending',
      created_at: '2024-01-01'
    },
    {
      id: 'goal-5',
      type: 'goal',
      profile_id: 'demo-user',
      icon: 'hobby',
      asset_value: 30000,
      month: 11,
      year: 2029,
      payment_mode: 'none',
      name: t('landingPage.mocks.goals.hobbyEquipment'),
      status: 'pending',
      created_at: '2024-01-01'
    },
    {
      id: 'goal-6',
      type: 'goal',
      profile_id: 'demo-user',
      icon: 'travel',
      asset_value: 120000,
      month: 7,
      year: 2054,
      payment_mode: 'none',
      name: t('landingPage.mocks.goals.retirementAbroad'),
      status: 'pending',
      created_at: '2024-01-01'
    }
  ], [t])

  const mockEvents: ProjectedEvent[] = useMemo(() => [
    {
      id: 'event-1',
      type: 'event',
      profile_id: 'demo-user',
      name: t('landingPage.mocks.events.annualBonus'),
      asset_value: 35000,
      payment_mode: 'repeat',
      installment_count: 20,
      installment_interval: 12,
      icon: 'contribution',
      status: 'pending',
      month: 12,
      year: 2025,
      created_at: '2024-01-01'
    },
    {
      id: 'event-2',
      type: 'event',
      profile_id: 'demo-user',
      name: t('landingPage.mocks.events.homeRenovation'),
      asset_value: -120000,
      payment_mode: 'installment',
      installment_count: 12,
      installment_interval: 1,
      icon: 'renovation',
      status: 'pending',
      month: 6,
      year: 2031,
      created_at: '2024-01-01'
    },
    {
      id: 'event-3',
      type: 'event',
      profile_id: 'demo-user',
      name: t('landingPage.mocks.events.inheritance'),
      asset_value: 500000,
      payment_mode: 'none',
      icon: 'other',
      status: 'pending',
      month: 4,
      year: 2038,
      created_at: '2024-01-01'
    },
    {
      id: 'event-4',
      type: 'event',
      profile_id: 'demo-user',
      name: t('landingPage.mocks.events.carChange'),
      asset_value: -90000,
      payment_mode: 'none',
      icon: 'car',
      status: 'pending',
      month: 8,
      year: 2044,
      created_at: '2024-01-01'
    },
    {
      id: 'event-5',
      type: 'event',
      profile_id: 'demo-user',
      name: t('landingPage.mocks.events.propertySale'),
      asset_value: 600000,
      payment_mode: 'none',
      icon: 'other',
      status: 'pending',
      month: 3,
      year: 2051,
      created_at: '2024-01-01'
    }
  ], [t])

  const allocationData = useMemo(() => [
    { name: t('landingPage.mocks.allocation.fixedIncome'), value: 45, color: '#3b82f6' },
    { name: t('landingPage.mocks.allocation.multimarket'), value: 20, color: '#8b5cf6' },
    { name: t('landingPage.mocks.allocation.stocks'), value: 25, color: '#06b6d4' },
    { name: t('landingPage.mocks.allocation.foreign'), value: 10, color: '#10b981' },
  ], [t])

  const inflationIndex = useMemo(() => currency === 'BRL' ? 'IPCA' : 'CPI', [currency]);
  
  const metrics = useMemo(() => [
    { label: t('landingPage.metrics.clients'), value: "47", change: `+12% ${t('landingPage.stats.vsPreviousMonth')}`, icon: Users },
    { label: t('landingPage.metrics.patrimony'), value: formatCurrency(8700000, currency), change: `+23% ${t('landingPage.stats.vsPreviousMonth')}`, icon: TrendingUp },
    { label: t('landingPage.metrics.growth'), value: `${inflationIndex}+6.8%`, change: `+1.2% ${t('landingPage.stats.vsPreviousMonth')}`, icon: Target },
    { label: t('landingPage.metrics.satisfaction'), value: "94%", change: `+5% ${t('landingPage.stats.vsPreviousMonth')}`, icon: Shield },
  ], [t, currency, inflationIndex])

  const comparisonData = [
    { metric: 'Tempo até Aposentadoria', planned: 240, projected: 228, unit: 'meses', isCurrency: false },
    { metric: 'Contribuição Mensal', planned: 5000, projected: 4750, unit: '', isCurrency: true },
    { metric: 'Renda Mensal', planned: 15000, projected: 16200, unit: '', isCurrency: true },
  ]

  const features = [
    {
      icon: Brain,
      title: t('landingPage.features.feature1.title'),
      description: t('landingPage.features.feature1.description')
    },
    {
      icon: LineChart,
      title: t('landingPage.features.feature2.title'),
      description: t('landingPage.features.feature2.description')
    },
    {
      icon: PieChart,
      title: t('landingPage.features.feature3.title'),
      description: t('landingPage.features.feature3.description')
    },
    {
      icon: Shield,
      title: t('landingPage.features.feature6.title'),
      description: t('landingPage.features.feature6.description')
    },
    {
      icon: Target,
      title: t('landingPage.features.feature4.title'),
      description: t('landingPage.features.feature4.description')
    },
    {
      icon: Zap,
      title: t('landingPage.features.feature5.title'),
      description: t('landingPage.features.feature5.description')
    }
  ]

  // Gerar dados do gráfico usando a mesma lógica do sistema real
  const rawChartData = useMemo(() => {
    return generateChartProjections(
      mockProfile,
      mockInvestmentPlan,
      mockFinancialRecords,
      mockGoals, // objetivos fake
      mockEvents, // eventos fake
      {
        showRealValues: false,
        showNegativeValues: false,
        showOldPortfolio: false,
        showProjectedLine: true,
        showPlannedLine: true,
      },
      mockInvestmentPlan.micro_investment_plans || [] // microPlans
    )
  }, [mockProfile, mockInvestmentPlan, mockFinancialRecords, mockGoals, mockEvents])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const subject = "Interesse Foundation - Novo Lead"
      const body = `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`
      
      // Criar mailto link com os dados do formulário
      const mailtoLink = `mailto:foundationhub.app@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
      // Abrir cliente de email
      window.location.href = mailtoLink
      
      toast({
        title: t('landingPage.contact.success.title'),
        description: t('landingPage.contact.success.description'),
      })
      
      // Limpar formulário
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.errors.tryAgain'),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickContact = () => {
    window.location.href = "mailto:foundationhub.app@gmail.com?subject=Interesse Foundation"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Logo variant="full" className="h-6 sm:h-7" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline" 
                size="default"
                className="hidden sm:flex"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t('landingPage.header.login')}
              </Button>
              <Button onClick={handleQuickContact} size="default" className="bg-blue-600 hover:bg-blue-700">
                <Mail className="h-4 w-4 mr-2" />
                {t('landingPage.header.requestDemo')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjItMnptLTItMmgyLTJ6bTAtMmgyLTJ6bS0yIDJoMi0yem0wLTJoMi0yem0yIDBoMi0yem0wLTJoMi0yem0yIDJoMi0yem0wIDJoMi0yem0tMiAyaDItMnptMCAyaDItMnptMi0yaDItMnptMC0yaDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-sm px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1 inline" />
              {t('landingPage.hero.badge')}
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              {t('landingPage.hero.title')}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                {t('landingPage.hero.titleHighlight')}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('landingPage.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <Mail className="h-5 w-5 mr-2" />
                {t('landingPage.hero.requestDemo')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-lg border-2"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('landingPage.hero.viewDemo')}
              </Button>
            </div>
          </div>

          {/* Metrics Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Chart Preview - Usando SimulationChart Real */}
          <Card id="demo" className="border-2 border-blue-100 dark:border-blue-900 shadow-2xl mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-b">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <LineChart className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                    {t('landingPage.chart.title')}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    {t('landingPage.chart.description')}
                  </CardDescription>
                </div>
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {t('landingPage.chart.growth')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-visible">
              <SimulationChart
                profile={mockProfile}
                investmentPlan={mockInvestmentPlan}
                clientId="demo-user"
                allFinancialRecords={mockFinancialRecords}
                formData={{
                  initialAmount: '80000',
                  monthlyDeposit: '5000',
                  desiredIncome: '15000',
                  expectedReturn: '6.0',
                  inflation: '4.5',
                  planType: '1',
                  planInitialDate: '2023-07-01',
                  birthDate: '1988-07-15',
                  finalAge: '65',
                  currency: 'BRL',
                  adjustContributionForInflation: true,
                  adjustIncomeForInflation: true,
                  hasOldPortfolio: true,
                  oldPortfolioProfitability: '3',
                }}
                onFormDataChange={() => {}}
                rawChartData={rawChartData}
                chartOptions={{
                  showRealValues: false,
                  showNegativeValues: false,
                  showOldPortfolio: true,
                  showProjectedLine: true,
                  showPlannedLine: true,
                }}
                goals={mockGoals}
                events={mockEvents}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Video/Screenshot Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-sm px-4 py-1">
              <Brain className="h-3 w-3 mr-1 inline" />
              {t('landingPage.interface.badge')}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landingPage.interface.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('landingPage.interface.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Dashboard Preview */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 overflow-hidden hover:scale-105 transition-transform duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 border-b border-gray-200 dark:border-slate-700">
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {t('landingPage.demo.clientDashboard.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-slate-900">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        JD
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{t('landingPage.demo.clientDashboard.client1')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('landingPage.demo.clientDashboard.client1Patrimony', { value: formatCurrency(2400000, currency) })}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50">
                      {t('landingPage.demo.clientDashboard.onTrack')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                        MS
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{t('landingPage.demo.clientDashboard.client2')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('landingPage.demo.clientDashboard.client2Patrimony', { value: formatCurrency(1800000, currency) })}</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/50">
                      {t('landingPage.demo.clientDashboard.attention')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                        PC
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{t('landingPage.demo.clientDashboard.client3')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('landingPage.demo.clientDashboard.client3Patrimony', { value: formatCurrency(3100000, currency) })}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50">
                      {t('landingPage.demo.clientDashboard.excellent')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts Preview */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 overflow-hidden hover:scale-105 transition-transform duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 border-b border-gray-200 dark:border-slate-700">
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  {t('landingPage.demo.alerts.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-slate-900">
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">{t('landingPage.demo.alerts.lateContribution')}</p>
                        <p className="text-yellow-700/70 dark:text-yellow-300/60 text-xs mt-1">{t('landingPage.demo.alerts.lateContributionDesc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-green-800 dark:text-green-200 font-medium text-sm">{t('landingPage.demo.alerts.goalAchieved')}</p>
                        <p className="text-green-700/70 dark:text-green-300/60 text-xs mt-1">{t('landingPage.demo.alerts.goalAchievedDesc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-800 dark:text-blue-200 font-medium text-sm">{t('landingPage.demo.alerts.abovePerformance')}</p>
                        <p className="text-blue-700/70 dark:text-blue-300/60 text-xs mt-1">{t('landingPage.demo.alerts.abovePerformanceDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landingPage.resources.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('landingPage.resources.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Demo Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landingPage.optimization.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('landingPage.optimization.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Comparison Cards */}
            <div className="space-y-4">
              {comparisonData.map((item, index) => (
                <Card key={index} className="border-2 hover:border-blue-400 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{item.metric}</span>
                      <CalculatorIcon className="h-5 w-5 text-blue-600" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('landingPage.optimization.planned')}</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {item.isCurrency ? formatCurrency(item.planned, currency) : `${item.planned} ${item.unit}`}
                        </p>
                      </div>
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('landingPage.optimization.projected')}</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {item.isCurrency ? formatCurrency(item.projected, currency) : `${item.projected} ${item.unit}`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Allocation Chart */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  {t('landingPage.optimization.allocation.title')}
                </CardTitle>
                <CardDescription>
                  {t('landingPage.optimization.allocation.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RechartsPieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landingPage.metricsSection.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('landingPage.metricsSection.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('landingPage.metricsSection.successRate')}</CardTitle>
                  <Gauge className="h-8 w-8 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-green-600 mb-2">94%</div>
                <p className="text-gray-600 dark:text-gray-400">{t('landingPage.metricsSection.successRateDesc')}</p>
                <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: '94%' }} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('landingPage.metricsSection.engagement')}</CardTitle>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-blue-600 mb-2">87%</div>
                <p className="text-gray-600 dark:text-gray-400">{t('landingPage.metricsSection.engagementDesc')}</p>
                <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '87%' }} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('landingPage.metricsSection.avgReturn')}</CardTitle>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-purple-600 mb-2">{inflationIndex}+6.8%</div>
                <p className="text-gray-600 dark:text-gray-400">{t('landingPage.metricsSection.avgReturnDesc')}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+1.2% {t('landingPage.metricsSection.vsPreviousYear')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landingPage.features.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto border-2 border-blue-200 dark:border-blue-800 shadow-2xl overflow-hidden">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <Send className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('landingPage.contact.title')}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {t('landingPage.contact.description')}
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('landingPage.contact.form.name')}
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('landingPage.contact.form.namePlaceholder')}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('landingPage.contact.form.email')}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('landingPage.contact.form.emailPlaceholder')}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('landingPage.contact.form.message')}
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('landingPage.contact.form.messagePlaceholder')}
                    rows={4}
                    className="w-full"
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? t('landingPage.contact.form.sending') : t('landingPage.contact.form.submit')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('landingPage.contactDirect')}
                  </p>
                  <Button 
                    onClick={handleQuickContact}
                    variant="outline"
                    size="lg"
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    foundationhub.app@gmail.com
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 mt-8">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>{t('landingPage.guarantees.secure')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span>{t('landingPage.guarantees.fastResponse')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span>{t('landingPage.guarantees.noCommitment')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="filter brightness-0 invert">
              <Logo variant="full" className="h-8" />
            </div>
            <div className="flex items-center gap-2"></div>
            <p className="text-gray-400 text-center">
              {t('landingPage.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
