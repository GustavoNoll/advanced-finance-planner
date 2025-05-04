import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '@/utils/string';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

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
  clientId?: string;
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
  clientId,
}: LifeFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
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

    try {
      const { error } = await supabase
        .from('life_information')
        .upsert([{ ...data, policy_id: policyId }], {
          onConflict: 'policy_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;

      if (clientId) queryClient.invalidateQueries({ queryKey: ['investmentPolicy', clientId] });

      toast({
        title: t('common.success'),
        description: t('life.messages.success'),
      });

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating life information:', error);
      toast({
        title: t('common.error'),
        description: t('life.messages.error'),
        variant: 'destructive',
      });
    }
  };

  const renderReadOnlyView = () => {
    const lifeStage = form.getValues('life_stage');
    const hobbies = form.getValues('hobbies') || [];
    const objectives = form.getValues('objectives') || [];
    const insurances = form.getValues('insurances') || [];

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('investmentPolicy.lifeStage.label')}</CardTitle>
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
        <CardContent className="space-y-6">
          {/* Life Stage Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('investmentPolicy.lifeStage.label')}</h3>
            <p className="font-medium">{lifeStage ? t(`investmentPolicy.lifeStage.options.${lifeStage}`) : t('common.notInformed')}</p>
          </div>

          {/* Hobbies Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('investmentPolicy.hobbies.label')}</h3>
            {hobbies.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('common.notInformed')}</p>
            ) : (
              <div className="space-y-2">
                {hobbies.map((hobby, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <p className="font-medium">{hobby.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Objectives Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('investmentPolicy.objectives.label')}</h3>
            {objectives.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('common.notInformed')}</p>
            ) : (
              <div className="space-y-2">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <p className="font-medium">{objective.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insurance Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('investmentPolicy.insurance.hasInsurance')}</h3>
            {insurances.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('common.notInformed')}</p>
            ) : (
              <div className="space-y-4">
                {insurances.map((insurance, index) => (
                  <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('clientSummary.insuranceType')}</p>
                        <p className="font-medium">{insurance.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('clientSummary.insuranceCompany')}</p>
                        <p className="font-medium">{insurance.company}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('clientSummary.lastReview')}</p>
                        <p className="font-medium">{insurance.last_review_date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <CardTitle>{t('investmentPolicy.lifeStage.label')}</CardTitle>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMode(false)}
            >
              {t('common.cancel')}
            </Button>
          </CardHeader>
          <CardContent>
            {/* Life Stage Section */}
            <div className="space-y-4">
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
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="accumulation" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('investmentPolicy.lifeStage.options.accumulation')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="enjoyment" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('investmentPolicy.lifeStage.options.enjoyment')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="consolidation" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('investmentPolicy.lifeStage.options.consolidation')}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hobbies Section */}
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('investmentPolicy.hobbies.label')}</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendHobby(defaultEmptyHobby)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('common.add')} {t('clientSummary.hobbies')}
                </Button>
              </div>
              <div className="space-y-4">
                {hobbiesFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`hobbies.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('clientSummary.hobbies')}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHobby(index)}
                      className="self-center"
                      aria-label={t('common.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Objectives Section */}
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('investmentPolicy.objectives.label')}</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendObjective(defaultEmptyObjective)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('common.add')} {t('clientSummary.lifeObjectives')}
                </Button>
              </div>
              <div className="space-y-4">
                {objectivesFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`objectives.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('clientSummary.lifeObjectives')}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeObjective(index)}
                      className="self-center"
                      aria-label={t('common.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Section */}
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('investmentPolicy.insurance.hasInsurance')}</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendInsurance(defaultEmptyInsurance)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('common.add')} {t('investmentPolicy.insurance.hasInsurance')}
                </Button>
              </div>
              <div className="space-y-4">
                {insurancesFields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-lg">
                    <div className="flex items-end gap-4">
                      <FormField
                        control={form.control}
                        name={`insurances.${index}.type`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>{t('clientSummary.insuranceType')}</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInsurance(index)}
                        className="self-center"
                        aria-label={t('common.delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`insurances.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('clientSummary.insuranceCompany')}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                            />
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
                          <FormLabel>{t('clientSummary.lastReview')}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">{t('common.save')}</Button>
        </div>
      </form>
    </Form>
  );

  return isEditMode ? renderFormView() : renderReadOnlyView();
}; 