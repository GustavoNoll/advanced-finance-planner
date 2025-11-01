import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PerformanceData } from "@/types/financial"

interface MaturityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  performanceData: PerformanceData[]
}

export function MaturityDialog({ open, onOpenChange, performanceData }: MaturityDialogProps) {
  const toDate = (competencia?: string | null) => {
    if (!competencia) return 0
    const [m, y] = competencia.split('/')
    return new Date(parseInt(y), parseInt(m) - 1).getTime()
  }

  const mostRecent = [...new Set(performanceData.map(d => d.period).filter(Boolean) as string[])]
    .sort((a, b) => toDate(b) - toDate(a))[0]

  const filtered = performanceData.filter(d => d.period === mostRecent)
  const now = new Date()
  const maturity = filtered
    .filter(i => i.maturity_date)
    .map(i => ({ ...i, mat: new Date(i.maturity_date as string) }))
    .filter(i => i.mat >= now)
    .sort((a, b) => a.mat.getTime() - b.mat.getTime())

  const totalNext12 = (() => {
    const lim = new Date()
    lim.setMonth(lim.getMonth() + 12)
    return maturity.filter(i => i.mat <= lim).reduce((s, i) => s + (i.position || 0), 0)
  })()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold">Cronograma de Vencimentos</DialogTitle>
          <DialogDescription>Próximos vencimentos de títulos da carteira</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Total a Vencer (12 meses)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2}).format(totalNext12)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Títulos com Vencimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{maturity.length}</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Próximos Vencimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {maturity.slice(0, 10).map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div className="min-w-0">
                      <div className="font-medium text-xs md:text-sm truncate">{i.asset || '-'}</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground truncate">{i.issuer || '-'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-xs md:text-sm">{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(i.position || 0)}</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground">{new Date(i.maturity_date as string).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                ))}
                {maturity.length === 0 && (
                  <div className="py-6 text-center text-muted-foreground text-sm">Nenhum vencimento futuro encontrado</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}


