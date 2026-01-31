// 1. Imports externos
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import * as z from 'zod'
import { Pencil, Info } from 'lucide-react'

// 2. Imports internos (shared)
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'

// 3. Imports internos (feature)
import { supabase } from '@/lib/supabase'
import { ProfessionalInformation } from '@/services/investment-policy.service'

const professionalInformationSchema = z.object({
  occupation: z.string().min(1, 'Profissão é obrigatória'),
  work_description: z.string().optional(),
  work_location: z.string().optional(),
  work_regime: z.enum(['pj', 'clt', 'public_servant'], {
    required_error: 'Regime de trabalho é obrigatório',
  }),
  tax_declaration_method: z.enum(['simplified', 'complete', 'exempt'], {
    required_error: 'Método de declaração de IR é obrigatório',
  }),
});

type ProfessionalInformationFormValues = z.infer<typeof professionalInformationSchema>;

interface ProfessionalInformationFormProps {
  initialData?: ProfessionalInformation;
  isEditing?: boolean;
  policyId?: string;
  clientId?: string;
}

const workRegimes = [
  { value: 'pj' },
  { value: 'clt' },
  { value: 'public_servant' },
];

const taxDeclarationMethods = [
  { value: 'simplified' },
  { value: 'complete' },
  { value: 'exempt' },
];

export function ProfessionalInformationForm({
  initialData,
  isEditing = false,
  policyId,
  clientId,
}: ProfessionalInformationFormProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isEditMode, setIsEditMode] = useState(false);
  const form = useForm<ProfessionalInformationFormValues>({
    resolver: zodResolver(professionalInformationSchema),
    defaultValues: {
      occupation: initialData?.occupation || '',
      work_description: initialData?.work_description || '',
      work_location: initialData?.work_location || '',
      work_regime: initialData?.work_regime,
      tax_declaration_method: initialData?.tax_declaration_method
    },
  });

  // ESC key handler to cancel editing
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEditMode) {
        form.reset({
          occupation: initialData?.occupation || '',
          work_description: initialData?.work_description || '',
          work_location: initialData?.work_location || '',
          work_regime: initialData?.work_regime,
          tax_declaration_method: initialData?.tax_declaration_method
        });
        setIsEditMode(false);
      }
    };

    if (isEditMode) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditMode, initialData, form]);

  const handleSubmit = async (data: ProfessionalInformationFormValues) => {
    if (!policyId) return;

    try {
      const { error } = await supabase
        .from('professional_information')
        .upsert(
          { 
            ...data, 
            policy_id: policyId,
            updated_at: new Date().toISOString()
          },
          { 
            onConflict: 'policy_id',
            ignoreDuplicates: false
          }
        );

      if (error) throw error;

      if (clientId) queryClient.invalidateQueries({ queryKey: ['investmentPolicy', clientId] });

      toast({
        title: t('common.success'),
        description: t('professionalInformation.messages.success'),
      });

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating professional information:', error);
      toast({
        title: t('common.error'),
        description: t('professionalInformation.messages.error'),
        variant: 'destructive',
      });
    }
  };

  const renderReadOnlyView = () => {
    const values = form.getValues();
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('professionalInformation.title')}</CardTitle>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              {t('common.edit')}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('professionalInformation.occupation.label')}</p>
              <p className="font-medium">{values.occupation || t('common.notInformed')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('professionalInformation.workLocation.label')}</p>
              <p className="font-medium">{values.work_location || t('common.notInformed')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('professionalInformation.workRegime.label')}</p>
              <p className="font-medium">
                {values.work_regime ? t(`professionalInformation.workRegime.options.${values.work_regime}`) : t('common.notInformed')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('professionalInformation.taxDeclarationMethod.label')}</p>
              <p className="font-medium">
                {values.tax_declaration_method ? t(`professionalInformation.taxDeclarationMethod.options.${values.tax_declaration_method}`) : t('common.notInformed')}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('professionalInformation.workDescription.label')}</p>
            <p className="font-medium">{values.work_description || t('common.notInformed')}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFormView = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('professionalInformation.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-24">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('professionalInformation.occupation.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('professionalInformation.occupation.placeholder')}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('professionalInformation.workDescription.label')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('professionalInformation.workDescription.placeholder')}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('professionalInformation.workLocation.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('professionalInformation.workLocation.placeholder')}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_regime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('professionalInformation.workRegime.label')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('professionalInformation.workRegime.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workRegimes.map((regime) => (
                        <SelectItem key={regime.value} value={regime.value}>
                          {t(`professionalInformation.workRegime.options.${regime.value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_declaration_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('professionalInformation.taxDeclarationMethod.label')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('professionalInformation.taxDeclarationMethod.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taxDeclarationMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {t(`professionalInformation.taxDeclarationMethod.options.${method.value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center gap-4">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Info className="w-4 h-4 text-blue-500" />
              {t('professionalInformation.save_changes', 'Salvar alterações em Informações Profissionais')}
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMode(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </div>
      </form>
    </Form>
  );

  return isEditMode ? renderFormView() : renderReadOnlyView();
}; 