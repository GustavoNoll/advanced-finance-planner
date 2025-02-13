export type WithdrawalStrategy = {
  type: 'fixed' | 'preservation' | 'spend-all' | 'legacy';
  monthlyAmount?: number;
  targetLegacy?: number;
};

export interface WithdrawalCalculationParams {
  currentBalance: number;
  monthlyReturnRate: number;
  monthlyInflationRate: number;
  currentAge: number;
  monthsUntil100: number;
  currentMonth: number;
  desiredIncome: number;
}

export const calculateMonthlyWithdrawal = (
  strategy: WithdrawalStrategy,
  params: WithdrawalCalculationParams
): number => {
  const {
    currentBalance,
    monthlyReturnRate,
    currentAge,
    monthsUntil100,
    desiredIncome
  } = params;

  const monthlyReturn = currentBalance * monthlyReturnRate;

  switch (strategy.type) {
    case 'fixed':
      return desiredIncome;

    case 'preservation':
      return monthlyReturn;

    case 'spend-all':
      if (monthsUntil100 > 0) {
        return (currentBalance + monthlyReturn) / monthsUntil100;
      }
      return currentBalance + monthlyReturn; // Withdraw everything in the final month

    case 'legacy':
      if (currentAge < 100) {
        const targetLegacy = strategy.targetLegacy || 1000000;
        
        if (monthsUntil100 > 0) {
          const excessBalance = currentBalance - targetLegacy;
          if (excessBalance > 0) {
            return excessBalance / monthsUntil100 + monthlyReturn;
          }
          return monthlyReturn * 0.5; // Withdraw half of returns to build up legacy
        }
      }
      return 0;

    default:
      return desiredIncome;
  }
}; 