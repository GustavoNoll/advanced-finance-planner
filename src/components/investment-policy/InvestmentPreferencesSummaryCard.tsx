import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Text } from '@tremor/react';
import { DonutChart } from '@tremor/react';
import { ASSET_CLASS_LABELS } from '@/constants/assetAllocations';
import { useTranslation } from 'react-i18next';
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { ShieldCheck } from 'lucide-react';
import { InvestmentPreferences, AssetAllocation, Platform } from '@/services/investment-policy.service';

interface InvestmentPreferencesSummaryCardProps {
  assetAllocations: AssetAllocation;
  preferences: InvestmentPreferences;
}

export function InvestmentPreferencesSummaryCard({ assetAllocations, preferences }: InvestmentPreferencesSummaryCardProps) {
  const { t } = useTranslation();
  // Monta dados para o gráfico
  const chartData = Object.entries(assetAllocations || {})
    .filter(([, value]) => (value as number) > 0)
    .map(([key, value]) => ({
      name: t(`investmentPreferences.assets.${key}`, { defaultValue: ASSET_CLASS_LABELS[key] || key }),
      value: value as number,
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
    <Card className="w-full max-w-5xl mx-auto shadow-xl rounded-2xl border border-gray-100 dark:border-slate-800 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/30 dark:to-slate-800/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-900/10 border-b border-blue-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40">
            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
            {t('investmentPreferences.form.riskProfile')}: <span className="text-blue-600 dark:text-blue-300">{riskProfileLabel}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8 items-center p-8">
        {/* Gráfico */}
        <div className="flex-1 min-w-[220px] max-w-xs bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <Text className="text-center text-base font-semibold mb-4 text-slate-800 dark:text-slate-200">
            {t('investmentPreferences.form.assetAllocations')}
          </Text>
          <DonutChart
            data={chartData}
            category="value"
            index="name"
            colors={donutColors}
            valueFormatter={v => `${v.toFixed(2)}%`}
            showLabel={false}
            showAnimation
            noDataText={t('common.noData', { defaultValue: '-' })}
            className="h-64 text-slate-800 dark:text-slate-200"
            customTooltip={({ payload, active }) => {
              if (!active || !payload) return null;
              return (
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg border border-gray-100 dark:border-slate-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{payload[0].name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{payload[0].value.toFixed(2)}%</p>
                </div>
              );
            }}
          />
        </div>
        {/* Dados de destaque */}
        <div className="flex-1 min-w-[220px] space-y-6">
          <div className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-900/10 rounded-xl p-4 shadow-sm">
            <div className="text-lg font-bold leading-tight text-slate-800 dark:text-slate-200 mb-2">Meta de Retorno</div>
            <div className="text-base text-indigo-600 dark:text-indigo-300 font-medium">{formatTargetReturnIpcaPlus(preferences?.target_return_ipca_plus)}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/10 rounded-xl p-4 shadow-sm hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors">
              <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{t('investmentPreferences.form.targetReturnReview')}</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{getTranslationOrValue(`investmentPreferences.options.reviewPeriods.${preferences?.target_return_review}`, preferences?.target_return_review)}</span>
            </div>
            <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-900/10 rounded-xl p-4 shadow-sm hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
              <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{t('investmentPreferences.form.maxBondMaturity')}</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{getTranslationOrValue(`investmentPreferences.options.bondMaturities.${preferences?.max_bond_maturity}`, preferences?.max_bond_maturity)}</span>
            </div>
            <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-900 dark:to-purple-900/10 rounded-xl p-4 shadow-sm hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors">
              <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{t('investmentPreferences.form.maxFundLiquidity')}</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{getTranslationOrValue(`investmentPreferences.options.fundLiquidity.${preferences?.max_fund_liquidity}`, preferences?.max_fund_liquidity)}</span>
            </div>
            <div className="bg-gradient-to-br from-white to-pink-50/30 dark:from-slate-900 dark:to-pink-900/10 rounded-xl p-4 shadow-sm hover:bg-pink-50/50 dark:hover:bg-pink-900/20 transition-colors">
              <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{t('investmentPreferences.form.maxAcceptableLoss')}</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{getTranslationOrValue(`investmentPreferences.options.acceptableLoss.${preferences?.max_acceptable_loss}`, preferences?.max_acceptable_loss ? preferences?.max_acceptable_loss + '%' : undefined)}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-teal-50/30 dark:from-slate-900 dark:to-teal-900/10 rounded-xl p-4 shadow-sm hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors">
            <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{t('investmentPreferences.form.platformsUsed')}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{preferences?.platforms_used?.length ? preferences.platforms_used.map((p) => p.name).join(', ') : '-'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 