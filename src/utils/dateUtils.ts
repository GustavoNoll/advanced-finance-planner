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