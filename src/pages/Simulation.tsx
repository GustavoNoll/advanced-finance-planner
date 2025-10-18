import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, ArrowLeft, Settings, Calculator, Plus } from "lucide-react";
import { SimulationChart } from "@/components/broker-dashboard/SimulationChart";
import { FutureProjectionTab } from "@/components/monthly-view";
import { InvestmentPlan, MicroInvestmentPlan } from "@/types/financial";
import { formatCurrency, CurrencyCode } from "@/utils/currency";
import { RISK_PROFILES } from '@/constants/riskProfiles';
import CurrencyInput from 'react-currency-input-field';
import { getCurrencySymbol } from "@/utils/currency";
import { usePlanCalculations, usePlanCreation } from "@/hooks/usePlanCreation";
import { FormData } from "@/utils/investmentPlanCalculations";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { generateChartProjections, generateProjectionData, ChartOptions } from '@/lib/chart-projections';
import { useProfileData } from "@/hooks/usePlanCreation";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

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

export const Simulation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Get client ID from URL params
  const clientId = searchParams.get('client_id');

  // Mock profile for simulation using i18n
  const mockProfile = useMemo(() => ({
    id: 'simulation-profile',
    user_id: 'simulation-user',
    name: t('landingPage.mocks.profile.simulationName'),
    email: 'simulacao@example.com',
    birth_date: new Date(new Date().getFullYear() - 35, 0, 1).toISOString().split('T')[0], // 35 anos atrás sempre
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    broker_id: null,
    is_active: true
  }), [t]);

  const [formData, setFormData] = useState<SimulationFormData>({
    initialAmount: "100000",
    monthlyDeposit: "7000",
    desiredIncome: "7000",
    expectedReturn: RISK_PROFILES.BRL[1].return,
    inflation: "6",
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
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);

  // Hooks para dados do cliente e criação de plano
  const { profileData } = useProfileData(clientId || '');
  const { createPlan } = usePlanCreation();

  // Chart options state
  const [showRealValues, setShowRealValues] = useState(false);
  const [showNegativeValues, setShowNegativeValues] = useState(false);
  const [showOldPortfolio, setShowOldPortfolio] = useState(false);
  const [showProjectedLine, setShowProjectedLine] = useState(true);

  // Auto-activate showOldPortfolio when hasOldPortfolio is enabled
  useEffect(() => {
    if (formData.hasOldPortfolio && !showOldPortfolio) {
      setShowOldPortfolio(true);
    }
  }, [formData.hasOldPortfolio, showOldPortfolio]);

  // Load client data when available
  useEffect(() => {
    if (clientId && profileData?.birth_date) {
      const birthDate = new Date(profileData.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setFormData(prev => ({
        ...prev,
        birthDate: profileData.birth_date,
        planInitialDate: today.toISOString().split('T')[0],
        finalAge: (age + 30).toString(),
      }));
    }
  }, [clientId, profileData]);

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
      plan_type: formData.planType,
      adjust_contribution_for_inflation: formData.adjustContributionForInflation,
      adjust_income_for_inflation: formData.adjustIncomeForInflation,
      limit_age: 100,
      legacy_amount: formData.planType === "2" ? 1000000 : undefined,
      currency: formData.currency as CurrencyCode,
      old_portfolio_profitability: formData.hasOldPortfolio ? parseInt(formData.oldPortfolioProfitability) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
    };

    setSimulationPlan(simulationInvestmentPlan);
  }, [formData, birthDate]);

  // Generate chart options
  const chartOptions: ChartOptions = useMemo(() => ({
    showRealValues,
    showNegativeValues,
    showOldPortfolio,
    showProjectedLine,
    showPlannedLine: false // Always false in simulation since there's no real data
  }), [showRealValues, showNegativeValues, showOldPortfolio, showProjectedLine]);

  // Generate raw chart data and projection data
  const { rawChartData, projectionData } = useMemo(() => {
    if (!simulationPlan || !birthDate) {
      return { rawChartData: [], projectionData: [] };
    }

    const profile = { ...mockProfile, birth_date: birthDate.toISOString().split('T')[0] };
    
    // Create a simulated micro plan with the form values
    const simulatedMicroPlan: MicroInvestmentPlan = {
      id: 'simulation-micro-' + Date.now(),
      life_investment_plan_id: simulationPlan.id,
      effective_date: simulationPlan.plan_initial_date,
      monthly_deposit: parseFloat(formData.monthlyDeposit.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
      desired_income: parseFloat(formData.desiredIncome.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
      expected_return: parseFloat(formData.expectedReturn),
      inflation: parseFloat(formData.inflation),
      adjust_contribution_for_accumulated_inflation: false,
      adjust_income_for_accumulated_inflation: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    
    // Generate chart data for the chart component
    const chartData = generateChartProjections(
      profile,
      simulationPlan,
      [], // No financial records in simulation
      [], // No goals in simulation
      [], // No events in simulation
      chartOptions,
      [simulatedMicroPlan] // Pass the simulated micro plan
    );

    // Generate projection data for the table component
    const tableData = generateProjectionData(
      simulationPlan,
      profile,
      [], // No financial records in simulation
      [simulatedMicroPlan], // Pass the simulated micro plan
      [], // No goals in simulation
      [], // No events in simulation
      chartOptions
    );

    return {
      rawChartData: chartData,
      projectionData: tableData
    };
  }, [simulationPlan, birthDate, chartOptions, formData.monthlyDeposit, formData.desiredIncome, formData.expectedReturn, formData.inflation]);

  const handleFormChange = (field: keyof SimulationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreatePlanFromSimulation = async () => {
    if (!clientId || !birthDate) {
      toast({
        title: t('common.error'),
        description: t('brokerDashboard.planCreation.errors.missingClientData'),
        variant: "destructive",
      });
      return;
    }

    setIsCreatingPlan(true);
    try {
      const finalAge = parseInt(formData.finalAge);
      const planEndDate = new Date(birthDate);
      planEndDate.setFullYear(birthDate.getFullYear() + finalAge);
      planEndDate.setMonth(planEndDate.getMonth() + 1); // Adiciona 1 mês
      const planData = {
        user_id: clientId,
        initial_amount: parseFloat(formData.initialAmount.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
        plan_initial_date: formData.planInitialDate,
        plan_end_accumulation_date: planEndDate.toISOString().split('T')[0],
        final_age: parseInt(formData.finalAge),
        plan_type: formData.planType,
        limit_age: 100,
        legacy_amount: formData.planType === "2" ? 1000000 : undefined,
        currency: formData.currency,
        adjust_contribution_for_inflation: formData.adjustContributionForInflation,
        adjust_income_for_inflation: formData.adjustIncomeForInflation,
        old_portfolio_profitability: formData.hasOldPortfolio ? parseInt(formData.oldPortfolioProfitability) : null,
      };

      const newPlan = await createPlan.mutateAsync(planData);
      
      // Criar o primeiro micro plano com os dados da simulação
      if (newPlan) {
        const microPlanData = {
          life_investment_plan_id: newPlan.id,
          effective_date: formData.planInitialDate, // Deve ser igual ao plan_initial_date
          monthly_deposit: parseFloat(formData.monthlyDeposit.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
          desired_income: parseFloat(formData.desiredIncome.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
          expected_return: parseFloat(formData.expectedReturn),
          inflation: parseFloat(formData.inflation),
          adjust_contribution_for_accumulated_inflation: formData.adjustContributionForInflation,
          adjust_income_for_accumulated_inflation: formData.adjustIncomeForInflation,
        };
        
        // Importar o serviço de micro planos
        const { MicroInvestmentPlanService } = await import('@/services/micro-investment-plan.service');
        await MicroInvestmentPlanService.createMicroPlan(microPlanData);
      }

      toast({
        title: t('common.success'),
        description: t('brokerDashboard.planCreation.planCreatedSuccessfully'),
      });

      navigate(`/client/${clientId}`);
    } catch (error) {
      console.error('Error creating plan from simulation:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsCreatingPlan(false);
    }
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
                {clientId ? t('brokerDashboard.planCreation.title') : t('brokerDashboard.simulation.title')}
              </h1>
              {clientId && (
                <p className="text-sm text-muted-foreground mt-1">
                  {t('brokerDashboard.planCreation.creatingForClient')}: {profileData?.name || 'Cliente'}
                </p>
              )}
            </div>
          </div>
          
          {clientId && (
            <div className="flex gap-2">
              <Button
                onClick={handleCreatePlanFromSimulation}
                disabled={isCreatingPlan || !simulationPlan}
                className="flex items-center gap-2"
              >
                {isCreatingPlan ? (
                  <>
                    <Spinner size="sm" />
                    {t('brokerDashboard.planCreation.creatingPlan')}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    {t('brokerDashboard.planCreation.createPlan')}
                  </>
                )}
              </Button>
            </div>
          )}
          

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
                    {clientId ? t('brokerDashboard.planCreation.planParameters') : t('brokerDashboard.simulation.planParameters')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Plan Initial Date */}
                    <div className="space-y-2">
                      <Label>{t('investmentPlan.form.planInitialDate')}</Label>
                      <Input
                        type="date"
                        value={formData.planInitialDate}
                        onChange={(e) => handleFormChange('planInitialDate', e.target.value)}
                        disabled={!clientId} // Só permite editar se for um cliente real
                        className="h-10"
                      />
                      {!clientId && (
                        <p className="text-xs text-muted-foreground">
                          {t('brokerDashboard.simulation.planInitialDateDisabled')}
                        </p>
                      )}
                    </div>

                    {/* Initial Amount */}
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

                    {/* Monthly Deposit */}
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

                    {/* Desired Income */}
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

                    {/* Birth Date */}
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
                        placeholder="6"
                        step="1"
                        className="h-10"
                      />
                    </div>

                    {/* Plan Type */}
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

                    {/* Currency */}
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

                    {/* Adjust Contribution for Inflation */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="adjustContributionForInflation"
                          checked={formData.adjustContributionForInflation}
                          onCheckedChange={(checked) => handleFormChange('adjustContributionForInflation', checked as boolean)}
                        />
                        <Label htmlFor="adjustContributionForInflation" className="text-sm text-muted-foreground">
                          {t('investmentPlan.form.adjustContributionForInflation')}
                        </Label>
                      </div>
                    </div>

                    {/* Adjust Income for Inflation */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="adjustIncomeForInflation"
                          checked={formData.adjustIncomeForInflation}
                          onCheckedChange={(checked) => handleFormChange('adjustIncomeForInflation', checked as boolean)}
                        />
                        <Label htmlFor="adjustIncomeForInflation" className="text-sm text-muted-foreground">
                          {t('investmentPlan.form.adjustIncomeForInflation')}
                        </Label>
                      </div>
                    </div>


                    {/* Old Portfolio */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasOldPortfolio"
                          checked={formData.hasOldPortfolio}
                          onCheckedChange={(checked) => handleFormChange('hasOldPortfolio', checked as boolean)}
                        />
                        <Label htmlFor="hasOldPortfolio" className="text-sm text-muted-foreground">
                          {t('investmentPlan.form.hasOldPortfolio')}
                        </Label>
                      </div>
                    </div>

                    {formData.hasOldPortfolio && (
                      <div className="space-y-2">
                        <Label>{t('investmentPlan.form.oldPortfolioProfitability')} (%)</Label>
                        <Input
                          type="number"
                          value={formData.oldPortfolioProfitability}
                          onChange={(e) => handleFormChange('oldPortfolioProfitability', e.target.value)}
                          className="h-10"
                          step="0.1"
                          min="0"
                          max="100"
                        />
                      </div>
                    )}
                  </div>

                  
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Calculations */}
            <div className="space-y-6">
              {/* Calculations Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-500" />
                    {t('investmentPlan.create.calculations.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {calculations ? (
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.futureValue')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations.futureValue, formData.currency as CurrencyCode)}</span>
                      </div>

                      <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.presentFutureValue')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations.presentFutureValue, formData.currency as CurrencyCode)}</span>
                      </div>

                      <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.inflationAdjustedIncome')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations.inflationAdjustedIncome, formData.currency as CurrencyCode)}</span>
                      </div>

                      <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.requiredMonthlyDeposit')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations.requiredMonthlyDeposit, formData.currency as CurrencyCode)}</span>
                      </div>

                      <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.totalMonthlyReturn')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations.totalMonthlyReturn, formData.currency as CurrencyCode)}</span>
                      </div>

                      <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.monthlyRealReturn')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations.realReturn, formData.currency as CurrencyCode)}</span>
                      </div>

                      <div className="flex justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('investmentPlan.create.calculations.monthlyInflationReturn')}:</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculations.inflationReturn, formData.currency as CurrencyCode)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      {t('investmentPlan.create.calculations.fillRequired')}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Simulation Notice */}
              { !clientId  && (
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
              )}
            </div>
          </div>

          {/* Opções Avançadas de Visualização */}
          {simulationPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  {t('expenseChart.advancedOptions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showRealValues"
                      checked={showRealValues}
                      onCheckedChange={setShowRealValues}
                    />
                    <Label htmlFor="showRealValues">{t('expenseChart.showRealValues')}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showNegativeValues"
                      checked={showNegativeValues}
                      onCheckedChange={setShowNegativeValues}
                    />
                    <Label htmlFor="showNegativeValues">{t('expenseChart.showNegativeValues')}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showOldPortfolio"
                      checked={showOldPortfolio}
                      onCheckedChange={(checked) => {
                        setShowOldPortfolio(checked);
                        // Se estiver ativando e não tem carteira anterior configurada, ativa automaticamente
                        if (checked && !formData.hasOldPortfolio) {
                          handleFormChange('hasOldPortfolio', true);
                          handleFormChange('oldPortfolioProfitability', '3'); // Valor padrão
                        }
                      }}
                      disabled={!formData.hasOldPortfolio}
                    />
                    <Label htmlFor="showOldPortfolio" className={!formData.hasOldPortfolio ? "text-muted-foreground" : ""}>
                      {t('expenseChart.showOldPortfolio')}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showProjectedLine"
                      checked={showProjectedLine}
                      onCheckedChange={setShowProjectedLine}
                    />
                    <Label htmlFor="showProjectedLine">{t('expenseChart.showProjectedLine')}</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chart Section - Full Width Below */}
          {simulationPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  {clientId ? t('brokerDashboard.planCreation.planChart') : t('brokerDashboard.simulation.projectionChart')}
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
                  rawChartData={rawChartData}
                  chartOptions={chartOptions}
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
                  {clientId ? t('brokerDashboard.planCreation.planTable') : t('brokerDashboard.simulation.projectionTable')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FutureProjectionTab
                  investmentPlan={simulationPlan}
                  profile={{...mockProfile, birth_date: birthDate.toISOString().split('T')[0]}}
                  allFinancialRecords={[]}
                  microPlans={simulationPlan ? [{
                    id: 'simulation-micro-' + Date.now(),
                    life_investment_plan_id: simulationPlan.id,
                    effective_date: simulationPlan.plan_initial_date,
                    monthly_deposit: parseFloat(formData.monthlyDeposit.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
                    desired_income: parseFloat(formData.desiredIncome.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
                    expected_return: parseFloat(formData.expectedReturn),
                    inflation: parseFloat(formData.inflation),
                    adjust_contribution_for_accumulated_inflation: formData.adjustContributionForInflation,
                    adjust_income_for_accumulated_inflation: formData.adjustIncomeForInflation,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }] : []}
                  showGoalsEvents={false}
                  showRealEvolution={false}
                  isSimulation={true}
                  projectionData={projectionData}
                  chartOptions={chartOptions}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
