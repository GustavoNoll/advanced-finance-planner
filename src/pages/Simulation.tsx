import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, ArrowLeft, Settings, Calculator } from "lucide-react";
import { SimulationChart } from "@/components/broker-dashboard/SimulationChart";
import { FutureProjectionTab } from "@/components/monthly-view";
import { InvestmentPlan } from "@/types/financial";
import { formatCurrency, CurrencyCode } from "@/utils/currency";
import { RISK_PROFILES } from '@/constants/riskProfiles';
import CurrencyInput from 'react-currency-input-field';
import { getCurrencySymbol } from "@/utils/currency";
import { usePlanCalculations } from "@/hooks/usePlanCreation";
import { FormData } from "@/utils/investmentPlanCalculations";
import { Switch } from "@/components/ui/switch";

interface SimulationFormData {
  initialAmount: string;
  monthlyDeposit: string;
  desiredIncome: string;
  expectedReturn: string;
  inflation: string;
  planType: string;
  planInitialDate: string;
  birthDate: string;
  finalAge: string;
  currency: string;
  adjustContributionForInflation: boolean;
  adjustIncomeForInflation: boolean;
  hasOldPortfolio: boolean;
  oldPortfolioProfitability: string;
}

// Mock profile for simulation
const mockProfile = {
  id: 'simulation-profile',
  user_id: 'simulation-user',
  name: 'Cliente Simulação',
  email: 'simulacao@example.com',
  birth_date: new Date(new Date().getFullYear() - 35, 0, 1).toISOString().split('T')[0], // 35 anos atrás sempre
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  broker_id: null,
  is_active: true
};

