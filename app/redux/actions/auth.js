import { routerActions } from 'connected-react-router';
// import { Dispatch } from '../reducers/types';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_FAIL = 'LOGIN_FAIL';

const login = () => ({ type: LOGIN });

const wrongCredentials = () => ({ type: LOGIN_FAIL });

const logout = () => ({ type: LOGOUT });

export function tryToLogin(email, password) {
  if (email === 'test@test.com' && password === '123456') {
    return (dispatch) => {
      dispatch(login());
      return dispatch(routerActions.push('/'));
    };
  }
  return (dispatch) => dispatch(wrongCredentials());
}

export function tryToLogout() {
  return (dispatch) => {
    dispatch(logout());
    return dispatch(routerActions.push('/login'));
  };
}
