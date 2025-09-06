import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CurrencyInput from 'react-currency-input-field'
import { MicroInvestmentPlan, CreateMicroInvestmentPlan, UpdateMicroInvestmentPlan } from '@/types/financial'
import { RISK_PROFILES } from '@/constants/riskProfiles'
import { createDateWithoutTimezone } from '@/utils/dateUtils'

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
  isBaseMicroPlan = false
}: MicroPlanFormProps) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    life_investment_plan_id: planId,
    effective_date: isFirstMicroPlan ? planInitialDate : '',
    monthly_deposit: '',
    desired_income: '',
    expected_return: '',
    inflation: ''
  })
  
  const [effectiveDateInput, setEffectiveDateInput] = useState('')
  

  const currencySymbol = currency === 'BRL' ? 'R$' : currency === 'USD' ? '$' : '€'

  // Função para verificar se já existe um micro plano no mesmo mês/ano
  const isDateAlreadyUsed = (year: number, month: number): boolean => {
    const result = existingMicroPlans.some(plan => {
      const planDate = createDateWithoutTimezone(plan.effective_date)
      const planYear = planDate.getFullYear()
      const planMonth = planDate.getMonth() + 1
      
      console.log('🔍 DEBUG isDateAlreadyUsed check:', {
        checkingYear: year,
        checkingMonth: month,
        planId: plan.id,
        planEffectiveDate: plan.effective_date,
        planYear,
        planMonth,
        isCurrentPlan: initialData?.id === plan.id,
        matches: planYear === year && planMonth === month
      })
      
      // Se estamos editando, não considerar o próprio plano
      if (initialData && plan.id === initialData.id) {
        return false
      }
      
      return planYear === year && planMonth === month
    })
    
    console.log('🔍 DEBUG isDateAlreadyUsed result:', result)
    return result
  }

  useEffect(() => {
    if (initialData) {
      const date = createDateWithoutTimezone(initialData.effective_date)
      // Normalizar o expected_return para garantir compatibilidade com os valores dos perfis
      // Converter para número e depois para string com 1 casa decimal para match com os perfis
      const expectedReturnStr = parseFloat(initialData.expected_return.toString()).toFixed(1)
      
      setFormData({
        life_investment_plan_id: planId,
        effective_date: initialData.effective_date,
        monthly_deposit: initialData.monthly_deposit.toString(),
        desired_income: initialData.desired_income.toString(),
        expected_return: expectedReturnStr,
        inflation: initialData.inflation.toString()
      })
      
      // Definir a data no formato YYYY-MM-DD para o input
      setEffectiveDateInput(date.toISOString().split('T')[0])
    } else if (isFirstMicroPlan) {
      const date = new Date(planInitialDate)
      setFormData(prev => ({
        ...prev,
        effective_date: planInitialDate
      }))
      setEffectiveDateInput(planInitialDate)
    }
  }, [initialData, isFirstMicroPlan, planId, planInitialDate])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDateChange = (value: string) => {
    console.log('🔍 DEBUG handleDateChange called with:', value)
    
    setEffectiveDateInput(value)
    
    if (value) {
      const date = createDateWithoutTimezone(value)
      
      // Verificar se a data é válida
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        
        console.log('🔍 DEBUG Date validation:', {
          year,
          month,
          isDateAlreadyUsed: isDateAlreadyUsed(year, month),
          existingMicroPlans: existingMicroPlans.map(mp => ({
            id: mp.id,
            effective_date: mp.effective_date,
            isCurrentPlan: initialData?.id === mp.id
          }))
        })
        
        // Verificar se a data já está em uso
        if (isDateAlreadyUsed(year, month)) {
          console.log('🔍 DEBUG Date already used, blocking change')
          return // Não atualizar se a data já estiver em uso
        }
        
        // Sempre salvar com dia 01, independente do dia selecionado
        const normalizedDate = `${year}-${month.toString().padStart(2, '0')}-01`
        
        // Atualizar o formData com a data normalizada (dia 01)
        setFormData(prev => ({
          ...prev,
          effective_date: normalizedDate
        }))
        
        console.log('🔍 DEBUG Date updated successfully:', normalizedDate)
      }
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validação final: verificar se a data já está em uso
      if (effectiveDateInput) {
        const date = createDateWithoutTimezone(effectiveDateInput)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        
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
        inflation: parseFloat(formData.inflation)
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
          <Input
            type="date"
            value={effectiveDateInput}
            onChange={(e) => handleDateChange(e.target.value)}
            disabled={isFirstMicroPlan || isBaseMicroPlan}
            required
            className="h-10"
            min={baseMicroPlanDate && !isFirstMicroPlan ? baseMicroPlanDate : undefined}
            max={`${maxYear}-12-31`}
          />
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
            value={formData.monthly_deposit}
            onValueChange={(value) => handleChange('monthly_deposit', value || '')}
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
          <Label htmlFor="desired_income">
            {t('investmentPlan.microPlans.form.desiredIncome')}
          </Label>
          <CurrencyInput
            id="desired_income"
            value={formData.desired_income}
            onValueChange={(value) => handleChange('desired_income', value || '')}
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
