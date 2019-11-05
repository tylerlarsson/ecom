const db = require('../db');

const { readJson } = require('../file-util');
const { data: firstnames } = readJson('server', 'db-script', 'test-data', 'first-name.json');
const { data: lastnames } = readJson('server', 'db-script', 'test-data', 'last-name.json');

const MAX_LOGIN_COUNT = 1000;
const MIN_SIGN_IN_DATE = new Date('2019-01-01');
const MAX_SIGN_IN_DATE = new Date('2019-11-01');

const MIN_LAST_LOGIN_DATE = new Date('2019-10-01');
const MAX_LAST_LOGIN_DATE = new Date('2019-11-01');

const TEST_USER_ROLE = 'test-user';
const USER_COUNT = 10;

function randInt(max) {
  return Math.floor(Math.random() * max);
}

function* DateGenerator(min, max) {
  const from = min.getTime();
  const to = max.getTime();
  const delta = from - to;
  while (true) {
    const t = from + randInt(delta);
    yield new Date(t);
  }
}

function* UserGenerator() {
  const signInDateGenerator = DateGenerator(MIN_SIGN_IN_DATE, MAX_SIGN_IN_DATE);
  const lastLoginDateGenerator = DateGenerator(MIN_LAST_LOGIN_DATE, MAX_LAST_LOGIN_DATE);

  const a1 = Array.from(firstnames);
  const a2 = Array.from(lastnames);

  while (a1.length && a2.length) {
    const i1 = randInt(a1.length);
    const i2 = randInt(a2.length);
    const firstname = a1[i1].toLowerCase();
    const lastname = a2[i2].toLowerCase();
    a1.splice(i1, 1);
    a2.splice(i2, 1);
    const email = `${firstname}.${lastname}@gmail.com`;
    const password = 'password';
    const loginCount = randInt(MAX_LOGIN_COUNT);
    const loginLast = lastLoginDateGenerator.next().value;
    const created = signInDateGenerator.next().value;
    const roles = ['user', TEST_USER_ROLE];
    yield {
      username: '',
      email,
      password,
      loginCount,
      loginLast,
      created,
      roles
    };
  }
}

const userGenerator = UserGenerator();

(async function f() {
  try {
    await db.model.Role.createIfNotExists(TEST_USER_ROLE);

    for (let i = 0; i < USER_COUNT; ++i) {
      const data = userGenerator.next().value;
      // eslint-disable-next-line no-await-in-loop
      data.roles = await db.model.Role.mapToId(data.roles);
      // eslint-disable-next-line no-await-in-loop
      const user = await db.model.User.create(data);
      // eslint-disable-next-line no-console
      console.log('user', user.username, 'created');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
