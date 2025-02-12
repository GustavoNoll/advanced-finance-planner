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
  
  const years = finalAge - initialAge;
  const inflationAdjustedIncome = desiredIncome * Math.pow(1 + inflation, years);
  
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
  const monthlyRate = Math.pow(1 + totalRate, 1/12) - 1;
  const months = years * 12;

  const pmt = (rate: number, nper: number, pv: number, fv: number = 0) => {
    if (rate === 0) return -(fv + pv) / nper;
    return (rate * (fv + pv * Math.pow(1 + rate, nper))) / (Math.pow(1 + rate, nper) - 1);
  };

  const requiredMonthlyDeposit = -pmt(monthlyRate, months, initialAmount, -futureValue);

  return {
    futureValue,
    inflationAdjustedIncome,
    realReturn,
    inflationReturn,
    totalMonthlyReturn,
    requiredMonthlyDeposit,
  };
}; 