import { fetchIPCARates } from './bcb-api';
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from './financial-math';
import { FinancialRecord, InvestmentPlan } from '@/types/financial';
import { createDateWithoutTimezone } from '@/utils/dateUtils';

/**
 * Formats a date to the Brazilian format (DD/MM/YYYY) required by the BCB API
 * @param date - The date to format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDateForBCB(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

/**
 * Fetches IPCA rates for a given date range and returns the monthly rates as decimals
 * @param startDate - Start date for IPCA rates
 * @param endDate - End date for IPCA rates
 * @returns Array of monthly IPCA rates as decimals (e.g., 0.05 for 5%)
 */
export function fetchIPCAMonthlyRates(startDate: Date, endDate: Date): number[] {
  const formattedStartDate = formatDateForBCB(startDate);
  const formattedEndDate = formatDateForBCB(endDate);
  
  const ipcaRates = fetchIPCARates(formattedStartDate, formattedEndDate);
  return ipcaRates.map(rate => rate.monthlyRate / 100); // Convert percentage to decimal
}

/**
 * Calculates the accumulated inflation factor for a given date range
 * @param startDate - Start date for inflation calculation
 * @param endDate - End date for inflation calculation
 * @returns The accumulated inflation factor (e.g., 1.05 for 5% inflation)
 */
export function calculateAccumulatedInflation(startDate: Date, endDate: Date): number {
  const monthlyRates = fetchIPCAMonthlyRates(startDate, endDate);
  return 1 + calculateCompoundedRates(monthlyRates);
}

/**
 * Creates a map of IPCA rates by year and month for easy lookup
 * @param startDate - Start date for IPCA rates
 * @param endDate - End date for IPCA rates
 * @returns Map with keys in format "YYYY-MM" and values as decimal rates
 */
export function createIPCARatesMap(startDate: Date, endDate: Date): Map<string, number> {
  const ipcaRatesMap = new Map<string, number>();
  const ipcaRates = fetchIPCARates(formatDateForBCB(startDate), formatDateForBCB(endDate));
  
  ipcaRates.forEach(rate => {
    const key = `${rate.date.getFullYear()}-${rate.date.getMonth() + 1}`;
    ipcaRatesMap.set(key, rate.monthlyRate / 100); // Convert percentage to decimal
  });
  
  return ipcaRatesMap;
}

/**
 * Calculates the accumulated inflation for the entire plan period, from plan start date until retirement
 * Uses IPCA data when available, falls back to the plan's inflation rate when needed
 * 
 * @param planStartDate - The start date of the investment plan
 * @param retirementDate - The projected retirement date
 * @param planInflationRate - The annual inflation rate specified in the plan (as percentage)
 * @returns The accumulated inflation factor for the entire plan period
 */
export function calculatePlanAccumulatedInflation(
  planStartDate: Date,
  retirementDate: Date,
  planInflationRate: number
): number {
  try {
    // Create a map of all months from plan start to retirement
    const monthlyRatesMap = new Map<string, number>();
    const monthlyInflation = yearlyReturnRateToMonthlyReturnRate(planInflationRate / 100);
    
    // Get IPCA rates for the period
    const ipcaRates = fetchIPCARates(formatDateForBCB(planStartDate), formatDateForBCB(retirementDate));
    
    // Create a map of IPCA rates by year-month
    const ipcaRatesMap = new Map<string, number>();
    ipcaRates.forEach(rate => {
      const key = `${rate.date.getFullYear()}-${rate.date.getMonth() + 1}`;
      ipcaRatesMap.set(key, rate.monthlyRate / 100); // Convert percentage to decimal
    });
    
    // Fill the monthly rates map for all months in the period
    const currentDate = new Date(planStartDate);
    while (currentDate <= retirementDate) {
      const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
      
      // Use IPCA rate if available, otherwise use plan's inflation rate
      const monthlyRate = ipcaRatesMap.has(key) ? ipcaRatesMap.get(key)! : monthlyInflation;
      monthlyRatesMap.set(key, monthlyRate);
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Calculate accumulated inflation using all monthly rates
    const monthlyRates = Array.from(monthlyRatesMap.values());
    return 1 + calculateCompoundedRates(monthlyRates);
  } catch (error) {
    console.error('Error calculating plan accumulated inflation:', error);
    
    // Fallback to plan's inflation rate if there's an error
    const monthlyInflation = yearlyReturnRateToMonthlyReturnRate(planInflationRate / 100);
    const monthsToRetirement = (retirementDate.getFullYear() - planStartDate.getFullYear()) * 12 + 
                              (retirementDate.getMonth() - planStartDate.getMonth());
    
    return Math.pow(1 + monthlyInflation, monthsToRetirement);
  }
} 

/**
 * Calculates inflation-adjusted value for a given date range
 * @param value - The value to adjust
 * @param baseYear - Base year for inflation calculation
 * @param baseMonth - Base month for inflation calculation
 * @param targetYear - Target year for inflation calculation
 * @param targetMonth - Target month for inflation calculation
 * @param monthlyInflationRate - Monthly inflation rate as decimal
 * @param allFinancialRecords - All financial records for historical inflation calculation
 * @returns The inflation-adjusted value
 */
export function calculateInflationAdjustedValue(
  value: number | null | undefined,
  baseYear: number,
  baseMonth: number,
  targetYear: number,
  targetMonth: number,
  monthlyInflationRate: number,
  allFinancialRecords?: FinancialRecord[]
): number | null | undefined {
  if (value === null || value === undefined) return value;
  
  const monthsDiff = (targetYear - baseYear) * 12 + (targetMonth - baseMonth);
  
  if (monthsDiff <= 0) {
    // For past dates, calculate inflation from historical records
    if (allFinancialRecords) {
      const recordsBetween = allFinancialRecords.filter(record => {
        const recordToTargetMonthDiff = (record.record_year - targetYear) * 12 + (record.record_month - targetMonth);
        return recordToTargetMonthDiff < 0;
      });
      
      const inflationFactor = 1 + (calculateCompoundedRates(recordsBetween.map(record => record.target_rentability/100)) || 1);
      if (inflationFactor !== 1) return value / inflationFactor;
    }
    return value;
  }
  
  // For real values, we want to show the value in terms of current purchasing power
  // So we deflate future values to present value
  const adjustedValue = value / Math.pow(1 + monthlyInflationRate, monthsDiff);
  
  return adjustedValue;
}

/**
 * Gets the base year and month from the investment plan's initial date
 * @param investmentPlan - The investment plan containing plan_initial_date
 * @returns Object with baseYear and baseMonth
 */
export function getInvestmentPlanBaseDate(investmentPlan: InvestmentPlan): { baseYear: number; baseMonth: number } {
  const planStartDate = createDateWithoutTimezone(investmentPlan.plan_initial_date);
  return {
    baseYear: planStartDate.getFullYear(),
    baseMonth: planStartDate.getMonth() + 1
  };
} 