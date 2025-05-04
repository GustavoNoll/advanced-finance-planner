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
    <Card className="w-full max-w-5xl mx-auto shadow-lg rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Left: Profile & Personal */}
        <div className="md:w-1/3 p-8 bg-gradient-to-br from-white to-gray-50/50 flex flex-col gap-8">
          <div className="flex flex-col gap-1 mb-2">
            <div className="flex items-center gap-3">
              <UserCircle2 className="h-8 w-8 text-slate-500" />
              <span className="font-bold text-slate-600 text-xl tracking-tight">{t('clientSummary.personalInfo')}: {riskProfileLabel}</span>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-3 border-b-2 border-slate-200 pb-1">{t('clientSummary.personalInfo')}</div>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-2"><span className="font-semibold text-slate-500">{t('clientSummary.name')}:</span> {clientProfile.name}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-slate-500">{t('clientSummary.occupation')}:</span> {policy?.professional_information?.occupation || '-'}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-slate-500">{t('clientSummary.age')}:</span> {calculateAge(clientProfile.birth_date)} {t('clientSummary.years')}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-slate-500">{t('clientSummary.maritalStatus')}:</span> {maritalStatus ? t(`familyStructure.maritalStatus.options.${maritalStatus}`) : '-'}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-slate-500">{t('clientSummary.children')}:</span> {children.length > 0 ? children.length : t('clientSummary.noChildren')}</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-3 border-b-2 border-slate-200 pb-1">{t('investmentPolicy.lifeStage.label')}</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${lifeStage === 'accumulation' ? 'bg-slate-500' : 'bg-slate-200'}`}></span>
                <span className={lifeStage === 'accumulation' ? 'font-semibold text-slate-600' : 'text-slate-400'}>{t('investmentPolicy.lifeStage.options.accumulation')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${lifeStage === 'consolidation' ? 'bg-slate-500' : 'bg-slate-200'}`}></span>
                <span className={lifeStage === 'consolidation' ? 'font-semibold text-slate-600' : 'text-slate-400'}>{t('investmentPolicy.lifeStage.options.consolidation')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${lifeStage === 'enjoyment' ? 'bg-slate-500' : 'bg-slate-200'}`}></span>
                <span className={lifeStage === 'enjoyment' ? 'font-semibold text-slate-600' : 'text-slate-400'}>{t('investmentPolicy.lifeStage.options.enjoyment')}</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Middle: Patrimonial & Budget */}
        <div className="md:w-1/3 p-8 bg-white flex flex-col gap-8 border-l-4 border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-6 w-6 text-slate-500" />
              <div className="font-bold text-lg tracking-tight text-slate-600">{t('patrimonial.title')}</div>
            </div>
            <div className="text-3xl font-bold mb-4 text-slate-700">{formatCurrency(totalPatrimony)}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">{t('clientSummary.investments')}</span>
                <span className="font-semibold text-slate-600">{formatCurrency(investments + liquidInvestments + participations)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">{t('clientSummary.properties')}</span>
                <span className="font-semibold text-slate-600">{formatCurrency(properties)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">{t('clientSummary.vehicles')}</span>
                <span className="font-semibold text-slate-600">{formatCurrency(vehicles)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">{t('clientSummary.valuableGoods')}</span>
                <span className="font-semibold text-slate-600">{formatCurrency(valuableGoods)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">{t('clientSummary.other')}</span>
                <span className="font-semibold text-slate-600">{formatCurrency(0)}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank className="h-6 w-6 text-slate-500" />
              <div className="font-bold text-lg tracking-tight text-slate-600">{t('budget.title')}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">{t('clientSummary.income')}</span>
                <span className="font-semibold text-emerald-500">{formatCurrency(income)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">{t('clientSummary.expense')}</span>
                <span className="font-semibold text-rose-400">{formatCurrency(expenses)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">{t('clientSummary.savings')}</span>
                <span className="font-semibold text-slate-500">{formatCurrency(savings)}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Objectives, Insurances & Info */}
        <div className="md:w-1/3 p-8 bg-gradient-to-br from-white to-gray-50/50 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-6 w-6 text-slate-500" />
              <div className="font-bold text-lg tracking-tight text-slate-600">{t('financialGoals.title')}</div>
            </div>
            {objectives.length === 0 ? (
              <div className="text-slate-400 italic">{t('clientSummary.noObjectives')}</div>
            ) : (
              <ul className="space-y-3">
                {objectives.map((obj, idx: number) => (
                  <li key={idx} className="border-l-4 border-slate-400 pl-3 py-1">
                    <div className="font-semibold text-slate-600">{obj.name}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-6 w-6 text-slate-500" />
              <div className="font-bold text-lg tracking-tight text-slate-600">{t('clientSummary.insuranceCoverage')}</div>
            </div>
            {insurances.length === 0 ? (
              <div className="text-slate-400 italic">{t('clientSummary.noInsurance')}</div>
            ) : (
              <>
                <div className="mb-2 text-sm text-slate-500">{t('clientSummary.total')}: {insurances.length}</div>
                <ul className="space-y-2">
                  {insurances.map((insurance, idx: number) => (
                    <li key={idx} className="flex flex-col text-sm rounded-lg bg-slate-50 px-3 py-2">
                      <span className="font-semibold text-slate-600">{insurance.type}</span>
                      <span className="text-slate-500">{insurance.company}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div>
            <div className="font-bold text-lg mb-3 text-slate-600">{t('clientSummary.hobbies')}</div>
            {Array.isArray(hobbies) && hobbies.length > 0 ? (
              <ul className="space-y-2">
                {hobbies.map((hobby, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 mt-1">•</span>
                    <span className="text-slate-600">{hobby.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400 italic">{t('clientSummary.noData')}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 