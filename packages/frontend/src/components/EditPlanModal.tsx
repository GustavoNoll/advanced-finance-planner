import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { X, Lock, Calendar, Settings } from "lucide-react";
import { 
  calculateFutureValues, 
  isCalculationReady, 
  type FormData,
  type Calculations as InvestmentCalculations
} from '@/utils/investmentPlanCalculations';
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "@/components/ui/currency-input";
import { CurrencyCode } from "@/utils/currency";
import { InvestmentPlan, MicroInvestmentPlan, FinancialRecord } from "@/types/financial";
import { calculateAge, calculateEndDate, calculateFinalAge } from '@/utils/dateUtils';
import { handleAgeDateSync, handleFormChange, type Currency } from '@/utils/formUtils';
import { RISK_PROFILES } from '@/constants/riskProfiles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditPlanModalProps {
  investmentPlan: InvestmentPlan;
  activeMicroPlan: MicroInvestmentPlan | null;
  microPlans: MicroInvestmentPlan[];
  birthDate: string;
  financialRecords?: FinancialRecord[];
  onClose: () => void;
  onSuccess: () => void;
  onRefreshMicroPlans: () => void;
}

export function EditPlanModal({ 
  investmentPlan, 
  activeMicroPlan, 
  microPlans, 
  birthDate, 
  financialRecords = [], 
  onClose, 
  onSuccess, 
  onRefreshMicroPlans 
}: EditPlanModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Ordenação e seleção de micro planos
  const sortedMicroPlans = [...microPlans].sort((a, b) => 
    new Date(a.effective_date).getTime() - new Date(b.effective_date).getTime()
  );
  const [selectedMicroPlanId, setSelectedMicroPlanId] = useState<string | null>(activeMicroPlan?.id || sortedMicroPlans[0]?.id || null);
  const selectedMicroPlan = selectedMicroPlanId
    ? sortedMicroPlans.find(mp => mp.id === selectedMicroPlanId) || null
    : null;
  
  // Verificar se existem registros financeiros para bloquear a edição do valor inicial
  const hasFinancialRecords = financialRecords.length > 0;
  
  // Form data for investment plan (basic plan information)
  const [investmentPlanFormData, setInvestmentPlanFormData] = useState({
    initialAmount: investmentPlan.initial_amount.toString(),
    plan_initial_date: new Date(investmentPlan.plan_initial_date).toISOString().split('T')[0],
    finalAge: investmentPlan.final_age.toString(),
    planEndAccumulationDate: investmentPlan.plan_end_accumulation_date
      ? new Date(investmentPlan.plan_end_accumulation_date).toISOString().split('T')[0]
      : (() => {
          const birth = new Date(birthDate);
          const finalAge = parseInt(investmentPlan.final_age.toString());
          birth.setFullYear(birth.getFullYear() + finalAge);
          // Round up to next month if not first day
          if (birth.getDate() > 1) {
            birth.setMonth(birth.getMonth() + 1);
          }
          birth.setDate(1); // Always use first day of month
          return birth.toISOString().split('T')[0];
        })(),
    planType: investmentPlan.plan_type,
    adjustContributionForInflation: investmentPlan.adjust_contribution_for_inflation,
    adjustIncomeForInflation: investmentPlan.adjust_income_for_inflation,
    limitAge: investmentPlan.limit_age?.toString() || "85",
    legacyAmount: investmentPlan.legacy_amount?.toString() || "1000000",
    currency: investmentPlan.currency || "BRL",
    oldPortfolioProfitability: investmentPlan.old_portfolio_profitability?.toString() || null,
    hasOldPortfolio: investmentPlan.old_portfolio_profitability !== null,
  });

  // Form data for active micro plan
  const [microPlanFormData, setMicroPlanFormData] = useState({
    monthlyDeposit: selectedMicroPlan?.monthly_deposit.toString() || '',
    desiredIncome: selectedMicroPlan?.desired_income.toString() || '',
    expectedReturn: selectedMicroPlan?.expected_return.toFixed(1) || '',
    inflation: selectedMicroPlan?.inflation.toString() || '',
    effectiveDate: selectedMicroPlan?.effective_date || '',
    adjustContributionForAccumulatedInflation: selectedMicroPlan?.adjust_contribution_for_accumulated_inflation ?? true,
    adjustIncomeForAccumulatedInflation: selectedMicroPlan?.adjust_income_for_accumulated_inflation ?? true,
  });

  // Atualizar o formulário quando o micro plano selecionado mudar
  useEffect(() => {
    setMicroPlanFormData({
      monthlyDeposit: selectedMicroPlan?.monthly_deposit?.toString() || '',
      desiredIncome: selectedMicroPlan?.desired_income?.toString() || '',
      expectedReturn: selectedMicroPlan?.expected_return !== undefined ? selectedMicroPlan.expected_return.toFixed(1) : '',
      inflation: selectedMicroPlan?.inflation?.toString() || '',
      effectiveDate: selectedMicroPlan?.effective_date || '',
      adjustContributionForAccumulatedInflation: selectedMicroPlan?.adjust_contribution_for_accumulated_inflation ?? true,
      adjustIncomeForAccumulatedInflation: selectedMicroPlan?.adjust_income_for_accumulated_inflation ?? true,
    })
  }, [selectedMicroPlan])

  const [calculations, setCalculations] = useState<InvestmentCalculations | null>(null);
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [updateSource, setUpdateSource] = useState<'age' | 'date' | null>(null);

  useEffect(() => {
    // Create combined form data for calculations
    const combinedFormData = {
      ...investmentPlanFormData,
      ...microPlanFormData,
    };
    
    if (isCalculationReady(combinedFormData) && birthDate) {
      setCalculations(calculateFutureValues(combinedFormData, new Date(birthDate)));
    }
  }, [investmentPlanFormData, microPlanFormData, birthDate]);

  // Helper to get current age
  const getCurrentAge = () => {
    return calculateAge(new Date(birthDate), new Date(investmentPlanFormData.plan_initial_date));
  };

  // Sync age <-> date
  useEffect(() => {
    if (!birthDate || isSyncing) return;
    if (updateSource === 'age') {
      setIsSyncing(true);
      const result = handleAgeDateSync('finalAge', investmentPlanFormData.finalAge || '', new Date(birthDate), isSyncing, updateSource);
      if (result) {
        setInvestmentPlanFormData(prev => ({ ...prev, ...result }));
      }
      setTimeout(() => {
        setIsSyncing(false);
        setUpdateSource(null);
      }, 0);
    } else if (updateSource === 'date') {
      setIsSyncing(true);
      const result = handleAgeDateSync('planEndAccumulationDate', investmentPlanFormData.planEndAccumulationDate || '', new Date(birthDate), isSyncing, updateSource);
      if (result) {
        setInvestmentPlanFormData(prev => ({ ...prev, ...result }));
      }
      setTimeout(() => {
        setIsSyncing(false);
        setUpdateSource(null);
      }, 0);
    }
  }, [investmentPlanFormData.finalAge, investmentPlanFormData.planEndAccumulationDate, birthDate, updateSource, isSyncing]);

  // Handler for age/date change
  function handleAgeDateChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (!birthDate || isSyncing) return;

    const result = handleAgeDateSync(name, value, new Date(birthDate), isSyncing, updateSource);
    if (result) {
      setUpdateSource(name === 'finalAge' ? 'age' : 'date');
      setInvestmentPlanFormData(prev => ({ ...prev, ...result }));
    }
  }

  // Handler for investment plan form changes
  const handleInvestmentPlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const newFormData = handleFormChange(name, value, checked, investmentPlanFormData.currency as Currency, RISK_PROFILES);
    setInvestmentPlanFormData(prev => ({ ...prev, ...newFormData }));
  };

  // Handler for micro plan form changes
  const handleMicroPlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMicroPlanFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for investment plan submission
  const handleInvestmentPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adjustedEndDate = new Date(investmentPlanFormData.planEndAccumulationDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      
      const { error } = await supabase
        .from("investment_plans")
        .update({
          initial_amount: parseFloat(investmentPlanFormData.initialAmount.replace(',', '.')),
          final_age: parseInt(investmentPlanFormData.finalAge),
          plan_end_accumulation_date: adjustedEndDate.toISOString().split('T')[0],
          plan_type: investmentPlanFormData.planType,
          adjust_contribution_for_inflation: investmentPlanFormData.adjustContributionForInflation,
          adjust_income_for_inflation: investmentPlanFormData.adjustIncomeForInflation,
          limit_age: parseInt(investmentPlanFormData.limitAge),
          legacy_amount: parseFloat(investmentPlanFormData.legacyAmount.replace(',', '.')),
          currency: investmentPlanFormData.currency,
          old_portfolio_profitability: investmentPlanFormData.hasOldPortfolio 
            ? parseFloat(investmentPlanFormData.oldPortfolioProfitability?.replace(',', '.') || '0')
            : null,
        })
        .eq('id', investmentPlan.id);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('investmentPlan.edit.success'),
      });

      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler for micro plan submission
  const handleMicroPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedMicroPlan) {
        throw new Error('No micro plan selected');
      }

      const { error } = await supabase
        .from("micro_investment_plans")
        .update({
          monthly_deposit: parseFloat(microPlanFormData.monthlyDeposit.replace(',', '.')),
          desired_income: parseFloat(microPlanFormData.desiredIncome.replace(',', '.')),
          expected_return: parseFloat(microPlanFormData.expectedReturn.replace(',', '.')),
          inflation: parseFloat(microPlanFormData.inflation.replace(',', '.')),
          adjust_contribution_for_accumulated_inflation: microPlanFormData.adjustContributionForAccumulatedInflation,
          adjust_income_for_accumulated_inflation: microPlanFormData.adjustIncomeForAccumulatedInflation,
        })
        .eq('id', selectedMicroPlan.id);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('investmentPlan.edit.microPlanSuccess'),
      });

      onRefreshMicroPlans();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        <Card className="w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50/95 to-blue-50/90 dark:from-slate-900 dark:via-slate-900/80 dark:to-blue-950/20 border border-blue-100/50 dark:border-slate-800 shadow-2xl rounded-xl">
          <CardHeader className="sticky top-0 z-[99999] border-b bg-gradient-to-r from-white/80 via-slate-50/80 to-blue-50/80 dark:from-slate-900/80 dark:via-slate-900/80 dark:to-blue-950/20 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('investmentPlan.edit.title')}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100/50 dark:hover:bg-slate-800/60"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6">
            <Tabs defaultValue="investment-plan" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="investment-plan" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {t('investmentPlan.edit.investmentPlan')}
                </TabsTrigger>
                <TabsTrigger value="micro-plan" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('investmentPlan.edit.microPlan')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="investment-plan" className="mt-6">
                <form onSubmit={handleInvestmentPlanSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('investmentPlan.form.planType')}
                  </label>
                  <select
                    name="planType"
                    value={investmentPlanFormData.planType}
                    onChange={handleInvestmentPlanChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="1">{t('investmentPlan.planTypes.endAt120')}</option>
                    <option value="2">{t('investmentPlan.planTypes.leave1M')}</option>
                    <option value="3">{t('investmentPlan.planTypes.keepPrincipal')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    {t('investmentPlan.form.initialAmount')}
                    {hasFinancialRecords && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </label>
                  <CurrencyInput
                    id="initialAmount"
                    defaultValue={investmentPlanFormData.initialAmount}
                    onValueChange={(value) => {
                      setInvestmentPlanFormData(prev => ({
                        ...prev,
                        initialAmount: value || ''
                      }))
                    }}
                    placeholder="1000"
                    currency={investmentPlanFormData.currency as CurrencyCode}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    disabled={hasFinancialRecords}
                  />
                  {hasFinancialRecords && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      {t('investmentPlan.form.initialAmountLockedMessage')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('investmentPlan.form.finalAge')}
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="finalAge"
                      value={investmentPlanFormData.finalAge}
                      onChange={handleAgeDateChange}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">{t('investmentPlan.form.selectAge')}</option>
                      {(() => {
                        const currentAge = getCurrentAge();
                        return Array.from({ length: 121 - currentAge }, (_, i) => {
                          const age = currentAge + i;
                          return (
                            <option key={age} value={age}>
                              {age} {t('investmentPlan.form.years')}
                            </option>
                          );
                        });
                      })()}
                    </select>
                    <div className="flex gap-2">
                      <select
                        name="month"
                        value={new Date(investmentPlanFormData.planEndAccumulationDate).getMonth()}
                        onChange={(e) => {
                          const newDate = new Date(investmentPlanFormData.planEndAccumulationDate);
                          newDate.setMonth(parseInt(e.target.value));
                          handleAgeDateChange({
                            target: {
                              name: 'planEndAccumulationDate',
                              value: newDate.toISOString().split('T')[0]
                            }
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        className="h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="0">{t('date.months.january')}</option>
                        <option value="1">{t('date.months.february')}</option>
                        <option value="2">{t('date.months.march')}</option>
                        <option value="3">{t('date.months.april')}</option>
                        <option value="4">{t('date.months.may')}</option>
                        <option value="5">{t('date.months.june')}</option>
                        <option value="6">{t('date.months.july')}</option>
                        <option value="7">{t('date.months.august')}</option>
                        <option value="8">{t('date.months.september')}</option>
                        <option value="9">{t('date.months.october')}</option>
                        <option value="10">{t('date.months.november')}</option>
                        <option value="11">{t('date.months.december')}</option>
                      </select>
                      <select
                        name="year"
                        value={new Date(investmentPlanFormData.planEndAccumulationDate).getFullYear()}
                        onChange={(e) => {
                          const newDate = new Date(investmentPlanFormData.planEndAccumulationDate);
                          newDate.setFullYear(parseInt(e.target.value));
                          handleAgeDateChange({
                            target: {
                              name: 'planEndAccumulationDate',
                              value: newDate.toISOString().split('T')[0]
                            }
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        className="h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {(() => {
                          const currentYear = new Date().getFullYear();
                          const years = [];
                          for (let i = currentYear; i <= currentYear + 100; i++) {
                            years.push(
                              <option key={i} value={i}>
                                {i}
                              </option>
                            );
                          }
                          return years;
                        })()}
                      </select>
                    </div>
                  </div>
                </div>


                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('investmentPlan.form.lifeExpectancy')}
                  </label>
                  <Input
                    type="number"
                    name="limitAge"
                    value={investmentPlanFormData.limitAge}
                    onChange={handleInvestmentPlanChange}
                    placeholder="85"
                    min="60"
                    max="120"
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="hasOldPortfolio"
                      checked={investmentPlanFormData.hasOldPortfolio}
                      onCheckedChange={(checked) => {
                        setInvestmentPlanFormData(prev => ({
                          ...prev,
                          hasOldPortfolio: checked as boolean,
                          oldPortfolioProfitability: checked ? prev.oldPortfolioProfitability : null
                        }))
                      }}
                    />
                    <label htmlFor="hasOldPortfolio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('investmentPlan.form.hasOldPortfolio')}
                    </label>
                  </div>
                  {investmentPlanFormData.hasOldPortfolio && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('investmentPlan.form.oldPortfolioProfitability')}
                      </label>
                      <select
                        name="oldPortfolioProfitability"
                        value={investmentPlanFormData.oldPortfolioProfitability || ""}
                        onChange={(e) => {
                          setInvestmentPlanFormData(prev => ({
                            ...prev,
                            oldPortfolioProfitability: e.target.value || null
                          }))
                        }}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required={investmentPlanFormData.hasOldPortfolio}
                      >
                        <option value="">{t('investmentPlan.form.selectProfitability')}</option>
                        <option value="0">{investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 0%</option>
                        <option value="1">{investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 1%</option>
                        <option value="2">{investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 2%</option>
                        <option value="3">{investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 3%</option>
                        <option value="4">{investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 4%</option>
                        <option value="5">{investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 5%</option>
                        <option value="6">{investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 6%</option>
                        <option value="7">{investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 7%</option>
                        <option value="8">{investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 8%</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {investmentPlanFormData.planType !== "3" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {investmentPlanFormData.planType === "1" 
                      ? t('investmentPlan.form.endAge') 
                      : t('investmentPlan.form.legacyAge')}
                  </label>
                  <Input
                    type="number"
                    name="limitAge"
                    value={investmentPlanFormData.limitAge}
                    onChange={handleInvestmentPlanChange}
                    placeholder={investmentPlanFormData.planType === "1" ? "120" : "85"}
                    required
                    min={parseInt(investmentPlanFormData.finalAge)}
                    max="120"
                    step="1"
                    className="h-10"
                    onKeyDown={(e) => {
                      if (e.key === "." || e.key === ",") {
                        e.preventDefault()
                      }
                    }}
                  />
                </div>
              )}

              {investmentPlanFormData.planType === "2" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('investmentPlan.form.legacyAmount')}
                  </label>
                  <CurrencyInput
                    id="legacyAmount"
                    defaultValue={investmentPlanFormData.legacyAmount}
                    onValueChange={(value) => {
                      setInvestmentPlanFormData(prev => ({
                        ...prev,
                        legacyAmount: value || ''
                      }))
                    }}
                    placeholder="1000000"
                    currency={investmentPlanFormData.currency as CurrencyCode}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('investmentPlan.form.advancedSettings')}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('investmentPlan.form.currency')}
                    </label>
                    <select
                      name="currency"
                      value={investmentPlanFormData.currency}
                      onChange={handleInvestmentPlanChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="BRL">{t('investmentPlan.form.currencies.BRL')}</option>
                      <option value="USD">{t('investmentPlan.form.currencies.USD')}</option>
                      <option value="EUR">{t('investmentPlan.form.currencies.EUR')}</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="adjust_contribution_for_inflation"
                      checked={investmentPlanFormData.adjustContributionForInflation}
                      onCheckedChange={(checked) => {
                        setInvestmentPlanFormData(prev => ({
                          ...prev,
                          adjustContributionForInflation: checked as boolean
                        }))
                      }}
                    />
                    <label htmlFor="adjust_contribution_for_inflation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('investmentPlan.form.adjustContributionForInflation')}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="adjust_income_for_inflation"
                      checked={investmentPlanFormData.adjustIncomeForInflation}
                      onCheckedChange={(checked) => {
                        setInvestmentPlanFormData(prev => ({
                          ...prev,
                          adjustIncomeForInflation: checked as boolean
                        }))
                      }}
                    />
                    <label htmlFor="adjust_income_for_inflation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('investmentPlan.form.adjustIncomeForInflation')}
                    </label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-500" 
                disabled={loading}
              >
                {loading ? t('common.saving') : t('common.save')}
              </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="micro-plan" className="mt-6">
                {sortedMicroPlans.length > 0 ? (
                  <form onSubmit={handleMicroPlanSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('investmentPlan.edit.selectMicroPlan')}
                        </label>
                        <Select
                          value={selectedMicroPlanId || ''}
                          onValueChange={(value) => setSelectedMicroPlanId(value)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={t('investmentPlan.edit.selectMicroPlan')} />
                          </SelectTrigger>
                          <SelectContent>
                            {sortedMicroPlans.map((mp, i) => {
                              const date = new Date(mp.effective_date)
                              const label = `#${i + 1} - ${date.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })}${activeMicroPlan?.id === mp.id ? ' - ' + t('investmentPlan.microPlans.active') : ''}`
                              return (
                                <SelectItem key={mp.id} value={mp.id}>
                                  {label}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          {t('investmentPlan.form.effectiveDate')}
                          {(() => {
                            const idx = selectedMicroPlan ? sortedMicroPlans.findIndex(p => p.id === selectedMicroPlan.id) : -1;
                            return idx >= 0 ? (
                              <Badge variant="outline" className="text-xs">#{idx + 1}</Badge>
                            ) : null;
                          })()}
                        </label>
                        <Input
                          type="date"
                          name="effectiveDate"
                          value={microPlanFormData.effectiveDate}
                          onChange={handleMicroPlanChange}
                          disabled
                          className="h-10 bg-gray-50 dark:bg-gray-800"
                        />
                        <p className="text-xs text-muted-foreground">
                          {t('investmentPlan.form.effectiveDateLockedMessage')}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('investmentPlan.form.monthlyDeposit')}
                        </label>
                        <CurrencyInput
                          id="monthlyDeposit"
                          defaultValue={microPlanFormData.monthlyDeposit}
                          onValueChange={(value) => {
                            setMicroPlanFormData(prev => ({
                              ...prev,
                              monthlyDeposit: value || ''
                            }))
                          }}
                          placeholder="1000"
                          currency={investmentPlanFormData.currency as CurrencyCode}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('investmentPlan.form.desiredIncome')}
                        </label>
                        <CurrencyInput
                          id="desiredIncome"
                          defaultValue={microPlanFormData.desiredIncome}
                          onValueChange={(value) => {
                            setMicroPlanFormData(prev => ({
                              ...prev,
                              desiredIncome: value || ''
                            }))
                          }}
                          placeholder="5000"
                          currency={investmentPlanFormData.currency as CurrencyCode}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('investmentPlan.form.expectedReturn')}
                        </label>
                        <Select
                          value={microPlanFormData.expectedReturn}
                          onValueChange={(value) => {
                            setMicroPlanFormData(prev => ({
                              ...prev,
                              expectedReturn: value
                            }))
                          }}
                          required
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={t('investmentPlan.microPlans.form.selectExpectedReturn')} />
                          </SelectTrigger>
                          <SelectContent>
                            {RISK_PROFILES[investmentPlanFormData.currency].map((profile) => (
                              <SelectItem key={profile.value} value={profile.return}>
                                {profile.label} ({investmentPlanFormData.currency === 'BRL' ? 'IPCA' : 'CPI'}+{profile.return}%)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('investmentPlan.form.inflation')}
                        </label>
                        <Input
                          type="number"
                          name="inflation"
                          value={microPlanFormData.inflation}
                          onChange={handleMicroPlanChange}
                          placeholder="6"
                          step="1"
                          min="0"
                          max="20"
                          required
                          className="h-10"
                        />
                      </div>
                    </div>

                    {sortedMicroPlans.length > 1 && selectedMicroPlan && (() => {
                      // Encontrar o micro plano mais antigo (base)
                      const baseMicroPlan = sortedMicroPlans[0];
                      
                      // Mostrar campos apenas se o micro plano atual não for o base
                      return selectedMicroPlan.id !== baseMicroPlan.id;
                    })() && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="adjust_contribution_for_accumulated_inflation"
                            checked={microPlanFormData.adjustContributionForAccumulatedInflation}
                            onCheckedChange={(checked) => {
                              setMicroPlanFormData(prev => ({
                                ...prev,
                                adjustContributionForAccumulatedInflation: checked as boolean
                              }))
                            }}
                          />
                          <label htmlFor="adjust_contribution_for_accumulated_inflation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('investmentPlan.microPlans.form.adjustContributionForAccumulatedInflation')}
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="adjust_income_for_accumulated_inflation"
                            checked={microPlanFormData.adjustIncomeForAccumulatedInflation}
                            onCheckedChange={(checked) => {
                              setMicroPlanFormData(prev => ({
                                ...prev,
                                adjustIncomeForAccumulatedInflation: checked as boolean
                              }))
                            }}
                          />
                          <label htmlFor="adjust_income_for_accumulated_inflation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('investmentPlan.microPlans.form.adjustIncomeForAccumulatedInflation')}
                          </label>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 dark:bg-green-600 dark:hover:bg-green-500" 
                      disabled={loading}
                    >
                      {loading ? t('common.saving') : t('investmentPlan.edit.saveMicroPlan')}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {t('investmentPlan.edit.noActiveMicroPlan')}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 