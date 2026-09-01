import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard } from '../../components/cards/StatCard';
import { SplitBarChart } from '../../components/charts/Charts';
import { CalculationSummary, CalculatorLayout } from '../../components/forms/CalculatorShared';
import { CalculatorInput } from '../../components/forms/FormControls';
import { selectRdCalculator, setRdInputs } from '../../features/calculators/calculatorSlice';

export default function RecurringDepositPage() {
  const dispatch = useAppDispatch();
  const { monthlyDeposit, rate, tenureMonths, result } = useAppSelector(selectRdCalculator);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (monthlyDeposit <= 0) next.monthlyDeposit = 'Monthly deposit must be greater than 0.';
    if (rate < 0) next.rate = 'Rate cannot be negative.';
    if (tenureMonths <= 0) next.tenureMonths = 'Tenure must be greater than 0.';
    return next;
  }, [monthlyDeposit, rate, tenureMonths]);

  return (
    <CalculatorLayout
      title="Recurring Deposit Calculator"
      description="Estimate RD maturity from monthly deposits and interest rate."
      results={
        <>
          <CalculationSummary
            items={[
              { label: 'Total deposited', value: result.totalDeposited },
              { label: 'Estimated interest', value: result.interest },
              { label: 'Maturity amount', value: result.maturityAmount },
            ]}
          />
          <ContentCard title="Contribution vs Interest" className="mt-4">
            <SplitBarChart
              leftLabel="Contribution"
              rightLabel="Interest"
              leftValue={result.contribution}
              rightValue={result.interest}
              leftColor="#0d6e6e"
              rightColor="#2d6a4f"
            />
          </ContentCard>
        </>
      }
    >
      <CalculatorInput
        label="Monthly deposit (₹)"
        min={0}
        value={monthlyDeposit}
        error={errors.monthlyDeposit}
        onValueChange={(value) => dispatch(setRdInputs({ monthlyDeposit: value }))}
      />
      <CalculatorInput
        label="Interest rate (% p.a.)"
        min={0}
        step={0.1}
        value={rate}
        error={errors.rate}
        onValueChange={(value) => dispatch(setRdInputs({ rate: value }))}
      />
      <CalculatorInput
        label="Tenure (months)"
        min={0}
        value={tenureMonths}
        error={errors.tenureMonths}
        onValueChange={(value) => dispatch(setRdInputs({ tenureMonths: value }))}
      />
    </CalculatorLayout>
  );
}
