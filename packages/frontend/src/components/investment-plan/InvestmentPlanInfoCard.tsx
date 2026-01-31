import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, CurrencyCode } from '@/utils/currency'
import { RISK_PROFILES } from '@/constants/riskProfiles'
import { InvestmentPlanWithProfile } from '@/services/investment-plan.service'
import { MicroInvestmentPlan } from '@/types/financial'
import { Calculations } from '@/utils/investmentPlanCalculations'
import { User, Calendar, DollarSign, Target, TrendingUp, Building2 } from 'lucide-react'

interface InvestmentPlanInfoCardProps {
  plan: InvestmentPlanWithProfile
  activeMicroPlan: MicroInvestmentPlan | null
  calculations: Calculations | null
  t: (key: string) => string
}

export function InvestmentPlanInfoCard({ 
  plan, 
  activeMicroPlan, 
  calculations, 
  t 
}: InvestmentPlanInfoCardProps) {
  const currencySymbol = plan.currency === 'BRL' ? 'R$' : plan.currency === 'USD' ? '$' : '€'
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {t('investmentPlan.edit.lifePlanInfo.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('investmentPlan.details.clientInfo.title')}
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.clientInfo.name')}</p>
                <p className="font-medium">{plan.profiles?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.form.planInitialDate')}</p>
                <p className="font-medium">
                  {plan.plan_initial_date 
                    ? new Date(plan.plan_initial_date).toLocaleDateString('pt-BR')
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.form.planEndAccumulationDate')}</p>
                <p className="font-medium">
                  {plan.plan_end_accumulation_date
                    ? new Date(plan.plan_end_accumulation_date).toLocaleDateString('pt-BR')
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.clientInfo.finalAge')}</p>
                <p className="font-medium">{plan.final_age} {t('investmentPlan.details.clientInfo.years')}</p>
              </div>
            </div>
          </div>

          {/* Plan Overview */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('investmentPlan.details.planOverview.title')}
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.planOverview.initialAmount')}</p>
                <p className="font-medium">
                  {formatCurrency(plan.initial_amount, plan.currency as CurrencyCode)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.planOverview.monthlyDeposit')}</p>
                <p className="font-medium">
                  {formatCurrency(
                    activeMicroPlan?.monthly_deposit || 0, 
                    plan.currency as CurrencyCode
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.planOverview.adjustContributionForInflation')}</p>
                <Badge variant={plan.adjust_contribution_for_inflation ? "default" : "secondary"}>
                  {plan.adjust_contribution_for_inflation ? t('common.yes') : t('common.no')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.planOverview.adjustIncomeForInflation')}</p>
                <Badge variant={plan.adjust_income_for_inflation ? "default" : "secondary"}>
                  {plan.adjust_income_for_inflation ? t('common.yes') : t('common.no')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Financial Goals */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t('investmentPlan.details.financialGoals.title')}
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.financialGoals.desiredMonthlyIncome')}</p>
                <p className="font-medium">
                  {formatCurrency(
                    activeMicroPlan?.desired_income || 0, 
                    plan.currency as CurrencyCode
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.financialGoals.inflationAdjustedIncome')}</p>
                <p className="font-medium">
                  {formatCurrency(
                    calculations?.inflationAdjustedIncome || 0, 
                    plan.currency as CurrencyCode
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.financialGoals.presentFutureValue')}</p>
                <p className="font-medium">
                  {formatCurrency(
                    calculations?.presentFutureValue || 0, 
                    plan.currency as CurrencyCode
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.financialGoals.futureValue')}</p>
                <p className="font-medium">
                  {formatCurrency(
                    calculations?.futureValue || 0, 
                    plan.currency as CurrencyCode
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Investment Parameters */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('investmentPlan.details.investmentParams.title')}
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.investmentParams.expectedReturn')}</p>
                <p className="font-medium">
                  {(() => {
                    const expectedReturn = activeMicroPlan?.expected_return 
                    const profiles = RISK_PROFILES[plan.currency]
                    const profile = profiles.find(p => parseInt(p.return) === expectedReturn)
                    return profile 
                      ? `${profile.label} (${plan.currency === 'BRL' ? 'IPCA' : 'CPI'}+${expectedReturn}%)`
                      : `${plan.currency === 'BRL' ? 'IPCA' : 'CPI'}+${expectedReturn}%`
                  })()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.investmentParams.inflationRate')}</p>
                <p className="font-medium">{activeMicroPlan?.inflation}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.investmentParams.planType')}</p>
                <p className="font-medium">{t(`investmentPlan.details.investmentParams.types.${plan.plan_type}`)}</p>
              </div>

              {plan.plan_type === "1" && plan.limit_age && (
                <div>
                  <p className="text-xs text-muted-foreground">{t('investmentPlan.form.endAge')}</p>
                  <p className="font-medium">{plan.limit_age} {t('investmentPlan.details.clientInfo.years')}</p>
                </div>
              )}

              {plan.plan_type === "2" && (
                <>
                  {plan.limit_age && (
                    <div>
                      <p className="text-xs text-muted-foreground">{t('investmentPlan.form.legacyAge')}</p>
                      <p className="font-medium">{plan.limit_age} {t('investmentPlan.details.clientInfo.years')}</p>
                    </div>
                  )}
                  {plan.legacy_amount && (
                    <div>
                      <p className="text-xs text-muted-foreground">{t('investmentPlan.form.legacyAmount')}</p>
                      <p className="font-medium">
                        {formatCurrency(plan.legacy_amount, plan.currency as CurrencyCode)}
                      </p>
                    </div>
                  )}
                </>
              )}

              {plan.plan_type === "3" && (
                <div>
                  <p className="text-xs text-muted-foreground">{t('investmentPlan.form.keepAge')}</p>
                  <p className="font-medium">{plan.limit_age} {t('investmentPlan.details.clientInfo.years')}</p>
                </div>
              )}

              {plan.old_portfolio_profitability !== null && (
                <div>
                  <p className="text-xs text-muted-foreground">{t('investmentPlan.form.oldPortfolioProfitability')}</p>
                  <p className="font-medium">IPCA + {plan.old_portfolio_profitability}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
