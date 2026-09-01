import type { TransferPayload, TransferRecord } from '../types';
import { createId, simulateFailure, simulateRequest } from './apiClient';

export async function submitTransfer(payload: TransferPayload): Promise<TransferRecord> {
  if (payload.amount <= 0) {
    return simulateFailure('Transfer amount must be greater than zero.');
  }

  if (!payload.fromAccountId || !payload.beneficiaryId) {
    return simulateFailure('Please select account and beneficiary.');
  }

  const record: TransferRecord = {
    ...payload,
    id: createId('trf'),
    status: 'completed',
    createdAt: new Date().toISOString(),
    reference: `FIN${Date.now().toString().slice(-8)}`,
  };

  return simulateRequest(record, 800);
}
