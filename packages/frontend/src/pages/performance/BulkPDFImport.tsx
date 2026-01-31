import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/components/auth/AuthProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Upload, ArrowUpDown, Search, ArrowRight, Users, CheckCircle2, XCircle, FileText, Calendar, Database, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { useOutdatedClients } from "@/hooks/useOutdatedClients"
import { PDFImportForm } from "@/components/performance/PDFImportForm"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import type { UserProfileInvestment } from "@/types/broker-dashboard"

type SortField = 'name' | 'lastPeriod' | 'expectedPeriod' | 'monthsDelayed' | 'totalRecords'
type SortDirection = 'asc' | 'desc'

export default function BulkPDFImport() {
  const { t } = useTranslation()
  const { isBroker, user } = useAuth()
  const { toast } = useToast()
  const { outdatedClients, loading, error, refetch } = useOutdatedClients(isBroker ? user?.id : undefined)
  
  // Get expected period from first client (all have the same)
  const expectedPeriod = outdatedClients.length > 0 ? outdatedClients[0].expectedPeriod : ''
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<'all' | 'outdated' | 'updated'>('all')
  const [sortField, setSortField] = useState<SortField>('monthsDelayed')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null)

  // Filter clients
  const filteredClients = outdatedClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterStatus === 'updated') {
      return matchesSearch && client.monthsDelayed !== null && client.monthsDelayed === 0
    }
    if (filterStatus === 'outdated') {
      return matchesSearch && (client.monthsDelayed === null || client.monthsDelayed > 0)
    }
    return matchesSearch
  })

  // Helper function to parse period for sorting
  const parsePeriodForSort = (period: string | null): number => {
    if (!period) return 0
    const [month, year] = period.split('/').map(Number)
    if (!month || !year) return 0
    return year * 100 + month // YYYYMM format for easy comparison
  }

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    let comparison = 0
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
        break
      case 'lastPeriod':
        // Sort by date value, null comes last
        if (!a.lastPeriod && !b.lastPeriod) comparison = 0
        else if (!a.lastPeriod) comparison = 1
        else if (!b.lastPeriod) comparison = -1
        else comparison = parsePeriodForSort(a.lastPeriod) - parsePeriodForSort(b.lastPeriod)
        break
      case 'expectedPeriod':
        comparison = parsePeriodForSort(a.expectedPeriod) - parsePeriodForSort(b.expectedPeriod)
        break
      case 'monthsDelayed':
        // Handle null values: null comes first (never updated)
        if (a.monthsDelayed === null && b.monthsDelayed === null) comparison = 0
        else if (a.monthsDelayed === null) comparison = -1
        else if (b.monthsDelayed === null) comparison = 1
        else comparison = a.monthsDelayed - b.monthsDelayed
        break
      case 'totalRecords':
        comparison = a.totalRecords - b.totalRecords
        break
    }
    
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleManageClick = (clientId: string) => {
    if (expandedClientId === clientId) {
      setExpandedClientId(null)
      setSelectedClientId(null)
    } else {
      setExpandedClientId(clientId)
      setSelectedClientId(clientId)
    }
  }

  const handleImportSuccess = () => {
    refetch()
    setExpandedClientId(null)
    setSelectedClientId(null)
  }

  const getStatusBadge = (monthsDelayed: number | null) => {
    // Never updated (null) - Red
    if (monthsDelayed === null) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 bg-red-600 hover:bg-red-700">
          <AlertCircle className="h-3 w-3" />
          {t('bulkPDFImport.neverUpdated') || 'Nunca Atualizado'}
        </Badge>
      )
    }
    
    // Updated (monthsDelayed === 0) - Green
    if (monthsDelayed === 0) {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
          {t('bulkPDFImport.status.updated') || 'Atualizado'}
        </Badge>
      )
    }
    
    // Less than 3 months delayed - Yellow/Warning
    if (monthsDelayed > 0 && monthsDelayed < 3) {
      const monthsText = monthsDelayed === 1 
        ? t('bulkPDFImport.monthsDelayed.singular', { count: monthsDelayed }) || `${monthsDelayed} mês atrasado`
        : t('bulkPDFImport.monthsDelayed.plural', { count: monthsDelayed }) || `${monthsDelayed} meses atrasados`
      
      return (
        <Badge className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white">
          <AlertCircle className="h-3 w-3" />
          {monthsText}
        </Badge>
      )
    }
    
    // 3 or more months delayed - Red
    const monthsText = monthsDelayed === 1 
      ? t('bulkPDFImport.monthsDelayed.singular', { count: monthsDelayed }) || `${monthsDelayed} mês atrasado`
      : t('bulkPDFImport.monthsDelayed.plural', { count: monthsDelayed }) || `${monthsDelayed} meses atrasados`
    
    return (
      <Badge variant="destructive" className="flex items-center gap-1 bg-red-600 hover:bg-red-700">
        <AlertCircle className="h-3 w-3" />
        {monthsText}
      </Badge>
    )
  }

  // Helper function to get border color based on delay
  const getBorderColor = (monthsDelayed: number | null): string => {
    if (monthsDelayed === null) {
      return "border-l-red-500 bg-red-50/30 dark:bg-red-950/20"
    }
    if (monthsDelayed === 0) {
      return "border-l-green-500 bg-green-50/20 dark:bg-green-950/10"
    }
    if (monthsDelayed > 0 && monthsDelayed < 3) {
      return "border-l-yellow-500 bg-yellow-50/30 dark:bg-yellow-950/20"
    }
    return "border-l-red-500 bg-red-50/30 dark:bg-red-950/20"
  }

  const updatedCount = outdatedClients.filter(c => c.monthsDelayed !== null && c.monthsDelayed === 0).length
  const outdatedCount = outdatedClients.filter(c => c.monthsDelayed === null || c.monthsDelayed > 0).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('bulkPDFImport.title') || 'Gestão de Dados dos Clientes'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {t('bulkPDFImport.description') || 'Acompanhe o status de atualização dos dados e gerencie as competências de cada cliente'}
              </p>
            </div>
            {expectedPeriod && (
              <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                        {t('bulkPDFImport.expectedPeriod') || 'Competência Esperada'}
                      </p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">{expectedPeriod}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t('bulkPDFImport.metrics.totalClients') || 'Total de Clientes'}
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">{outdatedClients.length}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">clientes</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                {t('bulkPDFImport.metrics.updated') || 'Atualizados'}
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-green-700 dark:text-green-300">{updatedCount}</div>
              <div className="text-sm text-green-600 dark:text-green-400">
                {updatedCount > 0 ? `${((updatedCount / outdatedClients.length) * 100).toFixed(0)}%` : '0%'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                {t('bulkPDFImport.metrics.outdated') || 'Desatualizados'}
              </CardTitle>
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-red-700 dark:text-red-300">{outdatedCount}</div>
              <div className="text-sm text-red-600 dark:text-red-400">
                {outdatedCount > 0 ? `${((outdatedCount / outdatedClients.length) * 100).toFixed(0)}%` : '0%'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
              >
                <Users className="h-4 w-4 mr-2" />
                {t('bulkPDFImport.filters.all') || `Todos ${outdatedClients.length}`}
              </Button>
              <Button
                variant={filterStatus === 'updated' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('updated')}
                className={filterStatus === 'updated' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {t('bulkPDFImport.filters.updated') || `Atualizados ${updatedCount}`}
              </Button>
              <Button
                variant={filterStatus === 'outdated' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('outdated')}
                className={filterStatus === 'outdated' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {t('bulkPDFImport.filters.outdated') || `Desatualizados ${outdatedCount}`}
              </Button>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('bulkPDFImport.searchPlaceholder') || 'Buscar cliente na lista...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 focus:border-blue-500"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Clients Table */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex justify-center">
              <Spinner className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-red-500">{error}</div>
          </CardContent>
        </Card>
      ) : sortedClients.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              {t('bulkPDFImport.noClients') || 'Nenhum cliente encontrado'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-950/30 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {t('bulkPDFImport.table.title') || 'Lista de Clientes'}
            </CardTitle>
            <CardDescription>
              {t('bulkPDFImport.table.description') || 'Gerencie os extratos PDF de cada cliente'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 ${
                        sortField === 'name' ? 'bg-blue-100 dark:bg-blue-900/50' : ''
                      }`}
                      onClick={() => handleSort('name')}
                    >
                      <Users className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                      {t('bulkPDFImport.table.client') || 'Cliente'}
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <ArrowDown className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground opacity-50" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 ${
                        sortField === 'lastPeriod' ? 'bg-purple-100 dark:bg-purple-900/50' : ''
                      }`}
                      onClick={() => handleSort('lastPeriod')}
                    >
                      <Calendar className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                      {t('bulkPDFImport.table.lastPeriod') || 'Última Competência'}
                      {sortField === 'lastPeriod' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="ml-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <ArrowDown className="ml-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground opacity-50" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 ${
                        sortField === 'totalRecords' ? 'bg-indigo-100 dark:bg-indigo-900/50' : ''
                      }`}
                      onClick={() => handleSort('totalRecords')}
                    >
                      <Database className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      {t('bulkPDFImport.table.total') || 'Total'}
                      {sortField === 'totalRecords' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="ml-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <ArrowDown className="ml-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground opacity-50" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      {t('bulkPDFImport.table.actions') || 'Ações'}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedClients.map((client) => (
                  <>
                    <TableRow 
                      key={client.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-4 ${getBorderColor(client.monthsDelayed)}`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span>{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          {client.lastPeriod ? (
                            <>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <span className="font-medium">{client.lastPeriod}</span>
                              </div>
                              {getStatusBadge(client.monthsDelayed)}
                            </>
                          ) : (
                            getStatusBadge(client.monthsDelayed)
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-semibold">{client.totalRecords}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={expandedClientId === client.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleManageClick(client.id)}
                          className={expandedClientId === client.id 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "hover:bg-blue-50 dark:hover:bg-blue-900/30"}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {expandedClientId === client.id 
                            ? (t('bulkPDFImport.hideForm') || 'Ocultar')
                            : (t('bulkPDFImport.manage') || 'Gerenciar')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedClientId === client.id && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-t-2 border-blue-200 dark:border-blue-800">
                          <div className="py-6 px-4">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                                {t('bulkPDFImport.uploadForClient', { name: client.name }) || `Adicionar extrato para ${client.name}`}
                              </h3>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800 shadow-md">
                              <PDFImportForm
                                clients={[{ id: client.id, profile_name: client.name, email: client.email, broker_id: client.brokerId } as UserProfileInvestment]}
                                selectedClientId={client.id}
                                defaultPeriod={client.expectedPeriod}
                                onSuccess={handleImportSuccess}
                                showCancelButton={false}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}

