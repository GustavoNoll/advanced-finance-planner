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

interface EventFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  initialValues?: Partial<z.infer<typeof formSchema>>;
}

export const EventForm = ({ onSubmit, onCancel, initialValues }: EventFormProps) => {
  const { t } = useTranslation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      month: "",
      year: "",
      ...initialValues
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("events.form.name")}</FormLabel>
              <FormControl>
                <input
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("events.form.amount")}</FormLabel>
              <FormControl>
                <CurrencyInput
                  id="amount"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  prefix="R$ "
                  groupSeparator="."
                  decimalSeparator=","
                  decimalsLimit={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("events.form.month")}</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("events.form.year")}</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit">
            {t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 