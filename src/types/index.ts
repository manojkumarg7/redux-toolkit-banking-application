export type AccountType = 'savings' | 'current' | 'fixed_deposit';

export type TransactionType = 'credit' | 'debit';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export type TransferType = 'IMPS' | 'NEFT' | 'RTGS';

export type TransferStep = 'form' | 'confirm' | 'success';

export type CompoundingFrequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly';

export type TenureUnit = 'years' | 'months';

export type BeneficiaryStatus = 'active' | 'pending' | 'inactive';

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface User {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  joinedAt: string;
}

export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  type: AccountType;
  balance: number;
  ifsc: string;
  currency: string;
  openedAt: string;
  interestRate?: number;
  maturityDate?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reference?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  ifsc: string;
  status: BeneficiaryStatus;
  nickname?: string;
  addedAt: string;
}

export interface TransferPayload {
  fromAccountId: string;
  beneficiaryId: string;
  amount: number;
  transferType: TransferType;
  description: string;
}

export interface TransferRecord extends TransferPayload {
  id: string;
  status: TransactionStatus;
  createdAt: string;
  reference: string;
}

export interface UpcomingPayment {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category: string;
}

export interface MonthlyFlow {
  month: string;
  income: number;
  expense: number;
}

export interface SpendingCategory {
  category: string;
  amount: number;
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ProfileSettings {
  emailNotifications: boolean;
  transactionNotifications: boolean;
  loginAlerts: boolean;
  darkMode: boolean;
  language: string;
}

export interface AmortizationRow {
  month: number;
  openingBalance: number;
  principal: number;
  interest: number;
  emi: number;
  closingBalance: number;
}

export interface SimpleInterestResult {
  principal: number;
  interest: number;
  maturityAmount: number;
}

export interface CompoundInterestResult {
  principal: number;
  interest: number;
  maturityAmount: number;
}

export interface EmiResult {
  emi: number;
  principal: number;
  totalInterest: number;
  totalRepayment: number;
  schedule: AmortizationRow[];
}

export interface FdResult {
  investedAmount: number;
  interest: number;
  maturityAmount: number;
  maturityDate: string;
  yearlyGrowth: { year: number; amount: number }[];
}

export interface RdResult {
  totalDeposited: number;
  interest: number;
  maturityAmount: number;
  contribution: number;
}

export interface AuthCredentials {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
}
