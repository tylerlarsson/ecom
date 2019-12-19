const HttpStatus = require('http-status-codes/index');
const axios = require('axios');

const variableName = v => Object.keys(v)[0];

const error404 = (instance, prop, propName = 'id') => {
  const name = variableName(instance);
  const error = new Error(`${name.toUpperCase()} with ${propName} ${prop} is not found.`);
  error.status = HttpStatus.NOT_FOUND;
  return error;
};

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

module.exports = { error404, request };
