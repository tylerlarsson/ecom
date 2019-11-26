import { GET_COURSES_REQUEST, CREATE_COURSES_REQUEST, DELETE_COURSES_REQUEST } from 'constants/actionTypes';

export const getCourses = payload => ({
  type: GET_COURSES_REQUEST,
  payload
});

export const createCourse = payload => ({
  type: CREATE_COURSES_REQUEST,
  payload
});

export const deleteCourse = payload => ({
  type: DELETE_COURSES_REQUEST,
  payload
});
