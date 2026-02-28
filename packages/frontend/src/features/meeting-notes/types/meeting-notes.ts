export interface MeetingNoteActionItem {
  id: string
  text: string
  completed: boolean
}

export interface MeetingNote {
  id: string
  profile_id: string
  meeting_date: string
  title: string
  content: string | null
  action_items: MeetingNoteActionItem[]
  participants: string | null
  created_at: string
  updated_at: string
}

export interface CreateMeetingNoteInput {
  profile_id: string
  meeting_date: string
  title: string
  content?: string | null
  action_items?: MeetingNoteActionItem[]
  participants?: string | null
}

export interface UpdateMeetingNoteInput {
  meeting_date?: string
  title?: string
  content?: string | null
  action_items?: MeetingNoteActionItem[]
  participants?: string | null
}
