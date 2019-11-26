import { put, call, takeLatest } from 'redux-saga/effects';
import { getCourses, createCourses, deleteCourses, getCourse } from 'utils/api/courses';
import {
  GET_COURSES_REQUEST,
  GET_COURSES_SUCCESS,
  GET_COURSES_FAILED,
  GET_COURSE_REQUEST,
  GET_COURSE_SUCCESS,
  GET_COURSE_FAILED,
  CREATE_COURSES_REQUEST,
  // CREATE_COURSES_SUCCESS,
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
  yield takeLatest(GET_COURSE_REQUEST, getCourseRequestSaga);
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

export function* getCourseRequestSaga({ payload }) {
  try {
    const res = yield call(getCourse, payload);
    yield put({ type: GET_COURSE_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_COURSE_FAILED, error });
  }
}

export function* createCoursesRequestSaga({ history }, { payload }) {
  try {
    const res = yield call(createCourses, payload);
    // yield put({ type: CREATE_COURSES_SUCCESS, res });
    const id = res && res.data && res.data.id;
    if (history && payload.redirect && id) {
      return payload.history.push(payload.redirect.replace(':course', id));
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
