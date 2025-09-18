// 1. First, fix your authSlice.ts - properly type the decodedToken
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecodedToken {
  role: string;
  id: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export interface AuthState {
  token: string | null;
  decodedToken: DecodedToken | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  token: null,
  decodedToken: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        token: string;
        decodedToken: DecodedToken;
      }>
    ) => {
      state.token = action.payload.token;
      state.decodedToken = action.payload.decodedToken;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.token = null;
      state.decodedToken = null;
      state.isInitialized = true;
      localStorage.removeItem("token");
    },
    initializeAuth: (
      state,
      action: PayloadAction<{
        token: string | null;
        decodedToken: DecodedToken | null;
      }>
    ) => {
      state.token = action.payload.token;
      state.decodedToken = action.payload.decodedToken;
      state.isInitialized = true;
    },
  },
});

export const { setAuth, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
