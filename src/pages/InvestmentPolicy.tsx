import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvestmentPreferencesForm } from '@/components/investment-policy/InvestmentPreferencesForm';
import { ProfessionalInformationForm } from '@/components/investment-policy/ProfessionalInformationForm';
import { FamilyStructureForm } from '@/components/investment-policy/FamilyStructureForm';
import { BudgetForm } from '@/components/investment-policy/BudgetForm';
import { PatrimonialForm } from '@/components/investment-policy/PatrimonialForm';
import { LifeForm } from '@/components/investment-policy/LifeForm';
import { InvestmentPlan } from '@/types/financial';
import { Profile } from '@/types/financial';

interface InvestmentPolicyProps {
  clientId?: string;
  clientProfile?: Profile;
  brokerProfile?: Profile;
  investmentPlan?: InvestmentPlan;
}

const defaultEmptyPolicy = {
  investment_preferences: [{}],
  professional_information: [{}],
  family_structures: [{}],
  patrimonial_situations: [{}],
  life_information: [{}],
  budgets: [{}],
};

const InvestmentPolicy = ({
  clientId,
  clientProfile,
  brokerProfile,
  investmentPlan,
}: InvestmentPolicyProps) => {
  const { t } = useTranslation();

  const { data: policy, isLoading } = useQuery({
    queryKey: ['investmentPolicy', clientId],
    queryFn: async () => {
      if (!clientId) return defaultEmptyPolicy;

      // First try to fetch existing policy
      const { data: existingPolicy, error: fetchError } = await supabase
        .from('investment_policies')
        .select(`
          *,
          investment_preferences (*),
          professional_information (*),
          family_structures (*, children (*)),
          budgets (*),
          patrimonial_situations (*),
          life_information (*)
        `)
        .eq('profile_id', clientId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching investment policy:', fetchError);
        return defaultEmptyPolicy;
      }

      // If policy exists, return it
      if (existingPolicy) {
        console.log('existingPolicy', existingPolicy);
        return {
          ...defaultEmptyPolicy,
          ...existingPolicy,
          investment_preferences: existingPolicy?.investment_preferences || [{}],
          professional_information: existingPolicy?.professional_information || [{}],
          family_structures: existingPolicy?.family_structures || [{}],
          budgets: existingPolicy?.budgets || [{}],
          patrimonial_situations: existingPolicy?.patrimonial_situations || [{}],
          life_information: existingPolicy?.life_information || [{}],
        };
      }

      // If no policy exists, create a new one
      const { data: newPolicy, error: createError } = await supabase
        .from('investment_policies')
        .insert([{ profile_id: clientId }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating investment policy:', createError);
        return defaultEmptyPolicy;
      }

      return {
        ...defaultEmptyPolicy,
        ...newPolicy,
      };
    },
    enabled: !!clientId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <Card>  
          <CardHeader>
            <CardTitle>{t('professionalInformation.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfessionalInformationForm
              initialData={policy?.professional_information || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
              clientId={clientId}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('familyStructure.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <FamilyStructureForm
              initialData={policy?.family_structures || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('budget.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetForm
              initialData={policy?.budgets || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('patrimonial.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <PatrimonialForm
              initialData={policy?.patrimonial_situations || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('life.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <LifeForm
              initialData={policy?.life_information || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('investmentPreferences.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <InvestmentPreferencesForm
              initialData={policy?.investment_preferences || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentPolicy; 