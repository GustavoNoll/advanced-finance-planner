import { supabase } from '@/lib/supabase'
import { Goal, ProjectedEvent, FinancialItemFormValues } from '@/types/financial'

export interface GoalsEventsFilters {
  status?: 'pending' | 'completed' | 'all'
  year?: number
  month?: number
}

export class GoalsEventsManagementService {
  /**
   * Busca todas as metas de um usuário
   */
  static async fetchGoals(userId: string): Promise<Goal[]> {
    if (!userId) return []

    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('profile_id', userId)
      .order('year', { ascending: true })
      .order('month', { ascending: true })

    if (error) {
      console.error('Error fetching goals:', error)
      throw new Error('Failed to fetch goals')
    }

    return data || []
  }

  /**
   * Busca todos os eventos de um usuário
   */
  static async fetchEvents(userId: string): Promise<ProjectedEvent[]> {
    if (!userId) return []

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('profile_id', userId)
      .order('year', { ascending: true })
      .order('month', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      throw new Error('Failed to fetch events')
    }

    return data || []
  }

  /**
   * Cria uma nova meta
   */
  static async createGoal(userId: string, values: FinancialItemFormValues): Promise<Goal> {
    if (!userId) throw new Error('User ID is required')

    const assetValue = parseFloat(values.asset_value.replace(/[^\d.,-]/g, '').replace(',', '.'))
    
    const { data, error } = await supabase.from('financial_goals').insert([
      {
        profile_id: userId,
        name: values.name,
        icon: values.icon,
        asset_value: assetValue,
        month: parseInt(values.month),
        year: parseInt(values.year),
        status: 'pending',
        payment_mode: values.payment_mode,
        installment_count: values.installment_count ? parseInt(values.installment_count) : null,
        installment_interval: values.installment_interval ? parseInt(values.installment_interval) : null,
        adjust_for_inflation: values.adjust_for_inflation ?? true,
      },
    ])

    if (error) {
      console.error('Error creating goal:', error)
      throw new Error('Failed to create goal')
    }

    return data?.[0]
  }

  /**
   * Cria um novo evento
   */
  static async createEvent(userId: string, values: FinancialItemFormValues): Promise<ProjectedEvent> {
    if (!userId) throw new Error('User ID is required')

    const assetValue = parseFloat(values.asset_value.replace(/[^\d.,-]/g, '').replace(',', '.'))
    
    const { data, error } = await supabase.from('events').insert([
      {
        profile_id: userId,
        name: values.name,
        icon: values.icon,
        asset_value: assetValue,
        month: parseInt(values.month),
        year: parseInt(values.year),
        status: 'pending',
        payment_mode: values.payment_mode,
        installment_count: values.installment_count ? parseInt(values.installment_count) : null,
        installment_interval: values.installment_interval ? parseInt(values.installment_interval) : null,
        adjust_for_inflation: values.adjust_for_inflation ?? true,
      },
    ])

    if (error) {
      console.error('Error creating event:', error)
      throw new Error('Failed to create event')
    }

    return data?.[0]
  }

  /**
   * Atualiza uma meta existente
   */
  static async updateGoal(goalId: string, values: FinancialItemFormValues): Promise<Goal> {
    if (!goalId) throw new Error('Goal ID is required')

    const assetValue = parseFloat(values.asset_value.replace(/[^\d.,-]/g, '').replace(',', '.'))
    
    const { data, error } = await supabase
      .from('financial_goals')
      .update({
        name: values.name,
        icon: values.icon,
        asset_value: assetValue,
        month: parseInt(values.month),
        year: parseInt(values.year),
        payment_mode: values.payment_mode,
        installment_count: values.installment_count ? parseInt(values.installment_count) : null,
        installment_interval: values.installment_interval ? parseInt(values.installment_interval) : null,
        adjust_for_inflation: values.adjust_for_inflation ?? true,
      })
      .eq('id', goalId)
      .select()

    if (error) {
      console.error('Error updating goal:', error)
      throw new Error('Failed to update goal')
    }

    return data?.[0]
  }

