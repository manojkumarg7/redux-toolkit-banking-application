# Redux Toolkit Slices & Data Flow — FinBank

Practical reference for every Redux Toolkit slice created in FinBank, with examples of how UI talks to the store.

## Quick mental model

```text
Page / Component
   │  dispatch(loginUser(...))
   ▼
createAsyncThunk  ──►  services/authService.ts (mock API)
   │
   ▼
extraReducers update auth state
   │
   ▼
useAppSelector(state => state.auth.isAuthenticated)
   │
   ▼
ProtectedRoute + Dashboard render
```

---

## 1. Store wiring

**File:** `src/app/store.ts`

All feature reducers are combined here:

- `auth`
- `accounts`
- `transactions`
- `transfers`
- `beneficiaries`
- `calculators`
- `profile`
- `ui`

**File:** `src/app/hooks.ts`

```ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

---

## 2. `authSlice`

**File:** `src/features/auth/authSlice.ts`

### State

- `user`
- `isAuthenticated`
- `status` (`idle | loading | succeeded | failed`)
- `error`
- `rememberedIdentifier`

### Key APIs

| Export | Type | Purpose |
|---|---|---|
| `loginUser` | thunk | Mock login via `authService` |
| `logoutUser` | thunk | Clear session |
| `clearAuthError` | action | Reset error banner |

### Persistence

- Auth user saved in `localStorage` under `finbank_auth`
- Remembered ID under `finbank_remember`

### UI usage

```ts
const dispatch = useAppDispatch();
await dispatch(loginUser({ identifier, password, rememberMe }));
```

---

## 3. `accountSlice`

**File:** `src/features/accounts/accountSlice.ts`

### Responsibilities

- Load mock accounts (`fetchAccounts`)
- Track selected account
- Debit/credit balance during transfers (`updateAccountBalance`)

### Selectors

- `selectAccounts`
- `selectTotalBalance`
- `selectAccountById(id)`

Used by Dashboard, Accounts, Transfer pages.

---

## 4. `transactionSlice`

**File:** `src/features/transactions/transactionSlice.ts`

### Responsibilities

- Load transactions
- Keep filter/sort/page state in Redux (shared UI state for Transactions page)
- Append new transfer transactions (`addTransaction`)

### Important selector

`selectFilteredTransactions` applies:

- search
- type / category
- date range
- amount/date sorting

Pagination uses `PAGE_SIZE` from constants and slices the filtered list in the page.

---

## 5. `transferSlice`

**File:** `src/features/transfers/transferSlice.ts`

### Multi-step flow state

1. `form` — user enters details (`updateTransferDraft`)
2. `confirm` — review (`setTransferStep('confirm')`)
3. `success` — after `executeTransfer` succeeds

### Cross-slice side effects inside thunk

`executeTransfer`:

1. Calls `transferService.submitTransfer`
2. Dispatches `updateAccountBalance` (debit)
3. Dispatches `addTransaction` (history entry)
4. Stores `lastTransfer` and moves to success step

This shows how one thunk can coordinate multiple slices.

---

## 6. `beneficiarySlice`

**File:** `src/features/beneficiaries/beneficiarySlice.ts`

### Async CRUD

- `fetchBeneficiaries`
- `addBeneficiary`
- `editBeneficiary`
- `removeBeneficiary`

### Local filter

- `setBeneficiarySearch`
- `selectFilteredBeneficiaries`

Status values: `active | pending | inactive`.

---

## 7. `calculatorSlice`

**File:** `src/features/calculators/calculatorSlice.ts`

Keeps calculator form values + computed results for:

- Simple Interest
- Compound Interest
- Loan EMI
- Fixed Deposit
- Recurring Deposit

### Important design choice

Math is **not** written inside JSX.

Utilities live in:

```text
src/utils/calculators/
  simpleInterest.ts
  compoundInterest.ts
  emi.ts
  fixedDeposit.ts
  recurringDeposit.ts
```

Slice reducers call those utils whenever inputs change, so results update dynamically and stay testable.

---

## 8. `profileSlice`

**File:** `src/features/profile/profileSlice.ts`

- Holds editable profile fields
- `setEditing(true/false)`
- `updateProfile(partialUser)`

Profile page uses local form state while editing, then commits to Redux on save.

---

## 9. `uiSlice`

**File:** `src/features/ui/uiSlice.ts`

App chrome + preferences:

- sidebar open/close
- notification list
- toast stack
- dark mode / language / notification toggles
- global search text

Settings page writes preferences through `updateSettings`.

---

## 10. Services layer (API-ready)

```text
src/services/
  apiClient.ts
  authService.ts
  accountService.ts
  transactionService.ts
  transferService.ts
  beneficiaryService.ts
```

Today each service uses `simulateRequest()` (fake delay + mock data).  
Tomorrow replace internals with `axios.get/post` — slices stay almost unchanged.

---

## 11. Example: build a new feature slice from scratch

Imagine adding `cardsSlice`.

1. Create `src/features/cards/cardSlice.ts`
2. Define state + `createSlice`
3. Add `fetchCards = createAsyncThunk(...)` calling `cardService`
4. Export reducer default
5. Register in `store.ts`:

```ts
cards: cardReducer,
```

6. In page:

```ts
const cards = useAppSelector((s) => s.cards.items);
const dispatch = useAppDispatch();
useEffect(() => { dispatch(fetchCards()); }, [dispatch]);
```

---

## 12. Debugging tips

1. Install Redux DevTools browser extension
2. Watch actions: `auth/login/pending` → `fulfilled`
3. Inspect state tree tabs for each slice
4. Confirm selectors return expected filtered data

---

## 13. Summary checklist used for FinBank

- [x] `configureStore`
- [x] Typed `RootState` / `AppDispatch`
- [x] `useAppDispatch` / `useAppSelector`
- [x] Feature slices with `createSlice`
- [x] Async flows with `createAsyncThunk`
- [x] Selectors for derived data
- [x] Services separated from UI
- [x] Provider wrapped around the app

This is the complete Redux Toolkit implementation path used to create FinBank from scratch.
