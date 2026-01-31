import { supabase } from '@/lib/supabase'
import { createDateWithoutTimezone } from '@/utils/dateUtils'
import { Goal, ProjectedEvent } from '@/types/financial'

export interface GoalsAndEvents {
  goals: Goal[]
  events: ProjectedEvent[]
}

export interface Counters {
  goals: number
  events: number
}

export class GoalsEventsService {
  /**
   * Cria uma meta ou evento
   */
  static async createItem(
    itemType: 'goal' | 'event',
    payload: {
      profile_id: string
      name: string
      icon: string
      asset_value: number
      month: number
      year: number
      status?: string
      payment_mode?: 'none' | 'installment' | 'repeat'
      installment_count?: number | null
      installment_interval?: number | null
    }
  ): Promise<Goal | ProjectedEvent> {
    const table = itemType === 'goal' ? 'financial_goals' : 'events'
    const defaulted = {
      status: 'pending',
      payment_mode: 'none',
      installment_count: null,
      installment_interval: null,
      ...payload
    }

    const { data, error } = await supabase
      .from(table)
      .insert([defaulted])
      .select()
      .single()

    if (error) throw error
    // Ensure type property on return for consumer convenience
    const created = data as Goal | ProjectedEvent
    return { ...created, type: itemType } as Goal | ProjectedEvent
  }
  /**
   * Busca contadores de metas e eventos
   */
  static async fetchCounters(userId: string): Promise<Counters> {
    if (!userId) return { goals: 0, events: 0 }
    
    const today = createDateWithoutTimezone(new Date())
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

    // Buscar links financeiros para todas as metas e eventos
    const goalIds = (goalsResponse.data || []).map(goal => goal.id)
    const eventIds = (eventsResponse.data || []).map(event => event.id)

    const [goalLinksResponse, eventLinksResponse] = await Promise.all([
      supabase
        .from('financial_record_links')
        .select('*')
        .in('item_id', goalIds)
        .eq('item_type', 'goal'),
      supabase
        .from('financial_record_links')
        .select('*')
        .in('item_id', eventIds)
        .eq('item_type', 'event')
    ])

    if (goalLinksResponse.error) {
      console.error('Error fetching goal links:', goalLinksResponse.error)
    }

    if (eventLinksResponse.error) {
      console.error('Error fetching event links:', eventLinksResponse.error)
    }

    const goalLinks = goalLinksResponse.data || []
    const eventLinks = eventLinksResponse.data || []

    // Combinar metas com seus links financeiros
    const goalsWithLinks = (goalsResponse.data || []).map(goal => {
      const links = goalLinks.filter(link => link.item_id === goal.id)
      
      return {
        ...goal,
        financial_links: links
      }
    })

    // Combinar eventos com seus links financeiros
    const eventsWithLinks = (eventsResponse.data || []).map(event => {
      const links = eventLinks.filter(link => link.item_id === event.id)
      
      return {
        ...event,
        financial_links: links
      }
    })

    return {
      goals: goalsWithLinks,
      events: eventsWithLinks
    }
  }

  /**
   * Busca apenas metas de um usuário
   */
  static async fetchGoals(userId: string): Promise<Goal[]> {
    if (!userId) return []

    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('profile_id', userId)

    if (error) {
      console.error('Error fetching goals:', error)
      throw new Error('Failed to fetch goals')
    }

    if (!data || data.length === 0) return []

    const goalIds = data.map(goal => goal.id)
    
    const { data: links, error: linksError } = await supabase
      .from('financial_record_links')
      .select('*')
      .in('item_id', goalIds)
      .eq('item_type', 'goal')

    if (linksError) {
      console.error('Error fetching goal links:', linksError)
    }

    const goalLinks = links || []

    return data.map(goal => {
      const links = goalLinks.filter(link => link.item_id === goal.id)
      
      return {
        ...goal,
        financial_links: links
      }
    })
  }

  /**
   * Busca apenas eventos de um usuário
   */
  static async fetchEvents(userId: string): Promise<ProjectedEvent[]> {
    if (!userId) return []

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('profile_id', userId)

    if (error) {
      console.error('Error fetching events:', error)
      throw new Error('Failed to fetch events')
    }

    if (!data || data.length === 0) return []

    const eventIds = data.map(event => event.id)
    
    const { data: links, error: linksError } = await supabase
      .from('financial_record_links')
      .select('*')
      .in('item_id', eventIds)
      .eq('item_type', 'event')

    if (linksError) {
      console.error('Error fetching event links:', linksError)
    }

    const eventLinks = links || []

    return data.map(event => {
      const links = eventLinks.filter(link => link.item_id === event.id)
      
      return {
        ...event,
        financial_links: links
      }
    })
  }
}
