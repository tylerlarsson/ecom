import { size } from 'lodash';
import {
  GET_COURSES_SUCCESS,
  GET_COURSES_FAILED,
  GET_COURSE_SUCCESS,
  GET_COURSE_FAILED,
  GET_PRICING_PLANS_SUCCESS,
  GET_PRICING_PLANS_FAILED,
  CREATE_COURSES_SUCCESS,
  CREATE_COURSES_FAILED,
  DELETE_COURSES_SUCCESS,
  DELETE_COURSES_FAILED
} from 'constants/actionTypes';

const initialState = {
  courses: {
    data: [],
    total: 0
  },
  pricingPlans: [],
  course: null
};
let temp;
let pricingPlans;
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
    case GET_COURSE_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          course: null
        };
      }
      return {
        ...state,
        course: action.res.data && action.res.data.course
      };
    case GET_COURSE_FAILED:
      return {
        ...state,
        course: null
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
    case GET_PRICING_PLANS_SUCCESS:
      pricingPlans = action.res.data && action.res.data.plans;

      if (!action.res.success || size(pricingPlans) <= 0) {
        return {
          ...state,
          pricingPlans: []
        };
      }
      return {
        ...state,
        pricingPlans
      };
    case GET_PRICING_PLANS_FAILED:
      return {
        ...state,
        pricingPlans: []
      };
    default:
      return state;
  }
}
