import { put, call, takeLatest } from 'redux-saga/effects';
import { getCourses, createCourses, deleteCourses } from 'api/Api';
import {
  GET_COURSES_REQUEST,
  GET_COURSES_SUCCESS,
  GET_COURSES_FAILED,
  CREATE_COURSES_REQUEST,
  CREATE_COURSES_SUCCESS,
  CREATE_COURSES_FAILED,
  DELETE_COURSES_REQUEST,
  DELETE_COURSES_SUCCESS,
  DELETE_COURSES_FAILED
} from 'constants/actionTypes';

// Responsible for searching media library, making calls to the API
// and instructing the redux-saga middle ware on the next line of action,
// for success or failure operation.
/* eslint-disable no-use-before-define */
export default function* watchAuthListener(context = {}) {
  yield takeLatest(GET_COURSES_REQUEST, getCoursesRequestSaga);
  yield takeLatest(CREATE_COURSES_REQUEST, createCoursesRequestSaga, context);
  yield takeLatest(DELETE_COURSES_REQUEST, deleteCoursesRequestSaga);
}

export function* getCoursesRequestSaga({ payload }) {
  try {
    const res = yield call(getCourses, payload);
    yield put({ type: GET_COURSES_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_COURSES_FAILED, error });
  }
}

export function* createCoursesRequestSaga({ history }, { payload }) {
  try {
    const res = yield call(createCourses, payload);
    yield put({ type: CREATE_COURSES_SUCCESS, res });

    if (history && payload.redirect && res && res.id) {
      history.push(payload.redirect.replace(':course', res.id));
    }
  } catch (error) {
    yield put({ type: CREATE_COURSES_FAILED, error });
  }
}

export function* deleteCoursesRequestSaga({ payload }) {
  try {
    const res = yield call(deleteCourses, payload);
    yield put({ type: DELETE_COURSES_SUCCESS, res: { ...res, name: payload.name } });
  } catch (error) {
    yield put({ type: DELETE_COURSES_FAILED, error });
  }
}
