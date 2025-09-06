import { useState, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Calendar, Target, TrendingUp, DollarSign, Plus, Edit, Trash2, ArrowUp, ArrowDown, Minus, AlertTriangle } from 'lucide-react'
import { MicroInvestmentPlan, CreateMicroInvestmentPlan, UpdateMicroInvestmentPlan } from '@/types/financial'
import { formatCurrency } from '@/utils/currency'
import { createDateWithoutTimezone } from '@/utils/dateUtils'

const MicroPlanForm = lazy(() => import('./MicroPlanForm').then(module => ({ default: module.MicroPlanForm })))

interface MicroPlansTimelineProps {
  microPlans: MicroInvestmentPlan[]
  activeMicroPlan: MicroInvestmentPlan | null
  currency: 'BRL' | 'USD' | 'EUR'
  planId: string
  planInitialDate: string
  planLimitAge?: number
  onCreateMicroPlan: (data: CreateMicroInvestmentPlan) => Promise<MicroInvestmentPlan | null>
  onUpdateMicroPlan: (id: string, data: UpdateMicroInvestmentPlan) => Promise<MicroInvestmentPlan | null>
  onDeleteMicroPlan: (id: string) => Promise<boolean>
}

export function MicroPlansTimeline({ 
  microPlans, 
  activeMicroPlan, 
  currency,
  planId,
  planInitialDate,
  planLimitAge,
  onCreateMicroPlan,
  onUpdateMicroPlan,
  onDeleteMicroPlan
}: MicroPlansTimelineProps) {
  const { t } = useTranslation()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingMicroPlan, setEditingMicroPlan] = useState<MicroInvestmentPlan | null>(null)

  const handleCreateMicroPlan = async (data: CreateMicroInvestmentPlan) => {
    const result = await onCreateMicroPlan(data)
    if (result) {
      setIsCreateDialogOpen(false)
    }
  }

  const handleUpdateMicroPlan = async (data: UpdateMicroInvestmentPlan) => {
    if (editingMicroPlan) {
      const result = await onUpdateMicroPlan(editingMicroPlan.id, data)
      if (result) {
        setEditingMicroPlan(null)
      }
    }
  }

  const handleDeleteMicroPlan = async (id: string) => {
    if (confirm(t('investmentPlan.microPlans.confirmDelete'))) {
      await onDeleteMicroPlan(id)
    }
  }

  // Função para verificar se existe micro plano com data menor que hoje mas não ativo
  const getInactiveMicroPlansWithPastDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Zerar horas para comparação apenas de data
    
    // Filtrar micro planos com data anterior à hoje
    const pastMicroPlans = microPlans.filter(microPlan => {
      const effectiveDate = createDateWithoutTimezone(microPlan.effective_date)
      effectiveDate.setHours(0, 0, 0, 0) // Zerar horas para comparação apenas de data
      
      return effectiveDate < today
    })
    
    // Se não há micro planos com data anterior, não há problema
    if (pastMicroPlans.length === 0) {
      return []
    }
    
    // Encontrar o micro plano mais recente entre os que têm data anterior
    const mostRecentPastMicroPlan = pastMicroPlans.reduce((mostRecent, current) => {
      const mostRecentDate = createDateWithoutTimezone(mostRecent.effective_date)
      const currentDate = createDateWithoutTimezone(current.effective_date)
      return currentDate > mostRecentDate ? current : mostRecent
    })
    
    // Verificar se o micro plano mais recente com data anterior está ativo
    const isMostRecentPastMicroPlanActive = activeMicroPlan?.id === mostRecentPastMicroPlan.id
    
    // Se o mais recente está ativo, não há problema
    if (isMostRecentPastMicroPlanActive) {
      return []
    }
    
    // Se o mais recente não está ativo, retornar ele para mostrar o disclaimer
    return [mostRecentPastMicroPlan]
  }

  const inactiveMicroPlansWithPastDate = getInactiveMicroPlansWithPastDate()

  // Função para calcular mudanças entre micro planos consecutivos
  const getChangeIndicator = (currentValue: number, previousValue: number | null) => {
    if (previousValue === null) return null
    
    const change = currentValue - previousValue
    const changePercent = ((change / previousValue) * 100)
    
    if (Math.abs(changePercent) < 1) return null // Ignorar mudanças menores que 1%
    
    return {
      value: change,
      percent: changePercent,
      isIncrease: change > 0,
      isDecrease: change < 0
    }
  }

  if (microPlans.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('investmentPlan.microPlans.timeline.title')}
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('investmentPlan.microPlans.createFirst')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('investmentPlan.microPlans.createNew')}</DialogTitle>
                </DialogHeader>
                <Suspense fallback={<div>Loading...</div>}>
                  <MicroPlanForm
                    onSubmit={handleCreateMicroPlan}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    planId={planId}
                    planInitialDate={planInitialDate}
                    planLimitAge={planLimitAge}
                    currency={currency}
                    isFirstMicroPlan={true}
                    existingMicroPlans={[]}
                  />
                </Suspense>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {t('investmentPlan.microPlans.noPlans')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('investmentPlan.microPlans.noPlansDescription')}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ordenar micro planos por data de vigência
  const sortedMicroPlans = [...microPlans].sort((a, b) => 
    new Date(a.effective_date).getTime() - new Date(b.effective_date).getTime()
  )

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('investmentPlan.microPlans.timeline.title')}
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('investmentPlan.microPlans.createNew')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('investmentPlan.microPlans.createNew')}</DialogTitle>
              </DialogHeader>
              <Suspense fallback={<div>Loading...</div>}>
                <MicroPlanForm
                  onSubmit={handleCreateMicroPlan}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  planId={planId}
                  planInitialDate={planInitialDate}
                  planLimitAge={planLimitAge}
                  currency={currency}
                  isFirstMicroPlan={false}
                  baseMicroPlanDate={microPlans.length > 0 ? microPlans[0].effective_date : undefined}
                  existingMicroPlans={microPlans}
                />
              </Suspense>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      {/* Disclaimer para micro planos com data menor que hoje mas não ativos */}
      {inactiveMicroPlansWithPastDate.length > 0 && (
        <div className="px-6 pb-4">
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">
              {t('investmentPlan.microPlans.timeline.disclaimer.title')}
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              {t('investmentPlan.microPlans.timeline.disclaimer.message')}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-6">
            {sortedMicroPlans.map((microPlan, index) => {
              const isActive = activeMicroPlan?.id === microPlan.id
              const isBase = index === 0
              const effectiveDate = createDateWithoutTimezone(microPlan.effective_date)
              
              // Obter micro plano anterior para comparação
              const previousMicroPlan = index > 0 ? sortedMicroPlans[index - 1] : null
              
              // Calcular mudanças
              const monthlyDepositChange = getChangeIndicator(
                microPlan.monthly_deposit, 
                previousMicroPlan?.monthly_deposit || null
              )
              const desiredIncomeChange = getChangeIndicator(
                microPlan.desired_income, 
                previousMicroPlan?.desired_income || null
              )
              const expectedReturnChange = getChangeIndicator(
                microPlan.expected_return, 
                previousMicroPlan?.expected_return || null
              )
              const inflationChange = getChangeIndicator(
                microPlan.inflation, 
                previousMicroPlan?.inflation || null
              )
              
              return (
                <div key={microPlan.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2
                    ${isActive 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'bg-background border-border'
                    }
                  `}>
                    <div className={`
                      w-3 h-3 rounded-full
                      ${isActive ? 'bg-primary-foreground' : 'bg-muted-foreground'}
                    `} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">
                        {effectiveDate.toLocaleDateString('pt-BR', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </h4>
                      <div className="flex gap-1">
                        {isActive && (
                          <Badge variant="default" className="text-xs">
                            {t('investmentPlan.microPlans.active')}
                          </Badge>
                        )}
                        {isBase && (
                          <Badge variant="outline" className="text-xs">
                            {t('investmentPlan.microPlans.base')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Metrics grid - Two rows layout */}
                    <div className="space-y-3 text-sm">
                      {/* First row: Monthly Deposit and Desired Income */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-muted-foreground text-xs">
                                {t('investmentPlan.microPlans.monthlyDeposit')}
                              </p>
                              {monthlyDepositChange && (
                                monthlyDepositChange.isIncrease ? (
                                  <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                                )
                              )}
                            </div>
                            <p className="font-medium">
                              {formatCurrency(microPlan.monthly_deposit, currency)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-muted-foreground text-xs">
                                {t('investmentPlan.microPlans.desiredIncome')}
                              </p>
                              {desiredIncomeChange && (
                                desiredIncomeChange.isIncrease ? (
                                  <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                                )
                              )}
                            </div>
                            <p className="font-medium">
                              {formatCurrency(microPlan.desired_income, currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Second row: Expected Return and Inflation */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-muted-foreground text-xs">
                                {t('investmentPlan.microPlans.expectedReturn')}
                              </p>
                              {expectedReturnChange && (
                                expectedReturnChange.isIncrease ? (
                                  <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                                )
                              )}
                            </div>
                            <p className="font-medium">
                              {microPlan.expected_return}%
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-muted-foreground text-xs">
                                {t('investmentPlan.microPlans.inflation')}
                              </p>
                              {inflationChange && (
                                inflationChange.isIncrease ? (
                                  <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                                )
                              )}
                            </div>
                            <p className="font-medium">
                              {microPlan.inflation}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingMicroPlan(microPlan)}
                        className="h-8 px-2"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t('common.edit')}
                      </Button>
                      {microPlans.length > 1 && !isBase && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMicroPlan(microPlan.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t('common.delete')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      {editingMicroPlan && (
        <Dialog open={!!editingMicroPlan} onOpenChange={() => setEditingMicroPlan(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('investmentPlan.microPlans.edit')}</DialogTitle>
            </DialogHeader>
            <Suspense fallback={<div>Loading...</div>}>
              <MicroPlanForm
                onSubmit={handleUpdateMicroPlan}
                onCancel={() => setEditingMicroPlan(null)}
                planId={planId}
                planInitialDate={planInitialDate}
                planLimitAge={planLimitAge}
                currency={currency}
                initialData={editingMicroPlan}
                isFirstMicroPlan={false}
                isBaseMicroPlan={editingMicroPlan?.id === microPlans[0]?.id}
                baseMicroPlanDate={microPlans.length > 0 ? microPlans[0].effective_date : undefined}
                existingMicroPlans={microPlans}
              />
            </Suspense>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
