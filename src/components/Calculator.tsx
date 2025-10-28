import { useTranslation } from "react-i18next";
import { Info, Calculator as CalculatorIcon, ArrowRightLeft } from "lucide-react";
import { PlanProgressData } from "@/lib/plan-progress-calculator";
import { DashboardCard } from "./DashboardCard";
import { InvestmentPlan, MicroInvestmentPlan } from "@/types/financial";
import { formatCurrency, CurrencyCode} from '@/utils/currency';
import { useInvestmentPlanMutations } from "@/hooks/useInvestmentPlan";
import { useToast } from "@/components/ui/use-toast";
import { createDateWithoutTimezone } from "@/utils/dateUtils";
import { MicroInvestmentPlanService } from "@/services/micro-investment-plan.service";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Props for the PlanProgress component
 */
interface PlanProgressProps {
  /** Processed plan progress data */
  data: PlanProgressData;
  /** Investment plan data */
  investmentPlan: InvestmentPlan;
  /** Active micro investment plan data */
  activeMicroPlan: MicroInvestmentPlan | null;
  /** Function to refresh micro plans */
  onRefreshMicroPlans?: () => Promise<void>;
  /** Client profile with birth date */
  clientProfile?: { birth_date?: string };
  /** Client ID for query invalidation */
  clientId?: string;
  /** Function to handle plan updates */
  onPlanUpdated?: () => void;
}


/**
 * Component to display comparison between planned and projected values
 */
interface ComparisonRowProps {
  title: string;
  planned: number;
  projected: number;
  isCurrency?: boolean;
  isHigherBetter?: boolean;
  t: (key: string) => string;
  currency: string;
  plannedAgeYears?: number;
  plannedAgeMonths?: number;
  projectedAgeYears?: number;
  projectedAgeMonths?: number;
  showOptimizerButton?: boolean;
  onOptimizeClick?: () => void;
  currentValue?: number;
}

/**
 * Formats months into years and months string with client's age
 */
const formatMonthsToYearsAndMonths = (months: number, t: (key: string) => string, currentAge?: number): string => {
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  
  if (months < 12) return '';

  let result = '';
  if (remainingMonths === 0) {
    result = `(${years} ${t('common.years')})`;
  } else {
    result = `(${years} ${t('common.years')} ${t('common.and')} ${remainingMonths} ${t('common.months')})`;
  }

  if (currentAge !== undefined) {
    result += `\n${t('dashboard.planProgress.ageAtRetirement')}: ${currentAge} ${t('common.years')}`;
  }

  return result;
};

/**
 * Formats retirement tooltip
 */
const formatRetirementTooltip = (years?: number, months?: number, t?: (key: string) => string): string => {
  if (years === undefined || months === undefined || !t) return '';
  let result = '';
  if (years > 0 && months > 0) result = `${years} ${t('common.years')} e ${months} ${t('common.months')}`;
  else if (years > 0) result = `${years} ${t('common.years')}`;
  else if (months > 0) result = `${months} ${t('common.months')}`;
  return `Aposentadoria em ${result}`;
};

/**
 * Renders a comparison row between planned and projected values
 */
