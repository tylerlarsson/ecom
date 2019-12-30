import axios from 'axios';
import { API_ENDPOINT_URL } from 'constants/default';

export const signInRequest = payload =>
  axios
    .post(`${API_ENDPOINT_URL}/oauth/token`, {
      username: payload.email,
      password: payload.password,
      client_id: 'qwerty',
      grant_type: 'password'
    })
    .then(res => {
      if (res.data.access_token) {
        setAccessToken(res.data.access_token); // no-use-before-define
        // setUserID(res.data.user.id);
        // let permissions = res.data.user.permissions; // eslint-disable-line
        //   delete res.data.user.permissions;
        //   setUser(res.data.user);
        //   setPermissions(permissions);
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const signUpRequest = payload =>
  axios
    .post(`${API_ENDPOINT_URL}/user`, {
      email: payload.email,
      password: payload.password,
      username: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
      roles: payload.roles
    })
    .then(res => {
      console.log('signUpRequest res', res);
      if (res.data._id) {
        // setAccessToken(res.data.token);
        // setUserID(res.data.user.id);
        // setUser(res.data.user);
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const forgotPasswordRequest = payload => {
  console.log('forgotPasswordRequest', payload);
  return axios
    .get(`${API_ENDPOINT_URL}/user/reset-password`, {
      params: {
        email: payload.email
      },
      headers: { 'content-type': 'application/json' }
    })
    .then(res => {
      console.log('forgotPasswordRequest res', res)
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const resetPasswordRequest = payload => {
  console.log('resetPasswordRequest', payload);
  return axios
    .put(`${API_ENDPOINT_URL}/user/reset-password`, {
      newPassword: payload.password,
      id: payload.id
    })
    .then(res => {
      if (res.data) {
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const updateAccount = payload => {
  const { id, uuid, ...data } = payload;
  const url = `${API_ENDPOINT_URL}/users/${payload.id}`;
  return axios
    .patch(url, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    })
    .then(res => {
      setUser(res.data);
      return { success: true, data: res.data };
    })
    .catch(err => ({
      success: false,
      message: err.response.data.message
    }));
};

function setAccessToken(token) {
  console.log('setAccessToken', token);
  localStorage.setItem('authentication_token', token);
}

export const getAccessToken = () => localStorage.getItem('authentication_token');

// function setUserID(id) {
//   localStorage.setItem('user_id', id);
// }

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export const setUserLocalStorage = user => {
  localStorage.setItem('user', user);
};

export const getUserID = () => {
  if (!localStorage.getItem('user_id')) {
    return false;
  }
  return localStorage.getItem('user_id');
};

export const getUser = () => {
  if (!localStorage.getItem('user')) {
    return false;
  }
  return JSON.parse(localStorage.getItem('user'));
};

export const logOut = () => {
  localStorage.clear();
  // localStorage.setItem('access_token', null);
  // localStorage.setItem('user_id', null);
  // localStorage.setItem('user', null);
};
