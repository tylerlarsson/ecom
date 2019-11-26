import { put, call, takeLatest } from 'redux-saga/effects';
import {
  getPermissions,
  createPermission,
  deletePermission,
  getRoles,
  createRole,
  deleteRole,
  getUsers,
  createUsers,
  deleteUsers,
  getRole,
  getFilters
} from 'utils/api/users';
import {
  GET_PERMISSIONS_REQUEST,
  GET_PERMISSIONS_SUCCESS,
  GET_PERMISSIONS_FAILED,
  CREATE_PERMISSIONS_REQUEST,
  CREATE_PERMISSIONS_SUCCESS,
  CREATE_PERMISSIONS_FAILED,
  DELETE_PERMISSIONS_REQUEST,
  DELETE_PERMISSIONS_SUCCESS,
  DELETE_PERMISSIONS_FAILED,
  GET_ROLES_REQUEST,
  GET_ROLES_SUCCESS,
  GET_ROLES_FAILED,
  CREATE_ROLE_REQUEST,
  CREATE_ROLE_SUCCESS,
  CREATE_ROLE_FAILED,
  DELETE_ROLE_REQUEST,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAILED,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILED,
  CREATE_USERS_REQUEST,
  CREATE_USERS_SUCCESS,
  CREATE_USERS_FAILED,
  DELETE_USERS_REQUEST,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FAILED,
  GET_ROLE_REQUEST,
  GET_ROLE_SUCCESS,
  GET_ROLE_FAILED,
  GET_FILTERS_REQUEST,
  GET_FILTERS_SUCCESS,
  GET_FILTERS_FAILED
} from 'constants/actionTypes';

// Responsible for searching media library, making calls to the API
// and instructing the redux-saga middle ware on the next line of action,
// for success or failure operation.
/* eslint-disable no-use-before-define */
export default function* watchAuthListener() {
  yield takeLatest(GET_PERMISSIONS_REQUEST, getPermissionsRequestSaga);
  yield takeLatest(CREATE_PERMISSIONS_REQUEST, createPermissionsRequestSaga);
  yield takeLatest(DELETE_PERMISSIONS_REQUEST, deletePermissionsRequestSaga);
  yield takeLatest(GET_ROLES_REQUEST, getRolesRequestSaga);
  yield takeLatest(CREATE_ROLE_REQUEST, createRoleRequestSaga);
  yield takeLatest(DELETE_ROLE_REQUEST, deleteRoleRequestSaga);
  yield takeLatest(GET_USERS_REQUEST, getUsersRequestSaga);
  yield takeLatest(CREATE_USERS_REQUEST, createUsersRequestSaga);
  yield takeLatest(DELETE_USERS_REQUEST, deleteUsersRequestSaga);
  yield takeLatest(GET_ROLE_REQUEST, getRoleRequestSaga);
  yield takeLatest(GET_FILTERS_REQUEST, getFiltersRequestSaga);
}

export function* getPermissionsRequestSaga({ payload }) {
  try {
    const res = yield call(getPermissions, payload);
    yield put({ type: GET_PERMISSIONS_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_PERMISSIONS_FAILED, error });
  }
}

export function* createPermissionsRequestSaga({ payload }) {
  try {
    const res = yield call(createPermission, payload);
    yield put({ type: CREATE_PERMISSIONS_SUCCESS, res });
  } catch (error) {
    yield put({ type: CREATE_PERMISSIONS_FAILED, error });
  }
}

export function* deletePermissionsRequestSaga({ payload }) {
  try {
    const res = yield call(deletePermission, payload);
    yield put({ type: DELETE_PERMISSIONS_SUCCESS, res: { ...res, name: payload.name } });
  } catch (error) {
    yield put({ type: DELETE_PERMISSIONS_FAILED, error });
  }
}

export function* getRolesRequestSaga({ payload }) {
  try {
    const res = yield call(getRoles, payload);
    yield put({ type: GET_ROLES_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_ROLES_FAILED, error });
  }
}

export function* getRoleRequestSaga({ payload }) {
  try {
    const res = yield call(getRole, payload);
    yield put({ type: GET_ROLE_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_ROLE_FAILED, error });
  }
}

export function* createRoleRequestSaga({ payload }) {
  try {
    const res = yield call(createRole, payload);
    yield put({ type: CREATE_ROLE_SUCCESS, res });
    yield call(getRolesRequestSaga, {});
  } catch (error) {
    yield put({ type: CREATE_ROLE_FAILED, error });
  }
}

export function* deleteRoleRequestSaga({ payload }) {
  try {
    const res = yield call(deleteRole, payload);
    yield put({ type: DELETE_ROLE_SUCCESS, res: { ...res, name: payload.name } });
  } catch (error) {
    yield put({ type: DELETE_ROLE_FAILED, error });
  }
}

export function* getUsersRequestSaga({ payload }) {
  try {
    const res = yield call(getUsers, payload);
    yield put({ type: GET_USERS_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_USERS_FAILED, error });
  }
}

export function* createUsersRequestSaga({ payload }) {
  try {
    const res = yield call(createUsers, payload);
    yield put({ type: CREATE_USERS_SUCCESS, res });
  } catch (error) {
    yield put({ type: CREATE_USERS_FAILED, error });
  }
}

export function* deleteUsersRequestSaga({ payload }) {
  try {
    const res = yield call(deleteUsers, payload);
    yield put({ type: DELETE_USERS_SUCCESS, res: { ...res, name: payload.name } });
  } catch (error) {
    yield put({ type: DELETE_USERS_FAILED, error });
  }
}

export function* getFiltersRequestSaga({ payload }) {
  try {
    const res = yield call(getFilters, payload);
    yield put({ type: GET_FILTERS_SUCCESS, res });
  } catch (error) {
    yield put({ type: GET_FILTERS_FAILED, error });
  }
}
