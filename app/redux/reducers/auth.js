import * as types from 'constants/actionTypes';

const initialState = {
  login: {
    email: '',
    password: '',
    status: false,
    error: null,
    loginStatus: null
  },
  signUp: {
    status: false,
    error: null,
    loginStatus: null
  },
  forgotPassword: {
    status: false,
    error: null,
    forgotStatus: null
  },
  user: {
    data: {},
    status: false,
    error: null,
    userStatus: null
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER_REQUEST:
      return {
        ...state,
        user: {
          data: action.res,
          status: true,
          error: null,
          userStatus: true
        }
      };

    case types.LOGIN_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          login: {
            ...state.login,
            loginStatus: action.res.success,
            error: action.res.reason
          }
        };
      }
      return {
        ...state,
        login: {
          ...state.login,
          loginStatus: action.res.success,
          error: null
        },
        user: {
          data: action.res.data,
          status: true,
          error: null,
          userStatus: true
        }
      };
    case types.LOGIN_FAILED:
      return {
        ...state,
        login: {
          ...state.login,
          error: 'Bad Request'
        }
      };

    // UPDATE USER REDUCER
    case types.UPDATE_USER_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          login: {
            ...state.login,
            loginStatus: action.res.success,
            error: action.res.reason
          }
        };
      }
      return {
        ...state,
        login: {
          ...state.login,
          loginStatus: action.res.success,
          error: null
        },
        user: {
          data: action.res.data,
          status: true,
          error: null,
          userStatus: true
        }
      };
    case types.UPDATE_USER_FAILED:
      return {
        ...state,
        login: {
          ...state.login,
          error: 'Bad Request'
        }
      };

    // Requests for forgot password
    case types.FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        status: false,
        error: null
      };
    case types.FORGOT_PASSWORD_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          forgotPassword: {
            ...state.forgotPassword,
            status: action.res.success,
            error: action.res.reason
          }
        };
      }
      return {
        ...state,
        forgotPassword: {
          ...state.forgotPassword,
          status: action.res.success
        }
      };
    case types.FORGOT_PASSWORD_FAILED:
      return {
        ...state,
        forgotPassword: {
          ...state.forgotPassword,
          status: false,
          error: 'Bad Request'
        }
      };

    // Requests for resetting the password
    case types.RESET_PASSWORD_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          status: action.res.success,
          error: action.res.reason
        };
      }
      return {
        ...state,
        status: action.res.success,
        error: null
      };
    case types.RESET_PASSWORD_FAILED:
      return {
        ...state,
        status: false,
        error: 'Bad Request'
      };

    case types.GET_USER_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          user: {
            ...state.forgotPassword,
            status: action.res.success,
            error: action.res.reason
          }
        };
      }
      return {
        ...state,
        status: action.res.success,
        error: null,
        user: { ...action.res.data }
      };
    case types.GET_USER_FAILED:
      return {
        ...state,
        user: {
          ...state.forgotPassword,
          status: false,
          error: 'Bad Request'
        }
      };
    case types.SIGN_UP_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          signUp: {
            loginStatus: false,
            error: action.res.reason
          }
        };
      }
      return {
        ...state,
        signUp: {
          loginStatus: action.res.success,
          error: null
        }
      };
    case types.SIGN_UP_FAILED:
      return {
        ...state,
        signUp: {
          loginStatus: false,
          error: action.res.reason
        }
      };
    case types.LOG_OUT_SUCCESS:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
