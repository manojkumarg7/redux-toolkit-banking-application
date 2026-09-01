import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AUTH_STORAGE_KEY, REMEMBER_STORAGE_KEY } from '../../constants';
import * as authService from '../../services/authService';
import type { AuthCredentials, LoadingState, User } from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: LoadingState;
  error: string | null;
  rememberedIdentifier: string;
}

function loadPersistedAuth(): Pick<AuthState, 'user' | 'isAuthenticated'> {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { user: null, isAuthenticated: false };
    const user = JSON.parse(raw) as User;
    return { user, isAuthenticated: true };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

const persisted = loadPersistedAuth();

const initialState: AuthState = {
  user: persisted.user,
  isAuthenticated: persisted.isAuthenticated,
  status: 'idle',
  error: null,
  rememberedIdentifier: localStorage.getItem(REMEMBER_STORAGE_KEY) ?? '',
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      const user = await authService.login(credentials);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      if (credentials.rememberMe) {
        localStorage.setItem(REMEMBER_STORAGE_KEY, credentials.identifier);
      } else {
        localStorage.removeItem(REMEMBER_STORAGE_KEY);
      }
      return { user, rememberedIdentifier: credentials.rememberMe ? credentials.identifier : '' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  localStorage.removeItem(AUTH_STORAGE_KEY);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setRememberedIdentifier(state, action: PayloadAction<string>) {
      state.rememberedIdentifier = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.rememberedIdentifier = action.payload.rememberedIdentifier;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearAuthError, setRememberedIdentifier } = authSlice.actions;
export default authSlice.reducer;
