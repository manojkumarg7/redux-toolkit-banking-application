import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatters';
import { ContentCard } from '../cards/StatCard';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  results: ReactNode;
}

export function CalculatorLayout({ title, description, children, results }: CalculatorLayoutProps) {
  return (
    <div>
      <div className="mb-3">
        <Link to={ROUTES.calculators} className="small text-decoration-none">
          ← Back to Calculators
        </Link>
      </div>
      <div className="row g-4">
        <div className="col-lg-5">
          <ContentCard title={title}>
            <p className="text-muted small mb-3">{description}</p>
            {children}
          </ContentCard>
        </div>
        <div className="col-lg-7">{results}</div>
      </div>
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
  accent?: boolean;
}

export function ResultCard({ label, value, accent }: ResultCardProps) {
  return (
    <div className={`result-card ${accent ? 'accent' : ''}`}>
      <p className="mb-1 small text-muted">{label}</p>
      <p className="mb-0 fw-semibold result-value">{value}</p>
    </div>
  );
}

interface CalculationSummaryProps {
  items: { label: string; value: number | string }[];
}

export function CalculationSummary({ items }: CalculationSummaryProps) {
  return (
    <ContentCard title="Summary">
      <div className="row g-3">
        {items.map((item) => (
          <div key={item.label} className="col-sm-6">
            <ResultCard
              label={item.label}
              value={typeof item.value === 'number' ? formatCurrency(item.value) : item.value}
              accent={item.label.toLowerCase().includes('maturity') || item.label.toLowerCase().includes('emi')}
            />
          </div>
        ))}
      </div>
    </ContentCard>
  );
}
