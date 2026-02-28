import { Card } from '@/shared/components/ui/card'
import { FileText, Users } from 'lucide-react'
import type { MeetingNote } from '../types/meeting-notes'

interface MeetingNoteCardProps {
  note: MeetingNote
  onClick: () => void
  t: (key: string) => string
}

export function MeetingNoteCard({ note, onClick, t }: MeetingNoteCardProps) {
  const actionItemsCount = note.action_items.length
  const completedCount = note.action_items.filter((a) => a.completed).length
  const allComplete = actionItemsCount > 0 && completedCount === actionItemsCount
  const hasPending = actionItemsCount > 0 && completedCount < actionItemsCount

  const statusBorderClass = allComplete
    ? 'border-l-4 border-l-green-500/50 dark:border-l-green-400/40'
    : hasPending
      ? 'border-l-4 border-l-amber-500/50 dark:border-l-amber-400/40'
      : ''

  const dateFormatted = new Date(note.meeting_date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const excerpt = note.content
    ? note.content.slice(0, 120).replace(/\n/g, ' ') + (note.content.length > 120 ? '...' : '')
    : ''

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/30 border-border ${statusBorderClass}`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <FileText className="h-4 w-4 shrink-0" />
            <time dateTime={note.meeting_date}>{dateFormatted}</time>
          </div>
        </div>

        <h3 className="font-medium text-foreground line-clamp-1">{note.title}</h3>

        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {actionItemsCount > 0 && (
            <span>
              {completedCount}/{actionItemsCount} {t('meetingNotes.actionItems')}
            </span>
          )}
          {note.participants && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {note.participants}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
