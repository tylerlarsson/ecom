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
const schema = readJson('schema', 'config.schema.json');
const validate = ajv.compile(schema);

if (!validate(data)) {
  // eslint-disable-next-line no-console
  console.error('Bot configuration does not match the JSON schema');
  // eslint-disable-next-line no-console
  console.error(validate.errors);
  process.exit(401);
}

// eslint-disable-next-line no-console
console.info('starting with the env:', env);

nconf.file({ file: `${BASE_PATH}config/${env}.json` });
// eslint-disable-next-line no-console
console.info('mongo host:', nconf.get('mongo:host'));
// eslint-disable-next-line no-console
console.info('database:', nconf.get('mongo:db'));

nconf.set('mode:dev', env === 'development');
nconf.set(
  'agenda:url',
  `mongodb://${nconf.get('mongo:host')}/${nconf.get(
    'mongo:agenda-db',
  )}?retryWrites=true`,
);
nconf.set(
  'db:url',
  `mongodb://${nconf.get('mongo:host')}/${nconf.get(
    'mongo:db',
  )}?retryWrites=true`,
);

module.exports = nconf;
