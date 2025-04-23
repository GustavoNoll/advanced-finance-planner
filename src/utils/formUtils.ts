import { calculateEndDate, calculateFinalAge } from './dateUtils';

interface RiskProfile {
  return: string;
  value: string;
  label: string;
  bgColor: string;
  textColor: string;
}

interface RiskProfiles {
  [key: string]: RiskProfile[];
}

export type Currency = 'BRL' | 'USD' | 'EUR';

export interface FormData {
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
  currency: Currency;
}

/**
 * Handles age/date synchronization in forms
 * @param name - The field name ('finalAge' or 'planEndAccumulationDate')
 * @param value - The field value
 * @param birthDate - The birth date
 * @param isSyncing - Whether the sync is in progress
 * @param updateSource - The source of the update
 * @returns Object with updated values or null if no update needed
 */
export function handleAgeDateSync(
  name: string,
  value: string,
  birthDate: Date,
  isSyncing: boolean,
  updateSource: 'age' | 'date' | null
): { finalAge?: string; planEndAccumulationDate?: string } | null {
  if (!birthDate || isSyncing) return null;

  if (name === 'finalAge') {
    if (!value) return null;
    
    const finalAge = parseInt(value);
    const endDate = calculateEndDate(birthDate, finalAge);
    
    return {
      finalAge: value,
      planEndAccumulationDate: endDate.toISOString().split('T')[0]
    };
  } else if (name === 'planEndAccumulationDate') {
    if (updateSource === 'age') return null;
    
    if (!value || isNaN(new Date(value).getTime())) return null;
    
    const endDate = new Date(value);
    const age = calculateFinalAge(birthDate, endDate);
    
    return {
      planEndAccumulationDate: value,
      finalAge: age.toString()
    };
  }

  return null;
}

/**
 * Handles form field changes
 * @param name - The field name
 * @param value - The field value
 * @param checked - Whether the field is checked (for checkboxes)
 * @param currency - The current currency
 * @param riskProfiles - The risk profiles object
 * @returns The updated form data
 */
export function handleFormChange(
  name: string,
  value: string | boolean,
  checked: boolean | undefined,
  currency: Currency,
  riskProfiles: RiskProfiles
): Partial<FormData> {
  const newFormData: Partial<FormData> = {};
  
  if (name === 'expectedReturn') {
    const profiles = riskProfiles[currency];
    const profile = profiles.find((p: RiskProfile) => p.return === value);
    if (profile) {
      newFormData.expectedReturn = profile.return;
    }
  } else if (name === 'currency') {
    if (value === 'BRL' || value === 'USD' || value === 'EUR') {
      newFormData.currency = value as Currency;
      newFormData.expectedReturn = riskProfiles[value][0].return;
    }
  } else if (name === 'adjust_contribution_for_inflation') {
    newFormData.adjustContributionForInflation = checked;
  } else if (name === 'adjust_income_for_inflation') {
    newFormData.adjustIncomeForInflation = checked;
  } else {
    // Handle all other fields directly
    (newFormData as Record<string, string | boolean>)[name] = value;
  }
  
  return newFormData;
} 