import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Pencil, Trash2, Users } from 'lucide-react'
import type { MeetingNote, MeetingNoteActionItem } from '../types/meeting-notes'

interface MeetingNoteDetailProps {
  note: MeetingNote
  canEdit: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleActionItem?: (actionItemId: string, completed: boolean) => void
  isTogglingActionItem?: boolean
  t: (key: string) => string
}

export function MeetingNoteDetail({
  note,
  canEdit,
  onEdit,
  onDelete,
  onToggleActionItem,
  isTogglingActionItem,
  t,
}: MeetingNoteDetailProps) {
  const dateFormatted = new Date(note.meeting_date).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card className="p-6 border-border">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <time
              className="text-sm text-muted-foreground block"
              dateTime={note.meeting_date}
            >
              {dateFormatted}
            </time>
            <h2 className="text-xl font-semibold text-foreground mt-1">
              {note.title}
            </h2>
          </div>
          {canEdit && (
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="icon" onClick={onEdit} title={t('common.edit')}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onDelete}
                title={t('common.delete')}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {note.participants && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{note.participants}</span>
          </div>
        )}

        {note.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{note.content}</p>
          </div>
        )}

        {note.action_items.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">
              {t('meetingNotes.form.actionItems')}
            </h3>
            <ul className="space-y-2">
              {note.action_items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    id={`action-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={(checked) =>
                      onToggleActionItem?.(item.id, checked === true)
                    }
                    disabled={!canEdit || !onToggleActionItem || isTogglingActionItem}
                  />
                  <label
                    htmlFor={`action-${item.id}`}
                    className={`text-sm cursor-pointer flex-1 ${
                      item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {item.text}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}
