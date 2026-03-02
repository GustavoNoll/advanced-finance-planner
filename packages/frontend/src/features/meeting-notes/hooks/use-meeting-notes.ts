import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/shared/components/ui/use-toast'
import { MeetingNotesService, MeetingNotesFilters } from '../services/meeting-notes.service'
import type {
  MeetingNote,
  CreateMeetingNoteInput,
  UpdateMeetingNoteInput,
} from '../types/meeting-notes'

function getMeetingNotesFiltersKey(filters?: MeetingNotesFilters) {
  return [
    filters?.page ?? 1,
    filters?.pageSize ?? 12,
    filters?.search?.trim() ?? '',
    filters?.clientId ?? '',
    filters?.fromDate ?? '',
    filters?.toDate ?? '',
  ] as const
}

export function useMeetingNotes(profileId: string, filters?: MeetingNotesFilters) {
  const filtersKey = getMeetingNotesFiltersKey(filters)

  const { data: notes, isLoading, error } = useQuery({
    queryKey: ['meetingNotes', profileId, ...filtersKey],
    queryFn: () => MeetingNotesService.fetchNotes(profileId, filters),
    enabled: !!profileId,
  })

  return {
    notes: notes ?? [],
    isLoading,
    error,
  }
}

export function useBrokerMeetingNotes(filters?: MeetingNotesFilters) {
  const filtersKey = getMeetingNotesFiltersKey(filters)

  const { data, isLoading, error } = useQuery({
    queryKey: ['meetingNotes', 'broker', ...filtersKey],
    queryFn: () => MeetingNotesService.fetchNotesForBroker(filters),
  })

  return {
    notes: data?.notes ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
  }
}

export function useMeetingNote(noteId: string | null) {
  const { data: note, isLoading, error } = useQuery({
    queryKey: ['meetingNote', noteId],
    queryFn: () => (noteId ? MeetingNotesService.fetchNoteById(noteId) : null),
    enabled: !!noteId,
  })

  return {
    note: note ?? null,
    isLoading,
    error,
  }
}

export function useMeetingNoteMutations(
  profileId: string,
  t: (key: string) => string,
  onSuccessCallback?: () => void
) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createNote = useMutation({
    mutationFn: (input: Omit<CreateMeetingNoteInput, 'profile_id'>) =>
      MeetingNotesService.createNote({ ...input, profile_id: profileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingNotes'] })
      toast({
        title: t('common.success'),
        description: t('meetingNotes.createSuccess'),
      })
      onSuccessCallback?.()
    },
    onError: (err) => {
      console.error('Error creating meeting note:', err)
      toast({
        title: t('common.error'),
        description: t('meetingNotes.createError'),
        variant: 'destructive',
      })
    },
  })

  const updateNote = useMutation({
    mutationFn: ({
      noteId,
      input,
    }: { noteId: string; input: UpdateMeetingNoteInput }) =>
      MeetingNotesService.updateNote(noteId, input),
    onSuccess: (updated: MeetingNote) => {
      queryClient.invalidateQueries({ queryKey: ['meetingNotes'] })
      queryClient.invalidateQueries({ queryKey: ['meetingNote', updated.id] })
      toast({
        title: t('common.success'),
        description: t('meetingNotes.updateSuccess'),
      })
      onSuccessCallback?.()
    },
    onError: (err) => {
      console.error('Error updating meeting note:', err)
      toast({
        title: t('common.error'),
        description: t('meetingNotes.updateError'),
        variant: 'destructive',
      })
    },
  })

  const deleteNote = useMutation({
    mutationFn: (noteId: string) => MeetingNotesService.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingNotes'] })
      toast({
        title: t('common.success'),
        description: t('meetingNotes.deleteSuccess'),
      })
      onSuccessCallback?.()
    },
    onError: (err) => {
      console.error('Error deleting meeting note:', err)
      toast({
        title: t('common.error'),
        description: t('meetingNotes.deleteError'),
        variant: 'destructive',
      })
    },
  })

  const toggleActionItem = useMutation({
    mutationFn: ({
      noteId,
      actionItemId,
      completed,
    }: {
      noteId: string
      actionItemId: string
      completed: boolean
    }) =>
      MeetingNotesService.toggleActionItem(noteId, actionItemId, completed),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['meetingNotes'] })
      queryClient.invalidateQueries({ queryKey: ['meetingNote', updated.id] })
    },
    onError: (err) => {
      console.error('Error toggling action item:', err)
    },
  })

  return {
    createNote,
    updateNote,
    deleteNote,
    toggleActionItem,
  }
}
