import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as accountService from '../../services/accountService';
import type { Account, LoadingState } from '../../types';
import type { RootState } from '../../app/store';

interface AccountState {
  items: Account[];
  selectedAccountId: string | null;
  status: LoadingState;
  error: string | null;
}

const initialState: AccountState = {
  items: [],
  selectedAccountId: null,
  status: 'idle',
  error: null,
};

export const fetchAccounts = createAsyncThunk('accounts/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await accountService.fetchAccounts();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load accounts';
    return rejectWithValue(message);
  }
});

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    selectAccount(state, action: PayloadAction<string | null>) {
      state.selectedAccountId = action.payload;
    },
    updateAccountBalance(
      state,
      action: PayloadAction<{ accountId: string; amount: number; type: 'credit' | 'debit' }>,
    ) {
      const account = state.items.find((item) => item.id === action.payload.accountId);
      if (!account) return;
      account.balance +=
        action.payload.type === 'credit' ? action.payload.amount : -action.payload.amount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to load accounts';
      });
  },
});

export const { selectAccount, updateAccountBalance } = accountSlice.actions;

export const selectAccounts = (state: RootState) => state.accounts.items;
export const selectAccountStatus = (state: RootState) => state.accounts.status;
export const selectTotalBalance = (state: RootState) =>
  state.accounts.items.reduce((sum, account) => sum + account.balance, 0);
export const selectAccountById = (id: string) => (state: RootState) =>
  state.accounts.items.find((account) => account.id === id);

export default accountSlice.reducer;
