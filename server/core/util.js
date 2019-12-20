const HttpStatus = require('http-status-codes/index');
const axios = require('axios');

const variableName = v => Object.keys(v)[0];

const isHash = str => /[0-9a-f]{64}/.test(str);

const error404 = (instance, prop, propName = 'id') => {
  const name = variableName(instance);
  const error = new Error(`${name.toUpperCase()} with ${propName} ${prop} is not found.`);
  error.status = HttpStatus.NOT_FOUND;
  return error;
};

function isValidJSONString(str) {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
}

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

module.exports = { error404, request, isValidJSONString, isHash };
