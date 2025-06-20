"use client"

import type React from "react"

import { AxisBottom, AxisLeft } from "@visx/axis"
import { curveMonotoneX } from "@visx/curve"
import { GridColumns, GridRows } from "@visx/grid"
import { Group } from "@visx/group"
import { LinePath } from "@visx/shape"
import { scaleLinear, scaleTime } from "@visx/scale"
import { Tooltip, useTooltip, defaultStyles } from "@visx/tooltip"
import { localPoint } from "@visx/event"
import { bisector } from "d3-array"
import { useMemo, useCallback, useState } from "react"
import { formatCurrency } from "@/utils/currency"
import { Target, Home, Car, GraduationCap, Heart, Briefcase, Users, Plane, Monitor, Gamepad, PiggyBank, Layers } from "lucide-react"
import { ChartPointDialog } from "@/components/chart/ChartPointDialog"
import type { GoalFormValues, EventFormValues } from '@/types/financial'
import { useTranslation } from 'react-i18next'
import { CurrencyCode } from "@/utils/currency"
import { InvestmentPlan } from "@/types/financial"

// Tipos para os dados
type MonthlyData = {
  age: string
  year: number
  month: number
  actualValue: number
  projectedValue: number
  realDataPoint?: boolean
}

type ObjectiveData = {
  asset_value: number
  created_at?: string
  icon: string
  name: string
  id: string
  installment_count: number
  installment_interval: number
  payment_mode: 'none' | 'installment' | 'repeat'
  type: 'goal' | 'event'
}

type PatrimonialProjectionChartProps = {
  monthlyData: MonthlyData[]
  objectives: ObjectiveData[]
  selectedYears: number[]
  showNominalValues: boolean
  hideNegativeValues: boolean
  investmentPlan: InvestmentPlan
  onSubmitGoal: (values: GoalFormValues) => Promise<void>
  onSubmitEvent: (values: EventFormValues) => Promise<void>
  currency: 'BRL' | 'USD' | 'EUR'
  handleEditItem: (item: ObjectivePoint) => void
  birthDate?: string
  zoomLevel?: string
}

// Função para converter mês e ano em objeto Date
const getDateFromMonthYear = (year: number, month: number): Date => {
  return new Date(year, month - 1, 1)
}

// Função para converter string de data ISO em objeto Date
const parseISODate = (dateString: string): Date => {
  return new Date(dateString)
}

// Mapeamento de ícones baseado no tipo
const getIconComponent = (iconType: string) => {
  const iconMap = {
    car: Car,
    education: GraduationCap,
    health: Heart,
    house: Home,
    travel: Plane,
    family: Users,
    electronic: Monitor,
    hobby: Gamepad,
    professional: Briefcase,
    goal: Target,
    contribution: PiggyBank,
    other: Target,
  }
  return iconMap[iconType as keyof typeof iconMap] || iconMap.other
}

// Bisector para encontrar o ponto mais próximo
const bisectDate = bisector<{ date: Date }, Date>((d) => d.date).left

// Interface para pontos de objetivo agrupados
interface ObjectivePoint {
  date: Date
  value: number
  icon: string
  id: string
  installment_count: number
  installment_interval: number
  payment_mode: 'none' | 'installment' | 'repeat'
  name: string
  type: 'goal' | 'event'
}

// Agrupa objetivos próximos no eixo X
function groupObjectivesByProximity(objectivePoints: ObjectivePoint[], dateScale: (date: Date) => number, minDistance = 24) {
  if (objectivePoints.length === 0) return []
  const sorted = [...objectivePoints].sort((a, b) => dateScale(a.date) - dateScale(b.date))
  const groups: { x: number; objectives: ObjectivePoint[] }[] = []
  let currentGroup: ObjectivePoint[] = [sorted[0]]
  let lastX = dateScale(sorted[0].date)
  for (let i = 1; i < sorted.length; i++) {
    const x = dateScale(sorted[i].date)
    if (x - lastX < minDistance) {
      currentGroup.push(sorted[i])
    } else {
      groups.push({ x: lastX, objectives: currentGroup })
      currentGroup = [sorted[i]]
      lastX = x
    }
  }
  groups.push({ x: lastX, objectives: currentGroup })
  return groups
}

