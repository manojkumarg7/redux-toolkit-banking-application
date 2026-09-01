# Redux Toolkit From Scratch — FinBank

This guide explains how Redux Toolkit (RTK) was set up in **FinBank** from a blank Vite + React + TypeScript project.

## 1. Why Redux Toolkit?

Plain Redux needs a lot of boilerplate (action types, action creators, switch reducers).  
**Redux Toolkit** is the official recommended way to write Redux today.

In FinBank we used RTK for:

- Global auth session
- Accounts / transactions / beneficiaries
- Transfer workflow steps
- Calculator inputs & results
- Profile + UI preferences (dark mode, toasts, sidebar)

Local form typing (temporary input values) stays in React `useState` when it does not need to be shared.

---

## 2. Packages used

Already present in this project:

```json
{
  "@reduxjs/toolkit": "^2.x",
  "react-redux": "^9.x"
}
```

No extra Redux packages were required.

---

## 3. Folder architecture

```text
src/
├── app/
│   ├── store.ts      # configureStore + RootState + AppDispatch
│   └── hooks.ts      # useAppDispatch / useAppSelector
│
├── features/
│   ├── auth/authSlice.ts
│   ├── accounts/accountSlice.ts
│   ├── transactions/transactionSlice.ts
│   ├── transfers/transferSlice.ts
│   ├── beneficiaries/beneficiarySlice.ts
│   ├── calculators/calculatorSlice.ts
│   ├── profile/profileSlice.ts
│   └── ui/uiSlice.ts
│
├── services/         # mock API layer (easy to swap for REST later)
├── pages/            # UI screens that dispatch + select
└── components/       # presentational UI
```

**Rule:** feature state lives next to the feature (`features/<name>/<name>Slice.ts`).

---

## 4. Step-by-step setup

### Step A — Create the store

File: `src/app/store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
// ...other reducers

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    transactions: transactionReducer,
    transfers: transferReducer,
    beneficiaries: beneficiaryReducer,
    calculators: calculatorReducer,
    profile: profileReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

`configureStore` automatically adds:

- Redux DevTools support
- `thunk` middleware
- useful development checks

### Step B — Typed hooks

File: `src/app/hooks.ts`

```ts
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Always use these hooks in components (never plain `useDispatch` / `useSelector`) so TypeScript knows your state shape.

### Step C — Provide the store to React

File: `src/App.tsx`

```tsx
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import { AppRoutes } from './routes';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
```

---

## 5. Creating a slice from scratch

Every slice follows the same pattern:

1. Define `State` interface
2. Define `initialState`
3. Create `createSlice({ name, initialState, reducers, extraReducers? })`
4. Export actions + reducer (+ selectors)

Example skeleton:

```ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface ExampleState {
  value: number;
}

const initialState: ExampleState = { value: 0 };

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setValue(state, action: PayloadAction<number>) {
      // Immer lets you "mutate" safely
      state.value = action.payload;
    },
  },
});

export const { setValue } = exampleSlice.actions;
export const selectValue = (state: RootState) => state.example.value;
export default exampleSlice.reducer;
```

Then register `example: exampleReducer` inside `configureStore`.

---

## 6. Async logic with `createAsyncThunk`

Used for API-ready flows (login, fetch accounts, transfers, beneficiaries).

```ts
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  },
);
```

Handle lifecycle in `extraReducers`:

- `pending` → loading
- `fulfilled` → success + data
- `rejected` → error message

Services live in `src/services/*` so later you can replace mock delays with real REST calls without rewriting slices.

---

## 7. Data flow in FinBank

```text
UI event (button / form)
   ↓
dispatch(action or thunk)
   ↓
Slice reducer updates state
   ↓
useAppSelector(...) reads new state
   ↓
React re-renders UI
```

Example (transfer):

1. Page updates draft with `updateTransferDraft`
2. User confirms → `dispatch(executeTransfer())`
3. Thunk calls `transferService`, then updates account balance + adds transaction
4. Slice sets `step = 'success'`
5. UI shows success screen from selectors

---

## 8. Selectors

Prefer selectors over reading deep state in every component:

```ts
export const selectFilteredTransactions = (state: RootState) => { /* filter/sort */ };
```

Benefits:

- Reusable filtering logic
- Cleaner pages
- Easier testing later

---

## 9. What should NOT go into Redux

Keep in local component state:

- Password show/hide toggle
- Temporary form field errors before submit
- Dropdown open/close
- One-time wizard values that are not shared

Put in Redux only when:

- Shared across routes/components
- Needed after navigation
- Async server/mock data
- App-wide preferences (theme, toasts, sidebar)

---

## 10. FinBank slices map

| Slice | Responsibility |
|---|---|
| `authSlice` | Login/logout, session persistence |
| `accountSlice` | Account list + balances |
| `transactionSlice` | Transactions + filters |
| `transferSlice` | Transfer draft, steps, execute |
| `beneficiarySlice` | CRUD beneficiaries |
| `calculatorSlice` | Calculator inputs/results |
| `profileSlice` | Editable user profile |
| `uiSlice` | Sidebar, settings, notifications, toasts |

---

## 11. How to extend later

1. Add `features/newFeature/newFeatureSlice.ts`
2. Export reducer
3. Register in `store.ts`
4. Add service in `services/`
5. Use `useAppDispatch` / `useAppSelector` in pages

That is the full from-scratch Redux Toolkit path used to build FinBank.
