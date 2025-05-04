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
  const maritalStatus = family?.marital_status || '-';
  const children = family?.children || [];

  // Objectives
  const objectives = policy?.life_information?.objectives || [];

  // Info
  const info = policy?.life_information?.info || [];
  // Insurances
  const insurances = policy?.life_information?.insurances || [];

  // Risk Profile
  const riskProfileValue = policy?.investment_preferences?.risk_profile;
  const riskProfileLabel =
    RISK_PROFILES.BRL.find((p) => p.value === riskProfileValue)?.label || 'Não informado';

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Left: Profile & Personal */}
        <div className="md:w-1/3 p-8 bg-gradient-to-b from-white to-gray-50 flex flex-col gap-8">
          <div className="flex flex-col gap-1 mb-2">
            <div className="flex items-center gap-3">
              <UserCircle2 className="h-7 w-7 text-pink-600" />
              <span className="font-bold text-pink-700 text-xl tracking-tight">Perfil predominante: {riskProfileLabel}</span>
            </div>
          </div>
          <div>
            <div className="font-bold text-lg mb-3 border-b-2 border-pink-200 pb-1">Informações Pessoais</div>
            <div className="mb-1"><span className="font-bold">Nome:</span> {clientProfile.name}</div>
            <div className="mb-1"><span className="font-bold">Profissão:</span> {policy?.professional_information?.occupation || '-'}</div>
            <div className="mb-1"><span className="font-bold">Idade:</span> {calculateAge(clientProfile.birth_date)} anos</div>
            <div className="mb-1"><span className="font-bold">Estado civil:</span> {t(`familyStructure.maritalStatus.options.${maritalStatus}`) || '-'}</div>
            <div className="mb-1"><span className="font-bold">Filhos:</span> {children.length > 0 ? children.length : 'Nenhum'}</div>
          </div>
          <div>
            <div className="font-bold text-lg mb-3 border-b-2 border-pink-200 pb-1">Momento de vida</div>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <span className={lifeStage === 'accumulation' ? 'text-pink-700' : 'text-gray-300'}>▸</span>
                <span className={lifeStage === 'accumulation' ? 'font-bold' : 'text-gray-500'}>Construir patrimônio</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={lifeStage === 'consolidation' ? 'text-pink-700' : 'text-gray-300'}>▸</span>
                <span className={lifeStage === 'consolidation' ? 'font-bold' : 'text-gray-500'}>Consolidar patrimônio</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={lifeStage === 'enjoyment' ? 'text-pink-700' : 'text-gray-300'}>▸</span>
                <span className={lifeStage === 'enjoyment' ? 'font-bold' : 'text-gray-500'}>Usufruir do patrimônio</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Middle: Patrimonial & Budget */}
        <div className="md:w-1/3 p-8 bg-white flex flex-col gap-8 border-l-4 border-pink-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-5 w-5 text-pink-600" />
              <div className="font-bold text-lg tracking-tight">Situação Patrimonial</div>
            </div>
            <div className="text-2xl font-bold mb-3 text-gray-800">{formatCurrency(totalPatrimony)}</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Investimentos</span><span>{formatCurrency(investments + liquidInvestments + participations)}</span></div>
              <div className="flex justify-between"><span>Imóveis</span><span>{formatCurrency(properties)}</span></div>
              <div className="flex justify-between"><span>Carros</span><span>{formatCurrency(vehicles)}</span></div>
              <div className="flex justify-between"><span>Bens de Valor</span><span>{formatCurrency(valuableGoods)}</span></div>
              <div className="flex justify-between"><span>Outros</span><span>{formatCurrency(0)}</span></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-5 w-5 text-pink-600" />
              <div className="font-bold text-lg tracking-tight">Orçamento</div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2"><span className="font-bold">Renda:</span> {formatCurrency(income)}</div>
              <div className="flex items-center gap-2"><span className="font-bold">Gastos:</span> {formatCurrency(expenses)}</div>
              <div className="flex items-center gap-2"><span className="font-bold">Poupança:</span> {formatCurrency(savings)}</div>
            </div>
          </div>
        </div>
        {/* Right: Objectives, Insurances & Info */}
        <div className="md:w-1/3 p-8 bg-gradient-to-b from-white to-gray-50 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-5 w-5 text-pink-600" />
              <div className="font-bold text-lg tracking-tight">Objetivos Financeiros</div>
            </div>
            {objectives.length === 0 ? (
              <div className="text-gray-400">Nenhum objetivo cadastrado</div>
            ) : (
              <ul className="space-y-4">
                {objectives.map((obj, idx: number) => (
                  <li key={idx} className="border-l-4 border-pink-600 pl-3">
                    <div className="font-bold text-pink-700">{obj.name}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-pink-600" />
              <div className="font-bold text-lg tracking-tight">Seguros</div>
            </div>
            {insurances.length === 0 ? (
              <div className="text-gray-400">Nenhum seguro cadastrado</div>
            ) : (
              <>
                <div className="mb-1 text-sm">Total: {insurances.length}</div>
                <ul className="space-y-1">
                  {insurances.map((insurance, idx: number) => (
                    <li key={idx} className="flex flex-col text-sm rounded bg-pink-50 px-2 py-1 mb-1">
                      <span><span className="font-bold">Tipo:</span> {insurance.type}</span>
                      <span><span className="font-bold">Seguradora:</span> {insurance.company}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div>
            <div className="font-bold text-lg mb-2">Informações</div>
            {Array.isArray(info) && info.length > 0 ? (
              <ul className="list-disc ml-5 space-y-1">
                {info.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
              </ul>
            ) : (
              <div className="text-gray-400">Nenhuma informação adicional</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 