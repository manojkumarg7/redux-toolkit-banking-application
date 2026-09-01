import type { AmortizationRow, EmiResult, TenureUnit } from '../../types';

export function toMonths(tenure: number, unit: TenureUnit): number {
  return unit === 'years' ? tenure * 12 : tenure;
}

export function calculateEmi(
  principal: number,
  annualRate: number,
  tenure: number,
  unit: TenureUnit,
): EmiResult {
  const n = toMonths(tenure, unit);

  if (principal <= 0 || annualRate < 0 || n <= 0) {
    return {
      emi: 0,
      principal: 0,
      totalInterest: 0,
      totalRepayment: 0,
      schedule: [],
    };
  }

  const r = annualRate / 12 / 100;
  let emi: number;

  if (r === 0) {
    emi = principal / n;
  } else {
    const factor = (1 + r) ** n;
    emi = (principal * r * factor) / (factor - 1);
  }

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= n; month += 1) {
    const interest = balance * r;
    const principalComponent = Math.min(emi - interest, balance);
    const closingBalance = Math.max(balance - principalComponent, 0);

    schedule.push({
      month,
      openingBalance: balance,
      principal: principalComponent,
      interest,
      emi: principalComponent + interest,
      closingBalance,
    });

    balance = closingBalance;
  }

  const totalRepayment = schedule.reduce((sum, row) => sum + row.emi, 0);

  return {
    emi,
    principal,
    totalInterest: totalRepayment - principal,
    totalRepayment,
    schedule,
  };
}
