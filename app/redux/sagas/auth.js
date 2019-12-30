import { put, call, takeLatest } from 'redux-saga/effects';
import {
  signInRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  updateAccount,
  signUpRequest,
  logOut
} from 'utils/api/auth';
import * as types from 'constants/actionTypes';
import routes from 'constants/routes.json';

// Responsible for searching media library, making calls to the API
// and instructing the redux-saga middle ware on the next line of action,
// for success or failure operation.
/* eslint-disable no-use-before-define */
export default function* watchAuthListener(context = {}) {
  yield takeLatest(types.LOGIN_REQUEST, signInRequestSaga);
  yield takeLatest(types.FORGOT_PASSWORD_REQUEST, forgotPasswordRequestSaga);
  yield takeLatest(types.RESET_PASSWORD_REQUEST, resetPasswordRequestSaga);
  yield takeLatest(types.UPDATE_USER_REQUEST, updateUserSaga);
  yield takeLatest(types.SIGN_UP_REQUEST, signUpRequestSaga, context);
  yield takeLatest(types.SIGN_UP_REQUEST, signUpRequestSaga, context);
  yield takeLatest(types.LOG_OUT_REQUEST, logOutRequestSaga, context);
}

export function* signInRequestSaga({ payload }) {
  try {
    const res = yield call(signInRequest, payload);
    if (res.success) {
      yield put({ type: types.LOGIN_SUCCESS, res });
      window.location.href = '';
    }
  } catch (error) {
    yield put({ type: types.LOGIN_FAILED, error });
  }
}

export function* forgotPasswordRequestSaga({ payload }) {
  try {
    const res = yield call(forgotPasswordRequest, payload);
    yield [put({ type: types.FORGOT_PASSWORD_SUCCESS, res })];
  } catch (error) {
    yield put({ type: types.FORGOT_PASSWORD_FAILED, error });
  }
}

export function* resetPasswordRequestSaga({ payload }) {
  try {
    const res = yield call(resetPasswordRequest, payload);
    yield put({ type: types.RESET_PASSWORD_SUCCESS, res });
    window.location.href = routes.CHANGE_PASSWORD_SUCCESS;
  } catch (error) {
    yield put({ type: types.RESET_PASSWORD_FAILED, error });
  }
}

export function* updateUserSaga({ payload }) {
  try {
    const res = yield call(updateAccount, payload);

    yield [
      put({ type: types.UPDATE_USER_SUCCESS, res }),
      put({
        type: types.SET_NOTIFICATION,
        payload: {
          success: res.success,
          message: res.success ? 'Account updated' : res.message || 'Account not updated'
        }
      })
    ];
  } catch (error) {
    yield [
      put({ type: types.UPDATE_USER_FAILED, error }),
      put({
        type: types.SET_NOTIFICATION,
        payload: {
          success: false,
          message: error && error.message ? error.message : 'Server error'
        }
      })
    ];
  }
}

export function* signUpRequestSaga({ history }, { payload }) {
  try {
    const res = yield call(signUpRequest, payload);
    yield put({ type: types.SIGN_UP_SUCCESS, res });
    if (history) {
      history.push('/');
    }
  } catch (error) {
    yield put({ type: types.SIGN_UP_FAILED, error });
  }
}

export function* logOutRequestSaga() {
  try {
    const res = yield call(logOut, {});
    yield put({ type: types.LOG_OUT_SUCCESS, res });
    window.location.href = '';
  } catch (error) {
    yield put({ type: types.SIGN_UP_FAILED, error });
  }
}
