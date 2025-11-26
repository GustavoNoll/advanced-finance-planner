import { useEffect, useMemo, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AssetClassSelect } from "./components/AssetClassSelect"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Edit, Trash2, Save, X, CheckSquare, BarChart3, Info, CheckCircle2, AlertCircle, XCircle, Tag, DollarSign, Copy, ArrowUp, ArrowDown, ChevronDown, Settings2, ArrowRight, Settings, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import { PortfolioPerformanceService } from "@/services/portfolio-performance.service"
import { useToast } from "@/hooks/use-toast"
import { usePortfolioVerificationSettings, usePortfolioVerificationSettingsMutations } from "@/hooks/usePortfolioVerificationSettings"
import { formatMaturityDate } from "@/utils/dateUtils"
import { handleSaveEdit, handleDeleteRow, handleDeleteSelected } from "./helpers/portfolio-data-management.helpers"
import { formatCurrency } from "@/utils/currency"
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial"
import { CurrencyInput } from '@/components/ui/currency-input'
import { CurrencyCode } from "@/utils/currency"
import { useInvestmentPlanByUserId } from "@/hooks/useInvestmentPlan"
import { usePortfolioDataManagement } from "./hooks/usePortfolioDataManagement"
import { VerificationSummary } from "./components/VerificationSummary"
import { ImportDialog } from "./components/ImportDialog"
import { ExportDialog } from "./components/ExportDialog"
import { BrokerPDFImportDialog } from "./components/BrokerPDFImportDialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import type { Filter as FilterType, FilterableField } from "./types/portfolio-data-management.types"
import { operatorsByFieldType } from "./utils/filters"
import { isValidAssetClass, translateAssetClassForDisplay } from "./utils/valid-asset-classes"
import { supabase } from "@/lib/supabase"
import type { UserProfileInvestment } from "@/types/broker-dashboard"

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
  const [isLoading, setIsLoading] = useState(true)
  const [consolidated, setConsolidated] = useState<ConsolidatedRow[]>([])
  const [detailed, setDetailed] = useState<PerformanceRow[]>([])

  const [editOpen, setEditOpen] = useState(false)
  const [editingType, setEditingType] = useState<'consolidated' | 'detailed'>('consolidated')
  const [editItem, setEditItem] = useState<Partial<ConsolidatedRow & PerformanceRow>>({})
  const [periodError, setPeriodError] = useState<string>('')

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importDialogType, setImportDialogType] = useState<'consolidated' | 'detailed'>('consolidated')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteMultipleConfirmOpen, setDeleteMultipleConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'consolidated' | 'detailed', id: string } | null>(null)
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)
  const [pdfClients, setPdfClients] = useState<UserProfileInvestment[]>([])
  
  // Export dialog
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  
  // Verification settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [tempToleranceValue, setTempToleranceValue] = useState<string>("2500.00")
  const [tempCorrectThreshold, setTempCorrectThreshold] = useState<string>("0.01")
  
  // Hook para buscar configurações de verificação
  const { correctThreshold, toleranceValue } = usePortfolioVerificationSettings(profileId || null)
  const { updateSettings } = usePortfolioVerificationSettingsMutations(profileId || null)
  
  // Column visibility
  const [visibleColumnsConsolidated, setVisibleColumnsConsolidated] = useState<Set<string>>(new Set([
    'period', 'institution', 'currency', 'account_name', 'final_assets', 'yield', 'verification', 'actions'
  ]))
  const [visibleColumnsDetailed, setVisibleColumnsDetailed] = useState<Set<string>>(new Set([
    'period', 'institution', 'currency', 'account_name', 'asset', 'issuer', 'asset_class', 'position', 'rate', 'maturity', 'yield', 'verification', 'actions'
  ]))

  const fetchData = useCallback(async () => {
    if (!profileId) {
      setIsLoading(false)
      return
    }
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

  useEffect(() => {
    if (profileId) {
      fetchData()
    } else {
      setIsLoading(false)
    }
  }, [profileId, fetchData])

  useEffect(() => {
    if (!profileId) return
    let isMounted = true

    const loadClientForPdfImport = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles_investment')
          .select('*')
          .eq('profile_id', profileId)

        if (error) throw error
        if (!isMounted) return
        setPdfClients(data || [])
      } catch (error) {
        if (!isMounted) return
        console.error('Error fetching client for PDF import:', error)
        toast({
          title: t('brokerDashboard.messages.error.title') || t('portfolioPerformance.dataManagement.error') || 'Erro',
          description: error instanceof Error
            ? error.message
            : t('brokerDashboard.messages.error.fetchClients') || 'Erro ao buscar clientes',
          variant: 'destructive'
        })
      }
    }

    loadClientForPdfImport()

    return () => {
      isMounted = false
    }
  }, [profileId, toast, t])

  // Sincronizar valores temporários quando as configurações mudarem
  useEffect(() => {
    setTempCorrectThreshold(correctThreshold.toString())
    setTempToleranceValue(toleranceValue.toString())
  }, [correctThreshold, toleranceValue])

  const {
    periods,
    institutions,
    classes,
    issuers,
    selectedPeriods,
    setSelectedPeriods,
    selectedInstitutions,
    setSelectedInstitutions,
    selectedClasses,
    setSelectedClasses,
    selectedIssuers,
    setSelectedIssuers,
    activeFilters,
    setActiveFilters,
    sortConfig,
    handleSort,
    verifFilter,
    setVerifFilter,
    searchText,
    setSearchText,
    filteredConsolidated,
    filteredDetailed,
    getVerification
  } = usePortfolioDataManagement({
    consolidated,
    detailed,
    correctThreshold,
    toleranceValue
  })

  const openEdit = (type: 'consolidated' | 'detailed', item?: ConsolidatedRow | PerformanceRow) => {
    setEditingType(type)
    if (item) {
      setEditItem({ ...item })
    } else {
      // Resetar filtros ao criar novo registro
      setSelectedPeriods([])
      setSelectedInstitutions([])
      setSelectedClasses([])
      setSelectedIssuers([])
      setActiveFilters([])
      setVerifFilter('all')
      setSearchText('')
      
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

  // Verifica se o ativo tem rentabilidade preenchida
  const hasValidYield = (rendimento: number | null | undefined): boolean => {
    if (rendimento == null) return false
    if (typeof rendimento === 'number') {
      return true // Aceita qualquer número, incluindo 0
    }
    return false
  }

  // Filterable fields
  const filterableFieldsConsolidated: FilterableField[] = useMemo(() => [
    { key: 'period', label: t('portfolioPerformance.dataManagement.table.period'), type: 'text', options: periods },
    { key: 'institution', label: t('portfolioPerformance.dataManagement.table.institution'), type: 'text', options: institutions },
    { key: 'account_name', label: t('portfolioPerformance.dataManagement.table.accountName'), type: 'text' },
    { key: 'currency', label: t('portfolioPerformance.dataManagement.table.currency'), type: 'text' },
    { key: 'initial_assets', label: t('portfolioPerformance.dataManagement.table.initialAssets'), type: 'number' },
    { key: 'movement', label: t('portfolioPerformance.dataManagement.table.movement'), type: 'number' },
    { key: 'taxes', label: t('portfolioPerformance.dataManagement.table.taxes'), type: 'number' },
    { key: 'financial_gain', label: t('portfolioPerformance.dataManagement.table.financialGain'), type: 'number' },
    { key: 'final_assets', label: t('portfolioPerformance.dataManagement.table.finalAssets'), type: 'number' },
    { key: 'yield', label: t('portfolioPerformance.dataManagement.table.yield'), type: 'number' }
  ], [periods, institutions, t])

  const filterableFieldsDetailed: FilterableField[] = useMemo(() => [
    { key: 'period', label: t('portfolioPerformance.dataManagement.table.period'), type: 'text', options: periods },
    { key: 'institution', label: t('portfolioPerformance.dataManagement.table.institution'), type: 'text', options: institutions },
    { key: 'account_name', label: t('portfolioPerformance.dataManagement.table.accountName'), type: 'text' },
    { key: 'currency', label: t('portfolioPerformance.dataManagement.table.currency'), type: 'text' },
    { key: 'asset', label: t('portfolioPerformance.dataManagement.table.asset'), type: 'text' },
    { key: 'issuer', label: t('portfolioPerformance.dataManagement.table.issuer'), type: 'text', options: issuers },
    { key: 'asset_class', label: t('portfolioPerformance.dataManagement.table.assetClass'), type: 'text', options: classes },
    { key: 'position', label: t('portfolioPerformance.dataManagement.table.position'), type: 'number' },
    { key: 'rate', label: t('portfolioPerformance.dataManagement.table.rate'), type: 'text' },
    { key: 'maturity_date', label: t('portfolioPerformance.dataManagement.table.maturity'), type: 'text' },
    { key: 'yield', label: t('portfolioPerformance.dataManagement.table.yield'), type: 'number' }
  ], [periods, institutions, issuers, classes, t])

  const getFilterableFields = () => {
    return tab === 'detailed' ? filterableFieldsDetailed : filterableFieldsConsolidated
  }

  const getFieldType = (fieldKey: string) => {
    const allFields = [...filterableFieldsConsolidated, ...filterableFieldsDetailed]
    const field = allFields.find(f => f.key === fieldKey)
    return field?.type || 'text'
  }

  const getFieldLabel = (fieldKey: string) => {
    const allFields = [...filterableFieldsConsolidated, ...filterableFieldsDetailed]
    const field = allFields.find(f => f.key === fieldKey)
    return field?.label || fieldKey
  }

  const getOperatorLabel = (operator: string) => {
    const allOperators = [...operatorsByFieldType.text, ...operatorsByFieldType.number]
    const op = allOperators.find(o => o.value === operator)
    return op?.label || operator
  }

  const formatFilterValue = (value: string | number | string[], fieldKey: string) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return '(vazio)'
      if (value.length === 1) return value[0]
      if (value.length <= 3) return value.join(', ')
      return `${value.slice(0, 2).join(', ')} +${value.length - 2}`
    }
    
    const fieldType = getFieldType(fieldKey)
    if (fieldType === 'number' && typeof value === 'number') {
      return formatCurrency(value, 'BRL')
    }
    return String(value)
  }

  const getFieldOptions = (fieldKey: string) => {
    const allFields = [...filterableFieldsConsolidated, ...filterableFieldsDetailed]
    const field = allFields.find(f => f.key === fieldKey)
    return field?.options || null
  }

  const handleAddFilter = (filter: FilterType) => {
    setActiveFilters([...activeFilters, filter])
  }

  const handleRemoveFilter = (id: string) => {
    if (id === 'all') {
      setActiveFilters([])
    } else {
      setActiveFilters(activeFilters.filter(f => f.id !== id))
    }
  }

  // Filter Builder Component
  const FilterBuilder = ({ onAddFilter }: { onAddFilter: (filter: FilterType) => void }) => {
    const [field, setField] = useState('')
    const [operator, setOperator] = useState('')
    const [value, setValue] = useState<string | number | string[]>('')
    const [open, setOpen] = useState(false)

    useEffect(() => {
      if (operator) {
        if (['contains', 'notContains'].includes(operator)) {
          setValue([])
        } else {
          setValue('')
        }
      }
    }, [operator])

    const getOperators = (type: string) => {
      return operatorsByFieldType[type] || operatorsByFieldType.text
    }

    const handleAdd = () => {
      if (field && operator) {
        onAddFilter({
          id: crypto.randomUUID(),
          field,
          operator,
          value: operator === 'isEmpty' || operator === 'isNotEmpty' ? '' : value
        })
        setField('')
        setOperator('')
        setValue('')
        setOpen(false)
      }
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            {t('portfolioPerformance.dataManagement.addFilter')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div>
              <Label>{t('portfolioPerformance.dataManagement.filterBuilder.field') || 'Campo'}</Label>
              <Select value={field} onValueChange={(val) => { setField(val); setOperator(''); setValue(''); }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('portfolioPerformance.dataManagement.filterBuilder.selectField') || 'Selecione um campo'} />
                </SelectTrigger>
                <SelectContent>
                  {getFilterableFields().map(f => (
                    <SelectItem key={f.key} value={f.key}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {field && (
              <div>
                <Label>{t('portfolioPerformance.dataManagement.filterBuilder.operator') || 'Operador'}</Label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t('portfolioPerformance.dataManagement.filterBuilder.selectOperator') || 'Selecione um operador'} />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperators(getFieldType(field)).map(op => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {field && operator && !['isEmpty', 'isNotEmpty'].includes(operator) && (
              <div>
                <Label>{t('portfolioPerformance.dataManagement.filterBuilder.value') || 'Valor'}</Label>
                {(() => {
                  const fieldType = getFieldType(field)
                  const fieldOptions = getFieldOptions(field)
                  const isMultiSelectOperator = ['contains', 'notContains'].includes(operator)
                  
                  if (fieldOptions && fieldOptions.length > 0 && isMultiSelectOperator) {
                    return (
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                              size="sm"
                            >
                              <span className="truncate">
                                {Array.isArray(value) && value.length > 0
                                  ? `${value.length} ${t('portfolioPerformance.dataManagement.filterBuilder.selected') || 'selecionado(s)'}`
                                  : t('portfolioPerformance.dataManagement.filterBuilder.selectValues') || 'Selecione valores'}
                              </span>
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <div className="max-h-64 overflow-y-auto p-2">
                              {fieldOptions.map((option: string) => {
                                const selectedValues = Array.isArray(value) ? value : []
                                const isSelected = selectedValues.includes(option)
                                
                                return (
                                  <div
                                    key={option}
                                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                                    onClick={() => {
                                      const currentValues = Array.isArray(value) ? [...value] : []
                                      if (isSelected) {
                                        setValue(currentValues.filter(v => v !== option))
                                      } else {
                                        setValue([...currentValues, option])
                                      }
                                    }}
                                  >
                                    <Checkbox checked={isSelected} />
                                    <label className="flex-1 cursor-pointer text-sm">
                                      {option}
                                    </label>
                                  </div>
                                )
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )
                  }
                  
                  if (fieldOptions && fieldOptions.length > 0) {
                    return (
                      <Select 
                        value={String(value)} 
                        onValueChange={(val) => setValue(val)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder={t('portfolioPerformance.dataManagement.filterBuilder.selectValue') || 'Selecione um valor'} />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldOptions.map((option: string) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  }
                  
                  return (
                    <Input
                      type={fieldType === 'number' ? 'number' : 'text'}
                      value={value as string}
                      onChange={(e) => setValue(fieldType === 'number' ? Number(e.target.value) : e.target.value)}
                      placeholder={t('portfolioPerformance.dataManagement.filterBuilder.enterValue') || 'Digite o valor'}
                      className="mt-1"
                    />
                  )
                })()}
              </div>
            )}

            <Button 
              onClick={handleAdd}
              disabled={
                !field || 
                !operator || 
                (
                  !['isEmpty', 'isNotEmpty'].includes(operator) && 
                  (
                    (Array.isArray(value) && value.length === 0) || 
                    (!Array.isArray(value) && !value)
                  )
                )
              }
              className="w-full"
              size="sm"
            >
              {t('portfolioPerformance.dataManagement.filterBuilder.add') || 'Adicionar'}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // Active Filters Display
  const ActiveFilters = ({ filters, onRemoveFilter }: { filters: FilterType[]; onRemoveFilter: (id: string) => void }) => {
    if (filters.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md mb-4">
        <span className="text-sm text-muted-foreground font-medium">{t('portfolioPerformance.dataManagement.activeFilters') || 'Filtros:'}</span>
        {filters.map(filter => (
          <div key={filter.id} className="flex items-center gap-1.5 bg-background border rounded-md px-2.5 py-1 text-sm shadow-sm">
            <span className="font-medium text-foreground">{getFieldLabel(filter.field)}</span>
            <span className="text-muted-foreground">{getOperatorLabel(filter.operator)}</span>
            {!['isEmpty', 'isNotEmpty'].includes(filter.operator) && (
              <span className="font-medium text-foreground">{formatFilterValue(filter.value, filter.field)}</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-destructive/10"
              onClick={() => onRemoveFilter(filter.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveFilter('all')}
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          {t('portfolioPerformance.dataManagement.clearAllFilters') || 'Limpar todos'}
        </Button>
      </div>
    )
  }

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
        <div className="flex items-center gap-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-card/50 border-primary/20 hover:bg-primary/10"
              >
                <Settings className="h-4 w-4" />
                {t('portfolioPerformance.dataManagement.settings') || 'Configurações'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('portfolioPerformance.dataManagement.verificationSettings') || 'Configurações de Verificação'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="correctThreshold">
                    {t('portfolioPerformance.dataManagement.correctThreshold') || 'Limite para "Correto" (R$)'}
                  </Label>
                  <div className="text-sm text-muted-foreground mb-2">
                    {t('portfolioPerformance.dataManagement.correctThresholdDescription') || 'Diferenças abaixo deste valor serão marcadas como "Correto" (verde).'}
                  </div>
                  <Input
                    id="correctThreshold"
                    type="number"
                    step="0.01"
                    min="0"
                    value={tempCorrectThreshold}
                    onChange={(e) => setTempCorrectThreshold(e.target.value)}
                    placeholder="Ex: 0.01"
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('portfolioPerformance.dataManagement.currentValue') || 'Valor atual:'} {formatCurrency(correctThreshold, currency)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tolerance">
                    {t('portfolioPerformance.dataManagement.toleranceThreshold') || 'Limite para "Tolerância" (R$)'}
                  </Label>
                  <div className="text-sm text-muted-foreground mb-2">
                    {t('portfolioPerformance.dataManagement.toleranceThresholdDescription') || 'Diferenças abaixo deste valor serão marcadas como "Tolerância" (amarelo) ao invés de "Inconsistente" (vermelho).'}
                  </div>
                  <Input
                    id="tolerance"
                    type="number"
                    step="0.01"
                    min="0"
                    value={tempToleranceValue}
                    onChange={(e) => setTempToleranceValue(e.target.value)}
                    placeholder="Ex: 2500.00"
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('portfolioPerformance.dataManagement.currentValue') || 'Valor atual:'} {formatCurrency(toleranceValue, currency)}
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-md text-sm space-y-1">
                  <p><strong>{t('portfolioPerformance.dataManagement.howItWorks') || 'Como funciona:'}</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      {t('portfolioPerformance.dataManagement.differenceCorrect') || 'Diferença <'} {formatCurrency(parseFloat(tempCorrectThreshold || "0"), currency)}: 
                      <span className="text-green-600 font-medium"> ✓ {t('portfolioPerformance.dataManagement.correct') || 'Correto'}</span>
                    </li>
                    <li>
                      {t('portfolioPerformance.dataManagement.differenceTolerance') || 'Diferença <'} {formatCurrency(parseFloat(tempToleranceValue || "0"), currency)}: 
                      <span className="text-yellow-600 font-medium"> ⚠️ {t('portfolioPerformance.dataManagement.tolerance') || 'Tolerância'}</span>
                    </li>
                    <li>
                      {t('portfolioPerformance.dataManagement.differenceInconsistent') || 'Diferença ≥'} {formatCurrency(parseFloat(tempToleranceValue || "0"), currency)}: 
                      <span className="text-red-600 font-medium"> ✗ {t('portfolioPerformance.dataManagement.inconsistent') || 'Inconsistente'}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTempCorrectThreshold(correctThreshold.toString())
                    setTempToleranceValue(toleranceValue.toString())
                    setIsSettingsOpen(false)
                  }}
                >
                  {t('portfolioPerformance.dataManagement.cancel') || 'Cancelar'}
                </Button>
                <Button
                  onClick={async () => {
                    const newToleranceValue = parseFloat(tempToleranceValue)
                    const newCorrectThreshold = parseFloat(tempCorrectThreshold)
                    
                    // Validações
                    if (isNaN(newToleranceValue) || newToleranceValue < 0) {
                      toast({
                        title: t('portfolioPerformance.dataManagement.invalidValue') || "Valor Inválido",
                        description: t('portfolioPerformance.dataManagement.invalidToleranceValue') || "Por favor, insira um valor de tolerância válido maior ou igual a zero.",
                        variant: "destructive",
                      })
                      return
                    }
                    
                    if (isNaN(newCorrectThreshold) || newCorrectThreshold < 0) {
                      toast({
                        title: t('portfolioPerformance.dataManagement.invalidValue') || "Valor Inválido",
                        description: t('portfolioPerformance.dataManagement.invalidCorrectThreshold') || "Por favor, insira um limite de 'Correto' válido maior ou igual a zero.",
                        variant: "destructive",
                      })
                      return
                    }
                    
                    // Validação lógica: limite "correto" deve ser menor que "tolerância"
                    if (newCorrectThreshold >= newToleranceValue) {
                      toast({
                        title: t('portfolioPerformance.dataManagement.invalidConfiguration') || "Configuração Inválida",
                        description: t('portfolioPerformance.dataManagement.correctMustBeLessThanTolerance') || "O limite 'Correto' deve ser menor que o limite 'Tolerância'.",
                        variant: "destructive",
                      })
                      return
                    }

                    // Usar o hook de mutation para salvar
                    try {
                      await updateSettings.mutateAsync({
                        correctThreshold: newCorrectThreshold,
                        toleranceValue: newToleranceValue
                      })
                      
                      toast({
                        title: t('portfolioPerformance.dataManagement.settingsSaved') || "Configurações salvas",
                        description: `${t('portfolioPerformance.dataManagement.correct') || 'Correto'}: ≤ ${formatCurrency(newCorrectThreshold, currency)} | ${t('portfolioPerformance.dataManagement.tolerance') || 'Tolerância'}: ≤ ${formatCurrency(newToleranceValue, currency)}`,
                      })
                      
                      setIsSettingsOpen(false)
                    } catch (error) {
                      // O erro já é tratado no hook
                      console.error('Error saving settings:', error)
                    }
                  }}
                  disabled={updateSettings.isPending}
                >
                  {updateSettings.isPending 
                    ? t('portfolioPerformance.dataManagement.saving') || 'Salvando...' 
                    : t('portfolioPerformance.dataManagement.save') || 'Salvar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/market-data-audit')}
          >
            {t('portfolioPerformance.dataManagement.marketDataAudit')}
          </Button>
        </div>
      </div>

      {/* Resumo de Verificação */}
      <VerificationSummary
        consolidated={filteredConsolidated}
        getVerification={getVerification}
        t={t}
      />

      <Tabs value={tab} onValueChange={(v: string) => {
        setTab(v as 'consolidated' | 'detailed')
        // Resetar filtros ao trocar de aba
        setSelectedPeriods([])
        setSelectedInstitutions([])
        setSelectedClasses([])
        setSelectedIssuers([])
        setActiveFilters([])
        setVerifFilter('all')
        setSearchText('')
      }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="consolidated">{t('portfolioPerformance.dataManagement.tabs.consolidated')}</TabsTrigger>
          <TabsTrigger value="detailed">{t('portfolioPerformance.dataManagement.tabs.detailed')}</TabsTrigger>
        </TabsList>

        <TabsContent value="consolidated">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('portfolioPerformance.dataManagement.tabs.consolidated')}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('portfolioPerformance.dataManagement.tabs.consolidatedSubtitle')}
                </p>
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
                {selectedIds.size > 0 && (
                  <Button size="sm" variant="destructive" onClick={() => setDeleteMultipleConfirmOpen(true)} className="h-8">
                    <Trash2 className="h-3 w-3 mr-1" /> {t('portfolioPerformance.dataManagement.delete.deleteSelected')}
                  </Button>
                )}
                <FilterBuilder onAddFilter={handleAddFilter} />
                {tab === 'consolidated' && (
                  <Select
                    value={verifFilter}
                    onValueChange={(value) => setVerifFilter(value)}
                  >
                    <SelectTrigger className={`w-[180px] h-8 ${
                      verifFilter !== 'all' 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-card/50 border-primary/20'
                    }`}>
                      <SelectValue placeholder={t('portfolioPerformance.dataManagement.quickFilters') || 'Filtrar por verif.'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span>{t('portfolioPerformance.filters.all')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="match">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{t('portfolioPerformance.verification.match')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="tolerance">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span>{t('portfolioPerformance.verification.tolerance')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="mismatch">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>{t('portfolioPerformance.verification.mismatch')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="no-data">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-gray-400" />
                          <span>{t('portfolioPerformance.verification.noData')}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Settings2 className="h-3 w-3 mr-1" /> {t('portfolioPerformance.dataManagement.columns')} <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm mb-3">{t('portfolioPerformance.dataManagement.selectColumns')}</h4>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {[
                          { key: 'period', label: t('portfolioPerformance.dataManagement.table.period') },
                          { key: 'institution', label: t('portfolioPerformance.dataManagement.table.institution') },
                          { key: 'currency', label: t('portfolioPerformance.dataManagement.table.currency') },
                          { key: 'account_name', label: t('portfolioPerformance.dataManagement.table.accountName') },
                          { key: 'final_assets', label: t('portfolioPerformance.dataManagement.table.finalAssetsShort') },
                          { key: 'yield', label: t('portfolioPerformance.dataManagement.table.yieldShort') },
                          { key: 'verification', label: t('portfolioPerformance.dataManagement.table.verification') },
                          { key: 'actions', label: t('portfolioPerformance.dataManagement.table.actions') }
                        ].map(col => (
                          <div key={col.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`col-cons-${col.key}`}
                              checked={visibleColumnsConsolidated.has(col.key)}
                              onCheckedChange={(checked) => {
                                const newVisible = new Set(visibleColumnsConsolidated)
                                if (checked) {
                                  newVisible.add(col.key)
                                } else {
                                  if (col.key !== 'actions') {
                                    newVisible.delete(col.key)
                                  }
                                }
                                setVisibleColumnsConsolidated(newVisible)
                              }}
                              disabled={col.key === 'actions'}
                            />
                            <label
                              htmlFor={`col-cons-${col.key}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {col.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setVisibleColumnsConsolidated(new Set(['period', 'institution', 'currency', 'account_name', 'final_assets', 'yield', 'verification', 'actions']))}
                        >
                          {t('portfolioPerformance.dataManagement.selectAllColumns') || 'Selecionar Todas as Colunas'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={selectAllVisible}
                        >
                          <CheckSquare className="h-3 w-3 mr-1" /> {t('portfolioPerformance.selectAll') || 'Selecionar Todas as Linhas'}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setImportDialogType('consolidated')
                      setImportDialogOpen(true)
                    }}
                    title={t('portfolioPerformance.dataManagement.import.button') || 'Importar CSV'}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsExportDialogOpen(true)}
                    title={t('portfolioPerformance.dataManagement.export.button') || 'Exportar CSV'}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={() => openEdit('consolidated')} className="bg-yellow-500 hover:bg-yellow-600">
                  <Plus className="mr-2 h-4 w-4" /> {t('portfolioPerformance.newRecord')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActiveFilters filters={activeFilters} onRemoveFilter={handleRemoveFilter} />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={filteredConsolidated.length > 0 && filteredConsolidated.every(r => selectedIds.has(r.id))}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              selectAllVisible()
                            } else {
                              clearSelection()
                            }
                          }}
                        />
                      </TableHead>
                      {visibleColumnsConsolidated.has('period') && (
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('period')}
                        >
                          {t('portfolioPerformance.dataManagement.table.period')}
                          {sortConfig?.field === 'period' && (
                            sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-3 w-3 inline-block" /> : <ArrowDown className="ml-1 h-3 w-3 inline-block" />
                          )}
                        </TableHead>
                      )}
                      {visibleColumnsConsolidated.has('institution') && (
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('institution')}
                        >
                          {t('portfolioPerformance.dataManagement.table.institution')}
                          {sortConfig?.field === 'institution' && (
                            sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-3 w-3 inline-block" /> : <ArrowDown className="ml-1 h-3 w-3 inline-block" />
                          )}
                        </TableHead>
                      )}
                      {visibleColumnsConsolidated.has('currency') && <TableHead>{t('portfolioPerformance.dataManagement.table.currency')}</TableHead>}
                      {visibleColumnsConsolidated.has('account_name') && <TableHead>{t('portfolioPerformance.dataManagement.table.accountName')}</TableHead>}
                      {visibleColumnsConsolidated.has('final_assets') && (
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('final_assets')}
                        >
                          {t('portfolioPerformance.dataManagement.table.finalAssetsShort') || t('portfolioPerformance.dataManagement.table.finalAssets')}
                          {sortConfig?.field === 'final_assets' && (
                            sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-3 w-3 inline-block" /> : <ArrowDown className="ml-1 h-3 w-3 inline-block" />
                          )}
                        </TableHead>
                      )}
                      {visibleColumnsConsolidated.has('yield') && (
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('yield')}
                        >
                          {t('portfolioPerformance.dataManagement.table.yieldShort') || t('portfolioPerformance.dataManagement.table.yield')}
                          {sortConfig?.field === 'yield' && (
                            sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-3 w-3 inline-block" /> : <ArrowDown className="ml-1 h-3 w-3 inline-block" />
                          )}
                        </TableHead>
                      )}
                      {visibleColumnsConsolidated.has('verification') && <TableHead>{t('portfolioPerformance.dataManagement.table.verification')}</TableHead>}
                      {visibleColumnsConsolidated.has('actions') && <TableHead>{t('portfolioPerformance.dataManagement.table.actions')}</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={visibleColumnsConsolidated.size + 1}>{t('portfolioPerformance.dataManagement.loading')}</TableCell></TableRow>
                    ) : filteredConsolidated.length === 0 ? (
                      <TableRow><TableCell colSpan={visibleColumnsConsolidated.size + 1}>{t('portfolioPerformance.dataManagement.noData')}</TableCell></TableRow>
                    ) : filteredConsolidated.map(r => {
                      const verification = getVerification(r)
                      return (
                        <TableRow key={r.id}>
                          <TableCell>
                            <Checkbox checked={selectedIds.has(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                          </TableCell>
                          {visibleColumnsConsolidated.has('period') && <TableCell>{r.period}</TableCell>}
                          {visibleColumnsConsolidated.has('institution') && <TableCell>{r.institution}</TableCell>}
                          {visibleColumnsConsolidated.has('currency') && <TableCell>{r.currency === 'USD' ? 'Dólar' : r.currency === 'EUR' ? 'Euro' : 'Real'}</TableCell>}
                          {visibleColumnsConsolidated.has('account_name') && <TableCell>{r.account_name || '-'}</TableCell>}
                          {visibleColumnsConsolidated.has('final_assets') && <TableCell>{formatCurrency(r.final_assets || 0, (r.currency as CurrencyCode) || 'BRL')}</TableCell>}
                          {visibleColumnsConsolidated.has('yield') && <TableCell>{(((r.yield || 0) * 100).toFixed(2)).replace('.', ',')}%</TableCell>}
                          {visibleColumnsConsolidated.has('verification') && (
                            <TableCell className="text-center">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 px-1 flex items-center justify-center gap-1 mx-auto cursor-pointer hover:opacity-70 transition-opacity">
                                    {/* PRIMEIRA BOLINHA: Status de Integridade Numérica */}
                                    {verification.status === 'match' && (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                    {verification.status === 'tolerance' && (
                                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    )}
                                    {verification.status === 'mismatch' && (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    {verification.status === 'no-data' && (
                                      <Info className="h-4 w-4 text-blue-500" />
                                    )}
                                    
                                    {/* SEGUNDA BOLINHA: Status de Classificação */}
                                    {verification.hasUnclassified ? (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    ) : (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                    
                                    {/* TERCEIRA BOLINHA: Status de Rentabilidade */}
                                    {verification.hasMissingYield ? (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    ) : (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-2">
                                    <div>
                                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4" />
                                        {t('portfolioPerformance.verification.integrity') || 'Verificação de Integridade'}
                                      </h4>
                                      <div className="text-sm space-y-1">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">{t('portfolioPerformance.verification.finalAssets') || 'Patrimônio Final:'}</span>
                                          <span className="font-medium">{formatCurrency(verification.consolidatedValue, (r.currency as CurrencyCode) || 'BRL')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">{t('portfolioPerformance.verification.detailedSum') || 'Soma Detalhada:'}</span>
                                          <span className="font-medium">{formatCurrency(verification.detailedSum, (r.currency as CurrencyCode) || 'BRL')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">{t('portfolioPerformance.verification.difference') || 'Diferença:'}</span>
                                          <span className={`font-medium ${
                                            verification.status === 'mismatch' ? 'text-red-500' : 
                                            verification.status === 'tolerance' ? 'text-yellow-500' : 
                                            'text-green-500'
                                          }`}>
                                            {formatCurrency(verification.difference, (r.currency as CurrencyCode) || 'BRL')}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">{t('portfolioPerformance.verification.detailedRecords') || 'Registros Detalhados:'}</span>
                                          <span className="font-medium">{verification.detailedCount}</span>
                                        </div>
                                        {verification.status === 'mismatch' && (
                                          <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-xs text-red-700 dark:text-red-400">
                                            ⚠️ {t('portfolioPerformance.verification.mismatchWarning') || 'Diferença significativa detectada. Verifique os ativos.'}
                                          </div>
                                        )}
                                        {verification.status === 'no-data' && (
                                          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs text-blue-700 dark:text-blue-400">
                                            ℹ️ {t('portfolioPerformance.verification.noDataWarning') || 'Nenhum dado detalhado encontrado para esta combinação.'}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <Separator className="my-2" />
                                    <div>
                                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        {t('portfolioPerformance.verification.classification') || 'Verificação de Classificação'}
                                      </h4>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('portfolioPerformance.verification.classified') || 'Classificados:'}</span>
                                        <span className={`font-medium ${
                                          !verification.hasUnclassified ? 'text-green-500' : 'text-muted-foreground'
                                        }`}>
                                          {verification.detailedCount - verification.unclassifiedCount}
                                          {!verification.hasUnclassified && (
                                            <CheckCircle2 className="h-3 w-3 ml-1 inline" />
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('portfolioPerformance.verification.unclassifiedLabel') || 'Não Classificados:'}</span>
                                        <span className={`font-medium ${
                                          verification.hasUnclassified ? 'text-red-500' : 'text-green-500'
                                        }`}>
                                          {verification.unclassifiedCount}
                                          {verification.hasUnclassified && (
                                            <XCircle className="h-3 w-3 ml-1 inline" />
                                          )}
                                        </span>
                                      </div>
                                      {verification.hasUnclassified && (
                                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-xs text-red-700 dark:text-red-400">
                                          🏷️ {t('portfolioPerformance.verification.unclassifiedWarning', { count: verification.unclassifiedCount }) || `${verification.unclassifiedCount} ativo(s) com classe inválida ou não classificada detectado(s).`}
                                          <div className="mt-1 text-[10px] opacity-80">
                                            {t('portfolioPerformance.verification.unclassifiedHint') || 'Certifique-se de que a classe está na lista de opções válidas do dropdown.'}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <Separator className="my-2" />
                                    <div>
                                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        {t('portfolioPerformance.verification.profitability') || 'Verificação de Rentabilidade'}
                                      </h4>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('portfolioPerformance.verification.withYield') || 'Com Rentabilidade:'}</span>
                                        <span className={`font-medium ${
                                          !verification.hasMissingYield ? 'text-green-500' : 'text-muted-foreground'
                                        }`}>
                                          {verification.detailedCount - verification.missingYieldCount}
                                          {!verification.hasMissingYield && (
                                            <CheckCircle2 className="h-3 w-3 ml-1 inline" />
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('portfolioPerformance.verification.withoutYield') || 'Sem Rentabilidade:'}</span>
                                        <span className={`font-medium ${
                                          verification.hasMissingYield ? 'text-red-500' : 'text-green-500'
                                        }`}>
                                          {verification.missingYieldCount}
                                          {verification.hasMissingYield && (
                                            <XCircle className="h-3 w-3 ml-1 inline" />
                                          )}
                                        </span>
                                      </div>
                                      {verification.hasMissingYield && (
                                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-xs text-red-700 dark:text-red-400">
                                          💰 {t('portfolioPerformance.verification.missingYieldWarning', { count: verification.missingYieldCount }) || `${verification.missingYieldCount} ativo(s) sem campo "Rendimento" preenchido.`}
                                          <div className="mt-1 text-[10px] opacity-80">
                                            {t('portfolioPerformance.verification.missingYieldHint') || 'Preencha o campo "Rendimento" para todos os ativos.'}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                          )}
                          {visibleColumnsConsolidated.has('actions') && (
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 hover:bg-primary/10 text-primary"
                                  onClick={() => {
                                    setTab('detailed')
                                    setSelectedPeriods([r.period])
                                    setSelectedInstitutions([r.institution])
                                    if (r.account_name) {
                                      // Aplicar filtro de account_name se disponível
                                      setActiveFilters([{
                                        id: crypto.randomUUID(),
                                        field: 'account_name',
                                        operator: 'equals',
                                        value: r.account_name
                                      }])
                                    }
                                    setTimeout(() => {
                                      document.querySelector('[value="detailed"]')?.scrollIntoView({ 
                                        behavior: 'smooth' 
                                      })
                                    }, 100)
                                  }}
                                  title={t('portfolioPerformance.dataManagement.viewDetailed', { count: verification.detailedCount }) || `Ver ${verification.detailedCount || 0} ativos detalhados`}
                                >
                                  <ArrowRight className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                  <span className="ml-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">{verification.detailedCount || 0}</span>
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-primary hover:text-primary"
                                  onClick={() => {
                                    // Criar novo registro baseado neste
                                    openEdit('consolidated', {
                                      ...r,
                                      id: undefined,
                                      period: '',
                                      final_assets: r.final_assets,
                                      initial_assets: r.final_assets,
                                      movement: 0,
                                      taxes: 0,
                                      financial_gain: 0,
                                      yield: 0
                                    } as ConsolidatedRow)
                                  }}
                                  title={t('portfolioPerformance.dataManagement.createFromRecord') || 'Criar novo registro com base neste'}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => openEdit('consolidated', r)}
                                  title={t('portfolioPerformance.dataManagement.edit') || 'Editar'}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  onClick={() => confirmDelete('consolidated', r.id)}
                                  title={t('portfolioPerformance.dataManagement.delete') || 'Excluir'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    })}
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
                {selectedIds.size > 0 && (
                  <Button size="sm" variant="destructive" onClick={() => setDeleteMultipleConfirmOpen(true)} className="h-8">
                    <Trash2 className="h-3 w-3 mr-1" /> {t('portfolioPerformance.dataManagement.delete.deleteSelected')}
                  </Button>
                )}
                <FilterBuilder onAddFilter={handleAddFilter} />
                {tab === 'detailed' && (
                  <Select
                    value={verifFilter}
                    onValueChange={(value) => setVerifFilter(value)}
                  >
                    <SelectTrigger className={`w-[180px] h-8 ${
                      verifFilter !== 'all' 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-card/50 border-primary/20'
                    }`}>
                      <SelectValue placeholder={t('portfolioPerformance.dataManagement.quickFilters') || 'Filtrar por verif.'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span>{t('portfolioPerformance.filters.all')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="match">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{t('portfolioPerformance.verification.match')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="tolerance">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span>{t('portfolioPerformance.verification.tolerance')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="mismatch">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>{t('portfolioPerformance.verification.mismatch')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="no-data">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-gray-400" />
                          <span>{t('portfolioPerformance.verification.noData')}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Settings2 className="h-3 w-3 mr-1" /> {t('portfolioPerformance.dataManagement.columns')} <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm mb-3">{t('portfolioPerformance.dataManagement.selectColumns')}</h4>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {[
                          { key: 'period', label: t('portfolioPerformance.dataManagement.table.period') },
                          { key: 'institution', label: t('portfolioPerformance.dataManagement.table.institution') },
                          { key: 'currency', label: t('portfolioPerformance.dataManagement.table.currency') },
                          { key: 'account_name', label: t('portfolioPerformance.dataManagement.table.accountName') },
                          { key: 'asset', label: t('portfolioPerformance.dataManagement.table.asset') },
                          { key: 'issuer', label: t('portfolioPerformance.dataManagement.table.issuer') },
                          { key: 'asset_class', label: t('portfolioPerformance.dataManagement.table.assetClass') },
                          { key: 'position', label: t('portfolioPerformance.dataManagement.table.position') },
                          { key: 'rate', label: t('portfolioPerformance.dataManagement.table.rate') },
                          { key: 'maturity', label: t('portfolioPerformance.dataManagement.table.maturity') },
                          { key: 'yield', label: t('portfolioPerformance.dataManagement.table.yield') },
                          { key: 'verification', label: t('portfolioPerformance.dataManagement.table.verification') },
                          { key: 'actions', label: t('portfolioPerformance.dataManagement.table.actions') }
                        ].map(col => (
                          <div key={col.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`col-det-${col.key}`}
                              checked={visibleColumnsDetailed.has(col.key)}
                              onCheckedChange={(checked) => {
                                const newVisible = new Set(visibleColumnsDetailed)
                                if (checked) {
                                  newVisible.add(col.key)
                                } else {
                                  if (col.key !== 'actions') {
                                    newVisible.delete(col.key)
                                  }
                                }
                                setVisibleColumnsDetailed(newVisible)
                              }}
                              disabled={col.key === 'actions'}
                            />
                            <label
                              htmlFor={`col-det-${col.key}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {col.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setVisibleColumnsDetailed(new Set(['period', 'institution', 'currency', 'account_name', 'asset', 'issuer', 'asset_class', 'position', 'rate', 'maturity', 'yield', 'verification', 'actions']))}
                        >
                          {t('portfolioPerformance.dataManagement.selectAllColumns') || 'Selecionar Todas as Colunas'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={selectAllVisible}
                        >
                          <CheckSquare className="h-3 w-3 mr-1" /> {t('portfolioPerformance.selectAll') || 'Selecionar Todas as Linhas'}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setImportDialogType('detailed')
                      setImportDialogOpen(true)
                    }}
                    title={t('portfolioPerformance.dataManagement.import.button') || 'Importar CSV'}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsExportDialogOpen(true)}
                    title={t('portfolioPerformance.dataManagement.export.button') || 'Exportar CSV'}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={() => openEdit('detailed')} className="bg-yellow-500 hover:bg-yellow-600">
                  <Plus className="mr-2 h-4 w-4" /> {t('portfolioPerformance.newRecord')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActiveFilters filters={activeFilters} onRemoveFilter={handleRemoveFilter} />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={filteredDetailed.length > 0 && filteredDetailed.every(r => selectedIds.has(r.id))}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              selectAllVisible()
                            } else {
                              clearSelection()
                            }
                          }}
                        />
                      </TableHead>
                      {visibleColumnsDetailed.has('period') && <TableHead>{t('portfolioPerformance.dataManagement.table.period')}</TableHead>}
                      {visibleColumnsDetailed.has('institution') && <TableHead>{t('portfolioPerformance.dataManagement.table.institution')}</TableHead>}
                      {visibleColumnsDetailed.has('currency') && <TableHead>{t('portfolioPerformance.dataManagement.table.currency')}</TableHead>}
                      {visibleColumnsDetailed.has('account_name') && <TableHead>{t('portfolioPerformance.dataManagement.table.accountName')}</TableHead>}
                      {visibleColumnsDetailed.has('asset') && <TableHead>{t('portfolioPerformance.dataManagement.table.asset')}</TableHead>}
                      {visibleColumnsDetailed.has('issuer') && <TableHead>{t('portfolioPerformance.dataManagement.table.issuer')}</TableHead>}
                      {visibleColumnsDetailed.has('asset_class') && <TableHead>{t('portfolioPerformance.dataManagement.table.assetClass')}</TableHead>}
                      {visibleColumnsDetailed.has('position') && <TableHead>{t('portfolioPerformance.dataManagement.table.position')}</TableHead>}
                      {visibleColumnsDetailed.has('rate') && <TableHead>{t('portfolioPerformance.dataManagement.table.rate')}</TableHead>}
                      {visibleColumnsDetailed.has('maturity') && <TableHead>{t('portfolioPerformance.dataManagement.table.maturity')}</TableHead>}
                      {visibleColumnsDetailed.has('yield') && <TableHead>{t('portfolioPerformance.dataManagement.table.yield')}</TableHead>}
                      {visibleColumnsDetailed.has('verification') && <TableHead className="text-center">{t('portfolioPerformance.dataManagement.table.verification')}</TableHead>}
                      {visibleColumnsDetailed.has('actions') && <TableHead>{t('portfolioPerformance.dataManagement.table.actions')}</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={visibleColumnsDetailed.size + 1}>{t('portfolioPerformance.dataManagement.loading')}</TableCell></TableRow>
                    ) : filteredDetailed.length === 0 ? (
                      <TableRow><TableCell colSpan={visibleColumnsDetailed.size + 1}>{t('portfolioPerformance.dataManagement.noData')}</TableCell></TableRow>
                    ) : filteredDetailed.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Checkbox checked={selectedIds.has(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                        </TableCell>
                        {visibleColumnsDetailed.has('period') && <TableCell>{r.period}</TableCell>}
                        {visibleColumnsDetailed.has('institution') && <TableCell>{r.institution}</TableCell>}
                        {visibleColumnsDetailed.has('currency') && <TableCell>{r.currency || 'BRL'}</TableCell>}
                        {visibleColumnsDetailed.has('account_name') && <TableCell>{r.account_name || '-'}</TableCell>}
                        {visibleColumnsDetailed.has('asset') && <TableCell>{r.asset}</TableCell>}
                        {visibleColumnsDetailed.has('issuer') && <TableCell>{r.issuer}</TableCell>}
                        {visibleColumnsDetailed.has('asset_class') && <TableCell>{translateAssetClassForDisplay(r.asset_class, t)}</TableCell>}
                        {visibleColumnsDetailed.has('position') && <TableCell>{formatCurrency(r.position || 0, (r.currency as CurrencyCode) || 'BRL')}</TableCell>}
                        {visibleColumnsDetailed.has('rate') && <TableCell>{r.rate || '-'}</TableCell>}
                        {visibleColumnsDetailed.has('maturity') && <TableCell>{formatMaturityDate(r.maturity_date)}</TableCell>}
                        {visibleColumnsDetailed.has('yield') && <TableCell>{(((r.yield || 0) * 100).toFixed(2))}%</TableCell>}
                        {visibleColumnsDetailed.has('verification') && (
                          <TableCell className="text-center">
                            {(() => {
                              const hasInvalidClass = !isValidAssetClass(r.asset_class)
                              const hasMissingYield = !hasValidYield(r.yield)
                              
                              return (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 px-1 flex items-center justify-center gap-1 mx-auto cursor-pointer hover:opacity-70 transition-opacity">
                                      {/* Verificação da Classe */}
                                      {hasInvalidClass ? (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      ) : (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      )}
                                      
                                      {/* Verificação da Rentabilidade */}
                                      {hasMissingYield ? (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      ) : (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                      <div>
                                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                          <Tag className="h-4 w-4" />
                                          {t('portfolioPerformance.verification.classification') || 'Verificação de Classificação'}
                                        </h4>
                                        <div className="text-sm space-y-1">
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('portfolioPerformance.dataManagement.table.assetClass') || 'Classe do Ativo:'}</span>
                                            <span className="font-medium">{translateAssetClassForDisplay(r.asset_class, t)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('portfolioPerformance.verification.status') || 'Status:'}</span>
                                            <span className={`font-medium ${
                                              hasInvalidClass ? 'text-red-500' : 'text-green-500'
                                            }`}>
                                              {hasInvalidClass 
                                                ? t('portfolioPerformance.verification.invalidClass') || 'Inválida'
                                                : t('portfolioPerformance.verification.validClass') || 'Válida'}
                                              {hasInvalidClass ? (
                                                <XCircle className="h-3 w-3 ml-1 inline" />
                                              ) : (
                                                <CheckCircle2 className="h-3 w-3 ml-1 inline" />
                                              )}
                                            </span>
                                          </div>
                                          {hasInvalidClass && (
                                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-xs text-red-700 dark:text-red-400">
                                              🏷️ {t('portfolioPerformance.verification.invalidClassWarning') || 'Classe inválida ou não classificada.'}
                                              <div className="mt-1 text-[10px] opacity-80">
                                                {t('portfolioPerformance.verification.unclassifiedHint') || 'Certifique-se de que a classe está na lista de opções válidas do dropdown.'}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <Separator className="my-2" />
                                      <div>
                                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                          <DollarSign className="h-4 w-4" />
                                          {t('portfolioPerformance.verification.profitability') || 'Verificação de Rentabilidade'}
                                        </h4>
                                        <div className="text-sm space-y-1">
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('portfolioPerformance.dataManagement.table.yield') || 'Rendimento:'}</span>
                                            <span className="font-medium">
                                              {hasValidYield(r.yield) 
                                                ? `${(((r.yield || 0) * 100).toFixed(2))}%`
                                                : '-'}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('portfolioPerformance.verification.status') || 'Status:'}</span>
                                            <span className={`font-medium ${
                                              hasMissingYield ? 'text-red-500' : 'text-green-500'
                                            }`}>
                                              {hasMissingYield 
                                                ? t('portfolioPerformance.verification.withoutYield') || 'Sem Rentabilidade'
                                                : t('portfolioPerformance.verification.withYield') || 'Com Rentabilidade'}
                                              {hasMissingYield ? (
                                                <XCircle className="h-3 w-3 ml-1 inline" />
                                              ) : (
                                                <CheckCircle2 className="h-3 w-3 ml-1 inline" />
                                              )}
                                            </span>
                                          </div>
                                          {hasMissingYield && (
                                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-xs text-red-700 dark:text-red-400">
                                              💰 {t('portfolioPerformance.verification.missingYieldWarningSingle') || 'Campo "Rendimento" não preenchido.'}
                                              <div className="mt-1 text-[10px] opacity-80">
                                                {t('portfolioPerformance.verification.missingYieldHint') || 'Preencha o campo "Rendimento" para todos os ativos.'}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )
                            })()}
                          </TableCell>
                        )}
                        {visibleColumnsDetailed.has('actions') && (
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-primary hover:text-primary"
                                onClick={() => {
                                  openEdit('detailed', {
                                    ...r,
                                    id: undefined
                                  } as PerformanceRow)
                                }}
                                title={t('portfolioPerformance.dataManagement.createFromRecord') || 'Criar novo registro com base neste'}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => openEdit('detailed', r)}
                                title={t('portfolioPerformance.dataManagement.edit') || 'Editar'}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => confirmDelete('detailed', r.id)}
                                title={t('portfolioPerformance.dataManagement.delete') || 'Excluir'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
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
                  <AssetClassSelect
                    value={editItem.asset_class || ''}
                    onValueChange={(value) => setEditItem(p => ({ ...p, asset_class: value }))}
                    placeholder={t('portfolioPerformance.dataManagement.editDialog.assetClassLabel') || 'Selecione a classe de ativo'}
                  />
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

      {/* Import Dialog */}
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        type={importDialogType}
        profileId={profileId || ''}
        onImportSuccess={fetchData}
        onOpenPdfDialog={() => setIsPdfDialogOpen(true)}
      />

      <BrokerPDFImportDialog
        open={isPdfDialogOpen}
        onOpenChange={setIsPdfDialogOpen}
        clients={pdfClients}
      />

      {/* Export Dialog */}
      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        type={tab}
        profileId={profileId || ''}
        filteredData={tab === 'consolidated' ? filteredConsolidated : filteredDetailed}
        allData={tab === 'consolidated' ? consolidated : detailed}
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


