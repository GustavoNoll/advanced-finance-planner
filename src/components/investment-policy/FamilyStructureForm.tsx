import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Calendar as CalendarIcon, Pencil } from 'lucide-react';
import { format, parse } from "date-fns";
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '@/utils/string';

const familyStructureSchema = z.object({
  marital_status: z.string().optional(),
  spouse_name: z.string().optional(),
  spouse_birth_date: z.date().optional(),
  has_children: z.boolean().optional(),
  children: z.array(z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    birth_date: z.date({ required_error: 'Data de nascimento é obrigatória' }),
  })).optional(),
});

type FamilyStructureFormValues = z.infer<typeof familyStructureSchema>;

interface FamilyStructureFormProps {
  initialData?: FamilyStructureFormValues;
  isEditing?: boolean;
  policyId?: string;
  clientId?: string;
}

const maritalStatuses = [
  { value: 'single'},
  { value: 'total_separation'},
  { value: 'partial_community'},
  { value: 'total_community'},
];

const calculateAge = (birthDate: Date | undefined | null): { years: number; months: number } | null => {
  if (!birthDate || !(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }
  
  return { years, months };
};

const DateInput = ({ 
  value, 
  onChange, 
  disabled,
  placeholder = 'dd/mm/aaaa'
}: { 
  value?: Date; 
  onChange: (date: Date) => void; 
  disabled?: boolean;
  placeholder?: string;
}) => {
  const [inputValue, setInputValue] = useState(value ? format(value, 'dd/MM/yyyy') : '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Remove non-numeric characters
    newValue = newValue.replace(/\D/g, '');
    
    // Format as dd/mm/yyyy
    if (newValue.length > 2) {
      newValue = newValue.slice(0, 2) + '/' + newValue.slice(2);
    }
    if (newValue.length > 5) {
      newValue = newValue.slice(0, 5) + '/' + newValue.slice(5);
    }
    if (newValue.length > 10) {
      newValue = newValue.slice(0, 10);
    }
    
    setInputValue(newValue);

    // Try to parse the date when the input is complete
    if (newValue.length === 10) {
      try {
        const parsedDate = parse(newValue, 'dd/MM/yyyy', new Date());
        if (!isNaN(parsedDate.getTime())) {
          onChange(parsedDate);
        }
      } catch (error) {
        // Invalid date format
      }
    }
  };

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-[200px]"
    />
  );
};

