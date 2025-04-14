import { useState, useEffect } from 'react';

/**
 * Hook to manage user's locale settings
 * @returns Object containing locale information and formatting functions
 */
export function useLocale() {
  const [locale, setLocale] = useState<string>(() => {
    // Get user's preferred language from browser
    return navigator.language || 'pt-BR';
  });

  /**
   * Formats a date according to user's locale
   * @param date - The date to format
   * @param options - Additional formatting options
   * @returns Formatted date string
   */
  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }): string => {
    return date.toLocaleDateString(locale, options);
  };

  /**
   * Formats a number according to user's locale
   * @param number - The number to format
   * @param options - Additional formatting options
   * @returns Formatted number string
   */
  const formatNumber = (number: number, options: Intl.NumberFormatOptions = { style: 'currency', currency: 'BRL' }): string => {
    return new Intl.NumberFormat(locale, options).format(number);
  };

  const monthName = (month: number) => {
    return new Date(0, month).toLocaleDateString(locale, { month: 'long' });
  };

  return {
    locale,
    setLocale,
    formatDate,
    formatNumber,
    monthName
  };
} 