import { Card } from '@/components/ui/card';
import { Profile, InvestmentPlan } from '@/types/financial';
import { InvestmentPolicyData } from '@/services/investment-policy.service';
import { UserCircle2, Briefcase, PiggyBank, CreditCard, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { calculateAge } from '@/lib/utils';
import { RISK_PROFILES } from '@/constants/riskProfiles';

interface ClientSummaryCardProps {
  clientProfile: Profile;
  investmentPlan: InvestmentPlan;
  policy?: InvestmentPolicyData;
}

export function ClientSummaryCard({ clientProfile, policy }: ClientSummaryCardProps) {
  const { t } = useTranslation();

  // Patrimonial
  const patrimonial = policy?.patrimonial_situations || {};
  const investments = Number(patrimonial?.investments?.properties?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0);
  const liquidInvestments = Number(patrimonial?.investments?.liquid_investments?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0);
  const participations = Number(patrimonial?.investments?.participations?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0);
  const emergencyReserve = Number(patrimonial?.investments?.emergency_reserve?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0);
  const properties = Number(patrimonial?.personal_assets?.properties?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0);
  const vehicles = Number(patrimonial?.personal_assets?.vehicles?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0);
  const valuableGoods = Number(patrimonial?.personal_assets?.valuable_goods?.reduce((acc: number, i: { value: number }) => acc + (i.value || 0), 0) || 0);
  const totalPatrimony = investments + liquidInvestments + participations + emergencyReserve + properties + vehicles + valuableGoods;

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
    <Card className="w-full max-w-5xl mx-auto shadow-xl rounded-2xl border border-gray-100 dark:border-slate-800 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/30 dark:to-slate-800/30 overflow-hidden">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-800">
        {/* Left: Profile & Personal */}
        <div className="md:w-1/3 p-8 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-800/30 flex flex-col gap-8">
          <div className="flex flex-col gap-1 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40">
                <UserCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-2xl tracking-tight">{clientProfile.name}</span>
                <span className="text-sm text-blue-600 dark:text-blue-300">{policy?.professional_information?.occupation || '-'}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-4 border-b-2 border-blue-200 dark:border-blue-900 pb-2 text-slate-800 dark:text-slate-200">{t('clientSummary.personalInfo')}</div>
            <div className="space-y-3 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
                <span className="font-semibold text-slate-500 dark:text-slate-400 min-w-[100px]">{t('clientSummary.age')}:</span>
                <span className="text-slate-700 dark:text-slate-200">{calculateAge(clientProfile.birth_date)} {t('clientSummary.years')}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
                <span className="font-semibold text-slate-500 dark:text-slate-400 min-w-[100px]">{t('clientSummary.maritalStatus')}:</span>
                <span className="text-slate-700 dark:text-slate-200">{maritalStatus ? t(`familyStructure.maritalStatus.options.${maritalStatus}`) : '-'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
                <span className="font-semibold text-slate-500 dark:text-slate-400 min-w-[100px]">{t('clientSummary.children')}:</span>
                <span className="text-slate-700 dark:text-slate-200">{children.length > 0 ? children.length : t('clientSummary.noChildren')}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-4 border-b-2 border-blue-200 dark:border-blue-900 pb-2 text-slate-800 dark:text-slate-200">{t('investmentPolicy.lifeStage.label')}</div>
            <ul className="space-y-3">
              <li className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${lifeStage === 'accumulation' ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20'}`}>
                <span className={`h-3 w-3 rounded-full ${lifeStage === 'accumulation' ? 'bg-blue-500 dark:bg-blue-400' : 'bg-blue-200 dark:bg-blue-900/40'}`}></span>
                <span className={lifeStage === 'accumulation' ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}>{t('investmentPolicy.lifeStage.options.accumulation')}</span>
              </li>
              <li className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${lifeStage === 'consolidation' ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20'}`}>
                <span className={`h-3 w-3 rounded-full ${lifeStage === 'consolidation' ? 'bg-blue-500 dark:bg-blue-400' : 'bg-blue-200 dark:bg-blue-900/40'}`}></span>
                <span className={lifeStage === 'consolidation' ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}>{t('investmentPolicy.lifeStage.options.consolidation')}</span>
              </li>
              <li className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${lifeStage === 'enjoyment' ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20'}`}>
                <span className={`h-3 w-3 rounded-full ${lifeStage === 'enjoyment' ? 'bg-blue-500 dark:bg-blue-400' : 'bg-blue-200 dark:bg-blue-900/40'}`}></span>
                <span className={lifeStage === 'enjoyment' ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}>{t('investmentPolicy.lifeStage.options.enjoyment')}</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Middle: Patrimonial & Budget */}
        <div className="md:w-1/3 p-8 bg-white dark:bg-slate-900 flex flex-col gap-8 border-l-4 border-indigo-100 dark:border-indigo-900/40">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40">
                <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">{t('patrimonial.title')}</div>
            </div>
            <div className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">{formatCurrency(totalPatrimony)}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                <span className="text-slate-500 dark:text-slate-400">{t('clientSummary.investments')}</span>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{formatCurrency(investments + liquidInvestments + participations)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                <span className="text-slate-500 dark:text-slate-400">{t('clientSummary.emergencyReserve')}</span>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{formatCurrency(emergencyReserve)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                <span className="text-slate-500 dark:text-slate-400">{t('clientSummary.properties')}</span>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{formatCurrency(properties)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                <span className="text-slate-500 dark:text-slate-400">{t('clientSummary.vehicles')}</span>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{formatCurrency(vehicles)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                <span className="text-slate-500 dark:text-slate-400">{t('clientSummary.valuableGoods')}</span>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{formatCurrency(valuableGoods)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                <span className="text-slate-500 dark:text-slate-400">{t('clientSummary.other')}</span>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{formatCurrency(0)}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40">
                <PiggyBank className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
              </div>
              <div className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">{t('budget.title')}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors">
                <span className="text-slate-500 dark:text-slate-400">{t('clientSummary.income')}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-300">{formatCurrency(income)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-colors">
                <span className="text-slate-500 dark:text-slate-400">{t('clientSummary.expense')}</span>
                <span className="font-semibold text-rose-500 dark:text-rose-300">{formatCurrency(expenses)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors">
                <span className="text-slate-500 dark:text-slate-400">{t('clientSummary.savings')}</span>
                <span className="font-semibold text-teal-600 dark:text-teal-300">{formatCurrency(savings)}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Objectives, Insurances & Info */}
        <div className="md:w-1/3 p-8 bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-900 dark:to-purple-900/20 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40">
                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">{t('financialGoals.title')}</div>
            </div>
            {objectives.length === 0 ? (
              <div className="text-slate-400 dark:text-slate-500 italic p-2 rounded-lg bg-purple-50/50 dark:bg-purple-900/20">{t('clientSummary.noObjectives')}</div>
            ) : (
              <ul className="space-y-3">
                {objectives.map((obj, idx: number) => (
                  <li key={idx} className="border-l-4 border-purple-400 pl-4 py-2 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 rounded-r-lg transition-colors">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{obj.name}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40">
                <ShieldCheck className="h-6 w-6 text-pink-600 dark:text-pink-300" />
              </div>
              <div className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">{t('clientSummary.insuranceCoverage')}</div>
            </div>
            {insurances.length === 0 ? (
              <div className="text-slate-400 dark:text-slate-500 italic p-2 rounded-lg bg-pink-50/50 dark:bg-pink-900/20">{t('clientSummary.noInsurance')}</div>
            ) : (
              <>
                <div className="mb-3 text-sm text-slate-500 dark:text-slate-400 px-2">{t('clientSummary.total')}: {insurances.length}</div>
                <ul className="space-y-2">
                  {insurances.map((insurance, idx: number) => (
                    <li key={idx} className="flex flex-col text-sm rounded-lg bg-pink-50/50 dark:bg-pink-900/20 px-4 py-3 hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{insurance.type}</span>
                      <span className="text-slate-500 dark:text-slate-400">{insurance.company}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div>
            <div className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">{t('clientSummary.hobbies')}</div>
            {Array.isArray(hobbies) && hobbies.length > 0 ? (
              <ul className="space-y-2">
                {hobbies.map((hobby, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors">
                    <span className="text-purple-400 dark:text-purple-300 mt-1">•</span>
                    <span className="text-slate-700 dark:text-slate-200">{hobby.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400 dark:text-slate-500 italic p-2 rounded-lg bg-purple-50/50 dark:bg-purple-900/20">{t('clientSummary.noData')}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 