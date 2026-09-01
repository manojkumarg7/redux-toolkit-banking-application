import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard, StatCard } from '../../components/cards/StatCard';
import { IncomeExpenseChart, SpendingDonutChart } from '../../components/charts/Charts';
import { Spinner, ErrorState } from '../../components/common/Feedback';
import {
  IconCalculator,
  IconPlus,
  IconTransactions,
  IconTransfer,
  IconTrendDown,
  IconTrendUp,
  IconWallet,
} from '../../components/common/Icons';
import { TransactionTable } from '../../components/tables/TransactionTable';
import { ROUTES } from '../../constants/routes';
import {
  mockMonthlyExpenses,
  mockMonthlyFlow,
  mockMonthlyIncome,
  mockSpendingCategories,
  mockUpcomingPayments,
} from '../../data/mockData';
import { fetchAccounts, selectAccounts, selectTotalBalance } from '../../features/accounts/accountSlice';
import { fetchTransactions, selectTransactions } from '../../features/transactions/transactionSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAccounts);
  const totalBalance = useAppSelector(selectTotalBalance);
  const transactions = useAppSelector(selectTransactions);
  const accountStatus = useAppSelector((s) => s.accounts.status);
  const txnStatus = useAppSelector((s) => s.transactions.status);

  useEffect(() => {
    if (accountStatus === 'idle') dispatch(fetchAccounts());
    if (txnStatus === 'idle') dispatch(fetchTransactions());
  }, [dispatch, accountStatus, txnStatus]);

  if (accountStatus === 'loading' || txnStatus === 'loading') {
    return <Spinner label="Loading dashboard" />;
  }

  if (accountStatus === 'failed' || txnStatus === 'failed') {
    return (
      <ErrorState
        message="Unable to load dashboard data."
        onRetry={() => {
          dispatch(fetchAccounts());
          dispatch(fetchTransactions());
        }}
      />
    );
  }

  const savings = accounts.find((a) => a.type === 'savings')?.balance ?? 0;
  const current = accounts.find((a) => a.type === 'current')?.balance ?? 0;
  const investments = accounts.find((a) => a.type === 'fixed_deposit')?.balance ?? 0;
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-4 col-xl-4">
          <StatCard title="Total Balance" value={totalBalance} icon={<IconWallet />} accent="navy" trendLabel="Across all accounts" />
        </div>
        <div className="col-6 col-lg-4 col-xl-4">
          <StatCard title="Savings" value={savings} icon={<IconTrendUp />} accent="teal" />
        </div>
        <div className="col-6 col-lg-4 col-xl-4">
          <StatCard title="Current Account" value={current} icon={<IconWallet />} accent="green" />
        </div>
        <div className="col-6 col-lg-4 col-xl-4">
          <StatCard title="Investments" value={investments} icon={<IconTrendUp />} accent="gold" />
        </div>
        <div className="col-6 col-lg-4 col-xl-4">
          <StatCard
            title="Monthly Income"
            value={mockMonthlyIncome}
            icon={<IconTrendUp />}
            accent="teal"
            trend="up"
            trendLabel="+8.2% vs last month"
          />
        </div>
        <div className="col-6 col-lg-4 col-xl-4">
          <StatCard
            title="Monthly Expenses"
            value={mockMonthlyExpenses}
            icon={<IconTrendDown />}
            accent="coral"
            trend="down"
            trendLabel="-3.1% vs last month"
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <ContentCard title="Income vs Expense">
            <IncomeExpenseChart data={mockMonthlyFlow} />
          </ContentCard>
        </div>
        <div className="col-lg-4">
          <ContentCard title="Spending Categories">
            <SpendingDonutChart data={mockSpendingCategories} />
          </ContentCard>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <ContentCard
            title="Recent Transactions"
            action={
              <Link to={ROUTES.transactions} className="btn btn-sm btn-outline-primary">
                View all
              </Link>
            }
          >
            <TransactionTable transactions={recent} />
          </ContentCard>
        </div>
        <div className="col-lg-4">
          <ContentCard title="Quick Actions" className="mb-4">
            <div className="quick-actions">
              <Link to={ROUTES.transfers} className="quick-action">
                <IconTransfer size={18} /> Transfer Money
              </Link>
              <Link to={ROUTES.beneficiaries} className="quick-action">
                <IconPlus size={18} /> Add Beneficiary
              </Link>
              <Link to={ROUTES.simpleInterest} className="quick-action">
                <IconCalculator size={18} /> Interest Calculator
              </Link>
              <Link to={ROUTES.loanEmi} className="quick-action">
                <IconCalculator size={18} /> Loan Calculator
              </Link>
              <Link to={ROUTES.transactions} className="quick-action">
                <IconTransactions size={18} /> View Transactions
              </Link>
            </div>
          </ContentCard>

          <ContentCard title="Account Summary" className="mb-4">
            <ul className="list-unstyled mb-0 account-summary-list">
              {accounts.map((account) => (
                <li key={account.id} className="d-flex justify-content-between py-2 border-bottom">
                  <span>{account.name}</span>
                  <strong>{formatCurrency(account.balance)}</strong>
                </li>
              ))}
            </ul>
          </ContentCard>

          <ContentCard title="Upcoming Payments">
            <ul className="list-unstyled mb-0">
              {mockUpcomingPayments.map((payment) => (
                <li key={payment.id} className="d-flex justify-content-between gap-2 py-2 border-bottom">
                  <div>
                    <strong className="d-block">{payment.title}</strong>
                    <span className="small text-muted">Due {formatDate(payment.dueDate)}</span>
                  </div>
                  <span className="fw-semibold">{formatCurrency(payment.amount)}</span>
                </li>
              ))}
            </ul>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
