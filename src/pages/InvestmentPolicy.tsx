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
import { PersonalInformationForm } from '@/components/investment-policy/PersonalInformationForm';
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
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { ClientSummaryCard } from '@/components/investment-policy/ClientSummaryCard';
import { InvestmentPreferencesSummaryCard } from '@/components/investment-policy/InvestmentPreferencesSummaryCard';

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
  const isBrokerProfile = !!brokerProfile;

  useEffect(() => {
    if (openSection) {
      // Wait for the next frame to ensure DOM updates are complete
      requestAnimationFrame(() => {
        const element = sectionRefs.current[openSection];
        if (element) {
          // Get the position relative to the viewport
          const rect = element.getBoundingClientRect();
          // Calculate the scroll position
          const scrollPosition = rect.top + window.scrollY - 100; // 100px offset for header and spacing
          
          // Use scrollIntoView for better browser compatibility
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Additional scroll adjustment if needed
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [openSection]);

  const handleSectionSelect = (sectionId: string) => {
    const isOpening = openSection !== sectionId;
    setOpenSection(isOpening ? sectionId : null);
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
          life_information (*),
          asset_allocations (*)
        `)
        .eq('profile_id', clientId)
        .maybeSingle();

      if (fetchError) {
        return defaultEmptyPolicy;
      }

      // If policy exists, return it
      if (existingPolicy) {
        const assetAllocations = existingPolicy.asset_allocations?.reduce((acc, curr) => ({
          ...acc,
          [curr.asset_class]: curr.allocation
        }), {}) || {};
        return {
          ...defaultEmptyPolicy,
          ...existingPolicy,
          investment_preferences: existingPolicy?.investment_preferences || [{}],
          professional_information: existingPolicy?.professional_information || [{}],
          family_structures: existingPolicy?.family_structures || [{}],
          budgets: existingPolicy?.budgets || [{}],
          patrimonial_situations: existingPolicy?.patrimonial_situations || [{}],
          life_information: existingPolicy?.life_information || [{}],
          asset_allocations: assetAllocations,
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
      id: 'personal-information',
      title: t('investmentPolicy.sections.personalInformation'),
      icon: User,
      color: 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300'
    },
    {
      id: 'professional-information',
      title: t('investmentPolicy.sections.professionalInformation'),
      icon: UserCircle2,
      color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300'
    },
    {
      id: 'family-structure',
      title: t('investmentPolicy.sections.familyStructure'),
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300'
    },
    {
      id: 'budget',
      title: t('investmentPolicy.sections.budget'),
      icon: Wallet,
      color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-300'
    },
    {
      id: 'patrimonial',
      title: t('investmentPolicy.sections.patrimonial'),
      icon: Building2,
      color: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300'
    },
    {
      id: 'life',
      title: t('investmentPolicy.sections.life'),
      icon: HeartPulse,
      color: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-300'
    },
    {
      id: 'investment-preferences',
      title: t('investmentPolicy.sections.investmentPreferences'),
      icon: LineChart,
      color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
    }
  ];

  return (
    <div className="flex h-screen">
      {/* Quick Selection Sidebar */}
      <div className={`group fixed left-0 top-0 h-screen ${isSidebarOpen ? 'w-16' : 'w-0'} transition-all duration-300 bg-background border-r hover:w-64 pt-16`}>
        <div className="p-2">
          <div className="flex items-center justify-between mb-6">
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
                className={`w-full transition-all duration-300 ${section.color} group-hover:justify-start group-hover:gap-2 justify-center`}
                onClick={() => handleSectionSelect(section.id)}
              >
                <section.icon className="h-4 w-4" />
                <span className="hidden group-hover:inline whitespace-nowrap">{section.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${isSidebarOpen ? 'ml-16' : 'ml-0'} transition-all duration-300`}>
        <div className="h-full px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            <ClientSummaryCard 
              clientProfile={clientProfile} 
              investmentPlan={investmentPlan}
              policy={policy}
            />
            <InvestmentPreferencesSummaryCard
              assetAllocations={policy?.asset_allocations || {}}
              preferences={policy?.investment_preferences || {}}
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
                  className="border rounded-lg scroll-mt-24 bg-card"
                >
                  <div ref={(el) => (sectionRefs.current[section.id] = el)}>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline bg-card hover:bg-muted/50">
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
                    <AccordionContent className="px-6 pb-4 bg-card">
                      {section.id === 'personal-information' && (
                        <PersonalInformationForm
                          initialData={clientProfile}
                          isEditing={isBrokerProfile}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'professional-information' && (
                        <ProfessionalInformationForm
                          initialData={policy?.professional_information || {}}
                          isEditing={isBrokerProfile}
                          policyId={policy?.id}
                        />
                      )}
                      {section.id === 'family-structure' && (
                        <FamilyStructureForm
                          initialData={policy?.family_structures || {}}
                          isEditing={isBrokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'budget' && (
                        <BudgetForm
                          initialData={policy?.budgets || {}}
                          isEditing={isBrokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'patrimonial' && (
                        <PatrimonialForm
                          initialData={policy?.patrimonial_situations || {}}
                          isEditing={isBrokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'life' && (
                        <LifeForm
                          initialData={policy?.life_information || {}}
                          isEditing={isBrokerProfile}
                          policyId={policy?.id}
                          clientId={clientId}
                        />
                      )}
                      {section.id === 'investment-preferences' && (
                        <InvestmentPreferencesForm
                          initialData={policy?.investment_preferences || {}}
                          assetAllocations={policy?.asset_allocations || {}}
                          isEditing={isBrokerProfile}
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