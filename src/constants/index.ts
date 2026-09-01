import type { CompoundingFrequency, TransferType } from '../types';

export const APP_NAME = 'FinBank';

export const DEMO_CREDENTIALS = {
  identifier: 'CUST1001',
  email: 'alex.morgan@finbank.demo',
  password: 'Demo@1234',
} as const;

export const CURRENCY = 'INR';

export const TRANSACTION_CATEGORIES = [
  'Salary',
  'Food',
  'Shopping',
  'Travel',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Investment',
  'Transfer',
  'Rent',
  'Education',
  'Other',
] as const;

export const TRANSFER_TYPES: TransferType[] = ['IMPS', 'NEFT', 'RTGS'];

export const COMPOUNDING_OPTIONS: { value: CompoundingFrequency; label: string; periods: number }[] = [
  { value: 'annually', label: 'Annually', periods: 1 },
  { value: 'semi-annually', label: 'Semi-Annually', periods: 2 },
  { value: 'quarterly', label: 'Quarterly', periods: 4 },
  { value: 'monthly', label: 'Monthly', periods: 12 },
];

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
] as const;

export const PAGE_SIZE = 8;

export const AUTH_STORAGE_KEY = 'finbank_auth';
export const REMEMBER_STORAGE_KEY = 'finbank_remember';
