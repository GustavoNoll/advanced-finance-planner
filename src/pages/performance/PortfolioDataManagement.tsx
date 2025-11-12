import { useEffect, useMemo, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Edit, Trash2, Save, X, CheckSquare, Upload } from "lucide-react"
import { CSVImportDialog } from "@/components/portfolio/csv-import-dialog"
import { useTranslation } from "react-i18next"
import { PortfolioPerformanceService } from "@/services/portfolio-performance.service"
import { useToast } from "@/hooks/use-toast"
import { formatMaturityDate } from "@/utils/dateUtils"
import { handleSaveEdit, handleDeleteRow, handleDeleteSelected, formatCurrency } from "./helpers/portfolio-data-management.helpers"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"
import { CurrencyInput } from '@/components/ui/currency-input'
import { CurrencyCode } from "@/utils/currency"
import { useInvestmentPlanByUserId } from "@/hooks/useInvestmentPlan"

type ConsolidatedRow = ConsolidatedPerformance
type PerformanceRow = PerformanceData

export default function PortfolioDataManagement() {
  const { id: profileId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { toast } = useToast()

  // Buscar currency do plano de investimento
  const { plan } = useInvestmentPlanByUserId(profileId || '')
  const currency = (plan?.currency || 'BRL') as CurrencyCode

  const [tab, setTab] = useState<'consolidated' | 'detailed'>('consolidated')
  const [isLoading, setIsLoading] = useState(false)
  const [consolidated, setConsolidated] = useState<ConsolidatedRow[]>([])
  const [detailed, setDetailed] = useState<PerformanceRow[]>([])

  const [editOpen, setEditOpen] = useState(false)
  const [editingType, setEditingType] = useState<'consolidated' | 'detailed'>('consolidated')
  const [editItem, setEditItem] = useState<Partial<ConsolidatedRow & PerformanceRow>>({})
  const [periodError, setPeriodError] = useState<string>('')

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteMultipleConfirmOpen, setDeleteMultipleConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'consolidated' | 'detailed', id: string } | null>(null)

  const fetchData = useCallback(async () => {
    if (!profileId) return
    setIsLoading(true)
    try {
      const { consolidated, detailed } = await PortfolioPerformanceService.fetchAllData(
        profileId,
        'period',
        false
      )
      setConsolidated(consolidated)
      setDetailed(detailed)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: t('portfolioPerformance.validation.saveError'),
        description: error instanceof Error ? error.message : t('portfolioPerformance.validation.unknownError'),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [profileId, toast, t])

  useEffect(() => { fetchData() }, [fetchData])

  const periods = useMemo(() => {
    return Array.from(new Set([...(consolidated.map(r => r.period || '')), ...(detailed.map(r => r.period || ''))].filter(Boolean))).sort().reverse()
  }, [consolidated, detailed])
  const institutions = useMemo(() => Array.from(new Set([...(consolidated.map(r => r.institution || '')), ...(detailed.map(r => r.institution || ''))].filter(Boolean))).sort(), [consolidated, detailed])
  const classes = useMemo(() => Array.from(new Set(detailed.map(r => r.asset_class || '').filter(Boolean))).sort(), [detailed])
  const issuers = useMemo(() => Array.from(new Set(detailed.map(r => r.issuer || '').filter(Boolean))).sort(), [detailed])

  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedIssuers, setSelectedIssuers] = useState<string[]>([])

  const filteredConsolidated = useMemo(() => {
    return consolidated.filter(r => (
      (selectedPeriods.length === 0 || (r.period && selectedPeriods.includes(r.period))) &&
      (selectedInstitutions.length === 0 || (r.institution && selectedInstitutions.includes(r.institution)))
    ))
  }, [consolidated, selectedPeriods, selectedInstitutions])

  const filteredDetailed = useMemo(() => {
    return detailed.filter(r => (
      (selectedPeriods.length === 0 || (r.period && selectedPeriods.includes(r.period))) &&
      (selectedInstitutions.length === 0 || (r.institution && selectedInstitutions.includes(r.institution))) &&
      (selectedClasses.length === 0 || (r.asset_class && selectedClasses.includes(r.asset_class))) &&
      (selectedIssuers.length === 0 || (r.issuer && selectedIssuers.includes(r.issuer)))
    ))
  }, [detailed, selectedPeriods, selectedInstitutions, selectedClasses, selectedIssuers])

  const openEdit = (type: 'consolidated' | 'detailed', item?: ConsolidatedRow | PerformanceRow) => {
    setEditingType(type)
    if (item) {
      setEditItem({ ...item })
    } else {
      // Inicializar campos numéricos como 0
      setEditItem({
        profile_id: profileId || '',
        initial_assets: 0,
        movement: 0,
        taxes: 0,
        financial_gain: 0,
        final_assets: 0,
        position: 0,
        yield: 0
      })
    }
    setPeriodError('')
    setEditOpen(true)
  }

  // Função para formatar e validar o campo Period (MM/YYYY)
  const handlePeriodChange = (value: string) => {
    // Remove tudo que não é número
    const numbersOnly = value.replace(/\D/g, '')
    
    let formatted = ''
    
    if (numbersOnly.length > 0) {
      // Adiciona o mês (máximo 2 dígitos)
      const month = numbersOnly.slice(0, 2)
      formatted = month
      
      // Se tem mais de 2 dígitos, adiciona a barra e o ano
      if (numbersOnly.length > 2) {
        const year = numbersOnly.slice(2, 6)
        formatted = `${month}/${year}`
      }
    }
    
    setPeriodError('')
    
    // Validação
    if (formatted.length > 0 && formatted.includes('/')) {
      const [monthStr, yearStr] = formatted.split('/')
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)
      
      if (monthStr.length === 2) {
        if (month < 1 || month > 12) {
          setPeriodError(t('portfolioPerformance.dataManagement.editDialog.invalidMonth') || 'Mês inválido (01-12)')
        }
      }
      
      if (yearStr.length === 4) {
        const currentYear = new Date().getFullYear()
        if (year < 1900 || year > currentYear + 10) {
          setPeriodError(t('portfolioPerformance.dataManagement.editDialog.invalidYear') || `Ano inválido (1900-${currentYear + 10})`)
        }
      }
    }
    
    setEditItem(prev => ({ ...prev, period: formatted }))
  }

  const saveEdit = async () => {
    // Validar período antes de salvar
    if (editItem.period) {
      const [monthStr, yearStr] = editItem.period.split('/')
      if (!monthStr || !yearStr || monthStr.length !== 2 || yearStr.length !== 4) {
        toast({
          title: t('portfolioPerformance.validation.invalidPeriod') || 'Período inválido',
          description: t('portfolioPerformance.validation.periodFormat') || 'Formato deve ser MM/YYYY',
          variant: 'destructive'
        })
        return
      }
      
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)
      
      if (month < 1 || month > 12) {
        toast({
          title: t('portfolioPerformance.validation.invalidPeriod') || 'Período inválido',
          description: t('portfolioPerformance.validation.invalidMonth') || 'Mês deve estar entre 01 e 12',
          variant: 'destructive'
        })
        return
      }
      
      const currentYear = new Date().getFullYear()
      if (year < 1900 || year > currentYear + 10) {
        toast({
          title: t('portfolioPerformance.validation.invalidPeriod') || 'Período inválido',
          description: t('portfolioPerformance.validation.invalidYear') || `Ano deve estar entre 1900 e ${currentYear + 10}`,
          variant: 'destructive'
        })
        return
      }
    }
    
    await handleSaveEdit({
      editingType,
      editItem,
      profileId: profileId || '',
      toast,
      t,
      onSuccess: fetchData,
      onClose: () => {
        setEditOpen(false)
        setEditItem({})
        setPeriodError('')
      }
    })
  }

  const confirmDelete = (type: 'consolidated' | 'detailed', id: string) => {
    setItemToDelete({ type, id })
    setDeleteConfirmOpen(true)
  }

  const deleteRow = async (type: 'consolidated' | 'detailed', id: string) => {
    await handleDeleteRow({
      type,
      id,
      toast,
      t,
      onSuccess: fetchData
    })
  }

  const handleDeleteMultiple = async () => {
    await handleDeleteSelected({
      tab,
      selectedIds,
      toast,
      t,
      onSuccess: fetchData,
      onClearSelection: () => setSelectedIds(new Set())
    })
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const selectAllVisible = () => {
    const list = tab === 'consolidated' ? filteredConsolidated : filteredDetailed
    setSelectedIds(new Set(list.map(r => r.id)))
  }

  const clearSelection = () => setSelectedIds(new Set())

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(`/client/${profileId}?view=portfolio-performance`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('portfolioPerformance.dataManagement.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('portfolioPerformance.dataManagement.title')}</h1>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/market-data-audit/${profileId}`)}
        >
          {t('portfolioPerformance.dataManagement.provaReal')}
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('portfolioPerformance.dataManagement.filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>{t('portfolioPerformance.dataManagement.filterLabels.periods')}</Label>
              <Select 
                value={selectedPeriods.length === 0 ? '__all__' : selectedPeriods[0]} 
                onValueChange={(v) => setSelectedPeriods(v === '__all__' ? [] : [v])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('portfolioPerformance.filters.allPeriods')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t('portfolioPerformance.filters.all')}</SelectItem>
                  {periods.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('portfolioPerformance.dataManagement.filterLabels.institutions')}</Label>
              <Select 
                value={selectedInstitutions.length === 0 ? '__all__' : selectedInstitutions[0]} 
                onValueChange={(v) => setSelectedInstitutions(v === '__all__' ? [] : [v])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('portfolioPerformance.filters.allInstitutions')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t('portfolioPerformance.filters.all')}</SelectItem>
                  {institutions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('portfolioPerformance.dataManagement.filterLabels.assetClasses')}</Label>
              <Select 
                value={selectedClasses.length === 0 ? '__all__' : selectedClasses[0]} 
                onValueChange={(v) => setSelectedClasses(v === '__all__' ? [] : [v])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('portfolioPerformance.filters.allClasses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t('portfolioPerformance.filters.all')}</SelectItem>
                  {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('portfolioPerformance.dataManagement.filterLabels.issuers')}</Label>
              <Select 
                value={selectedIssuers.length === 0 ? '__all__' : selectedIssuers[0]} 
                onValueChange={(v) => setSelectedIssuers(v === '__all__' ? [] : [v])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('portfolioPerformance.filters.allIssuers')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t('portfolioPerformance.filters.all')}</SelectItem>
                  {issuers.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v: string) => setTab(v as 'consolidated' | 'detailed')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="consolidated">{t('portfolioPerformance.dataManagement.tabs.consolidated')}</TabsTrigger>
          <TabsTrigger value="detailed">{t('portfolioPerformance.dataManagement.tabs.detailed')}</TabsTrigger>
        </TabsList>

        <TabsContent value="consolidated">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('portfolioPerformance.dataManagement.tabs.consolidated')}</CardTitle>
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    {selectedIds.size} {t('portfolioPerformance.dataManagement.selected')}
                    <Button size="sm" variant="outline" onClick={clearSelection} className="h-7">
                      <X className="h-3 w-3 mr-1" /> {t('portfolioPerformance.dataManagement.clear')}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={selectAllVisible} className="h-8">
                  <CheckSquare className="h-3 w-3 mr-1" /> {t('portfolioPerformance.selectAll')}
                </Button>
                {selectedIds.size > 0 && (
                  <Button size="sm" variant="destructive" onClick={() => setDeleteMultipleConfirmOpen(true)} className="h-8">
                    <Trash2 className="h-3 w-3 mr-1" /> {t('portfolioPerformance.dataManagement.delete.deleteSelected')}
                  </Button>
                )}
                <Button variant="outline" onClick={() => { setTab('consolidated'); setImportDialogOpen(true) }}>
                  <Upload className="mr-2 h-4 w-4" /> {t('portfolioPerformance.importCSV.button')}
                </Button>
                <Button onClick={() => openEdit('consolidated')}><Plus className="mr-2 h-4 w-4" /> {t('portfolioPerformance.newRecord')}</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.period')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.institution')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.currency')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.accountName')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.initialAssets')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.movement')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.taxes')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.financialGain')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.finalAssets')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.yield')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={12}>{t('portfolioPerformance.dataManagement.loading')}</TableCell></TableRow>
                    ) : filteredConsolidated.length === 0 ? (
                      <TableRow><TableCell colSpan={12}>{t('portfolioPerformance.dataManagement.noData')}</TableCell></TableRow>
                    ) : filteredConsolidated.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Checkbox checked={selectedIds.has(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                        </TableCell>
                        <TableCell>{r.period}</TableCell>
                        <TableCell>{r.institution}</TableCell>
                        <TableCell>{r.currency || 'BRL'}</TableCell>
                        <TableCell>{r.account_name || '-'}</TableCell>
                        <TableCell>{formatCurrency(r.initial_assets)}</TableCell>
                        <TableCell>{formatCurrency(r.movement)}</TableCell>
                        <TableCell>{formatCurrency(r.taxes)}</TableCell>
                        <TableCell>{formatCurrency(r.financial_gain)}</TableCell>
                        <TableCell>{formatCurrency(r.final_assets)}</TableCell>
                        <TableCell>{(((r.yield || 0) * 100).toFixed(2))}%</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit('consolidated', r)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="destructive" size="sm" onClick={() => confirmDelete('consolidated', r.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('portfolioPerformance.dataManagement.tabs.detailed')}</CardTitle>
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    {selectedIds.size} {t('portfolioPerformance.dataManagement.selected')}
                    <Button size="sm" variant="outline" onClick={clearSelection} className="h-7">
                      <X className="h-3 w-3 mr-1" /> {t('portfolioPerformance.dataManagement.clear')}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={selectAllVisible} className="h-8">
                  <CheckSquare className="h-3 w-3 mr-1" /> {t('portfolioPerformance.selectAll')}
                </Button>
                {selectedIds.size > 0 && (
                  <Button size="sm" variant="destructive" onClick={() => setDeleteMultipleConfirmOpen(true)} className="h-8">
                    <Trash2 className="h-3 w-3 mr-1" /> {t('portfolioPerformance.dataManagement.delete.deleteSelected')}
                  </Button>
                )}
                <Button variant="outline" onClick={() => { setTab('detailed'); setImportDialogOpen(true) }}>
                  <Upload className="mr-2 h-4 w-4" /> {t('portfolioPerformance.importCSV.button')}
                </Button>
                <Button onClick={() => openEdit('detailed')}><Plus className="mr-2 h-4 w-4" /> {t('portfolioPerformance.newRecord')}</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.period')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.institution')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.currency')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.accountName')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.asset')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.issuer')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.assetClass')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.position')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.rate')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.maturity')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.yield')}</TableHead>
                      <TableHead>{t('portfolioPerformance.dataManagement.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={13}>{t('portfolioPerformance.dataManagement.loading')}</TableCell></TableRow>
                    ) : filteredDetailed.length === 0 ? (
                      <TableRow><TableCell colSpan={13}>{t('portfolioPerformance.dataManagement.noData')}</TableCell></TableRow>
                    ) : filteredDetailed.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Checkbox checked={selectedIds.has(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                        </TableCell>
                        <TableCell>{r.period}</TableCell>
                        <TableCell>{r.institution}</TableCell>
                        <TableCell>{r.currency || 'BRL'}</TableCell>
                        <TableCell>{r.account_name || '-'}</TableCell>
                        <TableCell>{r.asset}</TableCell>
                        <TableCell>{r.issuer}</TableCell>
                        <TableCell>{r.asset_class}</TableCell>
                        <TableCell>{formatCurrency(r.position)}</TableCell>
                        <TableCell>{r.rate || '-'}</TableCell>
                        <TableCell>{formatMaturityDate(r.maturity_date)}</TableCell>
                        <TableCell>{(((r.yield || 0) * 100).toFixed(2))}%</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit('detailed', r)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="destructive" size="sm" onClick={() => confirmDelete('detailed', r.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editItem?.id ? t('portfolioPerformance.dataManagement.editDialog.edit') : t('portfolioPerformance.dataManagement.editDialog.create')}{' '}
              {editingType === 'consolidated' ? t('portfolioPerformance.dataManagement.editDialog.consolidatedData') : t('portfolioPerformance.dataManagement.editDialog.detailedData')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('portfolioPerformance.dataManagement.editDialog.periodLabel')}</Label>
                <Input 
                  value={editItem.period || ''} 
                  onChange={(e) => handlePeriodChange(e.target.value)} 
                  placeholder="MM/YYYY"
                  maxLength={7}
                  className={`h-12 ${periodError ? 'border-destructive' : ''}`}
                />
                {periodError && (
                  <p className="text-sm text-destructive mt-1">{periodError}</p>
                )}
              </div>
              <div>
                <Label>{t('portfolioPerformance.dataManagement.editDialog.institutionLabel')}</Label>
                <Input value={editItem.institution || ''} onChange={(e) => setEditItem(prev => ({ ...prev, institution: e.target.value }))} className="h-12" />
              </div>
              <div>
                <Label>{t('portfolioPerformance.dataManagement.editDialog.currencyLabel')}</Label>
                <Select 
                  value={editItem.currency || currency} 
                  onValueChange={(value) => setEditItem(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('portfolioPerformance.dataManagement.editDialog.accountNameLabel')}</Label>
                <Input 
                  value={editItem.account_name || ''} 
                  onChange={(e) => setEditItem(prev => ({ ...prev, account_name: e.target.value || null }))} 
                  className="h-12" 
                  placeholder={t('portfolioPerformance.dataManagement.editDialog.accountNamePlaceholder')}
                />
              </div>
            </div>

            {editingType === 'consolidated' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.initialAssetsLabel')}</Label>
                  <CurrencyInput
                    id="initial_assets"
                    keyPrefix={editItem.id ? `initial_assets_${editItem.id}` : undefined}
                    className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                    currency={currency}
                    allowNegativeValue={false}
                    defaultValue={editItem.initial_assets ?? undefined}
                    onValueChange={(value, _name, values) => {
                      const numValue = values?.float ?? 0
                      setEditItem(p => ({ ...p, initial_assets: numValue }))
                    }}
                  />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.movementLabel')}</Label>
                  <CurrencyInput
                    id="movement"
                    keyPrefix={editItem.id ? `movement_${editItem.id}` : undefined}
                    className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                    currency={currency}
                    allowNegativeValue={true}
                    defaultValue={editItem.movement ?? undefined}
                    onValueChange={(value, _name, values) => {
                      const numValue = values?.float ?? 0
                      setEditItem(p => ({ ...p, movement: numValue }))
                    }}
                  />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.taxesLabel')}</Label>
                  <CurrencyInput
                    id="taxes"
                    keyPrefix={editItem.id ? `taxes_${editItem.id}` : undefined}
                    className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                    currency={currency}
                    allowNegativeValue={false}
                    defaultValue={editItem.taxes ?? undefined}
                    onValueChange={(value, _name, values) => {
                      const numValue = values?.float ?? 0
                      setEditItem(p => ({ ...p, taxes: numValue }))
                    }}
                  />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.financialGainLabel')}</Label>
                  <CurrencyInput
                    id="financial_gain"
                    keyPrefix={editItem.id ? `financial_gain_${editItem.id}` : undefined}
                    className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                    currency={currency}
                    allowNegativeValue={true}
                    defaultValue={editItem.financial_gain ?? undefined}
                    onValueChange={(value, _name, values) => {
                      const numValue = values?.float ?? 0
                      setEditItem(p => ({ ...p, financial_gain: numValue }))
                    }}
                  />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.finalAssetsLabel')}</Label>
                  <CurrencyInput
                    id="final_assets"
                    keyPrefix={editItem.id ? `final_assets_${editItem.id}` : undefined}
                    className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                    currency={currency}
                    allowNegativeValue={false}
                    defaultValue={editItem.final_assets ?? undefined}
                    onValueChange={(value, _name, values) => {
                      const numValue = values?.float ?? 0
                      setEditItem(p => ({ ...p, final_assets: numValue }))
                    }}
                  />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.yieldLabel')}</Label>
                  <Input type="number" step="0.0001" value={(((editItem.yield as number) || 0) * 100).toFixed(4)} onChange={(e) => setEditItem(p => ({ ...p, yield: (parseFloat(e.target.value) || 0) / 100 }))} className="h-12" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.assetLabel')}</Label>
                  <Input value={editItem.asset || ''} onChange={(e) => setEditItem(p => ({ ...p, asset: e.target.value }))} className="h-12" />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.issuerLabel')}</Label>
                  <Input value={editItem.issuer || ''} onChange={(e) => setEditItem(p => ({ ...p, issuer: e.target.value }))} className="h-12" />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.assetClassLabel')}</Label>
                  <Input value={editItem.asset_class || ''} onChange={(e) => setEditItem(p => ({ ...p, asset_class: e.target.value }))} className="h-12" />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.positionLabel')}</Label>
                  <CurrencyInput
                    id="position"
                    keyPrefix={editItem.id ? `position_${editItem.id}` : undefined}
                    className="flex h-12 w-full rounded-lg border border-input bg-background text-foreground px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:[color-scheme:dark]"
                    currency={currency}
                    allowNegativeValue={false}
                    defaultValue={editItem.position ?? undefined}
                    onValueChange={(value, _name, values) => {
                      const numValue = values?.float ?? 0
                      setEditItem(p => ({ ...p, position: numValue }))
                    }}
                  />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.rateLabel')}</Label>
                  <Input value={editItem.rate || ''} onChange={(e) => setEditItem(p => ({ ...p, rate: e.target.value }))} className="h-12" />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.maturityLabel')}</Label>
                  <Input type="date" value={editItem.maturity_date || ''} onChange={(e) => setEditItem(p => ({ ...p, maturity_date: e.target.value }))} className="h-12" />
                </div>
                <div>
                  <Label>{t('portfolioPerformance.dataManagement.editDialog.yieldLabel')}</Label>
                  <Input type="number" step="0.0001" value={(((editItem.yield as number) || 0) * 100).toFixed(4)} onChange={(e) => setEditItem(p => ({ ...p, yield: (parseFloat(e.target.value) || 0) / 100 }))} className="h-12" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}><X className="h-4 w-4 mr-1" /> {t('portfolioPerformance.dataManagement.editDialog.cancel')}</Button>
              <Button onClick={saveEdit}><Save className="h-4 w-4 mr-1" /> {t('portfolioPerformance.dataManagement.editDialog.save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <CSVImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        profileId={profileId || ''}
        onImportComplete={fetchData}
        importType={tab}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('portfolioPerformance.dataManagement.delete.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('portfolioPerformance.dataManagement.delete.confirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('portfolioPerformance.dataManagement.delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  deleteRow(itemToDelete.type, itemToDelete.id)
                  setDeleteConfirmOpen(false)
                  setItemToDelete(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('portfolioPerformance.dataManagement.delete.deleteButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Multiple Confirmation Dialog */}
      <AlertDialog open={deleteMultipleConfirmOpen} onOpenChange={setDeleteMultipleConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('portfolioPerformance.dataManagement.delete.confirmDeleteMultiple')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('portfolioPerformance.dataManagement.delete.confirmDeleteMultipleMessage', { count: selectedIds.size })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('portfolioPerformance.dataManagement.delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteMultiple()
                setDeleteMultipleConfirmOpen(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('portfolioPerformance.dataManagement.delete.deleteButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


