import {
  GET_COURSES_SUCCESS,
  GET_COURSES_FAILED,
  CREATE_COURSES_SUCCESS,
  CREATE_COURSES_FAILED,
  DELETE_COURSES_SUCCESS,
  DELETE_COURSES_FAILED,
} from 'constants/actionTypes';

const initialState = {
  courses: {
    data: [],
    total: 0
  }
};
let temp;
export default function(state = initialState, action) {
  switch (action.type) {

    // Courses
    case GET_COURSES_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          courses: []
        };
      }
      return {
        ...state,
        courses: action.res.data
      };
    case GET_COURSES_FAILED:
      return {
        ...state,
        courses: []
      };
    case CREATE_COURSES_SUCCESS:
      if (!action.res.success) {
        return {
          ...state
        };
      }
      return {
        ...state,
        courses: [...state.courses, action.res.data]
      };
    case CREATE_COURSES_FAILED:
      return {
        ...state
      };
    case DELETE_COURSES_SUCCESS:
      if (!action.res.success) {
        return {
          ...state
        };
      }
      temp = state.courses.filter(item => item.id !== action.res.id);
      return {
        ...state,
        courses: [...temp]
      };
    case DELETE_COURSES_FAILED:
      return {
        ...state
      };

    default:
      return state;
  }
}