  /**
   * Atualiza um evento existente
   */
  static async updateEvent(eventId: string, values: FinancialItemFormValues): Promise<ProjectedEvent> {
    if (!eventId) throw new Error('Event ID is required')

    const assetValue = parseFloat(values.asset_value.replace(/[^\d.,-]/g, '').replace(',', '.'))
    
    const { data, error } = await supabase
      .from('events')
      .update({
        name: values.name,
        icon: values.icon,
        asset_value: assetValue,
        month: parseInt(values.month),
        year: parseInt(values.year),
        payment_mode: values.payment_mode,
        installment_count: values.installment_count ? parseInt(values.installment_count) : null,
        installment_interval: values.installment_interval ? parseInt(values.installment_interval) : null,
        adjust_for_inflation: values.adjust_for_inflation ?? true,
      })
      .eq('id', eventId)
      .select()

    if (error) {
      console.error('Error updating event:', error)
      throw new Error('Failed to update event')
    }

    return data?.[0]
  }

  /**
   * Remove uma meta
   */
  static async deleteGoal(goalId: string): Promise<void> {
    if (!goalId) throw new Error('Goal ID is required')

    const { error } = await supabase
      .from('financial_goals')
      .delete()
      .eq('id', goalId)

    if (error) {
      console.error('Error deleting goal:', error)
      throw new Error('Failed to delete goal')
    }
  }

  /**
   * Remove um evento
   */
  static async deleteEvent(eventId: string): Promise<void> {
    if (!eventId) throw new Error('Event ID is required')

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      console.error('Error deleting event:', error)
      throw new Error('Failed to delete event')
    }
  }

  /**
   * Altera o status de uma meta
   */
  static async toggleGoalStatus(goalId: string, status: 'pending' | 'completed'): Promise<void> {
    if (!goalId) throw new Error('Goal ID is required')

    const { error } = await supabase
      .from('financial_goals')
      .update({ status })
      .eq('id', goalId)

    if (error) {
      console.error('Error toggling goal status:', error)
      throw new Error('Failed to toggle goal status')
    }
  }

  /**
   * Altera o status de um evento
   */
  static async toggleEventStatus(eventId: string, status: 'pending' | 'completed'): Promise<void> {
    if (!eventId) throw new Error('Event ID is required')

    const { error } = await supabase
      .from('events')
      .update({ status })
      .eq('id', eventId)

    if (error) {
      console.error('Error toggling event status:', error)
      throw new Error('Failed to toggle event status')
    }
  }

  /**
   * Filtra metas por status
   */
  static filterGoalsByStatus(goals: Goal[], status: 'pending' | 'completed' | 'all'): Goal[] {
    if (status === 'all') return goals
    return goals.filter(goal => goal.status === status)
  }

  /**
   * Filtra eventos por status
   */
  static filterEventsByStatus(events: ProjectedEvent[], status: 'pending' | 'completed' | 'all'): ProjectedEvent[] {
    if (status === 'all') return events
    return events.filter(event => event.status === status)
  }

  /**
   * Calcula estatísticas das metas
   */
  static calculateGoalsStats(goals: Goal[]) {
    const total = goals.length
    const pending = goals.filter(goal => goal.status === 'pending').length
    const completed = goals.filter(goal => goal.status === 'completed').length
    const totalValue = goals.reduce((sum, goal) => sum + goal.asset_value, 0)
    const pendingValue = goals
      .filter(goal => goal.status === 'pending')
      .reduce((sum, goal) => sum + goal.asset_value, 0)
    const completedValue = goals
      .filter(goal => goal.status === 'completed')
      .reduce((sum, goal) => sum + goal.asset_value, 0)

    return {
      total,
      pending,
      completed,
      totalValue,
      pendingValue,
      completedValue,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    }
  }

  /**
   * Calcula estatísticas dos eventos
   */
  static calculateEventsStats(events: ProjectedEvent[]) {
    const total = events.length
    const pending = events.filter(event => event.status === 'pending').length
    const completed = events.filter(event => event.status === 'completed').length
    const totalValue = events.reduce((sum, event) => sum + event.asset_value, 0)
    const pendingValue = events
      .filter(event => event.status === 'pending')
      .reduce((sum, event) => sum + event.asset_value, 0)
    const completedValue = events
      .filter(event => event.status === 'completed')
      .reduce((sum, event) => sum + event.asset_value, 0)

    return {
      total,
      pending,
      completed,
      totalValue,
      pendingValue,
      completedValue,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    }
  }
}
