import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { Spinner } from '@/shared/components/ui/spinner'
import {
  MeetingNoteCard,
  MeetingNoteDetail,
  MeetingNoteForm,
} from '@/features/meeting-notes/components'
import {
  useBrokerMeetingNotes,
  useMeetingNoteMutations,
} from '@/features/meeting-notes/hooks/use-meeting-notes'
import type { MeetingNoteActionItem } from '@/features/meeting-notes/types/meeting-notes'
import type { MeetingNotesFilters } from '@/features/meeting-notes/services/meeting-notes.service'
import type { UserProfileInvestment } from '@/types/broker-dashboard'

interface BrokerMeetingNotesAggregateProps {
  clients: UserProfileInvestment[]
  onOpenClientNotes: (clientId: string) => void
  onScrollToClients?: () => void
}

export function BrokerMeetingNotesAggregate({
  clients,
  onOpenClientNotes,
  onScrollToClients,
}: BrokerMeetingNotesAggregateProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | '30d' | '90d' | 'year'>('all')
  const [clientFilter, setClientFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filters = useCallback((): MeetingNotesFilters => {
    const f: MeetingNotesFilters = { page, pageSize: 12 }
    if (search.trim()) f.search = search.trim()
    if (clientFilter) f.clientId = clientFilter
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
  }, [search, dateFilter, clientFilter, page])()

  useEffect(() => {
    setPage(1)
  }, [search, dateFilter, clientFilter])

  const { notes, total, isLoading } = useBrokerMeetingNotes(filters)
  const totalPages = Math.max(1, Math.ceil(total / 12))
  const fromItem = total === 0 ? 0 : (page - 1) * 12 + 1
  const toItem = Math.min(page * 12, total)
  const selectedNoteData = selectedNote ? notes.find((n) => n.id === selectedNote) : null
  const noteToEdit = editingNote ? notes.find((n) => n.id === editingNote) : null

  const mutations = useMeetingNoteMutations(
    selectedNoteData?.profile_id ?? noteToEdit?.profile_id ?? '',
    t,
    () => {
      setSelectedNote(null)
      setEditingNote(null)
      setIsFormOpen(false)
    }
  )

  const handleFormSubmit = (values: {
    meeting_date: string
    title: string
    content: string
    action_items: MeetingNoteActionItem[]
    participants: string
  }) => {
    if (!noteToEdit) return
    if (editingNote) {
      mutations.updateNote.mutate({
        noteId: editingNote,
        input: {
          meeting_date: values.meeting_date,
          title: values.title,
          content: values.content || null,
          action_items: values.action_items,
          participants: values.participants || null,
        },
      })
    }
  }

  const getClientName = (profileId: string) =>
    clients.find((c) => c.id === profileId)?.profile_name ?? '—'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('brokerDashboard.meetingNotes.searchPlaceholder')}
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
          <option value="all">{t('brokerDashboard.meetingNotes.allTime')}</option>
          <option value="30d">{t('meetingNotes.filters.last30Days')}</option>
          <option value="90d">{t('meetingNotes.filters.last90Days')}</option>
          <option value="year">{t('meetingNotes.filters.thisYear')}</option>
        </select>
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm min-w-[180px]"
        >
          <option value="">{t('brokerDashboard.meetingNotes.allClients')}</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.profile_name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t('brokerDashboard.meetingNotes.empty.title')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('brokerDashboard.meetingNotes.empty.description')}
          </p>
          {onScrollToClients && (
            <Button variant="outline" onClick={onScrollToClients}>
              {t('brokerDashboard.meetingNotes.viewClients')}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <MeetingNoteCard
                key={note.id}
                note={note}
                clientName={getClientName(note.profile_id)}
                onClientNameClick={() => onOpenClientNotes(note.profile_id)}
                onClick={() => setSelectedNote(note.id)}
                t={t}
              />
            ))}
          </div>
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              {t('brokerDashboard.meetingNotes.pagination.showing', {
                from: fromItem,
                to: toItem,
                total,
              })}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1))
                    setSelectedNote(null)
                  }}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('brokerDashboard.meetingNotes.pagination.previous')}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t('brokerDashboard.meetingNotes.pagination.pageOf', {
                    page,
                    totalPages,
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1))
                    setSelectedNote(null)
                  }}
                  disabled={page >= totalPages}
                >
                  {t('brokerDashboard.meetingNotes.pagination.next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <Sheet
        open={!!selectedNote && !editingNote}
        onOpenChange={(open) => !open && setSelectedNote(null)}
      >
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selectedNoteData && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedNoteData.title}</SheetTitle>
                <SheetDescription>
                  {getClientName(selectedNoteData.profile_id)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <MeetingNoteDetail
                  note={selectedNoteData}
                  canEdit={true}
                  onEdit={() => {
                    setEditingNote(selectedNote)
                    setSelectedNote(null)
                    setIsFormOpen(true)
                  }}
                  onDelete={() => setNoteToDelete(selectedNote)}
                  onToggleActionItem={(actionItemId, completed) =>
                    mutations.toggleActionItem.mutate({
                      noteId: selectedNote,
                      actionItemId,
                      completed,
                    })
                  }
                  isTogglingActionItem={mutations.toggleActionItem.isPending}
                  t={t}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onOpenClientNotes(selectedNoteData.profile_id)}
                >
                  {t('brokerDashboard.meetingNotes.viewClient')}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{t('meetingNotes.editNote')}</SheetTitle>
            <SheetDescription>{t('meetingNotes.formDescription')}</SheetDescription>
          </SheetHeader>
          {noteToEdit && (
            <div className="mt-6">
              <MeetingNoteForm
                initialValues={{
                  meeting_date: noteToEdit.meeting_date,
                  title: noteToEdit.title,
                  content: noteToEdit.content ?? '',
                  action_items: noteToEdit.action_items,
                  participants: noteToEdit.participants ?? '',
                }}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setIsFormOpen(false)
                  setEditingNote(null)
                }}
                isSubmitting={mutations.updateNote.isPending}
                t={t}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!noteToDelete}
        onOpenChange={(o) => !o && setNoteToDelete(null)}
      >
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
                  mutations.deleteNote.mutate(noteToDelete)
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
    </div>
  )
}
