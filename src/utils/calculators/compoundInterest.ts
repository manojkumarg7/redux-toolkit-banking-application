import { COMPOUNDING_OPTIONS } from '../../constants';
import type { CompoundInterestResult, CompoundingFrequency } from '../../types';

export function getCompoundingPeriods(frequency: CompoundingFrequency): number {
  return COMPOUNDING_OPTIONS.find((option) => option.value === frequency)?.periods ?? 1;
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  timeYears: number,
  frequency: CompoundingFrequency,
): CompoundInterestResult {
  if (principal <= 0 || rate < 0 || timeYears <= 0) {
    return { principal: 0, interest: 0, maturityAmount: 0 };
  }

  const n = getCompoundingPeriods(frequency);
  const maturityAmount = principal * (1 + rate / (100 * n)) ** (n * timeYears);

  return {
    principal,
    interest: maturityAmount - principal,
    maturityAmount,
  };
}
