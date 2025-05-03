import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2 } from 'lucide-react';

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
});

type InvestmentPreferencesFormValues = z.infer<typeof investmentPreferencesSchema>;

interface InvestmentPreferencesFormProps {
  initialData?: InvestmentPreferencesFormValues;
  isEditing?: boolean;
  policyId?: string;
}

const investmentModes = [
  { value: 'direct_stocks', label: 'Ações Diretas' },
  { value: 'etfs', label: 'ETFs' },
  { value: 'stock_funds', label: 'Fundos de Ações' },
];

const targetReturns = [
  { value: 'ipca_plus_1', label: 'IPCA + 1%' },
  { value: 'ipca_plus_2', label: 'IPCA + 2%' },
  { value: 'ipca_plus_3', label: 'IPCA + 3%' },
  { value: 'ipca_plus_4', label: 'IPCA + 4%' },
  { value: 'ipca_plus_5', label: 'IPCA + 5%' },
  { value: 'ipca_plus_6', label: 'IPCA + 6%' },
  { value: 'ipca_plus_7', label: 'IPCA + 7%' },
  { value: 'ipca_plus_8', label: 'IPCA + 8%' },
  { value: 'ipca_plus_9', label: 'IPCA + 9%' },
  { value: 'ipca_plus_10', label: 'IPCA + 10%' },
  { value: 'ipca_plus_11', label: 'IPCA + 11%' },
];

const reviewPeriods = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'semiannual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' },
];

const bondMaturities = [
  { value: 'short_term', label: 'Curto Prazo (< 2 anos)' },
  { value: 'medium_term', label: 'Médio Prazo (2-5 anos)' },
  { value: 'long_term', label: 'Longo Prazo (> 5 anos)' },
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

const acceptableLoss = [
  { value: '0', label: 'Sem perdas' },
  { value: '5', label: '5%' },
  { value: '10', label: '10%' },
  { value: '15', label: '15%' },
  { value: '20', label: '20%' },
  { value: '25', label: '25%' },
];

const realEstateFundModes = [
  { value: 'direct_portfolio', label: 'Carteira de Fundos' },
  { value: 'fofs_consolidation', label: 'Consolidação em FoFs' },
];

export const InvestmentPreferencesForm = ({
  initialData,
  isEditing = false,
  policyId,
}: InvestmentPreferencesFormProps) => {
  const form = useForm<InvestmentPreferencesFormValues>({
    resolver: zodResolver(investmentPreferencesSchema),
    defaultValues: initialData || {
      target_return_review: '',
      max_bond_maturity: '',
      fgc_event_feeling: '',
      max_fund_liquidity: '',
      max_acceptable_loss: '',
      target_return_ipca_plus: '',
      stock_investment_mode: '',
      real_estate_funds_mode: '',
      platforms_used: [{ name: '' }],
      asset_restrictions: [{ name: '' }],
      areas_of_interest: [{ name: '' }],
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

  const handleSubmit = async (data: InvestmentPreferencesFormValues) => {
    if (!policyId) return;

    const { error } = await supabase
      .from('investment_preferences')
      .upsert([{ ...data, policy_id: policyId }]);

    if (error) {
      console.error('Error updating investment preferences:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar preferências de investimento',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Sucesso',
      description: 'Preferências de investimento atualizadas com sucesso',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Investimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target_return_review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revisão de Meta</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                        <SelectContent>
                          {reviewPeriods.map((period) => (
                            <SelectItem key={period.value} value={period.value}>
                              {period.label}
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
                    <FormLabel>Prazos máximos dos títulos da carteira</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o prazo" />
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
                    <FormLabel>Como você se sentiria em um evento de FGC?</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua sensação" />
                        </SelectTrigger>
                        <SelectContent>
                          {fgcFeelings.map((feeling) => (
                            <SelectItem key={feeling.value} value={feeling.value}>
                              {feeling.label}
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
                    <FormLabel>Prazo máximo de liquidez dos fundos (D+X)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o prazo" />
                        </SelectTrigger>
                        <SelectContent>
                          {fundLiquidity.map((liquidity) => (
                            <SelectItem key={liquidity.value} value={liquidity.value}>
                              {liquidity.label}
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
                    <FormLabel>Máxima perda aceitável</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a perda" />
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
                    <FormLabel>Meta de Retorno (IPCA+X)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o retorno" />
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
                    <FormLabel>Modalidade de investimento em ações</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {investmentModes.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value}>
                              {mode.label}
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
                    <FormLabel>Fundos imobiliários diretos ou FoFs</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {realEstateFundModes.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value}>
                              {mode.label}
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Plataformas utilizadas</h3>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendPlatform({ name: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Plataforma
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {platformsFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`platforms_used.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Plataforma {index + 1}</FormLabel>
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
                        onClick={() => removePlatform(index)}
                        className="self-center"
                        aria-label="Remover plataforma"
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
                <h3 className="text-lg font-semibold">Restrição de ativos</h3>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendRestriction({ name: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Restrição
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
                          <FormLabel>Restrição {index + 1}</FormLabel>
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
                        onClick={() => removeRestriction(index)}
                        className="self-center"
                        aria-label="Remover restrição"
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
                <h3 className="text-lg font-semibold">Exposição em área de interesse</h3>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendInterest({ name: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Interesse
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
                          <FormLabel>Interesse {index + 1}</FormLabel>
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
                        onClick={() => removeInterest(index)}
                        className="self-center"
                        aria-label="Remover interesse"
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

        {isEditing && (
          <div className="flex justify-end">
            <Button type="submit">Salvar Alterações</Button>
          </div>
        )}
      </form>
    </Form>
  );
}; 