import { Goal, ProjectedEvent, FinancialRecordLink } from '@/types/financial';

// Constantes para controle de processamento de financial_links
export const IGNORE_FINANCIAL_LINKS = true;  // Para cálculos planejados (cenário ideal)
export const CONSIDER_FINANCIAL_LINKS = false; // Para cálculos projetados (realidade atual)

export interface ProcessedGoalEvent {
  id: string;
  type: 'goal' | 'event';
  amount: number;
  month: number;
  year: number;
  status: string;
  payment_mode?: 'none' | 'installment' | 'repeat';
  installment_count?: number;
  installment_interval?: number;
  description?: string;
  name?: string;
  adjust_for_inflation: boolean;
}

/**
 * Calcula o valor restante considerando os financial_links
 */
function calculateRemainingAmount(
  item: Goal | ProjectedEvent,
  financialLinks?: FinancialRecordLink[]
): number {
  if (!financialLinks || financialLinks.length === 0) {
    return item.asset_value;
  }

  // Para goals, os links são negativos (representam gastos já realizados)
  // Para events, os links podem ser positivos ou negativos
  const totalPaid = financialLinks.reduce((sum, link) => {
    if (item.type === 'goal') {
      // Goals: links negativos representam gastos já realizados
      return sum + Math.abs(link.allocated_amount);
    } else {
      // Events: links refletem o valor real (positivo ou negativo)
      return sum + Math.abs(link.allocated_amount);
    }
  }, 0);

  // Retorna o valor restante (não pode ser negativo)
  return Math.max(0, item.asset_value - totalPaid);
}

/**
 * Processa um item (goal ou event) em parcelas se necessário, considerando financial_links
 */
export function processItem<T extends Goal | ProjectedEvent>(
  item: T,
  type: 'goal' | 'event',
  ignoreFinancialLinks: boolean = false
): ProcessedGoalEvent[] {
  const remainingAmount = ignoreFinancialLinks 
    ? item.asset_value 
    : calculateRemainingAmount(item, item.financial_links);
  
  // Se já foi totalmente pago/realizado, não processa
  if (remainingAmount <= 0) {
    return [];
  }

  const baseItem = {
    id: item.id,
    type: type,
    amount: remainingAmount, // Usa o valor restante
    year: item.year,
    month: item.month,
    description: item.icon,
    name: item.name,
    status: item.status,
    adjust_for_inflation: item.adjust_for_inflation !== false
  };

  if (item.payment_mode === 'none' || !item.installment_count) {
    return [baseItem];
  }

  // Para modo repeat, cada repetição tem o valor completo
  if (item.payment_mode === 'repeat') {
    const totalPaid = ignoreFinancialLinks 
      ? 0 
      : item.financial_links?.reduce((sum, link) => sum + Math.abs(link.allocated_amount), 0) || 0;
    const paidRepetitions = Math.floor(totalPaid / item.asset_value);
    const remainingRepetitions = item.installment_count - paidRepetitions;

    // Se todas as repetições foram pagas, não retorna nada
    if (remainingRepetitions <= 0) {
      return [];
    }

    return Array.from({ length: remainingRepetitions }, (_, index) => {
      const interval = item.installment_interval || 1;
      const repetitionIndex = paidRepetitions + index;
      const totalMonths = item.month + (repetitionIndex * interval);
      const yearOffset = Math.floor((totalMonths - 1) / 12);
      const month = ((totalMonths - 1) % 12) + 1;
      
      return {
        id: item.id,
        type: type,
        year: item.year + yearOffset,
        payment_mode: item.payment_mode,
        installment_count: item.installment_count,
        installment_interval: item.installment_interval,
        month: month,
        amount: item.asset_value, // Valor completo para cada repetição
        description: `${item.icon} (${repetitionIndex + 1}/${item.installment_count})`,
        status: item.status,
        adjust_for_inflation: item.adjust_for_inflation !== false
      };
    });
  }

  // Para parcelamento (installment), calcula quantas parcelas ainda precisam ser pagas
  const totalPaid = ignoreFinancialLinks 
    ? 0 
    : item.financial_links?.reduce((sum, link) => sum + Math.abs(link.allocated_amount), 0) || 0;
  const installmentValue = item.asset_value / item.installment_count;
  const paidInstallments = Math.floor(totalPaid / installmentValue);
  const remainingInstallments = item.installment_count - paidInstallments;

  // Se todas as parcelas foram pagas, não retorna nada
  if (remainingInstallments <= 0) {
    return [];
  }

  // Calcula o valor da primeira parcela restante (pode ser parcial)
  const firstRemainingInstallmentValue = remainingAmount - (remainingInstallments - 1) * installmentValue;

  return Array.from({ length: remainingInstallments }, (_, index) => {
    const interval = item.installment_interval || 1;
    const installmentIndex = paidInstallments + index;
    const totalMonths = item.month + (installmentIndex * interval);
    const yearOffset = Math.floor((totalMonths - 1) / 12);
    const month = ((totalMonths - 1) % 12) + 1;
    
    // Primeira parcela restante pode ter valor parcial
    const amount = index === 0 ? firstRemainingInstallmentValue : installmentValue;
    
    return {
      id: item.id,
      type: type,
      year: item.year + yearOffset,
      payment_mode: item.payment_mode,
      installment_count: item.installment_count,
      installment_interval: item.installment_interval,
      month: month,
      amount: amount,
      description: `${item.icon} (${installmentIndex + 1}/${item.installment_count})`,
      status: item.status,
      adjust_for_inflation: item.adjust_for_inflation !== false
    };
  });
}

/**
 * Processa goals para cálculos financeiros, considerando financial_links
 */
export function processGoalsForChart(goals: Goal[], ignoreFinancialLinks: boolean = false): ProcessedGoalEvent[] {
  return goals.flatMap(item => processItem(item, 'goal', ignoreFinancialLinks));
}

/**
 * Processa events para cálculos financeiros, considerando financial_links
 */
export function processEventsForChart(events: ProjectedEvent[], ignoreFinancialLinks: boolean = false): ProcessedGoalEvent[] {
  return events.flatMap(item => processItem(item, 'event', ignoreFinancialLinks));
} 