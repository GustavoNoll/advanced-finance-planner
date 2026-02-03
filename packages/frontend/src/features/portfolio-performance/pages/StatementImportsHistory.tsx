import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { ArrowLeft, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"
import { useStatementImportsHistory } from "@/hooks/useStatementImports"
import { Spinner } from "@/shared/components/ui/spinner"

export default function StatementImportsHistory() {
  const { id: profileId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { imports, loading, error } = useStatementImportsHistory(profileId || null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case 'created':
        return <Clock className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return t('statementImports.status.success') || 'Sucesso'
      case 'failed':
        return t('statementImports.status.failed') || 'Falha'
      case 'running':
        return t('statementImports.status.running') || 'Em Execução'
      case 'created':
        return t('statementImports.status.created') || 'Criado'
      default:
        return status
    }
  }

  const getImportTypeLabel = (type: string | null) => {
    if (!type) return '-'
    switch (type) {
      case 'consolidated':
        return t('statementImports.type.consolidated') || 'Consolidado'
      case 'assets':
        return t('statementImports.type.assets') || 'Ativos'
      default:
        return type
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('common.back') || 'Voltar'}
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('statementImports.title') || 'Histórico de Importações'}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('statementImports.description') || 'Histórico de importações de extratos via n8n'}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('statementImports.table.title') || 'Importações'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex justify-center">
              <Spinner className="h-6 w-6" />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-destructive">
              {error}
            </div>
          ) : imports.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {t('statementImports.noImports') || 'Nenhuma importação encontrada'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('statementImports.table.status') || 'Status'}</TableHead>
                    <TableHead>{t('statementImports.table.type') || 'Tipo'}</TableHead>
                    <TableHead>{t('statementImports.table.n8nId') || 'ID n8n'}</TableHead>
                    <TableHead>{t('statementImports.table.createdAt') || 'Criado em'}</TableHead>
                    <TableHead>{t('statementImports.table.startedAt') || 'Iniciado em'}</TableHead>
                    <TableHead>{t('statementImports.table.completedAt') || 'Concluído em'}</TableHead>
                    <TableHead>{t('statementImports.table.error') || 'Erro'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imports.map((importItem) => (
                    <TableRow key={importItem.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(importItem.status)}
                          <span>{getStatusLabel(importItem.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getImportTypeLabel(importItem.import_type)}</TableCell>
                      <TableCell className="font-mono text-xs">{importItem.n8n_execution_id}</TableCell>
                      <TableCell>{formatDate(importItem.created_at)}</TableCell>
                      <TableCell>{formatDate(importItem.started_at)}</TableCell>
                      <TableCell>{formatDate(importItem.completed_at)}</TableCell>
                      <TableCell className="max-w-xs">
                        {importItem.error_message ? (
                          <span className="text-red-600 text-sm" title={importItem.error_message}>
                            {importItem.error_message.length > 50 
                              ? `${importItem.error_message.substring(0, 50)}...` 
                              : importItem.error_message}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

