/**
 * Compounds multiple rates together
 * Formula: total = (1 + rate1/100) × (1 + rate2/100) × ... × (1 + rateN/100) - 1
 * 
 * @param rates - Array of rates as percentages (e.g., 5 for 5%)
 * @returns The combined rate as a decimal (e.g., 0.1025 for 10.25%)
 * 
 * @example
 * // Returns 0.1025 (10.25%) for rates of 5% and 5%
 * calculateCompoundedRates([5, 5])
 */
export function calculateCompoundedRates(rates: number[]): number {
  const finalRate = rates.reduce((acc, rate) => acc * (1 + rate), 1);
  return parseFloat((finalRate - 1).toFixed(10));
}

/**
 * Converts a yearly return rate to a monthly return rate
 * Formula: r_monthly = (1 + r_yearly)^(1/12) - 1
 * 
 * @param yearlyRate - The yearly return rate as a decimal (e.g., 0.12 for 12%)
 * @returns The monthly return rate as a decimal (e.g., 0.009488 for ~0.9488%)
 * 
 * @example
 * // Returns approximately 0.009488 (0.9488%)
 * yearlyReturnRateToMonthlyReturnRate(0.12)
 */
export function yearlyReturnRateToMonthlyReturnRate(yearlyRate: number): number {
  return parseFloat((Math.pow(1 + yearlyRate, 1/12) - 1).toFixed(10));
}

/**
 * Converts a monthly return rate to a yearly return rate
 * Formula: r_yearly = (1 + r_monthly)^12 - 1
 * 
 * @param monthlyRate - The monthly return rate as a decimal (e.g., 0.009488 for 0.9488%)
 * @returns The yearly return rate as a decimal (e.g., 0.12 for 12%)
 * 
 * @example
 * // Returns approximately 0.12 (12%)
 * monthlyReturnRateToYearlyReturnRate(0.009488)
 */
export function monthlyReturnRateToYearlyReturnRate(monthlyRate: number): number {
  return parseFloat((Math.pow(1 + monthlyRate, 12) - 1).toFixed(10));
}

/**
 * Calculates the effective annual rate given a nominal annual rate and compounding frequency
 * Formula: r_effective = (1 + r_nominal/n)^n - 1
 * where n is the number of compounding periods per year
 * 
 * @param nominalRate - The nominal annual rate as a decimal (e.g., 0.12 for 12%)
 * @param compoundingPeriodsPerYear - Number of times interest is compounded per year (e.g., 12 for monthly)
 * @returns The effective annual rate as a decimal
 * 
 * @example
 * // Returns approximately 0.1268 (12.68%) for monthly compounding
 * calculateEffectiveAnnualRate(0.12, 12)
 */
export function calculateEffectiveAnnualRate(
  nominalRate: number, 
  compoundingPeriodsPerYear: number
): number {
  return parseFloat((Math.pow(1 + nominalRate / compoundingPeriodsPerYear, compoundingPeriodsPerYear) - 1).toFixed(10));
}

/**
 * Calculates the future value of an investment with regular deposits
 * Formula: FV = P * (1 + r)^t + PMT * ((1 + r)^t - 1) / r
 * where P is principal, r is interest rate per period, t is number of periods,
 * and PMT is the payment amount per period
 * 
 * @param principal - Initial investment amount
 * @param monthlyDeposit - Regular monthly deposit amount
 * @param annualInterestRate - Annual interest rate as a decimal (e.g., 0.12 for 12%)
 * @param years - Number of years
 * @returns The future value of the investment
 * 
 * @example
 * // Calculate future value of R$10000 initial investment with R$1000 monthly deposits
 * // at 12% annual interest over 10 years
 * calculateFutureValue(10000, 1000, 0.12, 10)
 */
export function calculateFutureValue(
  principal: number,
  monthlyDeposit: number,
  annualInterestRate: number,
  years: number
): number {
  const monthlyRate = yearlyReturnRateToMonthlyReturnRate(annualInterestRate);
  const numberOfMonths = years * 12;
  
  const principalFutureValue = principal * Math.pow(1 + monthlyRate, numberOfMonths);
  const depositsFutureValue = monthlyDeposit * 
    (Math.pow(1 + monthlyRate, numberOfMonths) - 1) / monthlyRate;
  
  return parseFloat((principalFutureValue + depositsFutureValue).toFixed(10));
}

/**
 * Calculates the present value of a future sum
 * Formula: PV = FV / (1 + r)^t
 * 
 * @param futureValue - The future value to be discounted
 * @param annualInterestRate - Annual interest rate as a decimal (e.g., 0.12 for 12%)
 * @param years - Number of years
 * @returns The present value
 * 
 * @example
 * // Calculate present value of R$100000 in 10 years with 12% annual interest
 * calculatePresentValue(100000, 0.12, 10)
 */

