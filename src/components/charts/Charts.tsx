import type { MonthlyFlow, SpendingCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface IncomeExpenseChartProps {
  data: MonthlyFlow[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const max = Math.max(...data.flatMap((item) => [item.income, item.expense]), 1);

  return (
    <div className="chart-panel" role="img" aria-label="Income versus expense chart">
      <div className="d-flex gap-3 mb-3 small">
        <span className="legend-item">
          <span className="legend-swatch bg-income" /> Income
        </span>
        <span className="legend-item">
          <span className="legend-swatch bg-expense" /> Expense
        </span>
      </div>
      <div className="bar-chart">
        {data.map((item) => (
          <div key={item.month} className="bar-group">
            <div className="bar-pair">
              <div
                className="bar bar-income"
                style={{ height: `${(item.income / max) * 100}%` }}
                title={`Income ${formatCurrency(item.income)}`}
              />
              <div
                className="bar bar-expense"
                style={{ height: `${(item.expense / max) * 100}%` }}
                title={`Expense ${formatCurrency(item.expense)}`}
              />
            </div>
            <span className="bar-label">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SpendingDonutProps {
  data: SpendingCategory[];
}

export function SpendingDonutChart({ data }: SpendingDonutProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0) || 1;
  const gradientStops = data
    .reduce<{ stops: string[]; cumulative: number }>(
      (acc, item) => {
        const start = (acc.cumulative / total) * 100;
        const nextCumulative = acc.cumulative + item.amount;
        const end = (nextCumulative / total) * 100;
        acc.stops.push(`${item.color} ${start}% ${end}%`);
        return { stops: acc.stops, cumulative: nextCumulative };
      },
      { stops: [], cumulative: 0 },
    )
    .stops.join(', ');

  return (
    <div className="donut-chart-wrap">
      <div
        className="donut-chart"
        style={{ background: `conic-gradient(${gradientStops})` }}
        role="img"
        aria-label="Spending by category"
      >
        <div className="donut-center">
          <span className="small text-muted">Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
      <ul className="donut-legend list-unstyled mb-0">
        {data.map((item) => (
          <li key={item.category} className="d-flex justify-content-between gap-2 py-1">
            <span className="d-flex align-items-center gap-2">
              <span className="legend-swatch" style={{ background: item.color }} />
              {item.category}
            </span>
            <span className="text-muted">{formatCurrency(item.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface LineChartProps {
  points: { label: string; value: number }[];
  color?: string;
}

export function SimpleLineChart({ points, color = '#0d6e6e' }: LineChartProps) {
  if (points.length === 0) return null;

  const width = 360;
  const height = 160;
  const padding = 20;
  const max = Math.max(...points.map((p) => p.value), 1);
  const min = Math.min(...points.map((p) => p.value), 0);
  const range = max - min || 1;

  const coords = points.map((point, index) => {
    const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
    return { x, y, ...point };
  });

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-100 line-chart" role="img" aria-label="Growth chart">
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" />
      {coords.map((c) => (
        <circle key={c.label} cx={c.x} cy={c.y} r="3.5" fill={color} />
      ))}
    </svg>
  );
}

interface SplitBarProps {
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
  leftColor?: string;
  rightColor?: string;
}

export function SplitBarChart({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  leftColor = '#0d6e6e',
  rightColor = '#f0a202',
}: SplitBarProps) {
  const total = leftValue + rightValue || 1;
  const leftPct = (leftValue / total) * 100;

  return (
    <div>
      <div className="split-bar" aria-hidden="true">
        <div style={{ width: `${leftPct}%`, background: leftColor }} />
        <div style={{ width: `${100 - leftPct}%`, background: rightColor }} />
      </div>
      <div className="d-flex justify-content-between small mt-2">
        <span>
          {leftLabel}: {formatCurrency(leftValue)}
        </span>
        <span>
          {rightLabel}: {formatCurrency(rightValue)}
        </span>
      </div>
    </div>
  );
}
