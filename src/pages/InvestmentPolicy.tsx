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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ChevronDown, 
  UserCircle2, 
  Users, 
  Wallet, 
  Building2, 
  HeartPulse, 
  LineChart,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { ClientSummaryCard } from '@/components/investment-policy/ClientSummaryCard';

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
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 24; // 24px de offset
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    const isOpening = openSection !== sectionId;
    setOpenSection(isOpening ? sectionId : null);
    if (isOpening) scrollToSection(sectionId);
  };

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

  const sections = [
    {
      id: 'professional-information',
      title: t('investmentPolicy.sections.professionalInformation'),
      icon: UserCircle2,
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      id: 'family-structure',
      title: t('investmentPolicy.sections.familyStructure'),
      icon: Users,
      color: 'bg-purple-500/10 text-purple-500'
    },
    {
      id: 'budget',
      title: t('investmentPolicy.sections.budget'),
      icon: Wallet,
      color: 'bg-green-500/10 text-green-500'
    },
    {
      id: 'patrimonial',
      title: t('investmentPolicy.sections.patrimonial'),
      icon: Building2,
      color: 'bg-orange-500/10 text-orange-500'
    },
    {
      id: 'life',
      title: t('investmentPolicy.sections.life'),
      icon: HeartPulse,
      color: 'bg-red-500/10 text-red-500'
    },
    {
      id: 'investment-preferences',
      title: t('investmentPolicy.sections.investmentPreferences'),
      icon: LineChart,
      color: 'bg-indigo-500/10 text-indigo-500'
    }
  ];

  return (
    <div className="flex h-screen">
      {/* Quick Selection Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-background border-r`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">{t('investmentPolicy.quickAccess')}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={openSection === section.id ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-2 ${section.color}`}
                onClick={() => handleSectionSelect(section.id)}
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            <ClientSummaryCard 
              clientProfile={clientProfile} 
              investmentPlan={investmentPlan}
              policy={policy}
            />

            <Accordion 
              type="single"
              collapsible
              className="w-full space-y-4"
              value={openSection || ''}
              onValueChange={(sectionId) => setOpenSection(sectionId || null)}
            >
              {sections.map((section) => (
                <AccordionItem 
                  key={section.id} 
                  value={section.id} 
                  className="border rounded-lg"
                >
                  <div ref={(el) => (sectionRefs.current[section.id] = el)}>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${section.color}`}>
                            <section.icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      {section.id === 'professional-information' && (
                        <ProfessionalInformationForm
                          initialData={policy?.professional_information || {}}
                          isEditing={!!brokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'family-structure' && (
                        <FamilyStructureForm
                          initialData={policy?.family_structures || {}}
                          isEditing={!!brokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'budget' && (
                        <BudgetForm
                          initialData={policy?.budgets || {}}
                          isEditing={!!brokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'patrimonial' && (
                        <PatrimonialForm
                          initialData={policy?.patrimonial_situations || {}}
                          isEditing={!!brokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'life' && (
                        <LifeForm
                          initialData={policy?.life_information || {}}
                          isEditing={!!brokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'investment-preferences' && (
                        <InvestmentPreferencesForm
                          initialData={policy?.investment_preferences || {}}
                          isEditing={!!brokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPolicy; 