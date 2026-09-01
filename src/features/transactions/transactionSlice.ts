import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import * as transactionService from '../../services/transactionService';
import type { LoadingState, Transaction, TransactionType } from '../../types';

interface TransactionFilters {
  search: string;
  type: TransactionType | 'all';
  category: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'date' | 'amount';
  sortDir: 'asc' | 'desc';
  page: number;
}

interface TransactionState {
  items: Transaction[];
  status: LoadingState;
  error: string | null;
  filters: TransactionFilters;
}

const initialState: TransactionState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortDir: 'desc',
    page: 1,
  },
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await transactionService.fetchTransactions();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load transactions';
      return rejectWithValue(message);
    }
  },
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactionFilters(state, action: PayloadAction<Partial<TransactionFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      if (!('page' in action.payload)) {
        state.filters.page = 1;
      }
    },
    resetTransactionFilters(state) {
      state.filters = initialState.filters;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to load transactions';
      });
  },
});

export const { setTransactionFilters, resetTransactionFilters, addTransaction } =
  transactionSlice.actions;

export const selectTransactions = (state: RootState) => state.transactions.items;
export const selectTransactionFilters = (state: RootState) => state.transactions.filters;
export const selectTransactionStatus = (state: RootState) => state.transactions.status;

export const selectFilteredTransactions = (state: RootState) => {
  const { items, filters } = state.transactions;
  let result = [...items];

  if (filters.search.trim()) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (txn) =>
        txn.description.toLowerCase().includes(query) ||
        txn.id.toLowerCase().includes(query) ||
        txn.category.toLowerCase().includes(query),
    );
  }

  if (filters.type !== 'all') {
    result = result.filter((txn) => txn.type === filters.type);
  }

  if (filters.category !== 'all') {
    result = result.filter((txn) => txn.category === filters.category);
  }

  if (filters.dateFrom) {
    result = result.filter((txn) => txn.date.slice(0, 10) >= filters.dateFrom);
  }

  if (filters.dateTo) {
    result = result.filter((txn) => txn.date.slice(0, 10) <= filters.dateTo);
  }

  result.sort((a, b) => {
    if (filters.sortBy === 'amount') {
      return filters.sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return filters.sortDir === 'asc' ? aTime - bTime : bTime - aTime;
  });

  return result;
};

export default transactionSlice.reducer;
