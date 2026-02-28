import { supabase } from '@/lib/supabase'
import type {
  MeetingNote,
  CreateMeetingNoteInput,
  UpdateMeetingNoteInput,
  MeetingNoteActionItem,
} from '../types/meeting-notes'

export interface MeetingNotesFilters {
  fromDate?: string
  toDate?: string
  search?: string
  clientId?: string
  page?: number
  pageSize?: number
}

export interface MeetingNotesPaginatedResult {
  notes: MeetingNote[]
  total: number
}

export class MeetingNotesService {
  static async fetchNotes(
    profileId: string,
    filters?: MeetingNotesFilters
  ): Promise<MeetingNote[]> {
    if (!profileId) return []

    let query = supabase
      .from('meeting_notes')
      .select('*')
      .eq('profile_id', profileId)
      .order('meeting_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (filters?.fromDate) {
      query = query.gte('meeting_date', filters.fromDate)
    }
    if (filters?.toDate) {
      query = query.lte('meeting_date', filters.toDate)
    }
    if (filters?.search?.trim()) {
      const sanitized = filters.search.trim().replace(/%/g, '\\%')
      const term = `%${sanitized}%`
      query = query.or(`title.ilike.${term},content.ilike.${term}`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching meeting notes:', error)
      throw new Error('Failed to fetch meeting notes')
    }

    return (data || []).map(normalizeActionItems)
  }

  /**
   * Fetches meeting notes for the current broker's clients with pagination.
   * RLS restricts results to profiles where broker_id = auth.uid().
   */
  static async fetchNotesForBroker(
    filters?: MeetingNotesFilters
  ): Promise<MeetingNotesPaginatedResult> {
    const page = Math.max(1, filters?.page ?? 1)
    const pageSize = Math.min(50, Math.max(1, filters?.pageSize ?? 12))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('meeting_notes')
      .select('*', { count: 'exact' })
      .order('meeting_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (filters?.clientId) {
      query = query.eq('profile_id', filters.clientId)
    }
    if (filters?.fromDate) {
      query = query.gte('meeting_date', filters.fromDate)
    }
    if (filters?.toDate) {
      query = query.lte('meeting_date', filters.toDate)
    }
    if (filters?.search?.trim()) {
      const sanitized = filters.search.trim().replace(/%/g, '\\%')
      const term = `%${sanitized}%`
      query = query.or(`title.ilike.${term},content.ilike.${term}`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching broker meeting notes:', error)
      throw new Error('Failed to fetch meeting notes')
    }

    return {
      notes: (data || []).map(normalizeActionItems),
      total: count ?? 0,
    }
  }

  static async fetchNoteById(noteId: string): Promise<MeetingNote | null> {
    const { data, error } = await supabase
      .from('meeting_notes')
      .select('*')
      .eq('id', noteId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error('Error fetching meeting note:', error)
      throw new Error('Failed to fetch meeting note')
    }

    return data ? normalizeActionItems(data) : null
  }

  static async createNote(
    input: CreateMeetingNoteInput
  ): Promise<MeetingNote> {
    const { data, error } = await supabase
      .from('meeting_notes')
      .insert([
        {
          profile_id: input.profile_id,
          meeting_date: input.meeting_date,
          title: input.title,
          content: input.content ?? null,
          action_items: (input.action_items || []).map((item) => ({
            id: item.id,
            text: item.text,
            completed: item.completed,
          })),
          participants: input.participants ?? null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating meeting note:', error)
      throw new Error('Failed to create meeting note')
    }

    return normalizeActionItems(data)
  }

  static async updateNote(
    noteId: string,
    input: UpdateMeetingNoteInput
  ): Promise<MeetingNote> {
    const payload: Record<string, unknown> = {}
    if (input.meeting_date !== undefined) payload.meeting_date = input.meeting_date
    if (input.title !== undefined) payload.title = input.title
    if (input.content !== undefined) payload.content = input.content
    if (input.participants !== undefined) payload.participants = input.participants
    if (input.action_items !== undefined) {
      payload.action_items = input.action_items.map((item) => ({
        id: item.id,
        text: item.text,
        completed: item.completed,
      }))
    }

    const { data, error } = await supabase
      .from('meeting_notes')
      .update(payload)
      .eq('id', noteId)
      .select()
      .single()

    if (error) {
      console.error('Error updating meeting note:', error)
      throw new Error('Failed to update meeting note')
    }

    return normalizeActionItems(data)
  }

  static async toggleActionItem(
    noteId: string,
    actionItemId: string,
    completed: boolean
  ): Promise<MeetingNote> {
    const note = await this.fetchNoteById(noteId)
    if (!note) throw new Error('Meeting note not found')

    const updatedItems = note.action_items.map((item) =>
      item.id === actionItemId ? { ...item, completed } : item
    )

    return this.updateNote(noteId, { action_items: updatedItems })
  }

  static async deleteNote(noteId: string): Promise<void> {
    const { error } = await supabase
      .from('meeting_notes')
      .delete()
      .eq('id', noteId)

    if (error) {
      console.error('Error deleting meeting note:', error)
      throw new Error('Failed to delete meeting note')
    }
  }
}

function normalizeActionItems(row: Record<string, unknown>): MeetingNote {
  const raw = row.action_items
  let actionItems: MeetingNoteActionItem[] = []
  if (Array.isArray(raw)) {
    actionItems = raw.map((item: unknown) => {
      const o = item as Record<string, unknown>
      return {
        id: String(o.id ?? crypto.randomUUID()),
        text: String(o.text ?? ''),
        completed: Boolean(o.completed),
      }
    })
  }

  return {
    id: row.id as string,
    profile_id: row.profile_id as string,
    meeting_date: row.meeting_date as string,
    title: row.title as string,
    content: (row.content as string | null) ?? null,
    action_items: actionItems,
    participants: (row.participants as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}
