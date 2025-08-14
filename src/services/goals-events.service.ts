import { supabase } from '@/lib/supabase'

export interface GoalsAndEvents {
  goals: any[]
  events: any[]
}

export interface Counters {
  goals: number
  events: number
}

export class GoalsEventsService {
  /**
   * Busca contadores de metas e eventos
   */
  static async fetchCounters(userId: string): Promise<Counters> {
    if (!userId) return { goals: 0, events: 0 }
    
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1

    const [goalsResponse, eventsResponse] = await Promise.all([
      supabase
        .from('financial_goals')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', userId)
        .or(`year.gt.${currentYear},and(year.eq.${currentYear},month.gte.${currentMonth})`),
      supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', userId)
    ])

    if (goalsResponse.error) {
      console.error('Error fetching goals count:', goalsResponse.error)
    }

    if (eventsResponse.error) {
      console.error('Error fetching events count:', eventsResponse.error)
    }

    return {
      goals: goalsResponse.count || 0,
      events: eventsResponse.count || 0
    }
  }

  /**
   * Busca metas e eventos de um usuário
   */
  static async fetchGoalsAndEvents(userId: string): Promise<GoalsAndEvents> {
    if (!userId) return { goals: [], events: [] }

    const [goalsResponse, eventsResponse] = await Promise.all([
      supabase
        .from('financial_goals')
        .select('*')
        .eq('profile_id', userId),
      supabase
        .from('events')
        .select('*')
        .eq('profile_id', userId)
    ])

    if (goalsResponse.error) {
      console.error('Error fetching goals:', goalsResponse.error)
      throw new Error('Failed to fetch goals')
    }

    if (eventsResponse.error) {
      console.error('Error fetching events:', eventsResponse.error)
      throw new Error('Failed to fetch events')
    }

    return {
      goals: goalsResponse.data || [],
      events: eventsResponse.data || []
    }
  }

  /**
   * Busca apenas metas de um usuário
   */
  static async fetchGoals(userId: string): Promise<any[]> {
    if (!userId) return []

    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('profile_id', userId)

    if (error) {
      console.error('Error fetching goals:', error)
      throw new Error('Failed to fetch goals')
    }

    return data || []
  }

  /**
   * Busca apenas eventos de um usuário
   */
  static async fetchEvents(userId: string): Promise<any[]> {
    if (!userId) return []

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('profile_id', userId)

    if (error) {
      console.error('Error fetching events:', error)
      throw new Error('Failed to fetch events')
    }

    return data || []
  }

  /**
   * Filtra metas por período
   */
  static filterGoalsByPeriod(goals: any[], period: 'all' | '6m' | '12m' | '24m'): any[] {
    if (period === 'all') return goals

    const currentDate = new Date()
    const months = parseInt(period)
    const cutoffDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - months,
      1
    )

    return goals.filter(goal => {
      const goalDate = new Date(goal.year, goal.month - 1, 1)
      return goalDate >= cutoffDate
    })
  }

  /**
   * Filtra eventos por período
   */
  static filterEventsByPeriod(events: any[], period: 'all' | '6m' | '12m' | '24m'): any[] {
    if (period === 'all') return events

    const currentDate = new Date()
    const months = parseInt(period)
    const cutoffDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - months,
      1
    )

    return events.filter(event => {
      const eventDate = new Date(event.year, event.month - 1, 1)
      return eventDate >= cutoffDate
    })
  }
}