/**
 * Calcula o número de períodos necessários para atingir um valor futuro com base na taxa de juros e pagamentos
 * Funciona como a função NPER do Excel
 * Fórmula: NPER = ln((PMT * (1 + taxa * tipo) - FV * taxa) / (PV * taxa + PMT * (1 + taxa * tipo))) / ln(1 + taxa)
 * 
 * @param taxa - Taxa de juros por período em decimal
 * @param valor_do_pagamento - Pagamento feito em cada período (negativo se você estiver pagando)
 * @param valor_atual - Valor presente (positivo para dinheiro recebido, negativo para investimento)
 * @param valor_futuro - O valor futuro ou saldo de caixa após o último pagamento (padrão: 0)
 * @param fim_ou_inicio - Se os pagamentos são devidos no início (true) ou fim (false) do período (padrão: false)
 * @returns Número de períodos (períodos fracionários são possíveis)
 * 
 * @example
 * // Quantos meses para pagar um empréstimo de R$10000 com taxa de juros de 1% mensal com pagamentos de R$1000 mensais
 * nper(0.01, -1000, 10000)
 */
export function nper(
  taxa: number,
  valor_do_pagamento: number,
  valor_atual: number,
  valor_futuro: number = 0,
  fim_ou_inicio: boolean = false
): number {
  // Tratamento de caso especial para taxa zero
  if (taxa === 0) {
    return parseFloat((-(valor_atual + valor_futuro) / valor_do_pagamento).toFixed(10));
  }

  const tipo = fim_ou_inicio ? 1 : 0;
  const PMT = valor_do_pagamento;
  const PV = valor_atual;
  const FV = valor_futuro;
  
  // Fórmula correta do Excel NPER
  const numerador = PMT * (1 + taxa * tipo) - FV * taxa;
  const denominador = PV * taxa + PMT * (1 + taxa * tipo);
  
  // Se o denominador for zero ou o cálculo resultar em um valor negativo dentro do logaritmo
  if (denominador === 0 || (numerador / denominador) <= 0) {
    throw new Error('Não é possível calcular o número de períodos com estes parâmetros');
  }
  
  return parseFloat((Math.log(numerador / denominador) / Math.log(1 + taxa)).toFixed(10));
}

/**
 * Calculates the payment for a loan based on constant payments and a constant interest rate
 * Implements Excel's PMT function
 * Formula: PMT = (PV * rate * (1 + rate)^nper) / ((1 + rate)^nper - 1)
 * If FV is included: PMT = (rate * (FV + PV * (1 + rate)^nper)) / ((1 + rate)^nper - 1)
 * 
 * @param taxa - Interest rate per period as decimal
 * @param numero_de_periodos - Total number of payment periods
 * @param valor_atual - Present value (positive if receiving money, negative for investment/loan)
 * @param valor_futuro - Future value or cash balance after last payment (default: 0)
 * @param fim_ou_inicio - Whether payments are due at the beginning (true) or end (false) of period (default: false)
 * @returns Payment amount (negative if you're paying, positive if you're receiving)
 * 
 * @example
 * // Calculate monthly payment for a R$10000 loan at 1% monthly interest for 12 months
 * pmt(0.01, 12, 10000) // Returns negative value (payment you need to make)
 */
export function pmt(
  taxa: number,
  numero_de_periodos: number,
  valor_atual: number,
  valor_futuro: number = 0,
  fim_ou_inicio: boolean = false
): number {
  // Special handling for zero rate
  if (taxa === 0) {
    return parseFloat((-(valor_atual + valor_futuro) / numero_de_periodos).toFixed(10));
  }

  const tipo = fim_ou_inicio ? 1 : 0;
  const pvif = Math.pow(1 + taxa, numero_de_periodos);
  
  const pagamento = (taxa * (valor_futuro + valor_atual * pvif)) / 
                  ((1 + taxa * tipo) * (pvif - 1));

  return parseFloat((-pagamento).toFixed(10)); // Negative because payment is outflow
}

/**
 * Calculates the present value needed to reach a future goal
 * Similar to Excel's PV function
 * Formula: PV = FV / (1 + r)^n - PMT * ((1 - (1 + r)^-n) / r)
 * 
 * @param realRate - The real interest rate per period as a decimal (e.g., 0.05 for 5%)
 * @param numberOfPeriods - Total number of periods
 * @param payment - Regular payment amount (negative if you're paying)
 * @param futureValue - The future value or goal to reach
 * @returns The present value needed to reach the future goal
 * 
 * @example
 * // Calculate present value needed to reach R$100000 in 18 periods
 * // with 5% real interest rate and R$1000 monthly payments
 * vp(0.05, 18, -1000, 100000)
 */
export function vp(
  realRate: number,
  numberOfPeriods: number,
  payment: number,
  futureValue: number
): number {
  // Handle special case for zero rate
  if (realRate === 0) {
    return parseFloat((futureValue - payment * numberOfPeriods).toFixed(10));
  }

  const rate = realRate;
  const n = numberOfPeriods;
  const pmt = payment;
  const fv = futureValue;

  // PV = FV / (1 + r)^n - PMT * ((1 - (1 + r)^-n) / r)
  const pv = fv / Math.pow(1 + rate, n) - pmt * ((1 - Math.pow(1 + rate, -n)) / rate);

  return parseFloat(pv.toFixed(10));
}