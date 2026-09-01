import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard } from '../../components/cards/StatCard';
import { SplitBarChart } from '../../components/charts/Charts';
import { CalculationSummary, CalculatorLayout } from '../../components/forms/CalculatorShared';
import { CalculatorInput, SelectField } from '../../components/forms/FormControls';
import { AmortizationTable } from '../../components/tables/AmortizationTable';
import { selectEmiCalculator, setEmiInputs } from '../../features/calculators/calculatorSlice';
import type { TenureUnit } from '../../types';

export default function LoanEmiPage() {
  const dispatch = useAppDispatch();
  const { principal, rate, tenure, unit, result } = useAppSelector(selectEmiCalculator);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (principal <= 0) next.principal = 'Loan amount must be greater than 0.';
    if (rate < 0) next.rate = 'Rate cannot be negative.';
    if (tenure <= 0) next.tenure = 'Tenure must be greater than 0.';
    return next;
  }, [principal, rate, tenure]);

  return (
    <CalculatorLayout
      title="Loan EMI Calculator"
      description="EMI = P × r × (1+r)^n / ((1+r)^n − 1)"
      results={
        <>
          <CalculationSummary
            items={[
              { label: 'Monthly EMI', value: result.emi },
              { label: 'Principal amount', value: result.principal },
              { label: 'Total interest', value: result.totalInterest },
              { label: 'Total repayment', value: result.totalRepayment },
            ]}
          />
          <ContentCard title="Principal vs Interest" className="mt-4">
            <SplitBarChart
              leftLabel="Principal"
              rightLabel="Interest"
              leftValue={result.principal}
              rightValue={result.totalInterest}
            />
          </ContentCard>
          <ContentCard title="Amortization schedule" className="mt-4">
            <AmortizationTable rows={result.schedule.slice(0, 60)} />
            {result.schedule.length > 60 ? (
              <p className="small text-muted mt-2 mb-0">
                Showing first 60 of {result.schedule.length} months.
              </p>
            ) : null}
          </ContentCard>
        </>
      }
    >
      <CalculatorInput
        label="Loan amount (₹)"
        min={0}
        value={principal}
        error={errors.principal}
        onValueChange={(value) => dispatch(setEmiInputs({ principal: value }))}
      />
      <CalculatorInput
        label="Annual interest rate (%)"
        min={0}
        step={0.1}
        value={rate}
        error={errors.rate}
        onValueChange={(value) => dispatch(setEmiInputs({ rate: value }))}
      />
      <CalculatorInput
        label="Loan tenure"
        min={0}
        value={tenure}
        error={errors.tenure}
        onValueChange={(value) => dispatch(setEmiInputs({ tenure: value }))}
      />
      <SelectField
        label="Tenure unit"
        id="tenure-unit"
        value={unit}
        onChange={(e) => dispatch(setEmiInputs({ unit: e.target.value as TenureUnit }))}
        options={[
          { value: 'years', label: 'Years' },
          { value: 'months', label: 'Months' },
        ]}
      />
    </CalculatorLayout>
  );
}
