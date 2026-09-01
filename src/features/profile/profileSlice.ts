import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { mockUser } from '../../data/mockData';
import type { User } from '../../types';

interface ProfileState {
  data: User;
  isEditing: boolean;
}

const initialState: ProfileState = {
  data: mockUser,
  isEditing: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      state.data = { ...state.data, ...action.payload };
      state.isEditing = false;
    },
  },
});

export const { setEditing, updateProfile } = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile.data;
export const selectIsEditingProfile = (state: RootState) => state.profile.isEditing;
export default profileSlice.reducer;
