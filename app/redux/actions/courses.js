import {
  GET_COURSES_REQUEST,
  CREATE_COURSES_REQUEST,
  DELETE_COURSES_REQUEST
} from 'constants/actionTypes';

export const getCourses = payload => ({
  type: GET_COURSES_REQUEST,
  payload
});

export const createCourses = payload => ({
  type: CREATE_COURSES_REQUEST,
  payload
});

export const deleteCourses = payload => ({
  type: DELETE_COURSES_REQUEST,
  payload
});
