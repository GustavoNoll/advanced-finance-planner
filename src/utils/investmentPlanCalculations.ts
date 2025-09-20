import { calculateCompoundedRates, pmt, yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math";
import { createDateWithoutTimezone } from '@/utils/dateUtils';
import { InvestmentPlan, MicroInvestmentPlan, FinancialRecord } from '@/types/financial';

export type FormData = {
  initialAmount: string;
  plan_initial_date: string;
  finalAge: string;
  planEndAccumulationDate: string;
  monthlyDeposit: string;
  desiredIncome: string;
  expectedReturn: string;
  inflation: string;
  planType: string;
  adjustContributionForInflation: boolean;
  adjustIncomeForInflation: boolean;
  limitAge: string;
  legacyAmount: string;
  currency: 'BRL' | 'USD' | 'EUR';
  oldPortfolioProfitability: string | null;
  hasOldPortfolio: boolean;
};


export type Calculations = {
  futureValue: number;
  presentFutureValue: number;
  inflationAdjustedIncome: number;
  realReturn: number;
  inflationReturn: number;
  totalMonthlyReturn: number;
  requiredMonthlyDeposit: number;
  necessaryFutureValue: number | null;
  necessaryDepositToNecessaryFutureValue: number | null;
};

export const isCalculationReady = (data: FormData) => {
  return Boolean(
    data.initialAmount &&
    data.plan_initial_date &&
    (data.finalAge || data.planEndAccumulationDate) &&
    data.desiredIncome &&
    data.expectedReturn &&
    data.inflation
  );
};


export const calculateFutureValues = (data: FormData, birthDate: Date): Calculations => {
  const initialAmount = parseFloat(data.initialAmount.replace(',', '.')) || 0;
  const planInitialDate = createDateWithoutTimezone(data.plan_initial_date);
  const finalAge = parseFloat(data.finalAge) || 0;
  const planEndAccumulationDate = data.planEndAccumulationDate ? createDateWithoutTimezone(data.planEndAccumulationDate) : null;
  const desiredIncome = parseFloat(data.desiredIncome.replace(',', '.')) || 0;
  const expectedReturn = parseFloat(data.expectedReturn.replace(',', '.')) / 100;
  const monthlyDeposit = parseFloat(data.monthlyDeposit.replace(',', '.')) || 0;
  const inflation = parseFloat(data.inflation.replace(',', '.')) / 100;
  const limitAge = parseFloat(data.limitAge) || 110;
  const legacyAmount = parseFloat(data.legacyAmount.replace(',', '.')) || 0;
  const planType = data.planType;

  const pmt = (rate: number, nper: number, pv: number, fv: number = 0) => {
    if (rate === 0) return -(fv + pv) / nper;
    return (rate * (fv + pv * Math.pow(1 + rate, nper))) / (Math.pow(1 + rate, nper) - 1);
  };
  
  const fv = (rate: number, nper: number, pmt: number = 0, pv: number = 0): number => {
    if (rate === 0) return pv + pmt * nper; // Sem juros, apenas soma depósitos
    return pv * Math.pow(1 + rate, nper) + pmt * ((Math.pow(1 + rate, nper) - 1) / rate);
  };

  const vp = (rate: number, nper: number, pmt: number = 0, fv: number = 0) => {
    if (rate === 0) {
      return -(pmt * nper + fv); // Caso especial: taxa = 0
    }

    return -(
      pmt * (1 - Math.pow(1 + rate, -nper)) / rate +
      fv / Math.pow(1 + rate, nper)
    );
  };
  
  // vars
  const planStartDate = createDateWithoutTimezone(planInitialDate);
  
  let monthsToRetirement;
  if (planEndAccumulationDate) {
    monthsToRetirement = (planEndAccumulationDate.getFullYear() - planStartDate.getFullYear()) * 12 + 
                        (planEndAccumulationDate.getMonth() - planStartDate.getMonth());
  } else {
    // Calcula meses até a aposentadoria baseado na data de início do plano
    const retirementDate = new Date(birthDate);
    retirementDate.setFullYear(birthDate.getFullYear() + finalAge);
    
    monthsToRetirement = (retirementDate.getFullYear() - planStartDate.getFullYear()) * 12 + 
                        (retirementDate.getMonth() - planStartDate.getMonth());
  }
  const endMoney = limitAge;
  const monthsToEndMoney = (endMoney - finalAge) * 12;

  const monthInflationRate = yearlyReturnRateToMonthlyReturnRate(inflation);
  const monthExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(expectedReturn);

  const annualTotalReturn = calculateCompoundedRates([expectedReturn, inflation]);
  const monthlyTotalReturn = yearlyReturnRateToMonthlyReturnRate(annualTotalReturn);
  

  // Renda ajustada para inflação
  const inflationAdjustedIncome = fv(monthInflationRate, monthsToRetirement, 0, desiredIncome);
  
  let presentValue = 0, futureValue = 0, necessaryFutureValue = 0;
  let requiredMonthlyDeposit = 0;
  let realReturn = 0, inflationReturn = 0, totalMonthlyReturn = 0;
  let necessaryDepositToNecessaryFutureValue = 0;
  
  const formatDecimals = (num: number, fixed: number = 10): number => {
    return parseFloat((num.toFixed(fixed)));
  };
  
  switch (planType) {
    case "1":
      presentValue = vp(monthExpectedReturnRate, monthsToEndMoney, -desiredIncome, 0);
      // revisar
      necessaryFutureValue = formatDecimals(inflationAdjustedIncome / monthExpectedReturnRate);
      necessaryDepositToNecessaryFutureValue = formatDecimals(pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, necessaryFutureValue), 2);
      break;
      
    case "2":
      presentValue = vp(monthExpectedReturnRate, monthsToEndMoney, -desiredIncome, -legacyAmount);
      // necessaryFutureValue
      // necessaryDepositToNecessaryFutureValue
      
      break;
      
    case "3":
      presentValue = desiredIncome / monthExpectedReturnRate;
      break;
      
    default:
      futureValue = 0;
  }

  futureValue = Math.abs(-fv(monthInflationRate, monthsToRetirement, 0, presentValue));
  requiredMonthlyDeposit = formatDecimals(pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, futureValue));
  realReturn = formatDecimals(futureValue * monthExpectedReturnRate);
  inflationReturn = formatDecimals(futureValue * monthInflationRate);
  totalMonthlyReturn = formatDecimals(futureValue * monthlyTotalReturn);

  return {
    futureValue: formatDecimals(futureValue),
    presentFutureValue: formatDecimals(presentValue),
    inflationAdjustedIncome: formatDecimals(inflationAdjustedIncome),
    realReturn,
    inflationReturn,
    totalMonthlyReturn,
    requiredMonthlyDeposit,
    necessaryFutureValue,
    necessaryDepositToNecessaryFutureValue
  };
};

