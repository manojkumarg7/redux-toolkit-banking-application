import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import * as transferService from '../../services/transferService';
import type { LoadingState, TransferPayload, TransferRecord, TransferStep } from '../../types';
import { updateAccountBalance } from '../accounts/accountSlice';
import { addTransaction } from '../transactions/transactionSlice';
import { createId } from '../../services/apiClient';

interface TransferState {
  draft: TransferPayload;
  step: TransferStep;
  lastTransfer: TransferRecord | null;
  history: TransferRecord[];
  status: LoadingState;
  error: string | null;
}

const emptyDraft: TransferPayload = {
  fromAccountId: '',
  beneficiaryId: '',
  amount: 0,
  transferType: 'IMPS',
  description: '',
};

const initialState: TransferState = {
  draft: emptyDraft,
  step: 'form',
  lastTransfer: null,
  history: [],
  status: 'idle',
  error: null,
};

export const executeTransfer = createAsyncThunk(
  'transfers/execute',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const payload = state.transfers.draft;
      const record = await transferService.submitTransfer(payload);

      dispatch(
        updateAccountBalance({
          accountId: payload.fromAccountId,
          amount: payload.amount,
          type: 'debit',
        }),
      );

      dispatch(
        addTransaction({
          id: createId('txn'),
          accountId: payload.fromAccountId,
          date: record.createdAt,
          description: payload.description || `${payload.transferType} Transfer`,
          category: 'Transfer',
          type: 'debit',
          amount: payload.amount,
          status: 'completed',
          reference: record.reference,
        }),
      );

      return record;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transfer failed';
      return rejectWithValue(message);
    }
  },
);

const transferSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {
    updateTransferDraft(state, action: PayloadAction<Partial<TransferPayload>>) {
      state.draft = { ...state.draft, ...action.payload };
      state.error = null;
    },
    setTransferStep(state, action: PayloadAction<TransferStep>) {
      state.step = action.payload;
    },
    resetTransfer(state) {
      state.draft = emptyDraft;
      state.step = 'form';
      state.lastTransfer = null;
      state.status = 'idle';
      state.error = null;
    },
    clearTransferError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeTransfer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(executeTransfer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastTransfer = action.payload;
        state.history.unshift(action.payload);
        state.step = 'success';
      })
      .addCase(executeTransfer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Transfer failed';
      });
  },
});

export const { updateTransferDraft, setTransferStep, resetTransfer, clearTransferError } =
  transferSlice.actions;

export const selectTransferDraft = (state: RootState) => state.transfers.draft;
export const selectTransferStep = (state: RootState) => state.transfers.step;
export const selectLastTransfer = (state: RootState) => state.transfers.lastTransfer;
export const selectTransferStatus = (state: RootState) => state.transfers.status;
export const selectTransferError = (state: RootState) => state.transfers.error;

export default transferSlice.reducer;
