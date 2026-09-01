import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CalculationSummary, CalculatorLayout } from '../../components/forms/CalculatorShared';
import { CalculatorInput } from '../../components/forms/FormControls';
import { selectSimpleCalculator, setSimpleInputs } from '../../features/calculators/calculatorSlice';

export default function SimpleInterestPage() {
  const dispatch = useAppDispatch();
  const { principal, rate, time, result } = useAppSelector(selectSimpleCalculator);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (principal <= 0) next.principal = 'Principal must be greater than 0.';
    if (rate < 0) next.rate = 'Rate cannot be negative.';
    if (time <= 0) next.time = 'Time must be greater than 0.';
    return next;
  }, [principal, rate, time]);

  return (
    <CalculatorLayout
      title="Simple Interest Calculator"
      description="SI = (P × R × T) / 100 · Maturity = P + SI"
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
        onValueChange={(value) => dispatch(setSimpleInputs({ principal: value }))}
      />
      <CalculatorInput
        label="Interest rate (% p.a.)"
        min={0}
        step={0.1}
        value={rate}
        error={errors.rate}
        onValueChange={(value) => dispatch(setSimpleInputs({ rate: value }))}
      />
      <CalculatorInput
        label="Time (years)"
        min={0}
        step={0.5}
        value={time}
        error={errors.time}
        onValueChange={(value) => dispatch(setSimpleInputs({ time: value }))}
      />
    </CalculatorLayout>
  );
}
