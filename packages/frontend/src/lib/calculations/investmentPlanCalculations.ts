import { calculateCompoundedRates, fv, pmt, vp, yearlyReturnRateToMonthlyReturnRate } from "../financial-math";
import { createDateWithoutTimezone } from '@/utils/dateUtils';
import { formatDecimals } from '@/utils/number';
import { DEFAULT_LIMIT_AGE } from './constants';
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

interface CalculationInput {
  initialAmount: number;
  monthsToRetirement: number;
  monthsForInflationAdjustment: number;
  monthsToEndMoney: number;
  desiredIncome: number;
  expectedReturn: number;
  inflation: number;
  limitAge: number;
  legacyAmount: number;
  planType: string;
}

/**
 * Core calculation logic shared by calculateFutureValues and calculateMicroPlanFutureValues.
 * All inputs must be normalized (numbers, not strings).
 */
function calculateFutureValuesCore(input: CalculationInput): Calculations {
  const {
    initialAmount,
    monthsToRetirement,
    monthsForInflationAdjustment,
    monthsToEndMoney,
    desiredIncome,
    expectedReturn,
    inflation,
    limitAge,
    legacyAmount,
    planType
  } = input;

  const monthInflationRate = yearlyReturnRateToMonthlyReturnRate(inflation);
  const monthExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(expectedReturn);
  const annualTotalReturn = calculateCompoundedRates([expectedReturn, inflation]);
  const monthlyTotalReturn = yearlyReturnRateToMonthlyReturnRate(annualTotalReturn);

  const inflationAdjustedIncome = fv(monthInflationRate, monthsForInflationAdjustment, 0, desiredIncome);

  let presentValue = 0, futureValue = 0, necessaryFutureValue = 0;
  let requiredMonthlyDeposit = 0;
  let necessaryDepositToNecessaryFutureValue = 0;

  switch (planType) {
    case "1":
      presentValue = vp(monthExpectedReturnRate, monthsToEndMoney, -desiredIncome, 0);
      necessaryFutureValue = formatDecimals(inflationAdjustedIncome / monthExpectedReturnRate);
      necessaryDepositToNecessaryFutureValue = formatDecimals(-pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, necessaryFutureValue), 2);
      break;

    case "2":
      presentValue = vp(monthExpectedReturnRate, monthsToEndMoney, -desiredIncome, legacyAmount);
      break;

    case "3":
      presentValue = desiredIncome / monthExpectedReturnRate;
      break;

    default:
      futureValue = 0;
  }

  futureValue = Math.abs(-fv(monthInflationRate, monthsToRetirement, 0, presentValue));
  requiredMonthlyDeposit = formatDecimals(-pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, futureValue));

  if (planType === "2") {
    necessaryFutureValue = formatDecimals(futureValue);
    necessaryDepositToNecessaryFutureValue = formatDecimals(requiredMonthlyDeposit, 2);
  }

  const realReturn = formatDecimals(futureValue * monthExpectedReturnRate);
  const inflationReturn = formatDecimals(futureValue * monthInflationRate);
  const totalMonthlyReturn = formatDecimals(futureValue * monthlyTotalReturn);

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
}

function computeMonthsToRetirement(
  planStartDate: Date,
  birthDate: Date,
  finalAge: number,
  planEndAccumulationDate: Date | null
): number {
  if (planEndAccumulationDate) {
    return (planEndAccumulationDate.getFullYear() - planStartDate.getFullYear()) * 12 +
      (planEndAccumulationDate.getMonth() - planStartDate.getMonth());
  }
  const retirementDate = new Date(birthDate);
  retirementDate.setFullYear(birthDate.getFullYear() + finalAge);
  return (retirementDate.getFullYear() - planStartDate.getFullYear()) * 12 +
    (retirementDate.getMonth() - planStartDate.getMonth());
}

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
  const planStartDate = createDateWithoutTimezone(data.plan_initial_date);
  const finalAge = parseFloat(data.finalAge) || 0;
  const planEndAccumulationDate = data.planEndAccumulationDate ? createDateWithoutTimezone(data.planEndAccumulationDate) : null;
  const limitAge = parseFloat(data.limitAge) || DEFAULT_LIMIT_AGE;
  const monthsToEndMoney = (limitAge - finalAge) * 12;
  const monthsToRetirement = computeMonthsToRetirement(planStartDate, birthDate, finalAge, planEndAccumulationDate);

  return calculateFutureValuesCore({
    initialAmount: parseFloat(data.initialAmount.replace(',', '.')) || 0,
    monthsToRetirement,
    monthsForInflationAdjustment: monthsToRetirement,
    monthsToEndMoney,
    desiredIncome: parseFloat(data.desiredIncome.replace(',', '.')) || 0,
    expectedReturn: parseFloat(data.expectedReturn.replace(',', '.')) / 100,
    inflation: parseFloat(data.inflation.replace(',', '.')) / 100,
    limitAge,
    legacyAmount: parseFloat(data.legacyAmount.replace(',', '.')) || 0,
    planType: data.planType
  });
};

