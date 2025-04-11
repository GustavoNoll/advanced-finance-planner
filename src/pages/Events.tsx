import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Plus, Calendar, Trash2, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import CurrencyInput from 'react-currency-input-field';

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  amount: z.string().min(1, "Valor é obrigatório"),
  month: z.string().min(1, "Mês é obrigatório"),
  year: z.string().min(1, "Ano é obrigatório"),
}).refine((data) => {
  const currentDate = new Date();
  const selectedDate = new Date(
    parseInt(data.year),
    parseInt(data.month) - 1
  );
  
  currentDate.setDate(1);
  currentDate.setHours(0, 0, 0, 0);
  selectedDate.setDate(1);
  selectedDate.setHours(0, 0, 0, 0);
  
  return selectedDate >= currentDate;
}, {
  message: "A data selecionada não pode ser no passado",
  path: ["month"]
});

// Primeiro, vamos criar uma interface para o Event
interface Event {
  id: string;
  name: string;
  amount: number;
  month: number;
  year: number;
  status: 'projected' | 'completed';
  profile_id: string;
}

const Events = () => {
  const { id: userId } = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      month: "",
      year: "",
    },
  });

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
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Remove currency symbol, group separators, and convert comma to dot
      const cleanAmount = values.amount
        .replace(/[R$\s]/g, '')  // Remove R$ and spaces
        .replace(/\./g, '')      // Remove thousand separators
        .replace(',', '.');      // Convert decimal comma to dot

      const amount = parseFloat(cleanAmount);

      const { data, error } = await supabase.from("events").insert([
        {
          profile_id: userId,
          name: values.name,
          amount: amount,
          month: parseInt(values.month),
          year: parseInt(values.year),
          status: 'projected'
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowAddForm(false);
      form.reset();
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
    mutationFn: async ({ eventId, status }: { eventId: string; status: 'projected' | 'completed' }) => {
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

  const projectedEvents = events?.filter(event => event.status === 'projected') || [];
  const completedEvents = events?.filter(event => event.status === 'completed') || [];

  const renderForm = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => createEvent.mutate(values))}
        className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">{t("events.form.name")}</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">{t("events.form.amount")}</FormLabel>
                <FormControl>
                  <CurrencyInput
                    id="amount"
                    className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    prefix="R$ "
                    groupSeparator="."
                    decimalSeparator=","
                    decimalsLimit={2}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">{t("events.form.month")}</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...field}
                    >
                      <option value="">{t("common.select")}</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        return (
                          <option key={month} value={month}>
                            {new Date(2000, i).toLocaleDateString('pt-BR', { month: 'long' })}
                          </option>
                        );
                      })}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">{t("events.form.year")}</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...field}
                    >
                      <option value="">{t("common.select")}</option>
                      {Array.from({ length: 80 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString();
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setShowAddForm(false)}
            className="px-6 py-2 text-gray-700 hover:bg-gray-50"
          >
            {t("common.cancel")}
          </Button>
          <Button 
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );

  const renderEventCard = (event: Event) => (
    <Card key={event.id} className={`p-4 ${event.status === 'completed' ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {event.status === 'completed' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Calendar className="h-4 w-4 text-blue-600" />
            )}
            <h3 className="font-medium">{event.name}</h3>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(2000, event.month - 1)
              .toLocaleDateString('pt-BR', { month: 'long' })
              .replace(/^\w/, (c) => c.toUpperCase())} / {event.year}
          </p>
          <p className={`font-medium ${event.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              signDisplay: 'always'
            }).format(event.amount)}
          </p>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (window.confirm(t("common.confirmDelete"))) {
                deleteEvent.mutate(event.id);
              }
            }}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

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
              {renderForm()}
            </Card>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">{t("events.projected")}</h2>
            {projectedEvents.map(renderEventCard)}
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
                {completedEvents.map(renderEventCard)}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Events;