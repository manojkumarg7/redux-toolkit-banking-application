import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Spinner } from '../components/common/Feedback';
import { ROUTES } from '../constants/routes';
import { ProtectedRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const AccountsPage = lazy(() => import('../pages/Accounts/AccountsPage'));
const AccountDetailPage = lazy(() => import('../pages/Accounts/AccountDetailPage'));
const TransactionsPage = lazy(() => import('../pages/Transactions/TransactionsPage'));
const TransfersPage = lazy(() => import('../pages/Transfers/TransfersPage'));
const BeneficiariesPage = lazy(() => import('../pages/Beneficiaries/BeneficiariesPage'));
const CalculatorsPage = lazy(() => import('../pages/Calculators/CalculatorsPage'));
const SimpleInterestPage = lazy(() => import('../pages/Calculators/SimpleInterestPage'));
const CompoundInterestPage = lazy(() => import('../pages/Calculators/CompoundInterestPage'));
const LoanEmiPage = lazy(() => import('../pages/Calculators/LoanEmiPage'));
const FixedDepositPage = lazy(() => import('../pages/Calculators/FixedDepositPage'));
const RecurringDepositPage = lazy(() => import('../pages/Calculators/RecurringDepositPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));

function LazyFallback() {
  return <Spinner label="Loading page" />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LazyFallback />}>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.accounts} element={<AccountsPage />} />
            <Route path={ROUTES.accountDetail} element={<AccountDetailPage />} />
            <Route path={ROUTES.transactions} element={<TransactionsPage />} />
            <Route path={ROUTES.transfers} element={<TransfersPage />} />
            <Route path={ROUTES.beneficiaries} element={<BeneficiariesPage />} />
            <Route path={ROUTES.calculators} element={<CalculatorsPage />} />
            <Route path={ROUTES.simpleInterest} element={<SimpleInterestPage />} />
            <Route path={ROUTES.compoundInterest} element={<CompoundInterestPage />} />
            <Route path={ROUTES.loanEmi} element={<LoanEmiPage />} />
            <Route path={ROUTES.fixedDeposit} element={<FixedDepositPage />} />
            <Route path={ROUTES.recurringDeposit} element={<RecurringDepositPage />} />
            <Route path={ROUTES.profile} element={<ProfilePage />} />
            <Route path={ROUTES.settings} element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </Suspense>
  );
}