/**
 * Resolves initial amount for a micro plan: uses ending_balance from financial records
 * when effective_date exists. Fallback: exact month match, then last record before/at effective_date.
 */
function resolveInitialAmountForMicroPlan(
  investmentPlan: InvestmentPlan,
  activeMicroPlan: MicroInvestmentPlan | null,
  financialRecords: FinancialRecord[]
): number {
  let initialAmount = investmentPlan.initial_amount || 0;
  if (!activeMicroPlan?.effective_date) return initialAmount;

  const effectiveDate = createDateWithoutTimezone(activeMicroPlan.effective_date);
  const effectiveYear = effectiveDate.getFullYear();
  const effectiveMonth = effectiveDate.getMonth() + 1;

  const sortedRecords = [...financialRecords].sort(
    (a, b) => (a.record_year - b.record_year) || (a.record_month - b.record_month)
  );

  const isRecordBeforeOrAtEffective = (r: FinancialRecord) =>
    r.record_year < effectiveYear || (r.record_year === effectiveYear && r.record_month <= effectiveMonth);

  const financialRecord =
    sortedRecords.find((r) => r.record_year === effectiveYear && r.record_month === effectiveMonth) ??
    sortedRecords.filter(isRecordBeforeOrAtEffective).pop();

  if (financialRecord) {
    initialAmount = financialRecord.ending_balance;
  }
  return initialAmount;
}

export const calculateMicroPlanFutureValues = (
  investmentPlan: InvestmentPlan,
  activeMicroPlan: MicroInvestmentPlan | null,
  financialRecords: FinancialRecord[],
  birthDate: Date
): Calculations => {
  const initialAmount = resolveInitialAmountForMicroPlan(investmentPlan, activeMicroPlan, financialRecords);

  const investmentPlanInitialDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
  const planStartDate = createDateWithoutTimezone(
    activeMicroPlan?.effective_date || investmentPlan.plan_initial_date || ''
  );

  const finalAge = investmentPlan.final_age || 0;
  const planEndAccumulationDate = investmentPlan.plan_end_accumulation_date
    ? createDateWithoutTimezone(investmentPlan.plan_end_accumulation_date)
    : null;

  const monthsToRetirement = computeMonthsToRetirement(planStartDate, birthDate, finalAge, planEndAccumulationDate);
  const monthsToRetirementSinceBeginning = computeMonthsToRetirement(
    investmentPlanInitialDate,
    birthDate,
    finalAge,
    planEndAccumulationDate
  );

  const limitAge = investmentPlan.limit_age || DEFAULT_LIMIT_AGE;
  const monthsToEndMoney = (limitAge - finalAge) * 12;

  return calculateFutureValuesCore({
    initialAmount,
    monthsToRetirement,
    monthsForInflationAdjustment: monthsToRetirementSinceBeginning,
    monthsToEndMoney,
    desiredIncome: activeMicroPlan?.desired_income || 0,
    expectedReturn: (activeMicroPlan?.expected_return || 0) / 100,
    inflation: (activeMicroPlan?.inflation || 0) / 100,
    limitAge,
    legacyAmount: investmentPlan.legacy_amount || 0,
    planType: investmentPlan.plan_type
  });
};
