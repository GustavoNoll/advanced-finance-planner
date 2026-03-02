import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { RISK_PROFILES } from '@/constants/riskProfiles'
import { ASSET_CLASS_LABELS } from '@/constants/assetAllocations'
import { calculateAge } from '@/lib/utils'
import type { ComparisonClientData } from '../types/client-comparison'
import type { InvestmentPolicyData } from '@/features/investment-policy/services/investment-policy.service'

const COMPARISON_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']

const ACCEPTABLE_LOSS_MAP: Record<string, string> = {
  '0': 'no_loss',
  '5': 'five_percent',
  '10': 'ten_percent',
  '15': 'fifteen_percent',
  '20': 'twenty_percent',
  '25': 'twenty_five_percent',
}

function formatTargetReturnIpcaPlus(
  value?: string,
  t?: (key: string, options?: { defaultValue?: string }) => string
): string {
  if (!value) return '-'
  const match = value.match(/ipca_plus_(\d+)/i)
  if (match) return t ? t(`investmentPreferences.options.targetReturns.${value}`, { defaultValue: `IPCA + ${match[1]}%` }) : `IPCA + ${match[1]}%`
  return value
}

function formatAssetAllocations(
  allocations?: Record<string, number>,
  t?: (key: string, options?: { defaultValue?: string }) => string
): string {
  if (!allocations || Object.keys(allocations).length === 0) return '-'
  const parts = Object.entries(allocations)
    .filter(([, v]) => (v as number) > 0)
    .map(([k, v]) => {
      const label = t ? t(`investmentPreferences.assets.${k}`, { defaultValue: ASSET_CLASS_LABELS[k as keyof typeof ASSET_CLASS_LABELS] || k }) : ASSET_CLASS_LABELS[k as keyof typeof ASSET_CLASS_LABELS] || k
      return `${label} ${(v as number).toFixed(1)}%`
    })
  return parts.join(', ') || '-'
}

function formatTranslatedOption(
  value: string | undefined,
  translationKeyPrefix: string,
  t: (key: string, options?: { defaultValue?: string }) => string
): string {
  if (!value) return '-'
  const translationKey = `${translationKeyPrefix}.${value}`
  const translated = t(translationKey, { defaultValue: value })
  return translated || value
}

interface InvestmentPolicyComparisonTableProps {
  clientData: ComparisonClientData[]
}

