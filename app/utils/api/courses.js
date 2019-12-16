import axios from 'axios';
import { map } from 'lodash';
import { API_ENDPOINT_URL } from 'constants/default';

// Courses
export const getCourses = payload => {
  const params = payload && payload.params;
  return axios
    .get(`${API_ENDPOINT_URL}/course`, { params })
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const getCourse = payload => {
  const id = payload && payload.id;
  return axios
    .get(`${API_ENDPOINT_URL}/course/${id}`)
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const createCourses = payload => {
  const data = {
    title: payload.title,
    subtitle: payload.subtitle,
    authors: payload.authors
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return axios
    .post(`${API_ENDPOINT_URL}/course`, data)
    .then(res => {
      console.log('createCourses res', res);
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const deleteCourses = payload =>
  axios
    .delete(`${API_ENDPOINT_URL}/course/${payload.name}`)
    .then(res => {
      if (res.data) {
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const createSection = payload => {
  let data = {};
  if (payload.sections) {
    data = {
      sections: map(payload.sections, (item, index) => ({ ...item, id: item.id, index }))
    };
  } else {
    data = {
      title: payload.title,
      id: payload.id
    };
  }

  if (payload.id) {
    data.section = payload.id;
  }

  const { courseId } = payload;

  return axios
    .post(`${API_ENDPOINT_URL}/course/${courseId}/section`, data)
    .then(res => {
      console.log('createSection res', res);
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => {
      console.log('createSection error', err, err.response, err.response.data.message);
      return { success: false, reason: err.response.data.message };
    });
};

export const deleteSection = payload =>
  axios
    .delete(`${API_ENDPOINT_URL}/course/${payload.name}/section`)
    .then(res => {
      if (res.data) {
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const createLecture = payload => {
  const data = {
    title: payload.title,
    file: payload.file,
    image: payload.image,
    text: payload.text,
    allowComments: payload.allowComments,
    state: payload.state
  };

  let method = axios.post;

  if (payload.id) {
    method = axios.put;
  }

  const { courseId } = payload;
  const sectionId = payload.section;

  return method(
    `${API_ENDPOINT_URL}/course/${courseId}/section/${sectionId}/lecture${payload.id ? `/${payload.id}` : ''}`,
    data
  )
    .then(res => {
      console.log('createLecture res', res);
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => {
      console.log('createLecture err', err, err.response);
      return { success: false, reason: err.response.data.message };
    });
};
export const deleteLecture = payload =>
  axios
    .delete(`${API_ENDPOINT_URL}/course/${payload.name}/section`)
    .then(res => {
      if (res.data) {
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const getPricingPlans = payload => {
  const courseId = payload && payload.courseId;
  console.log('getPricingPlans', courseId);
  return axios
    .get(`${API_ENDPOINT_URL}/pricing-plan/${courseId}`)
    .then(res => {
      console.log('getPricingPlans res', res);
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const addPricingPlan = payload => {
  let data = {};
  if (payload.sections) {
    data = {
      sections: map(payload.sections, (item, index) => ({ ...item, id: item.id, index }))
    };
  } else {
    data = {
      price: payload.price,
      courseId: payload.courseId,
      isRecurring: payload.isRecurring,
      purchaseUrl: payload.purchaseUrl,
      title: payload.title,
      subtitle: payload.subtitle,
      description: payload.description,
      type: payload.type
    };
  }

  if (payload.id) {
    data.id = payload.id;
  }

  const { courseId } = payload;

  return axios
    .post(`${API_ENDPOINT_URL}/pricing-plan`, data)
    .then(res => {
      console.log('createSection res', res);
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => {
      console.log('createSection error', err, err.response, err.response.data.message);
      return { success: false, reason: err.response.data.message };
    });
};

export const deletePricingPlan = payload =>
  axios
    .delete(`${API_ENDPOINT_URL}/course/${payload.courseId}/${payload.id}`)
    .then(res => {
      if (res.data) {
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
