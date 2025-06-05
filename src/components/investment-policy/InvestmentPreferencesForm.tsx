import React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Pencil, Info } from 'lucide-react';
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { DEFAULT_ASSET_ALLOCATIONS, ASSET_CLASS_LABELS } from '@/constants/assetAllocations';
import { useQueryClient } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '@/utils/string';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type AssetAllocationValue = number | string;

const investmentPreferencesSchema = z.object({
  target_return_review: z.string().optional(),
  max_bond_maturity: z.string().optional(),
  fgc_event_feeling: z.string().optional(),
  max_fund_liquidity: z.string().optional(),
  max_acceptable_loss: z.string().optional(),
  target_return_ipca_plus: z.string().optional(),
  stock_investment_mode: z.string().optional(),
  real_estate_funds_mode: z.string().optional(),
  platforms_used: z.array(z.object({ name: z.string() })),
  asset_restrictions: z.array(z.object({ name: z.string() })),
  areas_of_interest: z.array(z.object({ name: z.string() })),
  risk_profile: z.enum(['CONS', 'MOD', 'ARROJ', 'AGRESSIVO']).optional(),
  asset_allocations: z.record(z.number().min(0).max(100)).refine(
    (allocations) => {
      const total = Object.values(allocations).reduce((sum, value) => sum + value, 0);
      return total === 100;
    },
    {
      message: 'A soma das alocações deve ser igual a 100%',
    }
  ),
});

type InvestmentPreferencesFormValues = z.infer<typeof investmentPreferencesSchema>;

interface InvestmentPreferencesFormProps {
  initialData?: InvestmentPreferencesFormValues;
  assetAllocations?: Record<string, number>;
  isEditing?: boolean;
  policyId?: string;
  clientId?: string;
}

const investmentModes = [
  { value: 'direct_stocks', label: 'Ações Diretas' },
  { value: 'etfs', label: 'ETFs' },
  { value: 'stock_funds', label: 'Fundos de Ações' },
];

const reviewPeriods = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'semiannual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' },
];

const fgcFeelings = [
  { value: 'very_comfortable', label: 'Muito Confortável' },
  { value: 'comfortable', label: 'Confortável' },
  { value: 'neutral', label: 'Neutro' },
  { value: 'uncomfortable', label: 'Desconfortável' },
  { value: 'very_uncomfortable', label: 'Muito Desconfortável' },
];

const fundLiquidity = [
  { value: 'daily', label: 'Diário' },
  { value: 'd_plus_1', label: 'D+1' },
  { value: 'd_plus_2', label: 'D+2' },
  { value: 'd_plus_30', label: 'D+30' },
  { value: 'd_plus_90', label: 'D+90' },
];

const realEstateFundModes = [
  { value: 'direct_portfolio', label: 'Carteira de Fundos' },
  { value: 'fofs_consolidation', label: 'Consolidação em FoFs' },
];

const riskProfiles = RISK_PROFILES.BRL;

const ASSET_CATEGORIES = {
  fixed_income: {
    title: 'Renda Fixa',
    assets: [
      'fixed_income_opportunities',
      'fixed_income_post_fixed',
      'fixed_income_inflation',
      'fixed_income_pre_fixed',
    ],
  },
  multimarket: {
    title: 'Multimercado',
    assets: ['multimarket'],
  },
  real_estate: {
    title: 'Imobiliário',
    assets: ['real_estate'],
  },
  stocks: {
    title: 'Ações',
    assets: ['stocks', 'stocks_long_biased', 'private_equity'],
  },
  foreign_crypto: {
    title: 'Exterior/Cripto',
    assets: ['foreign_fixed_income', 'foreign_variable_income', 'crypto'],
  },
} as const;

