import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { formatCurrency } from '@/utils/currency'
import type { ComparisonClientData } from '../types/client-comparison'
import type { CurrencyCode } from '@/utils/currency'

const COMPARISON_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']

function getAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function getPlanTypeLabel(planType: string, t: (key: string) => string): string {
  const key = `investmentPlan.planTypes.${
    planType === '1' ? 'endAt120' : planType === '2' ? 'leave1M' : 'keepPrincipal'
  }`
  return t(key) || planType
}

interface BasicDataComparisonTableProps {
  clientData: ComparisonClientData[]
}

export function BasicDataComparisonTable({ clientData }: BasicDataComparisonTableProps) {
  const { t } = useTranslation()

  if (clientData.length === 0) return null

  const clientNames = clientData.map((c) => c.profile.name)
  const currency = (clientData[0]?.plan?.currency || 'BRL') as CurrencyCode

  const basicRows: { label: string; getValue: (c: ComparisonClientData) => string }[] = [
    {
      label: t('clientComparison.basic.name'),
      getValue: (c) => c.profile.name,
    },
    {
      label: t('clientComparison.basic.age'),
      getValue: (c) => String(getAge(c.profile.birth_date)),
    },
    {
      label: t('clientComparison.basic.planType'),
      getValue: (c) => getPlanTypeLabel(c.plan.plan_type, t),
    },
    {
      label: t('clientComparison.basic.initialAmount'),
      getValue: (c) => formatCurrency(c.plan.initial_amount, currency),
    },
    {
      label: t('clientComparison.basic.finalAge'),
      getValue: (c) => String(c.plan.final_age),
    },
    {
      label: t('clientComparison.basic.microPlansCount'),
      getValue: (c) => String(c.microPlans.length),
    },
    {
      label: t('clientComparison.basic.monthlyDeposit'),
      getValue: (c) => {
        const active = c.microPlans[c.microPlans.length - 1] ?? c.microPlans[0]
        return active ? formatCurrency(active.monthly_deposit, currency) : '-'
      },
    },
    {
      label: t('clientComparison.basic.expectedReturn'),
      getValue: (c) => {
        const active = c.microPlans[c.microPlans.length - 1] ?? c.microPlans[0]
        return active ? `${Number(active.expected_return).toFixed(2)}%` : '-'
      },
    },
    {
      label: t('clientComparison.basic.inflation'),
      getValue: (c) => {
        const active = c.microPlans[c.microPlans.length - 1] ?? c.microPlans[0]
        return active ? `${Number(active.inflation).toFixed(2)}%` : '-'
      },
    },
    {
      label: t('clientComparison.basic.goalsCount'),
      getValue: (c) => String(c.goals.length),
    },
    {
      label: t('clientComparison.basic.eventsCount'),
      getValue: (c) => String(c.events.length),
    },
  ]

  const calculationRows: { label: string; getValue: (c: ComparisonClientData) => string }[] = [
    {
      label: t('clientComparison.calculations.presentFutureValue'),
      getValue: (c) =>
        c.calculations ? formatCurrency(c.calculations.presentFutureValue || 0, currency) : '-',
    },
    {
      label: t('clientComparison.calculations.futureValue'),
      getValue: (c) =>
        c.calculations ? formatCurrency(c.calculations.futureValue || 0, currency) : '-',
    },
    {
      label: t('clientComparison.calculations.inflationAdjustedIncome'),
      getValue: (c) =>
        c.calculations ? formatCurrency(c.calculations.inflationAdjustedIncome || 0, currency) : '-',
    },
    {
      label: t('clientComparison.calculations.requiredMonthlyDeposit'),
      getValue: (c) =>
        c.calculations ? formatCurrency(c.calculations.requiredMonthlyDeposit || 0, currency) : '-',
    },
    {
      label: t('clientComparison.calculations.realReturn'),
      getValue: (c) =>
        c.calculations ? formatCurrency(c.calculations.realReturn || 0, currency) : '-',
    },
    {
      label: t('clientComparison.calculations.inflationReturn'),
      getValue: (c) =>
        c.calculations ? formatCurrency(c.calculations.inflationReturn || 0, currency) : '-',
    },
    {
      label: t('clientComparison.calculations.totalMonthlyReturn'),
      getValue: (c) =>
        c.calculations ? formatCurrency(c.calculations.totalMonthlyReturn || 0, currency) : '-',
    },
  ]

  const hasCalculations = clientData.some((c) => c.calculations != null)

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead className="font-semibold w-48">
                {t('clientComparison.basic.metric')}
              </TableHead>
              {clientNames.map((name, i) => (
                <TableHead
                  key={name}
                  className="text-right font-semibold"
                  style={{ color: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}
                >
                  {name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {basicRows.map((row) => (
              <TableRow key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                  {row.label}
                </TableCell>
                {clientData.map((c) => (
                  <TableCell key={c.clientId} className="text-right font-mono">
                    {row.getValue(c)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasCalculations && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            {t('clientComparison.calculations.title')}
          </h3>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="font-semibold w-48">
                    {t('clientComparison.basic.metric')}
                  </TableHead>
                  {clientNames.map((name, i) => (
                    <TableHead
                      key={name}
                      className="text-right font-semibold"
                      style={{ color: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}
                    >
                      {name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculationRows.map((row) => (
                  <TableRow key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                      {row.label}
                    </TableCell>
                    {clientData.map((c) => (
                      <TableCell key={c.clientId} className="text-right font-mono">
                        {row.getValue(c)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
