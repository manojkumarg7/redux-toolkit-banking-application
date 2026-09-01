import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard } from '../../components/cards/StatCard';
import { SimpleLineChart } from '../../components/charts/Charts';
import { CalculationSummary, CalculatorLayout } from '../../components/forms/CalculatorShared';
import { CalculatorInput, SelectField } from '../../components/forms/FormControls';
import { COMPOUNDING_OPTIONS } from '../../constants';
import { selectFdCalculator, setFdInputs } from '../../features/calculators/calculatorSlice';
import type { CompoundingFrequency } from '../../types';

export default function FixedDepositPage() {
  const dispatch = useAppDispatch();
  const { deposit, rate, tenure, frequency, result } = useAppSelector(selectFdCalculator);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (deposit <= 0) next.deposit = 'Deposit amount must be greater than 0.';
    if (rate < 0) next.rate = 'Rate cannot be negative.';
    if (tenure <= 0) next.tenure = 'Tenure must be greater than 0.';
    return next;
  }, [deposit, rate, tenure]);

  return (
    <CalculatorLayout
      title="Fixed Deposit Calculator"
      description="Estimate FD maturity with compounding frequency and tenure."
      results={
        <>
          <CalculationSummary
            items={[
              { label: 'Invested amount', value: result.investedAmount },
              { label: 'Estimated interest', value: result.interest },
              { label: 'Maturity amount', value: result.maturityAmount },
              { label: 'Maturity date', value: result.maturityDate || '—' },
            ]}
          />
          <ContentCard title="Yearly growth" className="mt-4">
            <SimpleLineChart
              points={result.yearlyGrowth.map((item) => ({
                label: `Y${item.year}`,
                value: item.amount,
              }))}
            />
          </ContentCard>
        </>
      }
    >
      <CalculatorInput
        label="Deposit amount (₹)"
        min={0}
        value={deposit}
        error={errors.deposit}
        onValueChange={(value) => dispatch(setFdInputs({ deposit: value }))}
      />
      <CalculatorInput
        label="Interest rate (% p.a.)"
        min={0}
        step={0.1}
        value={rate}
        error={errors.rate}
        onValueChange={(value) => dispatch(setFdInputs({ rate: value }))}
      />
      <CalculatorInput
        label="Tenure (years)"
        min={0}
        step={0.5}
        value={tenure}
        error={errors.tenure}
        onValueChange={(value) => dispatch(setFdInputs({ tenure: value }))}
      />
      <SelectField
        label="Compounding frequency"
        id="fd-frequency"
        value={frequency}
        onChange={(e) => dispatch(setFdInputs({ frequency: e.target.value as CompoundingFrequency }))}
        options={COMPOUNDING_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
      />
    </CalculatorLayout>
  );
}
