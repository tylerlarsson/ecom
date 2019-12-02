const axios = require('axios');

function request({ method, url, payload, headers }) {
  const axiosOpts = {
    method,
    url,
    headers: {
      ...headers
    }
  };
  if (payload && Object.entries(payload).length !== 0) {
    axiosOpts.data = payload;
  }
  return axios(axiosOpts);
}

module.exports = request;
