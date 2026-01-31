import { useForm, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Path, PathValue } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface AddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface AddressInputProps<T extends Record<string, unknown>> {
  control: UseFormReturn<T>['control'];
  setValue: UseFormReturn<T>['setValue'];
  name: string;
  disabled?: boolean;
  color?: string;
  className?: string;
}

export const AddressInput = <T extends Record<string, unknown>>({ 
  control, 
  setValue,
  name, 
  disabled = false,
  color = 'blue',
  className
}: AddressInputProps<T>) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const formatCEP = (value: string | undefined | null) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const fetchAddress = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (!cleanCep || cleanCep.length !== 8) return;
    
    setIsLoading(true);
    setCepError(null);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: AddressData = await response.json();
      
      if (data.erro) {
        setCepError(t('address.cep_not_found'));
        return;
      }

      // Get the base path without the location part
      const basePath = name.split('.').slice(0, -1).join('.');

      // Update form fields with address data
      setValue(`${name}.street` as Path<T>, data.logradouro as PathValue<T, Path<T>>);
      setValue(`${name}.neighborhood` as Path<T>, data.bairro as PathValue<T, Path<T>>);
      setValue(`${name}.city` as Path<T>, data.localidade as PathValue<T, Path<T>>);
      setValue(`${name}.state` as Path<T>, data.uf as PathValue<T, Path<T>>);
      setValue(`${basePath}.country` as Path<T>, 'Brasil' as PathValue<T, Path<T>>);
      
      // Clear number and complement fields
      setValue(`${name}.number` as Path<T>, '' as PathValue<T, Path<T>>);
      setValue(`${name}.complement` as Path<T>, '' as PathValue<T, Path<T>>);
    } catch (error) {
      console.error('Error fetching address:', error);
      setCepError(t('address.cep_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      <FormField
        control={control}
        name={`${name}.cep` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`text-${color}-600`}>{t('address.cep')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  value={formatCEP(field.value as string)}
                  disabled={disabled || isLoading}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                    setCepError(null);
                    if (value.length === 8) {
                      fetchAddress(value);
                    }
                  }}
                  placeholder="00000-000"
                  maxLength={9}
                  className={cn(
                    "pr-10",
                    cepError && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  </div>
                )}
              </div>
            </FormControl>
            {cepError && (
              <p className="text-sm text-red-500 mt-1">{cepError}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${name}.street` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`text-${color}-600`}>{t('address.street')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string} disabled={disabled || isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${name}.number` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`text-${color}-600`}>{t('address.number')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string} disabled={disabled || isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${name}.complement` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`text-${color}-600`}>{t('address.complement')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string} disabled={disabled || isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${name}.neighborhood` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`text-${color}-600`}>{t('address.neighborhood')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string} disabled={disabled || isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${name}.city` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`text-${color}-600`}>{t('address.city')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string} disabled={disabled || isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${name}.state` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`text-${color}-600`}>{t('address.state')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string} disabled={disabled || isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}; 