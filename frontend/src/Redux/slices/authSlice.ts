import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { registerPayload } from '@/types/registerPayload';
import { AuthState } from '@/types/authStatePayload';
import { loginPayload } from '@/types/loginPayload';

export const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state, action: PayloadAction<loginPayload>) {
      state.loading = true;
    },
    loginSuccess(state) {
      state.loading = false;
      state.isAuthenticated = true;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart(state, action: PayloadAction<registerPayload>) {
      console.log("registration started")
      console.log("registerStart action dispatched with payload:", action.payload);
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state) {
      state.loading = false;
      state.isAuthenticated = true;
      console.log("register successful")
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    refreshTokenSuccess(state) {
      state.isAuthenticated = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  refreshTokenSuccess,
} = authSlice.actions;

export default authSlice.reducer;
