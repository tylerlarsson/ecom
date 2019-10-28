const Ajv = require('ajv');
const { readJson } = require('./file-util');

const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
ajv.addSchema(readJson('schema', 'role.schema.json'));
const newUserSchema = readJson('schema', 'new-user.schema.json');
const newUser = ajv.compile(newUserSchema);

module.exports = {
  newUser
};
