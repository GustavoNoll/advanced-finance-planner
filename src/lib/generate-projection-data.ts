import { calculateMonthlyWithdrawal } from './withdrawal-strategies';
import { calculateCompoundedRates, yearlyReturnRateToMonthlyReturnRate } from './financial-math';
import { FinancialRecord, InvestmentPlan, Goal, ProjectedEvent } from '@/types/financial';
import { getEndAge, handleMonthlyGoalsAndEvents, processGoals } from './chart-projections';
interface ProjectionData {
  age: number;
  year: number;
  contribution: number;
  withdrawal: number;
  balance: number;
  months?: {
    month: number;
    contribution: number;
    withdrawal: number;
    isHistorical: boolean;
    balance: number;
    returns?: number;
    goalsEventsImpact?: number;
  }[];
  isRetirementTransitionYear?: boolean;
  hasHistoricalData: boolean;
  returns: number;
  goalsEventsImpact?: number;
}

export function generateProjectionData(
  investmentPlan: InvestmentPlan,
  profile: { birth_date: string },
  initialRecords: FinancialRecord[],
  goals: Goal[],
  events: ProjectedEvent[]
): ProjectionData[] {
  const projectionData: ProjectionData[] = [];
  
  if (!profile?.birth_date || !investmentPlan || !initialRecords.length) {
    return [];
  }
  const endAge = getEndAge(investmentPlan);

  try {
    const goalsForChart = processGoals(goals);
    const birthDate = new Date(profile.birth_date);
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;
    const yearsUntilEnd = endAge - investmentPlan.initial_age;
    const currentDate = new Date();
    
    const startYear = birthYear + investmentPlan.initial_age;
    
    let currentBalance = initialRecords[0]?.ending_balance || 0;
    let currentMonthlyDeposit = investmentPlan.monthly_deposit;
    let currentMonthlyWithdrawal = investmentPlan.desired_income;
    const monthlyInflationRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.inflation/100);
    const monthlyExpectedReturnRate = yearlyReturnRateToMonthlyReturnRate(investmentPlan.expected_return/100);
    const monthlyReturnRate = calculateCompoundedRates([monthlyExpectedReturnRate, monthlyInflationRate]);

    const historicalRecordsMap = new Map(
      initialRecords.map(record => [
        `${record.record_year}-${record.record_month}`,
        record
      ])
    );
    
    for (let i = 0; i <= yearsUntilEnd; i++) {
      const age = investmentPlan.initial_age + i;
      const year = startYear + i;
      
      const monthlyData = Array.from({ length: 12 }, (_, month) => {
        const currentMonthNumber = month + 1;
        const historicalKey = `${year}-${currentMonthNumber}`;
        const historicalRecord = historicalRecordsMap.get(historicalKey);
        const isInPast = new Date(year, month) < currentDate;
          
        if (historicalRecord) {
          return {
            month: currentMonthNumber,
            contribution: historicalRecord.monthly_contribution,
            withdrawal: 0,
            balance: historicalRecord.ending_balance,
            isHistorical: true
          };
        }

        if (isInPast) {
          return {
            month: currentMonthNumber,
            contribution: 0,
            withdrawal: 0,
            balance: 0,
            isHistorical: false
          };
        }

        const previousBalance = currentBalance;
        currentBalance = handleMonthlyGoalsAndEvents(
          currentBalance,
          year,
          currentMonthNumber - 1,
          goalsForChart,
          events
        );
        const goalsEventsImpact = currentBalance - previousBalance;

        const isRetirementAge = age > investmentPlan.final_age || 
          (age === investmentPlan.final_age && currentMonthNumber >= birthMonth);

        if (investmentPlan.adjust_contribution_for_inflation && !isRetirementAge) {
          currentMonthlyDeposit *= (1 + monthlyInflationRate);
        }
        currentMonthlyWithdrawal *= (1 + monthlyInflationRate);

        if (isRetirementAge) {
          const monthlyReturn = currentBalance * monthlyReturnRate;
          const withdrawal = currentMonthlyWithdrawal;
          
          currentBalance = (currentBalance - withdrawal) * (1 + monthlyReturnRate);

          return {
            month: currentMonthNumber,
            contribution: 0,
            withdrawal,
            balance: currentBalance,
            returns: monthlyReturn,
            isHistorical: false,
            goalsEventsImpact: goalsEventsImpact
          };
        } else {
          const monthlyReturn = currentBalance * monthlyReturnRate;
          currentBalance = (currentBalance + currentMonthlyDeposit) * (1 + monthlyReturnRate);
          
          return {
            month: currentMonthNumber,
            contribution: currentMonthlyDeposit,
            withdrawal: 0,
            balance: currentBalance,
            returns: monthlyReturn,
            isHistorical: false,
            goalsEventsImpact: goalsEventsImpact
          };
        }
      });

      const hasRetirementTransition = age === investmentPlan.final_age;
      const yearlyContribution = monthlyData.reduce((sum, month) => sum + month.contribution, 0);
      const yearlyWithdrawal = monthlyData.reduce((sum, month) => sum + month.withdrawal, 0);

      projectionData.push({
        age,
        year,
        contribution: yearlyContribution,
        withdrawal: yearlyWithdrawal,
        balance: monthlyData[11].balance,
        months: monthlyData,
        isRetirementTransitionYear: hasRetirementTransition,
        hasHistoricalData: monthlyData.some(m => m.isHistorical),
        returns: monthlyData[11].returns || 0,
        goalsEventsImpact: monthlyData.reduce((sum, month) => sum + (month.goalsEventsImpact || 0), 0)
      });
    }

    return projectionData;
  } catch (error) {
    console.error('Error generating projection data:', error);
    return [];
  }
} 