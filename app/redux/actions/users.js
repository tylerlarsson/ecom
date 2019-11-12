import {
  GET_PERMISSIONS_REQUEST,
  CREATE_PERMISSIONS_REQUEST,
  DELETE_PERMISSIONS_REQUEST,
  GET_ROLES_REQUEST,
  CREATE_ROLE_REQUEST,
  DELETE_ROLE_REQUEST,
  GET_USERS_REQUEST,
  CREATE_USERS_REQUEST,
  DELETE_USERS_REQUEST,
  GET_ROLE_REQUEST
} from 'constants/actionTypes';

export const getPermissions = payload => ({
  type: GET_PERMISSIONS_REQUEST,
  payload
});

export const createPermission = payload => ({
  type: CREATE_PERMISSIONS_REQUEST,
  payload
});

export const deletePermission = payload => ({
  type: DELETE_PERMISSIONS_REQUEST,
  payload
});

export const getRoles = payload => ({
  type: GET_ROLES_REQUEST,
  payload
});

export const getRole = payload => ({
  type: GET_ROLE_REQUEST,
  payload
});

export const createRole = payload => ({
  type: CREATE_ROLE_REQUEST,
  payload
});

export const deleteRole = payload => ({
  type: DELETE_ROLE_REQUEST,
  payload
});

export const getUsers = payload => ({
  type: GET_USERS_REQUEST,
  payload
});

export const createUsers = payload => ({
  type: CREATE_USERS_REQUEST,
  payload
});

export const deleteUsers = payload => ({
  type: DELETE_USERS_REQUEST,
  payload
});
