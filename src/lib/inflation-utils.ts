import { fetchIPCARates, fetchUSCPIRates, fetchEuroCPIRates } from './bcb-api';
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
 * Creates a CPI map by currency (BRL -> IPCA, USD -> US CPI, EUR -> Euro CPI)
 * Keys in format "YYYY-M" with values as decimal monthly rates
 */
export function createCPIRatesMapByCurrency(
  startDate: Date,
  endDate: Date,
  currency: 'BRL' | 'USD' | 'EUR'
): Map<string, number> {
  const map = new Map<string, number>();
  const start = formatDateForBCB(startDate);
  const end = formatDateForBCB(endDate);

  let rates: Array<{ date: Date; monthlyRate: number }>; 
  switch (currency) {
    case 'USD':
      rates = fetchUSCPIRates(start, end);
      break;
    case 'EUR':
      rates = fetchEuroCPIRates(start, end);
      break;
    case 'BRL':
    default:
      rates = fetchIPCARates(start, end);
      break;
  }

  rates.forEach(rate => {
    const key = `${rate.date.getFullYear()}-${rate.date.getMonth() + 1}`;
    map.set(key, rate.monthlyRate / 100);
  });

  return map;
}