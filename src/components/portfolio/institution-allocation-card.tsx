import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, Label } from "recharts"

export interface InstitutionAllocationItem {
  institution: string
  patrimonio: number
  rendimento: number
  percentage: number
  color: string
}

interface InstitutionAllocationCardProps {
  institutionData: InstitutionAllocationItem[]
  totalPatrimonio: number
  selectedInstitution?: string | null
  onInstitutionClick?: (institution: string) => void
}

export function InstitutionAllocationCard({ institutionData, totalPatrimonio, selectedInstitution, onInstitutionClick }: InstitutionAllocationCardProps) {
  const currency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v || 0)

  return (
    <Card className="bg-gradient-card border-border/50 shadow-elegant-md">
      <CardHeader>
        <CardTitle className="text-foreground">Alocação por Instituição</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Donut chart on top */}
        {institutionData.length > 0 && (
          <div className="mb-4">
            <ChartContainer
              config={Object.fromEntries(institutionData.map(d => [d.institution, { label: d.institution, color: d.color }]))}
              className="mx-auto w-full max-w-[520px] aspect-square"
            >
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="institution" />} />
                <Pie
                  data={institutionData}
                  dataKey="patrimonio"
                  nameKey="institution"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={2}
                  strokeWidth={4}
                >
                  {institutionData.map(item => (
                    <Cell key={item.institution} fill={item.color} />
                  ))}
                  <Label
                    position="center"
                    content={({ viewBox }) => {
                      const vb = viewBox as { cx?: number; cy?: number } | undefined
                      const cx = vb?.cx
                      const cy = vb?.cy
                      if (typeof cx !== 'number' || typeof cy !== 'number') return null
                      return (
                        <foreignObject x={cx - 120} y={cy - 60} width={240} height={120}>
                          <div className="flex h-full w-full flex-col items-center justify-center">
                            <span className="text-sm text-muted-foreground">Patrimônio Bruto</span>
                            <span className="text-2xl font-bold text-foreground">{currency(totalPatrimonio)}</span>
                          </div>
                        </foreignObject>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        )}

        {/* List below */}
        <div className="grid gap-3">
          {institutionData.map(item => (
            <button
              key={item.institution}
              className={`flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-left ${selectedInstitution === item.institution ? 'bg-primary/5' : 'bg-card/50'}`}
              onClick={() => onInstitutionClick && onInstitutionClick(item.institution)}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="text-sm text-foreground font-medium">{item.institution}</div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-muted-foreground">{item.percentage.toFixed(2)}%</div>
                <div className="text-foreground font-semibold">{currency(item.patrimonio)}</div>
              </div>
            </button>
          ))}
          {institutionData.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">Sem dados</div>
          )}
          <div className="text-right text-sm text-muted-foreground">Total: {currency(totalPatrimonio)}</div>
        </div>
      </CardContent>
    </Card>
  )
}


