import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { CurrencyCode } from "@/utils/currency";
import { ProjectedEvent, FinancialItemFormValues } from "@/types/financial";
import { 
  GoalsEventsHeader, 
  AddItemButton, 
  ItemFormSection, 
  ItemsList 
} from "@/components/goals-events";
import { useEvents, useEventMutations } from "@/hooks/useGoalsEventsManagement";

const Events = () => {
  const { id: userId } = useParams();
  const location = useLocation();
  const [currency, setCurrency] = useState<CurrencyCode | null>(location.state?.currency || null);
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ProjectedEvent | null>(null);

  // Hooks para dados e mutações
  const { projectedEvents, completedEvents, isLoading } = useEvents(userId || '');
  const { createEvent, updateEvent, deleteEvent, toggleEventStatus } = useEventMutations(userId || '');

  // Handlers
  const handleSubmit = (values: FinancialItemFormValues) => {
    if (editingEvent) {
      updateEvent.mutate({ eventId: editingEvent.id, values });
    } else {
      createEvent.mutate(values);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingEvent(null);
  };

  const handleDelete = (eventId: string) => {
    deleteEvent.mutate(eventId);
  };

  const handleToggleStatus = (eventId: string, status: 'pending' | 'completed') => {
    toggleEventStatus.mutate({ eventId, status });
  };

  const handleEdit = (event: ProjectedEvent) => {
    setEditingEvent(event);
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GoalsEventsHeader 
        title={t("events.title")} 
        userId={userId} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4">
          <AddItemButton
            onClick={() => setShowAddForm(!showAddForm)}
            label={t("events.addNew")}
          />

          <ItemFormSection
            showForm={showAddForm}
            type="event"
            currency={currency as CurrencyCode}
            isSubmitting={createEvent.isPending || updateEvent.isPending}
            editingItem={editingEvent}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ItemsList
          type="event"
          projectedItems={projectedEvents}
          completedItems={completedEvents}
          currency={currency as CurrencyCode}
          showCompleted={showCompleted}
          onToggleShowCompleted={() => setShowCompleted(!showCompleted)}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEdit}
          t={t}
        />
      </main>
    </div>
  );
};

export default Events;