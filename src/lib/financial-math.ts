/**
 * Compounds multiple rates together
 * Formula: total = (1 + rate1/100) × (1 + rate2/100) × ... × (1 + rateN/100) - 1
 * 
 * @param rates - Array of rates as percentages (e.g., 5 for 5%)
 * @returns The combined rate as a decimal (e.g., 0.1025 for 10.25%)
 * 
 * @example
 * // Returns 0.1025 (10.25%) for rates of 5% and 5%
 * calculateCompoundedRates([5, 5])
 */
export function calculateCompoundedRates(rates: number[]): number {
  const finalRate = rates.reduce((acc, rate) => acc * (1 + rate), 1);
  return finalRate - 1;
}

/**
 * Converts a yearly return rate to a monthly return rate
 * Formula: r_monthly = (1 + r_yearly)^(1/12) - 1
 * 
 * @param yearlyRate - The yearly return rate as a decimal (e.g., 0.12 for 12%)
 * @returns The monthly return rate as a decimal (e.g., 0.009488 for ~0.9488%)
 * 
 * @example
 * // Returns approximately 0.009488 (0.9488%)
 * yearlyReturnRateToMonthlyReturnRate(0.12)
 */
export function yearlyReturnRateToMonthlyReturnRate(yearlyRate: number): number {
  return Math.pow(1 + yearlyRate, 1/12) - 1;
}

/**
 * Converts a monthly return rate to a yearly return rate
 * Formula: r_yearly = (1 + r_monthly)^12 - 1
 * 
 * @param monthlyRate - The monthly return rate as a decimal (e.g., 0.009488 for 0.9488%)
 * @returns The yearly return rate as a decimal (e.g., 0.12 for 12%)
 * 
 * @example
 * // Returns approximately 0.12 (12%)
 * monthlyReturnRateToYearlyReturnRate(0.009488)
 */
export function monthlyReturnRateToYearlyReturnRate(monthlyRate: number): number {
  return Math.pow(1 + monthlyRate, 12) - 1;
}

/**
 * Calculates the effective annual rate given a nominal annual rate and compounding frequency
 * Formula: r_effective = (1 + r_nominal/n)^n - 1
 * where n is the number of compounding periods per year
 * 
 * @param nominalRate - The nominal annual rate as a decimal (e.g., 0.12 for 12%)
 * @param compoundingPeriodsPerYear - Number of times interest is compounded per year (e.g., 12 for monthly)
 * @returns The effective annual rate as a decimal
 * 
 * @example
 * // Returns approximately 0.1268 (12.68%) for monthly compounding
 * calculateEffectiveAnnualRate(0.12, 12)
 */
export function calculateEffectiveAnnualRate(
  nominalRate: number, 
  compoundingPeriodsPerYear: number
): number {
  return Math.pow(1 + nominalRate / compoundingPeriodsPerYear, compoundingPeriodsPerYear) - 1;
}

/**
 * Calculates the future value of an investment with regular deposits
 * Formula: FV = P * (1 + r)^t + PMT * ((1 + r)^t - 1) / r
 * where P is principal, r is interest rate per period, t is number of periods,
 * and PMT is the payment amount per period
 * 
 * @param principal - Initial investment amount
 * @param monthlyDeposit - Regular monthly deposit amount
 * @param annualInterestRate - Annual interest rate as a decimal (e.g., 0.12 for 12%)
 * @param years - Number of years
 * @returns The future value of the investment
 * 
 * @example
 * // Calculate future value of R$10000 initial investment with R$1000 monthly deposits
 * // at 12% annual interest over 10 years
 * calculateFutureValue(10000, 1000, 0.12, 10)
 */
export function calculateFutureValue(
  principal: number,
  monthlyDeposit: number,
  annualInterestRate: number,
  years: number
): number {
  const monthlyRate = yearlyReturnRateToMonthlyReturnRate(annualInterestRate);
  const numberOfMonths = years * 12;
  
  const principalFutureValue = principal * Math.pow(1 + monthlyRate, numberOfMonths);
  const depositsFutureValue = monthlyDeposit * 
    (Math.pow(1 + monthlyRate, numberOfMonths) - 1) / monthlyRate;
  
  return principalFutureValue + depositsFutureValue;
}

/**
 * Calculates the present value of a future sum
 * Formula: PV = FV / (1 + r)^t
 * 
 * @param futureValue - The future value to be discounted
 * @param annualInterestRate - Annual interest rate as a decimal (e.g., 0.12 for 12%)
 * @param years - Number of years
 * @returns The present value
 * 
 * @example
 * // Calculate present value of R$100000 in 10 years with 12% annual interest
 * calculatePresentValue(100000, 0.12, 10)
 */