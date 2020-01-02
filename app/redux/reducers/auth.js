import {
  SET_USER_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILED,
  // FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILED,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILED,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILED,
  LOG_OUT_SUCCESS,
  SET_AUTH_ERROR_REQUEST
} from 'constants/actionTypes';

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
  },
  error: {
    title: null,
    description: null
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_REQUEST:
      return {
        ...state,
        user: {
          data: action.res,
          status: true,
          error: null,
          userStatus: true
        }
      };

    case SET_AUTH_ERROR_REQUEST:
      return {
        ...state,
        error: {
          title: action.payload.title,
          description: action.payload.description
        }
      };

    case LOGIN_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          login: {
            ...state.login,
            loginStatus: action.res.success,
            error: action.res.reason || 'Bad Request'
          },
          error: {
            title: 'Unable to login.',
            description: action.res.reason || 'Bad Request'
          }
        };
      }
      return {
        ...state,
        user: {
          data: action.res.data,
          status: true,
          error: null,
          userStatus: true
        },
        error: null
      };
    case LOGIN_FAILED:
      return {
        ...state,
        login: {
          ...state.login,
          error: 'Bad Request'
        },
        error: {
          title: 'Unable to login.',
          description: action.res.reason || 'Bad Request'
        }
      };

    // UPDATE USER REDUCER
    case UPDATE_USER_SUCCESS:
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
    case UPDATE_USER_FAILED:
      return {
        ...state,
        login: {
          ...state.login,
          error: 'Bad Request'
        }
      };

    // Requests for forgot password
    case FORGOT_PASSWORD_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          forgotPassword: {
            ...state.forgotPassword,
            status: false,
            error: action.res.reason
          }
        };
      }
      return {
        ...state,
        forgotPassword: {
          ...state.forgotPassword,
          status: true
        }
      };
    case FORGOT_PASSWORD_FAILED:
      return {
        ...state,
        forgotPassword: {
          ...state.forgotPassword,
          status: false,
          error: 'Bad Request'
        }
      };

    // Requests for resetting the password
    case RESET_PASSWORD_SUCCESS:
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
    case RESET_PASSWORD_FAILED:
      return {
        ...state,
        status: false,
        error: 'Bad Request'
      };

    case GET_USER_SUCCESS:
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
    case GET_USER_FAILED:
      return {
        ...state,
        user: {
          ...state.forgotPassword,
          status: false,
          error: 'Bad Request'
        }
      };
    case SIGN_UP_SUCCESS:
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
    case SIGN_UP_FAILED:
      return {
        ...state,
        signUp: {
          loginStatus: false,
          error: action.res.reason
        }
      };
    case LOG_OUT_SUCCESS:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
