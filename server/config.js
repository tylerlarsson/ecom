require('dotenv').config();
const Ajv = require('ajv');
const ajv = new Ajv({ schemaId: 'auto', allErrors: true });

const ENV = 'NODE_ENV';
const nconf = require('nconf');
const { readJson, BASE_PATH } = require('./file-util');

nconf
  .argv()
  .env()
  .required([ENV]);

const env = nconf.get(ENV);

const data = readJson('config', `${env}.json`);
ajv.addSchema(readJson('schema', 'filter.schema.json'));
const schema = readJson('schema', 'config.schema.json');
const validate = ajv.compile(schema);

if (!validate(data)) {
  // eslint-disable-next-line no-console
  console.error('configuration does not match the JSON schema');
  // eslint-disable-next-line no-console
  console.error(validate.errors);
  process.exit(401);
}

// eslint-disable-next-line no-console
console.info('starting with the env:', env);

nconf.file({ file: `${BASE_PATH}config/${env}.json` });

if (nconf.get('DB_HOST')) {
  nconf.set('mongo:host', nconf.get('DB_HOST'));
}
if (nconf.get('DB_USER')) {
  nconf.set('mongo:user', nconf.get('DB_USER'));
}
if (nconf.get('DB_PASSWORD')) {
  nconf.set('mongo:password', nconf.get('DB_PASSWORD'));
}
if (nconf.get('DB_NAME')) {
  nconf.set('mongo:db', nconf.get('DB_NAME'));
}

// eslint-disable-next-line no-console
console.info('mongo host:', nconf.get('mongo:host'));
// eslint-disable-next-line no-console
console.info('database:', nconf.get('mongo:db'));

nconf.set('mode:dev', env === 'development');

let credentials = '';
if (nconf.get('mongo:user') && nconf.get('mongo:password')) {
  credentials = `${nconf.get('mongo:user')}:${nconf.get('mongo:password')}@`;
}

nconf.set(
  'db:url',
  `${nconf.get('mongo:protocol')}://${credentials}${nconf.get('mongo:host')}/${nconf.get(
    'mongo:db'
  )}?retryWrites=true&w=majority`
);

module.exports = nconf;
