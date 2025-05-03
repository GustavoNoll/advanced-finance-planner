import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const investmentPolicySchema = z.object({
  life_stage: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  has_insurance: z.boolean().optional(),
  has_health_plan: z.boolean().optional(),
  platforms_used: z.array(z.string()).optional(),
  asset_restrictions: z.array(z.string()).optional(),
  areas_of_interest: z.array(z.string()).optional(),
});

type InvestmentPolicyFormValues = z.infer<typeof investmentPolicySchema>;

interface InvestmentPolicyFormProps {
  initialData?: InvestmentPolicyFormValues;
  isEditing?: boolean;
  onSubmit?: (data: InvestmentPolicyFormValues) => void;
  profileId?: string;
}

const lifeStages = [
  { value: 'student', label: 'Student' },
  { value: 'early_career', label: 'Early Career' },
  { value: 'mid_career', label: 'Mid Career' },
  { value: 'late_career', label: 'Late Career' },
  { value: 'retired', label: 'Retired' },
];

const hobbies = [
  { value: 'sports', label: 'Sports' },
  { value: 'travel', label: 'Travel' },
  { value: 'reading', label: 'Reading' },
  { value: 'music', label: 'Music' },
  { value: 'art', label: 'Art' },
  { value: 'gaming', label: 'Gaming' },
];

const objectives = [
  { value: 'retirement', label: 'Retirement' },
  { value: 'education', label: 'Education' },
  { value: 'home_purchase', label: 'Home Purchase' },
  { value: 'wealth_preservation', label: 'Wealth Preservation' },
  { value: 'wealth_growth', label: 'Wealth Growth' },
];

const platforms = [
  { value: 'xp', label: 'XP Investimentos' },
  { value: 'btg', label: 'BTG Pactual' },
  { value: 'itau', label: 'Itaú' },
  { value: 'bradesco', label: 'Bradesco' },
  { value: 'santander', label: 'Santander' },
];

const restrictions = [
  { value: 'no_crypto', label: 'No Cryptocurrencies' },
  { value: 'no_derivatives', label: 'No Derivatives' },
  { value: 'no_foreign', label: 'No Foreign Investments' },
  { value: 'no_private_equity', label: 'No Private Equity' },
];

const interests = [
  { value: 'tech', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'energy', label: 'Energy' },
];

export const InvestmentPolicyForm = ({
  initialData,
  isEditing = false,
  onSubmit,
  profileId,
}: InvestmentPolicyFormProps) => {
  const form = useForm<InvestmentPolicyFormValues>({
    resolver: zodResolver(investmentPolicySchema),
    defaultValues: initialData || {
      life_stage: '',
      hobbies: [],
      objectives: [],
      has_insurance: false,
      has_health_plan: false,
      platforms_used: [],
      asset_restrictions: [],
      areas_of_interest: [],
    },
  });

  const handleSubmit = async (data: InvestmentPolicyFormValues) => {
    if (onSubmit) {
      onSubmit(data);
    } else if (profileId) {
      const { error } = await supabase
        .from('investment_policies')
        .insert([{ ...data, profile_id: profileId }]);

      if (error) {
        console.error('Error creating investment policy:', error);
        return;
      }

      toast({
        title: 'Success',
        description: 'Investment policy created successfully',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="life_stage"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Life Stage</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      disabled={!isEditing}
                    >
                      {lifeStages.map((stage) => (
                        <FormItem key={stage.value} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={stage.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{stage.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hobbies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hobbies</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {hobbies.map((hobby) => (
                      <FormItem key={hobby.value} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(hobby.value)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, hobby.value]);
                              } else {
                                field.onChange(currentValue.filter((v) => v !== hobby.value));
                              }
                            }}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{hobby.label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Objectives</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {objectives.map((objective) => (
                      <FormItem key={objective.value} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(objective.value)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, objective.value]);
                              } else {
                                field.onChange(currentValue.filter((v) => v !== objective.value));
                              }
                            }}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{objective.label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="has_insurance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Has Insurance</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_health_plan"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Has Health Plan</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="platforms_used"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platforms Used</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {platforms.map((platform) => (
                      <FormItem key={platform.value} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(platform.value)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, platform.value]);
                              } else {
                                field.onChange(currentValue.filter((v) => v !== platform.value));
                              }
                            }}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{platform.label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="asset_restrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Restrictions</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {restrictions.map((restriction) => (
                      <FormItem key={restriction.value} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(restriction.value)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, restriction.value]);
                              } else {
                                field.onChange(currentValue.filter((v) => v !== restriction.value));
                              }
                            }}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{restriction.label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="areas_of_interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Areas of Interest</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map((interest) => (
                      <FormItem key={interest.value} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(interest.value)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, interest.value]);
                              } else {
                                field.onChange(currentValue.filter((v) => v !== interest.value));
                              }
                            }}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{interest.label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        )}
      </form>
    </Form>
  );
}; 