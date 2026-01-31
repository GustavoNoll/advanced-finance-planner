// 1. Imports externos
import { useState } from 'react'
import { FileText, CheckCircle2, XCircle, Clock, Info } from 'lucide-react'

// 2. Imports internos (shared)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

// 3. Imports internos (feature)
import type { StatementImport } from '@/types/financial/statement-imports'
import type { UserProfileInvestment } from '@/types/broker-dashboard'

interface StatementImportsListProps {
  imports: StatementImport[];
  loading: boolean;
  error: string | null;
  type: 'broker' | 'admin';
  clients?: UserProfileInvestment[];
  clientsMap?: Record<string, { name: string; email: string; broker_id: string | null }>;
  brokersMap?: Record<string, { name: string; email: string }>;
  t: (key: string) => string;
}

function ImportTableRow({ 
  importItem, 
  type,
  clients,
  clientsMap,
  brokersMap,
  t 
}: { 
  importItem: StatementImport; 
  type: 'broker' | 'admin';
  clients?: UserProfileInvestment[];
  clientsMap?: Record<string, { name: string; email: string; broker_id: string | null }>;
  brokersMap?: Record<string, { name: string; email: string }>;
  t: (key: string) => string;
}) {
  const [showDetails, setShowDetails] = useState(false);
  
  const translationPrefix = type === 'broker' ? 'brokerDashboard.statementImports' : 'adminDashboard.statementImports';
  
  // Get client info based on type
  const client = type === 'broker' 
    ? clients?.find(c => c.id === importItem.profile_id)
    : clientsMap?.[importItem.profile_id];
  
  // Get broker info (only for admin)
  const broker = type === 'admin' && client && 'broker_id' in client && client.broker_id
    ? brokersMap?.[client.broker_id] 
    : null;

  const getClientName = () => {
    if (type === 'broker') {
      return (client as UserProfileInvestment)?.profile_name || (client as UserProfileInvestment)?.email || importItem.profile_id.slice(0, 8);
    } else {
      return (client as { name: string; email: string })?.name || importItem.profile_id.slice(0, 8);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {getClientName()}
      </TableCell>
      {type === 'admin' && (
        <TableCell>
          {broker ? broker.name : '-'}
        </TableCell>
      )}
      <TableCell>
        {importItem.import_type === 'consolidated' 
          ? t(`${translationPrefix}.consolidated`)
          : importItem.import_type === 'assets'
          ? t(`${translationPrefix}.detailed`)
          : '-'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {importItem.status === 'success' && (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">{t(`${translationPrefix}.statusSuccess`)}</span>
            </>
          )}
          {importItem.status === 'failed' && (
            <>
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-600 dark:text-red-400">{t(`${translationPrefix}.statusFailed`)}</span>
            </>
          )}
          {importItem.status === 'running' && (
            <>
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-600 dark:text-yellow-400">{t(`${translationPrefix}.statusRunning`)}</span>
            </>
          )}
          {importItem.status === 'created' && (
            <>
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-blue-600 dark:text-blue-400">{t(`${translationPrefix}.statusCreated`)}</span>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        {new Date(importItem.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </TableCell>
      <TableCell>
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              {t(`${translationPrefix}.viewDetails`)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t(`${translationPrefix}.importDetails`)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t(`${translationPrefix}.client`)}</p>
                  <p className="text-sm">{getClientName()}</p>
                </div>
                {type === 'admin' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t(`${translationPrefix}.broker`)}</p>
                    <p className="text-sm">{broker ? broker.name : '-'}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t(`${translationPrefix}.type`)}</p>
                  <p className="text-sm">
                    {importItem.import_type === 'consolidated' 
                      ? t(`${translationPrefix}.consolidated`)
                      : importItem.import_type === 'assets'
                      ? t(`${translationPrefix}.detailed`)
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t(`${translationPrefix}.status`)}</p>
                  <p className="text-sm">{importItem.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t(`${translationPrefix}.createdAt`)}</p>
                  <p className="text-sm">
                    {new Date(importItem.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                {importItem.started_at && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t(`${translationPrefix}.startedAt`)}</p>
                    <p className="text-sm">
                      {new Date(importItem.started_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
                {importItem.completed_at && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t(`${translationPrefix}.completedAt`)}</p>
                    <p className="text-sm">
                      {new Date(importItem.completed_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
                {importItem.error_message && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">{t(`${translationPrefix}.error`)}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{importItem.error_message}</p>
                  </div>
                )}
              </div>
              {Object.keys(importItem.metadata || {}).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{t(`${translationPrefix}.metadata`)}</p>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-40">
                    {JSON.stringify(importItem.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

export function StatementImportsList({
  imports,
  loading,
  error,
  type,
  clients,
  clientsMap,
  brokersMap,
  t
}: StatementImportsListProps) {
  const translationPrefix = type === 'broker' ? 'brokerDashboard.statementImports' : 'adminDashboard.statementImports';

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-slate-900 dark:text-slate-100">{t(`${translationPrefix}.recentImports`)}</span>
            <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
              {t(`${translationPrefix}.last10Imports`)}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : imports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t(`${translationPrefix}.noImports`)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t(`${translationPrefix}.client`)}</TableHead>
                  {type === 'admin' && (
                    <TableHead>{t(`${translationPrefix}.broker`)}</TableHead>
                  )}
                  <TableHead>{t(`${translationPrefix}.type`)}</TableHead>
                  <TableHead>{t(`${translationPrefix}.status`)}</TableHead>
                  <TableHead>{t(`${translationPrefix}.date`)}</TableHead>
                  <TableHead>{t(`${translationPrefix}.actions`)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imports.slice(0, 10).map((importItem) => (
                  <ImportTableRow 
                    key={importItem.id} 
                    importItem={importItem} 
                    type={type}
                    clients={clients}
                    clientsMap={clientsMap}
                    brokersMap={brokersMap}
                    t={t}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

