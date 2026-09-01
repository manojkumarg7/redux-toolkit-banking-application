import type { ReactNode } from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md';
  label?: string;
}

export function Spinner({ size = 'md', label = 'Loading' }: SpinnerProps) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-3" role="status">
      <div className={`spinner-border text-primary ${size === 'sm' ? 'spinner-border-sm' : ''}`} />
      <span className="visually-hidden">{label}</span>
      <span className="text-muted small">{label}...</span>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state text-center py-5 px-3">
      <h3 className="h5 mb-2">{title}</h3>
      {description ? <p className="text-muted mb-3">{description}</p> : null}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="alert alert-danger d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2"
      role="alert"
    >
      <span>{message}</span>
      {onRetry ? (
        <button type="button" className="btn btn-sm btn-outline-danger align-self-start align-self-sm-center" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="page-header d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h1 className="page-title mb-1">{title}</h1>
        {subtitle ? <p className="text-muted mb-0">{subtitle}</p> : null}
      </div>
      {actions ? <div className="d-flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'primary';
}

export function StatusBadge({ children, variant = 'secondary' }: BadgeProps) {
  return <span className={`badge text-bg-${variant}`}>{children}</span>;
}
