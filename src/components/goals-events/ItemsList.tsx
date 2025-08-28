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
  onEdit,
  t
}: ItemsListProps) {
  const renderItem = (item: Goal | ProjectedEvent, isCompleted: boolean = false) => {
    if (type === 'goal') {
      const goal = item as Goal
      return (
        <GoalCard
          key={goal.id}
          goal={goal}
          currency={currency}
          isCompleted={isCompleted}
          onDelete={() => {
            if (window.confirm(t("common.confirmDelete"))) {
              onDelete(goal.id)
            }
          }}
          onEdit={() => {
            if (!isCompleted) {
              onEdit(goal)
            }
          }}
        />
      )
    } else {
      const event = item as ProjectedEvent
      return (
        <EventCard
          key={event.id}
          event={event}
          currency={currency}
          isCompleted={isCompleted}
          onDelete={() => {
            if (window.confirm(t("common.confirmDelete"))) {
              onDelete(event.id)
            }
          }}
          onEdit={() => {
            if (!isCompleted) {
              onEdit(event)
            }
          }}
        />
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {type === 'goal' ? t("financialGoals.projected") : t("events.projected")}
        </h2>
        {projectedItems.map(item => renderItem(item, false))}
      </div>

      <div>
        <Button
          variant="ghost"
          onClick={onToggleShowCompleted}
          className="w-full justify-start text-muted-foreground hover:text-gray-900 dark:hover:text-white"
        >
          {showCompleted 
            ? (type === 'goal' ? t("financialGoals.hideCompleted") : t("events.hideCompleted"))
            : (type === 'goal' ? t("financialGoals.showCompleted") : t("events.showCompleted"))
          }
        </Button>
        
        {showCompleted && completedItems.length > 0 && (
          <div className="mt-4 space-y-4">
            {completedItems.map(item => renderItem(item, true))}
          </div>
        )}
      </div>
    </div>
  )
}
