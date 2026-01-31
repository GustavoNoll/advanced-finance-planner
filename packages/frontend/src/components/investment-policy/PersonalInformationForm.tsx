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
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { formatDateByLocale, parseDateByLocale } from '@/utils/dateUtils'

const personalInformationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
});

type PersonalInformationFormValues = z.infer<typeof personalInformationSchema>;

interface PersonalInformationFormProps {
  initialData?: PersonalInformationFormValues;
  isEditing?: boolean;
  clientId?: string;
}

export function PersonalInformationForm({
  initialData,
  isEditing = false,
  clientId,
}: PersonalInformationFormProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentData, setCurrentData] = useState<PersonalInformationFormValues>({
    name: initialData?.name || '',
    birth_date: initialData?.birth_date || '',
  });

  useEffect(() => {
    if (initialData) {
      setCurrentData({
        name: initialData.name || '',
        birth_date: initialData.birth_date || '',
      });
    }
  }, [initialData]);

  const form = useForm<PersonalInformationFormValues>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: currentData,
  });

  // ESC key handler to cancel editing
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEditMode) {
        form.reset(currentData);
        setIsEditMode(false);
      }
    };

    if (isEditMode) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditMode, currentData, form]);

  const handleSubmit = async (data: PersonalInformationFormValues) => {
    if (!clientId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          birth_date: data.birth_date,
        })
        .eq('id', clientId);

      if (error) throw error;

      // Atualiza o estado local
      setCurrentData(data);

      // Invalida as queries para atualizar os dados em outros componentes
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      await queryClient.invalidateQueries({ queryKey: ['investmentPolicy', clientId] });

      toast({
        title: t('common.success'),
        description: t('personalInformation.messages.success'),
      });

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating information:', error);
      toast({
        title: t('common.error'),
        description: t('personalInformation.messages.error'),
        variant: 'destructive',
      });
    }
  };

  const renderReadOnlyView = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('personalInformation.title')}</CardTitle>
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
            <p className="text-sm text-muted-foreground">{t('personalInformation.name.label')}</p>
            <p className="font-medium">{currentData.name || t('common.notInformed')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('personalInformation.birthDate.label')}</p>
            <p className="font-medium">
              {currentData.birth_date ? formatDateByLocale(parseDateByLocale(currentData.birth_date, 'yyyy-MM-dd')) : t('common.notInformed')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFormView = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('personalInformation.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('personalInformation.name.label')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('personalInformation.name.placeholder')}
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
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('personalInformation.birthDate.label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value}
                        onChange={(e) => {
                          const date = parseDateByLocale(e.target.value, 'yyyy-MM-dd');
                          field.onChange(date ? formatDateByLocale(date, 'yyyy-MM-dd') : '');
                        }}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center gap-4">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Info className="w-4 h-4 text-blue-500" />
              {t('personalInformation.save_changes', 'Salvar alterações em Informações Pessoais')}
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