interface SelectedPoint {
  date: Date
  actualValue: number
  projectedValue: number
  age: string
  year: number
  month: number
  realDataPoint: boolean
}

export default function PatrimonialProjectionChart({
  monthlyData,
  objectives,
  selectedYears,
  showNominalValues,
  hideNegativeValues,
  investmentPlan,
  width = '100%',
  height = 400,
  onSubmitGoal,
  onSubmitEvent,
  currency,
  handleEditItem,
  birthDate,
  zoomLevel,
}: PatrimonialProjectionChartProps & { width?: string | number; height?: string | number }) {
  const { t } = useTranslation()
  // Dimensões do gráfico
  const margin = { top: 60, right: 30, bottom: 60, left: 80 }
  const chartTotalWidth = 1200
  const chartTotalHeight = height as number
  const innerWidth = chartTotalWidth - margin.left - margin.right
  const innerHeight = chartTotalHeight - margin.top - margin.bottom

  // Filtrar e processar dados
  const filteredData = useMemo(() => {
    let filtered = monthlyData.filter((d) => selectedYears.includes(d.year))

    if (hideNegativeValues) {
      filtered = filtered.filter((d) => d.actualValue >= 0 && d.projectedValue >= 0)
    }

    return filtered
  }, [monthlyData, selectedYears, hideNegativeValues])

  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    return filteredData.map((d) => ({
      date: getDateFromMonthYear(d.year, d.month),
      actualValue: showNominalValues ? d.actualValue : d.actualValue * 0.85, // Simulando ajuste por inflação
      projectedValue: showNominalValues ? d.projectedValue : d.projectedValue * 0.85,
      age: d.age,
      year: d.year,
      month: d.month,
      realDataPoint: d.realDataPoint,
    }))
  }, [filteredData, showNominalValues])

  // Preparar dados de objetivos
  const objectivePoints = useMemo(() => {
    return objectives
      .map((obj) => ({
        date: parseISODate(obj.created_at),
        value: showNominalValues ? obj.asset_value : obj.asset_value * 0.85,
        icon: obj.icon, 
        id: obj.id,
        installment_count: obj.installment_count,
        installment_interval: obj.installment_interval,
        payment_mode: obj.payment_mode,
        name: obj.name,
        type: obj.type,
      }))
      .filter((obj) => {
        if (chartData.length === 0) return true
        const minDate = Math.min(...chartData.map((d) => d.date.getTime()))
        const maxDate = Math.max(...chartData.map((d) => d.date.getTime()))
        return obj.date.getTime() >= minDate && obj.date.getTime() <= maxDate
      })
  }, [objectives, chartData, showNominalValues])

  // Escalas
  const dateScale = useMemo(() => {
    if (chartData.length === 0) {
      return scaleTime<number>({
        range: [0, innerWidth],
        domain: [new Date(), new Date()],
      })
    }
    return scaleTime<number>({
      range: [0, innerWidth],
      domain: [
        Math.min(...chartData.map((d) => d.date.getTime())),
        Math.max(...chartData.map((d) => d.date.getTime())),
      ],
    })
  }, [chartData, innerWidth])

  const valueScale = useMemo(() => {
    if (chartData.length === 0) {
      return scaleLinear<number>({
        range: [innerHeight, 0],
        domain: [0, 100],
      })
    }

    const allValues = [
      ...chartData.map((d) => d.actualValue),
      ...chartData.map((d) => d.projectedValue),
      ...objectivePoints.map((d) => d.value),
    ]

    const minValue = hideNegativeValues ? 0 : Math.min(...allValues) * 0.9
    const maxValue = Math.max(...allValues) * 1.1

    return scaleLinear<number>({
      range: [innerHeight, 0],
      domain: [minValue, maxValue],
      nice: true,
    })
  }, [chartData, objectivePoints, innerHeight, hideNegativeValues])

  // Tooltip
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<{
    date: Date
    actualValue?: number
    projectedValue?: number
    objectives?: { value: number; icon: string; id: string }[]
  }>()

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x, y } = localPoint(event) || { x: 0, y: 0 }
      const x0 = dateScale.invert(x - margin.left)

      // Só mostra tooltip de objetivo se estiver no top 10% do gráfico (ícone)
      if (y <= innerHeight * 0.1) {
        const groups = groupObjectivesByProximity(objectivePoints, dateScale, 24)
        const nearestGroup = groups.find((group) => Math.abs(group.x - (x - margin.left)) < 15)
        if (nearestGroup) {
          showTooltip({
            tooltipData: {
              date: nearestGroup.objectives[0].date,
              objectives: nearestGroup.objectives.map(obj => ({
                value: obj.value,
                icon: obj.icon,
                id: obj.id,
                installment_count: obj.installment_count,
                installment_interval: obj.installment_interval,
                payment_mode: obj.payment_mode,
                name: obj.name,
                type: obj.type,
              })),
            },
            tooltipLeft: x,
            tooltipTop: margin.top / 2,
          })
          return
        }
      }

      // Tooltip de valores reais/projetados (restante do gráfico)
      if (chartData.length > 0) {
        const index = bisectDate(chartData, x0, 1)
        const d0 = chartData[index - 1]
        const d1 = chartData[index]

        let d = d0
        if (d1 && d1.date) {
          d = x0.valueOf() - d0.date.valueOf() > d1.date.valueOf() - x0.valueOf() ? d1 : d0
        }

        showTooltip({
          tooltipData: {
            date: d.date,
            actualValue: d.actualValue,
            projectedValue: d.projectedValue,
          },
          tooltipLeft: x,
          tooltipTop: valueScale(d.actualValue || d.projectedValue),
        })
      }
    },
    [showTooltip, valueScale, dateScale, margin.left, chartData, objectivePoints, innerHeight],
  )

  // Formatador de data com mês abreviado em português
  function formatDate(date: Date) {
    if (!(date instanceof Date)) return ''
    const month = date.toLocaleString('pt-BR', { month: 'short' })
    const year = date.getFullYear()
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`
  }

  // Ordene os pontos por data
  const sortedData = [...chartData].sort((a, b) => a.date.getTime() - b.date.getTime())
  const realPoints = sortedData.filter(d => d.realDataPoint)
  const projectedPoints = sortedData.filter(d => !d.realDataPoint)

  // Conecte apenas o último real ao primeiro projetado, se existirem ambos e não forem o mesmo ponto
  let connectedProjectedPoints = projectedPoints
  if (realPoints.length && projectedPoints.length) {
    const lastReal = realPoints[realPoints.length - 1]
    if (projectedPoints[0].date.getTime() !== lastReal.date.getTime()) {
      connectedProjectedPoints = [lastReal, ...projectedPoints]
    }
  }

  // Para a linha laranja, use todos os pontos do período filtrado, ordenados
  const allPoints = sortedData

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null)
  const [showSelectObjectiveModal, setShowSelectObjectiveModal] = useState(false)
  const [selectedGroupObjectives, setSelectedGroupObjectives] = useState<ObjectivePoint[]>([])

  // Clique no gráfico para adicionar evento/objetivo
  function handleChartClick(event: React.MouseEvent<SVGRectElement>) {
    if (!chartData.length) return
    const { x, y } = localPoint(event) || { x: 0, y: 0 }
    // Só abre modal se clicar na metade inferior do gráfico
    if (y < innerHeight / 5) return
    const x0 = dateScale.invert(x - margin.left)
    const index = bisectDate(chartData, x0, 1)
    const d0 = chartData[index - 1]
    const d1 = chartData[index]
    let d = d0
    if (d1 && d1.date) {
      d = x0.valueOf() - d0.date.valueOf() > d1.date.valueOf() - x0.valueOf() ? d1 : d0
    }
    setSelectedPoint(d)
    setShowAddModal(true)
  }

  return (
    <div className="relative bg-white w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${chartTotalWidth} ${chartTotalHeight}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="actualGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="100%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill="white" />

        {/* Área principal do gráfico */}
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={valueScale} width={innerWidth} strokeDasharray="1,3" stroke="rgba(0,0,0,0.05)" />
          <GridColumns scale={dateScale} height={innerHeight} strokeDasharray="1,3" stroke="rgba(0,0,0,0.05)" />

          {/* Linha dos valores reais/projetados - azul gradiente, curva única */}
          {/* Linha azul real (sólida, escura) */}
          {realPoints.length > 1 && (
            <LinePath
              data={realPoints}
              x={d => dateScale(d.date) ?? 0}
              y={d => valueScale(d.actualValue) ?? 0}
              stroke="url(#actualGradient)"
              strokeWidth={2.5}
              curve={curveMonotoneX}
            />
          )}
          {/* Linha azul não real (clara, pontilhada) - segmento único após último real ou todos os pontos se não houver real */}
          {(() => {
            if (!realPoints.length && sortedData.length > 1) {
              // Não há pontos reais, mostrar linha clara para todos os pontos
              return (
                <LinePath
                  data={sortedData}
                  x={d => dateScale(d.date) ?? 0}
                  y={d => valueScale(d.actualValue) ?? 0}
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  strokeDasharray="6,6"
                  curve={curveMonotoneX}
                />
              )
            }
            // Caso padrão já existente: mostrar segmento não real após último real
            if (!realPoints.length) return null
            // Encontrar o último índice onde realDataPoint é true
            const lastRealIdx = [...sortedData].reverse().findIndex(d => d.realDataPoint)
            const lastRealIdxFromStart = lastRealIdx === -1 ? -1 : sortedData.length - 1 - lastRealIdx
            if (lastRealIdxFromStart === -1 || lastRealIdxFromStart === sortedData.length - 1) return null
            const notRealSegment = sortedData.slice(lastRealIdxFromStart, sortedData.length)
            if (notRealSegment.length < 2) return null
            return (
              <LinePath
                data={notRealSegment}
                x={d => dateScale(d.date) ?? 0}
                y={d => valueScale(d.actualValue) ?? 0}
                stroke="#60a5fa"
                strokeWidth={2.5}
                strokeDasharray="6,6"
                curve={curveMonotoneX}
              />
            )
          })()}
          {/* Linha dos valores projetados - laranja tracejada */}
          {sortedData.length > 1 && (
            <LinePath
              data={sortedData}
              x={d => dateScale(d.date) ?? 0}
              y={d => valueScale(d.projectedValue) ?? 0}
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="8,4"
              curve={curveMonotoneX}
            />
          )}

          <AxisBottom
            top={innerHeight}
            scale={dateScale}
            tickFormat={d => {
              if (!(d instanceof Date)) return ''
              // Calcule idade exata usando birthDate
              let ageLabel = ''
              if (birthDate) {
                const birth = new Date(birthDate)
                let age = d.getFullYear() - birth.getFullYear()
                const m = d.getMonth() - birth.getMonth()
                if (m < 0) age--
                if (zoomLevel === '1y' || zoomLevel === '5y') {
                  // anos/mês
                  const monthName = d.toLocaleString('pt-BR', { month: 'short' })
                  ageLabel = `${age}/${monthName}`
                } else {
                  ageLabel = `${age}`
                }
              } else {
                // fallback: use chartData
                const found = chartData.find(pt => pt.date.getTime() === d.getTime())
                ageLabel = found ? found.age : ''
              }
              return ageLabel
            }}
            stroke="#e5e7eb"
            tickStroke="#e5e7eb"
            label={t('expenseChart.years')}
            tickLabelProps={{
              fill: "#6b7280",
              fontSize: 12,
              textAnchor: "middle",
            }}
          />

          <AxisLeft
            scale={valueScale}
            stroke="#e5e7eb"
            tickStroke="#e5e7eb"
            tickFormat={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: currency,
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(Number(value))
            }
            tickLabelProps={{
              fill: "#6b7280",
              fontSize: 12,
              textAnchor: "end",
              dx: "-0.25em",
              dy: "0.25em",
            }}
            numTicks={6}
          />

          {/* Área invisível para capturar eventos do mouse */}
          <rect
            width={innerWidth}
            height={innerHeight + 50}
            y={-50}
            fill="transparent"
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
            onClick={handleChartClick}
          />
        </Group>

        {/* Área dos objetivos (parte superior) - AGORA DEPOIS, para ficar por cima */}
        <Group left={margin.left} top={10}>
          {/* Objetivos agrupados como pontos destacados */}
          {groupObjectivesByProximity(objectivePoints, dateScale, 24).map((group, i) => {
            const first = group.objectives[0]
            const IconComponent = group.objectives.length >= 2 ? Layers : getIconComponent(first.icon)
            const x = group.x

            // Antes do JSX, defina:
            const isEvent = first.type === 'event'
            const isObjective = first.type === 'goal'
            const value = first.value
            let color = 'text-red-600'
            if (isEvent && value > 0) color = 'text-green-600'
            if (isEvent && value < 0) color = 'text-red-600'
            if (isObjective) color = 'text-red-600'
            if (group.objectives.length > 1) color = 'text-blue-600'

            return (
              <g key={`objective-group-${i}`}> 
                {/* Linha vertical sutil */}
                <line
                  x1={x}
                  y1={40}
                  x2={x}
                  y2={innerHeight + 50}
                  stroke="#10b981"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                  opacity={0.3}
                />
                {/* Ícone do objetivo (apenas um, mesmo se houver mais de um objetivo no grupo) */}
                <foreignObject x={x - 12} y={8} width={24} height={24} style={{ pointerEvents: 'auto' }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (group.objectives.length === 1) {
                        handleEditItem(group.objectives[0])
                      } else if (group.objectives.length > 1) {
                        setSelectedGroupObjectives(group.objectives)
                        setShowSelectObjectiveModal(true)
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      showTooltip({
                        tooltipData: {
                          date: first.date,
                          objectives: group.objectives,
                        },
                        tooltipLeft: x + margin.left,
                        tooltipTop: 20,
                      })
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      hideTooltip();
                    }}
                  >
                    <IconComponent size={16} color={color === 'text-green-600' ? '#16a34a' : (color === 'text-blue-600' ? '#3b82f6' : '#dc2626')} style={{ marginRight: 4 }} />

                  </div>
                </foreignObject>
                {/* Badge de contagem se houver mais de um objetivo */}
                {group.objectives.length > 1 && (
                  <g>
                    <circle cx={x + 10} cy={12} r={8} fill="#10b981" stroke="white" strokeWidth={1} />
                    <text x={x + 10} y={15} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                      {group.objectives.length}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </Group>
      </svg>

      {/* Legenda inferior */}
      <div className="flex items-center justify-center gap-8 mt-4 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-blue-500"></div>
          <span className="text-sm text-gray-600">Evolução Real</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-orange-500" style={{ borderTop: "2px dashed #f97316" }}></div>
          <span className="text-sm text-gray-600">Projeção Financeira</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltipOpen && tooltipData && (
        <Tooltip
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            padding: '0.5rem 0.75rem',
            pointerEvents: 'none',
            zIndex: 20,
            position: 'absolute',
          }}
        >
          <div className="mb-2">
            <span className="text-gray-900 font-semibold text-base">
              {formatDate(tooltipData.date)}
              {birthDate && tooltipData.date && (() => {
                const birth = new Date(birthDate)
                const d = tooltipData.date
                let age = d.getFullYear() - birth.getFullYear()
                const m = d.getMonth() - birth.getMonth()
                if (m < 0) age--
                return ` (${age} anos)`
              })()}
            </span>
          </div>
          {tooltipData.actualValue !== undefined && (
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(to right, #3b82f6, #60a5fa)' }} />
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs font-medium">{t('expenseChart.actualValue')}</span>
                <span className={`text-sm font-semibold ${tooltipData.actualValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(tooltipData.actualValue, investmentPlan?.currency as CurrencyCode)}</span>
                <span className="text-xs text-gray-500">{t('expenseChart.projectedLifetimeIncome')}:{t('expenseChart.lifetimeIncome')}: {formatCurrency((tooltipData.actualValue * (investmentPlan.expected_return/100))/12, investmentPlan?.currency as CurrencyCode)}/{t('common.perMonth')}</span>
              </div>
            </div>
          )}
          {tooltipData.projectedValue !== undefined && (
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(to right, #f97316, #fb923c)' }} />
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs font-medium">{t('expenseChart.projectedValue')}</span>
                <span className={`text-sm font-semibold ${tooltipData.projectedValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(tooltipData.projectedValue, investmentPlan?.currency as CurrencyCode)}</span>
                <span className="text-xs text-gray-500">{t('expenseChart.plannedLifetimeIncome')}: {formatCurrency((tooltipData.projectedValue * (investmentPlan.expected_return/100))/12, investmentPlan?.currency as CurrencyCode)}/{t('common.perMonth')}</span>
              </div>
            </div>
          )}
          {tooltipData.objectives && tooltipData.objectives.length > 0 && (
            <>
              <div className="text-gray-800 font-semibold mt-2 mb-1">{t('financialGoals.title')} / {t('events.title')}:</div>
              {tooltipData.objectives.map((obj, idx) => {
                const IconComponent = getIconComponent(obj.icon)
                const isEvent = obj.icon === 'goal' || obj.icon === 'contribution' || obj.icon === 'event'
                const isObjective = !isEvent
                const value = obj.value
                let color = 'text-red-600'
                if (isEvent && value > 0) color = 'text-green-600'
                if (isEvent && value < 0) color = 'text-red-600'
                if (isObjective) color = 'text-red-600'
                const objCast = obj as Partial<ObjectivePoint & { name?: string; payment_mode?: string }>
                const name = objCast.name || (isEvent ? t('events.form.name') : t('financialGoals.form.name'))
                const parcelasCount = objCast['installment_count']
                const parcelasInterval = objCast['installment_interval']
                const paymentMode = objCast.payment_mode
                const valorParcela = paymentMode === 'installment' && parcelasCount && value ? value / Number(parcelasCount) : null
                let paymentModeLabel = ''
                if (paymentMode === 'installment') paymentModeLabel = t('financialGoals.form.installmentMode')
                if (paymentMode === 'repeat') paymentModeLabel = t('financialGoals.form.repeatMode')
                if (paymentMode === 'none') paymentModeLabel = t('financialGoals.form.noPaymentMode')
                let iconLabel = ''
                if (isObjective) iconLabel = t(`financialGoals.icons.${obj.icon}`) || obj.icon
                else iconLabel = t(`events.icons.${obj.icon}`) || obj.icon
                const date = objCast.date ? formatDate(objCast.date) : ''
                return (
                  <div key={obj.id} className="mb-2 p-2 rounded border border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 16, color: color === 'text-green-600' ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center' }}>
                        <IconComponent size={16} color={color === 'text-green-600' ? '#16a34a' : '#dc2626'} style={{ marginRight: 4 }} />
                        {iconLabel}
                      </span>
                      <span className={`font-bold ${color}`}>{formatCurrency(value, investmentPlan?.currency as CurrencyCode)}</span>
                      <span className="text-xs text-gray-500">{name}</span>
                    </div>
                    {paymentMode === 'installment' && parcelasCount && (
                      <div className="text-xs text-blue-500">{t('financialGoals.form.installmentCount')}: {parcelasCount}x</div>
                    )}
                    {paymentMode === 'installment' && parcelasInterval && (
                      <div className="text-xs text-blue-500">{t('financialGoals.form.installmentInterval')}: {parcelasInterval} {t('common.months')}</div>
                    )}
                    {paymentMode === 'installment' && valorParcela && (
                      <div className="text-xs text-blue-500">{t('financialGoals.form.assetValue')}: {formatCurrency(valorParcela, investmentPlan?.currency as CurrencyCode)}</div>
                    )}
                    {paymentMode === 'repeat' && parcelasCount && (
                      <div className="text-xs text-blue-500">{t('financialGoals.form.repeatCount')}: {parcelasCount}x</div>
                    )}
                    {paymentMode === 'repeat' && parcelasInterval && (
                      <div className="text-xs text-blue-500">{t('financialGoals.form.installmentInterval')}: {parcelasInterval} {t('common.months')}</div>
                    )}
                    {paymentModeLabel && paymentMode !== 'none' && (
                      <div className="text-xs text-gray-500">{t('financialGoals.form.paymentMode')}: {paymentModeLabel}</div>
                    )}
                    {date && (
                      <div className="text-xs text-gray-400">{date}</div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </Tooltip>
      )}

      {/* ChartPointDialog para adicionar evento/objetivo */}
      <ChartPointDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        selectedPoint={selectedPoint}
        currency={currency}
        onSubmitGoal={onSubmitGoal}
        onSubmitEvent={onSubmitEvent}
        onCancel={() => setShowAddModal(false)}
        type="goal"
      />

      {/* Modal de seleção de objetivo */}
      {showSelectObjectiveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
          tabIndex={-1}
          onKeyDown={e => {
            if (e.key === 'Escape') setShowSelectObjectiveModal(false)
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-h-[80vh] overflow-y-auto">
            <div className="font-bold mb-2">{t('financialGoals.title')} / {t('events.title')}:</div>
            <ul className="space-y-2">
              {selectedGroupObjectives.map(obj => {
                const IconComponent = getIconComponent(obj.icon)
                const isEvent = obj.icon === 'goal' || obj.icon === 'contribution' || obj.icon === 'event'
                const isObjective = !isEvent
                const value = obj.value
                let color = 'text-red-600'
                if (isEvent && value > 0) color = 'text-green-600'
                if (isEvent && value < 0) color = 'text-red-600'
                if (isObjective) color = 'text-red-600'
                const objCast = obj as Partial<ObjectivePoint & { name?: string; payment_mode?: string }>
                const name = objCast.name || (isEvent ? t('events.form.name') : t('financialGoals.form.name'))
                const parcelasCount = objCast['installment_count']
                const parcelasInterval = objCast['installment_interval']
                const paymentMode = objCast.payment_mode
                const valorParcela = paymentMode === 'installment' && parcelasCount && value ? value / Number(parcelasCount) : null
                let paymentModeLabel = ''
                if (paymentMode === 'installment') paymentModeLabel = t('financialGoals.form.installmentMode')
                if (paymentMode === 'repeat') paymentModeLabel = t('financialGoals.form.repeatMode')
                if (paymentMode === 'none') paymentModeLabel = t('financialGoals.form.noPaymentMode')
                let iconLabel = ''
                if (isObjective) iconLabel = t(`financialGoals.icons.${obj.icon}`) || obj.icon
                else iconLabel = t(`events.icons.${obj.icon}`) || obj.icon
                const date = objCast.date ? formatDate(objCast.date) : ''
                return (
                  <li key={obj.id}>
                    <button
                      className="w-full text-left p-0 bg-transparent border-none outline-none"
                      onClick={() => {
                        handleEditItem(obj)
                        setShowSelectObjectiveModal(false)
                      }}
                    >
                      <div className="mb-2 p-2 rounded border border-gray-100 bg-gray-50 hover:bg-blue-50 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontSize: 16, color: color === 'text-green-600' ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center' }}>
                            <IconComponent size={16} color={color === 'text-green-600' ? '#16a34a' : '#dc2626'} style={{ marginRight: 4 }} />
                            {iconLabel}
                          </span>
                          <span className={`font-bold ${color}`}>{formatCurrency(value, investmentPlan?.currency as CurrencyCode)}</span>
                          <span className="text-xs text-gray-500">{name}</span>
                        </div>
                        {paymentMode === 'installment' && parcelasCount && (
                          <div className="text-xs text-blue-500">{t('financialGoals.form.installmentCount')}: {parcelasCount}x</div>
                        )}
                        {paymentMode === 'installment' && parcelasInterval && (
                          <div className="text-xs text-blue-500">{t('financialGoals.form.installmentInterval')}: {parcelasInterval} {t('common.months')}</div>
                        )}
                        {paymentMode === 'installment' && valorParcela && (
                          <div className="text-xs text-blue-500">{t('financialGoals.form.assetValue')}: {formatCurrency(valorParcela, investmentPlan?.currency as CurrencyCode)}</div>
                        )}
                        {paymentMode === 'repeat' && parcelasCount && (
                          <div className="text-xs text-blue-500">{t('financialGoals.form.repeatCount')}: {parcelasCount}x</div>
                        )}
                        {paymentMode === 'repeat' && parcelasInterval && (
                          <div className="text-xs text-blue-500">{t('financialGoals.form.installmentInterval')}: {parcelasInterval} {t('common.months')}</div>
                        )}
                        {paymentModeLabel && paymentMode !== 'none' && (
                          <div className="text-xs text-gray-500">{t('financialGoals.form.paymentMode')}: {paymentModeLabel}</div>
                        )}
                        {date && (
                          <div className="text-xs text-gray-400">{date}</div>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
            <button className="mt-4 text-sm text-gray-500" onClick={() => setShowSelectObjectiveModal(false)}>{t('common.cancel')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
