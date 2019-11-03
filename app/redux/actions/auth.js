import {
  LOGIN_REQUEST,
  FORGOT_PASSWORD_REQUEST,
  RESET_PASSWORD_REQUEST,
  SIGN_UP_REQUEST,
  GET_USER_REQUEST, LOG_OUT_REQUEST, SET_USER_REQUEST, UPDATE_USER_REQUEST,
} from 'constants/actionTypes';

export const isAuth = () => {
  if (localStorage.getItem('authentication_token')) {
    return true;
  }
  return false;
};

export const setUserAction = res => ({
  type: SET_USER_REQUEST,
  res,
});

export const signInAction = (email, password) => ({
  type: LOGIN_REQUEST,
  payload: {
    email,
    password,
  },
});

export const getUserAction = email => ({
  type: GET_USER_REQUEST,
  payload: {
    email,
  },
});

export const updateUserAction = payload => ({
  type: UPDATE_USER_REQUEST,
  payload,
});

export const forgotPasswordAction = payload => ({
  type: FORGOT_PASSWORD_REQUEST,
  payload,
});

export const resetPasswordAction = payload => ({
  type: RESET_PASSWORD_REQUEST,
  payload,
});

export const signUpAction = user => ({
  type: SIGN_UP_REQUEST,
  payload: {
    ...user,
  },
});

export const logoutAction = () => ({
  type: LOG_OUT_REQUEST,
});
