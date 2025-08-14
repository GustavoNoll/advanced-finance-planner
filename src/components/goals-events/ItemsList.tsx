import { Button } from "@/components/ui/button"
import { Goal, ProjectedEvent } from "@/types/financial"
import { CurrencyCode } from "@/utils/currency"
import { GoalCard } from '@/components/financial-goals/GoalCard'
import { EventCard } from '@/components/events/EventCard'

interface ItemsListProps {
  type: 'goal' | 'event'
  projectedItems: (Goal | ProjectedEvent)[]
  completedItems: (Goal | ProjectedEvent)[]
  currency: CurrencyCode
  showCompleted: boolean
  onToggleShowCompleted: () => void
  onDelete: (itemId: string) => void
  onToggleStatus: (itemId: string, status: 'pending' | 'completed') => void
  onEdit: (item: Goal | ProjectedEvent) => void
  t: (key: string) => string
}

export function ItemsList({
  type,
  projectedItems,
  completedItems,
  currency,
  showCompleted,
  onToggleShowCompleted,
  onDelete,
  onToggleStatus,
  onEdit,
  t
}: ItemsListProps) {
  const renderItem = (item: Goal | ProjectedEvent) => {
    if (type === 'goal') {
      const goal = item as Goal
      return (
        <GoalCard
          key={goal.id}
          goal={goal}
          currency={currency}
          onDelete={() => {
            if (window.confirm(t("common.confirmDelete"))) {
              onDelete(goal.id)
            }
          }}
          onToggleStatus={() => {
            onToggleStatus(goal.id, goal.status === 'pending' ? 'completed' : 'pending')
          }}
          onEdit={() => onEdit(goal)}
        />
      )
    } else {
      const event = item as ProjectedEvent
      return (
        <EventCard
          key={event.id}
          event={event}
          currency={currency}
          onDelete={() => {
            if (window.confirm(t("common.confirmDelete"))) {
              onDelete(event.id)
            }
          }}
          onToggleStatus={() => {
            onToggleStatus(event.id, event.status === 'pending' ? 'completed' : 'pending')
          }}
          onEdit={() => onEdit(event)}
        />
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">
          {type === 'goal' ? t("financialGoals.projected") : t("events.projected")}
        </h2>
        {projectedItems.map(renderItem)}
      </div>

      <div>
        <Button
          variant="ghost"
          onClick={onToggleShowCompleted}
          className="w-full justify-start text-muted-foreground"
        >
          {showCompleted 
            ? (type === 'goal' ? t("financialGoals.hideCompleted") : t("events.hideCompleted"))
            : (type === 'goal' ? t("financialGoals.showCompleted") : t("events.showCompleted"))
          }
        </Button>
        
        {showCompleted && completedItems.length > 0 && (
          <div className="mt-4 space-y-4">
            {completedItems.map(renderItem)}
          </div>
        )}
      </div>
    </div>
  )
}
