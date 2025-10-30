import { useEffect, useMemo, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Edit, Trash2, Save, X, CheckSquare } from "lucide-react"

interface ConsolidatedRow {
  id: string
  profile_id: string
  institution: string | null
  period: string | null
  report_date: string | null
  initial_assets: number | null
  movement: number | null
  taxes: number | null
  financial_gain: number | null
  final_assets: number | null
  yield: number | null
}

interface PerformanceRow {
  id: string
  profile_id: string
  institution: string | null
  period: string | null
  report_date: string | null
  asset: string | null
  issuer: string | null
  asset_class: string | null
  position: number | null
  rate: string | null
  maturity_date: string | null
  yield: number | null
}

export default function PortfolioDataManagement() {
  const params = useParams<{ client?: string }>()
  const navigate = useNavigate()
  const [profileId, setProfileId] = useState<string | null>(null)
  const [clientName, setClientName] = useState<string>(params.client ? decodeURIComponent(params.client) : "")

  const [tab, setTab] = useState<'consolidated' | 'detailed'>('consolidated')
  const [isLoading, setIsLoading] = useState(false)
  const [consolidated, setConsolidated] = useState<ConsolidatedRow[]>([])
  const [detailed, setDetailed] = useState<PerformanceRow[]>([])

  const [editOpen, setEditOpen] = useState(false)
  const [editingType, setEditingType] = useState<'consolidated' | 'detailed'>('consolidated')
  const [editItem, setEditItem] = useState<Partial<ConsolidatedRow & PerformanceRow>>({})

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Resolve profile_id by client name (fallback allows direct use if route receives the id)
  useEffect(() => {
    const resolveProfile = async () => {
      if (!clientName) return
      // Try match exactly by name first
      const { data: profilesByName } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('name', clientName)
        .limit(1)
      if (profilesByName && profilesByName.length > 0) {
        setProfileId(profilesByName[0].id)
        return
      }
      // If not found, try assume the param is the id itself
      if (/^[0-9a-fA-F-]{36}$/.test(clientName)) setProfileId(clientName)
    }
    resolveProfile()
  }, [clientName])

  const fetchData = useCallback(async () => {
    if (!profileId) return
    setIsLoading(true)
    try {
      const [{ data: cons, error: e1 }, { data: det, error: e2 }] = await Promise.all([
        supabase.from('consolidated_performance').select('*').eq('profile_id', profileId).order('period', { ascending: false }),
        supabase.from('performance_data').select('*').eq('profile_id', profileId).order('period', { ascending: false })
      ])
      if (e1) throw e1
      if (e2) throw e2
      setConsolidated(cons || [])
      setDetailed(det || [])
    } finally {
      setIsLoading(false)
    }
  }, [profileId])

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

  const fmt = (v?: number | null) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(Number(v || 0))

  const openEdit = (type: 'consolidated' | 'detailed', item?: ConsolidatedRow | PerformanceRow) => {
    setEditingType(type)
    setEditItem(item ? { ...item } : { profile_id: profileId || '' })
    setEditOpen(true)
  }

  const saveEdit = async () => {
    if (!editingType || !editItem) return
    const table = editingType === 'consolidated' ? 'consolidated_performance' : 'performance_data'
    const payload: Partial<ConsolidatedRow & PerformanceRow> = { ...editItem, profile_id: profileId || '' }
    if (payload.id) {
      await supabase.from(table).update(payload).eq('id', payload.id as string)
    } else {
      await supabase.from(table).insert([payload])
    }
    setEditOpen(false)
    setEditItem({})
    fetchData()
  }

  const deleteRow = async (type: 'consolidated' | 'detailed', id: string) => {
    const table = type === 'consolidated' ? 'consolidated_performance' : 'performance_data'
    await supabase.from(table).delete().eq('id', id)
    fetchData()
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
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Dados de Portfólio</h1>
            <p className="text-sm text-gray-500">Cliente: {clientName || '—'}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Competências</Label>
              <Select value="" onValueChange={(v) => setSelectedPeriods(v ? [v] : [])}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedPeriods.length ? selectedPeriods[0] : 'Todas competências'} />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Instituições</Label>
              <Select value="" onValueChange={(v) => setSelectedInstitutions(v ? [v] : [])}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedInstitutions.length ? selectedInstitutions[0] : 'Todas instituições'} />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Classes de Ativo</Label>
              <Select value="" onValueChange={(v) => setSelectedClasses(v ? [v] : [])}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedClasses.length ? selectedClasses[0] : 'Todas classes'} />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Emissores</Label>
              <Select value="" onValueChange={(v) => setSelectedIssuers(v ? [v] : [])}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedIssuers.length ? selectedIssuers[0] : 'Todos emissores'} />
                </SelectTrigger>
                <SelectContent>
                  {issuers.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v: string) => setTab(v as 'consolidated' | 'detailed')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="consolidated">Dados Consolidados</TabsTrigger>
          <TabsTrigger value="detailed">Dados Detalhados</TabsTrigger>
        </TabsList>

        <TabsContent value="consolidated">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dados Consolidados</CardTitle>
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    {selectedIds.size} selecionado(s)
                    <Button size="sm" variant="outline" onClick={clearSelection} className="h-7">
                      <X className="h-3 w-3 mr-1" /> Limpar
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={selectAllVisible} className="h-8">
                  <CheckSquare className="h-3 w-3 mr-1" /> Selecionar Todos
                </Button>
                <Button onClick={() => openEdit('consolidated')}><Plus className="mr-2 h-4 w-4" /> Novo Registro</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Competência</TableHead>
                      <TableHead>Instituição</TableHead>
                      <TableHead>Patrimônio Inicial</TableHead>
                      <TableHead>Movimentação</TableHead>
                      <TableHead>Impostos</TableHead>
                      <TableHead>Ganho Financeiro</TableHead>
                      <TableHead>Patrimônio Final</TableHead>
                      <TableHead>Rendimento %</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={10}>Carregando...</TableCell></TableRow>
                    ) : filteredConsolidated.length === 0 ? (
                      <TableRow><TableCell colSpan={10}>Nenhum dado</TableCell></TableRow>
                    ) : filteredConsolidated.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Checkbox checked={selectedIds.has(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                        </TableCell>
                        <TableCell>{r.period}</TableCell>
                        <TableCell>{r.institution}</TableCell>
                        <TableCell>{fmt(r.initial_assets)}</TableCell>
                        <TableCell>{fmt(r.movement)}</TableCell>
                        <TableCell>{fmt(r.taxes)}</TableCell>
                        <TableCell>{fmt(r.financial_gain)}</TableCell>
                        <TableCell>{fmt(r.final_assets)}</TableCell>
                        <TableCell>{(((r.yield || 0) * 100).toFixed(2))}%</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit('consolidated', r)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => deleteRow('consolidated', r.id)}><Trash2 className="h-4 w-4" /></Button>
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
                <CardTitle>Dados Detalhados</CardTitle>
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    {selectedIds.size} selecionado(s)
                    <Button size="sm" variant="outline" onClick={clearSelection} className="h-7">
                      <X className="h-3 w-3 mr-1" /> Limpar
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={selectAllVisible} className="h-8">
                  <CheckSquare className="h-3 w-3 mr-1" /> Selecionar Todos
                </Button>
                <Button onClick={() => openEdit('detailed')}><Plus className="mr-2 h-4 w-4" /> Novo Registro</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Competência</TableHead>
                      <TableHead>Instituição</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Emissor</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Posição</TableHead>
                      <TableHead>Taxa</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Rendimento %</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={11}>Carregando...</TableCell></TableRow>
                    ) : filteredDetailed.length === 0 ? (
                      <TableRow><TableCell colSpan={11}>Nenhum dado</TableCell></TableRow>
                    ) : filteredDetailed.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Checkbox checked={selectedIds.has(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                        </TableCell>
                        <TableCell>{r.period}</TableCell>
                        <TableCell>{r.institution}</TableCell>
                        <TableCell>{r.asset}</TableCell>
                        <TableCell>{r.issuer}</TableCell>
                        <TableCell>{r.asset_class}</TableCell>
                        <TableCell>{fmt(r.position)}</TableCell>
                        <TableCell>{r.rate || '-'}</TableCell>
                        <TableCell>{r.maturity_date ? new Date(r.maturity_date).toLocaleDateString('pt-BR') : '-'}</TableCell>
                        <TableCell>{(((r.yield || 0) * 100).toFixed(2))}%</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit('detailed', r)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => deleteRow('detailed', r.id)}><Trash2 className="h-4 w-4" /></Button>
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
            <DialogTitle>{editItem?.id ? 'Editar' : 'Criar'} {editingType === 'consolidated' ? 'Dado Consolidado' : 'Dado Detalhado'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Competência (MM/YYYY)</Label>
                <Input value={editItem.period || ''} onChange={(e) => setEditItem(prev => ({ ...prev, period: e.target.value }))} />
              </div>
              <div>
                <Label>Instituição</Label>
                <Input value={editItem.institution || ''} onChange={(e) => setEditItem(prev => ({ ...prev, institution: e.target.value }))} />
              </div>
            </div>

            {editingType === 'consolidated' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patrimônio Inicial</Label>
                  <Input type="number" value={(editItem.initial_assets as number) || 0} onChange={(e) => setEditItem(p => ({ ...p, initial_assets: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>Movimentação</Label>
                  <Input type="number" value={(editItem.movement as number) || 0} onChange={(e) => setEditItem(p => ({ ...p, movement: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>Impostos</Label>
                  <Input type="number" value={(editItem.taxes as number) || 0} onChange={(e) => setEditItem(p => ({ ...p, taxes: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>Ganho Financeiro</Label>
                  <Input type="number" value={(editItem.financial_gain as number) || 0} onChange={(e) => setEditItem(p => ({ ...p, financial_gain: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>Patrimônio Final</Label>
                  <Input type="number" value={(editItem.final_assets as number) || 0} onChange={(e) => setEditItem(p => ({ ...p, final_assets: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>Rendimento (%)</Label>
                  <Input type="number" step="0.0001" value={(((editItem.yield as number) || 0) * 100).toFixed(4)} onChange={(e) => setEditItem(p => ({ ...p, yield: (parseFloat(e.target.value) || 0) / 100 }))} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ativo</Label>
                  <Input value={editItem.asset || ''} onChange={(e) => setEditItem(p => ({ ...p, asset: e.target.value }))} />
                </div>
                <div>
                  <Label>Emissor</Label>
                  <Input value={editItem.issuer || ''} onChange={(e) => setEditItem(p => ({ ...p, issuer: e.target.value }))} />
                </div>
                <div>
                  <Label>Classe do Ativo</Label>
                  <Input value={editItem.asset_class || ''} onChange={(e) => setEditItem(p => ({ ...p, asset_class: e.target.value }))} />
                </div>
                <div>
                  <Label>Posição</Label>
                  <Input type="number" value={(editItem.position as number) || 0} onChange={(e) => setEditItem(p => ({ ...p, position: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>Taxa</Label>
                  <Input value={editItem.rate || ''} onChange={(e) => setEditItem(p => ({ ...p, rate: e.target.value }))} />
                </div>
                <div>
                  <Label>Vencimento</Label>
                  <Input type="date" value={editItem.maturity_date || ''} onChange={(e) => setEditItem(p => ({ ...p, maturity_date: e.target.value }))} />
                </div>
                <div>
                  <Label>Rendimento (%)</Label>
                  <Input type="number" step="0.0001" value={(((editItem.yield as number) || 0) * 100).toFixed(4)} onChange={(e) => setEditItem(p => ({ ...p, yield: (parseFloat(e.target.value) || 0) / 100 }))} />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}><X className="h-4 w-4 mr-1" /> Cancelar</Button>
              <Button onClick={saveEdit}><Save className="h-4 w-4 mr-1" /> Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


