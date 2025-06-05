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
import { Plus, Trash2, Pencil, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useQueryClient } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '@/utils/string';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

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
    emergency_reserve: z.array(assetSchema),
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
  clientId?: string;
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
  clientId,
}: PatrimonialFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const form = useForm<PatrimonialFormValues>({
    resolver: zodResolver(patrimonialSchema),
    defaultValues: initialData || {
      investments: {
        properties: [defaultEmptyAsset],
        liquid_investments: [defaultEmptyAsset],
        participations: [defaultEmptyAsset],
        emergency_reserve: [defaultEmptyAsset],
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

  // Emergency Reserve
  const { fields: emergencyReserveFields, append: appendEmergencyReserve, remove: removeEmergencyReserve } = useFieldArray({
    control: form.control,
    name: 'investments.emergency_reserve',
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

    try {
      const { error } = await supabase
        .from('patrimonial_situations')
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
        description: t('patrimonial.messages.success'),
      });

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating patrimonial situation:', error);
      toast({
        title: t('common.error'),
        description: t('patrimonial.messages.error'),
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderAssetFields = (
    fields: Record<"id", string>[],
    append: () => void,
    remove: (index: number) => void,
    basePath: string,
    title: string,
    color: string
  ) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t(`patrimonial.form.${title}.title`)}</h3>
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append()}
            className={`bg-${color}-100 hover:bg-${color}-200`}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t(`patrimonial.form.${title}.add`)}
          </Button>
        )}
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t(`patrimonial.form.${title}.empty`)}</p>
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
                      <FormLabel className={`text-${color}-600`}>{t(`patrimonial.form.${title}.name`)}</FormLabel>
                      <FormControl>
                        <Input 
                          {...formField} 
                          value={formField.value as string}
                          disabled={!isEditing}
                          onChange={(e) => formField.onChange(capitalizeFirstLetter(e.target.value))}
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
                      <FormLabel className={`text-${color}-600`}>{t(`patrimonial.form.${title}.value`)}</FormLabel>
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
                      <FormLabel className={`text-${color}-600`}>{t(`patrimonial.form.${title}.location`)}</FormLabel>
                      <FormControl>
                        <Input 
                          {...formField} 
                          value={formField.value as string}
                          disabled={!isEditing}
                          onChange={(e) => formField.onChange(capitalizeFirstLetter(e.target.value))}
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
                      <FormLabel className={`text-${color}-600`}>{t(`patrimonial.form.${title}.country`)}</FormLabel>
                      <FormControl>
                        <Input 
                          {...formField} 
                          value={formField.value as string}
                          disabled={!isEditing}
                          onChange={(e) => formField.onChange(capitalizeFirstLetter(e.target.value))}
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
                      <FormLabel className={`text-${color}-600`}>{t(`patrimonial.form.${title}.description`)}</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...formField} 
                          value={formField.value as string}
                          disabled={!isEditing}
                          onChange={(e) => formField.onChange(capitalizeFirstLetter(e.target.value))}
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
                    aria-label={t(`patrimonial.form.${title}.remove`)}
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

  const renderReadOnlyView = () => {
    const values = form.getValues() || {
      investments: {
        properties: [],
        liquid_investments: [],
        participations: [],
        emergency_reserve: [],
      },
      personal_assets: {
        properties: [],
        vehicles: [],
        valuable_goods: [],
      },
      liabilities: {
        financing: [],
        debts: [],
      },
    };
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('patrimonial.title')}</CardTitle>
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
        <CardContent className="space-y-8">
          {/* Investments Section */}
          <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-900">{t('patrimonial.form.investments.title')}</h2>
            </div>
            <p className="text-sm text-blue-700">{t('patrimonial.form.investments.description')}</p>
            
            {/* Properties */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-black">{t('patrimonial.form.investments.properties.title')}</h4>
              {(!values.investments?.properties || values.investments.properties.length === 0) ? (
                <p className="text-sm">{t('patrimonial.form.investments.properties.empty')}</p>
              ) : (
                values.investments.properties.map((property, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-blue-500 pl-4 bg-white rounded-r-lg p-4">
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.properties.name')}</p>
                      <p className="font-medium">{property.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.properties.value')}</p>
                      <p className="font-medium">{formatCurrency(property.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.properties.location')}</p>
                      <p className="font-medium">{property.location || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.properties.country')}</p>
                      <p className="font-medium">{property.country || 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.properties.description')}</p>
                      <p className="font-medium">{property.description || 'Não informado'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-6" />

            {/* Liquid Investments */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-black">{t('patrimonial.form.investments.liquid_investments.title')}</h4>
              {(!values.investments?.liquid_investments || values.investments.liquid_investments.length === 0) ? (
                <p className="text-sm">{t('patrimonial.form.investments.liquid_investments.empty')}</p>
              ) : (
                values.investments.liquid_investments.map((investment, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-blue-500 pl-4 bg-white rounded-r-lg p-4">
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.liquid_investments.name')}</p>
                      <p className="font-medium">{investment.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.liquid_investments.value')}</p>
                      <p className="font-medium">{formatCurrency(investment.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.liquid_investments.location')}</p>
                      <p className="font-medium">{investment.location || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.liquid_investments.country')}</p>
                      <p className="font-medium">{investment.country || 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.liquid_investments.description')}</p>
                      <p className="font-medium">{investment.description || 'Não informado'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-6" />

            {/* Participations */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-black">{t('patrimonial.form.investments.participations.title')}</h4>
              {(!values.investments?.participations || values.investments.participations.length === 0) ? (
                <p className="text-sm">{t('patrimonial.form.investments.participations.empty')}</p>
              ) : (
                values.investments.participations.map((participation, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-blue-500 pl-4 bg-white rounded-r-lg p-4">
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.participations.name')}</p>
                      <p className="font-medium">{participation.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.participations.value')}</p>
                      <p className="font-medium">{formatCurrency(participation.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.participations.location')}</p>
                      <p className="font-medium">{participation.location || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.participations.country')}</p>
                      <p className="font-medium">{participation.country || 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.participations.description')}</p>
                      <p className="font-medium">{participation.description || 'Não informado'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-6" />

            {/* Emergency Reserve */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-black">{t('patrimonial.form.investments.emergency_reserve.title')}</h4>
              {(!values.investments?.emergency_reserve || values.investments.emergency_reserve.length === 0) ? (
                <p className="text-sm">{t('patrimonial.form.investments.emergency_reserve.empty')}</p>
              ) : (
                values.investments.emergency_reserve.map((reserve, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-blue-500 pl-4 bg-white rounded-r-lg p-4">
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.emergency_reserve.name')}</p>
                      <p className="font-medium">{reserve.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.emergency_reserve.value')}</p>
                      <p className="font-medium">{formatCurrency(reserve.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.emergency_reserve.location')}</p>
                      <p className="font-medium">{reserve.location || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.emergency_reserve.country')}</p>
                      <p className="font-medium">{reserve.country || 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-blue-600">{t('patrimonial.form.investments.emergency_reserve.description')}</p>
                      <p className="font-medium">{reserve.description || 'Não informado'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Personal Assets Section */}
          <div className="space-y-4 bg-green-50 p-6 rounded-lg border border-green-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-green-900">{t('patrimonial.form.personal_assets.title')}</h2>
            </div>
            <p className="text-sm text-green-700">{t('patrimonial.form.personal_assets.description')}</p>
            
            {/* Properties */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-black">{t('patrimonial.form.personal_assets.properties.title')}</h4>
              {(!values.personal_assets?.properties || values.personal_assets.properties.length === 0) ? (
                <p className="text-sm">{t('patrimonial.form.personal_assets.properties.empty')}</p>
              ) : (
                values.personal_assets.properties.map((property, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-green-500 pl-4 bg-white rounded-r-lg p-4">
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.properties.name')}</p>
                      <p className="font-medium">{property.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.properties.value')}</p>
                      <p className="font-medium">{formatCurrency(property.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.properties.location')}</p>
                      <p className="font-medium">{property.location || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.properties.country')}</p>
                      <p className="font-medium">{property.country || 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.properties.description')}</p>
                      <p className="font-medium">{property.description || 'Não informado'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-6" />

            {/* Vehicles */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-black">{t('patrimonial.form.personal_assets.vehicles.title')}</h4>
              {(!values.personal_assets?.vehicles || values.personal_assets.vehicles.length === 0) ? (
                <p className="text-sm">{t('patrimonial.form.personal_assets.vehicles.empty')}</p>
              ) : (
                values.personal_assets.vehicles.map((vehicle, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-green-500 pl-4 bg-white rounded-r-lg p-4">
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.vehicles.name')}</p>
                      <p className="font-medium">{vehicle.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.vehicles.value')}</p>
                      <p className="font-medium">{formatCurrency(vehicle.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.vehicles.location')}</p>
                      <p className="font-medium">{vehicle.location || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.vehicles.country')}</p>
                      <p className="font-medium">{vehicle.country || 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.vehicles.description')}</p>
                      <p className="font-medium">{vehicle.description || 'Não informado'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-6" />

            {/* Valuable Goods */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-black">{t('patrimonial.form.personal_assets.valuable_goods.title')}</h4>
              {(!values.personal_assets?.valuable_goods || values.personal_assets.valuable_goods.length === 0) ? (
                <p className="text-sm">{t('patrimonial.form.personal_assets.valuable_goods.empty')}</p>
              ) : (
                values.personal_assets.valuable_goods.map((good, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-green-500 pl-4 bg-white rounded-r-lg p-4">
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.valuable_goods.name')}</p>
                      <p className="font-medium">{good.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.valuable_goods.value')}</p>
                      <p className="font-medium">{formatCurrency(good.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.valuable_goods.location')}</p>
                      <p className="font-medium">{good.location || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.valuable_goods.country')}</p>
                      <p className="font-medium">{good.country || 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-green-600">{t('patrimonial.form.personal_assets.valuable_goods.description')}</p>
                      <p className="font-medium">{good.description || 'Não informado'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Liabilities Section */}
          <div className="space-y-4 bg-red-50 p-6 rounded-lg border border-red-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-red-900">{t('patrimonial.form.liabilities.title')}</h2>
            </div>
            <p className="text-sm text-red-700">{t('patrimonial.form.liabilities.description')}</p>
            
            {/* Financing */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-black">{t('patrimonial.form.liabilities.financing.title')}</h4>
              {(!values.liabilities?.financing || values.liabilities.financing.length === 0) ? (
                <p className="text-sm">{t('patrimonial.form.liabilities.financing.empty')}</p>
              ) : (
                values.liabilities.financing.map((financing, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-red-500 pl-4 bg-white rounded-r-lg p-4">
                    <div>
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.financing.name')}</p>
                      <p className="font-medium">{financing.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.financing.value')}</p>
                      <p className="font-medium">{formatCurrency(financing.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.financing.location')}</p>
                      <p className="font-medium">{financing.location || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.financing.country')}</p>
                      <p className="font-medium">{financing.country || 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.financing.description')}</p>
                      <p className="font-medium">{financing.description || 'Não informado'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-6" />

            {/* Debts */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-black">{t('patrimonial.form.liabilities.debts.title')}</h4>
              {(!values.liabilities?.debts || values.liabilities.debts.length === 0) ? (
                <p className="text-sm">{t('patrimonial.form.liabilities.debts.empty')}</p>
              ) : (
                values.liabilities.debts.map((debt, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-red-500 pl-4 bg-white rounded-r-lg p-4">
                    <div>
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.debts.name')}</p>
                      <p className="font-medium">{debt.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.debts.value')}</p>
                      <p className="font-medium">{formatCurrency(debt.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.debts.location')}</p>
                      <p className="font-medium">{debt.location || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.debts.country')}</p>
                      <p className="font-medium">{debt.country || 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-red-600">{t('patrimonial.form.liabilities.debts.description')}</p>
                      <p className="font-medium">{debt.description || 'Não informado'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
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
            <CardTitle>{t('patrimonial.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Investments Section */}
            <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-blue-900">{t('patrimonial.form.investments.title')}</h2>
              </div>
              <p className="text-sm text-blue-700">{t('patrimonial.form.investments.description')}</p>

              {renderAssetFields(
                investmentPropertiesFields,
                () => appendInvestmentProperty(defaultEmptyAsset),
                removeInvestmentProperty,
                'investments.properties',
                'investments.properties',
                'blue'
              )}

              <Separator className="my-6" />

              {renderAssetFields(
                liquidInvestmentsFields,
                () => appendLiquidInvestment(defaultEmptyAsset),
                removeLiquidInvestment,
                'investments.liquid_investments',
                'investments.liquid_investments',
                'blue'
              )}

              <Separator className="my-6" />

              {renderAssetFields(
                participationsFields,
                () => appendParticipation(defaultEmptyAsset),
                removeParticipation,
                'investments.participations',
                'investments.participations',
                'blue'
              )}

              <Separator className="my-6" />

              {renderAssetFields(
                emergencyReserveFields,
                () => appendEmergencyReserve(defaultEmptyAsset),
                removeEmergencyReserve,
                'investments.emergency_reserve',
                'investments.emergency_reserve',
                'blue'
              )}
            </div>

            {/* Personal Assets Section */}
            <div className="space-y-4 bg-green-50 p-6 rounded-lg border border-green-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-green-900">{t('patrimonial.form.personal_assets.title')}</h2>
              </div>
              <p className="text-sm text-green-700">{t('patrimonial.form.personal_assets.description')}</p>

              {renderAssetFields(
                personalPropertiesFields,
                () => appendPersonalProperty(defaultEmptyAsset),
                removePersonalProperty,
                'personal_assets.properties',
                'personal_assets.properties',
                'green'
              )}

              <Separator className="my-6" />

              {renderAssetFields(
                vehiclesFields,
                () => appendVehicle(defaultEmptyAsset),
                removeVehicle,
                'personal_assets.vehicles',
                'personal_assets.vehicles',
                'green'
              )}

              <Separator className="my-6" />

              {renderAssetFields(
                valuableGoodsFields,
                () => appendValuableGood(defaultEmptyAsset),
                removeValuableGood,
                'personal_assets.valuable_goods',
                'personal_assets.valuable_goods',
                'green'
              )}
            </div>

            {/* Liabilities Section */}
            <div className="space-y-4 bg-red-50 p-6 rounded-lg border border-red-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-red-900">{t('patrimonial.form.liabilities.title')}</h2>
              </div>
              <p className="text-sm text-red-700">{t('patrimonial.form.liabilities.description')}</p>

              {renderAssetFields(
                financingFields,
                () => appendFinancing(defaultEmptyAsset),
                removeFinancing,
                'liabilities.financing',
                'liabilities.financing',
                'red'
              )}

              <Separator className="my-6" />

              {renderAssetFields(
                debtsFields,
                () => appendDebt(defaultEmptyAsset),
                removeDebt,
                'liabilities.debts',
                'liabilities.debts',
                'red'
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center gap-4">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Info className="w-4 h-4 text-blue-500" />
              {t('patrimonial.save_changes')}
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