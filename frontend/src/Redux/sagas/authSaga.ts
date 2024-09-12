import { call, put, takeEvery, delay } from 'redux-saga/effects';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  refreshTokenSuccess,
  logout as logoutAction,
} from '../slices/authSlice';
import { registerPayload } from '@/types/auth/registerPayload';
import { loginPayload } from '@/types/auth/loginPayload';
import { api } from '@/utils/utils';


function* handleLogin(action: PayloadAction<loginPayload>): Generator {
  try {
    yield call(api.post, '/auth/login', action.payload);
    yield put(loginSuccess());
    yield call(setTokenRefreshInterval);
  } catch (error: any) {
    const errorMessage: string = error.response?.data?.message || 'Login failed';
    yield put(loginFailure(errorMessage));
  }
}


function* handleRegister(action: PayloadAction<registerPayload>): Generator {
  try {
    yield call(api.post, '/auth/register', action.payload);
    yield put(registerSuccess());
    yield call(setTokenRefreshInterval);
  } catch (error: any) {
    const errorMessage: string = error.response?.data?.message || 'Registration failed';
    yield put(registerFailure(errorMessage));
  }
}

function* handleRefreshToken(): Generator {
  try {
    yield call(api.post, '/auth/refresh-token');
    yield put(refreshTokenSuccess());
  } catch (error: any) {
    console.error('Refresh token failed:', error.response?.data?.message || error.message);
  }
}


function* setTokenRefreshInterval(): Generator {
  while (true) {
    yield delay(9 * 60 * 1000);
    yield call(handleRefreshToken);
  }
}

function* handleLogout() {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');

  yield put(logoutAction());
}

function* authSaga(): Generator {
  yield takeEvery('auth/loginStart', handleLogin);
  yield takeEvery('auth/registerStart', handleRegister);
  yield takeEvery('auth/refreshToken', handleRefreshToken);
  yield takeEvery('auth/logout', handleLogout);
}

export default authSaga;
