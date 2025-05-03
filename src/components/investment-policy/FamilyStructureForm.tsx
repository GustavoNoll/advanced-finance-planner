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
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Checkbox } from '@radix-ui/react-checkbox';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const familyStructureSchema = z.object({
  marital_status: z.string().optional(),
  spouse_name: z.string().optional(),
  spouse_birth_date: z.date().optional(),
  has_children: z.boolean().optional(),
  children: z.array(z.object({
    name: z.string(),
    birth_date: z.date(),
  })).optional(),
});

type FamilyStructureFormValues = z.infer<typeof familyStructureSchema>;

interface FamilyStructureFormProps {
  initialData?: FamilyStructureFormValues;
  isEditing?: boolean;
  policyId?: string;
}

const maritalStatuses = [
  { value: 'solteiro', label: 'Solteiro' },
  { value: 'separacao_total', label: 'Separação Total' },
  { value: 'comunhao_parcial', label: 'Comunhão Parcial' },
  { value: 'comunhao_total', label: 'Comunhão Total' },
];

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const DateInput = ({ value, onChange, disabled }: { value?: Date, onChange: (date: Date) => void, disabled?: boolean }) => {
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
      placeholder="dd/mm/aaaa"
      disabled={disabled}
      className="w-[200px]"
    />
  );
};

export const FamilyStructureForm = ({
  initialData,
  isEditing = false,
  policyId,
}: FamilyStructureFormProps) => {
  const [children, setChildren] = useState<{ name?: string; birth_date?: Date }[]>(
    initialData?.children || []
  );

  const form = useForm<FamilyStructureFormValues>({
    resolver: zodResolver(familyStructureSchema),
    defaultValues: initialData || {
      marital_status: '',
      spouse_name: '',
      spouse_birth_date: undefined,
      has_children: false,
      children: [],
    },
  });

  const handleSubmit = async (data: FamilyStructureFormValues) => {
    if (!policyId) return;

    try {
      // First, update the family structure
      const { error: structureError } = await supabase
        .from('family_structures')
        .upsert([{ ...data, policy_id: policyId }]);

      if (structureError) throw structureError;

      // Then, update children
      if (data.has_children) {
        // Delete existing children
        const { error: deleteError } = await supabase
          .from('children')
          .delete()
          .eq('family_structure_id', policyId);

        if (deleteError) throw deleteError;

        // Insert new children
        if (children.length > 0) {
          const { error: insertError } = await supabase
            .from('children')
            .insert(children.map(child => ({
              ...child,
              family_structure_id: policyId,
            })));

          if (insertError) throw insertError;
        }
      }

      toast({
        title: 'Sucesso',
        description: 'Estrutura familiar atualizada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao atualizar estrutura familiar:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar estrutura familiar',
        variant: 'destructive',
      });
    }
  };

  const addChild = () => {
    setChildren([...children, { name: '', birth_date: undefined }]);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: 'name' | 'birth_date', value: string | Date) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildren(newChildren);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Estrutura Familiar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="marital_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Civil</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado civil" />
                      </SelectTrigger>
                      <SelectContent>
                        {maritalStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
                  <FormLabel>Nome do Cônjuge</FormLabel>
                  <FormControl>
                    <Input
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
              name="spouse_birth_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Nascimento do Cônjuge</FormLabel>
                  <FormControl>
                    <DateInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  {field.value && (
                    <p className="text-sm text-muted-foreground">
                      Idade: {calculateAge(field.value)} anos
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seção de filhos sempre visível */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filhos</h3>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addChild}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Filho
                  </Button>
                )}
              </div>

              {children.map((child, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                  <div className="flex flex-col">
                    <FormLabel>Nome</FormLabel>
                    <Input
                      value={child.name}
                      onChange={(e) => updateChild(index, 'name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex flex-col">
                    <FormLabel>Data de Nascimento</FormLabel>
                    <DateInput
                      value={child.birth_date}
                      onChange={(date) => updateChild(index, 'birth_date', date)}
                      disabled={!isEditing}
                    />
                    {child.birth_date && (
                      <span className="text-sm text-muted-foreground mt-1">
                        Idade: {calculateAge(child.birth_date)} anos
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChild(index)}
                      className="self-center"
                      aria-label="Remover filho"
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
            <Button type="submit">Salvar Alterações</Button>
          </div>
        )}
      </form>
    </Form>
  );
}; 