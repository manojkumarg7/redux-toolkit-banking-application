import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { mockNotifications } from '../../data/mockData';
import type { NotificationItem, ProfileSettings } from '../../types';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UiState {
  sidebarOpen: boolean;
  settings: ProfileSettings;
  notifications: NotificationItem[];
  toasts: ToastMessage[];
  globalSearch: string;
}

const initialState: UiState = {
  sidebarOpen: false,
  settings: {
    emailNotifications: true,
    transactionNotifications: true,
    loginAlerts: true,
    darkMode: false,
    language: 'en',
  },
  notifications: mockNotifications,
  toasts: [],
  globalSearch: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    updateSettings(state, action: PayloadAction<Partial<ProfileSettings>>) {
      state.settings = { ...state.settings, ...action.payload };
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    setGlobalSearch(state, action: PayloadAction<string>) {
      state.globalSearch = action.payload;
    },
    pushToast(state, action: PayloadAction<Omit<ToastMessage, 'id'>>) {
      state.toasts.push({
        id: `toast_${Date.now()}`,
        ...action.payload,
      });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  updateSettings,
  markNotificationRead,
  markAllNotificationsRead,
  setGlobalSearch,
  pushToast,
  removeToast,
} = uiSlice.actions;

export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectSettings = (state: RootState) => state.ui.settings;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectUnreadCount = (state: RootState) =>
  state.ui.notifications.filter((n) => !n.read).length;
export const selectToasts = (state: RootState) => state.ui.toasts;
export const selectGlobalSearch = (state: RootState) => state.ui.globalSearch;

export default uiSlice.reducer;
