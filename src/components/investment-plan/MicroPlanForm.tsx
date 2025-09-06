import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CurrencyInput from 'react-currency-input-field'
import { MicroInvestmentPlan, CreateMicroInvestmentPlan, UpdateMicroInvestmentPlan } from '@/types/financial'
import { RISK_PROFILES } from '@/constants/riskProfiles'

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
  
  const [monthYear, setMonthYear] = useState({
    month: '',
    year: ''
  })

  const currencySymbol = currency === 'BRL' ? 'R$' : currency === 'USD' ? '$' : '€'

  // Função para verificar se já existe um micro plano no mesmo mês/ano
  const isDateAlreadyUsed = (year: number, month: number): boolean => {
    return existingMicroPlans.some(plan => {
      const planDate = new Date(plan.effective_date)
      const planYear = planDate.getFullYear()
      const planMonth = planDate.getMonth() + 1
      
      // Se estamos editando, não considerar o próprio plano
      if (initialData && plan.id === initialData.id) {
        return false
      }
      
      return planYear === year && planMonth === month
    })
  }

  useEffect(() => {
    if (initialData) {
      const date = new Date(initialData.effective_date)
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
      setMonthYear({
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        year: date.getFullYear().toString()
      })
    } else if (isFirstMicroPlan) {
      const date = new Date(planInitialDate)
      setFormData(prev => ({
        ...prev,
        effective_date: planInitialDate
      }))
      setMonthYear({
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        year: date.getFullYear().toString()
      })
    }
  }, [initialData, isFirstMicroPlan, planId, planInitialDate])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMonthYearChange = (field: 'month' | 'year', value: string) => {
    const newMonthYear = {
      ...monthYear,
      [field]: value
    }
    
    // Validar limites de ano
    if (field === 'year') {
      const year = parseInt(value)
      if (year < minYear || year > maxYear) {
        return // Não atualizar se estiver fora dos limites
      }
    }
    
    // Validar limites de mês
    if (field === 'month') {
      const month = parseInt(value)
      const year = parseInt(newMonthYear.year || monthYear.year)
      
      // Se é o mesmo ano do micro plano base, verificar se o mês não é anterior
      if (baseMicroPlanDate && !isFirstMicroPlan && year === minYear) {
        const baseDate = new Date(baseMicroPlanDate)
        const baseMonth = baseDate.getMonth() + 1
        if (month < baseMonth) {
          return // Não atualizar se o mês for anterior ao base
        }
      }
    }
    
    setMonthYear(newMonthYear)
    
    // Atualizar a data efetiva se ambos mês e ano estiverem preenchidos
    if (newMonthYear.month && newMonthYear.year) {
      const year = parseInt(newMonthYear.year)
      const month = parseInt(newMonthYear.month)
      
      // Verificar se a data está dentro dos limites
      if (year >= minYear && year <= maxYear) {
        // Verificação adicional para mês no mesmo ano do base
        if (baseMicroPlanDate && !isFirstMicroPlan) {
          const baseDate = new Date(baseMicroPlanDate)
          const baseYear = baseDate.getFullYear()
          const baseMonth = baseDate.getMonth() + 1
          
          // Se o ano é menor que o ano base, não permitir
          if (year < baseYear) {
            return
          }
          
          // Se o ano é igual ao ano base, só permitir meses >= mês base
          if (year === baseYear && month < baseMonth) {
            return
          }
        }
        
        // Verificar se a data já está em uso
        if (isDateAlreadyUsed(year, month)) {
          return // Não atualizar se a data já estiver em uso
        }
        
        const newDate = new Date(year, month - 1, 1)
        setFormData(prev => ({
          ...prev,
          effective_date: newDate.toISOString().split('T')[0]
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validação final: verificar se a data já está em uso
      if (monthYear.month && monthYear.year) {
        const year = parseInt(monthYear.year)
        const month = parseInt(monthYear.month)
        
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
          <div className="flex gap-2">
            <Select
              value={monthYear.month}
              onValueChange={(value) => handleMonthYearChange('month', value)}
              disabled={isFirstMicroPlan || isBaseMicroPlan}
              required
            >
              <SelectTrigger className="h-10 w-32">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = i + 1
                  const monthName = new Date(2024, i, 1).toLocaleDateString('pt-BR', { month: 'long' })
                  const currentYear = parseInt(monthYear.year || new Date().getFullYear().toString())
                  
                  // Filtrar meses anteriores ao base se necessário
                  if (baseMicroPlanDate && !isFirstMicroPlan) {
                    const baseDate = new Date(baseMicroPlanDate)
                    const baseYear = baseDate.getFullYear()
                    const baseMonth = baseDate.getMonth() + 1
                    
                    // Se o ano atual é menor que o ano base, não mostrar nenhum mês
                    if (currentYear < baseYear) {
                      return null
                    }
                    
                    // Se o ano atual é igual ao ano base, só mostrar meses >= mês base
                    if (currentYear === baseYear && month < baseMonth) {
                      return null
                    }
                  }
                  
                  // Filtrar meses já em uso
                  if (isDateAlreadyUsed(currentYear, month)) {
                    return null
                  }
                  
                  return (
                    <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                      {monthName}
                    </SelectItem>
                  )
                }).filter(Boolean)}
              </SelectContent>
            </Select>
            
            <Select
              value={monthYear.year}
              onValueChange={(value) => handleMonthYearChange('year', value)}
              disabled={isFirstMicroPlan || isBaseMicroPlan}
              required
            >
              <SelectTrigger className="h-10 w-24">
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
