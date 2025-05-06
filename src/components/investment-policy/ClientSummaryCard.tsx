import { Card } from '@/components/ui/card';
import { Profile, InvestmentPlan, Policy } from '@/types/financial';
import { UserCircle2, Briefcase, PiggyBank, CreditCard, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { calculateAge } from '@/lib/utils';
import { RISK_PROFILES } from '@/constants/riskProfiles';

interface ClientSummaryCardProps {
  clientProfile: Profile;
  investmentPlan: InvestmentPlan;
  policy?: Policy;
}

export function ClientSummaryCard({ clientProfile, policy }: ClientSummaryCardProps) {
  const { t } = useTranslation();

  // Patrimonial
  const patrimonial = policy?.patrimonial_situations || {};
  const investments = patrimonial?.investments?.properties?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0;
  const liquidInvestments = patrimonial?.investments?.liquid_investments?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0;
  const participations = patrimonial?.investments?.participations?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0;
  const properties = patrimonial?.personal_assets?.properties?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0;
  const vehicles = patrimonial?.personal_assets?.vehicles?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0;
  const valuableGoods = patrimonial?.personal_assets?.valuable_goods?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0;
  const totalPatrimony = investments + liquidInvestments + participations + properties + vehicles + valuableGoods;

  // Budget
  const budget = policy?.budgets || {};
  const income = (budget?.incomes || []).reduce((acc: number, i: { amount: number }) => acc + (i.amount || 0), 0) || 0;
  const expenses = (budget?.expenses || []).reduce((acc: number, i: { amount: number }) => acc + (i.amount || 0), 0) || 0;
  const savings = budget?.savings || 0;

  // Life stage
  const lifeStage = policy?.life_information?.life_stage || '';

  // Family
  const family = policy?.family_structures || {};
  const maritalStatus = family?.marital_status;
  const children = family?.children || [];

  // Objectives
  const objectives = policy?.life_information?.objectives || [];

  // Hobbies
  const hobbies = policy?.life_information?.hobbies || [];
  // Insurances
  const insurances = policy?.life_information?.insurances || [];

  // Risk Profile
  const riskProfileValue = policy?.investment_preferences?.risk_profile;
  const riskProfileLabel =
    RISK_PROFILES.BRL.find((p) => p.value === riskProfileValue)?.label || t('clientSummary.noData');

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 overflow-hidden">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Left: Profile & Personal */}
        <div className="md:w-1/3 p-8 bg-gradient-to-br from-white to-blue-50/30 flex flex-col gap-8">
          <div className="flex flex-col gap-1 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                <UserCircle2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-2xl tracking-tight">{clientProfile.name}</span>
                <span className="text-sm text-blue-600">{policy?.professional_information?.occupation || '-'}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-4 border-b-2 border-blue-200 pb-2 text-slate-800">{t('clientSummary.personalInfo')}</div>
            <div className="space-y-3 text-slate-600">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                <span className="font-semibold text-slate-500 min-w-[100px]">{t('clientSummary.age')}:</span>
                <span className="text-slate-700">{calculateAge(clientProfile.birth_date)} {t('clientSummary.years')}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                <span className="font-semibold text-slate-500 min-w-[100px]">{t('clientSummary.maritalStatus')}:</span>
                <span className="text-slate-700">{maritalStatus ? t(`familyStructure.maritalStatus.options.${maritalStatus}`) : '-'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                <span className="font-semibold text-slate-500 min-w-[100px]">{t('clientSummary.children')}:</span>
                <span className="text-slate-700">{children.length > 0 ? children.length : t('clientSummary.noChildren')}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-4 border-b-2 border-blue-200 pb-2 text-slate-800">{t('investmentPolicy.lifeStage.label')}</div>
            <ul className="space-y-3">
              <li className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${lifeStage === 'accumulation' ? 'bg-blue-50' : 'hover:bg-blue-50/50'}`}>
                <span className={`h-3 w-3 rounded-full ${lifeStage === 'accumulation' ? 'bg-blue-500' : 'bg-blue-200'}`}></span>
                <span className={lifeStage === 'accumulation' ? 'font-semibold text-slate-800' : 'text-slate-500'}>{t('investmentPolicy.lifeStage.options.accumulation')}</span>
              </li>
              <li className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${lifeStage === 'consolidation' ? 'bg-blue-50' : 'hover:bg-blue-50/50'}`}>
                <span className={`h-3 w-3 rounded-full ${lifeStage === 'consolidation' ? 'bg-blue-500' : 'bg-blue-200'}`}></span>
                <span className={lifeStage === 'consolidation' ? 'font-semibold text-slate-800' : 'text-slate-500'}>{t('investmentPolicy.lifeStage.options.consolidation')}</span>
              </li>
              <li className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${lifeStage === 'enjoyment' ? 'bg-blue-50' : 'hover:bg-blue-50/50'}`}>
                <span className={`h-3 w-3 rounded-full ${lifeStage === 'enjoyment' ? 'bg-blue-500' : 'bg-blue-200'}`}></span>
                <span className={lifeStage === 'enjoyment' ? 'font-semibold text-slate-800' : 'text-slate-500'}>{t('investmentPolicy.lifeStage.options.enjoyment')}</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Middle: Patrimonial & Budget */}
        <div className="md:w-1/3 p-8 bg-white flex flex-col gap-8 border-l-4 border-indigo-100">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="font-bold text-lg tracking-tight text-slate-800">{t('patrimonial.title')}</div>
            </div>
            <div className="text-3xl font-bold mb-6 text-indigo-700">{formatCurrency(totalPatrimony)}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 transition-colors">
                <span className="text-slate-500">{t('clientSummary.investments')}</span>
                <span className="font-semibold text-indigo-700">{formatCurrency(investments + liquidInvestments + participations)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 transition-colors">
                <span className="text-slate-500">{t('clientSummary.properties')}</span>
                <span className="font-semibold text-indigo-700">{formatCurrency(properties)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 transition-colors">
                <span className="text-slate-500">{t('clientSummary.vehicles')}</span>
                <span className="font-semibold text-indigo-700">{formatCurrency(vehicles)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 transition-colors">
                <span className="text-slate-500">{t('clientSummary.valuableGoods')}</span>
                <span className="font-semibold text-indigo-700">{formatCurrency(valuableGoods)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 transition-colors">
                <span className="text-slate-500">{t('clientSummary.other')}</span>
                <span className="font-semibold text-indigo-700">{formatCurrency(0)}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100">
                <PiggyBank className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="font-bold text-lg tracking-tight text-slate-800">{t('budget.title')}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-emerald-50/50 transition-colors">
                <span className="text-slate-500">{t('clientSummary.income')}</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(income)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-rose-50/50 transition-colors">
                <span className="text-slate-500">{t('clientSummary.expense')}</span>
                <span className="font-semibold text-rose-500">{formatCurrency(expenses)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-teal-50/50 transition-colors">
                <span className="text-slate-500">{t('clientSummary.savings')}</span>
                <span className="font-semibold text-teal-600">{formatCurrency(savings)}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Objectives, Insurances & Info */}
        <div className="md:w-1/3 p-8 bg-gradient-to-br from-white to-purple-50/30 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div className="font-bold text-lg tracking-tight text-slate-800">{t('financialGoals.title')}</div>
            </div>
            {objectives.length === 0 ? (
              <div className="text-slate-400 italic p-2 rounded-lg bg-purple-50/50">{t('clientSummary.noObjectives')}</div>
            ) : (
              <ul className="space-y-3">
                {objectives.map((obj, idx: number) => (
                  <li key={idx} className="border-l-4 border-purple-400 pl-4 py-2 hover:bg-purple-50/50 rounded-r-lg transition-colors">
                    <div className="font-semibold text-slate-800">{obj.name}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-pink-100 to-rose-100">
                <ShieldCheck className="h-6 w-6 text-pink-600" />
              </div>
              <div className="font-bold text-lg tracking-tight text-slate-800">{t('clientSummary.insuranceCoverage')}</div>
            </div>
            {insurances.length === 0 ? (
              <div className="text-slate-400 italic p-2 rounded-lg bg-pink-50/50">{t('clientSummary.noInsurance')}</div>
            ) : (
              <>
                <div className="mb-3 text-sm text-slate-500 px-2">{t('clientSummary.total')}: {insurances.length}</div>
                <ul className="space-y-2">
                  {insurances.map((insurance, idx: number) => (
                    <li key={idx} className="flex flex-col text-sm rounded-lg bg-pink-50/50 px-4 py-3 hover:bg-pink-100/50 transition-colors">
                      <span className="font-semibold text-slate-800">{insurance.type}</span>
                      <span className="text-slate-500">{insurance.company}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div>
            <div className="font-bold text-lg mb-4 text-slate-800">{t('clientSummary.hobbies')}</div>
            {Array.isArray(hobbies) && hobbies.length > 0 ? (
              <ul className="space-y-2">
                {hobbies.map((hobby, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <span className="text-purple-400 mt-1">•</span>
                    <span className="text-slate-700">{hobby.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400 italic p-2 rounded-lg bg-purple-50/50">{t('clientSummary.noData')}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 