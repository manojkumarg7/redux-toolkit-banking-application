import type { SimpleInterestResult } from '../../types';

export function calculateSimpleInterest(
  principal: number,
  rate: number,
  timeYears: number,
): SimpleInterestResult {
  if (principal <= 0 || rate < 0 || timeYears <= 0) {
    return { principal: 0, interest: 0, maturityAmount: 0 };
  }

  const interest = (principal * rate * timeYears) / 100;
  return {
    principal,
    interest,
    maturityAmount: principal + interest,
  };
}
