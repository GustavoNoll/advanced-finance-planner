import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Creates a Date object without applying timezone offset
 * This is useful when you want to work with dates as they are, without timezone conversion
 * @param dateInput - Date string, Date object, or date components
 * @returns Date object without timezone adjustment
 */
export function createDateWithoutTimezone(dateInput: string | Date | { year: number; month: number; day: number } | null | undefined): Date {
  if (!dateInput) {
    throw new Error(`Invalid date input: ${JSON.stringify(dateInput)}`);
  }
  
  if (typeof dateInput === 'string') {
    // Parse date string and create date without timezone
    const [year, month, day] = dateInput.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  if (dateInput instanceof Date) {
    // Create new date using the original date's components
    return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
  }
  
  // Handle object with year, month, day
  if (typeof dateInput === 'object' && dateInput !== null && 'year' in dateInput && 'month' in dateInput && 'day' in dateInput) {
    return new Date(dateInput.year, dateInput.month - 1, dateInput.day);
  }
  
  // If we reach here, the input is invalid
  throw new Error(`Invalid date input: ${JSON.stringify(dateInput)}`);
}

/**
 * Creates a Date object from year and month without applying timezone
 * @param year - The year
 * @param month - The month (1-12)
 * @returns Date object for the first day of the month
 */
export function createDateFromYearMonth(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

/**
 * Rounds up a date to the next month if not on the first day
 * @param date - The date to round up
 * @returns The rounded up date
 */
export function roundUpToNextMonth(date: Date): Date {
  const newDate = new Date(date);
  if (newDate.getDate() > 1) {
    newDate.setMonth(newDate.getMonth() + 1);
  }
  newDate.setDate(1);
  return newDate;
}

/**
 * Calculates age based on birth date and current date
 * @param birthDate - The birth date
 * @param currentDate - The current date (defaults to today)
 * @returns The calculated age
 */
export function calculateAge(birthDate: Date, currentDate: Date = new Date()): number {
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calculates the end date based on birth date and final age
 * @param birthDate - The birth date
 * @param finalAge - The final age
 * @returns The calculated end date
 */
export function calculateEndDate(birthDate: Date, finalAge: number): Date {
  const endDate = new Date(birthDate);
  endDate.setFullYear(birthDate.getFullYear() + finalAge);
  return roundUpToNextMonth(endDate);
}

/**
 * Calculates the final age based on birth date and end date
 * @param birthDate - The birth date
 * @param endDate - The end date
 * @returns The calculated final age
 */
export function calculateFinalAge(birthDate: Date, endDate: Date): number {
  let age = endDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = endDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Formats a date according to the locale
 * @param date - The date to format
 * @param formatStr - The format string (defaults to 'dd/MM/yyyy')
 * @returns The formatted date string
 */
export function formatDateByLocale(date: Date | string | null | undefined, formatStr: string = 'dd/MM/yyyy'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';
  
  return format(dateObj, formatStr, { locale: ptBR });
}

/**
 * Parses a date string according to the locale
 * @param dateStr - The date string to parse
 * @param formatStr - The format string (defaults to 'dd/MM/yyyy')
 * @returns The parsed Date object or null if invalid
 */
export function parseDateByLocale(dateStr: string, formatStr: string = 'dd/MM/yyyy'): Date | null {
  if (!dateStr) return null;
  
  try {
    const parsedDate = parse(dateStr, formatStr, new Date(), { locale: ptBR });
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  } catch (error) {
    return null;
  }
} 