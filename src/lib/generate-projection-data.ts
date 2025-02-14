import { WithdrawalStrategy, calculateMonthlyWithdrawal } from './withdrawal-strategies';
import { yearlyReturnRateToMonthlyReturnRate } from './financial-math';

interface FinancialRecord {
  record_year: number;
  record_month: number;
  ending_balance: number;
  monthly_contribution: number;
}

interface InvestmentPlan {
  initial_age: number;
  final_age: number;
  monthly_deposit: number;
  expected_return: number;
  inflation: number;
  adjust_contribution_for_inflation: boolean;
  desired_income: number;
  plan_type: string;
  limit_age?: number;
}

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
  }[];
  isRetirementTransitionYear?: boolean;
  hasHistoricalData: boolean;
  returns: number;
}

export function generateProjectionData(
  strategy: WithdrawalStrategy,
  investmentPlan: InvestmentPlan,
  profile: { birth_date: string },
  initialRecords: FinancialRecord[],
  allFinancialRecords: FinancialRecord[]
): ProjectionData[] {
  const getEndAge = () => {
    if ((investmentPlan.plan_type === "1" || investmentPlan.plan_type === "2") && investmentPlan.limit_age) {
      return investmentPlan.limit_age;
    }
    return 120;
  };

  const endAge = getEndAge();
  const projectionData: ProjectionData[] = [];
  
  if (!profile?.birth_date || !investmentPlan || !initialRecords.length) {
    return [];
  }

  try {
    const birthDate = new Date(profile.birth_date);
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;
    const yearsUntilEnd = endAge - investmentPlan.initial_age;
    const currentDate = new Date();
    
    const startYear = birthYear + investmentPlan.initial_age;
    
    let currentBalance = initialRecords[0]?.ending_balance || 0;
    let currentMonthlyDeposit = investmentPlan.monthly_deposit;
    let currentMonthlyWithdrawal = investmentPlan.desired_income;
    const yearlyReturnRate = investmentPlan.expected_return / 100 + investmentPlan.inflation / 100;
    const yearlyInflationRate = investmentPlan.inflation / 100;

    const historicalRecordsMap = new Map(
      allFinancialRecords.map(record => [
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

        const isRetirementAge = age > investmentPlan.final_age || 
          (age === investmentPlan.final_age && currentMonthNumber >= birthMonth);

        if (currentMonthNumber === 1 && i > 0) {
          if (investmentPlan.adjust_contribution_for_inflation && !isRetirementAge) {
            currentMonthlyDeposit *= (1 + yearlyInflationRate);
          }
          currentMonthlyWithdrawal *= (1 + yearlyInflationRate);
        }

        const monthlyReturnRate = yearlyReturnRateToMonthlyReturnRate(yearlyReturnRate);

        if (isRetirementAge) {
          const monthsUntilEnd = (endAge - age) * 12 - month;
          const monthlyReturn = currentBalance * monthlyReturnRate;
          const withdrawal = calculateMonthlyWithdrawal(
            strategy,
            {
              currentBalance,
              monthlyReturnRate,
              monthlyInflationRate: yearlyInflationRate,
              currentAge: age,
              monthsUntilEnd: monthsUntilEnd,
              currentMonth: month,
              desiredIncome: currentMonthlyWithdrawal
            }
          );
          
          currentBalance = (currentBalance - withdrawal) * (1 + monthlyReturnRate);

          return {
            month: currentMonthNumber,
            contribution: 0,
            withdrawal,
            balance: currentBalance,
            returns: monthlyReturn,
            isHistorical: false
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
            isHistorical: false
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
        returns: monthlyData[11].returns || 0
      });
    }

    return projectionData;
  } catch (error) {
    console.error('Error generating projection data:', error);
    return [];
  }
} 