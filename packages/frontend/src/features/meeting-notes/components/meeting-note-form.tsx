import { useState, useCallback } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'
import type { MeetingNote, MeetingNoteActionItem } from '../types/meeting-notes'

interface MeetingNoteFormProps {
  initialValues?: Partial<{
    meeting_date: string
    title: string
    content: string
    action_items: MeetingNoteActionItem[]
    participants: string
  }>
  onSubmit: (values: {
    meeting_date: string
    title: string
    content: string
    action_items: MeetingNoteActionItem[]
    participants: string
  }) => void
  onCancel: () => void
  isSubmitting: boolean
  t: (key: string) => string
}

export function MeetingNoteForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  t,
}: MeetingNoteFormProps) {
  const [meetingDate, setMeetingDate] = useState(
    initialValues?.meeting_date ?? new Date().toISOString().split('T')[0]
  )
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [participants, setParticipants] = useState(initialValues?.participants ?? '')
  const [actionItems, setActionItems] = useState<MeetingNoteActionItem[]>(
    initialValues?.action_items?.length
      ? initialValues.action_items
      : [{ id: crypto.randomUUID(), text: '', completed: false }]
  )

  const addActionItem = useCallback(() => {
    setActionItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: '', completed: false },
    ])
  }, [])

  const removeActionItem = useCallback((id: string) => {
    setActionItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateActionItem = useCallback((id: string, text: string) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text } : item))
    )
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = actionItems.filter((a) => a.text.trim())
    onSubmit({
      meeting_date: meetingDate,
      title: title.trim(),
      content: content.trim() || '',
      action_items: validItems.length ? validItems : [],
      participants: participants.trim() || '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="meeting-date">{t('meetingNotes.form.meetingDate')}</Label>
        <Input
          id="meeting-date"
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">{t('meetingNotes.form.title')}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('meetingNotes.form.titlePlaceholder')}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">{t('meetingNotes.form.content')}</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('meetingNotes.form.contentPlaceholder')}
          rows={5}
          className="w-full resize-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t('meetingNotes.form.actionItems')}</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addActionItem}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('meetingNotes.form.addActionItem')}
          </Button>
        </div>
        <div className="space-y-2">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2"
            >
              <Input
                value={item.text}
                onChange={(e) => updateActionItem(item.id, e.target.value)}
                placeholder={t('meetingNotes.form.actionItemPlaceholder')}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeActionItem(item.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="participants">{t('meetingNotes.form.participants')}</Label>
        <Input
          id="participants"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          placeholder={t('meetingNotes.form.participantsPlaceholder')}
          className="w-full"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? t('common.loading') : t('common.save')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  )
}
