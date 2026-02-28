import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/shared/components/ui/spinner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { Plus, Search } from 'lucide-react'
import {
  MeetingNotesHeader,
  MeetingNoteCard,
  MeetingNoteForm,
  MeetingNoteDetail,
  MeetingNotesEmpty,
} from '@/features/meeting-notes/components'
import { useMeetingNotes, useMeetingNoteMutations } from '@/features/meeting-notes/hooks/use-meeting-notes'
import type { MeetingNoteActionItem } from '@/features/meeting-notes/types/meeting-notes'

export function MeetingNotes() {
  const { id: profileId } = useParams()
  const { t } = useTranslation()
  const { user } = useAuth()

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', 'isBroker', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('is_broker')
        .eq('id', user.id)
        .single()
      if (error) return null
      return data
    },
    enabled: !!user?.id,
  })

  const effectiveProfileId = profileId || ''
  const canEdit = !isProfileLoading && !!profile?.is_broker

  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | '30d' | '90d' | 'year'>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  const filters = useCallback(() => {
    const f: { fromDate?: string; toDate?: string; search?: string } = {}
    if (search.trim()) f.search = search.trim()
    if (dateFilter !== 'all') {
      const to = new Date()
      const from = new Date()
      if (dateFilter === '30d') from.setDate(from.getDate() - 30)
      else if (dateFilter === '90d') from.setDate(from.getDate() - 90)
      else if (dateFilter === 'year') from.setFullYear(from.getFullYear() - 1)
      f.fromDate = from.toISOString().split('T')[0]
      f.toDate = to.toISOString().split('T')[0]
    }
    return f
  }, [search, dateFilter])()

  const { notes, isLoading } = useMeetingNotes(effectiveProfileId, filters)
  const {
    createNote,
    updateNote,
    deleteNote,
    toggleActionItem,
  } = useMeetingNoteMutations(
    effectiveProfileId,
    t,
    () => {
      setIsFormOpen(false)
      setEditingNote(null)
      setSelectedNote(null)
    }
  )

  const handleCreate = () => {
    setEditingNote(null)
    setIsFormOpen(true)
  }

  const handleEdit = (noteId: string) => {
    setEditingNote(noteId)
    setSelectedNote(null)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (values: {
    meeting_date: string
    title: string
    content: string
    action_items: MeetingNoteActionItem[]
    participants: string
  }) => {
    if (editingNote) {
      updateNote.mutate({
        noteId: editingNote,
        input: {
          meeting_date: values.meeting_date,
          title: values.title,
          content: values.content || null,
          action_items: values.action_items,
          participants: values.participants || null,
        },
      })
    } else {
      createNote.mutate({
        meeting_date: values.meeting_date,
        title: values.title,
        content: values.content || null,
        action_items: values.action_items,
        participants: values.participants || null,
      })
    }
  }

  const noteToEdit = editingNote ? notes.find((n) => n.id === editingNote) : null

  if (!effectiveProfileId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MeetingNotesHeader
        title={t('meetingNotes.title')}
        profileId={effectiveProfileId}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('meetingNotes.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value as 'all' | '30d' | '90d' | 'year')
            }
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">{t('meetingNotes.filters.allTime')}</option>
            <option value="30d">{t('meetingNotes.filters.last30Days')}</option>
            <option value="90d">{t('meetingNotes.filters.last90Days')}</option>
            <option value="year">{t('meetingNotes.filters.thisYear')}</option>
          </select>
          {canEdit && (
            <Button onClick={handleCreate} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              {t('meetingNotes.newNote')}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : notes.length === 0 ? (
          <MeetingNotesEmpty
            onCreateClick={canEdit ? handleCreate : undefined}
            t={t}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <MeetingNoteCard
                key={note.id}
                note={note}
                onClick={() => setSelectedNote(note.id)}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Sheet (Create/Edit) - only for brokers */}
      {canEdit && (
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {editingNote ? t('meetingNotes.editNote') : t('meetingNotes.createNote')}
            </SheetTitle>
            <SheetDescription>
              {t('meetingNotes.formDescription')}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <MeetingNoteForm
              initialValues={noteToEdit ? {
                meeting_date: noteToEdit.meeting_date,
                title: noteToEdit.title,
                content: noteToEdit.content ?? '',
                action_items: noteToEdit.action_items,
                participants: noteToEdit.participants ?? '',
              } : undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingNote(null)
              }}
              isSubmitting={createNote.isPending || updateNote.isPending}
              t={t}
            />
          </div>
        </SheetContent>
      </Sheet>
      )}

      {/* Detail Sheet (View note, toggle actions, edit, delete) */}
      <Sheet
        open={!!selectedNote && !editingNote}
        onOpenChange={(open) => !open && setSelectedNote(null)}
      >
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selectedNote && (
            <MeetingNoteDetail
              note={notes.find((n) => n.id === selectedNote)!}
              canEdit={canEdit}
              onEdit={() => handleEdit(selectedNote)}
              onDelete={() => setNoteToDelete(selectedNote)}
              onToggleActionItem={
                canEdit
                  ? (actionItemId, completed) => {
                      toggleActionItem.mutate({
                        noteId: selectedNote,
                        actionItemId,
                        completed,
                      })
                    }
                  : undefined
              }
              isTogglingActionItem={toggleActionItem.isPending}
              t={t}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation - only for brokers */}
      {canEdit && (
      <AlertDialog open={!!noteToDelete} onOpenChange={(o) => !o && setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('meetingNotes.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('meetingNotes.deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (noteToDelete) {
                  deleteNote.mutate(noteToDelete)
                  setNoteToDelete(null)
                  setSelectedNote(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )}
    </div>
  )
}
