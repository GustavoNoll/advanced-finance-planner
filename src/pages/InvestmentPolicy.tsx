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
  budgets: [{}],
  assets: []
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

      const { data, error } = await supabase
        .from('investment_policies')
        .select(`
          *,
          investment_preferences (*),
          professional_information (*),
          family_structures (*, children (*)),
          budgets (*),
          assets (*)
        `)
        .eq('profile_id', clientId)
        .single();

      if (error) {
        console.error('Error fetching investment policy:', error);
        return defaultEmptyPolicy;
      }

      return {
        ...defaultEmptyPolicy,
        ...data,
        investment_preferences: data?.investment_preferences || [{}],
        professional_information: data?.professional_information || [{}],
        family_structures: data?.family_structures || [{}],
        budgets: data?.budgets || [{}],
        assets: data?.assets || []
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
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfessionalInformationForm
              initialData={policy?.professional_information?.[0] || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Família</CardTitle>
          </CardHeader>
          <CardContent>
            <FamilyStructureForm
              initialData={policy?.family_structures?.[0] || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetForm
              initialData={policy?.budgets?.[0] || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Situação patrimonial</CardTitle>
          </CardHeader>
          <CardContent>
            <PatrimonialForm
              initialData={policy?.patrimonial_situation || {}}
              isEditing={!!brokerProfile}
              policyId={policy?.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vida</CardTitle>
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
            <CardTitle>Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <InvestmentPreferencesForm
              initialData={policy?.investment_preferences?.[0] || {}}
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