import { DashboardCard } from "@/components/DashboardCard"
import { formatCurrency, CurrencyCode } from "@/utils/currency"
import { RISK_PROFILES } from '@/constants/riskProfiles'
import { InvestmentPlanWithProfile } from "@/services/investment-plan.service"

interface PlanDetailsCardsProps {
  plan: InvestmentPlanWithProfile
  t: (key: string) => string
}

export function PlanDetailsCards({ plan, t }: PlanDetailsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Client Info Card */}
      <DashboardCard title={t('investmentPlan.details.clientInfo.title')}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.clientInfo.name')}</p>
            <p className="font-medium">{plan.profiles?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.form.planInitialDate')}</p>
            <p className="font-medium">
              {plan.plan_initial_date 
                ? new Date(plan.plan_initial_date).toLocaleDateString('pt-BR')
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.form.planEndAccumulationDate')}</p>
            <p className="font-medium">
              {plan.plan_end_accumulation_date
                ? new Date(plan.plan_end_accumulation_date).toLocaleDateString('pt-BR')
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.clientInfo.finalAge')}</p>
            <p className="font-medium">{plan.final_age} {t('investmentPlan.details.clientInfo.years')}</p>
          </div>
        </div>
      </DashboardCard>

      {/* Plan Overview Card */}
      <DashboardCard title={t('investmentPlan.details.planOverview.title')}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.planOverview.initialAmount')}</p>
            <p className="font-medium">
              {formatCurrency(plan.initial_amount, plan.currency as CurrencyCode)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.planOverview.monthlyDeposit')}</p>
            <p className="font-medium">
              {formatCurrency(plan.monthly_deposit, plan.currency as CurrencyCode)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.planOverview.adjustContributionForInflation')}</p>
            <p className="font-medium">
              {plan.adjust_contribution_for_inflation ? t('common.yes') : t('common.no')}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.planOverview.adjustIncomeForInflation')}</p>
            <p className="font-medium">
              {plan.adjust_income_for_inflation ? t('common.yes') : t('common.no')}
            </p>
          </div>
        </div>
      </DashboardCard>

      {/* Financial Goals Card */}
      <DashboardCard title={t('investmentPlan.details.financialGoals.title')}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.financialGoals.desiredMonthlyIncome')}</p>
            <p className="font-medium">
              {formatCurrency(plan.desired_income, plan.currency as CurrencyCode)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.financialGoals.inflationAdjustedIncome')}</p>
            <p className="font-medium">
              {formatCurrency(plan.inflation_adjusted_income, plan.currency as CurrencyCode)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.financialGoals.presentFutureValue')}</p>
            <p className="font-medium">
              {formatCurrency(plan.present_future_value, plan.currency as CurrencyCode)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.financialGoals.futureValue')}</p>
            <p className="font-medium">
              {formatCurrency(plan.future_value, plan.currency as CurrencyCode)}
            </p>
          </div>
        </div>
      </DashboardCard>

      {/* Investment Parameters Card */}
      <DashboardCard title={t('investmentPlan.details.investmentParams.title')}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.investmentParams.expectedReturn')}</p>
            <p className="font-medium">
              {(() => {
                const profiles = RISK_PROFILES[plan.currency]
                const profile = profiles.find(p => parseInt(p.return) === parseInt(plan.expected_return))
                return profile 
                  ? `${profile.label} (${plan.currency === 'BRL' ? 'IPCA' : 'CPI'}+${plan.expected_return}%)`
                  : `${plan.currency === 'BRL' ? 'IPCA' : 'CPI'}+${plan.expected_return}%`
              })()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.investmentParams.inflationRate')}</p>
            <p className="font-medium">{plan.inflation}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('investmentPlan.details.investmentParams.planType')}</p>
            <p className="font-medium">{t(`investmentPlan.details.investmentParams.types.${plan.plan_type}`)}</p>
          </div>

          {plan.plan_type === "1" && plan.limit_age && (
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPlan.form.endAge')}</p>
              <p className="font-medium">{plan.limit_age} {t('investmentPlan.details.clientInfo.years')}</p>
            </div>
          )}

          {plan.plan_type === "2" && (
            <>
              {plan.limit_age && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('investmentPlan.form.legacyAge')}</p>
                  <p className="font-medium">{plan.limit_age} {t('investmentPlan.details.clientInfo.years')}</p>
                </div>
              )}
              {plan.legacy_amount && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('investmentPlan.form.legacyAmount')}</p>
                  <p className="font-medium">
                    {formatCurrency(plan.legacy_amount, plan.currency as CurrencyCode)}
                  </p>
                </div>
              )}
            </>
          )}

          {plan.plan_type === "3" && (
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPlan.form.keepAge')}</p>
              <p className="font-medium">{plan.limit_age} {t('investmentPlan.details.clientInfo.years')}</p>
            </div>
          )}

          {plan.old_portfolio_profitability !== null && (
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPlan.form.oldPortfolioProfitability')}</p>
              <p className="font-medium">IPCA + {plan.old_portfolio_profitability}%</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  )
}
