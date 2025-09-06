import { useState, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Plus, Calendar, DollarSign, TrendingUp, Target } from 'lucide-react'
import { MicroInvestmentPlan, CreateMicroInvestmentPlan, UpdateMicroInvestmentPlan } from '@/types/financial'
import { formatCurrency } from '@/utils/currency'

const MicroPlanForm = lazy(() => import('./MicroPlanForm').then(module => ({ default: module.MicroPlanForm })))

interface MicroPlansListProps {
  microPlans: MicroInvestmentPlan[]
  activeMicroPlan: MicroInvestmentPlan | null
  isLoading: boolean
  onCreateMicroPlan: (data: CreateMicroInvestmentPlan) => Promise<MicroInvestmentPlan | null>
  onUpdateMicroPlan: (id: string, data: UpdateMicroInvestmentPlan) => Promise<MicroInvestmentPlan | null>
  onDeleteMicroPlan: (id: string) => Promise<boolean>
  planId: string
  planInitialDate: string
  planLimitAge?: number
  currency: 'BRL' | 'USD' | 'EUR'
}

export function MicroPlansList({
  microPlans,
  activeMicroPlan,
  isLoading,
  onCreateMicroPlan,
  onUpdateMicroPlan,
  onDeleteMicroPlan,
  planId,
  planInitialDate,
  planLimitAge,
  currency
}: MicroPlansListProps) {
  const { t } = useTranslation()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingMicroPlan, setEditingMicroPlan] = useState<MicroInvestmentPlan | null>(null)

  const currencySymbol = currency === 'BRL' ? 'R$' : currency === 'USD' ? '$' : '€'

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('investmentPlan.microPlans.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('investmentPlan.microPlans.title')}
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
                  isFirstMicroPlan={microPlans.length === 0}
                  baseMicroPlanDate={microPlans.length > 0 ? microPlans[0].effective_date : undefined}
                  existingMicroPlans={microPlans}
                />
              </Suspense>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {microPlans.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {t('investmentPlan.microPlans.noPlans')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('investmentPlan.microPlans.noPlansDescription')}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('investmentPlan.microPlans.createFirst')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeMicroPlan && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="bg-primary">
                    {t('investmentPlan.microPlans.active')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {t('investmentPlan.microPlans.effectiveFrom')} {new Date(activeMicroPlan.effective_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('investmentPlan.microPlans.monthlyDeposit')}:</span>
                    <p className="font-medium">{formatCurrency(activeMicroPlan.monthly_deposit, currency)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('investmentPlan.microPlans.desiredIncome')}:</span>
                    <p className="font-medium">{formatCurrency(activeMicroPlan.desired_income, currency)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('investmentPlan.microPlans.expectedReturn')}:</span>
                    <p className="font-medium">{activeMicroPlan.expected_return}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('investmentPlan.microPlans.inflation')}:</span>
                    <p className="font-medium">{activeMicroPlan.inflation}%</p>
                  </div>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('investmentPlan.microPlans.effectiveDate')}</TableHead>
                  <TableHead>{t('investmentPlan.microPlans.monthlyDeposit')}</TableHead>
                  <TableHead>{t('investmentPlan.microPlans.desiredIncome')}</TableHead>
                  <TableHead>{t('investmentPlan.microPlans.expectedReturn')}</TableHead>
                  <TableHead>{t('investmentPlan.microPlans.inflation')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {microPlans.map((microPlan) => (
                  <TableRow key={microPlan.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(microPlan.effective_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        <div className="flex gap-1">
                          {microPlan.id === activeMicroPlan?.id && (
                            <Badge variant="secondary" className="text-xs">
                              {t('investmentPlan.microPlans.active')}
                            </Badge>
                          )}
                          {microPlan.id === microPlans[0].id && (
                            <Badge variant="outline" className="text-xs">
                              {t('investmentPlan.microPlans.base')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {formatCurrency(microPlan.monthly_deposit, currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        {formatCurrency(microPlan.desired_income, currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        {microPlan.expected_return}%
                      </div>
                    </TableCell>
                    <TableCell>{microPlan.inflation}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingMicroPlan(microPlan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {microPlans.length > 1 && microPlan.id !== microPlans[0].id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMicroPlan(microPlan.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            {t('common.delete')}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

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
      </CardContent>
    </Card>
  )
}
