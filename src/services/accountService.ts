import { mockAccounts } from '../data/mockData';
import type { Account } from '../types';
import { simulateRequest } from './apiClient';

export async function fetchAccounts(): Promise<Account[]> {
  return simulateRequest([...mockAccounts], 400);
}

export async function fetchAccountById(accountId: string): Promise<Account | undefined> {
  const account = mockAccounts.find((item) => item.id === accountId);
  return simulateRequest(account, 300);
}
