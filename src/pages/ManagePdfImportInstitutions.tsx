import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import { usePdfImportInstitutions, useCreatePdfImportInstitution, useUpdatePdfImportInstitution, useDeletePdfImportInstitution, type PdfImportInstitutionInput } from '@/hooks/usePdfImportInstitutions'
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

export function ManagePdfImportInstitutions() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingInstitution, setEditingInstitution] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<PdfImportInstitutionInput>({
    name: '',
    default_currency: 'BRL',
    requires_additional_file: false
  })

  const { data: institutions = [], isLoading } = usePdfImportInstitutions()
  const createMutation = useCreatePdfImportInstitution()
  const updateMutation = useUpdatePdfImportInstitution()
  const deleteMutation = useDeletePdfImportInstitution()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/login')
        return
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (!profile?.is_admin) {
          toast({
            title: t('common.error'),
            description: t('adminDashboard.errors.unauthorized'),
            variant: "destructive",
          })
          navigate('/')
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error('Error checking admin status:', error)
        navigate('/login')
      }
    }

    checkAdminStatus()
  }, [user, navigate, toast, t])

  const handleCreate = () => {
    setFormData({
      name: '',
      default_currency: 'BRL',
      requires_additional_file: false
    })
    setIsCreating(true)
  }

  const handleEdit = (institution: typeof institutions[0]) => {
    setFormData({
      name: institution.name,
      default_currency: institution.default_currency,
      requires_additional_file: institution.requires_additional_file
    })
    setEditingInstitution(institution.id)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: t('common.error'),
        description: t('validation.required'),
        variant: "destructive",
      })
      return
    }

    try {
      if (editingInstitution) {
        await updateMutation.mutateAsync({
          id: editingInstitution,
          ...formData
        })
        toast({
          title: t('common.success'),
          description: t('adminDashboard.pdfInstitutions.updated') || 'Instituição atualizada com sucesso',
        })
        setEditingInstitution(null)
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: t('common.success'),
          description: t('adminDashboard.pdfInstitutions.created') || 'Instituição criada com sucesso',
        })
        setIsCreating(false)
      }
      setFormData({
        name: '',
        default_currency: 'BRL',
        requires_additional_file: false
      })
    } catch (error) {
      console.error('Error saving institution:', error)
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast({
        title: t('common.success'),
        description: t('adminDashboard.pdfInstitutions.deleted') || 'Instituição removida com sucesso',
      })
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting institution:', error)
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      })
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back') || 'Voltar'}
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {t('adminDashboard.pdfInstitutions.title') || 'Gerenciar Instituições de Importação PDF'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {t('adminDashboard.pdfInstitutions.description') || 'Gerencie as instituições aceitas para importação de PDFs'}
              </p>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t('adminDashboard.pdfInstitutions.create') || 'Criar Instituição'}
            </Button>
          </div>
        </div>

        {/* Institutions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        ) : (
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>
                {t('adminDashboard.pdfInstitutions.title') || 'Instituições de Importação PDF'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('adminDashboard.pdfInstitutions.name') || 'Nome'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('adminDashboard.pdfInstitutions.defaultCurrency') || 'Moeda Padrão'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('adminDashboard.pdfInstitutions.requiresAdditionalFile') || 'Requer Arquivo Adicional'}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('adminDashboard.actions') || 'Ações'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {institutions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                          {t('adminDashboard.pdfInstitutions.noInstitutions') || 'Nenhuma instituição cadastrada'}
                        </td>
                      </tr>
                    ) : (
                      institutions.map((institution) => (
                        <tr key={institution.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-foreground">
                              {institution.name}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-foreground">
                              {institution.default_currency}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              institution.requires_additional_file 
                                ? 'text-orange-600 dark:text-orange-400' 
                                : 'text-muted-foreground'
                            }`}>
                              {institution.requires_additional_file 
                                ? (t('common.yes') || 'Sim')
                                : (t('common.no') || 'Não')}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(institution)}
                                className="h-8 w-8"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteConfirm(institution.id)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isCreating || editingInstitution !== null} onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false)
            setEditingInstitution(null)
            setFormData({
              name: '',
              default_currency: 'BRL',
              requires_additional_file: false
            })
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingInstitution 
                  ? (t('adminDashboard.pdfInstitutions.edit') || 'Editar Instituição')
                  : (t('adminDashboard.pdfInstitutions.create') || 'Criar Instituição')}
              </DialogTitle>
              <DialogDescription>
                {editingInstitution
                  ? (t('adminDashboard.pdfInstitutions.editDescription') || 'Atualize as informações da instituição')
                  : (t('adminDashboard.pdfInstitutions.createDescription') || 'Adicione uma nova instituição para importação de PDFs')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  {t('adminDashboard.pdfInstitutions.name') || 'Nome'}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('adminDashboard.pdfInstitutions.namePlaceholder') || 'Ex: XP Investimentos'}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">
                  {t('adminDashboard.pdfInstitutions.defaultCurrency') || 'Moeda Padrão'}
                </Label>
                <Select
                  value={formData.default_currency}
                  onValueChange={(value: 'BRL' | 'USD' | 'EUR') => 
                    setFormData({ ...formData, default_currency: value })
                  }
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requires_additional_file"
                  checked={formData.requires_additional_file}
                  onChange={(e) => setFormData({ ...formData, requires_additional_file: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="requires_additional_file" className="cursor-pointer">
                  {t('adminDashboard.pdfInstitutions.requiresAdditionalFile') || 'Requer Arquivo Adicional'}
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setEditingInstitution(null)
                  setFormData({
                    name: '',
                    default_currency: 'BRL',
                    requires_additional_file: false
                  })
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? (t('common.saving') || 'Salvando...')
                  : (t('common.save') || 'Salvar')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirm !== null} onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null)
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t('adminDashboard.pdfInstitutions.confirmDelete') || 'Confirmar Exclusão'}
              </DialogTitle>
              <DialogDescription>
                {t('adminDashboard.pdfInstitutions.confirmDeleteDescription') || 'Tem certeza que deseja excluir esta instituição? Esta ação não pode ser desfeita.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending
                  ? (t('common.saving') || 'Excluindo...')
                  : (t('common.delete') || 'Excluir')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

