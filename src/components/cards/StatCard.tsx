import type { ReactNode } from 'react';
import { formatCurrency } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  accent?: 'teal' | 'navy' | 'gold' | 'green' | 'coral';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  accent = 'teal',
}: StatCardProps) {
  const displayValue = typeof value === 'number' ? formatCurrency(value) : value;

  return (
    <article className={`stat-card stat-card-${accent}`}>
      <div className="d-flex justify-content-between align-items-start gap-2">
        <div>
          <p className="stat-card-title mb-1">{title}</p>
          <p className="stat-card-value mb-1">{displayValue}</p>
          {subtitle ? <p className="stat-card-subtitle mb-0">{subtitle}</p> : null}
          {trendLabel ? (
            <p className={`stat-trend mb-0 mt-2 trend-${trend ?? 'neutral'}`}>{trendLabel}</p>
          ) : null}
        </div>
        {icon ? <div className="stat-card-icon">{icon}</div> : null}
      </div>
    </article>
  );
}

interface ContentCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ContentCard({ title, action, children, className = '' }: ContentCardProps) {
  return (
    <section className={`content-card ${className}`.trim()}>
      {(title || action) && (
        <div className="content-card-header d-flex justify-content-between align-items-center gap-2 mb-3">
          {title ? <h2 className="h6 mb-0">{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
