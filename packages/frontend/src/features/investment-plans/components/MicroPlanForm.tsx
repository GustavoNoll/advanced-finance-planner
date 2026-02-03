// 1. Imports externos
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// 2. Imports internos (shared)
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { CurrencyInput } from '@/shared/components/ui/currency-input'
import { CurrencyCode } from '@/utils/currency'
import { RISK_PROFILES } from '@/constants/riskProfiles'
import { createDateWithoutTimezone } from '@/utils/dateUtils'

// 3. Imports internos (feature)
import { MicroInvestmentPlan, CreateMicroInvestmentPlan, UpdateMicroInvestmentPlan } from '@/types/financial'

interface MicroPlanFormProps {
  onSubmit: (data: CreateMicroInvestmentPlan | UpdateMicroInvestmentPlan) => Promise<void>
  onCancel?: () => void
  planId: string
  planInitialDate: string
  planLimitAge?: number
  currency: 'BRL' | 'USD' | 'EUR'
  initialData?: MicroInvestmentPlan | null
  isFirstMicroPlan: boolean
  baseMicroPlanDate?: string
  existingMicroPlans?: MicroInvestmentPlan[]
  isBaseMicroPlan?: boolean
  lastMicroPlan?: MicroInvestmentPlan | null
}

export function MicroPlanForm({
  onSubmit,
  onCancel,
  planId,
  planInitialDate,
  planLimitAge,
  currency,
  initialData,
  isFirstMicroPlan,
  baseMicroPlanDate,
  existingMicroPlans = [],
  isBaseMicroPlan = false,
  lastMicroPlan
}: MicroPlanFormProps) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Inicializar formData com valores de initialData se disponível (modo edição)
  // Ao criar novo, sempre começar com campos zerados
  const getInitialFormData = () => {
    if (initialData) {
      // Modo edição: preencher com dados do micro plano sendo editado
      const expectedReturnStr = parseFloat(initialData.expected_return.toString()).toFixed(1)
      return {
        life_investment_plan_id: planId,
        effective_date: initialData.effective_date,
        monthly_deposit: initialData.monthly_deposit.toString(),
        desired_income: initialData.desired_income.toString(),
        expected_return: expectedReturnStr,
        inflation: initialData.inflation.toString(),
        adjust_contribution_for_accumulated_inflation: initialData.adjust_contribution_for_accumulated_inflation,
        adjust_income_for_accumulated_inflation: initialData.adjust_income_for_accumulated_inflation
      }
    }
    // Modo criação: sempre começar com campos zerados
    return {
      life_investment_plan_id: planId,
      effective_date: isFirstMicroPlan ? planInitialDate : '',
      monthly_deposit: '',
      desired_income: '',
      expected_return: '',
      inflation: '',
      adjust_contribution_for_accumulated_inflation: true,
      adjust_income_for_accumulated_inflation: true
    }
  }
  
  const [formData, setFormData] = useState(getInitialFormData)
  
  // Inicializar inputs de data
  const getInitialDateInputs = () => {
    if (initialData) {
      const date = createDateWithoutTimezone(initialData.effective_date)
      return {
        effectiveDateInput: date.toISOString().split('T')[0],
        monthInput: (date.getMonth() + 1).toString().padStart(2, '0'),
        yearInput: date.getFullYear().toString()
      }
    } else if (isFirstMicroPlan) {
      const date = new Date(planInitialDate)
      return {
        effectiveDateInput: planInitialDate,
        monthInput: (date.getMonth() + 1).toString().padStart(2, '0'),
        yearInput: date.getFullYear().toString()
      }
    }
    return {
      effectiveDateInput: '',
      monthInput: '',
      yearInput: ''
    }
  }
  
  const initialDateInputs = getInitialDateInputs()
  const [effectiveDateInput, setEffectiveDateInput] = useState(initialDateInputs.effectiveDateInput)
  const [monthInput, setMonthInput] = useState(initialDateInputs.monthInput)
  const [yearInput, setYearInput] = useState(initialDateInputs.yearInput)
  

  const currencySymbol = currency === 'BRL' ? 'R$' : currency === 'USD' ? '$' : '€'

  // Função para verificar se já existe um micro plano no mesmo mês/ano
  const isDateAlreadyUsed = (year: number, month: number): boolean => {
    const result = existingMicroPlans.some(plan => {
      const planDate = createDateWithoutTimezone(plan.effective_date)
      const planYear = planDate.getFullYear()
      const planMonth = planDate.getMonth() + 1
      
      // Se estamos editando, não considerar o próprio plano
      if (initialData && plan.id === initialData.id) {
        return false
      }
      
      return planYear === year && planMonth === month
    })
    
    return result
  }

  // Atualizar formData quando initialData mudar (para casos de edição dinâmica)
  useEffect(() => {
    if (initialData) {
      const date = createDateWithoutTimezone(initialData.effective_date)
      const expectedReturnStr = parseFloat(initialData.expected_return.toString()).toFixed(1)
      
      setFormData({
        life_investment_plan_id: planId,
        effective_date: initialData.effective_date,
        monthly_deposit: initialData.monthly_deposit.toString(),
        desired_income: initialData.desired_income.toString(),
        expected_return: expectedReturnStr,
        inflation: initialData.inflation.toString(),
        adjust_contribution_for_accumulated_inflation: initialData.adjust_contribution_for_accumulated_inflation,
        adjust_income_for_accumulated_inflation: initialData.adjust_income_for_accumulated_inflation
      })
      
      setEffectiveDateInput(date.toISOString().split('T')[0])
      setMonthInput((date.getMonth() + 1).toString().padStart(2, '0'))
      setYearInput(date.getFullYear().toString())
    } else if (isFirstMicroPlan && !initialData) {
      const date = new Date(planInitialDate)
      setFormData(prev => ({
        ...prev,
        effective_date: planInitialDate
      }))
      setEffectiveDateInput(planInitialDate)
      setMonthInput((date.getMonth() + 1).toString().padStart(2, '0'))
      setYearInput(date.getFullYear().toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id, isFirstMicroPlan, planId, planInitialDate])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMonthYearChange = (month: string, year: string) => {
    setMonthInput(month)
    setYearInput(year)
    
    if (month && year) {
      const monthNum = parseInt(month)
      const yearNum = parseInt(year)
      
      // Verificar se a data já está em uso
      if (isDateAlreadyUsed(yearNum, monthNum)) {
        return // Não atualizar se a data já estiver em uso
      }
      
      // Sempre salvar com dia 01
      const normalizedDate = `${yearNum}-${month.padStart(2, '0')}-01`
      
      // Atualizar o formData com a data normalizada (dia 01)
      setFormData(prev => ({
        ...prev,
        effective_date: normalizedDate
      }))
      
      // Atualizar também o input de data para compatibilidade
      setEffectiveDateInput(normalizedDate)
    }
  }

  const handleDateChange = (value: string) => {
    setEffectiveDateInput(value)
    
    if (value) {
      const date = createDateWithoutTimezone(value)
      
      // Verificar se a data é válida
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        
        // Verificar se a data já está em uso
        if (isDateAlreadyUsed(year, month)) {
          return // Não atualizar se a data já estiver em uso
        }
        
        // Sempre salvar com dia 01, independente do dia selecionado
        const normalizedDate = `${year}-${month.toString().padStart(2, '0')}-01`
        
        // Atualizar o formData com a data normalizada (dia 01)
        setFormData(prev => ({
          ...prev,
          effective_date: normalizedDate
        }))
      }
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validação final: verificar se a data já está em uso
      if (monthInput && yearInput) {
        const month = parseInt(monthInput)
        const year = parseInt(yearInput)
        
        if (isDateAlreadyUsed(year, month)) {
          alert(t('investmentPlan.microPlans.form.dateAlreadyUsed'))
          setIsSubmitting(false)
          return
        }
      }

      const submitData = {
        ...formData,
        monthly_deposit: parseFloat(formData.monthly_deposit.replace(/[^\d,.-]/g, '').replace(',', '.')),
        desired_income: parseFloat(formData.desired_income.replace(/[^\d,.-]/g, '').replace(',', '.')),
        expected_return: parseFloat(formData.expected_return),
        inflation: parseFloat(formData.inflation),
        adjust_contribution_for_accumulated_inflation: formData.adjust_contribution_for_accumulated_inflation,
        adjust_income_for_accumulated_inflation: formData.adjust_income_for_accumulated_inflation
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting micro plan:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate max year based on plan limit age or 100 years
  const maxYear = (() => {
    const initialDate = new Date(planInitialDate)
    const maxAge = planLimitAge || 100
    return initialDate.getFullYear() + maxAge
  })()

  // Calculate min year - use base micro plan date if available, otherwise plan initial date
  const minYear = (() => {
    if (baseMicroPlanDate && !isFirstMicroPlan) {
      return new Date(baseMicroPlanDate).getFullYear()
    }
    return new Date(planInitialDate).getFullYear()
  })()

  // Calculate min month - use base micro plan month if available and same year
  const minMonth = (() => {
    if (baseMicroPlanDate && !isFirstMicroPlan) {
      const baseDate = new Date(baseMicroPlanDate)
      const baseYear = baseDate.getFullYear()
      const currentYear = new Date().getFullYear()
      
      // If base year is current year, use base month, otherwise use January
      if (baseYear === currentYear) {
        return baseDate.getMonth() + 1
      }
    }
    return 1
  })()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            {t('investmentPlan.microPlans.form.effectiveDate')}
          </Label>
          <div className="flex gap-2">
            <Select
              value={monthInput}
              onValueChange={(value) => handleMonthYearChange(value, yearInput)}
              disabled={isFirstMicroPlan || isBaseMicroPlan}
              required
            >
              <SelectTrigger className="h-10 flex-1">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="01">{t('date.months.january')}</SelectItem>
                <SelectItem value="02">{t('date.months.february')}</SelectItem>
                <SelectItem value="03">{t('date.months.march')}</SelectItem>
                <SelectItem value="04">{t('date.months.april')}</SelectItem>
                <SelectItem value="05">{t('date.months.may')}</SelectItem>
                <SelectItem value="06">{t('date.months.june')}</SelectItem>
                <SelectItem value="07">{t('date.months.july')}</SelectItem>
                <SelectItem value="08">{t('date.months.august')}</SelectItem>
                <SelectItem value="09">{t('date.months.september')}</SelectItem>
                <SelectItem value="10">{t('date.months.october')}</SelectItem>
                <SelectItem value="11">{t('date.months.november')}</SelectItem>
                <SelectItem value="12">{t('date.months.december')}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={yearInput}
              onValueChange={(value) => handleMonthYearChange(monthInput, value)}
              disabled={isFirstMicroPlan || isBaseMicroPlan}
              required
            >
              <SelectTrigger className="h-10 flex-1">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
                  const year = minYear + i
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          {isFirstMicroPlan && (
            <p className="text-xs text-muted-foreground">
              {t('investmentPlan.microPlans.form.firstPlanDateNote')}
            </p>
          )}
          {isBaseMicroPlan && (
            <p className="text-xs text-muted-foreground">
              {t('investmentPlan.microPlans.form.basePlanDateNote')}
            </p>
          )}
          {!isFirstMicroPlan && !isBaseMicroPlan && baseMicroPlanDate && (
            <p className="text-xs text-muted-foreground">
              {t('investmentPlan.microPlans.form.cannotCreateBeforeBase')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly_deposit">
            {t('investmentPlan.microPlans.form.monthlyDeposit')}
          </Label>
          <CurrencyInput
            id="monthly_deposit"
            keyPrefix={initialData?.id ? `monthly-deposit-${initialData.id}` : `monthly-deposit-new`}
            defaultValue={formData.monthly_deposit}
            onValueChange={(value) => handleChange('monthly_deposit', value || '')}
            placeholder="1000"
            currency={currency as CurrencyCode}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desired_income">
            {t('investmentPlan.microPlans.form.desiredIncome')}
          </Label>
          <CurrencyInput
            id="desired_income"
            keyPrefix={initialData?.id ? `desired-income-${initialData.id}` : `desired-income-new`}
            defaultValue={formData.desired_income}
            onValueChange={(value) => handleChange('desired_income', value || '')}
            placeholder="5000"
            currency={currency as CurrencyCode}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expected_return">
            {t('investmentPlan.microPlans.form.expectedReturn')}
          </Label>
          <Select
            value={formData.expected_return}
            onValueChange={(value) => handleChange('expected_return', value)}
            required
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('investmentPlan.microPlans.form.selectExpectedReturn')} />
            </SelectTrigger>
            <SelectContent>
              {RISK_PROFILES[currency].map((profile) => (
                <SelectItem key={profile.value} value={profile.return}>
                  {profile.label} ({currency === 'BRL' ? 'IPCA' : 'CPI'}+{profile.return}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inflation">
            {t('investmentPlan.microPlans.form.inflation')}
          </Label>
          <Input
            id="inflation"
            type="number"
            value={formData.inflation}
            onChange={(e) => handleChange('inflation', e.target.value)}
            placeholder="6"
            step="1"
            min="0"
            max="50"
            required
            className="h-10"
          />
        </div>
      </div>

      {!isFirstMicroPlan && !isBaseMicroPlan && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="adjust_contribution_for_accumulated_inflation"
              checked={formData.adjust_contribution_for_accumulated_inflation}
              onCheckedChange={(checked) => handleChange('adjust_contribution_for_accumulated_inflation', checked as boolean)}
            />
            <Label htmlFor="adjust_contribution_for_accumulated_inflation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('investmentPlan.microPlans.form.adjustContributionForAccumulatedInflation')}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="adjust_income_for_accumulated_inflation"
              checked={formData.adjust_income_for_accumulated_inflation}
              onCheckedChange={(checked) => handleChange('adjust_income_for_accumulated_inflation', checked as boolean)}
            />
            <Label htmlFor="adjust_income_for_accumulated_inflation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('investmentPlan.microPlans.form.adjustIncomeForAccumulatedInflation')}
            </Label>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onCancel) {
              onCancel()
            }
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  )
}