export const Simulation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SimulationFormData>({
    initialAmount: "100000",
    monthlyDeposit: "7000",
    desiredIncome: "7000",
    expectedReturn: RISK_PROFILES.BRL[1].return,
    inflation: "6.0",
    planType: "3",
    planInitialDate: new Date().toISOString().split('T')[0],
    birthDate: new Date(new Date().getFullYear() - 35, 0, 1).toISOString().split('T')[0],
    finalAge: "65",
    currency: "BRL",
    adjustContributionForInflation: false,
    adjustIncomeForInflation: true,
    hasOldPortfolio: false,
    oldPortfolioProfitability: "3",
  });

  const [simulationPlan, setSimulationPlan] = useState<InvestmentPlan | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Convert formData to FormData for calculations
  const calculationFormData: FormData = {
    initialAmount: formData.initialAmount,
    plan_initial_date: new Date().toISOString().split('T')[0],
    finalAge: formData.finalAge,
    planEndAccumulationDate: "",
    monthlyDeposit: formData.monthlyDeposit,
    desiredIncome: formData.desiredIncome,
    expectedReturn: formData.expectedReturn,
    inflation: formData.inflation,
    planType: formData.planType,
    adjustContributionForInflation: formData.adjustContributionForInflation,
    adjustIncomeForInflation: formData.adjustIncomeForInflation,
    limitAge: "100",
    legacyAmount: "1000000",
    currency: formData.currency as CurrencyCode,
    oldPortfolioProfitability: formData.hasOldPortfolio ? formData.oldPortfolioProfitability : null,
    hasOldPortfolio: formData.hasOldPortfolio,
  };

  // Use birth date from form data
  const birthDate = useMemo(() => {
    if (!formData.birthDate) return new Date(mockProfile.birth_date);
    
    return new Date(formData.birthDate);
  }, [formData.birthDate]);

  // Get calculations
  const { calculations } = usePlanCalculations(calculationFormData, birthDate);

  // Generate simulation plan whenever form data changes
  useEffect(() => {
    if (!formData.finalAge || !birthDate) return;

    const finalAge = parseInt(formData.finalAge);
    const planEndDate = new Date(birthDate);
    planEndDate.setFullYear(birthDate.getFullYear() + finalAge);
    planEndDate.setMonth(planEndDate.getMonth() + 1); // Adiciona 1 mês

    const simulationInvestmentPlan: InvestmentPlan = {
      id: 'simulation-' + Date.now(),
      user_id: mockProfile.id,
      initial_amount: parseFloat(formData.initialAmount.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
      plan_initial_date: new Date().toISOString().split('T')[0],
      plan_end_accumulation_date: planEndDate.toISOString().split('T')[0],
      final_age: finalAge,
      monthly_deposit: parseFloat(formData.monthlyDeposit.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
      desired_income: parseFloat(formData.desiredIncome.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
      expected_return: parseFloat(formData.expectedReturn),
      inflation: parseFloat(formData.inflation),
      plan_type: formData.planType,
      adjust_contribution_for_inflation: formData.adjustContributionForInflation,
      adjust_income_for_inflation: formData.adjustIncomeForInflation,
      limit_age: 100,
      legacy_amount: formData.planType === "2" ? 1000000 : undefined,
      currency: formData.currency as CurrencyCode,
      old_portfolio_profitability: formData.hasOldPortfolio ? parseInt(formData.oldPortfolioProfitability) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      future_value: 0,
      present_future_value: 0,
      inflation_adjusted_income: 0,
      required_monthly_deposit: 0,
    };

    setSimulationPlan(simulationInvestmentPlan);
  }, [formData]);

  const handleFormChange = (field: keyof SimulationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const prefix = getCurrencySymbol(formData.currency as CurrencyCode);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/broker-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t('brokerDashboard.simulation.title')}
              </h1>
            </div>
          </div>
          

        </div>

        <div className="space-y-8">
          {/* Form and Calculations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Form Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-500" />
                    {t('brokerDashboard.simulation.planParameters')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.planInitialDate')}</Label>
                      <Input
                        type="date"
                        value={formData.planInitialDate}
                        disabled
                        className="h-10 bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.initialAmount')}</Label>
                      <CurrencyInput
                        value={formData.initialAmount}
                        onValueChange={(value) => handleFormChange('initialAmount', value || '')}
                        placeholder="10000"
                        prefix={prefix}
                        decimalsLimit={2}
                        decimalSeparator=","
                        groupSeparator="."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.monthlyDeposit')}</Label>
                      <CurrencyInput
                        value={formData.monthlyDeposit}
                        onValueChange={(value) => handleFormChange('monthlyDeposit', value || '')}
                        placeholder="1000"
                        prefix={prefix}
                        decimalsLimit={2}
                        decimalSeparator=","
                        groupSeparator="."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.desiredIncome')}</Label>
                      <CurrencyInput
                        value={formData.desiredIncome}
                        onValueChange={(value) => handleFormChange('desiredIncome', value || '')}
                        placeholder="5000"
                        prefix={prefix}
                        decimalsLimit={2}
                        decimalSeparator=","
                        groupSeparator="."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.birthDate')}</Label>
                      <Input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleFormChange('birthDate', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.finalAge')}</Label>
                      <Input
                        type="number"
                        value={formData.finalAge}
                        onChange={(e) => handleFormChange('finalAge', e.target.value)}
                        placeholder="65"
                        min="18"
                        max="120"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.riskProfile')}</Label>
                      <Select value={formData.expectedReturn} onValueChange={(value) => handleFormChange('expectedReturn', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RISK_PROFILES[formData.currency as keyof typeof RISK_PROFILES]?.map((profile) => (
                            <SelectItem key={profile.value} value={profile.return}>
                              {profile.label} ({formData.currency === 'BRL' ? 'IPCA' : 'CPI'}+{profile.return}%)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.inflationRate')}</Label>
                      <Input
                        type="number"
                        value={formData.inflation}
                        onChange={(e) => handleFormChange('inflation', e.target.value)}
                        placeholder="6.0"
                        step="0.1"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.planType')}</Label>
                      <Select value={formData.planType} onValueChange={(value) => handleFormChange('planType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">{t('investmentPlan.planTypes.endAt120')}</SelectItem>
                          <SelectItem value="2">{t('investmentPlan.planTypes.leave1M')}</SelectItem>
                          <SelectItem value="3">{t('investmentPlan.planTypes.keepPrincipal')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.currency')}</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleFormChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRL">{t('investmentPlan.form.currencies.BRL')}</SelectItem>
                          <SelectItem value="USD">{t('investmentPlan.form.currencies.USD')}</SelectItem>
                          <SelectItem value="EUR">{t('investmentPlan.form.currencies.EUR')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Old Portfolio Section */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hasOldPortfolio"
                          checked={formData.hasOldPortfolio}
                          onCheckedChange={(checked) => {
                            handleFormChange('hasOldPortfolio', checked);
                          }}
                        />
                        <Label htmlFor="hasOldPortfolio">{t('investmentPlan.form.hasOldPortfolio')}</Label>
                      </div>
                      {formData.hasOldPortfolio && (
                        <div className="mt-2">
                          <Label>{t('investmentPlan.form.oldPortfolioProfitability')}</Label>
                          <Select value={formData.oldPortfolioProfitability} onValueChange={(value) => handleFormChange('oldPortfolioProfitability', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 0%</SelectItem>
                              <SelectItem value="1">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 1%</SelectItem>
                              <SelectItem value="2">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 2%</SelectItem>
                              <SelectItem value="3">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 3%</SelectItem>
                              <SelectItem value="4">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 4%</SelectItem>
                              <SelectItem value="5">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 5%</SelectItem>
                              <SelectItem value="6">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 6%</SelectItem>
                              <SelectItem value="7">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 7%</SelectItem>
                              <SelectItem value="8">{formData.currency === 'BRL' ? 'IPCA' : 'CPI'} + 8%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>


                </CardContent>
              </Card>
            </div>

            {/* Right Column - Calculations */}
            <div className="space-y-6">
              {/* Calculations Section */}
              <div className="p-4 bg-muted rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  {t('investmentPlan.create.calculations.title')}
                </h3>
                {calculations ? (
                  <div className="space-y-4">
                    <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.inflationAdjustedIncome')}:</span>
                      </div>
                      <span className="font-medium">{formatCurrency(calculations.inflationAdjustedIncome, formData.currency as CurrencyCode)}/mês</span>
                    </div>
                    
                    <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.requiredFutureValue')}:</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(calculations.futureValue, formData.currency as CurrencyCode)}
                      </span>
                    </div>

                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                      <div 
                        className="flex justify-between p-3 cursor-pointer hover:bg-accent"
                        onClick={() => setExpandedRow(expandedRow === 'return' ? null : 'return')}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.totalMonthlyReturn')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations.totalMonthlyReturn, formData.currency as CurrencyCode)}</span>
                      </div>
                      {expandedRow === 'return' && (
                        <div className="px-3 pb-3 space-y-2 border-t border-border">
                          <div className="flex justify-between pt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.monthlyRealReturn')}:</span>
                            </div>
                            <span className="font-medium">{formatCurrency(calculations.realReturn, formData.currency as CurrencyCode)}</span>
                          </div>
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.monthlyInflationReturn')}:</span>
                            </div>
                            <span className="font-medium">{formatCurrency(calculations.inflationReturn, formData.currency as CurrencyCode)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.requiredMonthlyDeposit')}:</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(calculations.requiredMonthlyDeposit, formData.currency as CurrencyCode)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    {t('investmentPlan.create.calculations.fillRequired')}
                  </div>
                )}
              </div>



              {/* Simulation Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      {t('brokerDashboard.simulation.simulationNotice.title')}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t('brokerDashboard.simulation.simulationNotice.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section - Full Width Below */}
          {simulationPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  {t('brokerDashboard.simulation.projectionChart')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimulationChart
                  profile={{...mockProfile, birth_date: birthDate.toISOString().split('T')[0]}}
                  investmentPlan={simulationPlan}
                  clientId={mockProfile.id}
                  allFinancialRecords={[]}
                  formData={formData}
                  onFormDataChange={handleFormChange}
                />
              </CardContent>
            </Card>
          )}

          {/* Projection Table Section */}
          {simulationPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  {t('brokerDashboard.simulation.projectionTable')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FutureProjectionTab
                  investmentPlan={simulationPlan}
                  profile={{...mockProfile, birth_date: birthDate.toISOString().split('T')[0]}}
                  allFinancialRecords={[]}
                  showGoalsEvents={false}
                  showRealEvolution={false}
                  isSimulation={true}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
