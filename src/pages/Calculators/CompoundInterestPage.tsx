import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CalculationSummary, CalculatorLayout } from '../../components/forms/CalculatorShared';
import { CalculatorInput, SelectField } from '../../components/forms/FormControls';
import { COMPOUNDING_OPTIONS } from '../../constants';
import {
  selectCompoundCalculator,
  setCompoundInputs,
} from '../../features/calculators/calculatorSlice';
import type { CompoundingFrequency } from '../../types';

export default function CompoundInterestPage() {
  const dispatch = useAppDispatch();
  const { principal, rate, time, frequency, result } = useAppSelector(selectCompoundCalculator);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (principal <= 0) next.principal = 'Principal must be greater than 0.';
    if (rate < 0) next.rate = 'Rate cannot be negative.';
    if (time <= 0) next.time = 'Time must be greater than 0.';
    return next;
  }, [principal, rate, time]);

  return (
    <CalculatorLayout
      title="Compound Interest Calculator"
      description="A = P(1 + R/n)^(nt)"
      results={
        <CalculationSummary
          items={[
            { label: 'Principal', value: result.principal },
            { label: 'Interest earned', value: result.interest },
            { label: 'Maturity amount', value: result.maturityAmount },
          ]}
        />
      }
    >
      <CalculatorInput
        label="Principal (₹)"
        min={0}
        value={principal}
        error={errors.principal}
        onValueChange={(value) => dispatch(setCompoundInputs({ principal: value }))}
      />
      <CalculatorInput
        label="Interest rate (% p.a.)"
        min={0}
        step={0.1}
        value={rate}
        error={errors.rate}
        onValueChange={(value) => dispatch(setCompoundInputs({ rate: value }))}
      />
      <CalculatorInput
        label="Time (years)"
        min={0}
        step={0.5}
        value={time}
        error={errors.time}
        onValueChange={(value) => dispatch(setCompoundInputs({ time: value }))}
      />
      <SelectField
        label="Compounding frequency"
        id="compound-frequency"
        value={frequency}
        onChange={(e) =>
          dispatch(setCompoundInputs({ frequency: e.target.value as CompoundingFrequency }))
        }
        options={COMPOUNDING_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
      />
    </CalculatorLayout>
  );
}
