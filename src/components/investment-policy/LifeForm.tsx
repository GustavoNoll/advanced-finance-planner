import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const hobbySchema = z.object({
  name: z.string(),
});

const objectiveSchema = z.object({
  name: z.string(),
});

const insuranceSchema = z.object({
  type: z.string(),
  company: z.string(),
  last_review_date: z.string(),
});

const lifeSchema = z.object({
  life_stage: z.enum(['accumulation', 'enjoyment', 'consolidation']),
  hobbies: z.array(hobbySchema),
  objectives: z.array(objectiveSchema),
  insurances: z.array(insuranceSchema),
});

type LifeFormValues = z.infer<typeof lifeSchema>;

interface LifeFormProps {
  initialData?: LifeFormValues;
  isEditing?: boolean;
  policyId?: string;
}

const defaultEmptyHobby = {
  name: '',
};

const defaultEmptyObjective = {
  name: '',
};

const defaultEmptyInsurance = {
  type: '',
  company: '',
  last_review_date: '',
};

export const LifeForm = ({
  initialData,
  isEditing = false,
  policyId,
}: LifeFormProps) => {
  const form = useForm<LifeFormValues>({
    resolver: zodResolver(lifeSchema),
    defaultValues: initialData || {
      life_stage: 'accumulation',
      hobbies: [defaultEmptyHobby],
      objectives: [defaultEmptyObjective],
      insurances: [],
    },
  });

  const { fields: hobbiesFields, append: appendHobby, remove: removeHobby } = useFieldArray({
    control: form.control,
    name: 'hobbies',
  });

  const { fields: objectivesFields, append: appendObjective, remove: removeObjective } = useFieldArray({
    control: form.control,
    name: 'objectives',
  });

  const { fields: insurancesFields, append: appendInsurance, remove: removeInsurance } = useFieldArray({
    control: form.control,
    name: 'insurances',
  });

  const handleSubmit = async (data: LifeFormValues) => {
    if (!policyId) return;

    const { error } = await supabase
      .from('life_information')
      .upsert([{ ...data, policy_id: policyId }]);

    if (error) {
      console.error('Error updating life information:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar informações de vida',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Sucesso',
      description: 'Informações de vida atualizadas com sucesso',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Life Stage Section */}
        <Card>
          <CardHeader>
            <CardTitle>Momento de Vida</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="life_stage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      disabled={!isEditing}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="accumulation" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Acumulação de Patrimônio
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="enjoyment" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Usufruto de Patrimônio
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="consolidation" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Consolidação
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Hobbies Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hobbies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hobbiesFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name={`hobbies.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nome do Hobbie</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHobby(index)}
                      className="self-center"
                      aria-label="Remover hobbie"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendHobby(defaultEmptyHobby)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Hobbie
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Objectives Section */}
        <Card>
          <CardHeader>
            <CardTitle>Objetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectivesFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name={`objectives.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nome do Objetivo</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeObjective(index)}
                      className="self-center"
                      aria-label="Remover objetivo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendObjective(defaultEmptyObjective)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Objetivo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insurance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Seguros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {insurancesFields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-lg">
                  <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`insurances.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Tipo de Seguro</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Vida, Casa, Auto" disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInsurance(index)}
                        className="self-center"
                        aria-label="Remover seguro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name={`insurances.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seguradora</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`insurances.${index}.last_review_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Última revisão</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendInsurance(defaultEmptyInsurance)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Seguro
                </Button>
              )}
            </div>
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