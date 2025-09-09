// src/store/slices/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  email: string | null;
  role: string | null;
}

const initialState: UserState = {
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ email: string; role: string }>) {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearUser(state) {
      state.email = null;
      state.role = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
