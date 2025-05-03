import { useForm, useFieldArray, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CurrencyInput from 'react-currency-input-field';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const assetSchema = z.object({
  name: z.string(),
  value: z.number(),
  location: z.string(),
  description: z.string(),
  country: z.string(),
});

const patrimonialSchema = z.object({
  investments: z.object({
    properties: z.array(assetSchema),
    liquid_investments: z.array(assetSchema),
    participations: z.array(assetSchema),
  }),
  personal_assets: z.object({
    properties: z.array(assetSchema),
    vehicles: z.array(assetSchema),
    valuable_goods: z.array(assetSchema),
  }),
  liabilities: z.object({
    financing: z.array(assetSchema),
    debts: z.array(assetSchema),
  }),
});

type PatrimonialFormValues = z.infer<typeof patrimonialSchema>;
type AssetType = z.infer<typeof assetSchema>;

interface PatrimonialFormProps {
  initialData?: PatrimonialFormValues;
  isEditing?: boolean;
  policyId?: string;
}

const defaultEmptyAsset: AssetType = {
  name: '',
  value: 0,
  location: '',
  description: '',
  country: '',
};

export const PatrimonialForm = ({
  initialData,
  isEditing = false,
  policyId,
}: PatrimonialFormProps) => {
  const form = useForm<PatrimonialFormValues>({
    resolver: zodResolver(patrimonialSchema),
    defaultValues: initialData || {
      investments: {
        properties: [defaultEmptyAsset],
        liquid_investments: [defaultEmptyAsset],
        participations: [defaultEmptyAsset],
      },
      personal_assets: {
        properties: [defaultEmptyAsset],
        vehicles: [defaultEmptyAsset],
        valuable_goods: [defaultEmptyAsset],
      },
      liabilities: {
        financing: [defaultEmptyAsset],
        debts: [defaultEmptyAsset],
      },
    },
  });

  // Investment Properties
  const { fields: investmentPropertiesFields, append: appendInvestmentProperty, remove: removeInvestmentProperty } = useFieldArray({
    control: form.control,
    name: 'investments.properties',
  });

  // Liquid Investments
  const { fields: liquidInvestmentsFields, append: appendLiquidInvestment, remove: removeLiquidInvestment } = useFieldArray({
    control: form.control,
    name: 'investments.liquid_investments',
  });

  // Participations
  const { fields: participationsFields, append: appendParticipation, remove: removeParticipation } = useFieldArray({
    control: form.control,
    name: 'investments.participations',
  });

  // Personal Properties
  const { fields: personalPropertiesFields, append: appendPersonalProperty, remove: removePersonalProperty } = useFieldArray({
    control: form.control,
    name: 'personal_assets.properties',
  });

  // Vehicles
  const { fields: vehiclesFields, append: appendVehicle, remove: removeVehicle } = useFieldArray({
    control: form.control,
    name: 'personal_assets.vehicles',
  });

  // Valuable Goods
  const { fields: valuableGoodsFields, append: appendValuableGood, remove: removeValuableGood } = useFieldArray({
    control: form.control,
    name: 'personal_assets.valuable_goods',
  });

  // Financing
  const { fields: financingFields, append: appendFinancing, remove: removeFinancing } = useFieldArray({
    control: form.control,
    name: 'liabilities.financing',
  });

  // Debts
  const { fields: debtsFields, append: appendDebt, remove: removeDebt } = useFieldArray({
    control: form.control,
    name: 'liabilities.debts',
  });

  const handleSubmit = async (data: PatrimonialFormValues) => {
    if (!policyId) return;

    const { error } = await supabase
      .from('patrimonial_situations')
      .upsert([{ ...data, policy_id: policyId }]);

    if (error) {
      console.error('Error updating patrimonial situation:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar situação patrimonial',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Sucesso',
      description: 'Situação patrimonial atualizada com sucesso',
    });
  };

  const renderAssetFields = (
    fields: Record<"id", string>[],
    append: () => void,
    remove: (index: number) => void,
    basePath: string,
    title: string
  ) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        )}
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum item cadastrado</p>
      ) : (
        fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`${basePath}.${index}.name` as FieldPath<PatrimonialFormValues>}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input 
                          {...formField} 
                          value={formField.value as string}
                          disabled={!isEditing} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${basePath}.${index}.value` as FieldPath<PatrimonialFormValues>}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={formField.value as number}
                          onValueChange={(value) => formField.onChange(value ? parseFloat(value) : 0)}
                          disabled={!isEditing}
                          intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${basePath}.${index}.location` as FieldPath<PatrimonialFormValues>}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input 
                          {...formField} 
                          value={formField.value as string}
                          disabled={!isEditing} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${basePath}.${index}.country` as FieldPath<PatrimonialFormValues>}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input 
                          {...formField} 
                          value={formField.value as string}
                          disabled={!isEditing} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${basePath}.${index}.description` as FieldPath<PatrimonialFormValues>}
                  render={({ field: formField }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...formField} 
                          value={formField.value as string}
                          disabled={!isEditing} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="self-center"
                    aria-label="Remover item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Investments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Investimentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderAssetFields(
              investmentPropertiesFields,
              () => appendInvestmentProperty(defaultEmptyAsset),
              removeInvestmentProperty,
              'investments.properties',
              'Imóveis'
            )}

            <Separator />

            {renderAssetFields(
              liquidInvestmentsFields,
              () => appendLiquidInvestment(defaultEmptyAsset),
              removeLiquidInvestment,
              'investments.liquid_investments',
              'Investimentos Líquidos'
            )}

            <Separator />

            {renderAssetFields(
              participationsFields,
              () => appendParticipation(defaultEmptyAsset),
              removeParticipation,
              'investments.participations',
              'Participações'
            )}
          </CardContent>
        </Card>

        {/* Personal Assets Section */}
        <Card>
          <CardHeader>
            <CardTitle>Patrimônio Pessoal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderAssetFields(
              personalPropertiesFields,
              () => appendPersonalProperty(defaultEmptyAsset),
              removePersonalProperty,
              'personal_assets.properties',
              'Imóveis'
            )}

            <Separator />

            {renderAssetFields(
              vehiclesFields,
              () => appendVehicle(defaultEmptyAsset),
              removeVehicle,
              'personal_assets.vehicles',
              'Veículos'
            )}

            <Separator />

            {renderAssetFields(
              valuableGoodsFields,
              () => appendValuableGood(defaultEmptyAsset),
              removeValuableGood,
              'personal_assets.valuable_goods',
              'Bens de Valor'
            )}
          </CardContent>
        </Card>

        {/* Liabilities Section */}
        <Card>
          <CardHeader>
            <CardTitle>Passivos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderAssetFields(
              financingFields,
              () => appendFinancing(defaultEmptyAsset),
              removeFinancing,
              'liabilities.financing',
              'Financiamentos'
            )}

            <Separator />

            {renderAssetFields(
              debtsFields,
              () => appendDebt(defaultEmptyAsset),
              removeDebt,
              'liabilities.debts',
              'Dívidas'
            )}
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