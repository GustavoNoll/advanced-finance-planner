/**
 * Rounds a number to the specified decimal places and returns a number.
 * @param num - The number to format
 * @param fixed - Number of decimal places (default: 10)
 * @returns The formatted number
 */
export function formatDecimals(num: number, fixed: number = 10): number {
  return parseFloat(num.toFixed(fixed));
}
