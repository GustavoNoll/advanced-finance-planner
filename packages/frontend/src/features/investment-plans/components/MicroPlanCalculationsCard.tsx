import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { formatCurrency, CurrencyCode } from '@/utils/currency'
import { InvestmentPlanWithProfile } from '@/features/investment-plans/services/investment-plan.service'
import { MicroInvestmentPlan } from '@/types/financial'
import { Calculations } from '@/utils/investmentPlanCalculations'
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Calculator,
  Building2,
  Scale
} from 'lucide-react'

interface MicroPlanCalculationsCardProps {
  plan: InvestmentPlanWithProfile
  activeMicroPlan: MicroInvestmentPlan | null
  calculations: Calculations | null
  t: (key: string) => string
}

interface PlanMetricProps {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}

function PlanMetric({ icon, label, value, color }: PlanMetricProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}

export function MicroPlanCalculationsCard({ 
  plan, 
  activeMicroPlan, 
  calculations, 
  t 
}: MicroPlanCalculationsCardProps) {
  if (!activeMicroPlan || !calculations) {
    return null
  }

  const currency = plan.currency as CurrencyCode

  const calculationMetrics: PlanMetricProps[] = [
    {
      icon: <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      label: t('investmentPlan.details.planOverview.initialAmount'),
      value: formatCurrency(plan.initial_amount, currency),
      color: "text-amber-600 dark:text-amber-400"
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
      label: t('investmentPlan.details.planOverview.monthlyDeposit'),
      value: formatCurrency(activeMicroPlan.monthly_deposit, currency),
      color: "text-rose-600 dark:text-rose-400"
    },
    {
      icon: <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
      label: t('investmentPlan.details.financialGoals.desiredMonthlyIncome'),
      value: formatCurrency(activeMicroPlan.desired_income, currency),
      color: "text-cyan-600 dark:text-cyan-400"
    },
    {
      icon: <Scale className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
      label: t('investmentPlan.details.financialGoals.inflationAdjustedIncome'),
      value: formatCurrency(calculations.inflationAdjustedIncome || 0, currency),
      color: "text-indigo-600 dark:text-indigo-400"
    },
    {
      icon: <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      label: t('investmentPlan.details.financialGoals.presentFutureValue'),
      value: formatCurrency(calculations.presentFutureValue || 0, currency),
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      icon: <Calculator className="h-4 w-4 text-violet-600 dark:text-violet-400" />,
      label: t('investmentPlan.details.financialGoals.futureValue'),
      value: formatCurrency(calculations.futureValue || 0, currency),
      color: "text-violet-600 dark:text-violet-400"
    }
  ]

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t('investmentPlan.details.calculations.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calculationMetrics.map((metric, index) => (
              <PlanMetric key={index} {...metric} />
            ))}
          </div>
          
          {/* Additional calculation info */}
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground">{t('investmentPlan.details.calculations.expectedReturn')}</p>
                <p className="font-medium">{activeMicroPlan.expected_return}%</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">{t('investmentPlan.details.calculations.inflation')}</p>
                <p className="font-medium">{activeMicroPlan.inflation}%</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">{t('investmentPlan.details.calculations.realReturn')}</p>
                <p className="font-medium">{formatCurrency(calculations.realReturn || 0, currency)}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">{t('investmentPlan.details.calculations.inflationReturn')}</p>
                <p className="font-medium">{formatCurrency(calculations.inflationReturn || 0, currency)}</p>
              </div>
              <div className="text-center"> 
                <p className="text-muted-foreground">{t('investmentPlan.details.calculations.totalMonthlyReturn')}</p>
                <p className="font-medium">{formatCurrency(calculations.totalMonthlyReturn || 0, currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
