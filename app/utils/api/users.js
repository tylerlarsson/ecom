import axios from 'axios';
import { API_ENDPOINT_URL } from 'constants/default';

// Permissions
export const getPermissions = () =>
  axios
    .get(`${API_ENDPOINT_URL}/permission`)
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const createPermission = payload => {
  const data = {
    name: payload.name,
    description: payload.description
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return axios
    .post(`${API_ENDPOINT_URL}/permission`, data)
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const deletePermission = payload =>
  axios
    .delete(`${API_ENDPOINT_URL}/permission/${payload.name}`)
    .then(res => {
      if (res.data) {
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

// Roles
export const getRoles = () =>
  axios
    .get(`${API_ENDPOINT_URL}/role`)
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const getRole = payload =>
  axios
    .get(`${API_ENDPOINT_URL}/role/${payload.name}`)
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const createRole = payload => {
  const data = {
    name: payload.name,
    description: payload.description
  };
  if (payload.permissions) {
    data.permissions = payload.permissions;
  }

  if (payload.id) {
    data.id = payload.id;
  }

  return axios
    .post(`${API_ENDPOINT_URL}/role`, data)
    .then(res => {
      if (res.data) {
        return { success: true, data: res };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const deleteRole = payload =>
  axios
    .delete(`${API_ENDPOINT_URL}/role/${payload.name}`)
    .then(res => {
      if (res.data) {
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

// Users
export const getUsers = payload => {
  const params = (payload && payload.params) || {};
  const pagination = payload && payload.pagination;
  if (pagination) {
    params.pageNumber = pagination.page;
    params.pageSize = pagination.rowsPerPage;
  }
  // console.log('getUsers', params);
  return axios
    .get(`${API_ENDPOINT_URL}/user`, { params })
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const createUsers = payload => {
  const data = {
    name: payload.name,
    description: payload.description
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return axios
    .post(`${API_ENDPOINT_URL}/user`, data)
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const deleteUsers = payload =>
  axios
    .delete(`${API_ENDPOINT_URL}/user/${payload.name}`)
    .then(res => {
      if (res.data) {
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const getFilters = () =>
  axios
    .get(`${API_ENDPOINT_URL}/filter`)
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