export const calculateMicroPlanFutureValues = (
  investmentPlan: InvestmentPlan, 
  activeMicroPlan: MicroInvestmentPlan | null, 
  financialRecords: FinancialRecord[],
  birthDate: Date
): Calculations => {
  console.log('=== DADOS INICIAIS - calculateMicroPlanFutureValues ===');
  console.log('Investment Plan:', {
    id: investmentPlan.id,
    plan_type: investmentPlan.plan_type,
    initial_amount: investmentPlan.initial_amount,
    plan_initial_date: investmentPlan.plan_initial_date,
    final_age: investmentPlan.final_age,
    plan_end_accumulation_date: investmentPlan.plan_end_accumulation_date,
    limit_age: investmentPlan.limit_age,
    legacy_amount: investmentPlan.legacy_amount
  });
  
  console.log('Active Micro Plan:', activeMicroPlan);
  console.log('Birth Date:', birthDate);
  console.log('Financial Records Count:', financialRecords.length);

  // Determinar o valor inicial baseado no financial record do mês da effective_date
  let initialAmount = investmentPlan.initial_amount || 0;
  
  if (activeMicroPlan?.effective_date) {
    const effectiveDate = createDateWithoutTimezone(activeMicroPlan.effective_date);
    const effectiveYear = effectiveDate.getFullYear();
    const effectiveMonth = effectiveDate.getMonth() + 1; // getMonth() retorna 0-11, precisamos 1-12
    
    console.log('Effective Date:', {
      effective_date: activeMicroPlan.effective_date,
      effective_year: effectiveYear,
      effective_month: effectiveMonth
    });
    
    // Buscar o financial record do mesmo mês da effective_date
    const financialRecord = financialRecords.find(record => 
      record.record_year === effectiveYear && record.record_month === effectiveMonth
    );
    
    if (financialRecord) {
      initialAmount = financialRecord.ending_balance;
      console.log('Financial Record Found:', {
        record_year: financialRecord.record_year,
        record_month: financialRecord.record_month,
        ending_balance: financialRecord.ending_balance
      });
    } else {
      console.log('No Financial Record found for effective date');
    }
  }
  
  const investmentPlanInitialDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
  const planInitialDate = createDateWithoutTimezone(activeMicroPlan?.effective_date || investmentPlan.plan_initial_date || '');
  const finalAge = investmentPlan.final_age || 0;
  const planEndAccumulationDate = investmentPlan.plan_end_accumulation_date ? createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date) : null;
  const desiredIncome = activeMicroPlan?.desired_income || 0;
  const expectedReturn = (activeMicroPlan?.expected_return || 0) / 100;
  const monthlyDeposit = activeMicroPlan?.monthly_deposit || 0;
  const inflation = (activeMicroPlan?.inflation || 0) / 100;
  const limitAge = investmentPlan.limit_age || 110;
  const legacyAmount = investmentPlan.legacy_amount || 0;
  const planType = investmentPlan.plan_type;

  console.log('Processed Initial Data:', {
    initialAmount,
    investmentPlanInitialDate: investmentPlanInitialDate.toISOString(),
    planInitialDate: planInitialDate.toISOString(),
    finalAge,
    planEndAccumulationDate: planEndAccumulationDate?.toISOString() || 'null',
    desiredIncome,
    expectedReturn: `${(expectedReturn * 100).toFixed(2)}%`,
    monthlyDeposit,
    inflation: `${(inflation * 100).toFixed(2)}%`,
    limitAge,
    legacyAmount,
    planType
  });

  const pmt = (rate: number, nper: number, pv: number, fv: number = 0) => {
    if (rate === 0) return -(fv + pv) / nper;
    return (rate * (fv + pv * Math.pow(1 + rate, nper))) / (Math.pow(1 + rate, nper) - 1);
  };
  
  const fv = (rate: number, nper: number, pmt: number = 0, pv: number = 0): number => {
    if (rate === 0) return pv + pmt * nper; // Sem juros, apenas soma depósitos
    return pv * Math.pow(1 + rate, nper) + pmt * ((Math.pow(1 + rate, nper) - 1) / rate);
  };

  const vp = (rate: number, nper: number, pmt: number = 0, fv: number = 0) => {
    if (rate === 0) {
      return -(pmt * nper + fv); // Caso especial: taxa = 0
    }

    return -(
      pmt * (1 - Math.pow(1 + rate, -nper)) / rate +
      fv / Math.pow(1 + rate, nper)
    );
  };
  
  console.log('=== CÁLCULOS INTERMEDIÁRIOS ===');
  
  // vars
  const planStartDate = createDateWithoutTimezone(planInitialDate);
  
  let monthsToRetirement, monthsToRetirementSinceBeginning;
  if (planEndAccumulationDate) {
    monthsToRetirement = (planEndAccumulationDate.getFullYear() - planStartDate.getFullYear()) * 12 + 
                        (planEndAccumulationDate.getMonth() - planStartDate.getMonth());
    monthsToRetirementSinceBeginning = (planEndAccumulationDate.getFullYear() - investmentPlanInitialDate.getFullYear()) * 12 + 
                        (planEndAccumulationDate.getMonth() - investmentPlanInitialDate.getMonth());
    console.log('Using planEndAccumulationDate for retirement calculation');
  } else {
    // Calcula meses até a aposentadoria baseado na data de início do plano
    const retirementDate = new Date(birthDate);
    retirementDate.setFullYear(birthDate.getFullYear() + finalAge);
    
    monthsToRetirement = (retirementDate.getFullYear() - planStartDate.getFullYear()) * 12 + 
                        (retirementDate.getMonth() - planStartDate.getMonth());
    monthsToRetirementSinceBeginning = (retirementDate.getFullYear() - investmentPlanInitialDate.getFullYear()) * 12 + 
                        (retirementDate.getMonth() - investmentPlanInitialDate.getMonth());
    console.log('Using birthDate + finalAge for retirement calculation');
  }
  const endMoney = limitAge;
  const monthsToEndMoney = (endMoney - finalAge) * 12;

  console.log('Time Calculations:', {
    planStartDate: planStartDate.toISOString(),
    monthsToRetirement,
    monthsToRetirementSinceBeginning,
    endMoney,
    monthsToEndMoney
  });

  const monthInflationRate = yearlyReturnRateToMonthlyReturnRate(inflation);
  const monthExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(expectedReturn);

  const annualTotalReturn = calculateCompoundedRates([expectedReturn, inflation]);
  const monthlyTotalReturn = yearlyReturnRateToMonthlyReturnRate(annualTotalReturn);
  
  console.log('Rate Calculations:', {
    inflation: `${(inflation * 100).toFixed(4)}%`,
    expectedReturn: `${(expectedReturn * 100).toFixed(4)}%`,
    monthInflationRate: `${(monthInflationRate * 100).toFixed(6)}%`,
    monthExpectedReturnRate: `${(monthExpectedReturnRate * 100).toFixed(6)}%`,
    annualTotalReturn: `${(annualTotalReturn * 100).toFixed(4)}%`,
    monthlyTotalReturn: `${(monthlyTotalReturn * 100).toFixed(6)}%`
  });

  // Renda ajustada para inflação
  const inflationAdjustedIncome = fv(monthInflationRate, monthsToRetirementSinceBeginning, 0, desiredIncome);
  
  console.log('Inflation Adjusted Income:', {
    desiredIncome,
    monthsToRetirementSinceBeginning,
    monthInflationRate: `${(monthInflationRate * 100).toFixed(6)}%`,
    inflationAdjustedIncome
  });
  
  let presentValue = 0, futureValue = 0, necessaryFutureValue = 0;
  let requiredMonthlyDeposit = 0;
  let realReturn = 0, inflationReturn = 0, totalMonthlyReturn = 0;
  let necessaryDepositToNecessaryFutureValue = 0;
  
  const formatDecimals = (num: number, fixed: number = 10): number => {
    return parseFloat((num.toFixed(fixed)));
  };
  
  console.log('=== CÁLCULOS POR PLAN TYPE ===');
  console.log('Plan Type:', planType);
  
  switch (planType) {
    case "1":
      console.log('--- Plan Type 1: Renda Perpétua ---');
      presentValue = vp(monthExpectedReturnRate, monthsToEndMoney, -desiredIncome, 0);
      console.log('presentValue = vp( ', monthExpectedReturnRate, monthsToEndMoney, -desiredIncome, 0, ') = ', presentValue);
      
      // revisar
      necessaryFutureValue = formatDecimals(inflationAdjustedIncome / monthExpectedReturnRate);
      console.log('necessaryFutureValue = formatDecimals(inflationAdjustedIncome / monthExpectedReturnRate) = ', necessaryFutureValue);

      
      necessaryDepositToNecessaryFutureValue = formatDecimals(pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, necessaryFutureValue), 2);
      console.log('necessaryDepositToNecessaryFutureValue = formatDecimals(pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, necessaryFutureValue), 2) = ', necessaryDepositToNecessaryFutureValue);

      break;
      
    case "2":
      console.log('--- Plan Type 2: Renda com Herança ---');
      presentValue = vp(monthExpectedReturnRate, monthsToEndMoney, -desiredIncome, -legacyAmount);
      console.log('presentValue = vp( ', monthExpectedReturnRate, monthsToEndMoney, -desiredIncome, -legacyAmount, ') = ', presentValue);
      // necessaryFutureValue
      // necessaryDepositToNecessaryFutureValue
      console.log('Note: necessaryFutureValue and necessaryDepositToNecessaryFutureValue not calculated for plan type 2');
      
      break;
      
    case "3":
      console.log('--- Plan Type 3: Renda Simples ---');
      presentValue = desiredIncome / monthExpectedReturnRate;
      console.log('presentValue = desiredIncome / monthExpectedReturnRate = ', presentValue);
      break;
      
    default:
      console.log('--- Plan Type Unknown ---');
      futureValue = 0;
      console.log('Future Value set to 0 for unknown plan type');
  }

  console.log('=== CÁLCULOS FINAIS ===');
  
  futureValue = Math.abs(-fv(monthInflationRate, monthsToRetirement, 0, presentValue));
  console.log('futureValue = Math.abs(-fv(monthInflationRate, monthsToRetirement, 0, presentValue)) = ', futureValue);
  
  requiredMonthlyDeposit = formatDecimals(pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, futureValue));
  console.log('requiredMonthlyDeposit = formatDecimals(pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, futureValue)) = ', requiredMonthlyDeposit);
  
  realReturn = formatDecimals(futureValue * monthExpectedReturnRate);
  inflationReturn = formatDecimals(futureValue * monthInflationRate);
  totalMonthlyReturn = formatDecimals(futureValue * monthlyTotalReturn);
  
  console.log('Return Calculations:', {
    futureValue,
    monthExpectedReturnRate: `${(monthExpectedReturnRate * 100).toFixed(6)}%`,
    monthInflationRate: `${(monthInflationRate * 100).toFixed(6)}%`,
    monthlyTotalReturn: `${(monthlyTotalReturn * 100).toFixed(6)}%`,
    realReturn,
    inflationReturn,
    totalMonthlyReturn
  });

  const result = {
    futureValue: formatDecimals(futureValue),
    presentFutureValue: formatDecimals(presentValue),
    inflationAdjustedIncome: formatDecimals(inflationAdjustedIncome),
    realReturn,
    inflationReturn,
    totalMonthlyReturn,
    requiredMonthlyDeposit,
    necessaryFutureValue,
    necessaryDepositToNecessaryFutureValue
  };
  
  console.log('=== RESPOSTA FINAL ===');
  console.log('Final Result:', result);
  
  return result;
}; 