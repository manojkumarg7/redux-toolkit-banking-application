import { mockBeneficiaries } from '../data/mockData';
import type { Beneficiary } from '../types';
import { createId, simulateRequest } from './apiClient';

export async function fetchBeneficiaries(): Promise<Beneficiary[]> {
  return simulateRequest([...mockBeneficiaries], 350);
}

export async function createBeneficiary(
  payload: Omit<Beneficiary, 'id' | 'addedAt' | 'status'> & { status?: Beneficiary['status'] },
): Promise<Beneficiary> {
  const beneficiary: Beneficiary = {
    ...payload,
    id: createId('ben'),
    status: payload.status ?? 'pending',
    addedAt: new Date().toISOString().slice(0, 10),
  };
  return simulateRequest(beneficiary, 400);
}

export async function updateBeneficiary(beneficiary: Beneficiary): Promise<Beneficiary> {
  return simulateRequest(beneficiary, 350);
}

export async function deleteBeneficiary(id: string): Promise<string> {
  return simulateRequest(id, 300);
}
