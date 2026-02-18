import type { LifeProfile, LifeSettings, ProjectionResult } from '@/modules/core/domain/life-types'
import { formatCurrency, type CurrencyCode } from '@/lib/format-currency'

export type InsightType = 'danger' | 'warning' | 'success' | 'info'

export interface LifeInsight {
  id: string
  type: InsightType
  title: string
  description: string
}

export function getLifeInsights(
  projection: ProjectionResult,
  profile: LifeProfile,
  settings: LifeSettings,
  currency: CurrencyCode = 'BRL'
): LifeInsight[] {
  const insights: LifeInsight[] = []
  const { monthly, firstMonthWithZeroOrNegativeNetWorth } = projection
  const monthlyContribution = Math.max(0, settings.baseMonthlyIncome - settings.baseMonthlyExpenses)

  if (firstMonthWithZeroOrNegativeNetWorth !== null) {
    const point = monthly[firstMonthWithZeroOrNegativeNetWorth]
    const dateLabel = point
      ? point.date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      : ''
    insights.push({
      id: 'dinheiro-insuficiente',
      type: 'danger',
      title: 'Dinheiro insuficiente',
      description: `Na projeção, o patrimônio atinge zero ou fica negativo${dateLabel ? ` em ${dateLabel}` : ''}. Ajuste renda, gastos ou eventos para evitar esse cenário.`,
    })
  }

  if (settings.baseMonthlyExpenses > settings.baseMonthlyIncome) {
    insights.push({
      id: 'gastos-maior-renda',
      type: 'warning',
      title: 'Gastos superam a renda',
      description: 'Seus gastos mensais são maiores que a renda. Não há margem para investimentos; o patrimônio tende a cair. Considere reduzir gastos ou aumentar a renda.',
    })
  }

  if (monthly.length > 0 && monthlyContribution > 0) {
    const income = settings.baseMonthlyIncome
    const pct = Math.round((monthlyContribution / income) * 100)
    if (pct >= 10 && pct <= 50) {
      insights.push({
        id: 'margem-investimento',
        type: 'info',
        title: 'Margem para investir',
        description: `${pct}% da sua renda vai para investimentos (renda − gastos). Boa capacidade de acumulação.`,
      })
    } else if (pct > 50) {
      insights.push({
        id: 'margem-alta',
        type: 'success',
        title: 'Alta capacidade de poupança',
        description: `${pct}% da sua renda vira aporte. Você pode antecipar metas ou aumentar o padrão de gastos com folga.`,
      })
    }
  }

  const last = monthly[monthly.length - 1]
  if (last && firstMonthWithZeroOrNegativeNetWorth === null && last.netWorth > 0) {
    const yearsOfContributions = 10
    const roughContributions = monthlyContribution * 12 * yearsOfContributions
    if (last.netWorth > roughContributions * 2) {
      insights.push({
        id: 'sobra-no-fim',
        type: 'success',
        title: 'Sobra dinheiro ao final',
        description: `Ao final da projeção sobrariam ${formatCurrency(last.netWorth, currency)}. Você poderia aposentar mais cedo, aumentar gastos ao longo do tempo ou planejar herança/doações.`,
      })
    }
  }

  const retirementAge = settings.retirementAge ?? 65
  const retirementIncome = settings.retirementMonthlyIncome ?? 0

  // Insight: valor nominal vs real no início da aposentadoria
  const retirementMonthIndex = monthly.findIndex(p => p.age >= retirementAge)
  if (retirementMonthIndex >= 0) {
    const atRetirement = monthly[retirementMonthIndex]
    const nominal = atRetirement.netWorth
    const real = atRetirement.realNetWorth
    const dateLabel = atRetirement.date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    insights.push({
      id: 'aposentadoria-nominal-real',
      type: 'info',
      title: 'Patrimônio na aposentadoria: nominal vs real',
      description: `No início da aposentadoria (${dateLabel}, aos ${retirementAge} anos), o patrimônio projetado é ${formatCurrency(nominal, currency)} em valores nominais e ${formatCurrency(real, currency)} em valores reais (poder de compra de hoje). A diferença reflete a inflação acumulada até lá.`,
    })
  }

  if (retirementIncome > 0 && settings.baseMonthlyExpenses > 0) {
    const coverage = Math.round((retirementIncome / settings.baseMonthlyExpenses) * 100)
    if (coverage < 80) {
      insights.push({
        id: 'aposentadoria-cobertura',
        type: 'warning',
        title: 'Renda na aposentadoria',
        description: `Na aposentadoria (a partir dos ${retirementAge} anos), a renda projetada cobre cerca de ${coverage}% dos gastos atuais. O restante virá do patrimônio acumulado. Acompanhe se o valor acumulado é suficiente.`,
      })
    } else if (coverage >= 100) {
      insights.push({
        id: 'aposentadoria-confortavel',
        type: 'info',
        title: 'Aposentadoria coberta',
        description: `Sua renda na aposentadoria cobre os gastos projetados (${coverage}% ou mais). O patrimônio pode servir como reserva ou para desejos extras.`,
      })
    }
  }

  if (monthly.length > 12) {
    let maxReal = monthly[0].realNetWorth
    for (let i = 1; i < monthly.length; i++) {
      if (monthly[i].realNetWorth > maxReal) maxReal = monthly[i].realNetWorth
    }
    if (last && last.realNetWorth < maxReal * 0.9) {
      insights.push({
        id: 'patrimonio-real-cai',
        type: 'warning',
        title: 'Poder de compra do patrimônio',
        description: 'Em parte da projeção, o patrimônio em termos reais (descontada a inflação) tende a cair. Isso pode ser esperado após aposentadoria; verifique se o ritmo de uso está adequado.',
      })
    }
  }

  if (settings.baseNetWorth <= 0 && monthlyContribution > 0 && firstMonthWithZeroOrNegativeNetWorth === null) {
    insights.push({
      id: 'comecando-do-zero',
      type: 'info',
      title: 'Começando a acumular',
      description: 'Você está partindo de patrimônio zero ou negativo. Com aportes regulares e retorno positivo, o patrimônio tende a crescer ao longo do tempo.',
    })
  }

  return insights
}
