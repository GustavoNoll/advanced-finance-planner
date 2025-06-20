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
import { eventIcons } from "@/constants/events";
import { CurrencyCode, getCurrencySymbol, formatCurrency } from "@/utils/currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FinancialItemFormValues } from "@/types/financial";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const createSchema = (type: 'goal' | 'event') => {
  const baseFields = {
    name: z.string().min(1, "Nome é obrigatório"),
    month: z.string().min(1, "Mês é obrigatório"),
    year: z.string().min(1, "Ano é obrigatório"),
    icon: z.enum(['other']),
    asset_value: z.string().min(1, "Valor é obrigatório"),
    payment_mode: z.enum(['none', 'installment', 'repeat']).default('none'),
    installment_count: z.string().optional(),
    installment_interval: z.string().optional(),
  };

  if (type === 'goal') {
    return z.object({
      ...baseFields,
      icon: z.enum(['house', 'car', 'travel', 'family', 'electronic', 'education', 'hobby', 'professional', 'health', 'other']),
      type: z.literal('goal'),
    });
  } else if (type === 'event') {
    return z.object({
      ...baseFields,
      icon: z.enum(['goal', 'contribution', 'other']),
      type: z.literal('event'),
    });
  }
  console.log('ERROR');
};

interface FinancialItemFormProps {
  type: 'goal' | 'event';
  onSubmit: (values: FinancialItemFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<FinancialItemFormValues>;
  isSubmitting?: boolean;
  currency: CurrencyCode;
  onTypeChange?: (type: 'goal' | 'event') => void;
  showTypeSelector?: boolean;
  leftActions?: React.ReactNode;
}

export const FinancialItemForm = ({
  type,
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
  currency,
  onTypeChange,
  showTypeSelector = true,
  leftActions,
}: FinancialItemFormProps) => {
  const { t } = useTranslation();
  const form = useForm<FinancialItemFormValues>({
    resolver: zodResolver(createSchema(type)),
    defaultValues: {
      name: initialValues?.name || '',
      icon: initialValues?.icon || 'other',
      asset_value: initialValues?.asset_value || '',
      month: initialValues?.month || '',
      year: initialValues?.year || '',
      type,
      payment_mode: initialValues?.payment_mode || 'none',
      installment_count: initialValues?.installment_count?.toString() || '',
      installment_interval: initialValues?.installment_interval?.toString() || '1',
    },
  });

  // Reset form when type changes
  const handleTypeChange = (newType: 'goal' | 'event') => {
    onTypeChange?.(newType);
    form.reset({
      name: '',
      icon: 'other',
      asset_value: '',
      month: initialValues?.month || '',
      year: initialValues?.year || '',
      type: newType,
      payment_mode: 'none',
      installment_count: '',
      installment_interval: '1',
    });
  };

  const handleSubmit = (values: FinancialItemFormValues) => {
    onSubmit(values);
  };

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {hasErrors && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600 py-2">
            <AlertDescription>
              {t('common.formErrors')}
            </AlertDescription>
          </Alert>
        )}

        {showTypeSelector && (
          <div className="flex justify-center gap-4 mb-4">
            <Button
              type="button"
              variant={type === 'goal' ? 'default' : 'outline'}
              className="w-40 h-9"
              onClick={() => handleTypeChange('goal')}
            >
              {t('financialGoals.title')}
            </Button>
            <Button
              type="button"
              variant={type === 'event' ? 'default' : 'outline'}
              className="w-40 h-9"
              onClick={() => handleTypeChange('event')}
            >
              {t('events.title')}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(
                  "text-sm font-medium mb-1",
                  form.formState.errors.name && "text-red-600"
                )}>
                  {t('common.name')} *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('common.enterName')}
                    className={cn(
                      "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                      form.formState.errors.name && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asset_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(
                  "text-sm font-medium mb-1",
                  form.formState.errors.asset_value && "text-red-600"
                )}>
                  {t('events.form.amount')} *
                </FormLabel>
                <FormControl>
                  <CurrencyInput
                    id="asset_value"
                    className={cn(
                      "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                      form.formState.errors.asset_value && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    prefix={getCurrencySymbol(currency as CurrencyCode)}
                    groupSeparator="."
                    decimalSeparator=","
                    decimalsLimit={2}
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(
                  "text-sm font-medium mb-1",
                  form.formState.errors.month && "text-red-600"
                )}>
                  {t('common.month')} *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn(
                      "h-9",
                      form.formState.errors.month && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}>
                      <SelectValue placeholder={t('common.selectMonth')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {t(`monthlyView.table.months.${new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' }).toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {t('common.year')} *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn(
                      "h-9",
                      form.formState.errors.year && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}>
                      <SelectValue placeholder={t('common.selectYear')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-600 text-xs mt-1" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-sm font-medium mb-1",
                form.formState.errors.icon && "text-red-600"
              )}>
                {t('financialGoals.form.icon')} *
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(type === 'goal' ? goalIcons : eventIcons).map(([key, Icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => field.onChange(key)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200",
                        field.value === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50',
                        form.formState.errors.icon && "border-red-500"
                      )}
                    >
                      <Icon className="h-6 w-6 text-gray-700" />
                      <span className="text-xs font-medium text-gray-700 mt-1">
                        {type === 'goal' ? t(`financialGoals.icons.${key}`) : t(`events.icons.${key}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-600 text-xs mt-1" />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="payment_mode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium">
                  {t('financialGoals.form.paymentMode')}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t('financialGoals.form.noPaymentMode')}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="installment" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t('financialGoals.form.installmentMode')}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="repeat" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t('financialGoals.form.repeatMode')}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(form.watch('payment_mode') === 'installment' || form.watch('payment_mode') === 'repeat') && (
            <>
              <FormField
                control={form.control}
                name="installment_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(
                      "text-sm font-medium",
                      form.formState.errors.installment_count && "text-red-600"
                    )}>
                      {t('financialGoals.form.installmentCount')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="120"
                        {...field}
                        placeholder={t('financialGoals.form.selectInstallments')}
                        className={cn(
                          "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                          form.formState.errors.installment_count && "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="installment_interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(
                      "text-sm font-medium",
                      form.formState.errors.installment_interval && "text-red-600"
                    )}>
                      {t('financialGoals.form.installmentInterval')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        placeholder={t('financialGoals.form.enterInstallmentInterval')}
                        className={cn(
                          "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                          form.formState.errors.installment_interval && "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 text-xs mt-1" />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          {leftActions && <div>{leftActions}</div>}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-9"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || hasErrors}
              className={cn(
                "h-9",
                hasErrors && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};