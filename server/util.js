const HttpStatus = require('http-status-codes');

const variableName = v => Object.keys(v)[0];

const error404 = (instance, prop, propName = 'id') => {
  const name = variableName(instance);
  const error = new Error(`${name.toUpperCase()} with ${propName} ${prop} is not found.`);
  error.status = HttpStatus.NOT_FOUND;
  return error;
};

module.exports = { error404 };
