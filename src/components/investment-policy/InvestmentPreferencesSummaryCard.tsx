import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Text } from '@tremor/react';
import { DonutChart } from '@tremor/react';
import { ASSET_CLASS_LABELS } from '@/constants/assetAllocations';
import { useTranslation } from 'react-i18next';
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { ShieldCheck } from 'lucide-react';

interface Platform {
  name: string;
}

interface InvestmentPreferencesSummaryCardProps {
  assetAllocations: Record<string, number>;
  preferences: {
    target_return_ipca_plus?: string;
    risk_profile?: string;
    target_return_review?: string;
    max_bond_maturity?: string;
    max_fund_liquidity?: string;
    max_acceptable_loss?: string;
    platforms_used?: Platform[];
  };
}

export function InvestmentPreferencesSummaryCard({ assetAllocations, preferences }: InvestmentPreferencesSummaryCardProps) {
  const { t } = useTranslation();

  // Monta dados para o gráfico
  const chartData = Object.entries(assetAllocations || {})
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: t(`investmentPreferences.assets.${key}`, { defaultValue: ASSET_CLASS_LABELS[key] || key }),
      value,
    }));

  // Cores para o gráfico
  const donutColors = ['blue', 'emerald', 'orange', 'violet', 'fuchsia', 'amber', 'lime', 'pink', 'cyan', 'gray'];

  // Função utilitária para extrair o número da meta de retorno
  function formatTargetReturnIpcaPlus(value?: string): string {
    if (!value) return '-';
    const match = value.match(/ipca_plus_(\d+)/i);
    if (match) return `IPCA+${match[1]}% a.a`;
    return value;
  }

  // Função utilitária para mostrar tradução ou fallback do valor
  function getTranslationOrValue(key: string, value?: string, fallback?: string) {
    if (!value) return '-';
    const translation = t(key, { defaultValue: '' });
    return translation && translation !== key ? translation : (fallback || value);
  }

  // Busca label traduzido do perfil de risco
  const riskProfileLabel = RISK_PROFILES.BRL.find((p) => p.value === preferences?.risk_profile)?.label || '-';

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-white to-blue-50/30 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-slate-800">
            {t('investmentPreferences.form.riskProfile')}: <span className="text-blue-600">{riskProfileLabel}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8 items-center p-8">
        {/* Gráfico */}
        <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-center text-base font-semibold mb-4 text-slate-800">
            {t('investmentPreferences.form.assetAllocations')}
          </Text>
          <DonutChart
            data={chartData}
            category="value"
            index="name"
            colors={donutColors}
            valueFormatter={v => `${v.toFixed(2)}%`}
            showLabel
            showAnimation
            className="h-64"
            customTooltip={({ payload, active }) => {
              if (!active || !payload) return null;
              return (
                <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
                  <p className="text-sm text-gray-600">{payload[0].value.toFixed(2)}%</p>
                </div>
              );
            }}
          />
        </div>
        {/* Dados de destaque */}
        <div className="flex-1 min-w-[220px] space-y-6">
          <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-xl p-4 shadow-sm">
            <div className="text-lg font-bold leading-tight text-slate-800 mb-2">Meta de Retorno</div>
            <div className="text-base text-indigo-600 font-medium">{formatTargetReturnIpcaPlus(preferences?.target_return_ipca_plus)}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-xl p-4 shadow-sm hover:bg-emerald-50/50 transition-colors">
              <span className="block text-xs text-slate-500 mb-1">{t('investmentPreferences.form.targetReturnReview')}</span>
              <span className="font-medium text-slate-800">{getTranslationOrValue(`investmentPreferences.options.reviewPeriods.${preferences?.target_return_review}`, preferences?.target_return_review)}</span>
            </div>
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-4 shadow-sm hover:bg-blue-50/50 transition-colors">
              <span className="block text-xs text-slate-500 mb-1">{t('investmentPreferences.form.maxBondMaturity')}</span>
              <span className="font-medium text-slate-800">{getTranslationOrValue(`investmentPreferences.options.bondMaturities.${preferences?.max_bond_maturity}`, preferences?.max_bond_maturity)}</span>
            </div>
            <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl p-4 shadow-sm hover:bg-purple-50/50 transition-colors">
              <span className="block text-xs text-slate-500 mb-1">{t('investmentPreferences.form.maxFundLiquidity')}</span>
              <span className="font-medium text-slate-800">{getTranslationOrValue(`investmentPreferences.options.fundLiquidity.${preferences?.max_fund_liquidity}`, preferences?.max_fund_liquidity)}</span>
            </div>
            <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-xl p-4 shadow-sm hover:bg-pink-50/50 transition-colors">
              <span className="block text-xs text-slate-500 mb-1">{t('investmentPreferences.form.maxAcceptableLoss')}</span>
              <span className="font-medium text-slate-800">{getTranslationOrValue(`investmentPreferences.options.acceptableLoss.${preferences?.max_acceptable_loss}`, preferences?.max_acceptable_loss ? preferences?.max_acceptable_loss + '%' : undefined)}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-teal-50/30 rounded-xl p-4 shadow-sm hover:bg-teal-50/50 transition-colors">
            <span className="block text-xs text-slate-500 mb-1">{t('investmentPreferences.form.platformsUsed')}</span>
            <span className="font-medium text-slate-800">{preferences?.platforms_used?.length ? preferences.platforms_used.map((p) => p.name).join(', ') : '-'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 