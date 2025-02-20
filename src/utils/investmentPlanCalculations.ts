import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math";

export type FormData = {
  initialAmount: string;
  initialAge: string;
  finalAge: string;
  monthlyDeposit: string;
  desiredIncome: string;
  expectedReturn: string;
  inflation: string;
  planType: string;
  adjustContributionForInflation: boolean;
  limitAge: string;
  legacyAmount: string;
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
    data.initialAge &&
    data.finalAge &&
    data.desiredIncome &&
    data.expectedReturn &&
    data.inflation
  );
};

export const calculateFutureValues = (data: FormData): Calculations => {
  const initialAmount = parseFloat(data.initialAmount.replace(',', '.')) || 0;
  const initialAge = parseFloat(data.initialAge) || 0;
  const finalAge = parseFloat(data.finalAge) || 0;
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
  const yearsDepositing = finalAge - initialAge;
  const monthsToRetirement = yearsDepositing * 12;
  const endMoney = limitAge;
  const monthsToEndMoney = (endMoney - finalAge) * 12;

  const monthInflationRate = yearlyReturnRateToMonthlyReturnRate(inflation);
  const monthExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(expectedReturn);

  const annualTotalReturn = calculateCompoundedRates([expectedReturn, inflation]);
  const monthlyTotalReturn = yearlyReturnRateToMonthlyReturnRate(annualTotalReturn);
  

  // Renda ajustada para inflação
  const inflationAdjustedIncome = fv(monthInflationRate, monthsToRetirement, 0, desiredIncome);
  
  let presentValue, futureValue, necessaryFutureValue;
  let requiredMonthlyDeposit = 0;
  let realReturn = 0, inflationReturn = 0, totalMonthlyReturn = 0;
  let necessaryDepositToNecessaryFutureValue;
  
  const formatDecimals = (num: number, fixed: number = 10): number => {
    return parseFloat((num.toFixed(fixed)));
  };
  
  switch (planType) {
    case "1":
      presentValue = vp(monthExpectedReturnRate, monthsToEndMoney, -desiredIncome, 0);
      // revisar
      necessaryFutureValue = formatDecimals(inflationAdjustedIncome / monthExpectedReturnRate);
      necessaryDepositToNecessaryFutureValue = formatDecimals(pmt(monthlyTotalReturn, yearsDepositing * 12, -initialAmount, necessaryFutureValue), 2);
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
  requiredMonthlyDeposit = formatDecimals(pmt(monthlyTotalReturn, yearsDepositing * 12, -initialAmount, futureValue));
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