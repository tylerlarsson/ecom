import { GET_SIGN_URL_SUCCESS, GET_SIGN_URL_FAILED } from 'constants/actionTypes';

const initialState = {
  signUrl: null,
  files: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    // Courses
    case GET_SIGN_URL_SUCCESS:
      console.log('GET_SIGN_URL_SUCCESS', action.res);
      if (!action.res.success) {
        return {
          ...state,
          signUrl: null
        };
      }
      return {
        ...state,
        signUrl: action.res.data && action.res.data.url
      };
    case GET_SIGN_URL_FAILED:
      return {
        ...state,
        signUrl: null
      };

    default:
      return state;
  }
}
