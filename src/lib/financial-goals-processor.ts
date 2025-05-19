import { Goal, ProjectedEvent, MonthNumber } from '@/types/financial';

export interface ProcessedGoalEvent {
  id: string;
  type: 'goal' | 'event';
  amount: number;
  month: number;
  year: number;
  payment_mode?: 'none' | 'installment' | 'repeat';
  installment_count?: number;
  installment_interval?: number;
  description?: string;
  name?: string;
}

/**
 * Processes a single item (goal or event) into installments if needed
 */
export function processItem<T extends Goal | ProjectedEvent>(
  item: T,
  type: 'goal' | 'event'
): ProcessedGoalEvent[] {
  const baseItem = {
    id: item.id,
    type: type,
    amount: item.asset_value,
    year: item.year,
    month: item.month,
    description: item.icon,
    name: item.name
  };

  if (item.payment_mode === 'none' || !item.installment_count) {
    return [baseItem];
  }

  return Array.from({ length: item.installment_count }, (_, index) => {
    const interval = item.installment_interval || 1;
    const totalMonths = item.month + (index * interval);
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
      amount: item.payment_mode === 'repeat' ? item.asset_value : item.asset_value / item.installment_count,
      description: `${item.icon} (${index + 1}/${item.installment_count})`
    };
  });
}

/**
 * Processes goals for financial calculations
 */
export function processGoalsForChart(goals: Goal[]): ProcessedGoalEvent[] {
  return goals.flatMap(item => processItem(item, 'goal'));
}

/**
 * Processes events for financial calculations
 */
export function processEventsForChart(events: ProjectedEvent[]): ProcessedGoalEvent[] {
  return events.flatMap(item => processItem(item, 'event'));
} 