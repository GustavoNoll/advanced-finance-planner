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
}

const workRegimes = [
  { value: 'clt', label: 'CLT' },
  { value: 'pj', label: 'PJ' },
  { value: 'public_servant', label: 'Funcionário Público' },
];

const taxDeclarationMethods = [
  { value: 'simplified', label: 'Simplificado' },
  { value: 'complete', label: 'Completo' },
  { value: 'exempt', label: 'Não Declara' },
];

export const ProfessionalInformationForm = ({
  initialData,
  isEditing = false,
  policyId,
}: ProfessionalInformationFormProps) => {
  const form = useForm<ProfessionalInformationFormValues>({
    resolver: zodResolver(professionalInformationSchema),
    defaultValues: initialData || {
      occupation: '',
      work_description: '',
      work_location: '',
      work_regime: undefined,
      tax_declaration_method: undefined,
    },
  });

  const handleSubmit = async (data: ProfessionalInformationFormValues) => {
    if (!policyId) return;

    const { error } = await supabase
      .from('professional_information')
      .upsert([{ ...data, policy_id: policyId }]);

    if (error) {
      console.error('Error updating professional information:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar informações profissionais',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Sucesso',
      description: 'Informações profissionais atualizadas com sucesso',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissão</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sua profissão"
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
                  <FormLabel>O que faz</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição das suas atividades profissionais"
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
                  <FormLabel>Onde trabalha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Local de trabalho"
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
                  <FormLabel>Regime de trabalho</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o regime de trabalho" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workRegimes.map((regime) => (
                        <SelectItem key={regime.value} value={regime.value}>
                          {regime.label}
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
                  <FormLabel>Como declara IR</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método de declaração" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taxDeclarationMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
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
            <Button type="submit">Salvar Alterações</Button>
          </div>
        )}
      </form>
    </Form>
  );
}; 