import {
  calculateCompoundedRates,
  fv,
  pmt,
  pmtGrowingToFv,
  pvGrowingPerpetuity,
  vp,
  vpGrowingAnnuity,
  yearlyReturnRateToMonthlyReturnRate
} from "../financial-math";
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

/**
 * Result of investment plan calculations.
 *
 * When adjustIncomeForInflation is false, withdrawal is constant nominal (purchasing power decreases over time).
 * When adjustContributionForInflation is false, requiredMonthlyDeposit is constant nominal; when true, it is the first month real deposit (contributions grow with inflation).
 */
export type Calculations = {
  /** Nominal future value at retirement date (capital needed at retirement). */
  futureValue: number;
  /** Present value of the need (annuity/perpetuity discounted to today). */
  presentFutureValue: number;
  /** Desired income in nominal terms at retirement. */
  inflationAdjustedIncome: number;
  /** Monthly amount in currency from nominal return on portfolio (futureValue × nominal monthly rate). Not Fisher real rate. */
  realReturn: number;
  /** Monthly amount in currency from inflation "consuming" portfolio (futureValue × monthly inflation rate). */
  inflationReturn: number;
  /** Total nominal monthly return amount on portfolio. */
  totalMonthlyReturn: number;
  /** Monthly deposit to reach futureValue: constant nominal when adjustContributionForInflation is false, or first month real deposit when true. */
  requiredMonthlyDeposit: number;
  /** Capital at retirement for perpetuity (plan 1), same as futureValue (plan 2), or mirrors futureValue (plan 3). */
  necessaryFutureValue: number | null;
  /** Monthly deposit to reach necessaryFutureValue (plans 1, 2, and 3; in plan 3 equals requiredMonthlyDeposit). */
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
  adjustContributionForInflation: boolean;
  adjustIncomeForInflation: boolean;
}

/**
 * Core calculation logic shared by calculateFutureValues and calculateMicroPlanFutureValues.
 * All inputs must be normalized (numbers, not strings).
 *
 * Plan types:
 * - "1": Close out at limitAge — finite annuity until limitAge. Also computes perpetuity target (never run out).
 * - "2": Leave legacy — annuity until limitAge plus legacy amount.
 * - "3": Don't touch principal — perpetuity (live off returns only).
 *
 * Plan 1 has two targets: (A) finite annuity until limitAge → futureValue and requiredMonthlyDeposit;
 * (B) perpetuity (capital that pays inflationAdjustedIncome forever) → necessaryFutureValue and necessaryDepositToNecessaryFutureValue.
 *
 * When adjustIncomeForInflation is true, withdrawal is constant real (growing annuity/perpetuity).
 * When adjustContributionForInflation is true, deposit is constant real (growing contribution to FV).
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
    planType,
    adjustContributionForInflation,
    adjustIncomeForInflation
  } = input;

  const monthInflationRate = yearlyReturnRateToMonthlyReturnRate(inflation);
  const monthExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(expectedReturn);
  const annualTotalReturn = calculateCompoundedRates([expectedReturn, inflation]);
  const monthlyTotalReturn = yearlyReturnRateToMonthlyReturnRate(annualTotalReturn);

  const inflationAdjustedIncome = fv(monthInflationRate, monthsForInflationAdjustment, 0, desiredIncome);

  let presentValue = 0, futureValue = 0, necessaryFutureValue = 0;
  let requiredMonthlyDeposit = 0;
  let necessaryDepositToNecessaryFutureValue = 0;

  if (adjustIncomeForInflation) {
    // Withdrawal grows with inflation (constant real income). Need at retirement = PV at retirement of growing stream.
    const needAtRetirementPlan1 = vpGrowingAnnuity(
      monthExpectedReturnRate,
      monthsToEndMoney,
      inflationAdjustedIncome,
      monthInflationRate
    );
    const perpetuityCapital = monthExpectedReturnRate > monthInflationRate
      ? pvGrowingPerpetuity(monthExpectedReturnRate, inflationAdjustedIncome, monthInflationRate)
      : inflationAdjustedIncome / monthExpectedReturnRate;

    switch (planType) {
      case "1":
        futureValue = formatDecimals(needAtRetirementPlan1);
        presentValue = formatDecimals(futureValue / Math.pow(1 + monthInflationRate, monthsToRetirement));
        necessaryFutureValue = formatDecimals(perpetuityCapital);
        break;
      case "2": {
        const pvLegacyAtRetirement = legacyAmount / Math.pow(1 + monthExpectedReturnRate, monthsToEndMoney);
        futureValue = formatDecimals(needAtRetirementPlan1 + pvLegacyAtRetirement);
        presentValue = formatDecimals(futureValue / Math.pow(1 + monthInflationRate, monthsToRetirement));
        necessaryFutureValue = formatDecimals(futureValue);
        break;
      }
      case "3":
        futureValue = formatDecimals(perpetuityCapital);
        presentValue = formatDecimals(futureValue / Math.pow(1 + monthInflationRate, monthsToRetirement));
        necessaryFutureValue = formatDecimals(futureValue);
        break;
      default:
        futureValue = 0;
    }
  } else {
    // Constant nominal withdrawal: desiredIncome is fixed nominal per month.
    // presentValue from vp() = capital needed at retirement (nominal). Target FV = that capital, not inflated again.
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

    if (planType === "1" || planType === "2" || planType === "3") {
      const capitalAtRetirement = Math.abs(presentValue);
      futureValue = capitalAtRetirement;
      // presentFutureValue in "today's money" so plan-progress can apply inflationFactor when needed
      presentValue = capitalAtRetirement / Math.pow(1 + monthInflationRate, monthsToRetirement);
    }
  }

  if (requiredMonthlyDeposit === 0) {
    if (adjustContributionForInflation) {
      requiredMonthlyDeposit = formatDecimals(
        pmtGrowingToFv(monthlyTotalReturn, monthInflationRate, monthsToRetirement, initialAmount, futureValue)
      );
    } else {
      requiredMonthlyDeposit = formatDecimals(-pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, futureValue));
    }
  }

  if (planType === "2") {
    necessaryFutureValue = formatDecimals(futureValue);
    necessaryDepositToNecessaryFutureValue = formatDecimals(requiredMonthlyDeposit, 2);
  }

  if (planType === "3") {
    necessaryFutureValue = formatDecimals(futureValue);
    necessaryDepositToNecessaryFutureValue = formatDecimals(requiredMonthlyDeposit, 2);
  }

  if (planType === "1" && necessaryDepositToNecessaryFutureValue === 0) {
    if (adjustContributionForInflation && Number.isFinite(necessaryFutureValue)) {
      necessaryDepositToNecessaryFutureValue = formatDecimals(
        pmtGrowingToFv(monthlyTotalReturn, monthInflationRate, monthsToRetirement, initialAmount, necessaryFutureValue),
        2
      );
    } else if (!adjustContributionForInflation) {
      necessaryDepositToNecessaryFutureValue = formatDecimals(-pmt(monthlyTotalReturn, monthsToRetirement, -initialAmount, necessaryFutureValue), 2);
    }
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
    planType: data.planType,
    adjustContributionForInflation: data.adjustContributionForInflation,
    adjustIncomeForInflation: data.adjustIncomeForInflation
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
    planType: investmentPlan.plan_type,
    adjustContributionForInflation: investmentPlan.adjust_contribution_for_inflation,
    adjustIncomeForInflation: investmentPlan.adjust_income_for_inflation
  });
};