function parseDate(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  // tenta converter string para Date (aceita yyyy-MM-dd ou dd/MM/yyyy)
  let parsed = parse(value, 'yyyy-MM-dd', new Date());
  if (isNaN(parsed.getTime())) {
    parsed = parse(value, 'dd/MM/yyyy', new Date());
  }
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export const FamilyStructureForm = ({
  initialData,
  isEditing = false,
  policyId,
  clientId,
}: FamilyStructureFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);

  const formatAge = (age: { years: number; months: number } | null): string => {
    if (age === null) return 'N/A';
    
    if (age.years === 0) {
      return t('familyStructure.children.age.months', { age: age.months });
    }
    
    if (age.years === 1) {
      return t('familyStructure.children.age.year');
    }
    
    return t('familyStructure.children.age.years', { age: age.years });
  };

  const [children, setChildren] = useState<{ name?: string; birth_date?: Date }[]>(
    initialData?.children?.map(child => ({
      ...child,
      birth_date: parseDate(child.birth_date)
    })) || []
  );

  const form = useForm<FamilyStructureFormValues>({
    resolver: zodResolver(familyStructureSchema),
    defaultValues: {
      ...initialData,
      spouse_birth_date: parseDate(initialData?.spouse_birth_date),
      children: initialData?.children?.map(child => ({
        ...child,
        birth_date: parseDate(child.birth_date)
      })) || [],
    },
  });

  const handleSubmit = async (data: FamilyStructureFormValues) => {
    if (!policyId) return;

    try {
      const invalidChildren = children.filter(child => !child.name || !child.birth_date);
      if (invalidChildren.length > 0) {
        toast({
          title: t('common.error'),
          description: t('familyStructure.messages.validation.children'),
          variant: 'destructive',
        });
        return;
      }

      // First, update the family structure
      const { children: _children, ...familyStructureData } = data;
      const { data: familyStructure, error: structureError } = await supabase
        .from('family_structures')
        .upsert([{ 
          ...familyStructureData, 
          policy_id: policyId,
          has_children: children.length > 0,
          spouse_birth_date: data.spouse_birth_date ? format(data.spouse_birth_date, 'yyyy-MM-dd') : null
        }], {
          onConflict: 'policy_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (structureError) throw structureError;

      // Then, update children
      if (familyStructure) {
        // Delete existing children
        const { error: deleteError } = await supabase
          .from('children')
          .delete()
          .eq('family_structure_id', familyStructure.id);

        if (deleteError) throw deleteError;

        // Insert new children if there are any
        if (children.length > 0) {
          const childrenToInsert = children.map(child => ({
            name: child.name,
            birth_date: child.birth_date ? format(child.birth_date, 'yyyy-MM-dd') : null,
            family_structure_id: familyStructure.id
          }));

          const { error: insertError } = await supabase
            .from('children')
            .insert(childrenToInsert);

          if (insertError) throw insertError;
        }
      }

      if (clientId) queryClient.invalidateQueries({ queryKey: ['investmentPolicy', clientId] });

      toast({
        title: t('common.success'),
        description: t('familyStructure.messages.success'),
      });
    } catch (error) {
      console.error('Erro ao atualizar estrutura familiar:', error);
      toast({
        title: t('common.error'),
        description: t('familyStructure.messages.error'),
        variant: 'destructive',
      });
    }
  };

  const addChild = () => {
    if (!isEditing) return;
    
    const newChild = { name: '', birth_date: undefined };
    setChildren([...children, newChild]);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: 'name' | 'birth_date', value: string | Date) => {
    if (!isEditing) return;
    
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildren(newChildren);
  };

  const renderReadOnlyView = () => {
    const maritalStatus = form.getValues('marital_status');
    const spouseName = form.getValues('spouse_name');
    const spouseBirthDate = form.getValues('spouse_birth_date');

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('familyStructure.title')}</CardTitle>
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
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('familyStructure.maritalStatus.label')}</p>
              <p className="font-medium">
                {maritalStatus ? t(`familyStructure.maritalStatus.options.${maritalStatus}`) : t('common.notInformed')}
              </p>
            </div>

            {maritalStatus && maritalStatus !== 'single' && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">{t('familyStructure.spouse.name.label')}</p>
                  <p className="font-medium">{spouseName || t('common.notInformed')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('familyStructure.spouse.birthDate.label')}</p>
                  <p className="font-medium">
                    {spouseBirthDate ? format(spouseBirthDate, 'dd/MM/yyyy') : t('common.notInformed')}
                    {spouseBirthDate && (
                      <span className="text-sm text-muted-foreground ml-2">
                        ({formatAge(calculateAge(spouseBirthDate))})
                      </span>
                    )}
                  </p>
                </div>
              </>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('familyStructure.children.title')}</h3>
              {children.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('familyStructure.children.empty')}</p>
              ) : (
                <div className="space-y-4">
                  {children.map((child, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr] gap-4 items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('familyStructure.children.name.label')}</p>
                        <p className="font-medium">{child.name || t('common.notInformed')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('familyStructure.children.birthDate.label')}</p>
                        <p className="font-medium">
                          {child.birth_date ? format(child.birth_date, 'dd/MM/yyyy') : t('common.notInformed')}
                          {child.birth_date && (
                            <span className="text-sm text-muted-foreground ml-2">
                              ({formatAge(calculateAge(child.birth_date))})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
            <CardTitle>{t('familyStructure.title')}</CardTitle>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMode(false)}
            >
              {t('common.cancel')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="marital_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('familyStructure.maritalStatus.label')}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('familyStructure.maritalStatus.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {maritalStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {t(`familyStructure.maritalStatus.options.${status.value}`)}
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
              name="spouse_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('familyStructure.spouse.name.label')}</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spouse_birth_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('familyStructure.spouse.birthDate.label')}</FormLabel>
                  <FormControl>
                    <DateInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!isEditing}
                      placeholder={t('familyStructure.spouse.birthDate.placeholder')}
                    />
                  </FormControl>
                  {field.value && (
                    <p className="text-sm text-muted-foreground">
                      {formatAge(calculateAge(field.value))}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('familyStructure.children.title')}</h3>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addChild}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('familyStructure.children.add')}
                  </Button>
                )}
              </div>

              {children.map((child, index) => (
                <div key={index} className="flex items-center gap-4 w-full">
                  <div className="w-[200px] flex flex-col justify-center">
                    <FormLabel className="text-base mb-1">{t('familyStructure.children.name.label')}</FormLabel>
                    <Input
                      value={child.name}
                      onChange={(e) => updateChild(index, 'name', capitalizeFirstLetter(e.target.value))}
                      disabled={!isEditing}
                      className="h-10 text-base px-3 py-2"
                    />
                    <span className="text-xs text-muted-foreground block opacity-0">a</span>
                  </div>
                  <div className="w-[200px]">
                    <FormLabel className="text-base mb-1">{t('familyStructure.children.birthDate.label')}</FormLabel>
                    <DateInput
                      value={child.birth_date}
                      onChange={(date) => updateChild(index, 'birth_date', date)}
                      disabled={!isEditing}
                      placeholder={t('familyStructure.children.birthDate.placeholder')}
                    />
                    <span className={child.birth_date ? 'text-xs text-muted-foreground block' : 'text-xs text-muted-foreground block opacity-0'}>
                      {formatAge(calculateAge(child.birth_date))}
                    </span>
                  </div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChild(index)}
                      className="self-center"
                      aria-label={t('familyStructure.children.remove')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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

  return isEditMode ? renderFormView() : renderReadOnlyView();
}; 