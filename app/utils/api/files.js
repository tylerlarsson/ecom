import axios from 'axios';
import { API_ENDPOINT_URL } from 'constants/default';

export const getImageSignUrl = payload => {
  const data = {
    image: payload.file
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return axios
    .post(`${API_ENDPOINT_URL}/file/gcs`, data)
    .then(res => {
      console.log('signUrl res', res);
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const uploadVideo = payload => {
  const data = {
    file: payload.file
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return axios
    .post(`${API_ENDPOINT_URL}/video`, data)
    .then(res => {
      console.log('video res', res);
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};