export function InvestmentPolicyComparisonTable({
  clientData,
}: InvestmentPolicyComparisonTableProps) {
  const { t } = useTranslation()

  if (clientData.length === 0) return null

  const clientNames = clientData.map((c) => c.profile.name)
  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const formatCurrencyOrDash = (value: number | null): string =>
    value == null ? '-' : formatCurrency(value)

  const sumByValue = (items?: Array<{ value?: number }>): number | null => {
    if (!items || items.length === 0) return null
    return items.reduce((acc, item) => acc + (item.value ?? 0), 0)
  }

  const sumByAmount = (items?: Array<{ amount?: number }>): number | null => {
    if (!items || items.length === 0) return null
    return items.reduce((acc, item) => acc + (item.amount ?? 0), 0)
  }

  const sumNullable = (...values: Array<number | null>): number | null => {
    const existing = values.filter((value): value is number => value != null)
    if (existing.length === 0) return null
    return existing.reduce((acc, value) => acc + value, 0)
  }

  const getRiskProfileLabel = (policy: InvestmentPolicyData | null): string => {
    if (!policy?.investment_preferences?.risk_profile) return '-'
    const profile = RISK_PROFILES.BRL.find(
      (p) => p.value === policy.investment_preferences?.risk_profile
    )
    return profile?.label ?? policy.investment_preferences.risk_profile
  }

  const getTargetReturn = (policy: InvestmentPolicyData | null): string =>
    formatTargetReturnIpcaPlus(
      policy?.investment_preferences?.target_return_ipca_plus,
      t
    )

  const getMaxAcceptableLoss = (policy: InvestmentPolicyData | null): string => {
    const val = policy?.investment_preferences?.max_acceptable_loss
    if (!val) return '-'
    const key = ACCEPTABLE_LOSS_MAP[val] ?? val
    const translated = t(`investmentPreferences.options.acceptableLoss.${key}`, {
      defaultValue: val,
    })
    return translated !== `investmentPreferences.options.acceptableLoss.${key}`
      ? translated
      : `${val}%`
  }

  const getLifeStage = (policy: InvestmentPolicyData | null): string => {
    const stage = policy?.life_information?.life_stage
    if (!stage) return '-'
    return t(`investmentPolicy.lifeStage.options.${stage}`, {
      defaultValue: stage,
    })
  }

  const getTargetReturnReview = (policy: InvestmentPolicyData | null): string =>
    formatTranslatedOption(
      policy?.investment_preferences?.target_return_review,
      'investmentPreferences.options.reviewPeriods',
      t
    )

  const getMaxBondMaturity = (policy: InvestmentPolicyData | null): string =>
    formatTranslatedOption(
      policy?.investment_preferences?.max_bond_maturity,
      'investmentPreferences.options.bondMaturities',
      t
    )

  const getMaxFundLiquidity = (policy: InvestmentPolicyData | null): string =>
    formatTranslatedOption(
      policy?.investment_preferences?.max_fund_liquidity,
      'investmentPreferences.options.fundLiquidity',
      t
    )

  const getPlatformsUsed = (policy: InvestmentPolicyData | null): string => {
    const platforms = policy?.investment_preferences?.platforms_used ?? []
    if (!platforms.length) return '-'
    return platforms.map((platform) => platform.name).join(', ')
  }

  const getOccupation = (policy: InvestmentPolicyData | null): string =>
    policy?.professional_information?.occupation || '-'

  const getAge = (c: ComparisonClientData): string => {
    if (!c.profile.birth_date) return '-'
    return `${calculateAge(c.profile.birth_date)}`
  }

  const getMaritalStatus = (policy: InvestmentPolicyData | null): string => {
    const status = policy?.family_structures?.marital_status
    if (!status) return '-'
    return t(`familyStructure.maritalStatus.options.${status}`, { defaultValue: status })
  }

  const getChildrenCount = (policy: InvestmentPolicyData | null): string => {
    const children = policy?.family_structures?.children ?? []
    if (!children.length) return t('clientSummary.noChildren', { defaultValue: '0' })
    return `${children.length}`
  }

  const getPatrimonialBreakdown = (policy: InvestmentPolicyData | null) => {
    const patrimonial = policy?.patrimonial_situations
    const investments = sumByValue(
      patrimonial?.investments?.properties as Array<{ value?: number }> | undefined
    )
    const liquidInvestments = sumByValue(
      patrimonial?.investments?.liquid_investments as Array<{ value?: number }> | undefined
    )
    const participations = sumByValue(
      patrimonial?.investments?.participations as Array<{ value?: number }> | undefined
    )
    const emergencyReserve = sumByValue(
      patrimonial?.investments?.emergency_reserve as Array<{ value?: number }> | undefined
    )
    const properties = sumByValue(
      patrimonial?.personal_assets?.properties as Array<{ value?: number }> | undefined
    )
    const vehicles = sumByValue(
      patrimonial?.personal_assets?.vehicles as Array<{ value?: number }> | undefined
    )
    const valuableGoods = sumByValue(
      patrimonial?.personal_assets?.valuable_goods as Array<{ value?: number }> | undefined
    )
    const totalInvestments = sumNullable(investments, liquidInvestments, participations)
    const totalPatrimony = sumNullable(
      totalInvestments,
      emergencyReserve,
      properties,
      vehicles,
      valuableGoods
    )

    return {
      totalPatrimony,
      totalInvestments,
      emergencyReserve,
      properties,
      vehicles,
      valuableGoods,
    }
  }

  const getTotalPatrimony = (policy: InvestmentPolicyData | null): string =>
    formatCurrencyOrDash(getPatrimonialBreakdown(policy).totalPatrimony)

  const getInvestments = (policy: InvestmentPolicyData | null): string =>
    formatCurrencyOrDash(getPatrimonialBreakdown(policy).totalInvestments)

  const getEmergencyReserve = (policy: InvestmentPolicyData | null): string =>
    formatCurrencyOrDash(getPatrimonialBreakdown(policy).emergencyReserve)

  const getProperties = (policy: InvestmentPolicyData | null): string =>
    formatCurrencyOrDash(getPatrimonialBreakdown(policy).properties)

  const getVehicles = (policy: InvestmentPolicyData | null): string =>
    formatCurrencyOrDash(getPatrimonialBreakdown(policy).vehicles)

  const getValuableGoods = (policy: InvestmentPolicyData | null): string =>
    formatCurrencyOrDash(getPatrimonialBreakdown(policy).valuableGoods)

  const getBudgetBreakdown = (policy: InvestmentPolicyData | null) => {
    const budget = policy?.budgets
    const income = sumByAmount(budget?.incomes as Array<{ amount?: number }> | undefined)
    const expenses = sumByAmount(budget?.expenses as Array<{ amount?: number }> | undefined)
    const savings = budget?.savings ?? null

    return { income, expenses, savings }
  }

  const getIncome = (policy: InvestmentPolicyData | null): string =>
    formatCurrencyOrDash(getBudgetBreakdown(policy).income)

  const getExpense = (policy: InvestmentPolicyData | null): string =>
    formatCurrencyOrDash(getBudgetBreakdown(policy).expenses)

  const getSavings = (policy: InvestmentPolicyData | null): string =>
    formatCurrencyOrDash(getBudgetBreakdown(policy).savings)

  const getObjectives = (policy: InvestmentPolicyData | null): string => {
    const objectives = policy?.life_information?.objectives ?? []
    if (!objectives.length) return '-'
    return objectives.map((objective) => objective.name).join(', ')
  }

  const getInsurances = (policy: InvestmentPolicyData | null): string => {
    const insurances = policy?.life_information?.insurances ?? []
    if (!insurances.length) return '-'
    return insurances.map((insurance) => insurance.type).join(', ')
  }

  const getHobbies = (policy: InvestmentPolicyData | null): string => {
    const hobbies = policy?.life_information?.hobbies ?? []
    if (!hobbies.length) return '-'
    return hobbies.map((hobby) => hobby.name).join(', ')
  }

  const policyRows: { label: string; getValue: (c: ComparisonClientData) => string }[] = [
    {
      label: t('clientSummary.occupation', { defaultValue: 'Ocupação' }),
      getValue: (c) => getOccupation(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.age'),
      getValue: (c) => getAge(c),
    },
    {
      label: t('clientSummary.maritalStatus'),
      getValue: (c) => getMaritalStatus(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.children'),
      getValue: (c) => getChildrenCount(c.investmentPolicy ?? null),
    },
    {
      label: t('patrimonial.title'),
      getValue: (c) => getTotalPatrimony(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.investments'),
      getValue: (c) => getInvestments(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.emergencyReserve'),
      getValue: (c) => getEmergencyReserve(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.properties'),
      getValue: (c) => getProperties(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.vehicles'),
      getValue: (c) => getVehicles(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.valuableGoods'),
      getValue: (c) => getValuableGoods(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.income'),
      getValue: (c) => getIncome(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.expense'),
      getValue: (c) => getExpense(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.savings'),
      getValue: (c) => getSavings(c.investmentPolicy ?? null),
    },
    {
      label: t('financialGoals.title'),
      getValue: (c) => getObjectives(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.insuranceCoverage'),
      getValue: (c) => getInsurances(c.investmentPolicy ?? null),
    },
    {
      label: t('clientSummary.hobbies'),
      getValue: (c) => getHobbies(c.investmentPolicy ?? null),
    },
    {
      label: t('clientComparison.policy.riskProfile'),
      getValue: (c) => getRiskProfileLabel(c.investmentPolicy ?? null),
    },
    {
      label: t('clientComparison.policy.targetReturn'),
      getValue: (c) => getTargetReturn(c.investmentPolicy ?? null),
    },
    {
      label: t('investmentPreferences.form.targetReturnReview'),
      getValue: (c) => getTargetReturnReview(c.investmentPolicy ?? null),
    },
    {
      label: t('investmentPreferences.form.maxBondMaturity'),
      getValue: (c) => getMaxBondMaturity(c.investmentPolicy ?? null),
    },
    {
      label: t('investmentPreferences.form.maxFundLiquidity'),
      getValue: (c) => getMaxFundLiquidity(c.investmentPolicy ?? null),
    },
    {
      label: t('clientComparison.policy.maxAcceptableLoss'),
      getValue: (c) => getMaxAcceptableLoss(c.investmentPolicy ?? null),
    },
    {
      label: t('investmentPreferences.form.platformsUsed'),
      getValue: (c) => getPlatformsUsed(c.investmentPolicy ?? null),
    },
    {
      label: t('clientComparison.policy.lifeStage'),
      getValue: (c) => getLifeStage(c.investmentPolicy ?? null),
    },
    {
      label: t('clientComparison.policy.assetAllocation'),
      getValue: (c) =>
        formatAssetAllocations(
          c.investmentPolicy?.asset_allocations ?? undefined,
          t
        ),
    },
  ]

  return (
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
          {policyRows.map((row) => (
            <TableRow key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                {row.label}
              </TableCell>
              {clientData.map((c) => (
                <TableCell
                  key={c.clientId}
                  className="text-right text-sm max-w-[200px] break-words"
                  title={row.label === t('clientComparison.policy.assetAllocation') ? row.getValue(c) : undefined}
                >
                  {row.getValue(c)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
