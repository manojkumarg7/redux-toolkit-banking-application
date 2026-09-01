import { addYears, formatDate } from '../formatters';
import { calculateCompoundInterest, getCompoundingPeriods } from './compoundInterest';
import type { CompoundingFrequency, FdResult } from '../../types';

export function calculateFixedDeposit(
  depositAmount: number,
  rate: number,
  tenureYears: number,
  frequency: CompoundingFrequency,
): FdResult {
  if (depositAmount <= 0 || rate < 0 || tenureYears <= 0) {
    return {
      investedAmount: 0,
      interest: 0,
      maturityAmount: 0,
      maturityDate: '',
      yearlyGrowth: [],
    };
  }

  const result = calculateCompoundInterest(depositAmount, rate, tenureYears, frequency);
  const n = getCompoundingPeriods(frequency);
  const yearlyGrowth: { year: number; amount: number }[] = [];

  for (let year = 1; year <= Math.ceil(tenureYears); year += 1) {
    const t = Math.min(year, tenureYears);
    const amount = depositAmount * (1 + rate / (100 * n)) ** (n * t);
    yearlyGrowth.push({ year, amount });
  }

  return {
    investedAmount: depositAmount,
    interest: result.interest,
    maturityAmount: result.maturityAmount,
    maturityDate: formatDate(addYears(new Date(), tenureYears)),
    yearlyGrowth,
  };
}
