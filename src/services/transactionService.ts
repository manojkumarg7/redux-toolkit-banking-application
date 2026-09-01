import { mockTransactions } from '../data/mockData';
import type { Transaction } from '../types';
import { createId, simulateRequest } from './apiClient';

export async function fetchTransactions(): Promise<Transaction[]> {
  return simulateRequest([...mockTransactions], 450);
}

export async function createTransaction(
  payload: Omit<Transaction, 'id'>,
): Promise<Transaction> {
  const transaction: Transaction = {
    ...payload,
    id: createId('txn'),
  };
  return simulateRequest(transaction, 350);
}
