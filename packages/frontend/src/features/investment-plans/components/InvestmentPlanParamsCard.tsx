import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency, CurrencyCode } from '@/utils/currency'
import { InvestmentPlanWithProfile } from '@/features/investment-plans/services/investment-plan.service'
import { User, Calendar, DollarSign, Target, TrendingUp, Building2, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'

interface InvestmentPlanParamsCardProps {
  plan: InvestmentPlanWithProfile
  t: (key: string) => string
  canEdit?: boolean
}

export function InvestmentPlanParamsCard({ 
  plan, 
  t,
  canEdit = false
}: InvestmentPlanParamsCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t('investmentPlan.details.title')}
          </CardTitle>
          {canEdit && (
            <Link to={`/edit-plan/${plan.id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
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

          {/* Investment Parameters */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('investmentPlan.details.investmentParams.title')}
            </h4>
            <div className="space-y-3">
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

          {/* Currency and Status */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('investmentPlan.details.currency.title')}
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.currency.currency')}</p>
                <p className="font-medium">
                  {plan.currency === 'BRL' ? 'Real Brasileiro (BRL)' : 
                   plan.currency === 'USD' ? 'Dólar Americano (USD)' : 
                   'Euro (EUR)'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('investmentPlan.details.currency.createdAt')}</p>
                <p className="font-medium">
                  {plan.created_at 
                    ? new Date(plan.created_at).toLocaleDateString('pt-BR')
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
