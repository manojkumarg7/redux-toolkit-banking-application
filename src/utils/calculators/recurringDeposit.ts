import type { RdResult } from '../../types';

/**
 * RD maturity using quarterly compounding approximation commonly used in Indian banks:
 * M = P * [((1 + r)^n - 1) / (1 - (1 + r)^(-1/3))]
 * where P = monthly deposit, r = quarterly rate, n = number of quarters
 */
export function calculateRecurringDeposit(
  monthlyDeposit: number,
  annualRate: number,
  tenureMonths: number,
): RdResult {
  if (monthlyDeposit <= 0 || annualRate < 0 || tenureMonths <= 0) {
    return {
      totalDeposited: 0,
      interest: 0,
      maturityAmount: 0,
      contribution: 0,
    };
  }

  const totalDeposited = monthlyDeposit * tenureMonths;
  const r = annualRate / 400;
  const n = tenureMonths / 3;

  let maturityAmount: number;

  if (r === 0) {
    maturityAmount = totalDeposited;
  } else {
    maturityAmount =
      monthlyDeposit * (((1 + r) ** n - 1) / (1 - (1 + r) ** (-1 / 3)));
  }

  return {
    totalDeposited,
    interest: maturityAmount - totalDeposited,
    maturityAmount,
    contribution: totalDeposited,
  };
}
