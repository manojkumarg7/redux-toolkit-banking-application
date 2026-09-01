import type { AmortizationRow } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface AmortizationTableProps {
  rows: AmortizationRow[];
}

export function AmortizationTable({ rows }: AmortizationTableProps) {
  if (rows.length === 0) {
    return <p className="text-muted mb-0">Enter valid loan details to view amortization.</p>;
  }

  return (
    <div className="table-responsive amortization-table">
      <table className="table table-sm align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Opening</th>
            <th scope="col">Principal</th>
            <th scope="col">Interest</th>
            <th scope="col">EMI</th>
            <th scope="col">Closing</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{formatCurrency(row.openingBalance)}</td>
              <td>{formatCurrency(row.principal)}</td>
              <td>{formatCurrency(row.interest)}</td>
              <td>{formatCurrency(row.emi)}</td>
              <td>{formatCurrency(row.closingBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
