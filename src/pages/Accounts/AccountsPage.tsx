import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard } from '../../components/cards/StatCard';
import { ErrorState, PageHeader, Spinner, StatusBadge } from '../../components/common/Feedback';
import { IconChevronRight, IconLandmark, IconPiggy, IconWallet } from '../../components/common/Icons';
import { ROUTES } from '../../constants/routes';
import { fetchAccounts, selectAccounts } from '../../features/accounts/accountSlice';
import { selectTransactions } from '../../features/transactions/transactionSlice';
import { fetchTransactions } from '../../features/transactions/transactionSlice';
import type { Account } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { maskAccountNumber } from '../../utils/masks';

function accountIcon(type: Account['type']) {
  if (type === 'savings') return <IconPiggy />;
  if (type === 'fixed_deposit') return <IconLandmark />;
  return <IconWallet />;
}

function typeLabel(type: Account['type']) {
  if (type === 'savings') return 'Savings Account';
  if (type === 'current') return 'Current Account';
  return 'Fixed Deposit';
}

export default function AccountsPage() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAccounts);
  const transactions = useAppSelector(selectTransactions);
  const status = useAppSelector((s) => s.accounts.status);
  const error = useAppSelector((s) => s.accounts.error);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch, status]);

  if (status === 'loading') return <Spinner label="Loading accounts" />;
  if (status === 'failed') {
    return <ErrorState message={error ?? 'Failed to load accounts'} onRetry={() => dispatch(fetchAccounts())} />;
  }

  return (
    <div>
      <PageHeader title="Accounts" subtitle="Overview of your demo FinBank accounts" />
      <div className="row g-4">
        {accounts.map((account) => {
          const recent = transactions
            .filter((txn) => txn.accountId === account.id)
            .slice(0, 2);

          return (
            <div key={account.id} className="col-md-6 col-xl-4">
              <ContentCard>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="account-icon">{accountIcon(account.type)}</span>
                    <div>
                      <h2 className="h6 mb-0">{account.name}</h2>
                      <StatusBadge variant="info">{typeLabel(account.type)}</StatusBadge>
                    </div>
                  </div>
                </div>
                <p className="font-monospace mb-1">{maskAccountNumber(account.accountNumber)}</p>
                <p className="small text-muted mb-3">IFSC: {account.ifsc}</p>
                <p className="display-amount mb-3">{formatCurrency(account.balance)}</p>
                <p className="small text-muted mb-2">Recent activity</p>
                {recent.length === 0 ? (
                  <p className="small text-muted">No recent activity</p>
                ) : (
                  <ul className="list-unstyled small mb-3">
                    {recent.map((txn) => (
                      <li key={txn.id} className="d-flex justify-content-between py-1">
                        <span>{txn.description}</span>
                        <span>{formatDate(txn.date)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  to={ROUTES.accountDetail.replace(':accountId', account.id)}
                  className="btn btn-outline-primary btn-sm w-100 d-inline-flex align-items-center justify-content-center gap-1"
                >
                  View details <IconChevronRight size={16} />
                </Link>
              </ContentCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
