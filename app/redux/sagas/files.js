import { put, call, takeLatest } from 'redux-saga/effects';
import {
  getImageSignUrl,
} from 'utils/api/files';
import {
  GET_SIGN_URL_REQUEST,
  GET_SIGN_URL_SUCCESS,
  GET_SIGN_URL_FAILED,
} from 'constants/actionTypes';

// Responsible for searching media library, making calls to the API
// and instructing the redux-saga middle ware on the next line of action,
// for success or failure operation.
/* eslint-disable no-use-before-define */
export default function* watchFilesListener(context = {}) {
  yield takeLatest(GET_SIGN_URL_REQUEST, getSignUrlRequestSaga);
}

export function* getSignUrlRequestSaga({ payload }) {
  try {
    const res = yield call(getImageSignUrl, payload);
    yield put({ type: GET_SIGN_URL_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_SIGN_URL_FAILED, error });
  }
}
