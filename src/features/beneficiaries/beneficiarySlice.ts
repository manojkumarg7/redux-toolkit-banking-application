import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import * as beneficiaryService from '../../services/beneficiaryService';
import type { Beneficiary, LoadingState } from '../../types';

interface BeneficiaryState {
  items: Beneficiary[];
  status: LoadingState;
  error: string | null;
  search: string;
}

const initialState: BeneficiaryState = {
  items: [],
  status: 'idle',
  error: null,
  search: '',
};

export const fetchBeneficiaries = createAsyncThunk(
  'beneficiaries/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await beneficiaryService.fetchBeneficiaries();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load beneficiaries';
      return rejectWithValue(message);
    }
  },
);

export const addBeneficiary = createAsyncThunk(
  'beneficiaries/add',
  async (
    payload: Omit<Beneficiary, 'id' | 'addedAt' | 'status'> & { status?: Beneficiary['status'] },
    { rejectWithValue },
  ) => {
    try {
      return await beneficiaryService.createBeneficiary(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add beneficiary';
      return rejectWithValue(message);
    }
  },
);

export const editBeneficiary = createAsyncThunk(
  'beneficiaries/edit',
  async (payload: Beneficiary, { rejectWithValue }) => {
    try {
      return await beneficiaryService.updateBeneficiary(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update beneficiary';
      return rejectWithValue(message);
    }
  },
);

export const removeBeneficiary = createAsyncThunk(
  'beneficiaries/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      return await beneficiaryService.deleteBeneficiary(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete beneficiary';
      return rejectWithValue(message);
    }
  },
);

const beneficiarySlice = createSlice({
  name: 'beneficiaries',
  initialState,
  reducers: {
    setBeneficiarySearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to load beneficiaries';
      })
      .addCase(addBeneficiary.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editBeneficiary.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeBeneficiary.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { setBeneficiarySearch } = beneficiarySlice.actions;

export const selectBeneficiaries = (state: RootState) => state.beneficiaries.items;
export const selectBeneficiarySearch = (state: RootState) => state.beneficiaries.search;
export const selectFilteredBeneficiaries = (state: RootState) => {
  const query = state.beneficiaries.search.trim().toLowerCase();
  if (!query) return state.beneficiaries.items;
  return state.beneficiaries.items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.bank.toLowerCase().includes(query) ||
      item.ifsc.toLowerCase().includes(query) ||
      (item.nickname?.toLowerCase().includes(query) ?? false),
  );
};

export default beneficiarySlice.reducer;
