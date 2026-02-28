import { Button } from '@/shared/components/ui/button'
import { FileText } from 'lucide-react'

interface MeetingNotesEmptyProps {
  onCreateClick?: () => void
  t: (key: string) => string
}

export function MeetingNotesEmpty({ onCreateClick, t }: MeetingNotesEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {t('meetingNotes.empty.title')}
      </h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        {t('meetingNotes.empty.description')}
      </p>
      {onCreateClick && (
        <Button onClick={onCreateClick}>
          {t('meetingNotes.empty.createFirst')}
        </Button>
      )}
    </div>
  )
}
