import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard, StatCard } from '../../components/cards/StatCard';
import { ErrorState, PageHeader, Spinner } from '../../components/common/Feedback';
import { TransactionTable } from '../../components/tables/TransactionTable';
import { ROUTES } from '../../constants/routes';
import { fetchAccounts, selectAccounts } from '../../features/accounts/accountSlice';
import { fetchTransactions, selectTransactions } from '../../features/transactions/transactionSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { maskAccountNumber } from '../../utils/masks';

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAccounts);
  const transactions = useAppSelector(selectTransactions);
  const status = useAppSelector((s) => s.accounts.status);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch, status]);

  const account = accounts.find((item) => item.id === accountId);

  const accountTxns = useMemo(
    () => transactions.filter((txn) => txn.accountId === accountId),
    [transactions, accountId],
  );

  const credits = accountTxns
    .filter((txn) => txn.type === 'credit' && txn.status === 'completed')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const debits = accountTxns
    .filter((txn) => txn.type === 'debit' && txn.status === 'completed')
    .reduce((sum, txn) => sum + txn.amount, 0);

  if (status === 'loading') return <Spinner label="Loading account" />;
  if (!account) {
    return (
      <ErrorState
        message="Account not found."
        onRetry={() => dispatch(fetchAccounts())}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={account.name}
        subtitle={`${maskAccountNumber(account.accountNumber)} · ${account.ifsc}`}
        actions={
          <Link to={ROUTES.accounts} className="btn btn-outline-secondary btn-sm">
            Back to accounts
          </Link>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard title="Available Balance" value={account.balance} accent="navy" />
        </div>
        <div className="col-md-4">
          <StatCard title="Total Credits" value={credits} accent="green" />
        </div>
        <div className="col-md-4">
          <StatCard title="Total Debits" value={debits} accent="coral" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <ContentCard title="Account Information">
            <dl className="detail-list mb-0">
              <div>
                <dt>Account type</dt>
                <dd className="text-capitalize">{account.type.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt>Account number</dt>
                <dd className="font-monospace">{maskAccountNumber(account.accountNumber)}</dd>
              </div>
              <div>
                <dt>IFSC</dt>
                <dd>{account.ifsc}</dd>
              </div>
              <div>
                <dt>Opened on</dt>
                <dd>{formatDate(account.openedAt)}</dd>
              </div>
              {account.interestRate ? (
                <div>
                  <dt>Interest rate</dt>
                  <dd>{account.interestRate}% p.a.</dd>
                </div>
              ) : null}
              {account.maturityDate ? (
                <div>
                  <dt>Maturity date</dt>
                  <dd>{formatDate(account.maturityDate)}</dd>
                </div>
              ) : null}
              <div>
                <dt>Balance</dt>
                <dd>{formatCurrency(account.balance)}</dd>
              </div>
            </dl>
          </ContentCard>
        </div>
        <div className="col-lg-8">
          <ContentCard title="Transaction History">
            {accountTxns.length === 0 ? (
              <p className="text-muted mb-0">No transactions for this account.</p>
            ) : (
              <TransactionTable transactions={accountTxns} />
            )}
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
