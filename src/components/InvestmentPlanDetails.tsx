import { Briefcase, Calendar, Clock, DollarSign, Target, TrendingUp, User, Heart, CalendarCheck, PiggyBank, ArrowUpRight, Wallet, Building2, Coins, Scale, ChartLine, CalendarDays, UserCog, HeartPulse, WalletCards, Pencil } from "lucide-react";
import { InvestmentPlan } from "@/types/financial";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { formatCurrency, getCurrencySymbol } from '@/utils/currency';
import { useState } from 'react';
import { EditPlanModal } from './EditPlanModal';
import { Button } from './ui/button';

interface InvestmentPlanDetailsProps {
  investmentPlan: InvestmentPlan | null;
  birthDate: string | null;
  onPlanUpdated?: () => void;
  onEditClick: () => void;
}

interface PlanMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  duration?: string;
}

function PlanMetric({ icon, label, value, color, duration }: PlanMetricProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 py-1">
      <div className={`p-1.5 rounded-lg ${color} bg-opacity-10`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-base font-medium text-gray-900">
          {value}
        </p>
      </div>
      {duration && (
        <div className="text-right">
          <p className="text-sm text-gray-500">{t('dashboard.investmentPlan.duration')}</p>
          <p className="text-base font-medium text-gray-900">
            {duration}
          </p>
        </div>
      )}
    </div>
  );
}

export function InvestmentPlanDetails({ investmentPlan, birthDate, onPlanUpdated, onEditClick }: InvestmentPlanDetailsProps) {
  const { t } = useTranslation();
  
  if (!investmentPlan || !birthDate) {
    return null;
  }

  const calculateDate = (age: number) => {
    const birthDateObj = new Date(birthDate);
    if (!isValid(birthDateObj)) {
      return null;
    }
    const targetDate = new Date(birthDateObj);
    targetDate.setFullYear(birthDateObj.getFullYear() + age);
    return targetDate;
  };

  const calculatePlanDuration = () => {
    const planStartDate = new Date(investmentPlan.plan_initial_date);
    const planEndDate = new Date(investmentPlan.plan_end_accumulation_date);
    
    if (!isValid(planStartDate) || !planEndDate) {
      return 0;
    }

    const months = (planEndDate.getFullYear() - planStartDate.getFullYear()) * 12 + 
                  (planEndDate.getMonth() - planStartDate.getMonth());
    return months;
  };

  const formatDate = (date: Date | null) => {
    if (!date || !isValid(date)) {
      return '';
    }
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  const birthDateObj = new Date(birthDate);
  const currentAge = isValid(birthDateObj) 
    ? new Date().getFullYear() - birthDateObj.getFullYear() 
    : 0;

  const timelineMetrics: PlanMetricProps[] = [
    {
      icon: <UserCog className="h-4 w-4 text-emerald-600" />,
      label: t('dashboard.investmentPlan.currentAge'),
      value: `${currentAge} ${t('dashboard.investmentPlan.years')}`,
      color: "text-emerald-600"
    },
    {
      icon: <CalendarDays className="h-4 w-4 text-blue-600" />,
      label: t('dashboard.investmentPlan.planStart'),
      value: formatDate(new Date(investmentPlan.plan_initial_date)).charAt(0).toUpperCase() + formatDate(new Date(investmentPlan.plan_initial_date)).slice(1),
      color: "text-blue-600",
      duration: `${calculatePlanDuration()} ${t('dashboard.investmentPlan.months')}`
    },
    {
      icon: <CalendarDays className="h-4 w-4 text-blue-600" />,
      label: t('dashboard.investmentPlan.finalAge'),
      value: `${investmentPlan.final_age} ${t('dashboard.investmentPlan.years')} (${formatDate(new Date(investmentPlan.plan_end_accumulation_date))})`,
      color: "text-blue-600"
    },
    {
      icon: <HeartPulse className="h-4 w-4 text-violet-600" />,
      label: t('dashboard.investmentPlan.lifeExpectancy'),
      value: `${investmentPlan.limit_age} ${t('dashboard.investmentPlan.years')} (${formatDate(calculateDate(investmentPlan.limit_age))})`,
      color: "text-violet-600"
    }
  ];

  const financialMetrics: PlanMetricProps[] = [
    {
      icon: <Building2 className="h-4 w-4 text-amber-600" />,
      label: t('dashboard.investmentPlan.initialCapital'),
      value: formatCurrency(investmentPlan.initial_amount, investmentPlan.currency),
      color: "text-amber-600"
    }
  ];

  const monthlyAndWithdrawalMetrics: PlanMetricProps[] = [
    {
      icon: <TrendingUp className="h-4 w-4 text-rose-600" />,
      label: t('dashboard.investmentPlan.monthlyContribution'),
      value: formatCurrency(investmentPlan.monthly_deposit, investmentPlan.currency),
      color: "text-rose-600"
    },
    {
      icon: <WalletCards className="h-4 w-4 text-cyan-600" />,
      label: t('dashboard.investmentPlan.desiredWithdrawal'),
      value: formatCurrency(investmentPlan.desired_income, investmentPlan.currency),
      color: "text-cyan-600"
    }
  ];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          {t('dashboard.investmentPlan.timeline')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditClick}
          className="text-gray-600 hover:text-blue-600"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* Timeline Section */}
      <div className="space-y-3">
        <div className="space-y-2">
          {timelineMetrics.map((metric, index) => (
            <PlanMetric key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Financial Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <ChartLine className="h-4 w-4 text-amber-600" />
          {t('dashboard.investmentPlan.financial')}
        </h3>
        <div className="space-y-2">
          {financialMetrics.map((metric, index) => (
            <PlanMetric key={index} {...metric} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {monthlyAndWithdrawalMetrics.map((metric, index) => (
            <PlanMetric key={index} {...metric} />
          ))}
        </div>
      </div>
    </div>
  );
} 