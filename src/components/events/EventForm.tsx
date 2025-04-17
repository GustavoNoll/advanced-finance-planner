import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CurrencyInput from 'react-currency-input-field';
import { CurrencyCode, getCurrencySymbol } from "@/utils/currency";
import { Target, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  amount: z.string().min(1, "Valor é obrigatório"),
  month: z.string().min(1, "Mês é obrigatório"),
  year: z.string().min(1, "Ano é obrigatório"),
  icon: z.enum(['goal', 'contribution', 'other']),
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

interface EventFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  initialValues?: Partial<z.infer<typeof formSchema>>;
  isSubmitting?: boolean;
  currency: CurrencyCode;
}

const eventIcons = {
  goal: Target,
  contribution: TrendingUp,
  other: Calendar,
};

export const EventForm = ({ onSubmit, onCancel, initialValues, isSubmitting = false, currency }: EventFormProps) => {
  const { t } = useTranslation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      month: "",
      year: "",
      icon: "other",
      ...initialValues
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-sm font-medium mb-1",
                form.formState.errors.icon && "text-red-600"
              )}>
                {t("events.form.eventType")} *
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(eventIcons).map(([key, Icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => field.onChange(key)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200",
                        field.value === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50',
                        form.formState.errors.icon && "border-red-500"
                      )}
                    >
                      <Icon className="h-6 w-6 text-gray-700" />
                      <span className="text-xs font-medium text-gray-700 mt-1">
                        {t(`events.types.${key}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-600 text-xs mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-sm font-medium mb-1",
                form.formState.errors.name && "text-red-600"
              )}>
                {t("events.form.name")} *
              </FormLabel>
              <FormControl>
                <input
                  {...field}
                  className={cn(
                    "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                    form.formState.errors.name && "border-red-500 focus:ring-red-500 focus:border-red-500"
                  )}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage className="text-red-600 text-xs mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-sm font-medium mb-1",
                form.formState.errors.amount && "text-red-600"
              )}>
                {t("events.form.amount")} *
              </FormLabel>
              <FormControl>
                <CurrencyInput
                  id="amount"
                  className={cn(
                    "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                    form.formState.errors.amount && "border-red-500 focus:ring-red-500 focus:border-red-500"
                  )}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  prefix={getCurrencySymbol(currency as CurrencyCode)}
                  groupSeparator="."
                  decimalSeparator=","
                  decimalsLimit={2}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage className="text-red-600 text-xs mt-1" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(
                  "text-sm font-medium mb-1",
                  form.formState.errors.month && "text-red-600"
                )}>
                  {t("events.form.month")} *
                </FormLabel>
                <FormControl>
                  <select
                    className={cn(
                      "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                      form.formState.errors.month && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}
                    {...field}
                    disabled={isSubmitting}
                  >
                    <option value="">{t("common.select")}</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <option key={month} value={month}>
                          {t('monthlyView.table.months.' + new Date(2000, parseInt(month) - 1).toLocaleString('en-US', { month: 'long' }).toLowerCase() )}
                        </option>
                      );
                    })}
                  </select>
                </FormControl>
                <FormMessage className="text-red-600 text-xs mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(
                  "text-sm font-medium mb-1",
                  form.formState.errors.year && "text-red-600"
                )}>
                  {t("events.form.year")} *
                </FormLabel>
                <FormControl>
                  <select
                    className={cn(
                      "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                      form.formState.errors.year && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}
                    {...field}
                    disabled={isSubmitting}
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
                <FormMessage className="text-red-600 text-xs mt-1" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 text-gray-700 hover:bg-gray-50"
          >
            {t("common.cancel")}
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 