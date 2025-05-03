import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const professionalInformationSchema = z.object({
  occupation: z.string().min(1, 'Profissão é obrigatória'),
  work_description: z.string().min(1, 'Descrição do trabalho é obrigatória'),
  work_location: z.string().min(1, 'Local de trabalho é obrigatório'),
  work_regime: z.enum(['pj', 'clt', 'public_servant'], {
    required_error: 'Regime de trabalho é obrigatório',
  }),
  tax_declaration_method: z.enum(['simplified', 'complete', 'exempt'], {
    required_error: 'Método de declaração de IR é obrigatório',
  }),
});

type ProfessionalInformationFormValues = z.infer<typeof professionalInformationSchema>;

interface ProfessionalInformationFormProps {
  initialData?: ProfessionalInformationFormValues;
  isEditing?: boolean;
  policyId?: string;
  clientId: string;
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

export const ProfessionalInformationForm = ({
  initialData,
  isEditing = false,
  policyId,
  clientId,
}: ProfessionalInformationFormProps) => {
  const { t } = useTranslation();
  const form = useForm<ProfessionalInformationFormValues>({
    resolver: zodResolver(professionalInformationSchema),
    defaultValues: {
      occupation: initialData?.occupation || '',
      work_description: initialData?.work_description || '',
      work_location: initialData?.work_location || '',
      work_regime: initialData?.work_regime || undefined,
      tax_declaration_method: initialData?.tax_declaration_method || undefined,
    },
  });

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

      toast({
        title: t('common.success'),
        description: t('professionalInformation.messages.success'),
      });
    } catch (error) {
      console.error('Error updating professional information:', error);
      toast({
        title: t('common.error'),
        description: t('professionalInformation.messages.error'),
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
          </CardHeader>
          <CardContent className="space-y-4">
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

        {isEditing && (
          <div className="flex justify-end">
            <Button type="submit">{t('common.save')}</Button>
          </div>
        )}
      </form>
    </Form>
  );
}; 