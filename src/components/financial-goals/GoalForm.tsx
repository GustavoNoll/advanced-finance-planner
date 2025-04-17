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
import { goalIcons } from "@/constants/goals";
import { CurrencyCode, getCurrencySymbol } from "@/utils/currency";

const formSchema = z.object({
  icon: z.enum(Object.keys(goalIcons) as [string, ...string[]]),
  asset_value: z.string().min(1, "Valor do bem é obrigatório"),
  goal_month: z.string().min(1, "Mês é obrigatório"),
  goal_year: z.string().min(1, "Ano é obrigatório"),
  installment_project: z.boolean().default(false),
  installment_count: z.string().optional(),
}).refine((data) => {
  const currentDate = new Date();
  const selectedDate = new Date(
    parseInt(data.goal_year),
    parseInt(data.goal_month) - 1
  );
  
  currentDate.setDate(1);
  currentDate.setHours(0, 0, 0, 0);
  selectedDate.setDate(1);
  selectedDate.setHours(0, 0, 0, 0);
  
  return selectedDate >= currentDate;
}, {
  message: "A data selecionada não pode ser no passado",
  path: ["goal_month"]
});

interface GoalFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  initialValues?: Partial<z.infer<typeof formSchema>>;
  isSubmitting?: boolean;
  currency: CurrencyCode;
}

export const GoalForm = ({ onSubmit, onCancel, initialValues, isSubmitting = false, currency }: GoalFormProps) => {
  const { t } = useTranslation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: "other",
      asset_value: "",
      goal_month: "",
      goal_year: "",
      installment_project: false,
      installment_count: "",
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
              <FormLabel>{t("financialGoals.form.icon")}</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Object.entries(goalIcons).map(([key, Icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => field.onChange(key)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                        field.value === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-8 w-8 text-gray-700 mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {t(`financialGoals.icons.${key}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="asset_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("financialGoals.form.assetValue")}</FormLabel>
                <FormControl>
                  <CurrencyInput
                    id="asset_value"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    prefix={getCurrencySymbol(currency as CurrencyCode)}
                    groupSeparator="."
                    decimalSeparator=","
                    decimalsLimit={2}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="goal_month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("financialGoals.form.goalMonth")}</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("financialGoals.form.goalYear")}</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...field}
                      disabled={isSubmitting}
                    >
                      <option value="">{t("common.select")}</option>
                      {Array.from({ length: 2300 - new Date().getFullYear() + 1 }, (_, i) => {
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
        </div>

        <FormField
          control={form.control}
          name="installment_project"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormLabel className="font-normal">
                {t("financialGoals.form.isInstallment")}
              </FormLabel>
            </FormItem>
          )}
        />

        {form.watch("installment_project") && (
          <FormField
            control={form.control}
            name="installment_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("financialGoals.form.installmentCount")}</FormLabel>
                <FormControl>
                  <input
                    type="number"
                    min="1"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-2 justify-end">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("common.cancel")}
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 