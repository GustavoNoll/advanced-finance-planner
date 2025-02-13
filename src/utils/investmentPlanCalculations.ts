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
  const planType = data.planType;

  const pmt = (rate: number, nper: number, pv: number, fv: number = 0) => {
    if (rate === 0) return -(fv + pv) / nper;
    return (rate * (fv + pv * Math.pow(1 + rate, nper))) / (Math.pow(1 + rate, nper) - 1);
  };
  
  const fv = (rate: number, nper: number, pmt: number = 0, pv: number = 0): number => {
    if (rate === 0) return pv + pmt * nper; // Sem juros, apenas soma depósitos
    return pv * Math.pow(1 + rate, nper) + pmt * ((Math.pow(1 + rate, nper) - 1) / rate);
};
  
  const yearsDepositing = finalAge - initialAge;
  // Agora sim equivalente ao VF do Excel
  const inflationAdjustedIncome = fv(yearlyReturnRateToMonthlyReturnRate(inflation), yearsDepositing * 12, 0, desiredIncome);
  
  let futureValue, necessaryFutureValue;
  let rate;
  let targetLegacy;
  let monthlyIncomeRequired, incomePresentValue;
  let annualReturn, monthlyReturnRate;
  let yearsRetired;
  let requiredMonthlyDeposit = 0;
  let realReturn = 0, inflationReturn = 0, totalMonthlyReturn = 0, totalRate = 0;
  let necessaryDepositToNecessaryFutureValue;
  
  const formatDecimals = (num: number, fixed: number = 10): number => {
    return parseFloat((num.toFixed(fixed)));
  };
  
  switch (planType) {
    case "1":
      annualReturn = formatDecimals(calculateCompoundedRates([expectedReturn, inflation]));
      monthlyReturnRate = formatDecimals(yearlyReturnRateToMonthlyReturnRate(annualReturn));
      yearsRetired = 120 - finalAge;
      rate = monthlyReturnRate;
      futureValue = formatDecimals(fv(rate, yearsDepositing * 12, monthlyDeposit, initialAmount));

      realReturn = formatDecimals((futureValue * expectedReturn) / 12);
      inflationReturn = formatDecimals((futureValue * inflation) / 12);
      totalMonthlyReturn = formatDecimals(pmt(rate, yearsRetired * 12, futureValue, 0));


      necessaryFutureValue = formatDecimals(inflationAdjustedIncome / yearlyReturnRateToMonthlyReturnRate(expectedReturn));

      requiredMonthlyDeposit = formatDecimals(pmt(rate, yearsDepositing * 12, -initialAmount, futureValue));
      necessaryDepositToNecessaryFutureValue = formatDecimals(pmt(rate, yearsDepositing * 12, -initialAmount, necessaryFutureValue), 2);
      break;
      
    case "2":
      targetLegacy = 1000000;
      monthlyIncomeRequired = inflationAdjustedIncome / 12;
      incomePresentValue = monthlyIncomeRequired / expectedReturn;
      futureValue = Math.max(incomePresentValue + targetLegacy, targetLegacy);
      break;
      
    case "3":
      futureValue = inflationAdjustedIncome / yearlyReturnRateToMonthlyReturnRate(expectedReturn);
      realReturn = formatDecimals((futureValue * expectedReturn) / 12);
      inflationReturn = formatDecimals((futureValue * inflation) / 12);
      totalMonthlyReturn = formatDecimals(realReturn + inflationReturn);
      
      totalRate = expectedReturn + inflation;
    
      requiredMonthlyDeposit = formatDecimals(pmt(totalRate, yearsDepositing, -initialAmount, futureValue)/12);
      break;
      
    default:
      futureValue = 0;
  }

  return {
    futureValue: formatDecimals(futureValue),
    inflationAdjustedIncome: formatDecimals(inflationAdjustedIncome),
    realReturn,
    inflationReturn,
    totalMonthlyReturn,
    requiredMonthlyDeposit,
    necessaryFutureValue,
    necessaryDepositToNecessaryFutureValue
  };
}; 