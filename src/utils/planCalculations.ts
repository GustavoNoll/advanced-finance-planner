export interface PlanFormData {
  initialAmount: string;
  initialAge: string;
  finalAge: string;
  monthlyDeposit: string;
  desiredIncome: string;
  expectedReturn: string;
  inflation: string;
  planType: string;
}

export interface Calculations {
  futureValue: number;
  inflationAdjustedIncome: number;
  realReturn: number;
  inflationReturn: number;
  totalMonthlyReturn: number;
  requiredMonthlyDeposit: number;
}

export const isCalculationReady = (data: PlanFormData): boolean => {
  return Boolean(
    data.initialAmount &&
    data.initialAge &&
    data.finalAge &&
    data.desiredIncome &&
    data.expectedReturn &&
    data.inflation
  );
};

const pmt = (rate: number, nper: number, pv: number, fv: number = 0): number => {
  if (rate === 0) {
    return -(fv + pv) / nper;
  }
  return (rate * (fv + pv * Math.pow(1 + rate, nper))) / (Math.pow(1 + rate, nper) - 1);
};

export const calculateFutureValues = (data: PlanFormData): Calculations => {
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
      case "1": // End at 100
        yearsTo100 = 100 - finalAge;
        monthlyWithdrawal = inflationAdjustedIncome / 12;
        rate = expectedReturn / 12; // Monthly rate
        
        // Fórmula de anuidade (valor presente de uma série de pagamentos mensais)
        futureValue = monthlyWithdrawal * ((1 - Math.pow(1 + rate, -yearsTo100 * 12)) / rate);
        break;
        
      case "2": // Leave 1M
        targetLegacy = 1000000;
        
        monthlyIncomeRequired = inflationAdjustedIncome / 12;
        incomePresentValue = monthlyIncomeRequired / expectedReturn;
        
        // Valor futuro é o valor necessário para gerar a renda mensal mais o valor de herança
        futureValue = Math.max(incomePresentValue + targetLegacy, targetLegacy);
        break;
        
      case "3": // Don't touch principal
        // Calculate how much principal is needed to generate income from returns only
        futureValue = inflationAdjustedIncome / (expectedReturn / 12);
        break;
        
      default:
        futureValue = 0;
    }
    
    // Calculate monthly returns
    const realReturn = (futureValue * expectedReturn) / 12;
    const inflationReturn = (futureValue * inflation) / 12;
    const totalMonthlyReturn = realReturn + inflationReturn;
    
    // Updated calculation for required monthly deposit
    // Using the total rate (expected return + inflation)
    const totalRate = expectedReturn + inflation;
    const annualRate = totalRate; // This is already in decimal form (e.g., 0.11 for 11%)

    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    const months = years * 12; // Total number of months

    // Calculate required monthly deposit using the PMT function
    const pmt = (rate: number, nper: number, pv: number, fv: number = 0) => {
      if (rate === 0) {
        return -(fv + pv) / nper;
      } else {
        return (rate * (fv + pv * Math.pow(1 + rate, nper))) / (Math.pow(1 + rate, nper) - 1);
      }
    };

    // Calculate required monthly deposit
    const requiredMonthlyDeposit = -pmt(
      monthlyRate,
      months,
      initialAmount,
      -futureValue // Note: negative because we want to accumulate this amount
    );

    return {
      futureValue,
      inflationAdjustedIncome,
      realReturn,
      inflationReturn,
      totalMonthlyReturn,
      requiredMonthlyDeposit,
    };
}; 