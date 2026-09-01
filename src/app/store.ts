import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import accountReducer from '../features/accounts/accountSlice';
import transactionReducer from '../features/transactions/transactionSlice';
import transferReducer from '../features/transfers/transferSlice';
import beneficiaryReducer from '../features/beneficiaries/beneficiarySlice';
import calculatorReducer from '../features/calculators/calculatorSlice';
import profileReducer from '../features/profile/profileSlice';
import uiReducer from '../features/ui/uiSlice';

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
