// src/store/store.ts

import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserState } from "./slices/userSlice";
import authReducer, { AuthState } from "./slices/authSlice";

export interface RootState {
  user: UserState;
  auth: AuthState;
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