const ComparisonRow = ({ 
  title, 
  planned, 
  projected, 
  isCurrency = true, 
  isHigherBetter = false,
  currency,
  t,
  plannedAgeYears,
  plannedAgeMonths,
  projectedAgeYears,
  projectedAgeMonths,
  showOptimizerButton = false,
  onOptimizeClick,
  currentValue
}: ComparisonRowProps) => {
  const difference = Math.round(projected) - Math.round(planned);
  const isEqual = difference === 0;
  const isPositive = difference >= 0;
  const isGood = isHigherBetter ? isPositive : !isPositive;
  
  // Verificar se deve mostrar o botão (apenas se o valor atual for diferente do projetado)
  const shouldShowButton = showOptimizerButton && onOptimizeClick && currentValue !== undefined && Math.round(currentValue) !== Math.round(projected);
  
  return (
    <div className="bg-white/50 dark:bg-gray-900/40 rounded-lg p-4 transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-900/60 hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">{title}</h3>
        {shouldShowButton && (
          <button
            onClick={onOptimizeClick}
            className="flex items-center justify-center w-7 h-7 text-gray-500 hover:text-orange-600 bg-transparent hover:bg-gray-100 rounded-md transition-all duration-200"
            title={t('dashboard.planProgress.replaceWithOptimized')}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="flex justify-between items-baseline">
        <div className="space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.planProgress.planned')}:</p>
          <div>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">
              {isCurrency 
                ? formatCurrency(planned, currency as CurrencyCode)
                : `${planned.toFixed(0)} ${t('common.months')}`
              }
            </p>
            {!isCurrency && planned >= 12 && (
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {formatMonthsToYearsAndMonths(planned, t)}
              </span>
            )}
            {!isCurrency && planned >= 12 && plannedAgeYears !== undefined && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span className="block">
                  <span className="relative group cursor-pointer">
                    <span>
                      {t('dashboard.planProgress.retirement')}: {plannedAgeYears} {t('common.years')}
                    </span>
                    <span className="absolute left-1/2 z-10 hidden group-hover:flex -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                      {plannedAgeYears > 0 && plannedAgeMonths > 0
                        ? formatRetirementTooltip(plannedAgeYears, plannedAgeMonths, t)
                        : plannedAgeYears > 0
                          ? formatRetirementTooltip(plannedAgeYears, undefined, t)
                          : formatRetirementTooltip(undefined, plannedAgeMonths, t)
                      }
                    </span>
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.planProgress.projected')}:</p>
          <div>
            <p className={`text-lg font-semibold ${isEqual ? 'text-gray-900 dark:text-gray-100' : isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isCurrency 
                ? formatCurrency(projected, currency as CurrencyCode)
                : `${Math.round(projected)} ${t('common.months')}`
              }
              {!isEqual && (
                <span className={`text-xs ml-1.5 px-1.5 py-0.5 rounded-full ${isGood ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-rose-50 dark:bg-rose-900/30'}`}>
                  {isPositive ? '+' : '-'}
                  {isCurrency 
                    ? formatCurrency(Math.abs(difference), currency as CurrencyCode)
                    : `${Math.abs(difference)} ${t('common.months')}`
                  }
                </span>
              )}
            </p>
            {!isCurrency && projected >= 12 && (
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {formatMonthsToYearsAndMonths(Math.round(projected), t)}
              </span>
            )}
            {!isCurrency && projected >= 12 && projectedAgeYears !== undefined && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span className="block">
                  <span className="relative group cursor-pointer">
                    <span>
                      {t('dashboard.planProgress.retirement')}: {projectedAgeYears} {t('common.years')}
                    </span>
                    <span className="absolute left-1/2 z-10 hidden group-hover:flex -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                      {projectedAgeYears > 0 && projectedAgeMonths > 0
                        ? formatRetirementTooltip(projectedAgeYears, projectedAgeMonths, t)
                        : projectedAgeYears > 0
                          ? formatRetirementTooltip(projectedAgeYears, undefined, t)
                          : formatRetirementTooltip(undefined, projectedAgeMonths, t)
                      }
                    </span>
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Component that displays the progress of a financial plan
 */
export const Calculator = ({ data, investmentPlan, activeMicroPlan, onRefreshMicroPlans, clientProfile, clientId, onPlanUpdated }: PlanProgressProps) => {
  const { t } = useTranslation();
  const { updatePlan } = useInvestmentPlanMutations();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingOptimization, setPendingOptimization] = useState<'timeToRetirement' | 'monthlyContribution' | 'monthlyWithdrawal' | null>(null);

  const handleOptimizeClick = (type: 'timeToRetirement' | 'monthlyContribution' | 'monthlyWithdrawal') => {
    setPendingOptimization(type);
    setShowConfirmDialog(true);
  };

  const handleConfirmOptimization = async () => {
    if (!pendingOptimization) return;
    
    setShowConfirmDialog(false);
    await handleOptimizeValue(pendingOptimization);
    setPendingOptimization(null);
  };

  const handleOptimizeValue = async (type: 'timeToRetirement' | 'monthlyContribution' | 'monthlyWithdrawal') => {
    if (!data || !investmentPlan) return;

    try {
      let updateData: Partial<InvestmentPlan> = {};

      switch (type) {
        case 'timeToRetirement': {
          // Usar a data de aposentadoria projetada que já vem calculada
          const projectedRetirementDate = data.projectedRetirementDate;

          // Calcular a nova idade final baseada na data de nascimento
          if (!clientProfile?.birth_date) {
            toast({
              title: t('common.error'),
              description: t('dashboard.planProgress.birthDateNotFound'),
              variant: 'destructive',
            });
            return;
          }

          const birthDate = createDateWithoutTimezone(clientProfile.birth_date);
          const newFinalAge = projectedRetirementDate.getFullYear() - birthDate.getFullYear();

          updateData = {
            plan_end_accumulation_date: projectedRetirementDate.toISOString().split('T')[0],
            final_age: newFinalAge
          };
          await updatePlan.mutateAsync({
            planId: investmentPlan.id,
            planData: updateData
          });

          if (onPlanUpdated) {
            onPlanUpdated();
          }
      
          break;
        }

        case 'monthlyContribution': {
          // Criar novo micro plano com a contribuição projetada
          if (!activeMicroPlan) {
            toast({
              title: t('common.error'),
              description: t('dashboard.planProgress.noActiveMicroPlan'),
              variant: 'destructive',
            });
            return;
          }

          // Usar a data do último registro financeiro + 1 mês (dia 1 do mês)
          const effectiveDate = new Date(data.actualDate.getFullYear(), data.actualDate.getMonth() + 1, 1);
          const effectiveDateString = effectiveDate.toISOString().split('T')[0];

          // Verificar se já existe um micro plano nesta data
          const microPlanExists = await MicroInvestmentPlanService.checkMicroPlanExistsByDate(
            investmentPlan.id,
            effectiveDateString
          );

          if (microPlanExists) {
            toast({
              title: t('common.error'),
              description: t('dashboard.planProgress.microPlanExistsError'),
              variant: 'destructive',
            });
            return;
          }

          // Criar novo micro plano com dados do ativo, alterando apenas a contribuição
          const newMicroPlanData = {
            life_investment_plan_id: investmentPlan.id,
            effective_date: effectiveDateString,
            monthly_deposit: Math.max(data.projectedContribution, 0),
            desired_income: activeMicroPlan.desired_income,
            expected_return: activeMicroPlan.expected_return,
            adjust_contribution_for_accumulated_inflation: activeMicroPlan.adjust_contribution_for_accumulated_inflation,
            adjust_income_for_accumulated_inflation: activeMicroPlan.adjust_income_for_accumulated_inflation,
            inflation: activeMicroPlan.inflation,
          };

          await MicroInvestmentPlanService.createMicroPlan(newMicroPlanData);

          // Invalidar queries para atualizar os dados
          queryClient.invalidateQueries({ queryKey: ['microInvestmentPlans', investmentPlan.id] });
          queryClient.invalidateQueries({ queryKey: ['allFinancialRecords', investmentPlan.user_id] });
          queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', investmentPlan.user_id] });
          queryClient.invalidateQueries({ queryKey: ['investmentPlan', investmentPlan.user_id] });
          if (clientId) {
            queryClient.invalidateQueries({ queryKey: ['investmentPlan', clientId] });
          }

          // Atualizar micro planos manualmente
          if (onRefreshMicroPlans) {
            await onRefreshMicroPlans();
          }

          // Atualizar plano
          if (onPlanUpdated) {
            onPlanUpdated();
          }

          toast({
            title: t('common.success'),
            description: t('dashboard.planProgress.contributionOptimized'),
          });
          return;
        }

        case 'monthlyWithdrawal': {
          // Criar novo micro plano com a renda projetada
          if (!activeMicroPlan) {
            toast({
              title: t('common.error'),
              description: t('dashboard.planProgress.noActiveMicroPlan'),
              variant: 'destructive',
            });
            return;
          }

          // Usar a data do último registro financeiro + 1 mês (dia 1 do mês)
          const effectiveDate = new Date(data.actualDate.getFullYear(), data.actualDate.getMonth() + 1, 1);
          const effectiveDateString = effectiveDate.toISOString().split('T')[0];

          // Verificar se já existe um micro plano nesta data
          const microPlanExists = await MicroInvestmentPlanService.checkMicroPlanExistsByDate(
            investmentPlan.id,
            effectiveDateString
          );

          if (microPlanExists) {
            toast({
              title: t('common.error'),
              description: t('dashboard.planProgress.microPlanExistsError'),
              variant: 'destructive',
            });
            return;
          }

          // Criar novo micro plano com dados do ativo, alterando apenas a renda
          const newMicroPlanData = {
            life_investment_plan_id: investmentPlan.id,
            effective_date: effectiveDateString,
            monthly_deposit: activeMicroPlan.monthly_deposit,
            desired_income: Math.max(data.projectedMonthlyIncome, 0),
            expected_return: activeMicroPlan.expected_return,
            adjust_contribution_for_accumulated_inflation: activeMicroPlan.adjust_contribution_for_accumulated_inflation,
            adjust_income_for_accumulated_inflation: activeMicroPlan.adjust_income_for_accumulated_inflation,
            inflation: activeMicroPlan.inflation,
          };

          await MicroInvestmentPlanService.createMicroPlan(newMicroPlanData);

          // Invalidar queries para atualizar os dados
          queryClient.invalidateQueries({ queryKey: ['microInvestmentPlans', investmentPlan.id] });
          queryClient.invalidateQueries({ queryKey: ['allFinancialRecords', investmentPlan.user_id] });
          queryClient.invalidateQueries({ queryKey: ['goalsAndEvents', investmentPlan.user_id] });
          queryClient.invalidateQueries({ queryKey: ['investmentPlan', investmentPlan.user_id] });
          if (clientId) {
            queryClient.invalidateQueries({ queryKey: ['investmentPlan', clientId] });
          }

          // Atualizar micro planos manualmente
          if (onRefreshMicroPlans) {
            await onRefreshMicroPlans();
          }

          // Atualizar plano
          if (onPlanUpdated) {
            onPlanUpdated();
          }

          toast({
            title: t('common.success'),
            description: t('dashboard.planProgress.incomeOptimized'),
          });
          return;
        }

        default:
          return;
      }

      toast({
        title: t('common.success'),
        description: t('dashboard.planProgress.optimizationApplied'),
      });
    } catch (error) {
      console.error(`Error optimizing ${type}:`, error);
      toast({
        title: t('common.error'),
        description: t('dashboard.planProgress.optimizationError'),
        variant: 'destructive',
      });
    }
  };
  
  return (
    <DashboardCard
      title={t('dashboard.planProgress.title')}
      icon={CalculatorIcon}
    >
      {data && investmentPlan && (
        <div className="space-y-6">
          <ComparisonRow
            title={t('dashboard.planProgress.timeToRetirement')}
            planned={data.plannedMonths}
            projected={data.projectedMonths}
            isCurrency={false}
            isHigherBetter={false}
            t={t}
            currency={investmentPlan.currency}
            plannedAgeYears={data.plannedAgeYears}
            plannedAgeMonths={data.plannedAgeMonths}
            projectedAgeYears={data.projectedAgeYears}
            projectedAgeMonths={data.projectedAgeMonths}
            showOptimizerButton={true}
            onOptimizeClick={() => handleOptimizeClick('timeToRetirement')}
            currentValue={data.investmentPlanMonthsToRetirement}
          />

          <div className="space-y-4">
            <ComparisonRow
              title={t('dashboard.planProgress.monthlyContribution')}
              planned={Math.max(data.plannedContribution, 0)}
              projected={Math.max(data.projectedContribution, 0)}
              isCurrency={true}
              isHigherBetter={false}
              t={t}
              currency={investmentPlan.currency}
              showOptimizerButton={true}
              onOptimizeClick={() => handleOptimizeClick('monthlyContribution')}
              currentValue={activeMicroPlan?.monthly_deposit}
            />

            <ComparisonRow
              title={t('dashboard.planProgress.monthlyWithdrawal')}
              planned={data.plannedMonthlyIncome}
              projected={data.projectedMonthlyIncome}
              isCurrency={true}
              isHigherBetter={true}
              t={t}
              currency={investmentPlan.currency}
              showOptimizerButton={true}
              onOptimizeClick={() => handleOptimizeClick('monthlyWithdrawal')}
              currentValue={activeMicroPlan?.desired_income}
            />
          </div>
        </div>
      )}
      
      {/* Modal de Confirmação */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.planProgress.confirmOptimization')}</DialogTitle>
            <DialogDescription>
              {pendingOptimization === 'timeToRetirement' && t('dashboard.planProgress.confirmTimeToRetirement')}
              {pendingOptimization === 'monthlyContribution' && t('dashboard.planProgress.confirmMonthlyContribution')}
              {pendingOptimization === 'monthlyWithdrawal' && t('dashboard.planProgress.confirmMonthlyWithdrawal')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirmOptimization}>
              {t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
};