const bondMaturities = Array.from({ length: 10 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1} ${i === 0 ? 'ano' : 'anos'}`
}));

const targetReturns = Array.from({ length: 6 }, (_, i) => ({
  value: `${i + 3}`,
  label: `IPCA + ${i + 3}%`
}));

export const InvestmentPreferencesForm = ({
  initialData,
  assetAllocations,
  isEditing = false,
  policyId,
  clientId,
}: InvestmentPreferencesFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [totalAllocation, setTotalAllocation] = useState(0);
  const initialFormValues = useRef<InvestmentPreferencesFormValues | undefined>(initialData);

  const handleCancelEdit = () => {
    // Reset form to initial values
    form.reset(initialFormValues.current);
    setIsEditMode(false);
  };

  const acceptableLoss = [
    { value: '0', label: t('investmentPreferences.options.acceptableLoss.no_loss') },
    { value: '5', label: t('investmentPreferences.options.acceptableLoss.five_percent') },
    { value: '10', label: t('investmentPreferences.options.acceptableLoss.ten_percent') },
    { value: '15', label: t('investmentPreferences.options.acceptableLoss.fifteen_percent') },
    { value: '20', label: t('investmentPreferences.options.acceptableLoss.twenty_percent') },
    { value: '25', label: t('investmentPreferences.options.acceptableLoss.twenty_five_percent') },
  ];

  const form = useForm<InvestmentPreferencesFormValues>({
    resolver: zodResolver(investmentPreferencesSchema),
    defaultValues: {
      ...initialData,
      asset_allocations: assetAllocations || {},
    },
  });

  const { fields: platformsFields, append: appendPlatform, remove: removePlatform } = useFieldArray({
    control: form.control,
    name: 'platforms_used',
  });

  const { fields: restrictionsFields, append: appendRestriction, remove: removeRestriction } = useFieldArray({
    control: form.control,
    name: 'asset_restrictions',
  });

  const { fields: interestsFields, append: appendInterest, remove: removeInterest } = useFieldArray({
    control: form.control,
    name: 'areas_of_interest',
  });

  // Watch risk profile changes to update allocations
  const riskProfile = useWatch({
    control: form.control,
    name: 'risk_profile',
  });

  // Track if this is the initial load
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (riskProfile && DEFAULT_ASSET_ALLOCATIONS[riskProfile]) {
      // On initial load, only set if no allocations exist
      if (isInitialLoad.current) {
        const currentAllocations = form.getValues('asset_allocations');
        if (!currentAllocations || Object.keys(currentAllocations).length === 0) {
          form.setValue('asset_allocations', DEFAULT_ASSET_ALLOCATIONS[riskProfile], {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
        isInitialLoad.current = false;
      } else {
        // On subsequent changes, always set default allocations
        form.setValue('asset_allocations', DEFAULT_ASSET_ALLOCATIONS[riskProfile], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }else{
      isInitialLoad.current = false;
    }
  }, [riskProfile, form]);

  // Watch allocation changes to calculate total
  const allocations = useWatch({
    control: form.control,
    name: 'asset_allocations',
  });

  useEffect(() => {
    const total = Object.values(allocations || {}).reduce((sum, value) => {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      return sum + numValue;
    }, 0);
    setTotalAllocation(total);
  }, [allocations]);

  const handleSubmit = async (data: InvestmentPreferencesFormValues) => {
    if (!policyId) return;

    try {
      // Update investment preferences (without asset allocations)
      const { asset_allocations, ...preferencesData } = data;
      
      const { error: preferencesError } = await supabase
        .from('investment_preferences')
        .upsert([{ 
          ...preferencesData,
          policy_id: policyId,
        }], {
          onConflict: 'policy_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (preferencesError) throw preferencesError;

      // Update asset allocations
      const allocationEntries = Object.entries(asset_allocations).map(([asset_class, allocation]) => ({
        policy_id: policyId,
        asset_class,
        allocation: typeof allocation === 'string' ? 0 : allocation,
      }));

      const { error: allocationsError } = await supabase
        .from('asset_allocations')
        .upsert(allocationEntries, {
          onConflict: 'policy_id,asset_class',
          ignoreDuplicates: false
        });

      if (allocationsError) throw allocationsError;

      if (clientId) queryClient.invalidateQueries({ queryKey: ['investmentPolicy', clientId] });
      
      toast({
        title: t('investmentPreferences.messages.toast.success.title'),
        description: t('investmentPreferences.messages.toast.success.description'),
      });

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating investment preferences:', error);
      toast({
        title: t('investmentPreferences.messages.toast.error.title'),
        description: t('investmentPreferences.messages.toast.error.description'),
        variant: 'destructive',
      });
    }
  };

  const renderReadOnlyView = () => {
    const values = form.getValues();
    
    const getDisplayValue = (value: string | undefined, options: { value: string; label: string }[]) => {
      if (!value) return t('common.notInformed');
      const option = options.find(opt => opt.value === value);
      return option ? option.label : t('common.notInformed');
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('investmentPreferences.title')}</CardTitle>
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
          {/* Perfil e Alocação de Ativos */}
          <div className="space-y-6 border-b pb-8">
            <div className="bg-primary/5 p-6 rounded-lg border">
              <div className="text-center">
                <p className="text-lg font-semibold text-primary mb-2">{t('investmentPreferences.form.riskProfile')}</p>
                <p className={cn(
                  "text-xl font-bold",
                  values.risk_profile === 'CONS' && "text-blue-600",
                  values.risk_profile === 'MOD' && "text-green-600",
                  values.risk_profile === 'ARROJ' && "text-orange-600",
                  values.risk_profile === 'AGRESSIVO' && "text-red-600"
                )}>
                  {getDisplayValue(values.risk_profile, riskProfiles)}
                </p>
              </div>
            </div>

            {/* Detailed breakdown by category and asset */}
            <div className="space-y-6">
              {Object.entries(ASSET_CATEGORIES).map(([category, { title, assets }]) => {
                const visibleAssets = assets.filter(
                  assetKey => (values.asset_allocations?.[assetKey] ?? 0) > 0
                );
                if (visibleAssets.length === 0) return null;
                return (
                  <Card key={category} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-3">
                      <CardTitle className="text-base font-semibold">
                        {t(`investmentPreferences.categories.${category}`, { defaultValue: title })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-4 gap-4">
                        {visibleAssets.map(assetKey => (
                          <div key={assetKey} className="flex flex-col space-y-0.5">
                            <span className="text-xs text-muted-foreground">
                              {t(`investmentPreferences.assets.${assetKey}`, { defaultValue: ASSET_CLASS_LABELS[assetKey] })}
                            </span>
                            <span className="text-base font-semibold">
                              {(values.asset_allocations?.[assetKey] ?? 0).toFixed(2)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Outras Preferências */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPreferences.form.targetReturnReview')}</p>
              <p className="font-medium">{getDisplayValue(values.target_return_review, reviewPeriods)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPreferences.form.maxBondMaturity')}</p>
              <p className="font-medium">{getDisplayValue(values.max_bond_maturity, bondMaturities)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPreferences.form.fgcEventFeeling')}</p>
              <p className="font-medium">{getDisplayValue(values.fgc_event_feeling, fgcFeelings)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPreferences.form.maxFundLiquidity')}</p>
              <p className="font-medium">{getDisplayValue(values.max_fund_liquidity, fundLiquidity)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPreferences.form.maxAcceptableLoss')}</p>
              <p className="font-medium">{getDisplayValue(values.max_acceptable_loss, acceptableLoss)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPreferences.form.targetReturnIpcaPlus')}</p>
              <p className="font-medium">{getDisplayValue(values.target_return_ipca_plus, targetReturns)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPreferences.form.stockInvestmentMode')}</p>
              <p className="font-medium">{getDisplayValue(values.stock_investment_mode, investmentModes)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('investmentPreferences.form.realEstateFundsMode')}</p>
              <p className="font-medium">{getDisplayValue(values.real_estate_funds_mode, realEstateFundModes)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('investmentPreferences.form.platformsUsed')}</h3>
            {(!values.platforms_used || values.platforms_used.length === 0) ? (
              <p className="text-sm text-muted-foreground">{t('common.notInformed')}</p>
            ) : (
              <div className="space-y-2">
                {values.platforms_used.map((platform, index) => (
                  <p key={index} className="font-medium">{platform.name || t('common.notInformed')}</p>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('investmentPreferences.form.assetRestrictions')}</h3>
            {(!values.asset_restrictions || values.asset_restrictions.length === 0) ? (
              <p className="text-sm text-muted-foreground">{t('common.notInformed')}</p>
            ) : (
              <div className="space-y-2">
                {values.asset_restrictions.map((restriction, index) => (
                  <p key={index} className="font-medium">{restriction.name || t('common.notInformed')}</p>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('investmentPreferences.form.areasOfInterest')}</h3>
            {(!values.areas_of_interest || values.areas_of_interest.length === 0) ? (
              <p className="text-sm text-muted-foreground">{t('common.notInformed')}</p>
            ) : (
              <div className="space-y-2">
                {values.areas_of_interest.map((interest, index) => (
                  <p key={index} className="font-medium">{interest.name || t('common.notInformed')}</p>
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
            <CardTitle>{t('investmentPreferences.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pb-24">
            {/* Perfil e Alocação de Ativos */}
            <div className="space-y-6 border-b pb-8">
              <div className="bg-primary/5 p-6 rounded-lg border">
                <FormField
                  control={form.control}
                  name="risk_profile"
                  render={({ field }) => (
                    <FormItem className="text-center">
                      <FormLabel className="text-lg font-semibold text-primary">
                        {t('investmentPreferences.form.riskProfile')}
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger className="h-12 text-lg">
                            <SelectValue placeholder={t('investmentPreferences.form.selectMode')} />
                          </SelectTrigger>
                          <SelectContent>
                            {riskProfiles.map((profile) => (
                              <SelectItem 
                                key={profile.value} 
                                value={profile.value}
                                className={cn(
                                  profile.value === 'CONS' && "text-blue-600",
                                  profile.value === 'MOD' && "text-green-600",
                                  profile.value === 'ARROJ' && "text-orange-600",
                                  profile.value === 'AGRESSIVO' && "text-red-600"
                                )}
                              >
                                {profile.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Detailed breakdown by category and asset */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{t('investmentPreferences.form.assetAllocations')}</h3>
                  <div className={cn(
                    "text-sm font-medium",
                    totalAllocation !== 100 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {t('investmentPreferences.form.totalAllocation')}: {totalAllocation.toFixed(2)}%
                  </div>
                </div>

                {Object.entries(ASSET_CATEGORIES).map(([category, { title, assets }]) => (
                  <Card key={category} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-3">
                      <CardTitle className="text-base font-semibold">
                        {t(`investmentPreferences.categories.${category}`, { defaultValue: title })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-4 gap-4">
                        {assets.map(assetKey => (
                          <FormField
                            key={assetKey}
                            control={form.control}
                            name={`asset_allocations.${assetKey}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm text-muted-foreground">
                                  {t(`investmentPreferences.assets.${assetKey}`, { defaultValue: ASSET_CLASS_LABELS[assetKey] })}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      max="100"
                                      {...field}
                                      value={field.value === 0 ? '0' : field.value || ''}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const numValue = value === '' ? 0 : parseFloat(value);
                                        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                                          field.onChange(numValue);
                                          form.trigger(`asset_allocations.${assetKey}`);
                                        }
                                      }}
                                      disabled={!isEditMode}
                                      className="pr-16"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                      %
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {totalAllocation !== 100 && (
                  <p className="text-sm text-destructive mt-2">
                    {t('investmentPreferences.form.allocationValidation.totalMustBe100')} ({t('investmentPreferences.form.allocationValidation.currentTotal', { total: totalAllocation.toFixed(2) })})
                  </p>
                )}
              </div>
            </div>

            {/* Outras Preferências */}
            <div className="space-y-8">
              <h3 className="text-lg font-semibold">{t('investmentPreferences.form.otherPreferences')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target_return_review"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('investmentPreferences.form.targetReturnReview')}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('investmentPreferences.form.selectPeriod')} />
                          </SelectTrigger>
                          <SelectContent>
                            {reviewPeriods.map((period) => (
                              <SelectItem key={period.value} value={period.value}>
                                {t(`investmentPreferences.options.reviewPeriods.${period.value}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_bond_maturity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('investmentPreferences.form.maxBondMaturity')}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('investmentPreferences.form.selectMaturity')} />
                          </SelectTrigger>
                          <SelectContent>
                            {bondMaturities.map((maturity) => (
                              <SelectItem key={maturity.value} value={maturity.value}>
                                {maturity.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fgc_event_feeling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('investmentPreferences.form.fgcEventFeeling')}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('investmentPreferences.form.selectFeeling')} />
                          </SelectTrigger>
                          <SelectContent>
                            {fgcFeelings.map((feeling) => (
                              <SelectItem key={feeling.value} value={feeling.value}>
                                {t(`investmentPreferences.options.fgcFeelings.${feeling.value}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_fund_liquidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('investmentPreferences.form.maxFundLiquidity')}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('investmentPreferences.form.selectLiquidity')} />
                          </SelectTrigger>
                          <SelectContent>
                            {fundLiquidity.map((liquidity) => (
                              <SelectItem key={liquidity.value} value={liquidity.value}>
                                {t(`investmentPreferences.options.fundLiquidity.${liquidity.value}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_acceptable_loss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('investmentPreferences.form.maxAcceptableLoss')}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('investmentPreferences.form.selectLoss')} />
                          </SelectTrigger>
                          <SelectContent>
                            {acceptableLoss.map((loss) => (
                              <SelectItem key={loss.value} value={loss.value}>
                                {loss.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_return_ipca_plus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('investmentPreferences.form.targetReturnIpcaPlus')}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('investmentPreferences.form.selectReturn')} />
                          </SelectTrigger>
                          <SelectContent>
                            {targetReturns.map((return_) => (
                              <SelectItem key={return_.value} value={return_.value}>
                                {return_.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock_investment_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('investmentPreferences.form.stockInvestmentMode')}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('investmentPreferences.form.selectMode')} />
                          </SelectTrigger>
                          <SelectContent>
                            {investmentModes.map((mode) => (
                              <SelectItem key={mode.value} value={mode.value}>
                                {t(`investmentPreferences.options.investmentModes.${mode.value}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="real_estate_funds_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('investmentPreferences.form.realEstateFundsMode')}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('investmentPreferences.form.selectMode')} />
                          </SelectTrigger>
                          <SelectContent>
                            {realEstateFundModes.map((mode) => (
                              <SelectItem key={mode.value} value={mode.value}>
                                {t(`investmentPreferences.options.realEstateFundModes.${mode.value}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('investmentPreferences.form.platformsUsed')}</h3>
                {isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendPlatform({ name: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('investmentPreferences.form.addPlatform')}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {platformsFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`platforms_used.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('investmentPreferences.form.platform')} {index + 1}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditMode}
                              onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditMode && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePlatform(index)}
                        className="mt-6"
                        aria-label={t('investmentPreferences.form.remove')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('investmentPreferences.form.assetRestrictions')}</h3>
                {isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendRestriction({ name: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('investmentPreferences.form.addRestriction')}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {restrictionsFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`asset_restrictions.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('investmentPreferences.form.restriction')} {index + 1}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditMode}
                              onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditMode && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRestriction(index)}
                        className="self-center"
                        aria-label={t('investmentPreferences.form.remove')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('investmentPreferences.form.areasOfInterest')}</h3>
                {isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendInterest({ name: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('investmentPreferences.form.addInterest')}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {interestsFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`areas_of_interest.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('investmentPreferences.form.interest')} {index + 1}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditMode}
                              onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditMode && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInterest(index)}
                        className="self-center"
                        aria-label={t('investmentPreferences.form.remove')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center gap-4">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Info className="w-4 h-4 text-blue-500" />
              {t('investmentPreferences.save_changes', 'Salvar alterações em Preferências de Investimento')}
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelEdit}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={totalAllocation !== 100}
              className={cn(
                totalAllocation !== 100 && "opacity-50 cursor-not-allowed"
              )}
            >
              {t('common.save')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );

  return isEditMode ? renderFormView() : renderReadOnlyView();
}; 