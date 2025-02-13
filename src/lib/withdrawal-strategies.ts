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
  monthsUntilEnd: number;
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
    monthsUntilEnd,
    desiredIncome
  } = params;

  const monthlyReturn = currentBalance * monthlyReturnRate;

  switch (strategy.type) {
    case 'fixed':
      return desiredIncome;

    case 'preservation':
      return monthlyReturn;

    case 'spend-all':
      if (currentAge < 120) {
    
        if (monthsUntilEnd > 0) {
          const excessAmount = currentBalance;
          
          // Se for o último mês, ajuste exatamente para deixar 1M na conta
          if (monthsUntilEnd === 1) {
            return Math.max(0, currentBalance);
          }
    
          // Distribuir saque extra de forma proporcional ao tempo restante
          const additionalWithdrawal = excessAmount / monthsUntilEnd;
    
          // Total a ser sacado
          const totalWithdrawal = desiredIncome + additionalWithdrawal;
    
          return Math.max(0, totalWithdrawal);
        }
      }
      return 0;
    case 'legacy': 
      if (currentAge < 120) {
        const targetLegacy = strategy.targetLegacy || 1000000; // Valor alvo aos 120 anos
    
        if (monthsUntilEnd > 0) {
          const excessAmount = currentBalance - targetLegacy;
          
          // Se for o último mês, ajuste exatamente para deixar 1M na conta
          if (monthsUntilEnd === 1) {
            return Math.max(0, currentBalance - targetLegacy);
          }
    
          // Distribuir saque extra de forma proporcional ao tempo restante
          const additionalWithdrawal = excessAmount / monthsUntilEnd;
    
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