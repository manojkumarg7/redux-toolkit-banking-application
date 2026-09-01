import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/Feedback';

interface TransactionTableProps {
  transactions: Transaction[];
}

function statusVariant(status: Transaction['status']) {
  if (status === 'completed') return 'success' as const;
  if (status === 'pending') return 'warning' as const;
  return 'danger' as const;
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <>
      <div className="table-responsive d-none d-md-block">
        <table className="table align-middle transaction-table mb-0">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Type</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td className="font-monospace small">{txn.id}</td>
                <td>{formatDate(txn.date)}</td>
                <td>{txn.description}</td>
                <td>{txn.category}</td>
                <td className="text-capitalize">{txn.type}</td>
                <td className={txn.type === 'credit' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                  {txn.type === 'credit' ? '+' : '-'}
                  {formatCurrency(txn.amount)}
                </td>
                <td>
                  <StatusBadge variant={statusVariant(txn.status)}>{txn.status}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-md-none transaction-cards">
        {transactions.map((txn) => (
          <article key={txn.id} className="transaction-card">
            <div className="d-flex justify-content-between gap-2 mb-1">
              <strong>{txn.description}</strong>
              <StatusBadge variant={statusVariant(txn.status)}>{txn.status}</StatusBadge>
            </div>
            <p className="small text-muted mb-2">
              {formatDate(txn.date)} · {txn.category}
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="font-monospace small">{txn.id}</span>
              <span className={txn.type === 'credit' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                {txn.type === 'credit' ? '+' : '-'}
                {formatCurrency(txn.amount)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
