import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useTranslation } from "react-i18next"
import CurrencyInput from 'react-currency-input-field'
import { RISK_PROFILES } from '@/constants/riskProfiles'

// Custom hooks
import { useInvestmentPlanState } from '@/features/investment-plans/hooks/useInvestmentPlanState'
import { useInvestmentPlanHandlers } from '@/features/investment-plans/hooks/useInvestmentPlanHandlers'
import { useInvestmentPlanOperations } from '@/features/investment-plans/hooks/useInvestmentPlanOperations'
import { useInvestmentPlanFormData } from '@/features/investment-plans/hooks/useInvestmentPlanFormData'
import { useInvestmentPlanUI } from '@/features/investment-plans/hooks/useInvestmentPlanUI'

export const EditPlan = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()

  // State management
  const {
    loading,
    isLoadingData,
    birthDate,
    formData,
    expandedRow,
    isSyncing,
    updateSource,
    calculations,
    isCalculationReady: isCalculationReadyState,
    setLoading,
    setIsLoadingData,
    setBirthDate,
    setFormData,
    setExpandedRow,
    setIsSyncing,
    setUpdateSource,
  } = useInvestmentPlanState()

  // Form handlers
  const {
    handleAgeDateChange,
    handleChange,
    handleFormDataChange,
  } = useInvestmentPlanHandlers({
    formData,
    birthDate,
    isSyncing,
    updateSource,
    setFormData,
    setIsSyncing,
    setUpdateSource,
  })

  // Data operations
  const {
    fetchPlan,
    updatePlan,
  } = useInvestmentPlanOperations({
    formData,
    birthDate,
    setLoading,
    setIsLoadingData,
  })

  // Form data processing
  const {
    processPlanData,
    validateFormData,
  } = useInvestmentPlanFormData({
    setFormData,
    setBirthDate,
  })

  // UI utilities
  const {
    ageOptions,
    yearOptions,
    monthOptions,
    currencySymbol,
    currentMonth,
    currentYear,
  } = useInvestmentPlanUI({
    birthDate,
    formData,
  })

  // Fetch plan data on component mount
  useEffect(() => {
    const loadPlan = async () => {
      if (!id) return

      const result = await fetchPlan(id)
      if (result) {
        processPlanData(result.plan, result.profile)
      }
    }

    loadPlan()
  }, [id, fetchPlan, processPlanData])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id) return

    const errors = validateFormData(formData, birthDate)
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      })
      return
    }

    await updatePlan(id)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-card text-card-foreground border border-border shadow-lg">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl font-semibold">{t('investmentPlan.edit.title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingData ? (
              <Spinner 
                size="lg" 
                className="border-t-primary/80"
              />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.planInitialDate')}
                    </label>
                    <Input
                      type="date"
                      name="plan_initial_date"
                      value={formData.plan_initial_date}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.planType')}
                    </label>
                    <select
                      name="planType"
                      value={formData.planType}
                      onChange={handleChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="1">{t('investmentPlan.planTypes.endAt120')}</option>
                      <option value="2">{t('investmentPlan.planTypes.leave1M')}</option>
                      <option value="3">{t('investmentPlan.planTypes.keepPrincipal')}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.initialAmount')}
                    </label>
                    <CurrencyInput
                      name="initialAmount"
                      value={formData.initialAmount}
                      onValueChange={(value) => {
                        handleFormDataChange({ initialAmount: value || '' })
                      }}
                      placeholder="1000"
                      prefix={currencySymbol}
                      decimalsLimit={2}
                      decimalSeparator=","
                      groupSeparator="."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.finalAge')}
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="finalAge"
                        value={formData.finalAge}
                        onChange={handleAgeDateChange}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">{t('investmentPlan.form.selectAge')}</option>
                        {ageOptions.map(option => (
                          <option key={option.age} value={option.age}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <select
                          name="month"
                          value={currentMonth}
                          onChange={(e) => {
                            const newDate = new Date(formData.planEndAccumulationDate)
                            newDate.setMonth(parseInt(e.target.value))
                            newDate.setDate(1)
                            handleAgeDateChange({
                              target: {
                                name: 'planEndAccumulationDate',
                                value: newDate.toISOString().split('T')[0]
                              }
                            } as React.ChangeEvent<HTMLInputElement>)
                          }}
                          className="h-10 w-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {monthOptions.map(month => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                        <select
                          name="year"
                          value={currentYear}
                          onChange={(e) => {
                            const newDate = new Date(formData.planEndAccumulationDate)
                            newDate.setFullYear(parseInt(e.target.value))
                            newDate.setDate(1)
                            handleAgeDateChange({
                              target: {
                                name: 'planEndAccumulationDate',
                                value: newDate.toISOString().split('T')[0]
                              }
                            } as React.ChangeEvent<HTMLInputElement>)
                          }}
                          className="h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {yearOptions.map(option => (
                            <option key={option.year} value={option.year}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.monthlyDeposit')}
                    </label>
                    <CurrencyInput
                      name="monthlyDeposit"
                      value={formData.monthlyDeposit}
                      onValueChange={(value) => {
                        handleFormDataChange({ monthlyDeposit: value || '' })
                      }}
                      placeholder="1000"
                      prefix={currencySymbol}
                      decimalsLimit={2}
                      decimalSeparator=","
                      groupSeparator="."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.desiredIncome')}
                    </label>
                    <CurrencyInput
                      name="desiredIncome"
                      value={formData.desiredIncome}
                      onValueChange={(value) => {
                        handleFormDataChange({ desiredIncome: value || '' })
                      }}
                      placeholder="5000"
                      prefix={currencySymbol}
                      decimalsLimit={2}
                      decimalSeparator=","
                      groupSeparator="."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.riskProfile')}
                    </label>
                    <select
                      name="expectedReturn"
                      value={formData.expectedReturn}
                      onChange={handleChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      {RISK_PROFILES[formData.currency].map((profile) => (
                        <option
                          key={profile.value}
                          value={profile.return}
                          className={`${profile.bgColor} ${profile.textColor}`}
                        >
                          {profile.label} ({formData.currency === 'BRL' ? 'IPCA' : 'CPI'}+{profile.return}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.inflationRate')}
                    </label>
                    <Input
                      type="number"
                      name="inflation"
                      value={formData.inflation}
                      onChange={handleChange}
                      placeholder="6.0"
                      step="0.1"
                      required
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="hasOldPortfolio"
                        checked={formData.hasOldPortfolio}
                        onCheckedChange={(checked) => {
                          handleFormDataChange({
                            hasOldPortfolio: checked as boolean,
                            oldPortfolioProfitability: checked ? formData.oldPortfolioProfitability : null
                          })
                        }}
                      />
                      <label htmlFor="hasOldPortfolio" className="text-sm font-medium text-muted-foreground">
                        {t('investmentPlan.form.hasOldPortfolio')}
                      </label>
                    </div>
                    {formData.hasOldPortfolio && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          {t('investmentPlan.form.oldPortfolioProfitability')}
                        </label>
                        <select
                          name="oldPortfolioProfitability"
                          value={formData.oldPortfolioProfitability || ""}
                          onChange={(e) => {
                            handleFormDataChange({ oldPortfolioProfitability: e.target.value || null })
                          }}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required={formData.hasOldPortfolio}
                        >
                        <option value="">{t('investmentPlan.form.selectProfitability')}</option>
                        <option value="0">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 0%</option>
                        <option value="1">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 1%</option>
                        <option value="2">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 2%</option>
                        <option value="3">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 3%</option>
                        <option value="4">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 4%</option>
                        <option value="5">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 5%</option>
                        <option value="6">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 6%</option>
                        <option value="7">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 7%</option>
                        <option value="8">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 8%</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {formData.planType !== "3" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {formData.planType === "1" 
                        ? t('investmentPlan.form.endAge') 
                        : t('investmentPlan.form.legacyAge')}
                    </label>
                    <Input
                      type="number"
                      name="limitAge"
                      value={formData.limitAge}
                      onChange={handleChange}
                      placeholder={formData.planType === "1" ? "120" : "85"}
                      required
                      min={formData.finalAge}
                      max="120"
                      step="1"
                      className="h-10"
                      onKeyDown={(e) => {
                        if (e.key === "." || e.key === ",") {
                          e.preventDefault()
                        }
                      }}
                    />
                  </div>
                )}

                {formData.planType === "2" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('investmentPlan.form.legacyAmount')}
                    </label>
                    <CurrencyInput
                      name="legacyAmount"
                      value={formData.legacyAmount}
                      onValueChange={(value) => {
                        handleFormDataChange({ legacyAmount: value || '' })
                      }}
                      placeholder="1000000"
                      prefix={currencySymbol}
                      decimalsLimit={2}
                      decimalSeparator=","
                      groupSeparator="."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">{t('investmentPlan.form.advancedSettings')}</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {t('investmentPlan.form.currency')}
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="BRL">{t('investmentPlan.form.currencies.BRL')}</option>
                        <option value="USD">{t('investmentPlan.form.currencies.USD')}</option>
                        <option value="EUR">{t('investmentPlan.form.currencies.EUR')}</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="adjust_contribution_for_inflation"
                        checked={formData.adjustContributionForInflation}
                        onCheckedChange={(checked) => {
                          handleFormDataChange({ adjustContributionForInflation: checked as boolean })
                        }}
                      />
                      <label htmlFor="adjust_contribution_for_inflation" className="text-sm font-medium text-muted-foreground">
                        {t('investmentPlan.form.adjustContributionForInflation')}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="adjust_income_for_inflation"
                        checked={formData.adjustIncomeForInflation}
                        onCheckedChange={(checked) => {
                          handleFormDataChange({ adjustIncomeForInflation: checked as boolean })
                        }}
                      />
                      <label htmlFor="adjust_income_for_inflation" className="text-sm font-medium text-muted-foreground">
                        {t('investmentPlan.form.adjustIncomeForInflation')}
                      </label>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? t('common.saving') : t('common.save')}
                </Button>
              </form>
            )}
          </CardContent>

          {!isLoadingData && (
            <div className="mt-8 p-6 bg-muted border-t border-border">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {t('investmentPlan.create.calculations.title')}
              </h3>
              {isCalculationReadyState ? (
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.inflationAdjustedIncome')}:</span>
                    </div>
                    <span className="font-medium">{currencySymbol} {calculations?.inflationAdjustedIncome.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}/mês</span>
                  </div>
                  
                  <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.requiredFutureValue')}:</span>
                    </div>
                    <span className="font-medium">
                      {currencySymbol} {calculations?.futureValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}
                    </span>
                  </div>

                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div 
                      className="flex justify-between p-3 cursor-pointer hover:bg-accent"
                      onClick={() => setExpandedRow(expandedRow === 'return' ? null : 'return')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.totalMonthlyReturn')}:</span>
                      </div>
                      <span className="font-medium">{currencySymbol} {calculations?.totalMonthlyReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                    </div>
                    {expandedRow === 'return' && (
                      <div className="px-3 pb-3 space-y-2 border-t border-border">
                        <div className="flex justify-between pt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.monthlyRealReturn')}:</span>
                          </div>
                          <span className="font-medium">{currencySymbol} {calculations?.realReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.monthlyInflationReturn')}:</span>
                          </div>
                          <span className="font-medium">{currencySymbol} {calculations?.inflationReturn.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.requiredMonthlyDeposit')}:</span>
                    </div>
                    <span className="font-medium">
                      {currencySymbol} {calculations?.requiredMonthlyDeposit.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) || '---'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  {t('investmentPlan.create.calculations.fillRequired')}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
