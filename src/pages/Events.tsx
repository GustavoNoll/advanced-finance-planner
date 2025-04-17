import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { EventCard } from '@/components/events/EventCard';
import { FinancialItemForm } from '@/components/chart/FinancialItemForm';
import { CurrencyCode } from "@/utils/currency";
import { FinancialItemFormValues } from "@/types/financial";

const Events = () => {
  const { id: userId } = useParams();
  const location = useLocation();
  const [currency, setCurrency] = useState<CurrencyCode | null>(location.state?.currency || null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("profile_id", userId)
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createEvent = useMutation({
    mutationFn: async (values: FinancialItemFormValues) => {
      const assetValue = parseFloat(values.asset_value.replace(/[^\d.,-]/g, '').replace(',', '.'));
      
      const { data, error } = await supabase.from("events").insert([
        {
          profile_id: userId,
          name: values.name,
          icon: values.icon,
          asset_value: assetValue,
          month: parseInt(values.month),
          year: parseInt(values.year),
          status: 'pending',
          installment_project: values.installment_project,
          installment_count: values.installment_count ? parseInt(values.installment_count) : null
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowAddForm(false);
      toast({
        title: t("events.messages.createSuccess"),
      });
    },
    onError: () => {
      toast({
        title: t("events.messages.createError"),
        variant: "destructive",
      });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: t("events.messages.deleteSuccess"),
      });
    },
    onError: () => {
      toast({
        title: t("events.messages.deleteError"),
        variant: "destructive",
      });
    },
  });

  const toggleEventStatus = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: 'pending' | 'completed' }) => {
      const { error } = await supabase
        .from("events")
        .update({ status })
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const projectedEvents = events?.filter(event => event.status === 'pending') || [];
  const completedEvents = events?.filter(event => event.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="w-1/3">
              <Link to={userId ? `/client/${userId}` : "/"}>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center w-1/3">
              <h1 className="text-xl font-semibold text-gray-900">{t("events.title")}</h1>
            </div>

            <div className="w-1/3" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4">
          <Button 
            variant="ghost"
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{t("events.addNew")}</span>
            </div>
          </Button>

          {showAddForm && (
            <Card className="p-4">
              <FinancialItemForm
                type="event"
                onSubmit={(values) => createEvent.mutate(values)}
                onCancel={() => setShowAddForm(false)}
                isSubmitting={createEvent.isPending}
                currency={currency as CurrencyCode}
                showTypeSelector={false}
              />
            </Card>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">{t("events.projected")}</h2>
            {projectedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currency={currency as CurrencyCode}
                onDelete={() => {
                  if (window.confirm(t("common.confirmDelete"))) {
                    deleteEvent.mutate(event.id);
                  }
                }}
                onToggleStatus={() => {
                  toggleEventStatus.mutate({
                    eventId: event.id,
                    status: event.status === 'pending' ? 'completed' : 'pending'
                  });
                }}
              />
            ))}
          </div>

          <div>
            <Button
              variant="ghost"
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full justify-start text-gray-500"
            >
              {showCompleted ? t("events.hideCompleted") : t("events.showCompleted")}
            </Button>
            
            {showCompleted && completedEvents.length > 0 && (
              <div className="mt-4 space-y-4">
                {completedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    currency={currency as CurrencyCode}
                    onDelete={() => {
                      if (window.confirm(t("common.confirmDelete"))) {
                        deleteEvent.mutate(event.id);
                      }
                    }}
                    onToggleStatus={() => {
                      toggleEventStatus.mutate({
                        eventId: event.id,
                        status: event.status === 'pending' ? 'completed' : 'pending'
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Events;