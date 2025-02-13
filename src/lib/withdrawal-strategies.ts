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
      if (currentAge < 100) {
    
        if (monthsUntil100 > 0) {
          const excessAmount = currentBalance;
          
          // Se for o último mês, ajuste exatamente para deixar 1M na conta
          if (monthsUntil100 === 1) {
            return Math.max(0, currentBalance);
          }
    
          // Distribuir saque extra de forma proporcional ao tempo restante
          const additionalWithdrawal = excessAmount / monthsUntil100;
    
          // Total a ser sacado
          const totalWithdrawal = desiredIncome + additionalWithdrawal;
    
          return Math.max(0, totalWithdrawal);
        }
      }
      return 0;
    case 'legacy': 
      if (currentAge < 100) {
        const targetLegacy = strategy.targetLegacy || 1000000; // Valor alvo aos 100 anos
    
        if (monthsUntil100 > 0) {
          const excessAmount = currentBalance - targetLegacy;
          
          // Se for o último mês, ajuste exatamente para deixar 1M na conta
          if (monthsUntil100 === 1) {
            return Math.max(0, currentBalance - targetLegacy);
          }
    
          // Distribuir saque extra de forma proporcional ao tempo restante
          const additionalWithdrawal = excessAmount / monthsUntil100;
    
          // Total a ser sacado
          const totalWithdrawal = desiredIncome + additionalWithdrawal;
    
          return Math.max(0, totalWithdrawal);
        }
      }
      return 0;

    default:
      return desiredIncome;
  }
}; 