import { MicroInvestmentPlan } from '@/types/financial';
import { createDateWithoutTimezone } from '@/utils/dateUtils';

/**
 * Encontra o micro plano ativo em uma data específica
 * @param microPlans Array de micro planos
 * @param targetDate Data alvo para encontrar o micro plano ativo
 * @returns Micro plano ativo para a data ou null se não houver
 */
export function getActiveMicroPlanForDate(microPlans: MicroInvestmentPlan[], targetDate: Date): MicroInvestmentPlan | null {
  if (!microPlans || microPlans.length === 0) {
    return null;
  }

  // Normalizar a data alvo para o primeiro dia do mês (ignorar o dia)
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();

  // Ordenar micro planos por data de vigência (mais recente primeiro)
  const sortedMicroPlans = [...microPlans].sort((a, b) =>
    new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime()
  );

  // Encontrar o micro plano ativo para a data
  for (const microPlan of sortedMicroPlans) {
    const effectiveDate = createDateWithoutTimezone(microPlan.effective_date);
    const effectiveYear = effectiveDate.getFullYear();
    const effectiveMonth = effectiveDate.getMonth();

    // Se a data de vigência for anterior ou igual à data alvo, este é o micro plano ativo
    if (effectiveYear < targetYear || (effectiveYear === targetYear && effectiveMonth <= targetMonth)) {
      return microPlan;
    }
  }

  // Se nenhum micro plano for encontrado, retornar o mais antigo
  return sortedMicroPlans[sortedMicroPlans.length - 1] || null;
}
