import { yearlyReturnRateToMonthlyReturnRate } from "@/lib/financial-math";

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
};

export type Calculations = {
  futureValue: number;
  inflationAdjustedIncome: number;
  realReturn: number;
  inflationReturn: number;
  totalMonthlyReturn: number;
  requiredMonthlyDeposit: number;
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
  const initialAmount = parseFloat(data.initialAmount) || 0;
  const initialAge = parseFloat(data.initialAge) || 0;
  const finalAge = parseFloat(data.finalAge) || 0;
  const desiredIncome = parseFloat(data.desiredIncome) || 0;
  const expectedReturn = parseFloat(data.expectedReturn) / 100;
  const inflation = parseFloat(data.inflation) / 100;
  const planType = data.planType;

  const pmt = (rate: number, nper: number, pv: number, fv: number = 0) => {
    if (rate === 0) return -(fv + pv) / nper;
    return (rate * (fv + pv * Math.pow(1 + rate, nper))) / (Math.pow(1 + rate, nper) - 1);
  };
  
  const fv = (rate: number, nper: number, pmt: number = 0, pv: number = 0): number => {
    if (rate === 0) return pv + pmt * nper; // Sem juros, apenas soma depósitos
    return pv * Math.pow(1 + rate, nper) + pmt * ((Math.pow(1 + rate, nper) - 1) / rate);
};
  
  const years = finalAge - initialAge;
  // Agora sim equivalente ao VF do Excel
  const inflationAdjustedIncome = fv(yearlyReturnRateToMonthlyReturnRate(inflation), years * 12, 0, desiredIncome);
  
  let futureValue;
  let yearsTo100, monthlyWithdrawal, rate;
  let targetLegacy;
  let monthlyIncomeRequired, incomePresentValue;
  
  switch (planType) {
    case "1":
      yearsTo100 = 100 - finalAge;
      monthlyWithdrawal = inflationAdjustedIncome / 12;
      rate = expectedReturn / 12;
      futureValue = monthlyWithdrawal * ((1 - Math.pow(1 + rate, -yearsTo100 * 12)) / rate);
      break;
      
    case "2":
      targetLegacy = 1000000;
      monthlyIncomeRequired = inflationAdjustedIncome / 12;
      incomePresentValue = monthlyIncomeRequired / expectedReturn;
      futureValue = Math.max(incomePresentValue + targetLegacy, targetLegacy);
      break;
      
    case "3":
      futureValue = inflationAdjustedIncome / (expectedReturn / 12);
      break;
      
    default:
      futureValue = 0;
  }
  
  const realReturn = (futureValue * expectedReturn) / 12;
  const inflationReturn = (futureValue * inflation) / 12;
  const totalMonthlyReturn = realReturn + inflationReturn;
  
  const totalRate = expectedReturn + inflation;

  const requiredMonthlyDeposit = pmt(totalRate, years, -initialAmount, futureValue)/12;

  return {
    futureValue,
    inflationAdjustedIncome,
    realReturn,
    inflationReturn,
    totalMonthlyReturn,
    requiredMonthlyDeposit,
  };
}; 